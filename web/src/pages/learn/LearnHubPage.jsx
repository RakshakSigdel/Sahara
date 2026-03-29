import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, AlertTriangle, Shield, Heart, BarChart3, Clock,
  ChevronDown, Search, ArrowRight, Download, Share2,
  Mic, Activity, BookOpen, Users, Globe, Stethoscope,
  Eye, Zap, CheckCircle, HelpCircle, FileText,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

/* ── Accordion ── */
function Accordion({ title, children, defaultOpen = false, className }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn('border border-border/60 rounded-lg overflow-hidden bg-surface', className)}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-muted/30 transition-colors">
        <span className="text-sm font-semibold text-text-primary">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown size={16} className="text-text-muted" /></motion.div>
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

/* ── Stat Card ── */
function BigStat({ value, label, icon, color = 'deep-teal' }) {
  return (
    <div className="bg-surface rounded-xl border border-border/60 shadow-card p-6 text-center">
      <div className={cn('w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center', `bg-${color}/10 text-${color}`)}>{icon}</div>
      <p className="text-3xl md:text-4xl font-extrabold text-navy-dark" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{value}</p>
      <p className="text-xs text-text-muted mt-1 font-medium">{label}</p>
    </div>
  );
}

/* ── Topic Card ── */
function TopicCard({ icon, title, children, color = 'deep-teal' }) {
  return (
    <div className="bg-surface rounded-xl border border-border/60 shadow-card p-6">
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-4', `bg-${color}/10 text-${color}`)}>{icon}</div>
      <h3 className="text-lg font-bold text-navy-dark mb-3">{title}</h3>
      <div className="text-sm text-text-secondary leading-relaxed">{children}</div>
    </div>
  );
}

/* ── Bottom CTA ── */
function BottomCTA() {
  return (
    <div className="mt-12 rounded-xl p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(10,124,124,0.06) 0%, rgba(168,213,181,0.08) 100%)' }}>
      <h3 className="text-xl font-bold text-navy-dark mb-2">Ready to Take Action?</h3>
      <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">Early detection is the most powerful tool for cognitive health. Start your free screening today.</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" rightIcon={<ArrowRight size={16} />} onClick={() => window.location.href = '/screen/consent'}>Start Free Screening</Button>
        <Button variant="outline">Find a Specialist</Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TAB CONTENT
   ═══════════════════════════════════════════ */

function OverviewTab() {
  return (
    <motion.div variants={stagger.container} initial="hidden" animate="visible">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div variants={stagger.item}>
          <TopicCard icon={<Brain size={22} />} title="What is Dementia?" color="deep-teal">
            <p className="mb-3">Dementia is a general term for a decline in mental ability severe enough to interfere with daily life. It is not a single disease but an umbrella term covering a range of conditions.</p>
            <Accordion title="Learn About Types" className="mt-3">
              <ul className="space-y-2 mt-1">
                <li><b>Alzheimer's Disease</b> — Most common (60-80% of cases), affects memory and thinking</li>
                <li><b>Vascular Dementia</b> — Caused by reduced blood flow to the brain</li>
                <li><b>Lewy Body Dementia</b> — Abnormal protein deposits affect brain chemistry</li>
                <li><b>Frontotemporal Dementia</b> — Affects personality and language first</li>
              </ul>
            </Accordion>
          </TopicCard>
        </motion.div>

        <motion.div variants={stagger.item}>
          <TopicCard icon={<AlertTriangle size={22} />} title="Warning Signs" color="warning">
            <ul className="space-y-2">
              {['Memory loss affecting daily life', 'Difficulty planning or problem-solving', 'Confusion with time or place', 'Trouble with visual images and spatial relationships', 'Problems with words in speaking or writing', 'Misplacing things and losing ability to retrace steps', 'Decreased or poor judgment', 'Withdrawal from work or social activities', 'Changes in mood and personality'].map((s, i) => (
                <li key={i} className="flex items-start gap-2"><span className="text-warning mt-0.5 shrink-0">•</span> {s}</li>
              ))}
            </ul>
          </TopicCard>
        </motion.div>

        <motion.div variants={stagger.item}>
          <TopicCard icon={<Shield size={22} />} title="Risk Factors" color="info">
            <h4 className="text-xs font-bold uppercase tracking-wider text-success mb-2">Modifiable (You Can Change)</h4>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {['Physical inactivity', 'Smoking', 'Poor diet', 'Excess alcohol', 'Social isolation', 'Sleep issues', 'Hearing loss', 'Depression'].map((f) => (
                <span key={f} className="px-2 py-1 rounded-full text-[10px] font-semibold bg-success/8 text-success border border-success/15">{f}</span>
              ))}
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Non-Modifiable</h4>
            <div className="flex flex-wrap gap-1.5">
              {['Age (65+)', 'Family history', 'Genetics (APOE-e4)', 'Down syndrome'].map((f) => (
                <span key={f} className="px-2 py-1 rounded-full text-[10px] font-semibold bg-muted text-text-muted">{f}</span>
              ))}
            </div>
          </TopicCard>
        </motion.div>

        <motion.div variants={stagger.item}>
          <TopicCard icon={<Heart size={22} />} title="Prevention" color="coral">
            <p className="mb-3">Up to 40% of dementia cases may be prevented or delayed by addressing modifiable risk factors.</p>
            <div className="space-y-2">
              {[
                { label: 'Exercise regularly (150 min/week)', done: false },
                { label: 'Mediterranean-style diet', done: false },
                { label: 'Stay socially active', done: false },
                { label: 'Get quality sleep (7-9 hrs)', done: false },
                { label: 'Challenge your brain daily', done: false },
                { label: 'Manage blood pressure', done: false },
              ].map((tip, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-border-strong text-deep-teal" />
                  <span className="text-sm">{tip.label}</span>
                </label>
              ))}
            </div>
          </TopicCard>
        </motion.div>
      </div>
      <BottomCTA />
    </motion.div>
  );
}

function StagesTab() {
  const stages = [
    { n: 1, name: 'No Impairment', duration: 'Normal function', color: 'success', chars: ['Memory and cognitive abilities appear entirely normal', 'No noticeable symptoms to the individual or their loved ones'] },
    { n: 2, name: 'Very Mild Decline', duration: 'May last years', color: 'success', chars: ['Occasional memory lapses, such as forgetting familiar words or locations', 'Often dismissed as normal aging', 'No symptoms detected during medical examination'] },
    { n: 3, name: 'Mild Decline', duration: 'Early-stage, 2-7 years', color: 'warning', chars: ['Friends and family notice difficulties', 'Problems finding the right word', 'Difficulty remembering names of new acquaintances', 'Noticeable performance issues in social/work settings'] },
    { n: 4, name: 'Moderate Decline', duration: 'Mid-stage, ~2 years', color: 'warning', chars: ['Clear-cut symptoms visible in careful interview', 'Decreased knowledge of recent events', 'Impaired ability to handle finances or travel', 'May withdraw from challenging situations'] },
    { n: 5, name: 'Moderately Severe Decline', duration: 'Mid-stage, ~1.5 years', color: 'warning', chars: ['Major gaps in memory, need assistance with daily activities', 'Unable to recall key details like address or phone number', 'May need help choosing appropriate clothing', 'Still remember own name and close family'] },
    { n: 6, name: 'Severe Decline', duration: 'Late-stage, ~2.5 years', color: 'error', chars: ['Memory continues to worsen, personality changes emerge', 'Need extensive help with daily activities', 'Losing awareness of recent experiences and surroundings', 'May wander and get lost'] },
    { n: 7, name: 'Very Severe Decline', duration: 'Late-stage, 1-2.5 years', color: 'error', chars: ['Final stage, loss of ability to respond or communicate', 'Need help with all activities of daily living', 'May lose ability to walk, sit up, or swallow', 'Require full-time care'] },
  ];

  return (
    <motion.div variants={stagger.container} initial="hidden" animate="visible">
      <p className="text-sm text-text-secondary mb-8 max-w-2xl">The Global Deterioration Scale outlines 7 stages of cognitive decline, from no impairment to very severe. Understanding these stages helps families prepare and plan care.</p>
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border/60 hidden md:block" />
        <div className="space-y-4">
          {stages.map((s, i) => (
            <motion.div key={i} variants={stagger.item} className="flex gap-5 md:gap-6">
              <div className="hidden md:flex flex-col items-center shrink-0 w-12">
                <div className={cn('w-12 h-12 rounded-full border-2 flex items-center justify-center z-10 bg-surface text-lg font-bold', `border-${s.color} text-${s.color}`)}>
                  {s.n}
                </div>
              </div>
              <div className="flex-1">
                <Accordion title={<span className="flex items-center gap-2"><span className={cn('md:hidden w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center border', `border-${s.color} text-${s.color}`)}>{s.n}</span>{s.name} <span className="text-xs font-normal text-text-muted">({s.duration})</span></span>} defaultOpen={i === 0}>
                  <ul className="space-y-1.5 mt-1">
                    {s.chars.map((c, j) => (
                      <li key={j} className="flex items-start gap-2"><span className={cn('mt-1 shrink-0 w-1.5 h-1.5 rounded-full', `bg-${s.color}`)} />{c}</li>
                    ))}
                  </ul>
                </Accordion>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomCTA />
    </motion.div>
  );
}

function StatisticsTab() {
  return (
    <motion.div variants={stagger.container} initial="hidden" animate="visible">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div variants={stagger.item}><BigStat value="55M" label="Living with dementia globally" icon={<Users size={18} />} /></motion.div>
        <motion.div variants={stagger.item}><BigStat value="10M" label="New cases every year" icon={<Activity size={18} />} color="warning" /></motion.div>
        <motion.div variants={stagger.item}><BigStat value="152M" label="Projected by 2050" icon={<BarChart3 size={18} />} color="coral" /></motion.div>
        <motion.div variants={stagger.item}><BigStat value="$1.3T" label="Annual global cost" icon={<Globe size={18} />} color="info" /></motion.div>
      </div>

      <motion.div variants={stagger.item} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-surface rounded-xl border border-border/60 shadow-card p-6">
          <h3 className="text-base font-bold text-navy-dark mb-4">Age Distribution</h3>
          <div className="space-y-3">
            {[{ age: '65-74', pct: 5, w: '5%' }, { age: '75-84', pct: 13.1, w: '13%' }, { age: '85+', pct: 33.2, w: '33%' }].map((d) => (
              <div key={d.age} className="space-y-1">
                <div className="flex justify-between text-xs"><span className="font-medium text-text-primary">{d.age} years</span><span className="text-text-muted">{d.pct}%</span></div>
                <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-deep-teal rounded-full" style={{ width: d.w }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border/60 shadow-card p-6">
          <h3 className="text-base font-bold text-navy-dark mb-4">Caregiver Impact</h3>
          <div className="space-y-4">
            {[
              { stat: '16M+', label: 'Unpaid caregivers in the US' },
              { stat: '18.4B', label: 'Hours of unpaid care annually' },
              { stat: '40%', label: 'Of caregivers report depression' },
              { stat: '$350K', label: 'Average lifetime cost of care' },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl font-bold text-navy-dark shrink-0 w-16" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{c.stat}</span>
                <span className="text-xs text-text-muted">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <BottomCTA />
    </motion.div>
  );
}

function MentalHealthTab() {
  return (
    <motion.div variants={stagger.container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={stagger.item}>
        <TopicCard icon={<Brain size={22} />} title="The Connection" color="deep-teal">
          <p className="mb-2">Depression and dementia share a complex relationship. Depression can be both a risk factor for and a symptom of cognitive decline. Studies show people with depression have a 65% increased risk of developing dementia.</p>
          <p>Anxiety, stress, and social isolation also contribute to accelerated cognitive decline, making mental health care an essential component of brain health strategies.</p>
        </TopicCard>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div variants={stagger.item}>
          <TopicCard icon={<Users size={22} />} title="Impact on Patients" color="warning">
            <ul className="space-y-2">
              {['Fear and anxiety about the future', 'Depression and hopelessness', 'Social withdrawal and isolation', 'Loss of identity and self-worth', 'Frustration with declining abilities', 'Difficulty expressing emotions'].map((s, i) => (
                <li key={i} className="flex items-start gap-2"><span className="text-warning mt-0.5">•</span>{s}</li>
              ))}
            </ul>
          </TopicCard>
        </motion.div>
        <motion.div variants={stagger.item}>
          <TopicCard icon={<Heart size={22} />} title="Impact on Caregivers" color="coral">
            <ul className="space-y-2">
              {['59% report high emotional stress', '40% experience clinical depression', 'Higher risk of chronic health conditions', 'Financial strain from care costs', 'Social isolation from care duties', 'Guilt, grief, and burnout'].map((s, i) => (
                <li key={i} className="flex items-start gap-2"><span className="text-coral mt-0.5">•</span>{s}</li>
              ))}
            </ul>
          </TopicCard>
        </motion.div>
      </div>

      <motion.div variants={stagger.item}>
        <div className="bg-surface rounded-xl border border-border/60 shadow-card p-6">
          <h3 className="text-base font-bold text-navy-dark mb-4">Support Resources</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: <HelpCircle size={16} />, title: 'Alzheimer\'s Helpline', desc: '1-800-272-3900 (24/7)' },
              { icon: <Users size={16} />, title: 'Support Groups', desc: 'Find local & online groups' },
              { icon: <Stethoscope size={16} />, title: 'Find a Specialist', desc: 'Locate a neurologist near you' },
            ].map((r, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                <span className="text-deep-teal">{r.icon}</span>
                <p className="text-sm font-semibold text-text-primary mt-2">{r.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <BottomCTA />
    </motion.div>
  );
}

function ReversibleCausesTab() {
  return (
    <motion.div variants={stagger.container} initial="hidden" animate="visible">
      <div className="bg-success/5 border border-success/15 rounded-xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <CheckCircle size={20} className="text-success shrink-0 mt-0.5" />
          <p className="text-sm text-text-secondary"><b className="text-text-primary">Good news:</b> Not all cognitive decline is permanent. Some causes can be treated and reversed when caught early.</p>
        </div>
      </div>

      <div className="space-y-5">
        <motion.div variants={stagger.item}>
          <TopicCard icon={<Stethoscope size={22} />} title="Medical Conditions" color="info">
            <div className="space-y-3 mt-1">
              {[
                { name: 'Vitamin B12 Deficiency', desc: 'Can cause memory problems, confusion. Diagnosed via blood test, treated with supplements.' },
                { name: 'Thyroid Problems', desc: 'Both hypo- and hyperthyroidism can impair cognition. Simple blood test and medication.' },
                { name: 'Depression', desc: 'Often mimics dementia symptoms. Treatable with therapy and/or medication.' },
                { name: 'Sleep Disorders', desc: 'Sleep apnea significantly impacts cognition. Treatable with CPAP or lifestyle changes.' },
                { name: 'Normal Pressure Hydrocephalus', desc: 'Excess fluid in the brain. Can be relieved with a shunt procedure.' },
              ].map((c, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-semibold text-text-primary">{c.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{c.desc}</p>
                </div>
              ))}
            </div>
          </TopicCard>
        </motion.div>

        <motion.div variants={stagger.item}>
          <TopicCard icon={<Zap size={22} />} title="Medications" color="warning">
            <p className="mb-3">Certain medications can cause cognitive side effects that mimic dementia:</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {['Anticholinergics', 'Benzodiazepines', 'Certain antihistamines', 'Some antidepressants', 'Opioid pain medications'].map((m) => (
                <span key={m} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-warning/8 text-warning border border-warning/15">{m}</span>
              ))}
            </div>
            <p className="text-xs text-warning font-medium">⚠ Always consult your doctor before changing medications.</p>
          </TopicCard>
        </motion.div>

        <motion.div variants={stagger.item}>
          <TopicCard icon={<Heart size={22} />} title="Lifestyle Factors" color="coral">
            <div className="grid grid-cols-2 gap-3 mt-1">
              {[
                { name: 'Excess Alcohol', desc: 'Can damage brain cells directly' },
                { name: 'Sleep Deprivation', desc: 'Prevents brain toxin clearance' },
                { name: 'Dehydration', desc: 'Acute confusion and disorientation' },
                { name: 'Poor Nutrition', desc: 'Deficiencies affect brain function' },
              ].map((f, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-semibold text-text-primary">{f.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{f.desc}</p>
                </div>
              ))}
            </div>
          </TopicCard>
        </motion.div>
      </div>
      <BottomCTA />
    </motion.div>
  );
}

function EarlyDetectionTab() {
  return (
    <motion.div variants={stagger.container} initial="hidden" animate="visible">
      <motion.div variants={stagger.item} className="mb-8">
        <div className="bg-deep-teal/5 border border-deep-teal/15 rounded-xl p-6">
          <h3 className="text-lg font-bold text-navy-dark mb-3">Why Early Detection Matters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <Clock size={16} />, title: 'More Time', desc: 'Plan care, finances, and legal matters while the person can participate' },
              { icon: <Stethoscope size={16} />, title: 'Treatment Options', desc: 'Medications work best in early stages, potentially slowing progression' },
              { icon: <Heart size={16} />, title: 'Quality of Life', desc: 'Lifestyle modifications can significantly impact long-term outcomes' },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-deep-teal/10 flex items-center justify-center shrink-0 text-deep-teal">{b.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{b.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Comparison table */}
      <motion.div variants={stagger.item} className="mb-8">
        <h3 className="text-base font-bold text-navy-dark mb-4">Screening Methods Compared</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-border/60">
                {['Method', 'Accuracy', 'Invasive', 'Cost', 'Access'].map((h) => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-bold text-text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { method: 'Voice-Based (EchoMind)', accuracy: '94-98%', invasive: 'None', cost: 'Free', access: '★★★★★', highlight: true },
                { method: 'Cognitive Tests (MoCA)', accuracy: '90-95%', invasive: 'None', cost: 'Low', access: '★★★★☆' },
                { method: 'Brain MRI', accuracy: '95-98%', invasive: 'Low', cost: 'High', access: '★★☆☆☆' },
                { method: 'PET Scan', accuracy: '95-99%', invasive: 'Moderate', cost: 'Very High', access: '★☆☆☆☆' },
                { method: 'Blood Biomarkers', accuracy: '85-90%', invasive: 'Low', cost: 'Moderate', access: '★★★☆☆' },
              ].map((r, i) => (
                <tr key={i} className={cn('border-b border-border/40', r.highlight && 'bg-deep-teal/4')}>
                  <td className="py-3 px-3 font-semibold text-text-primary">{r.method}</td>
                  <td className="py-3 px-3">{r.accuracy}</td>
                  <td className="py-3 px-3">{r.invasive}</td>
                  <td className="py-3 px-3">{r.cost}</td>
                  <td className="py-3 px-3 text-warning">{r.access}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Steps */}
      <motion.div variants={stagger.item}>
        <h3 className="text-base font-bold text-navy-dark mb-4">What to Do If You're Concerned</h3>
        <div className="space-y-3">
          {[
            { n: 1, title: 'Document Symptoms', desc: 'Keep a log of memory lapses, confusion, and behavioral changes with dates' },
            { n: 2, title: 'Take a Screening Test', desc: 'Use EchoMind for a quick, non-invasive voice-based screening' },
            { n: 3, title: 'Schedule a Doctor Appointment', desc: 'Share your screening results with your primary care physician' },
            { n: 4, title: 'Prepare for Your Visit', desc: 'Bring your symptom log, medication list, and screening results' },
            { n: 5, title: 'Request Comprehensive Evaluation', desc: 'Your doctor may refer you for cognitive testing or brain imaging' },
            { n: 6, title: 'Discuss Results and Next Steps', desc: 'Work with your healthcare team on a care plan based on findings' },
          ].map((step) => (
            <div key={step.n} className="flex items-start gap-4 p-4 rounded-lg bg-surface border border-border/60">
              <div className="w-8 h-8 rounded-full bg-deep-teal/10 flex items-center justify-center shrink-0 text-deep-teal text-sm font-bold">{step.n}</div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{step.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      <BottomCTA />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   TABS CONFIG
   ═══════════════════════════════════════════ */
const tabConfig = [
  { id: 'overview', label: 'Overview', component: OverviewTab },
  { id: 'stages', label: '7 Stages', component: StagesTab },
  { id: 'statistics', label: 'Statistics', component: StatisticsTab },
  { id: 'mental', label: 'Mental Health', component: MentalHealthTab },
  { id: 'reversible', label: 'Reversible Causes', component: ReversibleCausesTab },
  { id: 'detection', label: 'Early Detection', component: EarlyDetectionTab },
];

/* ═══════════════════════════════════════════
   LEARN HUB PAGE
   ═══════════════════════════════════════════ */
export default function LearnHubPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');

  const ActiveComponent = useMemo(() => tabConfig.find((t) => t.id === activeTab)?.component || OverviewTab, [activeTab]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative py-16 md:py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(168,213,181,0.12) 0%, rgba(10,124,124,0.06) 100%)' }}>
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-[44px] font-bold text-navy-dark tracking-tight leading-tight">
            Understanding Dementia
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-3 text-text-secondary max-w-lg mx-auto">
            Knowledge is the first step toward better brain health
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-md mx-auto mt-6 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search topics…" className="w-full h-12 pl-11 pr-4 rounded-xl border border-border/60 bg-surface text-sm outline-none focus:border-deep-teal focus:ring-2 focus:ring-deep-teal/15 transition-all shadow-sm" />
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-6 lg:px-10 py-8 lg:py-12">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-3 mb-8 -mx-2 px-2 scrollbar-hide">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer',
                activeTab === tab.id
                  ? 'bg-deep-teal text-white shadow-sm'
                  : 'text-text-muted hover:text-text-primary hover:bg-muted/50',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
