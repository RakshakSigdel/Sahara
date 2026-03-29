import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDoctor } from '../../contexts/DoctorContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { cn } from '../../utils/cn';

const stagger = { container: { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }, item: { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } } };

export default function AddQuestionPage() {
  const navigate = useNavigate();
  const { addQuestion } = useDoctor();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { questionText: '', category: 'memory', difficulty: 'medium', expectedDuration: 60, suggestedPrompts: '', notes: '' },
  });

  const watched = watch();

  const onSubmit = (data) => {
    addQuestion({ ...data, expectedDuration: Number(data.expectedDuration) });
    navigate('/questions');
  };

  return (
    <motion.div variants={stagger.container} initial="hidden" animate="visible" className="p-5 lg:p-7">
      <div className="max-w-[640px] mx-auto">
        <motion.div variants={stagger.item} className="mb-6">
          <button onClick={() => navigate('/questions')} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-4 cursor-pointer"><ArrowLeft size={16} /> Back to Question Bank</button>
          <h1 className="text-2xl font-bold text-navy-dark">Add Custom Question</h1>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Question Text *</label>
              <textarea rows={3} placeholder="What would you like the patient to describe or explain?" className="w-full rounded-lg border border-border/60 px-3 py-2.5 text-sm outline-none focus:border-deep-teal focus:ring-1 focus:ring-deep-teal/15 transition-all resize-none" {...register('questionText', { required: 'Question text is required' })} />
              {errors.questionText && <p className="text-xs text-error mt-1">{errors.questionText.message}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Category *</label>
                <select className="w-full h-10 rounded-lg border border-border/60 px-3 text-sm outline-none cursor-pointer bg-transparent capitalize" {...register('category', { required: true })}>
                  {['memory', 'cognition', 'language', 'orientation', 'custom'].map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Expected Duration (seconds) *</label>
                <input type="number" min={10} max={300} className="w-full h-10 rounded-lg border border-border/60 px-3 text-sm outline-none focus:border-deep-teal" {...register('expectedDuration', { required: true, min: 10 })} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Difficulty</label>
              <div className="flex gap-3">
                {[
                  { value: 'easy', label: 'Easy', desc: 'Simple recall', color: 'success' },
                  { value: 'medium', label: 'Medium', desc: 'Some processing', color: 'warning' },
                  { value: 'hard', label: 'Hard', desc: 'Complex reasoning', color: 'error' },
                ].map((d) => (
                  <label key={d.value} className={cn('flex-1 p-3 rounded-lg border cursor-pointer transition-all text-center', watched.difficulty === d.value ? `border-${d.color} bg-${d.color}/5` : 'border-border/60 hover:border-border')}>
                    <input type="radio" value={d.value} {...register('difficulty')} className="sr-only" />
                    <p className={cn('text-sm font-bold', `text-${d.color}`)}>{d.label}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{d.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Suggested Prompts <span className="text-text-muted">(optional)</span></label>
              <textarea rows={2} placeholder="If patient struggles, you can prompt with…" className="w-full rounded-lg border border-border/60 px-3 py-2.5 text-sm outline-none focus:border-deep-teal focus:ring-1 focus:ring-deep-teal/15 transition-all resize-none" {...register('suggestedPrompts')} />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Notes <span className="text-text-muted">(optional)</span></label>
              <textarea rows={2} placeholder="When to use this question, what it assesses, etc." className="w-full rounded-lg border border-border/60 px-3 py-2.5 text-sm outline-none focus:border-deep-teal focus:ring-1 focus:ring-deep-teal/15 transition-all resize-none" {...register('notes')} />
            </div>
          </motion.div>

          {/* Preview */}
          {watched.questionText && (
            <motion.div variants={stagger.item} className="mt-5 bg-muted/20 rounded-xl border border-border/40 p-5">
              <p className="text-xs font-bold text-text-muted mb-3">Preview</p>
              <div className="bg-surface rounded-lg border border-border/60 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="w-7 h-7 rounded-full bg-deep-teal/10 flex items-center justify-center text-deep-teal text-[10px] font-bold">#?</span>
                  <span className="text-[9px] font-bold text-deep-teal bg-deep-teal/8 px-2 py-0.5 rounded-full uppercase">{watched.category}</span>
                </div>
                <p className="text-base font-semibold text-navy-dark">{watched.questionText}</p>
                <p className="text-xs text-text-muted mt-2">~{watched.expectedDuration}s • {watched.difficulty}</p>
              </div>
            </motion.div>
          )}

          <motion.div variants={stagger.item} className="flex justify-end gap-3 mt-5">
            <Button variant="ghost" type="button" onClick={() => navigate('/questions')}>Cancel</Button>
            <Button type="submit">Save Question</Button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}
