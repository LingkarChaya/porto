'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AboutMeContent from './AboutMeContent'
import ServicesContent from './ServicesContent'
import ContactContent from './ContactContent'
import ProjectContent from './ProjectContent'

interface MenuOverlayProps {
  currentIndex: number
  isAnimating: boolean
}

// =========================================================
// DATABASE KONTEN MENU BERDASARKAN INDEX SCENE
// =========================================================
const MENU_DATA = [
  null, // Index 0: Main Hub (Tidak ada menu/tombol Enter)
  { 
    title: 'Tentang Saya', 
    description: 'Kenali lebih jauh tentang saya, perjalanan, dan keahlian yang saya miliki.' 
  },
  { 
    title: 'Project Saya', 
    description: 'Koleksi proyek pilihan yang menampilkan keahlian saya dalam pengembangan dan desain.' 
  },
  { 
    title: 'Services', 
    description: 'Layanan desain yang saya tawarkan, mulai dari UI/UX, branding, hingga visualisasi 3D.' 
  },
  { 
    title: 'Kontak', 
    description: 'Mari terhubung! Kirimkan saya pesan untuk kolaborasi atau sekadar menyapa.' 
  }
]

export default function MenuOverlay({ currentIndex, isAnimating }: MenuOverlayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const activeMenu = MENU_DATA[currentIndex]

  // UX Pintar: Tutup modal secara otomatis jika pengguna kebetulan 
  // men-scroll ke scene (index) lain saat modal masih terbuka
  useEffect(() => {
    setIsModalOpen(false)
  }, [currentIndex])

  // Mengunci scroll background saat modal terbuka untuk mencegah kebocoran scroll
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [isModalOpen])

  return (
    <>
      {/* ========================================================= */}
      {/* LAYER 1: UI NAVIGASI BAWAH (TEKS & TOMBOL ENTER)         */}
      {/* ========================================================= */}
      <AnimatePresence mode="wait">
        {/* Hanya render jika ada data menu (index 1-4), modal ditutup, dan animasi 3D selesai */}
        {activeMenu && !isModalOpen && !isAnimating && (
          <motion.div
            key="bottom-ui"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute bottom-10 left-0 w-full px-8 md:px-16 flex justify-between items-end z-40 pointer-events-none"
          >
            {/* Teks Judul dan Deskripsi */}
            <div className="max-w-md pointer-events-auto">
              <h2 className="text-4xl md:text-5xl font-black text-[#CBD5E1] mb-2 tracking-tight drop-shadow-sm">
                {activeMenu.title}
              </h2>
              <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed drop-shadow-sm">
                {activeMenu.description}
              </p>
            </div>

            {/* Tombol 'Enter' */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="pointer-events-auto bg-[#0B1120] text-slate-200 px-8 py-4 rounded-full font-bold text-lg tracking-wide flex items-center gap-2 shadow-[5px_5px_12px_#05080f,-5px_-5px_12px_#111a31] hover:shadow-[2px_2px_6px_#05080f,-2px_-2px_6px_#111a31] active:shadow-[inset_2px_2px_5px_#05080f,inset_-2px_-2px_5px_#111a31] transition-all duration-200"
            >
              Enter
              <span className="text-xl leading-none">→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* LAYER 2: MODAL POP-UP (OVERLAY)                          */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isModalOpen && activeMenu && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto p-4 md:p-10">
            
            {/* Latar Belakang Hitam Blur (Backdrop) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
            />

            {/* Kotak Modal Putih Tengah Layar */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(16px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(16px)', transition: { duration: 0.3, ease: 'easeIn' } }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              className="relative w-[96vw] h-[96vh] max-w-none bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2rem] overflow-y-auto flex flex-col"
              onWheel={(e) => e.stopPropagation()}
            >
              {/* Header Minimalis (Breadcrumb & Close Button) */}
              <div className="absolute top-8 right-8 md:top-12 md:right-12 flex items-center gap-4 z-10">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors p-2 text-3xl leading-none"
                >
                  ✕
                </button>
              </div>

              {/* Area Konten Modal (Bisa di-scroll) */}
              <div className="flex-1 overflow-y-auto px-12 md:px-24 pt-20 md:pt-32 pb-12 flex flex-col relative z-0">
                
                {/* Tipografi Judul */}
                <div className="max-w-5xl">
                  <h3 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight mb-6">
                    {activeMenu.title}
                  </h3>
                  <p className="text-xl md:text-2xl text-slate-300 max-w-3xl leading-relaxed">
                    {activeMenu.description}
                  </p>
                </div>

                {/* Area Konten Dinamis */}
                {currentIndex === 1 ? (
                  <AboutMeContent />
                ) : currentIndex === 2 ? (
                  <ProjectContent />
                ) : currentIndex === 3 ? (
                  <ServicesContent />
                ) : currentIndex === 4 ? (
                  <ContactContent />
                ) : (
                  <div className="mt-16 w-full max-w-6xl mx-auto min-h-[50vh] bg-slate-800/50 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-slate-400 font-medium p-10 text-center">
                    <span className="text-4xl mb-4">🚀</span>
                    <p className="text-lg">Area penempatan konten visual / form untuk <strong className="text-white">{activeMenu.title}</strong>.</p>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}