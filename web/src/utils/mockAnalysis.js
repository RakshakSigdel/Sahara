/* ═══════════════════════════════════════════
   Mock Analysis — Simulates AI voice analysis
   ═══════════════════════════════════════════ */

function randomBetween(min, max) {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMockTranscript(questionText) {
  const responses = {
    breakfast: "I had... um... toast with butter and a cup of tea. No wait, I think I also had some eggs. Yes, eggs and toast.",
    remember: "Apple... Table... and... Penny. Yes, Apple, Table, Penny.",
    yesterday: "Yesterday I woke up around 7. I had breakfast and then watched some news on TV. In the afternoon I went for a short walk. In the evening my daughter visited.",
    counting: "20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1.",
    grocery: "Apples, milk, bread, rice, and... oh... tomatoes. Yes, those five.",
    family: "I live with my wife. She is 72. And our grandson stays sometimes, he is 8 years old.",
    story: "It was raining one day and a little boy found a puppy... the puppy was wet and cold. He brought it home, and his mother let him keep it.",
    default: "Let me think for a moment... I would say that in my experience the answer relates to how we process information. It's interesting because there are many ways to think about it.",
  };

  const key = questionText.toLowerCase().includes('breakfast') ? 'breakfast'
    : questionText.toLowerCase().includes('repeat') ? 'remember'
    : questionText.toLowerCase().includes('yesterday') ? 'yesterday'
    : questionText.toLowerCase().includes('count') ? 'counting'
    : questionText.toLowerCase().includes('grocery') || questionText.toLowerCase().includes('five items') ? 'grocery'
    : questionText.toLowerCase().includes('family') ? 'family'
    : questionText.toLowerCase().includes('story') ? 'story'
    : 'default';

  return responses[key] || responses.default;
}

/**
 * Analyze a single recording
 * @param {Blob|null} audioBlob - The recorded audio (unused in mock)
 * @param {string} questionText - The question being analyzed
 * @returns {Promise<object>} Analysis results
 */
export async function analyzeRecording(audioBlob, questionText) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1500));

  return {
    speechRate: Math.round(randomBetween(110, 160)),
    pauseDuration: randomBetween(1.0, 4.0),
    fillerWords: Math.round(randomBetween(2, 15)),
    fillerWordRatio: `${Math.round(randomBetween(3, 12))}%`,
    coherenceScore: Math.round(randomBetween(60, 98)),
    sentiment: randomChoice(['positive', 'neutral', 'negative']),
    confidence: randomBetween(0.80, 0.98),
    transcript: generateMockTranscript(questionText),
    wordCount: Math.round(randomBetween(20, 80)),
    uniqueWords: Math.round(randomBetween(15, 60)),
    lexicalDiversity: randomBetween(0.60, 0.95),
    responseLagMs: Math.round(randomBetween(500, 3000)),
  };
}

/**
 * Calculate risk score from aggregated analyses
 */
function calculateRiskScore(analyses) {
  if (!analyses.length) return 50;

  const avgCoherence = analyses.reduce((a, x) => a + (x.coherenceScore || 70), 0) / analyses.length;
  const avgPause = analyses.reduce((a, x) => a + (x.pauseDuration || 2), 0) / analyses.length;
  const avgSpeechRate = analyses.reduce((a, x) => a + (x.speechRate || 130), 0) / analyses.length;
  const avgLexical = analyses.reduce((a, x) => a + (x.lexicalDiversity || 0.75), 0) / analyses.length;

  // Lower coherence → higher risk
  let score = (100 - avgCoherence) * 0.4;
  // Higher pauses → higher risk
  score += Math.min(avgPause * 8, 25);
  // Very low or very high speech rate → higher risk
  if (avgSpeechRate < 100 || avgSpeechRate > 170) score += 10;
  // Low lexical diversity → higher risk
  score += (1 - avgLexical) * 20;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function getRiskClassification(score) {
  if (score <= 30) return 'healthy';
  if (score <= 60) return 'mild-concern';
  return 'high-risk';
}

function extractVoiceMarkers(analyses) {
  const avg = (key) => analyses.length ? Math.round(analyses.reduce((a, x) => a + (x[key] || 0), 0) / analyses.length) : 0;
  const avgDec = (key) => analyses.length ? (analyses.reduce((a, x) => a + (x[key] || 0), 0) / analyses.length).toFixed(1) : '0';
  const score = calculateRiskScore(analyses);

  return [
    { name: 'Speech Rate', value: `${avg('speechRate')} wpm`, status: avg('speechRate') >= 100 && avg('speechRate') <= 160 ? 'Normal' : 'Atypical', reference: '110–150 wpm' },
    { name: 'Avg Pause Duration', value: `${avgDec('pauseDuration')}s`, status: parseFloat(avgDec('pauseDuration')) <= 2.5 ? 'Normal' : 'Elevated', reference: '<2.5s' },
    { name: 'Filler Word Ratio', value: `${avg('fillerWords')}%`, status: avg('fillerWords') <= 10 ? 'Normal' : 'Elevated', reference: '<10%' },
    { name: 'Semantic Coherence', value: `${avg('coherenceScore')}/100`, status: avg('coherenceScore') >= 70 ? 'Normal' : 'Low', reference: '>70' },
    { name: 'Response Latency', value: `${(avg('responseLagMs') / 1000).toFixed(1)}s`, status: avg('responseLagMs') <= 2000 ? 'Normal' : 'Delayed', reference: '<2s' },
    { name: 'Lexical Diversity', value: `${avgDec('lexicalDiversity')}`, status: parseFloat(avgDec('lexicalDiversity')) >= 0.7 ? 'Normal' : 'Low', reference: '>0.7' },
    { name: 'Verbal Fluency', value: `${Math.round(avg('wordCount') / (parseFloat(avgDec('pauseDuration')) || 1))} w/min`, status: score <= 50 ? 'Normal' : 'Below Average', reference: '>12 w/min' },
  ];
}

function generateRecommendations(score) {
  if (score <= 30) {
    return [
      'Normal cognitive function — continue annual screening',
      'Maintain brain-healthy lifestyle (exercise, social engagement, cognitive activities)',
      'No immediate clinical intervention needed',
      'Schedule next routine screening in 12 months',
    ];
  }
  if (score <= 60) {
    return [
      'Mild cognitive concern detected — recommend comprehensive neuropsychological evaluation',
      'Consider referral to neurologist or geriatrician',
      'Schedule follow-up screening in 3–6 months to monitor progression',
      'Discuss modifiable risk factors (cardiovascular health, sleep, diet)',
      'Evaluate for depression and anxiety which can mimic cognitive decline',
      'Recommend cognitive engagement activities',
    ];
  }
  return [
    'Significant cognitive concerns — urgent referral to neurology/geriatric psychiatry',
    'Comprehensive diagnostic workup recommended (blood work, brain imaging)',
    'MRI scan suggested to rule out structural causes',
    'Evaluate for reversible causes of cognitive decline (medication effects, metabolic)',
    'Family/caregiver counseling recommended',
    'Consider formal capacity assessment if clinically indicated',
    'Develop ongoing monitoring and care coordination plan',
  ];
}

/**
 * Generate overall session report from all question analyses
 * @param {Array} sessionAnalyses - Array of per-question analysis objects
 * @returns {Promise<object>} Complete session report
 */
export async function generateOverallReport(sessionAnalyses) {
  await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));

  const riskScore = calculateRiskScore(sessionAnalyses);

  return {
    riskScore,
    classification: getRiskClassification(riskScore),
    confidence: randomBetween(0.85, 0.98),
    voiceMarkers: extractVoiceMarkers(sessionAnalyses),
    recommendations: generateRecommendations(riskScore),
    domainScores: {
      memory: Math.round(randomBetween(50, 95)),
      language: Math.round(randomBetween(55, 95)),
      cognition: Math.round(randomBetween(45, 95)),
      orientation: Math.round(randomBetween(60, 100)),
    },
    generatedAt: new Date().toISOString(),
  };
}
