
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

    if (savedNotes) {
      const parsed: Note[] = JSON.parse(savedNotes);
      
      // Check if the inequality note already exists (by ID or Title) to prevent duplicates
      const exists = parsed.some(n => n.id === inequalityNote.id || n.title === inequalityNote.title);
      
      if (!exists) {
        // Inject the new note at the top if it doesn't exist
        const updatedNotes = [inequalityNote, ...parsed];
        setNotes(updatedNotes);
        setActiveNoteId(inequalityNote.id);
      } else {
        setNotes(parsed);
        if (parsed.length > 0) setActiveNoteId(parsed[0].id);
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
      
      const initialNotes = [inequalityNote, defaultNote];
      setNotes(initialNotes);
      setActiveNoteId(inequalityNote.id);
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
      {/* Sidebar List */}
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
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredNotes.map(note => (
            <div 
              key={note.id}
              onClick={() => { setActiveNoteId(note.id); setAnalysisResult(''); }}
              className={`p-3 rounded-lg cursor-pointer transition-all group relative ${
                activeNoteId === note.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="font-semibold text-slate-800 text-sm mb-1 pr-6 truncate">{note.title}</div>
              <div className="text-xs text-slate-500 line-clamp-2">{note.content || "Empty note..."}</div>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                <Calendar size={12} />
                {new Date(note.date).toLocaleDateString()}
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
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
