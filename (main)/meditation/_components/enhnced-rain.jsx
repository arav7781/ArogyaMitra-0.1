"use client"

import { useRef, useEffect } from "react"

const EnhancedRain = ({ intensity = 1, color = "#b3cde0", lightning = false }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Rain drop class
    class Drop {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * -100
        this.length = Math.random() * 20 + 10
        this.speed = Math.random() * 10 + 5
        this.thickness = Math.random() * 2 + 1
        this.opacity = Math.random() * 0.3 + 0.1
      }

      update() {
        this.y += this.speed
        if (this.y > canvas.height) {
          this.reset()
        }
      }

      draw() {
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x, this.y + this.length)
        ctx.strokeStyle = `rgba(${Number.parseInt(color.slice(1, 3), 16)}, ${Number.parseInt(color.slice(3, 5), 16)}, ${Number.parseInt(color.slice(5, 7), 16)}, ${this.opacity})`
        ctx.lineWidth = this.thickness
        ctx.stroke()
      }
    }

    // Splash class
    class Splash {
      constructor(x, y) {
        this.x = x
        this.y = y
        this.radius = Math.random() * 3 + 1
        this.maxRadius = Math.random() * 10 + 5
        this.speed = Math.random() * 0.5 + 0.2
        this.opacity = 0.7
      }

      update() {
        this.radius += this.speed
        this.opacity -= 0.02
        return this.opacity > 0
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${Number.parseInt(color.slice(1, 3), 16)}, ${Number.parseInt(color.slice(3, 5), 16)}, ${Number.parseInt(color.slice(5, 7), 16)}, ${this.opacity})`
        ctx.stroke()
      }
    }

    // Create drops
    const dropCount = Math.floor(200 * intensity)
    const drops = Array.from({ length: dropCount }, () => new Drop())
    const splashes = []

    // Lightning effect
    let lightningAlpha = 0
    let lightningTimer = 0

    const createLightning = () => {
      if (!lightning) return
      lightningAlpha = 0.8
      lightningTimer = Math.random() * 5000 + 2000 // 2-7 seconds between lightning
    }

    // Initial lightning
    if (lightning) {
      createLightning()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw lightning flash
      if (lightningAlpha > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${lightningAlpha})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        lightningAlpha -= 0.05
      }

      // Update and draw drops
      drops.forEach((drop) => {
        drop.update()
        drop.draw()

        // Create splash when drop hits bottom
        if (drop.y + drop.length >= canvas.height && Math.random() > 0.95) {
          splashes.push(new Splash(drop.x, canvas.height))
        }
      })

      // Update and draw splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        if (!splashes[i].update()) {
          splashes.splice(i, 1)
        } else {
          splashes[i].draw()
        }
      }

      // Lightning timer
      if (lightning && lightningTimer > 0) {
        lightningTimer -= 16 // Approx 16ms per frame at 60fps
        if (lightningTimer <= 0) {
          createLightning()
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [intensity, color, lightning])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}

export default EnhancedRain
