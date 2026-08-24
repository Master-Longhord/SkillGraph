import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white border border-[#e7e2d9] rounded p-5 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#e7e2d9] rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-[#e7e2d9] rounded w-1/3" />
          <div className="h-3 bg-[#e7e2d9]/60 rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-[#e7e2d9]/80 rounded w-full" />
        <div className="h-3 bg-[#e7e2d9]/50 rounded w-5/6" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-16 bg-[#e7e2d9]/80 rounded" />
        <div className="h-6 w-20 bg-[#e7e2d9]/80 rounded" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
