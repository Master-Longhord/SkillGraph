import { getDriver, closeDriver } from '../lib/db/driver';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local or .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const developers = [
  { id: 'dev-1', name: 'Alex Rivera', bio: 'Principal Systems Architect specializing in distributed fintech systems and high-throughput transaction pipelines.', location: 'San Francisco, CA', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-2', name: 'Elena Rostova', bio: 'Lead Staff Frontend Engineer passionate about React internals, design systems, and WebGPU performance.', location: 'Berlin, Germany', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-3', name: 'Marcus Chen', bio: 'Senior Infrastructure & Cloud DevOps Engineer focusing on Kubernetes orchestration and zero-trust security.', location: 'Seattle, WA', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-4', name: 'Sarah Jenkins', bio: 'Full-Stack Fintech Engineer with 8+ years building PCI-compliant payment orchestration platforms.', location: 'New York, NY', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-5', name: 'Tariq Al-Mansoor', bio: 'IoT Infrastructure Specialist building smart meter telemetry gateways and green energy dashboards.', location: 'Austin, TX', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-6', name: 'Maya Lin', bio: 'Data Platform Engineer specialized in real-time stream processing with Kafka and Graph Databases.', location: 'Toronto, Canada', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-7', name: 'David Kim', bio: 'Mobile Tech Lead building cross-platform healthcare tele-medicine applications and IoT sync engines.', location: 'Seoul, South Korea', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-8', name: 'Sophia Thorne', bio: 'AI & Document Intelligence Engineer training NLP extractors for enterprise compliance workloads.', location: 'London, UK', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-9', name: 'Carlos Mendez', bio: 'Senior Backend Engineer experienced with Go microservices, gRPC, and high-concurrency databases.', location: 'Madrid, Spain', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-10', name: 'Aisha Patel', bio: 'Security Architect specializing in cryptography, OAuth2 zero-trust vaults, and compliance auditing.', location: 'Chicago, IL', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-11', name: 'Lucas Vance', bio: 'Developer Tooling & Developer Experience Engineer building Next.js SDKs and CLI compilers.', location: 'Amsterdam, Netherlands', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-12', name: 'Amara Okafor', bio: 'Logistics Optimization Specialist writing route-planning graph algorithms for global transport fleets.', location: 'Lagos, Nigeria', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-13', name: 'Vikram Joshi', bio: 'Database Reliability Engineer focusing on PostgreSQL scaling, Redis caching, and graph indexing.', location: 'Bengaluru, India', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-14', name: 'Chloe Dubois', bio: 'E-Commerce UX Lead crafting ultra-fast checkout flows and dynamic recommendation widgets.', location: 'Paris, France', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-15', name: 'Liam O’Connor', bio: 'Telemetry & Observability Engineer building APM platforms and real-time metric aggregators.', location: 'Dublin, Ireland', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
];

const skills = [
  { id: 'skill-1', name: 'Distributed Systems', category: 'Backend Architecture' },
  { id: 'skill-2', name: 'Frontend Architecture', category: 'Web Development' },
  { id: 'skill-3', name: 'Cloud Infrastructure', category: 'DevOps & SRE' },
  { id: 'skill-4', name: 'Database Design', category: 'Data Engineering' },
  { id: 'skill-5', name: 'System Security', category: 'Cybersecurity' },
  { id: 'skill-6', name: 'Real-Time Analytics', category: 'Data Engineering' },
  { id: 'skill-7', name: 'API Engineering', category: 'Backend Architecture' },
  { id: 'skill-8', name: 'DevOps & CI/CD', category: 'DevOps & SRE' },
  { id: 'skill-9', name: 'Machine Learning', category: 'Artificial Intelligence' },
  { id: 'skill-10', name: 'Mobile Development', category: 'Mobile Engineering' },
];

const technologies = [
  { id: 'tech-1', name: 'TypeScript', category: 'Programming Language' },
  { id: 'tech-2', name: 'Go', category: 'Programming Language' },
  { id: 'tech-3', name: 'Python', category: 'Programming Language' },
  { id: 'tech-4', name: 'React', category: 'Frontend Framework' },
  { id: 'tech-5', name: 'Next.js', category: 'Web Framework' },
  { id: 'tech-6', name: 'Node.js', category: 'Runtime Environment' },
  { id: 'tech-7', name: 'PostgreSQL', category: 'Relational Database' },
  { id: 'tech-8', name: 'Redis', category: 'In-Memory Database' },
  { id: 'tech-9', name: 'Docker', category: 'Containerization' },
  { id: 'tech-10', name: 'Kafka', category: 'Event Streaming' },
  { id: 'tech-11', name: 'GraphQL', category: 'API Protocol' },
  { id: 'tech-12', name: 'React Native', category: 'Mobile Framework' },
  { id: 'tech-13', name: 'Tailwind CSS', category: 'Styling' },
  { id: 'tech-14', name: 'Flutter', category: 'Mobile Framework' },
  { id: 'tech-15', name: 'Neo4j / CognoDB', category: 'Graph Database' },
];

const projects = [
  { id: 'proj-1', name: 'Payment Platform', description: 'PCI-compliant global payment routing and multi-currency ledger processing engine.', status: 'Production', year: 2024 },
  { id: 'proj-2', name: 'Solar Monitoring Dashboard', description: 'Real-time telemetry and energy output forecasting dashboard for solar farms.', status: 'Production', year: 2023 },
  { id: 'proj-3', name: 'Smart Meter Management System', description: 'Distributed grid meter management server handling over 10M IoT heartbeat signals.', status: 'Production', year: 2024 },
  { id: 'proj-4', name: 'Travel Booking Platform', description: 'Next-gen travel itinerary aggregator with multi-modal route selection.', status: 'Maintained', year: 2022 },
  { id: 'proj-5', name: 'E-Commerce Platform', description: 'High-concurrency headless store front with instant checkout and personalized recommendations.', status: 'Production', year: 2024 },
  { id: 'proj-6', name: 'Health Scheduling Platform', description: 'HIPAA-compliant telemedicine portal connecting patients with remote medical specialists.', status: 'Production', year: 2023 },
  { id: 'proj-7', name: 'Logistics Management Platform', description: 'Dynamic vehicle dispatch and route optimization service for global freight fleets.', status: 'Active Development', year: 2025 },
  { id: 'proj-8', name: 'Developer Analytics Platform', description: 'Code quality and deployment velocity metric aggregator for engineering leaders.', status: 'Production', year: 2024 },
  { id: 'proj-9', name: 'AI Document Intelligence Suite', description: 'Automated invoice and contract parsing pipeline using transformer models.', status: 'Active Development', year: 2025 },
  { id: 'proj-10', name: 'Distributed File Vault', description: 'End-to-end encrypted distributed object storage system with audit trails.', status: 'Completed', year: 2023 },
];

const companies = [
  { id: 'comp-1', name: 'Stripe', industry: 'Financial Technology' },
  { id: 'comp-2', name: 'Vercel', industry: 'Cloud & Web Infrastructure' },
  { id: 'comp-3', name: 'Datadog', industry: 'Observability & Monitoring' },
  { id: 'comp-4', name: 'Siemens Energy', industry: 'Renewable Energy & IoT' },
  { id: 'comp-5', name: 'Mayo Clinic Digital', industry: 'Healthcare Technology' },
];

const domains = [
  { id: 'dom-1', name: 'Fintech', description: 'Financial technology, payment platforms, ledger systems, and banking APIs.' },
  { id: 'dom-2', name: 'Energy', description: 'Renewable energy systems, smart grid management, and sustainability telemetry.' },
  { id: 'dom-3', name: 'Transportation', description: 'Fleet logistics, transit booking platforms, and route optimization systems.' },
  { id: 'dom-4', name: 'Healthcare', description: 'Digital health platforms, patient scheduling systems, and medical IoT.' },
  { id: 'dom-5', name: 'Developer Tools', description: 'Developer productivity platforms, APMs, code analytics, and cloud infrastructure.' },
];

// Relationships Seed Specifications
const developerSkills = [
  { devId: 'dev-1', skillId: 'skill-1' }, { devId: 'dev-1', skillId: 'skill-4' }, { devId: 'dev-1', skillId: 'skill-7' },
  { devId: 'dev-2', skillId: 'skill-2' }, { devId: 'dev-2', skillId: 'skill-7' },
  { devId: 'dev-3', skillId: 'skill-3' }, { devId: 'dev-3', skillId: 'skill-8' }, { devId: 'dev-3', skillId: 'skill-5' },
  { devId: 'dev-4', skillId: 'skill-1' }, { devId: 'dev-4', skillId: 'skill-7' }, { devId: 'dev-4', skillId: 'skill-5' },
  { devId: 'dev-5', skillId: 'skill-6' }, { devId: 'dev-5', skillId: 'skill-3' },
  { devId: 'dev-6', skillId: 'skill-6' }, { devId: 'dev-6', skillId: 'skill-4' }, { devId: 'dev-6', skillId: 'skill-1' },
  { devId: 'dev-7', skillId: 'skill-10' }, { devId: 'dev-7', skillId: 'skill-7' },
  { devId: 'dev-8', skillId: 'skill-9' }, { devId: 'dev-8', skillId: 'skill-4' },
  { devId: 'dev-9', skillId: 'skill-1' }, { devId: 'dev-9', skillId: 'skill-7' }, { devId: 'dev-9', skillId: 'skill-8' },
  { devId: 'dev-10', skillId: 'skill-5' }, { devId: 'dev-10', skillId: 'skill-3' },
  { devId: 'dev-11', skillId: 'skill-2' }, { devId: 'dev-11', skillId: 'skill-7' },
  { devId: 'dev-12', skillId: 'skill-1' }, { devId: 'dev-12', skillId: 'skill-6' },
  { devId: 'dev-13', skillId: 'skill-4' }, { devId: 'dev-13', skillId: 'skill-6' },
  { devId: 'dev-14', skillId: 'skill-2' }, { devId: 'dev-14', skillId: 'skill-7' },
  { devId: 'dev-15', skillId: 'skill-3' }, { devId: 'dev-15', skillId: 'skill-6' }, { devId: 'dev-15', skillId: 'skill-8' },
];

const developerProjects = [
  { devId: 'dev-1', projId: 'proj-1', role: 'Principal Architect', startedAt: '2023-01', endedAt: 'Present' },
  { devId: 'dev-4', projId: 'proj-1', role: 'Senior Payments Engineer', startedAt: '2023-03', endedAt: 'Present' },
  { devId: 'dev-9', projId: 'proj-1', role: 'Go Backend Lead', startedAt: '2023-05', endedAt: '2024-06' },
  
  { devId: 'dev-2', projId: 'proj-2', role: 'Frontend Lead', startedAt: '2022-08', endedAt: '2023-11' },
  { devId: 'dev-5', projId: 'proj-2', role: 'IoT Integration Engineer', startedAt: '2022-09', endedAt: 'Present' },

  { devId: 'dev-5', projId: 'proj-3', role: 'Staff Systems Engineer', startedAt: '2023-02', endedAt: 'Present' },
  { devId: 'dev-3', projId: 'proj-3', role: 'DevOps Architect', startedAt: '2023-04', endedAt: '2024-02' },

  { devId: 'dev-14', projId: 'proj-4', role: 'UX Tech Lead', startedAt: '2022-01', endedAt: '2023-03' },
  { devId: 'dev-11', projId: 'proj-4', role: 'Full Stack Engineer', startedAt: '2022-03', endedAt: '2022-12' },

  { devId: 'dev-14', projId: 'proj-5', role: 'Lead Storefront Architect', startedAt: '2023-06', endedAt: 'Present' },
  { devId: 'dev-2', projId: 'proj-5', role: 'Design System Consultant', startedAt: '2023-10', endedAt: '2024-02' },

  { devId: 'dev-7', projId: 'proj-6', role: 'Mobile Engineering Lead', startedAt: '2022-11', endedAt: 'Present' },
  { devId: 'dev-10', projId: 'proj-6', role: 'Compliance & Security Lead', startedAt: '2023-01', endedAt: 'Present' },

  { devId: 'dev-12', projId: 'proj-7', role: 'Logistics Optimization Specialist', startedAt: '2024-01', endedAt: 'Present' },
  { devId: 'dev-6', projId: 'proj-7', role: 'Stream Processing Lead', startedAt: '2024-02', endedAt: 'Present' },

  { devId: 'dev-15', projId: 'proj-8', role: 'Observability Architect', startedAt: '2023-04', endedAt: 'Present' },
  { devId: 'dev-11', projId: 'proj-8', role: 'Frontend Platform Engineer', startedAt: '2023-07', endedAt: 'Present' },

  { devId: 'dev-8', projId: 'proj-9', role: 'NLP Tech Lead', startedAt: '2024-03', endedAt: 'Present' },
  { devId: 'dev-6', projId: 'proj-9', role: 'Data Pipeline Specialist', startedAt: '2024-05', endedAt: 'Present' },

  { devId: 'dev-10', projId: 'proj-10', role: 'Security Architect', startedAt: '2022-05', endedAt: '2023-10' },
  { devId: 'dev-13', projId: 'proj-10', role: 'Database Infrastructure Lead', startedAt: '2022-06', endedAt: '2023-09' },
];

const developerCompanies = [
  { devId: 'dev-1', compId: 'comp-1', role: 'Principal Architect', startedAt: '2021', endedAt: 'Present' },
  { devId: 'dev-4', compId: 'comp-1', role: 'Senior Software Engineer', startedAt: '2020', endedAt: 'Present' },
  { devId: 'dev-2', compId: 'comp-2', role: 'Staff Frontend Engineer', startedAt: '2022', endedAt: 'Present' },
  { devId: 'dev-11', compId: 'comp-2', role: 'Senior Developer Advocate', startedAt: '2021', endedAt: '2023' },
  { devId: 'dev-15', compId: 'comp-3', role: 'Lead Telemetry Engineer', startedAt: '2022', endedAt: 'Present' },
  { devId: 'dev-3', compId: 'comp-3', role: 'Senior SRE', startedAt: '2019', endedAt: '2022' },
  { devId: 'dev-5', compId: 'comp-4', role: 'IoT Systems Architect', startedAt: '2021', endedAt: 'Present' },
  { devId: 'dev-7', compId: 'comp-5', role: 'Director of Mobile Health', startedAt: '2020', endedAt: 'Present' },
];

const projectTechnologies = [
  { projId: 'proj-1', techId: 'tech-2' }, { projId: 'proj-1', techId: 'tech-7' }, { projId: 'proj-1', techId: 'tech-8' }, { projId: 'proj-1', techId: 'tech-10' },
  { projId: 'proj-2', techId: 'tech-4' }, { projId: 'proj-2', techId: 'tech-1' }, { projId: 'proj-2', techId: 'tech-10' },
  { projId: 'proj-3', techId: 'tech-2' }, { projId: 'proj-3', techId: 'tech-9' }, { projId: 'proj-3', techId: 'tech-10' }, { projId: 'proj-3', techId: 'tech-15' },
  { projId: 'proj-4', techId: 'tech-5' }, { projId: 'proj-4', techId: 'tech-1' }, { projId: 'proj-4', techId: 'tech-11' },
  { projId: 'proj-5', techId: 'tech-5' }, { projId: 'proj-5', techId: 'tech-4' }, { projId: 'proj-5', techId: 'tech-13' }, { projId: 'proj-5', techId: 'tech-8' },
  { projId: 'proj-6', techId: 'tech-12' }, { projId: 'proj-6', techId: 'tech-6' }, { projId: 'proj-6', techId: 'tech-7' },
  { projId: 'proj-7', techId: 'tech-2' }, { projId: 'proj-7', techId: 'tech-10' }, { projId: 'proj-7', techId: 'tech-7' }, { projId: 'proj-7', techId: 'tech-15' },
  { projId: 'proj-8', techId: 'tech-5' }, { projId: 'proj-8', techId: 'tech-1' }, { projId: 'proj-8', techId: 'tech-6' }, { projId: 'proj-8', techId: 'tech-15' },
  { projId: 'proj-9', techId: 'tech-3' }, { projId: 'proj-9', techId: 'tech-9' }, { projId: 'proj-9', techId: 'tech-7' },
  { projId: 'proj-10', techId: 'tech-2' }, { projId: 'proj-10', techId: 'tech-9' }, { projId: 'proj-10', techId: 'tech-8' },
];

const projectDomains = [
  { projId: 'proj-1', domId: 'dom-1' },
  { projId: 'proj-2', domId: 'dom-2' },
  { projId: 'proj-3', domId: 'dom-2' },
  { projId: 'proj-4', domId: 'dom-3' },
  { projId: 'proj-5', domId: 'dom-1' },
  { projId: 'proj-6', domId: 'dom-4' },
  { projId: 'proj-7', domId: 'dom-3' },
  { projId: 'proj-8', domId: 'dom-5' },
  { projId: 'proj-9', domId: 'dom-5' },
  { projId: 'proj-10', domId: 'dom-5' },
];

const technologyRelationships = [
  { tech1: 'tech-1', tech2: 'tech-4' }, // TypeScript -> React
  { tech1: 'tech-4', tech2: 'tech-5' }, // React -> Next.js
  { tech1: 'tech-5', tech2: 'tech-13' }, // Next.js -> Tailwind CSS
  { tech1: 'tech-1', tech2: 'tech-6' }, // TypeScript -> Node.js
  { tech1: 'tech-6', tech2: 'tech-11' }, // Node.js -> GraphQL
  { tech1: 'tech-2', tech2: 'tech-9' }, // Go -> Docker
  { tech1: 'tech-9', tech2: 'tech-10' }, // Docker -> Kafka
  { tech1: 'tech-7', tech2: 'tech-8' }, // PostgreSQL -> Redis
  { tech1: 'tech-10', tech2: 'tech-15' }, // Kafka -> CognoDB
  { tech1: 'tech-4', tech2: 'tech-12' }, // React -> React Native
  { tech1: 'tech-3', tech2: 'tech-9' }, // Python -> Docker
];

async function seedDatabase() {
  console.log('🚀 Starting CognoDB Database Seeding...');
  const driver = getDriver();
  const session = driver.session();

  try {
    console.log('🧹 Clearing existing database graph data...');
    await session.run('MATCH (n) DETACH DELETE n');

    console.log('📦 Seeding Developers...');
    await session.run(
      `UNWIND $developers AS dev
       CREATE (d:Developer {
         id: dev.id,
         name: dev.name,
         bio: dev.bio,
         location: dev.location,
         avatar: dev.avatar
       })`,
      { developers }
    );

    console.log('🧠 Seeding Skills...');
    await session.run(
      `UNWIND $skills AS skill
       CREATE (s:Skill {
         id: skill.id,
         name: skill.name,
         category: skill.category
       })`,
      { skills }
    );

    console.log('🛠️ Seeding Technologies...');
    await session.run(
      `UNWIND $technologies AS tech
       CREATE (t:Technology {
         id: tech.id,
         name: tech.name,
         category: tech.category
       })`,
      { technologies }
    );

    console.log('🚀 Seeding Projects...');
    await session.run(
      `UNWIND $projects AS proj
       CREATE (p:Project {
         id: proj.id,
         name: proj.name,
         description: proj.description,
         status: proj.status,
         year: proj.year
       })`,
      { projects }
    );

    console.log('🏢 Seeding Companies...');
    await session.run(
      `UNWIND $companies AS comp
       CREATE (c:Company {
         id: comp.id,
         name: comp.name,
         industry: comp.industry
       })`,
      { companies }
    );

    console.log('🌐 Seeding Domains...');
    await session.run(
      `UNWIND $domains AS dom
       CREATE (d:Domain {
         id: dom.id,
         name: dom.name,
         description: dom.description
       })`,
      { domains }
    );

    console.log('🔗 Creating HAS_SKILL relationships...');
    await session.run(
      `UNWIND $developerSkills AS rel
       MATCH (d:Developer {id: rel.devId}), (s:Skill {id: rel.skillId})
       CREATE (d)-[:HAS_SKILL]->(s)`,
      { developerSkills }
    );

    console.log('🔗 Creating WORKED_ON relationships...');
    await session.run(
      `UNWIND $developerProjects AS rel
       MATCH (d:Developer {id: rel.devId}), (p:Project {id: rel.projId})
       CREATE (d)-[:WORKED_ON {
         role: rel.role,
         startedAt: rel.startedAt,
         endedAt: rel.endedAt
       }]->(p)`,
      { developerProjects }
    );

    console.log('🔗 Creating WORKED_AT relationships...');
    await session.run(
      `UNWIND $developerCompanies AS rel
       MATCH (d:Developer {id: rel.devId}), (c:Company {id: rel.compId})
       CREATE (d)-[:WORKED_AT {
         role: rel.role,
         startedAt: rel.startedAt,
         endedAt: rel.endedAt
       }]->(c)`,
      { developerCompanies }
    );

    console.log('🔗 Creating USES relationships...');
    await session.run(
      `UNWIND $projectTechnologies AS rel
       MATCH (p:Project {id: rel.projId}), (t:Technology {id: rel.techId})
       CREATE (p)-[:USES]->(t)`,
      { projectTechnologies }
    );

    console.log('🔗 Creating IN_DOMAIN relationships...');
    await session.run(
      `UNWIND $projectDomains AS rel
       MATCH (p:Project {id: rel.projId}), (d:Domain {id: rel.domId})
       CREATE (p)-[:IN_DOMAIN]->(d)`,
      { projectDomains }
    );

    console.log('🔗 Creating RELATED_TO relationships...');
    await session.run(
      `UNWIND $technologyRelationships AS rel
       MATCH (t1:Technology {id: rel.tech1}), (t2:Technology {id: rel.tech2})
       CREATE (t1)-[:RELATED_TO]->(t2)`,
      { technologyRelationships }
    );

    // Verify Counts
    const countsResult = await session.run(`
      MATCH (d:Developer) WITH count(d) AS devs
      MATCH (p:Project) WITH devs, count(p) AS projs
      MATCH (t:Technology) WITH devs, projs, count(t) AS techs
      MATCH (s:Skill) WITH devs, projs, techs, count(s) AS sks
      MATCH (c:Company) WITH devs, projs, techs, sks, count(c) AS comps
      MATCH (dom:Domain) WITH devs, projs, techs, sks, comps, count(dom) AS doms
      MATCH ()-[r]->() WITH devs, projs, techs, sks, comps, doms, count(r) AS rels
      RETURN devs, projs, techs, sks, comps, doms, rels
    `);

    const rec = countsResult.records[0];
    console.log('✅ Seeding Complete! Summary Stats:');
    console.log(` - Developers: ${rec.get('devs')}`);
    console.log(` - Projects: ${rec.get('projs')}`);
    console.log(` - Technologies: ${rec.get('techs')}`);
    console.log(` - Skills: ${rec.get('sks')}`);
    console.log(` - Companies: ${rec.get('comps')}`);
    console.log(` - Domains: ${rec.get('doms')}`);
    console.log(` - Total Relationships: ${rec.get('rels')}`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await session.close();
    await closeDriver();
  }
}

seedDatabase();
