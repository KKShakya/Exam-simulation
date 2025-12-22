
import React, { useState } from 'react';
import { Clock, GitMerge, Box, Scissors, Hash, AlertTriangle, Feather, ChevronLeft, BookOpen, GraduationCap, Crosshair, Layout, Link, Sparkles, ScanEye, CheckCircle2, Award, ChevronDown, ChevronUp, Link2, ExternalLink } from 'lucide-react';

// Data Structure for Rules
const ENGLISH_MODULES = [
  {
    id: 'm1',
    title: "MODULE 1: THE ENGINE (Subject-Verb Agreement)",
    icon: Box,
    color: "blue",
    points: [
      {
        title: "The 'Group vs. Specific' Trap",
        content: "• A Number of (Many) → Plural Verb\n• The Number of (Count) → Singular Verb\n\n❌ Wrong: A number of boys is absent.\n✅ Right: A number of boys are absent.\n✅ Right: The number of boys is 50."
      },
      {
        title: "The 'One of...' Matrix",
        content: "• One of + Plural Noun → Singular Verb\n• One of + Plural + WHO/THAT → Plural Verb\n• ONLY One of + Plural + WHO → Singular Verb\n\n✅ Right: One of the boys is smart.\n✅ Right: He is one of the boys who are smart.\n✅ Right: He is the only one of the boys who is smart."
      },
      {
        title: "Connector Logic",
        content: "• Distance (As well as, Along with) → Match 1st Subject.\n• Proximity (Neither..Nor, Or) → Match Nearest Subject.\n\n✅ Right: The Captain, along with players, was present.\n✅ Right: Neither the captain nor the players were present."
      },
      {
        title: "The Ghost Subject",
        content: "• Gerunds (V-ing start) → Singular Verb.\n\n❌ Wrong: Smoking cigarettes cause cancer.\n✅ Right: Smoking cigarettes causes cancer."
      }
    ]
  },
  {
    id: 'm2',
    title: "MODULE 2: THE TIMELINE (Tenses & Time)",
    icon: Clock,
    color: "amber",
    points: [
      {
        title: "The 'Past' Showdown",
        content: "• Simple Past (V2) → Dead Time (Yesterday, In 2010).\n• Present Perfect (Has/Have+V3) → Alive/Recent Impact.\n\n❌ Wrong: I have met him yesterday.\n✅ Right: I met him yesterday.\n✅ Right: I have just met him."
      },
      {
        title: "The 'Math' of Time",
        content: "• Since → Start Point.\n• For → Duration.\n• Rule: Must use Perfect Tense (Has been). Never 'is working'.\n\n❌ Wrong: He is working here since 2010.\n✅ Right: He has been working here since 2010."
      },
      {
        title: "The 'Fake Past' Idiom",
        content: "• It is time / High time → Always V2 (Simple Past).\n\n❌ Wrong: It is high time we start.\n✅ Right: It is high time we started."
      }
    ]
  },
  {
    id: 'm3',
    title: "MODULE 3: LOGIC & CONNECTORS",
    icon: GitMerge,
    color: "purple",
    points: [
      {
        title: "Conditional Formulas",
        content: "• Real Future: If + Present ... Will.\n• Unreal Present: If + V2 ... Would.\n• Impossible Past: If + Had + V3 ... Would Have + V3.\n\n✅ Right: If I were a bird, I would fly.\n✅ Right: If he had studied, he would have passed."
      },
      {
        title: "The 'Certainty' Scale",
        content: "• That → Fact/Certainty.\n• Whether → Doubt/Choice.\n• 'Or not' at end? → Strictly 'Whether'.\n\n❌ Wrong: I doubt that he will come.\n✅ Right: I doubt whether he will come."
      },
      {
        title: "Negative Purpose (Lest)",
        content: "• Lest + Subject + SHOULD.\n• Never use 'Not' or 'Will' with Lest.\n\n❌ Wrong: Work hard lest you will fail.\n✅ Right: Work hard lest you should fail."
      }
    ]
  },
  {
    id: 'm4',
    title: "MODULE 4: PREPOSITIONS (Geometry)",
    icon: Box,
    color: "emerald",
    points: [
      {
        title: "Motion vs Position",
        content: "• IN (Static) vs INTO (Motion).\n• ON (Static) vs ONTO (Motion).\n\n✅ Right: He is in the room.\n✅ Right: He walked into the room."
      },
      {
        title: "Dimensions",
        content: "• Across → 2D Surface/Bridge.\n• Through → 3D Tunnel/Medium.\n\n✅ Right: Walk across the road.\n✅ Right: Train passed through the tunnel."
      },
      {
        title: "Verb Connections",
        content: "• Transitive (Discuss, Enter) → NO Prep.\n• Intransitive (Listen to, Agree with) → NEEDS Prep.\n\n❌ Wrong: Discuss about the matter.\n✅ Right: Discuss the matter."
      },
      {
        title: "Agent Rule & Beside/s",
        content: "• By (Living) vs With (Tool).\n• Beside → Location.\n• Besides → Addition (+).\n\n✅ Right: Killed by Ram with a knife.\n✅ Right: Beside me (Location).\n✅ Right: Besides English (In addition to)."
      }
    ]
  },
  {
    id: 'm5',
    title: "MODULE 5: MODIFIERS & TRAPS",
    icon: Scissors,
    color: "rose",
    points: [
      {
        title: "Inversion (Emphasis)",
        content: "• Starts with Hardly/Scarcely/Never? → Helper Verb comes before Subject.\n\n❌ Wrong: Never I have seen him.\n✅ Right: Never have I seen him."
      },
      {
        title: "Compound Adjectives",
        content: "• Number-Noun adjectives are never plural.\n\n❌ Wrong: A five-stars hotel.\n✅ Right: A five-star hotel."
      },
      {
        title: "Dangling Modifiers",
        content: "• V-ing starts? Subject after comma must be doer.\n\n❌ Wrong: Being rainy, I stayed home. (I am not rainy)\n✅ Right: It being rainy, I stayed home."
      },
      {
        title: "Comparison & Possessives",
        content: "• Same Group → 'Than any other'.\n• Latin (Senior/Junior) → take 'TO'.\n• Non-living → 'Of'.\n\n✅ Right: Better than any other boy.\n✅ Right: Senior to me.\n❌ Wrong: Table's leg. ✅ Right: Leg of table."
      }
    ]
  },
  {
    id: 'm6',
    title: "MODULE 6: ARTICLES",
    icon: Hash,
    color: "cyan",
    points: [
      {
        title: "Basics",
        content: "• A/An → General. The → Specific.\n• Abstract Nouns (Honesty) → Zero Article.\n\n❌ Wrong: The honesty is best policy.\n✅ Right: Honesty is the best policy.\n✅ Right: The honesty of this man is known."
      }
    ]
  },
  {
    id: 'm7',
    title: "MODULE 7: FREQUENT TRAPS",
    icon: AlertTriangle,
    color: "red",
    description: "The 'Killer' 5 - Most common error detection traps in Mains.",
    points: [
      {
        title: "1. WHO vs. WHOM (The 'M' Test)",
        content: "• WHO → Subject (He).\n• WHOM → Object (Him).\n\n❌ Wrong: The boy whom is coming.\n✅ Right: The boy who is coming. (He is coming)\n✅ Right: The boy whom I met. (I met Him)"
      },
      {
        title: "2. The 'Enough' Position",
        content: "• With Adjective/Adverb → Enough comes AFTER.\n• With Noun → Enough comes BEFORE.\n\n❌ Wrong: He is enough smart.\n✅ Right: He is smart enough.\n✅ Right: I have enough money."
      },
      {
        title: "3. Used to vs. Be Used to",
        content: "• Past Habit: 'Used to' + V1.\n• Addiction/Habit: 'Is/Am/Are used to' + V-ing.\n\n✅ Right: I used to drive. (Past)\n✅ Right: I am used to driving. (Habit)"
      },
      {
        title: "4. The 'Make' Passive Trap",
        content: "• Active: No 'to'.\n• Passive: Needs 'to'.\n\n✅ Active: He made me cry.\n✅ Passive: I was made to cry."
      },
      {
        title: "5. Pronoun Consistency",
        content: "• One... One's\n• Everyone... His\n\n❌ Wrong: One must do his duty.\n✅ Right: One must do one's duty."
      }
    ]
  },
  {
    id: 'm8',
    title: "MODULE 8: THE FINISHING TOUCHES",
    icon: Award,
    color: "indigo",
    description: "Advanced redundant errors, confusing pairs, and passive voice exceptions.",
    points: [
      {
        title: "1. The 'Superfluous' Trap (Redundancy)",
        content: "• Return back → Return\n• Revert back → Revert\n• Repeat again → Repeat\n• Final conclusion → Conclusion\n• Blunder mistake → Blunder\n• Cousin brother/sister → Cousin\n• Equally good as → As good"
      },
      {
        title: "2. Confusing Pairs (Mains)",
        content: "• Affect (Verb) vs Effect (Noun).\n• Beside (Next to) vs Besides (In addition).\n• Compliment (Praise) vs Complement (Complete).\n• Loose (Adj) vs Lose (Verb)."
      },
      {
        title: "3. Passive Voice Prepositions",
        content: "Most verbs take 'By', but some are special:\n• Known TO (not by)\n• Surprised AT\n• Filled WITH\n• Married TO"
      }
    ]
  },
  {
    id: 'm9',
    title: "MODULE 9: THE ROOTS (Etymology & Vocab)",
    icon: Link2,
    color: "emerald",
    description: "Decode thousands of words by mastering Latin and Greek roots.",
    points: [
      {
        title: "spec / spect (Latin: see, look)",
        content: "• **Example Words:** inspect, respect, spectator, perspective, spectacle\n• **💡 Mnemonic Trick:** SPECtacles help you see."
      },
      {
        title: "scrib / script (Latin: write)",
        content: "• **Example Words:** describe, manuscript, inscription, prescribe, subscription\n• **💡 Mnemonic Trick:** SCRIPT = written words."
      },
      {
        title: "dict (Latin: say)",
        content: "• **Example Words:** predict, contradict, verdict, dictionary, dictate\n• **💡 Mnemonic Trick:** DICTionary = collection of words said."
      },
      {
        title: "port (Latin: carry)",
        content: "• **Example Words:** transport, import, export, portable, deport\n• **💡 Mnemonic Trick:** PORTer carries luggage."
      },
      {
        title: "tract (Latin: pull, drag)",
        content: "• **Example Words:** attract, distract, contract, subtract, protract\n• **💡 Mnemonic Trick:** TRACTor pulls soil."
      },
      {
        title: "vid / vis (Latin: see)",
        content: "• **Example Words:** video, visual, evidence, invisible, revise\n• **💡 Mnemonic Trick:** VISion = ability to see."
      },
      {
        title: "form (Latin: shape)",
        content: "• **Example Words:** deform, reform, transform, uniform\n• **💡 Mnemonic Trick:** REform → make shape again."
      },
      {
        title: "voc / vok (Latin: call, voice)",
        content: "• **Example Words:** vocal, provoke, invoke, advocate\n• **💡 Mnemonic Trick:** VOCal = related to voice."
      },
      {
        title: "chrono (Greek: time)",
        content: "• **Example Words:** chronological, synchronize, anachronism\n• **💡 Mnemonic Trick:** Chrono = time (like chronometer)."
      },
      {
        title: "log / loqu (Greek/Latin: word, speech)",
        content: "• **Example Words:** dialogue, monologue, eloquent, logical\n• **💡 Mnemonic Trick:** LOGic → power of words."
      }
    ]
  }
];

const EnglishFever: React.FC = () => {
    const [expandedModule, setExpandedModule] = useState<string | null>('m1');

    const toggleModule = (id: string) => {
        if (expandedModule === id) {
            setExpandedModule(null);
        } else {
            setExpandedModule(id);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-12">
            <div className="relative mb-10">
                {/* External Vocab Link Button */}
                <a 
                  href="https://vocab-ka-power.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute top-0 right-0 hidden md:flex items-center gap-2 bg-pink-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-pink-700 transition-all shadow-lg hover:shadow-pink-200 hover:-translate-y-0.5 z-10"
                >
                  <BookOpen size={18} /> Vocab Learning <ExternalLink size={14} className="opacity-80" />
                </a>

                <div className="text-center space-y-4 pt-8 md:pt-2">
                    <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
                        <Feather className="text-pink-600" size={40} />
                        English Fever
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        The 120 Rules of Grammar & The Root Method condensed into 9 High-Impact Modules.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {ENGLISH_MODULES.map((module) => {
                    const Icon = module.icon;
                    const isExpanded = expandedModule === module.id;
                    
                    // Colors
                    const colorMap: Record<string, string> = {
                        blue: "bg-blue-50 text-blue-700 border-blue-100 hover:border-blue-300",
                        amber: "bg-amber-50 text-amber-700 border-amber-100 hover:border-amber-300",
                        purple: "bg-purple-50 text-purple-700 border-purple-100 hover:border-purple-300",
                        emerald: "bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-300",
                        rose: "bg-rose-50 text-rose-700 border-rose-100 hover:border-rose-300",
                        cyan: "bg-cyan-50 text-cyan-700 border-cyan-100 hover:border-cyan-300",
                        red: "bg-red-50 text-red-700 border-red-100 hover:border-red-300",
                        indigo: "bg-indigo-50 text-indigo-700 border-indigo-100 hover:border-indigo-300"
                    };
                    const themeClass = colorMap[module.color] || colorMap.blue;

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
                                        {module.description && (
                                            <p className="text-xs opacity-80 mt-1 font-medium">{module.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={20} />
                                </div>
                            </button>

                            <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
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
            
            <div className="mt-12 p-8 bg-slate-900 rounded-2xl text-white text-center shadow-xl">
                 <Sparkles className="mx-auto text-yellow-400 mb-4" size={32} />
                 <h3 className="text-xl font-bold mb-2">Pro Tip: The Root Strategy</h3>
                 <p className="text-slate-400 max-w-lg mx-auto mb-6">
                    Mastering 50 roots can unlock the meaning of 5000+ English words. When you see a new word, break it down like a puzzle.
                 </p>
            </div>
        </div>
    );
};

export default EnglishFever;
