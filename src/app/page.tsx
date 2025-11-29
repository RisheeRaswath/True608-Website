"use client";

import Link from "next/link";
import { ArrowRight, Shield, BarChart3, Lock, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            True<span className="text-blue-500">608</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Admin Login
            </Link>
            <Link 
              href="/log" 
              className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-200 transition-all"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-800/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          System Online
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
          Compliance without <br/> the chaos.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The operating system for HVAC fleets. Automate EPA Section 608 logs, track refrigerant usage, and avoid fines.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/log" 
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            Open Field Tool <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="mailto:sales@true608.com" 
            className="w-full sm:w-auto h-12 px-8 rounded-full border border-slate-700 hover:border-slate-500 text-slate-300 font-medium flex items-center justify-center gap-2 transition-all"
          >
            Contact Sales
          </Link>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">EPA Compliant</h3>
            <p className="text-slate-400 text-sm">Built strictly to Section 608 standards. Never lose a paper log again.</p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">Real-Time Analytics</h3>
            <p className="text-slate-400 text-sm">Track gas usage across all job sites instantly from the Command Center.</p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">Secure Vault</h3>
            <p className="text-slate-400 text-sm">Your data is encrypted and backed up in the cloud. Accessible anywhere.</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 text-center">
        <p className="text-slate-600 text-sm">
          &copy; 2025 True608 Systems. All rights reserved.
        </p>
      </footer>

    </main>
  );
}