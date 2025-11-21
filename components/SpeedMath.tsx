import React, { useState, useEffect, useRef } from 'react';
import { Zap, Book, Timer, Trophy, ChevronLeft, RefreshCcw, Brain, Eye, X, Flame, Star } from 'lucide-react';

type Category = 'tables' | 'squares' | 'cubes' | 'alpha' | 'percent' | 'multiplication';
type ViralCategory = 'viral_products' | 'viral_addition' | 'viral_subtraction' | 'viral_multiplication' | 'viral_squares' | 'viral_division';

// --- Data Sets ---

const VIRAL_CONCEPTS = {
  viral_products: {
    title: "Important Products (Chaurahas)",
    description: "Specific high-frequency multiplications seen in exams.",
    tricks: [
      { name: "The 37 Series", logic: "37 × 3 = 111, 37 × 6 = 222... 37 × 27 = 999" },
      { name: "The 12 Series", logic: "12 × 9 = 108, 12 × 12 = 144, 12 × 13 = 156" },
      { name: "The 13-19 Mix", logic: "13 × 7 = 91, 17 × 3 = 51, 19 × 9 = 171" }
    ],
    generator: () => {
      const set = [
        {q: '37 × 3', a: '111'}, {q: '37 × 6', a: '222'}, {q: '37 × 9', a: '333'}, {q: '37 × 12', a: '444'},
        {q: '37 × 15', a: '555'}, {q: '37 × 18', a: '666'}, {q: '37 × 21', a: '777'}, {q: '37 × 24', a: '888'}, {q: '37 × 27', a: '999'},
        {q: '12 × 9', a: '108'}, {q: '27 × 4', a: '108'}, {q: '18 × 6', a: '108'},
        {q: '24 × 6', a: '144'}, {q: '16 × 9', a: '144'}, {q: '18 × 8', a: '144'},
        {q: '12 × 13', a: '156'}, {q: '13 × 14', a: '182'}, {q: '14 × 15', a: '210'},
        {q: '15 × 16', a: '240'}, {q: '16 × 17', a: '272'}, {q: '17 × 18', a: '306'}
      ];
      return set[Math.floor(Math.random() * set.length)];
    }
  },
  viral_addition: {
    title: "Viral Addition",
    description: "Todu-Modu, Ram-Shyam (Judwa), and Giddh approaches.",
    tricks: [
      { name: "Todu-Modu", logic: "Break numbers: 86 + 7 -> (80 + 6) + 7 -> 80 + 13 = 93" },
      { name: "Ram-Shyam (Judwa)", logic: "Adding reverse numbers: 36 + 63. Sum of digits × 11. (3+6)×11 = 99." },
      { name: "Padosan Approach", logic: "Numbers close to each other: 35 + 42. Double smaller (35×2=70) + Diff(7) = 77." },
      { name: "Tiding-Tiding", logic: "Use Base 100/200. 67 + 96 -> 67 + (100-4) -> 167 - 4 = 163." }
    ],
    generator: () => {
      const type = Math.random();
      if (type < 0.4) {
        // Judwa (Reverse)
        const a = Math.floor(Math.random() * 8) + 1;
        const b = Math.floor(Math.random() * 8) + 1;
        if(a===b) return { q: '45 + 54', a: '99' }; // fallback
        const num1 = parseInt(`${a}${b}`);
        const num2 = parseInt(`${b}${a}`);
        return { q: `${num1} + ${num2}`, a: (num1+num2).toString() };
      } else {
        // General / Todu Modu
        const n1 = Math.floor(Math.random() * 80) + 15;
        const n2 = Math.floor(Math.random() * 9) + 4;
        return { q: `${n1} + ${n2}`, a: (n1+n2).toString() };
      }
    }
  },
  viral_subtraction: {
    title: "Viral Subtraction",
    description: "Sita-Gita, Nadiya Paar, and Shopkeeper methods.",
    tricks: [
      { name: "Sita-Gita (Judwa)", logic: "Subtracting reverse numbers: 63 - 36. Diff of digits × 9. (6-3)×9 = 27." },
      { name: "Nadiya Paar", logic: "Base method. 915 - 888. (915 is +15 from 900, 888 is -12). Add margins: 15+12=27." },
      { name: "Bhai-Bhai", logic: "Subtracting 20s from 50. 50 - 26 = 24. 50 - 28 = 22." }
    ],
    generator: () => {
      const type = Math.random();
      if (type < 0.5) {
        // Judwa
        let a = Math.floor(Math.random() * 9) + 1;
        let b = Math.floor(Math.random() * (a - 1)); // b < a
        if(isNaN(b)) { a=6; b=3; }
        const n1 = parseInt(`${a}${b}`);
        const n2 = parseInt(`${b}${a}`);
        return { q: `${n1} - ${n2}`, a: (n1-n2).toString() };
      } else {
        // Nadiya Paar (Base 100/200 etc)
        const base = Math.floor(Math.random() * 3 + 1) * 100; // 100, 200, 300
        const n1 = base + Math.floor(Math.random() * 20);
        const n2 = base - Math.floor(Math.random() * 20);
        return { q: `${n1} - ${n2}`, a: (n1-n2).toString() };
      }
    }
  },
  viral_multiplication: {
    title: "Multiplication Hacks",
    description: "x11, x99, Even numbers x5, Odd x5, Sandwich method.",
    tricks: [
      { name: "x 11", logic: "342 × 11. Write 3, (3+4), (4+2), 2 -> 3762." },
      { name: "x 99", logic: "648 × 999. 648-1 = 647. 999-647 = 352. Ans: 647352." },
      { name: "Even No. × 5", logic: "Half the number, add 0. 56 × 5 -> Half 56=28 -> 280." },
      { name: "Odd No. × 5", logic: "Subtract 1, Half it, add 5. 57 × 5 -> (56/2)=28 -> 285." },
      { name: "Trishul Approach", logic: "Consecutive Even/Odd: 12 × 14 = 13² - 1 = 168." }
    ],
    generator: () => {
      const type = Math.random();
      if(type < 0.2) {
        // x11
        const n = Math.floor(Math.random() * 50) + 12;
        return { q: `${n} × 11`, a: (n*11).toString() };
      } else if (type < 0.4) {
        // x5
        const n = Math.floor(Math.random() * 80) + 12;
        return { q: `${n} × 5`, a: (n*5).toString() };
      } else if (type < 0.6) {
        // x99 (smaller version for speed)
        const n = Math.floor(Math.random() * 90) + 10;
        return { q: `${n} × 99`, a: (n*99).toString() };
      } else {
        // Trishul (12x14)
        const n = Math.floor(Math.random() * 12) + 10; // 10 to 22
        const n1 = n * 2;
        const n2 = n1 + 2;
        return { q: `${n1} × ${n2}`, a: (n1*n2).toString() };
      }
    }
  },
  viral_squares: {
    title: "Squares & Cubes",
    description: "Base 50, Base 100, Ending in 5.",
    tricks: [
      { name: "Base 50", logic: "41². 50-41=9. 25-9=16. 9²=81. Ans: 1681." },
      { name: "Base 100", logic: "96². 100-96=4. 96-4=92. 4²=16. Ans: 9216." },
      { name: "Ending in 5", logic: "65². 6×(6+1)=42. End with 25. Ans: 4225." }
    ],
    generator: () => {
      const type = Math.random();
      if(type < 0.33) {
        // Ending 5
        const n = (Math.floor(Math.random() * 9) + 1) * 10 + 5;
        return { q: `${n}²`, a: (n*n).toString() };
      } else if (type < 0.66) {
        // Base 50 (41-59)
        const n = Math.floor(Math.random() * 18) + 41;
        return { q: `${n}²`, a: (n*n).toString() };
      } else {
        // Base 100 (91-109)
        const n = Math.floor(Math.random() * 18) + 91;
        return { q: `${n}²`, a: (n*n).toString() };
      }
    }
  },
  viral_division: {
    title: "Viral Division",
    description: "Dividing by 5, 25, 125, and 'Broken Heart' approach.",
    tricks: [
      { name: "Divide by 5", logic: "Double the number, place decimal. 36/5 -> 72 -> 7.2." },
      { name: "Divide by 25", logic: "Multiply by 4, place decimal. 120/25 -> 480 -> 4.8." },
      { name: "Broken Heart", logic: "Split numerator: 33/16 -> (32+1)/16 -> 2 + 1/16." }
    ],
    generator: () => {
      const n = Math.floor(Math.random() * 100) + 20;
      return { q: `${n} ÷ 5`, a: (n/5).toString() };
    }
  }
};

const SpeedMath: React.FC = () => {
  const [mode, setMode] = useState<'menu' | 'viral-menu' | 'practice' | 'reference'>('menu');
  const [category, setCategory] = useState<string>('tables'); // General or Viral key
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [question, setQuestion] = useState({ text: '', answer: '' });
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Standard Game Logic (Same as before for Tables, etc) ---
  const generateStandardQuestion = (cat: Category) => {
    let q = '', a = '';
    switch (cat) {
      case 'tables': {
        const num = Math.floor(Math.random() * 24) + 2;
        const mult = Math.floor(Math.random() * 10) + 1;
        q = `${num} × ${mult}`;
        a = (num * mult).toString();
        break;
      }
      case 'squares': {
        const num = Math.floor(Math.random() * 49) + 2;
        q = `${num}²`;
        a = (num * num).toString();
        break;
      }
      case 'cubes': {
        const num = Math.floor(Math.random() * 24) + 2;
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
        const f = ['1/2', '1/3', '1/4', '1/5', '1/8', '1/9', '1/11', '1/20'];
        const p = ['50', '33.33', '25', '20', '12.5', '11.11', '09.09', '5'];
        const idx = Math.floor(Math.random() * f.length);
        q = `${p[idx]}% = ?`;
        a = f[idx];
        break;
      }
      case 'multiplication': {
        const set = [{q:'11x12',a:'132'}, {q:'15x18',a:'270'}, {q:'35x35',a:'1225'}];
        const item = set[Math.floor(Math.random() * set.length)];
        q = item.q; a = item.a;
        break;
      }
    }
    return { text: q, answer: a };
  };

  const startGame = (cat: string) => {
    setCategory(cat);
    setMode('practice');
    setScore(0);
    setTimeLeft(60);
    setIsActive(true);
    setInput('');
    nextQuestion(cat);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const nextQuestion = (cat: string) => {
    let qObj;
    if (Object.keys(VIRAL_CONCEPTS).includes(cat)) {
      qObj = VIRAL_CONCEPTS[cat as ViralCategory].generator();
      setQuestion({ text: qObj.q, answer: qObj.a });
    } else {
      const std = generateStandardQuestion(cat as Category);
      setQuestion(std);
    }
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

    if (val.trim().toLowerCase() === question.answer.toLowerCase()) {
      setScore((s) => s + 1);
      setFeedback('correct');
      setInput('');
      nextQuestion(category);
      setTimeout(() => setFeedback('none'), 200);
    }
  };

  // --- Views ---

  const renderMainMenu = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Speed Math Trainer</h2>
        <p className="text-slate-500">Master calculation speed for banking exams.</p>
      </div>

      {/* Viral Maths Promo Card */}
      <div 
        onClick={() => setMode('viral-menu')}
        className="bg-gradient-to-r from-indigo-900 to-violet-900 rounded-2xl p-8 text-white shadow-xl cursor-pointer transform hover:scale-[1.01] transition-all relative overflow-hidden border border-indigo-700 group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">NEW</span>
              <span className="text-indigo-200 font-semibold tracking-wider text-sm">BY ADDA247 CONTENT</span>
            </div>
            <h3 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Flame className="text-orange-400" fill="currentColor" />
              Viral Maths: Brahmastra
            </h3>
            <p className="text-indigo-200 max-w-lg">
              Access the complete "Viral Maths" methodology. Learn Todu-Modu, Judwa Approach, Nadiya Paar, and 100+ shortcuts for lightning-fast calculation.
            </p>
          </div>
          <button className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-colors flex items-center gap-2">
            Open Brahmastra <ChevronLeft className="rotate-180" size={20} />
          </button>
        </div>
      </div>

      {/* Standard Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 'tables', label: 'Tables (1-25)', icon: Zap, color: 'bg-amber-500' },
          { id: 'squares', label: 'Squares (1-50)', icon: Brain, color: 'bg-blue-500' },
          { id: 'cubes', label: 'Cubes (1-25)', icon: Brain, color: 'bg-indigo-500' },
          { id: 'alpha', label: 'Alphabet Ranks', icon: Eye, color: 'bg-emerald-500' },
          { id: 'percent', label: '% to Fractions', icon: RefreshCcw, color: 'bg-rose-500' },
          { id: 'multiplication', label: 'Random Practice', icon: X, color: 'bg-slate-500' },
        ].map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 overflow-hidden group">
            <div className={`h-2 ${item.color}`} />
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${item.color} bg-opacity-10 text-slate-700`}>
                  <item.icon size={24} className={`text-${item.color.split('-')[1]}-600`} />
                </div>
                <h3 className="font-bold text-lg text-slate-800">{item.label}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => { setCategory(item.id); setMode('reference'); }}
                  className="flex items-center justify-center py-2 px-4 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Book size={16} className="mr-2" /> View
                </button>
                <button 
                  onClick={() => startGame(item.id)}
                  className="flex items-center justify-center py-2 px-4 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  <Zap size={16} className="mr-2" /> Play
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderViralMenu = () => (
    <div className="animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setMode('menu')} className="p-2 rounded-full hover:bg-slate-200 text-slate-600">
          <ChevronLeft size={28} />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="text-yellow-500" fill="currentColor" />
            Viral Maths Modules
          </h2>
          <p className="text-slate-500">Select a concept to Study or Blitz</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(VIRAL_CONCEPTS) as ViralCategory[]).map((key) => {
          const item = VIRAL_CONCEPTS[key];
          return (
            <div key={key} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-indigo-300 transition-all">
              <h3 className="text-xl font-bold text-indigo-900 mb-1">{item.title}</h3>
              <p className="text-slate-500 text-sm mb-4 h-10 line-clamp-2">{item.description}</p>
              
              <div className="space-y-2 bg-slate-50 p-3 rounded-lg mb-4">
                {item.tricks.slice(0, 2).map((trick, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="font-bold text-indigo-600 whitespace-nowrap">{trick.name}:</span>
                    <span className="truncate">{trick.logic}</span>
                  </div>
                ))}
                <div className="text-xs text-center text-indigo-500 font-medium">+ more inside</div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => { setCategory(key); setMode('reference'); }}
                  className="flex-1 py-2.5 bg-indigo-50 text-indigo-700 rounded-lg font-semibold text-sm hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Book size={16} /> Study Concepts
                </button>
                <button 
                  onClick={() => startGame(key)}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Zap size={16} /> Blitz Practice
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderReference = () => {
    const isViral = Object.keys(VIRAL_CONCEPTS).includes(category);
    const viralData = isViral ? VIRAL_CONCEPTS[category as ViralCategory] : null;

    return (
      <div className="animate-in fade-in slide-in-from-right-4 pb-10 max-w-4xl mx-auto">
         <button onClick={() => setMode(isViral ? 'viral-menu' : 'menu')} className="mb-4 flex items-center text-slate-500 hover:text-indigo-600">
           <ChevronLeft size={20} /> Back to Menu
         </button>
         
         {isViral && viralData ? (
           <div>
             <div className="bg-indigo-900 text-white p-8 rounded-2xl mb-8 relative overflow-hidden">
               <div className="relative z-10">
                 <h2 className="text-3xl font-bold mb-2">{viralData.title}</h2>
                 <p className="text-indigo-200">{viralData.description}</p>
               </div>
               <div className="absolute right-0 top-0 text-white/5 -mr-10 -mt-10">
                 <Brain size={200} />
               </div>
             </div>

             <div className="grid gap-6">
               {viralData.tricks.map((trick, idx) => (
                 <div key={idx} className="bg-white border-l-4 border-indigo-500 shadow-sm rounded-r-xl p-6">
                   <h3 className="text-lg font-bold text-indigo-900 mb-2">{trick.name}</h3>
                   <div className="text-slate-700 font-mono bg-slate-50 p-4 rounded-lg text-lg">
                     {trick.logic}
                   </div>
                 </div>
               ))}
             </div>
             
             <div className="mt-8 text-center">
               <button 
                 onClick={() => startGame(category)}
                 className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
               >
                 Start Practicing These Tricks
               </button>
             </div>
           </div>
         ) : (
           <div className="text-center py-20 text-slate-400">
             Standard Reference Table (Placeholder for standard modules)
           </div>
         )}
      </div>
    );
  };

  const renderGame = () => (
    <div className="max-w-2xl mx-auto text-center animate-in zoom-in-95 duration-200">
      {timeLeft > 0 ? (
        <>
          <div className="flex justify-between items-center mb-12">
            <button onClick={() => setMode(Object.keys(VIRAL_CONCEPTS).includes(category) ? 'viral-menu' : 'menu')} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
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
               Apply the Trick
            </div>
            <div className={`text-6xl md:text-8xl font-bold text-slate-800 transition-transform duration-100 ${feedback === 'correct' ? 'scale-110 text-green-600' : ''}`}>
              {question.text}
            </div>
          </div>

          <div className="max-w-xs mx-auto">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInput}
              placeholder="?"
              className="w-full bg-white border-2 border-slate-200 rounded-xl py-4 text-center text-2xl font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
              autoFocus
            />
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={40} className="text-yellow-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Time's Up!</h2>
          <p className="text-slate-500 mb-8">Score: <span className="text-indigo-600 font-bold text-2xl">{score}</span></p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setMode(Object.keys(VIRAL_CONCEPTS).includes(category) ? 'viral-menu' : 'menu')}
              className="px-6 py-3 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
            >
              Exit
            </button>
            <button 
              onClick={() => startGame(category)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow-lg"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto">
      {mode === 'menu' && renderMainMenu()}
      {mode === 'viral-menu' && renderViralMenu()}
      {mode === 'reference' && renderReference()}
      {mode === 'practice' && renderGame()}
    </div>
  );
};

export default SpeedMath;
