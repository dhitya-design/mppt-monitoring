'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

interface TelemetryData {
  voltage: number;
  current: number;
  power?: number;
  created_at: string;
}

interface DashboardSegmentProps {
  data: TelemetryData;
  history?: TelemetryData[];
  playClickSound?: () => void;
  playPopSound?: () => void;
  setSelectedInfo?: (info: string | null) => void;
}

export default function DashboardSegments({ 
  data,
  history = [],
  playClickSound = () => {}, 
  playPopSound = () => {}, 
  setSelectedInfo = () => {} 
}: DashboardSegmentProps) {
  const [activeMetric, setActiveMetric] = useState<'voltage' | 'current' | 'battery' | 'power'>('power');

  // Metrik aktual dari Supabase
  const currentVoltage = data?.voltage ?? 0;
  const currentCurrent = data?.current ?? 0;
  const currentPower = data?.power ?? Number((currentVoltage * currentCurrent).toFixed(2));
  const currentBattery = 13.2; // Nilai estimasi baterai jika belum ada sensor khusus baterai

  // Format data riwayat dari Supabase untuk Recharts Chart
  const chartData = history.length > 0 
    ? history.map((item) => ({
        time: new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        voltage: Number(item.voltage.toFixed(2)),
        current: Number(item.current.toFixed(2)),
        battery: 13.2,
        power: Number((item.power ?? (item.voltage * item.current)).toFixed(2))
      }))
    : [
        { time: '08:00', voltage: 0, current: 0, battery: 12.6, power: 0 },
      ];

  const getMetricDetails = () => {
    switch (activeMetric) {
      case 'voltage': return { key: 'voltage', color: '#f59e0b', name: 'Tegangan Input Panel', unit: 'V' };
      case 'current': return { key: 'current', color: '#3b82f6', name: 'Arus Pengisian Pengendali', unit: 'A' };
      case 'battery': return { key: 'battery', color: '#84cc16', name: 'Tegangan Bank Baterai', unit: 'V' };
      case 'power':
      default: return { key: 'power', color: '#10b981', name: 'Total Daya Keluaran (P_pv)', unit: 'W' };
    }
  };

  const currentMetric = getMetricDetails();

  return (
    <div className="space-y-6">
      {/* CORE BANNER */}
      <div 
        onClick={() => { playClickSound(); setActiveMetric('power'); }}
        className={`cursor-pointer border p-6 bg-zinc-900/40 backdrop-blur-md transition-all duration-300 relative overflow-hidden ${
          activeMetric === 'power' ? 'border-emerald-500/60 ring-1 ring-emerald-500/30' : 'border-zinc-800 hover:border-zinc-700'
        }`}
        style={{ borderRadius: '0px' }}
      >
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
          <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase">// TELEMETRI ENKAPSULASI OUTPUT</span>
          <span className="text-xs font-black px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" style={{ borderRadius: '0px' }}>P&O MPPT</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-zinc-500 font-semibold uppercase">Total Daya Tergenerasi</p>
            <p className="text-4xl font-black mt-1 text-white tracking-tight">{currentPower.toFixed(2)} <span className="text-lg font-normal text-zinc-500">Watt</span></p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); playPopSound(); setSelectedInfo('power'); }}
            className="text-xs font-bold text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 transition-all"
            style={{ borderRadius: '0px' }}
          >
            Info Modul
          </button>
        </div>
      </div>

      {/* SENSOR GRIDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { id: 'voltage', label: 'Tegangan Panel', val: currentVoltage.toFixed(2), unit: 'Volt', text: 'text-amber-400' },
          { id: 'current', label: 'Arus Pengisian', val: currentCurrent.toFixed(2), unit: 'Ampere', text: 'text-blue-400' },
          { id: 'battery', label: 'Tegangan Baterai', val: currentBattery.toFixed(2), unit: 'Volt', text: 'text-lime-400' },
        ].map((item) => (
          <div
            key={item.id}
            onClick={() => { playClickSound(); setActiveMetric(item.id as any); }}
            className={`cursor-pointer border p-5 bg-zinc-900/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between h-36 ${
              activeMetric === item.id ? `border-zinc-400 ring-1 ring-zinc-400/20` : 'border-zinc-800 hover:border-zinc-700'
            }`}
            style={{ borderRadius: '0px' }}
          >
            <div className="flex justify-between items-start">
              <div className={`w-8 h-8 flex items-center justify-center font-black text-xs bg-zinc-800 border border-zinc-700 ${item.text}`} style={{ borderRadius: '0px' }}>
                {item.id.charAt(0).toUpperCase()}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); playPopSound(); setSelectedInfo(item.id); }}
                className="text-[10px] font-bold text-zinc-400 hover:text-zinc-200 bg-zinc-800 px-2 py-1 border border-zinc-700"
                style={{ borderRadius: '0px' }}
              >
                Detail
              </button>
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">{item.label}</p>
              <p className="text-2xl font-black text-white mt-0.5">{item.val} <span className="text-xs font-normal text-zinc-500">{item.unit}</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* RECHARTS CHART CARD */}
      <div className="border border-zinc-800 bg-zinc-900/20 backdrop-blur-md p-6" style={{ borderRadius: '0px' }}>
        <div className="mb-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            Kurva Analitis: <span className="text-xs px-2 py-0.5 bg-zinc-800 border border-zinc-700 font-mono text-zinc-300 uppercase" style={{ borderRadius: '0px' }}>{activeMetric}</span>
          </h3>
        </div>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.4} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#71717a' }} stroke="#27272a" />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} stroke="#27272a" />
              <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', color: '#fff', fontSize: '12px', borderRadius: '0px' }} />
              <Line 
                type="monotone" 
                dataKey={currentMetric.key} 
                stroke={currentMetric.color} 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2, fill: '#18181b' }} 
                activeDot={{ r: 6 }} 
                name={currentMetric.name} 
                unit={currentMetric.unit} 
                key={activeMetric} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}