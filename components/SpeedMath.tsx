
import React, { useState, useEffect, useRef } from 'react';
import { Zap, Book, Timer, Trophy, ChevronLeft, RefreshCcw, Brain, Eye, X, Flame, Star, Hash, Settings, Clock, Plus, Minus, Check, FileUp, Loader2, ArrowRight, ChevronDown, MoveLeft, Box, Cuboid, SortAsc, RefreshCw, Lightbulb, MousePointer2, ChevronRight, Gem, TrendingUp, Target, Divide, Layers, ArrowLeftRight, Sparkles, Database } from 'lucide-react';
import { extractQuestionsFromPdf } from '../services/geminiService';

type Category = 'tables' | 'squares' | 'cubes' | 'alpha' | 'alpha_rank' | 'alpha_pair' | 'percent' | 'multiplication' | 'specific_table' | 'speed_addition' | 'speed_subtraction' | 'mensuration' | 'golden_numbers' | 'ci_rates' | 'quadratic_blitz' | 'unit_digit' | 'consecutive_mult';
type ViralCategory = 'viral_products' | 'viral_addition' | 'viral_subtraction' | 'viral_multiplication' | 'viral_squares' | 'viral_division';

// --- Custom Select (Light Mode - Modern Glass) ---
const ConfigSelect = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: { value: string, label: string }[] }) => {
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
        className={`w-full flex items-center justify-between bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-3 outline-none hover:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 transition-all font-medium shadow-sm ${isOpen ? 'border-emerald-500 ring-4 ring-emerald-100/50' : ''}`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} size={18} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl overflow-hidden shadow-xl z-50 animate-select-open max-h-60 overflow-y-auto ring-1 ring-black/5">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors ${value === option.value ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span>{option.label}</span>
              {value === option.value && <Check size={16} className="text-emerald-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const FRACTION_MAP = [
  { f: '1/2', p: '50%' }, { f: '1/3', p: '33.33%' }, { f: '2/3', p: '66.66%' },
  { f: '1/4', p: '25%' }, { f: '3/4', p: '75%' },
  { f: '1/5', p: '20%' }, { f: '2/5', p: '40%' }, { f: '3/5', p: '60%' }, { f: '4/5', p: '80%' },
  { f: '1/6', p: '16.66%' }, { f: '5/6', p: '83.33%' },
  { f: '1/7', p: '14.28%' }, { f: '2/7', p: '28.57%' },
  { f: '1/8', p: '12.5%' }, { f: '3/8', p: '37.5%' }, { f: '5/8', p: '62.5%' }, { f: '7/8', p: '87.5%' },
  { f: '1/9', p: '11.11%' }, { f: '2/9', p: '22.22%' },
  { f: '1/10', p: '10%' },
  { f: '1/11', p: '09.09%' }, { f: '2/11', p: '18.18%' },
  { f: '1/12', p: '8.33%' },
  { f: '1/13', p: '7.69%' },
  { f: '1/14', p: '7.14%' },
  { f: '1/15', p: '6.66%' },
  { f: '1/16', p: '6.25%' },
  { f: '1/20', p: '5%' },
  { f: '1/24', p: '4.16%' },
  { f: '1/25', p: '4%' },
  { f: '1/30', p: '3.33%' },
  { f: '1/40', p: '2.5%' },
  { f: '1/50', p: '2%' }
];

const CI_RATES_DATA = [
  { r: '10%', y2: '21%', y3: '33.1%', y4: '46.41%' },
  { r: '20%', y2: '44%', y3: '72.8%', y4: '107.36%' },
  { r: '5%', y2: '10.25%', y3: '15.76%', y4: '21.55%' },
  { r: '4%', y2: '8.16%', y3: '12.48%', y4: '16.98%' }
];

const MENSURATION_DATA = [
  { type: '2D', shape: 'Rectangle', param: 'Area', formula: 'l × b' },
  { type: '2D', shape: 'Rectangle', param: 'Perimeter', formula: '2(l + b)' },
  { type: '2D', shape: 'Square', param: 'Area', formula: 'a²' },
  { type: '2D', shape: 'Square', param: 'Perimeter', formula: '4a' },
  { type: '2D', shape: 'Circle', param: 'Area', formula: 'πr²' },
  { type: '2D', shape: 'Circle', param: 'Circumference', formula: '2πr' },
  { type: '2D', shape: 'Triangle', param: 'Area', formula: '½ × b × h' },
  { type: '2D', shape: 'Parallelogram', param: 'Area', formula: 'b × h' },
  { type: '2D', shape: 'Rhombus', param: 'Area', formula: '½ × d1 × d2' },
  { type: '3D', shape: 'Cuboid', param: 'Volume', formula: 'l × b × h' },
  { type: '3D', shape: 'Cuboid', param: 'TSA', formula: '2(lb + bh + hl)' },
  { type: '3D', shape: 'Cuboid', param: 'LSA/CSA', formula: '2h(l + b)' },
  { type: '3D', shape: 'Cube', param: 'Volume', formula: 'a³' },
  { type: '3D', shape: 'Cube', param: 'TSA', formula: '6a²' },
  { type: '3D', shape: 'Cube', param: 'LSA/CSA', formula: '4a²' },
  { type: '3D', shape: 'Cylinder', param: 'Volume', formula: 'πr²h' },
  { type: '3D', shape: 'Cylinder', param: 'CSA', formula: '2πrh' },
  { type: '3D', shape: 'Cylinder', param: 'TSA', formula: '2πr(r + h)' },
  { type: '3D', shape: 'Cone', param: 'Volume', formula: '⅓πr²h' },
  { type: '3D', shape: 'Cone', param: 'CSA', formula: 'πrl' },
  { type: '3D', shape: 'Cone', param: 'TSA', formula: 'πr(l + r)' },
  { type: '3D', shape: 'Sphere', param: 'Volume', formula: '4/3 πr³' },
  { type: '3D', shape: 'Sphere', param: 'Surface Area', formula: '4πr²' },
  { type: '3D', shape: 'Hemisphere', param: 'Volume', formula: '⅔πr³' },
  { type: '3D', shape: 'Hemisphere', param: 'CSA', formula: '2πr²' },
  { type: '3D', shape: 'Hemisphere', param: 'TSA', formula: '3πr²' }
];

const EXAM_MULTIPLICATIONS = [
  { q: '11 × 12', a: '132' }, { q: '12 × 13', a: '156' }, { q: '13 × 14', a: '182' },
  { q: '14 × 15', a: '210' }, { q: '15 × 16', a: '240' }, { q: '16 × 17', a: '272' },
  { q: '17 × 18', a: '306' }, { q: '18 × 19', a: '342' }, { q: '19 × 20', a: '380' },
  { q: '20 × 21', a: '420' }, { q: '24 × 25', a: '600' },
  { q: '56 × 18', a: '1008' }, { q: '18 × 56', a: '1008' },
  { q: '15 × 18', a: '270' }, { q: '18 × 15', a: '270' },
  { q: '12 × 15', a: '180' }, { q: '15 × 12', a: '180' },
  { q: '12 × 18', a: '216' }, { q: '18 × 12', a: '216' },
  { q: '25 × 18', a: '450' }, { q: '18 × 25', a: '450' },
  { q: '14 × 18', a: '252' }, { q: '18 × 14', a: '252' },
  { q: '16 × 18', a: '288' }, { q: '18 × 16', a: '288' },
  { q: '25 × 14', a: '350' }, { q: '14 × 25', a: '350' },
  { q: '25 × 16', a: '400' }, { q: '16 × 25', a: '400' },
  { q: '37 × 3', a: '111' }, { q: '37 × 9', a: '333' }
];

const GOLDEN_NUMBERS_DATA = [
  { num: 108, pairs: [[12,9], [27,4], [36,3], [18,6]] },
  { num: 144, pairs: [[12,12], [16,9], [18,8], [24,6], [36,4]] },
  { num: 180, pairs: [[12,15], [20,9], [45,4], [36,5]] },
  { num: 216, pairs: [[12,18], [24,9], [36,6]] }
];

const STANDARD_CONCEPTS = {
  tables: {
    title: "Multiplication Tables (1-20)",
    type: "grid-card",
    data: Array.from({length: 20}, (_, i) => ({
      label: `${i + 1}`,
      values: Array.from({length: 10}, (_, j) => `${i + 1} × ${j + 1} = ${(i + 1) * (j + 1)}`)
    }))
  },
  squares: {
    title: "Squares (1-50)",
    type: "grid-simple",
    data: Array.from({length: 50}, (_, i) => ({ q: `${i + 1}²`, a: (i + 1) ** 2 }))
  },
  cubes: {
    title: "Cubes (1-25)",
    type: "grid-simple",
    data: Array.from({length: 25}, (_, i) => ({ q: `${i + 1}³`, a: (i + 1) ** 3 }))
  },
  alpha: {
    title: "Alphabet Ranks & Opposites",
    type: "custom-alpha",
    data: {
      forward: Array.from({length: 26}, (_, i) => ({ char: String.fromCharCode(65 + i), val: i + 1 })),
      mnemonics: [
        { code: "EJOTY", val: "5, 10, 15, 20, 25" },
        { code: "CFILORUX", val: "3, 6, 9, 12, 15, 18, 21, 24" }
      ],
      opposites_list: [
        { pair: "A-Z", mnemonic: "Azad (Free)" }, { pair: "B-Y", mnemonic: "Boy" }, { pair: "C-X", mnemonic: "Crux / Crack" },
        { pair: "D-W", mnemonic: "Dew / Draw" }, { pair: "E-V", mnemonic: "EVerest / LoVe" }, { pair: "F-U", mnemonic: "FUn / FUr" },
        { pair: "G-T", mnemonic: "G.T. Road" }, { pair: "H-S", mnemonic: "High School" }, { pair: "I-R", mystery: "Indian Railway" },
        { pair: "J-Q", mnemonic: "Jungle Queen" }, { pair: "K-P", mnemonic: "Kanpur / PK" }, { pair: "L-O", mnemonic: "LOve / Light On" },
        { pair: "M-N", mnemonic: "MaN / MooN" }
      ]
    }
  },
  percent: {
    title: "Fraction to Percentage Table",
    type: "grid-table",
    data: FRACTION_MAP
  },
  ci_rates: {
    title: "Compound Interest Effective Rates",
    type: "ci-table",
    data: CI_RATES_DATA
  },
  multiplication: {
    title: "Important Exam Multiplications",
    type: "grid-simple",
    data: EXAM_MULTIPLICATIONS
  },
  consecutive_mult: {
    title: "Consecutive Factors",
    type: "grid-simple",
    data: Array.from({length: 9}, (_, i) => {
      const n = i + 11;
      return { q: `${n * (n+1)}`, a: `${n} × ${n+1}` };
    })
  },
  mensuration: {
    title: "Mensuration Formulas",
    type: "mensuration-list",
    data: MENSURATION_DATA
  },
  golden_numbers: {
    title: "Golden Numbers (Factors)",
    type: "golden-list",
    data: GOLDEN_NUMBERS_DATA
  },
  quadratic_blitz: {
    title: "Quadratic Sign Blitz",
    type: "grid-simple",
    data: [
      { q: "x² + ... + = 0", a: "x = (- , -)" },
      { q: "x² - ... + = 0", a: "x = (+ , +)" },
      { q: "x² + ... - = 0", a: "x = (- , +)" },
      { q: "x² - ... - = 0", a: "x = (+ , -)" }
    ]
  },
  unit_digit: {
    title: "Unit Digit Cyclicity",
    type: "grid-simple",
    data: [
      { q: "Digits 0,1,5,6", a: "Same digit always" },
      { q: "Digits 4, 9", a: "Cycle of 2" },
      { q: "Digits 2,3,7,8", a: "Cycle of 4" }
    ]
  }
};

const VIRAL_CONCEPTS = {
  viral_products: {
    title: "Important Products (Chaurahas)",
    description: "Specific high-frequency multiplications seen in exams.",
    tricks: [
      { name: "The 37 Series", logic: "37 × 3 = 111, 37 × 6 = 222... 37 × 27 = 999" },
      { name: "The 12 Series", logic: "12 × 9 = 108, 12 × 12 = 144, 12 × 13 = 156" }
    ],
    generator: () => {
      const set = [{q: '37 × 3', a: '111'}, {q: '37 × 6', a: '222'}, {q: '12 × 13', a: '156'}];
      return set[Math.floor(Math.random() * set.length)];
    }
  },
  viral_addition: {
    title: "Viral Addition",
    description: "Todu-Modu, Ram-Shyam (Judwa), and Giddh approaches.",
    tricks: [
      { name: "Ram-Shyam", logic: "36+63 = (3+6)×11 = 99" }
    ],
    generator: () => ({ q: '45 + 54', a: '99' })
  },
  viral_subtraction: {
    title: "Viral Subtraction",
    description: "Sita-Gita, Nadiya Paar, and Shopkeeper methods.",
    tricks: [{ name: "Sita-Gita", logic: "63-36 = (6-3)×9 = 27" }],
    generator: () => ({ q: '82 - 28', a: '54' })
  },
  viral_multiplication: {
    title: "Multiplication Hacks",
    description: "x11, x99, Even numbers x5, Odd x5, Sandwich method.",
    tricks: [{ name: "Even × 5", logic: "56 × 5 -> 280 (Half then add 0)" }],
    generator: () => ({ q: '64 × 5', a: '320' })
  },
  viral_squares: {
    title: "Squares & Cubes",
    description: "Base 50, Base 100, Ending in 5.",
    tricks: [{ name: "Ending in 5", logic: "65² = 4225 (6×7, end with 25)" }],
    generator: () => ({ q: '75²', a: '5625' })
  },
  viral_division: {
    title: "Viral Division",
    description: "Dividing by 5, 25, 125, and 'Broken Heart' approach.",
    tricks: [{ name: "Divide by 5", logic: "Double then decimal. 36/5 = 7.2" }],
    generator: () => ({ q: '120 ÷ 5', a: '24' })
  }
};

const CHEAT_SHEET_DATA = [
  {
    title: "Arithmetic Hacks",
    icon: RefreshCcw,
    color: "indigo",
    sections: [
      {
        subtitle: "Boats & Streams",
        points: [
          { label: "Boat Speed", desc: "(Down + Up) / 2" },
          { label: "Stream Speed", desc: "(Down - Up) / 2" }
        ]
      }
    ]
  },
  {
    title: "Reasoning Rules",
    icon: Brain,
    color: "purple",
    sections: [
      {
        subtitle: "Syllogism",
        points: [
          { label: "Only a few", desc: "Means 'Some' + 'Some Not'" }
        ]
      }
    ]
  }
];

const SpeedMath: React.FC = () => {
  const [mode, setMode] = useState<'menu' | 'viral-menu' | 'alpha-menu' | 'tricks-sheet' | 'practice' | 'reference' | 'timer-selection' | 'pdf-upload' | 'pdf-config' | 'pdf-drill' | 'pdf-result' | 'mode-selection'>('menu');
  const [category, setCategory] = useState<string>('tables');
  const [subMode, setSubMode] = useState<'normal' | 'reverse'>('normal');
  const [customTable, setCustomTable] = useState({ table: '19', limit: '10' });
  const [subtractionMode, setSubtractionMode] = useState<'2num' | '3num'>('2num');
  const [reverseInputMode, setReverseInputMode] = useState(false);
  
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [extractedPdfQuestions, setExtractedPdfQuestions] = useState<{q: string, a: string}[]>([]);
  const [activePdfQuestions, setActivePdfQuestions] = useState<{q: string, a: string}[]>([]);
  const [pdfConfig, setPdfConfig] = useState({ topic: 'Simplification', difficulty: 'novice' });
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [pdfTimer, setPdfTimer] = useState(0);

  const [score, setScore] = useState(0);
  const [totalTime, setTotalTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [question, setQuestion] = useState<{ text: string, answer: string, options?: string[] }>({ text: '', answer: '' });
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const generateStandardQuestion = (cat: Category) => {
    let q = '', a = '';
    let opts: string[] | undefined = undefined;

    switch (cat) {
      case 'tables': {
        const num = randomInt(2, 19);
        const mult = randomInt(2, 9);
        q = `${num} × ${mult}`;
        a = (num * mult).toString();
        break;
      }
      case 'specific_table': {
         const t = parseInt(customTable.table) || 2;
         const l = parseInt(customTable.limit) || 10;
         const mult = randomInt(1, l);
         q = `${t} × ${mult}`;
         a = (t * mult).toString();
         break;
      }
      case 'speed_addition': {
        const n1 = randomInt(10, 99);
        const n2 = randomInt(10, 99);
        q = `${n1} + ${n2}`;
        a = (n1 + n2).toString();
        break;
      }
      case 'speed_subtraction': {
        const n1 = randomInt(100, 999);
        const n2 = randomInt(10, n1 - 1);
        q = `${n1} - ${n2}`;
        a = (n1 - n2).toString();
        break;
      }
      case 'squares': {
        const num = randomInt(2, 49);
        if (subMode === 'reverse') { q = `√${num * num}`; a = num.toString(); } else { q = `${num}²`; a = (num * num).toString(); }
        break;
      }
      case 'cubes': {
        const num = randomInt(2, 24);
        if (subMode === 'reverse') { q = `∛${num ** 3}`; a = num.toString(); } else { q = `${num}³`; a = (num ** 3).toString(); }
        break;
      }
      case 'alpha': {
        const char = String.fromCharCode(65 + randomInt(0, 25));
        q = `Rank of ${char}`;
        a = (char.charCodeAt(0) - 64).toString();
        break;
      }
      case 'percent': {
        const item = FRACTION_MAP[randomInt(0, FRACTION_MAP.length - 1)];
        q = `${item.p} = ?`;
        a = item.f;
        break;
      }
      case 'multiplication': {
        const n1 = randomInt(11, 25);
        const n2 = randomInt(11, 25);
        q = `${n1} × ${n2}`;
        a = (n1 * n2).toString();
        break;
      }
      case 'mensuration': {
        const item = MENSURATION_DATA[randomInt(0, MENSURATION_DATA.length - 1)];
        q = `${item.shape} (${item.param})?`;
        a = item.formula;
        opts = [a, "2πr", "πr²", "l × b"].sort(() => 0.5 - Math.random());
        break;
      }
      default:
        q = '12 × 13'; a = '156';
    }
    return { text: q, answer: a, options: opts };
  };

  const nextQuestion = (cat: string) => {
    if (Object.keys(VIRAL_CONCEPTS).includes(cat)) {
      const qObj = VIRAL_CONCEPTS[cat as ViralCategory].generator();
      setQuestion({ text: qObj.q, answer: qObj.a });
    } else {
      setQuestion(generateStandardQuestion(cat as Category));
    }
  };

  const initGameSetup = (cat: string) => {
    setCategory(cat);
    setReverseInputMode(cat === 'speed_subtraction' || cat === 'viral_subtraction');
    if (cat === 'speed_addition' || cat === 'speed_subtraction') {
       startWithDuration(1);
    } else {
       setMode('timer-selection');
    }
  };

  const startWithDuration = (mins: number) => {
    const seconds = mins * 60;
    setTotalTime(seconds); setTimeLeft(seconds); setMode('practice'); setScore(0); setIsActive(true); setInput(''); nextQuestion(category);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (val.trim().toLowerCase() === question.answer.toLowerCase()) {
        setScore(s => s + 1); setFeedback('correct'); setInput(''); nextQuestion(category); setTimeout(() => setFeedback('none'), 200);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      setIsProcessingPdf(true);
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        setPdfFile(base64String);
        const extracted = await extractQuestionsFromPdf(base64String);
        setExtractedPdfQuestions(extracted);
        setIsProcessingPdf(false);
        setMode('pdf-config');
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isActive && mode === 'practice' && timeLeft > 0) { interval = setInterval(() => setTimeLeft(t => t - 1), 1000); }
    else if (timeLeft === 0 && isActive) { setIsActive(false); }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const renderReference = () => {
    const data = STANDARD_CONCEPTS[category as keyof typeof STANDARD_CONCEPTS];
    if (!data) return <div className="p-8 text-center text-slate-500">No reference data available.</div>;

    return (
      <div className="max-w-6xl mx-auto animate-in fade-in pb-12">
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => setMode('menu')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors">
            <ChevronLeft size={20} /> Back to Menu
          </button>
          <button onClick={() => initGameSetup(category)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 uppercase text-xs tracking-widest">
            <Zap size={18} fill="currentColor" /> Practice Mode
          </button>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">{data.title}</h2>
          <p className="text-slate-500 font-medium">Study these patterns for high-speed calculation.</p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4">
          {data.type === 'grid-simple' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {(data.data as any[]).map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center hover:border-indigo-300 transition-all hover:shadow-md">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-2">{item.q}</div>
                  <div className="text-2xl font-black text-indigo-700">{item.a}</div>
                </div>
              ))}
            </div>
          )}
          {data.type === 'grid-card' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(data.data as any[]).map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="bg-indigo-600 text-white px-4 py-2 font-black text-center text-sm uppercase tracking-widest">Table of {item.label}</div>
                  <div className="p-4 space-y-1.5">
                    {item.values.map((v: string, i: number) => (
                      <div key={i} className="text-xs font-mono text-slate-600 border-b border-slate-50 last:border-0 pb-1 last:pb-0 flex justify-center">{v}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {data.type === 'grid-table' && (
             <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {(data.data as any[]).map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center group hover:bg-indigo-600 transition-all duration-300">
                     <div className="text-lg font-black text-indigo-600 group-hover:text-white transition-colors">{item.p}</div>
                     <div className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">= {item.f}</div>
                  </div>
                ))}
             </div>
          )}
          {data.type === 'custom-alpha' && (
             <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h4 className="font-bold text-slate-800 mb-4">Forward Ranks</h4>
                      <div className="grid grid-cols-6 gap-2">
                         {(data.data as any).forward.map((item: any) => (
                            <div key={item.char} className="border border-slate-100 p-2 rounded-lg text-center">
                               <div className="font-black text-slate-800">{item.char}</div>
                               <div className="text-[10px] text-indigo-500 font-bold">{item.val}</div>
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
                      <h4 className="font-bold text-indigo-800 mb-4">Opposite Pairs</h4>
                      <div className="grid grid-cols-2 gap-3">
                         {(data.data as any).opposites_list.map((item: any, i: number) => (
                            <div key={i} className="bg-white p-3 rounded-xl shadow-sm flex justify-between items-center">
                               <span className="font-black text-indigo-700">{item.pair}</span>
                               <span className="text-[10px] text-slate-400 font-bold uppercase">{item.mnemonic}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          )}
          {/* Default fallback to prevent raw JSON view */}
          {!['grid-simple', 'grid-card', 'grid-table', 'custom-alpha'].includes(data.type) && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
               <div className="text-slate-400 mb-4"><Database size={48} className="mx-auto opacity-20" /></div>
               <p className="font-bold text-slate-800">Pattern Data Available</p>
               <p className="text-slate-500 text-sm mt-1">Practice mode is recommended for this module.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMainMenu = () => (
    <div className="space-y-8 animate-in fade-in pb-10">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Speed Math Trainer</h2>
        <p className="text-slate-500 font-medium">Build exam-grade calculation speed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(STANDARD_CONCEPTS).map(([id, item]) => (
          <div key={id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 overflow-hidden group">
            <div className="h-2 bg-indigo-600 w-0 group-hover:w-full transition-all duration-500" />
            <div className="p-6">
               <h3 className="font-bold text-lg text-slate-800 mb-4">{item.title}</h3>
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setCategory(id); setMode('reference'); }} className="flex items-center justify-center py-2 px-4 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"><Book size={16} className="mr-2" /> View</button>
                  <button onClick={() => { if (id === 'squares' || id === 'cubes') { setCategory(id); setMode('mode-selection'); } else { initGameSetup(id); } }} className="flex items-center justify-center py-2 px-4 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"><Zap size={16} className="mr-2" /> Play</button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTimerSelection = () => (
    <div className="max-w-xl mx-auto text-center animate-in zoom-in-95 duration-200 pt-12">
      <button onClick={() => setMode('menu')} className="mb-8 flex items-center justify-center mx-auto text-slate-400 hover:text-indigo-600 font-bold transition-colors">
        <ChevronLeft size={20} /> Back to Options
      </button>
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-inner">
          <Clock size={36} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Select Duration</h2>
        <p className="text-slate-500 mb-10">How long do you want to practice?</p>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 5].map(mins => (
            <button key={mins} onClick={() => startWithDuration(mins)} className="py-4 px-6 border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl font-bold text-lg text-slate-700 transition-all">
              {mins} Min
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="max-w-2xl mx-auto text-center animate-in zoom-in-95 pt-12">
      {timeLeft > 0 ? (
        <>
          <div className="flex justify-between items-center mb-16">
             <button onClick={() => setMode('menu')} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600"><X size={24} /></button>
             <div className="flex items-center space-x-6">
                <div className="flex flex-col items-center"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</span><span className="font-mono text-3xl font-black text-slate-800">{timeLeft}s</span></div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="flex flex-col items-center"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span><span className="font-mono text-3xl font-black text-indigo-600">{score}</span></div>
             </div>
             <div className="w-10"></div>
          </div>
          <div className="mb-20">
             <div className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">{category.replace(/_/g, ' ')}</div>
             <div className={`text-7xl md:text-9xl font-black text-slate-900 transition-transform duration-100 ${feedback === 'correct' ? 'scale-110 text-emerald-500' : feedback === 'wrong' ? 'shake text-red-500' : ''}`}>
                {question.text}
             </div>
          </div>
          <div className="max-w-xs mx-auto">
             <input ref={inputRef} type="text" value={input} onChange={handleInput} placeholder="?" className="w-full bg-white border-4 border-slate-100 rounded-3xl py-6 text-center text-5xl font-black focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-2xl" autoFocus />
          </div>
        </>
      ) : (
        <div className="bg-white p-12 rounded-3xl shadow-2xl border border-slate-100 text-center animate-in fade-in">
           <Trophy size={64} className="text-yellow-500 mx-auto mb-6" />
           <h2 className="text-4xl font-black text-slate-900 mb-2">Drill Complete!</h2>
           <div className="text-6xl font-black text-indigo-600 my-8">{score}</div>
           <p className="text-slate-500 mb-10 font-medium">Great effort! Consistent practice builds accuracy.</p>
           <div className="flex gap-4">
              <button onClick={() => setMode('menu')} className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50">Exit</button>
              <button onClick={() => startWithDuration(totalTime/60)} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200">Try Again</button>
           </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto">
      {mode === 'menu' && renderMainMenu()}
      {mode === 'reference' && renderReference()}
      {mode === 'timer-selection' && renderTimerSelection()}
      {mode === 'practice' && renderGame()}
      {mode === 'mode-selection' && (
         <div className="max-w-xl mx-auto text-center animate-in zoom-in-95 pt-12">
            <button onClick={() => setMode('menu')} className="mb-8 flex items-center justify-center mx-auto text-slate-400 font-bold"><ChevronLeft size={20} /> Back</button>
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
               <h2 className="text-2xl font-bold mb-8">Select Practice Mode</h2>
               <div className="grid grid-cols-1 gap-4">
                  <button onClick={() => { setSubMode('normal'); setMode('timer-selection'); }} className="py-5 px-6 border-2 border-slate-100 hover:border-indigo-500 rounded-2xl font-bold text-lg transition-all flex justify-between items-center">Normal (n → n²) <ChevronRight size={20} /></button>
                  <button onClick={() => { setSubMode('reverse'); setMode('timer-selection'); }} className="py-5 px-6 border-2 border-slate-100 hover:border-indigo-500 rounded-2xl font-bold text-lg transition-all flex justify-between items-center">Reverse (√n → n) <ChevronRight size={20} /></button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default SpeedMath;
