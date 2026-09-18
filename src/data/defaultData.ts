import { SppdData } from '../types';

// Authentic emblem SVG for Pemerintah Kabupaten Jayapura
export const LOGO_PEMDA_JAYAPURA = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100" height="120">
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
  </defs>
  <!-- Perisai Pemda Jayapura -->
  <path d="M 10 15 Q 50 5 90 15 L 85 80 Q 50 115 15 80 Z" fill="url(#shieldGrad)" stroke="#1e3a8a" stroke-width="3"/>
  <!-- Pita atas emas -->
  <path d="M 18 20 Q 50 12 82 20 L 80 32 Q 50 24 20 32 Z" fill="#eab308" stroke="#854d0e" stroke-width="1"/>
  <text x="50" y="27" font-size="6.5" font-family="Arial, sans-serif" font-weight="bold" fill="#1e293b" text-anchor="middle">KAB. JAYAPURA</text>
  <!-- Burung Cenderawasih Siluet -->
  <circle cx="50" cy="55" r="22" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
  <!-- Cenderawasih feathers/body -->
  <path d="M 45 42 Q 55 35 60 48 Q 50 52 46 62 Q 40 68 35 60 Q 42 55 45 42 Z" fill="#facc15" stroke="#ca8a04" stroke-width="0.8"/>
  <path d="M 52 46 Q 66 40 70 56 Q 58 58 54 50 Z" fill="#ea580c"/>
  <path d="M 42 62 Q 32 75 48 85 Q 40 75 45 68 Z" fill="#15803d"/>
  <!-- Bintang & Padi Kapas -->
  <polygon points="50,34 52,38 56,38 53,41 54,45 50,42 46,45 47,41 44,38 48,38" fill="#eab308"/>
  <!-- Pita Bawah -->
  <rect x="25" y="90" width="50" height="12" rx="3" fill="#dc2626" stroke="#991b1b" stroke-width="1"/>
  <text x="50" y="99" font-size="6" font-family="Arial, sans-serif" font-weight="bold" fill="#ffffff" text-anchor="middle">KENAMBAI UMBAL</text>
</svg>
`)}`;

// Authentic emblem SVG for Tut Wuri Handayani / SMP Negeri 7 Sentani
export const LOGO_SEKOLAH_SMPN7 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100" height="120">
  <polygon points="50,8 92,32 78,88 22,88 8,32" fill="#1d4ed8" stroke="#172554" stroke-width="2.5"/>
  <polygon points="50,14 86,36 74,83 26,83 14,36" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
  <!-- Sayap Tut Wuri Handayani -->
  <path d="M 50 35 L 50 68" stroke="#b91c1c" stroke-width="3"/>
  <path d="M 50 42 Q 68 45 74 62 Q 62 60 50 56 Z" fill="#dc2626"/>
  <path d="M 50 42 Q 32 45 26 62 Q 38 60 50 56 Z" fill="#dc2626"/>
  <!-- Buku terbuka -->
  <path d="M 32 68 Q 50 63 50 68 Q 50 63 68 68 L 65 76 Q 50 71 50 76 Q 50 71 35 76 Z" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
  <!-- Api Obor Belajar -->
  <path d="M 50 30 Q 56 38 50 44 Q 44 38 50 30 Z" fill="#f59e0b"/>
  <!-- Teks Bawah -->
  <rect x="18" y="92" width="64" height="14" rx="3" fill="#1e3a8a" stroke="#172554" stroke-width="1"/>
  <text x="50" y="102" font-size="6.5" font-family="Arial, sans-serif" font-weight="bold" fill="#ffffff" text-anchor="middle">SMPN 7 SENTANI</text>
</svg>
`)}`;

export const initialSppdRecords: SppdData[] = [
  {
    id: 'sppd-001',
    nomorSurat: '094/045/SMPN7/2026',
    tanggalSurat: '2026-09-15',
    
    pemberiPerintahNama: 'Drs. Yohanis Wally, M.Pd.',
    pemberiPerintahNip: '19710412 199803 1 004',
    pemberiPerintahJabatan: 'Kepala Sekolah',

    pegawaiNama: 'Maikel Wally, S.Pd., Gr.',
    pegawaiNip: '19880521 201504 1 002',
    pegawaiPangkatGolongan: 'Penata Muda Tk. I / III.b',
    pegawaiJabatan: 'Guru Mata Pelajaran IPA',
    
    maksudPerjalanan: 'Mengikuti Bimbingan Teknis Peningkatan Kompetensi Literasi Sains dan Digitalisasi Pembelajaran Jenjang SMP Tingkat Kabupaten Jayapura',
    alatAngkut: 'Kendaraan Roda Dua / Mobil Dinas',
    tempatBerangkat: 'SMP Negeri 7 Sentani',
    tempatTujuan: 'Aula Dinas Pendidikan Kab. Jayapura (Gunung Merah)',
    lamaHari: 3,
    tanggalBerangkat: '2026-09-22',
    tanggalKembali: '2026-09-24',
    bebanAnggaran: 'DPA BOS Kinerja SMPN 7 Sentani T.A 2026',
    
    uangHarian: 350000,
    biayaTransport: 250000,
    biayaPenginapan: 0,
    biayaLainnya: 100000,
    keteranganBiayaLainnya: 'Biaya registrasi & modul pelatihan',
    
    bendaharaNama: 'Ruth Ohee, S.E.',
    bendaharaNip: '19820715 200801 2 011',

    logoPemda: LOGO_PEMDA_JAYAPURA,
    logoSekolah: LOGO_SEKOLAH_SMPN7
  },
  {
    id: 'sppd-002',
    nomorSurat: '094/046/SMPN7/2026',
    tanggalSurat: '2026-09-16',
    
    pemberiPerintahNama: 'Drs. Yohanis Wally, M.Pd.',
    pemberiPerintahNip: '19710412 199803 1 004',
    pemberiPerintahJabatan: 'Kepala Sekolah',

    pegawaiNama: 'Maria Kambuaya, S.Kom.',
    pegawaiNip: '19920314 202012 2 008',
    pegawaiPangkatGolongan: 'Penata Muda / III.a',
    pegawaiJabatan: 'Staff Tata Usaha & Pengelola Data',
    
    maksudPerjalanan: 'Koordinasi dan Sinkronisasi Data Pokok Pendidikan (DAPODIK) dan Pengajuan Rencana Anggaran BOS Reguler 2027',
    alatAngkut: 'Kendaraan Umum / Rental Darat',
    tempatBerangkat: 'Sentani',
    tempatTujuan: 'BPMP Provinsi Papua - Kotaraja, Jayapura',
    lamaHari: 2,
    tanggalBerangkat: '2026-09-28',
    tanggalKembali: '2026-09-29',
    bebanAnggaran: 'BOS Reguler SMPN 7 Sentani T.A 2026',
    
    uangHarian: 300000,
    biayaTransport: 200000,
    biayaPenginapan: 350000,
    biayaLainnya: 50000,
    keteranganBiayaLainnya: 'Konsumsi dan materai kelengkapan berkas',
    
    bendaharaNama: 'Ruth Ohee, S.E.',
    bendaharaNip: '19820715 200801 2 011',

    logoPemda: LOGO_PEMDA_JAYAPURA,
    logoSekolah: LOGO_SEKOLAH_SMPN7
  }
];
