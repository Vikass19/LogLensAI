import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  MemoryStick, 
  Flame, 
  History, 
  AlertCircle, 
  GitCommit, 
  BrainCircuit, 
  CheckCircle2, 
  VolumeX, 
  Share2, 
  AlertOctagon, 
  Code, 
  Copy, 
  Network, 
  TimerOff, 
  Link2Off, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  Database, 
  GitBranch, 
  HelpCircle,
  FileCode,
  Check
} from 'lucide-react';
import { CORRELATED_INCIDENTS, REMEDIATION_STEPS, INITIAL_CHAT_MESSAGES, TOP_ERRORS } from '../../data/mockTelemetry';
import { ChatMessage, ErrorGroup } from '../../types/telemetry';

interface AiAnalysisScreenProps {
  onNavigate: (path: string) => void;
  selectedErrorId?: string;
}

export const AiAnalysisScreen: React.FC<AiAnalysisScreenProps> = ({
  onNavigate,
  selectedErrorId,
}) => {
  const currentError = TOP_ERRORS.find(e => e.id === selectedErrorId) || TOP_ERRORS[0];

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isResolved, setIsResolved] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = (customText || chatInput).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      authorName: 'Sarah Jenkins',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: query
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customText) setChatInput('');
    setIsTyping(true);

    // Formulate AI response
    setTimeout(() => {
      let aiReply = `Analyzed request: Generating context-aware resolution for "${query}" based on production pool parameters. Patch verified against PostgreSQL 15 dialect.`;

      const lower = query.toLowerCase();
      if (lower.includes('sql') || lower.includes('migration') || lower.includes('index')) {
        aiReply = `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_session_token ON users (session_token);\n\n-- Running with CONCURRENTLY avoids table locking during live peak traffic. Estimated completion: ~14s on 2.4M rows.`;
      } else if (lower.includes('terraform') || lower.includes('pr') || lower.includes('pool')) {
        aiReply = `Generated Terraform HCL commit:\n\`\`\`hcl\nresource "aws_db_parameter_group" "pg15_prod" {\n  parameter {\n    name  = "max_connections"\n    value = "250"\n  }\n}\n\`\`\`\nPull Request branch ready: git checkout -b fix/pg-pool-scaling`;
      } else if (lower.includes('explain') || lower.includes('stack')) {
        aiReply = `Frame #1 in database/connect.py:42 called get_connection_pool(). The pool controller attempted to acquire a connection handle with a 5000ms deadline. Because all 50 worker slots were occupied by unindexed queries, it threw DatabaseConnectionError (PG_ERR_53300).`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        authorName: 'LogLens AI Co-Pilot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: aiReply
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleExportDiagnostics = () => {
    const payload = {
      incidentId: currentError.errorCode,
      error: currentError.name,
      severity: currentError.severity,
      occurrences: currentError.count,
      impactedUsers: currentError.impactedUsers,
      environment: currentError.cluster,
      p99Latency: currentError.p99Latency,
      release: currentError.release,
      rootCause: "PostgreSQL connection pool exhausted (max 50) due to unindexed session query and traffic spike",
      remediationPlan: REMEDIATION_STEPS
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-${currentError.errorCode}-diagnostics.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stackCode = `DatabaseConnectionError: Unable to connect to PostgreSQL: connection refused at 10.0.12.4:5432
  at database/connect.py:42 in get_connection_pool
  at services/user_service.py:87 in query_user_profile
  at api/routes.py:31 in handle_auth_request
  at starlette/middleware/base.py:125 in call_next`;

  return (
    <div className="flex flex-col w-full gap-5 pb-16">
      {/* Top Command Scrim & Header */}
      <div className="flex flex-col gap-4">
        {/* Breadcrumb & Telemetry Tickers */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-xs">
            <button 
              onClick={() => onNavigate('error-explorer')}
              className="text-[#869397] hover:text-[#dfe2ed] transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Error Explorer</span>
            </button>
            <span className="text-[#3d494c]">/</span>
            <span className="text-[#4cd7f6] font-medium">{currentError.errorCode}</span>
            <span className="text-[#3d494c]">/</span>
            <span className="text-[#dfe2ed] font-semibold">{currentError.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#262a32] text-[#bcc9cd] font-mono text-xs border border-[#3d494c]/40">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5449] animate-ping"></span>
              <span>SLA Breach Risk: <strong className="text-[#ff5449] font-semibold">Elevated</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#262a32] text-[#bcc9cd] font-mono text-xs border border-[#3d494c]/40">
              <BrainCircuit className="w-3.5 h-3.5 text-[#89ceff]" />
              <span>Engine: <span className="text-[#dfe2ed] font-medium">LogLens-Neural-v4.2</span></span>
            </div>
          </div>
        </div>

        {/* Title, Badges & High-Context Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#181c23] p-5 rounded-xl shadow-md border border-[#3d494c]/30">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl text-[#dfe2ed] tracking-tight font-bold font-mono">
                {currentError.name}
              </h1>
              
              {/* Critical Badge with Ping */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#93000a]/40 text-[#ff5449] font-mono text-xs font-bold tracking-wide border border-[#ff5449]/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5449] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5449]"></span>
                </span>
                <span>{currentError.severity}</span>
              </div>

              {/* Occurrences Badge */}
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#262a32] text-[#c0c1ff] font-mono text-xs font-semibold border border-[#3d494c]/40">
                <Sparkles className="w-3 h-3" />
                <span>{currentError.count} occurrences</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 font-mono text-xs text-[#869397]">
              <div className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>First Seen: <span className="text-[#dfe2ed] font-medium">{currentError.firstSeen}</span></span>
              </div>
              <span className="text-[#3d494c]">•</span>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#ff5449]" />
                <span>Last Seen: <span className="text-[#ff5449] font-medium">{currentError.lastSeen}</span></span>
              </div>
              <span className="text-[#3d494c]">•</span>
              <div className="flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5" />
                <span>Release: <span className="text-[#dfe2ed] font-mono">{currentError.release}</span></span>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => {
                const el = document.getElementById('chatInput');
                el?.focus();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#06b6d4] text-[#00424f] hover:bg-[#4cd7f6] text-xs font-semibold transition-all shadow-md"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Ask AI Custom Query</span>
            </button>
            <button 
              onClick={() => setIsResolved(!isResolved)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                isResolved 
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' 
                  : 'bg-[#262a32] text-[#dfe2ed] hover:bg-[#31353d] border-[#3d494c]/40'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-[#89ceff]" />
              <span>{isResolved ? 'Resolved' : 'Mark Resolved'}</span>
            </button>
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                isMuted 
                  ? 'bg-amber-950/40 text-amber-300 border-amber-500/40' 
                  : 'bg-[#262a32] text-[#869397] hover:text-[#dfe2ed] hover:bg-[#31353d] border-[#3d494c]/40'
              }`}
            >
              <VolumeX className="w-4 h-4" />
              <span>{isMuted ? 'Muted' : 'Mute Alert'}</span>
            </button>
            <button 
              onClick={handleExportDiagnostics}
              className="p-2 rounded-lg bg-[#262a32] text-[#869397] hover:text-[#dfe2ed] hover:bg-[#31353d] transition-colors border border-[#3d494c]/40" 
              title="Export Diagnostics JSON"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Split Diagnostic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN (7 cols): Diagnostics & Telemetry Matrices */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* 1. Incident Synopsis Card */}
          <div className="flex flex-col bg-[#181c23] rounded-xl p-5 shadow-sm gap-4 border border-[#3d494c]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-[#ff5449]" />
                <span className="text-base font-semibold text-[#dfe2ed]">Incident Synopsis</span>
              </div>
              <span className="font-mono text-xs text-[#869397] uppercase tracking-wider">
                Telemetry Signature: 0x8F9B
              </span>
            </div>

            {/* Raw Error Message Highlight Box */}
            <div className="bg-[#0a0e15] p-3.5 rounded-lg flex items-start gap-3 border border-[#3d494c]/30">
              <AlertCircle className="w-4 h-4 text-[#ff5449] mt-0.5 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-semibold text-[#869397] uppercase tracking-wider font-mono">
                  Uncaught Exception String
                </span>
                <p className="font-mono text-xs sm:text-sm text-[#ff5449] font-medium break-all select-all mt-0.5">
                  {currentError.message}
                </p>
              </div>
            </div>

            {/* Telemetry Data Grid (4 Key Nodes) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#1c2027] p-3 rounded-lg flex flex-col justify-between gap-1 border border-[#3d494c]/20">
                <span className="text-[11px] text-[#869397] truncate">Total Occurrences</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-[#dfe2ed] font-mono">{currentError.count}</span>
                  <span className="font-mono text-[10px] text-[#ff5449]">{currentError.rateChange}</span>
                </div>
                <svg className="w-full h-5 text-[#ff5449] mt-1" fill="none" preserveAspectRatio="none" viewBox="0 0 100 24">
                  <path d="M0 20 L15 19 L30 18 L45 16 L60 12 L75 8 L90 3 L100 1" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                  <polygon fill="currentColor" fillOpacity="0.15" points="0,20 15,19 30,18 45,16 60,12 75,8 90,3 100,1 100,24 0,24" />
                </svg>
              </div>

              <div className="bg-[#1c2027] p-3 rounded-lg flex flex-col justify-between gap-1 border border-[#3d494c]/20">
                <span className="text-[11px] text-[#869397] truncate">Impacted Users</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-[#dfe2ed] font-mono">{currentError.impactedUsers}</span>
                  <span className="font-mono text-[10px] text-[#869397]">Sessions</span>
                </div>
                <svg className="w-full h-5 text-[#c0c1ff] mt-1" fill="none" preserveAspectRatio="none" viewBox="0 0 100 24">
                  <path d="M0 22 L20 20 L40 18 L60 14 L80 9 L100 4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
              </div>

              <div className="bg-[#1c2027] p-3 rounded-lg flex flex-col justify-between gap-1 border border-[#3d494c]/20">
                <span className="text-[11px] text-[#869397] truncate">Affected Service</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[#4cd7f6] truncate">{currentError.service}</span>
                  <span className="font-mono text-[10px] text-[#869397] truncate">srv-api-prod-8f4b</span>
                </div>
                <div className="h-1.5 w-full bg-[#262a32] rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-[#ff5449] w-4/5 rounded-full"></div>
                </div>
              </div>

              <div className="bg-[#1c2027] p-3 rounded-lg flex flex-col justify-between gap-1 border border-[#3d494c]/20">
                <span className="text-[11px] text-[#869397] truncate">Host Environment</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[#dfe2ed] truncate">EKS Cluster</span>
                  <span className="font-mono text-[10px] text-[#89ceff] truncate">prod-us-east-1a</span>
                </div>
                <span className="font-mono text-[9px] text-[#869397] truncate mt-1">Node: ip-10-0-12-192</span>
              </div>
            </div>

            {/* Telemetry Ingestion Rate Strip */}
            <div className="flex flex-wrap items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#0a0e15] font-mono text-xs border border-[#3d494c]/30 gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                <span className="text-[#bcc9cd]">Live Socket Status: Refusal storm active</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#869397]">P99 Pool Latency: <span className="text-[#ff5449] font-medium">{currentError.p99Latency}</span></span>
                <span className="text-[#869397]">TCP Retransmits: <span className="text-[#dfe2ed] font-medium">18.4%</span></span>
              </div>
            </div>
          </div>

          {/* 2. Interactive Stack Trace Viewer */}
          <div className="flex flex-col bg-[#181c23] rounded-xl overflow-hidden shadow-sm border border-[#3d494c]/30">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[#1c2027] border-b border-[#3d494c]/30">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#c0c1ff]" />
                <span className="text-sm sm:text-base font-semibold text-[#dfe2ed]">Active Call Stack</span>
                <span className="px-2 py-0.5 rounded bg-[#262a32] text-[#869397] font-mono text-[10px] border border-[#3d494c]/30">
                  Python 3.11.8 AsyncIO
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => copyToClipboard(stackCode, 'main-stack')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#262a32] hover:bg-[#31353d] text-[#bcc9cd] hover:text-[#dfe2ed] font-mono text-xs transition-colors border border-[#3d494c]/40"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === 'main-stack' ? 'Copied!' : 'Copy Stack'}</span>
                </button>
              </div>
            </div>

            {/* Code Block Container */}
            <div className="bg-[#0a0e15] p-4 sm:p-5 font-mono text-xs overflow-x-auto select-text leading-relaxed">
              <div className="flex flex-col gap-1.5">
                {/* Exception Header Line */}
                <div className="flex items-start gap-3 text-[#ff5449] font-semibold pb-2 mb-2 bg-[#93000a]/20 p-2.5 rounded border border-[#ff5449]/30">
                  <span className="text-[#869397] select-none font-normal">#</span>
                  <div className="flex-1">
                    <span className="text-[#ff5449] font-bold">DatabaseConnectionError:</span> Unable to connect to PostgreSQL: connection refused at 10.0.12.4:5432
                  </div>
                </div>

                {/* Frame 1: Root Trigger */}
                <div className="group flex items-start gap-4 p-2 rounded hover:bg-[#1c2027] transition-colors">
                  <span className="text-[#869397] select-none text-[11px] pt-0.5">01</span>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <span className="text-[#869397]">at </span>
                      <span className="text-[#4cd7f6] font-medium">database/connect.py</span>
                      <span className="text-[#869397]">:</span>
                      <span className="text-[#c0c1ff] font-bold">42</span>
                      <span className="text-[#869397]"> in </span>
                      <span className="text-[#dfe2ed] font-semibold">get_connection_pool</span>
                    </div>
                    <span className="text-[#869397] text-[11px] group-hover:text-[#4cd7f6] transition-colors">
                      pool.acquire(timeout=5.0)
                    </span>
                  </div>
                </div>

                {/* Frame 2: Caller */}
                <div className="group flex items-start gap-4 p-2 rounded hover:bg-[#1c2027] transition-colors">
                  <span className="text-[#869397] select-none text-[11px] pt-0.5">02</span>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <span className="text-[#869397]">at </span>
                      <span className="text-[#bcc9cd]">services/user_service.py</span>
                      <span className="text-[#869397]">:</span>
                      <span className="text-[#c0c1ff] font-bold">87</span>
                      <span className="text-[#869397]"> in </span>
                      <span className="text-[#dfe2ed] font-semibold">query_user_profile</span>
                    </div>
                    <span className="text-[#869397] text-[11px]">
                      await db.fetch_one(stmt)
                    </span>
                  </div>
                </div>

                {/* Frame 3: HTTP Route Entry */}
                <div className="group flex items-start gap-4 p-2 rounded hover:bg-[#1c2027] transition-colors">
                  <span className="text-[#869397] select-none text-[11px] pt-0.5">03</span>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <span className="text-[#869397]">at </span>
                      <span className="text-[#bcc9cd]">api/routes.py</span>
                      <span className="text-[#869397]">:</span>
                      <span className="text-[#c0c1ff] font-bold">31</span>
                      <span className="text-[#869397]"> in </span>
                      <span className="text-[#dfe2ed] font-semibold">handle_auth_request</span>
                    </div>
                    <span className="text-[#869397] text-[11px]">
                      return await next(ctx)
                    </span>
                  </div>
                </div>

                {/* Frame 4: ASGI Middleware */}
                <div className="group flex items-start gap-4 p-2 rounded hover:bg-[#1c2027] transition-colors opacity-70">
                  <span className="text-[#869397] select-none text-[11px] pt-0.5">04</span>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <span className="text-[#869397]">at </span>
                      <span className="text-[#869397]">starlette/middleware/base.py</span>
                      <span className="text-[#869397]">:</span>
                      <span className="text-[#869397]">125</span>
                      <span className="text-[#869397]"> in </span>
                      <span className="text-[#869397]">call_next</span>
                    </div>
                    <span className="text-[#869397] text-[11px]">
                      response = await coroutine
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Similar Errors Cluster */}
          <div className="flex flex-col bg-[#181c23] rounded-xl p-5 shadow-sm gap-4 border border-[#3d494c]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-[#89ceff]" />
                <h3 className="text-base font-semibold text-[#dfe2ed]">
                  Correlated Incidents & Clustering
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#262a32] text-[#89ceff] font-mono text-[11px] font-medium border border-[#89ceff]/30">
                Embedding Affinity &gt; 91%
              </span>
            </div>
            
            <p className="text-xs text-[#bcc9cd] leading-relaxed">
              LogLens pattern engine detected 2 adjacent anomalies across the same VPC partition sharing similar connection state signatures.
            </p>

            <div className="flex flex-col gap-2.5">
              {CORRELATED_INCIDENTS.map((cluster) => (
                <div 
                  key={cluster.id}
                  onClick={() => onNavigate('error-explorer')}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-[#1c2027] hover:bg-[#262a32] border border-[#3d494c]/20 hover:border-[#4cd7f6]/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <TimerOff className="w-4 h-4 text-[#ff5449] mt-0.5 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-xs font-semibold text-[#dfe2ed] group-hover:text-[#4cd7f6] transition-colors truncate">
                        {cluster.name}
                      </span>
                      <span className="text-xs text-[#869397] mt-0.5">
                        Triggered by <code className="text-[#bcc9cd] font-mono">{cluster.service}</code> • {cluster.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0a0e15] text-[#c0c1ff] font-semibold border border-[#3d494c]/40">
                      {cluster.eventsCount} events
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#869397] group-hover:text-[#dfe2ed]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): AI Diagnostic & Remediation Engine */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* AI Root Cause Intelligence Panel */}
          <div className="flex flex-col bg-[#181c23] rounded-xl shadow-xl overflow-hidden relative border border-[#3d494c]/30">
            {/* Top gradient glow rim */}
            <div className="h-1 w-full bg-gradient-to-r from-[#4cd7f6] via-[#89ceff] to-[#c0c1ff]" />

            {/* Header banner */}
            <div className="p-5 pb-4 flex flex-col gap-3 bg-[#1c2027]/70 border-b border-[#3d494c]/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-[#06b6d4] text-[#00424f] flex items-center justify-center shadow-md">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-bold text-[#dfe2ed] tracking-tight">
                    AI Root Cause Analysis
                  </h2>
                </div>
                <span className="flex items-center gap-1 font-mono text-[11px] text-[#4cd7f6] font-semibold bg-[#4cd7f6]/10 px-2 py-0.5 rounded border border-[#4cd7f6]/20">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  <span>Autonomous</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#89ceff]"></span>
                  <span className="text-xs text-[#bcc9cd]">
                    Analysis Complete <span className="text-[#869397]">(1.4s via Claude 3.5 Sonnet)</span>
                  </span>
                </div>

                {/* Gauge / Confidence Indicator */}
                <div className="flex items-center gap-2 bg-[#262a32] px-2.5 py-1 rounded-md border border-[#3d494c]/40">
                  <span className="text-[10px] font-semibold text-[#869397] uppercase">Confidence</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-2 bg-[#0a0e15] rounded-full overflow-hidden">
                      <div className="w-[94%] h-full bg-[#4cd7f6] rounded-full"></div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#4cd7f6]">94%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-5">
              {/* SECTION 1: Identified Mechanism */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#4cd7f6]" />
                  <span className="text-[11px] uppercase tracking-wider text-[#869397] font-semibold">
                    Identified Mechanism
                  </span>
                </div>
                <div className="bg-[#1c2027] p-3.5 rounded-lg text-[#dfe2ed] text-xs leading-relaxed border border-[#3d494c]/20">
                  The application exhausted its PostgreSQL connection pool due to long-running unindexed queries in 
                  <code className="mx-1 px-1.5 py-0.5 rounded bg-[#0a0e15] text-[#4cd7f6] font-mono text-[11px]">
                    query_user_profile
                  </code>, 
                  compounded by a sudden traffic spike of <strong className="text-[#89ceff] font-semibold">4,200 req/min</strong>. The pool reached its hard limit of 50 connections, refusing subsequent queries.
                </div>
              </div>

              {/* SECTION 2: Engineered Remediation Plan */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c0c1ff]" />
                    <span className="text-[11px] uppercase tracking-wider text-[#869397] font-semibold">
                      Engineered Remediation Plan
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#89ceff]">4 Sequential Actions</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3 bg-[#1c2027] p-3 rounded-lg border border-[#3d494c]/20">
                    <span className="h-5 w-5 rounded-full bg-[#262a32] text-[#4cd7f6] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#3d494c]/40">
                      1
                    </span>
                    <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                      <span className="text-xs font-medium text-[#dfe2ed]">
                        Increase the connection pool size in <code className="text-[#4cd7f6] font-mono">database/config.py</code>:
                      </span>
                      <div className="bg-[#0a0e15] p-2 rounded font-mono text-[11px] text-[#89ceff] flex items-center justify-between border border-[#3d494c]/30">
                        <code className="truncate">POOL_SIZE = os.getenv("DB_POOL_SIZE", 100) # was 50</code>
                        <button 
                          onClick={() => copyToClipboard('POOL_SIZE = os.getenv("DB_POOL_SIZE", 100)', 'step-1')}
                          className="text-[#869397] hover:text-[#dfe2ed] ml-2 shrink-0 p-1"
                          title="Copy snippet"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3 bg-[#1c2027] p-3 rounded-lg border border-[#3d494c]/20">
                    <span className="h-5 w-5 rounded-full bg-[#262a32] text-[#4cd7f6] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#3d494c]/40">
                      2
                    </span>
                    <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                      <span className="text-xs font-medium text-[#dfe2ed]">
                        Implement aggressive statement timeouts to prevent hung worker slots:
                      </span>
                      <div className="bg-[#0a0e15] p-2 rounded font-mono text-[11px] text-[#89ceff] flex items-center justify-between border border-[#3d494c]/30">
                        <code>statement_timeout = 3000ms</code>
                        <button 
                          onClick={() => copyToClipboard('statement_timeout = 3000ms', 'step-2')}
                          className="text-[#869397] hover:text-[#dfe2ed] ml-2 shrink-0 p-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3 bg-[#1c2027] p-3 rounded-lg border border-[#3d494c]/20">
                    <span className="h-5 w-5 rounded-full bg-[#262a32] text-[#4cd7f6] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#3d494c]/40">
                      3
                    </span>
                    <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                      <span className="text-xs font-medium text-[#dfe2ed]">
                        Verify PostgreSQL instance limits before applying pool scaling:
                      </span>
                      <div className="bg-[#0a0e15] p-2 rounded font-mono text-[11px] text-[#dfe2ed] flex items-center justify-between border border-[#3d494c]/30">
                        <span className="text-[#4cd7f6]">SHOW max_connections;</span>
                        <button 
                          onClick={() => copyToClipboard('SHOW max_connections;', 'step-3')}
                          className="text-[#869397] hover:text-[#dfe2ed] ml-2 shrink-0 p-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start gap-3 bg-[#1c2027] p-3 rounded-lg border border-[#3d494c]/20">
                    <span className="h-5 w-5 rounded-full bg-[#262a32] text-[#4cd7f6] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#3d494c]/40">
                      4
                    </span>
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <span className="text-xs font-medium text-[#dfe2ed]">
                        Add composite index on session lookup:
                      </span>
                      <p className="text-xs text-[#bcc9cd] leading-relaxed">
                        Applying index on <code className="text-[#4cd7f6] font-mono">users(session_token)</code> will drop query duration from <strong className="text-[#ff5449] font-medium">420ms</strong> down to <strong className="text-[#89ceff] font-medium">2ms</strong> under active load.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Incident Co-Pilot Interaction */}
              <div className="flex flex-col gap-3 pt-2 border-t border-[#3d494c]/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[#869397] font-semibold">
                    Incident Co-Pilot Interaction
                  </span>
                  <span className="font-mono text-[10px] text-[#869397]">Session Token: #LL-8991</span>
                </div>

                {/* Dialogue History Box */}
                <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                  {chatMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'self-end max-w-[88%]' : 'self-start max-w-[92%]'}`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="w-6 h-6 rounded bg-[#06b6d4] text-[#00424f] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                          <BrainCircuit className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className={`p-3 rounded-lg text-xs leading-relaxed shadow-sm ${
                        msg.sender === 'user' 
                          ? 'bg-[#262a32] text-[#dfe2ed] border border-[#3d494c]/40' 
                          : 'bg-[#1c2027] text-[#dfe2ed] border-l-2 border-[#4cd7f6] border-y border-r border-[#3d494c]/30'
                      }`}>
                        {msg.content.includes('\n') ? (
                          <pre className="font-mono text-[11px] whitespace-pre-wrap">{msg.content}</pre>
                        ) : (
                          <span>{msg.content}</span>
                        )}
                      </div>

                      {msg.sender === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-[#c0c1ff] text-[#1000a9] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-1">
                          SJ
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-2 self-start text-[#869397] text-xs font-mono">
                      <BrainCircuit className="w-4 h-4 text-[#4cd7f6] animate-pulse" />
                      <span>Co-Pilot analyzing telemetry correlation...</span>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Quick Action Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <button 
                    onClick={() => handleSendMessage(undefined, 'Generate SQL migration for index on users(session_token)')}
                    className="px-2.5 py-1 rounded-full bg-[#1c2027] hover:bg-[#262a32] text-[#bcc9cd] hover:text-[#4cd7f6] font-mono text-[11px] transition-colors flex items-center gap-1 border border-[#3d494c]/40"
                  >
                    <Database className="w-3 h-3 text-[#4cd7f6]" />
                    <span>Generate SQL migration</span>
                  </button>
                  <button 
                    onClick={() => handleSendMessage(undefined, 'Create Terraform pool PR with DB_POOL_SIZE=100')}
                    className="px-2.5 py-1 rounded-full bg-[#1c2027] hover:bg-[#262a32] text-[#bcc9cd] hover:text-[#4cd7f6] font-mono text-[11px] transition-colors flex items-center gap-1 border border-[#3d494c]/40"
                  >
                    <GitBranch className="w-3 h-3 text-[#89ceff]" />
                    <span>Create Terraform pool PR</span>
                  </button>
                  <button 
                    onClick={() => handleSendMessage(undefined, 'Explain stack trace frame #1 in plain English')}
                    className="px-2.5 py-1 rounded-full bg-[#1c2027] hover:bg-[#262a32] text-[#bcc9cd] hover:text-[#4cd7f6] font-mono text-[11px] transition-colors flex items-center gap-1 border border-[#3d494c]/40"
                  >
                    <HelpCircle className="w-3 h-3 text-[#c0c1ff]" />
                    <span>Explain stack trace</span>
                  </button>
                </div>

                {/* Input Box */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-1">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0a0e15] border border-[#3d494c]/40 focus-within:border-[#4cd7f6] transition-all">
                    <input 
                      id="chatInput"
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask AI about this error or paste related config..."
                      className="w-full bg-transparent text-[#dfe2ed] placeholder-[#869397] text-xs focus:outline-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-[#06b6d4] text-[#00424f] hover:bg-[#4cd7f6] text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm shrink-0"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
