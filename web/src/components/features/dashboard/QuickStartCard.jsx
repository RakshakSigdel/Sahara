import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { cn } from '../../../utils/cn';
import Button from '../../ui/Button';

/**
 * Featured "Start Screening" card for the dashboard.
 *
 * @param {object} props
 * @param {string} [props.lastTestDate] - ISO date string or display string
 * @param {function} props.onStartScreening
 * @param {string} [props.className]
 */
function QuickStartCard({ lastTestDate, onStartScreening, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-md p-6 md:p-8',
        'bg-gradient-to-br from-deep-teal via-deep-teal-light to-sage',
        'text-white shadow-xl',
        className,
      )}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 rounded-full bg-white/5" />

      <div className="relative z-10">
        <h3 className="text-xl md:text-2xl font-bold mb-2">
          Ready for Your Screening?
        </h3>
        <p className="text-white/80 text-sm md:text-base mb-6 max-w-md">
          A quick 2-minute voice analysis to check for early cognitive indicators.
        </p>

        <Button
          variant="secondary"
          size="lg"
          onClick={onStartScreening}
          rightIcon={<ArrowRight size={18} />}
          className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
        >
          Start Screening
        </Button>

        {lastTestDate && (
          <div className="flex items-center gap-2 mt-4 text-white/60 text-xs">
            <Calendar size={14} />
            <span>Last test: {lastTestDate}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

QuickStartCard.displayName = 'QuickStartCard';

export { QuickStartCard };
export default QuickStartCard;
