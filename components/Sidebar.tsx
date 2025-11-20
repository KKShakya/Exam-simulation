import React from 'react';
import { LayoutDashboard, MessageSquare, BookOpen, BarChart2, Menu, X, MonitorPlay, Zap, FileText } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notes', label: 'Smart Notes', icon: FileText },
    { id: 'mock', label: 'Mock Exam', icon: MonitorPlay },
    { id: 'speed', label: 'Speed Math', icon: Zap },
    { id: 'chat', label: 'AI Tutor Chat', icon: MessageSquare },
    { id: 'practice', label: 'Practice Zone', icon: BookOpen },
    { id: 'analysis', label: 'Pattern Analysis', icon: BarChart2 },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-indigo-900 text-white z-30 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:block
      `}>
        <div className="flex items-center justify-between p-6 border-b border-indigo-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-xl">B</span>
            </div>
            <span className="font-bold text-xl tracking-wide">BankEdge</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-indigo-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm">
              AI
            </div>
            <div>
              <p className="text-sm font-medium">Gemini Pro</p>
              <p className="text-xs text-indigo-300">Active</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;