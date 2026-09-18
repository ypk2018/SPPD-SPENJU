import React from 'react';
import { KopSurat } from './KopSurat';
import { SppdData, PaperSize } from '../types';
import { formatDate } from '../utils';

interface Props {
  data: SppdData;
  paperSize?: PaperSize;
}

export const SuratTugas: React.FC<Props> = ({ data, paperSize = 'F4' }) => {
  const tahunAnggaran = data.tanggalSurat ? new Date(data.tanggalSurat).getFullYear() : new Date().getFullYear();

  return (
    <div 
      className={`w-full mx-auto bg-white p-8 md:p-10 text-black shadow-lg print:shadow-none text-[10.5pt] font-serif leading-relaxed border border-gray-200 print:border-none box-border print:p-0 print:m-0 print:w-full print:max-w-none print:min-h-0 ${
        paperSize === 'LEGAL' ? 'max-w-[216mm] min-h-[356mm]' : 'max-w-[215mm] min-h-[330mm]'
      }`}
    >
      <KopSurat data={data} />
      
      <div className="text-center mb-5">
        <h3 className="text-base md:text-lg font-bold underline uppercase tracking-wider">Surat Perintah Tugas</h3>
        <p className="text-xs md:text-sm mt-0.5">Nomor: {data.nomorSurat || '094 /       / SMPN7 / 2026'}</p>
      </div>

      <div className="flex flex-row mb-3 text-justify">
        <div className="w-28 flex-shrink-0 font-bold">Dasar</div>
        <div className="w-4 flex-shrink-0 text-center">:</div>
        <div className="flex-grow">
          Dokumen Pelaksanaan Anggaran ({data.bebanAnggaran || 'DPA BOS Reguler'}) SMP Negeri 7 Sentani Tahun Anggaran {tahunAnggaran}.
        </div>
      </div>

      <div className="text-center my-4">
        <h3 className="text-sm md:text-base font-bold uppercase tracking-widest">MEMERINTAHKAN :</h3>
      </div>

      <div className="flex flex-row mb-3">
        <div className="w-28 flex-shrink-0 font-bold">Kepada</div>
        <div className="w-4 flex-shrink-0 text-center">:</div>
        <div className="flex-grow">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-44 py-1">Nama</td>
                <td className="w-4 text-center">:</td>
                <td className="font-bold py-1">{data.pegawaiNama || '...........................................'}</td>
              </tr>
              <tr>
                <td className="py-1">NIP</td>
                <td className="text-center">:</td>
                <td className="py-1">{data.pegawaiNip ? data.pegawaiNip : '- (Non-PNS / P3K)'}</td>
              </tr>
              <tr>
                <td className="py-1">Pangkat / Gol. Ruang</td>
                <td className="text-center">:</td>
                <td className="py-1">{data.pegawaiPangkatGolongan || '...........................................'}</td>
              </tr>
              <tr>
                <td className="py-1">Jabatan</td>
                <td className="text-center">:</td>
                <td className="py-1">{data.pegawaiJabatan ? `${data.pegawaiJabatan} SMP Negeri 7 Sentani` : 'Staff SMP Negeri 7 Sentani'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-row mt-3">
        <div className="w-28 flex-shrink-0 font-bold">Untuk</div>
        <div className="w-4 flex-shrink-0 text-center">:</div>
        <div className="flex-grow">
          <ol className="list-decimal pl-5 text-justify space-y-1.5">
            <li className="pl-1">
              Melaksanakan perjalanan dinas dalam rangka: <span className="font-semibold">{data.maksudPerjalanan || '........................................................................'}</span>.
            </li>
            <li className="pl-1">
              Tujuan ke <span className="font-semibold">{data.tempatTujuan || '..........................'}</span> selama <span className="font-semibold">{data.lamaHari || 1} ({data.lamaHari === 1 ? 'satu' : data.lamaHari})</span> hari, terhitung mulai tanggal <span className="font-semibold">{formatDate(data.tanggalBerangkat)}</span> sampai dengan tanggal <span className="font-semibold">{formatDate(data.tanggalKembali)}</span>.
            </li>
            <li className="pl-1">
              Transportasi yang digunakan: <span className="font-semibold">{data.alatAngkut || 'Kendaraan Darat / Umum'}</span>.
            </li>
            <li className="pl-1">
              Setelah selesai melaksanakan tugas dinas tersebut, diwajibkan untuk segera membuat dan menyerahkan laporan tertulis kepada Kepala Sekolah.
            </li>
          </ol>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-justify indent-8 leading-relaxed">
          Demikian Surat Perintah Tugas ini diberikan kepada yang bersangkutan untuk dilaksanakan dengan penuh rasa tanggung jawab dan dedikasi.
        </p>
      </div>

      {/* Tanda Tangan Pejabat */}
      <div className="flex justify-end mt-8 print:mt-6 avoid-page-break print-break-inside-avoid">
        <div className="text-center w-72">
          <p>Ditetapkan di : Sentani</p>
          <p className="mb-2">Pada tanggal : {formatDate(data.tanggalSurat)}</p>
          <p className="font-bold">{data.pemberiPerintahJabatan},</p>
          <div className="h-16 flex items-center justify-center text-xs text-gray-300 italic print:text-transparent">
            (Tanda Tangan & Cap Dinas)
          </div>
          <p className="font-bold underline text-[11pt]">{data.pemberiPerintahNama || '...........................................'}</p>
          <p className="text-[10pt]">NIP. {data.pemberiPerintahNip || '...........................................'}</p>
        </div>
      </div>
    </div>
  );
};
