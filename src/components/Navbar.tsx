import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { Play, Lock, Menu, X, Globe, Sparkles, FileText, Plus } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenShowreel: () => void;
  onOpenResume: () => void;
  onStartUpload?: () => void;
  lang: 'ko' | 'en';
  setLang: (lang: 'ko' | 'en') => void;
  isAdminAuthed: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenShowreel,
  onOpenResume,
  onStartUpload,
  lang,
  setLang,
  isAdminAuthed,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; labelKo: string; labelEn: string }[] = [
    { id: 'home', labelKo: 'Home', labelEn: 'Home' },
    { id: 'work', labelKo: 'Works', labelEn: 'Selected Works' },
    { id: 'about', labelKo: 'About', labelEn: 'About' },
    { id: 'contact', labelKo: 'Contact', labelEn: 'Contact' },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1c283c]/80 bg-[#090e17]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#0e1726] border border-[#223550] font-syne font-extrabold text-white transition-all duration-300 group-hover:border-[#4d74a3] group-hover:bg-[#132034]">
            <span className="text-sm tracking-tighter">SJ</span>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4d74a3] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4d74a3]"></span>
            </span>
          </div>
          <div>
            <span className="block font-syne text-sm font-bold tracking-wider text-slate-100 group-hover:text-white transition-colors">
              SEONJEONG JEON
            </span>
            <span className="block text-[10px] tracking-widest text-slate-400 font-medium">
              VISUAL & MOTION DESIGN
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-[#1e2d42] bg-[#0c1422]/80 p-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-1.5 text-xs font-medium tracking-wider uppercase transition-all duration-200 rounded-full ${
                  isActive
                    ? 'text-white bg-[#3b5b82] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#162236]/60'
                }`}
              >
                {lang === 'ko' ? item.labelKo : item.labelEn}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Quick Showreel Button */}
          <button
            onClick={onOpenShowreel}
            className="group flex items-center gap-2 rounded-full border border-[#223550] bg-[#0e1726] px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-all duration-200 hover:border-[#4d74a3] hover:bg-[#142236] hover:text-white"
          >
            <Play className="h-3 w-3 fill-[#5c86ba] text-[#5c86ba] transition-transform group-hover:scale-110" />
            <span>Showreel <span className="text-slate-400 font-mono text-[11px]">0:30</span></span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
            className="flex items-center gap-1 rounded-md border border-[#1e2d42] px-2 py-1 text-[11px] font-mono font-medium text-slate-400 hover:border-[#3b5b82] hover:text-slate-200"
            title="한국어 / English"
          >
            <Globe className="h-3 w-3 text-slate-500" />
            <span className={lang === 'ko' ? 'text-white font-bold' : ''}>KR</span>
            <span className="text-slate-600">/</span>
            <span className={lang === 'en' ? 'text-white font-bold' : ''}>EN</span>
          </button>

          {/* Direct Upload Work CTA Button (Only visible when admin authenticated) */}
          {isAdminAuthed && onStartUpload && (
            <button
              onClick={onStartUpload}
              className="flex items-center gap-1.5 rounded-full bg-[#3b5b82] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-[#1e3352]/40 transition-all hover:bg-[#4a72a3]"
              title="내 로컬 작업물 직접 업로드하기"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{lang === 'ko' ? '작업물 업로드' : 'Upload'}</span>
            </button>
          )}

          {/* Admin Access */}
          <button
            onClick={() => handleNavClick('admin')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-mono transition-all ${
              activeTab === 'admin'
                ? 'bg-[#1b2b42] text-[#9fc1e8] border border-[#3b5b82]'
                : isAdminAuthed
                ? 'text-emerald-400 border border-emerald-900/60 bg-emerald-950/20 hover:bg-emerald-950/40'
                : 'text-slate-500 border border-[#1e2d42] hover:text-slate-300 hover:border-[#3b5b82]'
            }`}
            title="Admin Management"
          >
            <Lock className="h-3 w-3" />
            <span>{isAdminAuthed ? 'Admin ✓' : 'Admin'}</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenShowreel}
            className="flex items-center gap-1.5 rounded-full border border-[#223550] bg-[#0e1726] px-2.5 py-1 text-xs font-semibold text-slate-200"
          >
            <Play className="h-2.5 w-2.5 fill-[#5c86ba] text-[#5c86ba]" />
            <span className="text-[11px]">Reel</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-[#1e2d42] p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[#1c283c] bg-[#0c1422] px-4 pt-3 pb-5 md:hidden space-y-2">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-[#3b5b82] text-white font-semibold'
                    : 'text-slate-400 hover:bg-[#142033] hover:text-slate-200'
                }`}
              >
                <span>{lang === 'ko' ? item.labelKo : item.labelEn}</span>
                {activeTab === item.id && <span className="h-1.5 w-1.5 rounded-full bg-[#7ca6dc]"></span>}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1c283c] flex flex-wrap items-center justify-between gap-2">
            {isAdminAuthed && onStartUpload && (
              <button
                onClick={() => {
                  onStartUpload();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#3b5b82] py-2 text-xs font-semibold text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{lang === 'ko' ? '작업물 직접 업로드하기' : 'Upload My Work'}</span>
              </button>
            )}

            <button
              onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
              className="flex items-center gap-1.5 text-xs font-mono text-slate-400"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{lang.toUpperCase()}</span>
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{isAdminAuthed ? 'Admin ✓' : 'Admin'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
