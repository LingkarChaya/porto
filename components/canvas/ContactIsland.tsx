'use client'

import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { Float, useCursor } from '@react-three/drei'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface ContactIslandProps {
  data: {
    id: string
    pos: [number, number, number]
    scale: number
    label: string
  }
  index: number
  isMainGroup?: boolean
}

// =========================================================
// OPTIMASI: Ekstraksi Geometri dan Material ke luar komponen
// Ini mencegah pembuatan ulang resource WebGL pada setiap render 
// atau ketika ada banyak instance ContactIsland.
// =========================================================
const organicShape = new THREE.Shape()
organicShape.moveTo(-4, 0)
organicShape.bezierCurveTo(-4, 2.5, 4, 2.5, 4, 0)
organicShape.bezierCurveTo(4.5, -1, 3.5, -2, 2, -1.5)
organicShape.bezierCurveTo(0, -0.5, -1, -2, -3.5, -1.5)
organicShape.bezierCurveTo(-4.2, -1, -4, -0.5, -4, 0)

const extrudeSettings = {
  depth: 1.2,           
  bevelEnabled: true,   
  bevelSegments: 8,     
  steps: 1,
  bevelSize: 0.15,      
  bevelThickness: 0.15  
}

const mainGeometry = new THREE.ExtrudeGeometry(organicShape, extrudeSettings)
const mainMaterial = new THREE.MeshStandardMaterial({ color: "#9370DB", roughness: 0.5, metalness: 0.1 })

const cylinderWhiteShortGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 32)
const whiteMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.4 })

const spherePurpleGeo = new THREE.SphereGeometry(0.35, 32, 32)
const purpleMaterial = new THREE.MeshStandardMaterial({ color: "#7a22b8", roughness: 0.2, metalness: 0.1 })

const podiumWhiteGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.8, 32)
const podiumMaterial = new THREE.MeshStandardMaterial({ color: "#eeeeee", roughness: 0.5 })

const crownGoldGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16)
const goldMaterial = new THREE.MeshStandardMaterial({ color: "#d4af37", metalness: 0.8, roughness: 0.2 })

const glassCylinderGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.0, 32)
const glassMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff", transparent: true, opacity: 0.3, roughness: 0.1, metalness: 0.1 })

export default function ContactIsland({ data, index, isMainGroup = false }: ContactIslandProps) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)

  // Mengubah kursor saat hover dengan hook bawaan Drei
  useCursor(hovered)

  // Efek animasi masuk (Menyamakan logika GSAP dengan pulau air-hockey Anda)
  useGSAP(() => {
    if (isMainGroup && groupRef.current) {
      gsap.from(groupRef.current.position, {
        y: 25,               
        duration: 4,         
        ease: 'power3.out',  
        delay: index * 0.4,  
      })
      
      gsap.from(groupRef.current.rotation, {
        y: Math.PI / 4,      
        duration: 4,
        ease: 'power3.out',
        delay: index * 0.4,
      })
    }
  }, [isMainGroup, index])

    return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.5}>
      <group
        ref={groupRef}
        position={data.pos}
        scale={hovered ? data.scale * 1.05 : data.scale}
        onPointerOver={(e) => { 
          e.stopPropagation()
          setHovered(true)
          window.dispatchEvent(new CustomEvent('setTooltip', { detail: data.label }))
        }}
        onPointerOut={(e) => { 
          e.stopPropagation()
          setHovered(false)
          window.dispatchEvent(new CustomEvent('setTooltip', { detail: null }))
        }}
      >
        {/* ========================================================= */}
        {/* 1. PULAU UTAMA (PONDASI)                                 */}
        {/* ========================================================= */}
        <mesh 
          castShadow 
          receiveShadow 
          rotation={[-Math.PI / 2, 0, 0]} 
          geometry={mainGeometry} 
          material={mainMaterial} 
        >
        </mesh>

        {/* ========================================================= */}
        {/* 2. GRUP HIASAN DI ATAS PULAU                             */}
        {/* ========================================================= */}
        
        {/* HIASAN KIRI: Dudukan Putih & Bola Ungu Melayang */}
        <group position={[-2.5, 1.3, -0.5]}>
          {/* Silinder Putih Pendek */}
          <mesh castShadow receiveShadow geometry={cylinderWhiteShortGeo} material={whiteMaterial} />

          {/* Bola Ungu Melayang (Diberi Float tambahan agar bergerak sendiri) */}
          <Float speed={2} floatIntensity={0.3}>
            <mesh position={[0, 1.2, 0]} castShadow geometry={spherePurpleGeo} material={purpleMaterial} />
          </Float>
        </group>

        {/* HIASAN KANAN: Tabung Berundak (Podium) & Mahkota Emas */}
        <group position={[1.8, 1.3, -0.5]}>
          {/* Podium Putih */}
          <mesh castShadow receiveShadow position={[0, 0.4, 0]} geometry={podiumWhiteGeo} material={podiumMaterial} />

          {/* Aset Emas di Atas Podium */}
          <mesh castShadow position={[0, 1.0, 0]} geometry={crownGoldGeo} material={goldMaterial} />
        </group>

        {/* HIASAN DEPAN: Tabung Kaca Transparan */}
        <group position={[-1.2, 1.3, 1.0]}>
          <mesh 
            castShadow 
            receiveShadow 
            position={[0, 0.5, 0]} 
            geometry={glassCylinderGeo} 
            material={glassMaterial} 
          />
        </group>
      </group>
    </Float>
  )
}