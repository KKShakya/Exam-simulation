
import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Search, FileText, AlertTriangle, Loader2, ChevronDown, Check } from 'lucide-react';
import { PatternAnalysis } from '../types';
import { analyzeExamPattern } from '../services/geminiService';

// Custom Glass Select Component
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
        className={`w-full flex items-center justify-between appearance-none bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 outline-none hover:bg-white/20 transition-all font-medium ${isOpen ? 'ring-2 ring-indigo-500/50' : ''}`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={18} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 glass-panel-dark rounded-xl overflow-hidden shadow-2xl z-50 animate-select-open max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full text-left px-5 py-3 text-sm text-slate-200 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>{option.label}</span>
              {value === option.value && <Check size={16} className="text-emerald-400" />}
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
       <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 rounded-2xl text-white shadow-xl">
         <h2 className="text-3xl font-bold mb-2">Exam Pattern Decode</h2>
         <p className="text-slate-300 mb-6">
           Leverage AI to analyze historical trends and predict expected weightage for specific topics.
         </p>
         
         <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
           
           <GlassSelect 
             value={examType}
             onChange={(val) => setExamType(val as 'PO' | 'Clerk')}
             options={[
               { value: 'PO', label: 'IBPS RRB PO (Officer Scale-I)' },
               { value: 'Clerk', label: 'IBPS RRB Clerk (Office Assistant)' }
             ]}
           />
           
           <input 
             type="text"
             value={year}
             onChange={(e) => setYear(e.target.value)}
             placeholder="Year (e.g., 2023)"
             className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-white/40 font-medium w-full md:w-48"
           />
           
           <button 
             onClick={handleAnalyze}
             disabled={loading}
             className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center shadow-lg shadow-indigo-500/30"
           >
             {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Search className="mr-2" size={18} />}
             Analyze
           </button>
         </div>
       </div>

       {data && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
           {/* Chart Section */}
           <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="text-xl font-bold text-slate-800 mb-6">Topic Weightage Analysis</h3>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data.subjectData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                   <XAxis type="number" />
                   <YAxis dataKey="topic" type="category" width={100} tick={{fontSize: 12}} />
                   <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   />
                   <Bar dataKey="weightage" radius={[0, 4, 4, 0]} barSize={20}>
                     {data.subjectData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={getTrendColor(entry.trend)} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
             <div className="flex justify-center space-x-6 mt-4 text-sm">
               <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>Trending Up</div>
               <div className="flex items-center"><div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>Stable</div>
               <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>Trending Down</div>
             </div>
           </div>

           {/* Insights Section */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:h-full overflow-y-auto">
             <div className="flex items-center space-x-2 mb-4 text-indigo-600">
               <FileText size={24} />
               <h3 className="text-xl font-bold text-slate-800">AI Summary</h3>
             </div>
             <p className="text-slate-600 leading-relaxed text-sm mb-6">
               {data.summary}
             </p>
             
             <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
               <div className="flex items-start">
                 <AlertTriangle size={20} className="text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
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
          <div className="text-center py-20 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 text-slate-400">
            <BarChart className="mx-auto mb-4 opacity-20" size={64} />
            <p className="text-lg font-medium">Select exam details to generate an analysis report.</p>
          </div>
       )}
    </div>
  );
};

export default PatternAnalyzer;
