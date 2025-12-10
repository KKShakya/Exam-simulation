
import React, { useState, useEffect, useRef } from 'react';
import { Zap, Book, Timer, Trophy, ChevronLeft, RefreshCcw, Brain, Eye, X, Flame, Star, Hash, Settings, Clock, Plus, Minus, Check, FileUp, Loader2, ArrowRight, ChevronDown, MoveLeft, Box, Cuboid, SortAsc, RefreshCw, Lightbulb, MousePointer2, ChevronRight, Gem, TrendingUp, Target, Divide, Layers, ArrowLeftRight } from 'lucide-react';
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

const CI_RATES_DATA = [
  { r: '10%', y2: '21%', y3: '33.1%', y4: '46.41%' },
  { r: '20%', y2: '44%', y3: '72.8%', y4: '107.36%' },
  { r: '5%', y2: '10.25%', y3: '15.76%', y4: '21.55%' },
  { r: '4%', y2: '8.16%', y3: '12.48%', y4: '16.98%' }
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

const GOLDEN_NUMBERS_DATA = [
  { num: 108, pairs: [[12,9], [27,4], [36,3], [18,6]] },
  { num: 144, pairs: [[12,12], [16,9], [18,8], [24,6], [36,4]] },
  { num: 180, pairs: [[12,15], [20,9], [45,4], [36,5]] },
  { num: 192, pairs: [[12,16], [24,8], [32,6], [64,3]] },
  { num: 216, pairs: [[6,6,6], [12,18], [24,9], [36,6]] },
  { num: 272, pairs: [[16,17], [34,8]] },
  { num: 224, pairs: [[16,14], [32,7]] },
  { num: 176, pairs: [[16,11], [22,8]] },
  { num: 315, pairs: [[15,21], [45,7], [35,9]] },
  { num: 208, pairs: [[16,13], [26,8], [52,4]] }
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
    title: "Consecutive Factors (Product → n * n+1)",
    type: "grid-simple",
    data: Array.from({length: 9}, (_, i) => {
      const n = i + 11;
      const prod = n * (n+1);
      return { q: `${prod}`, a: `${n}*${n+1}` };
    })
  },
  mensuration: {
    title: "Mensuration Formulas (2D & 3D)",
    type: "mensuration-list",
    data: MENSURATION_DATA
  },
  golden_numbers: {
    title: "Golden Numbers (Factors)",
    type: "golden-list",
    data: GOLDEN_NUMBERS_DATA
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
          { label: "The Trigger", desc: "See Distance? → DIVIDE (D/S or D/T). Missing Distance? → MULTIPLY (S×T)." }
        ]
      },
      {
         subtitle: "Boats & Streams",
         points: [
            { label: "Golden Shortcut", desc: "Round Trips? Distance = Total Time × (B² - S²) / 2B" },
            { label: "Option Attack", desc: "Don't solve quadratics. Plug options into B+S and B-S. Correct one divides Distance cleanly." },
            { label: "Speed Definitions", desc: "Down(D) = B+S. Up(U) = B-S. Boat = (D+U)/2. Stream = (D-U)/2." }
         ]
      },
      {
        subtitle: "Mixtures & Dishonest Shopkeeper",
        points: [
          { label: "Adulteration Logic", desc: "In mixture if water is added it is free so profit% = 20% = 1/5 → Water: 1, Milk: 5, Mixture: 6. Cost Price of Water is ₹0." },
          { label: "False Weight Rule", desc: "Assume ₹1 = 1gm. False weight is the CP and actual weight is the SP." },
          { label: "The Double Cheat (Markup + Weight)", desc: "Shopkeeper marks up 20% & uses 900gm for 1kg. Linear Line Trick: Left(CP) 900gm. Right(SP) 1200 (1000+20%). Gap=300. Profit = 33.33%." }
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
         subtitle: "Alphabet Series",
         points: [
            { label: "Speak and Seek", desc: "Don't convert to numbers. Recite alphabet while moving eye. Match = Pair." },
            { label: "The Gap Trick", desc: "Ignore letters that are neighbors in word (A,Z) but far in alphabet. Don't count dead ends." }
         ]
      },
      {
        subtitle: "Syllogism",
        points: [
          { label: "Stranger Territory", desc: "No touch + No Cross = Definite False, but Possibility True." },
          { label: "Only A Few", desc: "A→B: Restricted (Some A not B). B→A: Free (All B can be A)." },
          { label: "School Trap", desc: "If 'Only few A are B' & 'All B are C' → Can All A be C? YES." }
        ]
      },
      {
         subtitle: "Inequalities (Either/Or Rules)",
         points: [
           { label: "The Trigger (Step 1)", desc: "Check ONLY if: 1) Both elements same (A & B). 2) Both conclusions individually False/CND." },
           { label: "Case A: Established Relation", desc: "Statement A ≥ B → Need (>) and (=). Statement A ≤ B → Need (<) and (=)." },
           { label: "Case B: No Relation (Block)", desc: "Opposite signs (A > M < B) → Relation Unknown. Need ALL 3 symbols combined: (> & ≤) OR (< & ≥)." },
           { label: "The Missing Symbol Trap", desc: "If No Relation, having just (>) and (=) is NEITHER/NOR. You are missing (<)." }
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
          { label: "Direction (NEWS)", desc: "All faces outside: Clockwise is Right, Anti-clockwise is Left." },
          { label: "Circular Seating", desc: "Facing Inside: Anti-clockwise is Right. Facing Outside: Clockwise is Right." }
        ]
      },
      {
        subtitle: "Coding-Decoding (Vowels)",
        points: [
          { 
            label: "Vowel Center Logic", 
            desc: "Vowels (AEIOU) are always sandwiched between specific consonants. Z, D, H, N, T come before them (-1). B, F, J, P, V come after them (+1). Memorize these columns to instantly spot vowel-based patterns.",
            visual: (
              <div className="flex justify-center items-center gap-6 mt-4 font-mono select-none">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Before</span>
                  {['Z','D','H','N','T'].map(c => <span key={c} className="text-slate-500 font-bold text-lg bg-slate-100 w-8 h-8 flex items-center justify-center rounded border border-slate-200">{c}</span>)}
                </div>
                <div className="flex flex-col items-center gap-2 pt-6">
                   {Array(5).fill('→').map((a,i) => <span key={i} className="text-slate-300 h-8 flex items-center">{a}</span>)}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] uppercase text-indigo-500 tracking-wider font-extrabold">Vowel</span>
                  {['A','E','I','O','U'].map(c => <span key={c} className="text-white bg-indigo-600 font-extrabold text-xl w-10 h-10 flex items-center justify-center rounded-lg shadow-md border-b-4 border-indigo-800">{c}</span>)}
                </div>
                <div className="flex flex-col items-center gap-2 pt-6">
                   {Array(5).fill('←').map((a,i) => <span key={i} className="text-slate-300 h-8 flex items-center">{a}</span>)}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">After</span>
                  {['B','F','J','P','V'].map(c => <span key={c} className="text-slate-500 font-bold text-lg bg-slate-100 w-8 h-8 flex items-center justify-center rounded border border-slate-200">{c}</span>)}
                </div>
              </div>
            )
          }
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
        subtitle: "Mensuration",
        points: [
           { label: "Divisibility by 11", desc: "Volume/Area with π? Answer must be divisible by 11. (Sum Odd - Sum Even = 0 or 11)." },
           { label: "Mother Formula", desc: "Vol = Base Area × H. CSA = Base Perimeter × H. (Cylinder, Cube, Cuboid)." },
           { label: "Relation Tricks", desc: "Cone Vol = 1/3 Cylinder. Sphere Area = 4 Circles. Hemisphere TSA = 3 Circles." }
        ]
      },
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
  const [mode, setMode] = useState<'menu' | 'viral-menu' | 'alpha-menu' | 'tricks-sheet' | 'practice' | 'reference' | 'timer-selection' | 'pdf-upload' | 'pdf-config' | 'pdf-drill' | 'pdf-result' | 'mode-selection'>('menu');
  const [category, setCategory] = useState<string>('tables'); // General or Viral key
  const [subMode, setSubMode] = useState<'normal' | 'reverse'>('normal'); // For Squares/Cubes
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
        const sq = num * num;
        if (subMode === 'reverse') {
          q = `√${sq}`;
          a = num.toString();
        } else {
          q = `${num}²`;
          a = sq.toString();
        }
        break;
      }
      case 'cubes': {
        const num = Math.floor(Math.random() * 24) + 2; // 2 to 25
        const cb = num * num * num;
        if (subMode === 'reverse') {
          q = `∛${cb}`;
          a = num.toString();
        } else {
          q = `${num}³`;
          a = cb.toString();
        }
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
      case 'consecutive_mult': {
        const n = Math.floor(Math.random() * 9) + 11; // 11 to 19
        q = (n * (n+1)).toString();
        a = `${n}*${n+1}`;
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
      case 'golden_numbers': {
        // Missing Factor Logic
        const item = GOLDEN_NUMBERS_DATA[Math.floor(Math.random() * GOLDEN_NUMBERS_DATA.length)];
        const pair = item.pairs[Math.floor(Math.random() * item.pairs.length)];
        const hideIndex = Math.random() > 0.5 ? 0 : 1;
        const visible = pair[hideIndex === 0 ? 1 : 0];
        const hidden = pair[hideIndex];
        q = `${item.num} = ${visible} × ?`;
        a = hidden.toString();
        break;
      }
      case 'ci_rates': {
        // Pick a Rate
        const item = CI_RATES_DATA[Math.floor(Math.random() * CI_RATES_DATA.length)];
        // Pick a Year (2, 3, or 4)
        const years = [2, 3, 4];
        const selectedYear = years[Math.floor(Math.random() * years.length)];
        
        q = `Effective CI % for ${item.r} over ${selectedYear} Years?`;
        
        if (selectedYear === 2) a = item.y2;
        else if (selectedYear === 3) a = item.y3;
        else a = item.y4;

        // Generate distractors
        const others = CI_RATES_DATA.filter(x => x.r !== item.r);
        const distractors = others.slice(0, 3).map(o => {
             if (selectedYear === 2) return o.y2;
             if (selectedYear === 3) return o.y3;
             return o.y4;
        });
        const rawOptions = [a, ...distractors];
        opts = rawOptions.sort(() => 0.5 - Math.random());
        break;
      }
      case 'quadratic_blitz': {
        const type = Math.random();
        if (type < 0.4) {
          // CND Case (Both C negative)
          const c1 = Math.floor(Math.random() * 50) + 10;
          const c2 = Math.floor(Math.random() * 50) + 10;
          const b1 = Math.floor(Math.random()*10)+5;
          const b2 = Math.floor(Math.random()*10)+5;
          q = `I. 2x² + ${b1}x - ${c1} = 0   II. 3y² - ${b2}y - ${c2} = 0`;
          a = "CND";
        } else if (type < 0.7) {
          // X positive roots (from -,+ eq), Y negative roots (from +,+ eq) => X > Y
          // Eq I: (-, +) e.g. x^2 - 15x + 28 = 0
          // Eq II: (+, +) e.g. y^2 + 13y + 21 = 0
          q = `I. 2x² - 15x + 28 = 0   II. 2y² + 13y + 21 = 0`;
          a = "X > Y";
        } else {
          // X negative roots (from +,+ eq), Y positive roots (from -,+ eq) => X < Y
          q = `I. 3x² + 10x + 8 = 0   II. 2y² - 17y + 36 = 0`;
          a = "X < Y";
        }
        opts = ["X > Y", "X < Y", "X ≥ Y", "X ≤ Y", "CND"];
        break;
      }
      case 'unit_digit': {
        const mode = Math.random() > 0.5 ? 'mult' : 'mult_add';
        if (mode === 'mult') {
            const n1 = Math.floor(Math.random() * 900) + 100;
            const n2 = Math.floor(Math.random() * 900) + 100;
            const n3 = Math.floor(Math.random() * 900) + 100;
            q = `Unit digit of: ${n1} × ${n2} × ${n3}`;
            const u1 = n1 % 10;
            const u2 = n2 % 10;
            const u3 = n3 % 10;
            a = ((u1 * u2 * u3) % 10).toString();
        } else {
            const n1 = Math.floor(Math.random() * 900) + 100;
            const n2 = Math.floor(Math.random() * 900) + 100;
            const n3 = Math.floor(Math.random() * 900) + 100;
            q = `Unit digit of: ${n1} × ${n2} + ${n3}`;
            const u1 = n1 % 10;
            const u2 = n2 % 10;
            const u3 = n3 % 10;
            a = ((u1 * u2 + u3) % 10).toString();
        }
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
    const isOptionDrill = category === 'mensuration' || category === 'ci_rates' || category === 'quadratic_blitz';
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
      const cleanVal = val.trim().toLowerCase().replace(/x/g, '*');
      const cleanAns = question.answer.toLowerCase().replace(/x/g, '*');
      
      if (cleanVal === cleanAns) {
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
          { id: 'consecutive_mult', label: 'Consecutive Factors', icon: Layers, color: 'bg-cyan-500' },
          { id: 'quadratic_blitz', label: 'Quadratic Sign Blitz', icon: RefreshCw, color: 'bg-orange-500' },
          { id: 'unit_digit', label: 'Unit Digit Sniper', icon: Target, color: 'bg-pink-500' },
          { id: 'tables', label: 'Tables (1-20)', icon: Hash, color: 'bg-amber-500' },
          { id: 'golden_numbers', label: 'Golden Numbers', icon: Gem, color: 'bg-yellow-500' },
          { id: 'squares', label: 'Squares (1-50)', icon: Brain, color: 'bg-blue-500' },
          { id: 'cubes', label: 'Cubes (1-25)', icon: Brain, color: 'bg-indigo-500' },
          { id: 'ci_rates', label: 'CI Effective Rates', icon: TrendingUp, color: 'bg-green-500' },
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
                    } else if (item.id === 'squares' || item.id === 'cubes') {
                      setCategory(item.id);
                      setMode('mode-selection');
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

  const renderModeSelection = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4">
       <button onClick={() => setMode('menu')} className="mb-6 flex items-center text-slate-500 hover:text-indigo-600">
         <ChevronLeft size={20} /> Back to Menu
       </button>
       
       <div className="text-center mb-8">
         <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3 capitalize">
           <Brain className="text-indigo-500" size={32} />
           {category} Mastery
         </h2>
         <p className="text-slate-500">Choose your practice direction.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Normal Mode */}
         <div onClick={() => { setSubMode('normal'); setMode('timer-selection'); }} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-lg cursor-pointer transition-all group flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
              <Zap size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              {category === 'squares' ? 'Find Square' : 'Find Cube'}
            </h3>
            <p className="text-slate-500 text-base mb-6">
              {category === 'squares' ? '12² = ?' : '12³ = ?'}
            </p>
            <div className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">Select Normal Mode</div>
         </div>

         {/* Reverse Mode */}
         <div onClick={() => { setSubMode('reverse'); setMode('timer-selection'); }} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-lg cursor-pointer transition-all group flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              <ArrowLeftRight size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              {category === 'squares' ? 'Find Root' : 'Find Cube Root'}
            </h3>
            <p className="text-slate-500 text-base mb-6">
              {category === 'squares' ? '√144 = ?' : '∛1728 = ?'}
            </p>
            <div className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">Select Reverse Mode</div>
         </div>
       </div>
    </div>
  );

  const renderViralMenu = () => (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-right-4">
      <button onClick={() => setMode('menu')} className="mb-6 flex items-center text-slate-500 hover:text-indigo-600">
        <ChevronLeft size={20} /> Back to Menu
      </button>

      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-3">
          <Flame className="text-orange-500" size={40} fill="currentColor" />
          Viral Maths
        </h2>
        <p className="text-slate-500">Shortcuts that defy traditional methods.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(VIRAL_CONCEPTS).map(([key, data]) => (
          <div key={key} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all group">
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition-colors">{data.title}</h3>
            <p className="text-sm text-slate-500 mb-6 min-h-[40px]">{data.description}</p>
            
            <div className="space-y-3 mb-6">
               {data.tricks.slice(0, 2).map((trick, i) => (
                 <div key={i} className="bg-orange-50 p-3 rounded-lg text-xs">
                   <span className="font-bold text-orange-800 block mb-1">{trick.name}</span>
                   <span className="text-orange-700 opacity-80">{trick.logic}</span>
                 </div>
               ))}
            </div>

            <button 
              onClick={() => { setCategory(key); setMode('timer-selection'); }}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2"
            >
              <Zap size={18} /> Practice
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlphaMenu = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4">
      <button onClick={() => setMode('menu')} className="mb-6 flex items-center text-slate-500 hover:text-emerald-600">
        <ChevronLeft size={20} /> Back to Menu
      </button>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-3">
          <Eye className="text-emerald-500" size={40} />
          Alphabet Mastery
        </h2>
        <p className="text-slate-500">Essential for Reasoning (Coding-Decoding, Series)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div onClick={() => initGameSetup('alpha_rank')} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-400 cursor-pointer group hover:shadow-lg transition-all text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 group-hover:scale-110 transition-transform">
               <span className="text-2xl font-bold">#</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Positions</h3>
            <p className="text-sm text-slate-500">A = 1, Z = 26</p>
         </div>

         <div onClick={() => initGameSetup('alpha_pair')} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-400 cursor-pointer group hover:shadow-lg transition-all text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 group-hover:scale-110 transition-transform">
               <ArrowLeftRight size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Opposites</h3>
            <p className="text-sm text-slate-500">A ↔ Z, B ↔ Y</p>
         </div>

         <div onClick={() => initGameSetup('alpha')} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-400 cursor-pointer group hover:shadow-lg transition-all text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 group-hover:scale-110 transition-transform">
               <RefreshCcw size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Mixed Bag</h3>
            <p className="text-sm text-slate-500">Random drill</p>
         </div>
      </div>
      
      <div className="mt-8 flex justify-center">
         <button onClick={() => { setCategory('alpha'); setMode('reference'); }} className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">
            <Book size={18} /> View Cheatsheet
         </button>
      </div>
    </div>
  );

  const renderTricksSheet = () => (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8">
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/95 backdrop-blur-sm py-4 z-20 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button onClick={() => setMode('menu')} className="bg-white p-2 rounded-full shadow-sm border border-slate-200 hover:bg-slate-100">
            <ChevronLeft size={24} className="text-slate-600" />
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Topper's Cheat Sheet</h2>
        </div>
      </div>

      <div className="space-y-8 pb-12">
        {CHEAT_SHEET_DATA.map((section, idx) => {
           const Icon = section.icon;
           return (
             <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
               <div className={`flex items-center gap-4 mb-8 pb-4 border-b border-slate-100`}>
                  <div className={`p-3 rounded-2xl bg-${section.color}-100 text-${section.color}-600`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">{section.title}</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {section.sections.map((sub, sIdx) => (
                   <div key={sIdx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-indigo-100 transition-colors">
                     <h4 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                       {sub.subtitle}
                     </h4>
                     <ul className="space-y-4">
                       {sub.points.map((pt: any, pIdx) => (
                         <li key={pIdx}>
                           <span className="block font-bold text-slate-800 text-sm mb-1">{pt.label}</span>
                           <span className="block text-slate-600 text-sm leading-relaxed">{pt.desc}</span>
                           {pt.visual && <div className="mt-2">{pt.visual}</div>}
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

  const renderReference = () => {
    // Standard Concepts Reference
    const data = STANDARD_CONCEPTS[category as keyof typeof STANDARD_CONCEPTS];
    if (!data) return <div className="p-8 text-center text-slate-500">No reference data available.</div>;

    return (
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-right-4">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setMode('menu')} className="flex items-center text-slate-500 hover:text-indigo-600">
            <ChevronLeft size={20} /> Back to Menu
          </button>
          <button onClick={() => initGameSetup(category)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-md flex items-center gap-2">
             <Zap size={18} /> Practice This
          </button>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{data.title}</h2>
          <p className="text-slate-500">Review before you practice.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {data.type === 'grid-card' && (
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 divide-x divide-y divide-slate-100">
               {(data.data as any[]).map((item: any, i: number) => (
                 <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                   <div className="text-2xl font-bold text-indigo-600 mb-2 text-center bg-indigo-50 rounded-lg py-1">{item.label}</div>
                   <div className="space-y-1 text-center text-xs text-slate-600 font-mono">
                      {item.values.slice(0, 5).map((v: string, idx: number) => <div key={idx}>{v}</div>)}
                      <div className="text-slate-400 text-[10px] italic">...and so on</div>
                   </div>
                 </div>
               ))}
             </div>
          )}

          {data.type === 'grid-simple' && (
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 p-1 bg-slate-100">
               {(data.data as any[]).map((item: any, i: number) => (
                 <div key={i} className="bg-white p-4 flex flex-col items-center justify-center aspect-square rounded-lg hover:shadow-md transition-shadow">
                    <div className="text-slate-500 text-sm mb-1">{item.q}</div>
                    <div className="text-2xl font-bold text-slate-800">{item.a}</div>
                 </div>
               ))}
             </div>
          )}
          
          {data.type === 'grid-table' && (
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                     <th className="p-4 font-bold text-slate-600">Fraction</th>
                     <th className="p-4 font-bold text-slate-600">Percentage</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {(data.data as any[]).map((row: any, i: number) => (
                     <tr key={i} className="hover:bg-slate-50">
                       <td className="p-4 font-mono font-bold text-indigo-600 text-lg">{row.f}</td>
                       <td className="p-4 font-bold text-slate-800 text-lg">{row.p}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          )}
          
          {data.type === 'custom-alpha' && (
            <div className="p-8 space-y-8">
               <div className="grid grid-cols-4 md:grid-cols-9 gap-2">
                  {(data.data as any).forward.map((item: any, i: number) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                       <div className="text-2xl font-bold text-slate-800">{item.char}</div>
                       <div className="text-xs font-bold text-indigo-500">{item.val}</div>
                    </div>
                  ))}
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                    <h3 className="font-bold text-indigo-800 mb-4 flex items-center gap-2"><Lightbulb size={18}/> Mnemonics for Ranks</h3>
                    <ul className="space-y-3">
                       {(data.data as any).mnemonics.map((m: any, i: number) => (
                         <li key={i} className="flex justify-between border-b border-indigo-100 pb-2">
                           <span className="font-bold text-indigo-900">{m.code}</span>
                           <span className="font-mono text-indigo-700">{m.val}</span>
                         </li>
                       ))}
                    </ul>
                 </div>
                 
                 <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                    <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2"><ArrowLeftRight size={18}/> Opposite Pairs (Sum 27)</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                       {(data.data as any).opposites_list.map((o: any, i: number) => (
                         <div key={i} className="flex justify-between text-sm">
                           <span className="font-bold text-emerald-900">{o.pair}</span>
                           <span className="text-emerald-700 italic">{o.mnemonic}</span>
                         </div>
                       ))}
                    </div>
                 </div>
               </div>
            </div>
          )}
          
          {data.type === 'ci-table' && (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-4 font-bold text-slate-600">Rate %</th>
                      <th className="p-4 font-bold text-slate-600">2 Years (Eff %)</th>
                      <th className="p-4 font-bold text-slate-600">3 Years (Eff %)</th>
                      <th className="p-4 font-bold text-slate-600">4 Years (Eff %)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(data.data as any[]).map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-indigo-600">{row.r}</td>
                        <td className="p-4 font-mono text-slate-700">{row.y2}</td>
                        <td className="p-4 font-mono text-slate-700">{row.y3}</td>
                        <td className="p-4 font-mono text-slate-700">{row.y4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}
          
          {data.type === 'mensuration-list' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
               <div className="p-6">
                 <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-4">2D Formulas</h3>
                 <div className="space-y-3">
                   {(data.data as any[]).filter((x: any) => x.type === '2D').map((item: any, i: number) => (
                     <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-bold text-slate-800">{item.shape}</div>
                          <div className="text-xs text-slate-500">{item.param}</div>
                        </div>
                        <div className="font-mono font-bold text-indigo-600 text-lg">{item.formula}</div>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="p-6">
                 <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-4">3D Formulas</h3>
                 <div className="space-y-3">
                   {(data.data as any[]).filter((x: any) => x.type === '3D').map((item: any, i: number) => (
                     <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-bold text-slate-800">{item.shape}</div>
                          <div className="text-xs text-slate-500">{item.param}</div>
                        </div>
                        <div className="font-mono font-bold text-emerald-600 text-lg">{item.formula}</div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          )}
          
          {data.type === 'golden-list' && (
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(data.data as any[]).map((item: any, i: number) => (
                   <div key={i} className="bg-amber-50 rounded-xl p-5 border border-amber-100 text-center">
                      <div className="text-4xl font-extrabold text-amber-600 mb-4">{item.num}</div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {item.pairs.map((p: number[], idx: number) => (
                          <span key={idx} className="bg-white px-3 py-1 rounded-full text-sm font-bold text-slate-700 shadow-sm border border-amber-100">
                            {p.join(' × ')}
                          </span>
                        ))}
                      </div>
                   </div>
                ))}
             </div>
          )}

        </div>
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
           } else if (category === 'squares' || category === 'cubes') {
             setMode('mode-selection');
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
    else if (['alpha', 'alpha_rank', 'alpha_pair', 'golden_numbers', 'ci_rates', 'quadratic_blitz', 'unit_digit'].includes(category) && question.text.length > 5) fontSizeClass = 'text-3xl md:text-4xl font-mono'; // Smaller for text/complex questions

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
                 category === 'golden_numbers' ? 'Find the Factor' :
                 category === 'ci_rates' ? 'Compound Interest' :
                 category === 'quadratic_blitz' ? 'Sign Method Blitz' :
                 category === 'unit_digit' ? 'Unit Digit Sniper' :
                 category === 'consecutive_mult' ? 'Consecutive Mult (n × n+1)' :
                 'Solve Fast'}
              </div>
              <div className={`font-bold text-slate-800 transition-transform duration-100 whitespace-pre-line ${feedback === 'correct' ? 'scale-110 text-green-600' : ''} ${fontSizeClass}`}>
                {question.text}
              </div>
            </div>

            {question.options ? (
               // Multiple Choice Interface
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
      {mode === 'mode-selection' && renderModeSelection()}
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
