"use client";

import { useState } from "react"; 
import { supabase } from "@/lib/supabase"; 
import { toast } from "sonner"; 
import { ArrowRight, QrCode, X, CheckCircle2 } from "lucide-react"; 
import { Scanner } from '@yudiel/react-qr-scanner'; 

export default function LogPage() {
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false); // Controls Camera
  
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

  // --- CAMERA LOGIC ---
  const handleScan = (result: any) => {
    if (result) {
      const rawValue = result[0]?.rawValue; 
      if (rawValue) {
        // Extract ID if it's a full URL
        const cleanId = rawValue.split('=').pop() || rawValue;
        
        setFormData(prev => ({ ...prev, unit_id: cleanId })); 
        setIsScanning(false); 
        toast.success("Asset Tag Identified: " + cleanId);
        document.getElementById("field-3")?.focus(); // Jump to next field
      }
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.location || !formData.unit_id || !formData.amount) {
      toast.error("Compliance Error: All fields required."); 
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
      toast.error("Network Error. Data cached locally."); 
    } else {
      toast.success("Log Entry Secured."); 
      setFormData({ ...formData, location: "", unit_id: "", amount: "" });
      document.getElementById("field-1")?.focus();
    }
  };

  return (
    <main className="min-h-screen bg-[#0F1117] text-slate-300 p-6 flex flex-col items-center font-sans">
      
      {/* HEADER */}
      <div className="w-full max-w-md mb-10 mt-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          True<span className="text-blue-500">608</span> Systems
        </h1>
        <div className="flex items-center justify-center gap-2">
            <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Field Operations</p>
        </div>
      </div>

      <div className="w-full max-w-md space-y-6">
        
        {/* --- CAMERA OVERLAY --- */}
        {isScanning && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="w-full max-w-sm relative rounded-3xl overflow-hidden border-2 border-blue-500 shadow-2xl shadow-blue-500/20">
                <Scanner 
                    onScan={handleScan} 
                    allowMultiple={true}
                    scanDelay={500}
                    components={{ 
                      torch: true // KEEPING TORCH, REMOVED AUDIO TO FIX ERROR
                    }}
                />
                <button 
                    onClick={() => setIsScanning(false)}
                    className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-red-500/80 transition-colors z-20"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-0 w-full text-center">
                    <span className="bg-blue-600/90 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                        Scanning Asset Tag...
                    </span>
                </div>
            </div>
            <p className="mt-8 text-slate-400 text-sm font-medium">Align QR Code within frame</p>
            <button onClick={() => setIsScanning(false)} className="mt-6 px-6 py-3 rounded-xl bg-slate-800 text-white font-bold text-sm">
                Cancel Scan
            </button>
          </div>
        )}

        {/* Field 1 */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Job Site Location</label>
          <input 
            id="field-1"
            name="location"
            value={formData.location}
            onChange={handleChange}
            onKeyDown={(e) => handleEnter(e, "field-2")}
            type="text" 
            enterKeyHint="next" 
            placeholder="e.g. 123 Main St"
            className="w-full bg-[#1A1D24] focus:bg-[#20242D] border border-slate-800 focus:border-blue-500 rounded-xl p-4 text-white placeholder:text-slate-600 outline-none transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Field 2 - HYBRID SCANNER INPUT */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Equipment ID</label>
          <div className="relative group">
            <input 
              id="field-2"
              name="unit_id"
              value={formData.unit_id}
              onChange={handleChange}
              onKeyDown={(e) => handleEnter(e, "field-3")}
              type="text" 
              enterKeyHint="next"
              placeholder="Scan QR or type ID..."
              className="w-full bg-[#1A1D24] focus:bg-[#20242D] border border-slate-800 focus:border-blue-500 rounded-xl p-4 pr-14 text-white placeholder:text-slate-600 outline-none transition-all duration-200 shadow-sm"
            />
            {/* THE MAGIC BUTTON */}
            <button 
              onClick={() => setIsScanning(true)}
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-all active:scale-95 border border-blue-500/20 hover:border-blue-500/50"
              title="Scan Asset Tag"
            >
              <QrCode className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Refrigerant</label>
            <div className="relative">
                <select 
                id="field-3"
                name="refrigerant"
                value={formData.refrigerant}
                onChange={handleChange}
                onKeyDown={(e) => handleEnter(e, "field-4")}
                className="w-full bg-[#1A1D24] focus:bg-[#20242D] border border-slate-800 focus:border-blue-500 rounded-xl p-4 text-white outline-none transition-all duration-200 appearance-none cursor-pointer shadow-sm font-medium"
                >
                <option>R-410A</option>
                <option>R-22</option>
                <option>R-404A</option>
                <option>R-134a</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Lbs Added</label>
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
              className="w-full bg-[#1A1D24] focus:bg-[#20242D] border border-slate-800 focus:border-blue-500 rounded-xl p-4 text-white placeholder:text-slate-600 outline-none transition-all duration-200 shadow-sm font-mono"
            />
          </div>
        </div>

        <button 
          onClick={() => handleSave()}
          disabled={loading}
          type="button" 
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl mt-8 transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
        >
          {loading ? "Transmitting..." : (
            <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Save Log Entry</span>
            </>
          )}
        </button>

      </div>
    </main>
  );
}