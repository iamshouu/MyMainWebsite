
import React from 'react';
import { ProjectItem } from '../types';
import { ExternalLink, FlaskConical, Layout } from 'lucide-react';

interface ProjectCardProps { project: ProjectItem; }

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:border-white/30 hover:shadow-[0_0_80px_rgba(255,255,255,0.05)] flex flex-col w-full">
      
      <div className="relative h-48 md:h-64 overflow-hidden bg-black/60">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 blur-[60px] rounded-full group-hover:bg-white/10 transition-all duration-700 z-0" />
        
        <img 
          src={project.imageUrl} 
          alt={project.title}
          className="w-full h-full object-cover opacity-40 grayscale transition-all duration-1000 group-hover:scale-105 group-hover:opacity-60 group-hover:grayscale-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611974715853-2b8ef9597394?q=80&w=2070&auto=format&fit=crop';
          }}
        />
        
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex gap-2">
          <span className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-mono text-white/60 uppercase tracking-widest font-bold">
            {project.category}
          </span>
          <span className="px-3 py-1 bg-white text-black rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
            <FlaskConical size={10} />
            BETA
          </span>
        </div>
      </div>

      <div className="px-6 md:px-8 pb-8 md:pb-10 flex flex-col flex-1 relative">
        <div className="flex items-center gap-2.5 mb-4 -mt-4 relative z-20">
            <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white shadow-xl">
                <Layout size={14} strokeWidth={2} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-white transition-colors duration-300 tracking-tight">
                {project.title}
            </h3>
        </div>

        <p className="text-[13px] md:text-sm text-neutral-300 mb-6 leading-relaxed font-normal line-clamp-3">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-8 mt-auto">
          {project.tags.map(tag => (
            <span key={tag} className="text-[9px] font-mono text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded-md uppercase tracking-tighter hover:text-white hover:border-white/20 transition-colors cursor-default">
              {tag}
            </span>
          ))}
        </div>

        <a 
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn flex items-center justify-center gap-2 w-full py-4 bg-transparent border border-white/10 rounded-2xl text-[11px] font-bold text-white hover:bg-white hover:text-black transition-all duration-500 shadow-lg relative overflow-hidden"
        >
          <span className="relative z-10 uppercase tracking-widest">ОТКРЫТЬ BETA</span>
          <ExternalLink size={14} className="relative z-10 opacity-70" />
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
