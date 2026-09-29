import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  FileText, 
  ChevronDown, 
  Search, 
  X, 
  RefreshCw, 
  RotateCw, 
  Clock, 
  CloudUpload, 
  Eye, 
  Copy, 
  ChevronUp, 
  BrainCircuit, 
  GitPullRequest, 
  Download, 
  Code, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { INITIAL_LOGS, INITIAL_FILES } from '../../data/mockTelemetry';
import { LogEntry, IngestionFile } from '../../types/telemetry';

interface LogExplorerScreenProps {
  onNavigate: (path: string, options?: { errorId?: string }) => void;
  selectedFileName: string;
  onSelectFile: (name: string) => void;
  onOpenGitHubModal: (log: LogEntry) => void;
}

export const LogExplorerScreen: React.FC<LogExplorerScreenProps> = ({
  onNavigate,
  selectedFileName,
  onSelectFile,
  onOpenGitHubModal,
}) => {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState('status:>=500');
  const [regexEnabled, setRegexEnabled] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('ERROR');
  const [selectedService, setSelectedService] = useState<string>('Database');
  const [selectedStatus, setSelectedStatus] = useState<string>('5xx');
  const [liveTailActive, setLiveTailActive] = useState(true);
  const [fileDropdownOpen, setFileDropdownOpen] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>('log-2');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Live Tail streaming simulator
  useEffect(() => {
    if (!liveTailActive) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const sampleServices = ['Database', 'Payment Service', 'User Service', 'API Gateway', 'Auth Service'];
      const sampleLevels: ('INFO' | 'WARN' | 'ERROR' | 'CRIT')[] = ['INFO', 'INFO', 'WARN', 'ERROR', 'CRIT'];
      
      const randomLevel = sampleLevels[Math.floor(Math.random() * sampleLevels.length)];
      const randomService = sampleServices[Math.floor(Math.random() * sampleServices.length)];
      const randomReq = `req_${Math.random().toString(36).substring(2, 8)}`;

      let message = `GET /api/v2/telemetry emitted state update`;
      let statusCode = 200;

      if (randomLevel === 'ERROR') {
        message = `Database connection retry timed out after 3000ms [pool_worker_03]`;
        statusCode = 500;
      } else if (randomLevel === 'CRIT') {
        message = `CircuitBreaker tripped: payment-gateway upstream 503 Service Unavailable`;
        statusCode = 503;
      } else if (randomLevel === 'WARN') {
        message = `High memory threshold detected on container: 87% utilized`;
        statusCode = 429;
      }

      const newLog: LogEntry = {
        id: `log-live-${Date.now()}`,
        time: timeStr,
        timestamp: Date.now(),
        level: randomLevel,
        service: randomService,
        requestId: randomReq,
        statusCode,
        message
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [liveTailActive]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = (format: 'CSV' | 'JSON') => {
    let content = '';
    let mimeType = '';
    let filename = `${selectedFileName.replace('.log', '')}-export.${format.toLowerCase()}`;

    if (format === 'JSON') {
      content = JSON.stringify(logs, null, 2);
      mimeType = 'application/json';
    } else {
      const headers = ['time', 'level', 'service', 'requestId', 'statusCode', 'message'];
      const rows = logs.map(l => [
        l.time,
        l.level,
        l.service,
        l.requestId,
        l.statusCode || '',
        `"${l.message.replace(/"/g, '""')}"`
      ].join(','));
      content = [headers.join(','), ...rows].join('\n');
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${logs.length} logs as ${format}!`);
  };

  // Filter logs based on UI controls
  const filteredLogs = logs.filter((log) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (q.includes('status:>=500')) {
        if (!log.statusCode || log.statusCode < 500) {
          // If searching status:>=500, match 500+ or error levels
          if (log.level !== 'ERROR' && log.level !== 'CRIT') return false;
        }
      } else {
        const matchesQuery = 
          log.message.toLowerCase().includes(q) ||
          log.service.toLowerCase().includes(q) ||
          log.requestId.toLowerCase().includes(q) ||
          log.level.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
    }

    // Level filter
    if (selectedLevel === 'INFO' && log.level !== 'INFO') return false;
    if (selectedLevel === 'WARNING' && log.level !== 'WARN') return false;
    if (selectedLevel === 'ERROR' && (log.level !== 'ERROR' && log.level !== 'CRIT')) return false;
    if (selectedLevel === 'CRITICAL' && log.level !== 'CRIT') return false;

    // Service filter
    if (selectedService !== 'All Services' && log.service !== selectedService) return false;

    // Status filter
    if (selectedStatus === '2xx' && (log.statusCode && (log.statusCode < 200 || log.statusCode >= 300))) return false;
    if (selectedStatus === '4xx' && (log.statusCode && (log.statusCode < 400 || log.statusCode >= 500))) return false;
    if (selectedStatus === '5xx' && (log.statusCode && log.statusCode < 500)) return false;

    return true;
  });

  return (
    <div className="flex flex-col w-full gap-5 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-[#262a32] text-[#4cd7f6] font-mono text-xs rounded-lg shadow-xl flex items-center gap-2 border border-[#4cd7f6]/40 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#4cd7f6]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Command & Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#181c23] px-5 py-3 rounded-xl shadow-md border border-[#3d494c]/30">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#4cd7f6]" />
            <h1 className="text-xl sm:text-2xl text-[#dfe2ed] tracking-tight font-bold">
              Log Explorer
            </h1>
          </div>

          {/* File Target Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFileDropdownOpen(!fileDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#262a32] text-[#dfe2ed] font-mono text-xs hover:bg-[#31353d] transition-colors border border-[#3d494c]/40"
            >
              <FileText className="w-4 h-4 text-[#89ceff]" />
              <span className="font-semibold text-[#4cd7f6]">{selectedFileName}</span>
              <span className="text-[#869397] hidden sm:inline">(4.2 MB · 12,482 entries)</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#869397]" />
            </button>

            {fileDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setFileDropdownOpen(false)} 
                />
                <div className="absolute top-full left-0 mt-1.5 w-80 bg-[#1c2027] border border-[#3d494c]/60 shadow-2xl rounded-xl p-1.5 z-40 flex flex-col gap-1">
                  {INITIAL_FILES.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        onSelectFile(f.name);
                        setFileDropdownOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-left hover:bg-[#262a32] transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className={`font-mono text-xs font-medium ${selectedFileName === f.name ? 'text-[#4cd7f6]' : 'text-[#dfe2ed]'}`}>
                          {f.name}
                        </span>
                        <span className="text-[10px] text-[#869397]">{f.description}</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#869397]">{f.size}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Live Tail Switch & Ingestion Stream Heartbeat */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a0e15] border border-[#3d494c]/30">
            <span className="relative flex h-2 w-2">
              {liveTailActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4cd7f6] opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${liveTailActive ? 'bg-[#4cd7f6]' : 'bg-[#869397]'}`}></span>
            </span>
            <span className="font-mono text-xs text-[#dfe2ed] uppercase tracking-wider font-semibold">
              {liveTailActive ? 'Active ● Live Tail' : 'Paused ● Live Tail'}
            </span>

            {/* Toggle switch */}
            <label className="relative inline-flex items-center cursor-pointer ml-1">
              <input 
                type="checkbox"
                checked={liveTailActive}
                onChange={(e) => setLiveTailActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#31353d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-[#06b6d4] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </label>
          </div>

          <div className="flex items-center gap-1.5 text-[#869397] font-mono text-xs">
            <RefreshCw className={`w-4 h-4 text-[#89ceff] ${liveTailActive ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span className={liveTailActive ? 'text-[#89ceff]' : 'text-[#ff5449]'}>
              {liveTailActive ? '2.4 kB/s' : 'PAUSED'}
            </span>
          </div>
        </div>
      </div>

      {/* Search Query Architecture */}
      <div className="flex flex-col gap-3 bg-[#181c23] p-4 rounded-xl shadow-md border border-[#3d494c]/30">
        <div className="relative flex items-center bg-[#0a0e15] rounded-lg shadow-inner border border-[#3d494c]/40">
          <div className="pl-3 pr-2 text-[#869397] flex items-center">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs, errors, request IDs, regex (e.g. status:>=500 service:api level:ERROR)..."
            className="w-full bg-transparent py-2.5 px-1 text-[#dfe2ed] placeholder-[#869397] font-mono text-xs sm:text-sm focus:outline-none"
          />
          <div className="flex items-center gap-2 pr-3">
            <button
              onClick={() => setRegexEnabled(!regexEnabled)}
              className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
                regexEnabled 
                  ? 'text-[#4cd7f6] bg-[#4cd7f6]/10 border border-[#4cd7f6]/30' 
                  : 'text-[#869397] bg-[#262a32]'
              }`}
            >
              REGEX {regexEnabled ? 'ON' : 'OFF'}
            </button>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 text-[#869397] hover:text-[#dfe2ed] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Telemetry Multi-Filter Matrix */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Severity Levels */}
            <span className="text-[11px] uppercase tracking-wider text-[#869397] font-semibold mr-1">
              Level:
            </span>
            <div className="flex items-center gap-1 p-0.5 bg-[#0a0e15] rounded-lg border border-[#3d494c]/30">
              <button 
                onClick={() => setSelectedLevel('All')}
                className={`px-2 py-1 rounded font-mono text-xs transition-colors ${selectedLevel === 'All' ? 'bg-[#262a32] text-[#dfe2ed] font-semibold' : 'text-[#869397] hover:text-[#dfe2ed]'}`}
              >
                All (12,482)
              </button>
              <button 
                onClick={() => setSelectedLevel('INFO')}
                className={`px-2 py-1 rounded font-mono text-xs transition-colors ${selectedLevel === 'INFO' ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-semibold' : 'text-[#869397] hover:text-[#dfe2ed]'}`}
              >
                INFO (10,314)
              </button>
              <button 
                onClick={() => setSelectedLevel('WARNING')}
                className={`px-2 py-1 rounded font-mono text-xs transition-colors ${selectedLevel === 'WARNING' ? 'bg-[#f59e0b]/20 text-[#f59e0b] font-semibold' : 'text-[#869397] hover:text-[#dfe2ed]'}`}
              >
                WARNING (1,842)
              </button>
              <button 
                onClick={() => setSelectedLevel('ERROR')}
                className={`px-2.5 py-1 rounded font-mono text-xs flex items-center gap-1.5 transition-colors ${selectedLevel === 'ERROR' ? 'bg-[#93000a] text-[#ffdad6] font-bold' : 'text-[#869397] hover:text-[#dfe2ed]'}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff5449]"></span>
                ERROR (326)
              </button>
              <button 
                onClick={() => setSelectedLevel('CRITICAL')}
                className={`px-2.5 py-1 rounded font-mono text-xs flex items-center gap-1.5 transition-colors ${selectedLevel === 'CRITICAL' ? 'bg-[#ff5449]/20 text-[#ff5449] font-bold' : 'text-[#869397] hover:text-[#dfe2ed]'}`}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5449] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff5449]"></span>
                </span>
                CRITICAL (12)
              </button>
            </div>

            {/* Service Filter */}
            <div className="h-4 w-px bg-[#3d494c]/30 mx-1 hidden sm:block"></div>
            <span className="text-[11px] uppercase tracking-wider text-[#869397] font-semibold mr-1">
              Service:
            </span>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="bg-[#0a0e15] text-[#dfe2ed] font-mono text-xs rounded-lg px-2.5 py-1.5 border border-[#3d494c]/40 focus:outline-none cursor-pointer"
            >
              <option value="All Services">All Services</option>
              <option value="API Gateway">API Gateway</option>
              <option value="User Service">User Service</option>
              <option value="Payment Service">Payment Service</option>
              <option value="Database">Database</option>
              <option value="Auth Service">Auth Service</option>
            </select>

            {/* Status Codes */}
            <div className="h-4 w-px bg-[#3d494c]/30 mx-1 hidden sm:block"></div>
            <span className="text-[11px] uppercase tracking-wider text-[#869397] font-semibold mr-1">
              Status:
            </span>
            <div className="flex items-center gap-1">
              {(['2xx', '4xx', '5xx'] as const).map((code) => (
                <button
                  key={code}
                  onClick={() => setSelectedStatus(code)}
                  className={`px-2.5 py-1 rounded font-mono text-xs transition-colors border ${
                    selectedStatus === code 
                      ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border-[#4cd7f6]/40 font-bold' 
                      : 'bg-[#0a0e15] text-[#869397] hover:text-[#dfe2ed] border-[#3d494c]/30'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Time Window Selector */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0e15] border border-[#3d494c]/40 rounded-lg font-mono text-xs text-[#dfe2ed] hover:bg-[#262a32] transition-colors">
              <CloudUpload className="w-3.5 h-3.5 text-[#89ceff]" />
              <span>Last 24 Hours</span>
            </button>
            <button 
              onClick={() => showToast('Refreshed stream buffer')}
              className="p-1.5 bg-[#0a0e15] border border-[#3d494c]/40 rounded-lg text-[#869397] hover:text-[#4cd7f6] transition-colors" 
              title="Refresh stream"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Streaming Matrix / High-Density Grid */}
      <div className="flex flex-col bg-[#0a0e15] rounded-xl overflow-hidden shadow-xl border border-[#3d494c]/30">
        {/* Grid Column Headers */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-[#262a32] text-[#869397] text-[11px] font-semibold uppercase tracking-wider items-center select-none border-b border-[#3d494c]/40">
          <div className="col-span-2 sm:col-span-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Time</span>
          </div>
          <div className="col-span-2 sm:col-span-1">Level</div>
          <div className="col-span-2 sm:col-span-2">Service</div>
          <div className="col-span-2 sm:col-span-2">Request ID</div>
          <div className="col-span-4 sm:col-span-5">Message Payload</div>
          <div className="hidden sm:flex sm:col-span-1 justify-end">Actions</div>
        </div>

        {/* Rows Stream Container */}
        <div className="flex flex-col font-mono text-xs divide-y divide-[#3d494c]/20">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-[#869397] flex flex-col items-center gap-2">
              <AlertCircle className="w-6 h-6 text-[#869397]" />
              <span>No logs found matching current filter parameters</span>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const isError = log.level === 'ERROR' || log.level === 'CRIT';

              return (
                <div key={log.id} className="flex flex-col">
                  {/* Main Grid Row */}
                  <div 
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className={`
                      grid grid-cols-12 gap-2 px-4 py-2.5 items-center cursor-pointer transition-colors group
                      ${isExpanded ? 'bg-[#1c2027]' : isError ? 'bg-[#93000a]/10 hover:bg-[#1c2027]/70' : 'hover:bg-[#181c23]'}
                    `}
                  >
                    <div className="col-span-2 sm:col-span-1 text-[#869397] font-mono text-xs">
                      {log.time}
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      {log.level === 'CRIT' && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#93000a] text-[#ffdad6] font-mono text-[10px] font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#ff5449] animate-ping"></span>
                          CRIT
                        </span>
                      )}
                      {log.level === 'ERROR' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#93000a]/70 text-[#ffdad6] font-mono text-[10px] font-bold">
                          ERROR
                        </span>
                      )}
                      {log.level === 'WARN' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#262a32] text-[#f59e0b] font-mono text-[10px] font-bold">
                          WARN
                        </span>
                      )}
                      {log.level === 'INFO' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#1c2027] text-[#869397] font-mono text-[10px] font-bold">
                          INFO
                        </span>
                      )}
                    </div>

                    <div className={`col-span-2 sm:col-span-2 truncate font-semibold ${log.service === 'Database' ? 'text-[#4cd7f6]' : 'text-[#dfe2ed]'}`}>
                      {log.service}
                    </div>

                    <div className="col-span-2 sm:col-span-2 text-[#89ceff] font-mono text-xs truncate">
                      {log.requestId}
                    </div>

                    <div className={`col-span-4 sm:col-span-5 truncate text-xs ${isError ? 'text-[#ff5449] font-medium' : 'text-[#bcc9cd]'}`}>
                      {log.message}
                    </div>

                    <div className="hidden sm:flex sm:col-span-1 justify-end items-center gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedLogId(isExpanded ? null : log.id);
                        }}
                        className="p-1 hover:text-[#4cd7f6] text-[#869397] transition-colors" 
                        title="Toggle drawer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#4cd7f6]" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(log.message, log.id);
                        }}
                        className="p-1 hover:text-[#dfe2ed] text-[#869397] transition-colors" 
                        title="Copy message"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail Drawer */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-[#0a0e15] flex flex-col gap-4 border-l-4 border-[#4cd7f6] border-y border-[#3d494c]/40 animate-in fade-in duration-150">
                      {/* Diagnostics & AI Recommendation Banner */}
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#3131c0]/20 border border-[#3131c0]/40 rounded-xl">
                        <div className="flex items-center gap-3">
                          <BrainCircuit className="w-6 h-6 text-[#c0c1ff]" />
                          <div className="flex flex-col">
                            <span className="text-sm sm:text-base text-[#dfe2ed] font-bold">
                              {log.errorName || 'DatabaseConnectionError'}
                            </span>
                            <span className="text-xs text-[#869397] font-mono">
                              Unable to connect to PostgreSQL cluster at <span className="text-[#89ceff]">db-primary.internal:5432</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#3131c0] text-[#c0c1ff] font-mono text-[10px] font-bold">
                            {log.errorCategory || 'P1 SEVERITY'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#262a32] text-[#869397] font-mono text-[10px]">
                            {log.errorCode || 'PG_ERR_53300'}
                          </span>
                        </div>
                      </div>

                      {/* Stack Trace Monospace Display */}
                      <div className="flex flex-col bg-[#1c2027] rounded-lg overflow-hidden border border-[#3d494c]/40">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#262a32] text-[#869397] text-xs">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Code className="w-3.5 h-3.5 text-[#4cd7f6]" />
                            Stack Trace (Origin: Python 3.11 Runtime)
                          </span>
                          <button 
                            onClick={() => copyToClipboard(
                              `DatabaseConnectionError: Unable to connect to PostgreSQL cluster at db-primary.internal:5432\n` +
                              `  at database/connect.py:42 in get_connection_pool()\n` +
                              `  at services/user_service.py:87 in authenticate_session(token="ey...")\n` +
                              `  at api/routes.py:31 in post_login_handler(req=Request)`,
                              'stack-trace'
                            )}
                            className="hover:text-[#dfe2ed] flex items-center gap-1 transition-colors text-[11px]"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedId === 'stack-trace' ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <div className="p-3 sm:p-4 font-mono text-xs text-[#dfe2ed] overflow-x-auto space-y-1.5">
                          <div className="flex gap-4">
                            <span className="text-[#869397] select-none w-6 text-right">41</span>
                            <span className="text-[#bcc9cd]"># acquire slot from thread pool orchestrator</span>
                          </div>
                          <div className="flex gap-4 bg-[#93000a]/30 py-1 px-2 rounded border border-[#ff5449]/30">
                            <span className="text-[#ff5449] select-none w-6 text-right font-bold">42</span>
                            <span className="text-[#ff5449] font-medium">
                              at database/connect.py:42 in <span className="text-[#4cd7f6] font-semibold">get_connection_pool()</span>
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="text-[#869397] select-none w-6 text-right">87</span>
                            <span className="text-[#dfe2ed]">
                              at services/user_service.py:87 in <span className="text-[#89ceff]">authenticate_session(token="ey...")</span>
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="text-[#869397] select-none w-6 text-right">31</span>
                            <span className="text-[#bcc9cd]">
                              at api/routes.py:31 in <span className="text-[#bcc9cd]">post_login_handler(req=Request)</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Deep Action Toolbar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <button 
                            onClick={() => onNavigate('ai-analysis')}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#06b6d4] text-[#00424f] text-xs font-semibold hover:bg-[#4cd7f6] transition-colors shadow-sm"
                          >
                            <BrainCircuit className="w-4 h-4" />
                            <span>Ask AI Explain</span>
                          </button>
                          <button 
                            onClick={() => copyToClipboard('database/connect.py:42 in get_connection_pool()', 'stack-snip')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262a32] text-[#dfe2ed] text-xs font-medium hover:bg-[#31353d] transition-colors border border-[#3d494c]/40"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Stack Trace</span>
                          </button>
                          <button 
                            onClick={() => onNavigate('error-explorer')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262a32] text-[#dfe2ed] text-xs font-medium hover:bg-[#31353d] transition-colors border border-[#3d494c]/40"
                          >
                            <Search className="w-3.5 h-3.5 text-[#89ceff]" />
                            <span>View Similar Errors (127)</span>
                          </button>
                        </div>
                        <div>
                          <button 
                            onClick={() => onOpenGitHubModal(log)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3131c0] text-[#c0c1ff] text-xs font-semibold hover:brightness-110 transition-all border border-[#c0c1ff]/30"
                          >
                            <GitPullRequest className="w-3.5 h-3.5" />
                            <span>Create GitHub Issue</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Real-time Ingestion Histogram / Sparkline Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Errors Rate / Min */}
        <div className="flex flex-col bg-[#181c23] p-4 rounded-xl border border-[#3d494c]/30 shadow-md">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#869397]">
            Errors Rate / Min
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-[#ff5449] tracking-tight">14.8</span>
            <span className="font-mono text-xs text-[#ff5449] bg-[#ff5449]/10 px-2 py-0.5 rounded font-semibold border border-[#ff5449]/20">
              +32% spike
            </span>
          </div>
          <svg className="w-full h-8 mt-2 text-[#ff5449]" preserveAspectRatio="none" viewBox="0 0 100 25">
            <path d="M0,20 Q10,18 20,22 T40,12 T60,19 T80,4 L100,2" fill="none" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        </div>

        {/* P99 Query Latency */}
        <div className="flex flex-col bg-[#181c23] p-4 rounded-xl border border-[#3d494c]/30 shadow-md">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#869397]">
            P99 Query Latency
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-[#4cd7f6] tracking-tight">482ms</span>
            <span className="font-mono text-xs text-[#869397]">pg_pool bottleneck</span>
          </div>
          <svg className="w-full h-8 mt-2 text-[#4cd7f6]" preserveAspectRatio="none" viewBox="0 0 100 25">
            <path d="M0,15 Q20,16 40,10 T70,8 T90,22 L100,18" fill="none" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Throughput / sec */}
        <div className="flex flex-col bg-[#181c23] p-4 rounded-xl border border-[#3d494c]/30 shadow-md">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#869397]">
            Throughput / sec
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-[#dfe2ed] tracking-tight">1,420</span>
            <span className="font-mono text-xs text-[#89ceff]">events/sec</span>
          </div>
          <svg className="w-full h-8 mt-2 text-[#89ceff]" preserveAspectRatio="none" viewBox="0 0 100 25">
            <path d="M0,12 Q25,8 50,14 T75,10 L100,12" fill="none" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Storage Footprint */}
        <div className="flex flex-col justify-between bg-[#181c23] p-4 rounded-xl border border-[#3d494c]/30 shadow-md">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#869397]">
              Storage Footprint
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-semibold text-[#dfe2ed] font-mono">148.2 GB / 250 GB</span>
              <span className="font-mono text-xs text-[#869397]">59%</span>
            </div>
          </div>
          <div className="w-full bg-[#262a32] h-2 rounded-full overflow-hidden mt-3 border border-[#3d494c]/40">
            <div className="bg-[#4cd7f6] h-full rounded-full" style={{ width: '59%' }}></div>
          </div>
        </div>
      </div>

      {/* Pagination & Stream Status Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 bg-[#0a0e15] rounded-xl shadow-md font-mono text-xs border border-[#3d494c]/30">
        <div className="flex items-center gap-4 flex-wrap text-[#869397]">
          <div className="flex items-center gap-1.5">
            <span className="text-[#dfe2ed] font-semibold">Showing 1 – 25</span>
            <span>of 12,482 lines</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded bg-[#262a32] border-[#3d494c] text-[#4cd7f6] focus:ring-0" 
            />
            <span className="text-[#bcc9cd]">Auto-scroll on new log</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          {/* Pagination buttons */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(1)}
              className="p-1 rounded bg-[#181c23] hover:bg-[#262a32] text-[#869397] hover:text-[#dfe2ed] transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-1 rounded bg-[#181c23] hover:bg-[#262a32] text-[#869397] hover:text-[#dfe2ed] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2.5 py-0.5 rounded bg-[#262a32] text-[#4cd7f6] font-semibold border border-[#4cd7f6]/30">
              {currentPage}
            </span>
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-1 rounded bg-[#181c23] hover:bg-[#262a32] text-[#869397] hover:text-[#dfe2ed] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentPage(500)}
              className="p-1 rounded bg-[#181c23] hover:bg-[#262a32] text-[#869397] hover:text-[#dfe2ed] transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-[#3d494c]/30 mx-1 hidden sm:block"></div>

          {/* Export triggers */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => handleExport('CSV')}
              className="flex items-center gap-1 px-3 py-1 rounded bg-[#181c23] hover:bg-[#262a32] text-[#dfe2ed] transition-colors border border-[#3d494c]/30"
            >
              <Download className="w-3.5 h-3.5 text-[#4cd7f6]" />
              <span>Export CSV</span>
            </button>
            <button 
              onClick={() => handleExport('JSON')}
              className="flex items-center gap-1 px-3 py-1 rounded bg-[#181c23] hover:bg-[#262a32] text-[#dfe2ed] transition-colors border border-[#3d494c]/30"
            >
              <Code className="w-3.5 h-3.5 text-[#89ceff]" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
