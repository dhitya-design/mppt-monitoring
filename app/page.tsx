'use client';

import { useState } from 'react';
import AboutSegment from '@/components/segments/AboutSegments';
import RoadmapSegment from '@/components/segments/RoadmapSegments';
import TeamSegment from '@/components/segments/TeamSegments';
// Sesuai dengan nama file dashboard yang Anda gunakan (DashboardSegments atau DashboardSegment)
import MainDashboardView from '@/components/segments/DashboardSegments'; 

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  // State tambahan jika diperlukan oleh komponen dashboard untuk melacak info yang dipilih
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);

  // Efek audio interaktif untuk feedback klik user
  const playClickSound = () => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/click.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {});
    }
  };

  const playPopSound = () => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/pop.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {});
    }
  };

  // Jalur render komponen berbasis Tab yang solid
  const renderSegment = () => {
    switch (activeTab) {
      case 'about':
        return <AboutSegment />;
      case 'roadmap':
        return <RoadmapSegment playClickSound={playClickSound} playPopSound={playPopSound} />;
      case 'team':
        return <TeamSegment playClickSound={playClickSound} playPopSound={playPopSound} />;
      case 'dashboard':
      default:
        // FIX: Mengalirkan properti playClickSound, playPopSound, dan setSelectedInfo yang dibutuhkan dashboard
        return (
          <MainDashboardView 
            playClickSound={playClickSound} 
            playPopSound={playPopSound} 
            setSelectedInfo={setSelectedInfo} 
          />
        );
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-6 flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* AREA KONTEN UTAMA (TOP & MIDDLE) */}
      <div className="w-full max-w-7xl mx-auto flex-1 pb-24">
        {/* HEADER STATUS BAR */}
        <div className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-mono text-emerald-400 block tracking-wider">// CORE STATION ONLINE</span>
            <h1 className="text-lg font-black tracking-tight text-white uppercase">P&O MPPT MONITORING SYSTEMS</h1>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[9px] font-mono text-zinc-500 block">HARDWARE_NODE</span>
            <span className="text-xs font-mono text-zinc-300 font-bold">ESP32_C3 // CLIENT_CONNECTED</span>
          </div>
        </div>

        {/* RENDERING FITUR AKTIF */}
        <div className="transition-all duration-200">
          {renderSegment()}
        </div>
      </div>

      {/* USER EXPERIENCE BASE: BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-900 p-4 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          
          {/* GRUP TOMBOL NAVIGASI UTAMA */}
          <div className="flex bg-zinc-900/60 p-1 border border-zinc-850 w-full sm:w-auto" style={{ borderRadius: '0px' }}>
            <button
              onClick={() => { playClickSound(); setActiveTab('dashboard'); }}
              className={`flex-1 sm:flex-none px-5 py-2 text-xs font-black uppercase tracking-wider transition-all duration-150 ${
                activeTab === 'dashboard' ? 'bg-zinc-100 text-black' : 'bg-transparent text-zinc-500 hover:text-zinc-300'
              }`}
              style={{ borderRadius: '0px' }}
            >
              Dashboard
            </button>
            <button
              onClick={() => { playClickSound(); setActiveTab('about'); }}
              className={`flex-1 sm:flex-none px-5 py-2 text-xs font-black uppercase tracking-wider transition-all duration-150 ${
                activeTab === 'about' ? 'bg-zinc-100 text-black' : 'bg-transparent text-zinc-500 hover:text-zinc-300'
              }`}
              style={{ borderRadius: '0px' }}
            >
              Info
            </button>
            <button
              onClick={() => { playClickSound(); setActiveTab('roadmap'); }}
              className={`flex-1 sm:flex-none px-5 py-2 text-xs font-black uppercase tracking-wider transition-all duration-150 ${
                activeTab === 'roadmap' ? 'bg-zinc-100 text-black' : 'bg-transparent text-zinc-500 hover:text-zinc-300'
              }`}
              style={{ borderRadius: '0px' }}
            >
              Roadmap
            </button>
            <button
              onClick={() => { playClickSound(); setActiveTab('team'); }}
              className={`flex-1 sm:flex-none px-5 py-2 text-xs font-black uppercase tracking-wider transition-all duration-150 ${
                activeTab === 'team' ? 'bg-zinc-100 text-black' : 'bg-transparent text-zinc-500 hover:text-zinc-300'
              }`}
              style={{ borderRadius: '0px' }}
            >
              Team
            </button>
          </div>

          {/* TEKS METADATA DEKORATIF DI BOTTOM BAR */}
          <div className="text-[10px] font-mono text-zinc-600 hidden md:block uppercase tracking-widest">
            SYSTEM_VER: 0.1.0_BETA // [PLTS x PBO]
          </div>

        </div>
      </div>

    </main>
  );
}