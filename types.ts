
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
