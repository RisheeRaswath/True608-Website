"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation"; 
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Activity, Droplets, MapPin, Trash2, RefreshCw, 
  TrendingUp, AlertCircle, LogOut, Download, FileText, Zap, Building2 
} from 'lucide-react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminDashboard() {
  const router = useRouter(); 
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalGas: 0,
    activeSites: 0
  });

  // NEW: Timeline Data for the Area Chart
  const [timelineData, setTimelineData] = useState<any[]>([]);
  // NEW: Leaderboard Data for the Site List
  const [siteLeaderboard, setSiteLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login"); 
    } else {
      fetchLogs(); 
      setupRealtime(); 
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function setupRealtime() {
    const channel = supabase
      .channel('realtime logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'logs' }, (payload) => {
        setLogs((currentLogs) => {
          const updatedLogs = [payload.new, ...currentLogs];
          processAnalytics(updatedLogs);
          return updatedLogs;
        });
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'logs' }, (payload) => {
         setLogs((currentLogs) => {
            const updatedLogs = currentLogs.filter(log => log.id !== payload.old.id);
            processAnalytics(updatedLogs);
            return updatedLogs;
         });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); }
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
    // 1. BASIC KPIS
    const totalGas = data.reduce((sum, log) => sum + (log.amount || 0), 0);
    const uniqueSites = new Set(data.map(log => log.location)).size;
    
    setStats({
      totalEntries: data.length,
      totalGas: Math.round(totalGas * 10) / 10,
      activeSites: uniqueSites
    });

    // 2. TIMELINE CHART (Group by Date)
    const timelineMap: any = {};
    data.forEach(log => {
      const date = new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!timelineMap[date]) timelineMap[date] = 0;
      timelineMap[date] += log.amount;
    });
    // Convert to array and reverse so oldest date is left, newest is right
    const timelineArray = Object.keys(timelineMap).map(key => ({
      date: key,
      amount: Math.round(timelineMap[key] * 10) / 10
    })).reverse();
    setTimelineData(timelineArray);

    // 3. SITE LEADERBOARD (Rank by Usage)
    const siteMap: any = {};
    data.forEach(log => {
      const site = log.location || 'Unknown';
      if (!siteMap[site]) siteMap[site] = 0;
      siteMap[site] += log.amount;
    });
    
    // Convert to array and sort by highest usage
    const leaderboardArray = Object.keys(siteMap).map(key => ({
      name: key,
      amount: Math.round(siteMap[key] * 10) / 10,
      // Calculate percentage relative to total gas for the progress bar
      percentage: Math.min(100, Math.round((siteMap[key] / totalGas) * 100))
    })).sort((a, b) => b.amount - a.amount); // Sort descending
    
    setSiteLeaderboard(leaderboardArray);
  }

  async function deleteLog(id: number) {
    if (!window.confirm("Delete this log permanently?")) return;
    await supabase.from("logs").delete().eq("id", id);
  }

  function exportToCSV() {
    const headers = ["ID,Timestamp,Location,Unit_ID,Refrigerant,Amount"];
    const rows = logs.map(log => 
      `${log.id},${log.created_at},"${log.location}",${log.unit_id},${log.refrigerant},${log.amount}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "true608_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function exportToPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("True608 Compliance Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["Date", "Location", "Unit ID", "Gas", "Lbs"];
    const tableRows = logs.map(log => [
      new Date(log.created_at).toLocaleDateString(),
      log.location,
      log.unit_id,
      log.refrigerant,
      log.amount
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74] }
    });
    doc.save("true608_report.pdf");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 via-black to-black text-white p-4 md:p-8 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-white/10 pb-6 gap-4 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="text-blue-400 w-4 h-4 fill-blue-400" />
            <h2 className="text-blue-400 text-xs uppercase tracking-[0.2em] font-bold">System Status: Online</h2>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-500 tracking-tight">
            True608 <span className="text-white font-thin opacity-50">|</span> Command
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-3">
            <button onClick={exportToPDF} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs transition-all text-gray-300 backdrop-blur-md">
              <FileText className="w-3 h-3" /> Report
            </button>
            <button onClick={exportToCSV} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs transition-all text-gray-300 backdrop-blur-md">
              <Download className="w-3 h-3" /> Data
            </button>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-5 py-2 rounded-full text-xs font-bold transition-all ml-2"
            >
              <LogOut className="w-3 h-3" />
            </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total Refrigerant</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-white">{stats.totalGas}</h3>
            <span className="text-sm font-medium text-blue-400">lbs</span>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Log Entries</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-white">{stats.totalEntries}</h3>
            <span className="text-sm font-medium text-emerald-400">records</span>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Active Sites</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-white">{stats.activeSites}</h3>
            <span className="text-sm font-medium text-purple-400">locations</span>
          </div>
        </div>
      </div>

      {/* INTELLIGENCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* LEFT: TIMELINE (Takes up 2/3 space) */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl h-[400px]">
          <h3 className="text-gray-200 text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]"></div>
            Usage Timeline (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="date" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{backgroundColor:'#000', border:'1px solid #333', borderRadius: '8px'}} 
                itemStyle={{color: '#3b82f6'}}
              />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* RIGHT: SITE LEADERBOARD (Takes up 1/3 space) */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl h-[400px] overflow-y-auto custom-scrollbar">
          <h3 className="text-gray-200 text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"></div>
            Site Leaderboard
          </h3>
          
          <div className="space-y-6">
            {siteLeaderboard.map((site, index) => (
              <div key={index} className="group">
                <div className="flex justify-between items-end mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs font-mono">#{index + 1}</span>
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{site.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{site.amount} lbs</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full" 
                    style={{width: `${site.percentage}%`}}
                  ></div>
                </div>
              </div>
            ))}
            
            {siteLeaderboard.length === 0 && (
              <div className="text-center text-gray-500 text-xs py-10">No active sites found.</div>
            )}
          </div>
        </div>

      </div>

      {/* MASTER TABLE */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
           <h3 className="text-gray-200 font-bold text-sm tracking-wide">MASTER LOG</h3>
           <div className="flex items-center gap-2">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             <span className="text-[10px] text-emerald-400 font-mono tracking-widest">LIVE</span>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-black/20 uppercase text-[10px] tracking-widest font-bold text-gray-500">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Unit ID</th>
                <th className="px-6 py-4">Gas Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors duration-200">
                  <td className="px-6 py-4"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div></td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleDateString()} <span className="text-gray-600 ml-1">{new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </td>
                  <td className="px-6 py-4 text-white font-medium flex items-center gap-2">
                    <Building2 className="w-3 h-3 text-gray-600" />
                    {log.location}
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-400">{log.unit_id}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {log.refrigerant}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-white font-bold">{log.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteLog(log.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}