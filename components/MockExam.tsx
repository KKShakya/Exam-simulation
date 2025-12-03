
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Flag, X, CheckCircle2, RotateCcw, Target, LayoutGrid, FileText, ArrowRight, Play, Award, BarChart3, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { MockQuestion, ExamResult } from '../types';
import { parseMockFromText } from '../services/geminiService';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const MockExam: React.FC = () => {
  // Modes: 'setup' | 'config' | 'loading' | 'exam' | 'result'
  const [mode, setMode] = useState<'setup' | 'config' | 'loading' | 'exam' | 'result'>('setup');
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  
  // Setup State
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [targetTime, setTargetTime] = useState(30); // Default 30s
  
  // Exam State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [examId, setExamId] = useState<string>('');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  
  // Timer Refs
  const questionStartTimeRef = useRef<number>(Date.now());
  const [currentQTimer, setCurrentQTimer] = useState(0);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (mode === 'exam') {
      // Reset timer visual when question changes to reflect time spent SO FAR on this question
      // This is the "Bank" logic: if I spent 5s earlier, it starts at 5s.
      setCurrentQTimer(questions[currentQIndex]?.timeSpent || 0);
      questionStartTimeRef.current = Date.now();

      interval = setInterval(() => {
        const now = Date.now();
        // Visual update
        setCurrentQTimer(prev => prev + 1);
        
        // Data update: Increment the existing timeSpent for the current question
        setQuestions(prev => {
           const newQs = [...prev];
           // Safety check
           if (newQs[currentQIndex]) {
             newQs[currentQIndex].timeSpent += 1;
           }
           return newQs;
        });
        
        questionStartTimeRef.current = now;
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, currentQIndex]);


  const handleParseText = async () => {
    if (!questionText.trim()) {
      alert("Please paste the questions first.");
      return;
    }
    setMode('loading');
    const qs = await parseMockFromText(questionText, answerText);
    if (qs.length > 0) {
      setQuestions(qs);
      setMode('config');
    } else {
      setMode('setup');
      alert("Could not parse questions. Please ensure text is readable.");
    }
  };

  const startExam = () => {
    setMode('exam');
    setExamId(Date.now().toString());
    setCurrentQIndex(0);
    questionStartTimeRef.current = Date.now();
  };

  const updateStatus = (idx: number, status: MockQuestion['status'], answer?: number) => {
    setQuestions(prev => {
      const newQs = [...prev];
      newQs[idx] = { 
        ...newQs[idx], 
        status: status,
        userAnswer: answer !== undefined ? answer : newQs[idx].userAnswer
      };
      return newQs;
    });
  };

  const changeQuestion = (newIndex: number) => {
    setCurrentQIndex(newIndex);
  };

  const handleSaveAndNext = () => {
    const q = questions[currentQIndex];
    if (q.userAnswer !== undefined) {
       updateStatus(currentQIndex, 'answered');
    } else if (q.status === 'not_visited') {
       updateStatus(currentQIndex, 'not_answered');
    }
    if (currentQIndex < questions.length - 1) {
      changeQuestion(currentQIndex + 1);
    }
  };

  const handleMarkAndNext = () => {
    const q = questions[currentQIndex];
    if (q.userAnswer !== undefined) {
      updateStatus(currentQIndex, 'marked_answered');
    } else {
      updateStatus(currentQIndex, 'marked');
    }
    if (currentQIndex < questions.length - 1) {
      changeQuestion(currentQIndex + 1);
    }
  };

  const handleClearResponse = () => {
    setQuestions(prev => {
      const newQs = [...prev];
      newQs[currentQIndex].userAnswer = undefined;
      newQs[currentQIndex].status = 'not_answered';
      return newQs;
    });
  };

  const handleSubmitExam = () => {
    // Calculate Score
    let correct = 0;
    let wrong = 0;
    questions.forEach(q => {
      if (q.userAnswer !== undefined) {
        if (q.userAnswer === q.correctAnswerIndex) correct++;
        else wrong++;
      }
    });
    const score = correct * 1 - wrong * 0.25;

    const result: ExamResult = {
      id: examId,
      timestamp: Date.now(),
      score: score,
      totalQuestions: questions.length,
      targetTimePerQuestion: targetTime,
      questions: questions
    };

    const existingHistory = localStorage.getItem('bankedge_exam_history');
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    localStorage.setItem('bankedge_exam_history', JSON.stringify([result, ...history]));

    setMode('result');
  };

  const getTimerColor = (time: number) => {
    if (time <= targetTime) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (time <= targetTime + 10) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200 animate-pulse';
  };

  // --- Renders ---

  if (mode === 'setup') {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-10">
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-2">
            <LayoutGrid className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Drill Engine
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Paste your questions, set a target time, and build speed. 
            <br/>AI will auto-solve if you don't have an answer key.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block font-bold text-slate-700 flex items-center gap-2 text-lg">
              <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600 border border-indigo-100"><FileText size={20} /></div>
              Input Questions (Required)
            </label>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <textarea 
                  className="w-full h-80 p-6 text-sm border border-slate-200/60 bg-white/80 backdrop-blur-xl rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-xl resize-none font-mono text-slate-600"
                  placeholder="Paste the raw text of questions here...&#10;1. A train moving at speed...&#10;2. Ratio of ages..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block font-bold text-slate-700 flex items-center gap-2 text-lg">
              <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600 border border-emerald-100"><CheckCircle2 size={20} /></div>
              Input Answer Key (Optional)
            </label>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <textarea 
                  className="w-full h-80 p-6 text-sm border border-slate-200/60 bg-white/80 backdrop-blur-xl rounded-2xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all shadow-xl resize-none font-mono text-slate-600"
                  placeholder="If you have the key, paste it here.&#10;1. B&#10;2. C&#10;3. A&#10;&#10;If left empty, AI will solve the questions for you."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button 
            onClick={handleParseText}
            disabled={!questionText.trim()}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-slate-900 font-lg rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
             <span>Next Step</span>
             <ArrowRight className="ml-2 -mr-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-8 animate-in fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <div className="w-24 h-24 border-4 border-slate-100 rounded-full relative bg-white shadow-xl">
             <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-slate-800">Processing Exam Data</h3>
          <p className="text-slate-500">
            {answerText.trim() ? "Mapping questions to provided key..." : "AI is solving your questions..."}
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'config') {
    return (
      <div className="max-w-xl mx-auto text-center animate-in zoom-in-95 mt-10">
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-3xl -ml-16 -mb-16"></div>
           
           <div className="relative z-10">
             <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-600 shadow-inner">
               <Target size={36} />
             </div>
             <h2 className="text-3xl font-bold text-slate-800 mb-3">Set Your Target</h2>
             <p className="text-slate-500 mb-10 text-lg">
               Time per question
               <br/><span className="text-sm text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-full mt-2 inline-block">Timer turns RED if exceeded</span>
             </p>
             
             <div className="mb-12 px-4">
               <div className="relative h-2 bg-slate-200 rounded-full mb-8">
                 <div className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full" style={{ width: `${(targetTime / 120) * 100}%` }}></div>
                 <input 
                   type="range" 
                   min="10" 
                   max="120" 
                   step="5"
                   value={targetTime}
                   onChange={(e) => setTargetTime(parseInt(e.target.value))}
                   className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                 />
                 <div 
                   className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-indigo-500 rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-all hover:scale-110"
                   style={{ left: `${(targetTime / 120) * 100}%`, transform: `translate(-50%, -50%)` }}
                 >
                   <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                 </div>
               </div>
               
               <div className="text-6xl font-extrabold text-indigo-600 font-mono tracking-tighter">
                 {targetTime}<span className="text-2xl text-slate-400 ml-1">s</span>
               </div>
             </div>

             <div className="flex gap-4">
               <button 
                 onClick={() => setMode('setup')} 
                 className="flex-1 py-4 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
               >
                 Back
               </button>
               <button 
                 onClick={startExam} 
                 className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
               >
                 <Play size={20} fill="currentColor" /> Start Drill
               </button>
             </div>
           </div>
        </div>
      </div>
    );
  }

  if (mode === 'result') {
    let correct = 0, wrong = 0, skipped = 0;
    let sniper = 0, struggle = 0, gambler = 0, timeWaster = 0;

    questions.forEach(q => {
      const isCorrect = q.userAnswer === q.correctAnswerIndex;
      const isFast = q.timeSpent <= targetTime;
      const attempted = q.userAnswer !== undefined;

      if (!attempted) {
        skipped++;
      } else {
        if (isCorrect) correct++; else wrong++;
        
        if (isCorrect && isFast) sniper++;
        else if (isCorrect && !isFast) struggle++;
        else if (!isCorrect && isFast) gambler++;
        else if (!isCorrect && !isFast) timeWaster++;
      }
    });

    const score = correct * 1 - wrong * 0.25;
    
    const quadrantData = [
      { name: 'Sniper', value: sniper, color: '#10b981' }, // Emerald
      { name: 'Struggle', value: struggle, color: '#f59e0b' }, // Amber
      { name: 'Gambler', value: gambler, color: '#6366f1' }, // Indigo
      { name: 'Time Waster', value: timeWaster, color: '#ef4444' } // Red
    ].filter(d => d.value > 0);

    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Score Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-8 rounded-3xl shadow-2xl md:col-span-1 border border-white/10">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
               <h2 className="text-lg font-bold text-indigo-100 mb-6 flex items-center gap-2">
                 <Award className="text-yellow-400" /> Exam Summary
               </h2>
               <div className="flex items-baseline gap-1 mb-2">
                  <div className="text-6xl font-extrabold tracking-tighter text-white">{score}</div>
                  <div className="text-xl text-indigo-200">/ {questions.length}</div>
               </div>
               <div className="h-1 w-full bg-indigo-900/30 rounded-full mb-8 overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{width: `${Math.max(0, (score/questions.length)*100)}%`}}></div>
               </div>
               
               <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/5">
                  <span className="text-emerald-300 font-bold flex items-center gap-2"><CheckCircle2 size={16}/> Correct</span>
                  <span className="font-mono text-xl">{correct}</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/5">
                  <span className="text-red-300 font-bold flex items-center gap-2"><X size={16}/> Wrong</span>
                  <span className="font-mono text-xl">{wrong}</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/5">
                  <span className="text-indigo-200 font-bold flex items-center gap-2"><Flag size={16}/> Skipped</span>
                  <span className="font-mono text-xl">{skipped}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quadrant Chart */}
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/60 md:col-span-2 flex flex-col relative">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                 <BarChart3 size={24} />
               </div>
               <div>
                 <h3 className="font-bold text-slate-800 text-lg">Time-Accuracy Matrix</h3>
                 <p className="text-slate-500 text-sm">Analyze your speed vs accuracy quadrants</p>
               </div>
             </div>
             
             {quadrantData.length > 0 ? (
               <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8">
                 <div className="h-64 w-64 relative">
                   <ResponsiveContainer>
                     <PieChart>
                       <Pie data={quadrantData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                         {quadrantData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                       </Pie>
                       <Tooltip 
                         contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}
                         itemStyle={{fontWeight: 'bold', color: '#334155'}}
                       />
                     </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                      <span className="text-3xl font-bold text-slate-800">{correct + wrong}</span>
                      <span className="text-xs text-slate-400 font-bold uppercase">Attempts</span>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    {quadrantData.map(d => (
                      <div key={d.name} className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-white/50 shadow-sm">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor: d.color}} />
                        <div>
                          <p className="font-bold text-slate-800 text-lg">{d.value}</p>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{d.name}</p>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
             ) : (
               <div className="flex-1 flex items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 m-4">
                 No attempts made to analyze.
               </div>
             )}
          </div>
        </div>

        {/* Detailed Review */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-md flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <FileText className="text-indigo-600" size={20}/> Question Analysis
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {questions.map((q, i) => {
               const isCorrect = q.userAnswer === q.correctAnswerIndex;
               const isFast = q.timeSpent <= targetTime;
               let badge = "Unattempted";
               let badgeColor = "bg-slate-100 text-slate-600";
               
               if (q.userAnswer !== undefined) {
                 if (isCorrect && isFast) { badge = "Sniper"; badgeColor = "bg-emerald-100 text-emerald-700"; }
                 else if (isCorrect && !isFast) { badge = "Struggle"; badgeColor = "bg-amber-100 text-amber-700"; }
                 else if (!isCorrect && isFast) { badge = "Gambler"; badgeColor = "bg-indigo-100 text-indigo-700"; }
                 else { badge = "Time Waster"; badgeColor = "bg-red-100 text-red-700"; }
               }

               return (
                 <div key={i} className="p-6 hover:bg-white/60 transition-colors group">
                   <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                      <div className="flex items-start gap-4">
                         <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full font-bold text-sm ${isCorrect ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500/20' : q.userAnswer === undefined ? 'bg-slate-100 text-slate-500' : 'bg-red-100 text-red-700 ring-2 ring-red-500/20'}`}>
                           {i+1}
                         </span>
                         <div>
                            <p className="text-slate-800 font-medium text-lg leading-relaxed mb-1">{q.questionText}</p>
                            <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${badgeColor}`}>
                              {badge}
                            </span>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 self-start md:self-auto min-w-max">
                         <div className={`flex items-center gap-1.5 font-mono font-bold ${q.timeSpent > targetTime ? 'text-red-500' : 'text-slate-500'}`}>
                           <Clock size={16} /> {q.timeSpent}s
                         </div>
                         <div className="h-4 w-px bg-slate-300"></div>
                         <div className="text-slate-400 font-mono text-xs font-medium">Target: {targetTime}s</div>
                      </div>
                   </div>
                   
                   <div className="pl-12 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, idx) => (
                          <div key={idx} className={`px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-3 ${idx === q.correctAnswerIndex ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : idx === q.userAnswer ? 'border-red-200 bg-red-50 text-red-800' : 'border-slate-100 bg-white text-slate-500 opacity-70'}`}>
                              {idx === q.correctAnswerIndex && <CheckCircle2 size={18} className="text-emerald-600" />}
                              {idx === q.userAnswer && idx !== q.correctAnswerIndex && <X size={18} className="text-red-600" />}
                              {opt}
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-indigo-50/50 p-4 rounded-xl text-sm text-slate-600 border border-indigo-100/50">
                        <span className="font-bold text-indigo-700 block mb-1">Explanation</span>
                        {q.explanation}
                      </div>
                   </div>
                 </div>
               );
            })}
          </div>
        </div>

        <button onClick={() => setMode('setup')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">Start New Drill</button>
      </div>
    );
  }

  // --- Exam Interface ---

  const currentQ = questions[currentQIndex];

  return (
    <div className="fixed inset-0 bg-slate-50/50 z-50 flex flex-col font-sans backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10"></div>
      
      {/* Header */}
      <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-white/50 flex items-center justify-between px-6 lg:px-12 shadow-sm z-20">
         <div className="flex items-center gap-6">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-lg shadow-indigo-500/30">
               <Target size={24} />
            </div>
            <div>
               <h1 className="font-bold text-xl text-slate-800 tracking-tight">Drill Mode</h1>
               <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span>{questions.length} Questions</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-amber-600 font-bold">Target: {targetTime}s</span>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <button 
             onClick={() => setIsPaletteOpen(!isPaletteOpen)}
             className="md:hidden bg-white border border-slate-200 p-2.5 rounded-xl text-slate-600 shadow-sm"
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={handleSubmitExam}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Finish Drill
            </button>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0">
           
           {/* Floating Timer */}
           <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
              <div className={`px-6 py-2 rounded-full border border-white/20 backdrop-blur-md shadow-xl transition-all duration-500 flex items-center gap-3 ${getTimerColor(currentQTimer)}`}>
                 <Clock size={20} />
                 <span className="font-mono text-2xl font-bold tracking-widest">{currentQTimer}s</span>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
              <div className="w-full max-w-4xl mt-12 mb-24">
                  {/* Question Card */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 md:p-12 relative overflow-hidden">
                     {/* Decorative background blob */}
                     <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 -z-10"></div>
                     
                     <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                        <span className="text-sm font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">Question {currentQIndex + 1}</span>
                        {currentQ.status === 'marked' || currentQ.status === 'marked_answered' ? (
                           <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold">
                              <Flag size={14} fill="currentColor" /> MARKED
                           </div>
                        ) : null}
                     </div>
                     
                     <p className="text-xl md:text-3xl font-medium text-slate-800 leading-relaxed mb-10 font-serif">
                       {currentQ.questionText}
                     </p>

                     <div className="space-y-4">
                       {currentQ.options.map((opt, idx) => (
                         <label key={idx} className={`flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all group ${currentQ.userAnswer === idx ? 'border-indigo-600 bg-indigo-50/50 shadow-inner' : 'border-slate-100 bg-white/50 hover:border-indigo-200 hover:bg-white hover:shadow-md'}`}>
                           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${currentQ.userAnswer === idx ? 'border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                              {currentQ.userAnswer === idx && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                           </div>
                           <span className={`text-lg ${currentQ.userAnswer === idx ? 'text-indigo-900 font-bold' : 'text-slate-600 font-medium'}`}>{opt}</span>
                           <input 
                             type="radio" 
                             className="hidden"
                             name={`q-${currentQIndex}`}
                             checked={currentQ.userAnswer === idx}
                             onChange={() => {
                               setQuestions(prev => {
                                 const n = [...prev];
                                 n[currentQIndex].userAnswer = idx;
                                 return n;
                               });
                             }}
                           />
                         </label>
                       ))}
                     </div>
                  </div>
              </div>
           </div>

           {/* Floating Footer Control */}
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-white/90 backdrop-blur-xl border border-white/50 px-6 py-4 rounded-2xl shadow-2xl z-40 flex items-center justify-between">
              <div className="flex gap-2">
                 <button onClick={handleMarkAndNext} className="p-3 rounded-xl hover:bg-purple-50 text-slate-500 hover:text-purple-600 transition-colors flex flex-col items-center gap-1 group" title="Mark for Review">
                    <Flag size={20} className="group-hover:fill-purple-600 transition-colors"/>
                 </button>
                 <button onClick={handleClearResponse} className="p-3 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors flex flex-col items-center gap-1 group" title="Clear Response">
                    <RotateCcw size={20} />
                 </button>
              </div>

              <div className="flex gap-4">
                 <button 
                   onClick={() => changeQuestion(Math.max(0, currentQIndex - 1))}
                   disabled={currentQIndex === 0}
                   className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center gap-2"
                 >
                   <ChevronLeft size={20} /> Prev
                 </button>
                 <button 
                   onClick={handleSaveAndNext}
                   className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
                 >
                   {currentQIndex === questions.length - 1 ? 'Finish' : 'Save & Next'} <ChevronRight size={20} />
                 </button>
              </div>
           </div>
        </div>

        {/* Right Palette (Glassmorphic) */}
        <div className={`
          fixed inset-y-0 right-0 w-80 bg-white/80 backdrop-blur-2xl border-l border-white/50 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col
          md:static md:translate-x-0 md:shadow-none md:bg-white/40 md:backdrop-blur-none md:w-72
          ${isPaletteOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
           <div className="p-5 border-b border-slate-200/50 flex justify-between items-center md:hidden">
              <span className="font-bold text-slate-800">Question Palette</span>
              <button onClick={() => setIsPaletteOpen(false)}><X size={24} /></button>
           </div>
           
           <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Jump to Question</h3>
              <div className="grid grid-cols-4 gap-3">
                 {questions.map((q, idx) => {
                    let bg = "bg-white border-slate-200 text-slate-600 hover:border-indigo-300";
                    if (idx === currentQIndex) bg = "ring-2 ring-indigo-500 border-transparent bg-indigo-50 text-indigo-700 shadow-md transform scale-105";
                    else if (q.status === 'answered') bg = "bg-emerald-500 text-white border-transparent shadow-sm";
                    else if (q.status === 'not_answered') bg = "bg-red-500 text-white border-transparent shadow-sm";
                    else if (q.status === 'marked') bg = "bg-purple-500 text-white border-transparent shadow-sm";
                    else if (q.status === 'marked_answered') bg = "bg-purple-600 text-white border-transparent ring-2 ring-emerald-400 shadow-sm";

                    return (
                      <button 
                        key={idx}
                        onClick={() => changeQuestion(idx)}
                        className={`h-12 rounded-xl font-bold text-sm transition-all duration-200 ${bg}`}
                      >
                        {idx + 1}
                      </button>
                    )
                 })}
              </div>
           </div>
           
           <div className="p-6 bg-white/50 border-t border-slate-200/50 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-500">
                 <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm"></div> Answered</div>
                 <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm"></div> Skipped</div>
                 <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-purple-500 rounded-full shadow-sm"></div> Marked</div>
                 <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-white border border-slate-300 rounded-full"></div> Unvisited</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MockExam;
