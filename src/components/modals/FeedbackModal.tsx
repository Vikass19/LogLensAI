import React, { useState } from 'react';
import { Activity, X, Check, CheckCircle2, MessageSquare, AlertTriangle } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#181c23] border border-[#3d494c]/60 rounded-xl shadow-2xl p-5 z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#3d494c]/30 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#4cd7f6]" />
            <h2 className="text-base font-bold text-[#dfe2ed]">Platform Status & Feedback</h2>
          </div>
          <button onClick={onClose} className="p-1 text-[#869397] hover:text-[#dfe2ed]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Service Status */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-[#869397] uppercase tracking-wider font-mono">
            Operational Cluster Health
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#0a0e15] border border-[#3d494c]/30 flex items-center justify-between">
              <span className="text-[#bcc9cd]">Log Ingestion</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 99.98%
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0a0e15] border border-[#3d494c]/30 flex items-center justify-between">
              <span className="text-[#bcc9cd]">AI Neural Engine</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Online
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0a0e15] border border-[#3d494c]/30 flex items-center justify-between">
              <span className="text-[#bcc9cd]">Vector Store</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0a0e15] border border-[#3d494c]/30 flex items-center justify-between">
              <span className="text-[#bcc9cd]">Live Tail Stream</span>
              <span className="flex items-center gap-1.5 text-[#4cd7f6] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse"></span> 24ms
              </span>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="py-6 flex flex-col items-center justify-center text-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-[#4cd7f6]" />
            <span className="text-sm font-bold text-[#dfe2ed]">Thank you for your telemetry feedback!</span>
            <span className="text-xs text-[#869397]">Transmitted directly to the LogLens SRE engineering team.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-[#869397] font-semibold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send SRE Feedback or Report False Positives</span>
            </div>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Notice an issue with error clustering or AI remediation accuracy? Let us know..."
              className="w-full bg-[#0a0e15] border border-[#3d494c]/40 rounded-lg p-2.5 text-xs text-[#dfe2ed] placeholder-[#869397] focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-[#262a32] text-[#dfe2ed] text-xs"
              >
                Close
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#06b6d4] text-[#00424f] hover:bg-[#4cd7f6] text-xs font-semibold"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
