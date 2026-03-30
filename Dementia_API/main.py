import os
import json
import time
import librosa
import torch
from dotenv import load_dotenv
from typing import List
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from transformers import AutoModelForAudioClassification, AutoFeatureExtractor, pipeline
from google import genai

# -----------------------
# Load environment
# -----------------------

load_dotenv()
API_KEY = os.getenv("API_KEY")

if not API_KEY:
    raise Exception("API_KEY environment variable is missing")


# -----------------------
# Initialize FastAPI
# -----------------------

app = FastAPI(title="Dementia Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"],
)


# -----------------------
# Load AI Audio Model
# -----------------------

model_id = "Mrsmetamorphosis/dementia-wav2vec-scientific-specaugment-V2"

print("Loading AI Model and Feature Extractor...")

feature_extractor = AutoFeatureExtractor.from_pretrained(
    "facebook/wav2vec2-base-960h"
)

model = AutoModelForAudioClassification.from_pretrained(model_id)

classifier = pipeline(
    "audio-classification",
    model=model,
    feature_extractor=feature_extractor
)

print("Model loaded successfully")


# -----------------------
# /predict endpoint
# -----------------------

@app.post("/predict")
async def predict_dementia(file: UploadFile = File(...)):

    temp_file_path = f"temp_{file.filename}"

    with open(temp_file_path, "wb") as buffer:
        audio_data = await file.read()
        buffer.write(audio_data)

    try:

        audio_array, sampling_rate = librosa.load(temp_file_path, sr=16000)

        predictions = classifier(audio_array)

        top_prediction = predictions[0]

        label = top_prediction["label"].lower()

        has_dementia = "dementia" in label and "no" not in label

        confidence_score = float(top_prediction["score"])

        confidence_percent = f"{confidence_score * 100:.2f}%"

        return {
            "filename": file.filename,
            "has_dementia": has_dementia,
            "confidence_percentage": confidence_percent,
            "confidence_score": confidence_score,
            "detailed_analysis": predictions
        }

    except Exception as e:

        return {"error": str(e)}

    finally:

        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


# -----------------------
# Request Models for /report
# -----------------------

class AudioResult(BaseModel):
    question: str
    has_dementia: bool
    confidence_score: float


class QAResponse(BaseModel):
    question: str
    answer: str


class ReportRequest(BaseModel):
    audio_results: List[AudioResult]
    qa_responses: List[QAResponse]


# -----------------------
# Helper: Compute audio stability score
# -----------------------

def compute_audio_score(audio_results):

    scores = [item.confidence_score for item in audio_results]

    if len(scores) == 0:
        return 0

    return sum(scores) / len(scores)


def generate_content_with_retry(client, model, prompt, max_attempts=3, initial_delay=1.0):

    delay = initial_delay
    last_error = None

    for attempt in range(max_attempts):
        try:
            return client.models.generate_content(
                model=model,
                contents=prompt
            )
        except Exception as e:
            last_error = e
            message = str(e)
            is_transient = (
                "503" in message
                or "UNAVAILABLE" in message.upper()
                or "RESOURCE_EXHAUSTED" in message.upper()
            )

            if not is_transient or attempt == max_attempts - 1:
                raise

            time.sleep(delay)
            delay *= 2

    raise last_error


# -----------------------
# /report endpoint
# -----------------------

@app.post("/report")
async def generate_report(data: ReportRequest):

    try:

        audio_score = compute_audio_score(data.audio_results)

        client = genai.Client(api_key=API_KEY)

        prompt = f"""
You are a medical screening assistant for early dementia risk detection.

INPUT DATA

Audio model predictions:
{data.audio_results}

Average audio dementia score:
{audio_score}

Behavioral responses:
{data.qa_responses}

TASK

Analyze the audio predictions and behavioral responses.

Produce a dementia screening report.

RULES
- Output ONLY valid JSON
- No explanation text
- No markdown
- Follow EXACT schema below

JSON FORMAT

{{
"risk_level": "Low | Moderate | High",
"audio_analysis": "short explanation",
"behavioral_analysis": "short explanation",
"combined_interpretation": "overall reasoning",
"recommendation": "medical suggestion"
}}
"""

        response = generate_content_with_retry(
            client=client,
            model="gemini-2.5-flash",
            prompt=prompt,
            max_attempts=3,
            initial_delay=1.0,
        )

        report_text = response.text

        report_json = json.loads(report_text)

        return {
            "audio_score": audio_score,
            "report": report_json
        }

    except json.JSONDecodeError:

        return {
            "error": "Gemini returned invalid JSON",
            "raw_output": report_text
        }

    except Exception as e:

        return {"error": str(e)}


# -----------------------
# Run server
# -----------------------

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )