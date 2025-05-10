"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"

const Floating3DCube = ({ position = "bottom-right" }) => {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const cubeRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })
    renderer.setSize(150, 150)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create cube with gradient material
    const geometry = new THREE.BoxGeometry(2, 2, 2)

    // Create materials for each face with different colors
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x4361ee }), // Right - blue
      new THREE.MeshBasicMaterial({ color: 0x3a0ca3 }), // Left - indigo
      new THREE.MeshBasicMaterial({ color: 0x7209b7 }), // Top - purple
      new THREE.MeshBasicMaterial({ color: 0x560bad }), // Bottom - dark purple
      new THREE.MeshBasicMaterial({ color: 0x480ca8 }), // Front - medium purple
      new THREE.MeshBasicMaterial({ color: 0x3f37c9 }), // Back - blue-purple
    ]

    const cube = new THREE.Mesh(geometry, materials)
    scene.add(cube)
    cubeRef.current = cube

    // Animation loop
    const animate = () => {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      renderer.render(scene, camera)
      frameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }

      // Dispose resources
      geometry.dispose()
      materials.forEach((material) => material.dispose())
      renderer.dispose()
    }
  }, [])

  const positionClasses = {
    "top-left": "top-10 left-10",
    "top-right": "top-10 right-10",
    "bottom-left": "bottom-10 left-10",
    "bottom-right": "bottom-10 right-10",
  }

  return (
    <div
      ref={containerRef}
      className={`fixed ${positionClasses[position]} z-10 w-[150px] h-[150px] pointer-events-none`}
    />
  )
}

export default Floating3DCube
