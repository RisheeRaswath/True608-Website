"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last Updated: November 2025</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-lg mb-3">1. Introduction</h2>
            <p>
              True608 Systems ("we," "us," or "our") respects the privacy of our users ("user" or "you"). 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              and use our HVAC compliance application.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. Data We Collect</h2>
            <p>
              We collect information that you voluntarily provide to us when you register for the application, 
              specifically: Email addresses, Operational Logs (Refrigerant types, Amounts, Unit IDs), and Job Site Locations.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">3. Use of Your Information</h2>
            <p>
              We use the information we collect to:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Generate EPA Section 608 compliance reports.</li>
                <li>Monitor refrigerant usage trends.</li>
                <li>Prevent fraudulent or unauthorized access.</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">4. Data Security</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. 
              Data is encrypted at rest and in transit using enterprise-grade standards.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">5. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at: <br/>
              <span className="text-white">support@true608.com</span>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}