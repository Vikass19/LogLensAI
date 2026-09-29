import React, { useState } from 'react';
import { 
  FolderArchive, 
  FileText, 
  Eye, 
  Trash2, 
  RotateCw, 
  Download, 
  UploadCloud, 
  CheckCircle2, 
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { IngestionFile } from '../../types/telemetry';

interface LogFilesScreenProps {
  files: IngestionFile[];
  onSelectFile: (name: string) => void;
  onNavigate: (path: string, options?: { file?: string }) => void;
  onDeleteFile: (id: string) => void;
}

export const LogFilesScreen: React.FC<LogFilesScreenProps> = ({
  files,
  onSelectFile,
  onNavigate,
  onDeleteFile,
}) => {
  const [search, setSearch] = useState('');

  const filtered = files.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full gap-5 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#181c23] p-5 rounded-xl border border-[#3d494c]/30 shadow-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-[#4cd7f6]" />
            <h1 className="text-xl sm:text-2xl text-[#dfe2ed] font-bold tracking-tight">
              Ingested Log Files
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#262a32] text-[#4cd7f6] border border-[#4cd7f6]/30">
              {files.length} Archives
            </span>
          </div>
          <p className="text-xs text-[#869397]">
            Active telemetry archives indexed in OpenTelemetry vector store. Stored for 30 days under SOC2 retention rules.
          </p>
        </div>

        <button 
          onClick={() => onNavigate('upload-logs')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#06b6d4] text-[#00424f] hover:bg-[#4cd7f6] transition-colors text-xs font-semibold shadow-md"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Another File</span>
        </button>
      </div>

      {/* Filter / Search */}
      <div className="flex items-center justify-between gap-3 bg-[#181c23] p-2.5 rounded-xl border border-[#3d494c]/40 shadow-sm">
        <div className="flex items-center gap-2 flex-1 px-2">
          <Search className="w-4 h-4 text-[#869397]" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name or description..."
            className="w-full bg-transparent text-xs text-[#dfe2ed] placeholder-[#869397] focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* Files Table */}
      <div className="rounded-xl bg-[#181c23] shadow-md border border-[#3d494c]/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-[10px] text-[#869397] uppercase tracking-wider bg-[#0a0e15] border-b border-[#3d494c]/30">
                <th className="py-3 px-4">Log Archive</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Indexed Lines</th>
                <th className="py-3 px-3">Errors</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3d494c]/20">
              {filtered.map((file) => (
                <tr key={file.id} className="hover:bg-[#1c2027] transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#89ceff]" />
                      <div className="flex flex-col">
                        <span className="font-bold text-[#dfe2ed] group-hover:text-[#4cd7f6] transition-colors">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-[#869397] font-sans">Uploaded {file.uploadedAt}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-[#bcc9cd] font-sans text-xs">
                    {file.description}
                  </td>
                  <td className="py-3.5 px-3 text-[#869397]">
                    {file.size}
                  </td>
                  <td className="py-3.5 px-3 text-[#dfe2ed]">
                    {file.logCount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#93000a]/20 text-[#ff5449] font-bold border border-[#ff5449]/20">
                      {file.errorCount}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] bg-[#4cd7f6]/10 text-[#4cd7f6] font-semibold border border-[#4cd7f6]/30">
                      <CheckCircle2 className="w-3 h-3 text-[#4cd7f6]" />
                      {file.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => {
                          onSelectFile(file.name);
                          onNavigate('log-explorer', { file: file.name });
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#262a32] text-[#dfe2ed] hover:text-[#4cd7f6] hover:bg-[#31353d] transition-colors border border-[#3d494c]/40"
                        title="Explore in Stream"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Explore</span>
                      </button>

                      <button 
                        onClick={() => {
                          onSelectFile(file.name);
                          onNavigate('ai-analysis', { file: file.name });
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#06b6d4] text-[#00424f] hover:bg-[#4cd7f6] transition-colors font-semibold"
                        title="AI Analysis"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Diagnose</span>
                      </button>

                      <button 
                        onClick={() => onDeleteFile(file.id)}
                        className="p-1 rounded text-[#869397] hover:text-[#ff5449] hover:bg-[#262a32] transition-colors"
                        title="Delete archive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
