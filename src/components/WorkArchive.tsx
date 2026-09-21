import React, { useState, useMemo } from 'react';
import { Project, Category } from '../types';
import { resolveMediaUrl } from '../utils/mediaStorage';
import { Search, Play, ArrowUpRight, Filter, LayoutGrid, List, Sparkles, Plus } from 'lucide-react';

interface WorkArchiveProps {
  projects: Project[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  onSelectProject: (project: Project) => void;
  onStartUpload?: () => void;
  isAdminAuthed?: boolean;
  lang: 'ko' | 'en';
}

export const WorkArchive: React.FC<WorkArchiveProps> = ({
  projects,
  selectedCategory,
  onSelectCategory,
  onSelectProject,
  onStartUpload,
  isAdminAuthed = false,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: { id: Category; labelKo: string; labelEn: string }[] = [
    { id: 'All', labelKo: '전체 (All)', labelEn: 'All' },
    { id: 'Poster', labelKo: '포스터', labelEn: 'Poster' },
    { id: '2D Motion Graphics', labelKo: '2D 모션그래픽', labelEn: '2D Motion' },
    { id: '3D Motion Graphics', labelKo: '3D 모션그래픽', labelEn: '3D Motion' },
    { id: 'Video Editing', labelKo: '촬영 / 영상편집', labelEn: 'Video Editing' },
    { id: 'Generative AI Content', labelKo: '생성형 AI 콘텐츠', labelEn: 'Generative AI' },
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.titleKr.toLowerCase().includes(query) ||
        project.tools.some((t) => t.toLowerCase().includes(query)) ||
        project.overview.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-mono text-[#7a9ec7] uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4d74a3]"></span>
            <span>Archive Index</span>
          </div>
          <h1 className="mt-2 font-syne text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {lang === 'ko' ? '포트폴리오 아카이브' : 'Selected Works & Archive'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 font-body max-w-2xl">
            {lang === 'ko'
              ? '포스터, 2D/3D 모션그래픽, 영상편집, 생성형 AI 디렉팅 전반의 실무 작업과 문제 해결 과정을 기록한 프로젝트 모음입니다.'
              : 'A curated catalogue of projects demonstrating conceptual rigor, technical precision, and dynamic motion.'}
          </p>
        </div>

        {/* Filters and Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#1c283c]">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#3b5b82] text-white font-semibold shadow-md'
                      : 'bg-[#0c1422] border border-[#1e2d42] text-slate-400 hover:border-[#3b5b82] hover:text-slate-200'
                  }`}
                >
                  {lang === 'ko' ? cat.labelKo : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Search & Layout Toggles */}
          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ko' ? '프로젝트 또는 툴 검색...' : 'Filter by title, tool...'}
                className="w-full rounded-full border border-[#1e2d42] bg-[#0c1422]/90 pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:border-[#4d74a3] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white font-mono"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* View Mode Toggle & Upload Action */}
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-[#1e2d42] bg-[#0c1422] p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded p-1.5 transition-colors ${
                    viewMode === 'grid' ? 'bg-[#3b5b82] text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded p-1.5 transition-colors ${
                    viewMode === 'list' ? 'bg-[#3b5b82] text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="List view"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>

              {isAdminAuthed && onStartUpload && (
                <button
                  onClick={onStartUpload}
                  className="flex items-center gap-1.5 rounded-lg bg-[#3b5b82] hover:bg-[#4a72a3] text-white px-3 py-1.5 text-xs font-semibold shadow-md shadow-[#1e3352]/30 transition-colors whitespace-nowrap"
                  title="내 컴퓨터에서 로컬 작업물 직접 업로드"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{lang === 'ko' ? '작업물 직접 올리기' : 'Upload Work'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Count notification */}
        <div className="mt-6 mb-6 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>
            SHOWING {filteredProjects.length} OF {projects.length} PROJECTS
          </span>
          {selectedCategory !== 'All' && (
            <span className="text-[#8bb2e2]">CATEGORY: {selectedCategory.toUpperCase()}</span>
          )}
        </div>

        {/* Projects View */}
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-[#1e2d42] bg-[#0c1422]/40">
            <Search className="h-8 w-8 text-slate-600 mb-3" />
            <p className="font-syne text-base font-bold text-slate-300">
              {lang === 'ko' ? '검색 결과가 없습니다' : 'No matching projects found'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {lang === 'ko'
                ? '다른 키워드나 카테고리를 선택해 보세요.'
                : 'Try adjusting your search terms or category filter.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('All');
              }}
              className="mt-4 rounded-full border border-[#223550] bg-[#0e1726] px-4 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
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

                  {/* Dark Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090e17]/85 via-[#090e17]/25 to-transparent opacity-60 transition-opacity group-hover:opacity-30"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-md bg-[#090e17]/85 px-2 py-1 text-[10px] font-mono font-medium text-slate-300 backdrop-blur-md border border-[#1f3047]">
                      {project.category}
                    </span>
                    <span className="rounded-md bg-[#090e17]/85 px-2 py-1 text-[10px] font-mono text-slate-400 backdrop-blur-md border border-[#1f3047]">
                      {project.year}
                    </span>
                  </div>

                  {/* Video Badge */}
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
                      {project.overview}
                    </p>
                  </div>

                  {/* Bottom Tools */}
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
                      View Case →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="divide-y divide-[#1c283c] rounded-xl border border-[#1e2d42] bg-[#0c1422]/60">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 hover:bg-[#132034]/60 cursor-pointer transition-colors gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-[#070b14] relative flex items-center justify-center">
                    <img
                      src={resolveMediaUrl(project.thumbnailUrl)}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover blur-md opacity-35 scale-110"
                    />
                    <img
                      src={resolveMediaUrl(project.thumbnailUrl)}
                      alt={project.title}
                      className={`relative z-10 h-full w-full ${
                        project.category === 'Poster' ? 'object-contain p-1' : 'object-cover'
                      } group-hover:scale-105 transition-transform`}
                    />
                    {project.heroMediaType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Play className="h-3 w-3 fill-white text-white" />
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="font-mono text-[10px] text-[#7a9ec7] uppercase">
                      {project.category} • {project.year}
                    </span>
                    <h3 className="font-syne text-sm sm:text-base font-bold text-white group-hover:text-[#9fc1e8]">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-1 max-w-xl">
                      {project.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="hidden md:flex flex-wrap gap-1">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded bg-[#131e2e] border border-[#1e2e44] px-1.5 py-0.5 text-[10px] font-mono text-slate-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 rounded-full border border-[#1e2d42] px-3 py-1 text-xs text-slate-300 group-hover:border-[#4d74a3] group-hover:text-white">
                    <span>View</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
