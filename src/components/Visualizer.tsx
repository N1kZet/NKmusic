import * as React from 'react';

interface VisualizerProps {
  analyser: AnalyserNode | null;
}

const BAR_COUNT = 48;
const SMOOTHING = 0.7;

const Visualizer: React.FC<VisualizerProps> = ({ analyser }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const prevData = React.useRef<number[]>([]);

  React.useEffect(() => {
    if (!analyser) return;
    analyser.smoothingTimeConstant = SMOOTHING;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let animationId: number;
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width / BAR_COUNT;
      for (let i = 0; i < BAR_COUNT; i++) {
        // Плавное затухание
        const prev = prevData.current[i] || 0;
        const curr = dataArray[i] / 255;
        const smooth = prev * 0.6 + curr * 0.4;
        prevData.current[i] = smooth;
        // Цвет: радуга по спектру
        const hue = Math.round((i / BAR_COUNT) * 270 + 180); // от синего к красному
        ctx.fillStyle = `hsl(${hue}, 80%, 55%)`;
        ctx.fillRect(
          i * w + 4,
          canvas.height * (1 - smooth),
          w - 8,
          canvas.height * smooth
        );
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [analyser]);

  return (
    <div style={{
      border: '3px solid var(--accent, #888)',
      borderRadius: 12,
      background: '#fafafa',
      height: 140,
      margin: '16px 0',
      display: 'flex',
      alignItems: 'flex-end',
      padding: 0,
      position: 'relative',
      minWidth: 350,
      width: '100%',
      maxWidth: 900,
      overflow: 'hidden',
      justifyContent: 'center',
    }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={120}
        style={{ width: '100%', height: 120, display: 'block' }}
      />
    </div>
  );
};

export default Visualizer; 