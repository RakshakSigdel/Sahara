import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, AlertTriangle, Info, ArrowRight, Download, Share2,
  Calendar, Brain, Activity, Clock, Mic, TrendingDown, Shield,
  ChevronDown, ChevronRight, BookOpen, Zap, Pause as PauseIcon,
  MessageSquare, BarChart3, FileText,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } },
};

/* ── Mock data ── */
const result = {
  score: 28,
  date: 'March 28, 2026',
  time: '2:45 PM',
  testType: 'Story Recall',
  duration: '2m 34s',
  totalWords: 287,
  uniqueWords: 145,
  avgSpeechRate: 145,
  longestPause: 2.8,
  fillerRatio: 8,
  coherenceScore: 87,
};

function getRisk(score) {
  if (score <= 30) return {
    level: 'Healthy', color: 'success', icon: <CheckCircle size={24} />,
    heading: 'Healthy Cognitive Function',
    explanation: 'Your voice patterns show healthy cognitive function. Continue monitoring your brain health with regular screenings.',
    insights: [
      { title: 'Keep Up the Good Work', body: 'Your cognitive markers are within healthy ranges. Consistency in testing helps us build a reliable baseline for your brain health.' },
      { title: 'Regular Monitoring', body: 'We recommend testing monthly to track any subtle changes over time. Early detection is the most powerful tool.' },
      { title: 'Lifestyle Factors', body: 'Stay active, sleep well, maintain social connections, and challenge your brain with new activities.' },
    ],
  };
  if (score <= 60) return {
    level: 'Mild Concerns', color: 'warning', icon: <AlertTriangle size={24} />,
    heading: 'Mild Concerns Detected',
    explanation: 'Some indicators suggest mild cognitive changes. This may be normal aging, but we recommend consulting with a healthcare provider.',
    insights: [
      { title: 'What These Changes Mean', body: 'Mild changes in speech patterns can be caused by stress, fatigue, or medication. They don\'t necessarily indicate cognitive decline.' },
      { title: 'Next Steps', body: 'Share these results with your healthcare provider. A comprehensive clinical evaluation can provide more context.' },
      { title: 'Lifestyle Modifications', body: 'Prioritize quality sleep, regular exercise, social engagement, and cognitive exercises.' },
    ],
  };
  return {
    level: 'Further Evaluation', color: 'error', icon: <Info size={24} />,
    heading: 'Further Evaluation Recommended',
    explanation: 'Several voice markers suggest cognitive changes that warrant professional evaluation. Please schedule an appointment with a healthcare professional.',
    insights: [
      { title: 'Urgent Next Steps', body: 'Schedule an appointment with your primary care physician or a neurologist for a comprehensive cognitive assessment.' },
      { title: 'Finding a Specialist', body: 'Your doctor can refer you to a neurologist or memory care specialist for detailed evaluation.' },
      { title: 'Support Resources', body: 'The Alzheimer\'s Association (1-800-272-3900) provides free support and guidance for individuals and caregivers.' },
    ],
  };
}

const markers = [
  { icon: <Zap size={16} />, name: 'Speech Rate', value: '145 wpm', ref: '110–150', status: 'Normal', color: 'success' },
  { icon: <PauseIcon size={16} />, name: 'Pause Duration', value: '2.8s avg', ref: '<3.0s', status: 'Slightly Elevated', color: 'warning' },
  { icon: <Brain size={16} />, name: 'Word Finding', value: '3 hesitations', ref: '<5', status: 'Normal', color: 'success' },
  { icon: <MessageSquare size={16} />, name: 'Filler Words', value: '8%', ref: '<12%', status: 'Normal', color: 'success' },
  { icon: <BarChart3 size={16} />, name: 'Semantic Coherence', value: '87/100', ref: '>70', status: 'Good', color: 'success' },
];

/* ── Risk ring ── */
function RiskRing({ score, color }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const fillColor = { success: '#10B981', warning: '#F59E0B', error: '#EF4444' }[color];

  return (
    <div className="relative w-[180px] h-[180px]">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#E2E8E5" strokeWidth="8" />
        <motion.circle
          cx="80" cy="80" r={radius} fill="none" stroke={fillColor} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-extrabold text-navy-dark" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{score}</span>
        <span className="text-xs text-text-muted">/100</span>
      </div>
    </div>
  );
}

/* ── Accordion ── */
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border/60 rounded-lg overflow-hidden bg-surface">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-muted/30 transition-colors">
        <span className="text-sm font-semibold text-text-primary">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-text-muted" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════
   RESULTS PAGE
   ═══════════════════════════════════════════ */
export default function ResultsPage() {
  const navigate = useNavigate();
  const risk = getRisk(result.score);
  const statusColors = { success: 'bg-success/10 text-success border-success/20', warning: 'bg-warning/10 text-warning border-warning/20', error: 'bg-error/10 text-error border-error/20' };

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-[960px] px-6 lg:px-10 py-8 lg:py-12">
        <motion.div variants={stagger.container} initial="hidden" animate="visible">

          {/* ── HEADER ── */}
          <motion.div variants={stagger.item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-text-muted">{result.date} • {result.time}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-deep-teal/8 text-deep-teal border border-deep-teal/15">
                  {result.testType}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-navy-dark tracking-tight">Screening Results</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" leftIcon={<Share2 size={14} />}>Share</Button>
              <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>Export PDF</Button>
            </div>
          </motion.div>

          {/* ── HERO: Risk Score + Interpretation ── */}
          <motion.div variants={stagger.item} className="mb-6">
            <div className={cn('rounded-xl border-2 p-6 md:p-8', statusColors[risk.color])}>
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex flex-col items-center shrink-0">
                  <RiskRing score={result.score} color={risk.color} />
                  <span className={cn('mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border', statusColors[risk.color])}>
                    <TrendingDown size={14} /> {risk.level}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-${risk.color}`}>{risk.icon}</span>
                    <h2 className="text-xl md:text-2xl font-bold text-navy-dark">{risk.heading}</h2>
                  </div>
                  <p className="text-text-secondary leading-relaxed mb-4">{risk.explanation}</p>
                  <Accordion title="What does this score mean?" defaultOpen={false}>
                    A score of {result.score}/100 indicates where your voice patterns fall on our cognitive assessment scale.
                    Lower scores suggest healthier cognitive function. This score is based on analysis of speech rate, pauses,
                    word-finding ability, semantic coherence, and other vocal biomarkers. It is not a diagnosis.
                  </Accordion>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── VOICE MARKERS ── */}
          <motion.div variants={stagger.item} className="mb-6">
            <div className="bg-surface rounded-xl border border-border/60 shadow-card p-6 md:p-8">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-lg bg-deep-teal/10 flex items-center justify-center"><Activity size={18} className="text-deep-teal" /></div>
                <h3 className="text-base font-bold text-navy-dark">Voice Biomarker Analysis</h3>
              </div>

              <div className="space-y-4">
                {markers.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-text-muted shrink-0">{m.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary">{m.name}</p>
                      <p className="text-xs text-text-muted">Normal range: {m.ref}</p>
                    </div>
                    <span className="text-sm font-bold text-navy-dark whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</span>
                    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap', statusColors[m.color])}>
                      {m.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── PERSONALIZED INSIGHTS ── */}
          <motion.div variants={stagger.item} className="mb-6">
            <div className="bg-surface rounded-xl border border-border/60 shadow-card p-6 md:p-8">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-lg bg-sage/15 flex items-center justify-center"><BookOpen size={18} className="text-sage-dark" /></div>
                <h3 className="text-base font-bold text-navy-dark">Personalized Insights</h3>
              </div>
              <div className="space-y-3">
                {risk.insights.map((ins, i) => (
                  <Accordion key={i} title={ins.title} defaultOpen={i === 0}>{ins.body}</Accordion>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── DETAILED METRICS ── */}
          <motion.div variants={stagger.item} className="mb-6">
            <Accordion title="Detailed Test Metrics" defaultOpen={false}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { label: 'Duration', value: result.duration, icon: <Clock size={14} /> },
                  { label: 'Total Words', value: result.totalWords, icon: <MessageSquare size={14} /> },
                  { label: 'Unique Words', value: result.uniqueWords, icon: <FileText size={14} /> },
                  { label: 'Speech Rate', value: `${result.avgSpeechRate} wpm`, icon: <Zap size={14} /> },
                  { label: 'Longest Pause', value: `${result.longestPause}s`, icon: <PauseIcon size={14} /> },
                  { label: 'Filler Words', value: `${result.fillerRatio}%`, icon: <MessageSquare size={14} /> },
                  { label: 'Coherence', value: `${result.coherenceScore}/100`, icon: <Brain size={14} /> },
                  { label: 'Test Type', value: result.testType, icon: <Mic size={14} /> },
                ].map((m, i) => (
                  <div key={i} className="bg-muted/40 rounded-lg p-3 flex items-center gap-2.5">
                    <span className="text-text-muted">{m.icon}</span>
                    <div>
                      <p className="text-[11px] text-text-muted font-medium">{m.label}</p>
                      <p className="text-sm font-bold text-navy-dark">{m.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Accordion>
          </motion.div>

          {/* ── DISCLAIMER ── */}
          <motion.div variants={stagger.item} className="mb-6">
            <div className="rounded-xl border border-warning/25 bg-warning/5 p-5 flex items-start gap-3">
              <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary leading-relaxed">
                <b>Important:</b> EchoMind is a screening tool only, not a medical diagnosis. These results should be discussed
                with a qualified healthcare professional. Do not make medical decisions based solely on this screening.
              </p>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* ── STICKY FOOTER ── */}
      <div className="fixed bottom-0 inset-x-0 bg-surface/90 backdrop-blur-md border-t border-border/50 z-30">
        <div className="mx-auto max-w-[960px] px-6 py-3 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => navigate('/dashboard')} rightIcon={<ArrowRight size={16} />}>Save &amp; Go to Dashboard</Button>
          <Button variant="outline" leftIcon={<Download size={14} />}>Export PDF</Button>
          <Button variant="outline" leftIcon={<Mic size={14} />} onClick={() => navigate('/screen/select')}>New Test</Button>
          <Button variant="ghost" leftIcon={<Calendar size={14} />}>Book Appointment</Button>
        </div>
      </div>
    </div>
  );
}
