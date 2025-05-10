"use client"
import { useEffect, useState } from "react"
import CircuitDiagram from "./circuit"
import "./hero.css"

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading delay for animation
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="hero-section">
      {/* 3D Circuit diagram as background */}
      <div className="circuit-container">
        <CircuitDiagram />
      </div>

      {/* Overlay gradient */}
      <div className="overlay-gradient"></div>

      {/* Content overlay */}
      <div className={`content-overlay ${isLoaded ? "content-loaded" : "content-loading"}`}>
        <div className="badge">NEXT GENERATION PLATFORM</div>

        <h1 className="title">ArogyaMitra</h1>

        <h2 className="subtitle">Intelligent Healthcare Companion</h2>

        <p className="description">
          Revolutionizing healthcare with AI-powered assistance, real-time monitoring, and personalized health insights
          through our integrated platform.
        </p>

        <div className="button-container">
          <button className="button-primary">
            Get Started
            <svg
              className="arrow-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button className="button-secondary">Learn More</button>
        </div>

        <div className="stats-container">
          <div className="stat">
            <div className="stat-value">99%</div>
            <div className="stat-label">Accuracy</div>
          </div>

          <div className="divider"></div>

          <div className="stat">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Support</div>
          </div>

          <div className="divider"></div>

          <div className="stat">
            <div className="stat-value">100+</div>
            <div className="stat-label">Integrations</div>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="bottom-gradient"></div>
    </section>
  )
}
