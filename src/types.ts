export type Category = 
  | 'All'
  | 'Poster'
  | '2D Motion Graphics'
  | '3D Motion Graphics'
  | 'Video Editing'
  | 'Generative AI Content';

export type ActiveTab = 'home' | 'work' | 'about' | 'resume' | 'contact' | 'admin';

export interface ProcessItem {
  stepNumber: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
}

export interface BeforeAfterComparison {
  beforeTitle: string;
  beforeUrl: string;
  afterTitle: string;
  afterUrl: string;
  description: string;
}

export interface ProjectMedia {
  title: string;
  url: string;
  mediaType: 'image' | 'video';
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  titleKr: string;
  category: 'Poster' | '2D Motion Graphics' | '3D Motion Graphics' | 'Video Editing' | 'Generative AI Content';
  year: string;
  duration?: string;
  role: string;
  tools: string[];
  clientOrPurpose: string;
  overview: string;
  concept: string;
  process: ProcessItem[];
  beforeAfter?: BeforeAfterComparison;
  finalOutputs: ProjectMedia[];
  reflection: string;
  thumbnailUrl: string;
  heroMediaUrl: string;
  heroMediaType: 'image' | 'video';
  isFeatured: boolean;
  order: number;
}

export interface WhatIDoItem {
  id: string;
  title: string;
  titleKr: string;
  desc: string;
}

export interface SkillCategoryItem {
  id: string;
  name: string;
  tools: string[];
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  place: string;
  desc: string;
}

export interface AwardItem {
  id: string;
  year: string;
  title: string;
  org: string;
}

export interface DesignerProfile {
  nameEn: string;
  nameKr: string;
  roleTitleEn: string;
  roleTitleKr: string;
  status: string;
  oneLineBioKr: string;
  oneLineBioEn: string;
  headlineKr?: string;
  headlineEn?: string;
  aboutHeadingKr?: string;
  aboutHeadingEn?: string;
  detailedBioKr: string;
  detailedBioEn?: string;
  specialty?: string;
  education?: string;
  targetRole?: string;
  email: string;
  location: string;
  phone: string;
  behance: string;
  vimeo?: string;
  youtube: string;
  instagram: string;
  github?: string;
  whatIDo?: WhatIDoItem[];
  skillCategories?: SkillCategoryItem[];
  experiences?: ExperienceItem[];
  awards?: AwardItem[];
}
