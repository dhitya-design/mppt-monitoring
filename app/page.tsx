"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Zap, Layers, Users, RefreshCw, Calendar } from 'lucide-react';
import RoadmapSegments from '@/components/segments/RoadmapSegments';
import TeamSegments from '@/components/segments/TeamSegments';

interface TelemetryData {
  voltage: number;
  current: number;
  power: number;
  created_at: string;
}

export default function MPPTDashboard() {
  const [currentSegment, setCurrentSegment] = useState<'dashboard' | 'roadmap' | 'team'>('dashboard');
  const [data, setData] = useState<TelemetryData>({
    voltage: 0,
    current: 0,
    power: 0,
    created_at: new Date().toISOString()
  });
  const [history, setHistory] = useState<TelemetryData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/telemetry');
      if (res.ok) {
        const result = await res.json();
        if (result && result.length > 0) {
          const latest = result[0];
          setData(latest);
          setHistory(result.slice().reverse());
        }
      }
    } catch (error) {
      console.error("Gagal mengambil data telemetri:", error);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans p-6 selection:bg-[#600006] selection:text-white">
      
      {/* HEADER UTAMA */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#600006] font-semibold tracking-widest text-xs uppercase mb-1">
            <Activity size={14} /> Sistem Pemantauan IoT
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">
            Hybrid MPPT Tracker Monitoring
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Optimasi Pengisian Daya Baterai Berbasis Algoritma P&O - ESP32 C3
          </p>
        </div>
        
        {/* NAVIGASI MENU DASHBOARD */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button 
            onClick={() => setCurrentSegment('dashboard')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
              currentSegment === 'dashboard' ? 'bg-[#600006] border-[#600006] text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            style={{ borderRadius: '0px' }}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentSegment('roadmap')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
              currentSegment === 'roadmap' ? 'bg-[#600006] border-[#600006] text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            style={{ borderRadius: '0px' }}
          >
            Roadmap
          </button>
          <button 
            onClick={() => setCurrentSegment('team')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
              currentSegment === 'team' ? 'bg-[#600006] border-[#600006] text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            style={{ borderRadius: '0px' }}
          >
            Team
          </button>
        </div>
      </header>

      {/* KONDISIONAL RENDER SEGMEN VIEW */}
      {currentSegment === 'dashboard' && (
        <div className="space-y-8">
          {/* GRID KARTU INDIKATOR */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#111111] border border-zinc-800 p-6 flex flex-col justify-between" style={{ borderRadius: '0px' }}>
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tegangan Panel (PV)</p>
                <Zap size={18} className="text-amber-500" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-white tracking-tight">{data.voltage.toFixed(2)}</span>
                <span className="text-lg font-bold text-zinc-500">V</span>
              </div>
            </div>

            <div className="bg-[#111111] border border-zinc-800 p-6 flex flex-col justify-between" style={{ borderRadius: '0px' }}>
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Arus Pengisian</p>
                <Cpu size={18} className="text-blue-500" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-white tracking-tight">{data.current.toFixed(2)}</span>
                <span className="text-lg font-bold text-zinc-500">A</span>
              </div>
            </div>

            <div className="bg-[#111111] border border-zinc-800 p-6 flex flex-col justify-between bg-gradient-to-br from-[#111111] to-[#1a0507]" style={{ borderRadius: '0px' }}>
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Daya Keluaran (Power)</p>
                <Activity size={18} className="text-[#600006]" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-white tracking-tight">{data.power.toFixed(2)}</span>
                <span className="text-lg font-bold text-zinc-400">W</span>
              </div>
            </div>
          </section>

          {/* GRAFIK REAL-TIME */}
          <section className="bg-[#111111] border border-zinc-800 p-6" style={{ borderRadius: '0px' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers size={16} className="text-[#600006]" /> Kurva Perubahan Daya Efektif
              </h2>
              <button 
                onClick={() => { setLoading(true); fetchTelemetry().then(() => setLoading(false)); }}
                className="flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border border-zinc-850 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider"
                style={{ borderRadius: '0px' }}
              >
                <RefreshCw size={10} className={loading ? "animate-spin" : ""} /> Sync
              </button>
            </div>
            <div className="h-48 w-full bg-zinc-950 border border-zinc-900 flex items-end p-2 gap-1 overflow-hidden" style={{ borderRadius: '0px' }}>
              {history.map((item, idx) => {
                const maxPower = 100;
                const heightPercentage = Math.min((item.power / maxPower) * 100, 100);
                return (
                  <div 
                    key={idx} 
                    className="bg-[#600006] opacity-80 hover:opacity-100 flex-1 transition-all duration-300 relative group"
                    style={{ height: `${heightPercentage}%`, minWidth: '12px', borderRadius: '0px' }}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-zinc-900 text-[9px] font-mono text-white p-1 border border-zinc-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 mb-1" style={{ borderRadius: '0px' }}>
                      {item.power.toFixed(1)}W ({new Date(item.created_at).toLocaleTimeString()})
                    </div>
                  </div>
                );
              })}
              {history.length === 0 && (
                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600 uppercase tracking-widest font-mono">
                  Menunggu Transmisi Data Simulator...
                </div>
              )}
            </div>
          </section>

          {/* DOKUMENTASI FISIK */}
          <section>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu size={16} className="text-[#600006]" /> Dokumentasi Teknis Hardware & Prototipe
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#111111] border border-zinc-800 p-4" style={{ borderRadius: '0px' }}>
                <h3 className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Skema Sistem</h3>
                <div className="h-44 w-full bg-zinc-900 border border-zinc-800 overflow-hidden" style={{ borderRadius: '0px' }}>
                  <img src="/schematic.jpeg" alt="Skema Elektronik" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="bg-[#111111] border border-zinc-800 p-4" style={{ borderRadius: '0px' }}>
                <h3 className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Sistem Kontrol</h3>
                <div className="h-44 w-full bg-zinc-900 border border-zinc-800 overflow-hidden" style={{ borderRadius: '0px' }}>
                  <img src="/kontrol.jpeg" alt="Sistem Kontrol" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="bg-[#111111] border border-zinc-800 p-4" style={{ borderRadius: '0px' }}>
                <h3 className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Desain Casing 3D</h3>
                <div className="h-44 w-full bg-zinc-900 border border-zinc-800 overflow-hidden" style={{ borderRadius: '0px' }}>
                  <img src="/3d.jpeg" alt="Desain 3D" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="bg-[#111111] border border-zinc-800 p-4" style={{ borderRadius: '0px' }}>
                <h3 className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Prototipe 3D Hijau</h3>
                <div className="h-44 w-full bg-zinc-900 border border-zinc-800 overflow-hidden" style={{ borderRadius: '0px' }}>
                  <img src="/3dhijau.jpeg" alt="Desain 3D Hijau" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {currentSegment === 'roadmap' && <RoadmapSegments />}
      {currentSegment === 'team' && <TeamSegments />}

      {/* FOOTER ERGONOMIS */}
      <footer className="mt-12 text-center text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
        © 2026 MPPT Monitor Project — UNU Yogyakarta. All Rights Reserved.
      </footer>
    </div>
  );
}