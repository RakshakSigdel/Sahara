import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Activity, Calendar, TrendingDown, TrendingUp, UserPlus,
  BarChart3, Settings, AlertCircle, FileText, ChevronRight,
  Search, ArrowRight, Clock, Mic,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useDoctor } from '../contexts/DoctorContext';
import Button from '../components/ui/Button';
import { cn } from '../utils/cn';

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

/* ── Helpers ── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function timeAgo(dateStr) {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function riskColor(score) {
  if (score <= 30) return 'success';
  if (score <= 60) return 'warning';
  return 'error';
}

function riskLabel(score) {
  if (score <= 30) return 'Healthy';
  if (score <= 60) return 'Mild';
  return 'High Risk';
}

function calcAge(dob) {
  return Math.floor((Date.now() - new Date(dob).getTime()) / 31557600000);
}

/* ── Stat Card ── */
function StatCard({ icon, label, value, trend, trendLabel, color = 'deep-teal', onClick }) {
  return (
    <motion.div variants={stagger.item} className={cn('bg-surface rounded-xl border border-border/60 shadow-card p-5 hover:shadow-xl transition-shadow', onClick && 'cursor-pointer')} onClick={onClick}>
      <div className="flex items-center justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', `bg-${color}/10 text-${color}`)}>{icon}</div>
        {trend && (
          <span className={cn('flex items-center gap-0.5 text-[11px] font-bold', trend > 0 ? 'text-success' : 'text-error')}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend > 0 ? '+' : ''}{trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-navy-dark" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{value}</p>
      <p className="text-xs text-text-muted mt-0.5">{label}</p>
      {trendLabel && <p className="text-[10px] text-text-muted mt-1">{trendLabel}</p>}
    </motion.div>
  );
}

/* ── Custom Tooltip ── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface rounded-lg border border-border/60 shadow-lg px-3 py-2">
      <p className="text-xs font-bold text-text-primary">{label}</p>
      <p className="text-xs text-deep-teal font-mono">{payload[0].value} sessions</p>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentDoctor, patients, sessions } = useDoctor();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('7');

  /* ── Derived data ── */
  const completedSessions = useMemo(() => sessions.filter((s) => s.status === 'completed'), [sessions]);
  const activeSessions = useMemo(() => sessions.filter((s) => s.status === 'in-progress'), [sessions]);

  const recentSessions = useMemo(() => {
    const cutoff = Date.now() - parseInt(timeFilter) * 86400000;
    return completedSessions
      .filter((s) => new Date(s.sessionDate).getTime() > cutoff)
      .sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate))
      .slice(0, 5);
  }, [completedSessions, timeFilter]);

  const avgRiskScore = useMemo(() => {
    const scored = completedSessions.filter((s) => s.overallReport);
    if (!scored.length) return 0;
    return +(scored.reduce((a, s) => a + s.overallReport.riskScore, 0) / scored.length).toFixed(1);
  }, [completedSessions]);

  const weekSessions = useMemo(() => {
    const cutoff = Date.now() - 7 * 86400000;
    return completedSessions.filter((s) => new Date(s.sessionDate).getTime() > cutoff).length;
  }, [completedSessions]);

  /* ── Risk distribution for pie chart ── */
  const riskDistribution = useMemo(() => {
    const latest = {};
    completedSessions.forEach((s) => {
      if (s.overallReport && (!latest[s.patientId] || new Date(s.sessionDate) > new Date(latest[s.patientId].sessionDate))) {
        latest[s.patientId] = s;
      }
    });
    const vals = Object.values(latest);
    return [
      { name: 'Healthy', value: vals.filter((s) => s.overallReport.riskScore <= 30).length, fill: '#2ecc71' },
      { name: 'Mild', value: vals.filter((s) => s.overallReport.riskScore > 30 && s.overallReport.riskScore <= 60).length, fill: '#f39c12' },
      { name: 'High Risk', value: vals.filter((s) => s.overallReport.riskScore > 60).length, fill: '#e74c3c' },
    ].filter((d) => d.value > 0);
  }, [completedSessions]);

  /* ── Sessions over time for area chart ── */
  const sessionVolume = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleString('en-US', { month: 'short' });
      const count = completedSessions.filter((s) => {
        const sd = new Date(s.sessionDate);
        return sd.getMonth() === d.getMonth() && sd.getFullYear() === d.getFullYear();
      }).length;
      months.push({ month: label, sessions: count });
    }
    return months;
  }, [completedSessions]);

  /* ── Follow-up needed ── */
  const followUpPatients = useMemo(() => {
    return patients.filter((p) => {
      if (!p.lastSessionDate) return true;
      const daysSince = (Date.now() - new Date(p.lastSessionDate).getTime()) / 86400000;
      if (daysSince > 90) return true;
      const latestSession = completedSessions.find((s) => s.patientId === p.id && s.overallReport);
      if (latestSession && latestSession.overallReport.riskScore > 50) return true;
      return false;
    }).slice(0, 4);
  }, [patients, completedSessions]);

  /* ── Filtered patients ── */
  const filteredPatients = useMemo(() => {
    if (!searchQuery) return patients.slice(0, 6);
    return patients.filter((p) => p.fullName.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6);
  }, [patients, searchQuery]);

  const doctorName = currentDoctor?.fullName?.replace('Dr. ', '') || 'Doctor';

  return (
    <motion.div variants={stagger.container} initial="hidden" animate="visible" className="p-5 lg:p-7 space-y-6">

      {/* ── Active Session Banner ── */}
      {activeSessions.length > 0 && (
        <motion.div variants={stagger.item} className="bg-warning/8 border border-warning/20 rounded-xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <p className="text-sm font-medium text-text-primary"><span className="text-warning font-bold">{activeSessions.length} session(s)</span> in progress</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => navigate('/patients')}>View</Button>
        </motion.div>
      )}

      {/* ── Header ── */}
      <motion.div variants={stagger.item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-dark">{getGreeting()}, Dr. {doctorName.split(' ').pop()}</h1>
          <p className="text-sm text-text-muted mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <Button leftIcon={<UserPlus size={16} />} onClick={() => navigate('/patients/add')}>Add New Patient</Button>
      </motion.div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={20} />} label="Total Patients" value={patients.length} trend={3} trendLabel="+3 this month" />
        <StatCard icon={<Activity size={20} />} label="Active Sessions" value={activeSessions.length} trendLabel="In progress now" color="warning" onClick={() => navigate('/patients')} />
        <StatCard icon={<Calendar size={20} />} label="Sessions This Week" value={weekSessions} trend={4} trendLabel="vs last week" color="sage" />
        <StatCard icon={avgRiskScore > 40 ? <TrendingUp size={20} /> : <TrendingDown size={20} />} label="Avg Risk Score" value={avgRiskScore} color={riskColor(avgRiskScore)} trendLabel="Across all patients" />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Left — Recent Sessions */}
        <motion.div variants={stagger.item} className="lg:col-span-7 bg-surface rounded-xl border border-border/60 shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-navy-dark">Recent Assessments</h2>
            <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="text-xs border border-border rounded-lg px-2 py-1 bg-transparent outline-none cursor-pointer">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="365">All time</option>
            </select>
          </div>
          {recentSessions.length === 0 ? (
            <p className="text-sm text-text-muted py-6 text-center">No sessions in this period.</p>
          ) : (
            <div className="space-y-2">
              {recentSessions.map((s) => {
                const patient = patients.find((p) => p.id === s.patientId);
                const score = s.overallReport?.riskScore ?? '-';
                return (
                  <div key={s.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-deep-teal/8 flex items-center justify-center text-[10px] font-bold text-deep-teal shrink-0">
                        {patient?.fullName?.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      </div>
                      <div className="min-w-0">
                        <Link to={`/patients/${s.patientId}`} className="text-sm font-semibold text-text-primary hover:text-deep-teal transition-colors truncate block">{patient?.fullName}</Link>
                        <p className="text-[10px] text-text-muted">{timeAgo(s.sessionDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={cn('text-sm font-mono font-bold', `text-${riskColor(score)}`)}>{score}</span>
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', s.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>
                        {s.status === 'completed' ? 'Done' : 'In Progress'}
                      </span>
                      <button className="p-1 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => navigate(`/session/report/${s.id}`)}>
                        <FileText size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Link to="/history" className="flex items-center gap-1 text-xs font-semibold text-deep-teal mt-4 hover:underline">View All Sessions <ChevronRight size={12} /></Link>
        </motion.div>

        {/* Right column */}
        <div className="lg:col-span-5 space-y-5">
          {/* Follow-up Needed */}
          <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={16} className="text-warning" />
              <h2 className="text-base font-bold text-navy-dark">Follow-up Needed</h2>
            </div>
            {followUpPatients.length === 0 ? (
              <p className="text-sm text-text-muted py-4 text-center">All patients are up to date!</p>
            ) : (
              <div className="space-y-3">
                {followUpPatients.map((p) => {
                  const latestSession = completedSessions.find((s) => s.patientId === p.id && s.overallReport);
                  const reason = !p.lastSessionDate ? 'No sessions yet' : latestSession?.overallReport?.riskScore > 50 ? `High risk: ${latestSession.overallReport.riskScore}` : `No session in ${Math.floor((Date.now() - new Date(p.lastSessionDate).getTime()) / 86400000)}d`;
                  return (
                    <div key={p.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{p.fullName}</p>
                        <p className="text-[10px] text-warning font-medium">{reason}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/session/setup/${p.id}`)}>
                        <Mic size={12} className="mr-1" /> Session
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-5">
            <h2 className="text-base font-bold text-navy-dark mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <UserPlus size={16} />, label: 'Add Patient', to: '/patients/add' },
                { icon: <BarChart3 size={16} />, label: 'View Reports', to: '/history' },
                { icon: <Activity size={16} />, label: 'Questions', to: '/questions' },
                { icon: <Settings size={16} />, label: 'Settings', to: '/settings' },
              ].map((a) => (
                <Link key={a.to} to={a.to} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/30 hover:bg-muted/60 text-text-primary text-sm font-medium transition-colors">
                  <span className="text-deep-teal">{a.icon}</span> {a.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Risk Distribution */}
        <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-5">
          <h2 className="text-base font-bold text-navy-dark mb-1">Patient Risk Distribution</h2>
          <p className="text-xs text-text-muted mb-4">Based on latest session per patient</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                  {riskDistribution.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-5 mt-2">
            {riskDistribution.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                <span className="text-xs text-text-muted">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sessions Over Time */}
        <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-5">
          <h2 className="text-base font-bold text-navy-dark mb-1">Assessment Volume</h2>
          <p className="text-xs text-text-muted mb-4">Last 6 months</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sessionVolume}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0A7C7C" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#0A7C7C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="sessions" stroke="#0A7C7C" strokeWidth={2} fill="url(#grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ── Patients At a Glance ── */}
      <motion.div variants={stagger.item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-navy-dark">Your Patients</h2>
          <div className="relative w-60">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search patients…" className="w-full h-9 pl-8 pr-3 rounded-lg border border-border/60 bg-muted/30 text-sm outline-none focus:border-deep-teal focus:ring-1 focus:ring-deep-teal/15 transition-all" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((p) => {
            const latestSession = completedSessions.filter((s) => s.patientId === p.id).sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate))[0];
            const score = latestSession?.overallReport?.riskScore;
            return (
              <div key={p.id} className="bg-surface rounded-xl border border-border/60 shadow-card p-4 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deep-teal to-sage flex items-center justify-center text-white text-sm font-bold">
                    {p.fullName.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text-primary truncate">{p.fullName}</p>
                    <p className="text-[10px] text-text-muted">{calcAge(p.dateOfBirth)} • {p.gender === 'male' ? 'M' : 'F'}</p>
                  </div>
                  {score != null && (
                    <span className={cn('ml-auto text-xs font-mono font-bold px-2 py-0.5 rounded-full', `bg-${riskColor(score)}/10 text-${riskColor(score)}`)}>{score}</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span className="flex items-center gap-1"><Clock size={10} /> {p.lastSessionDate ? timeAgo(p.lastSessionDate) : 'No sessions'}</span>
                  <span>{p.totalSessions} sessions</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => navigate(`/patients/${p.id}`)}>View Profile</Button>
              </div>
            );
          })}
        </div>
        <Link to="/patients" className="flex items-center gap-1 text-sm font-semibold text-deep-teal mt-5 hover:underline">View All Patients <ArrowRight size={14} /></Link>
      </motion.div>

    </motion.div>
  );
}
