'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Sparkles,
  Briefcase,
  Building2,
  ArrowLeft,
  Compass,
  GitFork,
} from 'lucide-react';
import ErrorBanner from '@/components/ErrorBanner';
import { CardSkeleton } from '@/components/LoadingSkeleton';

export default function DeveloperDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [sharedSkillsData, setSharedSkillsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeveloperDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const [devRes, sharedRes] = await Promise.all([
        fetch(`/api/developers/${id}`),
        fetch(`/api/developers/${id}/shared-skills`),
      ]);

      const devJson = await devRes.json();
      const sharedJson = await sharedRes.json();

      if (devJson.status === 'success') {
        setData(devJson.data);
      } else {
        setError(devJson.message || 'Developer not found');
      }

      if (sharedJson.status === 'success') {
        setSharedSkillsData(sharedJson.data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeveloperDetails();
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
        <Link href="/developers" className="inline-flex items-center gap-1 text-sm text-[#57534e] hover:text-[#171717]">
          <ArrowLeft className="w-4 h-4" /> Back to Developers
        </Link>
        <ErrorBanner title="Developer Detail Error" message={error || 'Could not load developer profile.'} onRetry={fetchDeveloperDetails} />
      </div>
    );
  }

  const { developer, skills, projects, companies, connectedTechnologies } = data;

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-16">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#e7e2d9] pb-4">
        <Link
          href="/developers"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#57534e] hover:text-[#171717] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Developers</span>
        </Link>

        <Link
          href={`/explorer?centerId=${developer.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Inspect Node in Explorer</span>
        </Link>
      </div>

      {/* Profile Header */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#171717] bg-[#f7f4ee] shrink-0">
            <Image src={developer.avatar} alt={developer.name} fill className="object-cover" unoptimized />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#171717] tracking-tight">{developer.name}</h1>
            <div className="flex items-center gap-2 text-xs font-mono text-[#57534e]">
              <MapPin className="w-3.5 h-3.5 text-[#78716c]" />
              <span>{developer.location}</span>
            </div>
            <p className="text-sm text-[#57534e] leading-relaxed max-w-2xl">{developer.bio}</p>
          </div>
        </div>

        {/* Core Skills & Expertise */}
        <div className="pt-4 border-t border-[#e7e2d9] space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#78716c] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            Direct Skills &amp; Competencies
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {skills.length === 0 ? (
              <span className="text-xs text-[#78716c]">No skills assigned</span>
            ) : (
              skills.map((skill: any) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 rounded bg-[#f7f4ee] text-[#171717] border border-[#d6d3d1] text-xs font-medium"
                >
                  {skill.name} <span className="text-[#78716c] text-[10px]">({skill.category})</span>
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Multi-Hop Connected Technologies */}
      <section className="border-t border-[#171717] pt-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#e7e2d9] pb-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-100 border border-stone-300 text-[11px] font-mono font-semibold text-[#171717]">
              <GitFork className="w-3.5 h-3.5 text-red-600" />
              Graph Traversal: 2-Hop Connection
            </div>
            <h2 className="text-xl font-serif font-bold text-[#171717]">
              Technology Stack Experience (via Projects)
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono text-[#78716c]">
            Dev &rarr; Project &rarr; Tech
          </span>
        </div>
        <p className="text-xs text-[#57534e] leading-relaxed">
          Technologies gathered transitively by matching production projects worked on by {developer.name}.
        </p>
        <div className="flex flex-wrap gap-2.5 pt-1">
          {connectedTechnologies.length === 0 ? (
            <span className="text-xs text-[#78716c]">No connected technologies found.</span>
          ) : (
            connectedTechnologies.map((tech: any) => (
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
      </section>

      {/* Projects & Experience Grid */}
      <section className="border-t border-[#171717] pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Worked On Projects */}
        <div className="space-y-4">
          <h2 className="text-lg font-serif font-bold text-[#171717] flex items-center gap-2 border-b border-[#e7e2d9] pb-2">
            <Briefcase className="w-4 h-4 text-red-600" />
            Project Contributions
          </h2>
          <div className="space-y-4 divide-y divide-[#e7e2d9]">
            {projects.length === 0 ? (
              <p className="text-xs text-[#78716c]">No project history recorded.</p>
            ) : (
              projects.map((p: any) => (
                <div key={p.project.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/projects/${p.project.id}`}
                      className="text-sm font-bold text-[#171717] hover:text-red-600 transition-colors"
                    >
                      {p.project.name}
                    </Link>
                    <span className="text-[10px] font-mono text-[#78716c]">
                      {p.startedAt} &ndash; {p.endedAt}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-red-700">{p.role}</div>
                  <p className="text-xs text-[#57534e] line-clamp-2 pt-0.5">{p.project.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Worked At Companies */}
        <div className="space-y-4">
          <h2 className="text-lg font-serif font-bold text-[#171717] flex items-center gap-2 border-b border-[#e7e2d9] pb-2">
            <Building2 className="w-4 h-4 text-[#78716c]" />
            Employment History
          </h2>
          <div className="space-y-4 divide-y divide-[#e7e2d9]">
            {companies.length === 0 ? (
              <p className="text-xs text-[#78716c]">No company history recorded.</p>
            ) : (
              companies.map((c: any) => (
                <div key={c.company.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/companies/${c.company.id}`}
                      className="text-sm font-bold text-[#171717] hover:text-red-600 transition-colors"
                    >
                      {c.company.name}
                    </Link>
                    <span className="text-[10px] font-mono text-[#78716c]">
                      {c.startedAt} &ndash; {c.endedAt}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-[#171717]">{c.role}</div>
                  <p className="text-xs text-[#57534e] pt-0.5">{c.company.industry}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Shared Skills Overlap */}
      <section className="border-t border-[#171717] pt-8 space-y-4">
        <div className="border-b border-[#e7e2d9] pb-3 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-100 border border-stone-300 text-[11px] font-mono font-semibold text-[#171717]">
            <GitFork className="w-3.5 h-3.5 text-red-600" />
            Graph Traversal: Shared Skills Overlap
          </div>
          <h2 className="text-xl font-serif font-bold text-[#171717]">
            Top Peer Overlaps by Skill
          </h2>
        </div>
        <p className="text-xs text-[#57534e] leading-relaxed">
          Inverted graph traversal query matching developers sharing skill nodes with {developer.name}.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {sharedSkillsData.length === 0 ? (
            <div className="col-span-2 text-xs text-[#78716c]">No skill overlaps found.</div>
          ) : (
            sharedSkillsData.map((item: any) => (
              <div
                key={item.developer.id}
                className="p-4 rounded bg-white border border-[#171717] hover:border-red-600 transition-colors flex items-start gap-3"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#171717] bg-[#f7f4ee] shrink-0">
                  <Image src={item.developer.avatar} alt={item.developer.name} fill className="object-cover" unoptimized />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/developers/${item.developer.id}`}
                      className="text-sm font-bold text-[#171717] hover:text-red-600 transition-colors"
                    >
                      {item.developer.name}
                    </Link>
                    <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      {item.overlapCount} Shared Skill{item.overlapCount > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.sharedSkills.map((sk: any) => (
                      <span key={sk.id} className="text-[10px] px-2 py-0.5 rounded bg-[#f7f4ee] text-[#171717] border border-[#d6d3d1]">
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
