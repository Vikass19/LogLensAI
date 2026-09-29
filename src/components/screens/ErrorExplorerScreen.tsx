import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Search, 
  Filter, 
  Flame, 
  ArrowRight, 
  BrainCircuit, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Users, 
  Cpu
} from 'lucide-react';
import { TOP_ERRORS } from '../../data/mockTelemetry';
import { ErrorGroup } from '../../types/telemetry';

interface ErrorExplorerScreenProps {
  onNavigate: (path: string, options?: { errorId?: string }) => void;
  errors: ErrorGroup[];
}

export const ErrorExplorerScreen: React.FC<ErrorExplorerScreenProps> = ({
  onNavigate,
  errors,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const allErrors = [
    ...errors,
    {
      id: 'err-7',
      name: 'KeycloakOAuthInvalidGrant',
      severity: 'HIGH' as const,
      count: 27,
      rateChange: '+4/hr',
      message: 'Invalid authorization code or refresh token rejected by SSO provider',
      service: 'Auth Service',
      cluster: 'EKS Cluster (prod-us-east-1a)',
      firstSeen: '3h ago',
      lastSeen: '14m ago',
      release: 'v2.18.4',
      impactedUsers: 22,
      p99Latency: '310ms',
      errorCode: 'ERR-AUTH-9011',
      status: 'active' as const
    },
    {
      id: 'err-8',
      name: 'StripeWebhookSignatureVerification',
      severity: 'MEDIUM' as const,
      count: 14,
      rateChange: '0/hr',
      message: 'Signature header v1 timestamp drift exceeds 300s clock skew tolerance',
      service: 'Payment Service',
      cluster: 'ECS Cluster (prod-us-east-1b)',
      firstSeen: '5h ago',
      lastSeen: '42m ago',
      release: 'v2.18.3',
      impactedUsers: 9,
      p99Latency: '112ms',
      errorCode: 'ERR-STRIPE-228',
      status: 'active' as const
    },
    {
      id: 'err-9',
      name: 'KafkaTopicLagExceeded',
      severity: 'LOW' as const,
      count: 11,
      rateChange: '-3/hr',
      message: 'Consumer group telemetry-processor offset lag > 15,000 messages',
      service: 'Queue Worker',
      cluster: 'MSK Cluster kafka-prod',
      firstSeen: '1d ago',
      lastSeen: '2h ago',
      release: 'v2.18.1',
      impactedUsers: 0,
      p99Latency: '890ms',
      errorCode: 'ERR-KAFKA-401',
      status: 'resolved' as const
    }
  ];

  const filtered = allErrors.filter((e) => {
    if (filterSeverity !== 'ALL' && e.severity !== filterSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q) ||
        e.service.toLowerCase().includes(q) ||
        e.errorCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-5 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#181c23] p-5 rounded-xl border border-[#3d494c]/30 shadow-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-[#ff5449]" />
            <h1 className="text-xl sm:text-2xl text-[#dfe2ed] font-bold tracking-tight">
              Error Explorer
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#262a32] text-[#4cd7f6] border border-[#4cd7f6]/30">
              {allErrors.length} Fingerprints
            </span>
          </div>
          <p className="text-xs text-[#869397]">
            Deduplicated anomaly signatures across microservices with vector clustering & root-cause correlation.
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center p-0.5 rounded-lg bg-[#0a0e15] border border-[#3d494c]/40 font-mono text-xs">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded transition-colors ${
                filterSeverity === sev 
                  ? 'bg-[#262a32] text-[#4cd7f6] font-bold shadow-sm' 
                  : 'text-[#869397] hover:text-[#dfe2ed]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative flex items-center bg-[#181c23] rounded-xl border border-[#3d494c]/40 px-3 py-1.5 shadow-sm">
        <Search className="w-4 h-4 text-[#869397] mr-2" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by error name, error code (e.g. ERR-PG-94021), service or message..."
          className="w-full bg-transparent text-xs text-[#dfe2ed] placeholder-[#869397] py-2 focus:outline-none font-mono"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-[#869397] hover:text-[#dfe2ed] text-xs p-1">
            Clear
          </button>
        )}
      </div>

      {/* Errors Grid / Table */}
      <div className="flex flex-col gap-3">
        {filtered.map((err) => (
          <div
            key={err.id}
            onClick={() => onNavigate('ai-analysis', { errorId: err.id })}
            className="p-4 sm:p-5 rounded-xl bg-[#181c23] hover:bg-[#1c2027] border border-[#3d494c]/30 hover:border-[#4cd7f6]/50 transition-all cursor-pointer shadow-md group flex flex-col gap-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`px-2.5 py-0.5 rounded font-mono text-xs font-bold tracking-tight shrink-0 ${
                  err.severity === 'CRITICAL' ? 'bg-[#93000a] text-[#ffdad6] border border-[#ff5449]/40' :
                  err.severity === 'HIGH' ? 'bg-[#ff5449]/15 text-[#ff5449] border border-[#ff5449]/30' :
                  err.severity === 'MEDIUM' ? 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30' :
                  'bg-[#262a32] text-[#869397]'
                }`}>
                  {err.severity}
                </span>

                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0a0e15] text-[#89ceff] border border-[#3d494c]/30">
                  {err.errorCode}
                </span>

                <h3 className="text-sm sm:text-base font-bold text-[#dfe2ed] group-hover:text-[#4cd7f6] transition-colors truncate font-mono">
                  {err.name}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#0a0e15] text-[#dfe2ed] border border-[#3d494c]/40 font-bold">
                  {err.count} occurrences
                </span>
                <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#06b6d4] text-[#00424f] text-xs font-semibold group-hover:bg-[#4cd7f6] transition-colors">
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Investigate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-[#bcc9cd] font-mono leading-relaxed bg-[#0a0e15]/50 p-2.5 rounded border border-[#3d494c]/20">
              {err.message}
            </p>

            <div className="flex flex-wrap items-center justify-between text-xs text-[#869397] font-mono gap-y-1 gap-x-4 pt-1">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-[#4cd7f6]" />
                  <span>{err.service}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#c0c1ff]" />
                  <span>{err.impactedUsers} impacted users</span>
                </span>
                <span>P99: <strong className="text-[#dfe2ed]">{err.p99Latency}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span>First seen: {err.firstSeen}</span>
                <span>•</span>
                <span className="text-[#ff5449]">Last seen: {err.lastSeen}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
