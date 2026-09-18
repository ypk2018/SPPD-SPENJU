import React from 'react';
import { SppdData } from '../types';

interface Props {
  data: SppdData;
}

export const KopSurat: React.FC<Props> = ({ data }) => {
  return (
    <div className="flex flex-row items-center justify-between border-b-4 border-double border-black pb-3 mb-6">
      {/* Logo Pemda (Kiri) */}
      <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center">
        {data.logoPemda ? (
          <img 
            src={data.logoPemda} 
            alt="Logo Pemda Kab. Jayapura" 
            className="max-h-24 max-w-24 object-contain" 
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-20 h-24 border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400 text-center print:border-none print:text-transparent">
            Logo Pemda
          </div>
        )}
      </div>

      {/* Teks Kop Surat */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2 leading-[1.2]">
        <h2 className="text-base md:text-lg font-bold uppercase tracking-wider text-black font-serif">
          Pemerintah Kabupaten Jayapura
        </h2>
        <h1 className="text-lg md:text-xl font-bold uppercase tracking-wide text-black font-serif">
          Dinas Pendidikan
        </h1>
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black font-serif">
          SMP Negeri 7 Sentani
        </h1>
        <p className="text-[10pt] text-black mt-1 font-serif">
          Alamat: Jl. Kemiri, Sentani, Kec. Sentani, Kabupaten Jayapura, Papua 99352
        </p>
        <p className="text-[9pt] text-gray-700 font-serif">
          Email: smpn7sentani.kabjayapura@gmail.com | NPSN: 60301017
        </p>
      </div>

      {/* Logo Sekolah / Tut Wuri Handayani (Kanan) */}
      <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center">
        {data.logoSekolah ? (
          <img 
            src={data.logoSekolah} 
            alt="Logo SMP Negeri 7 Sentani" 
            className="max-h-24 max-w-24 object-contain" 
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-20 h-24 border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400 text-center print:border-none print:text-transparent">
            Logo Sekolah
          </div>
        )}
      </div>
    </div>
  );
};
