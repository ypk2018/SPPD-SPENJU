import React from 'react';
import { SppdData } from '../types';
import { SuratTugas } from './SuratTugas';
import { SuratPerjalananDinas } from './SuratPerjalananDinas';
import { SuratPerjalananDinasBelakang } from './SuratPerjalananDinasBelakang';
import { RincianBiaya } from './RincianBiaya';

interface Props {
  data: SppdData;
}

export const PrintAllDocuments: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-8 print:space-y-0">
      {/* Halaman 1: Surat Perintah Tugas */}
      <div className="break-after-page print:page-break-after-always">
        <div className="mb-2 text-xs font-mono text-gray-500 uppercase tracking-widest no-print text-center">
          — Halaman 1: Surat Perintah Tugas (SPT) —
        </div>
        <SuratTugas data={data} />
      </div>

      {/* Halaman 2: SPPD Lembar Depan */}
      <div className="break-after-page print:page-break-after-always">
        <div className="mb-2 text-xs font-mono text-gray-500 uppercase tracking-widest no-print text-center pt-6">
          — Halaman 2: SPPD Lembar 1 (Depan) —
        </div>
        <SuratPerjalananDinas data={data} />
      </div>

      {/* Halaman 3: SPPD Lembar Belakang */}
      <div className="break-after-page print:page-break-after-always">
        <div className="mb-2 text-xs font-mono text-gray-500 uppercase tracking-widest no-print text-center pt-6">
          — Halaman 3: SPPD Lembar 2 (Belakang) —
        </div>
        <SuratPerjalananDinasBelakang data={data} />
      </div>

      {/* Halaman 4: Rincian Biaya */}
      <div>
        <div className="mb-2 text-xs font-mono text-gray-500 uppercase tracking-widest no-print text-center pt-6">
          — Halaman 4: Rincian Biaya & Kuitansi —
        </div>
        <RincianBiaya data={data} />
      </div>
    </div>
  );
};
