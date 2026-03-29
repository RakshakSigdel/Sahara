import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, ChevronDown, Copy, Trash2, Edit, MoreHorizontal } from 'lucide-react';
import { useDoctor } from '../../contexts/DoctorContext';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const stagger = { container: { hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }, item: { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } } };

export default function QuestionBankPage() {
  const navigate = useNavigate();
  const { questionBank, deleteQuestion } = useDoctor();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('used');
  const [expanded, setExpanded] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const categories = useMemo(() => ['all', ...new Set(questionBank.map((q) => q.category))], [questionBank]);

  const filtered = useMemo(() => {
    let list = [...questionBank];
    if (search) list = list.filter((q) => q.questionText.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'all') list = list.filter((q) => q.category === category);
    if (sort === 'used') list.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
    if (sort === 'az') list.sort((a, b) => a.questionText.localeCompare(b.questionText));
    if (sort === 'category') list.sort((a, b) => a.category.localeCompare(b.category));
    if (sort === 'difficulty') { const order = { easy: 0, medium: 1, hard: 2 }; list.sort((a, b) => (order[a.difficulty] || 0) - (order[b.difficulty] || 0)); }
    return list;
  }, [questionBank, search, category, sort]);

  return (
    <motion.div variants={stagger.container} initial="hidden" animate="visible" className="p-5 lg:p-7 space-y-6">
      {/* Header */}
      <motion.div variants={stagger.item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-navy-dark">Question Bank</h1>
          <p className="text-sm text-text-muted mt-0.5">Manage assessment questions • {questionBank.length} total</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => navigate('/questions/add')}>Add Custom Question</Button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={stagger.item} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions…" className="w-full h-10 pl-9 pr-3 rounded-lg border border-border/60 bg-muted/30 text-sm outline-none focus:border-deep-teal focus:ring-1 focus:ring-deep-teal/15 transition-all" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 px-3 rounded-lg border border-border/60 bg-surface text-sm outline-none cursor-pointer capitalize">
          {categories.map((c) => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 px-3 rounded-lg border border-border/60 bg-surface text-sm outline-none cursor-pointer">
          <option value="used">Most Used</option>
          <option value="az">A-Z</option>
          <option value="category">Category</option>
          <option value="difficulty">Difficulty</option>
        </select>
      </motion.div>

      {/* Table */}
      <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="text-left py-3 px-3 text-xs font-bold text-text-muted uppercase">Question</th>
                <th className="text-center py-3 px-3 text-xs font-bold text-text-muted uppercase">Category</th>
                <th className="text-center py-3 px-3 text-xs font-bold text-text-muted uppercase">Difficulty</th>
                <th className="text-center py-3 px-3 text-xs font-bold text-text-muted uppercase">Duration</th>
                <th className="text-center py-3 px-3 text-xs font-bold text-text-muted uppercase">Used</th>
                <th className="w-12 py-3 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors group">
                  <td className="py-3 px-3 max-w-[300px]">
                    <div className="flex items-start gap-2">
                      <button onClick={() => setExpanded(expanded === q.id ? null : q.id)} className="cursor-pointer mt-0.5"><ChevronDown size={14} className={cn('text-text-muted transition-transform', expanded === q.id && 'rotate-180')} /></button>
                      <div>
                        <p className={cn('text-text-primary font-medium', expanded !== q.id && 'truncate max-w-[280px]')}>{q.questionText}</p>
                        {q.isDefault && <span className="inline-block text-[9px] font-bold text-deep-teal bg-deep-teal/8 px-1.5 py-0.5 rounded-full mt-1">Default</span>}
                        {!q.isDefault && <span className="inline-block text-[9px] font-bold text-sage bg-sage/10 px-1.5 py-0.5 rounded-full mt-1">Custom</span>}
                        {expanded === q.id && q.suggestedPrompts && <p className="text-xs text-text-muted mt-2 italic">Prompt: {q.suggestedPrompts}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center"><span className="text-xs font-medium text-text-secondary capitalize">{q.category}</span></td>
                  <td className="py-3 px-3 text-center">
                    <span className={cn('inline-block text-[10px] font-bold px-2 py-0.5 rounded-full capitalize', q.difficulty === 'easy' ? 'bg-success/10 text-success' : q.difficulty === 'medium' ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error')}>{q.difficulty}</span>
                  </td>
                  <td className="py-3 px-3 text-center text-text-muted">{q.expectedDuration}s</td>
                  <td className="py-3 px-3 text-center font-mono text-text-secondary">{q.usageCount || 0}</td>
                  <td className="py-3 px-3 relative">
                    <button onClick={() => setMenuOpen(menuOpen === q.id ? null : q.id)} className="p-1 text-text-muted hover:text-text-primary cursor-pointer"><MoreHorizontal size={16} /></button>
                    {menuOpen === q.id && (
                      <div className="absolute right-3 top-10 w-36 bg-surface rounded-lg border border-border/60 shadow-xl z-20 py-1">
                        {!q.isDefault && <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2 cursor-pointer" onClick={() => { setMenuOpen(null); }}><Edit size={12} /> Edit</button>}
                        <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2 cursor-pointer" onClick={() => setMenuOpen(null)}><Copy size={12} /> Duplicate</button>
                        {!q.isDefault && <><hr className="my-1 border-border/40" /><button className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error/5 flex items-center gap-2 cursor-pointer" onClick={() => { deleteQuestion(q.id); setMenuOpen(null); }}><Trash2 size={12} /> Delete</button></>}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border/40 text-xs text-text-muted">{filtered.length} question{filtered.length !== 1 ? 's' : ''}</div>
      </motion.div>
    </motion.div>
  );
}
