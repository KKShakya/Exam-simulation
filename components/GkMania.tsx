
import React, { useState } from 'react';
import { Globe, Building2, MapPin, Newspaper, ChevronLeft, Landmark, Plane, Users, Swords, Briefcase, Award, Zap, CalendarDays, Trophy, Laptop, Gavel, Scale } from 'lucide-react';

// Data Structures

const BANKING_AWARENESS = [
  {
    title: "Govt Schemes & Finance",
    content: [
      "**PM Kisan (21st Installment):** Released from **Coimbatore, TN** (Nov 19, 2025). Total ₹18,000 Cr.",
      "**PM Fasal Bima Yojana:** **'Wild Animal Attacks'** added as add-on cover starting Kharif 2026. <span class='text-amber-600 text-xs font-bold ml-1 bg-amber-50 px-1 rounded border border-amber-100'>🔥 Exam Trap</span>",
      "**Adani in Assam:** **₹63,000 Cr** investment confirmed (₹48k Cr Thermal, ₹15k Cr Hydro).",
      "**HDFC Bank:** India's Most Valuable Brand ($44.9B). Tagline: 'We Understand Your World'."
    ]
  },
  {
    title: "Scheduled Banks & Acts",
    content: [
      "Scheduled Banks: Defined in **2nd Schedule of RBI Act, 1934** <span class='text-amber-600 text-xs font-bold ml-1 bg-amber-50 px-1 rounded border border-amber-100'>🔥 x2</span>",
      "NPCI (National Payments Corporation of India): Est. **2008** under **Companies Act 2013 (Section 8)**.",
      "SARFAESI Act (2002): Enforced for secured loans above **₹1 Lakh** (Exempts agricultural land).",
      "**SARAL SIMS:** Portal by Ministry of Steel for import registration."
    ]
  },
  {
    title: "Payments & Limits",
    content: [
      "Payments Bank Limit: **₹2 Lakh** (Officially updated) <span class='text-amber-600 text-xs font-bold ml-1 bg-amber-50 px-1 rounded border border-amber-100'>🔥 x2</span>",
      "**UPI TIPS:** New RBI/NPCI initiative for cross-border payments.",
      "First Payments Bank: **Airtel Payments Bank**."
    ]
  },
  {
    title: "Instruments & Regulators",
    content: [
      "Bearer Cheque: Payable to holder (aka 'Check's Curse') <span class='text-amber-600 text-xs font-bold ml-1 bg-amber-50 px-1 rounded border border-amber-100'>🔥 x2</span>",
      "PFRDA: Regulator of NPS. HQ: **New Delhi**.",
      "Financial Inclusion: **2005** (C. Rangarajan Committee).",
      "EPFO HQ: **New Delhi**."
    ]
  }
];

const STATIC_GK = [
  {
    category: "Organisations (DRDO/UNESCO)",
    icon: Building2,
    items: [
      { k: "UNESCO HQ", v: "Paris (193 Members). India Exec Board '25-'29." },
      { k: "DRDO", v: "Est 1958. Motto: 'Balasya Mulam Vigyanam'." },
      { k: "UNFPA", v: "New York, USA" },
      { k: "FIDE (Chess)", v: "Lausanne" },
      { k: "Asian Hockey Fed", v: "Kuala Lumpur" }
    ]
  },
  {
    category: "Geography & Nature",
    icon: MapPin,
    items: [
      { k: "Ramsar Sites", v: "94 sites (TN max) 🔥 x2" },
      { k: "Kuno National Park", v: "MP (Cheetahs) 🔥 x2" },
      { k: "Erta Ale Volcano", v: "Ethiopia (Active)" },
      { k: "Bor & Melghat", v: "Maharashtra" },
      { k: "Kanchanjangha NP", v: "Sikkim (IUCN 'Good')" }
    ]
  },
  {
    category: "Culture & GI Tags",
    icon: Award,
    items: [
      { k: "GI: Naga Mircha", v: "Nagaland (King Chili)" },
      { k: "GI: Lepcha Instruments", v: "Sikkim" },
      { k: "GI: Ambaji Marble", v: "Gujarat" },
      { k: "GI: Tezpur Lychee", v: "Assam" },
      { k: "Fest: Hornbill", v: "Nagaland (Partners: UK, Switz + 3)" }
    ]
  },
  {
    category: "Airports & Firsts",
    icon: Plane,
    items: [
      { k: "Gen Z Post Office", v: "IIT Delhi (First in India) <span class='text-green-600 font-bold text-xs'>[CORRECTED]</span>" },
      { k: "Anna Int. Airport", v: "Chennai" },
      { k: "Indira Gandhi Int.", v: "Delhi (Water-Positive)" }
    ]
  }
];

const CURRENT_AFFAIRS = [
  {
    month: "Nov-Dec 2025 Capsule",
    sections: [
      {
        type: "Appointments (Updated)",
        icon: Users,
        color: "blue",
        points: [
          "**Indira Gandhi Prize:** Michelle Bachelet (Chile). <span class='text-green-600 font-bold text-xs'>[CORRECTED]</span>",
          "**Bihar CM (10th):** Nitish Kumar (Nov 20).",
          "**UNESCO DG:** Khaled El-Enany (Egypt). <span class='text-amber-600 text-xs font-bold ml-1 bg-amber-50 px-1 rounded border border-amber-100'>🔥 x2</span>",
          "**Brand Amb (Haryana):** Shefali Verma (Women's Comm).",
          "**CJI (53rd):** Justice Surya Kant.",
          "**Miss Universe:** Fatima Bosh (Mexico)."
        ]
      },
      {
        type: "Defense & Military",
        icon: Swords,
        color: "red",
        points: [
          "**Garud 2025:** India & France (Mont-de-Marsan).",
          "**Ajay Warrior:** India & UK (Rajasthan).",
          "**Goa Police:** 100% Cyber Fraud Response Rate.",
          "**Production:** Record ₹1.54 Lakh Cr. <span class='text-amber-600 text-xs font-bold ml-1 bg-amber-50 px-1 rounded border border-amber-100'>🔥 x2</span>",
          "**Deals:** HAMMER Missiles (France)."
        ]
      },
      {
        type: "Sports (Winners & Hosts)",
        icon: Trophy,
        color: "amber",
        points: [
          "**CWG 2030:** Ahmedabad, India.",
          "**Kabaddi WC:** Chinese Taipei def. India. <span class='text-amber-600 text-xs font-bold ml-1 bg-amber-50 px-1 rounded border border-amber-100'>🔥 x2</span>",
          "**Badminton:** Lakshya Sen (Aus Open). <span class='text-amber-600 text-xs font-bold ml-1 bg-amber-50 px-1 rounded border border-amber-100'>🔥 x2</span>",
          "**Tennis:** Federer Hall of Fame (2026).",
          "**U19 WC 2026:** Zimbabwe & Namibia."
        ]
      },
      {
        type: "Economy & World",
        icon: Briefcase,
        color: "emerald",
        points: [
          "**FTA:** India-Israel (Signed Nov 28). <span class='text-amber-600 text-xs font-bold ml-1 bg-amber-50 px-1 rounded border border-amber-100'>🔥 x2</span>",
          "**Malaysia:** Social Media ban <16 (Jan 2026).",
          "**Health:** Marburg Virus outbreak (Ethiopia).",
          "**Sweden:** First fully cashless society."
        ]
      },
      {
        type: "Important Days (Rapid Fire)",
        icon: Zap,
        color: "purple",
        points: [
          "**26 Nov:** Constitution Day (76th) <span class='text-amber-600 text-xs font-bold'>x2</span>",
          "**1 Dec:** World AIDS Day <span class='text-amber-600 text-xs font-bold'>x2</span>",
          "**2 Dec:** Comp Literacy Day <span class='text-amber-600 text-xs font-bold'>x2</span>",
          "**3 Dec:** Disabilities Day <span class='text-amber-600 text-xs font-bold'>x2</span>",
          "**1 Dec:** Nagaland Statehood Day"
        ]
      }
    ]
  }
];

const RBI_DATA = [
    {
        title: "Monetary Policy Rates (Check Pre-Exam)",
        content: [
            "**Repo Rate:** 6.50% (Benchmarks liquidity)",
            "**Reverse Repo Rate:** 3.35%",
            "**SDF (Standing Deposit Facility):** 6.25% (No collateral needed)",
            "**MSF (Marginal Standing Facility):** 6.75%",
            "**Bank Rate:** 6.75% (Long term loans)",
            "**CRR:** 4.50% (Cash Reserve Ratio - held with RBI)",
            "**SLR:** 18.00% (Statutory Liquidity Ratio - held by Bank)"
        ]
    },
    {
        title: "Instruments & Tools",
        content: [
            "**LAF (Liquidity Adjustment Facility):** Manages daily liquidity using Repo & Reverse Repo.",
            "**OMO (Open Market Operations):** Buying/Selling G-Secs to control money supply.",
            "**PCA (Prompt Corrective Action):** Triggered when banks breach thresholds of Capital, Asset Quality, or Leverage.",
            "**e₹ (Digital Rupee):** CBDC using blockchain technology."
        ]
    },
    {
        title: "History & Structure",
        content: [
            "**Establishment:** April 1, 1935 (RBI Act 1934).",
            "**Nationalisation:** Jan 1, 1949.",
            "**Headquarters:** Mumbai (Moved from Kolkata in 1937).",
            "**First Governor:** Sir Osborne Smith.",
            "**First Indian Governor:** C.D. Deshmukh.",
            "**Board:** 21 Members (1 Gov + 4 Deputy Govs + 14 Others)."
        ]
    }
];

const MINISTRY_DATA = {
    static: [
        { portfolio: "Defense", name: "Rajnath Singh" },
        { portfolio: "Home Affairs & Cooperation", name: "Amit Shah" },
        { portfolio: "Finance & Corporate Affairs", name: "Nirmala Sitharaman" },
        { portfolio: "External Affairs", name: "Dr. S. Jaishankar" },
        { portfolio: "Road Transport & Highways", name: "Nitin Gadkari" },
        { portfolio: "Railways, I&B, IT", name: "Ashwini Vaishnaw" },
        { portfolio: "Education & Skill Dev", name: "Dharmendra Pradhan" },
        { portfolio: "Commerce, Industry & Consumer", name: "Piyush Goyal" },
        { portfolio: "Agriculture", name: "Shivraj Singh Chouhan (Verify)" }
    ],
    news: [
        "**Ministry of Steel:** Launched **SARAL SIMS** portal for import monitoring.",
        "**Ministry of Agriculture:** Released **PM Kisan 21st Installment** (₹18k Cr) in Coimbatore.",
        "**Ministry of Defense:** Achieved record defense production of **₹1.54 Lakh Cr** in FY25.",
        "**Ministry of Finance:** GST collections consistently crossing ₹1.7 Lakh Cr mark.",
        "**Ministry of Cooperation:** Amit Shah inaugurated 'Bharat Organics' cooperative."
    ]
};

const GkMania: React.FC = () => {
    const [view, setView] = useState<'menu' | 'banking' | 'static' | 'current' | 'rbi' | 'ministries'>('menu');

    if (view === 'menu') {
        return (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
                        <Globe className="text-blue-600" size={40} />
                        GK Mania
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Your repository for Banking Awareness, Static Facts, RBI Frameworks, and Current Affairs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Banking Awareness */}
                    <div 
                        onClick={() => setView('banking')}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-indigo-200 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Landmark size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">Banking Awareness</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Acts, Headquarters, Limits, and History. The core of Mains.
                            </p>
                        </div>
                        <button className="relative z-10 w-full bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            Open Vault <ChevronLeft className="rotate-180" size={16} />
                        </button>
                    </div>

                    {/* RBI Vault (NEW) */}
                    <div 
                        onClick={() => setView('rbi')}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-amber-300 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-amber-200 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Scale size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">RBI Vault</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Monetary Policy Rates, Tools (LAF/MSF), History & Frameworks.
                            </p>
                        </div>
                        <button className="relative z-10 w-full bg-amber-50 text-amber-600 py-3 rounded-xl font-bold text-sm hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            View Policy <ChevronLeft className="rotate-180" size={16} />
                        </button>
                    </div>

                    {/* Ministries (NEW) */}
                    <div 
                        onClick={() => setView('ministries')}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-purple-300 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-purple-200 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Gavel size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">Indian Ministries</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Cabinet Portfolios, Latest Schemes, Portals & Actions.
                            </p>
                        </div>
                        <button className="relative z-10 w-full bg-purple-50 text-purple-600 py-3 rounded-xl font-bold text-sm hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            Check Cabinet <ChevronLeft className="rotate-180" size={16} />
                        </button>
                    </div>

                    {/* Static GK */}
                    <div 
                        onClick={() => setView('static')}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-emerald-200 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MapPin size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">Static GK</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                National Parks, Airports, Dances, and International HQs.
                            </p>
                        </div>
                        <button className="relative z-10 w-full bg-emerald-50 text-emerald-600 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            Explore Map <ChevronLeft className="rotate-180" size={16} />
                        </button>
                    </div>

                    {/* Current Affairs */}
                    <div 
                        onClick={() => setView('current')}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-rose-300 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-rose-200 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Newspaper size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-rose-600 transition-colors">Current Affairs</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Monthly timelines categorized by Appointments, Defense, and Sports.
                            </p>
                        </div>
                        <button className="relative z-10 w-full bg-rose-50 text-rose-600 py-3 rounded-xl font-bold text-sm hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            Read News <ChevronLeft className="rotate-180" size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- SUB-VIEWS ---

    if (view === 'banking') {
        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 pb-10">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setView('menu')} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <Landmark className="text-indigo-600" size={24} />
                        Banking Awareness
                    </h1>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {BANKING_AWARENESS.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-indigo-900 mb-4 border-b border-slate-100 pb-2">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.content.map((point, pIdx) => (
                                    <li key={pIdx} className="flex gap-3 text-slate-700 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                                        <span dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-slate-900">$1</span>') }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (view === 'rbi') {
        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 pb-10">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setView('menu')} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <Scale className="text-amber-600" size={24} />
                        RBI Vault
                    </h1>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {RBI_DATA.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-amber-700 mb-4 border-b border-slate-100 pb-2">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.content.map((point, pIdx) => (
                                    <li key={pIdx} className="flex gap-3 text-slate-700 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                                        <span dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-slate-900">$1</span>') }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (view === 'ministries') {
        return (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 pb-10">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setView('menu')} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <Gavel className="text-purple-600" size={24} />
                        Indian Ministries
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cabinet Ministers */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center gap-3">
                           <Users className="text-purple-700" size={20} />
                           <h3 className="font-bold text-purple-800">Cabinet Portfolios (Static)</h3>
                        </div>
                        <div className="p-0">
                           {MINISTRY_DATA.static.map((item, idx) => (
                               <div key={idx} className="flex justify-between items-center p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors last:border-0">
                                   <div className="text-sm font-medium text-slate-500">{item.portfolio}</div>
                                   <div className="text-sm font-bold text-slate-800">{item.name}</div>
                               </div>
                           ))}
                        </div>
                    </div>

                    {/* Ministry News */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-fit">
                        <div className="bg-rose-50 p-4 border-b border-rose-100 flex items-center gap-3">
                           <Newspaper className="text-rose-700" size={20} />
                           <h3 className="font-bold text-rose-800">Ministry Actions (Latest)</h3>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-4">
                                {MINISTRY_DATA.news.map((news, idx) => (
                                    <li key={idx} className="flex gap-3 text-slate-700 leading-relaxed text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></div>
                                        <span dangerouslySetInnerHTML={{ __html: news.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-slate-900">$1</span>') }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'static') {
        return (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 pb-10">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setView('menu')} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <MapPin className="text-emerald-600" size={24} />
                        Static GK
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {STATIC_GK.map((section, idx) => {
                        const Icon = section.icon;
                        return (
                            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                        <Icon size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">{section.category}</h3>
                                </div>
                                <div className="space-y-3">
                                    {section.items.map((item, iIdx) => (
                                        <div key={iIdx} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                            <span className="text-slate-600 font-medium text-sm">{item.k}</span>
                                            <span className="text-slate-800 font-bold text-sm text-right" dangerouslySetInnerHTML={{ __html: item.v.replace(/🔥 x2/g, '<span class="text-amber-600 bg-amber-50 px-1 rounded text-xs ml-1">🔥 x2</span>') }}></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

    if (view === 'current') {
        return (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 pb-10">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setView('menu')} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <Newspaper className="text-rose-600" size={24} />
                        Current Affairs Timeline
                    </h1>
                </div>

                {CURRENT_AFFAIRS.map((monthData, mIdx) => (
                    <div key={mIdx} className="space-y-6">
                         <div className="flex items-center gap-4">
                            <div className="h-px bg-slate-300 flex-1"></div>
                            <span className="bg-slate-800 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                                <CalendarDays size={14} /> {monthData.month}
                            </span>
                            <div className="h-px bg-slate-300 flex-1"></div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {monthData.sections.map((sec, sIdx) => {
                                const Icon = sec.icon;
                                // Color Map
                                const colors = {
                                    blue: "bg-blue-50 text-blue-700 border-blue-100",
                                    red: "bg-red-50 text-red-700 border-red-100",
                                    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
                                    amber: "bg-amber-50 text-amber-700 border-amber-100",
                                    purple: "bg-purple-50 text-purple-700 border-purple-100"
                                };
                                const theme = colors[sec.color as keyof typeof colors];

                                return (
                                    <div key={sIdx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className={`px-6 py-4 border-b flex items-center gap-3 ${theme}`}>
                                            <Icon size={20} />
                                            <h3 className="font-bold">{sec.type}</h3>
                                        </div>
                                        <div className="p-6">
                                            <ul className="space-y-3">
                                                {sec.points.map((pt, pIdx) => (
                                                    <li key={pIdx} className="text-sm text-slate-600 leading-relaxed pl-3 border-l-2 border-slate-200">
                                                        <span dangerouslySetInnerHTML={{ __html: pt.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-slate-800">$1</span>') }} />
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                );
                            })}
                         </div>
                    </div>
                ))}
            </div>
        );
    }

    return null;
};

export default GkMania;
