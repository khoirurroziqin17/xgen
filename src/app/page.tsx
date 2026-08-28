"use client";

import React from "react";
import Link from "next/link";
import {
  Dna,
  PlayCircle,
  Calculator,
  BookOpen,
  Sparkles,
  Layers,
  Smartphone,
  BarChart3,
  CheckCircle2,
  Lock,
  ArrowRight,
  GraduationCap,
  SlidersHorizontal,
  Flame,
  Award,
  BookCheck,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white py-16 md:py-24 px-4 sm:px-6 shadow-md">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-500/40 px-4 py-1.5 rounded-full text-emerald-200 text-xs md:text-sm font-medium backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span>Platform Edukasi Genetika Interaktif SMP/MTs</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            Simulasi Visual & Interaktif <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-amber-200">
              Hukum Mendel I & II
            </span>
          </h1>

          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Pahami konsep persilangan monohibrid dan dihibrid dengan mudah
            melalui fitur{" "}
            <strong className="text-emerald-200 font-semibold">
              Virtual Punnett Square
            </strong>
            , simulasi *drag & drop* kepingan alel, serta kalkulasi rasio
            fenotipe dan genotipe secara otomatis.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/simulasi"
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 text-base"
            >
              <PlayCircle className="w-5 h-5 fill-slate-950 text-amber-400" />
              <span>Mulai Simulasi Sekarang</span>
            </Link>
            <Link
              href="#fitur-utama"
              className="w-full sm:w-auto bg-emerald-800/60 hover:bg-emerald-800 text-emerald-100 border border-emerald-500/50 font-semibold px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-base"
            >
              <span>Pelajari Fitur</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-emerald-600/40 text-slate-200 text-xs md:text-sm">
            <div className="p-2">
              <span className="block text-2xl font-bold text-white font-mono">
                100%
              </span>
              <span>Visual & Praktis</span>
            </div>
            <div className="p-2">
              <span className="block text-2xl font-bold text-white font-mono">
                2-in-1
              </span>
              <span>Monohibrid & Dihibrid</span>
            </div>
            <div className="p-2">
              <span className="block text-2xl font-bold text-white font-mono">
                Mobile
              </span>
              <span>Optimasi Layar HP</span>
            </div>
            <div className="p-2">
              <span className="block text-2xl font-bold text-white font-mono">
                Instant
              </span>
              <span>Tanpa Login / Bebas</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PENJELASAN TENTANG PLATFORM */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" /> Solusi Belajar Genetika
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              Mengubah Konsep Abstrak Menjadi Pengalaman Belajar yang Nyata
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Materi persilangan genetika sering dianggap rumit karena siswa
              kesulitan membayangkan pemisahan alel saat pembentukan gamet dan
              penggabungannya pada keturunan.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Melalui platform ini, siswa dapat **memasukkan sendiri nama
              sifat** (fenotipe), mengamati simbol alel yang terbentuk secara
              otomatis, serta menyusun tabel persilangan langkah demi langkah
              secara mandiri.
            </p>

            <ul className="space-y-2 pt-2 text-sm text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Simulasi berbasis aturan logika biologis Hukum Mendel
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Navigasi ramah pengguna di Laptop, Tablet, maupun HP
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Umpan balik langsung (*real-time feedback*) tanpa bocoran
                  jawaban
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-tr from-emerald-100 to-teal-50 p-6 md:p-8 rounded-3xl border border-emerald-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md">
                <Dna className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Mengapa Memilih Web Ini?
                </h3>
                <p className="text-xs text-slate-500">
                  Dirancang khusus sesuai Kurikulum Merdeka IPA Fase D
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs md:text-sm">
              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                <strong className="block text-emerald-900 font-bold mb-0.5">
                  Penamaan Alel Dinamis
                </strong>
                Simbol alel diambil otomatis dari huruf pertama sifat dominan
                yang dimasukkan siswa.
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                <strong className="block text-emerald-900 font-bold mb-0.5">
                  Logika Gamet Presisi
                </strong>
                Menyesuaikan otomatis jumlah gamet homozigot (1 gamet) dan
                heterozigot (2/4 gamet).
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                <strong className="block text-emerald-900 font-bold mb-0.5">
                  Penulisan Standar Baku
                </strong>
                Penggabungan alel dihibrid disusun otomatis rapi sesuai aturan
                genetika (misal: `UuBb`).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FITUR UTAMA WEB (CURRENT FEATURES) */}
      <section id="fitur-utama" className="bg-slate-100/80 py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Fitur Utama Platform
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Seluruh fitur telah dirancang dan diuji untuk memberikan
              pengalaman belajar interaktif yang lancar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                1. Generasi Alel Dinamis
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Siswa dapat memilih persilangan Monohibrid (1 sifat) atau
                Dihibrid (2 sifat) dan memasukkan fenotipe dominan-resesif.
                Sistem otomatis menghasilkan kepingan alel parental, gamet, dan
                filial.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <span>Dukungan Huruf Otomatis</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                2. Interaktif Drag & Drop
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Menyediakan area *drop zone* bertahap (P1 &rarr; Gamet &rarr;
                F1) yang dapat ditarik (*drag*) atau diketuk (*tap*). Di layar
                HP, kepingan alel tampil bergaya *Floating Sheet* 3 Tab ala
                Canva.
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-700 flex items-center gap-1">
                <span>Anti-Scroll Lock di HP</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                3. Analisis Rasio Otomatis
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Setelah papan catur persilangan terisi lengkap, sistem
                menampilkan kartu hasil perbandingan rasio genotipe dan fenotipe
                lengkap dengan persentase dan nama sifat dalam tampilan bersih.
              </p>
              <div className="pt-2 text-xs font-semibold text-purple-700 flex items-center gap-1">
                <span>Laporan Hasil Praktis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FITUR AKAN DATANG (UPCOMING FEATURES) */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-600" /> Rencana Pengembangan
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Fitur Mendatang (*Incoming Features*)
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Guna memperkaya pengalaman belajar, berikut adalah fitur-fitur baru
            yang sedang dalam tahap perencanaan pengembangan lanjutan:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 p-1.5 rounded-lg">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                <BookCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  Modul Materi & Rangkuman Terintegrasi
                </h3>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Tahap Perancangan
                </span>
              </div>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-1">
              Penyediaan halaman ringkasan materi teori Hukum Mendel I
              (Segregasi) dan Hukum Mendel II (Asortasi Bebas) yang disertai
              dengan ilustrasi biologis sebelum siswa mencoba simulasi.
            </p>
          </div>

          {/* Upcoming 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 p-1.5 rounded-lg">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  Kuis Latihan & Mode Evaluasi Otomatis
                </h3>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Tahap Perancangan
                </span>
              </div>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-1">
              Fitur latihan soal interaktif untuk menguji pemahaman siswa
              tentang penentuan rasio persilangan dengan penilaian skor otomatis
              langsung setelah kuis selesai.
            </p>
          </div>

          {/* Upcoming 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 p-1.5 rounded-lg">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  Simulasi Kasus Dominansi Tidak Penuh (Intermediet)
                </h3>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Tahap Ideasi
                </span>
              </div>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-1">
              Pengembangan mode variasi persilangan di mana fenotipe heterozigot
              menghasilkan sifat gabungan/antara (misal: Bunga Merah $\times$
              Putih $\rightarrow$ Bunga Merah Muda).
            </p>
          </div>

          {/* Upcoming 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 p-1.5 rounded-lg">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  Kalkulator Genetika Cepat (Quick Solver)
                </h3>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Tahap Ideasi
                </span>
              </div>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-1">
              Kalkulator instan untuk guru atau siswa yang ingin langsung
              mendapatkan hasil tabel Punnett beserta rasionya tanpa melalui
              mode latihan drag & drop.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION (CTA) */}
      <section className="max-w-5xl mx-auto px-4 pt-6">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-8 md:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              Siap Mencoba Simulasi?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base">
              Mulai eksperimen persilangan genetika pertama Anda sekarang juga
              tanpa perlu mendaftar atau mengunduh aplikasi tambahan.
            </p>
          </div>

          <div className="pt-2 relative z-10 flex justify-center">
            <Link
              href="/simulasi"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg transition transform active:scale-95 flex items-center gap-2 text-base"
            >
              <PlayCircle className="w-5 h-5 fill-slate-950 text-amber-400" />
              <span>Buka Halaman Simulasi</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
