import { LogEntry, ErrorGroup, IngestionFile, IncidentCluster, RemediationStep, ChatMessage } from '../types/telemetry';

export const INITIAL_FILES: IngestionFile[] = [
  {
    id: 'f-1',
    name: 'application.log',
    uploadedAt: '2m ago',
    size: '4.2 MB',
    bytes: 4404019,
    logCount: 12482,
    errorCount: 326,
    status: 'Analyzed',
    description: 'Production primary stream'
  },
  {
    id: 'f-2',
    name: 'server.log',
    uploadedAt: '1h ago',
    size: '2.1 MB',
    bytes: 2202009,
    logCount: 7832,
    errorCount: 102,
    status: 'Analyzed',
    description: 'Node runtime output'
  },
  {
    id: 'f-3',
    name: 'backend-error.log',
    uploadedAt: 'Yesterday',
    size: '856 KB',
    bytes: 876544,
    logCount: 2140,
    errorCount: 48,
    status: 'Analyzed',
    description: 'Nginx ingress controller errors'
  },
  {
    id: 'f-4',
    name: 'worker-queue.log',
    uploadedAt: '3d ago',
    size: '14.8 MB',
    bytes: 15518924,
    logCount: 45900,
    errorCount: 890,
    status: 'Analyzed',
    description: 'Celery/Redis worker background queue'
  },
  {
    id: 'f-5',
    name: 'production-cluster.log',
    uploadedAt: '5d ago',
    size: '124.6 MB',
    bytes: 130652569,
    logCount: 284910,
    errorCount: 1420,
    status: 'Analyzed',
    description: 'Kube orchestrator daemon'
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    time: '10:42:18',
    timestamp: Date.now() - 1000 * 18,
    level: 'CRIT',
    service: 'Payment Service',
    requestId: 'req_9f28a1',
    statusCode: 504,
    message: 'Payment service unavailable: upstream gateway timeout after 5000ms'
  },
  {
    id: 'log-2',
    time: '10:42:17',
    timestamp: Date.now() - 1000 * 25,
    level: 'ERROR',
    service: 'Database',
    requestId: 'req_4a82b9',
    statusCode: 500,
    message: 'Database connection failed: connection pool exhausted (max 50)',
    hasStackTrace: true,
    errorName: 'DatabaseConnectionError',
    errorCode: 'PG_ERR_53300',
    errorCategory: 'P1 SEVERITY',
    stackTrace: {
      runtime: 'Python 3.11 Runtime',
      frames: [
        {
          line: 41,
          file: 'database/connect.py',
          func: 'acquire slot from thread pool orchestrator',
          codeSnippet: '# acquire slot from thread pool orchestrator',
          highlight: false
        },
        {
          line: 42,
          file: 'database/connect.py',
          func: 'get_connection_pool()',
          codeSnippet: 'at database/connect.py:42 in get_connection_pool()',
          highlight: true
        },
        {
          line: 87,
          file: 'services/user_service.py',
          func: 'authenticate_session(token="ey...")',
          codeSnippet: 'at services/user_service.py:87 in authenticate_session(token="ey...")',
          highlight: false
        },
        {
          line: 31,
          file: 'api/routes.py',
          func: 'post_login_handler(req=Request)',
          codeSnippet: 'at api/routes.py:31 in post_login_handler(req=Request)',
          highlight: false
        }
      ]
    }
  },
  {
    id: 'log-3',
    time: '10:42:15',
    timestamp: Date.now() - 1000 * 40,
    level: 'WARN',
    service: 'Database',
    requestId: 'req_4a82b8',
    statusCode: 200,
    message: 'Connection pool nearing capacity: 48/50 active connections'
  },
  {
    id: 'log-4',
    time: '10:42:13',
    timestamp: Date.now() - 1000 * 62,
    level: 'INFO',
    service: 'User Service',
    requestId: 'req_3c91f0',
    statusCode: 200,
    message: 'User authentication successful: user_id="usr_88921" ip="192.168.1.42"'
  },
  {
    id: 'log-5',
    time: '10:42:10',
    timestamp: Date.now() - 1000 * 85,
    level: 'INFO',
    service: 'API Gateway',
    requestId: 'req_2b81e4',
    statusCode: 200,
    message: 'GET /api/v1/healthz returned 200 OK (latency: 4ms)'
  },
  {
    id: 'log-6',
    time: '10:42:08',
    timestamp: Date.now() - 1000 * 110,
    level: 'ERROR',
    service: 'Auth Service',
    requestId: 'req_1a70d3',
    statusCode: 401,
    message: 'TokenExpiredError: JWT signature has expired for session ssn_4429'
  },
  {
    id: 'log-7',
    time: '10:41:59',
    timestamp: Date.now() - 1000 * 135,
    level: 'WARN',
    service: 'API Gateway',
    requestId: 'req_8e411c',
    statusCode: 429,
    message: 'Rate limit threshold exceeded for client CID-8842 (burst: 120 req/sec)'
  },
  {
    id: 'log-8',
    time: '10:41:52',
    timestamp: Date.now() - 1000 * 160,
    level: 'INFO',
    service: 'Payment Service',
    requestId: 'req_7f33d2',
    statusCode: 200,
    message: 'Stripe webhook payment_intent.succeeded verified for order #ORD-9912'
  },
  {
    id: 'log-9',
    time: '10:41:48',
    timestamp: Date.now() - 1000 * 185,
    level: 'ERROR',
    service: 'Database',
    requestId: 'req_6b22c9',
    statusCode: 500,
    message: 'ConnectionTimeout: PostgreSQL pool acquire timeout after 5000ms'
  },
  {
    id: 'log-10',
    time: '10:41:40',
    timestamp: Date.now() - 1000 * 210,
    level: 'INFO',
    service: 'User Service',
    requestId: 'req_5a11b8',
    statusCode: 200,
    message: 'Session refreshed for user_id="usr_44102"'
  }
];

export const TOP_ERRORS: ErrorGroup[] = [
  {
    id: 'err-1',
    name: 'DatabaseConnectionError',
    severity: 'CRITICAL',
    count: 127,
    rateChange: '+34/hr',
    message: 'Unable to connect to PostgreSQL database: connection refused at 10.0.12.4:5432',
    service: 'User API',
    cluster: 'EKS Cluster (prod-us-east-1a)',
    firstSeen: 'Today, 08:42:19 AM',
    lastSeen: '2 minutes ago',
    release: 'v2.18.4-hotfix',
    impactedUsers: 89,
    p99Latency: '8,410ms',
    errorCode: 'ERR-PG-94021',
    status: 'active'
  },
  {
    id: 'err-2',
    name: 'NullPointerException',
    severity: 'MEDIUM',
    count: 84,
    rateChange: '-2/hr',
    message: 'Cannot read properties of undefined in billing_sync.py',
    service: 'Payment Service',
    cluster: 'ECS Cluster (prod-us-east-1b)',
    firstSeen: 'Yesterday, 14:20:00',
    lastSeen: '1h ago',
    release: 'v2.18.3',
    impactedUsers: 42,
    p99Latency: '340ms',
    errorCode: 'ERR-PY-88310',
    status: 'active'
  },
  {
    id: 'err-3',
    name: 'TimeoutError',
    severity: 'HIGH',
    count: 62,
    rateChange: '+8/hr',
    message: 'Gateway request to auth-service timed out after 5000ms',
    service: 'API Gateway',
    cluster: 'Ingress Mesh Envoy (prod-us-east-1)',
    firstSeen: 'Today, 09:15:00',
    lastSeen: '12m ago',
    release: 'v2.18.4-hotfix',
    impactedUsers: 58,
    p99Latency: '5,004ms',
    errorCode: 'ERR-GW-11048',
    status: 'active'
  },
  {
    id: 'err-4',
    name: 'RedisConnectionError',
    severity: 'HIGH',
    count: 41,
    rateChange: '+5/hr',
    message: 'ECONNREFUSED 10.0.4.12:6379 cache replica down',
    service: 'Cache Worker',
    cluster: 'ElastiCache cluster replica-02',
    firstSeen: 'Today, 10:02:11',
    lastSeen: '45m ago',
    release: 'v2.18.4',
    impactedUsers: 33,
    p99Latency: '1,200ms',
    errorCode: 'ERR-RD-33019',
    status: 'active'
  },
  {
    id: 'err-5',
    name: 'TokenExpiredError',
    severity: 'MEDIUM',
    count: 36,
    rateChange: '-1/hr',
    message: 'JWT signature has expired for session verification',
    service: 'Auth Service',
    cluster: 'EKS Cluster (prod-us-east-1a)',
    firstSeen: '2 days ago',
    lastSeen: '18m ago',
    release: 'v2.18.2',
    impactedUsers: 28,
    p99Latency: '82ms',
    errorCode: 'ERR-AUTH-44120',
    status: 'active'
  },
  {
    id: 'err-6',
    name: 'SchemaValidationError',
    severity: 'LOW',
    count: 19,
    rateChange: '0/hr',
    message: 'Invalid payload schema: missing required field client_ip',
    service: 'User API',
    cluster: 'EKS Cluster (prod-us-east-1a)',
    firstSeen: '4 days ago',
    lastSeen: '2h ago',
    release: 'v2.18.0',
    impactedUsers: 14,
    p99Latency: '45ms',
    errorCode: 'ERR-VAL-77201',
    status: 'resolved'
  }
];

export const CORRELATED_INCIDENTS: IncidentCluster[] = [
  {
    id: 'c-1',
    name: 'ConnectionTimeout: PostgreSQL pool acquire timeout',
    service: 'services/auth_worker.py',
    location: 'Ingestion cluster east-zone-b',
    eventsCount: 42,
    affinity: 94
  },
  {
    id: 'c-2',
    name: 'OperationalError: server closed the connection unexpectedly',
    service: 'Downstream replica disconnect',
    location: 'During vacuum worker cycle',
    eventsCount: 19,
    affinity: 91
  }
];

export const REMEDIATION_STEPS: RemediationStep[] = [
  {
    step: 1,
    title: 'Increase the connection pool size in database/config.py:',
    snippet: 'POOL_SIZE = os.getenv("DB_POOL_SIZE", 100)  # was 50'
  },
  {
    step: 2,
    title: 'Implement aggressive statement timeouts to prevent hung worker slots:',
    snippet: 'statement_timeout = 3000ms'
  },
  {
    step: 3,
    title: 'Verify PostgreSQL instance limits before applying pool scaling:',
    snippet: 'SHOW max_connections;'
  },
  {
    step: 4,
    title: 'Add composite index on session lookup:',
    description: 'Applying index on users(session_token) will drop query duration from 420ms down to 2ms under active load.'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    sender: 'user',
    authorName: 'Sarah Jenkins',
    timestamp: '10:43 AM',
    content: 'Will restarting the container fix this temporarily?'
  },
  {
    id: 'm-2',
    sender: 'ai',
    authorName: 'LogLens AI Co-Pilot',
    timestamp: '10:43 AM',
    content: 'Yes, restarting will immediately release leaked pool handles, but the pool will exhaust again within ~15 minutes under current ingress load without the index patch.'
  }
];

// Histogram distribution data (24 bars)
export interface HistogramBar {
  timeLabel: string;
  info: number;
  warn: number;
  error: number;
  critical: number;
}

export const HISTOGRAM_DATA: HistogramBar[] = [
  { timeLabel: '24h ago', info: 48, warn: 14, error: 6, critical: 4 },
  { timeLabel: '23h ago', info: 55, warn: 12, error: 5, critical: 2 },
  { timeLabel: '22h ago', info: 62, warn: 9, error: 3, critical: 0 },
  { timeLabel: '21h ago', info: 42, warn: 18, error: 10, critical: 5 },
  { timeLabel: '20h ago', info: 35, warn: 20, error: 14, critical: 8 },
  { timeLabel: '19h ago', info: 60, warn: 15, error: 4, critical: 2 },
  { timeLabel: '18h ago', info: 72, warn: 11, error: 6, critical: 1 },
  { timeLabel: '17h ago', info: 40, warn: 22, error: 18, critical: 12 },
  { timeLabel: '16h ago', info: 28, warn: 25, error: 22, critical: 15 },
  { timeLabel: '15h ago', info: 49, warn: 19, error: 12, critical: 6 },
  { timeLabel: '14h ago', info: 66, warn: 14, error: 8, critical: 3 },
  { timeLabel: '13h ago', info: 70, warn: 12, error: 5, critical: 0 },
  { timeLabel: '12h ago', info: 62, warn: 10, error: 6, critical: 2 },
  { timeLabel: '11h ago', info: 58, warn: 15, error: 9, critical: 5 },
  { timeLabel: '10h ago', info: 45, warn: 20, error: 16, critical: 8 },
  { timeLabel: '9h ago', info: 30, warn: 28, error: 20, critical: 14 },
  { timeLabel: '8h ago', info: 54, warn: 18, error: 10, critical: 6 },
  { timeLabel: '7h ago', info: 68, warn: 12, error: 5, critical: 2 },
  { timeLabel: '6h ago', info: 64, warn: 14, error: 6, critical: 1 },
  { timeLabel: '5h ago', info: 52, warn: 16, error: 11, critical: 4 },
  { timeLabel: '4h ago', info: 47, warn: 19, error: 13, critical: 7 },
  { timeLabel: '3h ago', info: 59, warn: 15, error: 8, critical: 3 },
  { timeLabel: '2h ago', info: 61, warn: 13, error: 7, critical: 2 },
  { timeLabel: 'Just now', info: 74, warn: 11, error: 4, critical: 1 }
];
