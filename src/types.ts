export type Language = 'en' | 'np';
export type Theme = 'dark' | 'light';

export interface ProjectItem {
  id: string;
  titleKey: string;
  categoryKey: string;
  statusKey: string;
  descriptionKey: string;
  fullDetailsKey: string;
  learningsKey: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  accentColor: string;
  badge?: string;
}

export interface TimelineItem {
  id: string;
  roleKey: string;
  organizationKey: string;
  periodKey: string;
  typeKey: string;
  descriptionKey: string;
  highlightsKey: string[];
  icon: 'school' | 'teaching' | 'leadership' | 'code';
}

export interface SkillItem {
  name: string;
  level: string; // e.g. "Active Exploration", "Practical Learning", "Core Foundation"
  icon: string;
  category: 'code' | 'ai' | 'thinking' | 'communication';
  descriptionKey: string;
}
