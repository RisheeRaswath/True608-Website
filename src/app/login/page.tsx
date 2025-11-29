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

  // UPDATED: This now handles the form submission natively
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the page from reloading

    if (!formData.location || !formData.unit_id || !formData.amount) {
      toast.error("Missing Data: Please fill all fields."); 
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("logs")
      .insert([
        {
          location: formData.location,
          unit_id: formData.unit_id,
          refrigerant: formData.refrigerant,
          amount: parseFloat(formData.amount),
        },
      ]);

    setLoading(false);

    if (error) {
      console.error("Supabase Error:", error);
      toast.error("Database Connection Failed."); 
    } else {
      toast.success("Log Entry Secured."); 
      setFormData({ ...formData, location: "", unit_id: "", amount: "" });
      
      // Optional: Focus back on the first box manually if needed, 
      // but usually the user wants to see the success message first.
      // (document.getElementsByName('location')[0] as HTMLInputElement)?.focus();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      
      <div className="w-full max-w-md mb-8 mt-10">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          True608
        </h1>
        <p className="text-gray-500 text-sm">EPA Section 608 Compliance Log</p>
      </div>

      {/* WRAPPED IN FORM TAG - This enables the "Next" button on mobile keyboards */}
      <form onSubmit={handleSave} className="w-full max-w-md space-y-5">
        
        {/* Field 1: Location */}
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Job Location</label>
          <input 
            name="location"
            value={formData.location}
            onChange={handleChange}
            type="text"
            enterKeyHint="next" // <--- TELLS PHONE TO SHOW "NEXT" BUTTON
            placeholder="e.g. Pizza Hut, Main St"
            className="w-full bg-gray-900 focus:bg-gray-800 border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Field 2: Unit ID */}
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Unit ID</label>
          <input 
            name="unit_id"
            value={formData.unit_id}
            onChange={handleChange}
            type="text" 
            enterKeyHint="next" // <--- TELLS PHONE TO SHOW "NEXT" BUTTON
            placeholder="e.g. RTU-04"
            className="w-full bg-gray-900 focus:bg-gray-800 border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          
          {/* Field 3: Gas Type */}
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Refrigerant</label>
            <select 
              name="refrigerant"
              value={formData.refrigerant}
              onChange={handleChange}
              className="w-full bg-gray-900 focus:bg-gray-800 border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all duration-200 cursor-pointer"
            >
              <option>R-410A</option>
              <option>R-22</option>
              <option>R-404A</option>
              <option>R-134a</option>
            </select>
          </div>

          {/* Field 4: Amount */}
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Amount (lbs)</label>
            <input 
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              type="number" 
              step="0.1"
              min="0"
              enterKeyHint="done" // <--- TELLS PHONE TO SHOW "GO/DONE" BUTTON
              placeholder="0.0"
              className="w-full bg-gray-900 focus:bg-gray-800 border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Action Button */}
        <button 
          type="submit" // <--- THIS MAKES THE "ENTER" KEY CLICK THE BUTTON AUTOMATICALLY
          disabled={loading}
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-bold py-4 rounded-lg mt-6 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
        >
          {loading ? "SAVING..." : "SAVE LOG ENTRY"}
        </button>

      </form>
    </main>
  );
}