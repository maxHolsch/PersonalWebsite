'use client';

import { useEffect, useRef } from 'react';

export default function WavyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Simple noise function (pseudo-random but smooth)
    const noise = (x: number, y: number, t: number) => {
      const value = Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.8);
      return value;
    };

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const draw = () => {
      // Background
      ctx.fillStyle = '#FF1654';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Wavy lines
      ctx.strokeStyle = '#E60038';
      ctx.lineWidth = 1.5;

      const numLines = 150;
      const spacing = canvas.height / numLines;

      for (let i = 0; i < numLines; i++) {
        const y = i * spacing;

        ctx.beginPath();

        for (let x = 0; x <= canvas.width; x += 5) {
          // Create wavy effect using noise
          const distanceFromMouse = Math.sqrt(
            Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2)
          );
          const mouseInfluence = Math.max(0, 1 - distanceFromMouse / 300);

          const waveAmplitude = 30 + mouseInfluence * 50;
          const waveFrequency = 0.002;

          const offset =
            Math.sin(x * waveFrequency + time * 0.5 + i * 0.1) * waveAmplitude +
            noise(x, y, time * 0.3) * 20 +
            Math.cos(x * 0.001 + time * 0.3) * 15;

          const yPos = y + offset;

          if (x === 0) {
            ctx.moveTo(x, yPos);
          } else {
            ctx.lineTo(x, yPos);
          }
        }

        ctx.stroke();
      }

      time += 0.01;
      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
