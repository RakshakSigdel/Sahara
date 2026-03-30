# Bhul Rakshak — AI-Powered Dementia Screening

Bhul Rakshak is a voice-based dementia screening platform for clinical use. Doctors record short patient voice sessions, which are analyzed by a fine-tuned Wav2Vec audio classifier, then synthesized into a structured risk report by Google Gemini.

---

## Architecture

```
┌─────────────────────────────────┐      HTTP      ┌───────────────────────────────┐
│  Web (React + Vite, port 5173)  │ ────────────►  │  Dementia API (FastAPI, :8000) │
│  Firebase Auth + Firestore      │                 │  Wav2Vec + Gemini 2.5 Flash    │
└─────────────────────────────────┘                 └───────────────────────────────┘
```

| Layer     | Technology                                                                   |
| --------- | ---------------------------------------------------------------------------- |
| Frontend  | React 19, Vite 8, Tailwind CSS 4, Framer Motion                              |
| Backend   | FastAPI, Uvicorn, Python 3.11+                                               |
| Audio AI  | `Mrsmetamorphosis/dementia-wav2vec-scientific-specaugment-V2` (Hugging Face) |
| Report AI | Google Gemini 2.5 Flash                                                      |
| Auth / DB | Firebase Auth, Firestore                                                     |

---

## Prerequisites

- **Python 3.11+**
- **Node.js 18+** and **npm**
- A **Google Gemini API key** — [get one here](https://aistudio.google.com/app/apikey)
- A **Firebase project** with Auth and Firestore enabled

---

## Quick Start

> For a fully automated setup on Windows, run `.\setup.ps1` from the repo root.

### 1 — Clone the repository

```bash
git clone <repo-url>
cd BhulRakshak
```

### 2 — Backend setup

```bash
cd Dementia_API

# Create and activate virtual environment
python -m venv myvenv
.\myvenv\Scripts\activate        # Windows
# source myvenv/bin/activate     # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env           # Windows
# cp .env.example .env           # macOS / Linux
# Edit .env and set API_KEY=<your-gemini-api-key>

# Start the API server
python main.py
# Server runs at http://localhost:8000
```

### 3 — Frontend setup

```bash
cd web

# Install dependencies
npm install

# Configure environment
copy .env.example .env.local     # Windows
# cp .env.example .env.local     # macOS / Linux
# Edit .env.local if your backend runs on a different host/port

# Start the dev server
npm run dev
# App runs at http://localhost:5173
```

---

## Environment Variables

### `Dementia_API/.env`

| Variable  | Required | Description           |
| --------- | -------- | --------------------- |
| `API_KEY` | ✅       | Google Gemini API key |

### `web/.env.local`

| Variable               | Required | Default                 | Description           |
| ---------------------- | -------- | ----------------------- | --------------------- |
| `VITE_AI_API_BASE_URL` | No       | `http://localhost:8000` | Dementia API base URL |

---

## API Reference

### `POST /predict`

Classifies a WAV audio file for dementia indicators.

**Request** — `multipart/form-data`

| Field  | Type        | Description                                  |
| ------ | ----------- | -------------------------------------------- |
| `file` | `.wav` file | Patient voice recording (16 kHz recommended) |

**Response**

```json
{
  "filename": "recording.wav",
  "has_dementia": true,
  "confidence_percentage": "91.45%",
  "confidence_score": 0.9145,
  "detailed_analysis": [
    { "label": "dementia", "score": 0.9145 },
    { "label": "nodementia", "score": 0.0855 }
  ]
}
```

---

### `POST /report`

Generates a structured clinical risk report from audio results and Q&A responses using Gemini.

**Request** — `application/json`

```json
{
  "audio_results": [{ "has_dementia": true, "confidence_score": 0.91 }],
  "qa_responses": [
    {
      "question": "What did you have for breakfast?",
      "answer": "I don't remember."
    }
  ]
}
```

**Response**

```json
{
  "audio_score": 0.91,
  "report": {
    "risk_level": "High",
    "audio_analysis": "...",
    "behavioral_analysis": "...",
    "combined_interpretation": "...",
    "recommendation": "..."
  }
}
```

---

## Project Structure

```
BhulRakshak/
├── Dementia_API/
│   ├── main.py              # FastAPI app — /predict + /report endpoints
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variable template
└── web/
		├── src/
		│   ├── contexts/        # React context providers (Session, Doctor, Theme)
		│   ├── pages/           # Route-level page components
		│   ├── services/        # Firebase + AI API service layers
		│   ├── components/      # Shared UI and layout components
		│   └── hooks/           # Custom React hooks
		├── .env.example         # Environment variable template
		└── package.json
```

---

## Frontend Build (Production)

```bash
cd web
npm run build
# Output in web/dist/
```

---

## Notes

- The AI model is downloaded from Hugging Face on first run (~400 MB). Subsequent starts use the local cache.
- The `/report` endpoint retries up to 3 times with exponential backoff on Gemini 503 / rate-limit errors.
- Firebase config is hard-coded for the hackathon build. For production, move all Firebase values to environment variables.

---

## License

MIT
