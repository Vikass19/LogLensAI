import React, { useState } from 'react';
import { 
  Layers, 
  AlertTriangle, 
  AlertOctagon, 
  Flame, 
  CloudRain, 
  FolderOpen, 
  ArrowRight, 
  Eye, 
  Sparkles, 
  MoreVertical, 
  UploadCloud, 
  Bug, 
  BrainCircuit, 
  PlusCircle, 
  ChevronDown, 
  Check, 
  TrendingUp, 
  TrendingDown,
  CloudCheck
} from 'lucide-react';
import { HISTOGRAM_DATA, INITIAL_FILES, TOP_ERRORS } from '../../data/mockTelemetry';
import { IngestionFile, ErrorGroup } from '../../types/telemetry';

interface DashboardScreenProps {
  onNavigate: (path: string, options?: { file?: string; errorId?: string }) => void;
  onSelectFile: (filename: string) => void;
  files: IngestionFile[];
  errors: ErrorGroup[];
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onSelectFile,
  files,
  errors,
}) => {
  const [selectedRange, setSelectedRange] = useState<'1H' | '6H' | '24H' | '7D'>('24H');
  const [envDropdownOpen, setEnvDropdownOpen] = useState(false);
  const [currentEnv, setCurrentEnv] = useState('Production (us-east-1)');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const envs = [
    'Production (us-east-1)',
    'Staging (eu-central-1)',
    'Disaster Recovery (us-west-2)',
    'Sandbox Kubernetes'
  ];

  const handleInspectFile = (file: IngestionFile) => {
    onSelectFile(file.name);
    onNavigate('log-explorer', { file: file.name });
  };

  const handleAnalyzeFile = (file: IngestionFile) => {
    onSelectFile(file.name);
    onNavigate('ai-analysis', { file: file.name });
  };

  const handleSelectError = (error: ErrorGroup) => {
    onNavigate('ai-analysis', { errorId: error.id });
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-12">
      {/* Cluster Status & Live Telemetry Strip */}
      <div className="relative overflow-hidden rounded-xl bg-[#0a0e15] p-5 shadow-xl border border-[#3d494c]/20">
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-[#4cd7f6]/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#4cd7f6] font-semibold">
                Live Ingestion Matrix
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4cd7f6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4cd7f6]"></span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl text-[#dfe2ed] tracking-tight font-bold">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#869397] max-w-2xl leading-relaxed">
              Monitor, investigate and understand your application logs across production clusters with automated anomaly correlation.
            </p>
          </div>

          {/* Action Panel & Environment Picker */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Env dropdown */}
            <div className="relative">
              <button 
                onClick={() => setEnvDropdownOpen(!envDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#262a32] text-[#dfe2ed] text-xs font-medium hover:bg-[#31353d] transition-colors border border-[#3d494c]/40 shadow-sm"
              >
                <CloudCheck className="w-4 h-4 text-[#89ceff]" />
                <span>{currentEnv}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#869397]" />
              </button>

              {envDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setEnvDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-1.5 w-60 bg-[#1c2027] border border-[#3d494c]/60 rounded-xl shadow-2xl py-1 z-40">
                    {envs.map((env) => (
                      <button
                        key={env}
                        onClick={() => {
                          setCurrentEnv(env);
                          setEnvDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#262a32] transition-colors ${
                          currentEnv === env ? 'text-[#4cd7f6] font-semibold bg-[#262a32]/50' : 'text-[#dfe2ed]'
                        }`}
                      >
                        <span>{env}</span>
                        {currentEnv === env && <Check className="w-3.5 h-3.5 text-[#4cd7f6]" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={() => onNavigate('ai-analysis')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#262a32] text-[#dfe2ed] text-xs font-medium hover:bg-[#31353d] transition-colors border border-[#3d494c]/40 shadow-sm"
            >
              <BrainCircuit className="w-4 h-4 text-[#4cd7f6]" />
              <span>Analyze Errors</span>
            </button>

            <button 
              onClick={() => onNavigate('upload-logs')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#06b6d4] text-[#00424f] text-xs font-semibold hover:bg-[#4cd7f6] transition-all shadow-md"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>+ Upload Log</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Quad Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Logs */}
        <div className="relative overflow-hidden rounded-xl bg-[#181c23] p-4 shadow-md transition-all hover:bg-[#1c2027] group border border-[#3d494c]/30">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-[#31353d] text-[#4cd7f6]">
              <Layers className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[11px] bg-[#4cd7f6]/10 text-[#4cd7f6] font-semibold">
              <TrendingUp className="w-3 h-3" />
              +14.2%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] font-semibold text-[#869397] uppercase tracking-wider">
              Total Logs
            </div>
            <div className="text-2xl font-bold text-[#dfe2ed] mt-0.5 font-mono">
              12,482
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#bcc9cd]">
            <span className="font-mono text-[11px] text-[#869397]">vs prev. upload</span>
            <svg className="w-20 h-6 text-[#4cd7f6]" fill="none" viewBox="0 0 100 28">
              <path d="M2 24 L18 20 L34 22 L50 14 L66 17 L82 8 L98 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Card 2: Errors */}
        <div className="relative overflow-hidden rounded-xl bg-[#181c23] p-4 shadow-md transition-all hover:bg-[#1c2027] group border border-[#3d494c]/30">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-[#31353d] text-[#ff5449]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[11px] bg-[#31353d] text-[#bcc9cd] font-semibold">
              <TrendingDown className="w-3 h-3 text-[#4cd7f6]" />
              -4.1%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] font-semibold text-[#869397] uppercase tracking-wider">
              Errors
            </div>
            <div className="text-2xl font-bold text-[#dfe2ed] mt-0.5 font-mono">
              326
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#bcc9cd]">
            <span className="font-mono text-[11px] text-[#869397]">18 auto-resolved</span>
            <svg className="w-20 h-6 text-[#ff5449]" fill="none" viewBox="0 0 100 28">
              <path d="M2 8 L20 12 L38 6 L56 16 L74 12 L92 20 L98 22" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Card 3: Warnings */}
        <div className="relative overflow-hidden rounded-xl bg-[#181c23] p-4 shadow-md transition-all hover:bg-[#1c2027] group border border-[#3d494c]/30">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-[#31353d] text-[#c0c1ff]">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[11px] bg-[#262a32] text-[#bcc9cd] font-semibold">
              <TrendingUp className="w-3 h-3 text-[#f59e0b]" />
              +1.8%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] font-semibold text-[#869397] uppercase tracking-wider">
              Warnings
            </div>
            <div className="text-2xl font-bold text-[#dfe2ed] mt-0.5 font-mono">
              1,842
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#bcc9cd]">
            <span className="font-mono text-[11px] text-[#869397]">Threshold within SLA</span>
            <svg className="w-20 h-6 text-[#c0c1ff]" fill="none" viewBox="0 0 100 28">
              <path d="M2 18 L22 14 L42 16 L62 10 L78 12 L98 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Card 4: Critical Issues */}
        <div className="relative overflow-hidden rounded-xl bg-[#181c23] p-4 shadow-md transition-all hover:bg-[#1c2027] group border border-[#93000a]/40 bg-gradient-to-br from-[#181c23] to-[#93000a]/10">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-[#93000a]/40 text-[#ffdad6]">
              <Flame className="w-5 h-5 text-[#ff5449]" />
            </div>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] bg-[#93000a] text-[#ffdad6] font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5449] animate-ping"></span>
              CRITICAL
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] font-semibold text-[#869397] uppercase tracking-wider">
              Critical Issues
            </div>
            <div className="text-2xl font-bold text-[#ff5449] mt-0.5 font-mono">
              12
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#bcc9cd]">
            <span className="font-mono text-[11px] text-[#ff5449]">+2 new since 10:00 AM</span>
            <svg className="w-20 h-6 text-[#ff5449]" fill="none" viewBox="0 0 100 28">
              <path d="M2 24 L22 24 L40 18 L55 22 L70 9 L88 4 L98 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Interactive Log Distribution & Telemetry Rate */}
      <div className="rounded-xl bg-[#181c23] p-5 shadow-md flex flex-col gap-4 border border-[#3d494c]/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-[#dfe2ed]">
                Log Distribution & Telemetry Rate
              </h2>
              <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-[#31353d] text-[#4cd7f6] font-semibold">
                SYNCHRONIZED
              </span>
            </div>
            <span className="text-xs text-[#869397]">
              Real-time breakdown across severity states with sliding window correlation
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Severity Legend */}
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <div className="flex items-center gap-1.5 text-[#bcc9cd]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]"></span>
                <span>INFO</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#bcc9cd]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]"></span>
                <span>WARNING</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#bcc9cd]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#F43F5E]"></span>
                <span>ERROR</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#bcc9cd]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#E11D48]"></span>
                <span>CRITICAL</span>
              </div>
            </div>

            {/* Range Switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-[#262a32] text-[#bcc9cd] font-mono text-xs border border-[#3d494c]/40">
              {(['1H', '6H', '24H', '7D'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    selectedRange === range 
                      ? 'bg-[#06b6d4] text-[#00424f] font-bold shadow-sm' 
                      : 'hover:text-[#dfe2ed]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Performance KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-[#0a0e15] border border-[#3d494c]/20">
          <div className="flex items-center justify-between sm:justify-start sm:gap-4">
            <span className="text-xs text-[#869397]">Peak Ingestion:</span>
            <span className="font-mono text-xs font-semibold text-[#4cd7f6]">420 logs/sec</span>
          </div>
          <div className="flex items-center justify-between sm:justify-start sm:gap-4">
            <span className="text-xs text-[#869397]">Error Ratio:</span>
            <span className="font-mono text-xs font-semibold text-[#ff5449]">2.61%</span>
          </div>
          <div className="flex items-center justify-between sm:justify-start sm:gap-4">
            <span className="text-xs text-[#869397]">Ingestion Latency:</span>
            <span className="font-mono text-xs font-semibold text-[#89ceff]">38ms</span>
          </div>
        </div>

        {/* Telemetry Histogram Graphic with interactive tooltip */}
        <div className="relative">
          {hoveredBarIndex !== null && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-lg bg-[#1c2027] border border-[#4cd7f6]/40 shadow-xl font-mono text-[11px] text-[#dfe2ed] flex items-center gap-3 pointer-events-none">
              <span className="text-[#869397]">{HISTOGRAM_DATA[hoveredBarIndex].timeLabel}:</span>
              <span className="text-[#38bdf8]">INFO: {HISTOGRAM_DATA[hoveredBarIndex].info}%</span>
              <span className="text-[#f59e0b]">WARN: {HISTOGRAM_DATA[hoveredBarIndex].warn}%</span>
              <span className="text-[#f43f5e]">ERR: {HISTOGRAM_DATA[hoveredBarIndex].error}%</span>
              <span className="text-[#e11d48]">CRIT: {HISTOGRAM_DATA[hoveredBarIndex].critical}%</span>
            </div>
          )}

          <div className="h-52 w-full flex items-end gap-1 sm:gap-1.5 pt-4 pb-2 px-1 overflow-x-auto select-none">
            {HISTOGRAM_DATA.map((bar, idx) => {
              const isHovered = hoveredBarIndex === idx;
              return (
                <div 
                  key={idx}
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  className={`flex-1 min-w-[12px] sm:min-w-[18px] flex flex-col justify-end gap-0.5 h-full cursor-pointer transition-all duration-150 ${
                    isHovered ? 'scale-y-[1.05] brightness-125' : 'hover:brightness-110'
                  }`}
                >
                  <div className="w-full bg-[#E11D48] rounded-t-sm" style={{ height: `${bar.critical}%` }} />
                  <div className="w-full bg-[#F43F5E]" style={{ height: `${bar.error}%` }} />
                  <div className="w-full bg-[#F59E0B]" style={{ height: `${bar.warn}%` }} />
                  <div className="w-full bg-[#38BDF8] rounded-b-sm" style={{ height: `${bar.info}%` }} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between font-mono text-[11px] text-[#869397] px-1">
          <span>24h ago</span>
          <span>18h ago</span>
          <span>12h ago</span>
          <span>6h ago</span>
          <span className="text-[#4cd7f6] font-semibold">Just now</span>
        </div>
      </div>

      {/* Lower Split Section: Recent Files & Top Errors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Recent Log Files (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 rounded-xl bg-[#181c23] p-5 shadow-md border border-[#3d494c]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-[#4cd7f6]" />
              <h2 className="text-base font-semibold text-[#dfe2ed]">Recent Log Files</h2>
            </div>
            <button 
              onClick={() => onNavigate('log-files')}
              className="text-xs text-[#4cd7f6] hover:underline flex items-center gap-1 font-medium"
            >
              <span>View All Files</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Log Files Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="font-mono text-[10px] text-[#869397] uppercase tracking-wider bg-[#0a0e15]/60 border-b border-[#3d494c]/30">
                  <th className="py-2.5 px-3 rounded-l">File Name</th>
                  <th className="py-2.5 px-2">Uploaded</th>
                  <th className="py-2.5 px-2">Size</th>
                  <th className="py-2.5 px-2">Logs</th>
                  <th className="py-2.5 px-2">Errors</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-3 text-right rounded-r">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3d494c]/20 font-mono text-xs">
                {files.slice(0, 4).map((file) => (
                  <tr key={file.id} className="hover:bg-[#1c2027] transition-colors group">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-[#869397] group-hover:text-[#4cd7f6] transition-colors" />
                        <span className="font-semibold text-[#dfe2ed]">{file.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[#bcc9cd] font-sans">{file.uploadedAt}</td>
                    <td className="py-3 px-2 text-[#869397]">{file.size}</td>
                    <td className="py-3 px-2 text-[#dfe2ed]">{file.logCount.toLocaleString()}</td>
                    <td className="py-3 px-2 font-semibold text-[#ff5449]">{file.errorCount}</td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] bg-[#4cd7f6]/10 text-[#4cd7f6] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
                        {file.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleInspectFile(file)}
                          className="p-1 rounded hover:bg-[#262a32] text-[#bcc9cd] hover:text-[#4cd7f6] transition-colors" 
                          title="View Logs"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAnalyzeFile(file)}
                          className="p-1 rounded hover:bg-[#262a32] text-[#bcc9cd] hover:text-[#4cd7f6] transition-colors" 
                          title="AI Diagnosis"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Upload Dropzone Target */}
          <div 
            onClick={() => onNavigate('upload-logs')}
            className="mt-1 p-3.5 rounded-lg bg-[#0a0e15]/80 border border-[#3d494c]/30 hover:border-[#4cd7f6]/50 flex items-center justify-between text-[#bcc9cd] hover:text-[#dfe2ed] hover:bg-[#1c2027] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <UploadCloud className="w-6 h-6 text-[#4cd7f6] group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#dfe2ed]">
                  Drop syslog, json or plaintext files here
                </span>
                <span className="font-mono text-[10px] text-[#869397]">
                  Supports gzip, .log, .ndjson up to 250MB
                </span>
              </div>
            </div>
            <span className="text-[11px] uppercase px-2.5 py-1 rounded bg-[#262a32] text-[#4cd7f6] font-semibold border border-[#4cd7f6]/20 group-hover:bg-[#4cd7f6] group-hover:text-[#00424f] transition-all">
              Browse
            </span>
          </div>
        </div>

        {/* Right Column: Top Recurring Errors (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl bg-[#181c23] p-5 shadow-md border border-[#3d494c]/30">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-[#ff5449]" />
                <h2 className="text-base font-semibold text-[#dfe2ed]">Top Recurring Errors</h2>
              </div>
              <span className="font-mono text-[10px] text-[#869397]">Correlated Fingerprints</span>
            </div>

            {/* Error Cards Matrix */}
            <div className="flex flex-col gap-2.5">
              {errors.slice(0, 4).map((err) => (
                <div 
                  key={err.id}
                  onClick={() => handleSelectError(err)}
                  className="p-3 rounded-lg bg-[#1c2027] hover:bg-[#262a32] border border-[#3d494c]/20 hover:border-[#4cd7f6]/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-tight shrink-0 ${
                        err.severity === 'CRITICAL' ? 'bg-[#93000a] text-[#ffdad6]' :
                        err.severity === 'HIGH' ? 'bg-[#ff5449]/15 text-[#ff5449]' :
                        'bg-[#31353d] text-[#c0c1ff]'
                      }`}>
                        {err.severity}
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#dfe2ed] group-hover:text-[#4cd7f6] transition-colors truncate">
                        {err.name}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#0a0e15] text-[#869397] shrink-0">
                      {err.count}x
                    </span>
                  </div>

                  <p className="mt-1 font-mono text-[11px] text-[#bcc9cd] truncate">
                    {err.message}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] text-[#869397]">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff]"></span>
                      {err.service}
                    </span>
                    <span>{err.lastSeen}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button Footer */}
          <button 
            onClick={() => onNavigate('error-explorer')}
            className="mt-4 w-full py-2.5 px-3 rounded-lg bg-[#262a32] hover:bg-[#31353d] text-[#dfe2ed] text-xs font-medium flex items-center justify-center gap-2 transition-all border border-[#3d494c]/40"
          >
            <span>View all 18 error groups</span>
            <ArrowRight className="w-4 h-4 text-[#4cd7f6]" />
          </button>
        </div>
      </div>
    </div>
  );
};
