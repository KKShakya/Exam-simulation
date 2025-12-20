
import React, { useState } from 'react';
import { Monitor, Cpu, Wifi, Database, Shield, HardDrive, ChevronDown, Binary, History, FileText, Keyboard, Layers, MousePointer2, Info, Clock, Terminal, Hash, Activity, Zap, ShieldCheck, Star, Box, ZapOff, Globe, Lock, ListChecks, FileSearch, Sparkles, ArrowLeft, Lightbulb, Link } from 'lucide-react';

const FLASHCARD_DATA = [
  {
    category: "Measurements & Speed",
    icon: Activity,
    color: "amber",
    items: [
      { q: "CPU Clock Speed", a: "Hertz (MHz/GHz)" },
      { q: "Supercomputer Speed", a: "FLOPS / MFLOPS" },
      { q: "Printer Speed (P/L)", a: "PPM (Pages) / LPM (Lines)" },
      { q: "Baud Rate", a: "Analog Signal Transfer Rate" }
    ]
  },
  {
    category: "Hardware & Booting",
    icon: Cpu,
    color: "cyan",
    items: [
      { q: "Cold Boot", a: "Start from OFF state" },
      { q: "Warm Boot", a: "Restart (Reboot)" },
      { q: "BIOS Location", a: "ROM (Starts Hardware Check)" },
      { q: "POST", a: "Power On Self Test (HW Check)" }
    ]
  },
  {
    category: "Networking & OSI",
    icon: Wifi,
    color: "blue",
    items: [
      { q: "Encryption Layer", a: "Presentation Layer" },
      { q: "End-to-End Delivery", a: "Transport Layer" },
      { q: "IPv4 vs IPv6", a: "32-bit vs 128-bit" },
      { q: "Most Reliable Topology", a: "Mesh Topology" }
    ]
  },
  {
    category: "Cloud & Modern Tech",
    icon: Globe,
    color: "indigo",
    items: [
      { q: "SaaS / PaaS / IaaS", a: "Cloud Service Models" },
      { q: "Elasticity", a: "Scaling resources on demand" },
      { q: "Zero Trust", a: "Continuous Verification" },
      { q: "AIoT", a: "AI + Internet of Things" }
    ]
  },
  {
    category: "Security & Malware",
    icon: Shield,
    color: "rose",
    items: [
      { q: "Data Diddling", a: "Forgery of electronic data" },
      { q: "Pharming", a: "Redirecting to fake websites" },
      { q: "Blockchain", a: "Immutable/Tamper-proof ledger" },
      { q: "Worm", a: "Self-Replicates (No Host Needed)" }
    ]
  },
  {
    category: "MS Office Master",
    icon: FileText,
    color: "emerald",
    items: [
      { q: "Excel Rows/Cols", a: "1,048,576 / 16,384 (XFD)" },
      { q: "Absolute Ref", a: "$A$1 (Dollar Symbol)" },
      { q: "Pivot Table", a: "Narrow data via drag & drop" },
      { q: "PPT Extension", a: ".pptx (Slideshow: .pptm)" }
    ]
  },
  {
    category: "Languages & OS",
    icon: Terminal,
    color: "slate",
    items: [
      { q: "Java", a: "Write Once, Run Anywhere" },
      { q: "Python", a: "AI-based Programming" },
      { q: "Oracle", a: "Database Package (Not OS)" },
      { q: "Information", a: "Processed Data" }
    ]
  },
  {
    category: "IoT & Protocols",
    // Fix: Added missing 'Link' import to the destructuring list above.
    icon: Link,
    color: "purple",
    items: [
      { q: "MQTT", a: "Lightweight IoT Protocol" },
      { q: "Secure Remote Login", a: "SSH (Secure Shell)" },
      { q: "Telnet", a: "Non-secure remote login" },
      { q: "IPSec", a: "Encryption at Network Layer" }
    ]
  }
];

const COMPUTER_MODULES = [
  {
    id: 'hardware',
    title: 'Hardware & Architecture',
    icon: Cpu,
    color: 'cyan',
    description: "CPU logic, Units, and Booting Sequence.",
    points: [
      {
        title: "Speed Measurements",
        content: "• **CPU:** Measured in MHz/GHz.\n• **Supercomputers:** Measured in FLOPS (Floating Point Operations Per Second).\n• **Printers:** CPS (Characters), LPM (Lines), PPM (Pages).\n• **Hard Disk:** RPM (Revolutions Per Minute)."
      },
      {
        title: "Booting & BIOS",
        content: "• **Boot Sequence:** BIOS (ROM) -> POST (Hardware Test) -> Loader (OS to RAM).\n• **Cold Boot:** Starting from power off.\n• **Warm Boot:** Restarting via software (Ctrl+Alt+Del)."
      },
      {
        title: "Hierarchy of Storage",
        content: "• **Registers:** Fastest and internal to CPU.\n• **Cache:** Intermediate between RAM and CPU.\n• **RAM:** Main memory (Volatile).\n• **HDD/SSD:** Secondary memory (Non-Volatile)."
      }
    ]
  },
  {
    id: 'networking',
    title: 'Networking & OSI Model',
    icon: Wifi,
    color: 'indigo',
    description: "OSI Layers, IP Classes, and Devices.",
    points: [
      {
        title: "OSI Layer Mastery",
        content: "• **Presentation:** Encryption & Decryption.\n• **Transport:** End-to-end delivery & segments.\n• **Session:** Connection management.\n• **Data Link:** Framing & Error handling (Switch works here).\n• **Network:** Routing (Router works here)."
      },
      {
        title: "Network Devices",
        content: "• **Hub/Repeater:** Physical Layer.\n• **Switch/Bridge:** Data Link Layer.\n• **Router:** Network Layer.\n• **Gateway:** Transport Layer.\n• **Proxy Server:** Known as a 'Dummy Server' intermediary."
      },
      {
        title: "Protocols",
        content: "• **SSH:** Secure remote login.\n• **MQTT:** Low-bandwidth IoT protocol.\n• **SNMP:** Network management.\n• **IPSec:** Network layer security."
      }
    ]
  },
  {
    id: 'software',
    title: 'Software & Cloud',
    icon: FileText,
    color: 'purple',
    description: "Cloud models, OS, and Excel Limits.",
    points: [
      {
        title: "Cloud Computing",
        content: "• **SaaS:** Software as a Service (Apps).\n• **PaaS:** Platform for developers.\n• **IaaS:** Infrastructure (Virtual resources).\n• **Deployment:** Public, Private, and Hybrid (mix of both)."
      },
      {
        title: "MS Excel Mastery",
        content: "• **Limits:** 1,048,576 Rows and 16,384 Columns (A to XFD).\n• **Absolute Ref:** Use '$' sign to lock cells (e.g., $A$1).\n• **Pivot Table:** Drag & drop to summarize large data.\n• **Shortcuts:** Ctrl+1 (Format Cells), Ctrl+E (Center Align)."
      }
    ]
  },
  {
    id: 'security',
    title: 'Cybersecurity & Modern Tech',
    icon: Shield,
    color: 'rose',
    description: "Attacks, Encryption, and Blockchain.",
    points: [
      {
        title: "Security Attacks",
        content: "• **Data Diddling:** Forgery/Modification of electronic data.\n• **Pharming:** Traffic redirection to fake sites.\n• **MITM:** Man-in-the-Middle intercepting communication.\n• **SQL Injection:** Modifying database queries via user input."
      },
      {
        title: "Modern Tech Trends",
        content: "• **Zero Trust:** Continuous verification regardless of location.\n• **Blockchain:** Immutable records for banking/transactions.\n• **e-RUPI:** India's Central Bank Digital Currency (CBDC).\n• **AIoT:** Integration of AI with IoT sensors."
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
  { unit: "IPv4", val: "32-bit Address" },
  { unit: "IPv6", val: "128-bit Address" },
  { unit: "Nibble", val: "4 Bits" },
  { unit: "Byte", val: "8 Bits" },
  { unit: "Kilobyte (KB)", val: "1024 Bytes" },
  { unit: "Megabyte (MB)", val: "1024 KB" },
  { unit: "Gigabyte (GB)", val: "1024 MB" },
  { unit: "Terabyte (TB)", val: "1024 GB" }
];

const MAINS_FLASH_POINTS = [
  { title: "Zero Trust", text: "Continuous verification of every user, even internal ones." },
  { title: "Data Diddling", text: "Unauthorized forgery or modification of data (emails/spreadsheets)." },
  { title: "e-RUPI", text: "India's official Central Bank Digital Currency (CBDC)." },
  { title: "Blockchain", text: "Immutable, tamper-proof record keeping for banking transparency." },
  { title: "AIoT", text: "AI + IoT integration for smart devices with low bandwidth needs." }
];

const RAPID_TIPS = [
  { title: "Excel Limits", text: "1,048,576 Rows & 16,384 Columns (A to XFD). Max Zoom: 400%." },
  { title: "Absolute Ref", text: "Use $ sign ($A$1) to keep formula cells from changing when copied." },
  { title: "Cloud Elasticity", text: "The ability to scale computing resources up or down on demand." },
  { title: "Booting BIOS", text: "BIOS resides in ROM; initiates POST to check hardware integrity." },
  { title: "Proxy Server", text: "Acts as an intermediary (Dummy Server) to enhance security and cache data." }
];

const MOST_ASKED_QA = [
  { q: "Ctrl + E", a: "Center Alignment in MS Word/PPT" },
  { q: "Ctrl + 1", a: "Open Format Cells dialog in Excel" },
  { q: "F12 Key", a: "Save As dialog box" },
  { q: "Type 1 Hypervisor", a: "KVM - Used for Cloud Virtualization" },
  { q: "MQTT", a: "Lightweight protocol for IoT communication" },
  { q: "Mesh Topology", a: "Most reliable network topology" }
];

const ComputerSePyaar: React.FC = () => {
  const [activeSubView, setActiveSubView] = useState<'menu' | 'detailed' | 'flashcards'>('menu');
  const [expandedModule, setExpandedModule] = useState<string | null>('hardware');

  const goBack = () => setActiveSubView('menu');

  if (activeSubView === 'menu') {
    return (
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-12 px-4">
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-5xl font-extrabold text-slate-900 flex items-center justify-center gap-3">
            <Monitor className="text-indigo-600" size={48} />
            Computer Se Pyaar
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
            Zero to Hero master guide for IBPS RRB PO/Clerk. Select your learning mode.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
                   <h3 className="font-bold text-lg">Addressing & Storage</h3>
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
             <Sparkles className="text-amber-600" size={24} /> Revision Flashcards
           </h2>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200">
        <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">5-Minute Super Revision</h3>
            <p className="text-slate-500">Condensed data clusters for quick recall and high-speed retention.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {FLASHCARD_DATA.map((card, idx) => {
              const Icon = card.icon;
              const colorClasses: Record<string, string> = {
                 amber: "bg-amber-100 text-amber-600 border-amber-200",
                 cyan: "bg-cyan-100 text-cyan-600 border-cyan-200",
                 blue: "bg-blue-100 text-blue-600 border-blue-200",
                 indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
                 purple: "bg-purple-100 text-purple-600 border-purple-200",
                 rose: "bg-rose-100 text-rose-600 border-rose-200",
                 emerald: "bg-emerald-100 text-emerald-600 border-emerald-200",
                 slate: "bg-slate-100 text-slate-600 border-slate-200",
              };
              
              return (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                   <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Icon size={120} />
                   </div>

                   <div className="flex items-center gap-3 mb-6 relative z-10">
                      <div className={`p-2 rounded-xl ${colorClasses[card.color]}`}>
                        <Icon size={20} />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm tracking-tight">{card.category}</h4>
                   </div>

                   <div className="space-y-4 relative z-10">
                      {card.items.map((item, i) => (
                        <div key={i} className="group/item">
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{item.q}</div>
                           <div className="text-sm font-bold text-slate-700 group-hover/item:text-indigo-600 transition-colors">{item.a}</div>
                        </div>
                      ))}
                   </div>
                </div>
              );
           })}
        </div>

        <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
           <div className="space-y-2 relative z-10">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <Lightbulb className="text-amber-400" />
                Topper's Revision Strategy
              </h4>
              <p className="text-slate-400 text-sm max-w-lg">
                Use these cards once every morning. Don't read—try to <strong>predict</strong> the answer before your eyes land on it.
              </p>
           </div>
           <div className="flex items-center gap-4 relative z-10">
              <div className="flex flex-col items-center p-3 bg-white/10 rounded-2xl border border-white/10">
                 <span className="text-2xl font-black text-amber-400">8</span>
                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Categories</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-white/10 rounded-2xl border border-white/10">
                 <span className="text-2xl font-black text-indigo-400">32</span>
                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Key Facts</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ComputerSePyaar;
