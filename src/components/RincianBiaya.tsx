import React from 'react';
import { SppdData } from '../types';
import { formatCurrency, formatDate, terbilang } from '../utils';
import { KopSurat } from './KopSurat';

interface Props {
  data: SppdData;
}

export const RincianBiaya: React.FC<Props> = ({ data }) => {
  const lamaHari = Number(data.lamaHari) || 1;
  const uangHarianSatuan = Number(data.uangHarian) || 0;
  const totalUangHarian = uangHarianSatuan * lamaHari;
  
  const malamMenginap = lamaHari > 1 ? lamaHari - 1 : 0;
  const biayaPenginapanSatuan = Number(data.biayaPenginapan) || 0;
  const totalPenginapan = biayaPenginapanSatuan * malamMenginap;
  
  const biayaTransport = Number(data.biayaTransport) || 0;
  const biayaLainnya = Number(data.biayaLainnya) || 0;
  
  const totalBiaya = totalUangHarian + biayaTransport + totalPenginapan + biayaLainnya;

  return (
    <div className="w-full max-w-[21cm] min-h-[29.7cm] mx-auto bg-white p-8 md:p-12 text-black shadow-lg print:shadow-none text-[10.5pt] font-serif leading-relaxed border border-gray-200 print:border-none box-border">
      <KopSurat data={data} />
      
      <div className="text-center mb-5">
        <h3 className="text-lg font-bold underline uppercase tracking-wider">Rincian Biaya Perjalanan Dinas</h3>
        <p className="text-xs mt-1">Lampiran SPPD Nomor: {data.nomorSurat || '094 /       / SMPN7 / 2026'}</p>
        <p className="text-xs">Tanggal: {formatDate(data.tanggalSurat)}</p>
      </div>

      <div className="mb-5 text-[10pt] leading-normal bg-gray-50 print:bg-transparent p-3 rounded border border-gray-200 print:border-none">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-48 py-0.5">Nama Pegawai</td>
              <td className="w-4 text-center">:</td>
              <td className="font-bold">{data.pegawaiNama}</td>
            </tr>
            <tr>
              <td className="py-0.5">NIP</td>
              <td className="text-center">:</td>
              <td>{data.pegawaiNip || '-'}</td>
            </tr>
            <tr>
              <td className="py-0.5">Pangkat / Golongan</td>
              <td className="text-center">:</td>
              <td>{data.pegawaiPangkatGolongan || '-'}</td>
            </tr>
            <tr>
              <td className="py-0.5">Maksud Perjalanan</td>
              <td className="text-center">:</td>
              <td className="leading-snug">{data.maksudPerjalanan}</td>
            </tr>
            <tr>
              <td className="py-0.5">Tempat Tujuan</td>
              <td className="text-center">:</td>
              <td className="font-semibold">{data.tempatTujuan}</td>
            </tr>
            <tr>
              <td className="py-0.5">Lamanya Perjalanan</td>
              <td className="text-center">:</td>
              <td>{lamaHari} Hari ({formatDate(data.tanggalBerangkat)} s/d {formatDate(data.tanggalKembali)})</td>
            </tr>
            <tr>
              <td className="py-0.5">Mata Anggaran</td>
              <td className="text-center">:</td>
              <td>{data.bebanAnggaran || 'BOS Reguler SMPN 7 Sentani'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <table className="w-full border-collapse border border-black mb-4 text-[10pt]">
        <thead>
          <tr className="bg-gray-100 print:bg-gray-100 font-bold text-center">
            <th className="border border-black p-2 w-10">No</th>
            <th className="border border-black p-2 text-left">Perincian Biaya</th>
            <th className="border border-black p-2 w-44 text-right">Jumlah (Rp)</th>
            <th className="border border-black p-2 w-32 text-center">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-2 text-center align-top">1</td>
            <td className="border border-black p-2 align-top">
              <div className="font-semibold">Uang Harian / Uang Saku</div>
              <div className="text-xs text-gray-600 italic">
                {lamaHari} Hari x {formatCurrency(uangHarianSatuan)}
              </div>
            </td>
            <td className="border border-black p-2 text-right align-top font-mono font-medium">
              {formatCurrency(totalUangHarian)}
            </td>
            <td className="border border-black p-2 text-center align-top text-xs">Standar Biaya Masukan</td>
          </tr>
          <tr>
            <td className="border border-black p-2 text-center align-top">2</td>
            <td className="border border-black p-2 align-top">
              <div className="font-semibold">Biaya Transportasi PP</div>
              <div className="text-xs text-gray-600 italic">{data.alatAngkut || 'Kendaraan Darat'}</div>
            </td>
            <td className="border border-black p-2 text-right align-top font-mono font-medium">
              {formatCurrency(biayaTransport)}
            </td>
            <td className="border border-black p-2 text-center align-top text-xs">Tiket / BBM / Sewa</td>
          </tr>
          <tr>
            <td className="border border-black p-2 text-center align-top">3</td>
            <td className="border border-black p-2 align-top">
              <div className="font-semibold">Biaya Penginapan / Hotel</div>
              <div className="text-xs text-gray-600 italic">
                {malamMenginap > 0 ? `${malamMenginap} Malam x ${formatCurrency(biayaPenginapanSatuan)}` : 'Tidak menginap (PP)'}
              </div>
            </td>
            <td className="border border-black p-2 text-right align-top font-mono font-medium">
              {formatCurrency(totalPenginapan)}
            </td>
            <td className="border border-black p-2 text-center align-top text-xs">Kuitansi / Bill Hotel</td>
          </tr>
          <tr>
            <td className="border border-black p-2 text-center align-top">4</td>
            <td className="border border-black p-2 align-top">
              <div className="font-semibold">Biaya Riil / Lain-lain</div>
              {data.keteranganBiayaLainnya && (
                <div className="text-xs text-gray-600 italic">{data.keteranganBiayaLainnya}</div>
              )}
            </td>
            <td className="border border-black p-2 text-right align-top font-mono font-medium">
              {formatCurrency(biayaLainnya)}
            </td>
            <td className="border border-black p-2 text-center align-top text-xs">Daftar Pengeluaran Riil</td>
          </tr>
          <tr className="font-bold bg-gray-50 print:bg-gray-100">
            <td className="border border-black p-2 text-center" colSpan={2}>
              JUMLAH TOTAL
            </td>
            <td className="border border-black p-2 text-right font-mono text-[11pt]">
              {formatCurrency(totalBiaya)}
            </td>
            <td className="border border-black p-2 text-center"></td>
          </tr>
        </tbody>
      </table>

      {/* Terbilang */}
      <div className="p-2.5 border border-dashed border-black bg-gray-50 print:bg-transparent rounded mb-6 text-[10pt]">
        <span className="font-bold italic">Terbilang : </span>
        <span className="italic font-semibold">{terbilang(totalBiaya)}</span>
      </div>

      {/* 3 Blok Tanda Tangan: Kepala Sekolah, Bendahara, Penerima */}
      <div className="grid grid-cols-3 gap-2 mt-8 text-[9.5pt] print-break-inside-avoid">
        {/* Setuju dibayar / Kepala Sekolah */}
        <div className="text-center flex flex-col justify-between h-48">
          <div>
            <p>Setuju dibayar,</p>
            <p className="font-bold">{data.pemberiPerintahJabatan}</p>
          </div>
          <div className="text-xs text-gray-300 italic print:text-transparent">
            (Tanda Tangan & Cap)
          </div>
          <div>
            <p className="font-bold underline text-[10pt]">{data.pemberiPerintahNama || '...........................................'}</p>
            <p>NIP. {data.pemberiPerintahNip || '...........................................'}</p>
          </div>
        </div>

        {/* Lunas dibayar / Bendahara */}
        <div className="text-center flex flex-col justify-between h-48">
          <div>
            <p>Lunas dibayar tgl {formatDate(data.tanggalSurat)}</p>
            <p className="font-bold">Bendahara Pengeluaran,</p>
          </div>
          <div className="text-xs text-gray-300 italic print:text-transparent">
            (Tanda Tangan)
          </div>
          <div>
            <p className="font-bold underline text-[10pt]">{data.bendaharaNama || 'Ruth Ohee, S.E.'}</p>
            <p>NIP. {data.bendaharaNip || '19820715 200801 2 011'}</p>
          </div>
        </div>

        {/* Yang Menerima */}
        <div className="text-center flex flex-col justify-between h-48">
          <div>
            <p>Sentani, {formatDate(data.tanggalSurat)}</p>
            <p className="font-bold">Yang Menerima,</p>
          </div>
          <div className="text-xs text-gray-300 italic print:text-transparent">
            (Tanda Tangan)
          </div>
          <div>
            <p className="font-bold underline text-[10pt]">{data.pegawaiNama || '...........................................'}</p>
            <p>NIP. {data.pegawaiNip ? data.pegawaiNip : '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
