"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

// Define the system components based on the reference image
const components = [
  {
    id: "user",
    name: "User",
    x: -6,
    y: 0,
    z: 0,
    logo: "👤",
    color: 0xffffff,
    scale: 0.8,
  },
  {
    id: "inputs",
    name: "Inputs",
    x: -4,
    y: 0,
    z: 0,
    logo: "🎛️",
    color: 0xffffff,
    scale: 0.8,
  },
  {
    id: "sdks",
    name: "SDKs",
    x: -2,
    y: 0,
    z: 0,
    logo: "⚛️",
    color: 0xffffff,
    scale: 0.8,
  },
  {
    id: "webrtc",
    name: "WebRTC",
    x: 0,
    y: 0,
    z: 0,
    logo: "🔄",
    color: 0xffffff,
    scale: 0.8,
  },
  {
    id: "litefs",
    name: "LiteFS Cloud",
    x: 2,
    y: 0,
    z: 0,
    logo: "☁️",
    color: 0x00aaff,
    scale: 0.8,
  },
  {
    id: "stt",
    name: "STT",
    x: 0,
    y: 2,
    z: 0,
    logo: "🎤",
    color: 0xffffff,
    scale: 0.8,
  },
  {
    id: "tts",
    name: "TTS",
    x: 4,
    y: 0,
    z: 0,
    logo: "🔊",
    color: 0xffffff,
    scale: 0.8,
  },
  {
    id: "noise",
    name: "Noise cancellation",
    x: 0,
    y: 4,
    z: 0,
    logo: "🔇",
    color: 0xffffff,
    scale: 0.8,
  },
  {
    id: "semantic",
    name: "Semantic turn detection",
    x: 2,
    y: 4,
    z: 0,
    logo: "🔄",
    color: 0xffffff,
    scale: 0.8,
  },
  {
    id: "llm",
    name: "LLM",
    x: 0,
    y: 6,
    z: 0,
    logo: "🧠",
    color: 0xffffff,
    scale: 0.8,
  },
  {
    id: "custom",
    name: "Custom Business Logic",
    x: 4,
    y: 4,
    z: 0,
    logo: "⚡",
    color: 0xffffff,
    scale: 1.2,
    width: 2.5,
    height: 0.4,
    depth: 2.5,
  },
  {
    id: "http",
    name: "HTTP/Websocket",
    x: 6,
    y: 2,
    z: 0,
    logo: "🌐",
    color: 0xffffff,
    scale: 0.8,
  },
]

// Define the connections between components
const connections = [
  { from: "user", to: "inputs" },
  { from: "inputs", to: "sdks" },
  { from: "sdks", to: "webrtc" },
  { from: "webrtc", to: "litefs" },
  { from: "litefs", to: "tts" },
  { from: "sdks", to: "stt" },
  { from: "stt", to: "noise" },
  { from: "noise", to: "semantic" },
  { from: "semantic", to: "llm" },
  { from: "tts", to: "custom" },
  { from: "custom", to: "http" },
]

export default function CircuitDiagram() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)
  const componentsRef = useRef({})
  const labelsRef = useRef({})
  const animationFrameRef = useRef(null)
  const raycasterRef = useRef(null)
  const mouseRef = useRef(new THREE.Vector2())
  const hoveredRef = useRef(null)
  const clockRef = useRef(new THREE.Clock())

  useEffect(() => {
    // Initialize scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    sceneRef.current = scene

    // Initialize raycaster for mouse interaction
    raycasterRef.current = new THREE.Raycaster()

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Initialize camera - use isometric-like view
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(8, 8, 16)
    cameraRef.current = camera

    // Initialize controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.minDistance = 5
    controls.maxDistance = 30
    controls.maxPolarAngle = Math.PI / 2
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controlsRef.current = controls

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x222222, 1)
    scene.add(ambientLight)

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 7)
    scene.add(directionalLight)

    // Add point lights for glow effect
    const pointLight1 = new THREE.PointLight(0x00aaff, 1, 20)
    pointLight1.position.set(0, 5, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x0088ff, 1, 20)
    pointLight2.position.set(5, 0, 5)
    scene.add(pointLight2)

    // Create isometric grid
    createIsometricGrid()

    // Create components and connections
    createComponents()
    createConnections()

    // Start animation
    animate()

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }

    // Handle mouse move for hover effects
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }

      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)

      // Dispose of all geometries and materials
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
    }
  }, [])

  // Create isometric grid
  const createIsometricGrid = () => {
    if (!sceneRef.current) return

    // Create grid lines
    const gridSize = 30
    const gridDivisions = 30
    const gridColor = 0x222222
    const gridColorCenter = 0x444444

    // Create horizontal grid
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, gridColorCenter, gridColor)
    gridHelper.position.y = -0.5
    sceneRef.current.add(gridHelper)

    // Create a second grid rotated 90 degrees for isometric effect
    const gridHelper2 = new THREE.GridHelper(gridSize, gridDivisions, gridColorCenter, gridColor)
    gridHelper2.rotation.x = Math.PI / 2
    gridHelper2.position.z = -0.5
    sceneRef.current.add(gridHelper2)
  }

  // Create 3D components
  const createComponents = () => {
    if (!sceneRef.current) return

    components.forEach((comp) => {
      // Create node box
      const width = comp.width || 1.2
      const height = comp.height || 0.4
      const depth = comp.depth || 1.2
      const scale = comp.scale || 1.0

      const geometry = new THREE.BoxGeometry(width, height, depth)

      // Create materials for the box
      const materials = [
        new THREE.MeshStandardMaterial({
          color: 0x111111,
          metalness: 0.8,
          roughness: 0.2,
        }), // right
        new THREE.MeshStandardMaterial({
          color: 0x111111,
          metalness: 0.8,
          roughness: 0.2,
        }), // left
        new THREE.MeshStandardMaterial({
          color: comp.color,
          metalness: 0.8,
          roughness: 0.2,
          emissive: comp.color,
          emissiveIntensity: 0.3,
        }), // top
        new THREE.MeshStandardMaterial({
          color: 0x111111,
          metalness: 0.8,
          roughness: 0.2,
        }), // bottom
        new THREE.MeshStandardMaterial({
          color: 0x111111,
          metalness: 0.8,
          roughness: 0.2,
        }), // front
        new THREE.MeshStandardMaterial({
          color: 0x111111,
          metalness: 0.8,
          roughness: 0.2,
        }), // back
      ]

      // Create mesh with materials
      const mesh = new THREE.Mesh(geometry, materials)
      mesh.position.set(comp.x, comp.y, comp.z)
      mesh.scale.set(scale, scale, scale)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData = {
        id: comp.id,
        type: "component",
        originalColor: comp.color,
        name: comp.name,
      }

      // Add glow effect
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: comp.color,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide,
      })

      const glowMesh = new THREE.Mesh(new THREE.BoxGeometry(width * 1.1, height * 1.5, depth * 1.1), glowMaterial)
      glowMesh.position.copy(mesh.position)
      glowMesh.scale.copy(mesh.scale)
      sceneRef.current.add(glowMesh)

      // Add to scene and store reference
      sceneRef.current.add(mesh)
      componentsRef.current[comp.id] = {
        mesh: mesh,
        glow: glowMesh,
      }

      // Create logo on the component
      createLogo(comp)

      // Create label (initially hidden)
      createLabel(comp, false)
    })
  }

  // Create logo for component
  const createLogo = (comp) => {
    if (!sceneRef.current) return

    // Create canvas for logo
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    canvas.width = 128
    canvas.height = 128

    // Draw background
    context.fillStyle = "rgba(0, 0, 0, 0)"
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Draw logo
    context.font = "80px Arial"
    context.fillStyle = "white"
    context.textAlign = "center"
    context.textBaseline = "middle"
    context.fillText(comp.logo, canvas.width / 2, canvas.height / 2)

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    // Create sprite material
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    })

    // Create sprite
    const sprite = new THREE.Sprite(material)
    sprite.position.set(comp.x, comp.y + 0.4, comp.z)
    sprite.scale.set(1, 1, 1)

    sceneRef.current.add(sprite)
  }

  // Create text labels for components (visible on hover)
  const createLabel = (comp, visible) => {
    if (!sceneRef.current) return

    // Create canvas for text
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    canvas.width = 256
    canvas.height = 64

    // Draw background with rounded corners
    context.fillStyle = "rgba(0, 0, 0, 0.7)"
    roundRect(context, 0, 0, canvas.width, canvas.height, 10, true)

    // Draw text
    context.font = "Bold 24px Arial"
    context.fillStyle = "white"
    context.textAlign = "center"
    context.textBaseline = "middle"
    context.fillText(comp.name, canvas.width / 2, canvas.height / 2)

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    // Create sprite material
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    })

    // Create sprite
    const sprite = new THREE.Sprite(material)
    sprite.position.set(comp.x, comp.y - 0.8, comp.z)
    sprite.scale.set(2, 1, 1)
    sprite.visible = visible // Initially hidden

    sceneRef.current.add(sprite)

    // Store reference to label
    labelsRef.current[comp.id] = sprite
  }

  // Helper function to draw rounded rectangles on canvas
  function roundRect(ctx, x, y, width, height, radius, fill) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    if (fill) {
      ctx.fill()
    }
  }

  // Create connections between components
  const createConnections = () => {
    if (!sceneRef.current) return

    connections.forEach((conn, index) => {
      const fromComp = components.find((c) => c.id === conn.from)
      const toComp = components.find((c) => c.id === conn.to)

      if (fromComp && toComp) {
        // Create line geometry
        const points = [
          new THREE.Vector3(fromComp.x, fromComp.y, fromComp.z),
          new THREE.Vector3(toComp.x, toComp.y, toComp.z),
        ]

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

        // Create glowing line material
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x00aaff,
          transparent: true,
          opacity: 0.6,
          linewidth: 1,
        })

        const line = new THREE.Line(lineGeometry, lineMaterial)
        line.userData = {
          from: conn.from,
          to: conn.to,
          type: "connection",
          points: points,
          originalColor: 0x00aaff,
        }

        sceneRef.current.add(line)

        // Add data particles along the connection
        addDataParticles(line, index)
      }
    })
  }

  // Add animated data particles along connections
  const addDataParticles = (line, index) => {
    if (!sceneRef.current) return

    const points = line.userData.points

    // Create particle geometry
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8)
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
    })

    // Create particles per connection
    for (let i = 0; i < 2; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial)

      // Set initial position
      particle.position.copy(points[0])

      particle.userData = {
        line: line,
        speed: 0.02 + Math.random() * 0.01,
        progress: i * 0.5, // Stagger particles
        points: points,
        delay: index * 0.1, // Stagger different connections
      }

      sceneRef.current.add(particle)
    }
  }

  // Update particle positions
  const updateParticles = () => {
    if (!sceneRef.current) return

    const time = clockRef.current.getElapsedTime()

    sceneRef.current.traverse((object) => {
      if (object.geometry && object.geometry.type === "SphereGeometry" && object.userData.line) {
        // Only start moving after delay
        if (time < object.userData.delay) return

        // Update progress
        object.userData.progress += object.userData.speed
        if (object.userData.progress > 1) {
          object.userData.progress = 0
        }

        // Calculate position based on progress
        const points = object.userData.points
        object.position.lerpVectors(points[0], points[1], object.userData.progress)

        // Pulse effect
        const pulse = Math.sin(time * 5 + object.userData.progress * 10) * 0.5 + 0.5
        object.material.opacity = 0.5 + pulse * 0.5
        object.scale.setScalar(0.8 + pulse * 0.4)
      }
    })
  }

  // Handle hover effects
  const handleHover = () => {
    if (!raycasterRef.current || !cameraRef.current || !sceneRef.current) return

    // Update the raycaster
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)

    // Find intersected objects
    const intersects = raycasterRef.current.intersectObjects(
      Object.values(componentsRef.current).map((comp) => comp.mesh),
    )

    // Reset previously hovered component
    if (hoveredRef.current && (!intersects.length || intersects[0].object !== hoveredRef.current)) {
      const component = componentsRef.current[hoveredRef.current.userData.id]
      if (component && component.glow) {
        component.glow.material.opacity = 0.2
        component.glow.scale.set(1, 1, 1)
      }

      // Hide label
      const label = labelsRef.current[hoveredRef.current.userData.id]
      if (label) {
        label.visible = false
      }

      hoveredRef.current = null

      // Reset all connections
      resetConnections()
    }

    // Set new hovered component
    if (intersects.length > 0) {
      const object = intersects[0].object

      if (object.userData.type === "component") {
        hoveredRef.current = object

        // Enhance glow effect
        const component = componentsRef.current[object.userData.id]
        if (component && component.glow) {
          component.glow.material.opacity = 0.6
          component.glow.scale.set(1.1, 1.1, 1.1)
        }

        // Show label
        const label = labelsRef.current[object.userData.id]
        if (label) {
          label.visible = true
        }

        // Highlight connected components
        highlightConnections(object.userData.id)
      }
    }
  }

  // Reset all connections to default state
  const resetConnections = () => {
    if (!sceneRef.current) return

    sceneRef.current.traverse((object) => {
      if (object.userData.type === "connection") {
        object.material.opacity = 0.6
        object.material.color.set(object.userData.originalColor)
      }
    })
  }

  // Highlight connections for a component
  const highlightConnections = (componentId) => {
    if (!sceneRef.current) return

    sceneRef.current.traverse((object) => {
      if (object.userData.type === "connection") {
        if (object.userData.from === componentId || object.userData.to === componentId) {
          object.material.opacity = 1
          object.material.color.set(0x00ffff)
        } else {
          object.material.opacity = 0.2
          object.material.color.set(0x444444)
        }
      }
    })
  }

  // Animation loop
  const animate = () => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current || !controlsRef.current) return

    animationFrameRef.current = requestAnimationFrame(animate)

    // Update controls
    controlsRef.current.update()

    // Update particles
    updateParticles()

    // Handle hover effects
    handleHover()

    // Animate glow effects
    const time = clockRef.current.getElapsedTime()
    Object.values(componentsRef.current).forEach((component) => {
      if (component.glow && component.mesh !== hoveredRef.current) {
        const pulse = Math.sin(time + component.mesh.position.x + component.mesh.position.y) * 0.5 + 0.5
        component.glow.material.opacity = 0.1 + pulse * 0.1
      }
    })

    // Render scene
    rendererRef.current.render(sceneRef.current, cameraRef.current)
  }

  return <div ref={containerRef} className="w-full h-full" />
}
