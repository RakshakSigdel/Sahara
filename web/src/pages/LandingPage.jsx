import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Play, Brain, ChevronDown, Check, Star,
  UserPlus, Mic, FileText, Clock, Target, BarChart3, Workflow,
  Shield, Globe, Monitor, Zap, Users, Activity, Stethoscope,
  CheckCircle, X,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { cn } from '../utils/cn';

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } },
};

const fadeUp = { hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

/* ── Accordion ── */
function FAQ({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/40">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left cursor-pointer group">
        <span className="text-[15px] font-semibold text-navy-dark group-hover:text-deep-teal transition-colors pr-4">{question}</span>
        <ChevronDown size={18} className={cn('text-text-muted shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && <p className="pb-5 text-sm text-text-secondary leading-relaxed -mt-1">{answer}</p>}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-background">

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden pt-8 pb-20 md:pt-12 md:pb-28" style={{ background: 'linear-gradient(180deg, rgba(168,213,181,0.10) 0%, rgba(10,124,124,0.04) 40%, transparent 100%)' }}>
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <motion.div initial="hidden" animate="visible" variants={stagger.container}>
              <motion.div variants={stagger.item} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-deep-teal/8 border border-deep-teal/15 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-deep-teal animate-pulse" />
                <span className="text-xs font-bold text-deep-teal tracking-wide uppercase">Trusted by 500+ Healthcare Professionals</span>
              </motion.div>

              <motion.h1 variants={stagger.item} className="text-[2.5rem] md:text-[3.2rem] leading-[1.1] font-extrabold text-navy-dark tracking-tight">
                Detect Cognitive Decline Earlier with{' '}
                <span className="bg-gradient-to-r from-deep-teal to-sage bg-clip-text text-transparent">Voice Analysis</span>
              </motion.h1>

              <motion.p variants={stagger.item} className="mt-5 text-lg text-text-secondary leading-relaxed max-w-lg">
                AI-powered dementia screening for your practice. Conduct comprehensive assessments in minutes, not hours.
              </motion.p>

              <motion.div variants={stagger.item} className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" rightIcon={<ArrowRight size={16} />} onClick={() => navigate('/auth/signup')}>Start Free Trial</Button>
                <Button variant="outline" size="lg" leftIcon={<Play size={14} />} onClick={() => navigate('/demo')}>Request Demo</Button>
              </motion.div>

              <motion.p variants={stagger.item} className="mt-4 text-xs text-text-muted">
                No credit card required • 14-day free trial • HIPAA compliant
              </motion.p>
            </motion.div>

            {/* Right — Dashboard mockup */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="hidden lg:block relative">
              <div className="relative bg-surface rounded-2xl border border-border/60 shadow-xl p-4 rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex gap-1.5 mb-3"><span className="w-2.5 h-2.5 rounded-full bg-coral/60" /><span className="w-2.5 h-2.5 rounded-full bg-warning/60" /><span className="w-2.5 h-2.5 rounded-full bg-success/60" /></div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-40 h-full bg-muted/50 rounded-lg p-3 space-y-2">
                      {['Dashboard', 'Patients', 'Sessions', 'Questions'].map((l) => (<div key={l} className="text-[10px] text-text-muted py-1">{l}</div>))}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        {[{ n: '24', l: 'Patients', c: 'deep-teal' }, { n: '12', l: 'This Week', c: 'sage' }, { n: '34.5', l: 'Avg Score', c: 'warning' }].map((s) => (
                          <div key={s.l} className="bg-muted/40 rounded-lg p-2.5 text-center">
                            <p className="text-lg font-bold text-navy-dark" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.n}</p>
                            <p className="text-[9px] text-text-muted">{s.l}</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3 h-28">
                        <p className="text-[10px] font-semibold text-text-muted mb-2">Recent Assessments</p>
                        {['Ram B. Thapa — Score 24 ✓', 'Sarita Karki — Score 38 ⚠', 'Maya K. Rai — Score 18 ✓'].map((r) => (
                          <p key={r} className="text-[9px] text-text-secondary py-0.5">{r}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -bottom-4 -left-4 bg-surface rounded-xl border border-border/60 shadow-lg px-3 py-2 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center"><Check size={12} className="text-success" /></div>
                <div><p className="text-[10px] font-bold text-text-primary">HIPAA Compliant</p><p className="text-[8px] text-text-muted">End-to-end encryption</p></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TRUST ═══ */}
      <section className="py-10 border-y border-border/30 bg-muted/20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 text-center">
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">Validated by Leading Research Institutions • Used in 50+ Hospitals Worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 opacity-40">
            {['Nature Medicine', 'The Lancet', 'JAMA Neurology', 'Alzheimer\'s Assoc.', 'WHO'].map((j) => (
              <span key={j} className="text-sm font-bold text-navy-dark">{j}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS (Bento) ═══ */}
      <section className="py-16 md:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger.container} className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div variants={stagger.item} className="col-span-2 row-span-2 bg-gradient-to-br from-deep-teal to-deep-teal-dark rounded-2xl p-8 text-white flex flex-col justify-end">
              <p className="text-5xl md:text-6xl font-extrabold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>98%</p>
              <p className="text-lg font-semibold mt-1 text-white/90">Diagnostic Accuracy</p>
              <p className="text-sm text-white/60 mt-2">Validated across 10,000+ clinical voice samples</p>
            </motion.div>
            {[
              { n: '2 min', l: 'Average Assessment', d: 'From start to report' },
              { n: '500+', l: 'Doctors Trust Sahara', d: 'Across 50+ hospitals' },
              { n: '10K+', l: 'Patients Screened', d: 'And growing monthly' },
            ].map((s, i) => (
              <motion.div key={i} variants={stagger.item} className="bg-surface rounded-2xl border border-border/60 shadow-card p-5 flex flex-col justify-end">
                <p className="text-2xl md:text-3xl font-extrabold text-navy-dark" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.n}</p>
                <p className="text-sm font-semibold text-text-primary mt-1">{s.l}</p>
                <p className="text-xs text-text-muted mt-0.5">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-16 md:py-24 bg-muted/20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger.container} className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <motion.div variants={stagger.item} className="text-center mb-14">
            <p className="text-xs font-bold text-deep-teal uppercase tracking-widest mb-2">Simple Workflow</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-dark">How It Works</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <UserPlus size={24} />, step: '01', title: 'Add Your Patient', desc: 'Quick patient intake with essential medical history. Securely store and manage patient records.' },
              { icon: <Mic size={24} />, step: '02', title: 'Conduct Voice Assessment', desc: '10 guided questions, 2–3 minutes total. Record and analyze speech patterns in real-time.' },
              { icon: <FileText size={24} />, step: '03', title: 'Generate Clinical Report', desc: 'Comprehensive PDF report ready to attach to patient records. Objective risk scoring.' },
            ].map((s, i) => (
              <motion.div key={i} variants={stagger.item} className="relative bg-surface rounded-xl border border-border/60 shadow-card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <span className="text-[10px] font-bold text-deep-teal/40 uppercase tracking-widest">Step {s.step}</span>
                <div className="w-12 h-12 rounded-xl bg-deep-teal/8 text-deep-teal flex items-center justify-center my-4">{s.icon}</div>
                <h3 className="text-lg font-bold text-navy-dark">{s.title}</h3>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ BENEFITS ═══ */}
      <section className="py-16 md:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger.container} className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <motion.div variants={stagger.item} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-dark">Why Healthcare Professionals Choose Sahara</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Clock size={22} />, title: 'Save Time', points: ['Reduce screening from 60+ min to 2–3 min', 'See more patients without compromising care'] },
              { icon: <Target size={22} />, title: 'Early Detection', points: ['Identify decline 5–10 years earlier', 'Enable timely intervention'] },
              { icon: <BarChart3 size={22} />, title: 'Objective Data', points: ['Eliminate subjective bias in assessments', 'Track progress with hard metrics'] },
              { icon: <Workflow size={22} />, title: 'Seamless Workflow', points: ['Integrates with existing EMR systems', 'Export reports as PDF or HL7'] },
            ].map((b, i) => (
              <motion.div key={i} variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-6 hover:shadow-xl transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-deep-teal/8 text-deep-teal flex items-center justify-center mb-4">{b.icon}</div>
                <h3 className="text-base font-bold text-navy-dark mb-3">{b.title}</h3>
                <ul className="space-y-2">
                  {b.points.map((p, j) => (<li key={j} className="flex items-start gap-2 text-sm text-text-secondary"><Check size={14} className="text-success shrink-0 mt-0.5" />{p}</li>))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-16 md:py-24 bg-muted/20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger.container} className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={stagger.item}>
              <p className="text-xs font-bold text-deep-teal uppercase tracking-widest mb-2">Platform Features</p>
              <h2 className="text-3xl font-extrabold text-navy-dark mb-8">Everything You Need in One Platform</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Patient Management Dashboard', 'Customizable Question Sets', 'Real-time Voice Analysis',
                  'Automated Report Generation', 'Session History & Tracking', 'HIPAA Compliant Storage',
                  'Multi-language Support', 'Telehealth Compatible',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-2">
                    <CheckCircle size={16} className="text-deep-teal shrink-0" />
                    <span className="text-sm font-medium text-text-primary">{f}</span>
                    {f.includes('Multi-language') && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sage/20 text-sage font-bold">Soon</span>}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={stagger.item} className="bg-surface rounded-2xl border border-border/60 shadow-xl p-5">
              <div className="flex gap-1.5 mb-3"><span className="w-2.5 h-2.5 rounded-full bg-coral/60" /><span className="w-2.5 h-2.5 rounded-full bg-warning/60" /><span className="w-2.5 h-2.5 rounded-full bg-success/60" /></div>
              <div className="space-y-2">
                {[
                  { name: 'Ram B. Thapa', age: '73 • M', score: 24, cls: 'Healthy', color: 'success' },
                  { name: 'Sarita D. Karki', age: '68 • F', score: 38, cls: 'Mild', color: 'warning' },
                  { name: 'Krishna P. Sharma', age: '77 • M', score: 52, cls: 'Concern', color: 'warning' },
                  { name: 'Maya K. Rai', age: '66 • F', score: 18, cls: 'Healthy', color: 'success' },
                  { name: 'Parvati Shrestha', age: '80 • F', score: 58, cls: 'Concern', color: 'coral' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-deep-teal/10 flex items-center justify-center text-[10px] font-bold text-deep-teal">{p.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                      <div><p className="text-xs font-semibold text-text-primary">{p.name}</p><p className="text-[10px] text-text-muted">{p.age}</p></div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-navy-dark">{p.score}</span>
                      <span className={cn('ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full', `bg-${p.color}/10 text-${p.color}`)}>{p.cls}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══ COMPARISON TABLE ═══ */}
      <section className="py-16 md:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mx-auto max-w-[900px] px-6 lg:px-10">
          <h2 className="text-3xl font-extrabold text-navy-dark text-center mb-10">Sahara vs Traditional Assessments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b-2 border-border/60">
                  <th className="text-left py-3 px-3 text-xs font-bold text-text-muted uppercase">Criteria</th>
                  <th className="text-center py-3 px-3 text-xs font-bold text-deep-teal uppercase">Sahara</th>
                  <th className="text-center py-3 px-3 text-xs font-bold text-text-muted uppercase">Traditional</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { c: 'Assessment Time', e: '2–3 minutes', t: '45–90 minutes' },
                  { c: 'Patient Stress', e: 'Minimal', t: 'High' },
                  { c: 'Objectivity', e: 'AI-based scoring', t: 'Subjective' },
                  { c: 'Progress Tracking', e: 'Automated', t: 'Manual charts' },
                  { c: 'Cost per Assessment', e: 'Low', t: 'High' },
                  { c: 'Scalability', e: 'Unlimited', t: 'Time-limited' },
                ].map((r, i) => (
                  <tr key={i} className="border-b border-border/40">
                    <td className="py-3.5 px-3 font-semibold text-text-primary">{r.c}</td>
                    <td className="py-3.5 px-3 text-center"><span className="inline-flex items-center gap-1 text-deep-teal font-medium"><Check size={14} />{r.e}</span></td>
                    <td className="py-3.5 px-3 text-center text-text-muted">{r.t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="py-16 md:py-24 bg-muted/20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger.container} className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <motion.div variants={stagger.item} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-dark">Simple, Transparent Pricing</h2>
            <p className="text-text-secondary mt-2">All plans include HIPAA compliance and secure data storage</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Free Trial', price: '$0', period: 'for 14 days', features: ['Up to 10 patients', '25 sessions', 'All features included', 'Email support'], cta: 'Start Free Trial', primary: false },
              { name: 'Professional', price: '$99', period: '/month', features: ['Unlimited patients', 'Unlimited sessions', 'Priority support', 'EMR integration', 'Custom question sets'], cta: 'Choose Plan', primary: true },
              { name: 'Enterprise', price: 'Custom', period: 'pricing', features: ['Multi-doctor accounts', 'Advanced analytics', 'Dedicated support', 'API access', 'White-label option'], cta: 'Contact Sales', primary: false },
            ].map((plan, i) => (
              <motion.div key={i} variants={stagger.item} className={cn('rounded-2xl border p-6 transition-shadow hover:shadow-xl', plan.primary ? 'bg-navy-dark text-white border-navy-dark shadow-xl scale-[1.02]' : 'bg-surface border-border/60 shadow-card')}>
                <p className={cn('text-sm font-bold uppercase tracking-wider', plan.primary ? 'text-sage' : 'text-deep-teal')}>{plan.name}</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{plan.price}</span>
                  <span className={cn('text-sm', plan.primary ? 'text-white/60' : 'text-text-muted')}>{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className={cn('flex items-center gap-2 text-sm', plan.primary ? 'text-white/80' : 'text-text-secondary')}>
                      <Check size={14} className={plan.primary ? 'text-sage' : 'text-deep-teal'} /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.primary ? 'secondary' : 'outline'} className={cn('w-full mt-6', plan.primary && 'bg-white text-navy-dark hover:bg-white/90')} onClick={() => navigate('/auth/signup')}>
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-16 md:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger.container} className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <motion.div variants={stagger.item} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-navy-dark">Trusted by Clinicians</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { quote: 'Transformed how we conduct cognitive screenings. Patients love the quick, stress-free process.', name: 'Dr. Sarah Chen', title: 'Geriatric Neurologist' },
              { quote: 'The objective data helps me have more confident conversations with families about cognitive health.', name: 'Dr. Michael Roberts', title: 'Primary Care' },
              { quote: 'Finally, a screening tool that fits into a busy practice workflow. Report generation is a game-changer.', name: 'Dr. Emily Thompson', title: 'Memory Clinic Director' },
            ].map((t, i) => (
              <motion.div key={i} variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-6">
                <div className="flex gap-0.5 mb-4">{[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-warning fill-warning" />)}</div>
                <p className="text-sm text-text-secondary leading-relaxed italic">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-deep-teal/10 flex items-center justify-center text-deep-teal text-xs font-bold">{t.name.split(' ').filter((_,i)=>i>0).map(n=>n[0]).join('')}</div>
                  <div><p className="text-sm font-bold text-text-primary">{t.name}</p><p className="text-xs text-text-muted">{t.title}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-16 md:py-24 bg-muted/20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mx-auto max-w-[720px] px-6 lg:px-10">
          <h2 className="text-3xl font-extrabold text-navy-dark text-center mb-10">Frequently Asked Questions</h2>
          <FAQ question="Is this a replacement for comprehensive neuropsychological testing?" answer="No. Sahara is a screening tool designed for early detection and longitudinal monitoring. Abnormal results should be followed up with comprehensive neuropsychological evaluation." />
          <FAQ question="How accurate is the AI analysis?" answer="Our voice analysis model achieves 98% accuracy validated against clinical gold-standard assessments (MoCA, MMSE) across 10,000+ samples." />
          <FAQ question="Is patient data HIPAA compliant?" answer="Yes. All data is encrypted at rest and in transit, stored on HIPAA-compliant cloud infrastructure, and we sign BAAs with all enterprise clients." />
          <FAQ question="Can I customize the questions?" answer="Absolutely. You can create custom question sets, adjust difficulty levels, and save templates for different patient populations." />
          <FAQ question="Does this integrate with my EMR?" answer="We support HL7 FHIR integration with major EMR systems including Epic, Cerner, and Athena. Custom integrations available for Enterprise plans." />
          <FAQ question="What training is required?" answer="Minimal. Doctors can start using Sahara after a 15-minute onboarding walkthrough. No special equipment needed — just a computer with a microphone." />
          <FAQ question="Can I use this for telehealth visits?" answer="Yes. Sahara works across telehealth platforms. Patients can record on their own device, and results sync to your dashboard." />
          <FAQ question="How do I explain this to patients?" answer="We provide patient-facing materials and consent forms. The process is simple: 'We're going to ask a few questions and record your voice to check on your brain health.'" />
        </motion.div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 md:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mx-auto max-w-[700px] px-6 lg:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy-dark">Ready to Enhance Your Practice?</h2>
          <p className="mt-4 text-lg text-text-secondary">Join hundreds of doctors using AI-powered voice analysis for better patient care.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" rightIcon={<ArrowRight size={16} />} onClick={() => navigate('/auth/signup')}>Start Free Trial</Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/demo')}>Schedule a Demo</Button>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
