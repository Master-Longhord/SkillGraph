'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GraphNode, GraphLink } from '@/types';
import { ZoomIn, ZoomOut, RotateCcw, GitFork } from 'lucide-react';

interface GraphCanvasProps {
  nodes: GraphNode[];
  links: GraphLink[];
  onSelectNode: (node: GraphNode | null) => void;
  onExpandNode: (nodeId: string) => void;
}

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function GraphCanvas({
  nodes,
  links,
  onSelectNode,
  onExpandNode,
}: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<SimNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const simNodesRef = useRef<SimNode[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const getNodeColor = (label: string) => {
    switch (label) {
      case 'Developer': return '#171717';
      case 'Skill': return '#dc2626';
      case 'Project': return '#44403c';
      case 'Technology': return '#78716c';
      case 'Company': return '#a8a29e';
      case 'Domain': return '#292524';
      default: return '#57534e';
    }
  };

  useEffect(() => {
    const width = 800;
    const height = 600;

    const existingMap = new Map(simNodesRef.current.map((n) => [n.id, n]));

    simNodesRef.current = nodes.map((n, idx) => {
      const existing = existingMap.get(n.id);
      if (existing) {
        return { ...n, x: existing.x, y: existing.y, vx: existing.vx, vy: existing.vy };
      }
      const angle = (idx / Math.max(nodes.length, 1)) * Math.PI * 2;
      const radius = 180 + Math.random() * 80;
      return {
        ...n,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      };
    });
  }, [nodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let iterations = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      if (iterations < 120) {
        iterations++;
        const simNodes = simNodesRef.current;

        for (let i = 0; i < simNodes.length; i++) {
          for (let j = i + 1; j < simNodes.length; j++) {
            const n1 = simNodes[i];
            const n2 = simNodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const distSq = dx * dx + dy * dy || 1;
            const dist = Math.sqrt(distSq);
            if (dist < 250) {
              const force = 1800 / distSq;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              n1.vx -= fx;
              n1.vy -= fy;
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }

        const nodeMap = new Map(simNodes.map((n) => [n.id, n]));
        links.forEach((link) => {
          const sourceId = typeof link.source === 'string' ? link.source : (link.source as unknown as { id: string }).id;
          const targetId = typeof link.target === 'string' ? link.target : (link.target as unknown as { id: string }).id;
          const sNode = nodeMap.get(sourceId);
          const tNode = nodeMap.get(targetId);
          if (sNode && tNode) {
            const dx = tNode.x - sNode.x;
            const dy = tNode.y - sNode.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const targetDist = 120;
            const force = (dist - targetDist) * 0.04;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            sNode.vx += fx;
            sNode.vy += fy;
            tNode.vx -= fx;
            tNode.vy -= fy;
          }
        });

        simNodes.forEach((n) => {
          n.vx += (width / 2 - n.x) * 0.005;
          n.vy += (height / 2 - n.y) * 0.005;
          n.vx *= 0.85;
          n.vy *= 0.85;
          n.x += n.vx;
          n.y += n.vy;
        });
      }

      // Draw background
      ctx.fillStyle = '#fbf9f5';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(pan.x + width / 2, pan.y + height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2);

      const nodeMap = new Map(simNodesRef.current.map((n) => [n.id, n]));
      links.forEach((link) => {
        const sourceId = typeof link.source === 'string' ? link.source : (link.source as unknown as { id: string }).id;
        const targetId = typeof link.target === 'string' ? link.target : (link.target as unknown as { id: string }).id;
        const sNode = nodeMap.get(sourceId);
        const tNode = nodeMap.get(targetId);

        if (sNode && tNode) {
          const isHighlighted =
            (selectedNode && (selectedNode.id === sNode.id || selectedNode.id === tNode.id)) ||
            (hoveredNode && (hoveredNode.id === sNode.id || hoveredNode.id === tNode.id));

          ctx.beginPath();
          ctx.moveTo(sNode.x, sNode.y);
          ctx.lineTo(tNode.x, tNode.y);
          ctx.strokeStyle = isHighlighted ? '#dc2626' : 'rgba(120, 113, 108, 0.4)';
          ctx.lineWidth = isHighlighted ? 2.5 : 1;
          ctx.stroke();

          const midX = (sNode.x + tNode.x) / 2;
          const midY = (sNode.y + tNode.y) / 2;
          ctx.font = '9px system-ui, sans-serif';
          ctx.fillStyle = isHighlighted ? '#dc2626' : '#78716c';
          ctx.fillText(link.type, midX, midY);
        }
      });

      simNodesRef.current.forEach((n) => {
        const isSelected = selectedNode?.id === n.id;
        const isHovered = hoveredNode?.id === n.id;
        const radius = isSelected ? 18 : isHovered ? 15 : 12;

        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius + 6, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(220, 38, 38, 0.15)' : 'rgba(120, 113, 108, 0.15)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#dc2626' : getNodeColor(n.label);
        ctx.fill();
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.strokeStyle = isSelected ? '#171717' : '#ffffff';
        ctx.stroke();

        ctx.font = isSelected ? 'bold 12px system-ui, sans-serif' : '11px system-ui, sans-serif';
        ctx.fillStyle = isSelected ? '#dc2626' : '#171717';
        ctx.textAlign = 'center';
        ctx.fillText(n.name, n.x, n.y + radius + 14);
      });

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [links, zoom, pan, selectedNode, hoveredNode]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        canvasRef.current.width = canvasRef.current.parentElement.clientWidth;
        canvasRef.current.height = 600;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;

    const x = (clientX - pan.x - width / 2) / zoom + width / 2;
    const y = (clientY - pan.y - height / 2) / zoom + height / 2;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    const clickedNode = simNodesRef.current.find((n) => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= 18;
    });

    if (clickedNode) {
      setSelectedNode(clickedNode);
      onSelectNode(clickedNode);
    } else {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
      return;
    }

    const { x, y } = getCanvasCoords(e);
    const hovered = simNodesRef.current.find((n) => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= 15;
    });
    setHoveredNode(hovered || null);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative w-full bg-[#fbf9f5] border border-[#171717] rounded overflow-hidden shadow-sm">
      <canvas
        ref={canvasRef}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full cursor-grab active:cursor-grabbing block"
      />

      <div className="absolute top-4 right-4 flex flex-col gap-1.5 bg-white border border-[#171717] p-1.5 rounded z-10">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
          title="Zoom In"
          className="p-1.5 rounded text-[#57534e] hover:text-[#171717] hover:bg-[#f7f4ee] transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.4))}
          title="Zoom Out"
          className="p-1.5 rounded text-[#57534e] hover:text-[#171717] hover:bg-[#f7f4ee] transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          title="Reset Camera"
          className="p-1.5 rounded text-[#57534e] hover:text-[#171717] hover:bg-[#f7f4ee] transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white border border-[#171717] rounded p-4 shadow-lg space-y-3 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getNodeColor(selectedNode.label) }}
              />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#57534e]">
                {selectedNode.label} Node
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedNode(null);
                onSelectNode(null);
              }}
              className="text-xs text-[#78716c] hover:text-[#171717]"
            >
              Close
            </button>
          </div>

          <h3 className="text-base font-bold text-[#171717]">{selectedNode.name}</h3>

          <div className="text-xs text-[#57534e] space-y-1">
            {Object.entries(selectedNode.properties)
              .filter(([k]) => !k.startsWith('_') && k !== 'name' && k !== 'avatar')
              .slice(0, 4)
              .map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-[#e7e2d9] py-1">
                  <span className="text-[#78716c] capitalize">{k}:</span>
                  <span className="font-medium text-[#171717] truncate max-w-[160px]">{String(v)}</span>
                </div>
              ))}
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => onExpandNode(selectedNode.id)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#171717] hover:bg-red-700 text-white text-xs font-semibold transition-colors"
            >
              <GitFork className="w-3.5 h-3.5" />
              Expand Graph
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
