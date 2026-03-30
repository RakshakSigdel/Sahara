import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, ExternalLink, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

export default function ConsentPage() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Escape key to cancel
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') navigate(-1); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 backdrop-blur-sm overflow-y-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-[720px] bg-surface rounded-2xl shadow-xl border border-border/50 overflow-hidden"
      >
        {/* Close */}
        <button onClick={() => navigate(-1)} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted hover:bg-border transition-colors flex items-center justify-center text-text-muted hover:text-text-primary cursor-pointer z-10">
          <X size={16} />
        </button>

        <div className="p-8 md:p-10">
          {/* Icon + Heading */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-deep-teal/8 flex items-center justify-center mb-5">
              <ShieldCheck size={30} className="text-deep-teal" />
            </div>
            <h1 className="text-2xl md:text-[28px] font-bold text-navy-dark tracking-tight">Before We Begin</h1>
            <p className="mt-2 text-text-secondary text-sm">Important Information About This Screening</p>
          </div>

          {/* Content sections */}
          <div className="space-y-6 text-sm leading-relaxed">
            {/* What This Is */}
            <div>
              <h3 className="text-base font-bold text-navy-dark mb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-deep-teal" /> What This Is
              </h3>
              <ul className="space-y-1.5 text-text-secondary ml-4">
                <li className="flex items-start gap-2"><span className="text-deep-teal mt-0.5">•</span> A voice-based cognitive screening tool</li>
                <li className="flex items-start gap-2"><span className="text-deep-teal mt-0.5">•</span> Uses AI to analyze speech patterns for cognitive biomarkers</li>
                <li className="flex items-start gap-2"><span className="text-deep-teal mt-0.5">•</span> Takes 2–3 minutes to complete</li>
              </ul>
            </div>

            {/* What This Is NOT */}
            <div>
              <h3 className="text-base font-bold text-navy-dark mb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-coral" /> What This Is NOT
              </h3>
              <ul className="space-y-1.5 text-text-secondary ml-4">
                <li className="flex items-start gap-2"><span className="text-coral mt-0.5">•</span> Not a medical diagnosis</li>
                <li className="flex items-start gap-2"><span className="text-coral mt-0.5">•</span> Not a replacement for professional evaluation</li>
                <li className="flex items-start gap-2"><span className="text-coral mt-0.5">•</span> Not suitable for emergency situations</li>
              </ul>
            </div>

            {/* Your Data */}
            <div>
              <h3 className="text-base font-bold text-navy-dark mb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-info" /> Your Data
              </h3>
              <ul className="space-y-1.5 text-text-secondary ml-4">
                <li className="flex items-start gap-2"><span className="text-info mt-0.5">•</span> Voice recordings are encrypted and processed securely</li>
                <li className="flex items-start gap-2"><span className="text-info mt-0.5">•</span> No data shared with third parties without your consent</li>
                <li className="flex items-start gap-2"><span className="text-info mt-0.5">•</span> You can request data deletion at any time</li>
              </ul>
              <a href="/privacy" className="inline-flex items-center gap-1 ml-4 mt-2 text-xs font-semibold text-deep-teal hover:text-deep-teal-dark transition-colors">
                Privacy Policy <ExternalLink size={11} />
              </a>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl border-2 border-warning/30 bg-warning/5 p-5">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-warning/15 flex items-center justify-center mt-0.5">
                  <AlertTriangle size={18} className="text-warning" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy-dark mb-1">Important Disclaimer</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Bhul Rakshak is a screening tool only. It is not a medical diagnosis. Always consult a qualified healthcare
                    professional for medical advice. If you are experiencing a medical emergency, please call emergency services immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-border-strong text-deep-teal focus:ring-deep-teal/20 cursor-pointer shrink-0"
              />
              <span className="text-sm text-text-secondary leading-snug">
                I understand this is a screening tool and not a medical diagnosis. I have read and agree to the terms above.
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="mt-8 space-y-3">
            <Button
              onClick={() => navigate('/screen/select')}
              disabled={!agreed}
              className="w-full h-12 text-base"
            >
              I Understand &amp; Continue
            </Button>
            <button
              onClick={() => navigate(-1)}
              className="w-full text-center text-sm text-text-muted hover:text-text-secondary transition-colors py-2 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
