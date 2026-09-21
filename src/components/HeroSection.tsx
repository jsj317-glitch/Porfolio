import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, Sparkles, Download, Layers, ShieldCheck, Film, Edit2 } from 'lucide-react';
import { ActiveTab, DesignerProfile } from '../types';
import { resolveMediaUrl } from '../utils/mediaStorage';

const DEFAULT_HERO_VIDEO =
  'https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-digital-grid-animation-43093-large.mp4';
const SHOWREEL_STORAGE_KEY = 'seonjeong_custom_showreel_v1';

interface HeroSectionProps {
  profile: DesignerProfile;
  onOpenShowreel: () => void;
  onExploreWorks: () => void;
  onOpenResume: () => void;
  onEditProfile?: () => void;
  lang: 'ko' | 'en';
  isAdminAuthed?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  onOpenShowreel,
  onExploreWorks,
  onOpenResume,
  onEditProfile,
  lang,
  isAdminAuthed = false,
}) => {
  const [heroVideoSrc, setHeroVideoSrc] = useState(DEFAULT_HERO_VIDEO);

  useEffect(() => {
    try {
      const customVideo = localStorage.getItem(SHOWREEL_STORAGE_KEY);
      if (customVideo) {
        setHeroVideoSrc(customVideo);
      }
    } catch {
      // ignore
    }
  }, []);
  const tools = [
    { name: 'After Effects', category: 'Motion' },
    { name: 'Premiere Pro', category: 'Video' },
    { name: 'Cinema 4D', category: '3D' },
    { name: 'Octanerender', category: '3D Render' },
    { name: 'Photoshop', category: 'Graphic' },
    { name: 'Illustrator', category: 'Vector' },
    { name: 'Midjourney', category: 'AI Directing' },
    { name: 'Comfy UI', category: 'AI Pipeline' },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24 border-b border-[#1c283c]">
      {/* Subtle Background Glow Elements (Muted Deep Blue) */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-[#1b2f4a]/25 blur-3xl"></div>
      <div className="pointer-events-none absolute top-1/3 right-0 -z-10 h-80 w-80 rounded-full bg-[#182a42]/30 blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Status Pill & Designer Badge */}
        <div className="mb-6 flex flex-wrap items-center gap-2.5 justify-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#223550] bg-[#0d1624]/90 px-3.5 py-1 text-xs text-slate-300 shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] tracking-wide text-slate-300">
              {profile.status || (lang === 'ko' ? '채용 지원 가능 • 인하우스 / 에이전시 크리에이티브' : 'Available for Full-time & Studio Projects')}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#223550] bg-[#0c1422] px-3 py-1 font-mono text-[11px] text-[#8cb0dc]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4d74a3]"></span>
            <span>{profile.nameEn ? profile.nameEn.toUpperCase() : 'SEONJEONG JEON'} PORTFOLIO</span>
          </div>

          {isAdminAuthed && onEditProfile && (
            <button
              onClick={onEditProfile}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800/60 bg-emerald-950/30 px-3 py-1 font-mono text-[11px] text-emerald-300 hover:text-white hover:border-emerald-500 transition-colors"
              title="소개글 / 프로필 수정 (관리자 전용)"
            >
              <Edit2 className="h-3 w-3 text-emerald-400" />
              <span>{lang === 'ko' ? '소개글 수정' : 'Edit Intro'}</span>
            </button>
          )}
        </div>

        {/* Hero Main Heading & Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <h1 className="font-syne text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl leading-snug">
              {lang === 'ko' ? (
                <>
                  <span className="text-[#8bb2e2] block text-sm sm:text-base font-semibold font-mono tracking-normal mb-2">
                    {profile.roleTitleKr} {profile.nameKr}
                  </span>
                  {profile.oneLineBioKr || (
                    <>
                      포스터, 모션그래픽, 영상편집, <br className="hidden sm:inline" />
                      생성형 AI를 융합하는 <br />
                      <span className="bg-gradient-to-r from-white via-slate-200 to-[#93b6e2] bg-clip-text text-transparent">
                        크리에이티브 디자이너
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <span className="text-[#8bb2e2] block text-sm sm:text-base font-semibold font-mono tracking-normal mb-2">
                    {profile.nameEn}
                  </span>
                  {profile.oneLineBioEn || profile.roleTitleEn || 'Visual & Motion Designer'}
                </>
              )}
            </h1>

            <p className="mt-5 max-w-2xl text-xs sm:text-sm text-slate-400 leading-relaxed font-body whitespace-pre-line">
              {lang === 'ko'
                ? (profile.headlineKr || profile.detailedBioKr)
                : (profile.headlineEn || profile.detailedBioEn || profile.headlineKr || profile.detailedBioKr)}
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onOpenShowreel}
                className="group flex items-center gap-2.5 rounded-full bg-white px-6 py-3 text-xs sm:text-sm font-bold tracking-wide text-slate-950 transition-all duration-300 hover:bg-slate-200 hover:shadow-lg hover:shadow-white/10"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1b2b40] text-[#9dc2f0] group-hover:scale-110 transition-transform">
                  <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
                </div>
                <span>{lang === 'ko' ? '30초 쇼릴 영상 보기' : 'Watch 30s Showreel'}</span>
              </button>

              <button
                onClick={onExploreWorks}
                className="group flex items-center gap-2 rounded-full border border-[#223550] bg-[#0e1726] px-6 py-3 text-xs sm:text-sm font-semibold tracking-wide text-slate-200 transition-all duration-300 hover:border-[#4d74a3] hover:bg-[#142339] hover:text-white"
              >
                <span>{lang === 'ko' ? '작업물 아카이브 탐색' : 'Explore Selected Works'}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-[#8cb0dc]" />
              </button>
            </div>
          </div>

          {/* Quick Metrics / Philosophy Card */}
          <div className="lg:col-span-4 border-l border-[#1c283c] lg:pl-8 space-y-5">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-[#7a9ec7] uppercase">
                {lang === 'ko' ? '핵심 역량 키워드' : 'Core Disciplines'}
              </span>
              <p className="mt-1 font-syne text-sm font-bold text-slate-200">
                Visual Impact • Motion • Storytelling • Hybrid Creative
              </p>
            </div>

            <div className="rounded-xl border border-[#1e2d42] bg-[#0d1624]/60 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{lang === 'ko' ? '포트폴리오 완성도' : 'Portfolio Readiness'}</span>
                <span className="font-mono font-bold text-[#8eb6e7]">100% Complete</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#182638]">
                <div className="h-full rounded-full bg-[#4d74a3] w-full"></div>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                {lang === 'ko'
                  ? '단순 결과물 나열이 아닌, 문제 해결 과정과 Before/After 디렉팅이 검증된 프로젝트로 구성되었습니다.'
                  : 'Every project documents research, styleframes, node setups, and creative directing.'}
              </p>
            </div>
          </div>
        </div>

        {/* Featured Video Teaser Banner (Click to launch Showreel) */}
        <div className="mt-14 sm:mt-16">
          <div
            onClick={onOpenShowreel}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#1e2d42] bg-[#0c1422] transition-all duration-500 hover:border-[#4d74a3] hover:shadow-2xl hover:shadow-[#1e3352]/30"
          >
            {/* Ambient Background Video loop */}
            <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden">
              <video
                src={resolveMediaUrl(heroVideoSrc)}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#090e17]/95 via-[#090e17]/50 to-[#090e17]/85"></div>
            </div>

            {/* Teaser Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-[#4d74a3] animate-pulse"></span>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#9ec0eb]">
                    2025/2026 OFFICIAL SHOWREEL TEASER
                  </span>
                </div>
                <span className="rounded-full bg-[#090e17]/80 border border-[#223550] px-3 py-1 font-mono text-xs text-slate-300 backdrop-blur-md">
                  00:30 RUNTIME
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <h3 className="font-syne text-xl sm:text-3xl font-bold text-white tracking-wide">
                    {lang === 'ko' ? '대표 작업 30초 쇼릴 시청하기' : 'Play Full 30s Showreel'}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300 font-light">
                    {lang === 'ko'
                      ? '포스터, 2D/3D 모션, 시네마틱 영상편집, AI 디렉팅 하이라이트 모음'
                      : 'Curated highlights of 2D/3D Motion, Poster Typography, Video Cuts & AI Directing'}
                  </p>
                </div>

                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white text-slate-900 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#3b5b82] group-hover:text-white shadow-xl">
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Marquee & Badges */}
        <div className="mt-14 pt-8 border-t border-[#1c283c]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#7a9ec7]">
              {lang === 'ko' ? '활용 및 숙련 툴 스택' : 'Proficient Design & Production Tools'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'ko' ? '기획부터 후반 제작 및 마스터링까지 자체 완결' : 'End-to-End Production Pipeline'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="group flex items-center gap-2 rounded-lg border border-[#1e2d42] bg-[#0c1422]/80 px-3 py-1.5 transition-all hover:border-[#3b5b82] hover:bg-[#132034]"
              >
                <span className="font-body text-xs font-medium text-slate-200 group-hover:text-white">
                  {tool.name}
                </span>
                <span className="rounded bg-[#182638] px-1.5 py-0.5 text-[9px] font-mono text-[#8cb0dc] group-hover:text-white">
                  {tool.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
