import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

/**
 * Traffic-light risk indicator with circular progress ring.
 *
 * @param {object} props
 * @param {number} props.riskLevel - 0-100
 * @param {'healthy'|'mild'|'risk'} props.classification
 * @param {number} [props.size=160]
 * @param {string} [props.className]
 */

const classificationConfig = {
  healthy: {
    color: '#10B981',
    label: 'Low Risk',
    description: 'No significant indicators detected',
    bg: 'bg-success/5',
  },
  mild: {
    color: '#F59E0B',
    label: 'Moderate',
    description: 'Some markers present — consult a professional',
    bg: 'bg-warning/5',
  },
  risk: {
    color: '#EF4444',
    label: 'Elevated Risk',
    description: 'Significant markers — seek professional evaluation',
    bg: 'bg-error/5',
  },
};

function RiskIndicator({ riskLevel = 0, classification = 'healthy', size = 160, className }) {
  const config = classificationConfig[classification] || classificationConfig.healthy;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(100, Math.max(0, riskLevel));

  const strokeDashoffset = useMemo(
    () => circumference - (clampedValue / 100) * circumference,
    [clampedValue, circumference],
  );

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Circular ring */}
      <div
        className={cn('relative inline-flex items-center justify-center rounded-full', config.bg)}
        style={{ width: size + 16, height: size + 16 }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold text-text-primary"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {clampedValue}%
          </motion.span>
        </div>
      </div>

      {/* Traffic light dots */}
      <div className="flex items-center gap-2">
        {['healthy', 'mild', 'risk'].map((level) => (
          <div
            key={level}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-300',
              classification === level
                ? 'scale-125'
                : 'opacity-30',
            )}
            style={{ backgroundColor: classificationConfig[level].color }}
          />
        ))}
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-lg font-semibold text-text-primary">{config.label}</p>
        <p className="text-sm text-text-secondary mt-1 max-w-xs">{config.description}</p>
      </div>
    </div>
  );
}

RiskIndicator.displayName = 'RiskIndicator';

export { RiskIndicator };
export default RiskIndicator;
