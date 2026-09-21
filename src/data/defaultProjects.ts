import { Project, DesignerProfile } from '../types';

export const defaultDesignerProfile: DesignerProfile = {
  nameEn: 'SEONJEONG JEON',
  nameKr: '전선정',
  roleTitleEn: 'Visual & Motion Designer / Hybrid Creative',
  roleTitleKr: '비주얼 & 모션그래픽 디자이너',
  status: '채용 지원 가능 • 인하우스 / 에이전시 크리에이티브',
  oneLineBioKr: '포스터, 모션그래픽, 영상편집, 생성형 AI 콘텐츠를 기반으로 시각적 스토리텔링을 만드는 디자이너 전선정입니다.',
  oneLineBioEn: 'Visual Designer specializing in Poster, Motion Graphics, Video Editing, and AI-driven Content.',
  headlineKr: '단순히 툴을 다루는 수준을 넘어, 기획 의도와 시각적 리듬을 결합하여 채용 담당자와 클라이언트에게 즉각적인 시각적 임팩트와 스토리텔링을 전달합니다.',
  headlineEn: 'Bridging graphic discipline and dynamic motion rhythm. Crafting intentional visual systems that capture attention within seconds while delivering deep conceptual storytelling and commercial refinement.',
  aboutHeadingKr: '시각적 임팩트와 움직임을 다루는 크리에이티브 디자이너',
  aboutHeadingEn: 'Creative Designer Specialized in Motion & Visual Impact',
  detailedBioKr: '저는 그래픽 디자인과 모션그래픽을 기반으로 브랜드와 콘텐츠의 메시지를 시각적으로 전달하는 디자이너 전선정입니다. 포스터 디자인부터 2D/3D 모션그래픽, 촬영 영상 편집, 생성형 AI 콘텐츠 제작까지 다양한 시각 매체를 능동적으로 결합하여 콘셉트가 명확하고 완성도 높은 결과물을 만듭니다.',
  detailedBioEn: 'I am a designer who visually conveys brand and content messages through graphic design and motion graphics. From poster design to 2D/3D motion graphics, live-action video editing, and generative AI content production, I actively combine diverse visual mediums to craft high-impact outcomes.',
  specialty: 'Motion, Poster, Video & AI',
  education: 'B.F.A in Visual & Motion Design',
  targetRole: 'Motion & Visual Designer',
  email: 'sunjung317@naver.com',
  location: 'Seoul, Republic of Korea',
  phone: '+82 10-8924-5100',
  behance: 'https://behance.net',
  vimeo: '',
  youtube: 'https://youtube.com',
  instagram: 'https://instagram.com',
  github: 'https://github.com',
  whatIDo: [
    {
      id: 'wid-1',
      title: 'Graphic & Poster Design',
      titleKr: '그래픽 & 포스터 디자인',
      desc: '타이포그래피, 비례 그리드, 컬러 시스템을 기반으로 전시·브랜드의 아이덴티티를 각인시키는 비주얼 기획',
    },
    {
      id: 'wid-2',
      title: '2D Motion Graphics',
      titleKr: '2D 모션그래픽',
      desc: '키네틱 타이포, 절도 있는 비트 싱크, 벡터 애니메이션을 통한 다이내믹한 브랜드 모션 티저 제작',
    },
    {
      id: 'wid-3',
      title: '3D Visual & Kinetic Art',
      titleKr: '3D 비주얼 & 키네틱 아트',
      desc: 'Cinema 4D와 Octanerender 기반의 정밀 모델링, PBR 셰이딩, 시네마틱 라이팅 및 카메라 연출',
    },
    {
      id: 'wid-4',
      title: 'Video Editing & Audio Mastering',
      titleKr: '촬영 영상편집 & 오디오 마스터링',
      desc: '스토리의 호흡을 살리는 드라마틱 컷 편집, 시네마틱 룩 톤보정, 6트랙 오디오 믹싱',
    },
    {
      id: 'wid-5',
      title: 'AI-driven Creative Directing',
      titleKr: '생성형 AI 디렉팅 & 합성',
      desc: '원클릭 생성이 아닌 Comfy UI 기반의 체계적인 워크플로우와 포토샵/에프터이펙트 후가공을 결합한 상업 퀄리티 비주얼',
    },
  ],
  skillCategories: [
    {
      id: 'skill-1',
      name: 'Design & Motion',
      tools: ['After Effects (Advanced)', 'Premiere Pro', 'Photoshop', 'Illustrator', 'InDesign'],
    },
    {
      id: 'skill-2',
      name: '3D & Spatial',
      tools: ['Cinema 4D', 'Octanerender', 'Substance Painter'],
    },
    {
      id: 'skill-3',
      name: 'Sound & Mastering',
      tools: ['Adobe Audition', 'Sound Foley Layering'],
    },
    {
      id: 'skill-4',
      name: 'Generative AI Pipelines',
      tools: ['Midjourney (v6)', 'Comfy UI', 'Magnific AI'],
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      period: '2024.03 — Present',
      role: 'Lead Visual & Motion Designer',
      place: 'Studio NEXUS (Brand & Media Agency)',
      desc: '브랜드 캠페인 모션 티저, 3D 키네틱 아트 및 디지털 포스터 시리즈 총괄 디렉팅. 2D/3D 모션 파이프라인 정립 및 클라이언트 커뮤니케이션 리드.',
    },
    {
      id: 'exp-2',
      period: '2023.01 — 2024.02',
      role: 'Content & Video Specialist',
      place: 'K-Creative Media Lab',
      desc: '상업 영상 컷 편집, 다빈치 리졸브 색보정, 생성형 AI를 활용한 신규 미디어 프로모션 콘텐츠 기획 및 마스터링.',
    },
    {
      id: 'exp-3',
      period: '2022.06 — 2022.12',
      role: 'Graphic Design Intern',
      place: 'Metro Brand Works',
      desc: '아이덴티티 디자인, 오프라인 전시 인쇄물 제작 및 타이포그래피 포스터 목업 연구.',
    },
  ],
  awards: [
    {
      id: 'award-1',
      year: '2025',
      title: 'Korea Digital Media Award - Motion Graphics Excellence',
      org: '한국디지털미디어협회',
    },
    {
      id: 'award-2',
      year: '2024',
      title: 'Seoul Design Festival - Young Designer Selected Showcase',
      org: '디자인하우스',
    },
    {
      id: 'award-3',
      year: '2023',
      title: 'International Typography Biennale - Poster Finalist',
      org: '한국타이포그라피학회',
    },
  ],
};

export const defaultProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Festival Poster Series: RE:SONANCE 2025',
    titleKr: '사운드 페스티벌 포스터 시리즈: 리조넌스 2025',
    category: 'Poster',
    year: '2025',
    duration: '4 Weeks / 3 Series',
    role: 'Art Direction, Typography, Grid Layout, Print Mockup',
    tools: ['Photoshop', 'Illustrator', 'InDesign'],
    clientOrPurpose: '전시 / 사운드 아트 & 오디오 비주얼 페스티벌 홍보',
    overview: '소리의 파동과 공명을 기하학적 그리드와 강렬한 타이포그래피로 시각화한 3부작 페스티벌 포스터 프로젝트입니다. 인쇄 매체와 디지털 스크린 매체 모두에서 즉각적인 주목성을 발휘하도록 설계되었습니다.',
    concept: '보이지 않는 오디오 주파수를 정밀한 타이포그래피의 밀도와 흑백 네거티브 스페이스로 전환. 볼드한 헤드라인과 실험적인 텍스트 레이아웃을 통해 청각적 에너지를 시각적 리듬으로 치환했습니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    heroMediaUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1600&auto=format&fit=crop',
    heroMediaType: 'image',
    isFeatured: true,
    order: 1,
    process: [
      {
        stepNumber: '01',
        title: 'Grid & Typography Research',
        description: '스위스 인터내셔널 스타일 기반의 12열 모듈러 그리드를 설계하고, 세리프와 산세리프 폰트의 대비를 통해 파동의 긴장감을 정의했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      },
      {
        stepNumber: '02',
        title: 'Waveform & Distortion Test',
        description: '사운드 데이터 스펙트로그램을 벡터화한 뒤 일러스트레이터의 블렌드 툴과 엔벨로프 왜곡을 통해 독창적인 키 비주얼 텍스처를 구축했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      },
      {
        stepNumber: '03',
        title: 'Physical Print & Foil Simulation',
        description: '흑색 무광 코팅지(250g)와 실버 홀로그램 박 가공을 시뮬레이션하여 오프라인 전시장 부착 시 조명 반사에 따른 입체감을 검증했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      }
    ],
    finalOutputs: [
      {
        title: 'Series #01 - The Waveform',
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
        mediaType: 'image',
        caption: '메인 헤드라인 및 오디오 비주얼 키 그래픽 포스터'
      },
      {
        title: 'Series #02 - Temporal Frequency',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
        mediaType: 'image',
        caption: '타임테이블 정보 중심의 서브 포스터'
      },
      {
        title: 'Exhibition Wall Mockup',
        url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1200&auto=format&fit=crop',
        mediaType: 'image',
        caption: '실제 옥외 대형 빌보드 및 전시 공간 적용 시뮬레이션'
      }
    ],
    reflection: '정보 전달이라는 포스터 본연의 기능성과 예술적 조형미 사이의 균형점을 찾았습니다. 관람객이 멀리서는 강렬한 대비의 비주얼에 이끌리고, 가까이 다가섰을 때는 세밀한 타이포 정보와 레이아웃 질서를 명확히 인지할 수 있도록 설계하는 역량을 증명했습니다.'
  },
  {
    id: 'proj-2',
    title: 'Brand Motion Teaser: NEXUS DIGITAL',
    titleKr: '브랜드 모션 티저: 넥서스 디지털',
    category: '2D Motion Graphics',
    year: '2025',
    duration: '30s Loop',
    role: 'Creative Direction, Storyboard, Keyframe Animation, Sound Sync',
    tools: ['After Effects', 'Illustrator', 'Premiere Pro'],
    clientOrPurpose: '테크 브랜딩 에이전시 런칭 홍보 30초 모션 티저',
    overview: '차세대 디지털 디자인 컨설팅 브랜드 NEXUS의 런칭을 알리는 30초 2D 모션 티저입니다. 타이포그래피의 역동적인 트랜지션과 절도 있는 비트 매칭으로 브랜드의 현대적인 혁신성을 시각화했습니다.',
    concept: '단순한 그래픽 전환을 넘어 ‘연결과 확장(Nexus)’을 테마로, 선과 면이 기하학적으로 변형되며 하나의 유기적 심볼로 수렴되는 리드미컬한 키프레임 연출을 전개했습니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    heroMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-digital-grid-animation-43093-large.mp4',
    heroMediaType: 'video',
    isFeatured: true,
    order: 2,
    process: [
      {
        stepNumber: '01',
        title: 'Concept & Storyboard',
        description: '8개 주요 시퀀스 프레임워크를 수립하고, 비트 카운트(128 BPM)에 맞춘 씬 타이밍 차트를 기획했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      },
      {
        stepNumber: '02',
        title: 'Styleframes & Vector Assets',
        description: '일러스트레이터에서 고해상도 벡터 컴포넌트를 설계하고 레이어 구조를 에프터이펙트에 최적화된 형태로 분할 정돈했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      },
      {
        stepNumber: '03',
        title: 'Graph Editor & Easing Curves',
        description: '에프터이펙트의 Speed Graph를 정밀 조절하여 단조로운 리니어 모션을 배제하고, 탄력적인 엑센트와 긴장감 있는 감속(Ease Out/In)을 구현했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      }
    ],
    finalOutputs: [
      {
        title: 'Motion Teaser - 30s Cut',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-and-data-41551-large.mp4',
        mediaType: 'video',
        caption: '최종 사운드 믹싱 및 키네틱 타이포그래피 모션 시퀀스'
      },
      {
        title: 'Styleframe Climax Shot',
        url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
        mediaType: 'image',
        caption: '브랜드 로고로 압축되는 정점 프레임'
      }
    ],
    reflection: '키프레임의 타이밍 조절과 모션 블러, 사운드 이펙트의 1/60초 단위 싱크가 시청자의 몰입감에 미치는 영향을 체득했습니다. 브랜드 가치를 모션의 템포감만으로도 명확히 각인시키는 성과를 달성했습니다.'
  },
  {
    id: 'proj-3',
    title: 'Future Kinetic Sculpture: FLUID CHROME',
    titleKr: '퓨처 키네틱 3D 모션: 플루이드 크롬',
    category: '3D Motion Graphics',
    year: '2025',
    duration: '45s High-res Render',
    role: '3D Modeling, Procedural Shading, Lighting Setup, Camera Animation, Compositing',
    tools: ['Blender', 'Cinema 4D', 'After Effects'],
    clientOrPurpose: '디지털 아트 플랫폼 가상 전시 오프닝 영상',
    overview: '메탈릭한 유체 텍스처와 정밀한 기계적 모듈이 상호작용하는 3D 키네틱 아트 영상입니다. 초정밀 조명 연출과 심도 있는 카메라 워크를 통해 실재감 넘치는 질감과 미래지향적 무드를 완성했습니다.',
    concept: '유기적인 액체와 차가운 산업 크롬 금속이 결합하는 변형 과정을 통해 ‘디지털과 물리적 현실의 융합’을 은유했습니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
    heroMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-spinning-metallic-shapes-in-a-dark-space-41549-large.mp4',
    heroMediaType: 'video',
    isFeatured: true,
    order: 3,
    process: [
      {
        stepNumber: '01',
        title: 'Topology & Wireframe Structure',
        description: '서브디비전 서피스 모델링을 통해 왜곡 없는 유선형 볼륨을 구축하고, 렌더링 부하를 최적화한 토폴로지를 구성했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      },
      {
        stepNumber: '02',
        title: 'PBR Shading & Anisotropy',
        description: '거칠기(Roughness) 맵과 이방성 반사(Anisotropic Specular) 노드를 세밀히 조율하여 현실적인 메탈릭 크롬 광택과 미세 스크래치를 표현했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      },
      {
        stepNumber: '03',
        title: 'Lighting & Depth of Field',
        description: '3점 라이팅과 커스텀 HDRI 환경맵, 그리고 f/1.8 피사계 심도(DoF) 카메라를 연동해 시네마틱한 공간감을 창출했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      }
    ],
    finalOutputs: [
      {
        title: '3D Simulation Motion Sequence',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-spinning-metallic-shapes-in-a-dark-space-41549-large.mp4',
        mediaType: 'video',
        caption: 'Blender Cycles 4K 렌더 및 After Effects 컬러 그레이딩'
      },
      {
        title: 'Still Frame Render - High Res',
        url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
        mediaType: 'image',
        caption: '반사광 굴절 및 미세한 스페큘러 하이라이트 디테일'
      }
    ],
    reflection: '복잡한 3D 씬에서도 렌더 패스(Diffuse, Specular, Normal, Cryptomatte)를 분리 추출하여 2D 합성 단계에서 유연하고 신속하게 룩을 튜닝하는 프로덕션 파이프라인의 핵심을 마스터했습니다.'
  },
  {
    id: 'proj-4',
    title: 'Cinematic Short: SHADOWS OF METROPOLIS',
    titleKr: '시네마틱 영상편집: 도시의 그림자',
    category: 'Video Editing',
    year: '2024',
    duration: '1m 20s Cut',
    role: 'Editorial Direction, Rough/Fine Cut, Color Grading, Sound Design, Title Typography',
    tools: ['Premiere Pro', 'DaVinci Resolve', 'After Effects'],
    clientOrPurpose: '독립 필름 페스티벌 출품 트레일러 및 브랜드 필름 편집',
    overview: '밤의 도시를 배경으로 촬영된 원본 푸티지를 흡인력 있는 호흡으로 재구성한 시네마틱 트레일러입니다. 정밀한 리듬 컷과 과감한 틸-오렌지 컬러 그레이딩, 공간감을 극대화한 오디오 믹싱으로 서스펜스를 고조시켰습니다.',
    concept: '단편적 장면들을 시간의 선형성을 깨고 감정의 고조에 맞춰 교차 편집(Intercutting)함으로써, 인물의 내면적 고립과 도시의 냉혹함을 극대화했습니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200&auto=format&fit=crop',
    heroMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-illuminated-neon-tubes-41566-large.mp4',
    heroMediaType: 'video',
    isFeatured: true,
    order: 4,
    beforeAfter: {
      beforeTitle: 'Flat Log Camera Footage (Before)',
      beforeUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
      afterTitle: 'Graded Cinematic Film Look (After)',
      afterUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1000&auto=format&fit=crop',
      description: '채도와 대비가 빠진 Log 원본에 DaVinci Resolve 노드 트리를 적용하여 스킨톤 보호, 섀도우 블루 틴트 주입, 필름 그레인 추가로 시네마틱 질감을 완성했습니다.'
    },
    process: [
      {
        stepNumber: '01',
        title: 'Story Rhythm & Pacing',
        description: 'B-roll 소스와 메인 씬의 감정 곡선을 타임라인 상에 시각화하고, 침묵과 급격한 컷 전환의 대비를 기획했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      },
      {
        stepNumber: '02',
        title: 'DaVinci Node-based Color Grading',
        description: 'Primary 노드 노출 보정 -> Qualifier를 활용한 인물 스킨톤 분리 -> 헐리우드풍 틸&오렌지 스플릿 톤 적용 파이프라인을 구축했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      },
      {
        stepNumber: '03',
        title: 'Sound Foley & Ambience Layering',
        description: '도시의 앰비언트(빗소리, 자동차 경적 잔향, 지하철 저주파 럼블)를 6개 오디오 트랙으로 레이어링하여 공간적 몰입감을 배가시켰습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      }
    ],
    finalOutputs: [
      {
        title: 'Final Edited Master Trailer',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-illuminated-neon-tubes-41566-large.mp4',
        mediaType: 'video',
        caption: '최종 색보정, 사운드 디자인 및 타이틀 크레딧 통합본'
      },
      {
        title: 'Color Grading Key Shot',
        url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200&auto=format&fit=crop',
        mediaType: 'image',
        caption: '하이라이트와 섀도우 콘트라스트 디테일'
      }
    ],
    reflection: '촬영된 원본 푸티지가 가진 잠재력을 발견하고, 컷의 길이 0.1초 차이가 전체 드라마의 서스펜스를 어떻게 바꾸는지 체감했습니다. 색보정과 사운드가 단순한 후작업이 아니라 연출의 핵심 언어임을 실증했습니다.'
  },
  {
    id: 'proj-5',
    title: 'Synthetic Realism Visuals: THE BOTANICAL LAB',
    titleKr: '생성형 AI 디렉팅 & 비주얼 아트워크: 보태니컬 랩',
    category: 'Generative AI Content',
    year: '2025',
    duration: 'Editorial Lookbook (6 Visuals)',
    role: 'Creative Prompt Engineering, Concept Direction, Heavy Photoshop Post-Processing & Retouching, Typography',
    tools: ['Midjourney', 'Photoshop', 'Stable Diffusion', 'Illustrator'],
    clientOrPurpose: '퓨처 바이오 코스메틱 가상 룩북 & 브랜드 비주얼 개발',
    overview: '단순한 AI 결과물 출력을 넘어, 디자이너의 콘셉트 기획력과 정밀한 포토샵 후가공을 통해 상업용 화보 수준으로 완성한 생성형 AI 하이브리드 비주얼 프로젝트입니다. 미드저니로 생성된 유기적 식물 텍스처와 인물 소스를 바탕으로, 구도 재배치, 피부 결 보정, 조명 일치화, 타이포그래피 합성을 거쳐 독창적인 아트 디렉션을 구축했습니다.',
    concept: '자연의 유기적 생명력과 미래 지향적 연구소의 클린한 미니멀리즘이 공존하는 시각적 텐션을 표현. AI를 크리에이티브 발상의 가속기로 삼고, 최종 완성도는 디자이너의 장인정신으로 마감했습니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    heroMediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    heroMediaType: 'image',
    isFeatured: true,
    order: 5,
    beforeAfter: {
      beforeTitle: 'Raw AI Image Generation (Before)',
      beforeUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop',
      afterTitle: 'Designer Directing & Composite (After)',
      afterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
      description: '단순 생성 이미지의 왜곡된 손가락/경계선 디테일을 제거하고, 포토샵 마스킹과 주파수 분리 기법을 통해 실제 카메라로 촬영된 듯한 고급스러운 질감과 조명 반사를 재구축했습니다.'
    },
    process: [
      {
        stepNumber: '01',
        title: 'Prompt Architecture & Style Guide',
        description: '카메라 렌즈(Hasselblad 80mm f/2.8), 조명(Softbox diffused, rim light), 색온도(5600K) 등 구체적인 촬영 감독 관점의 프롬프트 파라미터를 설계하여 100여 개의 시안 중 핵심 에셋을 선별했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      },
      {
        stepNumber: '02',
        title: 'Multi-plate Inpainting & Outpainting',
        description: 'Stable Diffusion의 인페인팅 기능을 이용해 배경 요소의 구도를 확장하고 어색한 구조적 오류를 부분 재수정했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      },
      {
        stepNumber: '03',
        title: 'Photoshop Retouch & Typographic Overlay',
        description: '피부 결 텍스처 복원, 색감 그레이딩 룩업(LUT) 적용, 그리고 모던한 세리프 타이포그래피 레이아웃을 얹어 실제 매거진 표지 규격으로 최종 마스터링했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      }
    ],
    finalOutputs: [
      {
        title: 'Editorial Visual - The Bloom',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
        mediaType: 'image',
        caption: '완성된 브랜드 키 비주얼 아트워크 (Lookbook Cover)'
      },
      {
        title: 'Spread Page Graphic Layout',
        url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop',
        mediaType: 'image',
        caption: '타이포그래피와 합성된 내지 스프레드 디자인'
      }
    ],
    reflection: 'AI 툴은 버튼 하나로 그림을 만드는 요술봉이 아니라, 디자이너의 명확한 미적 기준과 디렉팅 역량이 개입할 때 비로소 가치를 갖는 강력한 렌더링 엔진임을 입증했습니다. 도구의 한계를 포토샵과 그래픽 감각으로 보완하는 하이브리드 워크플로우를 확립했습니다.'
  },
  {
    id: 'proj-6',
    title: 'Kinetic Typography & Sound: ECHO SYSTEM',
    titleKr: '키네틱 타이포그래피 & 사운드 싱크: 에코 시스템',
    category: '2D Motion Graphics',
    year: '2025',
    duration: '25s Video',
    role: 'Typography Design, Motion Graphics, Beat Syncing',
    tools: ['After Effects', 'Illustrator'],
    clientOrPurpose: '전자음악 레이블 릴리즈 티저 및 소셜 미디어 프로모션',
    overview: '음악의 비트와 가사의 음운 변화를 기하학적 글자 형태의 변형과 카메라 패닝으로 구현한 키네틱 타이포그래피 실험 영상입니다.',
    concept: '소리가 벽에 부딪혀 잔향(Echo)을 남기듯, 문자가 화면 공간에 흔적을 남기며 분열되고 재조합되는 타이포 모션을 탐구했습니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1200&auto=format&fit=crop',
    heroMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-animation-of-sound-waves-and-geometric-shapes-42995-large.mp4',
    heroMediaType: 'video',
    isFeatured: true,
    order: 6,
    process: [
      {
        stepNumber: '01',
        title: 'Variable Font Axis Exploration',
        description: '가변 폰트(Variable Font)의 Weight와 Width 축을 스크립트로 오디오 키프레임과 연동하여 글자 자체가 살아 숨쉬는 유기적 반응을 유도했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      },
      {
        stepNumber: '02',
        title: '3D Camera Tracker & Depth of Field',
        description: '2D 텍스트 레이어를 3D 공간축에 배치하고 빠른 가속도의 카메라 줌인/아웃으로 입체적인 시각 경험을 완성했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      }
    ],
    finalOutputs: [
      {
        title: 'Final Kinetic Typo Motion',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-animation-of-sound-waves-and-geometric-shapes-42995-large.mp4',
        mediaType: 'video',
        caption: '130 BPM 음악 싱크 완료된 최종 25초 마스터'
      }
    ],
    reflection: '텍스트가 단순한 정보를 넘어 그 자체로 시각적 조형물과 음악적 리듬의 매개체가 될 수 있음을 확인했습니다.'
  },
  {
    id: 'proj-7',
    title: 'Typographic Exhibition Poster: OBSIDIAN MONO',
    titleKr: '전시 포스터 디자인: 옵시디언 모노',
    category: 'Poster',
    year: '2024',
    duration: '2 Weeks / Exhibition Series',
    role: 'Graphic Design, Poster Curation, Printing Direction',
    tools: ['Photoshop', 'Illustrator', 'InDesign'],
    clientOrPurpose: '현대 건축 & 조각전 \'OBSIDIAN\' 공식 홍보 포스터',
    overview: '칠흑 같은 흑요석(Obsidian)의 건축적 모놀리스와 무거운 물성을 모티프로, 최소한의 텍스트와 면 분할만으로 강한 중량감을 전하는 미니멀리스트 포스터입니다.',
    concept: '장식을 걷어내고 순수한 비례감과 여백(Negative Space), 그리고 칠흑 같은 딥 블랙(#000000)과 은색 별색의 대비를 통해 건축적 숭고미를 유도했습니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1200&auto=format&fit=crop',
    heroMediaUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1600&auto=format&fit=crop',
    heroMediaType: 'image',
    isFeatured: false,
    order: 7,
    process: [
      {
        stepNumber: '01',
        title: 'Minimalist Layout Composition',
        description: '포스터 하단 1/3 지점에 타이틀을 배치하여 시선의 무게중심을 낮추고, 상단 여백을 극대화하여 갤러리의 정적을 환기했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      }
    ],
    finalOutputs: [
      {
        title: 'Obsidian Mono A1 Poster Mockup',
        url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1200&auto=format&fit=crop',
        mediaType: 'image',
        caption: '프리미엄 무광 종이에 은박 인쇄된 포스터 목업'
      }
    ],
    reflection: '디자인에서 ‘무엇을 더할 것인가’보다 ‘무엇을 비워낼 것인가’가 더 큰 울림을 줄 수 있음을 증명한 프로젝트였습니다.'
  },
  {
    id: 'proj-8',
    title: 'AI Cinema Worldbuilding: NEURAL DRIFT',
    titleKr: 'AI 시네마 월드빌딩 & 비디오: 뉴럴 드리프트',
    category: 'Generative AI Content',
    year: '2025',
    duration: '40s Concept Video Clip',
    role: 'AI Video Prompt Architecture, Camera Direction, Sound Synthesis, After Effects VFX',
    tools: ['Runway Gen-3', 'Midjourney', 'After Effects', 'Premiere Pro'],
    clientOrPurpose: 'SF 단편 영화 컨셉 피칭용 비주얼 무드 티저',
    overview: 'Runway Gen-3를 활용해 일관된 세계관의 시네마틱 카메라 무빙을 생성하고, After Effects에서 홀로그램 UI 오버레이와 입자 노이즈, 사운드 디자인을 통합한 미래 도시 비주얼 영상입니다.',
    concept: '사이버펑크의 클리셰를 넘어 차갑고 고요한 안개 속 미래 거대 도시의 건축적 스케일을 시각화했습니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    heroMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-at-night-with-flying-vehicles-43095-large.mp4',
    heroMediaType: 'video',
    isFeatured: false,
    order: 8,
    process: [
      {
        stepNumber: '01',
        title: 'Runway Camera Control & Seed Locking',
        description: '프롬프트 내에 FPV 드론 시점 및 수평 패닝 속도를 일관되게 제어하여 영상 간의 흔들림 없는 연속성을 확보했습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      },
      {
        stepNumber: '02',
        title: 'After Effects VFX & HUD Overlay',
        description: 'AI 생성 원본 클립 위에 커스텀 HUD 그래픽과 글리치 이펙트를 합성하여 단순 영상을 완성도 높은 SF 티저 시퀀스로 변모시켰습니다.',
        mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'image',
      }
    ],
    finalOutputs: [
      {
        title: 'Neural Drift Concept Reel',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-at-night-with-flying-vehicles-43095-large.mp4',
        mediaType: 'video',
        caption: 'After Effects 그래픽 합성 및 오디오 믹싱 완료 티저'
      }
    ],
    reflection: 'AI 생성 영상이 갖는 특유의 비정형적 불연속성을 후반 모션 그래픽과 사운드 싱크를 통해 영화적인 의도된 연출로 전환시키는 노하우를 정립했습니다.'
  }
];
