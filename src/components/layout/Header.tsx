import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  ChevronDown, 
  Menu, 
  Check, 
  AlertTriangle,
  Flame,
  Clock
} from 'lucide-react';

interface HeaderProps {
  currentProject: string;
  onSelectProject: (proj: string) => void;
  onOpenCommandPalette: () => void;
  onNavigate: (path: string) => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  onSelectProject,
  onOpenCommandPalette,
  onNavigate,
  onToggleMobileMenu,
}) => {
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const projects = [
    { id: 'prod-us-east-1', name: 'prod-us-east-1', region: 'N. Virginia', status: 'Healthy' },
    { id: 'staging-eu-central-1', name: 'staging-eu-central-1', region: 'Frankfurt', status: 'Healthy' },
    { id: 'dev-sandbox-01', name: 'dev-sandbox-01', region: 'Oregon', status: 'Degraded' },
  ];

  const notifications = [
    {
      id: 'n-1',
      title: 'DatabaseConnectionError',
      desc: 'Connection pool exhausted on db-primary (127 occurrences)',
      time: '2m ago',
      level: 'critical',
      path: 'ai-analysis'
    },
    {
      id: 'n-2',
      title: 'Payment Gateway Timeout',
      desc: 'Upstream HTTP 504 on POST /v1/charge (req_9f28a1)',
      time: '5m ago',
      level: 'critical',
      path: 'log-explorer'
    },
    {
      id: 'n-3',
      title: 'Cache Replica Degradation',
      desc: 'High memory saturation > 92% on Redis replica-02',
      time: '18m ago',
      level: 'warning',
      path: 'error-explorer'
    }
  ];

  return (
    <header className="fixed top-0 left-0 lg:left-60 right-0 h-14 bg-[#0f131b]/90 backdrop-blur-md border-b border-[#3d494c]/30 z-40 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile hamburger & Project Breadcrumb */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobileMenu}
          className="lg:hidden p-1.5 rounded-lg bg-[#1c2027] text-[#dfe2ed] hover:bg-[#262a32]"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 font-mono text-xs sm:text-[12px]">
          <span className="text-[#869397] hidden sm:inline">Project:</span>
          
          {/* Project dropdown */}
          <div className="relative">
            <button 
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className="flex items-center gap-1.5 text-[#4cd7f6] bg-[#262a32] px-2.5 py-1 rounded border border-[#4cd7f6]/25 hover:border-[#4cd7f6]/50 transition-colors font-semibold"
            >
              <span>{currentProject}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#869397]" />
            </button>

            {projectDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setProjectDropdownOpen(false)} 
                />
                <div className="absolute left-0 mt-1.5 w-64 bg-[#1c2027] border border-[#3d494c]/50 rounded-xl shadow-2xl py-1.5 z-50">
                  <div className="px-3 py-1.5 text-[11px] text-[#869397] font-semibold uppercase tracking-wider">
                    Switch Workspace Project
                  </div>
                  {projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        onSelectProject(proj.id);
                        setProjectDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#262a32] transition-colors ${
                        currentProject === proj.id ? 'bg-[#262a32]/60 text-[#4cd7f6]' : 'text-[#dfe2ed]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-medium">{proj.name}</span>
                        <span className="text-[10px] text-[#869397]">{proj.region}</span>
                      </div>
                      {currentProject === proj.id && (
                        <Check className="w-4 h-4 text-[#4cd7f6]" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <span className="text-[#869397] hidden sm:inline">/</span>
          <span className="text-[#dfe2ed] font-medium hidden sm:inline">LogLens</span>
        </div>
      </div>

      {/* Center: Search input triggering Command Palette */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#0a0e15] border border-[#3d494c]/40 hover:border-[#4cd7f6]/50 text-left text-[#869397] transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#869397] group-hover:text-[#4cd7f6] transition-colors" />
            <span className="text-xs text-[#869397]">Search logs, errors, traces...</span>
          </div>
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#262a32] text-[#bcc9cd] border border-[#3d494c]/40">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Live Latency Ping */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#181c23] border border-[#3d494c]/30">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
          <span className="font-mono text-xs text-[#bcc9cd]">24ms</span>
        </div>

        {/* Upload Log Button */}
        <button
          onClick={() => onNavigate('upload-logs')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#06b6d4] text-[#00424f] hover:bg-[#4cd7f6] transition-colors text-xs font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="whitespace-nowrap">Upload Log</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-1.5 rounded-lg text-[#bcc9cd] hover:text-[#dfe2ed] hover:bg-[#1c2027] transition-colors"
            title="Alert Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-[#ff5449] text-white font-mono text-[9px] flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {notifDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setNotifDropdownOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1c2027] border border-[#3d494c]/50 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-4 py-2 border-b border-[#3d494c]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#dfe2ed]">Active System Alerts</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#93000a] text-[#ffdad6] text-[10px] font-mono font-bold">3 Unresolved</span>
                  </div>
                  <button 
                    onClick={() => {
                      onNavigate('error-explorer');
                      setNotifDropdownOpen(false);
                    }}
                    className="text-[11px] text-[#4cd7f6] hover:underline"
                  >
                    View all
                  </button>
                </div>

                <div className="divide-y divide-[#3d494c]/20 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        onNavigate(n.path);
                        setNotifDropdownOpen(false);
                      }}
                      className="p-3 hover:bg-[#262a32] cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-[#dfe2ed]">
                          {n.level === 'critical' ? (
                            <Flame className="w-3.5 h-3.5 text-[#ff5449]" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />
                          )}
                          <span>{n.title}</span>
                        </div>
                        <span className="text-[10px] text-[#869397] font-mono flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#bcc9cd] mt-1 line-clamp-2">
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-4 w-px bg-[#3d494c]/40 hidden sm:block"></div>

        {/* Profile Avatar */}
        <div 
          onClick={() => onNavigate('settings')} 
          className="flex items-center gap-2 cursor-pointer group"
          title="Sarah Jenkins - Lead DevOps / Staff SRE"
        >
          <img 
            alt="Sarah Jenkins"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2zg-d5kaJ7SWKJmGwdtRTqICkmfL8kCIDRGneP2OJ_6jCRRVLXQ6RTOS9DTiSatgxZHq0TWVTZ_0TxDSsVqi-TOT5SVsPZYTrJ9oY5q5rp3rlTfnVXDlRejREDpguFs_m4az7u2dOhLIKp00XPrqKzTZZAxVdI4x21S7dehTkiqchhfdtF_awSSrWPvpszfW09v4arO2O6eQIo0GDhzgBSlN0o_0_Eh8aYK7NBH1l6GgC111rvjznGg"
            className="w-8 h-8 rounded-full object-cover border border-[#3d494c]/60 group-hover:border-[#4cd7f6] transition-colors"
          />
        </div>
      </div>
    </header>
  );
};
