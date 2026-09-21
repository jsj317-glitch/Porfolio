import React from 'react';
import { ActiveTab, DesignerProfile } from '../types';
import { Play, Lock, ArrowUp, Mail, FileText } from 'lucide-react';

interface FooterProps {
  profile?: DesignerProfile;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenShowreel: () => void;
  onOpenResume: () => void;
  isAdminAuthed: boolean;
  lang: 'ko' | 'en';
}

export const Footer: React.FC<FooterProps> = ({
  profile,
  setActiveTab,
  onOpenShowreel,
  onOpenResume,
  isAdminAuthed,
  lang,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#1c283c] bg-[#080d16] py-12 sm:py-16 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Upper Banner CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#1c283c] pb-12">
          <div>
            <h3 className="font-syne text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'ko' ? '함께 새로운 시각적 기준을 만듭니다.' : 'Ready to shape the next visual standard?'}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl font-body">
              {lang === 'ko'
                ? '포스터, 모션그래픽, 영상편집, 생성형 AI 콘텐츠 제작에 대한 모든 기회에 열려 있습니다.'
                : 'Available for design studio collaborations, agency partnerships, and in-house creative roles.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('contact');
                scrollToTop();
              }}
              className="rounded-full bg-[#3b5b82] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#4a72a3] transition-colors shadow-lg shadow-[#1e3352]/30"
            >
              {lang === 'ko' ? '프로젝트 / 채용 문의' : 'Start a Conversation'}
            </button>
            <button
              onClick={onOpenShowreel}
              className="flex items-center gap-2 rounded-full border border-[#223550] bg-[#111d2e] px-4 py-2.5 text-xs text-slate-200 hover:text-white hover:border-[#4d74a3] transition-colors"
            >
              <Play className="h-3 w-3 fill-[#64b5f6] text-[#64b5f6]" />
              <span>30s Reel</span>
            </button>
          </div>
        </div>

        {/* Links & Brand Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-mono">
          <div>
            <span className="text-white font-syne font-bold tracking-wider block mb-3 text-sm">
              {profile?.nameEn?.toUpperCase() || 'SEONJEONG JEON'}
            </span>
            <p className="text-slate-400 leading-relaxed font-sans text-[11px]">
              {profile?.roleTitleEn || 'Visual & Motion Designer.'} {lang === 'ko' ? profile?.oneLineBioKr : (profile?.oneLineBioEn || profile?.oneLineBioKr)}
            </p>
          </div>

          <div>
            <span className="text-[#8bb2e2] font-bold uppercase tracking-wider block mb-3 text-[11px]">
              Navigation
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('work');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Selected Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('about');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  About Me
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-[#8bb2e2] font-bold uppercase tracking-wider block mb-3 text-[11px]">
              Categories
            </span>
            <ul className="space-y-2 text-slate-500">
              <li>Poster Design</li>
              <li>2D Motion Graphics</li>
              <li>3D Motion Graphics</li>
              <li>Video Editing & Color</li>
              <li>Generative AI Directing</li>
            </ul>
          </div>

          <div>
            <span className="text-[#8bb2e2] font-bold uppercase tracking-wider block mb-3 text-[11px]">
              Direct Contact
            </span>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${profile?.email || 'sunjung317@naver.com'}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors truncate text-slate-300"
                >
                  <Mail className="h-3 w-3 text-[#7a9ec7]" />
                  <span>{profile?.email || 'sunjung317@naver.com'}</span>
                </a>
              </li>
              <li>
                <button
                  onClick={scrollToTop}
                  className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowUp className="h-3 w-3" />
                  <span>Back to Top</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#1c283c] text-[11px] font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} {profile?.nameEn || 'Seonjeong Jeon'}. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              STATUS: <span className="text-[#64b5f6] uppercase">{profile?.status || 'AVAILABLE FOR WORK'}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
