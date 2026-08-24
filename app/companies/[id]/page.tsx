'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, Users, ArrowLeft, Compass } from 'lucide-react';
import ErrorBanner from '@/components/ErrorBanner';
import { CardSkeleton } from '@/components/LoadingSkeleton';

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/companies/${id}`);
      const json = await res.json();
      if (json.status === 'success') {
        setData(json.data);
      } else {
        setError(json.message || 'Company not found');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
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
        <Link href="/companies" className="inline-flex items-center gap-1 text-sm text-[#57534e] hover:text-[#171717]">
          <ArrowLeft className="w-4 h-4" /> Back to Companies
        </Link>
        <ErrorBanner title="Company Error" message={error || 'Could not load company profile.'} onRetry={fetchCompanyDetails} />
      </div>
    );
  }

  const { company, developers } = data;

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between border-b border-[#e7e2d9] pb-4">
        <Link
          href="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#57534e] hover:text-[#171717] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Companies</span>
        </Link>

        <Link
          href={`/explorer?centerId=${company.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Inspect Node in Explorer</span>
        </Link>
      </div>

      <section className="space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-stone-100 border border-stone-300 text-xs font-mono font-bold text-[#171717]">
          <Building2 className="w-3.5 h-3.5 text-red-600" />
          {company.industry}
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#171717] tracking-tight">{company.name}</h1>
      </section>

      <section className="border-t border-[#171717] pt-8 space-y-4">
        <h2 className="text-lg font-serif font-bold text-[#171717] flex items-center gap-2 border-b border-[#e7e2d9] pb-2">
          <Users className="w-4 h-4 text-red-600" />
          Engineers &amp; Alumni Network (Dev &rarr; WORKED_AT &rarr; Company)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {developers.length === 0 ? (
            <p className="text-xs text-[#78716c] col-span-2">No engineers linked to this company.</p>
          ) : (
            developers.map((item: any) => (
              <div key={item.developer.id} className="p-3.5 rounded bg-white border border-[#171717] flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#171717] bg-[#f7f4ee] shrink-0">
                  <Image src={item.developer.avatar} alt={item.developer.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/developers/${item.developer.id}`} className="text-sm font-bold text-[#171717] hover:text-red-600 transition-colors truncate block">
                    {item.developer.name}
                  </Link>
                  <div className="text-xs text-[#57534e]">
                    <span className="font-medium text-red-700">{item.role}</span> &bull; <span className="text-[10px] text-[#78716c]">{item.startedAt} &ndash; {item.endedAt}</span>
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
