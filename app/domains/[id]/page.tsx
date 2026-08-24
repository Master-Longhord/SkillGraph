'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, Briefcase, Cpu, ArrowLeft, Compass, GitFork } from 'lucide-react';
import ErrorBanner from '@/components/ErrorBanner';
import { CardSkeleton } from '@/components/LoadingSkeleton';

export default function DomainDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDomainDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/domains/${id}`);
      const json = await res.json();
      if (json.status === 'success') {
        setData(json.data);
      } else {
        setError(json.message || 'Domain not found');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomainDetails();
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
        <Link href="/domains" className="inline-flex items-center gap-1 text-sm text-[#57534e] hover:text-[#171717]">
          <ArrowLeft className="w-4 h-4" /> Back to Domains
        </Link>
        <ErrorBanner title="Domain Error" message={error || 'Could not load domain.'} onRetry={fetchDomainDetails} />
      </div>
    );
  }

  const { domain, projects, technologies, developers } = data;

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between border-b border-[#e7e2d9] pb-4">
        <Link
          href="/domains"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#57534e] hover:text-[#171717] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Domains</span>
        </Link>

        <Link
          href={`/explorer?centerId=${domain.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Inspect Node in Explorer</span>
        </Link>
      </div>

      <section className="space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-stone-100 border border-stone-300 text-xs font-mono font-bold text-[#171717]">
          <Globe className="w-3.5 h-3.5 text-red-600" />
          Industry Domain
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#171717] tracking-tight">{domain.name}</h1>
        <p className="text-sm text-[#57534e] leading-relaxed max-w-3xl">{domain.description}</p>
      </section>

      {/* Domain Engineers with Domain Experience */}
      <section className="border-t border-[#171717] pt-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#e7e2d9] pb-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-100 border border-stone-300 text-[11px] font-mono font-semibold text-[#171717]">
              <GitFork className="w-3.5 h-3.5 text-red-600" />
              Graph Traversal: Domain Experience
            </div>
            <h2 className="text-xl font-serif font-bold text-[#171717]">
              Engineers with {domain.name} Domain Experience
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono text-[#78716c]">
            Dev &rarr; Project &rarr; Domain
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {developers.length === 0 ? (
            <p className="text-xs text-[#78716c] col-span-2">No developers found for this domain.</p>
          ) : (
            developers.map((d: any) => (
              <div key={d.id} className="p-3.5 rounded bg-white border border-[#171717] flex items-center gap-3">
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
      </section>

      {/* Projects & Technologies Grid */}
      <section className="border-t border-[#171717] pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-serif font-bold text-[#171717] flex items-center gap-2 border-b border-[#e7e2d9] pb-2">
            <Briefcase className="w-4 h-4 text-red-600" />
            Projects in {domain.name}
          </h2>
          <div className="space-y-3 divide-y divide-[#e7e2d9]">
            {projects.length === 0 ? (
              <p className="text-xs text-[#78716c]">No projects listed.</p>
            ) : (
              projects.map((p: any) => (
                <div key={p.id} className="pt-3 first:pt-0 space-y-1">
                  <Link href={`/projects/${p.id}`} className="text-sm font-bold text-[#171717] hover:text-red-600 transition-colors">
                    {p.name}
                  </Link>
                  <p className="text-xs text-[#57534e] line-clamp-2">{p.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-serif font-bold text-[#171717] flex items-center gap-2 border-b border-[#e7e2d9] pb-2">
            <Cpu className="w-4 h-4 text-[#78716c]" />
            Technologies Mapped to {domain.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {technologies.length === 0 ? (
              <p className="text-xs text-[#78716c]">No technologies mapped.</p>
            ) : (
              technologies.map((t: any) => (
                <Link
                  key={t.id}
                  href={`/technologies/${t.id}`}
                  className="px-3 py-1.5 rounded bg-white hover:bg-[#f7f4ee] text-[#171717] border border-[#171717] text-xs font-medium transition-colors"
                >
                  {t.name}
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
