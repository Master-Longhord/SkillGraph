'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Calendar, ArrowRight, Search } from 'lucide-react';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import ErrorBanner from '@/components/ErrorBanner';
import EmptyState from '@/components/EmptyState';
import { ProjectNode } from '@/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/projects');
      const json = await res.json();
      if (json.status === 'success') {
        setProjects(json.data || []);
      } else {
        setError(json.message || 'Failed to load projects');
      }
    } catch (err: any) {
      setError(err.message || 'Database connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.description.toLowerCase().includes(filter.toLowerCase()) ||
      p.status.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#171717] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#78716c] uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5 text-red-600" />
            Software &amp; Infrastructure Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#171717] tracking-tight mt-1">
            Projects Catalog
          </h1>
          <p className="text-sm text-[#57534e] mt-1 max-w-xl">
            Explore production applications, stack technologies used, engineering team contributors, and domain mappings.
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716c]" />
          <input
            type="text"
            placeholder="Filter projects..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-white border border-[#d6d3d1] rounded text-[#171717] placeholder-[#78716c] focus:outline-none focus:border-[#171717] w-full sm:w-64"
          />
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={fetchProjects} />}

      {loading ? (
        <GridSkeleton count={6} />
      ) : filteredProjects.length === 0 ? (
        <EmptyState title="No Projects Found" description="Try adjusting your filter search term." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-[#171717] rounded p-6 flex flex-col justify-between hover:border-red-600 transition-colors group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-bold text-[#171717] group-hover:text-red-600 transition-colors">
                    {proj.name}
                  </h2>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border bg-stone-100 text-[#171717] border-stone-300 shrink-0">
                    {proj.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-[#78716c]">
                  <Calendar className="w-3.5 h-3.5 text-[#78716c]" />
                  <span>Est. {proj.year}</span>
                </div>

                <p className="text-xs text-[#57534e] line-clamp-3 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#e7e2d9]">
                <Link
                  href={`/projects/${proj.id}`}
                  className="inline-flex items-center justify-between w-full text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  <span>Inspect Stack &amp; Team</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
