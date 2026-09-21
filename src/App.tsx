import React, { useState, useEffect } from 'react';
import { Project, Category, ActiveTab, DesignerProfile, SkillCategoryItem } from './types';
import { defaultProjects, defaultDesignerProfile } from './data/defaultProjects';
import {
  initMediaStorage,
  loadProjectsPersistently,
  saveProjectsPersistently,
} from './utils/mediaStorage';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SelectedWorks } from './components/SelectedWorks';
import { CategoryShortcuts } from './components/CategoryShortcuts';
import { WorkArchive } from './components/WorkArchive';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ShowreelModal } from './components/ShowreelModal';
import { AboutSection } from './components/AboutSection';
import { ResumeModal } from './components/ResumeModal';
import { ContactSection } from './components/ContactSection';
import { AdminPanel } from './components/AdminPanel';
import { ProfileSubTab } from './components/ProfileEditSection';
import { Footer } from './components/Footer';

const STORAGE_KEY = 'seonjeong_jeon_portfolio_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);
  const [autoOpenUpload, setAutoOpenUpload] = useState(false);
  const [adminEditingProject, setAdminEditingProject] = useState<Project | null>(null);

  // Load initial projects from localStorage or default
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved projects', e);
    }
    return defaultProjects;
  });

  // Initialize IndexedDB media storage and verify latest persisted projects
  useEffect(() => {
    async function initStorage() {
      await initMediaStorage();
      const persisted = await loadProjectsPersistently();
      if (persisted && Array.isArray(persisted) && persisted.length > 0) {
        setProjects(persisted);
      }
    }
    initStorage();
  }, []);

  const PROFILE_STORAGE_KEY = 'seonjeong_designer_profile_v1';

  // Helper to sanitize skills (remove Blender, Davinci Resolve, Runway Gen-3, Stable Diffusion, Figma; add Octanerender, Comfy UI)
  const sanitizeSkillCategories = (cats: SkillCategoryItem[]): SkillCategoryItem[] => {
    const bannedRegex = /blender|davinci|runway|stable\s*diffusion|figma/i;
    return cats.map((cat) => {
      let tools = (cat.tools || []).filter((t: string) => !bannedRegex.test(t));
      if (/3D/i.test(cat.name) && !tools.some((t: string) => /octane/i.test(t))) {
        tools.push('Octanerender');
      }
      if (/AI/i.test(cat.name) && !tools.some((t: string) => /comfy/i.test(t))) {
        tools.push('Comfy UI');
      }
      // normalize any existing 'Comfy UI (Multi AI)' to 'Comfy UI'
      tools = tools.map((t: string) => t.replace(/Comfy UI \(Multi AI\)/i, 'Comfy UI'));
      return { ...cat, tools };
    });
  };

  const [profile, setProfile] = useState<DesignerProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const rawCats = parsed.skillCategories && parsed.skillCategories.length > 0
          ? parsed.skillCategories
          : defaultDesignerProfile.skillCategories;
        return {
          ...defaultDesignerProfile,
          ...parsed,
          vimeo: '',
          whatIDo: parsed.whatIDo && parsed.whatIDo.length > 0 ? parsed.whatIDo : defaultDesignerProfile.whatIDo,
          skillCategories: sanitizeSkillCategories(rawCats),
          experiences: parsed.experiences && parsed.experiences.length > 0 ? parsed.experiences : defaultDesignerProfile.experiences,
          awards: parsed.awards && parsed.awards.length > 0 ? parsed.awards : defaultDesignerProfile.awards,
        };
      }
    } catch {
      // fallback
    }
    return defaultDesignerProfile;
  });

  const [adminInitialTab, setAdminInitialTab] = useState<'projects' | 'profile'>('projects');
  const [adminProfileSubTab, setAdminProfileSubTab] = useState<ProfileSubTab>('about_intro');

  // Save profile to localStorage and state
  const handleSaveProfile = (newProfile: DesignerProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    } catch (err) {
      console.error('Failed to save profile to localStorage:', err);
    }
  };

  // Reset profile to default
  const handleResetProfileToDefaults = () => {
    setProfile(defaultDesignerProfile);
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to reset profile in localStorage:', err);
    }
  };

  // Save projects to IndexedDB & localStorage whenever updated
  const handleSaveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    saveProjectsPersistently(newProjects);
  };

  // Delete project from anywhere in the app
  const handleDeleteProject = (projectToDelete: Project) => {
    const updated = projects.filter((p) => p.id !== projectToDelete.id);
    handleSaveProjects(updated);
  };

  // Reset to default sample projects
  const handleResetToDefaults = () => {
    setProjects(defaultProjects);
    saveProjectsPersistently(defaultProjects);
  };

  // Triggered when user wants to upload their own work directly
  const handleStartUpload = () => {
    setAdminInitialTab('projects');
    setAutoOpenUpload(true);
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Triggered when editing a project directly from detail modal (Flowerpot, etc.)
  const handleEditProject = (proj: Project) => {
    setSelectedProject(null);
    setAdminEditingProject(proj);
    setAdminInitialTab('projects');
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Triggered when user wants to edit their bio / profile directly (requires admin auth)
  const handleOpenProfileEditor = (subTab: ProfileSubTab = 'about_intro') => {
    setAdminInitialTab('profile');
    setAdminProfileSubTab(subTab);
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Next & Previous Project Navigation in Detail Modal
  const handleNextProject = () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % projects.length;
    setSelectedProject(projects[nextIndex]);
  };

  const handlePrevProject = () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id);
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    setSelectedProject(projects[prevIndex]);
  };

  // Direct category shortcut from Home
  const handleCategoryShortcut = (category: Category) => {
    setSelectedCategory(category);
    setActiveTab('work');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090e17] text-[#f1f5f9] flex flex-col font-body selection:bg-[#3b5b82] selection:text-white">
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenShowreel={() => setIsShowreelOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onStartUpload={handleStartUpload}
        lang={lang}
        setLang={setLang}
        isAdminAuthed={isAdminAuthed}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* 1. Hero Section with Video Teaser & Tools */}
            <HeroSection
              profile={profile}
              onOpenShowreel={() => setIsShowreelOpen(true)}
              onExploreWorks={() => {
                setActiveTab('work');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenResume={() => setIsResumeOpen(true)}
              onEditProfile={handleOpenProfileEditor}
              lang={lang}
              isAdminAuthed={isAdminAuthed}
            />

            {/* 2. Selected Works (Top 6 Curated projects) */}
            <SelectedWorks
              projects={projects}
              onSelectProject={(proj) => setSelectedProject(proj)}
              onViewAllWorks={() => {
                setActiveTab('work');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              lang={lang}
            />

            {/* 3. Category Shortcuts (5 Core Disciplines) */}
            <CategoryShortcuts
              onSelectCategory={handleCategoryShortcut}
              lang={lang}
            />

            {/* 4. Quick About Intro Teaser */}
            <section className="py-20 border-b border-zinc-850 bg-gradient-to-b from-transparent to-zinc-950/80">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-8">
                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 block mb-2">
                      Designer Introduction
                    </span>
                    <h2 className="font-syne text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                      {lang === 'ko'
                        ? (profile.headlineKr || `${profile.roleTitleKr} ${profile.nameKr}`)
                        : (profile.headlineEn || profile.roleTitleEn || 'Bridging high-impact aesthetics with production discipline.')}
                    </h2>
                    <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl font-body whitespace-pre-line">
                      {lang === 'ko'
                        ? (profile.detailedBioKr || profile.oneLineBioKr)
                        : (profile.detailedBioEn || profile.oneLineBioEn || profile.detailedBioKr)}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          setActiveTab('about');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="rounded-full bg-white px-5 py-2 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition-colors shadow-md"
                      >
                        {lang === 'ko' ? '디자이너 소개 더보기' : 'Learn More About Me'}
                      </button>
                      {isAdminAuthed && (
                        <button
                          onClick={() => handleOpenProfileEditor('about_intro')}
                          className="rounded-full border border-emerald-800/60 bg-emerald-950/30 px-4 py-2 text-xs font-medium text-emerald-300 hover:text-white hover:border-emerald-500 transition-colors"
                        >
                          {lang === 'ko' ? '소개글 직접 수정' : 'Edit Intro'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
                    <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider block border-b border-zinc-800 pb-2">
                      Quick Facts
                    </span>
                    <div className="space-y-3 text-xs font-mono">
                      <div>
                        <span className="text-zinc-500 block">SPECIALTY</span>
                        <span className="text-zinc-200 font-semibold">{profile.specialty || 'Motion, Poster, Video & AI'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">EDUCATION</span>
                        <span className="text-zinc-200 font-semibold">{profile.education || 'B.F.A in Visual & Motion Design'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">LOCATION</span>
                        <span className="text-zinc-200 font-semibold">{profile.location || 'Seoul, Korea'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">TARGET ROLE</span>
                        <span className="text-zinc-200 font-semibold">{profile.targetRole || profile.roleTitleKr}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Selected Works / Archive View */}
        {activeTab === 'work' && (
          <WorkArchive
            projects={projects}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectProject={(proj) => setSelectedProject(proj)}
            onStartUpload={handleStartUpload}
            lang={lang}
          />
        )}

        {/* About View */}
        {activeTab === 'about' && (
          <AboutSection
            profile={profile}
            onOpenResume={() => setIsResumeOpen(true)}
            onEditProfile={handleOpenProfileEditor}
            lang={lang}
            isAdminAuthed={isAdminAuthed}
          />
        )}

        {/* Contact View */}
        {activeTab === 'contact' && (
          <ContactSection
            profile={profile}
            onOpenResume={() => setIsResumeOpen(true)}
            lang={lang}
          />
        )}

        {/* Admin View (Password: 1234) */}
        {activeTab === 'admin' && (
          <AdminPanel
            projects={projects}
            onSaveProjects={handleSaveProjects}
            onResetToDefaults={handleResetToDefaults}
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onResetProfileToDefaults={handleResetProfileToDefaults}
            isAdminAuthed={isAdminAuthed}
            setIsAdminAuthed={setIsAdminAuthed}
            onSelectProject={(proj) => setSelectedProject(proj)}
            autoOpenCreate={autoOpenUpload}
            onConsumeAutoOpenCreate={() => setAutoOpenUpload(false)}
            initialEditingProject={adminEditingProject}
            onConsumeEditingProject={() => setAdminEditingProject(null)}
            initialAdminTab={adminInitialTab}
            initialProfileSubTab={adminProfileSubTab}
            lang={lang}
          />
        )}
      </main>

      {/* Project Detail Modal (The 8-step Case Study Template) */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onNextProject={handleNextProject}
        onPrevProject={handlePrevProject}
        onDeleteProject={handleDeleteProject}
        onEditProject={handleEditProject}
        isAdminAuthed={isAdminAuthed}
        lang={lang}
      />

      {/* 30-Second Showreel Theatre Modal */}
      <ShowreelModal
        isOpen={isShowreelOpen}
        onClose={() => setIsShowreelOpen(false)}
        lang={lang}
      />

      {/* Printable / Viewable Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        profile={profile}
        lang={lang}
      />

      {/* Editorial Footer */}
      <Footer
        profile={profile}
        setActiveTab={setActiveTab}
        onOpenShowreel={() => setIsShowreelOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        isAdminAuthed={isAdminAuthed}
        lang={lang}
      />
    </div>
  );
}
