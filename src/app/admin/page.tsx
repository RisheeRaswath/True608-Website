"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation"; 
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Activity, Droplets, MapPin, Trash2, RefreshCw, 
  TrendingUp, AlertCircle, LogOut, Download, FileText, Shield, Star 
} from 'lucide-react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// CAPTAIN AMERICA PALETTE
const CHART_GRADIENT = "url(#colorGas)"; // Defined in JSX
const STROKE_COLOR = "#3b82f6"; // Blue

export default function AdminDashboard() {
  const router = useRouter(); 
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalGas: 0,
    activeSites: 0
  });

  const [timelineData, setTimelineData] = useState<any[]>([]);
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
    const totalGas = data.reduce((sum, log) => sum + (log.amount || 0), 0);
    const uniqueSites = new Set(data.map(log => log.location)).size;
    
    setStats({
      totalEntries: data.length,
      totalGas: Math.round(totalGas * 10) / 10,
      activeSites: uniqueSites
    });

    // Timeline
    const timelineMap: any = {};
    data.forEach(log => {
      const date = new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!timelineMap[date]) timelineMap[date] = 0;
      timelineMap[date] += log.amount;
    });
    const timelineArray = Object.keys(timelineMap).map(key => ({
      date: key,
      amount: Math.round(timelineMap[key] * 10) / 10
    })).reverse();
    setTimelineData(timelineArray);

    // Leaderboard
    const siteMap: any = {};
    data.forEach(log => {
      const site = log.location || 'Unknown';
      if (!siteMap[site]) siteMap[site] = 0;
      siteMap[site] += log.amount;
    });
    const leaderboardArray = Object.keys(siteMap).map(key => ({
      name: key,
      amount: Math.round(siteMap[key] * 10) / 10,
      percentage: Math.min(100, Math.round((siteMap[key] / totalGas) * 100))
    })).sort((a, b) => b.amount - a.amount);
    
    setSiteLeaderboard(leaderboardArray);
  }

  async function deleteLog(id: number) {
    if (!window.confirm("CONFIRM: Eliminate this record?")) return;
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
      headStyles: { fillColor: [30, 58, 138] } // Navy Blue Header
    });
    doc.save("true608_report.pdf");
  }

  return (
    // THEME: STRATEGIC NAVY BLUE
    <main className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-red-500 selection:text-white">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="text-red-500 w-5 h-5 fill-red-500/20" />
            <h2 className="text-slate-400 text-xs uppercase tracking-[0.25em] font-black">Strategic Command</h2>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
            True<span className="text-blue-500">608</span> <span className="text-slate-600 font-thin">|</span> Overseer
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
            <button onClick={exportToPDF} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all text-slate-300">
              <FileText className="w-3 h-3" /> Report
            </button>
            <button onClick={exportToCSV} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all text-slate-300">
              <Download className="w-3 h-3" /> Data
            </button>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-red-900/10 hover:bg-red-900/30 border border-red-800/30 text-red-500 px-5 py-2 rounded text-xs font-black uppercase tracking-wider transition-all ml-2"
            >
              <LogOut className="w-3 h-3" /> Disengage
            </button>
        </div>
      </div>

      {/* KPI CARDS - TACTICAL PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Card 1 */}
        <div className="bg-slate-900/50 border-l-4 border-l-blue-600 border-y border-r border-slate-800 p-6 rounded-r-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-blue-400 text-xs font-black uppercase tracking-widest">Total Volume</p>
            <Droplets className="w-5 h-5 text-slate-600" />
          </div>
          <h3 className="text-4xl font-black text-white">{stats.totalGas} <span className="text-lg text-slate-500 font-medium">lbs</span></h3>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900/50 border-l-4 border-l-white border-y border-r border-slate-800 p-6 rounded-r-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-300 text-xs font-black uppercase tracking-widest">Log Entries</p>
            <TrendingUp className="w-5 h-5 text-slate-600" />
          </div>
          <h3 className="text-4xl font-black text-white">{stats.totalEntries}</h3>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900/50 border-l-4 border-l-red-600 border-y border-r border-slate-800 p-6 rounded-r-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-red-400 text-xs font-black uppercase tracking-widest">Active Sectors</p>
            <MapPin className="w-5 h-5 text-slate-600" />
          </div>
          <h3 className="text-4xl font-black text-white">{stats.activeSites}</h3>
        </div>
      </div>

      {/* INTELLIGENCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* LEFT: TIMELINE */}
        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800 p-6 rounded-xl h-[400px]">
          <h3 className="text-white text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            Temporal Usage Data
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{backgroundColor:'#0f172a', border:'1px solid #1e293b', borderRadius: '4px', textTransform: 'uppercase', fontSize: '12px'}} 
                itemStyle={{color: '#fff'}}
              />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* RIGHT: LEADERBOARD */}
        <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-xl h-[400px] overflow-y-auto custom-scrollbar">
          <h3 className="text-white text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <Star className="w-4 h-4 text-red-500" />
            High Priority Sites
          </h3>
          
          <div className="space-y-6">
            {siteLeaderboard.map((site, index) => (
              <div key={index} className="group">
                <div className="flex justify-between items-end mb-1">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 text-xs font-mono font-bold">#{index + 1}</span>
                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{site.name}</span>
                  </div>
                  <span className="text-xs font-black text-blue-400">{site.amount} lbs</span>
                </div>
                {/* Progress Bar - Red/White/Blue Gradient */}
                <div className="w-full h-2 bg-slate-800 rounded-sm overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-white rounded-sm" 
                    style={{width: `${site.percentage}%`}}
                  ></div>
                </div>
              </div>
            ))}
            
            {siteLeaderboard.length === 0 && (
              <div className="text-center text-slate-600 text-xs py-10 font-mono">NO ACTIVE TARGETS</div>
            )}
          </div>
        </div>

      </div>

      {/* MASTER TABLE */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
           <h3 className="text-slate-200 font-black text-xs uppercase tracking-widest">Incoming Data Stream</h3>
           <div className="flex items-center gap-2">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
             </span>
             <span className="text-[10px] text-red-500 font-mono font-bold tracking-widest">LIVE</span>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 uppercase text-[10px] tracking-widest font-black text-slate-500">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Unit ID</th>
                <th className="px-6 py-4">Gas Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors duration-200">
                  <td className="px-6 py-4"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div></td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 font-bold">
                    {new Date(log.created_at).toLocaleDateString()} <span className="text-slate-600 ml-1">{new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </td>
                  <td className="px-6 py-4 text-white font-bold">{log.location}</td>
                  <td className="px-6 py-4 font-mono text-blue-400">{log.unit_id}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-black uppercase tracking-wide bg-slate-800 text-slate-300 border border-slate-700">
                      {log.refrigerant}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-white font-black">{log.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteLog(log.id)} className="text-slate-600 hover:text-red-500 transition-colors">
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