"use client";

import { useState, useEffect } from "react";
import { TrueLogo } from "@/components/TrueLogo"; 
import { 
  ShieldCheck, AlertTriangle, Terminal, Activity, 
  Lock, Server, FileText, ChevronRight, Search, Globe, Zap
} from "lucide-react";

// --- 1. THE TICKER (Solid & Readable) ---
const Ticker = () => (
  <div className="w-full bg-[#05070a] border-b border-white/10 h-12 flex items-center overflow-hidden z-[60] fixed top-0 left-0 shadow-2xl">
    <div className="animate-ticker flex items-center">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center">
          <span className="text-[10px] md:text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-32 px-16">
            <span className="text-slate-300">R-410A SPOT: <span className="text-[#00FF94]">$425.00 ▲</span></span>
            <span className="text-slate-300">R-454B SUPPLY: <span className="text-[#FF3333]">CRITICAL LOW ▼</span></span>
            <span className="text-slate-300">AIM ACT ENFORCEMENT: <span className="text-[#FF3333]">ACTIVE</span></span>
            <span className="text-slate-300">EPA AUDIT RISK: <span className="text-[#FACC15]">ELEVATED</span></span>
          </span>
        </div>
      ))}
    </div>
  </div>
);

// --- 2. THE COUNTDOWN (VW BASED - MASSIVE) ---
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
    <div className="text-center mb-20 relative z-10">
      <div className="inline-flex items-center gap-2 border border-[#FF3333] bg-[#FF3333]/10 px-6 py-2 rounded-full text-[#FF3333] text-xs font-bold uppercase tracking-[0.2em] mb-12 shadow-[0_0_30px_rgba(255,51,51,0.2)]">
        <AlertTriangle className="w-4 h-4" /> Supply Chain Crunch
      </div>
      
      {/* 13vw makes it fill the screen width perfectly */}
      <div className="font-mono text-[13vw] leading-none font-black text-white tracking-tighter flex justify-center items-baseline gap-[2vw]">
        <div className="flex flex-col items-center">
            {timeLeft.d}
            <span className="text-sm md:text-xl text-slate-500 font-sans font-bold tracking-[0.3em] opacity-60 mt-4">DAYS</span>
        </div>
        <span className="text-slate-800 self-start mt-4 opacity-50">:</span>
        <div className="flex flex-col items-center">
            {timeLeft.h}
            <span className="text-sm md:text-xl text-slate-500 font-sans font-bold tracking-[0.3em] opacity-60 mt-4">HRS</span>
        </div>
        <span className="text-slate-800 self-start mt-4 opacity-50">:</span>
        <div className="flex flex-col items-center">
            {timeLeft.m}
            <span className="text-sm md:text-xl text-slate-500 font-sans font-bold tracking-[0.3em] opacity-60 mt-4">MIN</span>
        </div>
      </div>
    </div>
  );
};

// --- 3. THE SCANNER (Pro Tool) ---
const Scanner = () => {
  const [year, setYear] = useState("");
  const [result, setResult] = useState<null | "SAFE" | "RISK">(null);

  const check = () => {
    const y = parseInt(year);
    if (!y) return;
    setResult(y < 2025 ? "SAFE" : "RISK");
  };

  return (
    <div className="w-full max-w-[420px] mx-auto relative group z-20">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-slate-300 font-bold flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
          <Terminal className="w-4 h-4 text-blue-500" /> Condenser Verification
        </h3>
        <div className="flex gap-2 items-center bg-white/5 px-3 py-1 rounded-full border border-white/10">
             <div className="w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-pulse"></div>
             <span className="text-[10px] font-mono text-[#00FF94] font-bold">READY</span>
        </div>
      </div>

      {/* Input Field - Solid & Heavy */}
      <div className="relative mb-8 shadow-2xl">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-20">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <div className="flex gap-0 relative">
             <input 
              type="number"
              placeholder="Enter Mfg Year..."
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-[#0A0D14] border border-slate-600 border-r-0 text-white pl-16 pr-4 py-6 font-mono text-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-l-xl placeholder:text-slate-600 transition-all z-10"
            />
            <button 
              onClick={check}
              className="bg-white hover:bg-slate-200 active:scale-95 text-black font-black px-8 rounded-r-xl uppercase text-sm tracking-widest transition-all cursor-pointer z-10"
            >
              Scan
            </button>
        </div>
      </div>

      {/* Results - Card Style */}
      {result === "SAFE" && (
        <div className="border-l-4 border-[#00FF94] bg-[#0A0D14] rounded-r-xl p-6 animate-in fade-in slide-in-from-top-2 shadow-[0_0_30px_rgba(0,255,148,0.1)] border border-white/10">
          <div className="flex items-center gap-3 mb-3">
             <ShieldCheck className="w-6 h-6 text-[#00FF94]" />
             <h4 className="text-[#00FF94] font-bold text-lg tracking-tight">SAFE TO INSTALL</h4>
          </div>
          <p className="text-slate-400 text-xs mb-6 leading-relaxed font-mono pl-9 border-l border-slate-800 ml-3">
            Protected by EPA Indefinite Install Rule. <br/> Status: EXISTING INVENTORY
          </p>
          <button className="w-full flex items-center justify-center gap-3 text-xs text-black bg-[#00FF94] hover:bg-[#00cc76] px-4 py-4 rounded-lg transition-all uppercase font-bold tracking-widest cursor-pointer active:scale-95 shadow-lg">
            <FileText className="w-4 h-4" /> Download Certificate
          </button>
        </div>
      )}

      {result === "RISK" && (
        <div className="border-l-4 border-[#FF3333] bg-[#0A0D14] rounded-r-xl p-6 animate-in fade-in slide-in-from-top-2 shadow-[0_0_30px_rgba(255,51,51,0.1)] border border-white/10">
           <div className="flex items-center gap-3 mb-3">
             <AlertTriangle className="w-6 h-6 text-[#FF3333]" />
             <h4 className="text-[#FF3333] font-bold text-lg tracking-tight">RISK DETECTED</h4>
           </div>
           <p className="text-slate-400 text-xs mb-6 leading-relaxed font-mono pl-9 border-l border-slate-800 ml-3">
             Manufactured post-ban. Installation may violate AIM Act Subsection H.
           </p>
           <button className="w-full flex items-center justify-center gap-3 text-xs text-white bg-[#FF3333] hover:bg-[#cc0000] px-4 py-4 rounded-lg transition-all uppercase font-bold tracking-widest cursor-pointer active:scale-95 shadow-lg">
             Find R-410A Gas Near Me <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      )}

    </div>
  );
};

// --- 4. THE WAR ROOM VISUAL (HIGH VISIBILITY) ---
const WarRoomMap = () => (
  <div className="mt-48 border-t border-white/10 pt-20 bg-gradient-to-b from-[#0B0F19] to-black">
    <div className="flex flex-col md:flex-row justify-between items-end mb-10 max-w-7xl mx-auto px-6 gap-6">
      <div>
        <h4 className="text-white font-bold flex items-center gap-3 text-2xl">
          <Globe className="w-6 h-6 text-blue-500" /> True608 Intelligence
        </h4>
        <p className="text-sm text-slate-400 mt-2 font-mono tracking-wide">LIVE COMPLIANCE FEED // NODE_US_WEST</p>
      </div>
      <div className="flex items-center gap-3 px-5 py-2 bg-[#00FF94]/10 rounded-full border border-[#00FF94]/30">
        <div className="w-2.5 h-2.5 bg-[#00FF94] rounded-full animate-pulse shadow-[0_0_15px_#00FF94]"></div>
        <span className="text-xs font-mono font-bold text-[#00FF94] tracking-widest">SYSTEM ONLINE</span>
      </div>
    </div>
    
    {/* THE MAP CONTAINER - High Contrast */}
    <div className="max-w-7xl mx-auto h-[500px] bg-[#111623] border border-white/10 rounded-3xl relative overflow-hidden shadow-2xl flex items-center justify-center">
      
      {/* Grid Lines - Increased Opacity to 20% + Blue Tint */}
      <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] gap-px opacity-20 pointer-events-none">
         {[...Array(1600)].map((_, i) => (
           <div key={i} className="bg-blue-500/30"></div>
         ))}
      </div>
      
      {/* Glowing Dots - Bigger & Brighter */}
      <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-100 shadow-[0_0_30px_blue]"></div>
      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#00FF94] rounded-full animate-ping delay-75 opacity-100 shadow-[0_0_40px_#00FF94]"></div>
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-purple-500 rounded-full animate-ping delay-150 opacity-100 shadow-[0_0_30px_purple]"></div>
      <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-yellow-500 rounded-full animate-ping delay-300 opacity-100 shadow-[0_0_30px_yellow]"></div>

      {/* Radar Sweep Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent animate-scan pointer-events-none h-[20%] w-full"></div>
      
      {/* Center Text */}
      <div className="relative z-10 text-center bg-[#0B0F19] px-12 py-8 rounded-2xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
         <p className="text-xs font-mono text-slate-400 tracking-[0.3em] mb-4 uppercase">Secure Connection</p>
         <h2 className="text-3xl font-bold text-white tracking-tight flex items-center justify-center gap-4">
            <Lock className="w-6 h-6 text-[#00FF94]" /> LIVE DATA STREAM
         </h2>
      </div>
    </div>
  </div>
);

// --- MAIN LAYOUT ---
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-white selection:bg-[#00FF94] selection:text-black font-sans pb-20 pt-10 overflow-hidden relative">
      
      {/* SPOTLIGHT EFFECT (Backlighting) */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <Ticker />

      {/* NAV - FLUSH with Ticker */}
      <nav className="fixed top-12 w-full z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
            <TrueLogo className="w-10 h-10" />
            <div className="flex flex-col">
               <span className="text-2xl font-bold tracking-tight text-white leading-none">True608</span>
               <span className="text-[10px] text-slate-400 font-mono tracking-[0.3em] uppercase mt-1">Intelligence</span>
            </div>
          </div>
          {/* LOGIN BUTTON */}
          <button className="group flex items-center gap-3 text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest cursor-pointer transition-all border border-white/10 hover:border-white/40 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 shadow-lg">
             <Lock className="w-3 h-3 group-hover:text-[#00FF94] transition-colors" /> Encrypted Login
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="pt-48 px-6 relative z-10"> 
        <div className="max-w-7xl mx-auto text-center">
          
          <Countdown />
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-10 leading-[1.05] drop-shadow-2xl">
            IS YOUR INVENTORY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF3333] to-red-900">STRANDED?</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 mb-24 max-w-3xl mx-auto font-light leading-relaxed">
            The EPA Manufacturing Ban is live. R-410A Supply is falling. 
            <br className="hidden md:block" /> Check your fleet's compliance status instantly.
          </p>

          <Scanner />

        </div>
      </div>

      <WarRoomMap />

      {/* FOOTER */}
      <footer className="mt-40 pt-20 border-t border-white/10 text-center bg-[#05070a]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-xs text-slate-500 uppercase tracking-widest mb-16 font-mono">
           <div className="flex items-center justify-center gap-3">
             <Lock className="w-5 h-5 text-slate-600" /> SSL Secure
           </div>
           <div className="flex items-center justify-center gap-3">
             <Server className="w-5 h-5 text-slate-600" /> USA Hosted
           </div>
           <div className="flex items-center justify-center gap-3">
             <Activity className="w-5 h-5 text-slate-600" /> EPA Data Synced
           </div>
        </div>
        <p className="text-[10px] text-slate-600 max-w-lg mx-auto leading-relaxed font-mono opacity-50">
          True608 Intelligence Unit. Data based on 40 CFR Part 84. Not affiliated with the EPA. For professional use only.
        </p>
        <p className="mt-8 text-[10px] text-slate-700 pb-12">
          &copy; 2025 True608 Systems.
        </p>
      </footer>

    </main>
  );
}