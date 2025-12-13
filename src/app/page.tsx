"use client";

import Link from "next/link";
import { useState } from "react";
import { TrueLogo } from "@/components/TrueLogo"; 
import { ShieldCheck, ArrowRight, Check, AlertTriangle, Terminal } from "lucide-react";

// --- COMPONENT: THE CHECKER (Centered & Sleek) ---
const ComplianceChecker = () => {
  const [year, setYear] = useState("");
  const [status, setStatus] = useState<"IDLE" | "SAFE" | "RISK">("IDLE");

  const check = () => {
    if (!year) return;
    const y = parseInt(year);
    setStatus(y < 2025 ? "SAFE" : "RISK");
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-xl shadow-2xl mt-12">
      <div className="bg-black/40 rounded-xl p-6 border border-white/5">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
              Condenser Mfg Year
            </label>
            <input 
              aria-label="Year"
              type="number" 
              placeholder="e.g. 2025"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-transparent border-b border-slate-700 text-white text-2xl font-mono py-2 focus:border-blue-500 outline-none placeholder:text-slate-800 transition-colors"
            />
          </div>
          <button 
            onClick={check}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-lg uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20"
          >
            Check Status
          </button>
        </div>

        {/* RESULTS AREA */}
        {status === "SAFE" && (
          <div className="mt-6 pt-6 border-t border-white/10 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">Safe to Install</h4>
              <p className="text-slate-400 text-sm mt-1">
                Protected by the EPA Indefinite Install Rule. This unit is classified as existing inventory.
              </p>
            </div>
          </div>
        )}

        {status === "RISK" && (
          <div className="mt-6 pt-6 border-t border-white/10 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">Risk Detected</h4>
              <p className="text-slate-400 text-sm mt-1">
                Unit manufactured post-ban. Installation may violate AIM Act Subsection H. Download waiver below.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* 1. NAVBAR (Minimalist) */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
            <TrueLogo className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">True608</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Admin Login
            </Link>
            <Link 
              href="/log" 
              className="bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide hover:bg-slate-200 transition-colors"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (Centered & Clean) */}
      <div className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            EPA Manufacturing Ban Live
          </div>

          {/* HEADLINE */}
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 text-white leading-[1.1]">
            Is your inventory <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Safe or Stranded?
            </span>
          </h1>

          {/* SUBHEAD */}
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            The R-410A Ban is here. R-454B prices are surging. 
            <strong>True608</strong> is the command center to verify compliance and track every ounce of refrigerant across your fleet.
          </p>

          {/* THE TOOL (Centered Anchor) */}
          <ComplianceChecker />

          {/* SECONDARY CTA */}
          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Link href="/sales" className="hover:text-white transition-colors border-b border-slate-700 hover:border-white pb-0.5">
              Need the 2026 Customer Letter? Download the Survival Kit.
            </Link>
            <ArrowRight className="w-4 h-4" />
          </div>

        </div>
      </div>

      {/* 3. VALUE PROPS (Grid) */}
      <div className="max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 text-blue-500">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Audit-Proof Logs</h3>
            <p className="text-slate-400 leading-relaxed">
              Every entry is timestamped, encrypted, and backed up. When the EPA knocks, you just hit print.
            </p>
          </div>
          {/* Feature 2 */}
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 text-emerald-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Leak Detection</h3>
            <p className="text-slate-400 leading-relaxed">
              Our algorithms spot high-usage units automatically. Fix leaks before they become 15lb fines.
            </p>
          </div>
          {/* Feature 3 */}
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 text-purple-500">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Inventory Defense</h3>
            <p className="text-slate-400 leading-relaxed">
              Know exactly which units are safe to install under the new AIM Act rules vs. which are stranded assets.
            </p>
          </div>
        </div>
      </div>

      {/* 4. FOOTER */}
      <footer className="py-12 text-center border-t border-white/5">
        <p className="text-slate-600 text-xs uppercase tracking-widest">
          &copy; 2025 True608 Systems.
        </p>
      </footer>

    </main>
  );
}