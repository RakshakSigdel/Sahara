import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic, Edit, MoreHorizontal, Calendar, Activity, Clock, TrendingUp, FileText, ChevronRight, Check, AlertCircle, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { useDoctor } from '../../contexts/DoctorContext';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const stagger = { container: { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }, item: { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } } };

function toJsDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === 'function') return value.toDate();
  if (typeof value.seconds === 'number') return new Date(value.seconds * 1000 + Math.floor(value.nanoseconds || 0) / 1e6);
  return new Date(value);
}

function calcAge(dob) {
  const date = toJsDate(dob);
  if (!date || Number.isNaN(date.getTime())) return '—';
  return Math.floor((Date.now() - date.getTime()) / 31557600000);
}

function timeAgo(value) {
  const date = toJsDate(value);
  if (!date || Number.isNaN(date.getTime())) return 'Never';
  const diffDays = (Date.now() - date.getTime()) / 86400000;
  if (diffDays < 1) return 'Today';
  if (diffDays < 2) return 'Yesterday';
  if (diffDays < 30) return `${Math.floor(diffDays)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDate(value, options) {
  const date = toJsDate(value);
  if (!date || Number.isNaN(date.getTime())) return '—';
  const hasTime = options?.timeStyle || options?.hour != null || options?.minute != null || options?.second != null;
  const method = hasTime ? 'toLocaleString' : 'toLocaleDateString';
  return date[method]('en-US', options);
}
function riskColor(s) { if (s <= 30) return 'success'; if (s <= 60) return 'warning'; return 'error'; }
function riskLabel(s) { if (s <= 30) return 'Healthy'; if (s <= 60) return 'Mild Concern'; return 'High Risk'; }

function ChartTip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return <div className="bg-surface rounded-lg border border-border/60 shadow-lg px-3 py-2 text-xs"><span className="font-bold text-navy-dark">{payload[0].value}</span> risk score</div>;
}

export default function PatientDetailPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { patients, updatePatient, loading, getSessionsByPatient } = useDoctor();
  const [tab, setTab] = useState('history');
  const [expandedSession, setExpandedSession] = useState(null);
  const [notes, setNotes] = useState('');
  const [sessionState, setSessionState] = useState({ data: [], loading: false, error: '' });

  const patient = patients.find((p) => p.id === patientId);

  useEffect(() => {
    let cancelled = false;
    if (!patientId) return () => { cancelled = true; };
    setSessionState((prev) => ({ ...prev, loading: true, error: '' }));
    getSessionsByPatient(patientId)
      .then((data) => {
        if (!cancelled) {
          setSessionState({ data: data || [], loading: false, error: '' });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Failed to load sessions for patient detail:', err);
          setSessionState({ data: [], loading: false, error: 'Unable to load session history.' });
        }
      });
    return () => { cancelled = true; };
  }, [patientId, getSessionsByPatient]);

  const { data: remoteSessions, loading: sessionsLoading, error: sessionsError } = sessionState;
  const completed = useMemo(() => remoteSessions.filter((s) => s.status === 'completed' && s.overallReport), [remoteSessions]);
  const latest = completed[0];
  const avgScore = completed.length ? +(completed.reduce((a, s) => a + s.overallReport.riskScore, 0) / completed.length).toFixed(1) : null;

  const chartData = useMemo(() => completed.slice().reverse().map((s, i) => ({
    session: `#${i + 1}`,
    score: s.overallReport.riskScore,
    date: formatDate(s.sessionDate, { month: 'short', day: 'numeric' }),
  })), [completed]);

  if (loading) return <div className="p-8 text-center"><p className="text-text-muted">Loading patient details…</p></div>;

  if (!patient) return <div className="p-8 text-center"><p className="text-text-muted">Patient not found.</p><Button variant="outline" onClick={() => navigate('/patients')} className="mt-4">Back to Patients</Button></div>;

  const tabs = [{ id: 'overview', label: 'Overview' }, { id: 'history', label: 'Session History' }, { id: 'medical', label: 'Medical Info' }];

  return (
    <motion.div variants={stagger.container} initial="hidden" animate="visible" className="p-5 lg:p-7 space-y-6">
      {/* Back */}
      <motion.div variants={stagger.item}>
        <button onClick={() => navigate('/patients')} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary cursor-pointer"><ArrowLeft size={16} /> Back to Patients</button>
      </motion.div>

      {/* Header */}
      <motion.div variants={stagger.item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-deep-teal to-sage flex items-center justify-center text-white text-xl lg:text-2xl font-bold shrink-0">
            {patient.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-navy-dark">{patient.fullName}</h1>
            <p className="text-sm text-text-muted">{calcAge(patient.dateOfBirth)} yrs • {patient.gender === 'male' ? 'Male' : 'Female'} • {patient.id}</p>
            <p className="text-xs text-text-muted mt-0.5">Patient since {formatDate(patient.addedDate, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button leftIcon={<Mic size={16} />} onClick={() => navigate(`/session/setup/${patientId}`)}>New Session</Button>
          <Button variant="outline" leftIcon={<Edit size={14} />} onClick={() => navigate(`/patients/${patientId}/edit`)}>Edit</Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={stagger.item} className="flex gap-1 border-b border-border/40">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn('px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer', tab === t.id ? 'border-deep-teal text-deep-teal' : 'border-transparent text-text-muted hover:text-text-primary')}>{t.label}</button>
        ))}
      </motion.div>

      {/* OVERVIEW TAB */}
      {tab === 'overview' && (
        <div className="grid lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 space-y-5">
            {!latest && sessionsLoading && (
              <div className="bg-surface rounded-xl border border-border/60 shadow-card p-5 text-sm text-text-muted">Loading session overview…</div>
            )}
            {!latest && sessionsError && (
              <div className="bg-error/5 border border-error/20 text-error text-sm rounded-xl p-4">{sessionsError}</div>
            )}
            {/* Latest Session */}
            {latest && (
              <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-5">
                <h3 className="text-sm font-bold text-text-muted mb-3">Most Recent Assessment</h3>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted" />
                      <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" strokeLinecap="round" strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - latest.overallReport.riskScore / 100)} className={`text-${riskColor(latest.overallReport.riskScore)}`} stroke="currentColor" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-extrabold text-navy-dark" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{latest.overallReport.riskScore}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className={cn('inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2', `bg-${riskColor(latest.overallReport.riskScore)}/10 text-${riskColor(latest.overallReport.riskScore)}`)}>{riskLabel(latest.overallReport.riskScore)}</span>
                    <p className="text-sm text-text-secondary">{formatDate(latest.sessionDate, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate(`/session/report/${latest.id}`)}>View Full Report</Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Progress Chart */}
            {chartData.length > 1 && (
              <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-5">
                <h3 className="text-sm font-bold text-text-muted mb-4">Risk Score Trend</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0A7C7C" stopOpacity={0.15} /><stop offset="100%" stopColor="#0A7C7C" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <ReferenceLine y={30} stroke="#2ecc71" strokeDasharray="3 3" strokeOpacity={0.5} />
                      <ReferenceLine y={60} stroke="#f39c12" strokeDasharray="3 3" strokeOpacity={0.5} />
                      <Tooltip content={<ChartTip />} />
                      <Area type="monotone" dataKey="score" stroke="#0A7C7C" strokeWidth={2} fill="url(#rg)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-2 space-y-5">
            <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-text-muted">Quick Stats</h3>
              {[
                { label: 'Total Sessions', value: patient.totalSessions, icon: <Activity size={14} /> },
                { label: 'Avg Risk Score', value: avgScore ?? '—', icon: <TrendingUp size={14} /> },
                { label: 'First Session', value: completed.length ? formatDate(completed[completed.length - 1].sessionDate, { month: 'short', day: 'numeric', year: 'numeric' }) : '—', icon: <Calendar size={14} /> },
                { label: 'Last Session', value: timeAgo(patient.lastSessionDate), icon: <Clock size={14} /> },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-text-secondary">{s.icon}{s.label}</span>
                  <span className="text-sm font-bold text-navy-dark">{s.value}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-5">
              <h3 className="text-sm font-bold text-text-muted mb-2">Doctor Notes</h3>
              <textarea value={notes || patient.notes || ''} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Add notes about this patient…" className="w-full rounded-lg border border-border/60 px-3 py-2.5 text-sm outline-none focus:border-deep-teal focus:ring-1 focus:ring-deep-teal/15 transition-all resize-none" />
              <Button size="sm" variant="outline" className="mt-2" onClick={() => updatePatient(patientId, { notes })}>Save Note</Button>
            </motion.div>
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {tab === 'history' && (
        <div className="space-y-3">
          {remoteSessions.length === 0 && !sessionsLoading && <p className="text-sm text-text-muted text-center py-12">No sessions yet. <button className="text-deep-teal font-semibold hover:underline cursor-pointer" onClick={() => navigate(`/session/setup/${patientId}`)}>Start one now</button></p>}
          {sessionsLoading && <p className="text-sm text-text-muted text-center py-8">Loading session history…</p>}
          {sessionsError && <p className="text-sm text-error text-center py-4">{sessionsError}</p>}
          {remoteSessions.map((s, i) => {
            const score = s.overallReport?.riskScore;
            const expanded = expandedSession === s.id;
            return (
              <motion.div key={s.id} variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card overflow-hidden">
                <button onClick={() => setExpandedSession(expanded ? null : s.id)} className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', s.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>
                      {s.status === 'completed' ? <Check size={14} /> : <AlertCircle size={14} />}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-text-primary">Session #{remoteSessions.length - i}</p>
                      <p className="text-xs text-text-muted">{formatDate(s.sessionDate, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', s.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>{s.status === 'completed' ? 'Completed' : 'In Progress'}</span>
                    {score != null && <span className={cn('text-sm font-mono font-bold', `text-${riskColor(score)}`)}>{score}</span>}
                    <ChevronRight size={16} className={cn('text-text-muted transition-transform', expanded && 'rotate-90')} />
                  </div>
                </button>
                {expanded && (
                  <div className="px-4 pb-4 border-t border-border/40 pt-3">
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="text-center p-2 bg-muted/20 rounded-lg"><p className="text-xs text-text-muted">Questions</p><p className="text-sm font-bold">{s.questions?.length || 0}</p></div>
                      <div className="text-center p-2 bg-muted/20 rounded-lg"><p className="text-xs text-text-muted">Duration</p><p className="text-sm font-bold">{s.totalDuration ? `${Math.floor(s.totalDuration / 60)}m ${s.totalDuration % 60}s` : '—'}</p></div>
                      <div className="text-center p-2 bg-muted/20 rounded-lg"><p className="text-xs text-text-muted">Confidence</p><p className="text-sm font-bold">{s.overallReport?.confidence ? `${Math.round(s.overallReport.confidence * 100)}%` : '—'}</p></div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" leftIcon={<FileText size={12} />} onClick={() => navigate(`/session/report/${s.id}`)}>View Report</Button>
                      <Button size="sm" variant="outline" leftIcon={<Download size={12} />}>Export PDF</Button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* MEDICAL TAB */}
      {tab === 'medical' && (
        <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-6 space-y-5 max-w-[720px]">
          <div>
            <h3 className="text-base font-bold text-navy-dark mb-3">Emergency Contact</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {[{ label: 'Name', value: patient.emergencyContact?.name }, { label: 'Phone', value: patient.emergencyContact?.phone }, { label: 'Relationship', value: patient.emergencyContact?.relationship }].map((f) => (
                <div key={f.label}><p className="text-xs text-text-muted mb-0.5">{f.label}</p><p className="text-sm font-medium text-text-primary">{f.value || '—'}</p></div>
              ))}
            </div>
          </div>
          <hr className="border-border/40" />
          <div>
            <h3 className="text-base font-bold text-navy-dark mb-2">Medical History</h3>
            <p className="text-sm text-text-secondary whitespace-pre-wrap">{patient.medicalHistory || 'No medical history recorded.'}</p>
          </div>
          <hr className="border-border/40" />
          <div className="text-xs text-text-muted space-y-1">
            <p>Added: {formatDate(patient.addedDate, { dateStyle: 'medium', timeStyle: 'short' })}</p>
            <p>Last session: {patient.lastSessionDate ? formatDate(patient.lastSessionDate, { dateStyle: 'medium', timeStyle: 'short' }) : 'None'}</p>
          </div>
          <Button variant="outline" leftIcon={<Edit size={14} />} onClick={() => navigate(`/patients/${patientId}/edit`)}>Edit Medical Info</Button>
        </motion.div>
      )}
    </motion.div>
  );
}
