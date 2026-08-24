'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Network,
  Users,
  Briefcase,
  Cpu,
  Building2,
  Globe,
  Compass,
  Search,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; loading: boolean }>({
    connected: false,
    loading: true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Record<string, unknown>[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setDbStatus({ connected: data.connected === true, loading: false });
      } catch {
        setDbStatus({ connected: false, loading: false });
      }
    }
    checkHealth();
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const json = await res.json();
        if (json.status === 'success') {
          setSearchResults(json.data || []);
          setShowDropdown(true);
        }
      } catch (e) {
        console.error('Search error', e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: 'Overview', icon: Network },
    { href: '/developers', label: 'Developers', icon: Users },
    { href: '/projects', label: 'Projects', icon: Briefcase },
    { href: '/technologies', label: 'Technologies', icon: Cpu },
    { href: '/companies', label: 'Companies', icon: Building2 },
    { href: '/domains', label: 'Domains', icon: Globe },
    { href: '/explorer', label: 'Graph Explorer', icon: Compass },
  ];

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'Developer': return 'bg-stone-100 text-stone-800 border-stone-300';
      case 'Project': return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'Technology': return 'bg-stone-200 text-stone-900 border-stone-300';
      case 'Skill': return 'bg-red-50 text-red-700 border-red-200';
      case 'Company': return 'bg-stone-100 text-stone-700 border-stone-200';
      case 'Domain': return 'bg-stone-100 text-stone-800 border-stone-300';
      default: return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  const handleSelectResult = (item: Record<string, unknown>) => {
    setShowDropdown(false);
    setSearchQuery('');
    const labelLower = String(item.label || '').toLowerCase();
    let route = '/';
    if (labelLower === 'developer') route = `/developers/${item.id}`;
    else if (labelLower === 'project') route = `/projects/${item.id}`;
    else if (labelLower === 'technology') route = `/technologies/${item.id}`;
    else if (labelLower === 'company') route = `/companies/${item.id}`;
    else if (labelLower === 'domain') route = `/domains/${item.id}`;
    router.push(route);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#ffffff] border-b border-[#e7e2d9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-[#171717] tracking-tight">
            <div className="w-8 h-8 rounded border border-[#171717] bg-[#171717] text-white flex items-center justify-center font-mono text-sm">
              SG
            </div>
            <span className="font-serif tracking-tight text-[#171717]">
              SkillGraph
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'text-[#57534e] hover:text-[#171717] hover:bg-[#f7f4ee]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-[#78716c]'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716c]" />
                <input
                  type="text"
                  placeholder="Search entities..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                  className="w-40 sm:w-60 pl-9 pr-4 py-1.5 text-sm bg-[#fbf9f5] border border-[#d6d3d1] rounded text-[#171717] placeholder-[#78716c] focus:outline-none focus:border-[#171717]"
                />
                {isSearching && (
                  <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-red-600" />
                )}
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-[#171717] rounded shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-xs text-[#57534e] text-center">No entities found for &quot;{searchQuery}&quot;</div>
                  ) : (
                    <div className="py-1 divide-y divide-[#e7e2d9]">
                      {searchResults.map((item) => (
                        <button
                          key={String(item.id)}
                          onClick={() => handleSelectResult(item)}
                          className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-[#fbf9f5] transition-colors"
                        >
                          <span className="text-sm font-medium text-[#171717] truncate pr-2">{String(item.name)}</span>
                          <span className={`text-xs px-2 py-0.5 rounded border ${getLabelColor(String(item.label))}`}>
                            {String(item.label)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center">
              {dbStatus.loading ? (
                <div className="flex items-center gap-1.5 text-xs text-[#57534e] bg-[#f7f4ee] border border-[#e7e2d9] px-2.5 py-1 rounded">
                  <Loader2 className="w-3 h-3 animate-spin text-[#78716c]" />
                  <span>Connecting...</span>
                </div>
              ) : dbStatus.connected ? (
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#171717] bg-[#f7f4ee] border border-[#d6d3d1] px-2.5 py-1 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CognoDB</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-mono text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>DB Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:hidden flex items-center overflow-x-auto py-2 border-t border-[#e7e2d9] space-x-1 scrollbar-none">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium shrink-0 ${
                  isActive
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'text-[#57534e] hover:text-[#171717]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
