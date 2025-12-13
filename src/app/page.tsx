"use client";

import { useState, useEffect } from "react";
import { TrueLogo } from "@/components/TrueLogo"; 
import { 
  ShieldCheck, AlertTriangle, Terminal, Activity, 
  Lock, Server, FileText, ChevronRight, Search, Globe
} from "lucide-react";

// --- 1. THE TICKER (Clean, Solid Background) ---
const Ticker = () => (
  <div className="w-full bg-[#0B0F19] border-b border-white/5 h-12 flex items-center overflow-hidden z-[60] fixed top-0 left-0 shadow-lg">
    <div className="animate-ticker flex items-center">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center">
          <span className="text-[10px] md:text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-32 px-16">
            <span className="text-slate-400">R-410A SPOT: <span className="text-[#00FF94]">$425.00 ▲</span></span>
            <span className="text-slate-400">R-454B SUPPLY: <span className="text-[#FF3333]">CRITICAL LOW ▼</span></span>
            <span className="text-slate-400">AIM ACT ENFORCEMENT: <span className="text-[#FF3333]">ACTIVE</span></span>
            <span className="text-slate-400">EPA AUDIT RISK: <span className="text-[#FACC15]">ELEVATED</span></span>
          </span>
        </div>
      ))}
    </div>
  </div>
);

// --- 2. THE COUNTDOWN (Massive & Clean) ---
const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date("2026-01-01T00:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 border border-[#FF3333]/30 bg-[#FF3333]/5 px-4 py-1.5 rounded text-[#FF3333] text-[10px] font-bold uppercase tracking-[0.2em] mb-8 animate-pulse shadow-[0_0_15px_rgba(255,51,51,0.1)]">
        <AlertTriangle className="w-3 h-3" /> Supply Chain Crunch
      </div>
      {/* MASSIVE TEXT SIZE UPDATE */}
      <div className="font-mono text-6xl md:text-9xl font-bold text-white tracking-tighter flex justify-center items-baseline gap-4 md:gap-8">
        <div>{timeLeft.d}<span className="text-[10px] md:text-xs text-slate-600 block mt-2 tracking-widest font-sans font-bold opacity-50">DAYS</span></div>
        <span className="text-slate-800 text-5xl md:text-7xl self-center mb-4">:</span>
        <div>{timeLeft.h}<span className="text-[10px] md:text-xs text-slate-600 block mt-2 tracking-widest font-sans font-bold opacity-50">HRS</span></div>
        <span className="text-slate-800 text-5xl md:text-7xl self-center mb-4">:</span>
        <div>{timeLeft.m}<span className="text-[10px] md:text-xs text-slate-600 block mt-2 tracking-widest font-sans font-bold opacity-50">MIN</span></div>
        <span className="text-slate-800 text-5xl md:text-7xl self-center mb-4">:</span>
        <div>{timeLeft.s}<span className="text-[10px] md:text-xs text-slate-600 block mt-2 tracking-widest font-sans font-bold opacity-50">SEC</span></div>
      </div>
    </div>
  );
};

// --- 3. THE SCANNER (Sized Perfectly) ---
const Scanner = () => {
  const [year, setYear] = useState("");
  const [result, setResult] = useState<null | "SAFE" | "RISK">(null);

  const check = () => {
    const y = parseInt(year);
    if (!y) return;
    setResult(y < 2025 ? "SAFE" : "RISK");
  };

  return (
    // Changed max-w-2xl to max-w-md (Much smaller width)
    <div className="w-full max-w-md mx-auto relative group">
      
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-slate-400 font-bold flex items-center gap-2 text-xs tracking-wide">
          <Terminal className="w-4 h-4 text-blue-500" /> Compliance Check
        </h3>
        <div className="flex gap-1.5 items-center">
             <div className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse"></div>
             <span className="text-[10px] font-mono text-[#00FF94] tracking-widest">ONLINE</span>
        </div>
      </div>

      {/* Input Field - Fixed Overlap */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-20">
          <Search className="h-5 w-5 text-slate-500" />
        </div>
        <div className="flex gap-0 relative shadow-2xl">
             {/* Added pl-14 to push text away from the icon */}
             <input 
              type="number"
              placeholder="Enter Year (e.g. 2024)..."
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-[#05070a] border border-slate-700 border-r-0 text-white pl-14 pr-4 py-4 font-mono text-lg focus:border-blue-500 outline-none rounded-l-lg placeholder:text-slate-600 transition-all z-10"
            />
            <button 
              onClick={check}
              className="bg-white hover:bg-slate-200 active:scale-95 text-black font-bold px-6 rounded-r-lg uppercase text-sm tracking-wider transition-all cursor-pointer z-10"
            >
              Scan
            </button>
        </div>
      </div>

      {/* Results */}
      {result === "SAFE" && (
        <div className="border border-[#00FF94]/30 bg-[#00FF94]/5 rounded-lg p-6 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3 mb-2">
             <ShieldCheck className="w-6 h-6 text-[#00FF94]" />
             <h4 className="text-[#00FF94] font-bold text-lg tracking-tight">SAFE TO INSTALL</h4>
          </div>
          <p className="text-slate-400 text-xs mb-4 leading-relaxed font-mono">
            Protected by EPA Indefinite Install Rule. <br/> Status: EXISTING INVENTORY
          </p>
          <button className="w-full flex items-center justify-center gap-2 text-[10px] text-[#00FF94] hover:text-white border border-[#00FF94]/30 hover:bg-[#00FF94]/10 px-4 py-3 rounded transition-all uppercase font-bold tracking-widest cursor-pointer active:scale-95">
            <FileText className="w-3 h-3" /> Download Assurance PDF
          </button>
        </div>
      )}

      {result === "RISK" && (
        <div className="border border-[#FF3333]/30 bg-[#FF3333]/5 rounded-lg p-6 animate-in fade-in slide-in-from-top-2">
           <div className="flex items-center gap-3 mb-2">
             <AlertTriangle className="w-6 h-6 text-[#FF3333]" />
             <h4 className="text-[#FF3333] font-bold text-lg tracking-tight">RISK DETECTED</h4>
           </div>
           <p className="text-slate-400 text-xs mb-4 leading-relaxed font-mono">
             Manufactured post-ban. Installation may violate AIM Act Subsection H.
           </p>
           <button className="w-full flex items-center justify-center gap-2 text-[10px] text-[#FF3333] hover:text-white border border-[#FF3333]/30 hover:bg-[#FF3333]/10 px-4 py-3 rounded transition-all uppercase font-bold tracking-widest cursor-pointer active:scale-95">
             Find R-410A Gas Near Me <ChevronRight className="w-3 h-3" />
           </button>
        </div>
      )}

    </div>
  );
};

// --- 4. THE WAR ROOM VISUAL (Simplified) ---
const WarRoomMap = () => (
  <div className="mt-40 border-t border-white/5 pt-16">
    <div className="flex flex-col md:flex-row justify-between items-end mb-8 max-w-6xl mx-auto px-6 gap-4">
      <div>
        <h4 className="text-white font-bold flex items-center gap-2 text-lg">
          <Globe className="w-5 h-5 text-blue-500" /> True608 Intelligence Network
        </h4>
        <p className="text-xs text-slate-500 mt-2 font-mono tracking-wide">REAL-TIME COMPLIANCE FEED</p>
      </div>
    </div>
    
    <div className="max-w-6xl mx-auto h-[400px] bg-[#0A0D14] border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center">
      {/* Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] gap-px opacity-[0.03] pointer-events-none">
         {[...Array(1600)].map((_, i) => (
           <div key={i} className="bg-white"></div>
         ))}
      </div>
      
      {/* Glowing Dots */}
      <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-blue-500 rounded-full animate-ping opacity-100 shadow-[0_0_20px_blue]"></div>
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-[#00FF94] rounded-full animate-ping delay-75 opacity-100 shadow-[0_0_20px_#00FF94]"></div>
      <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-purple-500 rounded-full animate-ping delay-150 opacity-100 shadow-[0_0_20px_purple]"></div>
      
      {/* Center Text */}
      <div className="relative z-10 text-center bg-[#0B0F19]/90 backdrop-blur px-10 py-6 rounded-xl border border-white/10 shadow-2xl">
         <p className="text-[10px] font-mono text-slate-500 tracking-[0.3em] mb-3 uppercase">Secure Connection</p>
         <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-3">
            <Lock className="w-4 h-4 text-[#00FF94]" /> SYSTEM ACTIVE
         </h2>
      </div>
    </div>
  </div>
);

// --- MAIN LAYOUT ---
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-white selection:bg-[#00FF94] selection:text-black font-sans pb-20 pt-10">
      
      <Ticker />

      {/* NAV - Pushed down to top-14 (56px) to sit below Ticker */}
      <nav className="fixed top-12 w-full z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <TrueLogo className="w-8 h-8" />
            <div className="flex flex-col">
               <span className="text-xl font-bold tracking-tight text-white leading-none">True608</span>
               <span className="text-[10px] text-slate-500 font-mono tracking-[0.2em] uppercase mt-1">Intelligence</span>
            </div>
          </div>
          {/* LOGIN BUTTON */}
          <button className="group flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest cursor-pointer transition-all border border-white/10 hover:border-white/30 px-5 py-2.5 rounded bg-white/5 hover:bg-white/10 active:scale-95">
             <Lock className="w-3 h-3 group-hover:text-[#00FF94] transition-colors" /> Encrypted Login
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      {/* Increased padding-top to 44 (approx 176px) to clear ticker + nav */}
      <div className="pt-44 px-6"> 
        <div className="max-w-5xl mx-auto text-center">
          
          <Countdown />
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-10 leading-[1.1]">
            IS YOUR INVENTORY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF3333] to-red-900">STRANDED?</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-20 max-w-2xl mx-auto font-light leading-relaxed">
            The EPA Manufacturing Ban is live. R-410A Supply is falling. 
            <br className="hidden md:block" /> Check your fleet's compliance status instantly.
          </p>

          <Scanner />

        </div>
      </div>

      <WarRoomMap />

      {/* FOOTER */}
      <footer className="mt-40 pt-16 border-t border-white/5 text-center bg-[#05070a]">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-[10px] text-slate-500 uppercase tracking-widest mb-12 font-mono">
           <div className="flex items-center justify-center gap-2">
             <Lock className="w-4 h-4 text-slate-600" /> SSL Secure
           </div>
           <div className="flex items-center justify-center gap-2">
             <Server className="w-4 h-4 text-slate-600" /> USA Hosted
           </div>
           <div className="flex items-center justify-center gap-2">
             <Activity className="w-4 h-4 text-slate-600" /> EPA Data Synced
           </div>
        </div>
        <p className="text-[10px] text-slate-600 max-w-md mx-auto leading-relaxed font-mono">
          True608 Intelligence Unit. Data based on 40 CFR Part 84. Not affiliated with the EPA. For professional use only.
        </p>
        <p className="mt-8 text-[10px] text-slate-700 pb-8">
          &copy; 2025 True608 Systems.
        </p>
      </footer>

    </main>
  );
}