
import React, { useState } from 'react';
import { Monitor, Cpu, Wifi, Database, Shield, HardDrive, ChevronDown, Binary, History, FileText, Keyboard, Layers, MousePointer2 } from 'lucide-react';

const COMPUTER_MODULES = [
  {
    id: 'hardware',
    title: 'Hardware & Memory (The Brain)',
    icon: Cpu,
    color: 'cyan',
    description: "Hierarchy, Registers, Volatility & Booting.",
    points: [
      {
        title: "Memory Hierarchy (Speed & Access)",
        content: "• **Registers:** CPU Internal (Fastest). **Accumulator** stores intermediate results.\n• **Cache:** Uses **SRAM** (Static, No Refresh needed). Volatile.\n• **RAM:** Uses **DRAM** (Dynamic, Needs Refresh). DDR is DRAM. Volatile.\n• **Secondary:** HDD, SSD, Magnetic Tape (Sequential Access/Slowest)."
      },
      {
        title: "Storage Classifications",
        content: "• **Volatile:** Data lost without power (Registers, Cache, RAM).\n• **Non-Volatile:** Retains data (ROM, HDD, Flash Memory).\n• **ROM Types:** MROM (Masked), EPROM (UV Erasable), EEPROM (Electrically Erasable/Flash)."
      },
      {
        title: "System Operations",
        content: "• **Virtual Memory:** Hard disk space used as RAM when RAM is full.\n• **Swapping:** Moving data between RAM and Virtual Memory.\n• **MMU:** Memory Management Unit (Allocates memory).\n• **Driver:** Software interface for peripherals."
      },
      {
        title: "Booting & Peripherals",
        content: "• **BIOS:** Firmware in ROM. **POST:** Hardware check.\n• **Booting:** Cold (Switch On) vs Warm (Restart).\n• **Keys:** Toggle (Caps/Num), Modifier (Ctrl/Alt/Shift).\n• **Printers:** Laser (Non-impact), Dot Matrix (Impact)."
      }
    ]
  },
  {
    id: 'networking',
    title: 'Networking & Protocols (The Web)',
    icon: Wifi,
    color: 'indigo',
    description: "Switching, OSI, VPN & DNS.",
    points: [
      {
        title: "Switching Techniques",
        content: "• **Packet Switching:** Data sent in packets (Used in Internet).\n• **Circuit Switching:** Dedicated line (Used in Telephone calls).\n• **Message Switching:** Store and forward (Intermediate nodes)."
      },
      {
        title: "Important Protocols",
        content: "• **DNS:** Domain Name System (URL → IP Address).\n• **SNMP:** Simple Network Management Protocol.\n• **VPN:** Virtual Private Network (Secure Tunnel).\n• **WPA:** Wi-Fi Protected Access (Security)."
      },
      {
        title: "OSI Model Layers (7 Layers)",
        content: "1. **Physical:** Bits, Cables, Hub.\n2. **Data Link:** Frames, Switch, MAC Address.\n3. **Network:** Packets, Router, IP Address.\n4. **Transport:** TCP/UDP (End-to-End).\n5. **Presentation:** Encryption, Compression.\n6. **Application:** HTTP, FTP, SMTP."
      }
    ]
  },
  {
    id: 'office',
    title: 'Office & Email (The Tools)',
    icon: FileText,
    color: 'blue',
    description: "Email Structure, CC/BCC & MS Shortcuts.",
    points: [
      {
        title: "Email Fundamentals",
        content: "• **Format:** username@domain.com\n• **CC (Carbon Copy):** Visible to all recipients.\n• **BCC (Blind Carbon Copy):** Hidden from others.\n• **Spam:** Unsolicited/Junk mail."
      },
      {
        title: "Microsoft Word",
        content: "• **Max Zoom:** 500%.\n• **Drop Cap:** Large initial letter (Default 3 lines).\n• **Ctrl + F1:** Show/Hide Ribbon.\n• **Gutter Margin:** Margin added for binding."
      },
      {
        title: "Excel & PowerPoint",
        content: "• **Excel Zoom:** 400% Max.\n• **=TODAY():** Date only. **=NOW():** Date + Time.\n• **PPT Zoom:** 400% Max.\n• **F5:** Start Slideshow. **Shift+F5:** Start from current."
      }
    ]
  },
  {
    id: 'software',
    title: 'Software, OS & DBMS (The Logic)',
    icon: Database,
    color: 'purple',
    description: "System Software, Open Source & DB Terms.",
    points: [
      {
        title: "System Software Stack",
        content: "• **Loader:** Loads program from HDD to RAM.\n• **Linker:** Links small program objects.\n• **Assembler:** Assembly → Machine Language.\n• **Debugger:** Detects & removes bugs."
      },
      {
        title: "Database Concepts",
        content: "• **Schema:** The structure/skeleton of the DB.\n• **Instances:** The actual data records at a specific time.\n• **SQL:** DDL (Create), DML (Insert), DCL (Grant)."
      },
      {
        title: "Software Types",
        content: "• **Open Source:** Code is free & modifiable (Linux, Firefox).\n• **Utility:** Disk Defragmenter (Optimizes storage/speed).\n• **Modem:** Modulator-Demodulator (Analog ↔ Digital)."
      }
    ]
  },
  {
    id: 'history',
    title: 'History & Pioneers (The Roots)',
    icon: History,
    color: 'amber',
    description: "Internet Timeline & Inventors.",
    points: [
      {
        title: "Internet Evolution",
        content: "• **1969:** ARPANET (First Network, US Army).\n• **1983:** Internet officially born (TCP/IP).\n• **Late 80s:** WWW (Tim Berners-Lee).\n• **90s:** Search Engines (Google)."
      },
      {
        title: "The Pioneers",
        content: "• **Father of Computer:** Charles Babbage.\n• **First Programmer:** Ada Lovelace.\n• **Queen of Software:** Grace Hopper (COBOL)."
      },
      {
        title: "Generations",
        content: "1. Vacuum Tubes (ENIAC)\n2. Transistors\n3. ICs (Integrated Circuits)\n4. Microprocessors (VLSI)\n5. AI & ULSI"
      }
    ]
  },
  {
    id: 'security',
    title: 'Security & Malware (The Shield)',
    icon: Shield,
    color: 'rose',
    description: "Threats & Defense.",
    points: [
      {
        title: "Malware Types",
        content: "• **Phishing:** Fake emails/sites for passwords.\n• **Keylogger:** Records keystrokes.\n• **Ransomware:** Encrypts files for money.\n• **Trojan:** Disguised as safe software."
      },
      {
        title: "Defense",
        content: "• **Firewall:** Monitors traffic (Hardware/Software).\n• **Antivirus:** Scans & removes files.\n• **Encryption:** Cipher text security."
      }
    ]
  }
];

const DATA_UNITS = [
  { unit: "Bit", val: "0 or 1 (Smallest)" },
  { unit: "Nibble", val: "4 Bits" },
  { unit: "Byte", val: "8 Bits" },
  { unit: "Kilobyte (KB)", val: "1024 Bytes" },
  { unit: "Megabyte (MB)", val: "1024 KB" },
  { unit: "Gigabyte (GB)", val: "1024 MB" },
  { unit: "Terabyte (TB)", val: "1024 GB" },
  { unit: "Petabyte (PB)", val: "1024 TB" },
  { unit: "Exabyte (EB)", val: "1024 PB" },
  { unit: "Zettabyte (ZB)", val: "1024 EB" },
  { unit: "Yottabyte (YB)", val: "1024 ZB" },
  { unit: "Brontobyte", val: "1024 YB" },
  { unit: "Geopbyte", val: "Highest Known" },
];

const ComputerSePyaar: React.FC = () => {
  const [expandedModule, setExpandedModule] = useState<string | null>('hardware');

  const toggleModule = (id: string) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-12">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Monitor className="text-cyan-600" size={40} />
          Computer Se Pyaar
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          The ultimate A-Z guide for IBPS RRB PO & Clerk Computer Awareness. Target 20/20.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Modules */}
        <div className="lg:col-span-2 space-y-4">
          {COMPUTER_MODULES.map((module) => {
            const Icon = module.icon;
            const isExpanded = expandedModule === module.id;
            
            const colorMap: Record<string, string> = {
                cyan: "bg-cyan-50 text-cyan-700 border-cyan-100 hover:border-cyan-300",
                indigo: "bg-indigo-50 text-indigo-700 border-indigo-100 hover:border-indigo-300",
                purple: "bg-purple-50 text-purple-700 border-purple-100 hover:border-purple-300",
                rose: "bg-rose-50 text-rose-700 border-rose-100 hover:border-rose-300",
                blue: "bg-blue-50 text-blue-700 border-blue-100 hover:border-blue-300",
                amber: "bg-amber-50 text-amber-700 border-amber-100 hover:border-amber-300",
            };
            const themeClass = colorMap[module.color] || colorMap.cyan;

            return (
              <div 
                key={module.id} 
                className={`rounded-2xl transition-all duration-300 overflow-hidden border ${isExpanded ? 'shadow-md ring-1 ring-opacity-50' : 'shadow-sm'} ${themeClass}`}
              >
                <button 
                  onClick={() => toggleModule(module.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-white bg-opacity-60`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{module.title}</h3>
                      <p className="text-xs opacity-80 mt-1 font-medium">{module.description}</p>
                    </div>
                  </div>
                  <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
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

        {/* Right Column: Data Hierarchy Table */}
        <div className="lg:col-span-1">
           <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-700 sticky top-4">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                 <Binary className="text-emerald-400" size={24} />
                 <div>
                    <h3 className="font-bold text-lg">Data Units Ladder</h3>
                    <p className="text-slate-400 text-xs">Memorize the sequence</p>
                 </div>
              </div>
              
              <div className="space-y-3">
                 {DATA_UNITS.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm group hover:bg-slate-800 p-2 rounded-lg transition-colors cursor-default">
                       <span className="font-bold text-cyan-300">{item.unit}</span>
                       <span className="text-slate-400 font-mono text-xs">{item.val}</span>
                    </div>
                 ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 text-center">
                 <p className="text-xs text-slate-500">
                    Pro Tip: 1 Byte = 8 Bits.<br/>All units after Byte multiply by 1024.
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ComputerSePyaar;
