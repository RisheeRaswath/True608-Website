"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-8">Last Updated: November 2025</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-lg mb-3">1. Agreement to Terms</h2>
            <p>
              These Terms of Service constitute a legally binding agreement made between you and True608 Systems. 
              By accessing the Site, you agree that you have read, understood, and agreed to be bound by all of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. Intellectual Property</h2>
            <p>
              The Site and its original content, features, and functionality are owned by True608 Systems and are protected by 
              international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">3. User Representations</h2>
            <p>
              By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; 
              (2) you will maintain the accuracy of such information.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">4. Limitation of Liability</h2>
            <p className="p-4 bg-red-900/10 border border-red-900/30 rounded-lg text-red-200">
              CRITICAL: True608 Systems is a record-keeping tool. We are not responsible for the accuracy of the data entered by your technicians, 
              nor are we liable for any fines, penalties, or legal actions taken by the EPA or other regulatory bodies. 
              You are solely responsible for ensuring your compliance with EPA Section 608.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">5. Contact</h2>
            <p>
              To resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <br/>
              <span className="text-white">support@true608.com</span>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}