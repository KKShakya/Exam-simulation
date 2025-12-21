
import React, { useState, useEffect } from 'react';
import { Plus, Save, FileText, Sparkles, Trash2, Calendar, Search, Copy, Maximize2, Minimize2, ChevronLeft } from 'lucide-react';
import { Note } from '../types';
import { analyzeUserNote } from '../services/geminiService';

const SmartNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // --- MASTER CONTENT (VERBATIM) ---

  const bankingArticleContent = `This is a comprehensive, verified, and logically categorized compilation of **all data** extracted from Documents 7 through 42.

I have organized this into **8 Master Modules** covering the entire Banking Awareness syllabus found in your files. The data has been cross-verified for accuracy (e.g., updating the Payments Bank limit to ₹2 Lakhs) and structured for exam memorization.

---

### **MODULE 1: RESERVE BANK OF INDIA (The Regulator)**

**1. History & Foundation**

* **Recommendation:** Hilton Young Commission (Royal Commission) in **1926**.
* **Act:** RBI Act, **1934**.
* **Establishment:** **April 1, 1935** (Started as a private entity with ₹5 Crore capital).
* **Headquarters:** Moved from Kolkata to **Mumbai** in **1937**.
* **Nationalization:** **January 1, 1949** (Became Govt owned).
* **Key Governors:**
* 1st Governor: **Sir Osborne Smith**.
* 1st Indian Governor: **C.D. Deshmukh**.



**2. Organizational Structure**

* **Central Board:** **21 Members**.
* 1 Governor + 4 Deputy Governors.
* 4 Local Board Directors (Mumbai, Kolkata, Chennai, New Delhi).
* 10 Government Nominees.
* 2 Finance Ministry Officials.



**3. Currency Management**

* **Legal Right:** **Section 22** of RBI Act gives sole right to issue notes.
* **System Used:** **Minimum Reserve System (MRS)** (Adopted 1957).
* **Minimum Assets:** **₹200 Crore**.
* **Breakdown:** Must hold at least **₹115 Crore in Gold** and **₹85 Crore in Foreign Exchange**.


* **Denominations:** RBI can print up to **₹10,000** notes (per Section 24).
* **Languages on Note:** **17** total (2 on front: Hindi/English + 15 on the reverse panel).

**4. Subsidiaries of RBI**

* **Fully Owned:**
1. **DICGC:** Deposit Insurance and Credit Guarantee Corporation.
2. **BRBNMPL:** Bharatiya Reserve Bank Note Mudran Private Limited.
3. **ReBIT:** Reserve Bank Information Technology Pvt Ltd.
4. **IFTAS:** Indian Financial Technology and Allied Services.
5. **RBIH:** Reserve Bank Innovation Hub (CEO: Rajesh Bansal).


* *Note:* **NHB** (National Housing Bank) is **NO LONGER** a subsidiary (Now 100% Govt owned).
* **Associate:** **NCFE** (National Centre for Financial Education) - Section 8 company (30% stake by RBI).

---

### **MODULE 2: MONETARY POLICY (Inflation Control)**

**1. The Framework**

* **MPC (Monetary Policy Committee):** Constituted under **Section 45ZB** of RBI Act.
* **Members:** **6** (3 RBI + 3 Govt Nominees).
* **Quorum:** 4 Members.
* **Goal:** Maintain Price Stability + Growth.



**2. Direct Instruments (Reserve Ratios)**

* **CRR (Cash Reserve Ratio):**
* **Act:** **Section 42(1)** of RBI Act, 1934.
* **Details:** Portion of NDTL kept with RBI in **CASH**. No interest paid.


* **SLR (Statutory Liquidity Ratio):**
* **Act:** **Section 24** of Banking Regulation Act, 1949.
* **Details:** Portion kept with Bank itself in **Liquid Assets** (Gold, Cash, Govt Securities). **Equity shares are NOT allowed.**



**3. Indirect Instruments (LAF - Liquidity Adjustment Facility)**

* **Repo Rate:** Rate at which RBI **Lends** to banks (Short term). Higher Repo = Less Liquidity (Anti-Inflation).
* **Reverse Repo Rate:** Rate at which RBI **Borrows** (Absorbs liquidity) from banks.
* **MSF (Marginal Standing Facility):** Emergency overnight borrowing for banks using SLR quota (up to a limit). Penal rate > Repo.
* **SDF (Standing Deposit Facility):** Tool to absorb liquidity *without* RBI giving collateral.
* **OMO (Open Market Operations):** Buying/Selling G-Secs to control long-term liquidity.

---

### **MODULE 3: BANKING STRUCTURE & HISTORY**

**1. Banking History**

* **Imperial Bank of India (1921):** Formed by merging Bank of Bengal, Bombay, and Madras. Renamed **State Bank of India (SBI)** on **July 1, 1955** (Gorwala Committee).
* **Nationalization Waves:**
* **1969:** 14 Banks (Deposits > ₹50 Cr).
* **1980:** 6 Banks (Deposits > ₹200 Cr).
* **First Merger:** PNB + New Bank of India (**1993**).



**2. Types of Banks**

* **Scheduled Banks:** Listed in **2nd Schedule** of RBI Act, 1934 (Paid-up capital > ₹5 Lakh).
* **RRBs (Regional Rural Banks):**
* **Est:** **Oct 2, 1975** (First: Prathama Grameen Bank).
* **Committee:** **Narasimham Committee**.
* **Ownership:** Central Govt (**50%**) : Sponsor Bank (**35%**) : State Govt (**15%**).
* **Regulation:** Regulated by RBI, Supervised by **NABARD**.


* **Cooperative Banks:** Registered under **Co-operative Societies Act 1912**. Works on "No Profit, No Loss".

**3. Differentiated Banks**

* **Payments Banks:**
* **Committee:** **Nachiket Mor**.
* **Limit:** Max Deposit **₹2 Lakh** per customer.
* **Restriction:** **Cannot Lend** (No Loans/Credit Cards).
* **Example:** Airtel Payments Bank (First), IPPB.


* **Small Finance Banks (SFB):**
* **Committee:** **Usha Thorat**.
* **PSL Target:** **75%** of loans must go to Priority Sector.
* **Capital:** Min **₹200 Cr**. Can lend and accept deposits.



---

### **MODULE 4: FINANCIAL MARKETS & INSTRUMENTS**

**1. Market Types**

* **Money Market:** Short Term (< 1 Year). Regulated by **RBI**.
* **Call Money:** 1 Day (Overnight).
* **Notice Money:** 2-14 Days.
* **Term Money:** 15 Days - 1 Year.


* **Capital Market:** Long Term (> 1 Year). Regulated by **SEBI**.
* **Primary:** IPOs.
* **Secondary:** Stock Exchange.



**2. Money Market Instruments**

* **Treasury Bills (T-Bills):** Issued by **Govt**. Tenures: **91, 182, 364 days**. Min Amount: **₹25,000**.
* **Cash Management Bills (CMB):** Issued by Govt for < 91 days (Temporary cash flow).
* **Commercial Paper (CP):** Issued by **Corporates**. Unsecured. Min Amount: **₹5 Lakh**.
* **Certificate of Deposit (CD):** Issued by **Banks**. Min Amount: **₹5 Lakh**.

**3. Stock Exchanges**

* **BSE (Bombay Stock Exchange):** Est **1875** (Asia's Oldest). Index: **Sensex** (30 companies).
* **NSE (National Stock Exchange):** Est **1992**. Index: **Nifty** (50 companies).
* **Depositories:**
* **CDSL:** Promoted by BSE.
* **NSDL:** Promoted by NSE/IDBI.



---

### **MODULE 5: BANKING OPERATIONS & TECHNOLOGY**

**1. Accounts**

* **CASA:** Current & Savings (Low interest). Interest calculated on **Daily Product Basis**.
* **RAFA:** Recurring & Fixed (Term deposits). **Min RD tenure:** 6 Months, **Max:** 10 Years.
* **BSBDA:** Basic Savings (No minimum balance). Max Credit ₹1L/year. Max 4 withdrawals/month. Replaced "No-Frills".

**2. Cheques**

* **CTS (Cheque Truncation System):** Introduced **2010**. Stops physical movement of cheques (scanned images used).
* **Validity:** **3 Months** from date of issue.
* **Types:** Bearer (Risky/Self), Crossed (Account only), Stale (Expired).

**3. ATM Types**

* **White Label:** Owned by **Non-Banks** (NBFCs like Tata Indicash).
* **Brown Label:** Hardware by Service Provider, Cash/Network by **Bank**.
* **Green Label:** Agri-transactions.
* **Pink Label:** Women banking.

**4. NPCI (The Umbrella)**

* **Est:** **2008**.
* **Act:** Section 8 of Companies Act 2013 (Not-for-Profit).
* **Products:** UPI (2016), IMPS (2010), BBPS, RuPay, NACH.

---

### **MODULE 6: FINANCIAL INCLUSION & SCHEMES**

**1. The Trinity (Jan Dhan)**

* **PMJDY:** Launched **Aug 28, 2014**.
* **Overdraft:** **₹10,000**.
* **Accident Cover:** **₹2 Lakh** (RuPay Card).
* **Life Cover:** ₹30,000.



**2. Social Security (2015)**

* **PMSBY (Accident):** Premium **₹20/year**. Cover **₹2 Lakh**. Age: **18-70**.
* **PMJJBY (Life):** Premium **₹436/year**. Cover **₹2 Lakh**. Age: **18-50**.
* **APY (Pension):** Age **18-40**. Pension ₹1k-5k/month after 60.

**3. MUDRA Yojana (2015)**

* **Shishu:** Up to ₹50,000.
* **Kishore:** ₹50,000 to ₹5 Lakh.
* **Tarun:** ₹5 Lakh to ₹10 Lakh.

**4. Small Savings**

* **PPF (1968):** Min ₹500, Max ₹1.5L. Tenure **15 Years**. EEE Tax benefit.
* **KVP (Kisan Vikas Patra):** Doubles money in **115 Months**. Min ₹1000. Taxable.
* **Sukanya Samriddhi:** Girl child (<10 yrs). Maturity 21 Years.

---

### **MODULE 7: INTERNATIONAL & BUDGET**

**1. World Bank Group (HQ: Washington DC)**

* **IBRD:** Loans to Govts (India is member).
* **IFC:** Private Sector investment (India is member).
* **IDA:** Soft Loans (Poorest countries) (India is member).
* **MIGA:** Political Risk Insurance (India is member).
* **ICSID:** Investment Disputes (**India is NOT a member**).

**2. Union Budget**

* **First Budget:** James Wilson (1860). Independent India: R.K. Shanmugham Chetty (1947).
* **Merger:** Railway Budget merged with Union Budget in **2017**.
* **Funds (Constitution):**
* **Consolidated Fund (Art 266-1):** All revenue/expense. Needs Parliament approval.
* **Contingency Fund (Art 267-1):** Emergency (Corpus ₹500 Cr static / ₹30k Cr current). Held by President.



---

### **MODULE 8: IMPORTANT COMMITTEES (Cheat Sheet)**

| Topic | Committee Name |
| --- | --- |
| **NABARD Formation** | **CRAFICARD (B. Sivaraman)** |
| **RRB Formation** | **Narasimham Committee** |
| **Financial Inclusion** | **C. Rangarajan Committee** |
| **Small Finance Banks** | **Usha Thorat Committee** |
| **Payments Banks** | **Nachiket Mor Committee** |
| **Universal Banking** | **R.H. Khan Committee** |
| **CIBIL / Credit Info** | **Siddiqui Committee** |
| **Banking Reforms** | **Narasimham Committee (I & II)** |`;

  const pcNoteContent = `🎲 Permutation & Combination (P&C): The Master Guide

Forget complex formulas. Use these mental triggers and the "Countdown Method".

### 1. The "Golden Rule" (P vs C)
Before you calculate, ask: **"Does the order matter?"**

*   **Permutation (Arrangement): YES**, order matters.
    *   *Think:* **Passwords or PINs.** (1-2-3 is different from 3-2-1).
    *   *Keywords:* Arrange, Seat, Rank, Words, Numbers.
*   **Combination (Selection): NO**, order doesn't matter.
    *   *Think:* **Fruit Salad.** (Apple & Banana is same as Banana & Apple).
    *   *Keywords:* Select, Choose, Pick, Team, Committee, Handshakes.

---

### 2. The Calculation Trick: "The Countdown Method"

**For Permutation (P) -> Just Countdown**
If you see 5P2 (Arrange 2 out of 5):
*   Start at 5. Count down 2 numbers.
*   Calculation: 5 x 4 = **20**.

**For Combination (C) -> Countdown & Divide**
If you see 5C2 (Select 2 out of 5):
*   Top: Countdown 2 numbers from 5 (5 x 4).
*   Bottom: Countdown 2 numbers from 2 (2 x 1).
*   Calculation: 20 / 2 = **10**.

---

### 3. Scenario Strategy Table

| Scenario | Type | Mental Action |
| :--- | :--- | :--- |
| Passwords / PINs | Permutation | Countdown (5×4...) |
| Teams / Committees | Combination | Countdown / Divider |
| Handshakes | Combination | n(n-1) / 2 |
| Circular Table | Arrangement | (n-1)! |
| Necklace / Beads | Arrangement | (n-1)! / 2 |
| "At least one" | Logic | Total - (None Case) |

---

### 4. Topic-Specific Blueprints

| Topic | Example | Strategy |
| :--- | :--- | :--- |
| Committees | "At least 2 women" | Create Cases (Case 1 + Case 2...) |
| Probability | "Prob of 2 Red balls" | Select Red / Select Total |
| Digits | "Using 0,1,2..." | Box Method (First box ≠ 0) |
| Words | "Vowels Together" | Box Method (Vowels = 1 unit) |`;

  const inequalityNoteContent = `⚖️ Inequality: The "Either/Or" Master Rules

Don't guess. Use this 3-step verification process to spot a valid **Either/Or** case instantly.

🕵️ Step 1: The Trigger (Scan Options)
The **Either/Or** check is triggered ONLY if:
1. Both elements are the **same** in both conclusions.
2. Both conclusions are **Individually False**.

Step 2: Identify the Case Type

**Case A: The "Established Relation" (The Combo Sign)**
* Statement establishes A ≥ B or A ≤ B.
* Conclusions break this relationship into parts.
* Pairs: (A > B) and (A = B) OR (A < B) and (A = B).

**Case B: The "No Relation" (The Blocked Path)**
* Statement contains **Opposite Signs** between elements (e.g., A > M < B).
* Rule: Must cover **all three possible symbols** (>, <, and =) combined.
* Pairs: (A > B) | (A ≤ B) OR (A < B) | (A ≥ B).`;

  // --- INITIALIZATION ---

  useEffect(() => {
    const savedNotes = localStorage.getItem('bankedge_notes');
    
    const bankingNote: Note = {
      id: 'banking-awareness-8-modules-verbatim',
      title: '🏦 Master Banking Awareness: 8 Modules (Verbatim)',
      content: bankingArticleContent,
      date: Date.now(),
      tags: ['GA', 'Banking', 'Static']
    };

    const pcNote: Note = {
      id: 'pc-master-rules',
      title: '🎲 P&C: The Master Guide',
      content: pcNoteContent,
      date: Date.now(),
      tags: ['Quant', 'P&C']
    };

    const inequalityNote: Note = {
      id: 'inequality-master-rules',
      title: '⚖️ Inequality: Either/Or Rules',
      content: inequalityNoteContent,
      date: Date.now(),
      tags: ['Reasoning', 'Inequality']
    };

    if (savedNotes) {
      const parsed: Note[] = JSON.parse(savedNotes);
      let updatedNotes = [...parsed];
      let changed = false;

      const masterNotes = [bankingNote, pcNote, inequalityNote];
      masterNotes.forEach(master => {
        if (!parsed.some(n => n.id === master.id)) {
          updatedNotes = [master, ...updatedNotes];
          changed = true;
        }
      });
      
      if (changed) {
        setNotes(updatedNotes);
        setActiveNoteId(bankingNote.id);
      } else {
        setNotes(parsed);
        if (parsed.length > 0 && !activeNoteId) setActiveNoteId(parsed[0].id);
      }
    } else {
      const initialNotes = [bankingNote, pcNote, inequalityNote];
      setNotes(initialNotes);
      setActiveNoteId(bankingNote.id);
    }
  }, []);

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
    setIsExpanded(true); // Automatically expand editor on creation for better UX
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
      {/* Added shrink-0 to prevent sidebar from shrinking when editor content expands. 
          Changed logic to hide sidebar on mobile when expanded, but show as w-full when not expanded. 
          On MD+ screens, it stays w-1/3. */}
      <div className={`${isExpanded ? 'hidden' : 'w-full md:w-80 lg:w-1/3 shrink-0'} bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden transition-all`}>
        <div className="p-6 border-b border-white/40 bg-gradient-to-br from-white/80 via-indigo-50/50 to-purple-50/50 backdrop-blur-xl space-y-4">
           <div className="flex justify-between items-center">
             <h2 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-3">
               <div className="p-2.5 bg-white rounded-xl shadow-sm border border-indigo-50">
                  <FileText className="text-indigo-600" size={20} />
               </div>
               My Notes
             </h2>
             <button onClick={handleNewNote} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-95">
               <Plus size={18} />
             </button>
           </div>
           <div className="relative group">
             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
             <input 
               type="text" placeholder="Search notes..." value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/60 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 outline-none transition-all shadow-sm focus:bg-white placeholder:text-slate-400"
             />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {filteredNotes.map(note => (
            <div key={note.id} 
              onClick={() => { 
                setActiveNoteId(note.id); 
                setAnalysisResult(''); 
                // Auto-expand editor on mobile/tablet when a note is clicked
                if (window.innerWidth < 1024) setIsExpanded(true); 
              }}
              className={`p-4 rounded-xl cursor-pointer transition-all group relative border ${activeNoteId === note.id ? 'bg-amber-50 border-amber-200 shadow-md ring-1 ring-amber-100' : 'bg-white border-slate-200 hover:border-amber-100 hover:bg-amber-50/30 hover:shadow-sm'}`}
            >
              <div className={`font-bold text-md mb-2 pr-6 truncate ${activeNoteId === note.id ? 'text-amber-800' : 'text-slate-800'}`}>{note.title}</div>
              <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{note.content || "Empty note..."}</div>
              <div className="flex items-center justify-between mt-2">
                 <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                    <Calendar size={12} /> {new Date(note.date).toLocaleDateString()}
                 </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }} className="absolute top-3 right-3 p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      {/* On mobile: Hidden if !isExpanded (List view). Visible if isExpanded.
          On Desktop: Always visible (flex) unless logic changes, but we want list+editor side-by-side usually.
          The logic `!isExpanded ? 'hidden md:flex' : 'flex'` ensures editor is hidden on mobile when list is shown, but always shown on desktop if we treat 'isExpanded' as 'Fullscreen Editor' or just 'Editor Active'.
      */}
      <div className={`flex-1 flex flex-col gap-4 ${!isExpanded ? 'hidden md:flex' : 'flex'}`}>
        {activeNote ? (
          <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
                {/* Back button for mobile when expanded */}
                <button 
                  onClick={() => setIsExpanded(false)} 
                  className="md:hidden p-2 -ml-2 text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>

                <input type="text" value={activeNote.title} onChange={(e) => updateNote('title', e.target.value)}
                  className="text-2xl md:text-3xl font-bold text-slate-800 outline-none placeholder-slate-300 flex-1 bg-transparent min-w-0" placeholder="Note Title"
                />
                <div className="flex items-center gap-3 shrink-0">
                   <span className="hidden md:flex text-xs text-slate-400 items-center gap-1 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                      <Calendar size={12} /> {new Date(activeNote.date).toLocaleDateString()}
                   </span>
                   <button onClick={() => setIsExpanded(!isExpanded)} className="hidden md:block p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title={isExpanded ? "Show List" : "Maximize Editor"}>
                    {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </button>
                </div>
              </div>
              
              <textarea value={activeNote.content} onChange={(e) => updateNote('content', e.target.value)}
                className="flex-1 w-full resize-none outline-none text-slate-600 leading-relaxed text-base md:text-lg font-mono bg-transparent placeholder-slate-300"
                placeholder="Start typing your notes here..."
              />
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-sm text-slate-400">
                 <span>{activeNote.content.length} characters</span>
                 <div className="flex items-center gap-1 hover:text-indigo-600 cursor-default"><Save size={14} /> Auto-saved</div>
              </div>
            </div>

            {/* AI Analysis Tool */}
            <div className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 min-h-[150px] ${isExpanded && window.innerWidth < 768 ? '' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                 <h3 className="font-bold text-slate-700 flex items-center gap-2">
                   <Sparkles className="text-amber-500" size={18} /> AI Insights
                 </h3>
                 <div className="flex gap-2">
                   <button onClick={() => handleAnalyze('summarize')} disabled={isAnalyzing} className="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100">Summarize</button>
                   <button onClick={() => handleAnalyze('formulas')} disabled={isAnalyzing} className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100">Formulas</button>
                   <button onClick={() => handleAnalyze('quiz')} disabled={isAnalyzing} className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-600 rounded hover:bg-purple-100">Quiz</button>
                 </div>
              </div>
              
              {isAnalyzing ? (
                <div className="h-24 flex items-center justify-center text-slate-400 text-sm animate-pulse">Analyzing your note...</div>
              ) : analysisResult ? (
                <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-100 max-h-60 overflow-y-auto">
                  {analysisResult}
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center text-slate-400 text-sm italic">Select an AI tool above to analyze this note.</div>
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
