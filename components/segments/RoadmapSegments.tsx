'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function RoadmapSegments() {
  const [activeMilestone, setActiveMilestone] = useState<string | null>(null);

  const milestones = [
    {
      id: 'inisiasi',
      step: '01',
      title: 'Penugasan & Inisiasi Proyek (PLTS × PBO)',
      date: 'Fase 1: Konseptual',
      status: 'Completed',
      description: 'Menerima penugasan integrasi sistem hibrida PLTS dan arsitektur perangkat lunak pemantauan berbasis objek. Menganalisis karakteristik non-linearitas kurva I-V panel surya akibat fluktuasi iradiasi matahari oleh tim pengembang (Adhit, Yono, Aras, Amir, Fadhil).',
      images: [], 
      note: 'LOG_METRIC: Pemetaan awal diagram kelas (Class Diagram) struktur objek data telemetri.'
    },
    {
      id: 'persiapan',
      step: '02',
      title: 'Persiapan Alat, Bahan & Komponen',
      date: 'Fase 2: Pengadaan',
      status: 'Completed',
      description: 'Pengadaan komponen penunjang instrumentasi: Mikrokontroler ESP32 C3, sensor parameter daya (arus/tegangan), modul switching konverter, serta konfigurasi environment Python untuk antarmuka real-time.',
      images: [], 
      note: 'LOG_METRIC: Kelayakan hardware diperiksa untuk memastikan kendali duty cycle presisi.'
    },
    {
      id: 'design-3d',
      step: '03',
      title: 'Perancangan Mekanis & Desain 3D CAD',
      date: 'Fase 3: Desain Fisik',
      status: 'Completed',
      description: 'Pemodelan sasis utama dan enclosure sistem kontrol menggunakan software CAD oleh Amir. Fokus pada perancangan tata letak mekanis instrumentasi fisik guna memastikan efisiensi ruang dan keamanan termal.',
      images: [
        '/3d.jpeg',
        '/3dhijau.jpeg'
      ],
      note: 'LOG_METRIC: Sasis persegi murni dirancang presisi untuk meminimalkan overheat.'
    },
    {
      id: 'hardware-firmware',
      step: '04',
      title: 'Integrasi Hardware & Komputasi Firmware',
      date: 'Fase 4: Konstruksi',
      status: 'Completed',
      description: 'Perangkaian fisik sirkuit elektronika oleh Yono dan Aras, dikombinasikan dengan flashing kode algoritma Perturb and Observe (P&O) konvensional ke ESP32 C3 oleh Adhit untuk melacak titik daya maksimum (MPP).',
      images: [
        '/schematic.jpeg',
        '/kontrol.jpeg'
      ],
      note: 'LOG_METRIC: Enkapsulasi data telemetri dioptimalkan untuk meminimalkan osilasi di sekitar MPP.'
    },
    {
      id: 'monev-interface',
      step: '05',
      title: 'Monitoring & Evaluasi (Monev) Akademik',
      date: 'Fase 5: Validasi Awal',
      status: 'In Progress',
      description: 'Presentasi dan pengujian fungsionalitas purwarupa stasiun kendali di hadapan dosen penguji. Menampilkan kestabilan transmisi data parameter elektrik menuju antarmuka monitoring berbasis web.',
      images: [], 
      note: 'LOG_METRIC: Validasi fungsionalitas current state sistem sebelum pengambilan data konstan.'
    },
    {
      id: 'ambil-data',
      step: '06',
      title: 'Pengambilan Data Aktual & Analisis Efisiensi',
      date: 'Fase 6: Evaluasi Akhir',
      status: 'Pending',
      description: 'Melakukan running sistem secara konstan di bawah fluktuasi iradiasi riil. Menganalisis fenomena kehilangan daya akibat osilasi, mendeteksi terjadinya penyimpangan (drift), dan menyusun kalkulasi efisiensi ekstraksi energi.',
      images: [], 
      note: 'LOG_METRIC: Penyusunan laporan ilmiah akhir berdasarkan data log telemetri Python.'
    }
  ];

  return (
    <div className="space-y-4">
      {/* HEADER LOG */}
      <div className="border border-zinc-800 bg-zinc-900/20 p-5 flex justify-between items-center" style={{ borderRadius: '0px' }}>
        <div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">// TIMELINE PERKEMBANGAN RISET</p>
          <h2 className="text-base font-black text-white tracking-tight mt-0.5">Alur Tahapan Proyek Rancang Bangun</h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-850 text-emerald-400 font-bold animate-pulse" style={{ borderRadius: '0px' }}>
          JALUR AKTIF MONEV
        </span>
      </div>

      {/* TIMELINE LIST */}
      <div className="space-y-3 relative">
        <div className="absolute left-[21px] top-4 bottom-4 w-[1px] bg-zinc-850 hidden sm:block" />

        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            onClick={() => setActiveMilestone(milestone.id)}
            className="cursor-pointer border border-zinc-800 bg-zinc-900/30 p-4 hover:border-zinc-500 transition-all duration-200 group flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between relative overflow-hidden"
            style={{ borderRadius: '0px' }}
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-11 h-11 bg-zinc-950 border border-zinc-850 flex items-center justify-center font-mono text-xs font-black text-zinc-400 group-hover:border-zinc-500 group-hover:text-emerald-400 transition-colors z-10" style={{ borderRadius: '0px' }}>
                {milestone.step}
              </div>
              <div className="flex-1 truncate">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">{milestone.date}</span>
                  <span className={`text-[8px] px-1.5 font-bold uppercase ${
                    milestone.status === 'Completed' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900' :
                    milestone.status === 'In Progress' ? 'bg-amber-950/40 text-amber-400 border border-amber-900 animate-pulse' :
                    'bg-zinc-900 text-zinc-500 border border-zinc-850'
                  }`} style={{ borderRadius: '0px' }}>
                    {milestone.status}
                  </span>
                </div>
                <h3 className="text-sm font-black text-white mt-0.5 tracking-tight group-hover:text-emerald-400 transition-colors truncate">
                  {milestone.title}
                </h3>
              </div>
            </div>

            <div className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors flex items-center gap-1.5 w-full sm:w-auto justify-end border-t border-zinc-800/60 sm:border-0 pt-2 sm:pt-0">
              {milestone.images.length > 0 ? 'LIHAT DOKUMENTASI' : 'LIHAT LOG DETAIL'} <span className="text-xs">→</span>
            </div>
          </div>
        ))}
      </div>

      {/* POP-UP MODAL MULTI-FOTO INTERAKTIF */}
      <AnimatePresence>
        {activeMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              onClick={() => setActiveMilestone(null)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />
            {(() => {
              const current = milestones.find(m => m.id === activeMilestone);
              if (!current) return null;
              return (
                <div 
                  className="bg-zinc-900 border border-zinc-800 max-w-xl w-full relative z-10 text-left overflow-hidden flex flex-col max-h-[90vh]"
                  style={{ borderRadius: '0px' }}
                >
                  <div className="p-5 border-b border-zinc-800 bg-zinc-900/60 sticky top-0 z-20 backdrop-blur-md">
                    <span className="text-[10px] font-mono text-emerald-400 block tracking-wider">// MASTER WORKFLOW LOG #{current.step}</span>
                    <h3 className="text-base font-black text-white tracking-tight mt-0.5">{current.title}</h3>
                  </div>

                  <div className="p-5 space-y-5 overflow-y-auto flex-1">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide block">Deskripsi Teknis Tahapan:</span>
                      <p className="text-xs text-zinc-400 leading-relaxed text-justify mt-1">{current.description}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide block mb-2">Dokumentasi Arsip Visual:</span>
                      {current.images.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {current.images.map((src, idx) => (
                            <div key={idx} className="relative h-44 bg-zinc-950 border border-zinc-800 overflow-hidden">
                              <Image
                                src={src}
                                alt={`${current.title} - ${idx + 1}`}
                                fill
                                className="object-cover filter grayscale contrast-115 hover:grayscale-0 transition-all duration-300"
                              />
                              <div className="absolute bottom-1.5 left-1.5 bg-zinc-950/80 border border-zinc-850 px-1.5 py-0.5 text-[9px] font-mono text-zinc-400">
                                LOG_IMG_{idx + 1}.JPEG
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border border-dashed border-zinc-800 bg-zinc-950/40 p-6 text-center">
                          <p className="text-xs text-zinc-600 font-mono">// Dokumen foto fisik belum di-upload ke public/</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-zinc-950 p-3 border-l-2 border-zinc-700 font-mono text-[10px] text-zinc-500 leading-relaxed">
                      <span className="text-zinc-400 font-bold">STATUS_LOG:</span> {current.note}
                    </div>
                  </div>

                  <div className="p-4 border-t border-zinc-800 bg-zinc-900/40">
                    <button
                      onClick={() => setActiveMilestone(null)}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 transition-colors"
                      style={{ borderRadius: '0px' }}
                    >
                      Kembali ke Roadmap
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}