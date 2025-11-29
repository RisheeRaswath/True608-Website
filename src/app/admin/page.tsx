"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Check relative path if red
import { useRouter } from "next/navigation"; // <--- FOR REDIRECTING
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Activity, Droplets, MapPin, Trash2, RefreshCw, 
  TrendingUp, AlertCircle, LogOut, Download, FileText 
} from 'lucide-react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const router = useRouter(); // Initialize Router
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalGas: 0,
    activeSites: 0
  });

  const [gasData, setGasData] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any[]>([]);

  // --- SECURITY CHECK ON LOAD ---
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login"); // Kick out intruders
    } else {
      fetchLogs(); // Allow access
      setupRealtime(); // Turn on live feed
    }
  }

  // --- LOGOUT FUNCTION ---
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
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      
      {/* HEADER WITH LOGOUT */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-900 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="text-blue-500 w-4 h-4" />
            <h2 className="text-blue-500 text-xs uppercase tracking-widest font-bold">True608 Intelligence</h2>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Executive Command</h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
            <button onClick={exportToPDF} className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-3 py-2 rounded-lg text-xs transition-all text-gray-300">
              <FileText className="w-3 h-3" /> PDF
            </button>
            <button onClick={exportToCSV} className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-3 py-2 rounded-lg text-xs transition-all text-gray-300">
              <Download className="w-3 h-3" /> CSV
            </button>
            
            {/* LOGOUT BUTTON */}
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-red-900/10 hover:bg-red-900/30 border border-red-900/30 text-red-400 px-4 py-2 rounded-lg text-xs font-bold transition-all ml-2"
            >
              <LogOut className="w-3 h-3" /> LOGOUT
            </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl relative overflow-hidden">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Total Volume</p>
          <h3 className="text-3xl font-bold text-white">{stats.totalGas} <span className="text-lg text-gray-600">lbs</span></h3>
          <div className="absolute right-4 top-4 p-2 bg-blue-500/10 rounded-lg text-blue-500"><Droplets className="w-5 h-5" /></div>
        </div>
        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl relative overflow-hidden">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Log Entries</p>
          <h3 className="text-3xl font-bold text-white">{stats.totalEntries}</h3>
          <div className="absolute right-4 top-4 p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><TrendingUp className="w-5 h-5" /></div>
        </div>
        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl relative overflow-hidden">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Active Sites</p>
          <h3 className="text-3xl font-bold text-white">{stats.activeSites}</h3>
          <div className="absolute right-4 top-4 p-2 bg-purple-500/10 rounded-lg text-purple-500"><MapPin className="w-5 h-5" /></div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl h-[300px]">
          <h3 className="text-gray-400 text-xs font-bold uppercase mb-4">Refrigerant Consumption</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={gasData}>
              <XAxis dataKey="name" stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#222'}} contentStyle={{backgroundColor:'#000', border:'1px solid #333'}} />
              <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl h-[300px]">
          <h3 className="text-gray-400 text-xs font-bold uppercase mb-4">Site Distribution</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={locationData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{backgroundColor:'#000', border:'1px solid #333'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
           <h3 className="text-gray-200 font-semibold text-sm">Live Data Feed</h3>
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
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4"><div className="w-2 h-2 rounded-full bg-emerald-500"></div></td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleDateString()} <span className="text-gray-600">{new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">{log.location}</td>
                  <td className="px-6 py-4">{log.unit_id}</td>
                  <td className="px-6 py-4 text-blue-400">{log.refrigerant}</td>
                  <td className="px-6 py-4 font-mono text-white font-bold">{log.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteLog(log.id)} className="text-gray-600 hover:text-red-500 transition-colors">
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