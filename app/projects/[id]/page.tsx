'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase,
  Calendar,
  Cpu,
  Users,
  Globe,
  ArrowLeft,
  Compass,
} from 'lucide-react';
import ErrorBanner from '@/components/ErrorBanner';
import { CardSkeleton } from '@/components/LoadingSkeleton';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${id}`);
      const json = await res.json();
      if (json.status === 'success') {
        setData(json.data);
      } else {
        setError(json.message || 'Project not found');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
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
        <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-[#57534e] hover:text-[#171717]">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
        <ErrorBanner title="Project Error" message={error || 'Could not load project.'} onRetry={fetchProjectDetails} />
      </div>
    );
  }

  const { project, developers, technologies, domains } = data;

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-16">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-[#e7e2d9] pb-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#57534e] hover:text-[#171717] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>

        <Link
          href={`/explorer?centerId=${project.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Inspect Node in Explorer</span>
        </Link>
      </div>

      {/* Project Header Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-stone-100 border border-stone-300 text-xs font-mono font-bold text-[#171717]">
              <Briefcase className="w-3.5 h-3.5 text-red-600" />
              {project.status}
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#171717] tracking-tight">{project.name}</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#57534e] bg-[#f7f4ee] border border-[#d6d3d1] px-3 py-1.5 rounded shrink-0">
            <Calendar className="w-4 h-4 text-[#78716c]" />
            <span>Launch Year: {project.year}</span>
          </div>
        </div>

        <p className="text-sm text-[#57534e] leading-relaxed max-w-3xl">{project.description}</p>

        {/* Domain Tags */}
        <div className="pt-3 border-t border-[#e7e2d9] flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-[#78716c] uppercase tracking-wider flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-red-600" /> Domain:
          </span>
          {domains.length === 0 ? (
            <span className="text-xs text-[#78716c]">Unspecified domain</span>
          ) : (
            domains.map((dom: any) => (
              <Link
                key={dom.id}
                href={`/domains/${dom.id}`}
                className="px-3 py-1 rounded bg-[#f7f4ee] text-[#171717] border border-[#d6d3d1] text-xs font-medium hover:border-[#171717] transition-colors"
              >
                {dom.name}
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Tech Stack & Team Grid */}
      <section className="border-t border-[#171717] pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tech Stack */}
        <div className="space-y-4">
          <h2 className="text-lg font-serif font-bold text-[#171717] flex items-center gap-2 border-b border-[#e7e2d9] pb-2">
            <Cpu className="w-4 h-4 text-red-600" />
            Technology Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {technologies.length === 0 ? (
              <p className="text-xs text-[#78716c]">No technology tags associated.</p>
            ) : (
              technologies.map((tech: any) => (
                <Link
                  key={tech.id}
                  href={`/technologies/${tech.id}`}
                  className="px-3 py-1.5 rounded bg-white hover:bg-[#f7f4ee] text-[#171717] border border-[#171717] text-xs font-medium transition-colors"
                >
                  {tech.name} <span className="text-[#78716c] text-[10px]">({tech.category})</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="space-y-4">
          <h2 className="text-lg font-serif font-bold text-[#171717] flex items-center gap-2 border-b border-[#e7e2d9] pb-2">
            <Users className="w-4 h-4 text-[#78716c]" />
            Engineers &amp; Contributors
          </h2>
          <div className="space-y-3">
            {developers.length === 0 ? (
              <p className="text-xs text-[#78716c]">No engineers assigned.</p>
            ) : (
              developers.map((item: any) => (
                <div key={item.developer.id} className="p-3 rounded bg-white border border-[#171717] flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#171717] bg-[#f7f4ee] shrink-0">
                    <Image src={item.developer.avatar} alt={item.developer.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/developers/${item.developer.id}`} className="text-sm font-bold text-[#171717] hover:text-red-600 transition-colors truncate block">
                      {item.developer.name}
                    </Link>
                    <div className="text-xs text-[#57534e] flex items-center gap-2">
                      <span className="font-medium text-red-700">{item.role}</span>
                      <span className="text-[10px] text-[#78716c]">({item.startedAt} &ndash; {item.endedAt})</span>
                    </div>
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
