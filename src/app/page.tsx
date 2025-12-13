"use client";

import { useState, useEffect } from "react";
import { TrueLogo } from "@/components/TrueLogo"; 
// THE FIX: Added 'Globe' to this list
import { 
  ShieldCheck, AlertTriangle, Terminal, Activity, 
  Lock, Server, FileText, ChevronRight, Search, Globe
} from "lucide-react";

// --- 1. THE TICKER COMPONENT ---
const Ticker = () => (
  <div className="w-full bg-[#05070a] border-b border-white/5 h-10 flex items-center overflow-hidden z-50 fixed top-0 left-0">
    <div className="animate-ticker flex items-center gap-16 text-[10px] md:text-xs font-mono font-bold tracking-widest uppercase">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex gap-16 items-center">
          <span className="text-slate-400">R-410A SPOT: <span className="text-[#00FF94]">$425.00 ▲</span></span>
          <span className="text-slate-400">R-454B SUPPLY: <span className="text-[#FF3333]">CRITICAL LOW ▼</span></span>
          <span className="text-slate-400">AIM ACT SEC. H: <span className="text-[#FF3333]">ENFORCEMENT ACTIVE</span></span>
          <span className="text-slate-400">EPA AUDIT RISK: <span className="text-[#FACC15]">ELEVATED</span></span>
        </div>
      ))}
    </div>
  </div>
);

// --- 2. THE COUNTDOWN COMPONENT ---
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
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 border border-[#FF3333]/30 bg-[#FF3333]/5 px-3 py-1 rounded text-[#FF3333] text-[10px] font-bold uppercase tracking-[0.2em] mb-6 animate-pulse">
        <AlertTriangle className="w-3 h-3" /> Supply Chain Crunch
      </div>
      <div className="font-mono text-5xl md:text-8xl font-bold text-white tracking-tighter flex justify-center items-baseline gap-2 md:gap-6">
        <div>{timeLeft.d}<span className="text-[10px] text-slate-600 block mt-2 tracking-widest font-sans">DAYS</span></div>
        <span className="text-slate-800 text-4xl md:text-6xl">:</span>
        <div>{timeLeft.h}<span className="text-[10px] text-slate-600 block mt-2 tracking-widest font-sans">HRS</span></div>
        <span className="text-slate-800 text-4xl md:text-6xl">:</span>
        <div>{timeLeft.m}<span className="text-[10px] text-slate-600 block mt-2 tracking-widest font-sans">MIN</span></div>
        <span className="text-slate-800 text-4xl md:text-6xl">:</span>
        <div>{timeLeft.s}<span className="text-[10px] text-slate-600 block mt-2 tracking-widest font-sans">SEC</span></div>
      </div>
    </div>
  );
};

// --- 3. THE SCANNER COMPONENT ---
const Scanner = () => {
  const [year, setYear] = useState("");
  const [result, setResult] = useState<null | "SAFE" | "RISK">(null);

  const check = () => {
    const y = parseInt(year);
    if (!y) return;
    setResult(y < 2025 ? "SAFE" : "RISK");
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#131722] border border-white/5 p-1 rounded-2xl shadow-2xl relative overflow-hidden group">
      <div className="bg-[#0B0F19] rounded-xl border border-white/5 p-8 relative z-10">
        
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <h3 className="text-white font-bold flex items-center gap-3 text-sm tracking-wide">
            <Terminal className="w-4 h-4 text-blue-500" /> COMPLIANCE_SCANNER_V1
          </h3>
          <div className="flex gap-1.5">
             <span className="text-[10px] font-mono text-slate-500 mr-2">STATUS: ONLINE</span>
             <div className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse shadow-[0_0_8px_#00FF94]"></div>
          </div>
        </div>

        <div className="relative mb-8 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <div className="flex gap-0">
             <input 
              type="number"
              placeholder="Enter Condenser Mfg Year (e.g. 2024)..."
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-[#05070a] border border-slate-700 border-r-0 text-white pl-12 pr-4 py-4 font-mono text-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-l-lg placeholder:text-slate-600 transition-all"
            />
            <button 
              onClick={check}
              className="bg-white hover:bg-slate-200 text-black font-bold px-8 rounded-r-lg uppercase text-sm tracking-wider transition-all"
            >
              Scan
            </button>
          </div>
        </div>

        {result === "SAFE" && (
          <div className="border border-[#00FF94]/30 bg-[#00FF94]/5 rounded-lg p-6 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-4">
               <div className="p-2 bg-[#00FF94]/10 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-[#00FF94]" />
               </div>
               <div className="flex-1">
                  <h4 className="text-[#00FF94] font-bold text-lg mb-1 tracking-tight">SAFE TO INSTALL</h4>
                  <p className="text-slate-400 text-xs mb-4 leading-relaxed font-mono">
                    Protected by EPA Indefinite Install Rule (Dec 2025). <br/>
                    Status: <span className="text-white">EXISTING INVENTORY</span>
                  </p>
                  <button className="flex items-center gap-2 text-[10px] text-[#00FF94] hover:text-white border border-[#00FF94]/30 hover:bg-[#00FF94]/10 px-4 py-2 rounded transition-colors uppercase font-bold tracking-widest">
                    <FileText className="w-3 h-3" /> Download Assurance PDF
                  </button>
               </div>
            </div>
          </div>
        )}

        {result === "RISK" && (
          <div className="border border-[#FF3333]/30 bg-[#FF3333]/5 rounded-lg p-6 animate-in fade-in slide-in-from-top-2">
             <div className="flex items-start gap-4">
               <div className="p-2 bg-[#FF3333]/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-[#FF3333]" />
               </div>
               <div className="flex-1">
                  <h4 className="text-[#FF3333] font-bold text-lg mb-1 tracking-tight">RISK DETECTED: STRANDED</h4>
                  <p className="text-slate-400 text-xs mb-4 leading-relaxed font-mono">
                    Manufactured post-ban. Installation may violate AIM Act Subsection H. 
                    <br/><span className="text-white">DO NOT INSTALL WITHOUT VERIFICATION.</span>
                  </p>
                  <button className="flex items-center gap-2 text-[10px] text-[#FF3333] hover:text-white border border-[#FF3333]/30 hover:bg-[#FF3333]/10 px-4 py-2 rounded transition-colors uppercase font-bold tracking-widest">
                    Find R-410A Gas Near Me <ChevronRight className="w-3 h-3" />
                  </button>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// --- 4. THE WAR ROOM VISUAL ---
const WarRoomMap = () => (
  <div className="mt-32 border-t border-white/5 pt-16">
    <div className="flex flex-col md:flex-row justify-between items-end mb-8 max-w-6xl mx-auto px-6 gap-4">
      <div>
        <h4 className="text-white font-bold flex items-center gap-2 text-lg">
          <Globe className="w-5 h-5 text-blue-500" /> True608 Intelligence Network
        </h4>
        <p className="text-xs text-slate-500 mt-2 font-mono">LIVE_FEED // NODE_US_WEST</p>
      </div>
      <div className="flex items-center gap-3 px-4 py-2 bg-[#00FF94]/5 rounded border border-[#00FF94]/20">
        <div className="w-2 h-2 bg-[#00FF94] rounded-full animate-pulse shadow-[0_0_10px_#00FF94]"></div>
        <span className="text-[10px] font-mono font-bold text-[#00FF94] tracking-widest">SYSTEM ONLINE</span>
      </div>
    </div>
    
    <div className="max-w-6xl mx-auto h-[400px] bg-[#0A0D14] border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] gap-px opacity-[0.03] pointer-events-none">
         {[...Array(1600)].map((_, i) => (
           <div key={i} className="bg-white"></div>
         ))}
      </div>
      
      <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-blue-500 rounded-full animate-ping opacity-100 shadow-[0_0_20px_blue]"></div>
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-[#00FF94] rounded-full animate-ping delay-75 opacity-100 shadow-[0_0_20px_#00FF94]"></div>
      <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-purple-500 rounded-full animate-ping delay-150 opacity-100 shadow-[0_0_20px_purple]"></div>
      <div className="absolute top-1/4 right-1/3 w-1 h-1 bg-yellow-500 rounded-full animate-ping delay-300 opacity-100 shadow-[0_0_20px_yellow]"></div>
      
      <div className="relative z-10 text-center bg-[#0B0F19]/90 backdrop-blur px-8 py-4 rounded-xl border border-white/10">
         <p className="text-[10px] font-mono text-slate-500 tracking-[0.3em] mb-2 uppercase">Encrypted Connection</p>
         <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">ESTABLISHING SECURE LINK...</h2>
      </div>
    </div>
  </div>
);

// --- MAIN LAYOUT ---
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-white selection:bg-[#00FF94] selection:text-black font-sans pb-20 pt-10">
      
      <Ticker />

      {/* NAV */}
      <nav className="w-full bg-[#0B0F19]/80 backdrop-blur-sm sticky top-10 z-40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrueLogo className="w-8 h-8" />
            <div className="flex flex-col">
               <span className="text-xl font-bold tracking-tight text-white leading-none">True608</span>
               <span className="text-[9px] text-slate-500 font-mono tracking-[0.2em] uppercase mt-1">Intelligence</span>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors border border-white/10 hover:border-white/30 px-4 py-2 rounded bg-white/5">
             <Lock className="w-3 h-3" /> Encrypted Login
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="pt-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          
          <Countdown />
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
            IS YOUR INVENTORY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF3333] to-red-900">STRANDED?</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
            The EPA Manufacturing Ban is live. R-410A Supply is falling. 
            <br className="hidden md:block" /> Check your fleet's compliance status instantly.
          </p>

          <Scanner />

        </div>
      </div>

      <WarRoomMap />

      {/* FOOTER */}
      <footer className="mt-24 pt-16 border-t border-white/5 text-center bg-[#05070a]">
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