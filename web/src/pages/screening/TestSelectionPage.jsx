import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, BookOpen, Image, Upload, Check, Star, Clock, Target } from 'lucide-react';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const tests = [
  {
    id: 'quick',
    icon: <Zap size={24} />,
    title: 'Quick Screen',
    badge: 'Recommended',
    badgeColor: 'bg-deep-teal/10 text-deep-teal border-deep-teal/20',
    duration: '~1 minute',
    description: 'Brief verbal test for rapid cognitive assessment.',
    task: 'Count backwards from 20',
    bestFor: 'Regular monitoring',
    accent: 'deep-teal',
    gradient: 'from-deep-teal to-deep-teal-light',
  },
  {
    id: 'story',
    icon: <BookOpen size={24} />,
    title: 'Story Recall',
    badge: 'Most Accurate',
    badgeColor: 'bg-sage/15 text-sage-dark border-sage-dark/20',
    duration: '~2-3 minutes',
    description: 'Narrative memory and comprehension test for thorough analysis.',
    task: 'Listen and retell a short story',
    bestFor: 'Comprehensive assessment',
    accent: 'sage-dark',
    gradient: 'from-sage-dark to-sage',
  },
  {
    id: 'picture',
    icon: <Image size={24} />,
    title: 'Picture Description',
    badge: null,
    badgeColor: '',
    duration: '~2 minutes',
    description: 'Visual processing and verbal fluency evaluation.',
    task: 'Describe what you see in detail',
    bestFor: 'Alternative approach',
    accent: 'navy',
    gradient: 'from-navy to-navy-light',
  },
];

function TestCard({ test, selected, onSelect }) {
  const isSelected = selected === test.id;
  const accentRing = {
    'deep-teal': 'ring-deep-teal/40 border-deep-teal/60',
    'sage-dark': 'ring-sage-dark/40 border-sage-dark/60',
    'navy': 'ring-navy/30 border-navy/50',
  }[test.accent];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(test.id)}
      className={cn(
        'relative bg-surface rounded-xl border-[1.5px] p-7 md:p-8 cursor-pointer transition-all duration-200 h-full flex flex-col',
        isSelected
          ? cn('ring-2 shadow-lg', accentRing)
          : 'border-border/60 shadow-card hover:shadow-lg hover:border-border-strong',
      )}
    >
      {/* Selected check */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gradient-to-br from-deep-teal to-deep-teal-light flex items-center justify-center"
        >
          <Check size={14} className="text-white" />
        </motion.div>
      )}

      {/* Badge */}
      {test.badge && (
        <span className={cn('inline-flex self-start items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border mb-4', test.badgeColor)}>
          <Star size={10} className="mr-1" /> {test.badge}
        </span>
      )}

      {/* Icon */}
      <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br text-white flex items-center justify-center mb-5', test.gradient)}>
        {test.icon}
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-navy-dark mb-1">{test.title}</h3>
      <div className="flex items-center gap-1.5 mb-3">
        <Clock size={12} className="text-text-muted" />
        <span className="text-xs font-medium text-text-muted">{test.duration}</span>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed mb-5 flex-1">{test.description}</p>

      {/* Details */}
      <div className="space-y-2.5 mb-6 pt-4 border-t border-border/50">
        <div className="flex items-start gap-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider w-16 shrink-0 mt-0.5">Task</span>
          <span className="text-sm text-text-secondary">{test.task}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider w-16 shrink-0 mt-0.5">Best for</span>
          <span className="text-sm text-text-secondary">{test.bestFor}</span>
        </div>
      </div>

      {/* Button */}
      <Button
        variant={isSelected ? 'primary' : 'outline'}
        className="w-full"
        onClick={(e) => { e.stopPropagation(); onSelect(test.id); }}
      >
        {isSelected ? 'Selected' : `Start ${test.title.split(' ')[0]} Test`}
      </Button>
    </motion.div>
  );
}

export default function TestSelectionPage() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const handleContinue = () => {
    if (selected) navigate(`/screen/record?type=${selected}`);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) console.log('Upload:', file.name, file.size);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-8 lg:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-6 cursor-pointer">
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-navy-dark tracking-tight">Choose Your Screening Type</h1>
          <p className="mt-2 text-text-secondary">Select the test that works best for you</p>
        </motion.div>

        {/* Test cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
        >
          {tests.map((test) => (
            <motion.div key={test.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <TestCard test={test} selected={selected} onSelect={setSelected} />
            </motion.div>
          ))}
        </motion.div>

        {/* Continue button */}
        {selected && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-10">
            <Button size="lg" onClick={handleContinue} rightIcon={<ArrowLeft size={18} className="rotate-180" />} className="px-12">
              Continue with {tests.find((t) => t.id === selected)?.title}
            </Button>
          </motion.div>
        )}

        {/* Upload section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="border-t border-border/60 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <p className="text-sm text-text-muted">Or upload a previous recording</p>
            <div>
              <input ref={fileRef} type="file" accept=".mp3,.wav,.m4a" onChange={handleUpload} className="hidden" />
              <Button variant="outline" size="sm" leftIcon={<Upload size={14} />} onClick={() => fileRef.current?.click()}>
                Upload Recording
              </Button>
            </div>
          </div>
          <p className="text-center text-[11px] text-text-muted mt-2">Accepted: MP3, WAV, M4A &bull; Max 25MB</p>
        </motion.div>
      </div>
    </div>
  );
}
