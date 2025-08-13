# Pintu Desa

## Komponen Baru

- [x] Chart
- [x] Combo Box

## Fitur

- [x] **Pengaturan** = setting (_untuk ubah nama desa, alamat desa, nomor
      telepon desa, email desa, dan logo desa, banner desa_)
- [ ] Pengaturan Visi Misi
- [ ] Pengaturan Profil Desa (_untuk mengubah profil desa, seperti sejarah desa,
      potensi desa, dan lain-lain_)
- [ ] Pengaturan atur alamat dari Google Maps atau OpenStreetMap (_untuk
      mengatur alamat desa, seperti koordinat desa, nama desa, dan lain-lain_)
- [ ] Statistik Penduduk (_untuk menampilkan statistik penduduk desa, seperti
      jumlah penduduk, jumlah laki-laki, jumlah perempuan, dan lain-lain_)
- [ ] Statistik Kartu Keluarga (_untuk menampilkan statistik kartu keluarga
      desa, seperti jumlah kartu keluarga, jumlah kepala keluarga, dan
      lain-lain_)
- [ ] Statistik RT, RW, dan Dusun (_untuk menampilkan statistik RT, RW, dan
      Dusun desa, seperti jumlah RT, jumlah RW, dan jumlah Dusun_)
- [ ] API Alamat Seluruh Indonesia (_untuk mendapatkan data alamat lengkap dari
      provinsi, kabupaten, kecamatan, desa, dan kelurahan_)
- [ ] Role based authentication for admin, penduduk, and aparatur desa
      (_different admin panel view_)
- [ ] TRPC file upload

## Catatan

- Form Keputusan Kepala Desa menggunakan data dari Buku Peraturan Desa, tetapi
  tidak menggunakan kolom Surat Diundangkan dan Tanggal Surat Diundangkan.  
  Form ini terpisah dari Form Buku Peraturan Desa, tetapi form tersebut juga
  bisa digunakan untuk membuat Keputusan Kepala Desa.  
  Jika opsi Keputusan Kepala Desa dipilih di dalam Buku Peraturan Desa, maka
  kolom Surat Diundangkan dan Tanggal Surat Diundangkan tidak akan ditampilkan.
- Data Jenis Pekerjaan ambil di ../schema/pekerjaan tidak perlu menulis manual
  untuk Select Form, Type atau use case lainnya.

## Status Dashboard

**Keterangan**:

- **Tebal** = API sudah tersedia dan siap digunakan
- _Miring_ = Catatan atau data belum tersedia
- - [x] = Fitur sudah selesai dibuat

### Administrasi

- [ ] Disposisi Surat (_tidak ada CRUD_)
- [ ] Pendaftaran Akun (_hanya perlu form untuk verifikasi dan bisa dilihat di
      demo panel, ubah nama menjadi Pendaftaran Pengguna_)
- [ ] Verifikasi Data (_hanya perlu form untuk verifikasi dan bisa dilihat di
      demo panel, ubah nama menjadi Verifikasi Pengguna_)
- [ ] Laporan (_tidak ada CRUD_)
- [ ] Statistik Surat (_tidak ada CRUD_)

### Administrasi > Perubahan Data

- [ ] NIK & KK (_hanya untuk edit dan menggunakan API dari Kependudukan >
      Penduduk tapi dengan form yang berbeda, lihat demo panel lebih lanjut_)
- [ ] Pindah KK (_hanya untuk edit dan menggunakan API dari Kependudukan > Kartu
      Keluarga tapi dengan form yang berbeda, lihat demo panel lebih lanjut_)
- [ ] Pengajuan Perubahan Data (_hanya perlu form untuk verifikasi dari user
      yang mengajukan perubahan data_)

### Administrasi > Buku Administrasi > Administrasi Umum

- [x] **A1 Buku Peraturan Desa** = peraturan
- [x] **A2 Buku Keputusan Kepala Desa** = keputusan
- [x] **A3 Buku Inventaris Desa** = inventaris
- [ ] A4 Buku Aparat Pemerintah Desa = aparat (_butuh data aparat pemerintah
      desa_)
- [x] **A5 Buku Tanah Kas Desa** = tanahKas
- [x] **A6 Buku Tanah Desa** = tanah
- [x] **A7 Buku Agenda Desa** = agenda
- [x] **A8 Buku Ekspedisi** = ekspedisi
- [x] **A9 Buku Lembaran dan Buku Berita Desa** = lembaran

### Administrasi > Buku Administrasi > Administrasi Penduduk Desa

- [ ] B1 Buku Induk Penduduk Desa = penduduk (_butuh data penduduk desa, tidak
      ada CRUD_)
- [ ] B2 Buku Mutasi Penduduk Desa = mutasi (_butuh data penduduk desa_)
- [ ] B3 Buku Rekapitulasi Jumlah Penduduk Desa = rekapitulasi (_butuh data
      penduduk desa, tidak ada CRUD_)
- [x] **B4 Buku Penduduk Sementara** = pendudukSementara
- [ ] B5 Buku KTP dan Kartu Keluarga = ktpKk (_butuh data penduduk desa, tidak
      ada CRUD_)

### Administrasi > Buku Administrasi > Administrasi Keuangan Desa

- [ ] C1 Buku Anggaran Pendapatan dan Belanja Desa = anggaran (_lihat demo panel
      form_)
- [x] **C2 Buku Rencana Anggaran Biaya Desa** = rab
- [ ] C3 Buku Kas Pembantu Kegiatan = kasPembantuKegiatan
- [ ] C4 Buku Kas Umum = kasUmum
- [ ] C5 Buku Kas Pembantu = kasPembantu
- [ ] C6 Buku Bank Desa = bank

### Administrasi > Buku Administrasi > Administrasi Pembangunan

- [x] **D1 Buku Rencana Kerja Pembangunan Desa** = rencanaKerjaPembangunan
- [x] **D2 Buku Kegiatan Pembangunan Desa** = kegiatanPembangunan
- [x] **D3 Buku Inventaris Hasil-hasil Pembangunan Desa** =
      inventarisHasilPembangunan
- [x] **D4 Buku Kader Pemberdayaan Masyarakat Desa** =
      kaderPemberdayaanMasyarakat

### Kependudukan

- [x] **Kartu Keluarga** = kartuKeluarga (_tiap jenis kategori penduduk punya
      form yang berbeda, kepala keluarga wajib memiliki shdk atribut kepala
      keluarga dan anggota keluarga bebas shdk yang lain kecuali kepala
      keluarga, harus ada fitur untuk pecah kartu keluarga juga, lihat demo
      panel_)
- [x] **Penduduk** = penduduk (_tandai penduduk yang tidak memiliki nomor kartu
      keluarga, berikan indikator di tabel_)

### Layanan

- [ ] Kecamanatan = kecamatan (_fitur belum ada di demo panel_)

### Informasi

- [ ] Berita dan Pengumuman = berita (_perlu penambahan column ke table
      database_)
- [ ] Catatan = catatanPenduduk (_ubah menjadi Catatan Penduduk_)
- [ ] Informasi Anggaran = infoAnggaran
- [ ] Informasi PPID = infoPpid

### Informasi > Bantuan Sosial

- [ ] Data Kategori Bantuan Sosial = kategoriBansos
- [ ] Data Bantuan Sosial = bansos, detailBansos (_butuh data kategoriBansos,
      lebih jelas lihat demo panel_)
- [ ] Data Statistik (_tidak ada CRUD_)

### Data Potensi

- [ ] Grafik (_tidak ada CRUD_)
- [ ] Laporan (_tidak ada CRUD_)

### Surat Menyurat

- [x] **Surat Keterangan Kematian** = suratKeteranganKematian (_hanya gunakan 1
      combobox untuk mendapatkan data penduduk, jangan samakan dengan demo
      panel_)
- [x] **Surat Keterangan Kelahiran** = suratKeteranganKelahiran (_populate data
      ibu dan ayah menggunakan pencarian getPenduduksByJenisKelamin dan
      searchPenduduksByJenisKelamin lalu isikan ke form, lihat demo panel_)
- [x] **Surat Kuasa SKGR** = suratKuasaSKGR
- [x] **Surat Pernyataan Belum Menikah** = suratPernyataanBelumMenikah (_saksi 2
      optional, lihat form demo panel_)
- [x] **Surat Pengantar SKCK** = suratPengantarSKCK
- [x] **Surat Izin Keramaian** = suratIzinKeramaian
- [x] **Surat Kuasa Ahli Waris** = suratKuasaAhliWaris
- [x] **Surat Keterangan Domisili** = suratKeteranganDomisili (_harus ada
      keluaraga yang ditambahkan (many to many)_)
- [ ] **Surat Izin Mendirikan Bangunan** = suratIzinMendirikanBangunan
- [ ] **Surat Keterangan Kepemilikan Rumah** = suratKeteranganKepemilikanRumah

## Fix

- [ ] Ubah RAB tanggal pelaksanaan menjadi timestamp
- [ ] make global env
- [x] typecheck error
- [ ] tambah nomor surat untuk semua tipe surat
