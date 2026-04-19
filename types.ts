
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
}

export interface SocialLinkItem {
  name: string;
  url: string;
  icon: LucideIcon;
  username?: string;
}

export interface StatItem {
  label: string;
  value: string;
  description: string;
  /** Optional layout for the main stat line (e.g. multi-segment markets row) */
  variant?: 'default' | 'markets';
}

export interface SkillData {
  subject: string;
  A: number;
  fullMark: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  imageUrl: string;
  category: string;
}
