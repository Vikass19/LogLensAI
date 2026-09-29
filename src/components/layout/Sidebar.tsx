import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  FolderArchive, 
  Terminal, 
  AlertOctagon, 
  BrainCircuit, 
  Settings, 
  BookOpen, 
  Activity, 
  ChevronsUpDown, 
  LogOut,
  X
} from 'lucide-react';
import { LogLensLogo } from '../common/LogLensLogo';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}) => {
  const observabilityNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload-logs', label: 'Upload Logs', icon: UploadCloud },
    { id: 'log-files', label: 'Log Files', icon: FolderArchive },
    { id: 'log-explorer', label: 'Log Explorer', icon: Terminal },
    { id: 'error-explorer', label: 'Error Explorer', icon: AlertOctagon },
    { id: 'ai-analysis', label: 'AI Analysis', icon: BrainCircuit, highlight: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const platformNav = [
    { id: 'documentation', label: 'Documentation / API', icon: BookOpen },
    { id: 'feedback-status', label: 'Feedback & Status', icon: Activity, hasPing: true },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen w-60 bg-[#0a0e15] z-50 flex flex-col justify-between 
        border-r border-[#3d494c]/30 select-none transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Section & Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo Brand Header */}
          <div className="h-14 flex items-center justify-between px-3.5 border-b border-[#3d494c]/20">
            <LogLensLogo size={28} />
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-[#869397] hover:text-[#dfe2ed]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Observability Section */}
          <div className="px-3.5 pt-3.5 pb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#869397]">
              Observability
            </span>
          </div>

          <nav className="flex flex-col gap-0.5 px-2">
            {observabilityNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left
                    ${isActive 
                      ? 'bg-[#1c2027] text-[#4cd7f6] font-semibold border-l-2 border-[#4cd7f6]' 
                      : 'text-[#bcc9cd] hover:bg-[#181c23] hover:text-[#dfe2ed]'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${item.highlight && !isActive ? 'text-[#89ceff]' : ''}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Platform Section */}
          <div className="px-3.5 pt-4 pb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#869397]">
              Platform
            </span>
          </div>

          <nav className="flex flex-col gap-0.5 px-2">
            {platformNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left
                    ${isActive 
                      ? 'bg-[#1c2027] text-[#4cd7f6] font-semibold border-l-2 border-[#4cd7f6]' 
                      : 'text-[#bcc9cd] hover:bg-[#181c23] hover:text-[#dfe2ed]'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.hasPing && (
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4cd7f6] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4cd7f6]"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Bar */}
        <div className="border-t border-[#3d494c]/30 p-2 bg-[#0a0e15]">
          <div 
            onClick={() => handleNavClick('settings')}
            className="flex items-center justify-between p-1.5 rounded-lg bg-[#181c23]/60 hover:bg-[#1c2027] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <img 
                alt="Sarah Jenkins"
                className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#3d494c]/50"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2zg-d5kaJ7SWKJmGwdtRTqICkmfL8kCIDRGneP2OJ_6jCRRVLXQ6RTOS9DTiSatgxZHq0TWVTZ_0TxDSsVqi-TOT5SVsPZYTrJ9oY5q5rp3rlTfnVXDlRejREDpguFs_m4az7u2dOhLIKp00XPrqKzTZZAxVdI4x21S7dehTkiqchhfdtF_awSSrWPvpszfW09v4arO2O6eQIo0GDhzgBSlN0o_0_Eh8aYK7NBH1l6GgC111rvjznGg"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#dfe2ed] truncate">Sarah Jenkins</span>
                <span className="font-mono text-[9px] text-[#869397] truncate">Lead DevOps / Staff SRE</span>
              </div>
            </div>
            <button className="text-[#869397] hover:text-[#dfe2ed] p-1">
              <ChevronsUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2 px-1 flex items-center justify-between font-mono text-[10px] text-[#869397]">
            <span className="truncate">Acme Cloud Prod</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                alert('Session locked. Re-authenticate via SSO to resume.');
              }}
              className="hover:text-[#ff5449] transition-colors p-0.5" 
              title="Sign out of cluster"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
