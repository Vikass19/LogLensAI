import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { UploadLogsScreen } from './components/screens/UploadLogsScreen';
import { LogExplorerScreen } from './components/screens/LogExplorerScreen';
import { AiAnalysisScreen } from './components/screens/AiAnalysisScreen';
import { ErrorExplorerScreen } from './components/screens/ErrorExplorerScreen';
import { LogFilesScreen } from './components/screens/LogFilesScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { CommandPalette } from './components/common/CommandPalette';
import { GitHubIssueModal } from './components/modals/GitHubIssueModal';
import { DocModal } from './components/modals/DocModal';
import { FeedbackModal } from './components/modals/FeedbackModal';
import { INITIAL_FILES, TOP_ERRORS } from './data/mockTelemetry';
import { IngestionFile, ErrorGroup, LogEntry } from './types/telemetry';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('dashboard');
  const [currentProject, setCurrentProject] = useState<string>('prod-us-east-1');
  const [selectedFileName, setSelectedFileName] = useState<string>('application.log');
  const [selectedErrorId, setSelectedErrorId] = useState<string>('err-1');
  
  const [files, setFiles] = useState<IngestionFile[]>(INITIAL_FILES);
  const [errors, setErrors] = useState<ErrorGroup[]>(TOP_ERRORS);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  
  const [gitHubModalOpen, setGitHubModalOpen] = useState(false);
  const [activeGitHubLog, setActiveGitHubLog] = useState<LogEntry | null>(null);
  
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // Global keydown for ⌘K and shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (path: string, options?: { file?: string; errorId?: string }) => {
    if (path === 'documentation') {
      setDocModalOpen(true);
      return;
    }
    if (path === 'feedback-status') {
      setFeedbackModalOpen(true);
      return;
    }

    if (options?.file) {
      setSelectedFileName(options.file);
    }
    if (options?.errorId) {
      setSelectedErrorId(options.errorId);
    }

    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddFile = (newFile: IngestionFile) => {
    setFiles(prev => [newFile, ...prev]);
    setSelectedFileName(newFile.name);
  };

  const handleDeleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleOpenGitHubModal = (log: LogEntry) => {
    setActiveGitHubLog(log);
    setGitHubModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0f131b] text-[#dfe2ed] flex font-sans antialiased selection:bg-[#06b6d4] selection:text-[#00424f]">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentPath={currentPath}
        onNavigate={handleNavigate}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-60 min-w-0">
        {/* Top Header */}
        <Header 
          currentProject={currentProject}
          onSelectProject={setCurrentProject}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onNavigate={handleNavigate}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Viewport Content */}
        <main className="flex-1 w-full pt-16 p-4 sm:p-6 lg:p-8 bg-[#0f131b] min-h-[calc(100vh-3.5rem)]">
          {currentPath === 'dashboard' && (
            <DashboardScreen 
              onNavigate={handleNavigate}
              onSelectFile={setSelectedFileName}
              files={files}
              errors={errors}
            />
          )}

          {currentPath === 'upload-logs' && (
            <UploadLogsScreen 
              onNavigate={handleNavigate}
              onAddFile={handleAddFile}
            />
          )}

          {currentPath === 'log-explorer' && (
            <LogExplorerScreen 
              onNavigate={handleNavigate}
              selectedFileName={selectedFileName}
              onSelectFile={setSelectedFileName}
              onOpenGitHubModal={handleOpenGitHubModal}
            />
          )}

          {currentPath === 'ai-analysis' && (
            <AiAnalysisScreen 
              onNavigate={handleNavigate}
              selectedErrorId={selectedErrorId}
            />
          )}

          {currentPath === 'error-explorer' && (
            <ErrorExplorerScreen 
              onNavigate={handleNavigate}
              errors={errors}
            />
          )}

          {currentPath === 'log-files' && (
            <LogFilesScreen 
              files={files}
              onSelectFile={setSelectedFileName}
              onNavigate={handleNavigate}
              onDeleteFile={handleDeleteFile}
            />
          )}

          {currentPath === 'settings' && (
            <SettingsScreen />
          )}
        </main>
      </div>

      {/* ⌘K Command Palette Modal */}
      <CommandPalette 
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
        onSelectFile={setSelectedFileName}
      />

      {/* GitHub Issue Creation Modal */}
      <GitHubIssueModal 
        isOpen={gitHubModalOpen}
        onClose={() => setGitHubModalOpen(false)}
        log={activeGitHubLog}
      />

      {/* Ingestion Documentation / API Modal */}
      <DocModal 
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
      />

      {/* Cluster Status & Feedback Modal */}
      <FeedbackModal 
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />
    </div>
  );
}
