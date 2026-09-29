import React, { useState } from 'react';
import { GitPullRequest, X, Check, Code, Flame } from 'lucide-react';
import { LogEntry } from '../../types/telemetry';

interface GitHubIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  log?: LogEntry | null;
}

export const GitHubIssueModal: React.FC<GitHubIssueModalProps> = ({
  isOpen,
  onClose,
  log,
}) => {
  const [title, setTitle] = useState(
    log?.errorName ? `fix(${log.service.toLowerCase().replace(/\s+/g, '-')}): ${log.errorName} - ${log.message.slice(0, 45)}...` : 'fix(database): DatabaseConnectionError - pool exhausted'
  );
  const [repo, setRepo] = useState('acme-cloud/production-services');
  const [isCreated, setIsCreated] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreated(true);
    setTimeout(() => {
      setIsCreated(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#181c23] border border-[#3d494c]/60 rounded-xl shadow-2xl p-5 z-10 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3d494c]/30 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#3131c0] text-[#c0c1ff]">
              <GitPullRequest className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#dfe2ed]">Create GitHub Issue</h2>
          </div>
          <button onClick={onClose} className="p-1 text-[#869397] hover:text-[#dfe2ed]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isCreated ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <span className="text-sm font-bold text-[#dfe2ed]">Issue #1402 Created on GitHub!</span>
            <span className="font-mono text-xs text-[#869397]">Linked with telemetry incident trace</span>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="flex flex-col gap-3 font-mono text-xs">
            <div className="flex flex-col gap-1">
              <label className="text-[#869397]">Repository</label>
              <select 
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="bg-[#0a0e15] border border-[#3d494c]/40 rounded-lg px-3 py-2 text-[#dfe2ed]"
              >
                <option value="acme-cloud/production-services">acme-cloud/production-services</option>
                <option value="acme-cloud/user-api">acme-cloud/user-api</option>
                <option value="acme-cloud/payment-engine">acme-cloud/payment-engine</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#869397]">Issue Title</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#0a0e15] border border-[#3d494c]/40 rounded-lg px-3 py-2 text-[#dfe2ed] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#869397]">Labels</label>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded bg-[#93000a] text-[#ffdad6] font-bold text-[10px]">
                  P1-critical
                </span>
                <span className="px-2 py-0.5 rounded bg-[#262a32] text-[#4cd7f6] text-[10px]">
                  telemetry-detected
                </span>
                <span className="px-2 py-0.5 rounded bg-[#262a32] text-[#c0c1ff] text-[10px]">
                  database
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#869397]">Payload Preview</label>
              <div className="bg-[#0a0e15] p-3 rounded-lg border border-[#3d494c]/30 text-[11px] text-[#bcc9cd] max-h-32 overflow-y-auto space-y-1">
                <p className="text-[#ff5449] font-bold">Uncaught Exception: {log?.message || 'Database connection pool exhausted'}</p>
                <p className="text-[#869397]">Origin: {log?.service || 'Database'} ({log?.requestId || 'req_4a82b9'})</p>
                <p className="text-[#89ceff]">Stack: database/connect.py:42 in get_connection_pool()</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#3d494c]/30">
              <button 
                type="button" 
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg bg-[#262a32] text-[#dfe2ed] hover:bg-[#31353d]"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#3131c0] text-[#c0c1ff] hover:brightness-110 font-bold flex items-center gap-1.5"
              >
                <GitPullRequest className="w-3.5 h-3.5" />
                <span>Publish Issue</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
