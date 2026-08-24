import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = 'No Data Found',
  description = 'No entities or graph relationships match your query criteria.',
}: EmptyStateProps) {
  return (
    <div className="bg-white border border-[#e7e2d9] rounded p-8 text-center space-y-3">
      <div className="mx-auto w-12 h-12 rounded bg-[#f7f4ee] border border-[#e7e2d9] flex items-center justify-center text-[#78716c]">
        <SearchX className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-[#171717]">{title}</h3>
      <p className="text-xs text-[#57534e] max-w-md mx-auto leading-relaxed">{description}</p>
    </div>
  );
}
