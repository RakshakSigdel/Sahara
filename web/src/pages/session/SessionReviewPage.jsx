import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, Check, AlertCircle, Download, ChevronDown, Flag, MessageSquare, Clock, Activity, Mic } from 'lucide-react';
import { useDoctor } from '../../contexts/DoctorContext';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const stagger = { container: { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }, item: { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } } };

export default function SessionReviewPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { patients, sessions } = useDoctor();
  const [expanded, setExpanded] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [generateModal, setGenerateModal] = useState(false);

  const session = sessions.find((s) => s.id === sessionId);
  const patient = patients.find((p) => p.id === session?.patientId);
  const questions = session?.questions || [];

  const totalDuration = session?.totalDuration || questions.reduce((a, q) => a + (q.recordingDuration || 0), 0);
  const avgResponseTime = questions.length ? Math.round(totalDuration / questions.length) : 0;
  const allComplete = questions.every((q) => q.status === 'completed' || q.analysis);

  const handleGenerate = () => { setGenerateModal(false); navigate(`/session/report/${sessionId}`); };

  if (!session) return <div className="p-8 text-center"><p className="text-text-muted">Session not found.</p><Button variant="outline" onClick={() => navigate('/dashboard')} className="mt-4">Dashboard</Button></div>;

  return (
    <motion.div variants={stagger.container} initial="hidden" animate="visible" className="p-5 lg:p-7 space-y-6">
      {/* Header */}
      <motion.div variants={stagger.item}>
        <button onClick={() => navigate(`/patients/${session.patientId}`)} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-4 cursor-pointer"><ArrowLeft size={16} /> Back to Patient</button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-dark">Session Review</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-6 h-6 rounded-full bg-deep-teal/10 flex items-center justify-center text-deep-teal text-[9px] font-bold">{patient?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
              <span className="text-sm text-text-secondary">{patient?.fullName}</span>
              <span className="text-xs text-text-muted">• {new Date(session.sessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-warning/10 text-warning"><Clock size={12} /> Pending Report</span>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div variants={stagger.item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Duration', value: `${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s`, icon: <Clock size={16} /> },
          { label: 'Questions', value: `${questions.length}/${questions.length}`, icon: <Check size={16} className="text-success" /> },
          { label: 'Avg Response', value: `${avgResponseTime}s`, icon: <Activity size={16} /> },
          { label: 'Ready', value: allComplete ? 'Yes' : 'No', icon: allComplete ? <Check size={16} className="text-success" /> : <AlertCircle size={16} className="text-warning" /> },
        ].map((s) => (
          <div key={s.label} className="bg-surface rounded-xl border border-border/60 shadow-card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center text-deep-teal shrink-0">{s.icon}</div>
            <div><p className="text-lg font-bold text-navy-dark">{s.value}</p><p className="text-[10px] text-text-muted">{s.label}</p></div>
          </div>
        ))}
      </motion.div>

      {/* Questions Accordion */}
      <div className="space-y-3">
        {questions.map((q, i) => {
          const isExpanded = expanded === i;
          const analysis = q.analysis || { speechRate: 130 + Math.floor(Math.random() * 30), pauseDuration: +(1 + Math.random() * 2.5).toFixed(1), fillerWords: Math.floor(Math.random() * 6) + '%', coherence: ['Good', 'Fair', 'Excellent'][Math.floor(Math.random() * 3)], confidence: (85 + Math.floor(Math.random() * 14)) + '%' };
          return (
            <motion.div key={i} variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card overflow-hidden">
              <button onClick={() => setExpanded(isExpanded ? null : i)} className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success text-xs font-bold"><Check size={14} /></div>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-semibold text-text-primary">Question #{i + 1}</p>
                    <p className="text-xs text-text-muted truncate max-w-[300px]">{q.questionText}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">{q.recordingDuration || Math.floor(20 + Math.random() * 40)}s</span>
                  <ChevronDown size={16} className={cn('text-text-muted transition-transform', isExpanded && 'rotate-180')} />
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border/40 pt-4 space-y-4">
                  <p className="text-sm text-text-primary font-medium">{q.questionText}</p>
                  {/* Audio player mock */}
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <button onClick={() => setPlaying(playing === i ? null : i)} className="w-10 h-10 rounded-full bg-deep-teal/10 flex items-center justify-center text-deep-teal cursor-pointer hover:bg-deep-teal/20 transition-colors">
                      {playing === i ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-deep-teal rounded-full w-0" /></div>
                    <span className="text-xs text-text-muted font-mono">{q.recordingDuration || 30}s</span>
                    <button className="p-1.5 text-text-muted hover:text-text-primary cursor-pointer"><Download size={14} /></button>
                  </div>
                  {/* Analysis metrics */}
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { label: 'Speech Rate', value: `${analysis.speechRate} wpm` },
                      { label: 'Pauses', value: `${analysis.pauseDuration}s` },
                      { label: 'Fillers', value: analysis.fillerWords },
                      { label: 'Coherence', value: analysis.coherence },
                      { label: 'Confidence', value: analysis.confidence },
                    ].map((m) => (
                      <div key={m.label} className="text-center p-2 bg-muted/15 rounded-lg"><p className="text-[10px] text-text-muted">{m.label}</p><p className="text-xs font-bold text-navy-dark">{m.value}</p></div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:bg-muted/30 transition-colors cursor-pointer"><MessageSquare size={12} /> Add Note</button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:bg-muted/30 transition-colors cursor-pointer"><Flag size={12} /> Flag</button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Session Notes */}
      <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-5">
        <label className="block text-sm font-bold text-navy-dark mb-2">Session Notes</label>
        <textarea value={sessionNotes} onChange={(e) => setSessionNotes(e.target.value)} rows={4} placeholder="Any additional observations about this session…" className="w-full rounded-lg border border-border/60 px-3 py-2.5 text-sm outline-none focus:border-deep-teal focus:ring-1 focus:ring-deep-teal/15 transition-all resize-none" />
      </motion.div>

      {/* Actions */}
      <motion.div variants={stagger.item} className="flex flex-col sm:flex-row justify-between gap-3">
        <Button variant="outline" onClick={() => navigate(`/patients/${session.patientId}`)}>Save Draft</Button>
        <Button onClick={() => setGenerateModal(true)}>Generate Report</Button>
      </motion.div>

      {/* Generate Modal */}
      {generateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 backdrop-blur-sm px-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface rounded-xl shadow-xl border border-border/50 p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-navy-dark mb-3">Generate Assessment Report?</h3>
            <div className="space-y-1.5 text-sm text-text-secondary mb-5">
              <p>✓ All {questions.length} questions analyzed</p>
              <p>✓ Total session time: {Math.floor(totalDuration / 60)}m {totalDuration % 60}s</p>
            </div>
            <p className="text-xs text-warning mb-5">Once generated, recordings cannot be modified.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setGenerateModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleGenerate}>Generate Report</Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
