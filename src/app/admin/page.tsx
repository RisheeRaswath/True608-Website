"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA ON LOAD
  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    // Get all columns from 'logs', ordered by newest first
    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching logs:", error);
      alert("Error loading data!");
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  }

  // DELETE FUNCTION (For cleaning up test data)
  async function deleteLog(id: number) {
    const confirm = window.confirm("Are you sure you want to delete this entry?");
    if (!confirm) return;

    const { error } = await supabase.from("logs").delete().eq("id", id);

    if (error) {
      alert("Error deleting!");
    } else {
      // Remove from screen immediately
      setLogs(logs.filter((log) => log.id !== id));
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Command Center
          </h1>
          <p className="text-gray-500 text-sm mt-1">Live Feed</p>
        </div>
        <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
          <span className="text-emerald-400 font-bold">{logs.length}</span>{" "}
          <span className="text-gray-400 text-sm">Entries Logged</span>
        </div>
      </div>

      {/* The Data Table */}
      {loading ? (
        <p className="text-gray-500 animate-pulse">Establishing Uplink...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-900 text-gray-200 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Unit ID</th>
                <th className="px-6 py-4">Gas</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-black/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {log.location}
                  </td>
                  <td className="px-6 py-4">{log.unit_id}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs border border-blue-900/50">
                      {log.refrigerant}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">
                    {log.amount} lbs
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteLog(log.id)}
                      className="text-red-500 hover:text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {logs.length === 0 && (
            <div className="p-10 text-center text-gray-600">
              No data found in the vault.
            </div>
          )}
        </div>
      )}
    </main>
  );
}