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

// Alas: Kidney Bean / Kacang
const kidneyShape = new THREE.Shape()
kidneyShape.moveTo(0, 1.5)
kidneyShape.bezierCurveTo(3, 1.5, 3, -1.5, 0, -1.5)
kidneyShape.bezierCurveTo(-1.5, -1.5, -0.5, 0, -1.5, 1.5)
kidneyShape.bezierCurveTo(-2, 2.5, -0.5, 1.5, 0, 1.5)

const baseGeometry = new THREE.ExtrudeGeometry(kidneyShape, extrudeSettings)
const baseMaterial = new THREE.MeshStandardMaterial({ color: "#6495ED", roughness: 0.5, metalness: 0.1 })

// Objek Melayang: Torus Emas
const floatGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100)
const floatMaterial = new THREE.MeshStandardMaterial({ color: "#d4af37", metalness: 0.8, roughness: 0.2 })

export default function ServicesIsland({ data, index, isMainGroup = false }: IslandProps) {
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

        <Float speed={2} rotationIntensity={2} floatIntensity={0.3}>
          <mesh position={[0.1, 2.8, -0.1]} castShadow geometry={floatGeometry} material={floatMaterial} />
        </Float>
      </group>
    </Float>
  )
}