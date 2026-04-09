
import React, { useEffect, useRef, useState } from 'react';

interface ClickEffect {
  x: number;
  y: number;
  id: number;
  startTime: number;
  particles: {
    vx: number;
    vy: number;
    size: number;
    color: string;
  }[];
}

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  // Refs for animation loop to avoid re-renders and loop restarts
  const mousePos = useRef({ x: 0, y: 0, realX: 0, realY: 0 });
  const isHoveringRef = useRef(false);
  const clickEffectsRef = useRef<ClickEffect[]>([]);
  const nextEffectId = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let animationId: number;
    
    const trail: {x: number, y: number}[] = [];
    const TRAIL_LENGTH = 6; // Reduced for sharper feel

    const resize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.realX = e.clientX;
      mousePos.current.realY = e.clientY;
      
      if (cursorRef.current) {
        // Direct update for zero latency
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer');
      
      const hovering = !!isClickable;
      if (isHoveringRef.current !== hovering) {
        isHoveringRef.current = hovering;
        setIsHovering(hovering);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; 
      setIsClicked(true);
      
      const particles = Array.from({ length: 12 }).map(() => ({
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        size: Math.random() * 3 + 1,
        color: Math.random() > 0.5 ? '#ffffff' : 'rgba(255,255,255,0.6)'
      }));

      clickEffectsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        id: nextEffectId.current++,
        startTime: performance.now(),
        particles
      });

      if (clickEffectsRef.current.length > 10) {
        clickEffectsRef.current.shift();
      }
    };

    const handleMouseUp = () => setIsClicked(false);

    const render = (time: number) => {
      animationId = requestAnimationFrame(render);
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Sharp Trail ---
      mousePos.current.x = mousePos.current.realX;
      mousePos.current.y = mousePos.current.realY;

      trail.push({ x: mousePos.current.x, y: mousePos.current.y });
      
      if (trail.length > TRAIL_LENGTH) {
        trail.shift();
      }

      if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);

        for (let i = 1; i < trail.length - 1; i++) {
          const xc = (trail[i].x + trail[i+1].x) / 2;
          const yc = (trail[i].y + trail[i+1].y) / 2;
          ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        }
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = isHoveringRef.current ? 3 : 1.5;
        
        const gradient = ctx.createLinearGradient(trail[0].x, trail[0].y, mousePos.current.realX, mousePos.current.realY);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)');

        ctx.strokeStyle = gradient;
        ctx.stroke();
      }

      // --- Click Effects ---
      clickEffectsRef.current = clickEffectsRef.current.filter(effect => {
        const elapsed = Math.max(0, time - effect.startTime);
        const duration = 400; // Snappier duration
        const progress = Math.min(elapsed / duration, 1);

        if (progress >= 1) return false;

        const opacity = 1 - progress;

        // Expanding Ring
        const ringRadius = progress * 70;
        if (ringRadius > 0) {
          ctx.beginPath();
          ctx.arc(effect.x, effect.y, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Expanding HUD brackets
        const bOffset = progress * 25;
        const bSize = 6;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
        ctx.lineWidth = 1;

        // Brackets
        [[-1,-1], [1,-1], [-1,1], [1,1]].forEach(([mx, my]) => {
          ctx.beginPath();
          ctx.moveTo(effect.x + (bOffset + bSize) * mx, effect.y + bOffset * my);
          ctx.lineTo(effect.x + bOffset * mx, effect.y + bOffset * my);
          ctx.lineTo(effect.x + bOffset * mx, effect.y + (bOffset + bSize) * my);
          ctx.stroke();
        });

        // Particles
        effect.particles.forEach(p => {
          const px = effect.x + p.vx * progress * 5;
          const py = effect.y + p.vy * progress * 5;
          const pOpacity = (1 - progress) * 0.8;
          ctx.fillStyle = p.color === '#ffffff' ? `rgba(255, 255, 255, ${pOpacity})` : `rgba(255, 255, 255, ${pOpacity * 0.5})`;
          ctx.fillRect(px - p.size/2, py - p.size/2, p.size, p.size);
        });

        return true;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998] opacity-100"
      />
      
      <div 
        ref={cursorRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9999] bg-white rounded-full flex items-center justify-center ${
          isHovering ? (isClicked ? 'w-8 h-8' : 'w-10 h-10') : (isClicked ? 'w-1 h-1' : 'w-2 h-2')
        }`}
        style={{ 
          willChange: 'transform',
          boxShadow: isClicked ? '0 0 20px #fff' : '0 0 10px rgba(255,255,255,0.5)',
          transition: 'width 0.1s ease-out, height 0.1s ease-out, box-shadow 0.1s ease-out' // Only transit size, not position
        }}
      >
        {isHovering && (
          <div className={`bg-black rounded-full transition-all duration-150 ${isClicked ? 'w-0.5 h-0.5' : 'w-1 h-1'}`} />
        )}
      </div>
    </>
  );
};

export default CustomCursor;
