"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
// If red error, change to: "../../lib/supabase"
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("ACCESS DENIED: " + error.message);
      setLoading(false);
    } else {
      // Success! Redirect to Command Center
      router.push("/admin");
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">System Login</h1>
          <p className="text-gray-500 text-sm mt-2">Restricted Area. Authorized Personnel Only.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs uppercase font-bold">Email Identity</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-all"
              placeholder="admin@true608.com"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase font-bold">Passcode</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "VERIFYING..." : "AUTHENTICATE"}
          </button>
        </form>
      </div>
    </main>
  );
}