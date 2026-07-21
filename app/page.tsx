"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Cpu, Zap, Layers, Users, RefreshCw, 
  LayoutDashboard, Calendar, Sliders, ShieldCheck, 
  ChevronRight, ArrowUpRight, Database, Info
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// Import Segments sesuai dengan nama file di folder components/segments/
import AboutSegments from '@/components/segments/AboutSegments';
import DashboardSegments from '@/components/segments/DashboardSegments';
import RoadmapSegments from '@/components/segments/RoadmapSegments';
import TeamSegments from '@/components/segments/TeamSegments';

interface TelemetryData {
  voltage: number;
  current: number;
  power: number;
  created_at: string;
}

export default function MPPTDashboard() {
  const [currentSegment, setCurrentSegment] = useState<'dashboard' | 'about' | 'roadmap' | 'team'>('dashboard');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [relayStatus, setRelayStatus] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  
  const [data, setData] = useState<TelemetryData>({
    voltage: 18.42,
    current: 4.15,
    power: 76.44,
    created_at: new Date().toISOString()
  });
  
  const [history, setHistory] = useState<TelemetryData[]>([]);

  // Fetch data telemetri dari Supabase
  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      const { data: telemetryData, error } = await supabase
        .from('telemetry')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error("Supabase error:", error.message);
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

  useEffect(() => {
    fetchTelemetry();

    // Listener WebSocket Supabase Realtime
    const channel = supabase
      .channel('realtime_telemetry')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'telemetry' },
        (payload) => {
          const newRecord = payload.new as TelemetryData;
          setData(newRecord);
          setHistory((prev) => [...prev.slice(1), newRecord]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans p-4 md:p-6 pb-28 selection:bg-[#600006] selection:text-white antialiased">
      
      {/* TOP HEADER BRANDING */}
      <header className="border-b border-zinc-800 pb-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#600006] font-mono font-bold tracking-widest text-xs uppercase mb-1.5">
            <span className="font-black tracking-tighter text-sm lowercase text-white bg-[#600006] px-1.5 py-0.5" style={{ borderRadius: '0px' }}>afaya</span> 
            <span className="text-zinc-600 font-normal">/</span> Core Connected ESP32 C3
          </div>
          <h1 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase">
            MPPT Monitoring by AFAYA
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl font-medium">
            Sistem IoT Manajemen Pengisian Daya Baterai Berbasis Algoritma P&O. Dikembangkan di Universitas Nahdlatul Ulama Yogyakarta.
          </p>
        </div>

        {/* STATUS BAR CEPAT */}
        <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-850 p-2.5 w-full md:w-auto" style={{ borderRadius: '0px' }}>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <div className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider">
            AFAYA_NODE: <span className="text-emerald-400 font-bold">ONLINE_STABLE</span>
          </div>
        </div>
      </header>

      {/* AREA UTAMA (KONDISIONAL SEGMEN VIEW) */}
      <main className="w-full space-y-6">
        {currentSegment === 'dashboard' && (
          <>
            {/* GRID 1: KONTROL OPERASIONAL */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-[#111111] border border-zinc-800 p-5 flex flex-col justify-between" style={{ borderRadius: '0px' }}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">// REMOTE_GATE_SWITCH</span>
                    <Sliders size={16} className="text-[#600006]" />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">Sirkuit Pemutus Beban</h3>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    Kontrol manual relay pengaman untuk memutus arus pengisian ke baterai secara darurat.
                  </p>
                </div>
                
                <div className="mt-6 flex items-center justify-between bg-zinc-950 p-2 border border-zinc-900" style={{ borderRadius: '0px' }}>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider px-2">
                    STATUS: {relayStatus ? <span className="text-emerald-400 font-bold">CONNECTED</span> : <span className="text-red-500 font-bold">ISOLATED</span>}
                  </span>
                  <button 
                    onClick={() => setRelayStatus(!relayStatus)}
                    className={`px-4 py-1.5 font-mono text-[10px] font-black uppercase tracking-wider transition-all ${
                      relayStatus 
                        ? 'bg-[#600006] hover:bg-[#80000a] text-white' 
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    {relayStatus ? "DISCONNECT" : "CONNECT"}
                  </button>
                </div>
              </div>

              <div 
                onClick={() => setActiveModal('telemetry_details')}
                className="bg-[#111111] border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-500 cursor-pointer transition-all duration-200 group" 
                style={{ borderRadius: '0px' }}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">// ADVANCED_LOG</span>
                    <Database size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#600006] transition-colors">Statistik & Histori Log</h3>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    Lihat resolusi sampling data telemetri, counter paket, dan log kegagalan transmisi ESP32.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-900">
                  <span>REALTIME WEBSOCKET</span>
                  <span className="flex items-center gap-1 text-[#600006] font-bold group-hover:text-white transition-colors">BUKA DETAIL LOG <ArrowUpRight size={12} /></span>
                </div>
              </div>

              <div 
                onClick={() => setActiveModal('protection_details')}
                className="bg-[#111111] border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-500 cursor-pointer transition-all duration-200 group" 
                style={{ borderRadius: '0px' }}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">// HARDWARE_PROTECTION</span>
                    <ShieldCheck size={16} className="text-emerald-500" />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">Sistem Proteksi Internal</h3>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    Monitoring status pembatas tegangan berlebih (*Overvoltage*) dan arus pendek (*Short Circuit Protection*).
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-900">
                  <span>LIMIT: 25.0V / 10A</span>
                  <span className="flex items-center gap-1 text-emerald-500 font-bold group-hover:text-white transition-colors">PROTEKSI AKTIF <ChevronRight size={12} /></span>
                </div>
              </div>
            </section>

            {/* SEGMEN INSTRUMENTASI LENGKAP */}
            <DashboardSegments setSelectedInfo={(info) => setActiveModal(info)} />

            {/* BAR CHART HISTORY */}
            <section className="bg-[#111111] border border-zinc-800 p-5" style={{ borderRadius: '0px' }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={14} className="text-[#600006]" /> Telemetri Buffer Realtime (Supabase)
                </h2>
                <button 
                  onClick={fetchTelemetry}
                  className="flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border border-zinc-850 px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider transition-colors"
                  style={{ borderRadius: '0px' }}
                >
                  <RefreshCw size={10} className={loading ? "animate-spin" : ""} /> Sync Buffer
                </button>
              </div>
              
              <div className="h-44 w-full bg-zinc-950 border border-zinc-900 flex items-end p-2 gap-1 overflow-hidden" style={{ borderRadius: '0px' }}>
                {history.map((item, idx) => {
                  const maxPower = 100;
                  const heightPercentage = Math.min((item.power / maxPower) * 100, 100);
                  return (
                    <div 
                      key={idx} 
                      className="bg-[#600006] opacity-75 hover:opacity-100 flex-1 transition-all duration-200 relative group"
                      style={{ height: `${heightPercentage}%`, minWidth: '7px', borderRadius: '0px' }}
                    >
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-zinc-900 text-[8px] font-mono text-white p-1 border border-zinc-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 mb-1" style={{ borderRadius: '0px' }}>
                        {item.power.toFixed(1)}W
                      </div>
                    </div>
                  );
                })}
                {history.length === 0 && (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
                    Menunggu aliran transmisi interaktif dari hardware ESP32 C3...
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
      <footer className="text-center text-[9px] text-zinc-600 font-mono uppercase tracking-widest mt-16 mb-4">
        © 2026 afaya Project — UNU Yogyakarta. All Rights Reserved.
      </footer>

      {/* MODALS OVERLAY */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-zinc-900 border border-zinc-800 max-w-md w-full relative z-10 overflow-hidden text-left"
              style={{ borderRadius: '0px' }}
            >
              <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center">
                <span className="text-[10px] font-mono text-[#600006] font-bold uppercase tracking-wider">// AFAYA_SYSTEM_EVALUATION</span>
                <button onClick={() => setActiveModal(null)} className="text-zinc-500 hover:text-white text-xs font-mono font-bold uppercase tracking-widest">
                  [Tutup]
                </button>
              </div>

              <div className="p-5 space-y-4">
                {activeModal === 'voltage' && (
                  <>
                    <h3 className="text-sm font-black uppercase text-amber-400">Analisis Tegangan Input (Panel)</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Nilai tegangan saat ini adalah <strong className="text-white">{data.voltage.toFixed(2)}V</strong>. Sensor tegangan membaca fluktuasi input dari solar panel array secara presisi.
                    </p>
                  </>
                )}

                {activeModal === 'current' && (
                  <>
                    <h3 className="text-sm font-black uppercase text-blue-400">Analisis Arus Pengisian</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Laju arus pengisian terukur sebesar <strong className="text-white">{data.current.toFixed(2)}A</strong>. Nilai ini diregulasi melalui penyesuaian sinyal PWM dari mikrokontroler.
                    </p>
                  </>
                )}

                {activeModal === 'power' && (
                  <>
                    <h3 className="text-sm font-black uppercase text-emerald-400">Efisiensi Daya Aktual</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Total daya efektif saat ini mencapai <strong className="text-white">{data.power.toFixed(2)}W</strong>. Algoritma P&O secara konstan memperbarui nilai duty cycle.
                    </p>
                  </>
                )}

                {activeModal === 'telemetry_details' && (
                  <>
                    <h3 className="text-sm font-black uppercase text-white">Statistik & Buffer Log Database</h3>
                    <div className="bg-zinc-950 p-3 font-mono text-[9px] text-zinc-400 space-y-1">
                      <div>&gt; REALTIME_STATUS: CONNECTED</div>
                      <div>&gt; DATABASE: SUPABASE_POSTGRES</div>
                      <div>&gt; TIMESTAMP: {data.created_at}</div>
                    </div>
                  </>
                )}

                {activeModal === 'protection_details' && (
                  <>
                    <h3 className="text-sm font-black uppercase text-emerald-400">Sistem Proteksi Internal</h3>
                    <div className="bg-zinc-950 p-3 font-mono text-[9px] text-zinc-400 space-y-1 border-l-2 border-emerald-500">
                      <div>&gt; OVER_VOLTAGE_LIMIT: 25.0V [SAFE]</div>
                      <div>&gt; OVER_CURRENT_LIMIT: 10.0A [SAFE]</div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 border-t border-zinc-800 bg-zinc-950 text-right">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-[10px] font-bold uppercase tracking-wider"
                  style={{ borderRadius: '0px' }}
                >
                  Selesai Tinjau
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FIXED NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/85 backdrop-blur-md border-t border-zinc-800 px-4 py-3 flex justify-around items-center">
        <button 
          onClick={() => setCurrentSegment('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 flex-1 text-center transition-colors ${
            currentSegment === 'dashboard' ? 'text-white font-black' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <LayoutDashboard size={17} className={currentSegment === 'dashboard' ? 'text-[#600006]' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">afaya</span>
        </button>

        <button 
          onClick={() => setCurrentSegment('about')}
          className={`flex flex-col items-center gap-1 py-1 flex-1 text-center transition-colors ${
            currentSegment === 'about' ? 'text-white font-black' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Info size={17} className={currentSegment === 'about' ? 'text-[#600006]' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">About</span>
        </button>
        
        <button 
          onClick={() => setCurrentSegment('roadmap')}
          className={`flex flex-col items-center gap-1 py-1 flex-1 text-center transition-colors ${
            currentSegment === 'roadmap' ? 'text-white font-black' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Calendar size={17} className={currentSegment === 'roadmap' ? 'text-[#600006]' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Roadmap</span>
        </button>
        
        <button 
          onClick={() => setCurrentSegment('team')}
          className={`flex flex-col items-center gap-1 py-1 flex-1 text-center transition-colors ${
            currentSegment === 'team' ? 'text-white font-black' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Users size={17} className={currentSegment === 'team' ? 'text-[#600006]' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Team</span>
        </button>
      </nav>

    </div>
  );
}