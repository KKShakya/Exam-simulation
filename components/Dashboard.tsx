import React from 'react';
import { Target, TrendingUp, Brain, Clock, MonitorPlay, Zap, AlertTriangle, ArrowRight } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string, props?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Welcome back, Aspirant</h1>
        <p className="text-slate-500">Let's crush IBPS RRB 2025. Select a module to begin.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Daily Target', value: '45 Qs', icon: Target, color: 'bg-blue-500' },
          { title: 'Mock Score', value: '58.5/80', icon: TrendingUp, color: 'bg-green-500' },
          { title: 'Concepts Learned', value: '12', icon: Brain, color: 'bg-purple-500' },
          { title: 'Study Time', value: '3.5 Hrs', icon: Clock, color: 'bg-orange-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className={`${stat.color} p-3 rounded-lg text-white`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="md:col-span-2 space-y-6">
           <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-lg p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">Attempt a Full Mock</h2>
              <p className="text-indigo-100 mb-6 max-w-md">
                Simulate the real IBPS RRB interface. 45 minutes, 80 questions, exact exam environment.
              </p>
              <button 
                onClick={() => onNavigate('mock')}
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors inline-flex items-center"
              >
                <MonitorPlay className="mr-2" size={20} />
                Enter Exam Hall
              </button>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 transform skew-x-12 translate-x-8" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weak Areas Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between group hover:border-red-100 transition-colors cursor-pointer" onClick={() => onNavigate('practice', { difficulty: 'Difficult' })}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                   <div className="bg-red-100 p-2 rounded-lg text-red-600">
                     <AlertTriangle size={20} />
                   </div>
                   <h3 className="font-bold text-slate-800">Focus Weak Areas</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Based on your patterns, you need more practice in <span className="font-semibold text-red-500">Difficult DI</span> & <span className="font-semibold text-red-500">Puzzles</span>.
                </p>
              </div>
              <div className="mt-4 text-red-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Improve Now <ArrowRight size={16} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center justify-between group hover:border-amber-100 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <Zap size={18} className="text-amber-500" />
                   <h3 className="font-bold text-slate-800">Speed Math</h3>
                </div>
                <p className="text-sm text-slate-500">Tables & Exam Multiplications.</p>
              </div>
              <button 
                onClick={() => onNavigate('speed')}
                className="text-indigo-600 font-semibold hover:text-indigo-700"
              >
                Play &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Pattern Insight */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Exam Insight</h3>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-sm text-amber-800 font-medium">Trend Alert</p>
              <p className="text-xs text-amber-600 mt-1">
                Puzzles with variables (Blood relation + Seating) have increased by 20% in recent PO Mains.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('analysis')}
              className="w-full text-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View Detailed Analysis &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;