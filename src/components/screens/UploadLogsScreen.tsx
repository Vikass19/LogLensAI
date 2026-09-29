import React, { useState } from 'react';
import { 
  Check, 
  Terminal, 
  ArrowUp, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Gauge, 
  Zap, 
  ShieldCheck,
  FileCode,
  Sparkles
} from 'lucide-react';
import { IngestionFile } from '../../types/telemetry';

interface UploadLogsScreenProps {
  onNavigate: (path: string, options?: { file?: string }) => void;
  onAddFile: (file: IngestionFile) => void;
}

export const UploadLogsScreen: React.FC<UploadLogsScreenProps> = ({
  onNavigate,
  onAddFile,
}) => {
  const [activeFileName, setActiveFileName] = useState('application.log');
  const [progress, setProgress] = useState(72);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [currentStep, setCurrentStep] = useState(2);

  const handleFileUpload = (file: File) => {
    setActiveFileName(file.name);
    setProgress(15);
    setIsProcessing(true);
    setCurrentStep(2);

    const fileSizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    // Simulate pipeline stages
    setTimeout(() => setProgress(45), 300);
    setTimeout(() => setProgress(72), 700);
    setTimeout(() => {
      setProgress(100);
      setIsProcessing(false);
      setCurrentStep(3);
      onAddFile({
        id: `f-${Date.now()}`,
        name: file.name,
        uploadedAt: 'Just now',
        size: fileSizeStr,
        bytes: file.size,
        logCount: Math.floor(file.size / 350) + 120,
        errorCount: Math.floor(Math.random() * 40) + 5,
        status: 'Analyzed',
        description: 'Uploaded via Web Telemetry Pipeline'
      });
    }, 1200);
  };

  const handleSampleSelect = (name: string, size: string) => {
    setActiveFileName(name);
    setProgress(72);
    setIsProcessing(true);
    setCurrentStep(2);
    setTimeout(() => {
      setProgress(100);
      setIsProcessing(false);
      setCurrentStep(4);
    }, 800);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 pb-16">
        {/* Header Title Section */}
        <div className="flex flex-col gap-1.5 relative">
          <div className="inline-flex items-center gap-2 self-start px-2 py-0.5 rounded bg-[#262a32] text-[#4cd7f6] font-mono text-xs uppercase tracking-wider mb-1 border border-[#4cd7f6]/20">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
            Telemetry Pipeline // Stage 02
          </div>
          <h1 className="text-2xl sm:text-3xl text-[#dfe2ed] tracking-tight font-bold">
            Upload Log File
          </h1>
          <p className="text-sm text-[#bcc9cd] max-w-2xl leading-relaxed">
            Upload an application log file to start analyzing your system with autonomous AI diagnostics and telemetry root-cause extraction.
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="bg-[#181c23] rounded-xl p-5 shadow-sm border border-[#3d494c]/30">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
            {/* Step 1 (Completed) */}
            <div className="flex flex-col gap-2 relative">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] font-mono text-xs font-semibold">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
                <span className="text-xs text-[#dfe2ed] font-semibold">1. Select File</span>
              </div>
              <div className="h-1 w-full bg-[#4cd7f6] rounded-full"></div>
              <span className="font-mono text-[11px] text-[#869397] truncate">{activeFileName}</span>
            </div>

            {/* Step 2 (Active/Current) */}
            <div className="flex flex-col gap-2 relative">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4cd7f6] text-[#00424f] font-mono text-xs font-bold shadow-sm">
                  2
                </span>
                <span className="text-xs text-[#4cd7f6] font-semibold">Parsing & Chunking</span>
              </div>
              <div className="h-1 w-full bg-[#31353d] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#4cd7f6] transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="font-mono text-[11px] text-[#4cd7f6]">
                {progress === 100 ? 'Completed (100%)' : `In progress (${progress}%)`}
              </span>
            </div>

            {/* Step 3 (Pending/Active) */}
            <div className={`flex flex-col gap-2 relative ${progress === 100 ? 'opacity-100' : 'opacity-60'}`}>
              <div className="flex items-center gap-2">
                <span className={`flex items-center justify-center w-6 h-6 rounded-full font-mono text-xs font-semibold ${
                  progress === 100 ? 'bg-[#4cd7f6] text-[#00424f] font-bold' : 'bg-[#262a32] text-[#869397]'
                }`}>
                  3
                </span>
                <span className="text-xs text-[#dfe2ed]">Error Classification</span>
              </div>
              <div className={`h-1 w-full rounded-full ${progress === 100 ? 'bg-[#4cd7f6]' : 'bg-[#31353d]'}`}></div>
              <span className="font-mono text-[11px] text-[#869397]">
                {progress === 100 ? 'Correlating' : 'Queued'}
              </span>
            </div>

            {/* Step 4 (Pending) */}
            <div className="flex flex-col gap-2 relative opacity-60">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#262a32] text-[#869397] font-mono text-xs font-semibold">
                  4
                </span>
                <span className="text-xs text-[#dfe2ed]">AI Diagnosis</span>
              </div>
              <div className="h-1 w-full bg-[#31353d] rounded-full"></div>
              <span className="font-mono text-[11px] text-[#869397]">Ready for analysis</span>
            </div>
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('logFileInput')?.click()}
          className={`
            group relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-xl transition-all duration-200 cursor-pointer shadow-md overflow-hidden text-center border-2 border-dashed
            ${isDragging 
              ? 'bg-[#262a32] border-[#4cd7f6]' 
              : 'bg-[#0a0e15] border-[#3d494c]/40 hover:bg-[#181c23] hover:border-[#4cd7f6]/60'
            }
          `}
        >
          <input 
            type="file" 
            id="logFileInput" 
            accept=".log,.txt,.json,.gz" 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {/* Concentric Aura Decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4cd7f6]/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* Icon Container */}
          <div className="relative w-16 h-16 rounded-full bg-[#1c2027] border border-[#3d494c]/40 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200 shadow-sm">
            <Terminal className="w-8 h-8 text-[#4cd7f6]" />
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#06b6d4] text-[#00424f] flex items-center justify-center shadow-sm">
              <ArrowUp className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          <h3 className="text-base sm:text-lg text-[#dfe2ed] font-medium mb-1">
            Drag & drop your log file here
          </h3>
          <p className="text-xs sm:text-sm text-[#869397] mb-4">
            or click to browse from your workstation
          </p>

          {/* Badges row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#1c2027] text-[#bcc9cd] font-medium border border-[#3d494c]/30">.log</span>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#1c2027] text-[#bcc9cd] font-medium border border-[#3d494c]/30">.txt</span>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#1c2027] text-[#bcc9cd] font-medium border border-[#3d494c]/30">.json</span>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#1c2027] text-[#bcc9cd] font-medium border border-[#3d494c]/30">.gz</span>
          </div>

          <p className="text-xs text-[#869397] max-w-sm">
            Maximum file size: <span className="text-[#dfe2ed] font-medium">10 MB</span> (Enterprise plan supports up to 2 GB via CLI / Agent)
          </p>
        </div>

        {/* Quick Sample Files to Try */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-[#869397]">
          <span>Try quick sample streams:</span>
          <button 
            type="button"
            onClick={() => handleSampleSelect('application.log', '4.2 MB')}
            className="px-2.5 py-1 rounded bg-[#1c2027] hover:bg-[#262a32] text-[#4cd7f6] font-mono border border-[#4cd7f6]/20 transition-colors"
          >
            application.log (PostgreSQL connection pool exhaust)
          </button>
          <button 
            type="button"
            onClick={() => handleSampleSelect('server.log', '2.1 MB')}
            className="px-2.5 py-1 rounded bg-[#1c2027] hover:bg-[#262a32] text-[#c0c1ff] font-mono border border-[#3d494c]/40 transition-colors"
          >
            server.log (Node.js runtime errors)
          </button>
        </div>

        {/* Active Ingestion & Progress Card */}
        <div className="bg-[#1c2027] rounded-xl p-5 sm:p-6 shadow-md flex flex-col gap-5 relative overflow-hidden border border-[#3d494c]/30">
          {/* Glow ambient accent */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#4cd7f6]/10 rounded-full blur-3xl pointer-events-none" />

          {/* File Meta Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#262a32] flex items-center justify-center text-[#4cd7f6] shadow-sm border border-[#3d494c]/40">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-[#dfe2ed] tracking-tight font-mono">
                    {activeFileName}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] font-mono text-[10px] font-semibold border border-[#4cd7f6]/20">
                    STREAM ACTIVE
                  </span>
                </div>
                <span className="font-mono text-xs text-[#869397]">
                  4.2 MB • Ingestion Session #TRC-89024
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-[#4cd7f6] font-bold">
                {progress}%
              </span>
              <button 
                onClick={() => setProgress(0)}
                className="p-1 text-[#869397] hover:text-[#dfe2ed] transition-colors" 
                title="Cancel upload"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Meter */}
          <div className="flex flex-col gap-1.5">
            <div className="h-2 w-full bg-[#0a0e15] rounded-full overflow-hidden p-0.5 border border-[#3d494c]/40">
              <div 
                className="h-full bg-gradient-to-r from-[#06b6d4] to-[#89ceff] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-[#869397]">
              <span>Processed {(4.2 * (progress / 100)).toFixed(2)} MB of 4.20 MB</span>
              <span>Throughput: ~18.4 MB/s</span>
            </div>
          </div>

          {/* Telemetry Checklist (4 Cards Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#181c23] border border-[#3d494c]/20">
              <CheckCircle2 className="w-4 h-4 text-[#4cd7f6] shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#dfe2ed]">File uploaded successfully</span>
                <span className="font-mono text-[10px] text-[#869397]">Verified payload hash (1.2s)</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#181c23] border border-[#3d494c]/20">
              <CheckCircle2 className="w-4 h-4 text-[#4cd7f6] shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#dfe2ed]">12,482 log lines parsed</span>
                <span className="font-mono text-[10px] text-[#869397]">Normalized to OpenTelemetry ECS (0.8s)</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#181c23] border border-[#ff5449]/20">
              <AlertTriangle className="w-4 h-4 text-[#ff5449] shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#dfe2ed]">326 Errors detected</span>
                <span className="font-mono text-[10px] text-[#869397]">Spanning 4 microservices (auth, db, gateway, sync)</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#181c23] border border-[#89ceff]/20">
              <Loader2 className="w-4 h-4 text-[#89ceff] shrink-0 mt-0.5 animate-spin" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#89ceff] flex items-center gap-1.5">
                  AI root-cause preparing...
                </span>
                <span className="font-mono text-[10px] text-[#869397]">Building vector embeddings & correlations</span>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#3d494c]/20">
            <div className="flex items-center gap-2 text-xs text-[#869397]">
              <Gauge className="w-4 h-4 text-[#4cd7f6]" />
              <span>
                Auto-parsing active • Parser mode: <strong className="text-[#dfe2ed] font-mono">Nginx/Node.js JSON</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 rounded-lg bg-[#262a32] hover:bg-[#31353d] text-[#dfe2ed] text-xs font-medium transition-colors"
              >
                Cancel
              </button>

              <button 
                onClick={() => onNavigate('ai-analysis', { file: activeFileName })}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#3131c0] hover:brightness-110 text-white text-xs font-semibold transition-all shadow-md group"
              >
                <Zap className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
                <span>Analyze Logs</span>
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & SOC2 Compliance Banner */}
        <div className="bg-[#181c23] rounded-xl p-4 sm:p-5 shadow-sm flex items-start gap-4 border border-[#3d494c]/30">
          <div className="w-8 h-8 rounded-full bg-[#262a32] border border-[#4cd7f6]/30 flex items-center justify-center shrink-0 text-[#4cd7f6]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#dfe2ed]">Zero-Retention Privacy Guarantee</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#262a32] text-[#869397] uppercase font-semibold border border-[#3d494c]/40">
                SOC2 Type II
              </span>
            </div>
            <p className="text-xs text-[#869397] leading-relaxed">
              Your telemetry streams and application dumps are dynamically scrubbed of API keys, Bearer tokens, passwords, and PII prior to AI model vectorization. All contextual indices are retained for 30 days under enterprise-grade encryption before automated decommissioning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
