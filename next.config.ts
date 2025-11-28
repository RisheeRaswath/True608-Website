import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://YOUR_REAL_URL_HERE.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'YOUR_REAL_LONG_KEY_HERE',
  },
};

export default nextConfig;