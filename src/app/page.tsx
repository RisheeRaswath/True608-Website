"use client";

import { useState } from "react"; 
import { supabase } from "@/lib/supabase"; 
import { toast } from "sonner"; 
import { Shield, ChevronRight } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    unit_id: "",
    refrigerant: "R-410A",
    amount: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEnter = (e: React.KeyboardEvent, nextId: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextId === "SUBMIT") {
        handleSave();
      } else {
        document.getElementById(nextId)?.focus();
      }
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.location || !formData.unit_id || !formData.amount) {
      toast.error("MISSING INTEL: All fields required."); 
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("logs")
      .insert([{
          location: formData.location,
          unit_id: formData.unit_id,
          refrigerant: formData.refrigerant,
          amount: parseFloat(formData.amount),
        }]);

    setLoading(false);

    if (error) {
      toast.error("CONNECTION SEVERED. Retrying..."); 
    } else {
      toast.success("ENTRY SECURED."); 
      setFormData({ ...formData, location: "", unit_id: "", amount: "" });
      document.getElementById("field-1")?.focus();
    }
  };

  return (
    // THEME: "First Avenger" Navy Blue Gradient
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] text-slate-200 p-6 flex flex-col items-center font-sans selection:bg-red-500 selection:text-white">
      
      <div className="w-full max-w-md mb-8 mt-12 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -z-10"></div>
        <div className="inline-flex items-center justify-center p-3 bg-slate-800/50 rounded-full border border-slate-700 mb-4 shadow-lg shadow-blue-900/20">
            <Shield className="w-8 h-8 text-red-500 fill-red-500/20" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-white mb-1 uppercase">
          True<span className="text-blue-500">608</span>
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-red-600 via-white to-blue-600 mx-auto rounded-full mb-4"></div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Compliance Protocol Active</p>
      </div>

      <div className="w-full max-w-md space-y-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm">
        
        <div>
          <label className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 ml-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></span> Target Location
          </label>
          <input 
            id="field-1"
            name="location"
            value={formData.location}
            onChange={handleChange}
            onKeyDown={(e) => handleEnter(e, "field-2")}
            type="text" 
            enterKeyHint="next" 
            placeholder="SECURE SECTOR 7..."
            className="w-full bg-[#0f172a] focus:bg-[#1e293b] border border-slate-700 focus:border-red-500 rounded-lg p-4 text-white placeholder:text-slate-600 outline-none transition-all duration-300 font-medium tracking-wide shadow-inner"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 ml-1">
             <span className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></span> Unit Identifier
          </label>
          <input 
            id="field-2"
            name="unit_id"
            value={formData.unit_id}
            onChange={handleChange}
            onKeyDown={(e) => handleEnter(e, "field-3")}
            type="text" 
            enterKeyHint="next"
            placeholder="RTU-ALPHA-01..."
            className="w-full bg-[#0f172a] focus:bg-[#1e293b] border border-slate-700 focus:border-red-500 rounded-lg p-4 text-white placeholder:text-slate-600 outline-none transition-all duration-300 font-medium tracking-wide shadow-inner"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 ml-1">
                Compound
            </label>
            <div className="relative">
                <select 
                id="field-3"
                name="refrigerant"
                value={formData.refrigerant}
                onChange={handleChange}
                onKeyDown={(e) => handleEnter(e, "field-4")}
                className="w-full bg-[#0f172a] focus:bg-[#1e293b] border border-slate-700 focus:border-red-500 rounded-lg p-4 text-white outline-none transition-all duration-300 appearance-none font-bold"
                >
                <option>R-410A</option>
                <option>R-22</option>
                <option>R-404A</option>
                <option>R-134a</option>
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none rotate-90" />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 ml-1">
                Quantity (LBS)
            </label>
            <input 
              id="field-4"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              onKeyDown={(e) => handleEnter(e, "SUBMIT")}
              type="number" 
              step="0.1"
              min="0"
              enterKeyHint="done"
              placeholder="0.0"
              className="w-full bg-[#0f172a] focus:bg-[#1e293b] border border-slate-700 focus:border-red-500 rounded-lg p-4 text-white placeholder:text-slate-600 outline-none transition-all duration-300 font-bold text-lg shadow-inner"
            />
          </div>
        </div>

        <button 
          onClick={() => handleSave()}
          disabled={loading}
          type="button" 
          className="w-full cursor-pointer group relative overflow-hidden bg-blue-700 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black py-4 rounded-lg mt-8 transition-all active:scale-[0.98] shadow-lg shadow-blue-900/50 border-b-4 border-blue-900 active:border-b-0 active:translate-y-1"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <span className="flex items-center justify-center gap-2 tracking-widest">
            {loading ? "TRANSMITTING..." : "CONFIRM ENTRY"}
            {!loading && <ChevronRight className="w-5 h-5" />}
          </span>
        </button>

      </div>
    </main>
  );
}