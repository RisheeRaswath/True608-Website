"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Activity, Droplets, MapPin, Trash2, RefreshCw, 
  TrendingUp, AlertCircle, Download, Radio 
} from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // STATS
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalGas: 0,
    activeSites: 0
  });

  // CHART DATA
  const [gasData, setGasData] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any[]>([]);

  useEffect(() => {
    // 1. Initial Fetch
    fetchLogs();

    // 2. REAL-TIME SUBSCRIPTION (THE MAGIC)
    const channel = supabase
      .channel('realtime logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'logs' }, (payload) => {
        console.log('New Log Detected!', payload);
        // Add new log to the top of the list instantly
        setLogs((currentLogs) => {
          const updatedLogs = [payload.new, ...currentLogs];
          processAnalytics(updatedLogs); // Update charts instantly
          return updatedLogs;
        });
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'logs' }, (payload) => {
         // Remove deleted log instantly
         setLogs((currentLogs) => {
            const updatedLogs = currentLogs.filter(log => log.id !== payload.old.id);
            processAnalytics(updatedLogs);
            return updatedLogs;
         });
      })
      .subscribe();

    // Cleanup when leaving page
    return () => {
      supabase.removeChannel(channel);
    }
  }, []);

  async function fetchLogs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLogs(data);
      processAnalytics(data);
    }
    setLoading(false);
  }

  function processAnalytics(data: any[]) {
    // KPI Calc
    const totalGas = data.reduce((sum, log) => sum + (log.amount || 0), 0);
    const uniqueSites = new Set(data.map(log => log.location)).size;
    
    setStats({
      totalEntries: data.length,
      totalGas: Math.round(totalGas * 10) / 10,
      activeSites: uniqueSites
    });

    // Bar Chart Data
    const gasMap: any = {};
    data.forEach(log => {
      const gas = log.refrigerant || 'Unknown';
      if (!gasMap[gas]) gasMap[gas] = 0;
      gasMap[gas] += log.amount;
    });
    setGasData(Object.keys(gasMap).map(key => ({
      name: key,
      amount: Math.round(gasMap[key] * 10) / 10
    })));

    // Pie Chart Data
    const locMap: any = {};
    data.forEach(log => {
      const loc = log.location || 'Unknown';
      if (!locMap[loc]) locMap[loc] = 0;
      locMap[loc] += 1;
    });
    setLocationData(Object.keys(locMap).map(key => ({
      name: key,
      value: locMap[key]
    })).slice(0, 5));
  }

  async function deleteLog(id: number) {
    if (!window.confirm("CONFIRM DELETION: This cannot be undone.")) return;
    await supabase.from("logs").delete().eq("id", id);
    // Note: No need to fetchLogs(), the Realtime listener will handle the update!
  }

  // EXPORT TO CSV FUNCTION
  function exportToCSV() {
    const headers = ["ID,Timestamp,Location,Unit_ID,Refrigerant,Amount"];
    const rows = logs.map(log => 
      `${log.id},${log.created_at},"${log.location}",${log.unit_id},${log.refrigerant},${log.amount}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "true608_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-gray-900 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="text-red-500 w-4 h-4 animate-pulse" />
            <h2 className="text-red-500 text-xs uppercase tracking-widest font-bold">Live Data Stream</h2>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Executive Dashboard</h1>
        </div>
        
        <div className="flex gap-3">
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-4 py-2 rounded-lg text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button 
              onClick={() => fetchLogs()} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Sync
            </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl group hover:border-blue-500/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Volume</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.totalGas} <span className="text-lg text-gray-600">lbs</span></h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Droplets className="w-6 h-6" /></div>
          </div>
          <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[70%]"></div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl group hover:border-emerald-500/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium">Log Entries</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.totalEntries}</h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><TrendingUp className="w-6 h-6" /></div>
          </div>
          <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[45%]"></div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl group hover:border-purple-500/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Sites</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.activeSites}</h3>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><MapPin className="w-6 h-6" /></div>
          </div>
          <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full w-[80%]"></div>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl">
          <h3 className="text-gray-200 font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-sm"></span>
            Refrigerant Consumption
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gasData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl">
          <h3 className="text-gray-200 font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-sm"></span>
            Site Distribution
          </h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
           <h3 className="text-gray-200 font-semibold">Incoming Feed</h3>
           <div className="flex items-center gap-2">
             <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
             </span>
             <span className="text-xs text-red-400 font-mono">LIVE</span>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-black/40 uppercase text-xs tracking-wider font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Unit ID</th>
                <th className="px-6 py-4">Gas Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors animate-in fade-in duration-500">
                  <td className="px-6 py-4">
                     <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {new Date(log.created_at).toLocaleDateString()} <span className="text-gray-600">{new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{log.location}</td>
                  <td className="px-6 py-4 text-gray-300">{log.unit_id}</td>
                  <td className="px-6 py-4 text-blue-400">{log.refrigerant}</td>
                  <td className="px-6 py-4 font-bold text-white">{log.amount} lbs</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteLog(log.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div className="p-12 text-center text-gray-600 flex flex-col items-center">
              <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
              <p>No data found in secure vault.</p>
            </div>
          )}
        </div>
      </div>

    </main>
  );
}