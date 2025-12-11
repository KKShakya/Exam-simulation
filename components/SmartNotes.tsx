
import React, { useState, useEffect } from 'react';
import { Plus, Save, FileText, Sparkles, Trash2, Calendar, Search, Copy, Maximize2, Minimize2 } from 'lucide-react';
import { Note } from '../types';
import { analyzeUserNote } from '../services/geminiService';

const SmartNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Define the Inequality Note Content
  const inequalityNoteContent = `⚖️ Inequality: The "Either/Or" Master Rules

Don't guess. Use this 3-step verification process to spot a valid **Either/Or** case instantly.

🕵️ Step 1: The Trigger (Scan Options)

Before checking the statement, look at the conclusions. The **Either/Or** check is triggered ONLY if:

1.  Both elements are the same** in both conclusions (e.g., A and B).
2.  Both conclusions are Individually False (or cannot be determined) based on the statement.

-----

Step 2: Identify the Case Type

Once Step 1 is cleared, check which of the two scenarios applies:

Case A: The "Established Relation" (The Combo Sign)**

  * The Scenario:** The statement establishes a clear combined relationship like A ≥ B or A ≤ B.
  * The Rule:** The two conclusions must break this relationship into its two individual parts.
  * Required Pairs:**
      * Statement:** A ≥ B -> **Conclusions:** (A > B) and (A = B)
      * Statement:** A ≤ B -> **Conclusions:** (A < B) and (A = B)

Logic: Since A is greater than or equal to B, it must be one or the other. It cannot be neither.


Case B: The "No Relation" (The Blocked Path)**

  * The Scenario:** The statement contains **Opposite Signs** between the elements (e.g., A > M < B or A ≥ P ≤ B). This means the relationship is **Unknown**.
  * The Rule:** When the relationship is unknown, *anything* is possible. Therefore, your conclusions must cover **all three possible symbols** (>, <, and =) combined.
  * Required Pairs:**
    1. Conc 1: A > B  |  Conc 2: A ≤ B (Covers >, <, =)
    2. Conc 1: A < B  |  Conc 2: A ≥ B (Covers <, >, =)
    3. Conc 1: A = B  |  Conc 2: A ≠ B (Covers =, >, <)

Logic: Since we don't know the relationship, A could be bigger, smaller, or equal. If the options cover all 3 possibilities, one of them *must* be true.

--------------------------------

⚠️ Common Traps (Don't Be Fooled)

1. The "Only One True" Trap**
If the Statement is A ≥ B:

  * Conc 1:** A ≥ B (True)
  * Conc 2:** A = B (False/Possible)
  * Result:** This is **Only Conclusion 1 Follows**, NOT Either/Or.
  * Why? For Either/Or, **BOTH** conclusions must be individually False/Uncertain first.

**2. The "Missing Symbol" Trap (No Relation Case)**
If the Statement has **No Relation** (Opposite Signs):

  * Conc 1: A > B
  * Conc 2: A = B
  * Result: **Neither/Nor**.
  * Why? You are missing the (<) possibility. Since "No Relation" means *anything* is possible, A could be smaller than B. Since that option isn't listed, it's not a perfect Either/Or pair.

-----

🚀 Summary Cheat Sheet

| Condition | Statement Type | Required Conclusions |
| :--- | :--- | :--- |
| Case 1 | A ≥ B | (>) and (=) |
| Case 1 | A ≤ B | (<) and (=) |
| Case 2 | **No Relation** (Opposite Signs) | Must cover all 3 signs combined: (> & ≤) OR (< & ≥) |`;

  // Define the Golden Numbers Note Content
  const goldenNumbersNoteContent = `🏆 The "Golden Numbers" Cheat Sheet

Memorize these numbers. They appear frequently because they have many factors, allowing you to reverse-engineer calculations.

### 1. The "Golden Numbers" (Factors & Equivalencies)

| Number | Primary Breakdown | Other Factors (The Logic) |
| :--- | :--- | :--- |
| **108** | 12 x 9 | 27 x 4 | 36 x 3 | 18 x 6 |
| **144** | 12² | 16 x 9 | 18 x 8 | 24 x 6 | 36 x 4 |
| **180** | 12 x 15 | 20 x 9 | 45 x 4 | 36 x 5 |
| **192** | 12 x 16 | 24 x 8 | 32 x 6 | 64 x 3 |
| **216** | 6³ | 12 x 18 | 24 x 9 | 36 x 6 |
| **272** | 16 x 17 | 34 x 8 | (Consecutive Logic) |
| **224** | 16 x 14 | 32 x 7 | (7 Multiple) |
| **176** | 16 x 11 | 22 x 8 | (11 Rule) |
| **315** | 15 x 21 | 45 x 7 | 35 x 9 |
| **208** | 16 x 13 | 26 x 8 | 52 x 4 |

---

### 2. Speed Multipliers (Mental Math Strategy)

**A. The "Consecutive" Logic (n * (n+1))**
* 12 x 13 = 156
* 14 x 15 = 210
* 15 x 16 = 240
* 16 x 17 = 272
* 17 x 18 = 306
* 18 x 19 = 342

**B. The "Split & Merge" Logic**
* 12 x 18 = 216 (Think: 18x10 + 18x2)
* 13 x 14 = 182
* 14 x 28 = 392 (Think: 14x14x2 -> 196x2)
* 15 x 18 = 270 (Think: 18x1.5x10)

**C. The "25" Rule (Divide by 4, x100)**
* 24 x 25 = 600 (Think: 24/4 = 6)
* 12 x 25 = 300
* 16 x 25 = 400
* 18 x 25 = 450 (Think: 18/2 = 9 -> 9x50)

**D. The "7" Multiples (Mensuration)**
* 15 x 7 = 105
* 21 x 7 = 147
* 27 x 7 = 189
* 32 x 7 = 224

---

### 3. High-Frequency Squares & Cubes (From PDF)

**Squares:**
* 784 (28²)
* 841 (29²)
* 961 (31²)
* 1024 (32²)
* 1156 (34²)
* 1296 (36²)
* 1369 (37²)
* 1444 (38²)
* 1521 (39²)
* 2209 (47²)
* 2304 (48²)
* 4489 (67²)

**Cubes:**
* 1331 (11³)
* 1728 (12³)
* 2197 (13³)
* 3375 (15³)
* 4096 (16³)
* 4913 (17³)
* 5832 (18³)
* 6859 (19³)

**Percentages:**
* 12.5% = 1/8
* 37.5% = 3/8
* 62.5% = 5/8
* 87.5% = 7/8`;

  // Load from Local Storage on Mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('bankedge_notes');
    
    const inequalityNote: Note = {
      id: 'inequality-master-rules',
      title: '⚖️ Inequality: The Either/Or Master Rules',
      content: inequalityNoteContent,
      date: Date.now(),
      tags: ['Reasoning', 'Inequality', 'Rules']
    };

    const goldenNote: Note = {
      id: 'golden-numbers-cheat',
      title: '🏆 Golden Numbers & Speed Multipliers',
      content: goldenNumbersNoteContent,
      date: Date.now(),
      tags: ['Quant', 'Calculation', 'Factors']
    };

    if (savedNotes) {
      const parsed: Note[] = JSON.parse(savedNotes);
      let updatedNotes = [...parsed];
      let changed = false;

      // Check if inequality note exists
      if (!parsed.some(n => n.id === inequalityNote.id || n.title === inequalityNote.title)) {
        updatedNotes = [inequalityNote, ...updatedNotes];
        changed = true;
      }

      // Check if golden numbers note exists
      if (!parsed.some(n => n.id === goldenNote.id || n.title === goldenNote.title)) {
        updatedNotes = [goldenNote, ...updatedNotes];
        changed = true;
      }
      
      if (changed) {
        setNotes(updatedNotes);
        // Set active note to the golden note if it was just added, or the first one
        setActiveNoteId(goldenNote.id);
      } else {
        setNotes(parsed);
        if (parsed.length > 0 && !activeNoteId) setActiveNoteId(parsed[0].id);
      }
    } else {
      // Default notes if storage is empty
      const defaultNote: Note = { 
        id: '1', 
        title: 'Percentage to Fraction Tricks', 
        content: '33.33% = 1/3\n16.66% = 1/6\n14.28% = 1/7\n\nRemember: To find 14.28% of 49, just divide by 7 = 7.', 
        date: Date.now(), 
        tags: ['Quant', 'Tricks'] 
      };
      
      const initialNotes = [goldenNote, inequalityNote, defaultNote];
      setNotes(initialNotes);
      setActiveNoteId(goldenNote.id);
    }
  }, []);

  // Save to Local Storage on Change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('bankedge_notes', JSON.stringify(notes));
    }
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      date: Date.now(),
      tags: []
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setAnalysisResult('');
    if (window.innerWidth < 768) {
      setIsExpanded(true); // Auto expand on mobile for new notes
    }
  };

  const updateNote = (field: keyof Note, value: string) => {
    setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, [field]: value, date: Date.now() } : n));
  };

  const handleDelete = (id: string) => {
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (activeNoteId === id && newNotes.length > 0) {
      setActiveNoteId(newNotes[0].id);
    } else if (newNotes.length === 0) {
      setActiveNoteId(null);
    }
  };

  const handleAnalyze = async (action: 'summarize' | 'formulas' | 'quiz') => {
    if (!activeNote) return;
    setIsAnalyzing(true);
    setAnalysisResult('');
    const result = await analyzeUserNote(activeNote.content, action);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in">
      {/* Sidebar List (Updated to Golden Card Style) */}
      <div className={`
        ${isExpanded ? 'hidden' : 'w-1/3'} 
        bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden transition-all
      `}>
        <div className="p-6 border-b border-white/40 bg-gradient-to-br from-white/80 via-indigo-50/50 to-purple-50/50 backdrop-blur-xl space-y-4">
           <div className="flex justify-between items-center">
             <h2 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-3">
               <div className="p-2.5 bg-white rounded-xl shadow-sm border border-indigo-50">
                  <FileText className="text-indigo-600" size={20} />
               </div>
               My Notes
             </h2>
             <button 
               onClick={handleNewNote}
               className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-95"
             >
               <Plus size={18} />
             </button>
           </div>
           <div className="relative group">
             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
             <input 
               type="text" 
               placeholder="Search notes..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/60 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 outline-none transition-all shadow-sm focus:bg-white placeholder:text-slate-400"
             />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {filteredNotes.map(note => (
            <div 
              key={note.id}
              onClick={() => { setActiveNoteId(note.id); setAnalysisResult(''); }}
              className={`p-4 rounded-xl cursor-pointer transition-all group relative border ${
                activeNoteId === note.id 
                  ? 'bg-amber-50 border-amber-200 shadow-md ring-1 ring-amber-100' 
                  : 'bg-white border-slate-200 hover:border-amber-100 hover:bg-amber-50/30 hover:shadow-sm'
              }`}
            >
              <div className={`font-bold text-md mb-2 pr-6 truncate ${activeNoteId === note.id ? 'text-amber-800' : 'text-slate-800'}`}>{note.title}</div>
              <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{note.content || "Empty note..."}</div>
              <div className="flex items-center justify-between mt-2">
                 <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                    <Calendar size={12} />
                    {new Date(note.date).toLocaleDateString()}
                 </div>
                 {/* Simulate 'Golden View' factor chips if tags exist, else generic */}
                 <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                 </div>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                className="absolute top-3 right-3 p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col gap-4">
        {activeNote ? (
          <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col">
              {/* Note Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
                <input 
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateNote('title', e.target.value)}
                  className="text-3xl font-bold text-slate-800 outline-none placeholder-slate-300 flex-1 bg-transparent"
                  placeholder="Note Title"
                />
                <div className="flex items-center gap-3">
                   <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                      <Calendar size={12} /> {new Date(activeNote.date).toLocaleDateString()}
                   </span>
                   <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    title={isExpanded ? "Collapse View" : "Expand View"}
                  >
                    {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </button>
                </div>
              </div>
              
              <textarea 
                value={activeNote.content}
                onChange={(e) => updateNote('content', e.target.value)}
                className="flex-1 w-full resize-none outline-none text-slate-600 leading-relaxed text-lg font-mono bg-transparent placeholder-slate-300"
                placeholder="Start typing your notes here... Paste from websites, type formulas, or draft strategies."
              />
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-sm text-slate-400">
                 <span>{activeNote.content.length} characters</span>
                 <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 hover:text-indigo-600 cursor-default"><Save size={14} /> Auto-saved to Local</button>
                 </div>
              </div>
            </div>

            {/* AI Analysis Tool */}
            <div className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 min-h-[150px] ${isExpanded ? 'hidden' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                 <h3 className="font-bold text-slate-700 flex items-center gap-2">
                   <Sparkles className="text-amber-500" size={18} /> AI Insights
                 </h3>
                 <div className="flex gap-2">
                   <button onClick={() => handleAnalyze('summarize')} disabled={isAnalyzing} className="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100">Summarize</button>
                   <button onClick={() => handleAnalyze('formulas')} disabled={isAnalyzing} className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100">Find Formulas</button>
                   <button onClick={() => handleAnalyze('quiz')} disabled={isAnalyzing} className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-600 rounded hover:bg-purple-100">Create Quiz</button>
                 </div>
              </div>
              
              {isAnalyzing ? (
                <div className="h-24 flex items-center justify-center text-slate-400 text-sm animate-pulse">
                   Analyzing your note...
                </div>
              ) : analysisResult ? (
                <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-100 max-h-60 overflow-y-auto">
                  {analysisResult}
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center text-slate-400 text-sm italic">
                  Select an AI tool above to analyze this note.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center flex-col text-slate-400">
             <FileText size={48} className="mb-4 opacity-20" />
             <p>Select or create a note to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartNotes;
