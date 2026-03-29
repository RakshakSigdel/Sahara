import { useRef, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';

/**
 * Real-time audio waveform visualization using Canvas.
 *
 * @param {object} props
 * @param {number[]} [props.audioData] - Array of amplitude values (0-1)
 * @param {boolean} [props.isRecording=false]
 * @param {number} [props.height=120]
 * @param {number} [props.width] - Defaults to container width
 * @param {number} [props.barCount=50]
 * @param {string} [props.className]
 */
function WaveformVisualizer({
  audioData,
  isRecording = false,
  height = 120,
  width,
  barCount = 50,
  className,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const barsRef = useRef(Array(barCount).fill(0));

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, w, h);

    const bars = barsRef.current;
    const barWidth = (w / dpr) / barCount;
    const gap = 2;
    const actualBarWidth = barWidth - gap;

    // Gradient from teal to sage
    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, '#0A7C7C');
    gradient.addColorStop(0.5, '#0E9A9A');
    gradient.addColorStop(1, '#A8D5B5');

    for (let i = 0; i < barCount; i++) {
      // Smooth interpolation toward target
      const target = audioData && audioData[i] !== undefined
        ? audioData[i]
        : isRecording
          ? 0.1 + Math.random() * 0.6
          : 0.05 + Math.sin(Date.now() / 800 + i * 0.3) * 0.04;

      bars[i] += (target - bars[i]) * 0.15;

      const barHeight = Math.max(4 * dpr, bars[i] * (h - 8 * dpr));
      const x = i * barWidth * dpr + gap * dpr / 2;
      const y = (h - barHeight) / 2;

      ctx.fillStyle = gradient;
      ctx.beginPath();
      const radius = Math.min(actualBarWidth * dpr / 2, 3 * dpr);
      ctx.roundRect(x, y, actualBarWidth * dpr, barHeight, radius);
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [audioData, isRecording, barCount]);

  // Handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = width || container.clientWidth;
      canvas.width = w * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [width, height]);

  // Animation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [draw]);

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
}

WaveformVisualizer.displayName = 'WaveformVisualizer';

export { WaveformVisualizer };
export default WaveformVisualizer;
