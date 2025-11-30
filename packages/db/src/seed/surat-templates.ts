/* eslint-disable no-console */
/**
 * Seed script for default surat templates
 * Run with: bun run packages/db/src/seed/surat-templates.ts
 */

import { SURAT_TYPE_VALUES, type SuratType } from "../schema"
import { insertSuratTemplate } from "../service"

/**
 * Base template styles for consistent formatting
 */
const baseStyles = `
<style>
  @page {
    size: A4;
    margin: 2cm;
  }
  
  body {
    font-family: 'Times New Roman', serif;
    font-size: 12pt;
    line-height: 1.8;
    color: #000;
  }
  
  .kop-surat {
    text-align: center;
    border-bottom: 3px solid #000;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  
  .kop-surat h1 {
    font-size: 16pt;
    font-weight: bold;
    margin: 5px 0;
    text-transform: uppercase;
  }
  
  .kop-surat h2 {
    font-size: 14pt;
    font-weight: bold;
    margin: 5px 0;
  }
  
  .kop-surat p {
    font-size: 11pt;
    margin: 2px 0;
  }
  
  .nomor-surat {
    text-align: center;
    margin: 20px 0;
  }
  
  .judul-surat {
    text-align: center;
    font-weight: bold;
    font-size: 14pt;
    text-decoration: underline;
    margin: 20px 0;
  }
  
  .content {
    text-align: justify;
    margin: 20px 0;
  }
  
  .data-table {
    margin: 20px 0;
    width: 100%;
  }
  
  .data-table td {
    padding: 5px;
    vertical-align: top;
  }
  
  .data-table td:first-child {
    width: 200px;
  }
  
  .data-table td:nth-child(2) {
    width: 20px;
  }
  
  .ttd-section {
    margin-top: 40px;
    text-align: right;
  }
  
  .ttd-box {
    display: inline-block;
    text-align: center;
    min-width: 200px;
  }
  
  .ttd-space {
    height: 80px;
  }
  
  .ttd-name {
    font-weight: bold;
    text-decoration: underline;
  }
  
  @media print {
    body {
      margin: 0;
      padding: 0;
    }
  }
</style>
`

/**
 * Template definitions for each surat type
 */
const templates: Record<SuratType, { name: string; html: string }> = {
  "surat-keterangan-gaib": {
    name: "Template Default - Surat Keterangan Gaib",
    html: `
${baseStyles}
<div class="kop-surat">
  <h1>PEMERINTAH {{kabupaten}}</h1>
  <h2>KECAMATAN {{kecamatan}}</h2>
  <h2>DESA {{namaDesa}}</h2>
  <p>{{provinsi}}</p>
</div>

<div class="judul-surat">SURAT KETERANGAN GAIB</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini Kepala Desa {{namaDesa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>
  
  <table class="data-table">
    <tr>
      <td>Nama Lengkap</td>
      <td>:</td>
      <td>{{pemohon.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{pemohon.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{pemohon.tempatLahir}}, {{pemohon.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Jenis Kelamin</td>
      <td>:</td>
      <td>{{pemohon.jenisKelamin}}</td>
    </tr>
    <tr>
      <td>Agama</td>
      <td>:</td>
      <td>{{pemohon.agama}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{pemohon.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{pemohon.alamat}}, RT {{pemohon.rt}}/RW {{pemohon.rw}}, Desa {{pemohon.desaKelurahan}}</td>
    </tr>
  </table>
  
  <p>Adalah benar suami/istri yang bernama:</p>
  
  <table class="data-table">
    <tr>
      <td>Nama Lengkap</td>
      <td>:</td>
      <td>{{pasangan.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{pasangan.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{pasangan.tempatLahir}}, {{pasangan.tanggalLahir}}</td>
    </tr>
  </table>
  
  <p>Telah meninggalkan tempat kediaman bersama sejak tanggal {{tanggalDitinggal}} dan sampai saat ini tidak diketahui keberadaannya (GAIB).</p>
  
  <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd-section">
  <div class="ttd-box">
    <p>{{namaDesa}}, {{tanggalSurat}}</p>
    <p>Kepala Desa {{namaDesa}}</p>
    <div class="ttd-space"></div>
    <p class="ttd-name">{{namaKepala}}</p>
    <p>NIP. {{nipKepala}}</p>
  </div>
</div>
`,
  },

  "surat-keterangan-domisili": {
    name: "Template Default - Surat Keterangan Domisili",
    html: `
${baseStyles}
<div class="kop-surat">
  <h1>PEMERINTAH {{kabupaten}}</h1>
  <h2>KECAMATAN {{kecamatan}}</h2>
  <h2>DESA {{namaDesa}}</h2>
  <p>{{provinsi}}</p>
</div>

<div class="judul-surat">SURAT KETERANGAN DOMISILI</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini Kepala Desa {{namaDesa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, dengan ini menerangkan bahwa:</p>
  
  <table class="data-table">
    <tr>
      <td>Nama Lengkap</td>
      <td>:</td>
      <td>{{pemohon.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{pemohon.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{pemohon.tempatLahir}}, {{pemohon.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Jenis Kelamin</td>
      <td>:</td>
      <td>{{pemohon.jenisKelamin}}</td>
    </tr>
    <tr>
      <td>Agama</td>
      <td>:</td>
      <td>{{pemohon.agama}}</td>
    </tr>
    <tr>
      <td>Status Perkawinan</td>
      <td>:</td>
      <td>{{pemohon.statusPerkawinan}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{pemohon.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{pemohon.alamat}}, RT {{pemohon.rt}}/RW {{pemohon.rw}}, Desa {{pemohon.desaKelurahan}}</td>
    </tr>
  </table>
  
  <p>Orang tersebut di atas benar-benar berdomisili di wilayah Desa {{namaDesa}} sejak {{jumlahTahunDomisili}} tahun yang lalu dengan jumlah keluarga {{jumlahKeluarga}} orang.</p>
  
  <p>Demikian surat keterangan domisili ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd-section">
  <div class="ttd-box">
    <p>{{namaDesa}}, {{tanggalSurat}}</p>
    <p>Kepala Desa {{namaDesa}}</p>
    <div class="ttd-space"></div>
    <p class="ttd-name">{{namaKepala}}</p>
    <p>NIP. {{nipKepala}}</p>
  </div>
</div>
`,
  },

  "surat-keterangan-kelahiran": {
    name: "Template Default - Surat Keterangan Kelahiran",
    html: `
${baseStyles}
<div class="kop-surat">
  <h1>PEMERINTAH {{kabupaten}}</h1>
  <h2>KECAMATAN {{kecamatan}}</h2>
  <h2>DESA {{namaDesa}}</h2>
  <p>{{provinsi}}</p>
</div>

<div class="judul-surat">SURAT KETERANGAN KELAHIRAN</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini Kepala Desa {{namaDesa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>
  
  <p><strong>Telah lahir seorang bayi:</strong></p>
  
  <table class="data-table">
    <tr>
      <td>Nama</td>
      <td>:</td>
      <td>{{bayi.namaLengkap}}</td>
    </tr>
    <tr>
      <td>Jenis Kelamin</td>
      <td>:</td>
      <td>{{bayi.jenisKelamin}}</td>
    </tr>
    <tr>
      <td>Tempat Lahir</td>
      <td>:</td>
      <td>{{bayi.tempatLahir}}</td>
    </tr>
    <tr>
      <td>Tanggal Lahir</td>
      <td>:</td>
      <td>{{bayi.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Jenis Kelahiran</td>
      <td>:</td>
      <td>{{jenisKelahiran}}</td>
    </tr>
    <tr>
      <td>Anak Ke</td>
      <td>:</td>
      <td>{{anakKe}}</td>
    </tr>
    <tr>
      <td>Penolong Kelahiran</td>
      <td>:</td>
      <td>{{penolongKelahiran}}</td>
    </tr>
    <tr>
      <td>Berat Bayi</td>
      <td>:</td>
      <td>{{beratBayi}} gram</td>
    </tr>
    <tr>
      <td>Panjang Bayi</td>
      <td>:</td>
      <td>{{panjangBayi}} cm</td>
    </tr>
  </table>
  
  <p><strong>Dari pasangan suami istri:</strong></p>
  
  <p>Ayah:</p>
  <table class="data-table">
    <tr>
      <td>Nama</td>
      <td>:</td>
      <td>{{ayah.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{ayah.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{ayah.tempatLahir}}, {{ayah.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{ayah.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{ayah.alamat}}</td>
    </tr>
  </table>
  
  <p>Ibu:</p>
  <table class="data-table">
    <tr>
      <td>Nama</td>
      <td>:</td>
      <td>{{ibu.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{ibu.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{ibu.tempatLahir}}, {{ibu.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{ibu.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{ibu.alamat}}</td>
    </tr>
  </table>
  
  <p>Demikian surat keterangan ini dibuat dengan sebenarnya berdasarkan keterangan pelapor.</p>
</div>

<div class="ttd-section">
  <div class="ttd-box">
    <p>{{namaDesa}}, {{tanggalSurat}}</p>
    <p>Kepala Desa {{namaDesa}}</p>
    <div class="ttd-space"></div>
    <p class="ttd-name">{{namaKepala}}</p>
    <p>NIP. {{nipKepala}}</p>
  </div>
</div>
`,
  },

  "surat-keterangan-kematian": {
    name: "Template Default - Surat Keterangan Kematian",
    html: `
${baseStyles}
<div class="kop-surat">
  <h1>PEMERINTAH {{kabupaten}}</h1>
  <h2>KECAMATAN {{kecamatan}}</h2>
  <h2>DESA {{namaDesa}}</h2>
  <p>{{provinsi}}</p>
</div>

<div class="judul-surat">SURAT KETERANGAN KEMATIAN</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini Kepala Desa {{namaDesa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>
  
  <table class="data-table">
    <tr>
      <td>Nama Lengkap</td>
      <td>:</td>
      <td>{{yangMeninggal.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{yangMeninggal.nik}}</td>
    </tr>
    <tr>
      <td>Jenis Kelamin</td>
      <td>:</td>
      <td>{{yangMeninggal.jenisKelamin}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{yangMeninggal.tempatLahir}}, {{yangMeninggal.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Agama</td>
      <td>:</td>
      <td>{{yangMeninggal.agama}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{yangMeninggal.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{yangMeninggal.alamat}}, RT {{yangMeninggal.rt}}/RW {{yangMeninggal.rw}}</td>
    </tr>
  </table>
  
  <p><strong>Telah meninggal dunia pada:</strong></p>
  
  <table class="data-table">
    <tr>
      <td>Hari/Tanggal</td>
      <td>:</td>
      <td>{{tanggalMeninggal}}</td>
    </tr>
    <tr>
      <td>Pukul</td>
      <td>:</td>
      <td>{{jamMeninggal}} WIB</td>
    </tr>
    <tr>
      <td>Tempat Meninggal</td>
      <td>:</td>
      <td>{{tempatMeninggal}}</td>
    </tr>
    <tr>
      <td>Penyebab Kematian</td>
      <td>:</td>
      <td>{{penyebabKematian}}</td>
    </tr>
  </table>
  
  <p>Demikian surat keterangan ini dibuat dengan sebenarnya berdasarkan keterangan pelapor untuk dapat dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd-section">
  <div class="ttd-box">
    <p>{{namaDesa}}, {{tanggalSurat}}</p>
    <p>Kepala Desa {{namaDesa}}</p>
    <div class="ttd-space"></div>
    <p class="ttd-name">{{namaKepala}}</p>
    <p>NIP. {{nipKepala}}</p>
  </div>
</div>
`,
  },

  "surat-izin-keramaian": {
    name: "Template Default - Surat Izin Keramaian",
    html: `
${baseStyles}
<div class="kop-surat">
  <h1>PEMERINTAH {{kabupaten}}</h1>
  <h2>KECAMATAN {{kecamatan}}</h2>
  <h2>DESA {{namaDesa}}</h2>
  <p>{{provinsi}}</p>
</div>

<div class="judul-surat">SURAT IZIN KERAMAIAN</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini Kepala Desa {{namaDesa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, memberikan izin kepada:</p>
  
  <table class="data-table">
    <tr>
      <td>Nama Lengkap</td>
      <td>:</td>
      <td>{{pemohon.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{pemohon.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{pemohon.tempatLahir}}, {{pemohon.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{pemohon.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{pemohon.alamat}}, RT {{pemohon.rt}}/RW {{pemohon.rw}}</td>
    </tr>
  </table>
  
  <p>Untuk menyelenggarakan kegiatan/keramaian dengan ketentuan sebagai berikut:</p>
  
  <p>1. Menjaga ketertiban dan keamanan selama kegiatan berlangsung</p>
  <p>2. Tidak mengganggu ketenangan masyarakat sekitar</p>
  <p>3. Bertanggung jawab penuh atas kegiatan yang dilaksanakan</p>
  <p>4. Melaporkan kepada pihak berwajib jika terjadi hal-hal yang tidak diinginkan</p>
  
  <p>Demikian surat izin ini diberikan untuk dapat dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd-section">
  <div class="ttd-box">
    <p>{{namaDesa}}, {{tanggalSurat}}</p>
    <p>Kepala Desa {{namaDesa}}</p>
    <div class="ttd-space"></div>
    <p class="ttd-name">{{namaKepala}}</p>
    <p>NIP. {{nipKepala}}</p>
  </div>
</div>
`,
  },

  "surat-izin-mendirikan-bangunan": {
    name: "Template Default - Surat Izin Mendirikan Bangunan",
    html: `
${baseStyles}
<div class="kop-surat">
  <h1>PEMERINTAH {{kabupaten}}</h1>
  <h2>KECAMATAN {{kecamatan}}</h2>
  <h2>DESA {{namaDesa}}</h2>
  <p>{{provinsi}}</p>
</div>

<div class="judul-surat">SURAT IZIN MENDIRIKAN BANGUNAN</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini Kepala Desa {{namaDesa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, memberikan rekomendasi izin mendirikan bangunan kepada:</p>
  
  <table class="data-table">
    <tr>
      <td>Nama Lengkap</td>
      <td>:</td>
      <td>{{pemohon.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{pemohon.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{pemohon.tempatLahir}}, {{pemohon.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{pemohon.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{pemohon.alamat}}, RT {{pemohon.rt}}/RW {{pemohon.rw}}</td>
    </tr>
  </table>
  
  <p>Untuk mendirikan bangunan di wilayah Desa {{namaDesa}} dengan memenuhi ketentuan dan persyaratan yang berlaku.</p>
  
  <p>Surat rekomendasi ini dibuat untuk melengkapi persyaratan pengurusan Izin Mendirikan Bangunan (IMB) di instansi terkait.</p>
  
  <p>Demikian surat rekomendasi ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd-section">
  <div class="ttd-box">
    <p>{{namaDesa}}, {{tanggalSurat}}</p>
    <p>Kepala Desa {{namaDesa}}</p>
    <div class="ttd-space"></div>
    <p class="ttd-name">{{namaKepala}}</p>
    <p>NIP. {{nipKepala}}</p>
  </div>
</div>
`,
  },

  "surat-keterangan-jalan": {
    name: "Template Default - Surat Keterangan Jalan",
    html: `
${baseStyles}
<div class="kop-surat">
  <h1>PEMERINTAH {{kabupaten}}</h1>
  <h2>KECAMATAN {{kecamatan}}</h2>
  <h2>DESA {{namaDesa}}</h2>
  <p>{{provinsi}}</p>
</div>

<div class="judul-surat">SURAT KETERANGAN JALAN</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini Kepala Desa {{namaDesa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>
  
  <table class="data-table">
    <tr>
      <td>Nama Lengkap</td>
      <td>:</td>
      <td>{{pemohon.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{pemohon.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{pemohon.tempatLahir}}, {{pemohon.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Jenis Kelamin</td>
      <td>:</td>
      <td>{{pemohon.jenisKelamin}}</td>
    </tr>
    <tr>
      <td>Agama</td>
      <td>:</td>
      <td>{{pemohon.agama}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{pemohon.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{pemohon.alamat}}, RT {{pemohon.rt}}/RW {{pemohon.rw}}</td>
    </tr>
  </table>
  
  <p>Adalah benar penduduk Desa {{namaDesa}} dan merupakan orang yang baik serta tidak pernah terlibat dalam tindak kejahatan.</p>
  
  <p>Surat keterangan ini digunakan untuk keperluan perjalanan/bepergian.</p>
  
  <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd-section">
  <div class="ttd-box">
    <p>{{namaDesa}}, {{tanggalSurat}}</p>
    <p>Kepala Desa {{namaDesa}}</p>
    <div class="ttd-space"></div>
    <p class="ttd-name">{{namaKepala}}</p>
    <p>NIP. {{nipKepala}}</p>
  </div>
</div>
`,
  },

  "surat-keterangan-kepemilikan-rumah": {
    name: "Template Default - Surat Keterangan Kepemilikan Rumah",
    html: `
${baseStyles}
<div class="kop-surat">
  <h1>PEMERINTAH {{kabupaten}}</h1>
  <h2>KECAMATAN {{kecamatan}}</h2>
  <h2>DESA {{namaDesa}}</h2>
  <p>{{provinsi}}</p>
</div>

<div class="judul-surat">SURAT KETERANGAN KEPEMILIKAN RUMAH</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini Kepala Desa {{namaDesa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>
  
  <table class="data-table">
    <tr>
      <td>Nama Lengkap</td>
      <td>:</td>
      <td>{{pemohon.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{pemohon.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{pemohon.tempatLahir}}, {{pemohon.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{pemohon.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{pemohon.alamat}}, RT {{pemohon.rt}}/RW {{pemohon.rw}}</td>
    </tr>
  </table>
  
  <p>Adalah benar pemilik rumah/bangunan yang terletak di alamat tersebut di atas, yang berada di wilayah Desa {{namaDesa}}.</p>
  
  <p>Demikian surat keterangan ini dibuat dengan sebenarnya berdasarkan data yang ada untuk dapat dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd-section">
  <div class="ttd-box">
    <p>{{namaDesa}}, {{tanggalSurat}}</p>
    <p>Kepala Desa {{namaDesa}}</p>
    <div class="ttd-space"></div>
    <p class="ttd-name">{{namaKepala}}</p>
    <p>NIP. {{nipKepala}}</p>
  </div>
</div>
`,
  },

  "surat-keterangan-penghasilan": {
    name: "Template Default - Surat Keterangan Penghasilan",
    html: `
${baseStyles}
<div class="kop-surat">
  <h1>PEMERINTAH {{kabupaten}}</h1>
  <h2>KECAMATAN {{kecamatan}}</h2>
  <h2>DESA {{namaDesa}}</h2>
  <p>{{provinsi}}</p>
</div>

<div class="judul-surat">SURAT KETERANGAN PENGHASILAN</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini Kepala Desa {{namaDesa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>
  
  <table class="data-table">
    <tr>
      <td>Nama Lengkap</td>
      <td>:</td>
      <td>{{pemohon.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{pemohon.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{pemohon.tempatLahir}}, {{pemohon.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Jenis Kelamin</td>
      <td>:</td>
      <td>{{pemohon.jenisKelamin}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{pemohon.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{pemohon.alamat}}, RT {{pemohon.rt}}/RW {{pemohon.rw}}</td>
    </tr>
  </table>
  
  <p>Berdasarkan keterangan yang bersangkutan, orang tersebut memiliki penghasilan yang layak untuk memenuhi kebutuhan hidup sehari-hari.</p>
  
  <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd-section">
  <div class="ttd-box">
    <p>{{namaDesa}}, {{tanggalSurat}}</p>
    <p>Kepala Desa {{namaDesa}}</p>
    <div class="ttd-space"></div>
    <p class="ttd-name">{{namaKepala}}</p>
    <p>NIP. {{nipKepala}}</p>
  </div>
</div>
`,
  },

  "surat-keterangan-penghasilan-orang-tua": {
    name: "Template Default - Surat Keterangan Penghasilan Orang Tua",
    html: `
${baseStyles}
<div class="kop-surat">
  <h1>PEMERINTAH {{kabupaten}}</h1>
  <h2>KECAMATAN {{kecamatan}}</h2>
  <h2>DESA {{namaDesa}}</h2>
  <p>{{provinsi}}</p>
</div>

<div class="judul-surat">SURAT KETERANGAN PENGHASILAN ORANG TUA</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini Kepala Desa {{namaDesa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>
  
  <table class="data-table">
    <tr>
      <td>Nama Lengkap</td>
      <td>:</td>
      <td>{{pemohon.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{pemohon.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{pemohon.tempatLahir}}, {{pemohon.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Jenis Kelamin</td>
      <td>:</td>
      <td>{{pemohon.jenisKelamin}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{pemohon.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{pemohon.alamat}}, RT {{pemohon.rt}}/RW {{pemohon.rw}}</td>
    </tr>
  </table>
  
  <p>Adalah benar orang tua/wali dari anak yang bernama sesuai dengan permohonan yang diajukan.</p>
  
  <p>Berdasarkan keterangan yang bersangkutan, orang tua tersebut memiliki penghasilan yang layak untuk membiayai pendidikan anaknya.</p>
  
  <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd-section">
  <div class="ttd-box">
    <p>{{namaDesa}}, {{tanggalSurat}}</p>
    <p>Kepala Desa {{namaDesa}}</p>
    <div class="ttd-space"></div>
    <p class="ttd-name">{{namaKepala}}</p>
    <p>NIP. {{nipKepala}}</p>
  </div>
</div>
`,
  },

  "surat-keterangan-penyaksian-tanah": {
    name: "Template Default - Surat Keterangan Penyaksian Tanah",
    html: `
${baseStyles}
<div class="kop-surat">
  <h1>PEMERINTAH {{kabupaten}}</h1>
  <h2>KECAMATAN {{kecamatan}}</h2>
  <h2>DESA {{namaDesa}}</h2>
  <p>{{provinsi}}</p>
</div>

<div class="judul-surat">SURAT KETERANGAN PENYAKSIAN TANAH</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini Kepala Desa {{namaDesa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>
  
  <table class="data-table">
    <tr>
      <td>Nama Lengkap</td>
      <td>:</td>
      <td>{{pemohon.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{pemohon.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{pemohon.tempatLahir}}, {{pemohon.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{pemohon.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{pemohon.alamat}}, RT {{pemohon.rt}}/RW {{pemohon.rw}}</td>
    </tr>
  </table>
  
  <p>Adalah benar pemilik tanah yang terletak di wilayah Desa {{namaDesa}}. Kepemilikan tanah tersebut telah disaksikan oleh aparat desa dan masyarakat setempat.</p>
  
  <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd-section">
  <div class="ttd-box">
    <p>{{namaDesa}}, {{tanggalSurat}}</p>
    <p>Kepala Desa {{namaDesa}}</p>
    <div class="ttd-space"></div>
    <p class="ttd-name">{{namaKepala}}</p>
    <p>NIP. {{nipKepala}}</p>
  </div>
</div>
`,
  },

  "surat-kuasa-ahli-waris": {
    name: "Template Default - Surat Kuasa Ahli Waris",
    html: `
${baseStyles}
<div class="kop-surat">
  <h1>PEMERINTAH {{kabupaten}}</h1>
  <h2>KECAMATAN {{kecamatan}}</h2>
  <h2>DESA {{namaDesa}}</h2>
  <p>{{provinsi}}</p>
</div>

<div class="judul-surat">SURAT KUASA AHLI WARIS</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini Kepala Desa {{namaDesa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>
  
  <table class="data-table">
    <tr>
      <td>Nama Lengkap</td>
      <td>:</td>
      <td>{{pemohon.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{pemohon.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{pemohon.tempatLahir}}, {{pemohon.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{pemohon.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{pemohon.alamat}}, RT {{pemohon.rt}}/RW {{pemohon.rw}}</td>
    </tr>
  </table>
  
  <p>Adalah benar ahli waris yang sah dari almarhum/almarhumah sesuai dengan dokumen dan data yang ada.</p>
  
  <p>Surat keterangan ini dibuat untuk melengkapi persyaratan pengurusan ahli waris di instansi terkait.</p>
  
  <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd-section">
  <div class="ttd-box">
    <p>{{namaDesa}}, {{tanggalSurat}}</p>
    <p>Kepala Desa {{namaDesa}}</p>
    <div class="ttd-space"></div>
    <p class="ttd-name">{{namaKepala}}</p>
    <p>NIP. {{nipKepala}}</p>
  </div>
</div>
`,
  },

  "surat-kuasa-skgr": {
    name: "Template Default - Surat Kuasa SKGR",
    html: `
${baseStyles}
<div class="kop-surat">
  <h1>PEMERINTAH {{kabupaten}}</h1>
  <h2>KECAMATAN {{kecamatan}}</h2>
  <h2>DESA {{namaDesa}}</h2>
  <p>{{provinsi}}</p>
</div>

<div class="judul-surat">SURAT KUASA SKGR</div>
<div class="judul-surat" style="font-size: 12pt;">(Surat Keterangan Ganti Rugi)</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini Kepala Desa {{namaDesa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>
  
  <table class="data-table">
    <tr>
      <td>Nama Lengkap</td>
      <td>:</td>
      <td>{{pemohon.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{pemohon.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{pemohon.tempatLahir}}, {{pemohon.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{pemohon.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{pemohon.alamat}}, RT {{pemohon.rt}}/RW {{pemohon.rw}}</td>
    </tr>
  </table>
  
  <p>Memberikan kuasa penuh untuk mengurus dan menandatangani segala sesuatu yang berkaitan dengan Surat Keterangan Ganti Rugi (SKGR).</p>
  
  <p>Demikian surat kuasa ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd-section">
  <div class="ttd-box">
    <p>{{namaDesa}}, {{tanggalSurat}}</p>
    <p>Kepala Desa {{namaDesa}}</p>
    <div class="ttd-space"></div>
    <p class="ttd-name">{{namaKepala}}</p>
    <p>NIP. {{nipKepala}}</p>
  </div>
</div>
`,
  },

  "surat-pengantar-skck": {
    name: "Template Default - Surat Pengantar SKCK",
    html: `
${baseStyles}
<div class="kop-surat">
  <h1>PEMERINTAH {{kabupaten}}</h1>
  <h2>KECAMATAN {{kecamatan}}</h2>
  <h2>DESA {{namaDesa}}</h2>
  <p>{{provinsi}}</p>
</div>

<div class="judul-surat">SURAT PENGANTAR SKCK</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini Kepala Desa {{namaDesa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>
  
  <table class="data-table">
    <tr>
      <td>Nama Lengkap</td>
      <td>:</td>
      <td>{{pemohon.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{pemohon.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{pemohon.tempatLahir}}, {{pemohon.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Jenis Kelamin</td>
      <td>:</td>
      <td>{{pemohon.jenisKelamin}}</td>
    </tr>
    <tr>
      <td>Agama</td>
      <td>:</td>
      <td>{{pemohon.agama}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{pemohon.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{pemohon.alamat}}, RT {{pemohon.rt}}/RW {{pemohon.rw}}</td>
    </tr>
  </table>
  
  <p>Adalah benar penduduk Desa {{namaDesa}} dan merupakan orang yang berkelakuan baik serta tidak pernah terlibat dalam tindak kriminal/kejahatan.</p>
  
  <p>Surat pengantar ini dibuat untuk keperluan pengurusan Surat Keterangan Catatan Kepolisian (SKCK) di Kepolisian setempat.</p>
  
  <p>Demikian surat pengantar ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd-section">
  <div class="ttd-box">
    <p>{{namaDesa}}, {{tanggalSurat}}</p>
    <p>Kepala Desa {{namaDesa}}</p>
    <div class="ttd-space"></div>
    <p class="ttd-name">{{namaKepala}}</p>
    <p>NIP. {{nipKepala}}</p>
  </div>
</div>
`,
  },

  "surat-pernyataan-belum-menikah": {
    name: "Template Default - Surat Pernyataan Belum Menikah",
    html: `
${baseStyles}
<div class="kop-surat">
  <h1>PEMERINTAH {{kabupaten}}</h1>
  <h2>KECAMATAN {{kecamatan}}</h2>
  <h2>DESA {{namaDesa}}</h2>
  <p>{{provinsi}}</p>
</div>

<div class="judul-surat">SURAT KETERANGAN BELUM MENIKAH</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini Kepala Desa {{namaDesa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>
  
  <table class="data-table">
    <tr>
      <td>Nama Lengkap</td>
      <td>:</td>
      <td>{{pemohon.namaLengkap}}</td>
    </tr>
    <tr>
      <td>NIK</td>
      <td>:</td>
      <td>{{pemohon.nik}}</td>
    </tr>
    <tr>
      <td>Tempat, Tanggal Lahir</td>
      <td>:</td>
      <td>{{pemohon.tempatLahir}}, {{pemohon.tanggalLahir}}</td>
    </tr>
    <tr>
      <td>Jenis Kelamin</td>
      <td>:</td>
      <td>{{pemohon.jenisKelamin}}</td>
    </tr>
    <tr>
      <td>Agama</td>
      <td>:</td>
      <td>{{pemohon.agama}}</td>
    </tr>
    <tr>
      <td>Pekerjaan</td>
      <td>:</td>
      <td>{{pemohon.pekerjaan}}</td>
    </tr>
    <tr>
      <td>Alamat</td>
      <td>:</td>
      <td>{{pemohon.alamat}}, RT {{pemohon.rt}}/RW {{pemohon.rw}}</td>
    </tr>
  </table>
  
  <p>Berdasarkan data kependudukan yang ada, orang tersebut di atas sampai dengan surat ini dibuat berstatus BELUM MENIKAH.</p>
  
  <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd-section">
  <div class="ttd-box">
    <p>{{namaDesa}}, {{tanggalSurat}}</p>
    <p>Kepala Desa {{namaDesa}}</p>
    <div class="ttd-space"></div>
    <p class="ttd-name">{{namaKepala}}</p>
    <p>NIP. {{nipKepala}}</p>
  </div>
</div>
`,
  },
}

/**
 * Main seed function
 */
async function seedTemplates() {
  console.log("🌱 Starting surat template seeding...")

  let successCount = 0
  let errorCount = 0

  for (const suratType of SURAT_TYPE_VALUES) {
    const template = templates[suratType]

    if (template === undefined) {
      console.warn(`⚠️  No template defined for ${suratType}, skipping...`)
      continue
    }

    try {
      await insertSuratTemplate({
        suratType,
        name: template.name,
        htmlContent: template.html,
        isDefault: true,
      })

      console.log(`✅ Created template: ${template.name}`)
      successCount++
    } catch (error) {
      console.error(`❌ Failed to create template for ${suratType}:`, error)
      errorCount++
    }
  }

  console.log("\n📊 Seeding Summary:")
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log(`   📝 Total: ${SURAT_TYPE_VALUES.length}`)

  // Close database connection
  process.exit(0)
}

// Run the seed function
seedTemplates().catch((error) => {
  console.error("💥 Seeding failed:", error)
  process.exit(1)
})
