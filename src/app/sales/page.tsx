"use client";

import Link from "next/link";
import { TrueLogo } from "@/components/TrueLogo"; 
import { CheckCircle2, ArrowRight, Mail, Phone, Globe, Building2, Users, ShieldCheck } from "lucide-react";

export default function SalesPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-3">
            <TrueLogo className="w-8 h-8" />
            <div className="text-xl font-bold tracking-tight">
              True<span className="text-blue-500">608</span>
            </div>
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: THE PITCH */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-800/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Building2 className="w-3 h-3" />
              Enterprise Solutions
            </div>
            
            <h1 className="text-5xl font-black tracking-tight mb-6 leading-tight">
              Equip your entire fleet <br/>
              with <span className="text-blue-500">military-grade</span> compliance.
            </h1>
            
            <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
              True608 Enterprise Edition offers volume licensing, API access, and dedicated support for organizations with 5+ technicians.
            </p>

            <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-300 font-medium">Centralized Admin Command Center</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-300 font-medium">Unlimited Technician Accounts</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-300 font-medium">Priority 24/7 Phone Support</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-300 font-medium">Custom Asset Tags (We print & ship)</span>
                </div>
            </div>

            <div className="flex gap-4">
              <Link 
                href="mailto:sales@true608.com?subject=Enterprise Inquiry" 
                className="h-12 px-8 rounded-full bg-white text-black font-bold flex items-center justify-center gap-2 transition-all hover:bg-slate-200"
              >
                <Mail className="w-4 h-4" /> Contact Sales Team
              </Link>
            </div>
          </div>

          {/* RIGHT: CONTACT CARD */}
          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -z-10"></div>
            
            <div className="bg-[#0F1117] border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <ShieldCheck className="w-24 h-24 text-blue-500" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Direct Line</h3>
                <p className="text-slate-500 text-sm mb-8">Speak directly with an implementation specialist.</p>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-blue-500">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Email Inquiry</p>
                            <a href="mailto:sales@true608.com" className="text-lg font-medium text-white hover:text-blue-400 transition-colors">sales@true608.com</a>
                            <p className="text-xs text-slate-600 mt-1">Response time: &lt; 2 hours</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-emerald-500">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Current Clients</p>
                            <a href="mailto:support@true608.com" className="text-lg font-medium text-white hover:text-emerald-400 transition-colors">support@true608.com</a>
                            <p className="text-xs text-slate-600 mt-1">Technical assistance & onboarding</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-purple-500">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Headquarters</p>
                            <p className="text-lg font-medium text-white">Bangalore • New York</p>
                            <p className="text-xs text-slate-600 mt-1">Global operations</p>
                        </div>
                    </div>
                </div>

            </div>
          </div>

        </div>
      </div>

      <footer className="border-t border-white/5 py-12 text-center bg-[#0a0a0a]">
        <p className="text-slate-600 text-sm">
          &copy; 2025 True608 Systems. All rights reserved.
        </p>
      </footer>

    </main>
  );
}