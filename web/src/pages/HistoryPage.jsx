import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import Button from '../components/ui/Button';
import { cn } from '../utils/cn';

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

/* ── Mock data ── */
const allTests = [
  { id: 1, date: '2026-03-25', time: '2:45 PM', type: 'Story Recall', score: 28, words: 287, rate: 145, coherence: 87 },
  { id: 2, date: '2026-03-18', time: '10:20 AM', type: 'Quick Screen', score: 32, words: 84, rate: 130, coherence: 82 },
  { id: 3, date: '2026-03-10', time: '4:15 PM', type: 'Story Recall', score: 45, words: 245, rate: 118, coherence: 74 },
  { id: 4, date: '2026-02-28', time: '11:00 AM', type: 'Picture Description', score: 35, words: 198, rate: 135, coherence: 80 },
  { id: 5, date: '2026-02-20', time: '3:30 PM', type: 'Quick Screen', score: 22, words: 92, rate: 142, coherence: 90 },
  { id: 6, date: '2026-02-10', time: '9:45 AM', type: 'Story Recall', score: 40, words: 260, rate: 125, coherence: 78 },
  { id: 7, date: '2026-01-28', time: '1:15 PM', type: 'Quick Screen', score: 30, words: 78, rate: 138, coherence: 85 },
  { id: 8, date: '2026-01-15', time: '5:00 PM', type: 'Picture Description', score: 26, words: 210, rate: 140, coherence: 88 },
];

const chartData = allTests.map((t) => ({
  date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  score: t.score,
  type: t.type,
})).reverse();

const dateRanges = ['30 days', '3 months', '6 months', '1 year', 'All'];
const testTypes = ['All', 'Quick Screen', 'Story Recall', 'Picture Description'];

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

function typeIcon(type) {
  if (type === 'Quick Screen') return <Zap size={12} />;
  if (type === 'Story Recall') return <BookOpenSmall size={12} />;
  return <ImageIcon size={12} />;
}

function Zap(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z"/></svg>; }
function BookOpenSmall(props) { return <BookOpen {...props} />; }

export default function HistoryPage() {
  const [range, setRange] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const navigate = useNavigate();

  const filteredTests = useMemo(() => {
    let tests = allTests;
    if (typeFilter !== 'All') tests = tests.filter((t) => t.type === typeFilter);
    return tests;
  }, [typeFilter]);

  const stats = useMemo(() => {
    const scores = filteredTests.map((t) => t.score);
    return {
      total: filteredTests.length,
      avg: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      best: scores.length ? Math.min(...scores) : 0,
      streak: 5,
    };
  }, [filteredTests]);

  const isEmpty = filteredTests.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10 py-8 lg:py-12">
        <motion.div variants={stagger.container} initial="hidden" animate="visible">

          {/* ── HEADER ── */}
          <motion.div variants={stagger.item} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-navy-dark tracking-tight">Test History</h1>
              <p className="mt-1 text-text-secondary text-sm">Track your cognitive health over time</p>
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
              {/* Type filter */}
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-8 rounded-lg border border-border/60 bg-surface px-3 text-[11px] font-semibold text-text-muted cursor-pointer">
                {testTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </motion.div>

          {/* ── TREND CHART ── */}
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

          {/* ── STATS ROW ── */}
          <motion.div variants={stagger.item} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total Tests', value: stats.total, icon: <BarChart3 size={16} />, color: 'deep-teal' },
              { label: 'Average Score', value: stats.avg, icon: <TrendingDown size={16} />, color: getRiskStyle(stats.avg).ringColor.replace('text-', '') },
              { label: 'Day Streak', value: stats.streak, icon: <Flame size={16} />, color: 'warning' },
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
              <h3 className="text-lg font-bold text-navy-dark mb-2">No Tests Yet</h3>
              <p className="text-sm text-text-secondary mb-6 max-w-sm">Take your first screening to start tracking your cognitive health</p>
              <Button onClick={() => navigate('/screen/consent')} rightIcon={<ArrowRight size={16} />}>Start First Test</Button>
            </motion.div>
          ) : (
            <motion.div variants={stagger.item}>
              <h3 className="text-base font-bold text-navy-dark mb-5">All Screenings</h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-border/60 hidden md:block" />

                <div className="space-y-4">
                  {filteredTests.map((test, i) => {
                    const risk = getRiskStyle(test.score);
                    const dateObj = new Date(test.date);
                    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

                    return (
                      <motion.div key={test.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex gap-4 md:gap-6 group">
                        {/* Date dot */}
                        <div className="hidden md:flex flex-col items-center shrink-0 w-9 pt-5">
                          <div className={cn('w-3.5 h-3.5 rounded-full border-2 bg-surface z-10', risk.border)} />
                        </div>

                        {/* Card */}
                        <div
                          onClick={() => navigate('/screen/results')}
                          className="flex-1 bg-surface rounded-xl border border-border/60 shadow-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                        >
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-xs font-medium text-text-muted">{dateStr} ({dayStr}) • {test.time}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-deep-teal/8 text-deep-teal">{test.type}</span>
                          </div>

                          <div className="flex items-center gap-5">
                            {/* Score */}
                            <div className="flex items-center gap-2">
                              <span className="text-3xl font-extrabold text-navy-dark" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{test.score}</span>
                              <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border', risk.bg, risk.text, risk.border)}>
                                {risk.label}
                              </span>
                            </div>

                            {/* Mini metrics */}
                            <div className="hidden sm:flex items-center gap-3 ml-auto">
                              {[
                                { label: `${test.rate} wpm`, icon: <Zap size={10} /> },
                                { label: `${test.words} words`, icon: <Mic size={10} /> },
                                { label: `${test.coherence}/100`, icon: <BarChart3 size={10} /> },
                              ].map((m, j) => (
                                <span key={j} className="inline-flex items-center gap-1 text-[10px] text-text-muted font-medium bg-muted/50 px-2 py-0.5 rounded">
                                  {m.icon} {m.label}
                                </span>
                              ))}
                            </div>

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
