"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TrueLogo } from "@/components/TrueLogo"; 
import { 
  ShieldCheck, Terminal, FileText, Lock, 
  ArrowRight, Download, Activity, AlertTriangle
} from "lucide-react";

// --- COMPONENT: MARKET TICKER (CLEANER) ---
const MarketTicker = () => (
  <div className="w-full h-10 bg-black border-b border-white/10 flex items-center overflow-hidden relative z-50">
    <div className="ticker-wrap">
      <div className="ticker-move flex items-center text-xs font-bold font-mono tracking-wider">
        <span className="text-white mx-8">LIVE R-410A: $420/Jug <span className="text-emerald-500">(+12%)</span></span>
        <span className="text-red-500 mx-8 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> R-454B STOCK: CRITICAL</span>
        <span className="text-white mx-8">FL LEAK REPORTS: +400 Today</span>
        <span className="text-yellow-400 mx-8">EPA AUDIT SEASON: ACTIVE</span>
      </div>
    </div>
  </div>
);

// --- COMPONENT: DOOMSDAY TIMER (SIMPLIFIED) ---
const DoomsdayTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });

  useEffect(() => {
    const targetDate = new Date("2026-01-01T00:00:00").getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      <span className="text-xs font-bold uppercase tracking-widest">
        Supply Crunch: {timeLeft.days} Days Remaining
      </span>
    </div>
  );
};

// --- COMPONENT: STOCKPILE SCANNER (HIGH CONTRAST) ---
const StockpileScanner = () => {
  const [year, setYear] = useState("");
  const [status, setStatus] = useState<"IDLE" | "SAFE" | "RISK">("IDLE");

  const checkCompliance = () => {
    if (!year) return;
    const y = parseInt(year);
    if (y < 2025) setStatus("SAFE");
    else setStatus("RISK");
  };

  return (
    <div className="w-full bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
        <Terminal className="w-4 h-4 text-blue-500" />
        <span className="text-xs font-bold text-white uppercase tracking-widest">Inventory Scanner</span>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-400 block mb-2">Condenser Manufacturing Year</label>
          <div className="flex gap-2">
            <input 
              aria-label="Year"
              type="number" 
              placeholder="e.g. 2024"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="flex-1 bg-black border border-white/20 text-white p-3 rounded-lg focus:border-blue-500 outline-none font-mono text-lg placeholder:text-slate-700"
            />
            <button 
              onClick={checkCompliance}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 rounded-lg uppercase text-sm tracking-wide transition-colors"
            >
              Check
            </button>
          </div>
        </div>

        {status === "SAFE" && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg mt-4">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h4 className="font-bold text-white">Safe to Install</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Protected by EPA Indefinite Install Rule. This unit is classified as existing inventory.
            </p>
          </div>
        )}

        {status === "RISK" && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg mt-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h4 className="font-bold text-white">Risk Detected</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unit manufactured post-ban. Installation may violate AIM Act Subsection H.
            </p>
            <button className="mt-3 text-xs font-bold text-red-400 hover:text-white flex items-center gap-1">
               Download Liability Waiver <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500 selection:text-white flex flex-col font-sans">
      
      {/* 1. TICKER (Top Bar) */}
      <MarketTicker />
      
      {/* 2. NAVBAR (Sticky) */}
      <nav className="sticky top-0 w-full z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrueLogo className="w-8 h-8" />
            <span className="text-lg font-bold tracking-tight text-white">True608</span>
          </div>
          <Link 
             href="/login" 
             className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2"
          >
             <Lock className="w-3 h-3" /> Member Login
          </Link>
        </div>
      </nav>

      {/* 3. HERO SECTION (Centered & Clean) */}
      <section className="flex-1 flex items-center py-20 px-6">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text Content */}
          <div className="max-w-2xl">
            <DoomsdayTimer />
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mt-8 mb-6 leading-[1.1]">
              Is your inventory <br />
              <span className="text-emerald-500">Safe</span> or <span className="text-red-500">Stranded?</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-10 leading-relaxed font-light">
              The EPA Manufacturing Ban is live. R-454B prices are surging. 
              <strong>True608</strong> helps you verify compliance and track usage in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/sales" 
                className="h-14 px-8 rounded-lg bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
              >
                <FileText className="w-5 h-5" /> Download 2026 Survival Kit
              </Link>
              <Link 
                href="/log" 
                className="h-14 px-8 rounded-lg border border-slate-700 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                Launch App
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> 
              Includes Official R-410A Rollback Text template.
            </p>
          </div>

          {/* Right: The Tool */}
          <div className="w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
             <StockpileScanner />
             
             {/* Leak Rate Mini-Widget */}
             <div className="mt-6 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-2">
                   <Activity className="w-4 h-4 text-blue-500" />
                   <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Leak Rate Monitor</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full w-[12%] bg-emerald-500"></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
                   <span>System: RTU-01</span>
                   <span>Rate: 1.2% (Safe)</span>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* 4. FOOTER (Minimal) */}
      <footer className="border-t border-white/5 py-8 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-xs text-slate-500">
             &copy; 2025 True608 Systems. Compliance logic based on AIM Act Subsection H.
           </p>
           <div className="flex gap-6">
              <span className="text-[10px] uppercase font-bold text-slate-600 tracking-widest flex items-center gap-1">
                <Lock className="w-3 h-3" /> SSL Encrypted
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-600 tracking-widest flex items-center gap-1">
                <Terminal className="w-3 h-3" /> EPA Synced
              </span>
           </div>
        </div>
      </footer>

    </main>
  );
}