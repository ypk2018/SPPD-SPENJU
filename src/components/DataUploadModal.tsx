import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle, X, ArrowRight, RefreshCw, FileText } from 'lucide-react';
import { SppdData } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImportData: (importedRecords: SppdData[], mode: 'replace' | 'append') => void;
  currentRecordsCount: number;
}

export const DataUploadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onImportData,
  currentRecordsCount,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [convertedData, setConvertedData] = useState<SppdData[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('append');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Map arbitrary column keys (case-insensitive & fuzzy) to SppdData fields
  const mapRowToSppd = (row: any, index: number): SppdData => {
    const getVal = (...keys: string[]) => {
      for (const key of keys) {
        const lowerKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
        for (const rowKey of Object.keys(row)) {
          const cleanRowKey = rowKey.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (cleanRowKey.includes(lowerKey) || lowerKey.includes(cleanRowKey)) {
            return row[rowKey];
          }
        }
      }
      return undefined;
    };

    const parseNum = (val: any, defaultVal = 0) => {
      if (val === undefined || val === null) return defaultVal;
      if (typeof val === 'number') return val;
      const clean = String(val).replace(/[^0-9.-]+/g, '');
      const num = parseFloat(clean);
      return isNaN(num) ? defaultVal : num;
    };

    const parseDate = (val: any) => {
      if (!val) return new Date().toISOString().split('T')[0];
      // Jika Excel serial date number
      if (typeof val === 'number') {
        const date = new Date(Math.round((val - 25569) * 86400 * 1000));
        return date.toISOString().split('T')[0];
      }
      try {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          return d.toISOString().split('T')[0];
        }
      } catch {
        // ignore
      }
      return String(val);
    };

    const nama = getVal('nama', 'pegawai', 'nama_pegawai', 'namalengkap') || `Pegawai #${index + 1}`;
    const nip = getVal('nip', 'no_nip', 'nomor_induk') || '';
    const jabatan = getVal('jabatan', 'posisi', 'tugas') || 'Guru SMP Negeri 7 Sentani';
    const pangkat = getVal('pangkat', 'golongan', 'pangkat_gol', 'gol') || 'Penata Muda / III.a';
    const nomor = getVal('nomor', 'nomor_surat', 'nosurat', 'no') || `094/${String(index + 1).padStart(3, '0')}/SMPN7/2026`;
    const maksud = getVal('maksud', 'tujuan_dinas', 'perihal', 'keperluan', 'uraian') || 'Melaksanakan Perjalanan Dinas Kedinasan';
    const tujuan = getVal('tujuan', 'tempat_tujuan', 'lokasi', 'kota_tujuan') || 'Sentani, Kab. Jayapura';
    const berangkatDari = getVal('berangkat', 'tempat_berangkat', 'asal') || 'SMP Negeri 7 Sentani';
    const tglBerangkat = parseDate(getVal('tgl_berangkat', 'tanggal_berangkat', 'mulai', 'tgl_mulai'));
    const tglKembali = parseDate(getVal('tgl_kembali', 'tanggal_kembali', 'selesai', 'tgl_selesai'));
    const lamaHari = parseNum(getVal('lama_hari', 'hari', 'durasi', 'lama'), 1);

    const uangHarian = parseNum(getVal('uang_harian', 'uang_saku', 'harian', 'saku'), 350000);
    const transport = parseNum(getVal('transport', 'biaya_transport', 'ongkos', 'tiket'), 200000);
    const penginapan = parseNum(getVal('penginapan', 'hotel', 'biaya_penginapan', 'akomodasi'), 0);
    const biayaLainnya = parseNum(getVal('lainnya', 'biaya_lain', 'lain_lain', 'registrasi'), 0);

    return {
      id: `imported-${Date.now()}-${index}`,
      nomorSurat: String(nomor),
      tanggalSurat: new Date().toISOString().split('T')[0],
      pemberiPerintahNama: 'Drs. Yohanis Wally, M.Pd.',
      pemberiPerintahNip: '19710412 199803 1 004',
      pemberiPerintahJabatan: 'Kepala Sekolah',
      pegawaiNama: String(nama),
      pegawaiNip: String(nip),
      pegawaiPangkatGolongan: String(pangkat),
      pegawaiJabatan: String(jabatan),
      maksudPerjalanan: String(maksud),
      alatAngkut: getVal('alat_angkut', 'transportasi', 'kendaraan') || 'Kendaraan Darat / Dinas',
      tempatBerangkat: String(berangkatDari),
      tempatTujuan: String(tujuan),
      lamaHari: lamaHari || 1,
      tanggalBerangkat: tglBerangkat,
      tanggalKembali: tglKembali,
      bebanAnggaran: getVal('anggaran', 'sumber_dana', 'beban_anggaran') || 'DPA BOS SMPN 7 Sentani T.A 2026',
      uangHarian: uangHarian,
      biayaTransport: transport,
      biayaPenginapan: penginapan,
      biayaLainnya: biayaLainnya,
      keteranganBiayaLainnya: getVal('ket_lain', 'keterangan') || '',
      bendaharaNama: 'Ruth Ohee, S.E.',
      bendaharaNip: '19820715 200801 2 011'
    };
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    setFileName(file.name);

    const isJson = file.name.endsWith('.json');
    const isExcelOrCsv = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');

    if (!isJson && !isExcelOrCsv) {
      setErrorMsg('Format file tidak didukung. Harap upload file Excel (.xlsx, .xls), CSV (.csv), atau JSON (.json).');
      return;
    }

    const reader = new FileReader();

    if (isJson) {
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          const arrayData = Array.isArray(content) ? content : [content];
          const mapped = arrayData.map((row, idx) => mapRowToSppd(row, idx));
          setParsedRows(arrayData);
          setConvertedData(mapped);
        } catch {
          setErrorMsg('Gagal membaca file JSON. Pastikan format sintaks JSON valid.');
        }
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

          if (!rawJson || rawJson.length === 0) {
            setErrorMsg('File Excel/CSV kosong atau tidak memiliki baris data.');
            return;
          }

          const mapped = rawJson.map((row: any, idx: number) => mapRowToSppd(row, idx));
          setParsedRows(rawJson);
          setConvertedData(mapped);
        } catch (err: any) {
          setErrorMsg(`Gagal memproses file spreadsheet: ${err.message || 'Error parsing'}`);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Download Sample Template for Excel (.xlsx)
  const downloadTemplate = (format: 'xlsx' | 'csv') => {
    const templateData = [
      {
        'Nomor Surat': '094/010/SMPN7/2026',
        'Nama Pegawai': 'Agustina Wally, S.Pd.',
        'NIP': '19850612 201004 2 003',
        'Pangkat/Golongan': 'Penata / III.c',
        'Jabatan': 'Guru IPA & Pembina OSIS',
        'Maksud Perjalanan': 'Menghadiri Rapat Kerja MGMP Guru IPA se-Kabupaten Jayapura',
        'Tempat Berangkat': 'Sentani',
        'Tempat Tujuan': 'Dinas Pendidikan Kab. Jayapura (Gunung Merah)',
        'Lama Hari': 2,
        'Tanggal Berangkat': '2026-10-05',
        'Tanggal Kembali': '2026-10-06',
        'Alat Angkut': 'Kendaraan Roda Dua / Umum',
        'Beban Anggaran': 'BOS Reguler SMPN 7 Sentani T.A 2026',
        'Uang Harian': 350000,
        'Biaya Transport': 150000,
        'Biaya Penginapan': 0,
        'Biaya Lainnya': 50000,
        'Keterangan Biaya': 'Konsumsi & fotokopi bahan rapat'
      },
      {
        'Nomor Surat': '094/011/SMPN7/2026',
        'Nama Pegawai': 'Lukas Suebu, S.Pd.',
        'NIP': '19890915 201903 1 005',
        'Pangkat/Golongan': 'Penata Muda / III.a',
        'Jabatan': 'Guru Olahraga (PJOK)',
        'Maksud Perjalanan': 'Mendampingi Kontingen Atlet Siswa SMPN 7 Sentani pada O2SN Tingkat Kabupaten Jayapura',
        'Tempat Berangkat': 'SMP Negeri 7 Sentani',
        'Tempat Tujuan': 'Stadion Barnabas Youwe, Sentani',
        'Lama Hari': 3,
        'Tanggal Berangkat': '2026-10-12',
        'Tanggal Kembali': '2026-10-14',
        'Alat Angkut': 'Bus Sekolah / Mobil Dinas',
        'Beban Anggaran': 'BOS Kinerja SMPN 7 Sentani T.A 2026',
        'Uang Harian': 350000,
        'Biaya Transport': 200000,
        'Biaya Penginapan': 0,
        'Biaya Lainnya': 100000,
        'Keterangan Biaya': 'Konsumsi atlet & P3K'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    // Setting auto column width
    worksheet['!cols'] = [
      { wch: 22 }, // No Surat
      { wch: 26 }, // Nama
      { wch: 22 }, // NIP
      { wch: 20 }, // Pangkat
      { wch: 28 }, // Jabatan
      { wch: 45 }, // Maksud
      { wch: 18 }, // Asal
      { wch: 30 }, // Tujuan
      { wch: 10 }, // Lama
      { wch: 16 }, // Tgl Berangkat
      { wch: 16 }, // Tgl Kembali
      { wch: 25 }, // Alat Angkut
      { wch: 30 }, // Beban Anggaran
      { wch: 14 }, // Uang Harian
      { wch: 16 }, // Transport
      { wch: 16 }, // Penginapan
      { wch: 14 }, // Lainnya
      { wch: 30 }  // Keterangan
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data_SPPD');

    if (format === 'xlsx') {
      XLSX.writeFile(workbook, 'Template_Import_SPPD_SMPN7_Sentani.xlsx');
    } else {
      XLSX.writeFile(workbook, 'Template_Import_SPPD_SMPN7_Sentani.csv', { bookType: 'csv' });
    }
  };

  const handleApply = () => {
    if (convertedData.length === 0) return;
    onImportData(convertedData, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Upload Data SPPD & Pegawai</h2>
              <p className="text-blue-200 text-xs">Import data perjalanan dinas dari file Excel (.xlsx), CSV, atau JSON</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Action Download Template */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-blue-950 text-sm flex items-center">
                <FileText className="w-4 h-4 mr-1.5 text-blue-700" />
                Butuh format template data?
              </h4>
              <p className="text-blue-800 text-xs mt-0.5">
                Unduh file contoh kolom Excel untuk mempermudah pengisian data perjalanan SMPN 7 Sentani.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => downloadTemplate('xlsx')}
                className="px-3 py-1.5 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Format .XLSX</span>
              </button>
              <button
                type="button"
                onClick={() => downloadTemplate('csv')}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-blue-300 text-blue-900 hover:bg-blue-100/50 rounded-lg transition-colors flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Format .CSV</span>
              </button>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-blue-500 bg-blue-50/50 scale-[0.99]' 
                : 'border-gray-300 hover:border-blue-400 bg-gray-50/50 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.json"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="font-semibold text-gray-800 text-sm">
              {fileName ? fileName : 'Klik untuk memilih file atau seret file ke sini'}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Mendukung file Microsoft Excel (.xlsx, .xls), CSV (.csv), atau JSON (.json)
            </p>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Preview of Parsed Data */}
          {convertedData.length > 0 && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-100 px-4 py-2.5 flex justify-between items-center text-xs font-semibold text-gray-700">
                <span className="flex items-center text-green-700">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Berhasil membaca {convertedData.length} data perjalanan
                </span>
                <span className="text-gray-500 font-normal">
                  Pratinjau data:
                </span>
              </div>

              <div className="max-h-52 overflow-y-auto overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b text-gray-600 font-semibold sticky top-0">
                    <tr>
                      <th className="p-2 w-10">No</th>
                      <th className="p-2">Nama Pegawai</th>
                      <th className="p-2">NIP</th>
                      <th className="p-2">Jabatan</th>
                      <th className="p-2">Tujuan</th>
                      <th className="p-2 text-center">Hari</th>
                      <th className="p-2 text-right">Uang Harian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {convertedData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/50">
                        <td className="p-2 text-gray-500 text-center">{idx + 1}</td>
                        <td className="p-2 font-medium text-gray-900">{item.pegawaiNama}</td>
                        <td className="p-2 text-gray-600">{item.pegawaiNip || '-'}</td>
                        <td className="p-2 text-gray-600 truncate max-w-[140px]">{item.pegawaiJabatan}</td>
                        <td className="p-2 text-gray-600 truncate max-w-[140px]">{item.tempatTujuan}</td>
                        <td className="p-2 text-center">{item.lamaHari}</td>
                        <td className="p-2 text-right font-mono">Rp {item.uangHarian.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Import Mode Radio Options */}
              <div className="p-3 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <span className="text-gray-600 font-medium">Metode Import:</span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Tambahkan ke data yang ada (+{convertedData.length})</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Gantikan semua data ({currentRecordsCount} data lama dihapus)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Batal
          </button>
          
          <div className="flex space-x-2">
            <button
              type="button"
              disabled={convertedData.length === 0}
              onClick={handleApply}
              className={`px-5 py-2 text-xs font-semibold rounded-lg shadow-xs flex items-center space-x-1.5 transition-all ${
                convertedData.length > 0
                  ? 'bg-blue-700 hover:bg-blue-800 text-white cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Impor {convertedData.length > 0 ? `${convertedData.length} Data` : 'Data'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
