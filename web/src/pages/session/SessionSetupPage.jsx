import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ClipboardCheck, Sliders, Clock, Check, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { useDoctor } from '../../contexts/DoctorContext';
import { useSession } from '../../contexts/SessionContext';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const stagger = { container: { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }, item: { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } } };

export default function SessionSetupPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { patients, questionBank } = useDoctor();
  const { startSession } = useSession();
  const [step, setStep] = useState(1);
  const [questionMode, setQuestionMode] = useState('standard');
  const [customSelected, setCustomSelected] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [location, setLocation] = useState('in-office');
  const [sessionNotes, setSessionNotes] = useState('');
  const [consents, setConsents] = useState({ informed: false, recording: false, quiet: false });
  const [confirmModal, setConfirmModal] = useState(false);

  const patient = patients.find((p) => p.id === patientId);
  const standardQuestions = useMemo(() => questionBank.filter((q) => q.isDefault).slice(0, 10), [questionBank]);
  const selectedQuestions = questionMode === 'standard' ? standardQuestions : customSelected.map((id) => questionBank.find((q) => q.id === id)).filter(Boolean);

  const allConsented = consents.informed && consents.recording && consents.quiet;
  const categories = useMemo(() => [...new Set(questionBank.map((q) => q.category))], [questionBank]);

  const toggleCustom = (id) => {
    setCustomSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : p.length < 10 ? [...p, id] : p);
  };

  const handleStart = () => {
    const session = startSession(patientId, selectedQuestions);
    const sessionId = session?.id || `ses_${Date.now()}`;
    navigate(`/session/active/${sessionId}`);
  };

  if (!patient) return <div className="p-8 text-center"><p className="text-text-muted">Patient not found.</p></div>;

  return (
    <motion.div variants={stagger.container} initial="hidden" animate="visible" className="p-5 lg:p-7">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <motion.div variants={stagger.item} className="mb-6">
          <button onClick={() => step === 1 ? navigate(`/patients/${patientId}`) : setStep(1)} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-4 cursor-pointer">
            <ArrowLeft size={16} /> {step === 1 ? `Back to ${patient.fullName}` : 'Back to Question Selection'}
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-navy-dark">New Assessment Session</h1>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-full">
              <div className="w-7 h-7 rounded-full bg-deep-teal/10 flex items-center justify-center text-deep-teal text-[10px] font-bold">{patient.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
              <span className="text-sm font-medium text-text-primary">{patient.fullName}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><motion.div className="h-full bg-deep-teal rounded-full" animate={{ width: step === 1 ? '50%' : '100%' }} /></div>
            <span className="text-xs font-medium text-text-muted">Step {step} of 2</span>
          </div>
        </motion.div>

        {/* STEP 1: Question Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <motion.h2 variants={stagger.item} className="text-lg font-bold text-navy-dark">Choose Your Question Set</motion.h2>

            {/* Standard */}
            <motion.div variants={stagger.item} onClick={() => setQuestionMode('standard')} className={cn('bg-surface rounded-xl border-2 p-5 cursor-pointer transition-all', questionMode === 'standard' ? 'border-deep-teal shadow-lg' : 'border-border/60 hover:border-border')}>
              <div className="flex items-start gap-4">
                <div className="w-5 h-5 rounded-full border-2 border-deep-teal flex items-center justify-center mt-0.5 shrink-0">{questionMode === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-deep-teal" />}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2"><ClipboardCheck size={18} className="text-deep-teal" /><span className="text-base font-bold text-navy-dark">Standard 10-Question Set</span><span className="text-[9px] font-bold text-deep-teal bg-deep-teal/8 px-2 py-0.5 rounded-full">Recommended</span></div>
                  <p className="text-sm text-text-secondary mt-1">Balanced assessment covering memory, cognition, and language.</p>
                  <p className="text-xs text-text-muted mt-1">~2-3 minutes</p>
                  <button onClick={(e) => { e.stopPropagation(); setShowPreview(!showPreview); }} className="text-xs text-deep-teal font-semibold mt-2 hover:underline cursor-pointer flex items-center gap-1">{showPreview ? 'Hide' : 'View All 10'} Questions <ChevronDown size={12} className={cn('transition-transform', showPreview && 'rotate-180')} /></button>
                  {showPreview && (
                    <div className="mt-3 space-y-1.5">
                      {standardQuestions.map((q, i) => (
                        <div key={q.id} className="flex items-start gap-2 text-xs text-text-secondary"><span className="text-deep-teal font-bold shrink-0">{i + 1}.</span>{q.questionText}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Custom */}
            <motion.div variants={stagger.item} onClick={() => setQuestionMode('custom')} className={cn('bg-surface rounded-xl border-2 p-5 cursor-pointer transition-all', questionMode === 'custom' ? 'border-deep-teal shadow-lg' : 'border-border/60 hover:border-border')}>
              <div className="flex items-start gap-4">
                <div className="w-5 h-5 rounded-full border-2 border-deep-teal flex items-center justify-center mt-0.5 shrink-0">{questionMode === 'custom' && <div className="w-2.5 h-2.5 rounded-full bg-deep-teal" />}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2"><Sliders size={18} className="text-deep-teal" /><span className="text-base font-bold text-navy-dark">Build Custom Set</span></div>
                  <p className="text-sm text-text-secondary mt-1">Select specific questions from the bank. ({customSelected.length}/10 selected)</p>
                </div>
              </div>
            </motion.div>

            {/* Custom question selector */}
            {questionMode === 'custom' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-surface rounded-xl border border-border/60 shadow-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-navy-dark">Select Questions ({customSelected.length}/10)</h3>
                  {customSelected.length > 0 && <button className="text-xs text-text-muted hover:underline cursor-pointer" onClick={() => setCustomSelected([])}>Clear All</button>}
                </div>
                {categories.map((cat) => (
                  <div key={cat}>
                    <p className="text-xs font-bold text-text-muted uppercase mb-2">{cat}</p>
                    <div className="space-y-1.5">
                      {questionBank.filter((q) => q.category === cat).map((q) => (
                        <label key={q.id} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors', customSelected.includes(q.id) ? 'bg-deep-teal/5 border border-deep-teal/20' : 'hover:bg-muted/30 border border-transparent')}>
                          <input type="checkbox" checked={customSelected.includes(q.id)} onChange={() => toggleCustom(q.id)} className="w-4 h-4 rounded text-deep-teal cursor-pointer" />
                          <div className="flex-1 min-w-0"><p className="text-sm text-text-primary truncate">{q.questionText}</p></div>
                          <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full', q.difficulty === 'easy' ? 'bg-success/10 text-success' : q.difficulty === 'medium' ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error')}>{q.difficulty}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            <motion.div variants={stagger.item} className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => navigate(`/patients/${patientId}`)}>Cancel</Button>
              <Button onClick={() => setStep(2)} disabled={questionMode === 'custom' && customSelected.length === 0}>Next: Session Details</Button>
            </motion.div>
          </div>
        )}

        {/* STEP 2: Session Details */}
        {step === 2 && (
          <div className="space-y-5">
            <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-6 space-y-5">
              <h2 className="text-lg font-bold text-navy-dark">Session Details</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Session Date & Time</label>
                  <input type="datetime-local" defaultValue={new Date().toISOString().slice(0, 16)} className="w-full h-10 rounded-lg border border-border/60 px-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Location</label>
                  <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full h-10 rounded-lg border border-border/60 px-3 text-sm outline-none cursor-pointer bg-transparent">
                    <option value="in-office">In-office</option>
                    <option value="telehealth">Telehealth</option>
                    <option value="home">Home visit</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Pre-session Notes</label>
                <textarea rows={3} value={sessionNotes} onChange={(e) => setSessionNotes(e.target.value)} placeholder="Any observations or patient concerns…" className="w-full rounded-lg border border-border/60 px-3 py-2.5 text-sm outline-none focus:border-deep-teal focus:ring-1 focus:ring-deep-teal/15 transition-all resize-none" />
              </div>
            </motion.div>

            <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-6 space-y-3">
              <h3 className="text-base font-bold text-navy-dark mb-1">Consent Checklist</h3>
              {[
                { key: 'informed', label: 'Patient has been informed about the assessment' },
                { key: 'recording', label: 'Patient consents to voice recording' },
                { key: 'quiet', label: 'Patient is in a quiet environment' },
              ].map((c) => (
                <label key={c.key} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={consents[c.key]} onChange={() => setConsents((p) => ({ ...p, [c.key]: !p[c.key] }))} className="w-4 h-4 rounded text-deep-teal cursor-pointer" />
                  <span className="text-sm text-text-secondary">{c.label}</span>
                </label>
              ))}
            </motion.div>

            <motion.div variants={stagger.item} className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button disabled={!allConsented} onClick={() => setConfirmModal(true)}>Start Session</Button>
            </motion.div>
          </div>
        )}

        {/* Confirm Modal */}
        {confirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface rounded-xl shadow-xl border border-border/50 p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold text-navy-dark mb-2">Ready to Begin?</h3>
              <div className="space-y-2 text-sm text-text-secondary mb-6">
                <p><span className="font-medium text-text-primary">Patient:</span> {patient.fullName}</p>
                <p><span className="font-medium text-text-primary">Questions:</span> {selectedQuestions.length} selected</p>
                <p><span className="font-medium text-text-primary">Estimated time:</span> 2-3 minutes</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setConfirmModal(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleStart}>Start Recording</Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
