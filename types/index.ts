export interface DeveloperNode {
  id: string;
  name: string;
  bio: string;
  location: string;
  avatar: string;
}

export interface SkillNode {
  id: string;
  name: string;
  category: string;
}

export interface ProjectNode {
  id: string;
  name: string;
  description: string;
  status: 'Production' | 'Active Development' | 'Maintained' | 'Completed';
  year: number;
}

export interface TechnologyNode {
  id: string;
  name: string;
  category: string;
}

export interface CompanyNode {
  id: string;
  name: string;
  industry: string;
}

export interface DomainNode {
  id: string;
  name: string;
  description: string;
}

export interface GraphNode {
  id: string;
  label: 'Developer' | 'Skill' | 'Project' | 'Technology' | 'Company' | 'Domain';
  name: string;
  properties: Record<string, unknown>;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
  properties?: Record<string, unknown>;
}

export interface SummaryStats {
  developersCount: number;
  projectsCount: number;
  technologiesCount: number;
  skillsCount: number;
  companiesCount: number;
  domainsCount: number;
  totalRelationshipsCount: number;
}
