import React from 'react';
import { DesignerProfile } from '../types';
import { defaultDesignerProfile } from '../data/defaultProjects';
import {
  Download,
  Award,
  Briefcase,
  CheckCircle,
  Code,
  Layers,
  Edit2
} from 'lucide-react';

interface AboutSectionProps {
  profile: DesignerProfile;
  onOpenResume: () => void;
  onEditProfile?: (subTab?: 'bio' | 'about_intro' | 'what_i_do' | 'skills' | 'experience' | 'awards') => void;
  lang: 'ko' | 'en';
  isAdminAuthed?: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  profile,
  onOpenResume,
  onEditProfile,
  lang,
  isAdminAuthed = false,
}) => {
  const whatIDo =
    profile.whatIDo && profile.whatIDo.length > 0
      ? profile.whatIDo
      : defaultDesignerProfile.whatIDo || [];

  const skillCategories =
    profile.skillCategories && profile.skillCategories.length > 0
      ? profile.skillCategories
      : defaultDesignerProfile.skillCategories || [];

  const experiences =
    profile.experiences && profile.experiences.length > 0
      ? profile.experiences
      : defaultDesignerProfile.experiences || [];

  const awards =
    profile.awards && profile.awards.length > 0
      ? profile.awards
      : defaultDesignerProfile.awards || [];

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-b border-[#1c283c] pb-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 text-xs font-mono text-[#7a9ec7] uppercase tracking-widest mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4d74a3]"></span>
              <span>About Designer</span>
            </div>
            <h1 className="font-syne text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {lang === 'ko' ? (
                profile.aboutHeadingKr || (
                  <>
                    시각적 임팩트와 <br />
                    움직임을 다루는 <br />
                    <span className="text-[#8bb2e2]">크리에이티브 디자이너</span>
                  </>
                )
              ) : (
                profile.aboutHeadingEn || (
                  <>
                    Creative Designer <br />
                    Specialized in Motion & <br />
                    <span className="text-[#8bb2e2]">Visual Impact</span>
                  </>
                )
              )}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {isAdminAuthed && onEditProfile && (
                <button
                  onClick={() => onEditProfile('about_intro')}
                  className="flex items-center gap-1.5 rounded-full border border-emerald-800/60 bg-emerald-950/30 px-4 py-2.5 text-xs font-medium text-emerald-300 hover:text-white hover:border-emerald-500 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{lang === 'ko' ? 'About 내용 직접 수정' : 'Edit About Content'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422]/70 p-6 sm:p-8">
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-body whitespace-pre-line">
                {lang === 'ko'
                  ? profile.detailedBioKr
                  : profile.detailedBioEn || profile.detailedBioKr}
              </p>

              <div className="mt-6 pt-6 border-t border-[#1c283c] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block uppercase">Location</span>
                  <span className="text-slate-200 font-semibold">{profile.location}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">Work Status</span>
                  <span className="text-[#64b5f6] font-semibold">
                    {profile.status || 'Available for Work'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">Target Role</span>
                  <span className="text-slate-200 font-semibold">
                    {profile.targetRole || profile.roleTitleKr}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What I Do (Scope of Work) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#7a9ec7] uppercase tracking-widest">
              <Layers className="h-3.5 w-3.5" />
              <span>Scope of Work</span>
            </div>
            {isAdminAuthed && onEditProfile && (
              <button
                type="button"
                onClick={() => onEditProfile('what_i_do')}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-800/60 bg-emerald-950/30 px-3 py-1.5 text-xs text-emerald-300 hover:text-white hover:border-emerald-500 transition-colors"
              >
                <Edit2 className="h-3 w-3 text-emerald-400" />
                <span>{lang === 'ko' ? '역량 수정' : 'Edit Scope'}</span>
              </button>
            )}
          </div>
          <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-white mb-8">
            {lang === 'ko' ? '주요 작업 역량 (What I Do)' : 'What I Do'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {whatIDo.map((item, idx) => (
              <div
                key={item.id || idx}
                className="rounded-xl border border-[#1e2d42] bg-[#0c1422]/60 p-5 flex flex-col justify-between hover:border-[#4d74a3] transition-colors"
              >
                <div>
                  <span className="font-mono text-xs text-[#7a9ec7] font-bold">
                    0{idx + 1}
                  </span>
                  <h3 className="mt-2 font-syne text-sm font-bold text-slate-100">
                    {lang === 'ko' ? item.titleKr : item.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Tools Matrix */}
        <div className="pt-8 border-t border-[#1c283c]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#7a9ec7] uppercase tracking-widest">
              <Code className="h-3.5 w-3.5" />
              <span>Technical Mastery</span>
            </div>
            {isAdminAuthed && onEditProfile && (
              <button
                type="button"
                onClick={() => onEditProfile('skills')}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-800/60 bg-emerald-950/30 px-3 py-1.5 text-xs text-emerald-300 hover:text-white hover:border-emerald-500 transition-colors"
              >
                <Edit2 className="h-3 w-3 text-emerald-400" />
                <span>{lang === 'ko' ? '스킬/도구 수정' : 'Edit Skills'}</span>
              </button>
            )}
          </div>
          <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-white mb-8">
            {lang === 'ko' ? '도구 활용 능력 및 파이프라인 (Skills)' : 'Technical Skills & Pipeline'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map((cat, idx) => (
              <div
                key={cat.id || idx}
                className="rounded-xl border border-[#1e2d42] bg-[#0c1422] p-5 space-y-4"
              >
                <h4 className="font-syne text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-[#1c283c] pb-2">
                  {cat.name}
                </h4>
                <div className="space-y-2">
                  {cat.tools.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle className="h-3.5 w-3.5 text-[#4d74a3] flex-shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience & Awards */}
        <div className="pt-8 border-t border-[#1c283c] grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Work Experience */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#7a9ec7] uppercase tracking-widest">
                <Briefcase className="h-3.5 w-3.5" />
                <span>Career Journey</span>
              </div>
              {isAdminAuthed && onEditProfile && (
                <button
                  type="button"
                  onClick={() => onEditProfile('experience')}
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-800/60 bg-emerald-950/30 px-2.5 py-1 text-xs text-emerald-300 hover:text-white hover:border-emerald-500 transition-colors"
                >
                  <Edit2 className="h-3 w-3 text-emerald-400" />
                  <span>{lang === 'ko' ? '경력 수정' : 'Edit'}</span>
                </button>
              )}
            </div>
            <h2 className="font-syne text-2xl font-bold text-white mb-6">
              {lang === 'ko' ? '경력 및 프로젝트 (Experience)' : 'Experience'}
            </h2>

            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className="rounded-xl border border-[#1e2d42] bg-[#0c1422]/60 p-5 hover:border-[#4d74a3] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="font-syne text-sm sm:text-base font-bold text-white">
                      {exp.role}
                    </h4>
                    <span className="font-mono text-[11px] text-[#7a9ec7]">
                      {exp.period}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 block mt-0.5">
                    {exp.place}
                  </span>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {exp.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Awards & Recognition */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#7a9ec7] uppercase tracking-widest">
                <Award className="h-3.5 w-3.5" />
                <span>Recognition</span>
              </div>
              {isAdminAuthed && onEditProfile && (
                <button
                  type="button"
                  onClick={() => onEditProfile('awards')}
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-800/60 bg-emerald-950/30 px-2.5 py-1 text-xs text-emerald-300 hover:text-white hover:border-emerald-500 transition-colors"
                >
                  <Edit2 className="h-3 w-3 text-emerald-400" />
                  <span>{lang === 'ko' ? '수상 수정' : 'Edit'}</span>
                </button>
              )}
            </div>
            <h2 className="font-syne text-2xl font-bold text-white mb-6">
              {lang === 'ko' ? '수상 및 전시 (Awards)' : 'Honors & Awards'}
            </h2>

            <div className="space-y-4">
              {awards.map((award, idx) => (
                <div
                  key={award.id || idx}
                  className="rounded-xl border border-[#1e2d42] bg-[#0c1422]/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#8bb2e2]">
                      {award.year}
                    </span>
                    <span className="text-[11px] text-slate-500">{award.org}</span>
                  </div>
                  <h4 className="mt-1 font-syne text-xs sm:text-sm font-bold text-slate-200">
                    {award.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
