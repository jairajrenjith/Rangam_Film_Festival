import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { BallCollider, Physics, RigidBody } from '@react-three/rapier'

const COLORS = [
  '#f6dc79',
  '#f8df82',
  '#f3d66f',
  '#ffe99a',
  '#ead06b',
  '#fff0a8'
]

function Sphere({ position, color, scale }) {
  const api = useRef()

  useFrame(() => {
    if (!api.current) return

    const current = api.current.translation()

    // Same spring-back idea as the original demo:
    // every ball continuously returns toward its starting point.
    api.current.applyImpulse({
      x: -current.x * 0.25,
      y: -current.y * 0.25,
      z: -current.z * 0.25
    })
  })

  return (
    <RigidBody
      ref={api}
      position={position}
      colliders={false}
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      restitution={0.5}
    >
      <BallCollider args={[1]} />

      <mesh scale={scale} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />

        <meshPhysicalMaterial
          color={color}
          metalness={0.5}
          roughness={0.2}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
        />
      </mesh>
    </RigidBody>
  )
}

function Pointer({ pointer }) {
  const api = useRef()
  const target = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    if (!api.current) return

    target.set(
      pointer.current.x,
      pointer.current.y,
      1.5
    )

    api.current.setNextKinematicTranslation(target)
  })

  return (
    <RigidBody
      ref={api}
      type="kinematicPosition"
      colliders={false}
    >
      <BallCollider args={[1.25]} />
    </RigidBody>
  )
}

function Scene({ pointer }) {
  const spheres = useMemo(() => {
    const positions = [
      [-2.5, 1.5, 0],
      [-1.25, 2.0, 0.2],
      [0, 2.2, -0.1],
      [1.25, 1.8, 0.15],
      [2.4, 1.15, 0],

      [-2.35, 0.15, 0.15],
      [-1.1, 0.25, 0.5],
      [0.15, 0.35, 0.2],
      [1.45, 0.25, 0.45],
      [2.5, -0.35, 0.1],

      [-1.85, -1.2, 0],
      [-0.55, -1.25, 0.3],
      [0.8, -1.15, 0],
      [2.0, -1.35, 0.25],

      [-3.05, -0.95, -0.1],
      [3.05, 0.05, -0.1]
    ]

    return positions.map((position, index) => ({
      position,
      color: COLORS[index % COLORS.length],
      scale: 0.72 + (index % 4) * 0.07
    }))
  }, [])

  return (
    <>
      <ambientLight intensity={1.8} />

      <directionalLight
        position={[4, 6, 7]}
        intensity={2.8}
      />

      <pointLight
        position={[-5, 2, 5]}
        intensity={5}
        distance={12}
        color="#ffec8e"
      />

      <pointLight
        position={[5, -2, 4]}
        intensity={3}
        distance={10}
        color="#9c2f56"
      />

      <Physics
        gravity={[0, 0, 0]}
        timeStep="vary"
      >
        <Pointer pointer={pointer} />

        {spheres.map((sphere, index) => (
          <Sphere
            key={index}
            {...sphere}
          />
        ))}
      </Physics>

      <Environment preset="studio" />
    </>
  )
}

export default function HeroBalls() {
  const container = useRef(null)

  const pointer = useRef({
    x: 0,
    y: 0
  })

  useEffect(() => {
    const handlePointerMove = (event) => {
      const rect = container.current?.getBoundingClientRect()

      if (!rect) return

      const normalizedX =
        ((event.clientX - rect.left) / rect.width) * 2 - 1

      const normalizedY =
        -(((event.clientY - rect.top) / rect.height) * 2 - 1)

      pointer.current.x = normalizedX * 4.8
      pointer.current.y = normalizedY * 3.2
    }

    window.addEventListener(
      'pointermove',
      handlePointerMove,
      { passive: true }
    )

    return () => {
      window.removeEventListener(
        'pointermove',
        handlePointerMove
      )
    }
  }, [])

  return (
    <div
      ref={container}
      className="hero-balls"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{
          position: [0, 0, 13],
          fov: 30
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Scene pointer={pointer} />
      </Canvas>
    </div>
  )
}