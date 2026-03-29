import { useRef, useEffect, useCallback, useState } from 'react';
import { cn } from '../../utils/cn';

/**
 * WaveformVisualizer — Canvas-based real-time waveform display.
 *
 * Accepts live waveformData (array of 0-1 amplitudes) from useAudioRecorder,
 * renders smoothly interpolated bars with teal→sage gradient.
 *
 * @param {object} props
 * @param {number[]} [props.waveformData]  - Array of amplitude values (0-1)
 * @param {boolean}  [props.isRecording=false]
 * @param {boolean}  [props.isPaused=false]
 * @param {boolean}  [props.isFrozen=false] - Show static snapshot
 * @param {number}   [props.height=140]
 * @param {number}   [props.barCount=60]    - Desktop bar count
 * @param {string}   [props.className]
 */
function WaveformVisualizer({
  waveformData,
  isRecording = false,
  isPaused = false,
  isFrozen = false,
  height = 140,
  barCount: propBarCount,
  className,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const barsRef = useRef(null);
  const [barCount, setBarCount] = useState(propBarCount || 60);

  // Responsive bar count
  useEffect(() => {
    if (propBarCount) {
      setBarCount(propBarCount);
      return;
    }
    const updateBarCount = () => {
      setBarCount(window.innerWidth < 640 ? 40 : 60);
    };
    updateBarCount();
    window.addEventListener('resize', updateBarCount);
    return () => window.removeEventListener('resize', updateBarCount);
  }, [propBarCount]);

  // Reset bars when barCount changes
  useEffect(() => {
    barsRef.current = new Array(barCount).fill(0.05);
  }, [barCount]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, w, h);

    if (!barsRef.current || barsRef.current.length !== barCount) {
      barsRef.current = new Array(barCount).fill(0.05);
    }
    const bars = barsRef.current;
    const totalWidth = w / dpr;
    const gap = 3;
    const barWidth = (totalWidth - gap * (barCount - 1)) / barCount;
    const actualBarWidth = Math.max(2, barWidth);

    // Build gradient
    const gradient = ctx.createLinearGradient(0, h * 0.3, 0, h * 0.7);
    gradient.addColorStop(0, '#0E9A9A');
    gradient.addColorStop(0.5, '#0A7C7C');
    gradient.addColorStop(1, '#A8D5B5');

    const now = Date.now();

    for (let i = 0; i < barCount; i++) {
      let target;

      if (waveformData && waveformData.length > 0 && (isRecording || isFrozen)) {
        // Map waveformData to current bar count
        const dataIndex = Math.floor((i / barCount) * waveformData.length);
        target = waveformData[dataIndex] !== undefined ? waveformData[dataIndex] : 0.05;
      } else if (isPaused) {
        // Subtle breathing while paused
        target = 0.08 + Math.sin(now / 1200 + i * 0.2) * 0.04;
      } else {
        // Idle pulse animation
        const wave1 = Math.sin(now / 800 + i * 0.25) * 0.04;
        const wave2 = Math.sin(now / 1400 + i * 0.15) * 0.02;
        target = 0.06 + wave1 + wave2;
      }

      // Smoothly interpolate
      const smoothing = isFrozen ? 0.3 : 0.18;
      bars[i] += (target - bars[i]) * smoothing;

      const barHeight = Math.max(4 * dpr, bars[i] * (h - 12 * dpr));
      const x = i * (actualBarWidth + gap) * dpr;
      const y = (h - barHeight) / 2;

      // Opacity based on state
      const alpha = isRecording ? 0.9 : isFrozen ? 0.7 : isPaused ? 0.35 : 0.25;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      const radius = Math.min(actualBarWidth * dpr / 2, 3 * dpr);
      ctx.roundRect(x, y, actualBarWidth * dpr, barHeight, radius);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    if (!isFrozen) {
      animationRef.current = requestAnimationFrame(draw);
    }
  }, [waveformData, isRecording, isPaused, isFrozen, barCount]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      canvas.width = w * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [height]);

  // Animation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [draw]);

  // Redraw frozen waveform once when it becomes frozen
  useEffect(() => {
    if (isFrozen) {
      // Draw one final frame
      requestAnimationFrame(draw);
    }
  }, [isFrozen, draw]);

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
}

WaveformVisualizer.displayName = 'WaveformVisualizer';

export { WaveformVisualizer };
export default WaveformVisualizer;
