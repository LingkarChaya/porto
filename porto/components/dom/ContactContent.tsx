'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function ContactContent() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Animasi masuk untuk seluruh container
    gsap.from(containerRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-12 mt-12 md:mt-20 pb-16">
      
      {/* Bagian Kiri: Informasi Kontak */}
      <div className="md:w-1/3 space-y-8">
        <div>
          <h5 className="text-lg font-bold text-blue-300 uppercase tracking-widest mb-3">Email</h5>
          <a href="mailto:emailanda@example.com" className="text-xl text-neutral-200 hover:text-white transition-colors">
            emailanda@example.com
          </a>
        </div>
        <div>
          <h5 className="text-lg font-bold text-blue-300 uppercase tracking-widest mb-3">Lokasi</h5>
          <p className="text-xl text-neutral-200">
            Jakarta, Indonesia
          </p>
        </div>
        <div>
          <h5 className="text-lg font-bold text-blue-300 uppercase tracking-widest mb-3">Sosial Media</h5>
          <div className="flex gap-4">
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">GitHub</a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </div>

      {/* Bagian Kanan: Form Kontak */}
      <div className="md:w-2/3">
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">Nama</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              placeholder="Nama Lengkap Anda"
              className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              placeholder="email@anda.com"
              className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">Pesan</label>
            <textarea 
              id="message" 
              name="message"
              rows={5}
              placeholder="Tuliskan pesan Anda di sini..."
              className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            ></textarea>
          </div>
          <div>
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-500 transition-colors duration-300"
            >
              Kirim Pesan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}