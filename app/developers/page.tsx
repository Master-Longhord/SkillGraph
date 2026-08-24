'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, MapPin, ArrowRight, Search } from 'lucide-react';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import ErrorBanner from '@/components/ErrorBanner';
import EmptyState from '@/components/EmptyState';
import { DeveloperNode } from '@/types';

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<DeveloperNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const fetchDevelopers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/developers');
      const json = await res.json();
      if (json.status === 'success') {
        setDevelopers(json.data || []);
      } else {
        setError(json.message || 'Failed to load developers');
      }
    } catch (err: any) {
      setError(err.message || 'Database connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const filteredDevelopers = developers.filter((d) =>
    d.name.toLowerCase().includes(filter.toLowerCase()) ||
    d.location.toLowerCase().includes(filter.toLowerCase()) ||
    d.bio.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#171717] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#78716c] uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-red-600" />
            Engineering Talent Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#171717] tracking-tight mt-1">
            Developers Directory
          </h1>
          <p className="text-sm text-[#57534e] mt-1 max-w-xl">
            Explore engineers, their verified skill sets, production project contributions, and multi-hop graph connections.
          </p>
        </div>

        {/* Filter input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716c]" />
          <input
            type="text"
            placeholder="Filter by name, location..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-white border border-[#d6d3d1] rounded text-[#171717] placeholder-[#78716c] focus:outline-none focus:border-[#171717] w-full sm:w-64"
          />
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={fetchDevelopers} />}

      {loading ? (
        <GridSkeleton count={6} />
      ) : filteredDevelopers.length === 0 ? (
        <EmptyState title="No Developers Found" description="Try clearing your search filter." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevelopers.map((dev) => (
            <div
              key={dev.id}
              className="bg-white border border-[#171717] rounded p-6 flex flex-col justify-between hover:border-red-600 transition-colors group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#171717] bg-[#f7f4ee] shrink-0">
                    <Image
                      src={dev.avatar}
                      alt={dev.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#171717] group-hover:text-red-600 transition-colors">
                      {dev.name}
                    </h2>
                    <div className="flex items-center gap-1 text-xs text-[#57534e] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#78716c]" />
                      <span>{dev.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#57534e] line-clamp-3 leading-relaxed">
                  {dev.bio}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#e7e2d9]">
                <Link
                  href={`/developers/${dev.id}`}
                  className="inline-flex items-center justify-between w-full text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  <span>View Graph Profile</span>
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
