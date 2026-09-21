import React from 'react';
import { Project, Category } from '../types';
import { resolveMediaUrl } from '../utils/mediaStorage';
import { ArrowUpRight, Play, Eye, Sparkles } from 'lucide-react';

interface SelectedWorksProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onViewAllWorks: () => void;
  lang: 'ko' | 'en';
}

export const SelectedWorks: React.FC<SelectedWorksProps> = ({
  projects,
  onSelectProject,
  onViewAllWorks,
  lang,
}) => {
  // Filter only featured projects
  const featured = projects.filter((p) => p.isFeatured).slice(0, 6);

  return (
    <section className="py-20 border-b border-[#1c283c]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#7a9ec7] uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4d74a3]"></span>
              <span>Curated Showcase</span>
            </div>
            <h2 className="mt-2 font-syne text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {lang === 'ko' ? '주요 대표 작업 (Selected Works)' : 'Selected Works (2024–2025)'}
            </h2>
          </div>

          <button
            onClick={onViewAllWorks}
            className="group flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <span>{lang === 'ko' ? '전체 작업물 아카이브 보기' : 'View Full Archive'}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#8bb2e2]" />
          </button>
        </div>

        {/* Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group relative flex flex-col cursor-pointer overflow-hidden rounded-xl border border-[#1e2d42] bg-[#0c1422] transition-all duration-300 hover:border-[#4d74a3] hover:shadow-2xl hover:shadow-[#1e3352]/20"
            >
              {/* Media Thumbnail Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#070b14] flex items-center justify-center">
                <img
                  src={resolveMediaUrl(project.thumbnailUrl)}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover blur-xl opacity-35 scale-110"
                />
                <img
                  src={resolveMediaUrl(project.thumbnailUrl)}
                  alt={project.title}
                  className={`relative z-10 h-full w-full transition-transform duration-700 ease-out group-hover:scale-105 ${
                    project.category === 'Poster' ? 'object-contain p-2' : 'object-cover'
                  }`}
                  loading="lazy"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#090e17]/85 via-[#090e17]/25 to-transparent opacity-60 transition-opacity group-hover:opacity-40"></div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-md bg-[#090e17]/85 px-2 py-1 text-[10px] font-mono font-medium text-slate-300 backdrop-blur-md border border-[#1f3047]">
                    {project.category}
                  </span>

                  <span className="rounded-md bg-[#090e17]/85 px-2 py-1 text-[10px] font-mono text-slate-400 backdrop-blur-md border border-[#1f3047]">
                    {project.year}
                  </span>
                </div>

                {/* Video Play Indicator if video */}
                {project.heroMediaType === 'video' && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-[#090e17]/80 px-2.5 py-1 text-[10px] font-mono text-slate-200 backdrop-blur-md border border-[#223550]">
                    <Play className="h-2.5 w-2.5 fill-[#5c86ba] text-[#5c86ba]" />
                    <span>{project.duration || 'Motion'}</span>
                  </div>
                )}
              </div>

              {/* Card Meta Content */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-syne text-base sm:text-lg font-bold text-white transition-colors group-hover:text-[#9fc1e8]">
                      {project.title}
                    </h3>
                    <div className="rounded-full p-1 text-slate-500 transition-colors group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {lang === 'ko' ? project.overview : project.overview}
                  </p>
                </div>

                {/* Bottom Tools & Role */}
                <div className="mt-5 pt-3 border-t border-[#1c283c] flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {project.tools.slice(0, 3).map((tool) => (
                      <span
                        key={tool}
                        className="rounded bg-[#131e2e] border border-[#1e2e44] px-1.5 py-0.5 text-[10px] font-mono text-slate-300"
                      >
                        {tool}
                      </span>
                    ))}
                    {project.tools.length > 3 && (
                      <span className="text-[10px] font-mono text-slate-500">
                        +{project.tools.length - 3}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-[#8bb2e2] uppercase group-hover:translate-x-0.5 transition-transform">
                    Case Study →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
