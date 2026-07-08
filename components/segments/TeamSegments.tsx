'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface TeamSegmentsProps {
  playClickSound: () => void;
  playPopSound: () => void;
}

export default function TeamSegments({ playClickSound, playPopSound }: TeamSegmentsProps) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const members = [
    { 
      id: 'adhit', 
      name: 'Muhamad Adhitya Saputra', 
      nim: '231113015',
      image: '/adhit.jpeg',
      hasPhoto: true,
      // Posisi default (tengah-tengah) biasanya aman untuk foto biasa
      objectPosition: 'object-center', 
      role: 'Interface & Data Communication', 
      task: 'Bertanggung jawab penuh atas arsitektur visual dashboard, enkapsulasi data telemetri, serta jalur komunikasi data nirkabel dari modul perangkat keras ke sistem monitoring.',
    },
    { 
      id: 'fadhil', 
      name: 'Fadhil Maulana', 
      nim: '231113010',
      image: '/fadhil.jpeg',
      hasPhoto: true,
      // Karena foto lebih zoom, kita fokuskan ke bagian atas (wajah)
      objectPosition: 'object-top', 
      role: 'Penulisan & Penyusunan Laporan', 
      task: 'Bertanggung jawab dalam mendokumentasikan seluruh jalurnya riset, menyusun standarisasi laporan teknis, serta memastikan penulisan ilmiah sesuai dengan kaidah metodologi penelitian.',
    },
    { 
      id: 'amir', 
      name: 'Amirudin Husnul Hidayat', 
      nim: '231113008',
      image: '/amir.jpeg',
      hasPhoto: true,
      objectPosition: 'object-center',
      role: 'Design 3D & Rancang Bangun Alat', 
      task: 'Bertanggung jawab atas pemodelan mekanis 3D sasis/enclosure perangkat keras, tata letak tata ruang instrumentasi fisik, serta konstruksi rancang bangun prototipe.',
    },
    { 
      id: 'yono', 
      name: 'Supriyono', 
      nim: '201113124',
      image: '/yono.jpeg',
      hasPhoto: true,
      // Sama seperti Fadhil, kita fokuskan ke bagian atas (wajah)
      objectPosition: 'object-top', 
      role: 'Sistem Hardware & Kontrol', 
      task: 'Bertanggung jawab atas integrasi logika sistem elektronika, manajemen komponen daya, sirkuit switching konverter, dan stabilitas operasional perangkat keras.',
    },
    { 
      id: 'nabila', 
      name: 'Nabila Zuha Faizah (Aras)', 
      nim: '231113003',
      image: '/aras.jpeg',
      hasPhoto: false,
      objectPosition: 'object-center',
      role: 'Analisis Data & Algoritma', 
      task: 'Bertanggung jawab dalam menganalisis data telemetri yang masuk, melakukan filterisasi galat sensor, serta melakukan komparasi analitis performa efisiensi pelacakan daya sistem.',
    },
  ];

  return (
    <div className="space-y-4">
      {/* BRANDING CARD */}
      <div className="border border-zinc-800 bg-zinc-900/20 p-5 flex justify-between items-center" style={{ borderRadius: '0px' }}>
        <div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">// STRUKTUR DIVISI RISET</p>
          <h2 className="text-base font-black text-white tracking-tight mt-0.5">Sinergi Anggota Tim Kelompok</h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-400" style={{ borderRadius: '0px' }}>
          5 Anggota Terdaftar
        </span>
      </div>

      {/* PHOTO GRID INDUSTRIAL */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {members.map((m) => (
          <div
            key={m.id}
            onClick={() => { playPopSound(); setSelectedMember(m.id); }}
            className="cursor-pointer border border-zinc-800 bg-zinc-900/20 flex flex-col justify-between h-64 hover:border-zinc-500 transition-all duration-300 group relative overflow-hidden"
            style={{ borderRadius: '0px' }}
          >
            {/* AREA FOTO PROFIL / PLACEHOLDER */}
            {/* Pada grid, kita biarkan object-cover memotong secara otomatis (default: center) */}
            <div className="relative w-full h-40 bg-zinc-950 border-b border-zinc-900 overflow-hidden flex items-center justify-center">
              {m.hasPhoto ? (
                <Image 
                  src={m.image} 
                  alt={m.name}
                  fill
                  sizes="(max-w-7xl) 100vw"
                  className={`object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out ${m.objectPosition}`}
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-zinc-700 font-mono text-2xl font-black group-hover:bg-zinc-850 transition-colors">
                  {m.name.charAt(0)}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent pointer-events-none" />
            </div>

            {/* TEKS IDENTITAS */}
            <div className="p-3 bg-zinc-900/40 flex-1 flex flex-col justify-center">
              <h4 className="text-xs font-black text-white truncate group-hover:text-emerald-400 transition-colors">{m.name}</h4>
              <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{m.nim}</p>
              <p className="text-[10px] text-zinc-400 font-medium truncate mt-1.5 border-t border-zinc-800/80 pt-1">{m.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DETAILED VIEW (TAP-TO-EXPAND) */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { playClickSound(); setSelectedMember(null); }}
              className="absolute inset-0 bg-zinc-950/75 backdrop-blur-md"
            />
            {(() => {
              const current = members.find(m => m.id === selectedMember);
              if (!current) return null;
              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-zinc-900 border border-zinc-800 max-w-sm w-full relative z-10 text-left overflow-hidden"
                  style={{ borderRadius: '0px' }}
                >
                  {/* FOTO PROFIL BESAR DI DALAM MODAL */}
                  <div className="relative w-full h-52 bg-zinc-950 border-b border-zinc-800 flex items-center justify-center overflow-hidden">
                    {current.hasPhoto ? (
                      <Image 
                        src={current.image} 
                        alt={current.name}
                        fill
                        // Di sini kita menerapkan posisi spesifik agar wajah terlihat
                        className={`object-cover ${current.objectPosition}`}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center text-zinc-800 font-mono text-5xl font-black">
                        {current.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/10 to-transparent" />
                  </div>

                  <div className="p-6">
                    <div className="border-b border-zinc-800 pb-3 mb-4">
                      <span className="text-[10px] font-mono text-emerald-400 block tracking-wider">// KARTU IDENTITAS DIVISI</span>
                      <h3 className="text-base font-black text-white tracking-tight mt-0.5">{current.name}</h3>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">NIM: {current.nim}</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide block">Fokus Peran:</span>
                        <p className="text-xs text-emerald-400 font-black mt-0.5">{current.role}</p>
                      </div>
                      <div className="pt-2 border-t border-zinc-800/60">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide block">Deskripsi Kerja (Jobdesk):</span>
                        <p className="text-xs text-zinc-400 leading-relaxed text-justify mt-1">{current.task}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => { playClickSound(); setSelectedMember(null); }}
                      className="mt-6 w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 transition-colors"
                      style={{ borderRadius: '0px' }}
                    >
                      Tutup Detail
                    </button>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}