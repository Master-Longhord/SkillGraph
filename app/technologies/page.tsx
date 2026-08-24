'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cpu, ArrowRight, Search } from 'lucide-react';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import ErrorBanner from '@/components/ErrorBanner';
import EmptyState from '@/components/EmptyState';
import { TechnologyNode } from '@/types';

export default function TechnologiesPage() {
  const [technologies, setTechnologies] = useState<TechnologyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const fetchTechnologies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/technologies');
      const json = await res.json();
      if (json.status === 'success') {
        setTechnologies(json.data || []);
      } else {
        setError(json.message || 'Failed to load technologies');
      }
    } catch (err: any) {
      setError(err.message || 'Database connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const filteredTechnologies = technologies.filter(
    (t) =>
      t.name.toLowerCase().includes(filter.toLowerCase()) ||
      t.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#171717] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#78716c] uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-red-600" />
            Technology Stack Index
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#171717] tracking-tight mt-1">
            Technologies Catalog
          </h1>
          <p className="text-sm text-[#57534e] mt-1 max-w-xl">
            Explore languages, frameworks, databases, and multi-hop relationship trees (`[:RELATED_TO*1..2]`).
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716c]" />
          <input
            type="text"
            placeholder="Filter technologies..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-white border border-[#d6d3d1] rounded text-[#171717] placeholder-[#78716c] focus:outline-none focus:border-[#171717] w-full sm:w-64"
          />
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={fetchTechnologies} />}

      {loading ? (
        <GridSkeleton count={6} />
      ) : filteredTechnologies.length === 0 ? (
        <EmptyState title="No Technologies Found" description="Try clearing your search filter." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechnologies.map((tech) => (
            <div
              key={tech.id}
              className="bg-white border border-[#171717] rounded p-6 flex flex-col justify-between hover:border-red-600 transition-colors group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-bold text-[#171717] group-hover:text-red-600 transition-colors">
                    {tech.name}
                  </h2>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded border bg-[#f7f4ee] text-[#171717] border-[#d6d3d1]">
                    {tech.category}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#e7e2d9]">
                <Link
                  href={`/technologies/${tech.id}`}
                  className="inline-flex items-center justify-between w-full text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  <span>Explore Relationships</span>
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
