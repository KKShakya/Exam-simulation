import React, { useState, useEffect, useRef } from 'react';
import { Zap, Book, Timer, Trophy, ChevronLeft, RefreshCcw, Brain, Eye, X } from 'lucide-react';

type Category = 'tables' | 'squares' | 'cubes' | 'alpha' | 'percent' | 'multiplication';

const SpeedMath: React.FC = () => {
  const [mode, setMode] = useState<'menu' | 'practice' | 'reference'>('menu');
  const [category, setCategory] = useState<Category>('tables');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [question, setQuestion] = useState({ text: '', answer: '' });
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Data Sets ---

  const fractionMap = [
    { f: '1/2', p: '50' }, { f: '1/3', p: '33.33' }, { f: '2/3', p: '66.66' },
    { f: '1/4', p: '25' }, { f: '3/4', p: '75' },
    { f: '1/5', p: '20' }, { f: '2/5', p: '40' }, { f: '3/5', p: '60' }, { f: '4/5', p: '80' },
    { f: '1/6', p: '16.66' }, { f: '5/6', p: '83.33' },
    { f: '1/7', p: '14.28' }, { f: '2/7', p: '28.57' },
    { f: '1/8', p: '12.5' }, { f: '3/8', p: '37.5' }, { f: '5/8', p: '62.5' }, { f: '7/8', p: '87.5' },
    { f: '1/9', p: '11.11' }, { f: '2/9', p: '22.22' },
    { f: '1/10', p: '10' },
    { f: '1/11', p: '9.09' }, { f: '2/11', p: '18.18' },
    { f: '1/12', p: '8.33' },
    { f: '1/13', p: '7.69' },
    { f: '1/14', p: '7.14' },
    { f: '1/15', p: '6.66' },
    { f: '1/16', p: '6.25' },
    { f: '1/20', p: '5' },
    { f: '1/24', p: '4.16' },
    { f: '1/25', p: '4' },
    { f: '1/30', p: '3.33' },
    { f: '1/40', p: '2.5' },
    { f: '1/50', p: '2' }
  ];

  const examMultiplications = [
    // Consecutive numbers (n * n+1) - Very common in Series
    { q: '11 × 12', a: '132' }, { q: '12 × 13', a: '156' }, { q: '13 × 14', a: '182' },
    { q: '14 × 15', a: '210' }, { q: '15 × 16', a: '240' }, { q: '16 × 17', a: '272' },
    { q: '17 × 18', a: '306' }, { q: '18 × 19', a: '342' }, { q: '19 × 20', a: '380' },
    { q: '20 × 21', a: '420' }, { q: '24 × 25', a: '600' },
    // Common Exam Pairs (Simplification frequent fliers)
    { q: '56 × 18', a: '1008' }, { q: '18 × 56', a: '1008' },
    { q: '15 × 18', a: '270' }, { q: '18 × 15', a: '270' },
    { q: '12 × 15', a: '180' }, { q: '15 × 12', a: '180' },
    { q: '12 × 18', a: '216' }, { q: '18 × 12', a: '216' },
    { q: '25 × 18', a: '450' }, { q: '18 × 25', a: '450' },
    { q: '14 × 18', a: '252' }, { q: '18 × 14', a: '252' },
    { q: '16 × 18', a: '288' }, { q: '18 × 16', a: '288' },
    { q: '25 × 14', a: '350' }, { q: '14 × 25', a: '350' },
    { q: '25 × 16', a: '400' }, { q: '16 × 25', a: '400' },
    { q: '35 × 12', a: '420' }, { q: '12 × 35', a: '420' },
    { q: '45 × 12', a: '540' }, { q: '12 × 45', a: '540' },
    { q: '75 × 12', a: '900' }, { q: '12 × 75', a: '900' },
    { q: '36 × 15', a: '540' }, { q: '15 × 36', a: '540' },
    { q: '24 × 15', a: '360' }, { q: '15 × 24', a: '360' },
    // Special patterns
    { q: '37 × 3', a: '111' }, { q: '37 × 6', a: '222' }, { q: '37 × 9', a: '333' },
    { q: '37 × 27', a: '999' },
    { q: '11 × 11', a: '121' }, { q: '111 × 11', a: '1221' },
    { q: '101 × 25', a: '2525' }, { q: '101 × 44', a: '4444' },
    // Squaring numbers ending in 5
    { q: '35 × 35', a: '1225' }, { q: '45 × 45', a: '2025' }, 
    { q: '55 × 55', a: '3025' }, { q: '65 × 65', a: '4225' },
    { q: '75 × 75', a: '5625' }
  ];

  // --- Game Logic ---

  const generateQuestion = (cat: Category) => {
    let q = '', a = '';
    switch (cat) {
      case 'tables': {
        // Modified to restrict multiplier to 1-10 as per user request
        const num = Math.floor(Math.random() * 24) + 2; // 2 to 25
        const mult = Math.floor(Math.random() * 10) + 1; // 1 to 10 ONLY
        q = `${num} × ${mult}`;
        a = (num * mult).toString();
        break;
      }
      case 'squares': {
        const num = Math.floor(Math.random() * 49) + 2; // 2 to 50
        q = `${num}²`;
        a = (num * num).toString();
        break;
      }
      case 'cubes': {
        const num = Math.floor(Math.random() * 24) + 2; // 2 to 25
        q = `${num}³`;
        a = (num * num * num).toString();
        break;
      }
      case 'alpha': {
        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const idx = Math.floor(Math.random() * 26);
        q = alpha[idx];
        a = (idx + 1).toString();
        break;
      }
      case 'percent': {
        const item = fractionMap[Math.floor(Math.random() * fractionMap.length)];
        q = `${item.p}% = ?`;
        a = item.f;
        break;
      }
      case 'multiplication': {
        const item = examMultiplications[Math.floor(Math.random() * examMultiplications.length)];
        q = item.q;
        a = item.a;
        break;
      }
    }
    setQuestion({ text: q, answer: a });
  };

  const startGame = (cat: Category) => {
    setCategory(cat);
    setMode('practice');
    setScore(0);
    setTimeLeft(60);
    setIsActive(true);
    setInput('');
    generateQuestion(cat);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);

    // Check answer immediately
    if (val.trim().toLowerCase() === question.answer.toLowerCase()) {
      setScore((s) => s + 1);
      setFeedback('correct');
      setInput('');
      generateQuestion(category);
      setTimeout(() => setFeedback('none'), 200);
    }
  };

  // --- Render Helpers ---

  const renderReference = () => {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 pb-10">
         <button onClick={() => setMode('menu')} className="mb-4 flex items-center text-slate-500 hover:text-indigo-600">
           <ChevronLeft size={20} /> Back to Menu
         </button>
         <h2 className="text-2xl font-bold mb-6 capitalize text-slate-800">Study {category === 'multiplication' ? 'High-Yield Multiplications' : category}</h2>
         
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
           {category === 'tables' && Array.from({length: 24}, (_, i) => i + 2).map(num => (
             <div key={num} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
               <h3 className="font-bold text-indigo-600 border-b border-slate-100 mb-2 pb-1">Table of {num}</h3>
               <div className="text-sm space-y-1 text-slate-600">
                 {[1,2,3,4,5,6,7,8,9,10].map(m => (
                   <div key={m} className="flex justify-between">
                     <span>{num} × {m}</span>
                     <span className="font-bold">{num*m}</span>
                   </div>
                 ))}
               </div>
             </div>
           ))}

           {category === 'squares' && Array.from({length: 50}, (_, i) => i + 1).map(num => (
             <div key={num} className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center">
               <span className="text-slate-500 font-medium">{num}²</span>
               <span className="text-lg font-bold text-indigo-700">{num*num}</span>
             </div>
           ))}

           {category === 'cubes' && Array.from({length: 25}, (_, i) => i + 1).map(num => (
             <div key={num} className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center">
               <span className="text-slate-500 font-medium">{num}³</span>
               <span className="text-lg font-bold text-indigo-700">{num*num*num}</span>
             </div>
           ))}

           {category === 'alpha' && "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map((char, i) => (
              <div key={char} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-800">{char}</span>
                <span className="text-lg font-bold text-indigo-600">{i+1}</span>
                <span className="text-xs text-slate-400 mt-1">Reverse: {27-(i+1)}</span>
              </div>
           ))}

            {category === 'percent' && fractionMap.map((item, i) => (
               <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center">
                 <span className="font-bold text-indigo-600">{item.p}%</span>
                 <span className="text-lg font-serif text-slate-700">{item.f}</span>
               </div>
            ))}

            {category === 'multiplication' && examMultiplications.map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center">
                <span className="text-slate-500 font-medium text-sm">{item.q}</span>
                <span className="text-lg font-bold text-indigo-700">{item.a}</span>
              </div>
            ))}
         </div>
      </div>
    );
  };

  const renderMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="lg:col-span-3 text-center mb-4">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Speed Math Trainer</h2>
        <p className="text-slate-500">Build muscle memory for faster calculations. Choose a module.</p>
      </div>

      {[
        { id: 'tables', label: 'Tables (1-10)', icon: Zap, color: 'bg-amber-500' },
        { id: 'squares', label: 'Squares (1-50)', icon: Brain, color: 'bg-blue-500' },
        { id: 'cubes', label: 'Cubes (1-25)', icon: Brain, color: 'bg-indigo-500' },
        { id: 'alpha', label: 'Alphabet Ranks', icon: Eye, color: 'bg-emerald-500' },
        { id: 'percent', label: '% to Fractions', icon: RefreshCcw, color: 'bg-rose-500' },
        { id: 'multiplication', label: 'Exam Multiplications', icon: X, color: 'bg-violet-500' },
      ].map((item) => (
        <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 overflow-hidden">
          <div className={`h-2 ${item.color}`} />
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2 rounded-lg ${item.color} bg-opacity-10 text-${item.color.split('-')[1]}-600`}>
                <item.icon size={24} className={`text-${item.color.replace('bg-', '').replace('500', '600')}`} />
              </div>
              <h3 className="font-bold text-lg text-slate-800">{item.label}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => { setCategory(item.id as Category); setMode('reference'); }}
                className="flex items-center justify-center py-2 px-4 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Book size={16} className="mr-2" /> Study
              </button>
              <button 
                onClick={() => startGame(item.id as Category)}
                className="flex items-center justify-center py-2 px-4 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                <Zap size={16} className="mr-2" /> Blitz
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGame = () => (
    <div className="max-w-2xl mx-auto text-center animate-in zoom-in-95 duration-200">
      {timeLeft > 0 ? (
        <>
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-2 text-slate-500">
              <Timer size={20} />
              <span className="font-mono text-xl font-bold">{timeLeft}s</span>
            </div>
            <div className="flex items-center space-x-2 text-indigo-600">
              <Trophy size={20} />
              <span className="font-mono text-xl font-bold">{score}</span>
            </div>
          </div>

          <div className="mb-12 relative">
            <div className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-4">
               {category === 'percent' ? 'Find the fraction for' : 'Solve this'}
            </div>
            <div className={`text-6xl md:text-8xl font-bold text-slate-800 transition-transform duration-100 ${feedback === 'correct' ? 'scale-110 text-green-600' : ''}`}>
              {question.text}
            </div>
            {feedback === 'correct' && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-100 opacity-75"></span>
               </div>
            )}
          </div>

          <div className="max-w-xs mx-auto">
            <input
              ref={inputRef}
              type={category === 'percent' ? 'text' : 'number'}
              value={input}
              onChange={handleInput}
              placeholder="Type Answer..."
              className="w-full bg-white border-2 border-slate-200 rounded-xl py-4 text-center text-2xl font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
              autoFocus
            />
            <p className="mt-4 text-slate-400 text-sm">
              {category === 'alpha' && 'Type number position'}
              {category === 'percent' && 'Type fraction (e.g., 1/2)'}
              {(category !== 'alpha' && category !== 'percent') && 'Type result'}
            </p>
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={40} className="text-yellow-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Time's Up!</h2>
          <p className="text-slate-500 mb-8">You scored</p>
          <div className="text-6xl font-bold text-indigo-600 mb-8">{score}</div>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setMode('menu')}
              className="px-6 py-3 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
            >
              Back to Menu
            </button>
            <button 
              onClick={() => startGame(category)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto">
      {mode === 'menu' && renderMenu()}
      {mode === 'reference' && renderReference()}
      {mode === 'practice' && renderGame()}
    </div>
  );
};

export default SpeedMath;