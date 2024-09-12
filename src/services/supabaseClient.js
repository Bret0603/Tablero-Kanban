// supabaseClient.js

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Reemplaza con tus propias credenciales de Supabase
const SUPABASE_URL = "https://ikxarnxchdbacfqgyoes.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlreGFybnhjaGRiYWNmcWd5b2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwMzQxMjEsImV4cCI6MjA0MDYxMDEyMX0.k1a0BYuOGXUQxEShgRGqlEmJkT_edBuHfy78g1D1Wlg";

// Inicializar Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
