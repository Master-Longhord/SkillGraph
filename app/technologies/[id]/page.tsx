'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Cpu,
  Briefcase,
  Users,
  GitFork,
  ArrowLeft,
  Compass,
  Globe,
} from 'lucide-react';
import ErrorBanner from '@/components/ErrorBanner';
import { CardSkeleton } from '@/components/LoadingSkeleton';

export default function TechnologyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTechDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/technologies/${id}`);
      const json = await res.json();
      if (json.status === 'success') {
        setData(json.data);
      } else {
        setError(json.message || 'Technology not found');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="h-6 w-32 bg-[#e7e2d9] rounded animate-pulse" />
        <CardSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Link href="/technologies" className="inline-flex items-center gap-1 text-sm text-[#57534e] hover:text-[#171717]">
          <ArrowLeft className="w-4 h-4" /> Back to Technologies
        </Link>
        <ErrorBanner title="Technology Error" message={error || 'Could not load technology.'} onRetry={fetchTechDetails} />
      </div>
    );
  }

  const { technology, projects, developers, relatedTechnologies, domains } = data;

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-16">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-[#e7e2d9] pb-4">
        <Link
          href="/technologies"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#57534e] hover:text-[#171717] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Technologies</span>
        </Link>

        <Link
          href={`/explorer?centerId=${technology.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Inspect Node in Explorer</span>
        </Link>
      </div>

      {/* Technology Profile Header */}
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-stone-100 border border-stone-300 text-xs font-mono font-bold text-[#171717]">
            <Cpu className="w-3.5 h-3.5 text-red-600" />
            {technology.category}
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#171717] tracking-tight">{technology.name}</h1>
        </div>

        {/* Connected Domains */}
        {domains && domains.length > 0 && (
          <div className="pt-3 border-t border-[#e7e2d9] flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold text-[#78716c] uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-red-600" /> Industry Domains:
            </span>
            {domains.map((dom: any) => (
              <Link
                key={dom.id}
                href={`/domains/${dom.id}`}
                className="px-3 py-1 rounded bg-[#f7f4ee] text-[#171717] border border-[#d6d3d1] text-xs font-medium hover:border-[#171717] transition-colors"
              >
                {dom.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 1..2 Hop Related Ecosystem */}
      <section className="border-t border-[#171717] pt-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#e7e2d9] pb-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-100 border border-stone-300 text-[11px] font-mono font-semibold text-[#171717]">
              <GitFork className="w-3.5 h-3.5 text-red-600" />
              Graph Traversal: 1..2 Hop Ecosystem
            </div>
            <h2 className="text-xl font-serif font-bold text-[#171717]">
              Technologies Within 2 Relationship Hops
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono text-[#78716c]">
            Tech &rarr; RELATED_TO*1..2 &rarr; Tech
          </span>
        </div>
        <p className="text-xs text-[#57534e] leading-relaxed">
          Complementary stack tools and frameworks connected via openCypher variable path matching.
        </p>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {relatedTechnologies.length === 0 ? (
            <span className="text-xs text-[#78716c]">No 1..2 hop related technologies found.</span>
          ) : (
            relatedTechnologies.map((rt: any) => (
              <Link
                key={rt.id}
                href={`/technologies/${rt.id}`}
                className="px-3.5 py-1.5 rounded bg-white hover:bg-[#f7f4ee] text-[#171717] border border-[#171717] text-xs font-medium transition-colors flex items-center gap-2"
              >
                <span>{rt.name}</span>
                <span className="text-[10px] text-[#78716c]">({rt.category})</span>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Projects & Connected Developers */}
      <section className="border-t border-[#171717] pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Projects utilizing this tech */}
        <div className="space-y-4">
          <h2 className="text-lg font-serif font-bold text-[#171717] flex items-center gap-2 border-b border-[#e7e2d9] pb-2">
            <Briefcase className="w-4 h-4 text-red-600" />
            Projects Utilizing {technology.name}
          </h2>
          <div className="space-y-4 divide-y divide-[#e7e2d9]">
            {projects.length === 0 ? (
              <p className="text-xs text-[#78716c]">No active projects recorded using this technology.</p>
            ) : (
              projects.map((p: any) => (
                <div key={p.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <Link href={`/projects/${p.id}`} className="text-sm font-bold text-[#171717] hover:text-red-600 transition-colors">
                      {p.name}
                    </Link>
                    <span className="text-[10px] font-mono text-[#78716c]">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#57534e] line-clamp-2 pt-0.5">{p.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Connected Engineers */}
        <div className="space-y-4">
          <h2 className="text-lg font-serif font-bold text-[#171717] flex items-center gap-2 border-b border-[#e7e2d9] pb-2">
            <Users className="w-4 h-4 text-[#78716c]" />
            Engineers Connected via Projects
          </h2>
          <div className="space-y-3">
            {developers.length === 0 ? (
              <p className="text-xs text-[#78716c]">No developers directly connected via projects.</p>
            ) : (
              developers.map((d: any) => (
                <div key={d.id} className="p-3 rounded bg-white border border-[#171717] flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#171717] bg-[#f7f4ee] shrink-0">
                    <Image src={d.avatar} alt={d.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/developers/${d.id}`} className="text-sm font-bold text-[#171717] hover:text-red-600 transition-colors truncate block">
                      {d.name}
                    </Link>
                    <div className="text-xs text-[#57534e]">{d.location}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
