
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, PhoneOff, Briefcase, Play, Loader2, Volume2, UserCheck, AlertCircle, ShieldCheck, X } from 'lucide-react';

// --- Audio Utilities ---

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Downsample to 16kHz for Gemini Input
function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
  const output = new DataView(new ArrayBuffer(input.length * 2));
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  return output.buffer;
}

// --- Component ---

const InterviewSimulator: React.FC = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [status, setStatus] = useState<string>('');
  
  // Permission Modal State
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [pendingPanelId, setPendingPanelId] = useState<string | null>(null);

  // Refs for Audio Contexts and Processor
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const scheduledSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  const PANELS = [
    {
      id: 'sbi_po',
      title: 'SBI PO Panel',
      desc: 'Strict, technical, and analytical. Focuses on Macroeconomics and Leadership.',
      color: 'bg-blue-600',
      instruction: `You are a strict and professional Senior Interviewer for the State Bank of India (SBI) PO Exam. 
      Start by asking the candidate to introduce themselves. 
      Ask deep follow-up questions on Banking Awareness (Repo Rate, Inflation, Budget) and Situational Ethics. 
      Keep your responses concise (under 2 sentences) to keep the conversation flowing. Be formal.`
    },
    {
      id: 'ibps_clerk',
      title: 'IBPS Clerk HR',
      desc: 'Friendly but tricky. Focuses on Customer Service and Basic Banking.',
      color: 'bg-emerald-600',
      instruction: `You are a friendly HR Manager for an IBPS Clerk interview. 
      Start by asking the candidate's name and hometown. 
      Focus on questions related to customer handling, patience, and basic banking terms (KYC, Savings Account). 
      Be encouraging but check their communication skills. Keep responses brief.`
    },
    {
      id: 'rrb_po',
      title: 'RRB Scale-I (Rural)',
      desc: 'Hindi/English mix allowed. Focuses on Agriculture and Rural Economy.',
      color: 'bg-amber-600',
      instruction: `You are an Interviewer for Regional Rural Bank (RRB) Scale-I Officer. 
      You value knowledge of rural economy, KCC, agriculture, and NABARD. 
      You can understand if the user speaks in simple English. 
      Start by asking about their background. Keep responses conversational and short.`
    }
  ];

  const handlePanelEntry = (panelId: string) => {
    setPendingPanelId(panelId);
    setShowPermissionModal(true);
  };

  const handlePermissionDenied = () => {
    setShowPermissionModal(false);
    setPendingPanelId(null);
  };

  const confirmStartSession = () => {
    if (pendingPanelId) {
      setShowPermissionModal(false);
      startSession(pendingPanelId);
    }
  };

  const startSession = async (panelId: string) => {
    try {
      setStatus('Requesting Microphone Access...');
      // Use basic audio constraint to avoid OverconstrainedError on some devices
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      setStatus('Connecting to BankEdge Interview AI...');
      
      const panel = PANELS.find(p => p.id === panelId);
      
      // Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Initialize Audio Context for Playing Response
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = audioCtx;
      nextStartTimeRef.current = audioCtx.currentTime;

      // Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // Professional voice
          },
          systemInstruction: panel?.instruction,
        },
        callbacks: {
          onopen: () => {
            setStatus('Interview Started. Say "Hello"!');
            setIsConnected(true);
            setActivePanel(panelId);
            
            // --- Setup Input Audio Stream ---
            // Create a new context for input with the specific sample rate required for processing
            // The browser will handle resampling from the source stream to this context
            const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const source = inputCtx.createMediaStreamSource(stream);
            
            // Using ScriptProcessor as per guidelines for raw PCM access
            // Buffer size 4096 provides a good balance between latency and stability
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              if (!isMicOn) return; // Mute logic

              const inputData = e.inputBuffer.getChannelData(0);
              
              // Visualization Logic (Simple RMS)
              let sum = 0;
              for(let i=0; i<inputData.length; i+=10) sum += inputData[i] * inputData[i];
              setVolumeLevel(Math.sqrt(sum / (inputData.length/10)) * 5); // Scale up for UI

              // Convert Float32 to Int16 PCM
              const pcm16 = floatTo16BitPCM(inputData);
              const base64Data = arrayBufferToBase64(pcm16);

              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: {
                    mimeType: 'audio/pcm;rate=16000',
                    data: base64Data
                  }
                });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
            
            inputSourceRef.current = source;
            processorRef.current = processor;
            sessionRef.current = sessionPromise; // Store promise/session
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              const audioBufferChunk = await decodeAudioData(audioData, audioCtx);
              playAudioChunk(audioBufferChunk, audioCtx);
            }
            
            if (msg.serverContent?.interrupted) {
               stopAllScheduledAudio();
            }
          },
          onclose: () => {
            setStatus('Connection Closed');
            setIsConnected(false);
          },
          onerror: (err) => {
            console.error(err);
            setStatus('Error: Connection failed');
            setIsConnected(false);
          }
        }
      });

    } catch (err: any) {
      console.error("Failed to start session:", err);
      let errorMessage = "Microphone access failed.";
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = "Microphone permission denied. Please allow microphone access in your browser settings.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = "No microphone found.";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = "Microphone is busy or not readable.";
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = "Microphone constraints not satisfied (Overconstrained).";
      }
      setStatus('');
      alert(errorMessage);
    }
  };

  const endSession = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputSourceRef.current) {
      inputSourceRef.current.disconnect();
      inputSourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (sessionRef.current) {
        // sessionRef is a Promise, we can't sync close it easily if it's pending, 
        // but typically we assume it resolved. Ideally we call session.close() if available 
        // in the SDK interface, but standard websocket close happens on unmount/reload.
        sessionRef.current.then((s: any) => s.close && s.close());
        sessionRef.current = null;
    }
    
    setIsConnected(false);
    setActivePanel(null);
    setStatus('');
    setVolumeLevel(0);
  };

  // --- Audio Output Helpers ---

  const decodeAudioData = async (base64: string, ctx: AudioContext) => {
    const bytes = base64ToUint8Array(base64);
    // Convert 16-bit PCM to Float32
    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }
    
    const buffer = ctx.createBuffer(1, float32Array.length, 24000);
    buffer.getChannelData(0).set(float32Array);
    return buffer;
  };

  const playAudioChunk = (buffer: AudioBuffer, ctx: AudioContext) => {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    
    // Schedule playback
    const now = ctx.currentTime;
    // If nextStartTime is in the past, reset it to now (handling network delays/gaps)
    if (nextStartTimeRef.current < now) {
      nextStartTimeRef.current = now;
    }
    
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;
    
    scheduledSourcesRef.current.push(source);
    source.onended = () => {
      scheduledSourcesRef.current = scheduledSourcesRef.current.filter(s => s !== source);
    };
  };

  const stopAllScheduledAudio = () => {
    scheduledSourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    scheduledSourcesRef.current = [];
    if (audioContextRef.current) {
        nextStartTimeRef.current = audioContextRef.current.currentTime;
    }
  };

  // --- UI Renders ---

  if (!activePanel) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-12 relative">
        
        {/* Permission Modal */}
        {showPermissionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handlePermissionDenied}></div>
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
              <button 
                onClick={handlePermissionDenied}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Microphone Access Required</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  To simulate a real interview, BankEdge needs access to your microphone. Your audio is processed in real-time by AI to provide instant feedback and is not stored.
                </p>
                
                <div className="flex flex-col w-full gap-3 mt-4">
                  <button 
                    onClick={confirmStartSession}
                    className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Mic size={18} /> Allow Access & Start
                  </button>
                  <button 
                    onClick={handlePermissionDenied}
                    className="w-full py-3.5 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Please ensure you are in a quiet environment.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-100 rounded-full mb-2">
             <Mic size={32} className="text-indigo-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">Live Interview Simulator</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Experience a real-time voice interview with AI panelists. Choose your board and start speaking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PANELS.map(panel => (
            <div key={panel.id} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl transition-all flex flex-col h-full group relative overflow-hidden">
               <div className={`absolute top-0 left-0 w-full h-2 ${panel.color}`}></div>
               <div className="mb-4">
                 <h3 className="text-2xl font-bold text-slate-800 mb-2">{panel.title}</h3>
                 <p className="text-slate-500 text-sm leading-relaxed">{panel.desc}</p>
               </div>
               <div className="mt-auto">
                 <button 
                   onClick={() => handlePanelEntry(panel.id)}
                   className="w-full py-4 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group-hover:-translate-y-1"
                 >
                   <Play size={18} fill="currentColor" /> Enter Panel
                 </button>
               </div>
            </div>
          ))}
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 max-w-2xl mx-auto">
           <AlertCircle className="text-amber-600 mt-0.5 flex-shrink-0" />
           <p className="text-sm text-amber-800 font-medium">
             <strong>Note:</strong> This feature uses your microphone. Please use headphones for the best experience to prevent echo.
           </p>
        </div>
      </div>
    );
  }

  const activePanelDetails = PANELS.find(p => p.id === activePanel);

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center font-sans">
       {/* Background Animation */}
       <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[100px] transition-all duration-100 ${volumeLevel > 0.1 ? 'scale-125 opacity-40' : 'scale-100 opacity-20'}`}></div>
       </div>

       {/* Main Content */}
       <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center">
          
          {/* Status Badge */}
          <div className="mb-12 flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
             {isConnected ? (
                <span className="flex items-center gap-2 text-emerald-400 font-bold text-sm tracking-wider uppercase animate-pulse">
                   <span className="w-2 h-2 bg-emerald-400 rounded-full"></span> Live
                </span>
             ) : (
                <span className="flex items-center gap-2 text-amber-400 font-bold text-sm tracking-wider uppercase">
                   <Loader2 size={14} className="animate-spin" /> Connecting...
                </span>
             )}
             <span className="text-white/50">|</span>
             <span className="text-white font-medium">{activePanelDetails?.title}</span>
          </div>

          {/* Visualizer Orb */}
          <div className="relative mb-16 group">
             <div className={`w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl transition-all duration-100 ${isConnected ? 'shadow-indigo-500/50' : ''}`}
                  style={{ transform: `scale(${1 + Math.min(volumeLevel, 0.5)})` }}>
                <UserCheck size={64} className="text-white opacity-80" />
             </div>
             {/* Ripples */}
             <div className={`absolute inset-0 rounded-full border-2 border-white/30 transition-all duration-1000 ${volumeLevel > 0.1 ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}></div>
             <div className={`absolute inset-0 rounded-full border border-white/20 transition-all duration-700 delay-75 ${volumeLevel > 0.1 ? 'scale-125 opacity-0' : 'scale-100 opacity-100'}`}></div>
          </div>

          {/* Status Text */}
          <div className="text-center mb-12 h-16">
             <p className="text-2xl font-light text-white tracking-wide">
                {status || "Listening..."}
             </p>
             {volumeLevel > 0.2 && isMicOn && (
               <p className="text-indigo-300 text-sm font-bold mt-2 animate-bounce">Detecting Speech...</p>
             )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-8">
             <button 
               onClick={() => setIsMicOn(!isMicOn)}
               className={`p-6 rounded-full transition-all duration-300 shadow-xl ${isMicOn ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-red-500 text-white hover:bg-red-600'}`}
             >
                {isMicOn ? <Mic size={32} /> : <MicOff size={32} />}
             </button>

             <button 
               onClick={endSession}
               className="p-6 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-300 shadow-xl shadow-red-900/30 hover:scale-105"
             >
                <PhoneOff size={32} />
             </button>
          </div>
       </div>
    </div>
  );
};

export default InterviewSimulator;
