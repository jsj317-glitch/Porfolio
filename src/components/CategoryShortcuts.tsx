import React from 'react';
import { Category } from '../types';
import { ArrowRight, Layers, Film, Box, Video, Sparkles, CheckCircle2 } from 'lucide-react';

interface CategoryShortcutsProps {
  onSelectCategory: (category: Category) => void;
  lang: 'ko' | 'en';
}

export const CategoryShortcuts: React.FC<CategoryShortcutsProps> = ({
  onSelectCategory,
  lang,
}) => {
  const categories = [
    {
      id: 'Poster' as Category,
      title: 'Poster Design',
      titleKr: '포스터 디자인',
      icon: Layers,
      accent: 'border-zinc-700 hover:border-zinc-400',
      descriptionKr: '스위스 그리드와 타이포그래피, 컬러 대비를 통해 강력한 시각적 인상을 남기는 인쇄 및 디지털 포스터 작업',
      competencies: [
        '타이포그래피 및 모듈러 그리드 설계',
        '인쇄 후가공(박, 형압, 특수지) 목업 이해',
        '디지털 미디어와 옥외 사이니지 확장',
      ],
      tools: 'Photoshop, Illustrator, InDesign',
    },
    {
      id: '2D Motion Graphics' as Category,
      title: '2D Motion Graphics',
      titleKr: '2D 모션그래픽',
      icon: Film,
      accent: 'border-zinc-700 hover:border-zinc-400',
      descriptionKr: '리드미컬한 키프레임과 탄력적인 이징, 키네틱 타이포와 오디오 비트 싱크를 결합한 브랜드 모션',
      competencies: [
        '스피드 그래프 커브 정밀 튜닝',
        '128 BPM+ 비트 싱크 및 사운드 폴리 결합',
        '스토리보드부터 스타일프레임 자체 완결',
      ],
      tools: 'After Effects, Illustrator, Premiere Pro',
    },
    {
      id: '3D Motion Graphics' as Category,
      title: '3D Motion Graphics',
      titleKr: '3D 모션그래픽',
      icon: Box,
      accent: 'border-zinc-700 hover:border-zinc-400',
      descriptionKr: '유기적 유체 시뮬레이션과 미래지향적 금속 텍스처, 시네마틱 라이팅과 DoF 카메라 연출',
      competencies: [
        'Cinema 4D 서브디비전 모델링 및 Octanerender',
        'PBR 셰이딩 및 HDRI 3점 라이팅 설계',
        'AOV 멀티패스 추출 및 After Effects 합성',
      ],
      tools: 'Cinema 4D, Octanerender, After Effects',
    },
    {
      id: 'Video Editing' as Category,
      title: 'Video Editing',
      titleKr: '촬영 / 영상편집',
      icon: Video,
      accent: 'border-zinc-700 hover:border-zinc-400',
      descriptionKr: '호흡을 조율하는 드라마틱 컷 편집, 시네마틱 룩 톤보정, 6트랙 앰비언스 사운드',
      competencies: [
        '로그 푸티지 색보정 (Before & After 증명)',
        '감정 곡선에 따른 교차 편집 및 서스펜스 구축',
        '자막 및 시네마틱 타이틀 타이포그래피',
      ],
      tools: 'Premiere Pro, Audition',
    },
    {
      id: 'Generative AI Content' as Category,
      title: 'Generative AI Content',
      titleKr: '생성형 AI 디렉팅 & 후가공',
      icon: Sparkles,
      accent: 'border-zinc-700 hover:border-zinc-400',
      descriptionKr: '원클릭 생성이 아닌, 구체적인 프롬프트 아키텍처 수립 및 포토샵 마스킹·리터칭을 거친 완성형 비주얼',
      competencies: [
        '촬영 감독 관점의 렌즈/조명 프롬프트 설계',
        '포토샵 인페인팅 및 주파수 분리 합성',
        'AI 비디오 소스에 모션그래픽 결합',
      ],
      tools: 'Midjourney, Comfy UI, Photoshop',
    },
  ];

  return (
    <section className="py-20 border-b border-zinc-850 bg-zinc-950/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400"></span>
            <span>Disciplines & Mastery</span>
          </div>
          <h2 className="mt-2 font-syne text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'ko' ? '카테고리별 제작 전문성' : 'Specialized Categories'}
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl font-body">
            {lang === 'ko'
              ? '각 분야마다 요구되는 핵심 감각과 프로덕션 파이프라인을 체계적으로 수립하여 작업합니다. 카테고리를 선택하면 관련 프로젝트만 모아볼 수 있습니다.'
              : 'Explore focused projects by domain, showcasing deep technical craft and creative problem-solving.'}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group flex flex-col justify-between rounded-xl border border-zinc-850 bg-zinc-900/40 p-6 transition-all duration-300 hover:border-zinc-600 hover:bg-zinc-900/90 cursor-pointer ${
                  cat.id === 'Generative AI Content' ? 'lg:col-span-2' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/80 text-zinc-200 group-hover:bg-white group-hover:text-black transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[11px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      Explore Works →
                    </span>
                  </div>

                  <h3 className="font-syne text-lg font-bold text-white group-hover:text-zinc-100">
                    {lang === 'ko' ? cat.titleKr : cat.title}
                  </h3>

                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    {cat.descriptionKr}
                  </p>

                  {/* Competency bullet points */}
                  <div className="mt-4 space-y-1.5 pt-3 border-t border-zinc-800/80">
                    {cat.competencies.map((comp, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-zinc-300">
                        <CheckCircle2 className="h-3 w-3 text-zinc-500 flex-shrink-0" />
                        <span className="line-clamp-1">{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-850 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-500">{cat.tools}</span>
                  <span className="font-semibold text-zinc-300 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
