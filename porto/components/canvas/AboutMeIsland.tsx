'use client'

import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { Float, useCursor } from '@react-three/drei'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface IslandProps {
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
// =========================================================
const extrudeSettings = {
  depth: 1.2,
  bevelEnabled: true,
  bevelSegments: 8,
  steps: 1,
  bevelSize: 0.15,
  bevelThickness: 0.15
}

// Alas: Setengah lingkaran
const teamShape = new THREE.Shape()
teamShape.absarc(0, 0, 3, 0, Math.PI, false)
teamShape.lineTo(-3, 0)

const baseGeometry = new THREE.ExtrudeGeometry(teamShape, extrudeSettings)
const baseMaterial = new THREE.MeshStandardMaterial({ color: "#a0c4ff", roughness: 0.5, metalness: 0.1 })

// Objek Melayang: Kerucut Putih
const floatGeometry = new THREE.ConeGeometry(1, 2, 32)
const floatMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.4 })

export default function AboutMeIsland({ data, index, isMainGroup = false }: IslandProps) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)

  useCursor(hovered)

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
        <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]} geometry={baseGeometry} material={baseMaterial} />

        <Float speed={2} floatIntensity={0.3}>
          <mesh position={[0, 2.5, -1]} castShadow geometry={floatGeometry} material={floatMaterial} />
        </Float>
      </group>
    </Float>
  )
}