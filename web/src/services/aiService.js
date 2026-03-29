const API_BASE_URL = "http://0.0.0.0:8000";

function splitRecommendations(recommendationText) {
  if (!recommendationText || typeof recommendationText !== "string") return [];
  return recommendationText
    .split(/\n|\.|;|•|-/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 7);
}

function inferRiskScore(riskLevel, audioScore) {
  const normalizedLevel = (riskLevel || "").toLowerCase();
  let base = 45;

  if (normalizedLevel.includes("low")) base = 22;
  if (normalizedLevel.includes("moderate")) base = 56;
  if (normalizedLevel.includes("high")) base = 82;

  if (typeof audioScore === "number" && Number.isFinite(audioScore)) {
    const adjusted = Math.round(
      base * 0.7 + Math.max(0, Math.min(100, audioScore * 100)) * 0.3,
    );
    return Math.max(0, Math.min(100, adjusted));
  }

  return base;
}

function classifyRisk(score) {
  if (score <= 30) return "healthy";
  if (score <= 60) return "mild-concern";
  return "high-risk";
}

function statusFromDementiaPrediction(hasDementia) {
  return hasDementia ? "Elevated" : "Normal";
}

function confidenceLabel(value) {
  if (!Number.isFinite(value)) return "N/A";
  return `${Math.round(value * 100)}%`;
}

export async function analyzeAudioBlob(audioBlob, filename = "recording.webm") {
  const formData = new FormData();
  formData.append("file", audioBlob, filename);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Audio analysis failed (${response.status})`);
  }

  const payload = await response.json();

  if (payload?.error) {
    throw new Error(payload.error);
  }

  return {
    hasDementia: !!payload.has_dementia,
    confidenceScore: Number(payload.confidence_score) || 0,
    confidencePercentage:
      payload.confidence_percentage ||
      confidenceLabel(Number(payload.confidence_score) || 0),
    detailedAnalysis: Array.isArray(payload.detailed_analysis)
      ? payload.detailed_analysis
      : [],
    filename: payload.filename || filename,
  };
}

export async function generateAiReport(audioResults, qaResponses) {
  const response = await fetch(`${API_BASE_URL}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audio_results: audioResults,
      qa_responses: qaResponses,
    }),
  });

  if (!response.ok) {
    throw new Error(`Report generation failed (${response.status})`);
  }

  const payload = await response.json();

  if (payload?.error) {
    throw new Error(payload.error);
  }

  const report = payload?.report || {};
  const audioScore = Number(payload?.audio_score);
  const riskScore = inferRiskScore(report.risk_level, audioScore);

  return {
    riskScore,
    classification: classifyRisk(riskScore),
    confidence: Number.isFinite(audioScore)
      ? Math.max(0, Math.min(1, audioScore))
      : 0.85,
    voiceMarkers: [
      {
        name: "Dementia Signal Confidence",
        value: confidenceLabel(Number.isFinite(audioScore) ? audioScore : 0),
        status: statusFromDementiaPrediction(riskScore > 60),
        reference: "Lower is better",
      },
    ],
    recommendations: splitRecommendations(report.recommendation),
    aiInsights: {
      riskLevel: report.risk_level || "Moderate",
      audioAnalysis: report.audio_analysis || "",
      behavioralAnalysis: report.behavioral_analysis || "",
      combinedInterpretation: report.combined_interpretation || "",
      recommendation: report.recommendation || "",
    },
    generatedAt: new Date().toISOString(),
  };
}
