"use client";

import { useState } from "react"; 
import { supabase } from "@/lib/supabase"; 
import { toast } from "sonner"; 

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

  const handleSave = async () => {
    if (!formData.location || !formData.unit_id || !formData.amount) {
      toast.error("Required: Please complete all fields."); 
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
      toast.error("Connection Failed. Try again."); 
    } else {
      toast.success("Entry Logged Successfully."); 
      setFormData({ ...formData, location: "", unit_id: "", amount: "" });
      document.getElementById("field-1")?.focus();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      
      <div className="w-full max-w-md mb-8 mt-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
          True<span className="text-blue-500">608</span>
        </h1>
        <div className="h-1 w-12 bg-blue-500 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Compliance Operating System</p>
      </div>

      <div className="w-full max-w-md space-y-6">
        
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Job Site Location</label>
          <input 
            id="field-1"
            name="location"
            value={formData.location}
            onChange={handleChange}
            onKeyDown={(e) => handleEnter(e, "field-2")}
            type="text" 
            enterKeyHint="next" 
            placeholder="e.g. 123 Main St, Server Room"
            className="w-full bg-[#0a0a0a] focus:bg-[#111] border border-gray-800 focus:border-blue-500 rounded-xl p-4 text-white outline-none transition-all duration-200 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Equipment ID</label>
          <input 
            id="field-2"
            name="unit_id"
            value={formData.unit_id}
            onChange={handleChange}
            onKeyDown={(e) => handleEnter(e, "field-3")}
            type="text" 
            enterKeyHint="next"
            placeholder="e.g. RTU-04 / AHU-02"
            className="w-full bg-[#0a0a0a] focus:bg-[#111] border border-gray-800 focus:border-blue-500 rounded-xl p-4 text-white outline-none transition-all duration-200 shadow-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Refrigerant</label>
            <select 
              id="field-3"
              name="refrigerant"
              value={formData.refrigerant}
              onChange={handleChange}
              onKeyDown={(e) => handleEnter(e, "field-4")}
              className="w-full bg-[#0a0a0a] focus:bg-[#111] border border-gray-800 focus:border-blue-500 rounded-xl p-4 text-white outline-none transition-all duration-200 cursor-pointer appearance-none"
            >
              <option>R-410A</option>
              <option>R-22</option>
              <option>R-404A</option>
              <option>R-134a</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Lbs Added</label>
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
              className="w-full bg-[#0a0a0a] focus:bg-[#111] border border-gray-800 focus:border-blue-500 rounded-xl p-4 text-white outline-none transition-all duration-200 shadow-sm"
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          type="button" 
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-4 rounded-xl mt-8 transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 text-sm tracking-wide"
        >
          {loading ? "PROCESSING..." : "SECURE LOG ENTRY"}
        </button>

      </div>
    </main>
  );
}