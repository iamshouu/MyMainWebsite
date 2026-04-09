
import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    // Configuration
    const GRID_SIZE = 80;
    const DOT_RADIUS = 1.2;
    const MOUSE_RADIUS = 250;
    
    interface Point {
      x: number;
      y: number;
      originalX: number;
      originalY: number;
    }

    interface Pulse {
        x: number;
        y: number;
        dir: 'v' | 'h';
        speed: number;
        life: number;
    }

    const points: Point[] = [];
    let pulses: Pulse[] = [];

    // Init Points
    for (let x = 0; x <= width + GRID_SIZE; x += GRID_SIZE) {
      for (let y = 0; y <= height + GRID_SIZE; y += GRID_SIZE) {
        points.push({ x, y, originalX: x, originalY: y });
      }
    }

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = (time: number) => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Add Random Pulses
      if (Math.random() < 0.05 && pulses.length < 5) {
          const isHorizontal = Math.random() > 0.5;
          pulses.push({
              x: isHorizontal ? -100 : Math.floor(Math.random() * (width / GRID_SIZE)) * GRID_SIZE,
              y: isHorizontal ? Math.floor(Math.random() * (height / GRID_SIZE)) * GRID_SIZE : -100,
              dir: isHorizontal ? 'h' : 'v',
              speed: 4 + Math.random() * 6,
              life: 1
          });
      }

      // Update Pulses
      pulses = pulses.filter(p => {
          if (p.dir === 'h') p.x += p.speed;
          else p.y += p.speed;
          return p.x < width + 200 && p.y < height + 200;
      });

      // Draw Grid Lines
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.04)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x <= width + GRID_SIZE; x += GRID_SIZE) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
      }
      // Horizontal lines
      for (let y = 0; y <= height + GRID_SIZE; y += GRID_SIZE) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Draw Pulses along grid
      pulses.forEach(p => {
          ctx.beginPath();
          const grad = ctx.createLinearGradient(
              p.x, p.y, 
              p.dir === 'h' ? p.x - 200 : p.x, 
              p.dir === 'v' ? p.y - 200 : p.y
          );
          grad.addColorStop(0, 'rgba(34, 211, 238, 0.3)');
          grad.addColorStop(1, 'rgba(34, 211, 238, 0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.dir === 'h' ? p.x - 200 : p.x, p.dir === 'v' ? p.y - 200 : p.y);
          ctx.stroke();
      });

      // Draw Nodes (Points)
      points.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.x -= dx * force * 0.05;
          p.y -= dy * force * 0.05;
        } else {
          p.x += (p.originalX - p.x) * 0.05;
          p.y += (p.originalY - p.y) * 0.05;
        }

        // Animated opacity based on time
        const pulse = Math.sin(time * 0.001 + (p.originalX + p.originalY) * 0.005) * 0.2 + 0.3;
        
        ctx.fillStyle = `rgba(34, 211, 238, ${pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        
        // Small glow on hover
        if (dist < 100) {
            ctx.fillStyle = 'rgba(34, 211, 238, 0.2)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, DOT_RADIUS * 4, 0, Math.PI * 2);
            ctx.fill();
        }
      });

      // Subtle Vignette is now handled by CSS
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 w-full h-full pointer-events-none opacity-80" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 25%, rgba(10, 10, 10, 0.8) 100%)' }} />
    </>
  );
};

export default AnimatedBackground;
