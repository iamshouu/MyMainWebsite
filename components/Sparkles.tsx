
import React, { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const Sparkles: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      // Увеличиваем количество для более плотного эффекта
      const newSparkles = Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        // Расширяем диапазон от -25% до 125%, чтобы искры выходили за границы текста равномерно
        x: Math.random() * 150 - 25, 
        y: Math.random() * 150 - 25,
        size: Math.random() * 2.5 + 0.8,
        duration: Math.random() * 2.5 + 1.5,
        delay: Math.random() * 5,
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
  }, []);

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Контейнер для искр, который гарантирует, что они не будут обрезаться и будут центрированы */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute bg-white rounded-full animate-sparkle"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              opacity: 0,
              boxShadow: '0 0 4px #fff, 0 0 8px #fff',
              animation: `sparkle ${sparkle.duration}s ease-in-out ${sparkle.delay}s infinite`,
            }}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes sparkle {
          0% { 
            transform: translate(0, 0) scale(0); 
            opacity: 0; 
          }
          30% {
            opacity: 0.8;
          }
          50% { 
            opacity: 1; 
            transform: translate(0, -15px) scale(1.2); 
          }
          80% {
            opacity: 0.4;
          }
          100% { 
            transform: translate(0, -30px) scale(0); 
            opacity: 0; 
          }
        }
      `}</style>
      
      <div className="relative z-10 select-none">
        {children}
      </div>
    </div>
  );
};

export default Sparkles;
