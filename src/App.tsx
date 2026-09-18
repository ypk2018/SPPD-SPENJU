import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  FileText, 
  Printer, 
  Upload, 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  Layers, 
  User, 
  MapPin, 
  Calculator, 
  Building2, 
  Search, 
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { SppdData, DocumentType } from './types';
import { initialSppdRecords, LOGO_PEMDA_JAYAPURA, LOGO_SEKOLAH_SMPN7 } from './data/defaultData';
import { SuratTugas } from './components/SuratTugas';
import { SuratPerjalananDinas } from './components/SuratPerjalananDinas';
import { SuratPerjalananDinasBelakang } from './components/SuratPerjalananDinasBelakang';
import { RincianBiaya } from './components/RincianBiaya';
import { PrintAllDocuments } from './components/PrintAllDocuments';
import { DataUploadModal } from './components/DataUploadModal';
import { formatCurrency, formatDate } from './utils';

const STORAGE_KEY = 'sppd_smpn7_records_v1';

export default function App() {
  // State for all SPPD records
  const [records, setRecords] = useState<SppdData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return initialSppdRecords;
  });

  // Active Selected SPPD ID
  const [activeRecordId, setActiveRecordId] = useState<string>(() => {
    return records[0]?.id || 'sppd-001';
  });

  // Active View Tab
  const [activeTab, setActiveTab] = useState<DocumentType>('ALL');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Active Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to LocalStorage whenever records change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // storage full or disabled
    }
  }, [records]);

  // Find active record
  const currentRecord = records.find(r => r.id === activeRecordId) || records[0] || initialSppdRecords[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handle updates to active record form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setRecords(prevRecords => 
      prevRecords.map(rec => {
        if (rec.id === currentRecord.id) {
          const updated = {
            ...rec,
            [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value
          };

          // Auto-calculate lama hari jika tgl berangkat dan tgl kembali berubah
          if (name === 'tanggalBerangkat' || name === 'tanggalKembali') {
            const start = new Date(name === 'tanggalBerangkat' ? value : rec.tanggalBerangkat);
            const end = new Date(name === 'tanggalKembali' ? value : rec.tanggalKembali);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
              const diffTime = Math.abs(end.getTime() - start.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
              updated.lamaHari = diffDays;
            }
          }

          return updated;
        }
        return rec;
      })
    );
  };

  // Handle Logo Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logoPemda' | 'logoSekolah') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setRecords(prev => prev.map(r => r.id === currentRecord.id ? { ...r, [fieldName]: result } : r));
        showToast(`Logo ${fieldName === 'logoPemda' ? 'Pemda' : 'Sekolah'} berhasil diunggah!`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset Logos to official defaults
  const handleResetLogos = () => {
    setRecords(prev => prev.map(r => r.id === currentRecord.id ? { 
      ...r, 
      logoPemda: LOGO_PEMDA_JAYAPURA, 
      logoSekolah: LOGO_SEKOLAH_SMPN7 
    } : r));
    showToast('Logo dikembalikan ke Logo Resmi SMPN 7 Sentani & Kab. Jayapura');
  };

  // Add new blank SPPD
  const handleAddNewRecord = () => {
    const newIndex = records.length + 1;
    const today = new Date().toISOString().split('T')[0];
    const newRecord: SppdData = {
      id: `sppd-${Date.now()}`,
      nomorSurat: `094/${String(newIndex).padStart(3, '0')}/SMPN7/2026`,
      tanggalSurat: today,
      pemberiPerintahNama: 'Drs. Yohanis Wally, M.Pd.',
      pemberiPerintahNip: '19710412 199803 1 004',
      pemberiPerintahJabatan: 'Kepala Sekolah',
      pegawaiNama: '',
      pegawaiNip: '',
      pegawaiPangkatGolongan: 'Penata Muda / III.a',
      pegawaiJabatan: 'Guru',
      maksudPerjalanan: '',
      alatAngkut: 'Kendaraan Darat / Dinas',
      tempatBerangkat: 'Sentani',
      tempatTujuan: '',
      lamaHari: 1,
      tanggalBerangkat: today,
      tanggalKembali: today,
      bebanAnggaran: 'DPA BOS Reguler SMPN 7 Sentani T.A 2026',
      uangHarian: 350000,
      biayaTransport: 200000,
      biayaPenginapan: 0,
      biayaLainnya: 0,
      bendaharaNama: 'Ruth Ohee, S.E.',
      bendaharaNip: '19820715 200801 2 011',
      logoPemda: LOGO_PEMDA_JAYAPURA,
      logoSekolah: LOGO_SEKOLAH_SMPN7
    };

    setRecords(prev => [newRecord, ...prev]);
    setActiveRecordId(newRecord.id!);
    showToast('SPPD Baru berhasil ditambahkan!');
  };

  // Duplicate current record
  const handleDuplicateRecord = () => {
    const duplicated: SppdData = {
      ...currentRecord,
      id: `sppd-${Date.now()}`,
      nomorSurat: `${currentRecord.nomorSurat} (Salinan)`
    };
    setRecords(prev => [duplicated, ...prev]);
    setActiveRecordId(duplicated.id!);
    showToast('SPPD berhasil diduplikasikan!');
  };

  // Delete current record
  const handleDeleteRecord = (idToDelete: string) => {
    if (records.length <= 1) {
      alert('Minimal harus ada 1 data SPPD di dalam sistem.');
      return;
    }
    if (window.confirm('Apakah Anda yakin ingin menghapus data SPPD ini?')) {
      const filtered = records.filter(r => r.id !== idToDelete);
      setRecords(filtered);
      setActiveRecordId(filtered[0]?.id || '');
      showToast('Data SPPD telah dihapus.');
    }
  };

  // Reset to default sample records
  const handleResetToSamples = () => {
    if (window.confirm('Kembalikan ke data contoh SMP Negeri 7 Sentani?')) {
      setRecords(initialSppdRecords);
      setActiveRecordId(initialSppdRecords[0].id!);
      showToast('Data contoh SMPN 7 Sentani berhasil dimuat.');
    }
  };

  // Handle Import from Upload Data Modal
  const handleImportData = (importedRecords: SppdData[], mode: 'replace' | 'append') => {
    // Preserve logos if not specified
    const cleaned = importedRecords.map(rec => ({
      ...rec,
      logoPemda: rec.logoPemda || LOGO_PEMDA_JAYAPURA,
      logoSekolah: rec.logoSekolah || LOGO_SEKOLAH_SMPN7,
      pemberiPerintahNama: rec.pemberiPerintahNama || 'Drs. Yohanis Wally, M.Pd.',
      pemberiPerintahNip: rec.pemberiPerintahNip || '19710412 199803 1 004',
      pemberiPerintahJabatan: rec.pemberiPerintahJabatan || 'Kepala Sekolah',
      bendaharaNama: rec.bendaharaNama || 'Ruth Ohee, S.E.',
      bendaharaNip: rec.bendaharaNip || '19820715 200801 2 011'
    }));

    if (mode === 'replace') {
      setRecords(cleaned);
      setActiveRecordId(cleaned[0]?.id || '');
    } else {
      setRecords(prev => [...cleaned, ...prev]);
      setActiveRecordId(cleaned[0]?.id || '');
    }

    showToast(`Berhasil mengimpor ${cleaned.length} data perjalanan!`);
  };

  // Export current list to Excel
  const handleExportAllToExcel = () => {
    const exportData = records.map((r, idx) => ({
      'No': idx + 1,
      'Nomor Surat': r.nomorSurat,
      'Tanggal Surat': r.tanggalSurat,
      'Nama Pegawai': r.pegawaiNama,
      'NIP': r.pegawaiNip,
      'Pangkat/Golongan': r.pegawaiPangkatGolongan,
      'Jabatan': r.pegawaiJabatan,
      'Maksud Perjalanan': r.maksudPerjalanan,
      'Tempat Berangkat': r.tempatBerangkat,
      'Tempat Tujuan': r.tempatTujuan,
      'Lama Hari': r.lamaHari,
      'Tanggal Berangkat': r.tanggalBerangkat,
      'Tanggal Kembali': r.tanggalKembali,
      'Alat Angkut': r.alatAngkut,
      'Beban Anggaran': r.bebanAnggaran,
      'Uang Harian': r.uangHarian,
      'Biaya Transport': r.biayaTransport,
      'Biaya Penginapan': r.biayaPenginapan,
      'Biaya Lainnya': r.biayaLainnya,
      'Total Biaya': (r.uangHarian * r.lamaHari) + r.biayaTransport + (r.biayaPenginapan * (r.lamaHari > 1 ? r.lamaHari - 1 : 0)) + r.biayaLainnya
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar_SPPD');
    XLSX.writeFile(workbook, `Rekap_SPPD_SMPN7_Sentani_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('File Excel Rekap SPPD berhasil diunduh!');
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered records
  const filteredRecords = records.filter(r => {
    const q = searchQuery.toLowerCase();
    return (
      (r.pegawaiNama || '').toLowerCase().includes(q) ||
      (r.nomorSurat || '').toLowerCase().includes(q) ||
      (r.tempatTujuan || '').toLowerCase().includes(q) ||
      (r.pegawaiJabatan || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-slate-900/95 backdrop-blur-xs text-white px-4 py-2.5 rounded-xl shadow-xl z-50 text-xs flex items-center space-x-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-md no-print sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-3">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 p-2 border border-white/20 flex items-center justify-center">
              <FileText className="text-blue-200 w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight">Sistem SPPD Terpadu</h1>
                <span className="bg-blue-700/80 text-blue-200 text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider border border-blue-400/30">
                  Resmi
                </span>
              </div>
              <p className="text-blue-200 text-xs">SMP Negeri 7 Sentani • Dinas Pendidikan Kabupaten Jayapura</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Upload Data Button */}
            <button
              type="button"
              id="btn-upload-data"
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors border border-emerald-500/50"
              title="Upload file Excel (.xlsx), CSV, atau JSON"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Data Excel</span>
            </button>

            {/* Export Excel Button */}
            <button
              type="button"
              id="btn-export-excel"
              onClick={handleExportAllToExcel}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-semibold border border-white/20 flex items-center space-x-1.5 transition-colors"
              title="Unduh rekap semua data ke format Excel"
            >
              <Download className="w-4 h-4 text-blue-200" />
              <span className="hidden sm:inline">Export Rekap</span>
            </button>

            {/* Cetak / PDF Button */}
            <button 
              type="button"
              id="btn-cetak-dokumen"
              onClick={handlePrint}
              className="bg-white text-blue-900 hover:bg-blue-50 px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center space-x-2 transition-all hover:scale-[1.02]"
              title="Cetak atau simpan ke PDF"
            >
              <Printer className="w-4 h-4 text-blue-800" />
              <span>Cetak / PDF</span>
            </button>
          </div>

        </div>
      </header>

      {/* App Workspace */}
      <div className="flex-1 flex overflow-hidden flex-col lg:flex-row">
        
        {/* Left Side: Sidebar + Form Panel */}
        <div className="w-full lg:w-[480px] bg-white border-r border-slate-200 flex flex-col no-print z-10 shadow-xs h-auto lg:h-[calc(100vh-64px)]">
          
          {/* Record Selector / Data List bar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-blue-700" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Daftar Data SPPD ({records.length})
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handleAddNewRecord}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-lg flex items-center space-x-1 transition-colors"
                  title="Tambah data perjalanan baru"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetToSamples}
                  className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Reset ke data contoh SMPN 7 Sentani"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama guru, nomor, atau tujuan..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Compact record picker carousel / horizontal tags */}
            <div className="flex space-x-1.5 overflow-x-auto pt-2.5 pb-1 scrollbar-thin">
              {filteredRecords.map((r, idx) => {
                const isSelected = r.id === currentRecord.id;
                return (
                  <button
                    key={r.id || idx}
                    type="button"
                    onClick={() => setActiveRecordId(r.id!)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
                      isSelected 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <User className="w-3 h-3" />
                    <span className="truncate max-w-[130px]">{r.pegawaiNama || `Pegawai #${idx + 1}`}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields Scroller */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">

            {/* Action Bar for Current Record */}
            <div className="flex items-center justify-between bg-blue-50/50 p-3 rounded-xl border border-blue-100">
              <div>
                <span className="text-[11px] text-blue-700 font-semibold uppercase tracking-wider block">Data Aktif:</span>
                <span className="text-xs font-bold text-slate-900 truncate block max-w-[220px]">
                  {currentRecord.pegawaiNama || 'Belum diisi'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handleDuplicateRecord}
                  className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-200 flex items-center space-x-1"
                  title="Duplikat SPPD ini"
                >
                  <Copy className="w-3 h-3 text-slate-500" />
                  <span>Duplikat</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRecord(currentRecord.id!)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md border border-transparent hover:border-red-200"
                  title="Hapus data ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Section 1: Administrasi Surat & Logo */}
            <section className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-slate-800 flex items-center text-xs uppercase tracking-wide">
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-700" /> 
                  Administrasi Surat & Kop
                </h3>
                <button
                  type="button"
                  onClick={handleResetLogos}
                  className="text-[10px] text-blue-700 hover:underline font-medium"
                >
                  Gunakan Logo Resmi
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Logo Pemda Kab. Jayapura
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-slate-100 rounded border flex items-center justify-center overflow-hidden flex-shrink-0">
                        {currentRecord.logoPemda ? (
                          <img src={currentRecord.logoPemda} alt="Logo Pemda" className="max-h-7 object-contain" />
                        ) : (
                          <span className="text-[8px] text-slate-400">Kosong</span>
                        )}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, 'logoPemda')} 
                        className="w-full text-[10px] file:mr-1 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-blue-50 file:text-blue-700" 
                      />
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Logo SMPN 7 Sentani
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-slate-100 rounded border flex items-center justify-center overflow-hidden flex-shrink-0">
                        {currentRecord.logoSekolah ? (
                          <img src={currentRecord.logoSekolah} alt="Logo Sekolah" className="max-h-7 object-contain" />
                        ) : (
                          <span className="text-[8px] text-slate-400">Kosong</span>
                        )}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, 'logoSekolah')} 
                        className="w-full text-[10px] file:mr-1 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-blue-50 file:text-blue-700" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Nomor Surat Dinas</label>
                  <input 
                    type="text" 
                    name="nomorSurat" 
                    value={currentRecord.nomorSurat} 
                    onChange={handleInputChange} 
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Tanggal Surat</label>
                    <input 
                      type="date" 
                      name="tanggalSurat" 
                      value={currentRecord.tanggalSurat} 
                      onChange={handleInputChange} 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Sumber Anggaran</label>
                    <input 
                      type="text" 
                      name="bebanAnggaran" 
                      value={currentRecord.bebanAnggaran} 
                      onChange={handleInputChange} 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Data Pegawai Yang Ditugaskan */}
            <section className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center text-xs uppercase tracking-wide">
                <User className="w-3.5 h-3.5 mr-1.5 text-blue-700" /> 
                Data Pegawai Yang Diperintahkan
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Nama Lengkap & Gelar</label>
                  <input 
                    type="text" 
                    name="pegawaiNama" 
                    value={currentRecord.pegawaiNama} 
                    onChange={handleInputChange} 
                    placeholder="Contoh: Maikel Wally, S.Pd., Gr." 
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">NIP (Opsional)</label>
                    <input 
                      type="text" 
                      name="pegawaiNip" 
                      value={currentRecord.pegawaiNip} 
                      onChange={handleInputChange} 
                      placeholder="19880521 201504 1 002" 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Pangkat / Golongan</label>
                    <input 
                      type="text" 
                      name="pegawaiPangkatGolongan" 
                      value={currentRecord.pegawaiPangkatGolongan} 
                      onChange={handleInputChange} 
                      placeholder="Penata Muda Tk. I / III.b" 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Jabatan di SMPN 7 Sentani</label>
                  <input 
                    type="text" 
                    name="pegawaiJabatan" 
                    value={currentRecord.pegawaiJabatan} 
                    onChange={handleInputChange} 
                    placeholder="Contoh: Guru Mata Pelajaran IPA / Wali Kelas" 
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>
            </section>

            {/* Section 3: Detail Perjalanan Dinas */}
            <section className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center text-xs uppercase tracking-wide">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-700" /> 
                Detail Perjalanan & Keperluan
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Maksud / Keperluan Tugas</label>
                  <textarea 
                    name="maksudPerjalanan" 
                    value={currentRecord.maksudPerjalanan} 
                    onChange={handleInputChange} 
                    rows={3} 
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Contoh: Menghadiri Rapat Koordinasi Program Sekolah Penggerak..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Tempat Berangkat</label>
                    <input 
                      type="text" 
                      name="tempatBerangkat" 
                      value={currentRecord.tempatBerangkat} 
                      onChange={handleInputChange} 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Tempat Tujuan</label>
                    <input 
                      type="text" 
                      name="tempatTujuan" 
                      value={currentRecord.tempatTujuan} 
                      onChange={handleInputChange} 
                      placeholder="Dinas Pendidikan Jayapura" 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Tgl Berangkat</label>
                    <input 
                      type="date" 
                      name="tanggalBerangkat" 
                      value={currentRecord.tanggalBerangkat} 
                      onChange={handleInputChange} 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Tgl Kembali</label>
                    <input 
                      type="date" 
                      name="tanggalKembali" 
                      value={currentRecord.tanggalKembali} 
                      onChange={handleInputChange} 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Lama (Hari)</label>
                    <input 
                      type="number" 
                      min="1" 
                      name="lamaHari" 
                      value={currentRecord.lamaHari} 
                      onChange={handleInputChange} 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-center" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Alat Angkutan / Transportasi</label>
                  <input 
                    type="text" 
                    name="alatAngkut" 
                    value={currentRecord.alatAngkut} 
                    onChange={handleInputChange} 
                    placeholder="Kendaraan Darat / Mobil Dinas / Roda Dua" 
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs" 
                  />
                </div>
              </div>
            </section>

            {/* Section 4: Rincian Biaya & Kuitansi */}
            <section className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center text-xs uppercase tracking-wide">
                <Calculator className="w-3.5 h-3.5 mr-1.5 text-blue-700" /> 
                Rincian Biaya & Honorarium
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Uang Harian / Hari (Rp)
                    </label>
                    <input 
                      type="number" 
                      name="uangHarian" 
                      value={currentRecord.uangHarian || ''} 
                      onChange={handleInputChange} 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Transportasi PP (Rp)
                    </label>
                    <input 
                      type="number" 
                      name="biayaTransport" 
                      value={currentRecord.biayaTransport || ''} 
                      onChange={handleInputChange} 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Penginapan / Malam (Rp)
                    </label>
                    <input 
                      type="number" 
                      name="biayaPenginapan" 
                      value={currentRecord.biayaPenginapan || ''} 
                      onChange={handleInputChange} 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Biaya Lain-Lain (Rp)
                    </label>
                    <input 
                      type="number" 
                      name="biayaLainnya" 
                      value={currentRecord.biayaLainnya || ''} 
                      onChange={handleInputChange} 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Keterangan Biaya Lainnya
                  </label>
                  <input 
                    type="text" 
                    name="keteranganBiayaLainnya" 
                    value={currentRecord.keteranganBiayaLainnya || ''} 
                    onChange={handleInputChange} 
                    placeholder="Registrasi pelatihan, konsumsi rapat, dll." 
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs" 
                  />
                </div>

                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex justify-between items-center text-xs">
                  <span className="font-semibold text-emerald-900">Perkiraan Total Biaya:</span>
                  <span className="font-bold font-mono text-sm text-emerald-900">
                    {formatCurrency(
                      (currentRecord.uangHarian * currentRecord.lamaHari) +
                      currentRecord.biayaTransport +
                      (currentRecord.biayaPenginapan * (currentRecord.lamaHari > 1 ? currentRecord.lamaHari - 1 : 0)) +
                      currentRecord.biayaLainnya
                    )}
                  </span>
                </div>
              </div>
            </section>

            {/* Section 5: Data Penandatangan (Kepala Sekolah & Bendahara) */}
            <section className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center text-xs uppercase tracking-wide">
                <Building2 className="w-3.5 h-3.5 mr-1.5 text-blue-700" /> 
                Pejabat & Bendahara Penandatangan
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Kepala Sekolah</label>
                  <input 
                    type="text" 
                    name="pemberiPerintahNama" 
                    value={currentRecord.pemberiPerintahNama} 
                    onChange={handleInputChange} 
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs mb-1.5" 
                  />
                  <input 
                    type="text" 
                    name="pemberiPerintahNip" 
                    value={currentRecord.pemberiPerintahNip} 
                    onChange={handleInputChange} 
                    placeholder="NIP Kepala Sekolah" 
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono" 
                  />
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Bendahara Pengeluaran</label>
                  <input 
                    type="text" 
                    name="bendaharaNama" 
                    value={currentRecord.bendaharaNama || ''} 
                    onChange={handleInputChange} 
                    placeholder="Nama Bendahara" 
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs mb-1.5" 
                  />
                  <input 
                    type="text" 
                    name="bendaharaNip" 
                    value={currentRecord.bendaharaNip || ''} 
                    onChange={handleInputChange} 
                    placeholder="NIP Bendahara" 
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono" 
                  />
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Right Side: Document Preview & Tabs */}
        <div className="flex-1 flex flex-col bg-slate-200/70 overflow-hidden">
          
          {/* Navigation Tabs Bar - Hidden on Print */}
          <div className="bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between no-print overflow-x-auto shadow-xs">
            <div className="flex space-x-1 py-1">
              
              <button 
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'ALL' 
                    ? 'border-blue-700 text-blue-800 bg-blue-50/50 rounded-t' 
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Paket Lengkap (Cetak Semua 4 Halaman)</span>
              </button>

              <button 
                type="button"
                onClick={() => setActiveTab('SP')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'SP' 
                    ? 'border-blue-700 text-blue-800 bg-blue-50/50 rounded-t' 
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                1. Surat Tugas (SPT)
              </button>

              <button 
                type="button"
                onClick={() => setActiveTab('SPPD')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'SPPD' 
                    ? 'border-blue-700 text-blue-800 bg-blue-50/50 rounded-t' 
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                2. SPPD Lembar Depan
              </button>

              <button 
                type="button"
                onClick={() => setActiveTab('SPPD_BELAKANG')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'SPPD_BELAKANG' 
                    ? 'border-blue-700 text-blue-800 bg-blue-50/50 rounded-t' 
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                3. SPPD Lembar Belakang
              </button>

              <button 
                type="button"
                onClick={() => setActiveTab('RINCIAN')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'RINCIAN' 
                    ? 'border-blue-700 text-blue-800 bg-blue-50/50 rounded-t' 
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                4. Rincian Biaya & Kuitansi
              </button>

            </div>

            {/* Quick Helper Info */}
            <div className="hidden xl:flex items-center text-slate-400 text-xs pl-4 border-l border-slate-200">
              <Info className="w-3.5 h-3.5 mr-1" />
              <span>Standar A4 Kedinasan Kab. Jayapura</span>
            </div>
          </div>

          {/* Printable Document Preview Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" id="printable-area">
            {activeTab === 'ALL' && <PrintAllDocuments data={currentRecord} />}
            {activeTab === 'SP' && <SuratTugas data={currentRecord} />}
            {activeTab === 'SPPD' && <SuratPerjalananDinas data={currentRecord} />}
            {activeTab === 'SPPD_BELAKANG' && <SuratPerjalananDinasBelakang data={currentRecord} />}
            {activeTab === 'RINCIAN' && <RincianBiaya data={currentRecord} />}
          </div>

        </div>

      </div>

      {/* Upload Data Modal */}
      <DataUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImportData={handleImportData}
        currentRecordsCount={records.length}
      />

    </div>
  );
}
