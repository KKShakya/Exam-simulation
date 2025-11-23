
import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Search, FileText, AlertTriangle, Loader2, ChevronDown, Check } from 'lucide-react';
import { PatternAnalysis } from '../types';
import { analyzeExamPattern } from '../services/geminiService';

// Custom Glass Select Component (Light Modern UI)
const GlassSelect = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: { value: string, label: string }[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div className="relative min-w-[280px]" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between appearance-none bg-white/60 backdrop-blur-xl border border-white/40 text-slate-800 rounded-xl px-5 py-3 shadow-sm hover:bg-white/80 transition-all font-medium ${isOpen ? 'ring-2 ring-indigo-500/50 border-indigo-300' : ''}`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`transition-transform duration-200 text-slate-500 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} size={18} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white/90 backdrop-blur-2xl border border-white/50 rounded-xl overflow-hidden shadow-xl z-50 animate-select-open max-h-60 overflow-y-auto ring-1 ring-black/5">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-5 py-3 text-sm transition-colors flex items-center justify-between
                ${value === option.value 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                  : 'text-slate-600 hover:bg-indigo-50/50 hover:text-slate-900'}
              `}
            >
              <span>{option.label}</span>
              {value === option.value && <Check size={16} className="text-indigo-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PatternAnalyzer: React.FC = () => {
  const [year, setYear] = useState('2024');
  const [examType, setExamType] = useState<'PO' | 'Clerk'>('PO');
  const [data, setData] = useState<PatternAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setData(null);
    const result = await analyzeExamPattern(examType, year);
    setData(result);
    setLoading(false);
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'UP': return '#10b981'; // green-500
      case 'DOWN': return '#ef4444'; // red-500
      default: return '#6366f1'; // indigo-500
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
       {/* Hero Section - Light Glassmorphic */}
       <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white/50 to-purple-50/80 backdrop-blur-lg border border-white/60 p-8 rounded-3xl shadow-xl">
         <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl"></div>
         <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2 text-slate-800">Exam Pattern Decode</h2>
            <p className="text-slate-500 mb-8 max-w-2xl">
              Leverage AI to analyze historical trends and predict expected weightage for specific topics.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4">
              <GlassSelect 
                value={examType}
                onChange={(val) => setExamType(val as 'PO' | 'Clerk')}
                options={[
                  { value: 'PO', label: 'IBPS RRB PO (Officer Scale-I)' },
                  { value: 'Clerk', label: 'IBPS RRB Clerk (Office Assistant)' }
                ]}
              />
              
              <div className="relative">
                <input 
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Year (e.g., 2023)"
                  className="bg-white/60 backdrop-blur-xl border border-white/40 text-slate-800 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-300 placeholder-slate-400 font-medium w-full md:w-48 shadow-sm transition-all"
                />
              </div>
              
              <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center shadow-lg hover:shadow-xl active:scale-95 duration-200"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Search className="mr-2" size={18} />}
                Analyze
              </button>
            </div>
         </div>
       </div>

       {data && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
           {/* Chart Section */}
           <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/60">
             <h3 className="text-xl font-bold text-slate-800 mb-6">Topic Weightage Analysis</h3>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data.subjectData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                   <XAxis type="number" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                   <YAxis dataKey="topic" type="category" width={120} tick={{fontSize: 12, fill: '#475569'}} axisLine={false} tickLine={false} />
                   <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                   />
                   <Bar dataKey="weightage" radius={[0, 4, 4, 0]} barSize={24}>
                     {data.subjectData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={getTrendColor(entry.trend)} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
             <div className="flex justify-center space-x-6 mt-6 text-sm">
               <div className="flex items-center text-slate-600"><div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2 shadow-sm"></div>Trending Up</div>
               <div className="flex items-center text-slate-600"><div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mr-2 shadow-sm"></div>Stable</div>
               <div className="flex items-center text-slate-600"><div className="w-2.5 h-2.5 bg-red-500 rounded-full mr-2 shadow-sm"></div>Trending Down</div>
             </div>
           </div>

           {/* Insights Section */}
           <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/60 lg:h-full overflow-y-auto">
             <div className="flex items-center space-x-2 mb-4 text-indigo-600">
               <div className="p-2 bg-indigo-50 rounded-lg">
                 <FileText size={20} />
               </div>
               <h3 className="text-xl font-bold text-slate-800">AI Summary</h3>
             </div>
             <div className="prose prose-sm prose-slate mb-6 text-slate-600 leading-relaxed">
               {data.summary}
             </div>
             
             <div className="bg-amber-50/80 border border-amber-100 p-4 rounded-xl">
               <div className="flex items-start">
                 <AlertTriangle size={20} className="text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                 <div>
                   <h4 className="font-bold text-amber-800 text-sm">Critical Note</h4>
                   <p className="text-amber-700 text-xs mt-1">
                     Trends fluctuate. Ensure you cover the basics of all topics, even if they are currently trending down.
                   </p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

       {!data && !loading && (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart className="text-slate-300" size={32} />
            </div>
            <p className="text-lg font-medium text-slate-500">Select exam details to generate an analysis report.</p>
          </div>
       )}
    </div>
  );
};

export default PatternAnalyzer;
