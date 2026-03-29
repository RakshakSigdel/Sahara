import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Flame, TrendingDown, TrendingUp, Award, Filter,
  ChevronRight, Trash2, Download, Clipboard, ArrowRight,
  BarChart3, Mic, BookOpen, Image as ImageIcon,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useDoctor } from '../contexts/DoctorContext';
import Button from '../components/ui/Button';
import { cn } from '../utils/cn';

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

const dateRanges = ['30 days', '3 months', '6 months', '1 year', 'All'];
const statusFilters = ['All', 'Completed', 'Active'];

function getRiskStyle(score) {
  if (score <= 30) return { label: 'Healthy', bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', ringColor: 'text-success' };
  if (score <= 60) return { label: 'Mild Concerns', bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', ringColor: 'text-warning' };
  return { label: 'Elevated', bg: 'bg-error/10', text: 'text-error', border: 'border-error/20', ringColor: 'text-error' };
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const score = payload[0].value;
  const risk = getRiskStyle(score);
  return (
    <div className="bg-surface rounded-lg shadow-lg border border-border/60 p-3 min-w-[140px]">
      <p className="text-xs text-text-muted font-medium">{label}</p>
      <p className="text-lg font-bold text-navy-dark" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{score}</p>
      <p className={cn('text-xs font-semibold', risk.text)}>{risk.label}</p>
    </div>
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return 'Unknown';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function HistoryPage() {
  const { sessions, patients } = useDoctor();
  const [range, setRange] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  /* ── Filter sessions by date range and status ── */
  const filteredSessions = useMemo(() => {
    let list = [...sessions];

    // Status filter
    if (statusFilter === 'Completed') list = list.filter((s) => s.status === 'completed');
    if (statusFilter === 'Active') list = list.filter((s) => s.status === 'active' || s.status === 'in-progress');

    // Date range filter
    if (range !== 'All') {
      const daysMap = { '30 days': 30, '3 months': 90, '6 months': 180, '1 year': 365 };
      const cutoff = Date.now() - (daysMap[range] || 365) * 86400000;
      list = list.filter((s) => new Date(s.sessionDate).getTime() > cutoff);
    }

    // Sort by date descending
    list.sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate));

    return list;
  }, [sessions, range, statusFilter]);

  /* ── Completed sessions with reports for stats ── */
  const completedSessions = useMemo(() =>
    filteredSessions.filter((s) => s.status === 'completed' && s.overallReport),
    [filteredSessions],
  );

  /* ── Chart data from completed sessions (chronological) ── */
  const chartData = useMemo(() =>
    completedSessions
      .slice()
      .sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate))
      .map((s) => ({
        date: new Date(s.sessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: s.overallReport.riskScore,
      })),
    [completedSessions],
  );

  /* ── Stats ── */
  const stats = useMemo(() => {
    const scores = completedSessions.map((s) => s.overallReport.riskScore);
    return {
      total: filteredSessions.length,
      avg: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      best: scores.length ? Math.min(...scores) : 0,
      completed: completedSessions.length,
    };
  }, [filteredSessions, completedSessions]);

  const isEmpty = filteredSessions.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10 py-8 lg:py-12">
        <motion.div variants={stagger.container} initial="hidden" animate="visible">

          {/* ── HEADER ── */}
          <motion.div variants={stagger.item} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-navy-dark tracking-tight">Session History</h1>
              <p className="mt-1 text-text-secondary text-sm">Track assessments and patient outcomes over time</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Date range */}
              <div className="inline-flex rounded-lg border border-border/60 bg-surface overflow-hidden">
                {dateRanges.map((r) => (
                  <button key={r} onClick={() => setRange(r)} className={cn('px-3 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer', range === r ? 'bg-deep-teal text-white' : 'text-text-muted hover:text-text-primary')}>
                    {r}
                  </button>
                ))}
              </div>
              {/* Status filter */}
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 rounded-lg border border-border/60 bg-surface px-3 text-[11px] font-semibold text-text-muted cursor-pointer">
                {statusFilters.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </motion.div>

          {/* ── TREND CHART ── */}
          {chartData.length > 0 && (
            <motion.div variants={stagger.item} className="mb-6">
              <div className="bg-surface rounded-xl border border-border/60 shadow-card p-6">
                <h3 className="text-base font-bold text-navy-dark mb-1">Score Progression</h3>
                <p className="text-xs text-text-muted mb-5">Lower scores indicate healthier cognitive function</p>
                <div className="h-[240px] md:h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0A7C7C" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#0A7C7C" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8E5" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8A9E92' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#8A9E92' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <ReferenceLine y={30} stroke="#10B981" strokeDasharray="4 4" strokeOpacity={0.4} />
                      <ReferenceLine y={60} stroke="#F59E0B" strokeDasharray="4 4" strokeOpacity={0.4} />
                      <Area type="monotone" dataKey="score" stroke="#0A7C7C" strokeWidth={2.5} fill="url(#histGrad)" dot={{ r: 4, fill: '#0A7C7C', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 mt-3 text-[11px]">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-success" /> Healthy (0–30)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-warning" /> Mild (31–60)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-error" /> Elevated (61+)</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STATS ROW ── */}
          <motion.div variants={stagger.item} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total Sessions', value: stats.total, icon: <BarChart3 size={16} />, color: 'deep-teal' },
              { label: 'Average Score', value: stats.avg, icon: <TrendingDown size={16} />, color: getRiskStyle(stats.avg).ringColor.replace('text-', '') },
              { label: 'Completed', value: stats.completed, icon: <Calendar size={16} />, color: 'success' },
              { label: 'Best Score', value: stats.best, icon: <Award size={16} />, color: 'success' },
            ].map((s, i) => (
              <div key={i} className="bg-surface rounded-xl border border-border/60 shadow-card p-4 md:p-5 flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', `bg-${s.color}/10 text-${s.color}`)}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-navy-dark" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</p>
                  <p className="text-[11px] text-text-muted font-medium">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* ── TIMELINE ── */}
          {isEmpty ? (
            <motion.div variants={stagger.item} className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
                <Clipboard size={28} className="text-text-muted" />
              </div>
              <h3 className="text-lg font-bold text-navy-dark mb-2">No Sessions {statusFilter !== 'All' || range !== 'All' ? 'Found' : 'Yet'}</h3>
              <p className="text-sm text-text-secondary mb-6 max-w-sm">
                {statusFilter !== 'All' || range !== 'All' ? 'Try adjusting your filters.' : 'Start your first patient session to track assessment history.'}
              </p>
              {statusFilter === 'All' && range === 'All' && (
                <Button onClick={() => navigate('/patients')} rightIcon={<ArrowRight size={16} />}>Go to Patients</Button>
              )}
            </motion.div>
          ) : (
            <motion.div variants={stagger.item}>
              <h3 className="text-base font-bold text-navy-dark mb-5">All Sessions</h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-border/60 hidden md:block" />

                <div className="space-y-4">
                  {filteredSessions.map((session, i) => {
                    const patient = patients.find((p) => p.id === session.patientId);
                    const score = session.overallReport?.riskScore;
                    const risk = score != null ? getRiskStyle(score) : null;
                    const dateObj = new Date(session.sessionDate);
                    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                    const questionCount = session.questions?.length || 0;
                    const isCompleted = session.status === 'completed';

                    return (
                      <motion.div key={session.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex gap-4 md:gap-6 group">
                        {/* Date dot */}
                        <div className="hidden md:flex flex-col items-center shrink-0 w-9 pt-5">
                          <div className={cn('w-3.5 h-3.5 rounded-full border-2 bg-surface z-10', isCompleted ? (risk ? risk.border : 'border-success/20') : 'border-warning/20')} />
                        </div>

                        {/* Card */}
                        <div
                          onClick={() => isCompleted ? navigate(`/session/report/${session.id}`) : navigate(`/session/active/${session.id}`)}
                          className="flex-1 bg-surface rounded-xl border border-border/60 shadow-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                        >
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-xs font-medium text-text-muted">{dateStr} ({dayStr}) • {timeStr}</span>
                            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold', isCompleted ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>
                              {isCompleted ? 'Completed' : 'In Progress'}
                            </span>
                            {patient && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-deep-teal/8 text-deep-teal">
                                {patient.fullName}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-5">
                            {/* Score */}
                            <div className="flex items-center gap-2">
                              {score != null ? (
                                <>
                                  <span className="text-3xl font-extrabold text-navy-dark" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{score}</span>
                                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border', risk.bg, risk.text, risk.border)}>
                                    {risk.label}
                                  </span>
                                </>
                              ) : (
                                <span className="text-sm text-text-muted font-medium">{questionCount} question{questionCount !== 1 ? 's' : ''}</span>
                              )}
                            </div>

                            {/* Mini metrics */}
                            {isCompleted && session.overallReport?.voiceMarkers && (
                              <div className="hidden sm:flex items-center gap-3 ml-auto">
                                {session.overallReport.voiceMarkers.slice(0, 3).map((m, j) => (
                                  <span key={j} className="inline-flex items-center gap-1 text-[10px] text-text-muted font-medium bg-muted/50 px-2 py-0.5 rounded">
                                    {m.name}: {m.value}
                                  </span>
                                ))}
                              </div>
                            )}

                            <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
