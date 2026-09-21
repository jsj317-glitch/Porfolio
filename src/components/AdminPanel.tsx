import React, { useState, useEffect } from 'react';
import { Project, Category, DesignerProfile } from '../types';
import { FileUploadZone } from './FileUploadZone';
import { ProfileEditSection, ProfileSubTab } from './ProfileEditSection';
import { resolveMediaUrl } from '../utils/mediaStorage';
import {
  Lock,
  Unlock,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  RotateCcw,
  Eye,
  Sliders,
  AlertTriangle,
  FolderPlus,
  Save,
  Film,
  User
} from 'lucide-react';

interface AdminPanelProps {
  projects: Project[];
  onSaveProjects: (projects: Project[]) => void;
  onResetToDefaults: () => void;
  profile: DesignerProfile;
  onSaveProfile: (profile: DesignerProfile) => void;
  onResetProfileToDefaults: () => void;
  isAdminAuthed: boolean;
  setIsAdminAuthed: (authed: boolean) => void;
  onSelectProject: (project: Project) => void;
  autoOpenCreate?: boolean;
  onConsumeAutoOpenCreate?: () => void;
  initialEditingProject?: Project | null;
  onConsumeEditingProject?: () => void;
  initialAdminTab?: 'projects' | 'profile';
  initialProfileSubTab?: ProfileSubTab;
  lang: 'ko' | 'en';
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  projects,
  onSaveProjects,
  onResetToDefaults,
  profile,
  onSaveProfile,
  onResetProfileToDefaults,
  isAdminAuthed,
  setIsAdminAuthed,
  onSelectProject,
  autoOpenCreate,
  onConsumeAutoOpenCreate,
  initialEditingProject,
  onConsumeEditingProject,
  initialAdminTab = 'projects',
  initialProfileSubTab = 'about_intro',
  lang,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'projects' | 'profile'>(initialAdminTab);

  useEffect(() => {
    if (initialAdminTab) {
      setActiveAdminTab(initialAdminTab);
    }
  }, [initialAdminTab]);

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Edit / Add Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Form State
  const [formValues, setFormValues] = useState<Partial<Project>>({
    title: '',
    titleKr: '',
    category: 'Poster',
    year: '2025',
    duration: '',
    clientOrPurpose: '',
    role: '',
    tools: [],
    thumbnailUrl: '',
    heroMediaUrl: '',
    heroMediaType: 'image',
    overview: '',
    concept: '',
    reflection: '',
    isFeatured: true,
  });
  const [toolsString, setToolsString] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '1234') {
      setIsAdminAuthed(true);
      setAuthError(false);
      setPasswordInput('');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAdminAuthed(false);
  };

  // Open Edit Form
  const startEdit = (proj: Project) => {
    setEditingProject(proj);
    setIsNewProject(false);
    setFormValues({
      ...proj,
      process: proj.process ? proj.process.map((p) => ({ ...p })) : [],
      finalOutputs: proj.finalOutputs ? proj.finalOutputs.map((f) => ({ ...f })) : [],
    });
    setToolsString(proj.tools.join(', '));
  };

  // Open Create Form
  const startCreate = () => {
    const newId = `proj-${Date.now()}`;
    const newProj: Partial<Project> = {
      id: newId,
      title: 'New Creative Project',
      titleKr: '새로운 디자인 프로젝트',
      category: 'Poster',
      year: '2025',
      duration: 'A1 Series',
      clientOrPurpose: 'Brand / Exhibition Campaign',
      role: 'Graphic Design, Poster Art',
      tools: ['Photoshop', 'Illustrator'],
      thumbnailUrl: '',
      heroMediaUrl: '',
      heroMediaType: 'image',
      overview: '프로젝트에 대한 주요 설명입니다.',
      concept: '기획 의도 및 비주얼 컨셉에 대한 서술입니다.',
      reflection: '프로젝트를 통해 얻은 인사이트 및 배운 점입니다.',
      process: [],
      finalOutputs: [],
      isFeatured: true,
      order: projects.length + 1,
    };
    setEditingProject(newProj as Project);
    setIsNewProject(true);
    setFormValues(newProj);
    setToolsString('Photoshop, Illustrator');
  };

  useEffect(() => {
    if (isAdminAuthed && autoOpenCreate) {
      startCreate();
      if (onConsumeAutoOpenCreate) {
        onConsumeAutoOpenCreate();
      }
    }
  }, [isAdminAuthed, autoOpenCreate]);

  useEffect(() => {
    if (isAdminAuthed && initialEditingProject) {
      startEdit(initialEditingProject);
      if (onConsumeEditingProject) {
        onConsumeEditingProject();
      }
    }
  }, [isAdminAuthed, initialEditingProject]);

  // Save Project
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.title) return;

    const parsedTools = toolsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedProject: Project = {
      id: formValues.id || `proj-${Date.now()}`,
      title: formValues.title || 'Untitled',
      titleKr: formValues.titleKr || formValues.title || '제목 없음',
      category: formValues.category || 'Poster',
      year: formValues.year || '2025',
      duration: formValues.duration || '',
      clientOrPurpose: formValues.clientOrPurpose || 'Portfolio Showcase',
      role: formValues.role || 'Design & Directing',
      tools: parsedTools.length > 0 ? parsedTools : ['Design Tools'],
      thumbnailUrl: formValues.thumbnailUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
      heroMediaUrl: formValues.heroMediaUrl || formValues.thumbnailUrl || '',
      heroMediaType: formValues.heroMediaType || 'image',
      overview: formValues.overview || '',
      concept: formValues.concept || '',
      reflection: formValues.reflection || '',
      process: formValues.process || [],
      finalOutputs: formValues.finalOutputs || [],
      isFeatured: formValues.isFeatured ?? true,
      order: formValues.order || projects.length + 1,
    };

    let newProjectsList: Project[];
    if (isNewProject) {
      newProjectsList = [updatedProject, ...projects];
    } else {
      newProjectsList = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p));
    }

    onSaveProjects(newProjectsList);
    setEditingProject(null);
  };

  // Delete Project with Custom Modal
  const requestDelete = (project: Project) => {
    setProjectToDelete(project);
  };

  const confirmDelete = () => {
    if (!projectToDelete) return;
    const filtered = projects.filter((p) => p.id !== projectToDelete.id);
    onSaveProjects(filtered);
    if (editingProject?.id === projectToDelete.id) {
      setEditingProject(null);
    }
    setProjectToDelete(null);
  };

  // Toggle Featured
  const handleToggleFeatured = (id: string) => {
    const updated = projects.map((p) =>
      p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
    );
    onSaveProjects(updated);
  };

  // If NOT authenticated, show Password Login Screen
  if (!isAdminAuthed) {
    return (
      <div className="py-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-8 shadow-2xl text-center space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#131e2e] border border-[#223550] text-slate-300">
            <Lock className="h-6 w-6 text-[#7a9ec7]" />
          </div>

          <div>
            <h2 className="font-syne text-2xl font-bold text-white">
              관리자 모드 (Admin Portal)
            </h2>
            <p className="mt-1 text-xs text-slate-400 font-body">
              포트폴리오 프로젝트 등록, 수정, 삭제를 위해 관리자 비밀번호를 입력하세요.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setAuthError(false);
                }}
                placeholder="관리자 비밀번호 입력"
                autoFocus
                className={`w-full rounded-xl border px-4 py-3 text-center text-sm font-mono tracking-widest text-white placeholder-slate-600 focus:outline-none ${
                  authError
                    ? 'border-rose-500 bg-rose-950/20'
                    : 'border-[#1e2d42] bg-[#090e17] focus:border-[#4d74a3]'
                }`}
              />
              {authError && (
                <p className="mt-2 text-xs text-rose-400 font-mono">
                  비밀번호가 올바르지 않습니다. 다시 시도해주세요.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#3b5b82] py-3 text-xs font-bold text-white hover:bg-[#4a72a3] transition-colors shadow-lg shadow-[#1e3352]/30"
            >
              관리자 로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If Authenticated, show Admin Dashboard & Project Editor
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1c283c] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#64b5f6] uppercase tracking-widest">
              <Unlock className="h-3.5 w-3.5" />
              <span>Admin Authentication Active</span>
            </div>
            <h1 className="mt-1 font-syne text-2xl sm:text-4xl font-extrabold text-white">
              포트폴리오 관리자 대시보드
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              {activeAdminTab === 'projects'
                ? '프로젝트 추가, 내용 수정, 썸네일/영상 교체, 홈 Selected Works 노출 설정을 즉시 변경할 수 있습니다.'
                : '디자이너 이름, 직함, 홈/About 소개글, 연락처 및 퀵 팩트 텍스트를 자유롭게 편집할 수 있습니다.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {activeAdminTab === 'projects' && (
              <>
                <button
                  onClick={startCreate}
                  className="flex items-center gap-2 rounded-xl bg-[#3b5b82] px-4 py-2 text-xs font-bold text-white hover:bg-[#4a72a3] transition-colors shadow-md shadow-[#1e3352]/30"
                >
                  <Plus className="h-4 w-4" />
                  <span>새 프로젝트 추가</span>
                </button>

                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#1e2d42] bg-[#0c1422] px-3 py-2 text-xs text-slate-400 hover:text-white hover:border-[#4d74a3] transition-colors"
                  title="초기 샘플 데이터로 복구"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>기본값 복원</span>
                </button>
              </>
            )}

            <button
              onClick={handleLogout}
              className="rounded-xl border border-[#1e2d42] bg-[#0c1422] px-3 py-2 text-xs text-slate-400 hover:text-rose-400 hover:border-rose-900 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#1c283c] pb-4">
          <button
            type="button"
            onClick={() => setActiveAdminTab('projects')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeAdminTab === 'projects'
                ? 'bg-[#3b5b82] text-white shadow-md shadow-[#1e3352]/30'
                : 'border border-[#1e2d42] bg-[#0c1422] text-slate-400 hover:text-white hover:border-[#3b5b82]'
            }`}
          >
            <Film className="h-4 w-4" />
            <span>프로젝트 관리 ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('profile')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeAdminTab === 'profile'
                ? 'bg-[#3b5b82] text-white shadow-md shadow-[#1e3352]/30'
                : 'border border-[#1e2d42] bg-[#0c1422] text-slate-400 hover:text-white hover:border-[#3b5b82]'
            }`}
          >
            <User className="h-4 w-4" />
            <span>소개글 & 프로필 수정</span>
            <span className="h-2 w-2 rounded-full bg-[#64b5f6] animate-pulse"></span>
          </button>
        </div>

        {activeAdminTab === 'profile' ? (
          <ProfileEditSection
            profile={profile}
            onSaveProfile={onSaveProfile}
            onResetProfileToDefaults={onResetProfileToDefaults}
            initialSubTab={initialProfileSubTab}
            lang={lang}
          />
        ) : (
          <>
            {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#1e2d42] bg-[#0c1422] p-4">
            <span className="text-[11px] font-mono text-slate-500 uppercase">전체 프로젝트</span>
            <p className="mt-1 font-syne text-2xl font-bold text-white">{projects.length}개</p>
          </div>
          <div className="rounded-xl border border-[#1e2d42] bg-[#0c1422] p-4">
            <span className="text-[11px] font-mono text-slate-500 uppercase">홈 노출 (Featured)</span>
            <p className="mt-1 font-syne text-2xl font-bold text-[#8bb2e2]">
              {projects.filter((p) => p.isFeatured).length}개
            </p>
          </div>
          <div className="rounded-xl border border-[#1e2d42] bg-[#0c1422] p-4">
            <span className="text-[11px] font-mono text-slate-500 uppercase">모션/영상 프로젝트</span>
            <p className="mt-1 font-syne text-2xl font-bold text-slate-200">
              {projects.filter((p) => p.category.includes('Motion') || p.category.includes('Video')).length}개
            </p>
          </div>
          <div className="rounded-xl border border-[#1e2d42] bg-[#0c1422] p-4">
            <span className="text-[11px] font-mono text-slate-500 uppercase">생성형 AI 디렉팅</span>
            <p className="mt-1 font-syne text-2xl font-bold text-slate-200">
              {projects.filter((p) => p.category === 'Generative AI Content').length}개
            </p>
          </div>
        </div>

        {/* Project Table List */}
        <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1c283c] flex items-center justify-between">
            <h3 className="font-syne text-sm font-bold text-white uppercase tracking-wider">
              등록된 프로젝트 목록 ({projects.length})
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              ★ 아이콘을 클릭하여 홈화면 노출 여부를 토글하세요.
            </span>
          </div>

          <div className="divide-y divide-[#1c283c] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090e17] font-mono text-[#7a9ec7] text-[11px] uppercase">
                <tr>
                  <th className="p-4 w-12 text-center">홈 노출</th>
                  <th className="p-4">썸네일</th>
                  <th className="p-4">프로젝트명</th>
                  <th className="p-4">카테고리</th>
                  <th className="p-4">연도/러닝타임</th>
                  <th className="p-4">사용 툴</th>
                  <th className="p-4 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c283c] text-slate-300">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-[#132034]/50 transition-colors">
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(p.id)}
                        className={`p-1 rounded transition-colors ${
                          p.isFeatured
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-slate-600 hover:text-slate-400'
                        }`}
                        title={p.isFeatured ? '홈화면 노출 중 (클릭 시 해제)' : '홈화면 미노출 (클릭 시 노출)'}
                      >
                        <Star className={`h-4 w-4 ${p.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="h-12 w-20 overflow-hidden rounded bg-[#070b14] border border-[#1e2d42] flex items-center justify-center">
                        <img src={resolveMediaUrl(p.thumbnailUrl)} alt={p.title} className="h-full w-full object-contain p-0.5" />
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-white">
                      <div>{p.title}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{p.titleKr}</div>
                    </td>
                    <td className="p-4">
                      <span className="rounded bg-[#131e2e] border border-[#1e2e44] px-2 py-0.5 font-mono text-[10px] text-slate-300">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-400">
                      {p.year} {p.duration ? `(${p.duration})` : ''}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.tools.slice(0, 3).map((t) => (
                          <span key={t} className="rounded bg-[#131e2e] px-1.5 py-0.5 text-[9px] font-mono text-slate-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectProject(p)}
                          className="p-1.5 rounded border border-[#1e2d42] bg-[#090e17] text-slate-400 hover:text-white"
                          title="미리보기"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => startEdit(p)}
                          className="p-1.5 rounded border border-[#1e2d42] bg-[#090e17] text-slate-300 hover:text-white hover:border-[#4d74a3]"
                          title="수정"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => requestDelete(p)}
                          className="p-1.5 rounded border border-[#1e2d42] bg-[#090e17] text-slate-400 hover:text-rose-400 hover:border-rose-900"
                          title="삭제"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}
      </div>

      {/* Edit / Add Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 p-4 backdrop-blur-xl">
          <div className="fixed inset-0" onClick={() => setEditingProject(null)}></div>

          <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#1c283c] pb-4">
              <h3 className="font-syne text-xl font-bold text-white">
                {isNewProject ? '새 프로젝트 추가' : '프로젝트 수정'}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs font-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-mono uppercase mb-1">프로젝트 타이틀 (Title) *</label>
                  <input
                    type="text"
                    required
                    value={formValues.title || ''}
                    onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                    className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-2.5 text-white focus:outline-none focus:border-[#4d74a3]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono uppercase mb-1">한글 부제목 (Korean Title)</label>
                  <input
                    type="text"
                    value={formValues.titleKr || ''}
                    onChange={(e) => setFormValues({ ...formValues, titleKr: e.target.value })}
                    className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-2.5 text-white focus:outline-none focus:border-[#4d74a3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-mono uppercase mb-1">카테고리 (Category)</label>
                  <select
                    value={formValues.category || 'Poster'}
                    onChange={(e) => {
                      const newCategory = e.target.value as any;
                      setFormValues((prev) => ({
                        ...prev,
                        category: newCategory,
                        heroMediaType: newCategory === 'Poster' ? 'image' : (prev.heroMediaType || 'image'),
                      }));
                    }}
                    className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-2.5 text-white focus:outline-none focus:border-[#4d74a3]"
                  >
                    <option value="Poster">Poster (포스터)</option>
                    <option value="2D Motion Graphics">2D Motion Graphics</option>
                    <option value="3D Motion Graphics">3D Motion Graphics</option>
                    <option value="Video Editing">Video Editing (영상편집)</option>
                    <option value="Generative AI Content">Generative AI Content</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono uppercase mb-1">제작 연도 (Year)</label>
                  <input
                    type="text"
                    value={formValues.year || '2025'}
                    onChange={(e) => setFormValues({ ...formValues, year: e.target.value })}
                    className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-2.5 text-white focus:outline-none focus:border-[#4d74a3]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono uppercase mb-1">러닝타임 / 규격 (Duration)</label>
                  <input
                    type="text"
                    placeholder="e.g. 30s Loop, A1 Series"
                    value={formValues.duration || ''}
                    onChange={(e) => setFormValues({ ...formValues, duration: e.target.value })}
                    className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-2.5 text-white focus:outline-none focus:border-[#4d74a3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-mono uppercase mb-1">담당 역할 (Role)</label>
                  <input
                    type="text"
                    value={formValues.role || ''}
                    onChange={(e) => setFormValues({ ...formValues, role: e.target.value })}
                    placeholder="e.g. Art Direction, Motion, Sound Edit"
                    className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-2.5 text-white focus:outline-none focus:border-[#4d74a3]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono uppercase mb-1">사용 툴 (쉼표로 구분)</label>
                  <input
                    type="text"
                    value={toolsString}
                    onChange={(e) => setToolsString(e.target.value)}
                    placeholder="After Effects, Photoshop, Cinema 4D, Octanerender"
                    className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-2.5 text-white focus:outline-none focus:border-[#4d74a3]"
                  />
                </div>
              </div>

              {/* Media Upload Zone (Upload directly from user's computer) */}
              <div className="space-y-4 rounded-xl border border-[#1e2d42] bg-[#080d16] p-4">
                <div className="flex items-center justify-between border-b border-[#141f2f] pb-2">
                  <div className="flex items-center gap-2">
                    <Film className="h-4 w-4 text-[#7a9ec7]" />
                    <span className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
                      미디어 파일 업로드 (내 컴퓨터에서 직접 선택 또는 드래그 앤 드롭)
                    </span>
                  </div>
                  <span className="rounded bg-[#122034] px-2 py-0.5 text-[10px] font-mono text-[#8bb2e2]">
                    로컬 파일 영구 저장 지원
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* 1. 썸네일 이미지 업로드 */}
                  <div className="space-y-1">
                    <FileUploadZone
                      label="1. 썸네일 이미지 (내 컴퓨터에서 파일 선택)"
                      subLabel="작품 리스트 카드 및 메인 썸네일로 표시될 이미지 (JPG, PNG, WebP 등)"
                      acceptType="image"
                      value={formValues.thumbnailUrl || ''}
                      onChange={(url) => setFormValues({ ...formValues, thumbnailUrl: url })}
                    />
                  </div>

                  {/* 2. 대표 히어로 미디어 (비디오 또는 이미지) 업로드 */}
                  <div className="space-y-1">
                    <FileUploadZone
                      label="2. 대표 상세 미디어 (비디오 영상 또는 이미지)"
                      subLabel="프로젝트 상세 모달 상단에 재생될 비디오(MP4, WebM, MOV) 또는 고화질 이미지"
                      acceptType="any"
                      value={formValues.heroMediaUrl || ''}
                      mediaType={formValues.heroMediaType || 'image'}
                      onMediaTypeChange={(type) => setFormValues({ ...formValues, heroMediaType: type })}
                      onChange={(url, detectedType) => {
                        const newType = detectedType || formValues.heroMediaType || 'image';
                        setFormValues((prev) => ({
                          ...prev,
                          heroMediaUrl: url,
                          heroMediaType: newType,
                          // 썸네일이 아직 비어있고 이미지를 올린 경우 썸네일에도 자동 설정
                          thumbnailUrl: !prev.thumbnailUrl && newType === 'image' ? url : prev.thumbnailUrl,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 3. 제작 과정 및 워크플로우 단계 관리 (Work in Progress / Process Steps) */}
              <div className="space-y-3 rounded-xl border border-[#1e2d42] bg-[#080d16] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider block">
                      3. 제작 과정 & 워크플로우 (Process Steps)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      제작 파이프라인의 각 단계별 제목, 설명 및 과정 이미지/영상을 직접 수정, 추가, 삭제할 수 있습니다.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const current = formValues.process || [];
                      const nextNum = (current.length + 1).toString().padStart(2, '0');
                      setFormValues({
                        ...formValues,
                        process: [
                          ...current,
                          {
                            stepNumber: nextNum,
                            title: `단계 ${nextNum} - 제작 과정`,
                            description: '',
                            mediaUrl: '',
                            mediaType: 'image',
                          },
                        ],
                      });
                    }}
                    className="flex items-center gap-1 rounded-lg border border-[#2a3f5c] bg-[#142337] px-3 py-1.5 text-xs font-semibold text-[#8bb2e2] hover:bg-[#1f3654] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>제작 단계 추가</span>
                  </button>
                </div>

                {(!formValues.process || formValues.process.length === 0) ? (
                  <div className="py-6 text-center border border-dashed border-[#1e2d42] rounded-lg bg-[#0c1422]/50 text-xs text-slate-500">
                    등록된 제작과정 단계가 없습니다. '제작 단계 추가' 버튼을 눌러 과정을 추가하세요.
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    {formValues.process.map((step, idx) => (
                      <div key={idx} className="rounded-xl border border-[#1c2a3e] bg-[#0c1422] p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-[#182537] pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-[#162740] px-2 py-0.5 text-[10px] font-mono text-[#8bb2e2] font-semibold">
                              STAGE {idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-slate-300">
                              제작 단계 #{idx + 1}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...(formValues.process || [])];
                                  const temp = updated[idx - 1];
                                  updated[idx - 1] = updated[idx];
                                  updated[idx] = temp;
                                  setFormValues({ ...formValues, process: updated });
                                }}
                                className="px-2 py-1 text-[10px] font-mono text-slate-400 hover:text-white bg-[#090e17] rounded border border-[#1e2d42]"
                                title="위로 이동"
                              >
                                ↑ 위로
                              </button>
                            )}
                            {idx < (formValues.process?.length || 0) - 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...(formValues.process || [])];
                                  const temp = updated[idx + 1];
                                  updated[idx + 1] = updated[idx];
                                  updated[idx] = temp;
                                  setFormValues({ ...formValues, process: updated });
                                }}
                                className="px-2 py-1 text-[10px] font-mono text-slate-400 hover:text-white bg-[#090e17] rounded border border-[#1e2d42]"
                                title="아래로 이동"
                              >
                                ↓ 아래로
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formValues.process?.filter((_, i) => i !== idx);
                                setFormValues({ ...formValues, process: updated });
                              }}
                              className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors px-2 py-1 rounded bg-rose-950/30 border border-rose-900/40"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>단계 삭제</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                              단계 번호 (Step No.)
                            </label>
                            <input
                              type="text"
                              value={step.stepNumber}
                              onChange={(e) => {
                                const updated = [...(formValues.process || [])];
                                updated[idx].stepNumber = e.target.value;
                                setFormValues({ ...formValues, process: updated });
                              }}
                              placeholder="01"
                              className="w-full rounded-lg border border-[#1e2d42] bg-[#090e17] p-2 text-xs text-white focus:outline-none focus:border-[#4d74a3]"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                              단계 타이틀 (Step Title)
                            </label>
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => {
                                const updated = [...(formValues.process || [])];
                                updated[idx].title = e.target.value;
                                setFormValues({ ...formValues, process: updated });
                              }}
                              placeholder="예: 3D 모델링 및 텍스처링 / 그리드 시스템 구축"
                              className="w-full rounded-lg border border-[#1e2d42] bg-[#090e17] p-2 text-xs text-white focus:outline-none focus:border-[#4d74a3]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                            단계 상세 설명 (Description)
                          </label>
                          <textarea
                            rows={2}
                            value={step.description}
                            onChange={(e) => {
                              const updated = [...(formValues.process || [])];
                              updated[idx].description = e.target.value;
                              setFormValues({ ...formValues, process: updated });
                            }}
                            placeholder="해당 제작 단계에서 사용된 기법, 디자인 고민, 해결 과정에 대한 상세 설명"
                            className="w-full rounded-lg border border-[#1e2d42] bg-[#090e17] p-2 text-xs text-white focus:outline-none focus:border-[#4d74a3] resize-none"
                          />
                        </div>

                        <FileUploadZone
                          label={`단계 #${idx + 1} 과정 미디어 파일 (이미지 또는 비디오)`}
                          subLabel="이 단계의 작업 과정을 보여주는 스크린샷, 렌더링 또는 영상 파일"
                          acceptType="any"
                          value={step.mediaUrl}
                          mediaType={step.mediaType}
                          onMediaTypeChange={(type) => {
                            const updated = [...(formValues.process || [])];
                            updated[idx].mediaType = type;
                            setFormValues({ ...formValues, process: updated });
                          }}
                          onChange={(url, detectedType) => {
                            const updated = [...(formValues.process || [])];
                            updated[idx].mediaUrl = url;
                            if (detectedType) updated[idx].mediaType = detectedType;
                            setFormValues({ ...formValues, process: updated });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Output Media (Images/Videos from local computer) */}
              <div className="space-y-3 rounded-xl border border-[#1e2d42] bg-[#080d16] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider block">
                      추가 갤러리 미디어 (선택: 추가 비디오 및 스틸컷)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      상세 모달 하단 결과물 갤러리에 추가될 영상이나 이미지를 내 컴퓨터에서 업로드할 수 있습니다.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const current = formValues.finalOutputs || [];
                      setFormValues({
                        ...formValues,
                        finalOutputs: [
                          ...current,
                          {
                            title: `추가 미디어 0${current.length + 1}`,
                            url: '',
                            mediaType: 'image',
                            caption: '',
                          },
                        ],
                      });
                    }}
                    className="flex items-center gap-1 rounded-lg border border-[#2a3f5c] bg-[#142337] px-3 py-1.5 text-xs font-semibold text-[#8bb2e2] hover:bg-[#1f3654] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>미디어 추가</span>
                  </button>
                </div>

                {formValues.finalOutputs && formValues.finalOutputs.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {formValues.finalOutputs.map((item, idx) => (
                      <div key={idx} className="rounded-xl border border-[#1c2a3e] bg-[#0c1422] p-3.5 space-y-3">
                        <div className="flex items-center justify-between border-b border-[#182537] pb-2">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...(formValues.finalOutputs || [])];
                              updated[idx].title = e.target.value;
                              setFormValues({ ...formValues, finalOutputs: updated });
                            }}
                            placeholder="미디어 제목 (예: 씬 컷, 렌더링 스틸, 서브 클립)"
                            className="bg-transparent text-xs font-bold text-white focus:outline-none border-b border-transparent focus:border-[#4d74a3] w-2/3"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formValues.finalOutputs?.filter((_, i) => i !== idx);
                              setFormValues({ ...formValues, finalOutputs: updated });
                            }}
                            className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>삭제</span>
                          </button>
                        </div>
                        <FileUploadZone
                          label={`미디어 파일 #${idx + 1} (내 컴퓨터에서 선택)`}
                          acceptType="any"
                          value={item.url}
                          mediaType={item.mediaType}
                          onMediaTypeChange={(type) => {
                            const updated = [...(formValues.finalOutputs || [])];
                            updated[idx].mediaType = type;
                            setFormValues({ ...formValues, finalOutputs: updated });
                          }}
                          onChange={(url, detectedType) => {
                            const updated = [...(formValues.finalOutputs || [])];
                            updated[idx].url = url;
                            if (detectedType) updated[idx].mediaType = detectedType;
                            setFormValues({ ...formValues, finalOutputs: updated });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-400 font-mono uppercase mb-1">프로젝트 개요 (Overview)</label>
                <textarea
                  rows={3}
                  value={formValues.overview || ''}
                  onChange={(e) => setFormValues({ ...formValues, overview: e.target.value })}
                  placeholder="프로젝트의 목적과 전반적인 설명"
                  className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-2.5 text-white focus:outline-none focus:border-[#4d74a3] resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono uppercase mb-1">기획 의도 및 컨셉 (Concept)</label>
                <textarea
                  rows={3}
                  value={formValues.concept || ''}
                  onChange={(e) => setFormValues({ ...formValues, concept: e.target.value })}
                  placeholder="어떤 아이디어와 조형 언어에서 출발했는지"
                  className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-2.5 text-white focus:outline-none focus:border-[#4d74a3] resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono uppercase mb-1">디자이너 회고 (Reflection)</label>
                <textarea
                  rows={2}
                  value={formValues.reflection || ''}
                  onChange={(e) => setFormValues({ ...formValues, reflection: e.target.value })}
                  placeholder="배운 점, 개선한 점, 역량 증명 포인트"
                  className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-2.5 text-white focus:outline-none focus:border-[#4d74a3] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formValues.isFeatured ?? true}
                  onChange={(e) => setFormValues({ ...formValues, isFeatured: e.target.checked })}
                  className="h-4 w-4 rounded border-[#1e2d42] bg-[#090e17] text-[#3b5b82] focus:ring-0"
                />
                <label htmlFor="featuredCheck" className="text-slate-300 font-medium">
                  홈 화면 Selected Works에 추천 작업물로 노출
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1c283c]">
                <div>
                  {!isNewProject && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = projects.find((p) => p.id === editingProject?.id);
                        if (target) {
                          requestDelete(target);
                        }
                      }}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-900/50 bg-rose-950/30 px-3.5 py-2 text-xs font-medium text-rose-400 hover:bg-rose-900/50 hover:text-white transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>{lang === 'ko' ? '프로젝트 삭제' : 'Delete Project'}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="rounded-xl border border-[#1e2d42] px-4 py-2 text-slate-400 hover:text-white text-xs sm:text-sm"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-[#3b5b82] px-5 py-2 font-bold text-white hover:bg-[#4a72a3] shadow-md shadow-[#1e3352]/30 text-xs sm:text-sm"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isNewProject ? '프로젝트 등록' : '변경사항 저장'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Project Deletion */}
      {projectToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-rose-900/60 bg-[#0c1422] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs">
              <Trash2 className="h-4 w-4" />
              <span>Project Deletion</span>
            </div>
            <h3 className="font-syne text-lg font-bold text-white">
              {lang === 'ko' ? '정말 이 프로젝트를 삭제하시겠습니까?' : 'Are you sure you want to delete this project?'}
            </h3>
            <div className="rounded-xl border border-[#1e2d42] bg-[#090e17] p-3 flex items-center gap-3">
              <div className="h-10 w-14 overflow-hidden rounded bg-[#131e2e] flex-shrink-0">
                {projectToDelete.thumbnailUrl ? (
                  <img src={resolveMediaUrl(projectToDelete.thumbnailUrl)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-600">
                    <Film className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white text-sm truncate">{projectToDelete.title}</div>
                <div className="text-[11px] text-slate-400 font-mono">{projectToDelete.category} • {projectToDelete.year}</div>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'ko'
                ? '삭제 후에는 복구할 수 없습니다. 계속 진행하시겠습니까?'
                : 'This action cannot be undone. Are you sure you wish to continue?'}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="rounded-lg border border-[#1e2d42] px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                {lang === 'ko' ? '취소' : 'Cancel'}
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-500 shadow-md shadow-rose-900/30"
              >
                {lang === 'ko' ? '삭제 확인' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs">
              <AlertTriangle className="h-4 w-4" />
              <span>Reset Confirmation</span>
            </div>
            <h3 className="font-syne text-lg font-bold text-white">
              기본 샘플 데이터로 복구하시겠습니까?
            </h3>
            <p className="text-xs text-slate-400">
              현재 수정된 모든 프로젝트 데이터가 초기화되고 8개의 고품질 샘플 프로젝트 세트로 재설정됩니다.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="rounded-lg border border-[#1e2d42] px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                취소
              </button>
              <button
                onClick={() => {
                  onResetToDefaults();
                  setShowConfirmReset(false);
                }}
                className="rounded-lg bg-rose-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-600"
              >
                초기화 확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
