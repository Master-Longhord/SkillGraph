'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Compass, Filter, RefreshCw, GitCommit, ArrowRight, Loader2 } from 'lucide-react';
import GraphCanvas from '@/components/GraphCanvas';
import ErrorBanner from '@/components/ErrorBanner';
import { GraphNode, GraphLink } from '@/types';

function ExplorerContent() {
  const searchParams = useSearchParams();
  const initialCenterId = searchParams.get('centerId') || '';

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [centerId, setCenterId] = useState(initialCenterId);
  const [filterLabel, setFilterLabel] = useState('ALL');

  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [shortestPathResult, setShortestPathResult] = useState<any>(null);
  const [isCalculatingPath, setIsCalculatingPath] = useState(false);

  const fetchGraphData = async (nodeId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = nodeId
        ? `/api/graph/explore?centerId=${encodeURIComponent(nodeId)}`
        : '/api/graph/explore';
      const res = await fetch(url);
      const json = await res.json();
      if (json.status === 'success') {
        setNodes(json.data.nodes || []);
        setLinks(json.data.links || []);
      } else {
        setError(json.message || 'Failed to fetch graph explorer data');
      }
    } catch (err: any) {
      setError(err.message || 'Database error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData(centerId);
  }, [centerId]);

  const handleShortestPath = async () => {
    if (!sourceId || !targetId) return;
    setIsCalculatingPath(true);
    try {
      const res = await fetch(`/api/graph/path?source=${sourceId}&target=${targetId}`);
      const json = await res.json();
      if (json.status === 'success') {
        setShortestPathResult(json.data);
      } else {
        setShortestPathResult(null);
      }
    } catch {
      setShortestPathResult(null);
    } finally {
      setIsCalculatingPath(false);
    }
  };

  const filteredNodes =
    filterLabel === 'ALL'
      ? nodes
      : nodes.filter((n) => n.label.toUpperCase() === filterLabel.toUpperCase());

  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredLinks = links.filter((l) => {
    const sId = typeof l.source === 'string' ? l.source : (l.source as any).id;
    const tId = typeof l.target === 'string' ? l.target : (l.target as any).id;
    return filteredNodeIds.has(sId) && filteredNodeIds.has(tId);
  });

  const legendItems = [
    { label: 'Developer', color: 'bg-[#171717]' },
    { label: 'Skill', color: 'bg-[#dc2626]' },
    { label: 'Project', color: 'bg-[#44403c]' },
    { label: 'Technology', color: 'bg-[#78716c]' },
    { label: 'Company', color: 'bg-[#a8a29e]' },
    { label: 'Domain', color: 'bg-[#292524]' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#171717] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#78716c] uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-red-600" />
            Graph Traversal Explorer
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#171717] tracking-tight mt-1">
            Interactive Graph Explorer
          </h1>
          <p className="text-sm text-[#57534e] mt-1 max-w-xl">
            Visually traverse openCypher nodes and relationships in real-time. Pan, zoom, click to center, or calculate shortest path connections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {centerId && (
            <button
              onClick={() => {
                setCenterId('');
                fetchGraphData('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-[#171717] text-[#171717] text-xs font-semibold hover:bg-[#f7f4ee] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Center
            </button>
          )}
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={() => fetchGraphData(centerId)} />}

      {/* Filter & Legend Controls */}
      <div className="bg-white border border-[#171717] rounded p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#78716c]" />
          <span className="text-xs font-mono font-bold text-[#171717] uppercase tracking-wider">Filter:</span>
          <select
            value={filterLabel}
            onChange={(e) => setFilterLabel(e.target.value)}
            className="bg-[#fbf9f5] border border-[#d6d3d1] rounded px-3 py-1.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
          >
            <option value="ALL">All Node Types</option>
            <option value="DEVELOPER">Developers</option>
            <option value="PROJECT">Projects</option>
            <option value="TECHNOLOGY">Technologies</option>
            <option value="SKILL">Skills</option>
            <option value="COMPANY">Companies</option>
            <option value="DOMAIN">Domains</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs font-mono text-[#57534e]">
              <span className={`w-3 h-3 rounded-full ${item.color}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas Viewport */}
      {loading ? (
        <div className="w-full h-[600px] bg-[#fbf9f5] border border-[#171717] rounded flex items-center justify-center text-[#57534e] gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
          <span className="text-sm font-medium">Loading graph nodes and edges...</span>
        </div>
      ) : (
        <GraphCanvas
          nodes={filteredNodes}
          links={filteredLinks}
          onSelectNode={() => {}}
          onExpandNode={(id) => {
            setCenterId(id);
            fetchGraphData(id);
          }}
        />
      )}

      {/* Shortest Path Finder Section */}
      <section className="bg-white border border-[#171717] rounded p-6 space-y-4">
        <div className="border-b border-[#e7e2d9] pb-3 space-y-1">
          <h2 className="text-lg font-serif font-bold text-[#171717] flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-red-600" />
            Graph Algorithm: Shortest Path Finder
          </h2>
          <p className="text-xs text-[#57534e]">
            Evaluate the shortest topological relationship path connecting any two graph entities using Cypher&apos;s <code className="text-red-600 font-mono font-semibold">shortestPath()</code> function.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <select
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className="bg-[#fbf9f5] border border-[#d6d3d1] rounded p-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
          >
            <option value="">Select Start Node...</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name} ({n.label})
              </option>
            ))}
          </select>

          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="bg-[#fbf9f5] border border-[#d6d3d1] rounded p-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
          >
            <option value="">Select Target Node...</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name} ({n.label})
              </option>
            ))}
          </select>

          <button
            onClick={handleShortestPath}
            disabled={!sourceId || !targetId || isCalculatingPath}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-[#e7e2d9] disabled:text-[#78716c] text-white rounded text-xs font-semibold transition-colors shadow-sm"
          >
            {isCalculatingPath ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Calculate Path</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {shortestPathResult && (
          <div className="mt-4 p-4 rounded bg-[#f7f4ee] border border-[#171717] space-y-2">
            <h3 className="text-xs font-mono font-bold text-[#171717] uppercase tracking-wider">
              Shortest Path Algorithm Result
            </h3>
            {shortestPathResult.nodes && shortestPathResult.nodes.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {shortestPathResult.nodes.map((node: any, idx: number) => (
                  <React.Fragment key={node.id}>
                    <span className="px-3 py-1 rounded bg-white text-[#171717] border border-[#171717] text-xs font-medium">
                      {node.name} <span className="text-[10px] text-[#78716c]">({node.label})</span>
                    </span>
                    {idx < shortestPathResult.nodes.length - 1 && (
                      <span className="text-xs text-red-600 font-mono flex items-center gap-1 font-bold">
                        --[{shortestPathResult.relationships[idx]?.type || 'CONNECTED'}]--&gt;
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-red-700">No relationship path found between selected entities.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[600px] bg-[#fbf9f5] border border-[#171717] rounded flex items-center justify-center text-[#57534e] gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
          <span className="text-sm font-medium">Loading Explorer...</span>
        </div>
      }
    >
      <ExplorerContent />
    </Suspense>
  );
}
