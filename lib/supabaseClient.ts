import { createClient } from '@supabase/supabase-js'

// Menggunakan URL dan Anon Key proyek Supabase kamu secara langsung
const supabaseUrl = 'https://ipcfccdozvodrmuuqiih.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwY2ZjY2RvenZvZHJtdXVxaWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MzYyNjEsImV4cCI6MjA5OTAxMjI2MX0.F901K6wwzqjf42HLfRaPfQDeYDmPAiErzoXgo-mpLAg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)