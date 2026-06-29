'use client'

import React from 'react'
import Image from 'next/image'

// Data untuk profil "Tentang Saya"
const MY_PROFILE = {
  name: 'Lingkar Chaya', // Ganti dengan nama Anda
  role: 'Full-Stack Developer & 3D Artist', // Ganti dengan peran/jabatan Anda
  avatar: '/profil foto-Photoroom.png', // Path gambar profil
  color: 'bg-blue-100',
  bio: 'Saya adalah seorang pengembang perangkat lunak dengan hasrat untuk menciptakan pengalaman digital yang intuitif dan menawan. Dengan keahlian di bidang pengembangan web modern dan seni 3D, saya berdedikasi untuk mengubah ide-ide kompleks menjadi solusi yang elegan dan fungsional.'
}

export default function AboutMeContent() {
  return (
    <div className="w-full flex flex-col gap-12 pb-12 mt-12 md:mt-20">
      {/* Bagian Profil Utama */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Avatar */}
        <div className={`w-48 h-48 rounded-full ${MY_PROFILE.color} flex-shrink-0 flex items-center justify-center overflow-hidden shadow-lg`}>
          <Image
            src={MY_PROFILE.avatar}
            alt={MY_PROFILE.name}
            width={192}
            height={192}
            className="object-cover object-center"
            style={{ transform: 'translateY(8%)' }}
          />
        </div>
        
        {/* Info Teks */}
        <div className="text-center md:text-left">
          <h4 className="text-4xl md:text-5xl font-extrabold text-neutral-200 tracking-tight mb-2">
            {MY_PROFILE.name}
          </h4>
          <p className="text-lg font-medium text-blue-300 uppercase tracking-widest mb-4">{MY_PROFILE.role}</p>
          <p className="text-lg text-neutral-400 leading-relaxed max-w-2xl">
            {MY_PROFILE.bio}
          </p>
        </div>
      </div>

      {/* Bagian Keahlian atau Statistik (Contoh) */}
      <div className="mt-8">
        <h5 className="text-2xl font-bold text-neutral-300 tracking-tight mb-6 text-center md:text-left">Keahlian Utama</h5>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-center">
          {['React.js', 'Next.js', 'Three.js', 'GSAP', 'Tailwind CSS', 'Node.js', 'Blender', 'Figma'].map((skill) => (
            <div 
              key={skill} 
              className="bg-slate-800/50 border border-white/10 rounded-xl p-4 font-medium text-neutral-300"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}