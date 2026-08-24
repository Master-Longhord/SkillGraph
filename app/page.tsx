'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  GitFork,
  Network,
  Users,
} from 'lucide-react';
import ErrorBanner from '@/components/ErrorBanner';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stats');
      const json = await res.json();
      if (json.status === 'success') {
        setStats(json.data);
      } else {
        setError(json.message || 'Failed to fetch graph statistics');
      }
    } catch (err: any) {
      setError(err.message || 'Could not connect to CognoDB');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statItems = [
    { label: 'Developers', count: stats?.developersCount ?? '—', href: '/developers' },
    { label: 'Projects', count: stats?.projectsCount ?? '—', href: '/projects' },
    { label: 'Technologies', count: stats?.technologiesCount ?? '—', href: '/technologies' },
    { label: 'Skills', count: stats?.skillsCount ?? '—', href: '/developers' },
    { label: 'Companies', count: stats?.companiesCount ?? '—', href: '/companies' },
    { label: 'Domains', count: stats?.domainsCount ?? '—', href: '/domains' },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Editorial Hero Banner */}
      <section className="border-b border-[#171717] pb-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-stone-200/60 border border-[#171717] text-[#171717] text-xs font-mono font-medium">
          <Network className="w-3.5 h-3.5 text-red-600" />
          <span>openCypher Graph Engine &bull; CognoDB</span>
        </div>
        
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#171717] tracking-tight leading-tight">
            SkillGraph: Developer &amp; Technology Relationship Engine
          </h1>
          <p className="text-base sm:text-lg text-[#57534e] leading-relaxed">
            SkillGraph models developers, skills, projects, technologies, companies, and domains as an interconnected graph network. Traverse multi-hop paths to uncover real-world technical expertise, peer overlaps, and technology ecosystems impossible in traditional relational databases.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <Link
            href="/explorer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            <Compass className="w-4 h-4" />
            Explore the Graph
          </Link>
          <Link
            href="/developers"
            className="inline-flex items-center gap-2 px-6 py-3 rounded bg-white hover:bg-[#f7f4ee] text-[#171717] border border-[#171717] font-semibold text-sm transition-colors"
          >
            <Users className="w-4 h-4 text-[#78716c]" />
            Developer Directory
          </Link>
        </div>
      </section>

      {/* Error State */}
      {error && <ErrorBanner message={error} onRetry={fetchStats} />}

      {/* Integrated Statistics Bar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#e7e2d9] pb-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#78716c]">
            Graph Scale &amp; Topology Overview
          </h2>
          {stats && (
            <span className="text-xs font-mono text-[#57534e]">
              Total Graph Edges: <strong className="text-[#171717]">{stats.totalRelationshipsCount}</strong>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#e7e2d9] bg-white border border-[#171717] rounded">
          {statItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="p-5 flex flex-col justify-between hover:bg-[#fbf9f5] transition-colors group"
            >
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[#171717] group-hover:text-red-600 transition-colors">
                {loading ? '—' : item.count}
              </div>
              <div className="text-xs font-mono font-medium text-[#57534e] uppercase tracking-wider mt-2">
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Graph Traversals */}
      <section className="space-y-6 pt-4">
        <div className="border-b border-[#171717] pb-3 flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-[#171717] flex items-center gap-2">
            <GitFork className="w-5 h-5 text-red-600" />
            Key Graph Traversals
          </h2>
          <span className="text-xs font-mono text-[#78716c]">3 P0 Core Traversal Patterns</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white border border-[#171717] rounded p-6 space-y-4 flex flex-col justify-between hover:border-red-600 transition-colors">
            <div className="space-y-3">
              <span className="inline-block px-2.5 py-0.5 rounded bg-stone-100 border border-stone-300 text-xs font-mono text-[#171717]">
                3-Hop Multi-Match
              </span>
              <h3 className="text-base font-bold text-[#171717] leading-snug">
                Developer &rarr; Project &rarr; Technology &rarr; Domain
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Traverse from a developer to worked-on projects, extract production technologies used, and map domain impact in a single openCypher query.
              </p>
            </div>
            <Link
              href="/developers/dev-1"
              className="inline-flex items-center justify-between text-xs font-semibold text-red-600 hover:text-red-700 pt-3 border-t border-[#e7e2d9]"
            >
              <span>View Alex Rivera Path</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-[#171717] rounded p-6 space-y-4 flex flex-col justify-between hover:border-red-600 transition-colors">
            <div className="space-y-3">
              <span className="inline-block px-2.5 py-0.5 rounded bg-stone-100 border border-stone-300 text-xs font-mono text-[#171717]">
                Symmetric Peer Match
              </span>
              <h3 className="text-base font-bold text-[#171717] leading-snug">
                Developer &rarr; Skill &larr; Skill &larr; Developer
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Identify peer engineers with matching skill sets by traversing shared skill nodes without expensive multi-table SQL JOINs.
              </p>
            </div>
            <Link
              href="/developers/dev-4"
              className="inline-flex items-center justify-between text-xs font-semibold text-red-600 hover:text-red-700 pt-3 border-t border-[#e7e2d9]"
            >
              <span>View Sarah Jenkins Shared Skills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-[#171717] rounded p-6 space-y-4 flex flex-col justify-between hover:border-red-600 transition-colors">
            <div className="space-y-3">
              <span className="inline-block px-2.5 py-0.5 rounded bg-stone-100 border border-stone-300 text-xs font-mono text-[#171717]">
                Variable Path Traversal
              </span>
              <h3 className="text-base font-bold text-[#171717] leading-snug">
                Technology &rarr; RELATED_TO*1..2 &rarr; Tech
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Discover complementary frameworks and runtime environments within 1 to 2 relationship hops of any technology stack.
              </p>
            </div>
            <Link
              href="/technologies/tech-5"
              className="inline-flex items-center justify-between text-xs font-semibold text-red-600 hover:text-red-700 pt-3 border-t border-[#e7e2d9]"
            >
              <span>View Next.js Tech Tree</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
