import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

/**
 * Prompt overlay displayed on the waveform during recording.
 *
 * @param {object} props
 * @param {string} props.prompt - The text prompt to display
 * @param {number} [props.stepNumber]
 * @param {number} [props.totalSteps]
 * @param {string} [props.className]
 */
function PromptDisplay({ prompt, stepNumber, totalSteps, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-md px-6 py-5',
        'bg-surface/80 backdrop-blur-lg border border-border/50',
        'shadow-lg',
        className,
      )}
    >
      {/* Step indicator */}
      {stepNumber && (
        <p className="text-xs font-medium text-deep-teal mb-2 uppercase tracking-wider">
          Step {stepNumber}{totalSteps ? ` of ${totalSteps}` : ''}
        </p>
      )}

      {/* Prompt text */}
      <p className="text-lg md:text-xl font-medium text-text-primary leading-relaxed">
        {prompt}
      </p>
    </motion.div>
  );
}

PromptDisplay.displayName = 'PromptDisplay';

export { PromptDisplay };
export default PromptDisplay;
