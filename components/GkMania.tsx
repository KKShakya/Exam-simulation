
import React, { useState } from 'react';
import { Globe, Building2, MapPin, Newspaper, ChevronLeft, Landmark, Plane, Users, Swords, Briefcase, Award, Zap, CalendarDays, Trophy, Laptop, Gavel, Scale, AlertTriangle, FileWarning, ClipboardList, Sparkles, Flower2, Music } from 'lucide-react';

// Data Structures

const BANKING_AWARENESS = [
  {
    title: "Financial Markets (Concepts)",
    content: [
      "**Money Market:** Short-term funds (< 1 Year). Regulated by RBI. <br/><span class='text-xs text-slate-500 ml-4'>Instruments: T-Bills, Certificate of Deposit (CD), Commercial Paper.</span>",
      "**Capital Market:** Long-term funds (> 1 Year). Regulated by SEBI. <br/><span class='text-xs text-slate-500 ml-4'>Instruments: Shares, Debentures, Bonds.</span>"
    ]
  },
  {
    title: "Accounts: NRE vs NRO (Tax Rule)",
    content: [
      "**NRE Account (External):** Money earned *Outside* India. <span class='text-green-600 font-bold bg-green-50 px-1 rounded'>Tax-Free</span> in India.",
      "**NRO Account (Ordinary):** Money earned *Inside* India (e.g., Rent, Dividends). <span class='text-red-600 font-bold bg-red-50 px-1 rounded'>Taxable</span>."
    ]
  },
  {
    title: "Acts & Limits (Crucial Traps)",
    content: [
      "**Payments Bank:** Max Deposit **₹2 Lakh**. Cannot lend. <span class='text-amber-600 text-xs font-bold ml-1 bg-amber-50 px-1 rounded border border-amber-100'>🔥 Trap: SFB has NO limit</span>",
      "**SARFAESI Act (2002):** Banks can seize assets for NPA. <span class='text-amber-600 text-xs font-bold ml-1'>Exemption: Agricultural Land</span>.",
      "**NPCI:** Retail Payments Umbrella (UPI/RuPay). Est 2008.",
      "**PFRDA:** Pension Regulator. HQ: New Delhi."
    ]
  },
  {
    title: "Govt Schemes & Investments",
    content: [
      "**PM Kisan (21st):** Released from Coimbatore. ₹18k Cr.",
      "**PM Fasal Bima:** 'Wild Animal Attacks' added (Kharif 2026).",
      "**Adani in Assam:** ₹63k Cr Inv confirmed."
    ]
  },
  {
    title: "Legal Framework (Statutory Acts)",
    content: [
      "**Scheduled Banks:** Defined under **Section 2(e)** of RBI Act, 1934 (Second Schedule).",
      "**CRR:** Mandated under **Section 42(1)** of RBI Act, 1934.",
      "**SLR:** Mandated under **Section 24** of Banking Regulation Act, 1949.",
      "**NPCI Status:** Section 8 of Companies Act, 2013 (Not-for-Profit). (Old: Sec 25)."
    ]
  },
  {
    title: "Evolution of Payment Systems",
    content: [
      "**2004:** **RTGS** (Real Time Gross Settlement) launched.",
      "**2005:** **NEFT** launched by **IDRBT** (Later handed to RBI).",
      "**2008:** **NPCI** established.",
      "**2010:** **IMPS** (Immediate Payment) & **CTS** (Cheque Truncation).",
      "**2016:** **UPI** & **BBPS** launched."
    ]
  },
  {
    title: "Operational Norms (KYC & Codes)",
    content: [
      "**KYC Cycles:** High Risk (2Y), Medium Risk (8Y), Low Risk (10Y).",
      "**MICR Code:** 9 Digits (3 City, 3 Bank, 3 Branch). Used for Cheques.",
      "**IFSC Code:** 11 Characters. Used for NEFT/RTGS.",
      "**Plastic Money:** Refers specifically to Credit & Debit Cards."
    ]
  },
  {
    title: "Financial Inclusion & History",
    content: [
      "**Launch:** Officially in **2005** (C. Rangarajan Committee).",
      "**First Merger:** PNB + New Bank of India (**1993**).",
      "**Key Schemes:** BSBDA (2012, ex-No Frills), PMJDY (2014), Mudra (2015)."
    ]
  },
  {
    title: "Market Mechanics (Deep Dive)",
    content: [
      "**LAF (Liquidity Adjustment):** Primary tool. Repo (Injects) & Reverse Repo (Absorbs).",
      "**Repo Rate:** Rate at which RBI lends to Commercial Banks.",
      "**SLR Composition:** Cash, Gold, or G-Secs. <span class='text-red-600 font-bold bg-red-50 px-1 rounded text-xs'>Equity NOT allowed</span>."
    ]
  }
];

const STATIC_GK = [
  {
    category: "Indian Festivals & Heritage",
    icon: Sparkles,
    items: [
      { k: "UNESCO Heritage", v: "Durga Puja, Diwali (Latest), Garba, Chhau, Kumbh" },
      { k: "Hornbill Festival", v: "Nagaland (Partners: UK, Denmark, Ireland)" },
      { k: "Ambubachi Mela", v: "Kamakhya Temple, Assam" },
      { k: "New Year (Losar)", v: "Ladakh, Sikkim, Himachal (Tibetan Buddhist)" },
      { k: "New Year (Vishu)", v: "Kerala" },
      { k: "Floral Festival", v: "Bathukamma (Telangana)" },
      { k: "Buddhist Festivals", v: "Saga Dawa & Losung (Sikkim)" },
      { k: "Parsi New Year", v: "Navroz" }
    ]
  },
  {
    category: "Temple & Regional Fairs",
    icon: Landmark,
    items: [
      { k: "Pushkar Fair", v: "Rajasthan (Lord Brahma & Camel Fair)" },
      { k: "Karni Mata Fair", v: "Deshnok, Rajasthan (Famous for Rats)" },
      { k: "Odisha Harvest", v: "Nuakhai, Dhanuyatra, Bali Jatra, Raj Parv" },
      { k: "Meghalaya", v: "Cherry Blossom Festival (Oct-Nov)" },
      { k: "Mizoram", v: "Chapchar Kut" },
      { k: "Tripura", v: "Kharchi Puja" },
      { k: "Surajkund Mela", v: "Faridabad, Haryana (Sun God linked)" }
    ]
  },
  {
    category: "GK Tricks & Mnemonics",
    icon: Zap,
    items: [
      { k: "Bihu (Assam)", v: "Mnemonic: 'Assam ki Bahu' (Harvest)" },
      { k: "O-P Pair", v: "O = Onam (Kerala) | P = Pongal (Tamil Nadu)" },
      { k: "PESO Countries", v: "MACD CPU (Mex, Arg, Chile, Dom, Col, Phil, Uru)" },
      { k: "RUPEE Countries", v: "Maldives, Maur, SL, Nepal, Ind, Indo, Sey, Pak" },
      { k: "Dinar (Click-Sabt)", v: "Kuwait, Libya, Iraq, Jordan, Serb, Alg, Bah, Tun" }
    ]
  },
  {
    category: "Intl. Orgs & HQs (Grouped)",
    icon: Building2,
    items: [
      { k: "Vienna (Energy/Ind)", v: "UNIDO, OPEC, IAEA" },
      { k: "Montreal", v: "WADA (Anti-Doping)" },
      { k: "Lausanne", v: "FIDE (Chess)" },
      { k: "Jakarta", v: "ASEAN" },
      { k: "Kuala Lumpur", v: "Asian Hockey Federation" },
      { k: "New York", v: "UNFPA (Note: UNEP is Nairobi)" }
    ]
  },
  {
    category: "Power Plants & Nature",
    icon: Globe,
    items: [
      { k: "Kaiga Atomic", v: "Karnataka (Record 962 Days)" },
      { k: "Mundra Thermal", v: "Gujarat (Adani) 🔥 Not Atomic" },
      { k: "Ramsar Sites", v: "Chilika (1st), Bhitarkanika (OD). Total: 96" },
      { k: "Tiger State", v: "Madhya Pradesh (Nauradehi TR)" },
      { k: "Floating Solar", v: "Omkareshwar, MP" }
    ]
  }
];

const CURRENT_AFFAIRS = [
  {
    month: "Feb 2026 Strategy (Static Linked)",
    sections: [
      {
        type: "🚨 Critical Corrections",
        icon: AlertTriangle,
        color: "red",
        points: [
          "**Dinar Mnemonic:** **K-L-I-J-S-A-B-T** (Click-Sabt).",
          "**Countries:** Kuwait, Libya, Iraq, Jordan, Serbia, Algeria, Bahrain, Tunisia.",
          "**Correction:** 'Bisquit' is incorrect. Iran uses Rial. 'U' is invalid.",
          "**Typo Alert:** **Daporijo** Airport (Arunachal), not 'Poriju'."
        ]
      },
      {
        type: "Stream B: News-Linked Static",
        icon: Zap,
        color: "blue",
        points: [
          "**Tiroda Thermal Plant:** **Gondia, Maharashtra** (Adani). News: ADB Funding.",
          "**Green Hydrogen Ports:** Deendayal (GJ), Paradip (OD), VOC (TN).",
          "**Bhoj Wetland:** **Bhopal, MP**. News: De-notification threat.",
          "**Rana Pratap Sagar Dam:** **Chambal River**, Rajasthan.",
          "**Airports in News:** Daporijo & Tezu (Arunachal), Devi Ahilyabai (Indore)."
        ]
      },
      {
        type: "Stream A: Pure Static",
        icon: Building2,
        color: "emerald",
        points: [
          "**UNFPA HQ:** **New York** (UNEP is Nairobi).",
          "**MICR:** Magnetic Ink Character Recognition.",
          "**Murugappa Gold Cup:** Hockey.",
          "**Pulitzer:** Journalism/Lit/Music (US)."
        ]
      },
      {
        type: "Currency Power Players",
        icon: Globe,
        color: "amber",
        points: [
          "**Won:** South & North Korea.",
          "**Yen:** Japan. **Yuan:** China.",
          "**Rand:** South Africa. **Real:** Brazil.",
          "**Krona:** Iceland (Reykjavik). **Dirham:** Morocco."
        ]
      }
    ]
  },
  {
    month: "Nov-Dec 2025 (Blockbuster Verified)",
    sections: [
      {
        type: "😲 The 'Unlikely' Real Events",
        icon: Zap,
        color: "red",
        points: [
          "**Nepal Interim PM:** **Sushila Karki** (Former Chief Justice).",
          "**FIFA Peace Prize:** **Donald Trump** (Dec 2025) presented by Infantino.",
          "**Tata in Morocco:** First overseas defense plant (Casablanca) for **WhAP 8x8**."
        ]
      },
      {
        type: "State & Summits",
        icon: Globe,
        color: "blue",
        points: [
          "**Tamil Nadu:** First ID Cards for **Women SHGs** (25kg free luggage).",
          "**ASEAN:** 11 Members (Newest: **Timor-Leste**).",
          "**FIFA WC 2026:** Hosts **Canada, Mexico, USA**."
        ]
      }
    ]
  },
  {
    month: "Dec 2025 (Stream B - Verified)",
    sections: [
      {
        type: "🚨 Critical Traps (Sound-Alike)",
        icon: AlertTriangle,
        color: "red",
        points: [
          "**Helicopter Deal:** **MH-60 Romeo** (USA) ≠ MA-60 (China).",
          "**Scheme Name:** **Tech-Textiles/Tex-Fund** (Textile Min) ≠ Tax-RAM.",
          "**UNESCO Role:** India in **Exec Board** (25-29) ≠ Director (Audrey Azoulay)."
        ]
      },
      {
        type: "Banking & Economy",
        icon: Landmark,
        color: "blue",
        points: [
          "**Rare Earth Scheme:** Cabinet approved **₹7,280 Cr** for magnets (EVs).",
          "**RBI Penalty:** **₹3.10 Lakh** on Manna Krishna Investments (NBFC).",
          "**ADB Loan:** **$400 Million** for Maharashtra (Rural Conn).",
          "**Tea Exports:** India is **2nd** (China is 1st)."
        ]
      },
      {
        type: "Defense & Exercises",
        icon: Swords,
        color: "emerald",
        points: [
          "**Ekuverin:** India-Maldives at **Thiruvananthapuram, Kerala**.",
          "**Harimau Shakti:** India-Malaysia at **Rajasthan**."
        ]
      },
      {
        type: "Appointments",
        icon: Briefcase,
        color: "purple",
        points: [
          "**RBI ED:** Usha Janakiraman (Dec 1).",
          "**PNB ED:** Amit Kumar Srivastava.",
          "**DP World Amb:** Abhishek Sharma (Cricketer).",
          "**Intl IDEA Chair:** Gyanesh Kumar (CEC)."
        ]
      },
      {
        type: "Awards & Records",
        icon: Trophy,
        color: "amber",
        points: [
          "**Riyadh Metro:** Guinness Record **Longest Driverless** (176km). <span class='text-xs bg-amber-100 text-amber-800 px-1 rounded'>Exam Trap: Longest = Shanghai</span>",
          "**Water Positive:** IGIA (Delhi) - First major airport.",
          "**Obituary:** Kumari Kamala (Bharatanatyam, 91)."
        ]
      }
    ]
  },
  {
    month: "Nov-Dec 2025 Capsule",
    sections: [
      {
        type: "National & Tech (New)",
        icon: Globe,
        color: "blue",
        points: [
          "**Maldives:** Tobacco ban for those born after **Jan 1, 2007**.",
          "**Social Media Ban:** Denmark (<15), Australia (<16).",
          "**Google Project:** **'Suncatcher'** (Space AI). <span class='text-green-600 font-bold text-xs'>[CORRECTED]</span>",
          "**Climate Risk Index:** India Ranked **6th** (Worsened). <span class='text-green-600 font-bold text-xs'>[CORRECTED]</span>",
          "**JSW Energy:** Green Hydrogen at **Vijayanagar, KA**."
        ]
      },
      {
        type: "Appointments & Awards",
        icon: Award,
        color: "amber",
        points: [
          "**PFRDA Chair:** Sivasubramanian Ramann.",
          "**Brand Amb:** Rahul Dravid (Paradeep Phosphates).",
          "**Nobel:** James Watson (DNA) passed away (1962 Winner).",
          "**NHPC Jubilee:** ₹50 Commemorative Coin released.",
          "**CJI (53rd):** Justice Surya Kant."
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
          "**Production:** Record ₹1.54 Lakh Cr."
        ]
      },
      {
        type: "Key Updates (Prev)",
        icon: Users,
        color: "purple",
        points: [
          "**Indira Gandhi Prize:** Michelle Bachelet (Chile).",
          "**Bihar CM (10th):** Nitish Kumar.",
          "**UNESCO DG:** Khaled El-Enany (Egypt).",
          "**Miss Universe:** Fatima Bosh (Mexico)."
        ]
      },
      {
        type: "Important Days",
        icon: Zap,
        color: "emerald",
        points: [
          "**26 Nov:** Constitution Day (76th)",
          "**1 Dec:** World AIDS Day",
          "**2 Dec:** Comp Literacy Day",
          "**3 Dec:** Disabilities Day"
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

// NEW RECOVERY DATA SET
const RECOVERY_DATA = [
  {
    title: "📂 Recovery Set 1: Marathon Details",
    icon: Zap,
    color: "amber",
    items: [
      {
        topic: "Appointments (Tenures & Specifics)",
        points: [
          "**Sandeep Pradhan:** SEBI WTM for **3 Years**.",
          "**Justice Vikram Nath:** Exec Chairman of **NALSA**.",
          "**Rahul Dravid:** Brand Amb for **Paradip Phosphates**.",
          "**Rohit Sharma:** Amb for **ICC T20 WC 2026**."
        ]
      },
      {
        topic: "Defense & Locations",
        points: [
          "**Garud 2025:** Held at **Mont-de-Marsan Air Base**, France.",
          "**Surya Kiran:** Held at **Pithoragarh, Uttarakhand**.",
          "**Deep Ocean Mission:** Phase 1 lab at **500m depth** (Target 6000m).",
          "**Ikubarin:** Joint Ex with **Maldives** (Standard) / Malawi (Note)."
        ]
      },
      {
        topic: "Stats & One-Liners",
        points: [
          "**Defense Production:** Record **₹1.54 Lakh Cr**.",
          "**Tea Exports:** India Rank **2nd** (China 1st).",
          "**Driverless Metro:** Guinness Record **146 Stations**.",
          "**Nov 26:** Constitution Day (76th).",
          "**Nov 21:** World TV Day | **Dec 1:** Nagaland Day."
        ]
      }
    ]
  },
  {
    title: "📂 Recovery Set 2: Nov-Dec Deep Dive",
    icon: AlertTriangle,
    color: "red",
    items: [
      {
        topic: "Phonetic Corrections (Crucial)",
        points: [
          "**'Gen Z' Post Office:** At **IIT Delhi** (Not 'Janjiri').",
          "**Michelle Bachelet:** Indira Gandhi Prize (Not 'Misal').",
          "**Hayli Gubbi:** Ethiopian Volcano Eruption (Not 'Hailu')."
        ]
      },
      {
        topic: "Schemes & Cities",
        points: [
          "**PM Kisan (21st):** Released from **Coimbatore, TN**.",
          "**PM Fasal Bima:** Added cover for **'Wild Animal Attacks'**.",
          "**SBI:** Discontinued **'M-Cash'** service (Nov 30)."
        ]
      },
      {
        topic: "Banking & Economy",
        points: [
          "**HDFC Bank:** Top Brand Value **$44.9 Billion**.",
          "**Adani in Assam:** Total Investment **₹63,000 Cr**."
        ]
      },
      {
        topic: "State GI & Sports",
        points: [
          "**Nagaland:** Naga Mircha, Tomato Tree.",
          "**Sikkim:** Lepcha Instruments. **Gujarat:** Ambaji Marble.",
          "**Hockey WC 2026:** Hosts **Netherlands & Belgium**.",
          "**Kabaddi (Women):** India lost to **Chinese Taipei**."
        ]
      }
    ]
  },
  {
    title: "📂 Recovery Set 3: Alliances & Sports",
    icon: Globe,
    color: "blue",
    items: [
      {
        topic: "BIMSTEC (Mini SAARC)",
        points: [
          "**Members (7):** Bangladesh, Bhutan, India, Myanmar, SL, Thai, Nepal.",
          "**Est:** June 6, 1997 (Bangkok Declaration).",
          "**Sec Gen:** Indra Mani Pandey (India).",
          "**Chair:** Bangladesh."
        ]
      },
      {
        topic: "Sports Hosts & Awards",
        points: [
          "**Squash World Cup:** Chennai (3rd time host). India Rank: 3.",
          "**FIFA WC 2026:** Canada, Mexico, USA.",
          "**Dronacharya Award:** For Coaches."
        ]
      }
    ]
  }
];

const GkMania: React.FC = () => {
    const [view, setView] = useState<'menu' | 'banking' | 'static' | 'current' | 'rbi' | 'ministries' | 'recovery'>('menu');

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
                    {/* Recovery Card (NEW) */}
                    <div 
                        onClick={() => setView('recovery')}
                        className="bg-red-50 rounded-2xl p-6 shadow-lg border border-red-100 hover:shadow-xl hover:border-red-300 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-red-200 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ClipboardList size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-red-800 mb-2 group-hover:text-red-900 transition-colors">Master Recovery Sheet</h3>
                            <p className="text-red-600 text-sm leading-relaxed mb-6 font-medium">
                                The missing details. Specific dates, tenures, correct spellings, and "gap-fillers" from Marathon sessions.
                            </p>
                        </div>
                        <button className="relative z-10 w-full bg-white text-red-600 py-3 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm border border-red-200">
                            Review Missing Data <ChevronLeft className="rotate-180" size={16} />
                        </button>
                    </div>

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

    if (view === 'recovery') {
        return (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 pb-10">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setView('menu')} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                            <ClipboardList className="text-red-600" size={24} />
                            Master Recovery Sheet
                        </h1>
                        <p className="text-slate-500 text-sm">Detailed stats & corrections missed in previous summaries.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {RECOVERY_DATA.map((section, idx) => {
                        const Icon = section.icon;
                        const colors = {
                            amber: "bg-amber-50 border-amber-200 text-amber-900",
                            red: "bg-red-50 border-red-200 text-red-900",
                            blue: "bg-blue-50 border-blue-200 text-blue-900"
                        }[section.color] || "bg-slate-50 border-slate-200 text-slate-900";

                        return (
                            <div key={idx} className={`rounded-2xl p-6 border shadow-sm ${colors}`}>
                                <div className="flex items-center gap-3 mb-6 border-b border-black/5 pb-4">
                                    <Icon size={24} className="opacity-75" />
                                    <h3 className="text-xl font-bold">{section.title}</h3>
                                </div>
                                <div className="space-y-6">
                                    {section.items.map((item, i) => (
                                        <div key={i}>
                                            <h4 className="text-sm font-bold opacity-70 uppercase tracking-wider mb-2">{item.topic}</h4>
                                            <ul className="space-y-2">
                                                {item.points.map((pt, p) => (
                                                    <li key={p} className="text-sm leading-relaxed flex gap-2">
                                                        <span className="opacity-50 mt-1.5">•</span>
                                                        <span dangerouslySetInnerHTML={{ __html: pt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
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
    }

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