import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Users, Mic, BarChart2, FileText, Settings, ChevronDown, ChevronRight, ExternalLink, MessageCircle, Mail, Phone } from 'lucide-react';
import Button from '../components/ui/Button';
import { cn } from '../utils/cn';

const stagger = { container: { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }, item: { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } } };

const guides = [
  {
    id: 'getting-started', icon: BookOpen, title: 'Getting Started', description: 'Set up your account and start screening',
    steps: [
      { title: 'Complete your professional profile', desc: 'Navigate to Profile → Professional Info and fill in your license number, specialty, and hospital affiliation.' },
      { title: 'Add your first patient', desc: 'Go to Patients → Add New Patient. Fill in the required fields (name, DOB, gender, phone) and medical history.' },
      { title: 'Configure your question set', desc: 'Visit the Question Bank to review the default 10-question standard set, or create a custom set tailored to your practice.' },
      { title: 'Start a session', desc: 'From a patient\'s profile, click "New Session" → select your question set → complete the consent checklist → begin recording.' },
    ],
  },
  {
    id: 'patients', icon: Users, title: 'Managing Patients', description: 'Add, edit, and organize patient records',
    steps: [
      { title: 'Adding patients', desc: 'Click "Add New Patient" from the patients page. The two-step form collects basic info and medical history. Emergency contact information is required.' },
      { title: 'Patient profiles', desc: 'Each patient has an Overview (latest risk score, session trend), Session History (expandable timeline), and Medical Info tab.' },
      { title: 'Filtering & search', desc: 'Use the search bar, risk-level filters, and sort options to quickly find patients. Toggle between table and grid views.' },
      { title: 'Bulk actions', desc: 'Select multiple patients with checkboxes to perform bulk deletions or exports.' },
    ],
  },
  {
    id: 'sessions', icon: Mic, title: 'Conducting Sessions', description: 'Record, analyze, and review assessments',
    steps: [
      { title: 'Session setup', desc: 'Choose between the Standard 10-Question set or build a custom set. Complete the consent checklist (informed consent, recording consent, quiet environment).' },
      { title: 'Recording interface', desc: 'The immersive recording screen shows the current question, a live waveform visualizer, and recording controls. Use keyboard shortcuts: R (record), S (stop), Space (playback), Esc (exit).' },
      { title: 'Per-question analysis', desc: 'After each recording, click "Analyze & Next" to process the voice sample. The AI analyzes speech rate, pauses, coherence, and more.' },
      { title: 'Reviewing sessions', desc: 'After completing all questions, review each recording with expanded analysis metrics. Add notes or flag responses for follow-up.' },
    ],
  },
  {
    id: 'reports', icon: BarChart2, title: 'Interpreting Reports', description: 'Understanding AI-generated clinical reports',
    steps: [
      { title: 'Risk score overview', desc: 'The circular risk score (0–100) classifies results as Healthy (≤30), Mild Concern (31–60), or High Risk (>60). Higher scores indicate greater concern.' },
      { title: 'Voice biomarkers', desc: 'Seven key markers are analyzed: speech rate, pause duration, filler words, semantic coherence, response latency, lexical diversity, and verbal fluency. Each is compared to normal ranges.' },
      { title: 'Score trends', desc: 'For patients with multiple sessions, a trend chart shows how their risk score has changed over time — critical for tracking progression.' },
      { title: 'Clinical recommendations', desc: 'AI-generated recommendations are tailored to the risk level. These are suggestions — always apply clinical judgment and consider the full patient picture.' },
    ],
  },
  {
    id: 'questions', icon: FileText, title: 'Question Bank', description: 'Customize your assessment questions',
    steps: [
      { title: 'Default questions', desc: 'Sahara includes 32 clinically validated questions across four categories: Memory, Cognition, Language, and Orientation.' },
      { title: 'Custom questions', desc: 'Add your own questions via Questions → Add Custom Question. Specify the category, difficulty, expected duration, and optional follow-up prompts.' },
      { title: 'Building sets', desc: 'When starting a session, you can select the standard 10-question set or pick specific questions (up to 10) from the full bank.' },
    ],
  },
  {
    id: 'settings', icon: Settings, title: 'Account & Settings', description: 'Configure your practice preferences',
    steps: [
      { title: 'Practice settings', desc: 'Set your default question set, auto-save interval, session timeout, and preferred report template.' },
      { title: 'Notifications', desc: 'Configure email alerts for session completion, high-risk results, and patient follow-up reminders. Set quiet hours to silence notifications.' },
      { title: 'Security', desc: 'Enable two-factor authentication, manage active sessions, and review your HIPAA compliance status.' },
      { title: 'Billing', desc: 'View your current plan, usage statistics, and manage payment methods.' },
    ],
  },
];

const faqs = [
  { q: 'How accurate is the voice analysis?', a: 'Sahara achieves 98% diagnostic accuracy in clinical trials, validated against standard neuropsychological batteries (MMSE, MoCA). However, it is a screening tool — not a diagnostic instrument. Always correlate with clinical evaluation.' },
  { q: 'Is my patient data HIPAA compliant?', a: 'Yes. All data is encrypted end-to-end (AES-256) and stored in SOC 2 Type II compliant data centers. We provide a signed Business Associate Agreement (BAA) for all professional accounts.' },
  { q: 'Can I use Sahara for telehealth?', a: 'Yes. Sessions can be conducted in-office, via telehealth, or during home visits. For telehealth, ensure the patient has a quiet environment and stable internet connection for best results.' },
  { q: 'How long does a typical session take?', a: 'The standard 10-question assessment takes 2–3 minutes of active recording time, plus ~1 minute for AI analysis. Total appointment time is typically 5–10 minutes including setup.' },
  { q: 'Can I customize the question set?', a: 'Absolutely. You can use the standard clinically validated set, or build custom sets from 32+ questions in the question bank. You can also add your own questions.' },
  { q: 'What happens to voice recordings?', a: 'Voice recordings are processed for analysis and can be retained for clinical records. You control data retention settings in your privacy preferences. Recordings can be downloaded or deleted at any time.' },
  { q: 'Can multiple doctors share patient records?', a: 'Currently, each doctor account manages their own patient records. Enterprise plans support multi-provider clinics with shared patient records and role-based access.' },
  { q: 'How do I export reports?', a: 'Reports can be exported as PDF (with your clinic letterhead if configured), printed, shared via secure link, or emailed directly from the report page.' },
];

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [expandedGuide, setExpandedGuide] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const filteredGuides = search
    ? guides.filter((g) => g.title.toLowerCase().includes(search.toLowerCase()) || g.steps.some((s) => s.title.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase())))
    : guides;

  const filteredFaqs = search
    ? faqs.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : faqs;

  return (
    <motion.div variants={stagger.container} initial="hidden" animate="visible" className="p-5 lg:p-7 space-y-8">
      {/* Header */}
      <motion.div variants={stagger.item} className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-navy-dark mb-2">Help & Documentation</h1>
        <p className="text-text-secondary mb-6">Everything you need to know about using Sahara</p>
        <div className="relative max-w-md mx-auto">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search help articles, guides, FAQs…"
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-border/60 bg-surface text-sm outline-none focus:border-deep-teal focus:ring-2 focus:ring-deep-teal/15 transition-all shadow-card" />
        </div>
      </motion.div>

      {/* Quick links */}
      <motion.div variants={stagger.item} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {guides.map((g) => {
          const Icon = g.icon;
          return (
            <button key={g.id} onClick={() => setExpandedGuide(expandedGuide === g.id ? null : g.id)}
              className={cn('flex flex-col items-center gap-2 p-4 rounded-xl border transition-all cursor-pointer text-center',
                expandedGuide === g.id ? 'bg-deep-teal/5 border-deep-teal/20 shadow-sm' : 'bg-surface border-border/60 hover:border-deep-teal/20')}>
              <Icon size={22} className={expandedGuide === g.id ? 'text-deep-teal' : 'text-text-muted'} />
              <span className="text-xs font-semibold text-text-primary">{g.title}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Guides */}
      <div className="space-y-3">
        <motion.h2 variants={stagger.item} className="text-lg font-bold text-navy-dark">Step-by-Step Guides</motion.h2>
        {filteredGuides.map((g) => {
          const Icon = g.icon;
          const isOpen = expandedGuide === g.id;
          return (
            <motion.div key={g.id} variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card overflow-hidden">
              <button onClick={() => setExpandedGuide(isOpen ? null : g.id)} className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', isOpen ? 'bg-deep-teal/10 text-deep-teal' : 'bg-muted/50 text-text-muted')}><Icon size={20} /></div>
                  <div className="text-left"><p className="text-sm font-bold text-navy-dark">{g.title}</p><p className="text-xs text-text-muted">{g.description}</p></div>
                </div>
                <ChevronDown size={16} className={cn('text-text-muted transition-transform shrink-0', isOpen && 'rotate-180')} />
              </button>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-5 pb-5 border-t border-border/40 pt-4">
                  <div className="space-y-4">
                    {g.steps.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-deep-teal/10 flex items-center justify-center text-deep-teal text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                        <div><p className="text-sm font-semibold text-text-primary">{step.title}</p><p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{step.desc}</p></div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* FAQs */}
      <div className="space-y-3">
        <motion.h2 variants={stagger.item} className="text-lg font-bold text-navy-dark">Frequently Asked Questions</motion.h2>
        {filteredFaqs.map((f, i) => (
          <motion.div key={i} variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card overflow-hidden">
            <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-muted/10 transition-colors">
              <p className="text-sm font-semibold text-text-primary text-left pr-4">{f.q}</p>
              <ChevronDown size={16} className={cn('text-text-muted transition-transform shrink-0', expandedFaq === i && 'rotate-180')} />
            </button>
            {expandedFaq === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-4 pb-4">
                <p className="text-sm text-text-secondary leading-relaxed border-t border-border/40 pt-3">{f.a}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Contact */}
      <motion.div variants={stagger.item} className="bg-surface rounded-xl border border-border/60 shadow-card p-6">
        <h2 className="text-lg font-bold text-navy-dark mb-4">Still Need Help?</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: <MessageCircle size={20} />, title: 'Live Chat', desc: 'Chat with our support team', action: 'Start Chat' },
            { icon: <Mail size={20} />, title: 'Email Support', desc: 'support@Sahara.health', action: 'Send Email' },
            { icon: <Phone size={20} />, title: 'Phone Support', desc: 'Mon-Fri 9am-6pm EST', action: 'Call Now' },
          ].map((c) => (
            <div key={c.title} className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-deep-teal/10 flex items-center justify-center text-deep-teal mb-3">{c.icon}</div>
              <p className="text-sm font-bold text-navy-dark">{c.title}</p>
              <p className="text-xs text-text-muted mt-0.5 mb-3">{c.desc}</p>
              <Button variant="outline" size="sm">{c.action}</Button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
