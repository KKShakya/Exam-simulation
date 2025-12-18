
import React, { useState } from 'react';
import { Monitor, Cpu, Wifi, Database, Shield, HardDrive, ChevronDown, Binary, History, FileText, Keyboard, Layers, MousePointer2, Info, Clock, Terminal, Hash, Activity, Zap, ShieldCheck, Star, Box, ZapOff, Globe, Lock, ListChecks, FileSearch, Sparkles, ArrowLeft } from 'lucide-react';

const COMPUTER_MODULES = [
  {
    id: 'hardware',
    title: 'Hardware & Architecture',
    icon: Cpu,
    color: 'cyan',
    description: "CPU logic, Internal Ports (ATX/SATA), and Generations.",
    points: [
      {
        title: "CPU: The Trio (ALU, CU, MU)",
        content: "• **ALU:** Arithmetic & Logical operations.\n• **CU:** The 'Traffic Cop' - manages execution order.\n• **Clock Speed:** Measured in **Hertz (Hz)**.\n• **Registers:** Fastest internal storage. The **Accumulator** stores intermediate results."
      },
      {
        title: "History & Landmarks",
        content: "• **Tim Berners-Lee:** Father of World Wide Web (WWW).\n• **Siddharth:** First computer manufactured indigenously in India.\n• **ISI Kolkata:** Location where India's first computer was installed."
      },
      {
        title: "Printers: Impact vs Non-Impact",
        content: "• **Impact:** Physical strike on ribbon (Dot Matrix, Chain). Can use carbon paper for copies.\n• **Non-Impact:** Cartridge/Laser based (Laser, Inkjet, Thermal). Quieter and higher quality."
      },
      {
        title: "FORTRAN",
        content: "• **Formula Translation:** The first high-level language, primarily used for complex mathematical calculations."
      }
    ]
  },
  {
    id: 'memory',
    title: 'Memory & Storage Hierarchy',
    icon: HardDrive,
    color: 'blue',
    description: "Volatile vs Non-volatile, ROM types, and Units.",
    points: [
      {
        title: "Storage Geometry (Magnetic)",
        content: "• **Platter:** Circular disk.\n• **Track:** Concentric circles on platter.\n• **Sector:** Subdivision of a track.\n• **Cluster:** Group of sectors.\n• **Cylinder:** Vertical alignment of tracks across multiple platters."
      },
      {
        title: "Volatile vs Non-Volatile",
        content: "• **Volatile:** Loses data on power-off (**RAM**, Cache, Registers).\n• **Non-Volatile:** Retains data (**ROM**, HDD, SSD, CD/DVD)."
      },
      {
        title: "Storage Capacities",
        content: "• **CD-ROM:** 750-850 MB.\n• **DVD:** 4.7-17 GB.\n• **Blu-ray:** ~100 GB.\n• **Speed Hierarchy:** Register > Cache > RAM > SSD > HDD."
      }
    ]
  },
  {
    id: 'networking',
    title: 'Networking & Protocols',
    icon: Wifi,
    color: 'indigo',
    description: "IP Classes, Email sync, and Internet History.",
    points: [
      {
        title: "Communication Standards",
        content: "• **Bluetooth:** IEEE **802.15** standard for wireless file transfer.\n• **HDMI:** Interface for high-definition audio and video transmission.\n• **Modem:** Device that converts Digital signals to Analog (and vice versa)."
      },
      {
        title: "Device Intelligence",
        content: "• **Hub:** Broadcasts data to all ports (Indiscriminate).\n• **Switch:** Sends data only to destination (Intelligent).\n• **Repeater:** Boosts weak signals to extend range."
      },
      {
        title: "Email Nuances",
        content: "• **@ Symbol:** Separates username from domain.\n• **CC vs BCC:** CC is visible to all; BCC hides recipients from others."
      }
    ]
  },
  {
    id: 'software',
    title: 'Software & Productivity',
    icon: FileText,
    color: 'purple',
    description: "OS Types, Middleware, and MS Office Mastery.",
    points: [
      {
        title: "Software Categories",
        content: "• **System:** OS, Compilers, Interpreters (Runs the hardware).\n• **Utility:** Antivirus, Disk Defragmenter (Enhances performance).\n• **Application:** MS Office, Browser, Spotify (User tasks).\n• **Open Source:** Linux (Free and modifiable)."
      },
      {
        title: "MS Excel Master",
        content: "• **Freeze Pane:** Keeps specific rows/columns visible while scrolling.\n• **Active Cell:** The specific cell currently being edited (highlighted by a dark border)."
      },
      {
        title: "System Crashes",
        content: "• **System Hang:** CPU overload freezing everything.\n• **BSOD (Blue Screen of Death):** Occurs when the Operating System itself crashes."
      }
    ]
  },
  {
    id: 'security',
    title: 'Security & Malware',
    icon: Shield,
    color: 'rose',
    description: "Viruses, Trojans, and Phishing variants.",
    points: [
      {
        title: "Malware Behavior",
        content: "• **Worm:** Self-replicates WITHOUT a host program.\n• **Virus:** Self-replicates but REQUIRES a host program.\n• **Trojan:** Does NOT self-replicate; hides inside legitimate software."
      },
      {
        title: "Threat Landscape",
        content: "• **Phishing:** Deception/Lure (fake lottery/bank calls) to steal info.\n• **Spoofing:** Pretending to be someone else by cloning IP or Phone Numbers.\n• **Firewall:** Hardware or Software used to block unauthorized network access."
      },
      {
        title: "Data Protection",
        content: "• **Digital Signature:** Verifies sender identity and data integrity.\n• **Identity Theft:** Stealing a person's online identity/credentials."
      }
    ]
  },
  {
    id: 'future',
    title: 'Future Tech & Logic',
    icon: Zap,
    color: 'amber',
    description: "Quantum computing, VR/AR, and Base conversions.",
    points: [
      {
        title: "Blockchain & UPI",
        content: "• **Blockchain:** Distributed ledger for decentralized security.\n• **UPI Apps:** BHIM, GPay, PhonePe, Paytm (AOP Photo is NOT a UPI app)."
      },
      {
        title: "Binary Logic",
        content: "• **Bit:** 0 or 1.\n• **Nibble:** 4 Bits (Half a Byte).\n• **Byte:** 8 Bits."
      }
    ]
  }
];

const IP_CLASSES = [
  { class: "Class A", range: "1 - 126" },
  { class: "Loopback", range: "127.x.x.x" },
  { class: "Class B", range: "128 - 191" },
  { class: "Class C", range: "192 - 223" },
  { class: "Class D", range: "224 - 239 (Multicast)" },
  { class: "Class E", range: "240 - 255 (Exp.)" }
];

const DATA_UNITS = [
  { unit: "Bit", val: "0 or 1" },
  { unit: "Nibble", val: "4 Bits" },
  { unit: "Byte", val: "8 Bits" },
  { unit: "Kilobyte (KB)", val: "1024 Bytes" },
  { unit: "Megabyte (MB)", val: "1024 KB" },
  { unit: "Gigabyte (GB)", val: "1024 MB" },
  { unit: "Terabyte (TB)", val: "1024 GB" },
  { unit: "Petabyte (PB)", val: "1024 TB" }
];

const MAINS_FLASH_POINTS = [
  { title: "Optical Capacity", text: "CD: 750-850MB | DVD: 4.7-17GB | Blu-ray: 100GB" },
  { title: "Worm vs Virus", text: "Worm: NO host program needed | Virus: NEEDS a host program." },
  { title: "History Hub", text: "1st Indian PC: Siddharth | Internet Father: Vint Cerf | WWW: Tim Berners-Lee." },
  { title: "Hardware Logic", text: "Flip-flop: 1-bit storage | Modem: Digital to Analog converter." },
  { title: "Network Devices", text: "Hub: Broadcaster (Dumb) | Switch: Intelligent (Direct)." }
];

const RAPID_TIPS = [
  { title: "Gutter Margin", text: "Extra binding side margin (Left or Top) added to avoid text loss." },
  { title: "MS Word Min", text: "Every table must have at least 1 Row and 1 Column (1x1)." },
  { title: "Booting Rule", text: "A computer CANNOT boot without an Operating System (OS)." },
  { title: "Excel Freeze", text: "Freeze Panes keep headers visible while scrolling down sheets." },
  { title: "BSOD Crash", text: "Blue Screen of Death = Critical Operating System / Kernel failure." },
  { title: "UPI Legitimacy", text: "GPay, PhonePe, BHIM are valid; AOP Photo is a common Exam Trap." }
];

const MOST_ASKED_QA = [
  { q: "Ctrl + Space", a: "Remove character formatting" },
  { q: "F12 Key", a: "Save As dialog box" },
  { q: "Shift + F5", a: "Start PPT from current slide" },
  { q: "Ctrl + M", a: "Insert a New Slide in PPT" },
  { q: "Port 443", a: "HTTPS (Secure Web Transfer)" },
  { q: "IEEE 802.15", a: "Standard for Bluetooth Tech" }
];

const ComputerSePyaar: React.FC = () => {
  const [activeSubView, setActiveSubView] = useState<'menu' | 'detailed' | 'flashcards'>('menu');
  const [expandedModule, setExpandedModule] = useState<string | null>('hardware');

  // Helper for back navigation
  const goBack = () => setActiveSubView('menu');

  if (activeSubView === 'menu') {
    return (
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-12 px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-5xl font-extrabold text-slate-900 flex items-center justify-center gap-3">
            <Monitor className="text-indigo-600" size={48} />
            Computer Se Pyaar
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
            Zero to Hero master guide for IBPS RRB PO/Clerk. Select your learning mode.
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Detailed Version Entry */}
          <div 
            onClick={() => setActiveSubView('detailed')}
            className="group relative bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 hover:border-indigo-400 hover:shadow-2xl transition-all cursor-pointer overflow-hidden flex flex-col items-center text-center"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-indigo-100 transition-colors"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <FileSearch size={48} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Detailed Version</h2>
              <p className="text-slate-500 leading-relaxed text-lg">
                Comprehensive syllabus, hierarchy models, networking protocols, and high-impact notes.
              </p>
              
              <div className="mt-8 flex gap-2 justify-center">
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">Modules</span>
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">Cheat Sheets</span>
              </div>
            </div>
          </div>

          {/* Flash Cards Entry */}
          <div 
            onClick={() => setActiveSubView('flashcards')}
            className="group relative bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 hover:border-amber-400 hover:shadow-2xl transition-all cursor-pointer overflow-hidden flex flex-col items-center text-center"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-amber-100 transition-colors"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <Sparkles size={48} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Flash Cards</h2>
              <p className="text-slate-500 leading-relaxed text-lg">
                Active recall mode for shortcuts, binary conversions, and rapid-fire concepts.
              </p>
              
              <div className="mt-8 flex gap-2 justify-center">
                 <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full uppercase tracking-wider">Active Recall</span>
                 <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full uppercase tracking-wider">Practice</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubView === 'detailed') {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 pb-12 px-4">
        {/* Navigation Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-4">
           <button 
             onClick={goBack}
             className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
           >
             <ArrowLeft size={20} /> Back to Menu
           </button>
           <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
             <FileSearch className="text-indigo-600" size={24} /> Detailed Master Notes
           </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Modules (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {COMPUTER_MODULES.map((module) => {
              const Icon = module.icon;
              const isExpanded = expandedModule === module.id;
              
              const colorMap: Record<string, string> = {
                  cyan: "bg-cyan-50 text-cyan-700 border-cyan-100",
                  blue: "bg-blue-50 text-blue-700 border-blue-100",
                  indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
                  purple: "bg-purple-50 text-purple-700 border-purple-100",
                  rose: "bg-rose-50 text-rose-700 border-rose-100",
                  amber: "bg-amber-50 text-amber-700 border-amber-100",
              };
              const themeClass = colorMap[module.color] || colorMap.cyan;

              return (
                <div key={module.id} className={`rounded-2xl border transition-all ${isExpanded ? 'shadow-md ring-1 ring-opacity-50' : 'shadow-sm'} ${themeClass}`}>
                  <button 
                    onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-white bg-opacity-60"><Icon size={24} /></div>
                      <div>
                        <h3 className="font-bold text-lg">{module.title}</h3>
                        <p className="text-xs opacity-80 mt-1 font-medium">{module.description}</p>
                      </div>
                    </div>
                    <ChevronDown size={20} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`transition-all overflow-hidden ${isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 pb-6 pt-2 space-y-4">
                      <div className="h-px w-full bg-current opacity-10 mb-4"></div>
                      {module.points.map((point, idx) => (
                        <div key={idx} className="bg-white bg-opacity-60 rounded-xl p-4 border border-white border-opacity-50">
                          <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                            {point.title}
                          </h4>
                          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed pl-3.5 border-l-2 border-slate-300 border-opacity-30">
                            <span dangerouslySetInnerHTML={{ __html: point.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Reference Cards (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-indigo-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-700 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6 border-b border-indigo-700 pb-4">
                   <Hash className="text-amber-400" size={24} />
                   <h3 className="font-bold text-lg">IP Address Classes</h3>
                </div>
                <div className="space-y-3">
                   {IP_CLASSES.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-white/10 transition-colors">
                         <span className="font-bold text-indigo-300">{item.class}</span>
                         <span className="text-white font-mono text-xs">{item.range}</span>
                      </div>
                   ))}
                </div>
             </div>

             <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-700 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                   <Binary className="text-emerald-400" size={24} />
                   <h3 className="font-bold text-lg">Data Units Guide</h3>
                </div>
                <div className="space-y-3">
                   {DATA_UNITS.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-white/5 transition-colors">
                         <span className="font-bold text-indigo-300">{item.unit}</span>
                         <span className="text-emerald-400 font-mono text-xs">{item.val}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Highlight Grid (Mains Points, Tips, QA) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 border-t border-slate-100">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><Info size={24} /></div>
              <h3 className="font-bold text-slate-800 text-xl">Mains '25 Points</h3>
            </div>
            <ul className="space-y-4 text-sm text-slate-600 flex-1">
              {MAINS_FLASH_POINTS.map((pt, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span><strong>{pt.title}:</strong> {pt.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><Zap size={24} /></div>
              <h3 className="font-bold text-slate-800 text-xl">Rapid Exam Tips</h3>
            </div>
            <ul className="space-y-5 flex-1">
              {RAPID_TIPS.map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <div className="p-1 bg-green-100 text-green-600 rounded-full h-fit mt-0.5"><ShieldCheck size={16} /></div>
                  <div className="text-sm">
                     <span className="font-bold block text-slate-900">{tip.title}</span>
                     <p className="text-slate-500">{tip.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><ListChecks size={24} /></div>
              <h3 className="font-bold text-slate-800 text-xl">Most Asked Q&A</h3>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
               {MOST_ASKED_QA.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
                     <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">{item.q}</div>
                     <div className="text-sm text-slate-700 font-medium">{item.a}</div>
                  </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Flashcards View (Empty Placeholder)
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-left-4 pb-12 px-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-4">
           <button 
             onClick={goBack}
             className="flex items-center gap-2 text-slate-500 hover:text-amber-600 font-bold transition-colors"
           >
             <ArrowLeft size={20} /> Back to Menu
           </button>
           <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
             <Sparkles className="text-amber-600" size={24} /> Interactive Flashcards
           </h2>
      </div>

      <div className="bg-white rounded-[2.5rem] p-12 md:p-24 shadow-sm border border-slate-200 text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner border border-amber-100">
          <Sparkles size={48} />
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Flash Cards Mode</h2>
        <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
          This section is being optimized for the 2025 RRB Mains pattern. Interactive flip-cards for rapid-fire recall will be added here.
        </p>
        
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl opacity-15 select-none pointer-events-none">
           {[1,2,3,4].map(i => (
             <div key={i} className="h-48 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex items-center justify-center">
                <Box className="text-slate-300" size={32} />
             </div>
           ))}
        </div>
        
        <div className="mt-12">
          <button disabled className="bg-slate-100 text-slate-400 px-10 py-4 rounded-2xl font-bold cursor-not-allowed border border-slate-200">
             Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComputerSePyaar;
