
import React, { useState, useRef, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, HelpCircle, RefreshCcw, BarChart2, ChevronDown, Check } from 'lucide-react';
import { Subject, Difficulty, Question } from '../types';
import { generatePracticeQuestions } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Custom Select for Light Mode (Refined Glassmorphism)
const LightGlassSelect = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: { value: string, label: string }[] }) => {
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
    <div className="relative w-full" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-3 outline-none hover:border-indigo-300 focus:ring-4 focus:ring-indigo-100/50 transition-all font-medium shadow-sm hover:shadow-md ${isOpen ? 'border-indigo-500 ring-4 ring-indigo-100/50' : ''}`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} size={18} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl border border-white/50 rounded-xl overflow-hidden shadow-xl z-50 animate-select-open max-h-60 overflow-y-auto ring-1 ring-black/5">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors ${value === option.value ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
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

const PracticeZone: React.FC<{ initialTopic?: string, initialDifficulty?: Difficulty }> = ({ initialTopic, initialDifficulty }) => {
  const [config, setConfig] = useState({
    subject: Subject.QUANT,
    difficulty: initialDifficulty || Difficulty.MODERATE,
    topic: initialTopic || '',
    count: 5
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: number}>({});
  const [showExplanation, setShowExplanation] = useState<{[key: number]: boolean}>({});

  const handleGenerate = async () => {
    if (!config.topic) {
      alert("Please enter a specific topic (e.g., 'Number Series' or 'Data Interpretation')");
      return;
    }
    setLoading(true);
    setQuestions([]);
    setUserAnswers({});
    setShowExplanation({});
    
    const generatedQuestions = await generatePracticeQuestions(config.subject, config.difficulty, config.topic, config.count);
    setQuestions(generatedQuestions);
    setLoading(false);
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (userAnswers[questionIdx] !== undefined) return; // Prevent changing answer
    setUserAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
    setShowExplanation(prev => ({ ...prev, [questionIdx]: true }));
  };

  // Colors for charts
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const renderChart = (q: Question) => {
    if (!q.chartData) return null;

    return (
      <div className="h-[300px] w-full bg-slate-50/50 border border-slate-100 rounded-lg p-4 mb-6">
        <h4 className="text-center font-bold text-slate-700 mb-2 text-sm">{q.chartData.title}</h4>
        <ResponsiveContainer width="100%" height="90%">
          {q.chartData.type === 'bar' ? (
            <BarChart data={q.chartData.data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.1)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={q.chartData.data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {q.chartData.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle"/>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg mr-3">
             <RefreshCcw size={20} />
          </div>
          Question Generator
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
            <LightGlassSelect 
              value={config.subject}
              onChange={(val) => setConfig({...config, subject: val as Subject})}
              options={Object.values(Subject).map(s => ({ value: s, label: s }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty Level</label>
            <LightGlassSelect 
              value={config.difficulty}
              onChange={(val) => setConfig({...config, difficulty: val as Difficulty})}
              options={Object.values(Difficulty).map(d => ({ value: d, label: d }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Specific Topic</label>
            <div className="flex gap-2">
               <div className="relative flex-1">
                 <input 
                  type="text" 
                  placeholder="e.g., Number Series, Data Interpretation, Blood Relations..."
                  className="w-full p-3 pl-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-400 outline-none bg-slate-50 focus:bg-white transition-all shadow-sm"
                  value={config.topic}
                  onChange={(e) => setConfig({...config, topic: e.target.value})}
                />
               </div>
              <button 
                onClick={() => setConfig(prev => ({...prev, topic: 'Data Interpretation'}))}
                className="px-4 py-2 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 flex items-center gap-1 text-sm font-medium whitespace-nowrap transition-colors border border-slate-200 shadow-sm hover:border-indigo-200"
              >
                <BarChart2 size={16} /> Try DI
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 ml-1">Tip: Type 'Data Interpretation' or 'Pie Chart' to see interactive graphs.</p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-70 transition-all flex items-center shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform active:scale-95 duration-200"
          >
            {loading ? <><Loader2 className="animate-spin mr-2" /> Generating...</> : 'Generate Questions'}
          </button>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                   <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100">
                     Q{qIdx + 1} • {q.difficulty}
                   </span>
                </div>

                {/* Render Chart if exists */}
                {renderChart(q)}

                <p className="text-lg font-medium text-slate-800 mb-8 leading-relaxed">{q.questionText}</p>
                
                <div className="space-y-3">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userAnswers[qIdx] === oIdx;
                    const isCorrect = q.correctAnswerIndex === oIdx;
                    const showResult = userAnswers[qIdx] !== undefined;

                    let btnClass = "border-slate-200 hover:bg-slate-50";
                    if (showResult) {
                      if (isCorrect) btnClass = "bg-green-50 border-green-500 text-green-800 shadow-sm";
                      else if (isSelected && !isCorrect) btnClass = "bg-red-50 border-red-500 text-red-800 shadow-sm";
                      else btnClass = "border-slate-100 opacity-50";
                    } else if (isSelected) {
                       btnClass = "border-indigo-500 bg-indigo-50 shadow-sm";
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(qIdx, oIdx)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${btnClass}`}
                      >
                        <span className="font-medium">{opt}</span>
                        {showResult && isCorrect && <CheckCircle size={20} className="text-green-600" />}
                        {showResult && isSelected && !isCorrect && <XCircle size={20} className="text-red-600" />}
                        {!showResult && <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-indigo-400 transition-colors"></div>}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {showExplanation[qIdx] && (
                <div className="bg-slate-50/80 p-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                   <div className="flex items-center space-x-2 text-indigo-700 font-bold mb-3">
                     <HelpCircle size={18} />
                     <span>Explanation</span>
                   </div>
                   <p className="text-slate-600 leading-relaxed text-sm">{q.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PracticeZone;
