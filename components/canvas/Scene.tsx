'use client'

import ContactIsland from './ContactIsland'
import AboutMeIsland from './AboutMeIsland'
import ProjectIsland from './ProjectIsland'
import ServicesIsland from './ServicesIsland'
import MainHubIsland from './MainHubIsland'
import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF, Float, Text } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import * as THREE from 'three'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

type GLTFResult = GLTF & {
  nodes: any
  materials: any
}

// =========================================================
// DATABASE SEMUA PANGGUNG 3D (TOTAL 5 GRUP)
// =========================================================

export const SCENE_1_ISLANDS = [
  { id: 'about-me', pos: [-4.8, -0.9, 0.4], scale: 0.5, label: 'Tentang Saya' },
  { id: 'projects', pos: [-1.3, -1.2, 1.8], scale: 0.5, label: 'Project Saya' },
  { id: 'main-hub', pos: [0, -2, -6], scale: 1.2, label: 'Main Hub' },
  { id: 'services', pos: [2.2, -1, 2.5], scale: 0.5, label: 'Services' },
  { id: 'contact', pos: [6, -0.5, 0.5], scale: 0.5, label: 'Kontak' },
]

export const SCENE_2_ISLANDS = [
  { id: 'about-me', pos: [0, -1.2, -2.9], scale: 1.1, label: 'Tentang Saya' },
]

export const SCENE_3_ISLANDS = [
  { id: 'projects', pos: [0, -1, -2.9], scale: 1, label: 'Project Saya' },
]

export const SCENE_4_ISLANDS = [
  { id: 'services', pos: [0, -4, -10], scale: 1.4, label: 'Services' },
]

export const SCENE_5_ISLANDS = [
  { id: 'contact', pos: [0, -1, -2.8], scale: 1.2, label: 'Kontak' },
]

// =========================================================
// KOMPONEN PARALLAX KHUSUS TEKS (ZOOM IN/OUT)
// =========================================================
function ParallaxTextGroup({ children, zoomIntensity = 15, isMainGroup = false }: { children: React.ReactNode, zoomIntensity?: number, isMainGroup?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    
    let targetZ = state.pointer.y * -zoomIntensity
    targetZ = THREE.MathUtils.clamp(targetZ, -3, 2)

    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.08)
  })

  useGSAP(() => {
    if (isMainGroup && groupRef.current) {
      gsap.from(groupRef.current.position, {
        y: 25,               
        duration: 4,         
        ease: 'power3.out',  
        delay: 0.5           
      })
    }
  }, [])

  return <group ref={groupRef}>{children}</group>
}

// =========================================================
// KAMERA RIG UTAMA
// =========================================================
function CameraRig() {
  useFrame((state) => {
    const minAzimuth = -Math.PI / 30
    const maxAzimuth = Math.PI / 90
    const minPolar = Math.PI / 2.5
    const maxPolar = Math.PI / 2.2

    const targetAzimuth = minAzimuth + ((state.pointer.x + 1) / 2) * (maxAzimuth - minAzimuth)
    const targetPolar = minPolar + ((state.pointer.y + 1) / 2) * (maxPolar - minPolar)

    const radius = 11.5 
    const targetX = radius * Math.sin(targetPolar) * Math.sin(targetAzimuth)
    const targetY = radius * Math.cos(targetPolar)
    const targetZ = radius * Math.sin(targetPolar) * Math.cos(targetAzimuth)

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.12)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.12)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.12)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function FloatingIsland({ data, index, isMainGroup = false }: { data: any; index: number; isMainGroup?: boolean }) {
  const { scene } = useGLTF(data.path) as unknown as GLTFResult
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered])

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
  }, []) 

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.5}>
      <group 
        ref={groupRef} 
        position={data.pos as [number, number, number]}
        scale={hovered ? data.scale * 1.05 : data.scale} 
        onPointerOver={(e) => { 
          e.stopPropagation(); 
          setHovered(true);
          window.dispatchEvent(new CustomEvent('setTooltip', { detail: data.label }));
        }}
        onPointerOut={(e) => { 
          e.stopPropagation(); 
          setHovered(false);
          window.dispatchEvent(new CustomEvent('setTooltip', { detail: null }));
        }}
      >
        <primitive object={scene.clone()} />
      </group>
    </Float>
  )
}

function InnerScene({ currentIndex }: { currentIndex: number }) {
  const scene1Ref = useRef<THREE.Group>(null)
  const scene2Ref = useRef<THREE.Group>(null)
  const scene3Ref = useRef<THREE.Group>(null)
  const scene4Ref = useRef<THREE.Group>(null) 
  const scene5Ref = useRef<THREE.Group>(null) 
  const prevIndex = useRef(currentIndex)

  useGSAP(() => {
    const scenes = [scene1Ref, scene2Ref, scene3Ref, scene4Ref, scene5Ref]

    scenes.forEach((sceneRef, index) => {
      if (!sceneRef.current) return

      let targetY;
      if (index < currentIndex) {
        // PERBAIKAN 1: Terbangkan jauh lebih tinggi ke langit
        targetY = 60;   
      } else if (index === currentIndex) {
        targetY = -1.5; 
      } else {
        // PERBAIKAN 2: Kubur jauh lebih dalam ke bawah tanah
        targetY = -80;  
      }

      if (index === currentIndex || index === prevIndex.current) {
        gsap.to(sceneRef.current.position, { y: targetY, duration: 2.5, ease: "power3.inOut" })
      } else {
        gsap.set(sceneRef.current.position, { y: targetY })
      }
    })

    prevIndex.current = currentIndex
  }, [currentIndex]) 

  const renderIslandComponent = (island: any, index: number) => {
    switch (island.id) {
      case 'about-me':
        return <AboutMeIsland key={`s1-${island.id}`} data={island} index={index} isMainGroup={true} />
      case 'projects':
        return <ProjectIsland key={`s1-${island.id}`} data={island} index={index} isMainGroup={true} />
      case 'main-hub':
        return <MainHubIsland key={`s1-${island.id}`} data={island} index={index} isMainGroup={true} />
      case 'services':
        return <ServicesIsland key={`s1-${island.id}`} data={island} index={index} isMainGroup={true} />
      case 'contact':
        return <ContactIsland key={`s1-${island.id}`} data={island} index={index} isMainGroup={true} />
      default:
        return <FloatingIsland key={`s1-${island.id}`} data={island} index={index} isMainGroup={true} />
    }
  }

  return (
    <>
      <CameraRig />
      
      {/* GRUP 0: UTAMA (Tetap di -1.5 karena ini panggung aktif saat web dibuka) */}
      <group ref={scene1Ref} position={[0, -1.5, 0]}>
        <ParallaxTextGroup zoomIntensity={15} isMainGroup={true}>
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            {/* Welcome to My - Neumorphic */}
            <Text position={[-11.5 + 0.03, 7 - 0.03, -30.01]} fontSize={1} color="#112053" fillOpacity={0.5} anchorX="center" anchorY="middle">
              Welcome to My
            </Text>
            <Text position={[-11.5 - 0.03, 7 + 0.03, -30.01]} fontSize={1} color="#2b54c1" fillOpacity={0.5} anchorX="center" anchorY="middle">
              Welcome to My
            </Text>
            <Text position={[-11.5, 7, -30]} fontSize={1} color="#F8FAFC" fillOpacity={1} anchorX="center" anchorY="middle">
              Welcome to My
            </Text>

            {/* Portofolio - Neumorphic */}
            <Text position={[-4 + 0.2, 5 - 0.2, -50.01]} fontSize={10} color="#112053" fillOpacity={0.9} fontWeight="bold" anchorX="center" anchorY="middle">
              Portofolio
            </Text>
            <Text position={[-4 - 0.2, 5 + 0.2, -50.01]} fontSize={10} color="#2b54c1" fillOpacity={0.9} fontWeight="bold" anchorX="center" anchorY="middle">
              Portofolio
            </Text>
            <Text position={[-4, 5, -50]} fontSize={10} color="#F8FAFC" fillOpacity={1} fontWeight="bold" anchorX="center" anchorY="middle">
              Portofolio
            </Text>

            {/* Website - Neumorphic */}
            <Text position={[20 + 0.2, -3 - 0.2, -50.01]} fontSize={10} color="#112053" fillOpacity={0.9} fontWeight="bold" anchorX="center" anchorY="middle">
              Website
            </Text>
            <Text position={[20 - 0.2, -3 + 0.2, -50.01]} fontSize={10} color="#2b54c1" fillOpacity={0.9} fontWeight="bold" anchorX="center" anchorY="middle">
              Website
            </Text>
            <Text position={[20, -3, -50]} fontSize={10} color="#F8FAFC" fillOpacity={1} fontWeight="bold" anchorX="center" anchorY="middle">
              Website
            </Text>
          </Float>
        </ParallaxTextGroup>

        {SCENE_1_ISLANDS.map((island, index) => {
          // Peta routing dari ID pulau ke index Scene tujuan
          const TARGET_INDEX: Record<string, number> = {
            'about-me': 1,
            'projects': 2,
            'services': 3,
            'contact': 4
          }
          
          const targetScene = TARGET_INDEX[island.id]

          return (
            <group 
              key={`s1-wrapper-${island.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (targetScene !== undefined) {
                  window.dispatchEvent(new CustomEvent('navigateToScene', { detail: targetScene }));
                }
              }}
            >
              {renderIslandComponent(island, index)}
            </group>
          )
        })}
      </group>

      {/* PERBAIKAN 3: Ubah posisi awal (default) semua grup ini dari -30 menjadi -80 */}
      
      {/* GRUP 1: TIM KAMI */}
      <group ref={scene2Ref} position={[0, -80, 0]}>
        <ParallaxTextGroup zoomIntensity={10}>
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            {/* Tentang Saya - Neumorphic */}
            {/* Shadow */}
            <Text position={[0 + 0.1, 2 - 0.1, -30.01]} fontSize={8} color="#112053" fillOpacity={0.5} fontWeight="bold" anchorX="center" anchorY="middle">
              Tentang Saya
            </Text>
            {/* Highlight */}
            <Text position={[0 - 0.1, 2 + 0.1, -30.01]} fontSize={8} color="#2b54c1" fillOpacity={0.5} fontWeight="bold" anchorX="center" anchorY="middle">
              Tentang Saya
            </Text>
            {/* Main Text */}
            <Text position={[0, 2, -30]} fontSize={8} color="#F8FAFC" fillOpacity={1} fontWeight="bold" anchorX="center" anchorY="middle">
              Tentang Saya
            </Text>
          </Float>
        </ParallaxTextGroup>
        {SCENE_2_ISLANDS.map((island, index) => renderIslandComponent(island, index))}
      </group>

      {/* GRUP 2: GALERI */}
      <group ref={scene3Ref} position={[0, -80, 0]}>
        <ParallaxTextGroup zoomIntensity={10}>
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            {/* Project Saya - Neumorphic */}
            <Text position={[0 + 0.1, 2 - 0.1, -30.01]} fontSize={8} color="#112053" fillOpacity={0.5} fontWeight="bold" anchorX="center" anchorY="middle">
              Project Saya
            </Text>
            <Text position={[0 - 0.1, 2 + 0.1, -30.01]} fontSize={8} color="#2b54c1" fillOpacity={0.5} fontWeight="bold" anchorX="center" anchorY="middle">
              Project Saya
            </Text>
            <Text position={[0, 2, -30]} fontSize={8} color="#F8FAFC" fillOpacity={1} fontWeight="bold" anchorX="center" anchorY="middle">
              Project Saya
            </Text>
          </Float>
        </ParallaxTextGroup>
        {SCENE_3_ISLANDS.map((island, index) => renderIslandComponent(island, index))}
      </group>

      {/* GRUP 3: HARGA */}
      <group ref={scene4Ref} position={[0, -80, 0]}>
        <ParallaxTextGroup zoomIntensity={10}>
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            {/* Services - Neumorphic */}
            <Text position={[0 + 0.1, 2 - 0.1, -30.01]} fontSize={10} color="#112053" fillOpacity={0.5} fontWeight="bold" anchorX="center" anchorY="middle">
              Services
            </Text>
            <Text position={[0 - 0.1, 2 + 0.1, -30.01]} fontSize={10} color="#2b54c1" fillOpacity={0.5} fontWeight="bold" anchorX="center" anchorY="middle">
              Services
            </Text>
            <Text position={[0, 2, -30]} fontSize={10} color="#F8FAFC" fillOpacity={1} fontWeight="bold" anchorX="center" anchorY="middle">
              Services
            </Text>
          </Float>
        </ParallaxTextGroup>
        {SCENE_4_ISLANDS.map((island, index) => renderIslandComponent(island, index))}
      </group>

      {/* GRUP 4: TENTANG KAMI */}
      <group ref={scene5Ref} position={[0, -80, 0]}>
        <ParallaxTextGroup zoomIntensity={10}>
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            {/* Kontak - Neumorphic */}
            <Text position={[0 + 0.1, 2 - 0.1, -30.01]} fontSize={10} color="#112053" fillOpacity={0.5} fontWeight="bold" anchorX="center" anchorY="middle">
              Kontak
            </Text>
            <Text position={[0 - 0.1, 2 + 0.1, -30.01]} fontSize={10} color="#2b54c1" fillOpacity={0.5} fontWeight="bold" anchorX="center" anchorY="middle">
              Kontak
            </Text>
            <Text position={[0, 2, -30]} fontSize={10} color="#F8FAFC" fillOpacity={1} fontWeight="bold" anchorX="center" anchorY="middle">
              Kontak
            </Text>
          </Float>
        </ParallaxTextGroup>
        {SCENE_5_ISLANDS.map((island, index) => renderIslandComponent(island, index))}
      </group>
    </>
  )
}

export default function Scene({ currentIndex }: { currentIndex: number }) {
  return (
    <Canvas dpr={1} camera={{ position: [0, 5, 10], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
      />
      <Suspense fallback={null}>
        <InnerScene currentIndex={currentIndex} />
      </Suspense>
    </Canvas>
  )
}