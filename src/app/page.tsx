"use client";

import { Logo } from "@/components/Logo";
import { ArrowRight, Shield, BarChart3, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-xl font-bold tracking-tight">
              True<span className="text-blue-500">608</span>
            </div>
          </Link>

          <div className="flex gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center">
              Admin Login
            </Link>
            <Link 
              href="/log" 
              className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: THE PITCH */}
          <div className="text-left">
            
            {/* ALERT BADGE */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/20 border border-red-800/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              Strict Enforcement Active
            </div>
            
            {/* HERO TITLE - UPDATED TEXT */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 leading-[1.1]">
              Avoid <span className="text-red-500">crippling</span> <br/> EPA fines.
            </h1>
            
            <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl">
              Paper logs get lost. Spreadsheets get broken. 
              <strong>True608</strong> is the digital fortress that tracks every ounce of refrigerant automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/log" 
                className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-blue-900/20"
              >
                Start Audit Defense <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="mailto:sales@true608.com" 
                className="h-12 px-8 rounded-full border border-slate-700 hover:border-slate-500 text-slate-300 font-medium flex items-center justify-center gap-2 transition-all hover:bg-white/5"
              >
                Book Demo
              </Link>
            </div>

            {/* TRUST BADGES */}
            <div className="mt-12 pt-8 border-t border-white/5">
              <p className="text-xs text-slate-600 font-bold uppercase tracking-widest mb-4">Engineered for compliance with</p>
              <div className="flex gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="text-xl font-black tracking-tighter text-white">EPA<span className="font-light">608</span></div>
                <div className="text-xl font-black tracking-tighter text-white">NATE</div>
                <div className="text-xl font-black tracking-tighter text-white">OSHA</div>
              </div>
            </div>
          </div>

          {/* RIGHT: THE PHONE VISUAL */}
          <div className="relative mx-auto lg:mx-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] -z-10"></div>
            
            {/* REMOVED: transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 */}
<div className="relative w-[300px] h-[600px] bg-[#0a0a0a] border-[8px] border-[#2a2a2a] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-24 bg-black rounded-b-xl z-20"></div>
              
              <div className="flex-1 bg-[#0F1117] p-4 pt-10 flex flex-col gap-4">
                <div className="text-center mb-4">
                  <div className="text-xl font-bold text-white">True<span className="text-blue-500">608</span></div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest">Field Tool V1</div>
                </div>
                
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Job Site</div>
                  <div className="h-10 bg-[#1A1D24] rounded-lg border border-slate-800 flex items-center px-3 text-sm text-white">
                    123 Main St, Server Room
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Unit ID</div>
                  <div className="h-10 bg-[#1A1D24] rounded-lg border border-slate-800 flex items-center px-3 text-sm text-white flex justify-between">
                    <span>RTU-04</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
                
                <div className="mt-auto mb-6">
                  <div className="h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-900/20">
                    SECURE ENTRY
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. FEATURES */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Audit Proof</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Every entry is timestamped, geotagged, and backed up. When the EPA knocks, you just print the PDF report.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
              <BarChart3 className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Leak Detection</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Our algorithms spot high-usage units automatically. Fix leaks before they become fines.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
              <Lock className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Bank-Grade Vault</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Your data is encrypted at rest and in transit. Accessible only by you, from anywhere on Earth.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="text-lg font-bold text-white mb-2">True<span className="text-blue-500">608</span></div>
            <p className="text-slate-500 text-sm">
              &copy; 2025 True608 Systems. All rights reserved.
            </p>
          </div>
          
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="mailto:support@true608.com" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}