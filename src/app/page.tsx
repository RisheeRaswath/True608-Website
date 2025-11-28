"use client"; // This tells Next.js this is an interactive page

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  // 1. The Memory (State)
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    unit_id: "",
    refrigerant: "R-410A",
    amount: "",
  });

  // 2. The Logic (Handle Change)
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. The Action (Save to Database)
  const handleSave = async () => {
    if (!formData.location || !formData.unit_id || !formData.amount) {
      alert("Please fill in all fields!");
      return;
    }

    setLoading(true); // Turn on loading spinner

    // Send data to Supabase
    const { error } = await supabase
      .from("logs") // The table name
      .insert([
        {
          location: formData.location,
          unit_id: formData.unit_id,
          refrigerant: formData.refrigerant,
          amount: parseFloat(formData.amount), // Convert text to number
        },
      ]);

    setLoading(false); // Turn off loading

    if (error) {
      console.error("Supabase Error:", error);
      // THIS COMMAND FORCES THE ERROR TO REVEAL ITSELF
      alert("FULL ERROR DETAILS:\n" + JSON.stringify(error, null, 2));
    } else {
      alert("Log Entry Saved Successfully!");
      setFormData({ ...formData, location: "", unit_id: "", amount: "" });
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-md mb-8 mt-10">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          True608
        </h1>
        <p className="text-gray-500 text-sm">EPA Section 608 Compliance Log</p>
      </div>

      {/* Form */}
      <div className="w-full max-w-md space-y-5">
        
        {/* Field 1: Location */}
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Job Location</label>
          <input 
            name="location"
            value={formData.location}
            onChange={handleChange}
            type="text" 
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
            placeholder="e.g. RTU-04"
            className="w-full bg-gray-900 focus:bg-gray-800 border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Field 3: Gas & Amount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Refrigerant</label>
            <select 
              name="refrigerant"
              value={formData.refrigerant}
              onChange={handleChange}
              className="w-full bg-gray-900 focus:bg-gray-800 border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all duration-200"
            >
              <option>R-410A</option>
              <option>R-22</option>
              <option>R-404A</option>
              <option>R-134a</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Amount (lbs)</label>
            <input 
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              type="number" 
              step="0.1"
              min="0"
              placeholder="0.0"
              className="w-full bg-gray-900 focus:bg-gray-800 border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-bold py-4 rounded-lg mt-6 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
        >
          {loading ? "SAVING..." : "SAVE LOG ENTRY"}
        </button>

      </div>
    </main>
  );
}