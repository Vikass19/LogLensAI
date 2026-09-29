export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'CRIT';

export interface LogEntry {
  id: string;
  time: string;
  timestamp: number;
  level: LogLevel;
  service: string;
  requestId: string;
  statusCode?: number;
  message: string;
  hasStackTrace?: boolean;
  errorName?: string;
  errorCategory?: string;
  errorCode?: string;
  stackTrace?: {
    runtime: string;
    frames: {
      line: number;
      file: string;
      func: string;
      codeSnippet?: string;
      highlight?: boolean;
    }[];
  };
}

export interface ErrorGroup {
  id: string;
  name: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  count: number;
  rateChange: string;
  message: string;
  service: string;
  cluster: string;
  firstSeen: string;
  lastSeen: string;
  release: string;
  impactedUsers: number;
  p99Latency: string;
  errorCode: string;
  status: 'active' | 'resolved' | 'muted';
}

export interface IngestionFile {
  id: string;
  name: string;
  uploadedAt: string;
  size: string;
  bytes: number;
  logCount: number;
  errorCount: number;
  status: 'Analyzed' | 'Parsing' | 'Queued' | 'Failed';
  description: string;
}

export interface IncidentCluster {
  id: string;
  name: string;
  service: string;
  location: string;
  eventsCount: number;
  affinity: number;
}

export interface RemediationStep {
  step: number;
  title: string;
  snippet?: string;
  description?: string;
  command?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  authorName?: string;
  timestamp: string;
  content: string;
}
