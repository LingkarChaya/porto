'use client'

import React from 'react'

// =========================================================
// TYPES & INTERFACES
// =========================================================
interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  tools: string[];
  color: string;
}

export default function ServicesContent() {
  // =========================================================
  // DATA LAYANAN
  // =========================================================
  const SERVICES: Service[] = [
    {
      id: 'ui-ux',
      icon: '🎨',
      title: 'UI/UX Design',
      description: 'Merancang antarmuka yang tidak hanya indah secara visual, tetapi juga intuitif dan fungsional untuk memberikan pengalaman pengguna terbaik.',
      tools: ['Figma', 'Adobe XD', 'Sketch', 'Protopie'],
      color: 'border-pink-500/50 hover:border-pink-500/80'
    },
    {
      id: 'Vidio Editing',
      icon: '🏷️',
      title: 'Vidio Editing',
      description: 'membuat karya audio visual mulai dari reels, podcast vidio, dan short vidio.',
      tools: ['Adobe Premier Pro', 'Adobe Photoshop', 'Filmora'],
      color: 'border-purple-500/50 hover:border-purple-500/80'
    },
    {
      id: '3d-viz',
      icon: '🧊',
      title: '3D Visualization',
      description: 'Mengubah konsep menjadi visual tiga dimensi yang realistis, cocok untuk presentasi produk, arsitektur, atau aset game.',
      tools: ['Blender', 'Cinema 4D', 'Substance Painter', 'Three.js'],
      color: 'border-teal-500/50 hover:border-teal-500/80'
    }
  ]

  return (
    <div className="w-full mt-12">
      {/* GRID KARTU LAYANAN DESAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
        {SERVICES.map((service) => (
          <div 
            key={service.id} 
            className={`bg-slate-800/50 rounded-2xl border p-8 flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${service.color}`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl">{service.icon}</div>
              <h5 className="text-2xl font-bold text-white">{service.title}</h5>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-8 flex-1">{service.description}</p>
            
            <div>
              <h6 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Tools yang Digunakan</h6>
              <div className="flex flex-wrap gap-2">
                {service.tools.map(tool => (
                  <span key={tool} className="bg-slate-700/80 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-md">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center bg-slate-800/30 border border-white/10 rounded-2xl p-12">
        <h4 className="text-3xl font-bold text-white mb-4">Punya Ide Proyek?</h4>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          Mari kita diskusikan bagaimana saya dapat membantu mengubah ide Anda menjadi kenyataan.
        </p>
        <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-500 transition-colors duration-300">
          Hubungi Saya
        </button>
      </div>
    </div>
  )
}