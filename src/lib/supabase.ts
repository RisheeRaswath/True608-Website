import { createClient } from '@supabase/supabase-js'

// ------------------------------------------------------------------
// PASTE YOUR REAL KEYS INSIDE THE QUOTES BELOW.
// DO NOT LEAVE THEM AS 'YOUR_URL_HERE'
// ------------------------------------------------------------------

const supabaseUrl = 'https://fpwhphzhckegytgrkrmq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwd2hwaHpoY2tlZ3l0Z3Jrcm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzYyODksImV4cCI6MjA3OTcxMjI4OX0.2eUgmTethvKRSBA9KpTEdDzF08Z6WMs4AQSX7_IAy-c'

// ------------------------------------------------------------------

console.log("--- DEBUGGER ---")
console.log("URL:", supabaseUrl)
console.log("Key Length:", supabaseAnonKey.length)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)