'use client';

export default function AboutSegment() {
  return (
    <div className="space-y-6">
      <div className="border border-zinc-800 bg-zinc-900/40 backdrop-blur-md p-6" style={{ borderRadius: '0px' }}>
        <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase block mb-1">// ARSITEKTUR UTAMA</span>
        <h2 className="text-xl font-black text-white tracking-tight">Karakteristik & Konsep Konversi</h2>
        <p className="text-sm text-zinc-400 mt-3 h-auto leading-relaxed text-justify">
          Ekosistem pemantauan ini dirancang untuk mendokumentasikan pelacakan titik daya maksimum (MPPT) dari penyerapan panel surya secara presisi. Melalui algoritma konversi yang andal, fluktuasi energi diisolasi dan diolah ke dalam pusat pemantauan digital ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-zinc-800 bg-zinc-900/30 p-5" style={{ borderRadius: '0px' }}>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500"></span> Enkapsulasi Pipeline
          </h3>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            Pemisahan data telemetri real-time dengan data informasional memastikan performa rendering visual interface berada dalam tingkat efisiensi paling tinggi.
          </p>
        </div>
        <div className="border border-zinc-800 bg-zinc-900/30 p-5" style={{ borderRadius: '0px' }}>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500"></span> Peta Konsep
          </h3>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            Menghubungkan parameter instrumentasi sirkuit daya fisik secara aman menuju dashboard web interaktif melalui enkripsi layer telemetri.
          </p>
        </div>
      </div>
    </div>
  );
}