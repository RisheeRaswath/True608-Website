"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // STATS STATE
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalGas: 0,
    activeSites: 0
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching logs:", error);
    } else {
      const logData = data || [];
      setLogs(logData);
      
      // CALCULATE REAL-TIME STATS
      const totalGas = logData.reduce((sum: number, log: any) => sum + (log.amount || 0), 0);
      const uniqueSites = new Set(logData.map((log: any) => log.location)).size;
      
      setStats({
        totalEntries: logData.length,
        totalGas: Math.round(totalGas * 10) / 10, // Round to 1 decimal
        activeSites: uniqueSites
      });
    }
    setLoading(false);
  }

  async function deleteLog(id: number) {
    if (!window.confirm("Delete this entry?")) return;
    await supabase.from("logs").delete().eq("id", id);
    fetchLogs(); // Refresh data
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      
      {/* 1. TOP BAR */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-1">True608 Systems</h2>
          <h1 className="text-4xl font-bold text-white">Command Center</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-emerald-500 text-sm font-medium">System Operational</span>
        </div>
      </div>

      {/* 2. KPI CARDS (The Executive View) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card 1: Total Entries */}
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Total Logs</p>
          <h3 className="text-4xl font-bold text-white">{stats.totalEntries}</h3>
          <p className="text-blue-400 text-xs mt-2 font-medium">+12% from last month</p>
        </div>

        {/* Card 2: Gas Usage (The Money Stat) */}
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-16 h-16 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Refrigerant Tracked</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-bold text-white">{stats.totalGas}</h3>
            <span className="text-gray-500 mb-1">lbs</span>
          </div>
          <p className="text-emerald-400 text-xs mt-2 font-medium">Compliance Active</p>
        </div>

        {/* Card 3: Active Sites */}
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-16 h-16 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Active Job Sites</p>
          <h3 className="text-4xl font-bold text-white">{stats.activeSites}</h3>
          <p className="text-purple-400 text-xs mt-2 font-medium">Global Coverage</p>
        </div>

      </div>

      {/* 3. THE DATA TABLE */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="font-semibold text-gray-200">Recent Activity Feed</h3>
          <button onClick={() => fetchLogs()} className="text-xs text-blue-400 hover:text-blue-300">Refresh Data</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 uppercase text-xs tracking-wider font-semibold text-gray-300">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Unit ID</th>
                <th className="px-6 py-4">Gas Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-900/50">
                       LOGGED
                     </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleDateString()} <span className="text-gray-600">{new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{log.location}</td>
                  <td className="px-6 py-4 text-gray-300">{log.unit_id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${log.refrigerant.includes('410') ? 'bg-pink-500' : 'bg-blue-500'}`}></div>
                      {log.refrigerant}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-white">{log.amount} lbs</td>
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => deleteLog(log.id)} className="text-red-500 hover:text-red-400 text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {logs.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-600">No data streams detected.</p>
            </div>
          )}
        </div>
      </div>

    </main>
  );
}