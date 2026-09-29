import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Terminal, 
  UploadCloud, 
  AlertOctagon, 
  BrainCircuit, 
  FileText, 
  ArrowRight,
  Database,
  Flame,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onSelectFile?: (filename: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectFile,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNav = [
    { label: 'Go to Dashboard', icon: Terminal, path: 'dashboard', category: 'Navigation' },
    { label: 'Open Log Explorer (Live Tail)', icon: Terminal, path: 'log-explorer', category: 'Navigation' },
    { label: 'Investigate DatabaseConnectionError (AI)', icon: BrainCircuit, path: 'ai-analysis', category: 'Incidents' },
    { label: 'Upload New Log File', icon: UploadCloud, path: 'upload-logs', category: 'Navigation' },
    { label: 'View All Error Groups', icon: AlertOctagon, path: 'error-explorer', category: 'Incidents' },
    { label: 'Target: application.log (4.2 MB)', icon: FileText, file: 'application.log', category: 'Files' },
    { label: 'Target: server.log (2.1 MB)', icon: FileText, file: 'server.log', category: 'Files' },
  ];

  const filtered = quickNav.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) || 
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-xl bg-[#181c23] border border-[#3d494c]/60 rounded-xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#3d494c]/40 gap-3 bg-[#141820]">
          <Search className="w-5 h-5 text-[#4cd7f6]" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, filename or search errors (e.g. status:500, db, auth)..."
            className="w-full bg-transparent text-[#dfe2ed] placeholder-[#869397] text-sm focus:outline-none font-mono"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded text-[#869397] hover:text-[#dfe2ed] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#3d494c]/20">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#869397] font-mono">
              No matching commands or logs found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.file && onSelectFile) {
                      onSelectFile(item.file);
                    }
                    if (item.path) {
                      onNavigate(item.path);
                    }
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left hover:bg-[#262a32] text-[#dfe2ed] group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-[#0f131b] border border-[#3d494c]/40 text-[#4cd7f6]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-[#dfe2ed] group-hover:text-[#4cd7f6] transition-colors">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-[#869397] font-mono">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#869397] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[#3d494c]/30 bg-[#0f131b] flex items-center justify-between text-[11px] text-[#869397] font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-[#262a32] text-white">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-[#262a32] text-white">↓</kbd> Navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-[#262a32] text-white">↵</kbd> Select</span>
            <span><kbd className="px-1 py-0.5 rounded bg-[#262a32] text-white">ESC</kbd> Close</span>
          </div>
          <span className="text-[#4cd7f6]">LogLens v4.2</span>
        </div>
      </div>
    </div>
  );
};
