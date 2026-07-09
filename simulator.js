const http = require('https');

const SUPABASE_URL = 'https://ipcfccdozvodrmuuqiih.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwY2ZjY2RvenZvZHJtdXVxaWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MzYyNjEsImV4cCI6MjA5OTAxMjI2MX0.F901K6wwzqjf42HLfRaPfQDeYDmPAiErzoXgo-mpLAg';
const TABLE_NAME   = 'telemetry';

function generateDummyData() {
  const voltage = parseFloat((18 + Math.random() * 4).toFixed(2));
  const current = parseFloat((2 + Math.random() * 1.5).toFixed(2));
  const power   = parseFloat((voltage * current).toFixed(2));

  return JSON.stringify({
    voltage: voltage,
    current: current,
    power: power,
    created_at: new Date().toISOString()
  });
}

function sendToSupabase() {
  const data = generateDummyData();
  const baseUrl = SUPABASE_URL.replace('https://', '');
  
  const options = {
    hostname: baseUrl,
    port: 443,
    path: `/rest/v1/${TABLE_NAME}`,
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    }
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 201 || res.statusCode === 200) {
      console.log(`[${new Date().toLocaleTimeString()}] 🚀 Data MPPT Sukses Masuk Supabase! Status: ${res.statusCode}`);
    } else {
      console.log(`[${new Date().toLocaleTimeString()}] ❌ Gagal Kirim. Status Code: ${res.statusCode}`);
    }
  });

  req.on('error', (error) => {
    console.error('⚠️ Terjadi kendala jaringan:', error.message);
  });

  req.write(data);
  req.end();
}

console.log("=== SIMULATOR REAL-TIME P&O MPPT KE SUPABASE ===");
console.log("Sistem aktif mengirim data simulasi telemetri setiap 10 detik...");
setInterval(sendToSupabase, 10000);

sendToSupabase();
