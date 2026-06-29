'use client'

import React from 'react'

// =========================================================
// DATA DUMMY PROYEK
// =========================================================
const PROJECT_ITEMS = [
  {
    id: 1,
    title: 'Website Portofolio Interaktif',
    description: 'Sebuah portofolio web imersif yang dibangun dengan Next.js dan Three.js, menampilkan transisi scene 3D yang mulus dan animasi yang responsif.',
    image: 'https://picsum.photos/seed/project1/800/600',
    tags: ['Next.js', 'Three.js', 'GSAP', 'Tailwind CSS'],
    liveUrl: '#', // Ganti dengan URL demo langsung
    githubUrl: '#', // Ganti dengan URL repositori GitHub
  },
  {
    id: 2,
    title: 'Aplikasi E-commerce Mebel',
    description: 'Platform e-commerce dengan fitur lengkap, termasuk visualisasi produk 3D, keranjang belanja, dan sistem pembayaran terintegrasi.',
    image: 'https://picsum.photos/seed/project2/800/600',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Three.js'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 3,
    title: 'Dashboard Analitik Data',
    description: 'Aplikasi web untuk visualisasi data real-time, menggunakan D3.js untuk membuat grafik dan bagan yang interaktif dan informatif.',
    image: 'https://picsum.photos/seed/project3/800/600',
    tags: ['Vue.js', 'D3.js', 'Firebase', 'SCSS'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 4,
    title: 'Karya Seni Generatif',
    description: 'Eksplorasi seni visual menggunakan p5.js untuk menciptakan pola dan animasi yang unik berdasarkan algoritma matematika.',
    image: 'https://picsum.photos/seed/project4/800/600',
    tags: ['p5.js', 'Creative Coding', 'JavaScript'],
    liveUrl: '#',
    githubUrl: '#',
  },
]

export default function ProjectContent() {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col mt-8 md:mt-12 pb-16">

      {/* Grid Kartu Proyek */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {PROJECT_ITEMS.map((project) => (
          <div 
            key={project.id} 
            className="group bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
          >
            <div className="aspect-video overflow-hidden">
              <img 
                src={project.image} 
                alt={`Thumbnail for ${project.title}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map(tag => (
                  <span key={tag} className="bg-blue-900/50 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <h5 className="text-xl font-bold text-neutral-200 mb-2">{project.title}</h5>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">{project.description}</p>
              <div className="flex gap-4">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-500 transition-colors duration-300">
                  Live Demo
                </a>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-slate-700 text-neutral-300 font-bold py-2.5 rounded-lg hover:bg-slate-600 transition-colors duration-300">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tombol Muat Lebih Banyak */}
      <div className="mt-12 flex justify-center">
        <button className="px-8 py-3 bg-slate-800 text-neutral-300 rounded-full font-bold hover:bg-blue-600 hover:text-white transition-colors duration-300 shadow-md border border-white/10">
          Lihat Semua Proyek
        </button>
      </div>
    </div>
  )
}