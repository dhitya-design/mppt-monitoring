'use client';

import React from 'react';
import { Users } from 'lucide-react';

export default function TeamSegments() {
  const teamMembers = [
    {
      id: 'adhit',
      name: 'M. Adhitya Saputra',
      role: 'IoT & Frontend Engineer',
      image: '/adhit.jpeg',
      log: 'LOG_ID: DEV_01'
    },
    {
      id: 'yono',
      name: 'Yono',
      role: 'Hardware Specialist',
      image: '/yono.jpeg',
      log: 'LOG_ID: DEV_02'
    },
    {
      id: 'aras',
      name: 'Aras',
      role: 'Embedded System',
      image: '/aras.jpeg',
      log: 'LOG_ID: DEV_03'
    },
    {
      id: 'amir',
      name: 'Amir',
      role: 'Data Analyst & CAD Designer',
      image: '/amir.jpeg',
      log: 'LOG_ID: DEV_04'
    },
    {
      id: 'fadhil',
      name: 'Fadhil',
      role: 'System Tester & QA',
      image: '/fadhil.jpeg',
      log: 'LOG_ID: DEV_05'
    }
  ];

  return (
    <div className="space-y-4">
      {/* HEADER LOG TIM */}
      <div className="border border-zinc-800 bg-zinc-900/20 p-5 flex justify-between items-center" style={{ borderRadius: '0px' }}>
        <div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">// STRUKTUR ORGANISASI RISET</p>
          <h2 className="text-base font-black text-white tracking-tight mt-0.5 flex items-center gap-2">
            <Users size={16} className="text-[#600006]" /> Tim Pengembang & Struktur Kerja Proyek
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold" style={{ borderRadius: '0px' }}>
          CORE_TEAM: 05
        </span>
      </div>

      {/* GRID KARTU ANGGOTA TIM */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {teamMembers.map((member) => (
          <div 
            key={member.id} 
            className="bg-zinc-900/30 border border-zinc-800 p-4 text-center hover:border-zinc-500 transition-all duration-200 group relative flex flex-col justify-between"
            style={{ borderRadius: '0px' }}
          >
            <div>
              {/* Frame Foto Kotak Siku */}
              <div 
                className="w-24 h-24 mx-auto mb-4 bg-zinc-950 border border-zinc-850 overflow-hidden relative filter grayscale contrast-115 group-hover:grayscale-0 transition-all duration-300"
                style={{ borderRadius: '0px' }}
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150";
                  }}
                />
              </div>

              {/* Detail Identitas */}
              <h3 className="text-xs font-black text-white uppercase tracking-wide truncate group-hover:text-emerald-400 transition-colors">
                {member.name}
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-1">
                {member.role}
              </p>
            </div>

            {/* Id Log Kaki */}
            <div className="mt-4 pt-2 border-t border-zinc-800/40 font-mono text-[8px] text-zinc-600 text-left">
              {member.log}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}