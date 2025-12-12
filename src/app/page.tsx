"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TrueLogo } from "@/components/TrueLogo"; 
import { 
  ShieldCheck, AlertTriangle, Terminal, 
  Download, Activity, Search, AlertOctagon, FileText, Lock
} from "lucide-react";

// --- COMPONENT: MARKET TICKER ---
const MarketTicker = () => (
  <div className="fixed top-0 w-full z-[60] h-8 bg-black border-b border-slate-800 flex items-center">
    <div className="ticker-wrap">
      <div className="ticker-move">
        <div className="ticker-item">LIVE R-410A PRICE: $420/Jug (+12% this week)</div>
        <div className="ticker-item text-red-500">R-454B STOCK: CRITICAL LOW</div>
        <div className="ticker-item">FL LEAK REPORTS: +400 Today</div>
        <div className="ticker-item text-yellow-500">EPA AUDIT SEASON: ACTIVE</div>
        <div className="ticker-item">R-22 BUYBACK: $40/lb</div>
      </div>
    </div>
  </div>
);

// --- COMPONENT: DOOMSDAY TIMER ---
const DoomsdayTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const targetDate = new Date("2026-01-01T00:00:00").getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center gap-4 bg-black/50 border border-red-900/50 p-4 rounded-lg backdrop-blur-sm">
      <div className="text-right">
        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Supply Chain Crunch</p>
        <p className="text-[10px] text-slate-500 uppercase">Time Remaining</p>
      </div>
      <div className="flex gap-2 font-mono text-2xl md:text-4xl font-bold text-red-500 tracking-tighter">
        <span>{timeLeft.days}</span><span className="text-sm self-end pb-2 text-red-800">D</span>
        <span>:</span>
        <span>{timeLeft.hours.toString().padStart(2, '0')}</span><span className="text-sm self-end pb-2 text-red-800">H</span>
        <span>:</span>
        <span>{timeLeft.minutes.toString().padStart(2, '0')}</span><span className="text-sm self-end pb-2 text-red-800">M</span>
      </div>
    </div>
  );
};

// --- COMPONENT: STOCKPILE SCANNER ---
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
    <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
        <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-500" /> Stockpile_Scanner_V1
        </span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Enter Condenser Mfg Year</label>
          <div className="flex gap-2 mt-1">
            <input 
              aria-label="Manufacturing Year"
              type="number" 
              placeholder="e.g. 2024"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-black border border-slate-700 text-white font-mono p-3 rounded w-full focus:border-blue-500 outline-none"
            />
            <button 
              onClick={checkCompliance}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 rounded uppercase text-sm tracking-wider"
            >
              Scan
            </button>
          </div>
        </div>

        {status === "SAFE" && (
          <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              <div>
                <h4 className="text-lg font-bold text-emerald-400">SAFE TO INSTALL</h4>
                <p className="text-xs text-emerald-200/70 leading-relaxed mt-1">
                  Protected by EPA Indefinite Install Rule (Dec 2025 Update). This unit is legally classified as "Existing Inventory."
                </p>
                <button className="mt-3 text-[10px] font-bold uppercase text-emerald-500 border border-emerald-500/30 px-3 py-1 rounded hover:bg-emerald-500/10 flex items-center gap-1">
                  <Download className="w-3 h-3" /> Save Certificate
                </button>
              </div>
            </div>
          </div>
        )}

        {status === "RISK" && (
          <div className="bg-red-900/20 border border-red-500/30 p-4 rounded animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-8 h-8 text-red-500" />
              <div>
                <h4 className="text-lg font-bold text-red-500">RISK DETECTED</h4>
                <p className="text-xs text-red-200/70 leading-relaxed mt-1">
                  Unit manufactured post-ban. Installation may violate AIM Act Subsection H. Do not install without checking GWP limits.
                </p>
                <button className="mt-3 text-[10px] font-bold uppercase text-red-400 border border-red-500/30 px-3 py-1 rounded hover:bg-red-500/10 flex items-center gap-1">
                  <Download className="w-3 h-3" /> Download Liability Waiver
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENT: 15LB LEAK LOG ---
const LeakLogWidget = () => {
  const [charge, setCharge] = useState("");
  const [leak, setLeak] = useState("");
  
  const rate = charge && leak ? (parseFloat(leak) / parseFloat(charge)) * 100 : 0;
  const isDanger = rate > 10;

  return (
    <div className="w-full max-w-sm bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4 text-slate-400">
        <Activity className="w-4 h-4 text-yellow-500" />
        <span className="text-xs font-bold uppercase tracking-widest">Leak Threshold Calc</span>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-slate-500 uppercase font-bold">System Charge</label>
            <div className="flex items-center bg-black border border-slate-700 rounded mt-1 px-2">
              <input 
                aria-label="System Charge"
                placeholder="0"
                type="number" 
                value={charge} onChange={(e) => setCharge(e.target.value)}
                className="bg-transparent w-full p-2 text-sm font-mono text-white outline-none placeholder:text-slate-800"
              />
              <span className="text-xs text-slate-600 font-mono">lbs</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase font-bold">Leak Added</label>
             <div className="flex items-center bg-black border border-slate-700 rounded mt-1 px-2">
              <input 
                aria-label="Leak Amount"
                placeholder="0"
                type="number" 
                value={leak} onChange={(e) => setLeak(e.target.value)}
                className="bg-transparent w-full p-2 text-sm font-mono text-white outline-none placeholder:text-slate-800"
              />
              <span className="text-xs text-slate-600 font-mono">lbs</span>
            </div>
          </div>
        </div>

        <div className={`p-3 rounded border text-center transition-all ${isDanger ? 'bg-red-900/20 border-red-500 text-red-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
          <div className="text-[10px] uppercase">Calculated Leak Rate</div>
          <div className="text-2xl font-mono font-bold">{rate.toFixed(1)}%</div>
          {isDanger && <div className="text-[10px] font-bold mt-1 animate-pulse">EPA REPORTING REQUIRED</div>}
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  return (
    <main className="min-h-screen pt-12">
      <MarketTicker />
      
      {/* NAVBAR */}
      <nav className="fixed top-8 w-full z-40 bg-[#0f172a]/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrueLogo className="w-8 h-8" />
            <div className="text-xl font-bold tracking-tight text-white">
              True<span className="text-blue-500">608</span> <span className="text-xs text-slate-500 font-mono ml-2 border border-slate-700 px-1 rounded">WAR_ROOM_MODE</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3 h-3" /> Secure Login
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <DoomsdayTimer />
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none text-white">
              R-410A INVENTORY: <br/>
              <span className="text-emerald-500">SAFE</span> OR <span className="text-red-500">STRANDED?</span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-xl font-light border-l-4 border-slate-700 pl-6">
              The EPA Manufacturing Ban is Live. R-454B prices are up 300%. 
              Check your unit's compliance status instantly before you send it to the job site.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
               {/* LEAD MAGNET */}
               <Link 
                href="/sales" 
                className="h-14 px-8 rounded bg-yellow-500 hover:bg-yellow-400 text-black font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] uppercase tracking-wide"
              >
                <FileText className="w-5 h-5" /> Download 2026 Survival Kit
              </Link>
            </div>
            
            <p className="text-xs text-slate-600 max-w-md">
              *Includes Official EPA R-410A Rollback Text & Customer Price Increase Letter template.
            </p>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-8">
            <StockpileScanner />
            <div className="w-full flex justify-end">
               <LeakLogWidget />
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-12 bg-[#0a0a0a] text-center md:text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <ShieldCheck className="w-5 h-5 text-slate-600" />
                    <span className="text-sm font-bold text-slate-500">True608 Intelligence</span>
                </div>
                <p className="text-xs text-slate-600 max-w-md mx-auto md:mx-0">
                    True608 is an independent data analysis tool. Compliance logic based on AIM Act Subsection H and 40 CFR Part 84. Not legal advice.
                </p>
            </div>
            <div className="text-center md:text-right space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                  <Lock className="w-3 h-3" /> SSL Encrypted
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-400 uppercase font-bold tracking-widest ml-2">
                  <Terminal className="w-3 h-3" /> EPA Data Synced
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-400 uppercase font-bold tracking-widest ml-2">
                  <ShieldCheck className="w-3 h-3" /> No-Spam Guarantee
                </div>
            </div>
        </div>
      </footer>
    </main>
  );
}