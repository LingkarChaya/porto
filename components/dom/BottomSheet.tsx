// components/dom/BottomSheet.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string | null;
}

export default function BottomSheet({ isOpen, onClose, contentId }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. Latar Belakang Gelap Transparan (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 cursor-pointer"
          />

          {/* 2. Lembaran Pop-up dari Bawah */}
          <motion.div
            initial={{ y: '100%' }} // Mulai dari luar layar bawah
            animate={{ y: 0 }}       // Meluncur ke titik 0 (bawah layar)
            exit={{ y: '100%' }}     // Meluncur turun saat ditutup
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            // h-[85vh] berarti tingginya 85% dari layar, menyisakan sedikit ruang di atas
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-[40px] z-50 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Bagian Header Pop-up (Tetap diam di atas) */}
            <div className="flex justify-between items-center px-10 py-8 border-b border-gray-100">
              <div className="text-gray-500 font-medium tracking-wide">
                Home • {contentId === 'air-hockey' ? 'Air Hockey Studio' : contentId}
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-black transition-colors p-2 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Bagian Isi Konten (Bisa digulir/scroll ke bawah) */}
            <div className="flex-1 overflow-y-auto px-10 py-12">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-neutral-900 max-w-3xl leading-tight mb-6">
                Membangun antarmuka kelas dunia.
              </h1>
              <p className="text-xl text-neutral-600 max-w-2xl leading-relaxed mb-10">
                Sama seperti luni.app, ini adalah area yang sepenuhnya dibangun dengan HTML/CSS. Anda bisa memasukkan tipografi yang rapi, gambar tim, atau detail proyek di sini.
              </p>

              {/* Contoh Penempatan Gambar / Konten Tambahan */}
              <div className="w-full h-[400px] bg-gray-100 rounded-3xl mb-8 flex items-center justify-center text-gray-400 font-medium">
                Area Gambar / Video
              </div>
              <div className="w-full h-[300px] bg-gray-50 rounded-3xl flex items-center justify-center text-gray-400 font-medium">
                Konten Tambahan (Scroll ke bawah untuk melihat)
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}