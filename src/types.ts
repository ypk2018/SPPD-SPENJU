export type DocumentType = 'SP' | 'SPPD' | 'SPPD_BELAKANG' | 'RINCIAN' | 'ALL';

export interface SppdData {
  id?: string;
  nomorSurat: string;
  tanggalSurat: string;
  
  // Pejabat Yang Memerintahkan
  pemberiPerintahNama: string;
  pemberiPerintahNip: string;
  pemberiPerintahJabatan: string;

  // Pegawai yang diperintahkan
  pegawaiNama: string;
  pegawaiNip: string;
  pegawaiPangkatGolongan: string;
  pegawaiJabatan: string;
  
  // Detail Perjalanan
  maksudPerjalanan: string;
  alatAngkut: string;
  tempatBerangkat: string;
  tempatTujuan: string;
  lamaHari: number;
  tanggalBerangkat: string;
  tanggalKembali: string;
  bebanAnggaran: string;
  
  // Rincian Biaya (IDR)
  uangHarian: number;
  biayaTransport: number;
  biayaPenginapan: number;
  biayaLainnya: number;
  keteranganBiayaLainnya?: string;

  // Nama & NIP Bendahara
  bendaharaNama?: string;
  bendaharaNip?: string;
  
  // Logo Kop Surat (Base64 atau URL)
  logoPemda?: string;
  logoSekolah?: string;
}

export interface UploadColumnMapping {
  nomorSurat: string;
  pegawaiNama: string;
  pegawaiNip: string;
  pegawaiPangkatGolongan: string;
  pegawaiJabatan: string;
  maksudPerjalanan: string;
  tempatTujuan: string;
  tanggalBerangkat: string;
  tanggalKembali: string;
  lamaHari: string;
  uangHarian: string;
  biayaTransport: string;
  biayaPenginapan: string;
  biayaLainnya: string;
}
