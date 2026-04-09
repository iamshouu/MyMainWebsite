import React from 'react';
import { SECTIONS } from '../constants';

interface NavigationProps {
  activeSection: string;
  scrollToSection: (id: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, scrollToSection }) => {
  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-6">
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className="group flex items-center justify-end gap-4 focus:outline-none"
          aria-label={`Scroll to ${section.label}`}
        >
          <span
            className={`text-sm font-medium transition-all duration-300 ${
              activeSection === section.id
                ? 'text-brand opacity-100 translate-x-0'
                : 'text-dark-muted opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'
            }`}
          >
            {section.label}
          </span>
          <div
            className={`h-2 w-2 rounded-full transition-all duration-500 ${
              activeSection === section.id
                ? 'bg-brand shadow-[0_0_10px_rgba(34,211,238,0.8)] scale-125'
                : 'bg-dark-muted group-hover:bg-white'
            }`}
          />
        </button>
      ))}
    </nav>
  );
};

export default Navigation;