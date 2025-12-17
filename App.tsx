
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatternAnalyzer from './components/PatternAnalyzer';
import MockExam from './components/MockExam';
import SpeedMath from './components/SpeedMath';
import SmartNotes from './components/SmartNotes';
import YouTubeZone from './components/YouTubeZone';
import EnglishFever from './components/EnglishFever';
import GkMania from './components/GkMania';
import ComputerSePyaar from './components/ComputerSePyaar';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Navigation props to pass data between tabs (e.g. Dashboard -> Practice with specific difficulty)
  const [navProps, setNavProps] = useState<any>({});

  const handleNavigate = (tab: string, props?: any) => {
    if (props) setNavProps(props);
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'mock':
        return <MockExam />;
      case 'speed':
        return <SpeedMath />;
      case 'english':
        return <EnglishFever />;
      case 'gk':
        return <GkMania />;
      case 'computer':
        return <ComputerSePyaar />;
      case 'notes':
        return <SmartNotes />;
      case 'video':
        return <YouTubeZone />;
      case 'analysis':
        return <PatternAnalyzer />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-10">
          <div className="font-bold text-indigo-900 text-lg">BankEdge</div>
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600">
            <Menu size={24} />
          </button>
        </header>

        {/* Main Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
