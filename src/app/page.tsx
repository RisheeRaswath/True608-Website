"use client";

import { useState } from "react"; 
import { supabase } from "@/lib/supabase"; 
import { toast } from "sonner"; 
import { CheckCircle2, ArrowRight } from "lucide-react";

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
      toast.error("Please complete all fields."); 
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
      toast.error("Connection failed. Please try again."); 
    } else {
      toast.success("Log entry saved successfully."); 
      setFormData({ ...formData, location: "", unit_id: "", amount: "" });
      document.getElementById("field-1")?.focus();
    }
  };

  return (
    // THEME: Professional Slate & Matte Black (Eye-Friendly)
    <main className="min-h-screen bg-[#0F1117] text-slate-300 p-6 flex flex-col items-center font-sans">
      
      <div className="w-full max-w-md mb-10 mt-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          True<span className="text-blue-500">608</span> Systems
        </h1>
        <p className="text-slate-500 text-sm font-medium">The Operating System for HVAC Compliance</p>
      </div>

      <div className="w-full max-w-md space-y-6">
        
        {/* Field 1 */}
        <div className="group">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Job Site Location</label>
          <input 
            id="field-1"
            name="location"
            value={formData.location}
            onChange={handleChange}
            onKeyDown={(e) => handleEnter(e, "field-2")}
            type="text" 
            enterKeyHint="next" 
            placeholder="e.g. 123 Main St"
            className="w-full bg-[#1A1D24] focus:bg-[#20242D] border border-slate-800 focus:border-blue-500/50 rounded-xl p-4 text-white placeholder:text-slate-600 outline-none transition-all duration-200"
          />
        </div>

        {/* Field 2 */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Equipment ID</label>
          <input 
            id="field-2"
            name="unit_id"
            value={formData.unit_id}
            onChange={handleChange}
            onKeyDown={(e) => handleEnter(e, "field-3")}
            type="text" 
            enterKeyHint="next"
            placeholder="e.g. RTU-04"
            className="w-full bg-[#1A1D24] focus:bg-[#20242D] border border-slate-800 focus:border-blue-500/50 rounded-xl p-4 text-white placeholder:text-slate-600 outline-none transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Refrigerant</label>
            <div className="relative">
                <select 
                id="field-3"
                name="refrigerant"
                value={formData.refrigerant}
                onChange={handleChange}
                onKeyDown={(e) => handleEnter(e, "field-4")}
                className="w-full bg-[#1A1D24] focus:bg-[#20242D] border border-slate-800 focus:border-blue-500/50 rounded-xl p-4 text-white outline-none transition-all duration-200 appearance-none cursor-pointer"
                >
                <option>R-410A</option>
                <option>R-22</option>
                <option>R-404A</option>
                <option>R-134a</option>
                </select>
                {/* Custom arrow for cleaner look */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Lbs Added</label>
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
              className="w-full bg-[#1A1D24] focus:bg-[#20242D] border border-slate-800 focus:border-blue-500/50 rounded-xl p-4 text-white placeholder:text-slate-600 outline-none transition-all duration-200"
            />
          </div>
        </div>

        <button 
          onClick={() => handleSave()}
          disabled={loading}
          type="button" 
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-4 rounded-xl mt-8 transition-all active:scale-[0.99] shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
        >
          {loading ? "Saving..." : (
            <>
                <span>Save Entry</span>
                <ArrowRight className="w-4 h-4 opacity-80" />
            </>
          )}
        </button>

      </div>
    </main>
  );
}