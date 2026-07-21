"use client";

import React from 'react';
import { Users, Mail, ShieldAlert, Cpu, Layers, Radio, Code, HardDrive } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  division: string;
  email: string;
  imagePath: string;
  icon: React.ReactNode;
}

export default function TeamSegments() {
  const teamMembers: TeamMember[] = [
    {
      name: "Muhamad Adhitya Saputra",
      role: "Lead IoT Engineer & Core Developer",
      division: "Embedded System & Frontend Integration",
      email: "adhitya@student.unu-yogyakarta.ac.id",
      imagePath: "/adhit.jpeg",
      icon: <Cpu size={14} className="text-[#600006]" />
    },
    {
      name: "Fadhil",
      role: "Hardware & Power Electronics Specialist",
      division: "Circuit Design & Buck-Boost Converter Control",
      email: "fadhil@student.unu-yogyakarta.ac.id",
      imagePath: "/fadhil.jpeg",
      icon: <Layers size={14} className="text-zinc-400 group-hover:text-amber-500 transition-colors" />
    },
    {
      name: "Amir",
      role: "Firmware Engineer",
      division: "ESP32 C3 Programming & MPPT P&O Algorithm",
      email: "amir@student.unu-yogyakarta.ac.id",
      imagePath: "/amir.jpeg",
      icon: <Code size={14} className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
    },
    {
      name: "Yono",
      role: "Data & Telemetry System Engineer",
      division: "API Service Development & Database Buffer Management",
      email: "yono@student.unu-yogyakarta.ac.id",
      imagePath: "/yono.jpeg",
      icon: <HardDrive size={14} className="text-zinc-400 group-hover:text-purple-500 transition-colors" />
    },
    {
      name: "Aras",
      role: "Instrumentation & Testing Specialist",
      division: "Sensor Calibration & Hardware Protection Quality Assurance",
      email: "aras@student.unu-yogyakarta.ac.id",
      imagePath: "/aras.jpeg",
      icon: <Radio size={14} className="text-zinc-400 group-hover:text-emerald-500 transition-colors" />
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* SECTION HEADER */}
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Users size={14} className="text-[#600006]" /> Anggota Tim Pengembang AFAYA
        </h2>
        <p className="text-[11px] text-zinc-500 mt-1 font-mono uppercase">
          AFAYA_PROJECT_STRUCTURE // CORE_TEAM_MEMBERS_5
        </p>
      </div>

      {/* TEAM MEMBERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamMembers.map((member, idx) => (
          <div 
            key={idx} 
            className="bg-[#111111] border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all group"
            style={{ borderRadius: '0px' }}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                  // MEMBER_0{idx + 1}
                </span>
                {member.icon}
              </div>

              {/* FOTO PROFIL (STYLE SIKU KOTAK MURNI) */}
              <div className="mb-4 w-full h-56 bg-zinc-950 border border-zinc-850 flex items-center justify-center overflow-hidden" style={{ borderRadius: '0px' }}>
                <img 
                  src={member.imagePath} 
                  alt={`Foto ${member.name}`}
                  className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                  style={{ borderRadius: '0px' }}
                  onError={(e) => {
                    // Fallback jika file gambar belum ditaruh di folder public
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const placeholder = document.createElement('div');
                      placeholder.className = "text-[9px] font-mono text-zinc-600 uppercase tracking-widest p-4 text-center";
                      placeholder.innerText = `[ NO_AVATAR: ${member.imagePath.replace('/', '')} ]`;
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              </div>
              
              <h3 className="text-base font-black text-white uppercase tracking-tight group-hover:text-[#600006] transition-colors">
                {member.name}
              </h3>
              <p className="text-xs font-bold text-zinc-300 mt-1 font-mono">
                {member.role}
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {member.division}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-zinc-900 flex items-center gap-2 text-[10px] font-mono text-zinc-400">
              <Mail size={12} className="text-zinc-600" />
              <span className="truncate">{member.email}</span>
            </div>
          </div>
        ))}
      </div>

      {/* INSTITUTIONAL INFO CARD */}
      <section className="bg-zinc-900/40 border border-zinc-850 p-5" style={{ borderRadius: '0px' }}>
        <div className="flex gap-3 items-start">
          <ShieldAlert size={16} className="text-[#600006] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wide">
              Afiliasi Riset & Pengembangan
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Platform monitoring ini dikembangkan secara kolaboratif oleh tim **AFAYA** di bawah naungan Program Studi Teknik Elektro, Universitas Nahdlatul Ulama Yogyakarta (UNU Yogyakarta). Seluruh data parameter kelistrikan diuji dan dikalibrasi secara berkala guna menjaga integritas hasil riset sistem penjejak daya maksimum ini.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}