import React from 'react';
import { BookOpen, X, Code, Terminal, ExternalLink } from 'lucide-react';

interface DocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocModal: React.FC<DocModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#181c23] border border-[#3d494c]/60 rounded-xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#3d494c]/30 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#4cd7f6]" />
            <h2 className="text-base font-bold text-[#dfe2ed]">LogLensAI Documentation & Ingestion API</h2>
          </div>
          <button onClick={onClose} className="p-1 text-[#869397] hover:text-[#dfe2ed]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-xs text-[#bcc9cd] font-mono leading-relaxed">
          <div>
            <h3 className="text-sm font-bold text-[#dfe2ed] mb-1 font-sans">HTTP Log Ingestion Endpoint</h3>
            <p className="text-[#869397] mb-2 font-sans">Send batches of newline-delimited JSON (ndjson) or single OpenTelemetry envelopes to our cluster gateway:</p>
            <div className="bg-[#0a0e15] p-3 rounded-lg border border-[#3d494c]/30 text-[#4cd7f6]">
              POST https://ingest.loglens.internal/v1/traces
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#dfe2ed] mb-1 font-sans">cURL Example</h3>
            <pre className="bg-[#0a0e15] p-3 rounded-lg border border-[#3d494c]/30 text-[#89ceff] overflow-x-auto">
{`curl -X POST https://ingest.loglens.internal/v1/traces \\
  -H "Authorization: Bearer ll_live_948fbc28a011..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "timestamp": "2026-09-29T10:42:17Z",
    "level": "ERROR",
    "service": "Database",
    "message": "Database connection failed: pool exhausted"
  }'`}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#dfe2ed] mb-1 font-sans">OpenTelemetry Collector Config</h3>
            <pre className="bg-[#0a0e15] p-3 rounded-lg border border-[#3d494c]/30 text-[#dfe2ed] overflow-x-auto">
{`exporters:
  otlphttp/loglens:
    endpoint: https://ingest.loglens.internal/otlp
    headers:
      Authorization: "Bearer \${env:LOGLENS_API_KEY}"`}
            </pre>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#3d494c]/30">
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#262a32] text-[#dfe2ed] hover:bg-[#31353d] text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
