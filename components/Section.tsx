
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

    const section = sectionRef.current;
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`min-h-[100dvh] w-full snap-start md:snap-always flex flex-col items-center justify-center relative px-4 py-20 md:px-20 md:py-12 ${/\boverflow-/.test(className) ? '' : 'overflow-hidden'} ${className}`}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '100dvh' }}
    >
      <div
        className={`w-full flex flex-col items-center justify-center section-transition ${isActive ? 'section-active' : ''}`}
        style={{ flex: '1 1 0%' }}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;
