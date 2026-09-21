import React, { useState, useEffect } from 'react';
import {
  DesignerProfile,
  WhatIDoItem,
  SkillCategoryItem,
  ExperienceItem,
  AwardItem
} from '../types';
import { defaultDesignerProfile } from '../data/defaultProjects';
import {
  User,
  FileText,
  Save,
  RotateCcw,
  CheckCircle2,
  MapPin,
  Briefcase,
  GraduationCap,
  Layers,
  Code,
  Award,
  Plus,
  Trash2,
  Eye,
  ExternalLink,
  ChevronRight,
  Sliders
} from 'lucide-react';

export type ProfileSubTab = 'bio' | 'about_intro' | 'what_i_do' | 'skills' | 'experience' | 'awards';

interface ProfileEditSectionProps {
  profile: DesignerProfile;
  onSaveProfile: (profile: DesignerProfile) => void;
  onResetProfileToDefaults: () => void;
  initialSubTab?: ProfileSubTab;
  lang: 'ko' | 'en';
}

export const ProfileEditSection: React.FC<ProfileEditSectionProps> = ({
  profile,
  onSaveProfile,
  onResetProfileToDefaults,
  initialSubTab = 'about_intro',
  lang,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ProfileSubTab>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Helper to build tools text dictionary
  const buildToolsMap = (cats?: SkillCategoryItem[]) => {
    const map: Record<string, string> = {};
    (cats || []).forEach((cat, idx) => {
      const key = cat.id || `skill-cat-${idx}`;
      map[key] = (cat.tools || []).join(', ');
    });
    return map;
  };

  // Ensure initial array fields are safely filled from defaultDesignerProfile if empty
  const [formData, setFormData] = useState<DesignerProfile>(() => ({
    ...defaultDesignerProfile,
    ...profile,
    whatIDo: profile.whatIDo && profile.whatIDo.length > 0 ? profile.whatIDo : defaultDesignerProfile.whatIDo,
    skillCategories: profile.skillCategories && profile.skillCategories.length > 0 ? profile.skillCategories : defaultDesignerProfile.skillCategories,
    experiences: profile.experiences && profile.experiences.length > 0 ? profile.experiences : defaultDesignerProfile.experiences,
    awards: profile.awards && profile.awards.length > 0 ? profile.awards : defaultDesignerProfile.awards,
  }));

  // Maintain raw input string for each category so commas and spaces are preserved during typing
  const [toolsTextMap, setToolsTextMap] = useState<Record<string, string>>(() => {
    const initialCats = profile.skillCategories && profile.skillCategories.length > 0
      ? profile.skillCategories
      : defaultDesignerProfile.skillCategories;
    return buildToolsMap(initialCats);
  });

  const [isSaved, setIsSaved] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  useEffect(() => {
    const validCats = profile.skillCategories && profile.skillCategories.length > 0
      ? profile.skillCategories
      : defaultDesignerProfile.skillCategories;

    setFormData({
      ...defaultDesignerProfile,
      ...profile,
      whatIDo: profile.whatIDo && profile.whatIDo.length > 0 ? profile.whatIDo : defaultDesignerProfile.whatIDo,
      skillCategories: validCats,
      experiences: profile.experiences && profile.experiences.length > 0 ? profile.experiences : defaultDesignerProfile.experiences,
      awards: profile.awards && profile.awards.length > 0 ? profile.awards : defaultDesignerProfile.awards,
    });
    setToolsTextMap(buildToolsMap(validCats));
  }, [profile]);

  const handleChange = (field: keyof DesignerProfile, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Synchronize latest toolsTextMap into skillCategories array cleanly
    const finalCats = (formData.skillCategories || []).map((cat, idx) => {
      const key = cat.id || `skill-cat-${idx}`;
      const rawText = toolsTextMap[key];
      if (rawText !== undefined) {
        const tools = rawText
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        return { ...cat, tools };
      }
      return cat;
    });

    const finalProfile: DesignerProfile = {
      ...formData,
      skillCategories: finalCats,
    };

    onSaveProfile(finalProfile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  const handleConfirmReset = () => {
    onResetProfileToDefaults();
    setShowConfirmReset(false);
    setToolsTextMap(buildToolsMap(defaultDesignerProfile.skillCategories));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  // What I Do Item Handlers
  const handleWhatIDoChange = (index: number, field: keyof WhatIDoItem, value: string) => {
    const list = [...(formData.whatIDo || [])];
    list[index] = { ...list[index], [field]: value };
    handleChange('whatIDo', list);
  };

  const handleAddWhatIDo = () => {
    const newItem: WhatIDoItem = {
      id: `wid-${Date.now()}`,
      title: 'New Discipline Title',
      titleKr: '새로운 작업 역량 분야',
      desc: '역량 및 세부 작업 방식에 대한 설명을 입력하세요.',
    };
    handleChange('whatIDo', [...(formData.whatIDo || []), newItem]);
  };

  const handleDeleteWhatIDo = (index: number) => {
    const list = [...(formData.whatIDo || [])];
    list.splice(index, 1);
    handleChange('whatIDo', list);
  };

  // Skills Category Handlers
  const handleSkillCategoryToolsChange = (index: number, catKey: string, rawText: string) => {
    // 1. Keep the exact text user is typing so commas and spaces are not wiped out
    setToolsTextMap((prev) => ({
      ...prev,
      [catKey]: rawText,
    }));

    // 2. Parse tokens in real-time for tags and live preview
    const tools = rawText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const list = [...(formData.skillCategories || [])];
    list[index] = { ...list[index], tools };
    handleChange('skillCategories', list);
  };

  const handleSkillCategoryNameChange = (index: number, name: string) => {
    const list = [...(formData.skillCategories || [])];
    list[index] = { ...list[index], name };
    handleChange('skillCategories', list);
  };

  const handleAddSkillCategory = () => {
    const newId = `skill-${Date.now()}`;
    const newCat: SkillCategoryItem = {
      id: newId,
      name: 'New Pipeline Category',
      tools: ['Tool 1', 'Tool 2'],
    };
    setToolsTextMap((prev) => ({
      ...prev,
      [newId]: 'Tool 1, Tool 2',
    }));
    handleChange('skillCategories', [...(formData.skillCategories || []), newCat]);
  };

  const handleDeleteSkillCategory = (index: number) => {
    const list = [...(formData.skillCategories || [])];
    list.splice(index, 1);
    handleChange('skillCategories', list);
  };

  // Experience Handlers
  const handleExperienceChange = (index: number, field: keyof ExperienceItem, value: string) => {
    const list = [...(formData.experiences || [])];
    list[index] = { ...list[index], [field]: value };
    handleChange('experiences', list);
  };

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      period: '2024.01 — Present',
      role: 'Role / Position Title',
      place: 'Company or Agency Name',
      desc: '주요 수행 업무 및 프로젝트 성과에 대해 기재하세요.',
    };
    handleChange('experiences', [...(formData.experiences || []), newExp]);
  };

  const handleDeleteExperience = (index: number) => {
    const list = [...(formData.experiences || [])];
    list.splice(index, 1);
    handleChange('experiences', list);
  };

  // Awards Handlers
  const handleAwardChange = (index: number, field: keyof AwardItem, value: string) => {
    const list = [...(formData.awards || [])];
    list[index] = { ...list[index], [field]: value };
    handleChange('awards', list);
  };

  const handleAddAward = () => {
    const newAward: AwardItem = {
      id: `award-${Date.now()}`,
      year: new Date().getFullYear().toString(),
      title: 'Award or Exhibition Title',
      org: 'Awarding Organization or Festival',
    };
    handleChange('awards', [...(formData.awards || []), newAward]);
  };

  const handleDeleteAward = (index: number) => {
    const list = [...(formData.awards || [])];
    list.splice(index, 1);
    handleChange('awards', list);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c283c] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#7a9ec7] uppercase tracking-wider mb-1">
            <User className="h-3.5 w-3.5" />
            <span>Profile & About Content Management</span>
          </div>
          <h2 className="font-syne text-xl sm:text-2xl font-bold text-white">
            디자이너 프로필 및 About 내용 통합 수정
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            홈 화면, About 소개 페이지(헤드라인, 본문, 작업 역량, 툴 파이프라인, 경력, 수상) 및 공식 이력서에 노출되는 모든 콘텐츠를 직접 편집할 수 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[#1e2d42] bg-[#0c1422] px-3.5 py-2 text-xs text-slate-400 hover:text-white hover:border-[#4d74a3] transition-colors"
            title="초기 소개글로 복원"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>기본값 복원</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-xl bg-[#3b5b82] px-5 py-2 text-xs font-bold text-white hover:bg-[#4a72a3] transition-all shadow-md shadow-[#1e3352]/30"
          >
            <Save className="h-4 w-4" />
            <span>변경사항 저장하기</span>
          </button>
        </div>
      </div>

      {/* Success Notification Toast */}
      {isSaved && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-emerald-300 text-xs font-mono backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300 shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>소개글 및 About 내용이 성공적으로 저장되었습니다! 포트폴리오 사이트 전반에 즉시 반영되었습니다.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsSaved(false)}
            className="text-emerald-400/80 hover:text-emerald-200"
          >
            닫기
          </button>
        </div>
      )}

      {/* Sub-Navigation Tabs for About / Profile Editing */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1c283c] text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveSubTab('about_intro')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'about_intro'
              ? 'bg-[#3b5b82] text-white font-bold shadow-md shadow-[#1e3352]/30'
              : 'border border-[#1e2d42] bg-[#0c1422] text-slate-400 hover:text-white hover:border-[#3b5b82]'
          }`}
        >
          <FileText className="h-3.5 w-3.5 text-[#8bb2e2]" />
          <span>About 소개글 & 헤드라인</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('what_i_do')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'what_i_do'
              ? 'bg-[#3b5b82] text-white font-bold shadow-md shadow-[#1e3352]/30'
              : 'border border-[#1e2d42] bg-[#0c1422] text-slate-400 hover:text-white hover:border-[#3b5b82]'
          }`}
        >
          <Layers className="h-3.5 w-3.5 text-[#8bb2e2]" />
          <span>주요 작업 역량 ({formData.whatIDo?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('skills')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'skills'
              ? 'bg-[#3b5b82] text-white font-bold shadow-md shadow-[#1e3352]/30'
              : 'border border-[#1e2d42] bg-[#0c1422] text-slate-400 hover:text-white hover:border-[#3b5b82]'
          }`}
        >
          <Code className="h-3.5 w-3.5 text-[#8bb2e2]" />
          <span>기술 & 툴 파이프라인 ({formData.skillCategories?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('experience')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'experience'
              ? 'bg-[#3b5b82] text-white font-bold shadow-md shadow-[#1e3352]/30'
              : 'border border-[#1e2d42] bg-[#0c1422] text-slate-400 hover:text-white hover:border-[#3b5b82]'
          }`}
        >
          <Briefcase className="h-3.5 w-3.5 text-[#8bb2e2]" />
          <span>경력 및 프로젝트 ({formData.experiences?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('awards')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'awards'
              ? 'bg-[#3b5b82] text-white font-bold shadow-md shadow-[#1e3352]/30'
              : 'border border-[#1e2d42] bg-[#0c1422] text-slate-400 hover:text-white hover:border-[#3b5b82]'
          }`}
        >
          <Award className="h-3.5 w-3.5 text-[#8bb2e2]" />
          <span>수상 및 전시 ({formData.awards?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('bio')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'bio'
              ? 'bg-[#3b5b82] text-white font-bold shadow-md shadow-[#1e3352]/30'
              : 'border border-[#1e2d42] bg-[#0c1422] text-slate-400 hover:text-white hover:border-[#3b5b82]'
          }`}
        >
          <User className="h-3.5 w-3.5 text-[#8bb2e2]" />
          <span>기본 신원 & 홈 소개글</span>
        </button>
      </div>

      {/* Main Grid: Form Left, Sticky Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Area (7 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* TAB 1: About 소개글 & 헤드라인 */}
          {activeSubTab === 'about_intro' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-[#1c283c] pb-3 text-xs font-mono text-[#8bb2e2] uppercase">
                  <FileText className="h-4 w-4" />
                  <span>About 페이지 메인 헤드라인 타이틀</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    About 대형 타이틀 (국문)
                  </label>
                  <input
                    type="text"
                    value={formData.aboutHeadingKr || ''}
                    onChange={(e) => handleChange('aboutHeadingKr', e.target.value)}
                    placeholder="예: 시각적 임팩트와 움직임을 다루는 크리에이티브 디자이너"
                    className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    About 페이지 상단 좌측에 큰 폰트로 가장 먼저 강조되는 문구입니다.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    About 대형 타이틀 (영문)
                  </label>
                  <input
                    type="text"
                    value={formData.aboutHeadingEn || ''}
                    onChange={(e) => handleChange('aboutHeadingEn', e.target.value)}
                    placeholder="예: Creative Designer Specialized in Motion & Visual Impact"
                    className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-[#1c283c] pb-3 text-xs font-mono text-[#8bb2e2] uppercase">
                  <FileText className="h-4 w-4" />
                  <span>About 페이지 상세 자기소개 본문</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    About 상세 소개 본문 (한글) <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={formData.detailedBioKr}
                    onChange={(e) => handleChange('detailedBioKr', e.target.value)}
                    placeholder="자신의 디자인 철학, 주력 분야, 경험 및 지향하는 바를 자유롭게 줄바꿈하여 작성하세요."
                    className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-3 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none leading-relaxed font-sans"
                    required
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    줄바꿈(Enter)이 그대로 유지되어 자연스러운 문단 구조로 렌더링됩니다.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    About 상세 소개 본문 (영문, 선택)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.detailedBioEn || ''}
                    onChange={(e) => handleChange('detailedBioEn', e.target.value)}
                    placeholder="English bio for international clients or global agencies."
                    className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-3 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none leading-relaxed font-sans"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-[#1c283c] pb-3 text-xs font-mono text-[#8bb2e2] uppercase">
                  <Sliders className="h-4 w-4" />
                  <span>About 퀵 팩트 (Quick Facts)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      활동 지역 (Location)
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="Seoul, Republic of Korea"
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      활동 상태 (Work Status)
                    </label>
                    <input
                      type="text"
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      placeholder="Available for Work"
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      희망 직무 (Target Role)
                    </label>
                    <input
                      type="text"
                      value={formData.targetRole || ''}
                      onChange={(e) => handleChange('targetRole', e.target.value)}
                      placeholder="Motion & Visual Designer"
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 주요 작업 역량 (What I Do) */}
          {activeSubTab === 'what_i_do' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-syne">
                    주요 작업 역량 목록 (Scope of Work / What I Do)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    포스터, 2D 모션, 3D 키네틱 아트, 영상편집, 생성형 AI 등 주력 분야별 설명 카드를 수정할 수 있습니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddWhatIDo}
                  className="flex items-center gap-1.5 rounded-xl bg-[#3b5b82] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#4a72a3] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>새 역량 추가</span>
                </button>
              </div>

              <div className="space-y-4">
                {(formData.whatIDo || []).map((item, index) => (
                  <div
                    key={item.id || index}
                    className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-5 space-y-4 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-[#1c283c] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#7a9ec7] bg-[#111d2e] px-2 py-0.5 rounded">
                          0{index + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-200">
                          {item.titleKr || item.title || `역량 항목 ${index + 1}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteWhatIDo(index)}
                        className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="이 역량 항목 삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          역량 타이틀 (국문)
                        </label>
                        <input
                          type="text"
                          value={item.titleKr}
                          onChange={(e) => handleWhatIDoChange(index, 'titleKr', e.target.value)}
                          placeholder="예: 2D 모션그래픽"
                          className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          역량 타이틀 (영문)
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleWhatIDoChange(index, 'title', e.target.value)}
                          placeholder="예: 2D Motion Graphics"
                          className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        세부 작업 역량 및 기법 설명
                      </label>
                      <textarea
                        rows={2}
                        value={item.desc}
                        onChange={(e) => handleWhatIDoChange(index, 'desc', e.target.value)}
                        placeholder="이 분야에서 본인이 발휘하는 구체적인 작업 범위와 노하우를 설명하세요."
                        className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-3 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none leading-relaxed font-sans"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 기술 & 툴 파이프라인 (Skills) */}
          {activeSubTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-syne">
                    기술 및 툴 파이프라인 (Technical Skills & Pipeline)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    도구 카테고리(Design & Motion, 3D & Spatial 등)와 각각의 툴 목록을 관리할 수 있습니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSkillCategory}
                  className="flex items-center gap-1.5 rounded-xl bg-[#3b5b82] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#4a72a3] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>새 카테고리 추가</span>
                </button>
              </div>

              <div className="space-y-4">
                {(formData.skillCategories || []).map((cat, index) => {
                  const catKey = cat.id || `skill-cat-${index}`;
                  const currentToolsText = toolsTextMap[catKey] ?? (cat.tools || []).join(', ');

                  return (
                    <div
                      key={catKey}
                      className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-[#1c283c] pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-[#8bb2e2] font-semibold">
                            Category {index + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-200">{cat.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteSkillCategory(index)}
                          className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title="이 카테고리 삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          카테고리 명칭
                        </label>
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => handleSkillCategoryNameChange(index, e.target.value)}
                          placeholder="예: Design & Motion"
                          className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-medium text-slate-400">
                            보유 기술 및 소프트웨어 툴 목록 (쉼표 , 로 구분)
                          </label>
                          <span className="text-[10px] font-mono text-[#8bb2e2]">
                            {cat.tools ? cat.tools.length : 0}개 등록됨
                          </span>
                        </div>
                        <input
                          type="text"
                          value={currentToolsText}
                          onChange={(e) =>
                            handleSkillCategoryToolsChange(index, catKey, e.target.value)
                          }
                          placeholder="After Effects, Premiere Pro, Photoshop, Illustrator, InDesign"
                          className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                        />

                        {/* Live parsed badges */}
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {cat.tools && cat.tools.length > 0 ? (
                            cat.tools.map((tool, tIdx) => (
                              <span
                                key={`${tool}-${tIdx}`}
                                className="inline-flex items-center gap-1 rounded-md bg-[#132034] px-2 py-0.5 text-[10px] font-mono text-[#8bb2e2] border border-[#1e3352]"
                              >
                                <span className="text-emerald-400 font-bold">✓</span>
                                <span>{tool}</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-amber-400/80 font-mono">
                              * 도구 이름을 쉼표(,)로 구분하여 입력하세요. (예: After Effects, Premiere Pro)
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-500 mt-1.5 block">
                          쉼표(,)를 자유롭게 입력하여 여러 개의 툴을 구분할 수 있으며, About 페이지와 공식 이력서에 위 태그 목록처럼 정돈되어 자동 반영됩니다.
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: 경력 및 프로젝트 (Experience) */}
          {activeSubTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-syne">
                    경력 및 실무 이력 (Career Journey / Experience)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    소속 에이전시, 스튜디오, 인턴십, 프리랜서 프로젝트 이력과 담당 역할을 관리할 수 있습니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="flex items-center gap-1.5 rounded-xl bg-[#3b5b82] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#4a72a3] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>새 경력 추가</span>
                </button>
              </div>

              <div className="space-y-4">
                {(formData.experiences || []).map((exp, index) => (
                  <div
                    key={exp.id || index}
                    className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-[#1c283c] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#7a9ec7] font-semibold">
                          {exp.period || '기간 미정'}
                        </span>
                        <span className="text-xs font-bold text-slate-200">
                          {exp.role || `경력 ${index + 1}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(index)}
                        className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="이 경력 삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          직무 / 포지션 (Role)
                        </label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                          placeholder="예: Lead Visual & Motion Designer"
                          className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          활동 기간 (Period)
                        </label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => handleExperienceChange(index, 'period', e.target.value)}
                          placeholder="예: 2024.03 — Present"
                          className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        회사 / 기관 / 프로젝트명 (Place & Organization)
                      </label>
                      <input
                        type="text"
                        value={exp.place}
                        onChange={(e) => handleExperienceChange(index, 'place', e.target.value)}
                        placeholder="예: Studio NEXUS (Brand & Media Agency)"
                        className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        주요 담당 업무 및 성과 설명
                      </label>
                      <textarea
                        rows={2}
                        value={exp.desc}
                        onChange={(e) => handleExperienceChange(index, 'desc', e.target.value)}
                        placeholder="브랜드 캠페인 모션 티저, 3D 키네틱 아트 및 디지털 포스터 시리즈 총괄 디렉팅."
                        className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-3 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none leading-relaxed font-sans"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: 수상 및 전시 (Awards) */}
          {activeSubTab === 'awards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-syne">
                    수상 및 전시 내역 (Honors & Awards)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    디자인 공모전 수상, 비엔날레, 페스티벌 전시 및 공식 선정 이력을 수정할 수 있습니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddAward}
                  className="flex items-center gap-1.5 rounded-xl bg-[#3b5b82] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#4a72a3] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>새 수상 내역 추가</span>
                </button>
              </div>

              <div className="space-y-4">
                {(formData.awards || []).map((award, index) => (
                  <div
                    key={award.id || index}
                    className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-[#1c283c] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#8bb2e2] bg-[#111d2e] px-2 py-0.5 rounded">
                          {award.year}
                        </span>
                        <span className="text-xs font-bold text-slate-200 truncate max-w-xs">
                          {award.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAward(index)}
                        className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="이 수상 내역 삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          수상 연도
                        </label>
                        <input
                          type="text"
                          value={award.year}
                          onChange={(e) => handleAwardChange(index, 'year', e.target.value)}
                          placeholder="2025"
                          className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          수여 기관 / 주최 (Organization)
                        </label>
                        <input
                          type="text"
                          value={award.org}
                          onChange={(e) => handleAwardChange(index, 'org', e.target.value)}
                          placeholder="한국디지털미디어협회"
                          className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        수상 및 전시 타이틀 (Title)
                      </label>
                      <input
                        type="text"
                        value={award.title}
                        onChange={(e) => handleAwardChange(index, 'title', e.target.value)}
                        placeholder="Korea Digital Media Award - Motion Graphics Excellence"
                        className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: 기본 신원 & 홈 소개글 */}
          {activeSubTab === 'bio' && (
            <div className="space-y-6">
              {/* Identity & Role */}
              <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-[#1c283c] pb-3 text-xs font-mono text-[#8bb2e2] uppercase">
                  <User className="h-4 w-4" />
                  <span>기본 신원 및 직함 (Identity & Roles)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      국문 이름 <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nameKr}
                      onChange={(e) => handleChange('nameKr', e.target.value)}
                      placeholder="예: 전선정"
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      영문 이름 <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => handleChange('nameEn', e.target.value)}
                      placeholder="예: SEONJEONG JEON"
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      국문 직함 / 타이틀
                    </label>
                    <input
                      type="text"
                      value={formData.roleTitleKr}
                      onChange={(e) => handleChange('roleTitleKr', e.target.value)}
                      placeholder="예: 비주얼 & 모션그래픽 디자이너"
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      영문 직함 / 타이틀
                    </label>
                    <input
                      type="text"
                      value={formData.roleTitleEn}
                      onChange={(e) => handleChange('roleTitleEn', e.target.value)}
                      placeholder="예: Visual & Motion Designer / Hybrid Creative"
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    상단 구직/활동 상태 배지 문구
                  </label>
                  <input
                    type="text"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    placeholder="예: 채용 지원 가능 • 인하우스 / 에이전시 크리에이티브"
                    className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                  />
                </div>
              </div>

              {/* Home Intro Copywriting */}
              <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-[#1c283c] pb-3 text-xs font-mono text-[#8bb2e2] uppercase">
                  <FileText className="h-4 w-4" />
                  <span>홈 메인 카피라이팅 (Home Intro)</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    홈 메인 한 줄 소개 (국문)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.oneLineBioKr}
                    onChange={(e) => handleChange('oneLineBioKr', e.target.value)}
                    placeholder="포스터, 모션그래픽, 영상편집, 생성형 AI 콘텐츠를 기반으로 시각적 스토리텔링을 만드는 디자이너 전선정입니다."
                    className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-3 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    홈 메인 한 줄 소개 (영문)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.oneLineBioEn}
                    onChange={(e) => handleChange('oneLineBioEn', e.target.value)}
                    placeholder="Visual Designer specializing in Poster, Motion Graphics, Video Editing, and AI-driven Content."
                    className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-3 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    홈 히어로 서브 헤드라인 / 카피
                  </label>
                  <textarea
                    rows={2}
                    value={formData.headlineKr || ''}
                    onChange={(e) => handleChange('headlineKr', e.target.value)}
                    placeholder="단순히 툴을 다루는 수준을 넘어, 기획 의도와 시각적 리듬을 결합하여 즉각적인 시각적 임팩트와 스토리텔링을 전달합니다."
                    className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-3 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Contact & Socials */}
              <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-[#1c283c] pb-3 text-xs font-mono text-[#8bb2e2] uppercase">
                  <MapPin className="h-4 w-4" />
                  <span>연락처 및 외부 링크 (Contact & Channels)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      이메일 주소 <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="sunjung317@naver.com"
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      전화번호
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+82 10-8924-5100"
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#1c283c]">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      전문 분야 (Specialty)
                    </label>
                    <input
                      type="text"
                      value={formData.specialty || ''}
                      onChange={(e) => handleChange('specialty', e.target.value)}
                      placeholder="Motion, Poster, Video & AI"
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      최종 학력 / 전공 (Education)
                    </label>
                    <input
                      type="text"
                      value={formData.education || ''}
                      onChange={(e) => handleChange('education', e.target.value)}
                      placeholder="B.F.A in Visual & Motion Design"
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      희망 직무 (Target Role)
                    </label>
                    <input
                      type="text"
                      value={formData.targetRole || ''}
                      onChange={(e) => handleChange('targetRole', e.target.value)}
                      placeholder="Motion & Visual Designer"
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#1c283c]">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Behance URL
                    </label>
                    <input
                      type="url"
                      value={formData.behance || ''}
                      onChange={(e) => handleChange('behance', e.target.value)}
                      placeholder="https://behance.net/..."
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={formData.youtube || ''}
                      onChange={(e) => handleChange('youtube', e.target.value)}
                      placeholder="https://youtube.com/..."
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={formData.instagram || ''}
                      onChange={(e) => handleChange('instagram', e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#4d74a3] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Action */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1c283c]">
            <span className="text-xs text-slate-500 font-mono">
              * 변경사항은 저장 즉시 사이트 전반에 실시간 반영됩니다.
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#3b5b82] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#4a72a3] transition-all shadow-lg shadow-[#1e3352]/30"
            >
              <Save className="h-4 w-4" />
              <span>변경사항 저장하기</span>
            </button>
          </div>
        </form>

        {/* Right Sticky Preview Area (5 Cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#7a9ec7] uppercase">
              <Eye className="h-3.5 w-3.5" />
              <span>
                {activeSubTab === 'about_intro' && 'About 헤드라인 & 본문 미리보기'}
                {activeSubTab === 'what_i_do' && 'About 작업 역량 카드 미리보기'}
                {activeSubTab === 'skills' && 'About 기술 & 파이프라인 미리보기'}
                {activeSubTab === 'experience' && 'About 경력 타임라인 미리보기'}
                {activeSubTab === 'awards' && 'About 수상 내역 미리보기'}
                {activeSubTab === 'bio' && '홈 히어로 & 프로필 미리보기'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              LIVE PREVIEW
            </span>
          </div>

          {/* Dynamic Preview Card according to sub-tab */}
          {activeSubTab === 'about_intro' && (
            <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 space-y-6 shadow-2xl">
              <div>
                <span className="font-mono text-[10px] text-[#7a9ec7] tracking-widest uppercase block mb-1">
                  About Heading Preview
                </span>
                <h3 className="font-syne text-xl font-extrabold text-white leading-snug">
                  {formData.aboutHeadingKr || '시각적 임팩트와 움직임을 다루는 크리에이티브 디자이너'}
                </h3>
              </div>

              <div className="rounded-xl border border-[#1c283c] bg-[#080d16] p-4">
                <span className="font-mono text-[10px] text-slate-500 block mb-2 uppercase">
                  Detailed Bio Content
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-body whitespace-pre-line">
                  {formData.detailedBioKr || '상세 소개글이 여기에 실시간으로 표시됩니다.'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-3 border-t border-[#1c283c]">
                <div>
                  <span className="text-slate-500 block text-[10px]">LOCATION</span>
                  <span className="text-slate-200 truncate block">{formData.location}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">STATUS</span>
                  <span className="text-[#64b5f6] truncate block">{formData.status}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">TARGET ROLE</span>
                  <span className="text-slate-200 truncate block">{formData.targetRole}</span>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'what_i_do' && (
            <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 space-y-4 shadow-2xl">
              <span className="font-mono text-[10px] text-[#7a9ec7] tracking-widest uppercase block">
                What I Do Cards ({formData.whatIDo?.length || 0})
              </span>
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {(formData.whatIDo || []).map((item, i) => (
                  <div key={i} className="rounded-xl border border-[#1e2d42] bg-[#080d16] p-3.5 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#7a9ec7]">0{i + 1}</span>
                      <h5 className="font-syne text-xs font-bold text-white">
                        {item.titleKr || item.title}
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'skills' && (
            <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 space-y-4 shadow-2xl">
              <span className="font-mono text-[10px] text-[#7a9ec7] tracking-widest uppercase block">
                Skill Matrix Preview ({formData.skillCategories?.length || 0})
              </span>
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {(formData.skillCategories || []).map((cat, i) => (
                  <div key={i} className="rounded-xl border border-[#1e2d42] bg-[#080d16] p-3.5 space-y-2">
                    <h5 className="font-syne text-xs font-bold text-[#8bb2e2] uppercase tracking-wider">
                      {cat.name}
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.tools.map((t, tidx) => (
                        <span
                          key={tidx}
                          className="font-mono text-[10px] text-slate-300 bg-[#111d2e] border border-[#223550] px-2 py-0.5 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'experience' && (
            <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 space-y-4 shadow-2xl">
              <span className="font-mono text-[10px] text-[#7a9ec7] tracking-widest uppercase block">
                Career Journey Preview ({formData.experiences?.length || 0})
              </span>
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {(formData.experiences || []).map((exp, i) => (
                  <div key={i} className="rounded-xl border border-[#1e2d42] bg-[#080d16] p-3.5 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h5 className="font-syne text-xs font-bold text-white">{exp.role}</h5>
                      <span className="font-mono text-[10px] text-[#7a9ec7]">{exp.period}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium block">{exp.place}</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'awards' && (
            <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 space-y-4 shadow-2xl">
              <span className="font-mono text-[10px] text-[#7a9ec7] tracking-widest uppercase block">
                Awards & Honors Preview ({formData.awards?.length || 0})
              </span>
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {(formData.awards || []).map((award, i) => (
                  <div key={i} className="rounded-xl border border-[#1e2d42] bg-[#080d16] p-3">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-[#8bb2e2] font-bold">{award.year}</span>
                      <span className="text-slate-500">{award.org}</span>
                    </div>
                    <h5 className="font-syne text-xs font-bold text-slate-200 mt-0.5">
                      {award.title}
                    </h5>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'bio' && (
            <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 space-y-4 shadow-2xl">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] font-mono text-emerald-300 truncate">
                    {formData.status || 'AVAILABLE FOR WORK'}
                  </span>
                </div>
                <h4 className="font-syne text-2xl font-black text-white tracking-tight">
                  {formData.nameEn}{' '}
                  <span className="text-lg font-normal text-slate-400">({formData.nameKr})</span>
                </h4>
                <p className="font-mono text-xs text-[#7a9ec7] mt-0.5 font-medium">
                  {formData.roleTitleEn || formData.roleTitleKr}
                </p>
              </div>

              <div className="rounded-xl border border-[#1c283c] bg-[#080d16] p-4">
                <span className="font-mono text-[10px] text-slate-500 block mb-1">
                  HOME ONE-LINE BIO
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-body">
                  {formData.oneLineBioKr || '한 줄 소개 문구가 여기에 노출됩니다.'}
                </p>
              </div>

              <div className="text-[11px] font-mono text-slate-400 space-y-1.5 pt-2 border-t border-[#1c283c]">
                <p className="truncate">Email: {formData.email}</p>
                <p className="truncate">Phone: {formData.phone}</p>
                <p className="truncate">Location: {formData.location}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <RotateCcw className="h-6 w-6" />
              <h3 className="font-syne text-lg font-bold text-white">
                소개글 및 About 내용 초기화
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              작성하신 프로필, About 헤드라인, 상세 소개글, 작업 역량, 툴 파이프라인, 경력 및 수상 내역이 모두 초기 기본 샘플 데이터로 복원됩니다. 계속하시겠습니까?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="rounded-xl border border-[#1e2d42] bg-[#090e17] px-4 py-2 text-xs text-slate-300 hover:text-white"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-500"
              >
                초기값으로 복원
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
