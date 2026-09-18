import React from 'react';
import { SppdData } from '../types';
import { formatDate } from '../utils';

interface Props {
  data: SppdData;
}

export const SuratPerjalananDinasBelakang: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full max-w-[21cm] min-h-[29.7cm] mx-auto bg-white p-8 md:p-12 text-black shadow-lg print:shadow-none text-[9.5pt] font-serif leading-tight border border-gray-200 print:border-none box-border">
      
      <div className="flex justify-between items-center mb-3 pb-1 border-b border-gray-400">
        <span className="font-bold text-[10pt] uppercase">Lembar II : SPPD (Halaman Belakang)</span>
        <span className="text-[9pt] italic">Lampiran SPPD No: {data.nomorSurat}</span>
      </div>

      <table className="w-full border-collapse border border-black text-[9.5pt]">
        <tbody>
          {/* Row 1 - Keberangkatan Awal */}
          <tr>
            <td className="border border-black p-3 w-1/2 align-top h-[5.2cm]">
              <div className="flex">
                <span className="font-bold text-[10pt]">I.</span>
              </div>
            </td>
            <td className="border border-black p-3 w-1/2 align-top h-[5.2cm]">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <table className="w-full text-[9pt]">
                    <tbody>
                      <tr>
                        <td className="w-28 py-0.5">Berangkat dari</td>
                        <td className="w-2 py-0.5">:</td>
                        <td className="font-semibold py-0.5">{data.tempatBerangkat}</td>
                      </tr>
                      <tr>
                        <td className="py-0.5">Ke</td>
                        <td className="py-0.5">:</td>
                        <td className="font-semibold py-0.5">{data.tempatTujuan}</td>
                      </tr>
                      <tr>
                        <td className="py-0.5">Pada tanggal</td>
                        <td className="py-0.5">:</td>
                        <td className="py-0.5">{formatDate(data.tanggalBerangkat)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-center mt-2">
                  <p className="text-[8.5pt]">{data.pemberiPerintahJabatan},</p>
                  <div className="h-14 flex items-center justify-center text-[8pt] text-gray-300 italic print:text-transparent">
                    (Tanda Tangan & Cap Dinas)
                  </div>
                  <p className="font-bold underline text-[9.5pt]">{data.pemberiPerintahNama}</p>
                  <p className="text-[8.5pt]">NIP. {data.pemberiPerintahNip}</p>
                </div>
              </div>
            </td>
          </tr>

          {/* Row 2 - Tempat Tujuan */}
          <tr>
            <td className="border border-black p-3 w-1/2 align-top h-[5.4cm]">
              <div className="flex h-full flex-col justify-between">
                <div className="flex">
                  <span className="w-6 font-bold flex-shrink-0 text-[10pt]">II.</span>
                  <div className="flex-1">
                    <table className="w-full text-[9pt]">
                      <tbody>
                        <tr>
                          <td className="w-28 py-0.5">Tiba di</td>
                          <td className="w-2 py-0.5">:</td>
                          <td className="font-semibold py-0.5">{data.tempatTujuan}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5">Pada tanggal</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">{formatDate(data.tanggalBerangkat)}</td>
                        </tr>
                        {/* Baris penyeimbang tinggi tabel agar sejajar dengan kanan */}
                        <tr className="invisible select-none" aria-hidden="true">
                          <td className="py-0.5">&nbsp;</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-center mt-2">
                  <p className="text-[8.5pt]">Kepala Instansi / Pejabat Yang Dituju</p>
                  <div className="h-14 flex items-center justify-center text-[8pt] text-gray-300 italic print:text-transparent">
                    (Tanda Tangan & Cap Instansi Tujuan)
                  </div>
                  <p className="font-bold underline text-[9.5pt]">......................................................</p>
                  <p className="text-[8.5pt]">NIP. ...............................................</p>
                </div>
              </div>
            </td>
            <td className="border border-black p-3 w-1/2 align-top h-[5.4cm]">
              <div className="flex h-full flex-col justify-between">
                <div className="flex">
                  <span className="w-6 flex-shrink-0 invisible"></span>
                  <div className="flex-1">
                    <table className="w-full text-[9pt]">
                      <tbody>
                        <tr>
                          <td className="w-28 py-0.5">Berangkat dari</td>
                          <td className="w-2 py-0.5">:</td>
                          <td className="font-semibold py-0.5">{data.tempatTujuan}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5">Ke</td>
                          <td className="py-0.5">:</td>
                          <td className="font-semibold py-0.5">{data.tempatBerangkat}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5">Pada tanggal</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">{formatDate(data.tanggalKembali)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-center mt-2">
                  <p className="text-[8.5pt]">Kepala Instansi / Pejabat Yang Dituju</p>
                  <div className="h-14 flex items-center justify-center text-[8pt] text-gray-300 italic print:text-transparent">
                    (Tanda Tangan & Cap)
                  </div>
                  <p className="font-bold underline text-[9.5pt]">......................................................</p>
                  <p className="text-[8.5pt]">NIP. ...............................................</p>
                </div>
              </div>
            </td>
          </tr>

          {/* Row 3 - Transit / Lanjutan (Opsional) */}
          <tr>
            <td className="border border-black p-3 w-1/2 align-top h-[5.4cm]">
              <div className="flex h-full flex-col justify-between">
                <div className="flex">
                  <span className="w-6 font-bold flex-shrink-0 text-[10pt]">III.</span>
                  <div className="flex-1">
                    <table className="w-full text-[9pt]">
                      <tbody>
                        <tr>
                          <td className="w-28 py-0.5">Tiba di</td>
                          <td className="w-2 py-0.5">:</td>
                          <td className="py-0.5">...................................</td>
                        </tr>
                        <tr>
                          <td className="py-0.5">Pada tanggal</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">...................................</td>
                        </tr>
                        {/* Baris penyeimbang tinggi tabel agar sejajar dengan kanan */}
                        <tr className="invisible select-none" aria-hidden="true">
                          <td className="py-0.5">&nbsp;</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-center mt-2">
                  <p className="text-[8.5pt]">Kepala Instansi / Pejabat Yang Dituju</p>
                  <div className="h-14"></div>
                  <p className="font-bold underline text-[9.5pt]">......................................................</p>
                  <p className="text-[8.5pt]">NIP. ...............................................</p>
                </div>
              </div>
            </td>
            <td className="border border-black p-3 w-1/2 align-top h-[5.4cm]">
              <div className="flex h-full flex-col justify-between">
                <div className="flex">
                  <span className="w-6 flex-shrink-0 invisible"></span>
                  <div className="flex-1">
                    <table className="w-full text-[9pt]">
                      <tbody>
                        <tr>
                          <td className="w-28 py-0.5">Berangkat dari</td>
                          <td className="w-2 py-0.5">:</td>
                          <td className="py-0.5">...................................</td>
                        </tr>
                        <tr>
                          <td className="py-0.5">Ke</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">...................................</td>
                        </tr>
                        <tr>
                          <td className="py-0.5">Pada tanggal</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">...................................</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-center mt-2">
                  <p className="text-[8.5pt]">Kepala Instansi / Pejabat Yang Dituju</p>
                  <div className="h-14"></div>
                  <p className="font-bold underline text-[9.5pt]">......................................................</p>
                  <p className="text-[8.5pt]">NIP. ...............................................</p>
                </div>
              </div>
            </td>
          </tr>

          {/* Row 4 - Pengesahan Kembali di Tempat Asal */}
          <tr>
            <td className="border border-black p-3 w-1/2 align-top h-[5.4cm]">
              <div className="flex h-full flex-col justify-between">
                <div className="flex">
                  <span className="w-6 font-bold flex-shrink-0 text-[10pt]">IV.</span>
                  <div className="flex-1">
                    <table className="w-full text-[9pt]">
                      <tbody>
                        <tr>
                          <td className="w-28 py-0.5">Tiba kembali di</td>
                          <td className="w-2 py-0.5">:</td>
                          <td className="font-semibold py-0.5">{data.tempatBerangkat}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5">Pada tanggal</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">{formatDate(data.tanggalKembali)}</td>
                        </tr>
                        <tr className="invisible select-none" aria-hidden="true">
                          <td className="py-0.5">&nbsp;</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-center mt-2">
                  <p className="text-[8.5pt]">{data.pemberiPerintahJabatan},</p>
                  <div className="h-14 flex items-center justify-center text-[8pt] text-gray-300 italic print:text-transparent">
                    (Tanda Tangan & Cap Dinas)
                  </div>
                  <p className="font-bold underline text-[9.5pt]">{data.pemberiPerintahNama}</p>
                  <p className="text-[8.5pt]">NIP. {data.pemberiPerintahNip}</p>
                </div>
              </div>
            </td>
            <td className="border border-black p-3 w-1/2 align-top h-[5.4cm]">
              <div className="text-justify leading-relaxed text-[8.5pt]">
                <p className="font-semibold mb-1">PENGESAHAN :</p>
                <p>
                  Telah diperiksa dengan keterangan bahwa perjalanan tersebut di atas benar-benar dilakukan atas perintahnya dan semata-mata untuk kepentingan jabatan dalam waktu yang sesingkat-singkatnya.
                </p>
              </div>
            </td>
          </tr>

          {/* Row 5 - Catatan & Perhatian */}
          <tr>
            <td colSpan={2} className="border border-black p-2.5 text-[8pt] text-justify bg-gray-50 print:bg-transparent">
              <p className="font-bold uppercase">V. Catatan Lain-Lain & Perhatian :</p>
              <p className="mt-0.5">
                Pejabat yang berwenang menerbitkan SPPD, pegawai yang melakukan perjalanan dinas, para pejabat yang mengesahkan tanggal berangkat/tiba serta bendaharawan bertanggung jawab berdasarkan peraturan keuangan negara, apabila negara menderita rugi akibat kesalahan, kelalaian, dan kealpaannya (PP No. 6 Tahun 2008 & Peraturan Terkait).
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
