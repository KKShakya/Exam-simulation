
import React, { useState, useEffect, useRef } from 'react';
import { Zap, Book, Timer, Trophy, ChevronLeft, RefreshCcw, Brain, Eye, X, Flame, Star, Hash, Settings, Clock, Plus, Minus, Check, FileUp, Loader2, ArrowRight, ChevronDown, MoveLeft, Box, Cuboid, SortAsc, RefreshCw, Lightbulb, MousePointer2, ChevronRight } from 'lucide-react';
import { extractQuestionsFromPdf } from '../services/geminiService';

type Category = 'tables' | 'squares' | 'cubes' | 'alpha' | 'alpha_rank' | 'alpha_pair' | 'percent' | 'multiplication' | 'specific_table' | 'speed_addition' | 'speed_subtraction' | 'mensuration';
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

// --- Benchmarks for PDF Drill ---
const PDF_BENCHMARKS: Record<string, { novice: number, pass: number, topper: number }> = {
  'Simplification': { novice: 45, pass: 30, topper: 20 },
  'Approximation': { novice: 60, pass: 40, topper: 30 },
  'Quadratic Eqn': { novice: 90, pass: 50, topper: 40 },
  'Number Series (Missing)': { novice: 60, pass: 45, topper: 30 },
  'Number Series (Wrong)': { novice: 90, pass: 60, topper: 45 },
};

// --- Restored Datasets ---

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
  { f: '1/50', p: '2%' },
  // High Value Percentages
  { f: '3/2', p: '150%' },
  { f: '5/2', p: '250%' },
  { f: '7/2', p: '350%' },
  { f: '9/2', p: '450%' },
  { f: '11/2', p: '550%' },
  { f: '13/2', p: '650%' },
  { f: '15/2', p: '750%' },
  { f: '17/2', p: '850%' },
  { f: '19/2', p: '950%' }
];

const MENSURATION_DATA = [
  // 2D Shapes
  { type: '2D', shape: 'Rectangle', param: 'Area', formula: 'l × b' },
  { type: '2D', shape: 'Rectangle', param: 'Perimeter', formula: '2(l + b)' },
  { type: '2D', shape: 'Square', param: 'Area', formula: 'a²' },
  { type: '2D', shape: 'Square', param: 'Perimeter', formula: '4a' },
  { type: '2D', shape: 'Circle', param: 'Area', formula: 'πr²' },
  { type: '2D', shape: 'Circle', param: 'Circumference', formula: '2πr' },
  { type: '2D', shape: 'Triangle', param: 'Area', formula: '½ × b × h' },
  { type: '2D', shape: 'Parallelogram', param: 'Area', formula: 'b × h' },
  { type: '2D', shape: 'Rhombus', param: 'Area', formula: '½ × d1 × d2' },
  
  // 3D Shapes
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

// --- Viral Concepts ---

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
        if(isNaN(b)) { a=6; b=3; b=3; }
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

// --- Standard Concepts ---

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
        { pair: "A-Z", mnemonic: "Azad (Free)" },
        { pair: "B-Y", mnemonic: "Boy" },
        { pair: "C-X", mnemonic: "Crux / Crack" },
        { pair: "D-W", mnemonic: "Dew / Draw" },
        { pair: "E-V", mnemonic: "EVerest / LoVe" },
        { pair: "F-U", mnemonic: "FUn / FUr" },
        { pair: "G-T", mnemonic: "G.T. Road" },
        { pair: "H-S", mnemonic: "High School" },
        { pair: "I-R", mnemonic: "Indian Railway" },
        { pair: "J-Q", mnemonic: "Jungle Queen" },
        { pair: "K-P", mnemonic: "Kanpur / PK" },
        { pair: "L-O", mnemonic: "LOve / Light On" },
        { pair: "M-N", mnemonic: "MaN / MooN" }
      ],
      opposites: "AZ, BY, CX, DW, EV, FU, GT, HS, IR, JQ, KP, LO, MN".split(', ')
    }
  },
  percent: {
    title: "Fraction to Percentage Table",
    type: "grid-table",
    data: FRACTION_MAP
  },
  multiplication: {
    title: "Important Exam Multiplications",
    type: "grid-simple",
    data: EXAM_MULTIPLICATIONS
  },
  mensuration: {
    title: "Mensuration Formulas (2D & 3D)",
    type: "mensuration-list",
    data: MENSURATION_DATA
  }
};

const CHEAT_SHEET_DATA = [
  {
    title: "Arithmetic (Hierarchy Models)",
    icon: RefreshCcw,
    color: "indigo",
    sections: [
      {
        subtitle: "Speed, Time, Distance (STD)",
        points: [
          { label: "The King Rule", desc: "Distance is King (Top). Speed & Time are Servants." },
          { label: "The Trigger", desc: "See Distance? → DIVIDE (D/S or D/T). Missing Distance? → MULTIPLY (S×T)." },
          { label: "Boats", desc: "Downstream (+): Helping Hand (B+W). Upstream (-): The Bully (B-W)." }
        ]
      },
      {
        subtitle: "Profit & Loss",
        points: [
          { label: "The King Rule", desc: "Profit is King. Investment & Time are Servants." },
          { label: "Ratios", desc: "Given Inv & Time → MULTIPLY for Profit. Given Profit & Time → DIVIDE for Investment." },
          { label: "Time Trap", desc: "Use 'Time money was in machine', not calendar time." }
        ]
      }
    ]
  },
  {
    title: "Reasoning (Visual Models)",
    icon: Brain,
    color: "purple",
    sections: [
      {
        subtitle: "Syllogism",
        points: [
          { label: "Stranger Territory", desc: "No touch + No Cross = Definite False, but Possibility True." },
          { label: "Only A Few", desc: "A→B: Restricted (Some A not B). B→A: Free (All B can be A)." },
          { label: "School Trap", desc: "If 'Only few A are B' & 'All B are C' → Can All A be C? YES." }
        ]
      },
      {
        subtitle: "Blood Relations",
        points: [
          { label: "In-Laws", desc: "Son/Daughter-in-Law: 1st Person is married." },
          { label: "Gender Cheat", desc: "If B has Wife/Husband → B is married. If B has Sister → A is married." }
        ]
      },
      {
        subtitle: "Seating & Direction",
        points: [
          { label: "Hand Rule", desc: "Palm = Right. Nails = Left." },
          { label: "Circular", desc: "Inside: Anti-Clockwise = Right. Outside: Pretend Inside, then FLIP answer." }
        ]
      }
    ]
  },
  {
    title: "Calculation Speed (No-Pen)",
    icon: Zap,
    color: "amber",
    sections: [
      {
        subtitle: "Simplification Hacks",
        points: [
          { label: "Percent Swap", desc: "A% of B = B% of A. Move % to the friendly number." },
          { label: "Split & Kill", desc: "512 × 12 → (512 × 10) + (512 × 2)." },
          { label: "Approximation", desc: "Options far apart? Round to nearest 10/50/100." }
        ]
      },
      {
        subtitle: "Number Series",
        points: [
          { label: "Dip → Rise", desc: "Decimal Pattern (×0.5, ×1...)." },
          { label: "Rocket Launch", desc: "Huge Gap = Multiplication. Work backwards." },
          { label: "Magic Neighbors", desc: "Cube ± 1: 0, 7, 26, 63, 124, 215, 342." }
        ]
      },
      {
        subtitle: "Quadratics",
        points: [
          { label: "Sign Method", desc: "(-,+)→(+,+). (+,+)→(-,-). (+,-)→(-,+). (-,-)→(+,-)." },
          { label: "Free Marks", desc: "If Both Constant Terms Negative → CND." }
        ]
      }
    ]
  },
  {
    title: "Exam Strategy",
    icon: Trophy,
    color: "emerald",
    sections: [
      {
        subtitle: "Topper's Process",
        points: [
          { label: "Rough Sheet", desc: "Fold it. Write Answers Only, never copy question." },
          { label: "Mouse Hand", desc: "Left Hand on Mouse (Click), Right Hand with Pen (Write)." },
          { label: "Alien Search", desc: "In Alpha-Numeric, scan for Numbers/Symbols, not Letters." },
          { label: "Chinese Coding", desc: "Use Shapes (Circles, Triangles), do not write words." }
        ]
      }
    ]
  }
];

const SpeedMath: React.FC = () => {
  const [mode, setMode] = useState<'menu' | 'viral-menu' | 'alpha-menu' | 'tricks-sheet' | 'practice' | 'reference' | 'timer-selection' | 'pdf-upload' | 'pdf-config' | 'pdf-drill' | 'pdf-result'>('menu');
  const [category, setCategory] = useState<string>('tables'); // General or Viral key
  const [customTable, setCustomTable] = useState<{table: string, limit: string}>({ table: '19', limit: '10' });
  const [subtractionMode, setSubtractionMode] = useState<'2num' | '3num'>('2num');
  const [reverseInputMode, setReverseInputMode] = useState(false);
  
  // PDF Mode State
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [extractedPdfQuestions, setExtractedPdfQuestions] = useState<{q: string, a: string}[]>([]);
  const [activePdfQuestions, setActivePdfQuestions] = useState<{q: string, a: string}[]>([]);
  const [pdfConfig, setPdfConfig] = useState({ topic: 'Simplification', difficulty: 'novice' }); // novice = beginner
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [pdfTimer, setPdfTimer] = useState(0);

  const [score, setScore] = useState(0);
  const [totalTime, setTotalTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [question, setQuestion] = useState<{ text: string, answer: string, options?: string[] }>({ text: '', answer: '' });
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [currentQIndex, setCurrentQIndex] = useState(0); // For PDF mode indexing

  const inputRef = useRef<HTMLInputElement>(null);

  // Helper: Generate number with distinct digits if possible and no repeats from excluded list
  const generateNonRepeatingNumber = (min: number, max: number, exclude: number[] = []): number => {
    let attempts = 0;
    while (attempts < 20) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      const digits = num.toString().split('');
      const hasUniqueDigits = new Set(digits).size === digits.length;
      if (hasUniqueDigits && !exclude.includes(num)) {
        return num;
      }
      attempts++;
    }
    // Fallback if strict generation fails
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // --- Standard Game Logic (Same as before for Tables, etc) ---
  const generateStandardQuestion = (cat: Category) => {
    let q = '', a = '';
    let opts: string[] | undefined = undefined;

    switch (cat) {
      case 'tables': {
        const num = Math.floor(Math.random() * 19) + 2; // 2 to 20
        const mult = Math.floor(Math.random() * 9) + 2; // 2 to 10
        q = `${num} × ${mult}`;
        a = (num * mult).toString();
        break;
      }
      case 'specific_table': {
         const t = parseInt(customTable.table) || 2;
         const l = parseInt(customTable.limit) || 10;
         const mult = Math.floor(Math.random() * l) + 1;
         q = `${t} × ${mult}`;
         a = (t * mult).toString();
         break;
      }
      case 'speed_addition': {
        const n1 = generateNonRepeatingNumber(10, 99);
        const n2 = generateNonRepeatingNumber(10, 99, [n1]); // Avoid same numbers
        q = `${n1} + ${n2}`;
        a = (n1 + n2).toString();
        break;
      }
      case 'speed_subtraction': {
        if (subtractionMode === '2num') {
          const n1 = generateNonRepeatingNumber(100, 9999);
          const n2 = generateNonRepeatingNumber(10, n1 - 1, [n1]); // Ensure result is positive
          q = `${n1} - ${n2}`;
          a = (n1 - n2).toString();
        } else {
           const isType1 = Math.random() > 0.5; // A + B - C
           const n1 = generateNonRepeatingNumber(500, 9999);
           const n2 = generateNonRepeatingNumber(50, 999, [n1]);
           const n3 = generateNonRepeatingNumber(10, 400, [n1, n2]);
           
           if (isType1) {
             q = `${n1} + ${n2} - ${n3}`;
             a = (n1 + n2 - n3).toString();
           } else {
             const safeN1 = Math.max(n1, n2 + n3 + 50); 
             q = `${safeN1} - ${n2} - ${n3}`;
             a = (safeN1 - n2 - n3).toString();
           }
        }
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
        const char = alpha[idx];
        
        if (Math.random() > 0.5) {
           // Ask for Rank
           q = `Rank of ${char}`;
           a = (idx + 1).toString();
        } else {
           // Ask for Opposite
           // A(0) <-> Z(25) | 0+25=25, 1+24=25
           const oppositeChar = alpha[25 - idx];
           q = `Opposite of ${char}`;
           a = oppositeChar;
        }
        break;
      }
      case 'alpha_rank': {
        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const idx = Math.floor(Math.random() * 26);
        q = alpha[idx]; // Just the letter
        a = (idx + 1).toString();
        break;
      }
      case 'alpha_pair': {
        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const idx = Math.floor(Math.random() * 26);
        const char = alpha[idx];
        const oppositeChar = alpha[25 - idx];
        q = `Opposite of ${char}`;
        a = oppositeChar;
        break;
      }
      case 'percent': {
        const item = FRACTION_MAP[Math.floor(Math.random() * FRACTION_MAP.length)];
        q = `${item.p} = ?`;
        a = item.f;
        break;
      }
      case 'multiplication': {
        if (Math.random() > 0.5) {
           const item = EXAM_MULTIPLICATIONS[Math.floor(Math.random() * EXAM_MULTIPLICATIONS.length)];
           q = item.q;
           a = item.a;
        } else {
           const n1 = Math.floor(Math.random() * 89) + 10;
           const n2 = Math.floor(Math.random() * 9) + 2;
           q = `${n1} × ${n2}`;
           a = (n1 * n2).toString();
        }
        break;
      }
      case 'mensuration': {
        const item = MENSURATION_DATA[Math.floor(Math.random() * MENSURATION_DATA.length)];
        q = `${item.shape} (${item.param})?`;
        a = item.formula;
        
        // Generate distractors from other formulas
        const others = MENSURATION_DATA.filter(x => x.formula !== a);
        const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
        const rawOptions = [a, ...shuffledOthers.map(o => o.formula)];
        opts = rawOptions.sort(() => 0.5 - Math.random());
        break;
      }
    }
    return { text: q, answer: a, options: opts };
  };

  const initGameSetup = (cat: string) => {
    setCategory(cat);
    
    // Auto-enable reverse input logic for subtraction
    if (cat === 'speed_subtraction' || cat === 'viral_subtraction') {
      setReverseInputMode(true);
    } else {
      setReverseInputMode(false);
    }

    if (cat === 'speed_addition' || cat === 'speed_subtraction') {
       startFixedTimeDrill(cat);
    } else {
       setMode('timer-selection');
    }
  };

  const startFixedTimeDrill = (cat: string) => {
     const seconds = 60; // Fixed 1 min
     setTotalTime(seconds);
     setTimeLeft(seconds);
     setMode('practice');
     setScore(0);
     setIsActive(true);
     setInput('');
     nextQuestion(cat);
     setTimeout(() => inputRef.current?.focus(), 100);
  }

  const startWithDuration = (mins: number) => {
    const seconds = mins * 60;
    setTotalTime(seconds);
    setTimeLeft(seconds);
    setMode('practice');
    setScore(0);
    setIsActive(true);
    setInput('');
    nextQuestion(category);
    // Only focus input if standard drill (no options)
    const isOptionDrill = category === 'mensuration';
    if (!isOptionDrill) {
       setTimeout(() => inputRef.current?.focus(), 100);
    }
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

  // --- PDF Drill Functions ---

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      setIsProcessingPdf(true);
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        setPdfFile(base64String);
        
        // Analyze PDF
        const extracted = await extractQuestionsFromPdf(base64String);
        setExtractedPdfQuestions(extracted);
        setIsProcessingPdf(false);
        setMode('pdf-config');
      };
      reader.readAsDataURL(file);
    }
  };

  const startPdfDrill = () => {
    if (extractedPdfQuestions.length === 0) return;
    
    // Pick random subset of up to 10 questions
    const shuffled = [...extractedPdfQuestions].sort(() => 0.5 - Math.random());
    const subset = shuffled.slice(0, Math.min(10, shuffled.length));
    
    setActivePdfQuestions(subset);
    setCurrentQIndex(0);
    setPdfTimer(0);
    setInput('');
    setScore(0);
    setIsActive(true);
    setMode('pdf-drill');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handlePdfInputCheck = () => {
     const currentQ = activePdfQuestions[currentQIndex];
     // Simple string comparison for now. Ideally should parse numerical value.
     // Removing spaces for loose comparison
     const cleanInput = input.replace(/\s/g, '').toLowerCase();
     const cleanAns = currentQ.a.replace(/\s/g, '').toLowerCase();

     if (cleanInput === cleanAns || cleanInput === cleanAns.replace('.0', '')) {
       setFeedback('correct');
       setTimeout(() => {
          setFeedback('none');
          if (currentQIndex < activePdfQuestions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
            setInput('');
          } else {
             // Finish
             setIsActive(false);
             setMode('pdf-result');
          }
       }, 300);
     } else {
        setFeedback('wrong');
        setTimeout(() => setFeedback('none'), 500);
     }
  };

  const handleOptionClick = (selectedOption: string) => {
    if (!isActive) return;
    if (selectedOption === question.answer) {
        setScore(s => s + 1);
        setFeedback('correct');
        setTimeout(() => {
          setFeedback('none');
          nextQuestion(category);
        }, 200);
    } else {
        setFeedback('wrong');
        setTimeout(() => setFeedback('none'), 200);
    }
  };

  // --- Timer Effects ---

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && mode === 'practice' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (mode === 'practice' && timeLeft === 0 && isActive) {
      setIsActive(false);
    }

    if (isActive && mode === 'pdf-drill') {
       interval = setInterval(() => {
         setPdfTimer(prev => prev + 1);
       }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  // Unified Input Handler with Reverse Mode Support
  const processInput = (e: React.ChangeEvent<HTMLInputElement>, currentInput: string) => {
    const rawVal = e.target.value;
    
    // Reverse Mode (Right-to-Left Digits) logic:
    // If the new value is just the old value + 1 char at the end (standard typing),
    // move that new char to the front.
    if (reverseInputMode && rawVal.length === currentInput.length + 1 && rawVal.startsWith(currentInput)) {
       const newChar = rawVal.slice(-1);
       return newChar + currentInput;
    }
    
    // Default behavior (includes backspace handling, selection replacement, etc.)
    return rawVal;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = processInput(e, input);
    setInput(val);

    if (mode === 'practice') {
      if (val.trim().toLowerCase() === question.answer.toLowerCase()) {
        setScore((s) => s + 1);
        setFeedback('correct');
        setInput('');
        nextQuestion(category);
        setTimeout(() => setFeedback('none'), 200);
      }
    }
  };

  const handlePdfInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = processInput(e, input);
    setInput(val);
  }

  // --- Views ---

  const renderMainMenu = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Speed Math Trainer</h2>
        <p className="text-slate-500">Master calculation speed for banking exams.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Topper's Cheat Sheet Card */}
        <div 
           onClick={() => setMode('tricks-sheet')}
           className="col-span-1 md:col-span-2 lg:col-span-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl cursor-pointer transform hover:scale-[1.005] transition-all relative overflow-hidden group border border-slate-700"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-indigo-500/20 transition-all"></div>
           <div className="relative z-10 flex items-center justify-between">
             <div className="flex-1">
               <div className="flex items-center gap-2 mb-2">
                 <span className="bg-yellow-400 text-slate-900 text-xs font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">Premium Resource</span>
               </div>
               <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Lightbulb className="text-yellow-400 fill-yellow-400" />
                  Additional Tricks: Topper's Cheat Sheet
               </h3>
               <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                  Access the ultimate compilation of <strong>King Rules</strong>, <strong>Visual Models</strong>, and <strong>No-Pen Protocols</strong>. Everything you need to revise before the exam.
               </p>
             </div>
             <div className="hidden md:flex bg-white/10 p-3 rounded-full">
                <ChevronRight className="text-white" size={24} />
             </div>
           </div>
        </div>

        {/* Viral Maths Promo Card */}
        <div 
          onClick={() => setMode('viral-menu')}
          className="lg:col-span-1 bg-gradient-to-r from-indigo-900 to-violet-900 rounded-2xl p-6 text-white shadow-xl cursor-pointer transform hover:scale-[1.01] transition-all relative overflow-hidden border border-indigo-700 group h-full flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">NEW</span>
            </div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Flame className="text-orange-400" fill="currentColor" />
              Viral Maths
            </h3>
            <p className="text-indigo-200 text-sm mb-4">
              Learn Todu-Modu, Judwa Approach, and 100+ shortcuts.
            </p>
          </div>
          <button className="bg-white text-indigo-900 px-4 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 w-max text-sm">
            Open Brahmastra <ChevronLeft className="rotate-180" size={16} />
          </button>
        </div>

        {/* Specific Table Drill Card */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden h-full flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                <Settings size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Specific Table</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 items-end mt-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Table Of</label>
                <input 
                  type="number" 
                  value={customTable.table}
                  onChange={(e) => setCustomTable({...customTable, table: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="12"
                />
              </div>
              <div className="text-slate-400 font-bold hidden sm:block pb-2">×</div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Up To</label>
                <input 
                  type="number" 
                  value={customTable.limit}
                  onChange={(e) => setCustomTable({...customTable, limit: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="10"
                />
              </div>
            </div>
          </div>
          <button 
                onClick={() => initGameSetup('specific_table')}
                disabled={!customTable.table || !customTable.limit}
                className="w-full mt-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Zap size={16} /> Start
            </button>
        </div>

        {/* PDF Drill Card */}
        <div 
          onClick={() => setMode('pdf-upload')}
          className="lg:col-span-1 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all relative overflow-hidden border border-emerald-500 group h-full flex flex-col justify-between"
        >
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-10 -mb-10 blur-2xl group-hover:bg-white/20 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileUp size={20} />
              </div>
              <h3 className="text-lg font-bold">PDF Analyzer</h3>
            </div>
            <p className="text-emerald-100 text-sm mb-4 leading-relaxed">
              Upload any question PDF. AI will extract questions, benchmark your speed against toppers, and grade you.
            </p>
          </div>
          <button className="bg-white text-emerald-800 px-4 py-2 rounded-lg font-bold shadow-md hover:bg-emerald-50 transition-colors flex items-center gap-2 w-max text-sm">
             Upload PDF <ChevronLeft className="rotate-180" size={16} />
          </button>
        </div>

        {/* Speed Drills Group */}
        <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Addition Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-green-100 text-green-700 rounded-lg"><Plus size={20} /></div>
                 <div>
                   <h3 className="font-bold text-slate-800">Speed Addition</h3>
                   <p className="text-xs text-slate-500">2-Digit Rapid Fire (1 Min)</p>
                 </div>
               </div>
               <button onClick={() => initGameSetup('speed_addition')} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg">
                 <Zap size={20} />
               </button>
            </div>

            {/* Subtraction Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col">
               <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 text-red-700 rounded-lg"><Minus size={20} /></div>
                    <div>
                      <h3 className="font-bold text-slate-800">Subtraction</h3>
                      <p className="text-xs text-slate-500">Complex Drills (1 Min)</p>
                    </div>
                 </div>
                 <button onClick={() => initGameSetup('speed_subtraction')} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg">
                    <Zap size={20} />
                 </button>
               </div>
               <div className="flex gap-2 bg-slate-50 p-1 rounded-lg">
                 <button 
                   onClick={() => setSubtractionMode('2num')}
                   className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${subtractionMode === '2num' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   2 Num
                 </button>
                 <button 
                   onClick={() => setSubtractionMode('3num')}
                   className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${subtractionMode === '3num' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   3 Num
                 </button>
               </div>
            </div>
        </div>
      </div>

      {/* Standard Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 'tables', label: 'Tables (1-20)', icon: Hash, color: 'bg-amber-500' },
          { id: 'squares', label: 'Squares (1-50)', icon: Brain, color: 'bg-blue-500' },
          { id: 'cubes', label: 'Cubes (1-25)', icon: Brain, color: 'bg-indigo-500' },
          { id: 'alpha', label: 'Alphabet Ranks', icon: Eye, color: 'bg-emerald-500' },
          { id: 'percent', label: '% to Fractions', icon: RefreshCcw, color: 'bg-rose-500' },
          { id: 'mensuration', label: 'Mensuration', icon: Box, color: 'bg-teal-500' },
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
                  onClick={() => {
                    if (item.id === 'alpha') {
                      setMode('alpha-menu');
                    } else {
                      initGameSetup(item.id);
                    }
                  }}
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

  const renderTricksSheet = () => (
    <div className="animate-in fade-in slide-in-from-right-4 pb-12 max-w-6xl mx-auto">
       <button onClick={() => setMode('menu')} className="mb-6 flex items-center text-slate-500 hover:text-indigo-600 transition-colors group">
         <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Menu
       </button>
       
       <div className="mb-10 text-center">
         <h2 className="text-4xl font-extrabold text-slate-900 mb-3 flex items-center justify-center gap-3">
           <Trophy className="text-yellow-500" size={40} fill="currentColor" />
           The Topper's Cheat Sheet
         </h2>
         <p className="text-slate-500 text-lg">Consolidated King Rules, Visual Models & No-Pen Protocols</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 masonry-grid">
         {CHEAT_SHEET_DATA.map((section, idx) => {
           const Icon = section.icon;
           return (
             <div key={idx} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
               <div className={`bg-${section.color}-50 p-4 border-b border-${section.color}-100 flex items-center gap-3`}>
                 <div className={`p-2 bg-${section.color}-100 text-${section.color}-700 rounded-lg`}>
                   <Icon size={24} />
                 </div>
                 <h3 className={`text-xl font-bold text-${section.color}-900`}>{section.title}</h3>
               </div>
               
               <div className="p-6 space-y-8">
                 {section.sections.map((sub, sIdx) => (
                   <div key={sIdx}>
                     <h4 className="font-bold text-slate-800 text-lg mb-3 border-l-4 border-slate-200 pl-3">{sub.subtitle}</h4>
                     <ul className="space-y-4">
                       {sub.points.map((pt, pIdx) => (
                         <li key={pIdx} className="text-slate-600 leading-relaxed text-sm">
                           <span className={`font-bold text-${section.color}-700 block mb-1`}>{pt.label}</span>
                           <span className="bg-slate-50 px-3 py-2 rounded-lg block border border-slate-100">
                             {pt.desc.split(/(King|Servants|DIVIDE|MULTIPLY|Helping Hand|The Bully|Profit|Investment|Restricted|Free|NO|YES|married|Empty Spot|Right|Left|Numbers|Symbols|Shapes)/g).map((part, i) => {
                               if (['King', 'Servants', 'DIVIDE', 'MULTIPLY', 'Helping Hand', 'The Bully', 'Profit', 'Investment', 'Restricted', 'Free', 'NO', 'YES', 'married', 'Empty Spot', 'Right', 'Left', 'Numbers', 'Symbols', 'Shapes'].includes(part)) {
                                 return <span key={i} className="font-extrabold text-slate-800 bg-yellow-100 px-1 rounded mx-0.5">{part}</span>;
                               }
                               return part;
                             })}
                           </span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 ))}
               </div>
             </div>
           );
         })}
       </div>
    </div>
  );

  const renderAlphaMenu = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4">
       <button onClick={() => setMode('menu')} className="mb-6 flex items-center text-slate-500 hover:text-indigo-600">
         <ChevronLeft size={20} /> Back to Menu
       </button>
       
       <div className="text-center mb-8">
         <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
           <Eye className="text-emerald-500" size={32} />
           Alphabet Mastery
         </h2>
         <p className="text-slate-500">Master ranks, opposite pairs, and rapid recall.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Positions Only */}
         <div onClick={() => initGameSetup('alpha_rank')} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-lg cursor-pointer transition-all group">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
              <SortAsc size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Positions Only</h3>
            <p className="text-slate-500 text-sm mb-4">You see 'P', you type '16'. Rapid fire ranking drill.</p>
            <button className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-sm">Start Drill</button>
         </div>

         {/* Pairs Only */}
         <div onClick={() => initGameSetup('alpha_pair')} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-lg cursor-pointer transition-all group">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <RefreshCw size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Pairs Only</h3>
            <p className="text-slate-500 text-sm mb-4">You see 'Opposite of A', you type 'Z'. Master pairs like AZ, BY.</p>
            <button className="w-full py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm">Start Drill</button>
         </div>

         {/* Mixed Mode */}
         <div onClick={() => initGameSetup('alpha')} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-lg cursor-pointer transition-all group">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Mixed Mode</h3>
            <p className="text-slate-500 text-sm mb-4">Random mix of positions and pairs. The ultimate test.</p>
            <button className="w-full py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-sm">Start Drill</button>
         </div>
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
                  onClick={() => initGameSetup(key)}
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
    // @ts-ignore
    const stdData = !isViral && STANDARD_CONCEPTS[category] ? STANDARD_CONCEPTS[category] : null;

    return (
      <div className="animate-in fade-in slide-in-from-right-4 pb-10 max-w-5xl mx-auto">
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
           </div>
         ) : stdData ? (
           <div>
             <div className="bg-slate-800 text-white p-6 rounded-2xl mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{stdData.title}</h2>
                  <p className="text-slate-400 text-sm">Memorize these for higher speed.</p>
                </div>
                <button 
                  onClick={() => {
                    if (category === 'alpha') {
                      setMode('alpha-menu');
                    } else {
                      initGameSetup(category);
                    }
                  }}
                  className="bg-white text-slate-900 px-6 py-2 rounded-lg font-bold hover:bg-slate-100"
                >
                  Play Now
                </button>
             </div>

             {stdData.type === 'grid-card' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {(stdData.data as any[]).map((table, i) => (
                   <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                     <h4 className="font-bold text-indigo-600 text-center mb-3 bg-indigo-50 py-1 rounded">Table of {table.label}</h4>
                     <div className="space-y-1 text-sm text-slate-700 font-mono text-center">
                       {table.values.map((row: string, j: number) => (
                         <div key={j}>{row}</div>
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
             )}

             {stdData.type === 'grid-simple' && (
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                 {(stdData.data as any[]).map((item, i) => (
                   <div key={i} className="bg-white border border-slate-200 rounded-lg p-3 text-center hover:bg-indigo-50 transition-colors">
                     <div className="text-slate-500 text-xs mb-1">{item.q}</div>
                     <div className="text-lg font-bold text-indigo-700">{item.a}</div>
                   </div>
                 ))}
               </div>
             )}

             {stdData.type === 'grid-table' && (
               <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 divide-x divide-y divide-slate-200">
                   {(stdData.data as any[]).map((item, i) => (
                     <div key={i} className="p-4 text-center hover:bg-indigo-50">
                       <div className="text-slate-500 text-sm mb-1">{item.f}</div>
                       <div className="text-xl font-bold text-indigo-700">{item.p}</div>
                     </div>
                   ))}
                 </div>
               </div>
             )}
             
             {stdData.type === 'mensuration-list' && (
                <div className="space-y-8">
                  {['2D', '3D'].map(dim => (
                    <div key={dim} className="space-y-4">
                      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        {dim === '2D' ? <Box size={20} className="text-indigo-600" /> : <Cuboid size={20} className="text-purple-600" />}
                        {dim} Formulas
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {(stdData.data as any[]).filter(d => d.type === dim).map((item, i) => (
                           <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-slate-800">{item.shape}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{item.param}</span>
                              </div>
                              <div className="text-2xl font-bold text-indigo-600 font-mono">
                                {item.formula}
                              </div>
                           </div>
                         ))}
                      </div>
                    </div>
                  ))}
                </div>
             )}

             {stdData.type === 'custom-alpha' && (
               <div className="space-y-6">
                 <div className="bg-white p-6 rounded-xl border border-slate-200">
                   <h4 className="font-bold text-slate-700 mb-4">Standard Ranking (A=1)</h4>
                   <div className="grid grid-cols-6 md:grid-cols-9 gap-2">
                     {(stdData.data.forward as any[]).map((item: any) => (
                       <div key={item.char} className="border border-slate-100 p-2 rounded text-center bg-slate-50">
                         <span className="text-indigo-600 font-bold">{item.char}</span>
                         <span className="text-slate-400 mx-1">-</span>
                         <span className="font-mono">{item.val}</span>
                       </div>
                     ))}
                   </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white p-6 rounded-xl border border-slate-200">
                     <h4 className="font-bold text-slate-700 mb-4">Mnemonics</h4>
                     <ul className="space-y-3">
                       {(stdData.data.mnemonics as any[]).map((m: any, i: number) => (
                         <li key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                           <span className="font-bold text-indigo-700 text-lg tracking-widest">{m.code}</span>
                           <span className="font-mono text-slate-600">{m.val}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                   <div className="bg-white p-6 rounded-xl border border-slate-200">
                     <h4 className="font-bold text-slate-700 mb-4">Opposite Pairs</h4>
                     <div className="grid grid-cols-2 gap-2">
                        {(stdData.data.opposites_list as any[]).map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center p-2 bg-orange-50 rounded-lg border border-orange-100">
                            <span className="font-bold text-orange-800 text-lg">{item.pair}</span>
                            <span className="text-xs text-orange-600 font-medium">{item.mnemonic}</span>
                          </div>
                        ))}
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {stdData.type === 'info' && (
               <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
                 <p className="text-slate-600 text-lg">{stdData.data}</p>
               </div>
             )}

           </div>
         ) : (
           <div className="text-center py-20 text-slate-400">
             Data not found.
           </div>
         )}
      </div>
    );
  };

  const renderTimerSelection = () => (
    <div className="max-w-xl mx-auto text-center animate-in zoom-in-95 duration-200">
      <button 
        onClick={() => {
           if (Object.keys(VIRAL_CONCEPTS).includes(category)) {
             setMode('viral-menu');
           } else if (['alpha', 'alpha_rank', 'alpha_pair'].includes(category)) {
             setMode('alpha-menu');
           } else {
             setMode('menu');
           }
        }} 
        className="mb-8 flex items-center justify-center mx-auto text-slate-400 hover:text-indigo-600"
      >
        <ChevronLeft size={20} /> Back to Options
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
          <Clock size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Select Duration</h2>
        <p className="text-slate-500 mb-8">How long do you want to practice?</p>

        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 5, 10].map(mins => (
             <button
               key={mins}
               onClick={() => startWithDuration(mins)}
               className="py-4 px-6 border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl font-bold text-lg text-slate-700 hover:text-indigo-700 transition-all"
             >
               {mins} Min
             </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGame = () => {
    // Calculate potential max score based on 2 seconds per question
    const potential = Math.floor(totalTime / 2);
    // Determine font size based on category and question length
    let fontSizeClass = 'text-6xl md:text-8xl';
    if (category === 'speed_subtraction') fontSizeClass = 'text-4xl';
    else if (['alpha', 'alpha_rank', 'alpha_pair'].includes(category) && question.text.length > 5) fontSizeClass = 'text-4xl md:text-5xl'; // Smaller for "Opposite of X" text

    return (
      <div className="max-w-2xl mx-auto text-center animate-in zoom-in-95 duration-200">
        {timeLeft > 0 ? (
          <>
            <div className="flex justify-between items-center mb-12">
              <button 
                onClick={() => {
                  if (Object.keys(VIRAL_CONCEPTS).includes(category)) {
                     setMode('viral-menu');
                  } else if (['alpha', 'alpha_rank', 'alpha_pair'].includes(category)) {
                     setMode('alpha-menu');
                  } else {
                     setMode('menu');
                  }
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
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
                {category === 'specific_table' ? `Table of ${customTable.table}` : 
                 category === 'speed_addition' ? 'Speed Addition' :
                 category === 'speed_subtraction' ? 'Speed Subtraction' :
                 category === 'mensuration' ? 'Mensuration Quiz' :
                 category === 'alpha_rank' ? 'Position Drill' :
                 category === 'alpha_pair' ? 'Opposite Pairs' :
                 'Solve Fast'}
              </div>
              <div className={`font-bold text-slate-800 transition-transform duration-100 ${feedback === 'correct' ? 'scale-110 text-green-600' : ''} ${fontSizeClass}`}>
                {question.text}
              </div>
            </div>

            {question.options ? (
               // Multiple Choice Interface for Mensuration/Formulas
               <div className="max-w-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                 {question.options.map((opt, idx) => (
                   <button
                     key={idx}
                     onClick={() => handleOptionClick(opt)}
                     className="bg-white border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl py-4 px-6 text-xl font-bold text-slate-700 transition-all shadow-sm"
                   >
                     {opt}
                   </button>
                 ))}
               </div>
            ) : (
              // Standard Input Interface
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
                <div className="mt-4 flex justify-center">
                   <button 
                     onClick={() => setReverseInputMode(!reverseInputMode)}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${reverseInputMode ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                   >
                     {reverseInputMode ? <MoveLeft size={12} /> : null}
                     {reverseInputMode ? 'Right-to-Left (Units First) ON' : 'Standard Input'}
                   </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={40} className="text-yellow-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Time's Up!</h2>
            
            <p className="text-slate-500 mb-2">Score</p>
            <div className="text-4xl font-bold text-indigo-900 mb-1">
              {score} <span className="text-2xl text-slate-400">/ {potential}</span>
            </div>
            <p className="text-xs text-slate-400 mb-8">
              (Target: {potential} based on 2s/question)
            </p>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => {
                  if (Object.keys(VIRAL_CONCEPTS).includes(category)) {
                     setMode('viral-menu');
                  } else if (['alpha', 'alpha_rank', 'alpha_pair'].includes(category)) {
                     setMode('alpha-menu');
                  } else {
                     setMode('menu');
                  }
                }}
                className="px-6 py-3 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
              >
                Exit
              </button>
              <button 
                onClick={() => {
                  if (category === 'speed_addition' || category === 'speed_subtraction') {
                    startFixedTimeDrill(category);
                  } else {
                    initGameSetup(category);
                  }
                }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow-lg"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- PDF Drill Views ---

  const renderPdfUpload = () => (
    <div className="max-w-xl mx-auto text-center animate-in zoom-in-95 duration-200">
      <button onClick={() => setMode('menu')} className="mb-8 flex items-center justify-center mx-auto text-slate-400 hover:text-emerald-600">
        <ChevronLeft size={20} /> Back to Menu
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
          <FileUp size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Question PDF</h2>
        <p className="text-slate-500 mb-8">AI will extract questions, benchmark your speed against toppers, and grade you.</p>
        
        {isProcessingPdf ? (
          <div className="py-8 text-emerald-600 flex flex-col items-center">
             <Loader2 size={32} className="animate-spin mb-4" />
             <p className="font-semibold">Analyzing Document...</p>
             <p className="text-xs text-slate-400 mt-2">Extracting numerical problems & answers.</p>
          </div>
        ) : (
          <label className="block w-full cursor-pointer">
            <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:bg-slate-50 hover:border-emerald-500 transition-colors">
               <p className="font-bold text-slate-700">Click to Select PDF</p>
               <p className="text-xs text-slate-400 mt-1">Supported: .pdf (Max 5MB)</p>
            </div>
          </label>
        )}
      </div>
    </div>
  );

  const renderPdfConfig = () => (
    <div className="max-w-xl mx-auto text-center animate-in zoom-in-95 duration-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
         <h2 className="text-2xl font-bold text-slate-800 mb-6">Drill Configuration</h2>
         
         <div className="text-left space-y-4 mb-8">
           <div>
             <label className="block text-sm font-bold text-slate-600 mb-2">Topic Detected / Select</label>
             <ConfigSelect 
               value={pdfConfig.topic}
               onChange={(val) => setPdfConfig({...pdfConfig, topic: val})}
               options={Object.keys(PDF_BENCHMARKS).map(t => ({ value: t, label: t }))}
             />
           </div>
           
           <div>
             <label className="block text-sm font-bold text-slate-600 mb-2">Your Target Level</label>
             <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setPdfConfig({...pdfConfig, difficulty: 'novice'})}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${pdfConfig.difficulty === 'novice' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500'}`}
                >
                  Novice (Day 1)
                </button>
                <button 
                  onClick={() => setPdfConfig({...pdfConfig, difficulty: 'pass'})}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${pdfConfig.difficulty === 'pass' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500'}`}
                >
                  Passable
                </button>
                <button 
                  onClick={() => setPdfConfig({...pdfConfig, difficulty: 'topper'})}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${pdfConfig.difficulty === 'topper' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500'}`}
                >
                  Topper
                </button>
             </div>
           </div>
         </div>
         
         <div className="bg-emerald-50 p-4 rounded-lg text-emerald-800 text-sm mb-6 flex justify-between items-center">
            <span>Questions Extracted:</span>
            <span className="font-bold text-xl">{extractedPdfQuestions.length}</span>
         </div>
         
         <button 
           onClick={startPdfDrill}
           className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 shadow-lg flex items-center justify-center gap-2"
         >
           Start Drill <ArrowRight size={20} />
         </button>
      </div>
    </div>
  );

  const renderPdfDrill = () => (
     <div className="max-w-2xl mx-auto text-center animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-12">
           <button onClick={() => setMode('pdf-config')} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
           </button>
           <div className="flex items-center space-x-2 text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              <Clock size={16} />
              <span className="font-mono text-lg font-bold">{pdfTimer}s</span>
           </div>
           <div className="text-slate-500 font-medium">
             Q {currentQIndex + 1} / {activePdfQuestions.length}
           </div>
        </div>

        <div className="mb-12">
           <div className={`text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed transition-transform duration-100 ${feedback === 'correct' ? 'scale-105 text-green-600' : ''}`}>
             {activePdfQuestions[currentQIndex]?.q}
           </div>
        </div>

        <div className="max-w-xs mx-auto flex flex-col gap-4">
           <div className="flex gap-2">
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handlePdfInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handlePdfInputCheck()}
                placeholder="Answer"
                className="w-full bg-white border-2 border-slate-200 rounded-xl py-4 text-center text-xl font-bold focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
                autoFocus
            />
            <button onClick={handlePdfInputCheck} className="bg-emerald-600 text-white rounded-xl px-4 hover:bg-emerald-700">
               <ChevronLeft className="rotate-180" size={24} />
            </button>
           </div>
           <div className="flex justify-center">
                 <button 
                   onClick={() => setReverseInputMode(!reverseInputMode)}
                   className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${reverseInputMode ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                 >
                   {reverseInputMode ? <MoveLeft size={12} /> : null}
                   {reverseInputMode ? 'Right-to-Left (Units First) ON' : 'Standard Input'}
                 </button>
           </div>
        </div>
     </div>
  );

  const renderPdfResult = () => {
    const avgTime = parseFloat((pdfTimer / activePdfQuestions.length).toFixed(1));
    const benchmarks = PDF_BENCHMARKS[pdfConfig.topic];
    let verdict = "Keep Practicing";
    let verdictColor = "text-slate-500";
    
    if (avgTime <= benchmarks.topper) {
      verdict = "Topper Level! 🏆";
      verdictColor = "text-emerald-600";
    } else if (avgTime <= benchmarks.pass) {
      verdict = "Exam Ready (Passable)";
      verdictColor = "text-blue-600";
    } else if (avgTime <= benchmarks.novice) {
       verdict = "Beginner (Day 1)";
       verdictColor = "text-orange-500";
    } else {
       verdict = "Needs Improvement";
       verdictColor = "text-red-500";
    }

    return (
      <div className="max-w-xl mx-auto text-center animate-in zoom-in-95 duration-200">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
           <h2 className="text-3xl font-bold text-slate-900 mb-6">Drill Report Card</h2>
           
           <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-slate-500 text-sm">Total Time</p>
                <p className="text-2xl font-bold text-slate-800">{pdfTimer}s</p>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-slate-500 text-sm">Questions</p>
                <p className="text-2xl font-bold text-slate-800">{activePdfQuestions.length}</p>
             </div>
           </div>

           <div className="mb-8">
             <p className="text-slate-500 uppercase tracking-widest text-xs font-bold mb-2">Your Speed</p>
             <div className="text-5xl font-bold text-slate-900 mb-2">
               {avgTime} <span className="text-lg text-slate-400 font-normal">sec/ques</span>
             </div>
             <div className={`text-xl font-bold ${verdictColor} bg-slate-50 inline-block px-4 py-2 rounded-lg`}>
                {verdict}
             </div>
           </div>

           <div className="bg-indigo-50 rounded-xl p-6 text-left mb-8">
              <h4 className="font-bold text-indigo-900 mb-4 text-sm uppercase">Topic Benchmarks: {pdfConfig.topic}</h4>
              <div className="space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Topper</span>
                    <span className="font-bold text-emerald-600">&lt; {benchmarks.topper}s</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Passable</span>
                    <span className="font-bold text-blue-600">{benchmarks.pass}s</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Beginner</span>
                    <span className="font-bold text-orange-600">{benchmarks.novice}s</span>
                 </div>
              </div>
           </div>

           <button 
             onClick={() => setMode('menu')}
             className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800"
           >
             Back to Menu
           </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      {mode === 'menu' && renderMainMenu()}
      {mode === 'viral-menu' && renderViralMenu()}
      {mode === 'alpha-menu' && renderAlphaMenu()}
      {mode === 'tricks-sheet' && renderTricksSheet()}
      {mode === 'reference' && renderReference()}
      {mode === 'timer-selection' && renderTimerSelection()}
      {mode === 'practice' && renderGame()}
      {mode === 'pdf-upload' && renderPdfUpload()}
      {mode === 'pdf-config' && renderPdfConfig()}
      {mode === 'pdf-drill' && renderPdfDrill()}
      {mode === 'pdf-result' && renderPdfResult()}
    </div>
  );
};

export default SpeedMath;
