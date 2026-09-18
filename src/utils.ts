/**
 * Format tanggal ke format bahasa Indonesia (e.g. 18 September 2026)
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return '..........................';
  
  try {
    // Handle YYYY-MM-DD or other formats
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format angka ke format mata uang Rupiah
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rp 0';
  }
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Konversi angka ke kalimat terbilang bahasa Indonesia
 */
export function terbilang(n: number): string {
  if (isNaN(n) || n === 0) return 'Nol rupiah';
  
  const satuan = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan',
    'Sepuluh', 'Sebelas'
  ];
  
  let num = Math.floor(Math.abs(n));
  let hasil = '';

  function convert(x: number): string {
    if (x < 12) {
      return satuan[x];
    } else if (x < 20) {
      return convert(x - 10) + ' Belas';
    } else if (x < 100) {
      const sisa = x % 10;
      return convert(Math.floor(x / 10)) + ' Puluh' + (sisa ? ' ' + convert(sisa) : '');
    } else if (x < 200) {
      return 'Seratus' + (x - 100 ? ' ' + convert(x - 100) : '');
    } else if (x < 1000) {
      const sisa = x % 100;
      return convert(Math.floor(x / 100)) + ' Ratus' + (sisa ? ' ' + convert(sisa) : '');
    } else if (x < 2000) {
      return 'Seribu' + (x - 1000 ? ' ' + convert(x - 1000) : '');
    } else if (x < 1000000) {
      const sisa = x % 1000;
      return convert(Math.floor(x / 1000)) + ' Ribu' + (sisa ? ' ' + convert(sisa) : '');
    } else if (x < 1000000000) {
      const sisa = x % 1000000;
      return convert(Math.floor(x / 1000000)) + ' Juta' + (sisa ? ' ' + convert(sisa) : '');
    } else if (x < 1000000000000) {
      const sisa = x % 1000000000;
      return convert(Math.floor(x / 1000000000)) + ' Milyar' + (sisa ? ' ' + convert(sisa) : '');
    } else {
      const sisa = x % 1000000000000;
      return convert(Math.floor(x / 1000000000000)) + ' Triliun' + (sisa ? ' ' + convert(sisa) : '');
    }
  }

  hasil = convert(num).trim() + ' Rupiah';
  return hasil;
}
