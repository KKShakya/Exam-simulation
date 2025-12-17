
import React from 'react';
import { MonitorPlay, Zap, FileText, Youtube, BarChart2, ArrowRight, Feather, Globe, Monitor } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string, props?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Welcome Aspirant</h1>
        <p className="text-slate-500">Your simplified command center for IBPS RRB preparation.</p>
      </header>

      {/* Hero Section: Drill Engine */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/10">
              FEATURED TOOL
            </div>
            <h2 className="text-3xl font-bold">Paste & Drill Engine</h2>
            <p className="text-indigo-100 text-lg leading-relaxed">
              Don't just solve. Drill. Paste your questions, set a target timer (e.g., 20s), and let the AI analyze your speed quadrants.
            </p>
            <button 
              onClick={() => onNavigate('mock')}
              className="bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mt-4"
            >
              Open Drill Engine <ArrowRight size={20} />
            </button>
          </div>
          <div className="hidden md:block opacity-80 transform group-hover:scale-105 transition-transform duration-500">
            <MonitorPlay size={120} strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Speed Math */}
        <div 
          onClick={() => onNavigate('speed')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
              <Zap size={28} />
            </div>
            <ArrowRight size={20} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Speed Maths</h3>
          <p className="text-slate-500 text-sm">
            Access Topper's Cheat Sheet, Viral Maths, and specific drills for tables, squares, and cubes.
          </p>
        </div>

        {/* English Fever */}
        <div 
          onClick={() => onNavigate('english')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-pink-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-pink-100 text-pink-600 rounded-xl group-hover:scale-110 transition-transform">
              <Feather size={28} />
            </div>
            <ArrowRight size={20} className="text-slate-300 group-hover:text-pink-500 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">English Fever</h3>
          <p className="text-slate-500 text-sm">
            The Master Cheat Sheet for Grammar, Rules of Logic, and the 'Frequent Traps' module.
          </p>
        </div>

        {/* GK Mania */}
        <div 
          onClick={() => onNavigate('gk')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <Globe size={28} />
            </div>
            <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">GK Mania</h3>
          <p className="text-slate-500 text-sm">
            Banking Awareness, Static GK, and Monthly Current Affairs timeline.
          </p>
        </div>

        {/* Computer Se Pyaar (NEW) */}
        <div 
          onClick={() => onNavigate('computer')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-cyan-100 text-cyan-600 rounded-xl group-hover:scale-110 transition-transform">
              <Monitor size={28} />
            </div>
            <ArrowRight size={20} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Computer Se Pyaar</h3>
          <p className="text-slate-500 text-sm">
            Zero to Hero in Computer Awareness. Memory Hierarchy, Networking & Protocols.
          </p>
        </div>

        {/* Smart Notes */}
        <div 
          onClick={() => onNavigate('notes')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
              <FileText size={28} />
            </div>
            <ArrowRight size={20} className="text-slate-300 group-hover:text-purple-500 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Smart Notes</h3>
          <p className="text-slate-500 text-sm">
            Review your Golden Numbers list, Inequality rules, and AI-summarized study material.
          </p>
        </div>

        {/* Video Classes */}
        <div 
          onClick={() => onNavigate('video')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-red-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
              <Youtube size={28} />
            </div>
            <ArrowRight size={20} className="text-slate-300 group-hover:text-red-500 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Video Classes</h3>
          <p className="text-slate-500 text-sm">
            Curated playlists from top educators like Shantanu Shukla and Saurav Singh.
          </p>
        </div>

        {/* Pattern Analysis */}
        <div 
          onClick={() => onNavigate('analysis')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <BarChart2 size={28} />
            </div>
            <ArrowRight size={20} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Pattern Analysis</h3>
          <p className="text-slate-500 text-sm">
            Decode exam trends, weightage shifts, and AI predictions for RRB PO & Clerk.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
