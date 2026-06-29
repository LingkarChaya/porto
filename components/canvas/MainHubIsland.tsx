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
  depth: 1.5,
  bevelEnabled: true,
  bevelSegments: 8,
  steps: 1,
  bevelSize: 0.15,
  bevelThickness: 0.15
}

// Alas: Bentuk Amoeba Asimetris
const amoebaShape = new THREE.Shape()
amoebaShape.moveTo(-4, 0)
amoebaShape.bezierCurveTo(-5, 4, -1, 6, 2, 4)
amoebaShape.bezierCurveTo(5, 2, 6, -2, 3, -4)
amoebaShape.bezierCurveTo(0, -6, -3, -4, -4, 0)

const baseGeometry = new THREE.ExtrudeGeometry(amoebaShape, extrudeSettings)
const baseMaterial = new THREE.MeshStandardMaterial({ color: "#6A5ACD", roughness: 0.5, metalness: 0.1 })

// Objek Utama: Roket yang Mendarat
const rocketGroup = new THREE.Group();

// Badan Roket (Silinder Putih)
const bodyGeo = new THREE.CylinderGeometry(0.7, 0.7, 2.8, 32);
const bodyMat = new THREE.MeshStandardMaterial({ color: '#f0f0f0', metalness: 0.2, roughness: 0.3 });
const rocketBody = new THREE.Mesh(bodyGeo, bodyMat);
// Shadows disabled for performance

// Hidung Roket (Kerucut Merah)
const noseGeo = new THREE.ConeGeometry(0.7, 1.2, 32);
const noseMat = new THREE.MeshStandardMaterial({ color: '#d9534f' });
const rocketNose = new THREE.Mesh(noseGeo, noseMat);
rocketNose.castShadow = true;
rocketNose.position.y = 1.4 + 0.6; // Di atas badan roket

// Kaki Pendaratan (3 buah)
const legGeo = new THREE.CylinderGeometry(0.1, 0.05, 1.5, 8);
const legMat = new THREE.MeshStandardMaterial({ color: '#a9a9a9', metalness: 0.6, roughness: 0.4 });
const numLegs = 3;
const rocketLegs = new THREE.Group();
for (let i = 0; i < numLegs; i++) {
  const legPivot = new THREE.Group();
  const leg = new THREE.Mesh(legGeo, legMat);
  leg.castShadow = true;

  legPivot.rotation.y = (i / numLegs) * Math.PI * 2; // Putar pivot

  leg.position.set(0.7, -0.8, 0); // Posisikan kaki menjauh dari pusat
  leg.rotation.z = Math.PI / 5;   // Miringkan kaki keluar

  legPivot.add(leg);
  rocketLegs.add(legPivot);
}

// Gabungkan semua bagian (badan, hidung, kaki) menjadi satu objek roket
rocketGroup.add(rocketBody, rocketNose, rocketLegs);

// Objek Tambahan 1: Bendera
const flagGroup = new THREE.Group();
const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.5, 16);
const poleMat = new THREE.MeshStandardMaterial({ color: '#c0c0c0', metalness: 0.5 });
const pole = new THREE.Mesh(poleGeo, poleMat);
pole.castShadow = true;
flagGroup.add(pole);

const flagGeo = new THREE.PlaneGeometry(1, 0.7);
const flagMat = new THREE.MeshStandardMaterial({ color: '#d9534f', side: THREE.DoubleSide });
const flag = new THREE.Mesh(flagGeo, flagMat);
flag.castShadow = true;
flag.position.set(0.55, 0.9, 0); // Geser sedikit dari tiang
flagGroup.add(flag);

// Objek Tambahan 2: Kawah Kecil
const craterGeo = new THREE.TorusGeometry(0.8, 0.2, 16, 48);
const craterMat = new THREE.MeshStandardMaterial({ color: "#c7a2d1", roughness: 0.8, metalness: 0.1 }); // Dibuat lebih kasar

// =========================================================
// MODIFIKASI GEOMETRI KAWAK AGAR TIDAK POLOS
// =========================================================
const positionAttribute = craterGeo.attributes.position;
const vertex = new THREE.Vector3();

for (let i = 0; i < positionAttribute.count; i++) {
  vertex.fromBufferAttribute(positionAttribute, i);

  // Tambahkan "noise" atau gangguan acak pada sumbu Y (ketebalan cincin).
  // Ini akan membuat permukaan kawah terlihat tidak rata dan lebih alami.
  const noise = (Math.random() - 0.5) * 0.15; // Nilai acak antara -0.075 dan 0.075
  vertex.y += noise;

  positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
}
// Hitung ulang normal agar pencahayaan pada permukaan yang tidak rata menjadi benar
craterGeo.computeVertexNormals();

export default function MainHubIsland({ data, index, isMainGroup = false }: IslandProps) {
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
        <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={baseGeometry} material={baseMaterial} />

        {/* Roket yang sudah mendarat */}
        <primitive
          object={rocketGroup}
          position={[-1.5, 3.3, 0.2]} // Posisi baru: lebih ke tengah dan sedikit ke belakang
          rotation={[0, Math.PI / 6, 0]} // Rotasi baru: menghadap sedikit berbeda
          scale={1.1} // Ukuran baru: dibuat lebih besar (110%)
        />

        {/* Bendera di samping roket */}
        <primitive
          object={flagGroup}
          position={[1.5, 0.75 + 2, -1]} // 0.75 (permukaan) + 1.25 (setengah tinggi tiang)
          rotation={[0, Math.PI / 6, 0]}
          scale={0.9}
        />

        {/* Kawah kecil di permukaan pulau */}
        <mesh
          geometry={craterGeo}
          material={craterMat}
          position={[0.5, 1.6, 1.5]} // Tepat di permukaan
          rotation={[-Math.PI / 2, 0, 0]}
        />

        <mesh
          geometry={craterGeo}
          material={craterMat}
          position={[3, 1.6, -0.1]} // Tepat di permukaan
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.7}
        />

      </group>
    </Float>
  )
}