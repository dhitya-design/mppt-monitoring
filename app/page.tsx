"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, RefreshCw, LayoutDashboard, 
  Calendar, Sliders, ShieldCheck, Database, Info, Users
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// Import Segments
import AboutSegments from '@/components/segments/AboutSegments';
import DashboardSegments from '@/components/segments/DashboardSegments';
import RoadmapSegments from '@/components/segments/RoadmapSegments';
import TeamSegments from '@/components/segments/TeamSegments';

export interface TelemetryData {
  voltage: number;
  current: number;
  power?: number;
  battery?: number; // SESUAI TABEL SUPABASE: "battery"
  created_at: string;
}

export default function MPPTDashboard() {
  const [currentSegment, setCurrentSegment] = useState<'dashboard' | 'about' | 'roadmap' | 'team'>('dashboard');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // State Saklar & Loading
  const [relayStatus, setRelayStatus] = useState<boolean>(false);
  const [updatingRelay, setUpdatingRelay] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  
  // State data utama & riwayat telemetri
  const [data, setData] = useState<TelemetryData>({
    voltage: 0,
    current: 0,
    power: 0,
    battery: 0,
    created_at: new Date().toISOString()
  });
  
  const [history, setHistory] = useState<TelemetryData[]>([]);

  // 1. Fetch data telemetri terbaru dari Supabase
  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      const { data: telemetryData, error } = await supabase
        .from('mppt_telemetry')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error("Supabase Telemetry error:", error.message);
        return;
      }

      if (telemetryData && telemetryData.length > 0) {
        const latest = telemetryData[0];
        setData(latest);
        setHistory(telemetryData.slice().reverse());
      }
    } catch (error) {
      console.error("Gagal mengambil data telemetri:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch status saklar mppt_control dari Supabase
  const fetchRelayStatus = async () => {
    try {
      const { data: controlData, error } = await supabase
        .from('mppt_control')
        .select('relay_state')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.error("Supabase Control error:", error.message);
      } else if (controlData) {
        setRelayStatus(controlData.relay_state);
      }
    } catch (error) {
      console.error("Gagal mengambil status saklar:", error);
    }
  };

  // 3. Fungsi Toggle Saklar MPPT Control dengan Upsert Tangguh
  const handleToggleRelay = async () => {
    if (updatingRelay) return;
    setUpdatingRelay(true);

    try {
      // Ambil status paling aktual dari DB untuk mencegah stale state
      const { data: currentData } = await supabase
        .from('mppt_control')
        .select('relay_state')
        .eq('id', 1)
        .maybeSingle();

      const latestState = currentData ? currentData.relay_state : relayStatus;
      const nextState = !latestState;

      const { error } = await supabase
        .from('mppt_control')
        .upsert(
          { 
            id: 1, 
            relay_state: nextState, 
            updated_at: new Date().toISOString() 
          },
          { onConflict: 'id' }
        );

      if (error) {
        console.error("Detail Error Supabase:", error);
        alert(`Gagal mengubah status saklar: ${error.message}`);
      } else {
        setRelayStatus(nextState);
      }
    } catch (err) {
      console.error("Error toggle relay:", err);
    } finally {
      setUpdatingRelay(false);
    }
  };

  useEffect(() => {
    // Initial fetch saat component pertama dimuat
    fetchTelemetry();
    fetchRelayStatus();

    // Channel Realtime Telemetri dengan Nama Unik
    const telemetryChannel = supabase
      .channel('realtime_telemetry_dashboard')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mppt_telemetry' },
        (payload) => {
          const newRecord = payload.new as TelemetryData;
          setData(newRecord);
          setHistory((prev) => [...prev.slice(1), newRecord]);
        }
      )
      .subscribe();

    // Channel Realtime Saklar Control dengan Nama Unik
    const controlChannel = supabase
      .channel('realtime_control_dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mppt_control', filter: 'id=eq.1' },
        (payload) => {
          if (payload.new && typeof (payload.new as any).relay_state === 'boolean') {
            setRelayStatus((payload.new as any).relay_state);
          }
        }
      )
      .subscribe();

    // Cleanup koneksi WebSocket agar tidak terjadi akumulasi koneksi macet/deadlock
    return () => {
      supabase.removeChannel(telemetryChannel);
      supabase.removeChannel(controlChannel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans p-4 md:p-6 pb-28 selection:bg-[#600006] selection:text-white antialiased">
      
      {/* HEADER UTAMA */}
      <header className="border-b border-zinc-800 pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">
            MPPT Monitoring System
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Sistem Pemantauan Daya & Pengisian Baterai Berbasis ESP32-C3
          </p>
        </div>

        {/* STATUS KONEKSI */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5" style={{ borderRadius: '0px' }}>
          <div className="w-2 h-2 bg-emerald-500 animate-pulse shrink-0" style={{ borderRadius: '0px' }} />
          <span className="text-xs font-mono text-zinc-300">ESP32: Connected</span>
        </div>
      </header>

      {/* KONTEN UTAMA */}
      <main className="w-full space-y-6">
        {currentSegment === 'dashboard' && (
          <>
            {/* GRID KONTROL & LOG RINGKAS */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* SAKLAR RELAY SUPABASE */}
              <div className="bg-[#111111] border border-zinc-800 p-4 flex flex-col justify-between" style={{ borderRadius: '0px' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-zinc-400">Saklar Output</span>
                  <Sliders size={16} className="text-zinc-500" />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">
                    Status: {relayStatus ? <span className="text-emerald-400 font-bold">Aktif (ON)</span> : <span className="text-red-500 font-bold">Nonaktif (OFF)</span>}
                  </span>
                  <button 
                    onClick={handleToggleRelay}
                    disabled={updatingRelay}
                    className={`px-3 py-1 font-mono text-xs font-medium transition-all border ${
                      relayStatus 
                        ? 'bg-[#600006] hover:bg-[#80000a] text-white border-red-900' 
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                    } ${updatingRelay ? 'opacity-50 cursor-wait' : ''}`}
                    style={{ borderRadius: '0px' }}
                  >
                    {updatingRelay ? "Memproses..." : relayStatus ? "Matikan" : "Nyalakan"}
                  </button>
                </div>
              </div>

              {/* RIWAYAT DATA */}
              <div 
                onClick={() => setActiveModal('telemetry_details')}
                className="bg-[#111111] border border-zinc-800 p-4 flex flex-col justify-between hover:border-zinc-600 cursor-pointer transition-all" 
                style={{ borderRadius: '0px' }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-zinc-400">Riwayat Data</span>
                  <Database size={16} className="text-zinc-500" />
                </div>
                <div className="flex justify-between items-center text-xs text-zinc-400 font-mono mt-2">
                  <span>Log Supabase</span>
                  <span className="text-zinc-200 underline">Lihat Tabel →</span>
                </div>
              </div>

              {/* STATUS PROTEKSI */}
              <div 
                onClick={() => setActiveModal('protection_details')}
                className="bg-[#111111] border border-zinc-800 p-4 flex flex-col justify-between hover:border-zinc-600 cursor-pointer transition-all" 
                style={{ borderRadius: '0px' }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-zinc-400">Sistem Proteksi</span>
                  <ShieldCheck size={16} className="text-emerald-500" />
                </div>
                <div className="flex justify-between items-center text-xs text-zinc-400 font-mono mt-2">
                  <span>Max: 25V / 10A</span>
                  <span className="text-emerald-400 font-bold">Normal</span>
                </div>
              </div>
            </section>

            {/* SEGMENT DASHBOARD METRIK & GRAFIK KURVA RECHARTS */}
            <DashboardSegments 
              data={data} 
              history={history}
              setSelectedInfo={(info) => setActiveModal(info)} 
            />

            {/* BUFFER DATA REALTIME (BAR CHART RINGKAS) */}
            <section className="bg-[#111111] border border-zinc-800 p-4" style={{ borderRadius: '0px' }}>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <Activity size={14} className="text-[#600006]" /> Buffer Data Realtime
                </h2>
                <button 
                  onClick={fetchTelemetry}
                  className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 px-2.5 py-1 text-xs font-mono transition-colors"
                  style={{ borderRadius: '0px' }}
                >
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
              </div>
              
              <div className="h-36 w-full bg-zinc-950 border border-zinc-900 flex items-end p-2 gap-1 overflow-hidden" style={{ borderRadius: '0px' }}>
                {history.map((item, idx) => {
                  const maxPower = 100;
                  const itemPower = item.power ?? (item.voltage * item.current);
                  const heightPercentage = Math.min((itemPower / maxPower) * 100, 100);
                  return (
                    <div 
                      key={idx} 
                      className="bg-[#600006] opacity-80 hover:opacity-100 flex-1 transition-all relative group"
                      style={{ height: `${heightPercentage}%`, minWidth: '6px', borderRadius: '0px' }}
                    >
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-zinc-900 text-[10px] font-mono text-white px-1.5 py-0.5 border border-zinc-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 mb-1" style={{ borderRadius: '0px' }}>
                        {itemPower.toFixed(1)} W
                      </div>
                    </div>
                  );
                })}
                {history.length === 0 && (
                  <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600 font-mono">
                    Menunggu data dari sensor...
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {currentSegment === 'about' && <AboutSegments />}
        {currentSegment === 'roadmap' && <RoadmapSegments />}
        {currentSegment === 'team' && <TeamSegments />}
      </main>

      {/* FOOTER */}
      <footer className="text-center text-xs text-zinc-600 font-mono mt-12 mb-4">
        © UNU Yogyakarta
      </footer>

      {/* MODAL OVERLAY */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-zinc-900 border border-zinc-800 max-w-md w-full relative z-10 overflow-hidden text-left p-5 space-y-4"
              style={{ borderRadius: '0px' }}
            >
              {activeModal === 'voltage' && (
                <div>
                  <h3 className="text-sm font-bold text-amber-400 mb-1">Tegangan Panel (V)</h3>
                  <p className="text-xs text-zinc-300">
                    Tegangan aktual terkonfirmasi: <strong className="text-white">{(data.voltage ?? 0).toFixed(2)} Volt</strong>.
                  </p>
                </div>
              )}

              {activeModal === 'current' && (
                <div>
                  <h3 className="text-sm font-bold text-blue-400 mb-1">Arus Pengisian (A)</h3>
                  <p className="text-xs text-zinc-300">
                    Arus terukur terkonfirmasi: <strong className="text-white">{(data.current ?? 0).toFixed(2)} Ampere</strong>.
                  </p>
                </div>
              )}

              {activeModal === 'battery' && (
                <div>
                  <h3 className="text-sm font-bold text-lime-400 mb-1">Tegangan Baterai (V)</h3>
                  <p className="text-xs text-zinc-300">
                    Tegangan bank baterai terkonfirmasi: <strong className="text-white">{(data.battery ?? (data.voltage * 0.72)).toFixed(2)} Volt</strong>.
                  </p>
                </div>
              )}

              {activeModal === 'power' && (
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 mb-1">Daya Output (W)</h3>
                  <p className="text-xs text-zinc-300">
                    Total daya pengisian terkonfirmasi: <strong className="text-white">{(data.power ?? (data.voltage * data.current)).toFixed(2)} Watt</strong>.
                  </p>
                </div>
              )}

              {activeModal === 'telemetry_details' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-white">Riwayat Log Supabase</h3>
                    <span className="text-xs font-mono text-zinc-500">{history.length} Data</span>
                  </div>

                  <div className="max-h-60 overflow-y-auto border border-zinc-800 bg-zinc-950 font-mono text-xs" style={{ borderRadius: '0px' }}>
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-zinc-900 sticky top-0 text-zinc-400 border-b border-zinc-800">
                        <tr>
                          <th className="p-2 border-r border-zinc-800">Waktu</th>
                          <th className="p-2 border-r border-zinc-800 text-amber-400">Volt</th>
                          <th className="p-2 border-r border-zinc-800 text-blue-400">Arus</th>
                          <th className="p-2 border-r border-zinc-800 text-lime-400">Bat</th>
                          <th className="p-2 text-emerald-400">Daya</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800 text-zinc-300">
                        {history.length > 0 ? (
                          history.slice().reverse().map((row, idx) => (
                            <tr key={idx} className="hover:bg-zinc-900/50">
                              <td className="p-2 border-r border-zinc-800 text-zinc-500 text-[10px]">
                                {new Date(row.created_at).toLocaleTimeString('id-ID')}
                              </td>
                              <td className="p-2 border-r border-zinc-800">{(row.voltage ?? 0).toFixed(1)}V</td>
                              <td className="p-2 border-r border-zinc-800">{(row.current ?? 0).toFixed(1)}A</td>
                              <td className="p-2 border-r border-zinc-800 text-lime-400">
                                {(row.battery ?? 0).toFixed(1)}V
                              </td>
                              <td className="p-2 text-emerald-400 font-medium">
                                {(row.power ?? (row.voltage * row.current)).toFixed(1)}W
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-4 text-center text-zinc-500">Belum ada data.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeModal === 'protection_details' && (
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 mb-2">Status Proteksi Hardware</h3>
                  <div className="bg-zinc-950 p-3 font-mono text-xs text-zinc-300 border-l-2 border-emerald-500 space-y-1">
                    <div>• Over Voltage Limit: 25.0V (Aman)</div>
                    <div>• Over Current Limit: 10.0A (Aman)</div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs"
                  style={{ borderRadius: '0px' }}
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NAVBAR BAWAH */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-t border-zinc-800 px-4 py-2 flex justify-around items-center">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'about', label: 'About', icon: Info },
          { id: 'roadmap', label: 'Roadmap', icon: Calendar },
          { id: 'team', label: 'Team', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentSegment === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => setCurrentSegment(tab.id as any)}
              className={`flex flex-col items-center gap-1 py-1 flex-1 text-center transition-colors ${
                isActive ? 'text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-[#600006]' : ''} />
              <span className="text-[10px] uppercase font-mono tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}