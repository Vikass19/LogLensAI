import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Key, 
  ShieldCheck, 
  BellRing, 
  Cpu, 
  Check, 
  Copy, 
  CheckCircle2, 
  Save, 
  RefreshCw,
  Database
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const [apiKey, setApiKey] = useState('ll_live_948fbc28a0119f4e28cd8201a7');
  const [retentionDays, setRetentionDays] = useState(30);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXXX');
  const [aiModel, setAiModel] = useState('Claude 3.5 Sonnet (Default)');
  const [copiedKey, setCopiedKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#181c23] p-5 rounded-xl border border-[#3d494c]/30 shadow-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#4cd7f6]" />
            <h1 className="text-xl sm:text-2xl text-[#dfe2ed] font-bold tracking-tight">
              Settings & Ingestion Configuration
            </h1>
          </div>
          <p className="text-xs text-[#869397]">
            Manage telemetry pipeline API credentials, vector storage retention, notification webhooks and diagnostic models.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 font-mono text-xs border border-emerald-500/40">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Ingestion API Keys */}
        <div className="bg-[#181c23] p-5 rounded-xl border border-[#3d494c]/30 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#3d494c]/20 pb-3">
            <Key className="w-4 h-4 text-[#4cd7f6]" />
            <h2 className="text-sm font-semibold text-[#dfe2ed]">Ingestion API Token</h2>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#869397]">Bearer Token for FluentBit / OpenTelemetry Collector</label>
            <div className="flex items-center gap-2">
              <input 
                type="text"
                readOnly
                value={apiKey}
                className="w-full bg-[#0a0e15] border border-[#3d494c]/40 rounded-lg px-3 py-2 text-xs font-mono text-[#4cd7f6] focus:outline-none"
              />
              <button 
                type="button"
                onClick={copyKey}
                className="px-3.5 py-2 rounded-lg bg-[#262a32] text-[#dfe2ed] hover:bg-[#31353d] transition-colors text-xs font-mono flex items-center gap-1 border border-[#3d494c]/40 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedKey ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#869397]">
              Pass this key in HTTP headers: <code className="text-[#dfe2ed] font-mono">Authorization: Bearer &lt;TOKEN&gt;</code>
            </p>
          </div>
        </div>

        {/* SOC2 Retention & Privacy Policy */}
        <div className="bg-[#181c23] p-5 rounded-xl border border-[#3d494c]/30 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#3d494c]/20 pb-3">
            <ShieldCheck className="w-4 h-4 text-[#89ceff]" />
            <h2 className="text-sm font-semibold text-[#dfe2ed]">Compliance & Data Retention</h2>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#dfe2ed]">Telemetry Vector Index TTL</span>
                <span className="text-[11px] text-[#869397]">Automated crypto-shredding after specified retention window</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <select 
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(Number(e.target.value))}
                  className="bg-[#0a0e15] text-[#dfe2ed] border border-[#3d494c]/40 rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  <option value={7}>7 Days (Development)</option>
                  <option value={30}>30 Days (Standard SOC2)</option>
                  <option value={90}>90 Days (Enterprise)</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0a0e15] border border-[#3d494c]/20 text-[11px] text-[#869397] leading-relaxed">
              PII redaction engine is active. Regex masks SSNs, credit cards, JWT tokens, AWS keys and passwords before streaming to vector indexers.
            </div>
          </div>
        </div>

        {/* AI Analysis Model Selection */}
        <div className="bg-[#181c23] p-5 rounded-xl border border-[#3d494c]/30 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#3d494c]/20 pb-3">
            <Cpu className="w-4 h-4 text-[#c0c1ff]" />
            <h2 className="text-sm font-semibold text-[#dfe2ed]">Autonomous Diagnostics Model</h2>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#869397]">Select Primary Neural Engine for Root Cause Inference</label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="bg-[#0a0e15] text-[#dfe2ed] font-mono text-xs border border-[#3d494c]/40 rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
            >
              <option value="Claude 3.5 Sonnet (Default)">Claude 3.5 Sonnet (Recommended for code & stack traces)</option>
              <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Ultra-long context telemetry analysis)</option>
              <option value="GPT-4o">GPT-4o (Standard enterprise reasoning)</option>
            </select>
          </div>
        </div>

        {/* Alert Notifications */}
        <div className="bg-[#181c23] p-5 rounded-xl border border-[#3d494c]/30 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#3d494c]/20 pb-3">
            <BellRing className="w-4 h-4 text-[#ff5449]" />
            <h2 className="text-sm font-semibold text-[#dfe2ed]">Incident Notification Webhooks</h2>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#869397]">Slack Webhook URL for Critical Telemetry Alerts</label>
            <input 
              type="text"
              value={slackWebhook}
              onChange={(e) => setSlackWebhook(e.target.value)}
              className="bg-[#0a0e15] text-[#dfe2ed] font-mono text-xs border border-[#3d494c]/40 rounded-lg px-3 py-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#06b6d4] text-[#00424f] hover:bg-[#4cd7f6] text-xs font-semibold shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
