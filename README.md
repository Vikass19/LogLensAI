# LogLensAI 🔍⚡

> Autonomous Log Intelligence & Cloud Telemetry Observability Dashboard.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

LogLensAI is a high-density, real-time observability platform designed for SREs and DevOps teams to ingest, search, cluster, and autonomously diagnose microservice production errors and database connection bottlenecks.

---

## ✨ Features

- **📊 Real-time Telemetry Dashboard**: KPI cards with live trend sparklines, 24-hour multi-severity histogram (`INFO`, `WARN`, `ERROR`, `CRIT`), peak ingestion rate monitoring, and recent log file archives.
- **⚡ Live Tail Log Explorer**: Sub-second streaming logs, regex search (`status:>=500`, `service:Database`), multi-facet filtering, and collapsible rows with inline stack traces.
- **🤖 Autonomous AI Root Cause Analysis**: Identifies failure mechanisms with 94%+ confidence, visualizes active call stacks (Python/Node/Go), generates 4-step remediation plans with copyable code snippets, and features an interactive **Incident Co-Pilot Chat**.
- **📥 Telemetry Ingestion Pipeline**: Drag-and-drop parser for `.log`, `.txt`, `.json`, and `.gz` archives with OpenTelemetry ECS schema normalization.
- **🐞 Error Fingerprint Clustering**: Deduplicated anomaly signatures grouping recurring error spikes across Kubernetes and serverless clusters.
- **🐙 GitHub Issue Integration**: One-click modal to publish pre-filled issue reports containing stack traces, request IDs, and severity tags.
- **⌨️ Command Palette (`⌘K`)**: Instant keyboard navigation to jump between files, errors, and observability views.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Dark Mode
- **Icons**: Lucide React + Material Symbols
- **Typography**: Geist (Sans) + JetBrains Mono (Data/Code)
- **Bundler**: Vite

---

## 🚀 Quick Start

### Prerequisites
- Node.js `18+` or `20+`
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Vikass19/LogLensAI

# Navigate to project directory
cd loglens-ai

# Install dependencies
npm install

# Start local development server (runs on port 3000)
npm run dev
```

### Production Build

```bash
# Type check and build production bundle
npm run build

# Preview build locally
npm run preview
```

---

## 📁 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── common/         # LogLensLogo, CommandPalette
│   │   ├── layout/         # Header, Sidebar (responsive navigation)
│   │   ├── modals/         # GitHubIssueModal, DocModal, FeedbackModal
│   │   └── screens/        # Dashboard, UploadLogs, LogExplorer, AiAnalysis, etc.
│   ├── data/               # Production log streams & telemetry fixtures
│   ├── types/              # TypeScript definitions for logs, errors & files
│   ├── App.tsx             # Root router & workspace state orchestration
│   ├── index.css           # Tailwind v4 theme & font definitions
│   └── main.tsx            # Application entry point
├── index.html              # HTML shell with Google Fonts & metadata
├── metadata.json           # Application manifest
└── package.json
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘ + K` or `Ctrl + K` | Open global Command Palette |
| `ESC` | Close modal / Command Palette |

---

## 🔒 Security & Privacy

LogLensAI follows a **Zero-Retention Privacy Guarantee (SOC2 Type II)**: telemetry streams and log dumps are dynamically scrubbed of API keys, bearer tokens, passwords, and PII prior to model analysis.

---

## 📄 License

This project is licensed under the Apache 2.0 License.
