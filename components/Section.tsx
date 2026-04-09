
import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ id, children, className = '' }) => {
  const [isActive, setIsActive] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // На мобильных устройствах лучше использовать меньший порог, 
    // так как область видимости меньше и скролл быстрее
    const isMobile = window.innerWidth < 768;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      {
        threshold: isMobile ? 0.15 : 0.3, 
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`min-h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative px-4 md:px-20 py-16 md:py-12 overflow-hidden ${className}`}
    >
      <div className={`w-full h-full flex flex-col items-center justify-center section-transition ${isActive ? 'section-active' : ''}`}>
        {children}
      </div>
    </section>
  );
};

export default Section;
