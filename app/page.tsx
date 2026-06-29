'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { Observer } from 'gsap/Observer'
import MenuOverlay from '@/components/dom/MenuOverlay'

// Daftarkan plugin Observer
gsap.registerPlugin(Observer)

// PERBAIKAN: Muat komponen 3D secara dinamis untuk mempercepat HMR dan load awal
const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
})

// Total panggung 3D (Utama + Tim Kami + Galeri)
const TOTAL_SECTIONS = 5; 

// =========================================================
// KOMPONEN TOOLTIP GLOBAL (MENGKUTI KURSOR)
// =========================================================
function CursorTooltip() {
  const [tooltip, setTooltip] = useState<string | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    const handleSetTooltip = (e: Event) => setTooltip((e as CustomEvent).detail)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('setTooltip', handleSetTooltip)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('setTooltip', handleSetTooltip)
    }
  }, [])

  if (!tooltip) return null

  return (
    <div 
      className="fixed z-[100] bg-cyan-400 text-slate-900 font-bold px-6 py-2 rounded-full shadow-lg pointer-events-none whitespace-nowrap"
      style={{ left: pos.x + 15, top: pos.y + 15 }} // +15 agar tooltip tidak tertutup kursor
    >
      {tooltip}
    </div>
  )
}

export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimatingUI, setIsAnimatingUI] = useState(false)
  
  // PERBAIKAN 1: Tambahkan Ref khusus untuk ingatan si Observer
  const indexRef = useRef(0) 
  const isAnimating = useRef(false)

  useGSAP(() => {
    const obs = Observer.create({
      target: window, 
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      tolerance: 10,       
      preventDefault: true, 
      
      // JIKA SCROLL KE BAWAH (Maju)
      onUp: () => {
        if (!isAnimating.current) {
          if (indexRef.current < TOTAL_SECTIONS - 1) {
            // Lanjut ke grup berikutnya secara normal
            goToSection(indexRef.current + 1);
          } else {
            // LOOPING: Jika sudah mentok di grup terakhir (Tentang Kami), kembali ke 0 (Utama)
            goToSection(0);
          }
        }
      },
      
      // JIKA SCROLL KE ATAS (Mundur)
      onDown: () => {
        if (!isAnimating.current) {
          if (indexRef.current > 0) {
            // Mundur ke grup sebelumnya secara normal
            goToSection(indexRef.current - 1);
          } else {
            // LOOPING MUNDUR: Jika di grup Utama di-scroll ke atas, langsung lompat ke Tentang Kami
            goToSection(TOTAL_SECTIONS - 1);
          }
        }
      }
    })

    return () => obs.kill()
  }, []) // PERBAIKAN 4: Dependency Array dikosongkan agar Observer tidak berlipat ganda

  // =========================================================
  // EVENT LISTENER: NAVIGASI OTOMATIS SAAT PULAU DIKLIK
  // =========================================================
  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const targetIndex = (e as CustomEvent).detail;
      if (!isAnimating.current && indexRef.current !== targetIndex) {
        goToSection(targetIndex);
      }
    };
    window.addEventListener('navigateToScene', handleNavigate);
    return () => window.removeEventListener('navigateToScene', handleNavigate);
  }, []);

  const goToSection = (index: number) => {
    isAnimating.current = true; 
    setIsAnimatingUI(true); // Sembunyikan UI 2D saat animasi 3D mulai
    
    setCurrentIndex(index);     // Update untuk komponen 3D (React State)
    indexRef.current = index;   // Update ingatan realtime (Ref)

    setTimeout(() => {
      isAnimating.current = false;
      setIsAnimatingUI(false); // Tampilkan UI 2D setelah animasi 3D selesai (2.5 detik)
    }, 2500);
  }

  return (
    <main className="relative w-screen h-screen bg-gradient-to-b from-[#1E3A8A] to-[#0B1120] overflow-hidden">

      {/* TOOLTIP KURSOR GLOBAL */}
      <CursorTooltip />

      {/* 2. LAYER HEADER UI */}
      <header className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-50 pointer-events-none">
        <div 
          className="text-2xl font-black tracking-tighter pointer-events-auto text-[#1e1e24] cursor-pointer" 
          onClick={() => !isAnimating.current && goToSection(0)} 
        >
         {/* <Image 
            // src="/mudapedia-logo.png"     // Sesuaikan dengan nama file Anda di folder public
            // alt="Luni Logo" 
            // width={100}         // Sesuaikan lebar logo (dalam pixel)
            // height={40}         // Sesuaikan tinggi logo (dalam pixel)
            // className="object-contain" // Memastikan proporsi logo tidak distorsi
            // priority            // Penting: Memaksa browser memuat logo ini paling pertama
          /> */}
        </div>
        <button className="bg-[#1E3A8A] text-slate-200 px-6 py-3 rounded-full font-bold text-sm pointer-events-auto shadow-[5px_5px_12px_#112053,-5px_-5px_12px_#2b54c1] hover:shadow-[2px_2px_6px_#112053,-2px_-2px_6px_#2b54c1] active:shadow-[inset_2px_2px_5px_#112053,inset_-2px_-2px_5px_#2b54c1] transition-all duration-200">
          Contact Me
        </button>
      </header>

      {/* LAYER MENU OVERLAY (Menampilkan teks dinamis & pop-up modal) */}
      <MenuOverlay currentIndex={currentIndex} isAnimating={isAnimatingUI} />

      {/* 3. LAYER KANVAS 3D */}
      <div className="absolute inset-0 z-10 pointer-events-auto cursor-grab active:cursor-grabbing">
        {Scene && <Scene currentIndex={currentIndex} />}
      </div>

    </main>
  )
}