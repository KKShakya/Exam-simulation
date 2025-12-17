
import React, { useState } from 'react';
import { Monitor, Cpu, Wifi, Database, Shield, HardDrive, ChevronDown, Binary, History, FileText, Keyboard, Layers, MousePointer2, Info, Clock, Terminal } from 'lucide-react';

const COMPUTER_MODULES = [
  {
    id: 'hardware',
    title: 'Hardware & Memory (The Brain)',
    icon: Cpu,
    color: 'cyan',
    description: "Booting, Memory Types, Keys & Peripherals.",
    points: [
      {
        title: "The Booting Process & BIOS",
        content: "• **BIOS (Basic Input Output System):** Firmware in ROM that initiates hardware checks.\n• **POST (Power-On Self Test):** Initial diagnostic test to check hardware components.\n• **Cold Booting:** Starting a computer from its 'off' state.\n• **Warm Booting:** Restarting a computer without turning it off (using Ctrl+Alt+Del or Restart button)."
      },
      {
        title: "Memory Hierarchy & ROM Types",
        content: "• **Primary Memory:** Fast, internal (RAM, ROM, Cache).\n• **Secondary Memory:** External backup (HDD, SSD, Pen Drive, Magnetic Tape).\n• **ROM Subtypes:** \n  - **MROM:** Masked ROM (Hardwired during manufacture).\n  - **PROM:** Programmable (One-time write).\n  - **EPROM:** Erasable via **UV Rays**.\n  - **EEPROM:** Electrically Erasable (Example: **Flash Memory** used in Pen Drives)."
      },
      {
        title: "Keyboard & Peripheral Classifications",
        content: "• **Toggle Keys:** Caps Lock, Num Lock, Scroll Lock (ON/OFF behavior).\n• **Modifier Keys:** Ctrl, Alt, Shift (Used in combination).\n• **Alphanumeric:** Letters and Numbers.\n• **Function Keys:** F1 to F12.\n• **Drivers:** Essential software required for the OS to communicate with peripherals like Printers/Scanners.\n• **PSS:** Portable Scanning System (Wireless handheld device for inventory) vs **POS** (Point of Sale)."
      },
      {
        title: "Printers & Display",
        content: "• **Laser Printer:** Uses laser beams on photosensitive surfaces. High speed and quality.\n• **Impact Printers:** Dot Matrix, Daisy Wheel (Physical striking).\n• **Monitor:** Output device for visual soft-copy."
      }
    ]
  },
  {
    id: 'networking',
    title: 'Networking & Protocols (The Web)',
    icon: Wifi,
    color: 'indigo',
    description: "Internet Evolution, Switching & Security.",
    points: [
      {
        title: "Internet History Timeline",
        content: "• **1969:** **ARPANET** (First network) created by US Army.\n• **1983:** Official 'Birth of Internet' via TCP/IP adoption.\n• **Late 1980s:** Tim Berners-Lee introduces **WWW**.\n• **1990s:** Emergence of Search Engines (Google, Yahoo)."
      },
      {
        title: "Network Switching Techniques",
        content: "• **Packet Switching:** Data split into packets with destination addresses (Used by the Internet).\n• **Circuit Switching:** Dedicated physical line established (Used in traditional Telephony).\n• **Message Switching:** Uses intermediate nodes to relay whole messages (Distributed networks)."
      },
      {
        title: "Protocols & Connectivity",
        content: "• **DNS:** Domain Name System (Maps URLs like google.com to IP addresses).\n• **SNMP:** Simple Network Management Protocol (Manages devices).\n• **FTP:** File Transfer Protocol (Uploading/Downloading).\n• **VPN:** Virtual Private Network (Secure remote access).\n• **WPA:** Wi-Fi Protected Access (Wireless authentication).\n• **Modem:** Modulates (Digital to Analog) and Demodulates for telephone line communication."
      }
    ]
  },
  {
    id: 'office',
    title: 'Office & Email (The Tools)',
    icon: FileText,
    color: 'blue',
    description: "Email Fundamentals & Office Mastery.",
    points: [
      {
        title: "Email Structure & Folders",
        content: "• **Format:** username@serviceprovider.com\n• **CC (Carbon Copy):** All recipients see each other.\n• **BCC (Blind Carbon Copy):** Recipients are hidden from others.\n• **Folders:** \n  - **Inbox:** Received mail.\n  - **Outbox:** Temporarily held before sending.\n  - **Sent:** Successfully delivered.\n  - **Drafts:** Saved but not sent.\n  - **Spam:** Unsolicited/junk emails."
      },
      {
        title: "MS Word & Excel Quick Facts",
        content: "• **MS Word Max Zoom:** 500%.\n• **Excel/PPT Max Zoom:** 400%.\n• **Gutter Margin:** Added for binding side.\n• **Drop Cap:** Large initial letter (Default 3 lines).\n• **Excel Today():** Current Date only. **Now():** Date + Time."
      }
    ]
  },
  {
    id: 'software',
    title: 'Software & Logic (The System)',
    icon: Database,
    color: 'purple',
    description: "System Tools, DBMS & Software Types.",
    points: [
      {
        title: "System Software Components",
        content: "• **Processor (CPU):** Executes program instructions.\n• **Loader:** Transfers programs from HDD to RAM for execution.\n• **Linker:** Links small object files into a single executable.\n• **Assembler:** Converts assembly code to machine code.\n• **Debugger:** Detects and removes errors/bugs from code."
      },
      {
        title: "Database Management (DBMS)",
        content: "• **Schema:** The logical structure/skeleton of the database.\n• **Instances:** The actual data records stored at a specific moment.\n• **Key Commands:** DDL (Structure), DML (Data), DCL (Control), TCL (Transactions)."
      },
      {
        title: "Software Categories",
        content: "• **Open Source:** Free to use, source code is modifiable (Linux, Mozilla Firefox).\n• **Utility Software:** Enhances system performance (Disk Defragmenter - rearranges files to free space).\n• **Multimedia:** Integration of Text, Sound, Graphics, and Video."
      }
    ]
  },
  {
    id: 'security',
    title: 'Security & Malware (The Shield)',
    icon: Shield,
    color: 'rose',
    description: "Threats, Phishing & Defense.",
    points: [
      {
        title: "Malware Definitions",
        content: "• **Phishing:** Fraudulent emails/sites to steal credentials.\n• **Trojan:** Disguised as legitimate software.\n• **Worm:** Self-replicating malware that eats network bandwidth.\n• **Keylogger:** Records keystrokes to steal passwords."
      },
      {
        title: "Defensive Measures",
        content: "• **Firewall:** Monitors incoming/outgoing traffic based on rules.\n• **Antivirus:** Scans and removes malicious files.\n• **Encryption:** Scrambling data so it's unreadable without a key."
      }
    ]
  }
];

const DATA_UNITS = [
  { unit: "Bit", val: "0 or 1 (Smallest)" },
  { unit: "Nibble", val: "4 Bits" },
  { unit: "Byte", val: "8 Bits" },
  { unit: "Kilobyte (KB)", val: "1,000 / 1,024 Bytes" },
  { unit: "Megabyte (MB)", val: "1 Million Bytes" },
  { unit: "Gigabyte (GB)", val: "1 Billion Bytes" },
  { unit: "Terabyte (TB)", val: "1 Trillion Bytes" },
  { unit: "Petabyte (PB)", val: "1,024 TB" },
  { unit: "Exabyte (EB)", val: "1,024 PB" },
  { unit: "Zettabyte (ZB)", val: "1,024 EB" },
  { unit: "Yottabyte (YB)", val: "1,024 ZB" },
];

const ComputerSePyaar: React.FC = () => {
  const [expandedModule, setExpandedModule] = useState<string | null>('hardware');

  const toggleModule = (id: string) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-12">
      {/* Header with detailed note */}
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Monitor className="text-cyan-600" size={40} />
          Computer Se Pyaar
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Detailed A-Z guide for IBPS RRB PO & Clerk. Master Hardware, Networking, Software, and more.
        </p>
        <div className="flex justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold border border-cyan-200 shadow-sm">
                <Terminal size={14} /> Exam Oriented
            </span>
             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200 shadow-sm">
                <Clock size={14} /> Updated for 2025
            </span>
        </div>
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

        {/* Right Column: Data Hierarchy & Quick Facts */}
        <div className="lg:col-span-1 space-y-6">
           {/* Storage Table */}
           <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                 <Binary className="text-emerald-400" size={24} />
                 <div>
                    <h3 className="font-bold text-lg">Data Units Hierarchy</h3>
                    <p className="text-slate-400 text-xs">Smallest to Largest</p>
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
                    Pro Tip: 1 Byte = 8 Bits.<br/>1 Nibble = 4 Bits.
                 </p>
              </div>
           </div>

           {/* Quick Ref Box */}
           <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                   <Info size={20} />
                 </div>
                 <h3 className="font-bold text-amber-900">Exam Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-amber-800">
                <li className="flex gap-2">
                  <div className="w-1 h-1 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>EPROM</strong> is erased by UV rays; <strong>EEPROM</strong> is electrical.</span>
                </li>
                <li className="flex gap-2">
                  <div className="w-1 h-1 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>ARPANET</strong> (1969) initiated the internet.</span>
                </li>
                <li className="flex gap-2">
                  <div className="w-1 h-1 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Loader</strong> transfers programs from HDD to RAM.</span>
                </li>
                <li className="flex gap-2">
                  <div className="w-1 h-1 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Switching:</strong> Internet uses Packet; Telephony uses Circuit.</span>
                </li>
              </ul>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ComputerSePyaar;
