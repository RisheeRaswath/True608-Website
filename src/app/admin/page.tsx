"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Check relative path if red
import { useRouter } from "next/navigation"; // New Import for redirecting
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Activity, Droplets, MapPin, Trash2, RefreshCw, 
  TrendingUp, AlertCircle, LogOut 
} from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Security State
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // CHART DATA STATES
  const [gasData, setGasData] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any[]>([]);
  
  // KPI STATS
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalGas: 0,
    activeSites: 0
  });

  // --- SECURITY CHECK ---
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // If no ID card, kick them out
      router.push("/login");
    } else {
      // If ID card exists, let them in and fetch data
      setIsAuthenticated(true);
      fetchLogs();
    }
  }

  // --- LOGOUT FUNCTION ---
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

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
    const totalGas = data.reduce((sum, log) => sum + (log.amount || 0), 0);
    const uniqueSites = new Set(data.map(log => log.location)).size;
    
    setStats({
      totalEntries: data.length,
      totalGas: Math.round(totalGas * 10) / 10,
      activeSites: uniqueSites
    });

    const gasMap: any = {};
    data.forEach(log => {
      const gas = log.refrigerant || 'Unknown';
      if (!gasMap[gas]) gasMap[gas] = 0;
      gasMap[gas] += log.amount;
    });
    const processedGas = Object.keys(gasMap).map(key => ({
      name: key,
      amount: Math.round(gasMap[key] * 10) / 10
    }));
    setGasData(processedGas);

    const locMap: any = {};
    data.forEach(log => {
      const loc = log.location || 'Unknown';
      if (!locMap[loc]) locMap[loc] = 0;
      locMap[loc] += 1;
    });
    const processedLoc = Object.keys(locMap).map(key => ({
      name: key,
      value: locMap[key]
    })).slice(0, 5); 
    setLocationData(processedLoc);
  }

  async function deleteLog(id: number) {
    if (!window.confirm("CONFIRM DELETION: This cannot be undone.")) return;
    await supabase.from("logs").delete().eq("id", id);
    fetchLogs();
  }

  // If checking security, show a black loading screen
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-gray-500">Verifying Credentials...</div>;
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-gray-900 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="text-blue-500 w-4 h-4" />
            <h2 className="text-blue-500 text-xs uppercase tracking-widest font-bold">True608 Intelligence</h2>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Executive Dashboard</h1>
        </div>
        
        <div className="flex gap-3">
            <button 
            onClick={() => fetchLogs()} 
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-4 py-2 rounded-lg text-sm transition-all"
            >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync
            </button>
            <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 text-red-400 px-4 py-2 rounded-lg text-sm transition-all"
            >
            <LogOut className="w-4 h-4" />
            Logout
            </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl relative group hover:border-blue-500/30 transition-all">
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

        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl relative group hover:border-emerald-500/30 transition-all">
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

        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl relative group hover:border-purple-500/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Job Sites</p>
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
            Refrigerant Consumption (lbs)
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
        <div className="px-6 py-4 border-b border-gray-800">
           <h3 className="text-gray-200 font-semibold">Live Data Feed</h3>
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
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                     <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {new Date(log.created_at).toLocaleDateString()}
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