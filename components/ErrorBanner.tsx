import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorBanner({
  title = 'Database Connection Issue',
  message = 'Could not establish connection to CognoDB. Please verify your environment credentials and ensure the database cluster is active.',
  onRetry,
}: ErrorBannerProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded p-5 text-red-900">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded bg-red-100 text-red-700 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-bold text-red-950 text-sm">{title}</h3>
          <p className="text-xs text-red-800 leading-relaxed">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-red-100 text-red-900 rounded text-xs font-semibold transition-colors border border-red-300 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Connection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
