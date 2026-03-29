import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Horizontal timeline showing voice analysis markers.
 *
 * @param {object} props
 * @param {Array<{name: string, value: string|number, trend: 'up'|'down'|'neutral', icon: React.ReactNode}>} props.markers
 * @param {string} [props.className]
 */
function VoiceMarkerTimeline({ markers = [], className }) {
  const trendIcons = {
    up: <TrendingUp size={14} />,
    down: <TrendingDown size={14} />,
    neutral: <Minus size={14} />,
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-coral',
    neutral: 'text-text-muted',
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Timeline line */}
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />

        {/* Markers */}
        <div className="relative flex justify-between">
          {markers.map((marker, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex flex-col items-center text-center"
              style={{ flex: '1 1 0' }}
            >
              {/* Dot on timeline */}
              <div className="w-10 h-10 rounded-full bg-surface border-2 border-deep-teal flex items-center justify-center text-deep-teal z-10 mb-3">
                {marker.icon}
              </div>

              {/* Metric value */}
              <p
                className="text-lg font-bold text-text-primary"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {marker.value}
              </p>

              {/* Name */}
              <p className="text-xs text-text-secondary mt-0.5 max-w-[100px]">{marker.name}</p>

              {/* Trend mini-chart */}
              <div className={cn('flex items-center gap-1 mt-1', trendColors[marker.trend] || trendColors.neutral)}>
                {trendIcons[marker.trend] || trendIcons.neutral}
                <MiniSparkline trend={marker.trend} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Tiny inline SVG sparkline for trend visualization.
 */
function MiniSparkline({ trend }) {
  const points =
    trend === 'up'
      ? '0,12 4,10 8,8 12,9 16,6 20,4 24,2'
      : trend === 'down'
        ? '0,2 4,4 8,6 12,5 16,8 20,10 24,12'
        : '0,7 4,6 8,7 12,7 16,6 20,7 24,7';

  return (
    <svg width="24" height="14" viewBox="0 0 24 14" className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

VoiceMarkerTimeline.displayName = 'VoiceMarkerTimeline';

export { VoiceMarkerTimeline };
export default VoiceMarkerTimeline;
