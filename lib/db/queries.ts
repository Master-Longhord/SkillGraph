import { runQuery } from './driver';
import {
  DeveloperNode,
  ProjectNode,
  TechnologyNode,
  SkillNode,
  CompanyNode,
  DomainNode,
  SummaryStats,
  GraphNode,
  GraphLink,
} from '../../types';

export async function getSummaryStats(): Promise<SummaryStats> {
  const cypher = `
    MATCH (d:Developer) WITH count(d) AS devs
    MATCH (p:Project) WITH devs, count(p) AS projs
    MATCH (t:Technology) WITH devs, projs, count(t) AS techs
    MATCH (s:Skill) WITH devs, projs, techs, count(s) AS sks
    MATCH (c:Company) WITH devs, projs, techs, sks, count(c) AS comps
    MATCH (dom:Domain) WITH devs, projs, techs, sks, comps, count(dom) AS doms
    MATCH ()-[r]->() WITH devs, projs, techs, sks, comps, doms, count(r) AS rels
    RETURN devs, projs, techs, sks, comps, doms, rels
  `;

  const results = await runQuery<Record<string, number>>(cypher);
  if (!results.length) {
    return {
      developersCount: 0,
      projectsCount: 0,
      technologiesCount: 0,
      skillsCount: 0,
      companiesCount: 0,
      domainsCount: 0,
      totalRelationshipsCount: 0,
    };
  }

  const rec = results[0];
  return {
    developersCount: rec.devs || 0,
    projectsCount: rec.projs || 0,
    technologiesCount: rec.techs || 0,
    skillsCount: rec.sks || 0,
    companiesCount: rec.comps || 0,
    domainsCount: rec.doms || 0,
    totalRelationshipsCount: rec.rels || 0,
  };
}

export async function getDevelopers(): Promise<DeveloperNode[]> {
  const cypher = `
    MATCH (d:Developer)
    RETURN d.id AS id, d.name AS name, d.bio AS bio, d.location AS location, d.avatar AS avatar
    ORDER BY d.name ASC
  `;
  return runQuery<DeveloperNode>(cypher);
}

export async function getDeveloperById(id: string) {
  const cypher = `
    MATCH (d:Developer {id: $id})
    OPTIONAL MATCH (d)-[:HAS_SKILL]->(s:Skill)
    OPTIONAL MATCH (d)-[wo:WORKED_ON]->(p:Project)
    OPTIONAL MATCH (d)-[wa:WORKED_AT]->(c:Company)
    OPTIONAL MATCH (d)-[:WORKED_ON]->(p2:Project)-[:USES]->(t:Technology)
    RETURN d,
           collect(DISTINCT s) AS skills,
           collect(DISTINCT {
             project: p,
             role: wo.role,
             startedAt: wo.startedAt,
             endedAt: wo.endedAt
           }) AS projects,
           collect(DISTINCT {
             company: c,
             role: wa.role,
             startedAt: wa.startedAt,
             endedAt: wa.endedAt
           }) AS companies,
           collect(DISTINCT t) AS connectedTechnologies
  `;

  const results = await runQuery<Record<string, unknown>>(cypher, { id });
  if (!results.length || !results[0].d) return null;

  const rec = results[0];
  return {
    developer: rec.d as DeveloperNode,
    skills: ((rec.skills as unknown[]) || []).filter((s) => s && (s as SkillNode).id) as SkillNode[],
    projects: ((rec.projects as Record<string, unknown>[]) || []).filter((p) => p && p.project && (p.project as ProjectNode).id),
    companies: ((rec.companies as Record<string, unknown>[]) || []).filter((c) => c && c.company && (c.company as CompanyNode).id),
    connectedTechnologies: ((rec.connectedTechnologies as unknown[]) || []).filter((t) => t && (t as TechnologyNode).id) as TechnologyNode[],
  };
}

export async function getSharedSkills(developerId: string) {
  const cypher = `
    MATCH (d:Developer {id: $developerId})-[:HAS_SKILL]->(s:Skill)<-[:HAS_SKILL]-(other:Developer)
    WHERE other.id <> $developerId
    RETURN other AS developer, collect(s) AS sharedSkills, count(s) AS overlapCount
    ORDER BY overlapCount DESC
  `;

  const results = await runQuery<Record<string, unknown>>(cypher, { developerId });
  return results.map((r) => ({
    developer: r.developer as DeveloperNode,
    sharedSkills: r.sharedSkills as SkillNode[],
    overlapCount: r.overlapCount as number,
  }));
}

export async function getProjects(): Promise<ProjectNode[]> {
  const cypher = `
    MATCH (p:Project)
    RETURN p.id AS id, p.name AS name, p.description AS description, p.status AS status, p.year AS year
    ORDER BY p.name ASC
  `;
  return runQuery<ProjectNode>(cypher);
}

export async function getProjectById(id: string) {
  const cypher = `
    MATCH (p:Project {id: $id})
    OPTIONAL MATCH (d:Developer)-[wo:WORKED_ON]->(p)
    OPTIONAL MATCH (p)-[:USES]->(t:Technology)
    OPTIONAL MATCH (p)-[:IN_DOMAIN]->(dom:Domain)
    RETURN p,
           collect(DISTINCT {
             developer: d,
             role: wo.role,
             startedAt: wo.startedAt,
             endedAt: wo.endedAt
           }) AS developers,
           collect(DISTINCT t) AS technologies,
           collect(DISTINCT dom) AS domains
  `;

  const results = await runQuery<Record<string, unknown>>(cypher, { id });
  if (!results.length || !results[0].p) return null;

  const rec = results[0];
  return {
    project: rec.p as ProjectNode,
    developers: ((rec.developers as Record<string, unknown>[]) || []).filter((d) => d && d.developer && (d.developer as DeveloperNode).id),
    technologies: ((rec.technologies as unknown[]) || []).filter((t) => t && (t as TechnologyNode).id) as TechnologyNode[],
    domains: ((rec.domains as unknown[]) || []).filter((dom) => dom && (dom as DomainNode).id) as DomainNode[],
  };
}

export async function getTechnologies(): Promise<TechnologyNode[]> {
  const cypher = `
    MATCH (t:Technology)
    RETURN t.id AS id, t.name AS name, t.category AS category
    ORDER BY t.name ASC
  `;
  return runQuery<TechnologyNode>(cypher);
}

export async function getTechnologyById(id: string) {
  const cypher = `
    MATCH (t:Technology {id: $id})
    OPTIONAL MATCH (p:Project)-[:USES]->(t)
    OPTIONAL MATCH (d:Developer)-[:WORKED_ON]->(p2:Project)-[:USES]->(t)
    OPTIONAL MATCH (t)-[:RELATED_TO*1..2]-(related:Technology) WHERE related.id <> $id
    OPTIONAL MATCH (p)-[:IN_DOMAIN]->(dom:Domain)
    RETURN t,
           collect(DISTINCT p) AS projects,
           collect(DISTINCT d) AS developers,
           collect(DISTINCT related) AS relatedTechnologies,
           collect(DISTINCT dom) AS domains
  `;

  const results = await runQuery<Record<string, unknown>>(cypher, { id });
  if (!results.length || !results[0].t) return null;

  const rec = results[0];
  return {
    technology: rec.t as TechnologyNode,
    projects: ((rec.projects as unknown[]) || []).filter((p) => p && (p as ProjectNode).id) as ProjectNode[],
    developers: ((rec.developers as unknown[]) || []).filter((d) => d && (d as DeveloperNode).id) as DeveloperNode[],
    relatedTechnologies: ((rec.relatedTechnologies as unknown[]) || []).filter((rt) => rt && (rt as TechnologyNode).id) as TechnologyNode[],
    domains: ((rec.domains as unknown[]) || []).filter((dom) => dom && (dom as DomainNode).id) as DomainNode[],
  };
}

export async function getCompanies(): Promise<CompanyNode[]> {
  const cypher = `
    MATCH (c:Company)
    RETURN c.id AS id, c.name AS name, c.industry AS industry
    ORDER BY c.name ASC
  `;
  return runQuery<CompanyNode>(cypher);
}

export async function getCompanyById(id: string) {
  const cypher = `
    MATCH (c:Company {id: $id})
    OPTIONAL MATCH (d:Developer)-[wa:WORKED_AT]->(c)
    RETURN c,
           collect(DISTINCT {
             developer: d,
             role: wa.role,
             startedAt: wa.startedAt,
             endedAt: wa.endedAt
           }) AS developers
  `;

  const results = await runQuery<Record<string, unknown>>(cypher, { id });
  if (!results.length || !results[0].c) return null;

  const rec = results[0];
  return {
    company: rec.c as CompanyNode,
    developers: ((rec.developers as Record<string, unknown>[]) || []).filter((d) => d && d.developer && (d.developer as DeveloperNode).id),
  };
}

export async function getDomains(): Promise<DomainNode[]> {
  const cypher = `
    MATCH (dom:Domain)
    RETURN dom.id AS id, dom.name AS name, dom.description AS description
    ORDER BY dom.name ASC
  `;
  return runQuery<DomainNode>(cypher);
}

export async function getDomainById(id: string) {
  const cypher = `
    MATCH (dom:Domain {id: $id})
    OPTIONAL MATCH (p:Project)-[:IN_DOMAIN]->(dom)
    OPTIONAL MATCH (p)-[:USES]->(t:Technology)
    OPTIONAL MATCH (d:Developer)-[:WORKED_ON]->(p)
    RETURN dom,
           collect(DISTINCT p) AS projects,
           collect(DISTINCT t) AS technologies,
           collect(DISTINCT d) AS developers
  `;

  const results = await runQuery<Record<string, unknown>>(cypher, { id });
  if (!results.length || !results[0].dom) return null;

  const rec = results[0];
  return {
    domain: rec.dom as DomainNode,
    projects: ((rec.projects as unknown[]) || []).filter((p) => p && (p as ProjectNode).id) as ProjectNode[],
    technologies: ((rec.technologies as unknown[]) || []).filter((t) => t && (t as TechnologyNode).id) as TechnologyNode[],
    developers: ((rec.developers as unknown[]) || []).filter((d) => d && (d as DeveloperNode).id) as DeveloperNode[],
  };
}

export async function searchEntities(query: string) {
  if (!query || query.trim().length === 0) return [];

  const cypher = `
    MATCH (n)
    WHERE toLower(n.name) CONTAINS toLower($query)
    RETURN n.id AS id, labels(n)[0] AS label, n.name AS name, n AS properties
    LIMIT 20
  `;

  return runQuery(cypher, { query: query.trim() });
}

export async function getGraphExplorerData(centerId?: string, limit: number = 80) {
  let cypher: string;
  const params: Record<string, unknown> = { limit };

  if (centerId) {
    cypher = `
      MATCH (center {id: $centerId})-[r]-(neighbor)
      RETURN center AS source, labels(center)[0] AS sourceLabel,
             type(r) AS relType, r AS relProps,
             neighbor AS target, labels(neighbor)[0] AS targetLabel
      LIMIT $limit
    `;
    params.centerId = centerId;
  } else {
    cypher = `
      MATCH (source)-[r]->(target)
      RETURN source, labels(source)[0] AS sourceLabel,
             type(r) AS relType, r AS relProps,
             target, labels(target)[0] AS targetLabel
      LIMIT $limit
    `;
  }

  const results = await runQuery<Record<string, unknown>>(cypher, params);

  const nodeMap = new Map<string, GraphNode>();
  const links: GraphLink[] = [];

  results.forEach((row) => {
    const s = row.source as Record<string, unknown>;
    const t = row.target as Record<string, unknown>;

    if (s && s.id && !nodeMap.has(String(s.id))) {
      nodeMap.set(String(s.id), {
        id: String(s.id),
        label: (row.sourceLabel as GraphNode['label']) || 'Developer',
        name: String(s.name || s.id),
        properties: s,
      });
    }

    if (t && t.id && !nodeMap.has(String(t.id))) {
      nodeMap.set(String(t.id), {
        id: String(t.id),
        label: (row.targetLabel as GraphNode['label']) || 'Technology',
        name: String(t.name || t.id),
        properties: t,
      });
    }

    if (s && s.id && t && t.id) {
      links.push({
        source: String(s.id),
        target: String(t.id),
        type: String(row.relType || 'CONNECTED'),
        properties: (row.relProps as Record<string, unknown>) || {},
      });
    }
  });

  return {
    nodes: Array.from(nodeMap.values()),
    links,
  };
}

export async function getShortestPath(sourceId: string, targetId: string) {
  const cypher = `
    MATCH (start {id: $sourceId}), (end {id: $targetId})
    MATCH p = shortestPath((start)-[*]-(end))
    RETURN [n IN nodes(p) | { id: n.id, name: n.name, label: labels(n)[0] }] AS pathNodes,
           [r IN relationships(p) | { type: type(r) }] AS pathRels
  `;

  const results = await runQuery<Record<string, unknown>>(cypher, { sourceId, targetId });
  if (!results.length) return null;

  return {
    nodes: results[0].pathNodes,
    relationships: results[0].pathRels,
  };
}
