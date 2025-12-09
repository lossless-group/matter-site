// src/types/team.ts

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  classifiers: string[] | string;
  image: string;
  bio: string;
  socialLinks: SocialLink[];
  featured?: boolean;
  slug?: string;
}

export interface TeamSectionProps {
  members: TeamMember[];
  className?: string;
}

export type TeamRole =
  | 'Managing Partner'
  | 'Vertical Partner'
  | 'Trustee'
  | 'Advisory Board'
  | 'Founding Principal'
  | 'Active Fellow'
  | 'Philanthropy';

export const TEAM_ROLES: Record<TeamRole, string> = {
  'Managing Partner': 'Managing Partners',
  'Vertical Partner': 'Vertical Partners',
  'Trustee': 'Trustees',
  'Advisory Board': 'Advisory Board',
  'Founding Principal': 'Founding Team',
  'Active Fellow': 'Active Fellows',
  'Philanthropy': 'Philanthropy Team',
} as const;
