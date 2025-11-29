"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation"; 
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  LayoutDashboard, Map, MapPin, Trash2, RefreshCw, 
  TrendingUp, AlertCircle, LogOut, Download, FileText, BarChart3, Database 
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
    if (!window.confirm("Are you sure you want to delete this record?")) return;
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
      headStyles: { fillColor: [59, 130, 246] }
    });
    doc.save("true608_report.pdf");
  }

  return (
    <main className="min-h-screen bg-[#0F1117] text-slate-300 p-4 md:p-8 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-blue-500" />
            True<span className="text-blue-500">608</span> Systems
          </h1>
          <p className="text-slate-500 text-sm mt-1">Enterprise Compliance Dashboard</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
            <button onClick={exportToPDF} className="cursor-pointer flex items-center gap-2 bg-[#1A1D24] hover:bg-[#20242D] border border-slate-800 px-3 py-2 rounded-lg text-xs font-medium transition-all text-slate-300">
              <FileText className="w-3 h-3" /> Report
            </button>
            <button onClick={exportToCSV} className="cursor-pointer flex items-center gap-2 bg-[#1A1D24] hover:bg-[#20242D] border border-slate-800 px-3 py-2 rounded-lg text-xs font-medium transition-all text-slate-300">
              <Download className="w-3 h-3" /> Export
            </button>
            
            <button 
              onClick={handleLogout} 
              className="cursor-pointer flex items-center gap-2 bg-[#1A1D24] hover:bg-red-900/10 border border-slate-800 hover:border-red-900/30 text-slate-400 hover:text-red-400 px-3 py-2 rounded-lg text-xs font-medium transition-all ml-2"
            >
              <LogOut className="w-3 h-3" /> Log Out
            </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        {/* Added cursor-default to prevent text selection cursor */}
        <div className="bg-[#15171e] border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-all duration-300 cursor-default">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Volume</p>
            <Database className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.totalGas} <span className="text-sm text-slate-500 font-normal">lbs</span></h3>
        </div>

        <div className="bg-[#15171e] border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-all duration-300 cursor-default">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Entries</p>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.totalEntries}</h3>
        </div>

        <div className="bg-[#15171e] border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-all duration-300 cursor-default">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Sites</p>
            <Map className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.activeSites}</h3>
        </div>
      </div>

      {/* VISUAL ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* CHART: TIMELINE */}
        <div className="lg:col-span-2 bg-[#15171e] border border-slate-800 p-6 rounded-xl h-[350px]">
          <h3 className="text-slate-200 text-sm font-semibold mb-6 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-500" />
            Usage History (30 Days)
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="date" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{backgroundColor:'#0F1117', border:'1px solid #334155', borderRadius: '6px', fontSize: '12px'}} 
                itemStyle={{color: '#fff'}}
              />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorGas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* LIST: LEADERBOARD */}
        <div className="bg-[#15171e] border border-slate-800 p-6 rounded-xl h-[350px] overflow-y-auto custom-scrollbar">
          <h3 className="text-slate-200 text-sm font-semibold mb-6 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-500" />
            Top Consumption Sites
          </h3>
          
          <div className="space-y-5">
            {siteLeaderboard.map((site, index) => (
              <div key={index}>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-medium text-slate-300 truncate w-32">{site.name}</span>
                  <span className="text-xs font-bold text-slate-400">{site.amount} lbs</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{width: `${site.percentage}%`}}
                  ></div>
                </div>
              </div>
            ))}
            
            {siteLeaderboard.length === 0 && (
              <div className="text-center text-slate-600 text-xs py-10">No data available.</div>
            )}
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-[#15171e] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-[#1A1D24]/50">
           <h3 className="text-slate-200 font-semibold text-sm">Recent Activity</h3>
           <div className="flex items-center gap-2">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             <span className="text-[10px] text-emerald-500 font-medium tracking-wide">LIVE</span>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-[#111318] uppercase text-[10px] tracking-wider font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Unit ID</th>
                <th className="px-6 py-4">Refrigerant</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition-colors cursor-default"> {/* Cursor default on row */}
                  <td className="px-6 py-4"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div></td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {new Date(log.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-medium">{log.location}</td>
                  <td className="px-6 py-4 font-mono text-slate-500">{log.unit_id}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                      {log.refrigerant}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-white font-semibold">{log.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteLog(log.id)} className="cursor-pointer text-slate-600 hover:text-red-400 transition-colors">
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