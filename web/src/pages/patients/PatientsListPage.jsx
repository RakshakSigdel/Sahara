import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, Grid3X3, List, UserPlus, MoreHorizontal, Trash2, Download, Users, ChevronDown, Clock, Mic } from 'lucide-react';
import { useDoctor } from '../../contexts/DoctorContext';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const stagger = { container: { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }, item: { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } } };

function calcAge(dob) { return Math.floor((Date.now() - new Date(dob).getTime()) / 31557600000); }
function timeAgo(d) { if (!d) return 'Never'; const diff = (Date.now() - new Date(d).getTime()) / 86400000; if (diff < 1) return 'Today'; if (diff < 2) return 'Yesterday'; if (diff < 30) return `${Math.floor(diff)}d ago`; return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function riskColor(s) { if (s == null) return 'text-muted'; if (s <= 30) return 'success'; if (s <= 60) return 'warning'; return 'error'; }
function riskLabel(s) { if (s == null) return '—'; if (s <= 30) return 'Healthy'; if (s <= 60) return 'Mild'; return 'High Risk'; }

export default function PatientsListPage() {
  const navigate = useNavigate();
  const { patients, sessions, deletePatient } = useDoctor();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('lastSession');
  const [view, setView] = useState('table');
  const [selected, setSelected] = useState(new Set());
  const [menuOpen, setMenuOpen] = useState(null);

  const completedSessions = useMemo(() => sessions.filter((s) => s.status === 'completed'), [sessions]);

  const getLatestScore = (patientId) => {
    const s = completedSessions.filter((s) => s.patientId === patientId && s.overallReport).sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate))[0];
    return s?.overallReport?.riskScore ?? null;
  };

  const filtered = useMemo(() => {
    let list = [...patients];
    if (search) list = list.filter((p) => p.fullName.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search) || p.phone.includes(search));
    if (filter === 'highRisk') list = list.filter((p) => getLatestScore(p.id) > 50);
    if (filter === 'followUp') list = list.filter((p) => !p.lastSessionDate || (Date.now() - new Date(p.lastSessionDate).getTime()) / 86400000 > 90);
    if (filter === 'new') list = list.filter((p) => (Date.now() - new Date(p.addedDate).getTime()) / 86400000 < 30);
    list.sort((a, b) => {
      if (sort === 'name') return a.fullName.localeCompare(b.fullName);
      if (sort === 'risk') return (getLatestScore(b.id) ?? -1) - (getLatestScore(a.id) ?? -1);
      if (sort === 'added') return new Date(b.addedDate) - new Date(a.addedDate);
      return new Date(b.lastSessionDate || 0) - new Date(a.lastSessionDate || 0);
    });
    return list;
  }, [patients, search, filter, sort, completedSessions]);

  const toggleSelect = (id) => setSelected((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll = () => setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map((p) => p.id)));

  return (
    <motion.div variants={stagger.container} initial="hidden" animate="visible" className="p-5 lg:p-7 space-y-6">
      {/* Header */}
      <motion.div variants={stagger.item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-navy-dark">Patients</h1>
          <p className="text-sm text-text-muted mt-0.5">Manage and track all your patients</p>
        </div>
        <Button leftIcon={<UserPlus size={16} />} onClick={() => navigate('/patients/add')}>Add New Patient</Button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={stagger.item} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, ID, or phone…" className="w-full h-10 pl-9 pr-3 rounded-lg border border-border/60 bg-muted/30 text-sm outline-none focus:border-deep-teal focus:ring-1 focus:ring-deep-teal/15 transition-all" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 px-3 rounded-lg border border-border/60 bg-surface text-sm outline-none cursor-pointer">
          <option value="all">All Patients</option>
          <option value="highRisk">High Risk</option>
          <option value="followUp">Need Follow-up</option>
          <option value="new">New (&lt;30 days)</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 px-3 rounded-lg border border-border/60 bg-surface text-sm outline-none cursor-pointer">
          <option value="lastSession">Last Session</option>
          <option value="name">Name A-Z</option>
          <option value="risk">Risk Score</option>
          <option value="added">Date Added</option>
        </select>
        <div className="flex border border-border/60 rounded-lg overflow-hidden">
          <button onClick={() => setView('table')} className={cn('p-2.5 transition-colors cursor-pointer', view === 'table' ? 'bg-deep-teal/10 text-deep-teal' : 'bg-surface text-text-muted hover:bg-muted/50')}><List size={16} /></button>
          <button onClick={() => setView('grid')} className={cn('p-2.5 transition-colors cursor-pointer', view === 'grid' ? 'bg-deep-teal/10 text-deep-teal' : 'bg-surface text-text-muted hover:bg-muted/50')}><Grid3X3 size={16} /></button>
        </div>
      </motion.div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-deep-teal/5 border border-deep-teal/15">
          <span className="text-sm font-medium text-deep-teal">{selected.size} selected</span>
          <button className="text-xs font-medium text-error hover:underline cursor-pointer" onClick={() => { selected.forEach((id) => deletePatient(id)); setSelected(new Set()); }}>Delete Selected</button>
          <button className="text-xs font-medium text-deep-teal hover:underline cursor-pointer">Export Selected</button>
          <button className="ml-auto text-xs text-text-muted hover:underline cursor-pointer" onClick={() => setSelected(new Set())}>Clear</button>
        </motion.div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Users size={48} className="mx-auto text-text-muted/40 mb-4" />
          <h3 className="text-lg font-bold text-navy-dark mb-1">No Patients {search || filter !== 'all' ? 'Found' : 'Yet'}</h3>
          <p className="text-sm text-text-muted mb-5">{search || filter !== 'all' ? 'Try adjusting your filters.' : 'Add your first patient to start conducting assessments.'}</p>
          {filter === 'all' && !search && <Button onClick={() => navigate('/patients/add')}>Add Patient</Button>}
        </div>
      )}

      {/* TABLE VIEW */}
      {filtered.length > 0 && view === 'table' && (
        <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="w-10 py-3 px-3"><input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded cursor-pointer" /></th>
                  <th className="text-left py-3 px-3 text-xs font-bold text-text-muted uppercase">Patient</th>
                  <th className="text-left py-3 px-3 text-xs font-bold text-text-muted uppercase">Age/Gender</th>
                  <th className="text-left py-3 px-3 text-xs font-bold text-text-muted uppercase">Added</th>
                  <th className="text-center py-3 px-3 text-xs font-bold text-text-muted uppercase">Sessions</th>
                  <th className="text-left py-3 px-3 text-xs font-bold text-text-muted uppercase">Last Session</th>
                  <th className="text-center py-3 px-3 text-xs font-bold text-text-muted uppercase">Risk Score</th>
                  <th className="w-12 py-3 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const score = getLatestScore(p.id);
                  return (
                    <tr key={p.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors cursor-pointer group" onClick={() => navigate(`/patients/${p.id}`)}>
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} className="w-4 h-4 rounded cursor-pointer" /></td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-deep-teal to-sage flex items-center justify-center text-white text-xs font-bold shrink-0">{p.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                          <div><p className="font-semibold text-text-primary group-hover:text-deep-teal transition-colors">{p.fullName}</p><p className="text-[10px] text-text-muted">{p.id}</p></div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-text-secondary">{calcAge(p.dateOfBirth)} • {p.gender === 'male' ? 'M' : 'F'}</td>
                      <td className="py-3 px-3 text-text-secondary">{new Date(p.addedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="py-3 px-3 text-center text-text-secondary">{p.totalSessions}</td>
                      <td className="py-3 px-3 text-text-secondary">{timeAgo(p.lastSessionDate)}</td>
                      <td className="py-3 px-3 text-center">
                        {score != null ? <span className={cn('inline-block text-xs font-bold px-2.5 py-1 rounded-full', `bg-${riskColor(score)}/10 text-${riskColor(score)}`)}>{score} • {riskLabel(score)}</span> : <span className="text-text-muted text-xs">—</span>}
                      </td>
                      <td className="py-3 px-3 relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)} className="p-1 text-text-muted hover:text-text-primary cursor-pointer"><MoreHorizontal size={16} /></button>
                        {menuOpen === p.id && (
                          <div className="absolute right-3 top-10 w-40 bg-surface rounded-lg border border-border/60 shadow-xl z-20 py-1">
                            <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 cursor-pointer" onClick={() => { navigate(`/patients/${p.id}`); setMenuOpen(null); }}>View Profile</button>
                            <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 cursor-pointer" onClick={() => { navigate(`/patients/${p.id}/edit`); setMenuOpen(null); }}>Edit</button>
                            <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 cursor-pointer" onClick={() => { navigate(`/session/setup/${p.id}`); setMenuOpen(null); }}>New Session</button>
                            <hr className="my-1 border-border/40" />
                            <button className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error/5 cursor-pointer" onClick={() => { deletePatient(p.id); setMenuOpen(null); }}>Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/40">
            <span className="text-xs text-text-muted">Showing {filtered.length} patient{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </motion.div>
      )}

      {/* GRID VIEW */}
      {filtered.length > 0 && view === 'grid' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const score = getLatestScore(p.id);
            return (
              <motion.div key={p.id} variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer" onClick={() => navigate(`/patients/${p.id}`)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-deep-teal to-sage flex items-center justify-center text-white text-xl font-bold">{p.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                  {score != null && <span className={cn('text-sm font-mono font-bold px-2.5 py-1 rounded-full', `bg-${riskColor(score)}/10 text-${riskColor(score)}`)}>{score}</span>}
                </div>
                <h3 className="text-base font-bold text-navy-dark">{p.fullName}</h3>
                <p className="text-xs text-text-muted mt-0.5">{calcAge(p.dateOfBirth)} • {p.gender === 'male' ? 'Male' : 'Female'} • {p.id}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                  <span className="flex items-center gap-1"><Clock size={11} />{timeAgo(p.lastSessionDate)}</span>
                  <span>{p.totalSessions} sessions</span>
                </div>
                <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/patients/${p.id}`)}>View</Button>
                  <Button size="sm" className="flex-1" onClick={() => navigate(`/session/setup/${p.id}`)}><Mic size={12} className="mr-1" />Session</Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
