import React from 'react';
import { KopSurat } from './KopSurat';
import { SppdData, PaperSize } from '../types';
import { formatDate } from '../utils';

interface Props {
  data: SppdData;
  paperSize?: PaperSize;
}

export const SuratPerjalananDinas: React.FC<Props> = ({ data, paperSize = 'F4' }) => {
  return (
    <div 
      className={`w-full mx-auto bg-white p-8 md:p-10 text-black shadow-lg print:shadow-none text-[10pt] font-serif leading-tight border border-gray-200 print:border-none box-border print:p-0 print:m-0 print:w-full print:max-w-none print:min-h-0 ${
        paperSize === 'LEGAL' ? 'max-w-[216mm] min-h-[356mm]' : 'max-w-[215mm] min-h-[330mm]'
      }`}
    >
      <KopSurat data={data} />
      
      <div className="text-right text-[9.5pt] mb-2 italic">
        <p>Lembar Ke : I (Pertama)</p>
        <p>Kode No : .....................</p>
      </div>

      <div className="text-center mb-3.5">
        <h3 className="text-base font-bold underline uppercase tracking-wider">Surat Perintah Perjalanan Dinas</h3>
        <p className="text-xs sm:text-sm font-semibold tracking-wide">( S P P D )</p>
        <p className="text-xs mt-0.5">Nomor: {data.nomorSurat || '094 /       / SMPN7 / 2026'}</p>
      </div>

      <table className="w-full border-collapse border border-black mb-4 text-[9.5pt]">
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1.5 w-8 text-center align-top font-semibold">1</td>
            <td className="border border-black px-2 py-1.5 w-[42%] align-top">Pejabat berwenang yang memberi perintah</td>
            <td className="border border-black px-2 py-1.5 font-bold align-top">{data.pemberiPerintahJabatan}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 text-center align-top font-semibold">2</td>
            <td className="border border-black px-2 py-1.5 align-top">Nama Pegawai yang diperintahkan</td>
            <td className="border border-black px-2 py-1.5 font-bold align-top">{data.pegawaiNama}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 text-center align-top font-semibold">3</td>
            <td className="border border-black px-2 py-1.5 align-top">
              a. Pangkat dan Golongan menurut PP No. 6 Tahun 2008<br/>
              b. Jabatan / Instansi<br/>
              c. Tingkat menurut peraturan perjalanan dinas
            </td>
            <td className="border border-black px-2 py-1.5 align-top space-y-0.5">
              <p>a. {data.pegawaiPangkatGolongan || '-'}</p>
              <p>b. {data.pegawaiJabatan} / SMP Negeri 7 Sentani</p>
              <p>c. Tingkat C / Standar Pegawai</p>
            </td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 text-center align-top font-semibold">4</td>
            <td className="border border-black px-2 py-1.5 align-top">Maksud Perjalanan Dinas</td>
            <td className="border border-black px-2 py-1.5 align-top leading-relaxed">{data.maksudPerjalanan}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 text-center align-top font-semibold">5</td>
            <td className="border border-black px-2 py-1.5 align-top">Alat angkut yang dipergunakan</td>
            <td className="border border-black px-2 py-1.5 align-top">{data.alatAngkut}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 text-center align-top font-semibold">6</td>
            <td className="border border-black px-2 py-1.5 align-top">
              a. Tempat berangkat<br/>
              b. Tempat tujuan
            </td>
            <td className="border border-black px-2 py-1.5 align-top space-y-0.5">
              <p>a. {data.tempatBerangkat}</p>
              <p>b. {data.tempatTujuan}</p>
            </td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 text-center align-top font-semibold">7</td>
            <td className="border border-black px-2 py-1.5 align-top">
              a. Lamanya perjalanan dinas<br/>
              b. Tanggal berangkat<br/>
              c. Tanggal harus kembali / tiba di tempat baru
            </td>
            <td className="border border-black px-2 py-1.5 align-top space-y-0.5">
              <p>a. {data.lamaHari} ({data.lamaHari === 1 ? 'satu' : data.lamaHari}) Hari</p>
              <p>b. {formatDate(data.tanggalBerangkat)}</p>
              <p>c. {formatDate(data.tanggalKembali)}</p>
            </td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 text-center align-top font-semibold">8</td>
            <td className="border border-black px-2 py-1.5 align-top">Pengikut: Nama / Tanggal Lahir / Keterangan</td>
            <td className="border border-black px-2 py-1.5 align-top italic text-gray-600">-</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 text-center align-top font-semibold">9</td>
            <td className="border border-black px-2 py-1.5 align-top">
              Pembebanan Anggaran<br/>
              a. Instansi<br/>
              b. Mata Anggaran / Akun
            </td>
            <td className="border border-black px-2 py-1.5 align-top space-y-0.5">
              <p>a. SMP Negeri 7 Sentani, Kab. Jayapura</p>
              <p>b. {data.bebanAnggaran || 'DPA BOS Reguler'}</p>
            </td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 text-center align-top font-semibold">10</td>
            <td className="border border-black px-2 py-1.5 align-top">Keterangan lain-lain</td>
            <td className="border border-black px-2 py-1.5 align-top">Surat Perintah Tugas terlampir.</td>
          </tr>
        </tbody>
      </table>

      {/* Tanda Tangan */}
      <div className="flex justify-end mt-4 print:mt-3 avoid-page-break print-break-inside-avoid">
        <div className="text-left w-72 text-[9.5pt]">
          <p>Dikeluarkan di : Sentani</p>
          <p className="mb-1.5">Pada Tanggal : {formatDate(data.tanggalSurat)}</p>
          <p className="font-bold">{data.pemberiPerintahJabatan},</p>
          <div className="h-16 flex items-center justify-center text-xs text-gray-300 italic print:text-transparent">
            (Tanda Tangan & Cap Dinas)
          </div>
          <p className="font-bold underline text-[10.5pt]">{data.pemberiPerintahNama || '...........................................'}</p>
          <p>NIP. {data.pemberiPerintahNip || '...........................................'}</p>
        </div>
      </div>
    </div>
  );
};
