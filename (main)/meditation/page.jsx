"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import {
  AlertCircle,
  CloudRain,
  Flame,
  Moon,
  Play,
  Pause,
  Sun,
  Volume2,
  VolumeX,
  ArrowLeft,
  BookOpen,
  Wind,
  Waves,
  Sparkles,
  BarChart,
  MessageSquare,
  Timer,
  Target,
  BedDouble,
  Lightbulb,
  Wand2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Lightning from "./_components/lightining"
import EnhancedRain from "./_components/enhnced-rain"

// Animated Background Component
const AnimatedBackground = ({ mood }) => {
  const backgrounds = {
    Anxious: {
      gradient: "linear-gradient(135deg, #d4a5d4 0%, #a3bffa 100%)",
      animation: "forest",
    },
    Sad: {
      gradient: "linear-gradient(135deg, #b3cde0 0%, #6497b1 100%)",
      animation: "rain",
    },
    Angry: {
      gradient: "linear-gradient(135deg, #f4b7b7 0%, #de5b6d 100%)",
      animation: "fire",
    },
    Happy: {
      gradient: "linear-gradient(135deg, #f7e4bc 0%, #f9c74f 100%)",
      animation: "sun",
    },
    Sleepy: {
      gradient: "linear-gradient(135deg, #a3bffa 0%, #4a4e69 100%)",
      animation: "stars",
    },
    default: {
      gradient: "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)",
      animation: "default",
    },
  }

  const bg = mood ? backgrounds[mood] : backgrounds.default

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      style={{
        background: bg.gradient,
        transition: "background 1s ease",
      }}
    >
      {bg.animation === "rain" && (
        <div className="relative w-full h-full">
          <EnhancedRain intensity={1.2} color="#b3cde0" lightning={true} />
          <div className="absolute inset-0 z-10">
            <Lightning hue={220} intensity={0.5} speed={0.5} />
          </div>
        </div>
      )}
      {bg.animation === "forest" && <ForestEffect />}
      {bg.animation === "fire" && <FireEffect />}
      {bg.animation === "sun" && <SunEffect />}
      {bg.animation === "stars" && <StarsEffect />}
    </div>
  )
}

// Animation Effects
const ForestEffect = () => (
  <div className="forest-container">
    {Array.from({ length: 50 }).map((_, i) => (
      <div
        key={i}
        className="leaf"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 10 + 10}s`,
          animationDelay: `${Math.random() * 5}s`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }}
      ></div>
    ))}
    <div className="fog-layer"></div>
  </div>
)

const FireEffect = () => (
  <div className="fire-container">
    <div className="fire-center"></div>
    {Array.from({ length: 50 }).map((_, i) => (
      <div
        key={i}
        className="ember"
        style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      ></div>
    ))}
  </div>
)

const SunEffect = () => (
  <div className="sun-container">
    <div className="sun"></div>
    <div className="sun-rays"></div>
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="cloud"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 30 + 10}%`,
          animationDuration: `${Math.random() * 100 + 50}s`,
          opacity: Math.random() * 0.5 + 0.2,
          transform: `scale(${Math.random() * 0.5 + 0.5})`,
        }}
      ></div>
    ))}
  </div>
)

const StarsEffect = () => (
  <div className="stars-container">
    {Array.from({ length: 100 }).map((_, i) => (
      <div
        key={i}
        className="star"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 1}s`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      ></div>
    ))}
    <div className="moon"></div>
    <div className="moon-glow"></div>
  </div>
)

// Breathing Animation Component
const BreathingAnimation = ({ pattern, isActive }) => {
  const [phase, setPhase] = useState("inhale")
  const [count, setCount] = useState(0)

  const patterns = {
    box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    calm: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    relaxing: { inhale: 6, hold1: 0, exhale: 6, hold2: 0 },
  }

  const currentPattern = patterns[pattern]

  useEffect(() => {
    if (!isActive) return

    const timer = setTimeout(() => {
      if (phase === "inhale" && count >= currentPattern.inhale) {
        setPhase(currentPattern.hold1 > 0 ? "hold1" : "exhale")
        setCount(0)
      } else if (phase === "hold1" && count >= currentPattern.hold1) {
        setPhase("exhale")
        setCount(0)
      } else if (phase === "exhale" && count >= currentPattern.exhale) {
        setPhase(currentPattern.hold2 > 0 ? "hold2" : "inhale")
        setCount(0)
      } else if (phase === "hold2" && count >= currentPattern.hold2) {
        setPhase("inhale")
        setCount(0)
      } else {
        setCount(count + 1)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [count, phase, pattern, isActive, currentPattern])

  const getInstructions = () => {
    switch (phase) {
      case "inhale":
        return "Inhale"
      case "hold1":
        return "Hold"
      case "exhale":
        return "Exhale"
      case "hold2":
        return "Hold"
      default:
        return ""
    }
  }

  const getProgress = () => {
    const max = currentPattern[phase]
    return (count / max) * 100
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-48 h-48">
        <div
          className={`absolute inset-0 rounded-full transition-all duration-1000 flex items-center justify-center ${
            phase === "inhale"
              ? "bg-blue-400/30 scale-100"
              : phase === "exhale"
                ? "bg-indigo-400/30 scale-50"
                : "bg-purple-400/30"
          }`}
        >
          <div
            className={`w-32 h-32 rounded-full transition-all duration-1000 flex items-center justify-center ${
              phase === "inhale"
                ? "bg-blue-500/40 scale-100"
                : phase === "exhale"
                  ? "bg-indigo-500/40 scale-50"
                  : "bg-purple-500/40"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full transition-all duration-1000 flex items-center justify-center text-white font-medium ${
                phase === "inhale"
                  ? "bg-blue-600/50 scale-100"
                  : phase === "exhale"
                    ? "bg-indigo-600/50 scale-50"
                    : "bg-purple-600/50"
              }`}
            >
              {getInstructions()}
            </div>
          </div>
        </div>
      </div>
      <Progress value={getProgress()} className="w-48" />
      <div className="text-sm text-white/70">
        {count} / {currentPattern[phase]}s
      </div>
    </div>
  )
}

// Flower Breathing Animation
const FlowerBreathingAnimation = ({ isActive }) => {
  const [scale, setScale] = useState(0.5)
  const [phase, setPhase] = useState("inhale")

  useEffect(() => {
    if (!isActive) return

    const breatheIn = () => {
      setPhase("inhale")
      const interval = setInterval(() => {
        setScale((prev) => {
          const newScale = prev + 0.01
          if (newScale >= 1) {
            clearInterval(interval)
            setTimeout(breatheOut, 4000) // Hold at full expansion
            return 1
          }
          return newScale
        })
      }, 50)
      return () => clearInterval(interval)
    }

    const breatheOut = () => {
      setPhase("exhale")
      const interval = setInterval(() => {
        setScale((prev) => {
          const newScale = prev - 0.01
          if (newScale <= 0.5) {
            clearInterval(interval)
            setTimeout(breatheIn, 2000) // Hold at contraction
            return 0.5
          }
          return newScale
        })
      }, 50)
      return () => clearInterval(interval)
    }

    const cleanup = breatheIn()
    return () => cleanup()
  }, [isActive])

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-lg font-medium">{phase === "inhale" ? "Breathe In" : "Breathe Out"}</div>
      </div>
      <div className="absolute inset-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 45} 50 50)`} style={{ transformOrigin: "center" }}>
              <path
                d={`M50,50 Q60,${30 + scale * 30} 50,${10 + scale * 20} Q40,${30 + scale * 30} 50,50`}
                fill={`rgba(255, 255, 255, ${0.2 + scale * 0.3})`}
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="0.5"
              />
            </g>
          ))}
          <circle cx="50" cy="50" r={5 + scale * 5} fill="rgba(255, 255, 255, 0.8)" />
        </svg>
      </div>
    </div>
  )
}

// Sound Layer Mixer Component
const SoundLayerMixer = ({ onLayerChange }) => {
  const [layers, setLayers] = useState({
    rain: { active: false, volume: 0.5, src: "/sounds/rain.mp3" },
    wind: { active: false, volume: 0.5, src: "/sounds/wind.mp3" },
    fire: { active: false, volume: 0.5, src: "/sounds/fire.mp3" },
    birds: { active: false, volume: 0.5, src: "/sounds/birds.mp3" },
    waves: { active: false, volume: 0.5, src: "/sounds/ocean.mp3" },
  })

  const audioRefs = useRef({})

  useEffect(() => {
    // Initialize audio elements
    Object.entries(layers).forEach(([key, layer]) => {
      if (!audioRefs.current[key]) {
        const audio = new Audio(layer.src)
        audio.loop = true
        audio.volume = layer.volume
        audioRefs.current[key] = audio
      }
    })

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause()
      })
    }
  }, [])

  useEffect(() => {
    // Update audio playback based on active state
    Object.entries(layers).forEach(([key, layer]) => {
      const audio = audioRefs.current[key]
      if (audio) {
        if (layer.active) {
          audio.play().catch((e) => console.log("Audio play error:", e))
        } else {
          audio.pause()
        }
        audio.volume = layer.volume
      }
    })
  }, [layers])

  const toggleLayer = (layerName) => {
    setLayers((prev) => ({
      ...prev,
      [layerName]: {
        ...prev[layerName],
        active: !prev[layerName].active,
      },
    }))
  }

  const updateVolume = (layerName, volume) => {
    setLayers((prev) => ({
      ...prev,
      [layerName]: {
        ...prev[layerName],
        volume,
      },
    }))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white mb-2">Sound Layer Mixer</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Button
            variant={layers.rain.active ? "default" : "outline"}
            className={
              layers.rain.active
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 border-none"
                : "bg-white/10 border-none hover:bg-white/20"
            }
            onClick={() => toggleLayer("rain")}
          >
            <CloudRain className="h-4 w-4 mr-2" />
            Rain
          </Button>
          <Slider
            disabled={!layers.rain.active}
            value={[layers.rain.volume]}
            max={1}
            step={0.01}
            onValueChange={(value) => updateVolume("rain", value[0])}
            className="w-32"
          />
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant={layers.wind.active ? "default" : "outline"}
            className={
              layers.wind.active
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-none"
                : "bg-white/10 border-none hover:bg-white/20"
            }
            onClick={() => toggleLayer("wind")}
          >
            <Wind className="h-4 w-4 mr-2" />
            Wind
          </Button>
          <Slider
            disabled={!layers.wind.active}
            value={[layers.wind.volume]}
            max={1}
            step={0.01}
            onValueChange={(value) => updateVolume("wind", value[0])}
            className="w-32"
          />
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant={layers.fire.active ? "default" : "outline"}
            className={
              layers.fire.active
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-none"
                : "bg-white/10 border-none hover:bg-white/20"
            }
            onClick={() => toggleLayer("fire")}
          >
            <Flame className="h-4 w-4 mr-2" />
            Fire
          </Button>
          <Slider
            disabled={!layers.fire.active}
            value={[layers.fire.volume]}
            max={1}
            step={0.01}
            onValueChange={(value) => updateVolume("fire", value[0])}
            className="w-32"
          />
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant={layers.birds.active ? "default" : "outline"}
            className={
              layers.birds.active
                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-none"
                : "bg-white/10 border-none hover:bg-white/20"
            }
            onClick={() => toggleLayer("birds")}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Birds
          </Button>
          <Slider
            disabled={!layers.birds.active}
            value={[layers.birds.volume]}
            max={1}
            step={0.01}
            onValueChange={(value) => updateVolume("birds", value[0])}
            className="w-32"
          />
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant={layers.waves.active ? "default" : "outline"}
            className={
              layers.waves.active
                ? "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 border-none"
                : "bg-white/10 border-none hover:bg-white/20"
            }
            onClick={() => toggleLayer("waves")}
          >
            <Waves className="h-4 w-4 mr-2" />
            Waves
          </Button>
          <Slider
            disabled={!layers.waves.active}
            value={[layers.waves.volume]}
            max={1}
            step={0.01}
            onValueChange={(value) => updateVolume("waves", value[0])}
            className="w-32"
          />
        </div>
      </div>
    </div>
  )
}

// Progressive Relaxation Component
const ProgressiveRelaxation = () => {
  const [activeMode, setActiveMode] = useState(null)
  const [countdown, setCountdown] = useState(null)
  const countdownRef = useRef(null)

  const startCountdown = (minutes) => {
    if (countdownRef.current) clearInterval(countdownRef.current)

    const seconds = minutes * 60
    setCountdown(seconds)

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white mb-2">Progressive Relaxation</h3>

      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="outline"
          className="justify-start bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 border-none"
          onClick={() => setActiveMode(activeMode === "tension" ? null : "tension")}
        >
          <Target className="h-4 w-4 mr-2" />
          Tension Release
        </Button>

        <Button
          variant="outline"
          className="justify-start bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border-none"
          onClick={() => setActiveMode(activeMode === "focus" ? null : "focus")}
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Focus Bubble
        </Button>

        <Button
          variant="outline"
          className="justify-start bg-gradient-to-r from-indigo-500/20 to-violet-500/20 hover:from-indigo-500/30 hover:to-violet-500/30 border-none"
          onClick={() => {
            setActiveMode(activeMode === "sleep" ? null : "sleep")
            if (activeMode !== "sleep") startCountdown(10)
          }}
        >
          <BedDouble className="h-4 w-4 mr-2" />
          Sleep Countdown
        </Button>
      </div>

      {activeMode === "tension" && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-md">
          <h4 className="text-white mb-3 font-medium">Tension Release</h4>
          <div className="space-y-2">
            <div className="flex items-center p-2 bg-white/10 rounded-md">
              <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center mr-3">
                <span className="text-white font-medium">1</span>
              </div>
              <p className="text-white/80">Tense your shoulders for 5 seconds</p>
            </div>
            <div className="flex items-center p-2 bg-white/10 rounded-md">
              <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center mr-3">
                <span className="text-white font-medium">2</span>
              </div>
              <p className="text-white/80">Release and feel the relaxation</p>
            </div>
            <div className="flex items-center p-2 bg-white/10 rounded-md">
              <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center mr-3">
                <span className="text-white font-medium">3</span>
              </div>
              <p className="text-white/80">Move to your arms, then hands...</p>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 animate-tension-progress"></div>
            </div>
          </div>
        </div>
      )}

      {activeMode === "focus" && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md flex justify-center">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 animate-pulse"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-500/40 to-cyan-500/40 animate-pulse animation-delay-300"></div>
            <div className="absolute inset-8 rounded-full bg-gradient-to-r from-blue-500/50 to-cyan-500/50 animate-pulse animation-delay-600"></div>
            <div className="absolute inset-12 rounded-full bg-gradient-to-r from-blue-500/60 to-cyan-500/60 flex items-center justify-center">
              <span className="text-white text-sm font-medium">Focus</span>
            </div>
          </div>
        </div>
      )}

      {activeMode === "sleep" && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-500/20 to-violet-500/20 backdrop-blur-md">
          <h4 className="text-white mb-3 font-medium">Sleep Countdown</h4>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-white mb-3 bg-white/10 px-6 py-3 rounded-lg">
              {formatTime(countdown)}
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button
                size="sm"
                onClick={() => startCountdown(5)}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 border-none"
              >
                5 min
              </Button>
              <Button
                size="sm"
                onClick={() => startCountdown(10)}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 border-none"
              >
                10 min
              </Button>
              <Button
                size="sm"
                onClick={() => startCountdown(20)}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 border-none"
              >
                20 min
              </Button>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                style={{ width: `${(countdown / (10 * 60)) * 100}%`, transition: "width 1s linear" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// AI Mood Companion Component
const AIMoodCompanion = () => {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi there! How are you feeling today? 🌿" }])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const moodResponses = {
    anxious: [
      "I notice you're feeling anxious. Would you like to try a 2-minute breathing exercise? 🍃",
      "Anxiety can be challenging. Let's focus on what's in your control right now. 🌱",
      "I'm here with you. Would a guided meditation help ease your mind? 🧘‍♀️",
    ],
    sad: [
      "I'm sorry you're feeling down. Remember that emotions come and go like clouds. 🌧️",
      "Would you like to listen to some uplifting sounds to shift your energy? 🎵",
      "Sometimes sadness needs space. Would journaling help process what you're feeling? 📝",
    ],
    angry: [
      "I see you're feeling frustrated. Let's channel that energy constructively. 🔥",
      "Would a quick tension release exercise help you right now? 💪",
      "It's okay to feel angry. Would you like to try some cooling breaths? 💨",
    ],
    tired: [
      "Feeling tired is your body's way of asking for rest. What small break can you take? 🌙",
      "Would some gentle stretching help revitalize your energy? 🧠",
      "Sometimes a short power nap can work wonders. Would you like a 10-minute sleep timer? ⏱️",
    ],
    happy: [
      "That's wonderful! Let's amplify that positive feeling with a gratitude moment. ✨",
      "I'm so glad you're feeling good! Would you like to journal this moment? 📔",
      "Happiness looks good on you! How about some uplifting music to keep the vibe? 🎶",
    ],
  }

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])

    // Show typing indicator
    setIsTyping(true)

    // Generate response based on mood keywords
    setTimeout(() => {
      let response = "I'm here to support you. How can I help with your mood today? 🌿"

      const lowerInput = input.toLowerCase()
      if (
        lowerInput.includes("anxious") ||
        lowerInput.includes("anxiety") ||
        lowerInput.includes("nervous") ||
        lowerInput.includes("worry")
      ) {
        response = moodResponses.anxious[Math.floor(Math.random() * moodResponses.anxious.length)]
      } else if (
        lowerInput.includes("sad") ||
        lowerInput.includes("down") ||
        lowerInput.includes("depressed") ||
        lowerInput.includes("unhappy")
      ) {
        response = moodResponses.sad[Math.floor(Math.random() * moodResponses.sad.length)]
      } else if (
        lowerInput.includes("angry") ||
        lowerInput.includes("mad") ||
        lowerInput.includes("frustrated") ||
        lowerInput.includes("upset")
      ) {
        response = moodResponses.angry[Math.floor(Math.random() * moodResponses.angry.length)]
      } else if (
        lowerInput.includes("tired") ||
        lowerInput.includes("exhausted") ||
        lowerInput.includes("sleepy") ||
        lowerInput.includes("fatigue")
      ) {
        response = moodResponses.tired[Math.floor(Math.random() * moodResponses.tired.length)]
      } else if (
        lowerInput.includes("happy") ||
        lowerInput.includes("good") ||
        lowerInput.includes("great") ||
        lowerInput.includes("joy")
      ) {
        response = moodResponses.happy[Math.floor(Math.random() * moodResponses.happy.length)]
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsTyping(false)
    }, 1000)

    setInput("")
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white mb-2">AI Mood Companion</h3>

      <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-md rounded-lg p-3 h-64 overflow-y-auto flex flex-col space-y-3">
        {messages.map((message, i) => (
          <div key={i} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  : "bg-gradient-to-r from-white/20 to-white/10 text-white"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-white/20 text-white">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 rounded-full bg-white/70 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-white/70 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-white/70 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="How are you feeling today?"
          className="flex-1 bg-gradient-to-r from-white/10 to-white/5 border-none rounded-lg p-2 text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500"
        />
        <Button
          onClick={handleSend}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Mood-to-Action Recommender Component
const MoodToActionRecommender = ({ mood }) => {
  const recommendations = {
    Anxious: {
      title: "Calm & Center",
      steps: [
        { icon: <Wind className="h-4 w-4" />, text: "2-minute guided breathing" },
        { icon: <Waves className="h-4 w-4" />, text: "Nature sounds (forest birds)" },
        { icon: <BookOpen className="h-4 w-4" />, text: "Journal: 'What's in my control?'" },
      ],
      color: "from-purple-500 to-blue-500",
    },
    Sad: {
      title: "Gentle Comfort",
      steps: [
        { icon: <CloudRain className="h-4 w-4" />, text: "Rain sounds + warm visuals" },
        { icon: <MessageSquare className="h-4 w-4" />, text: "Positive affirmations" },
        { icon: <Sun className="h-4 w-4" />, text: "Light therapy visualization" },
      ],
      color: "from-blue-500 to-cyan-500",
    },
    Angry: {
      title: "Cool & Transform",
      steps: [
        { icon: <Flame className="h-4 w-4" />, text: "Tension release exercise" },
        { icon: <Waves className="h-4 w-4" />, text: "Waterfall sounds" },
        { icon: <BookOpen className="h-4 w-4" />, text: "Journal: 'What's beneath this?'" },
      ],
      color: "from-red-500 to-orange-500",
    },
    Happy: {
      title: "Amplify Joy",
      steps: [
        { icon: <Sun className="h-4 w-4" />, text: "Gratitude visualization" },
        { icon: <Sparkles className="h-4 w-4" />, text: "Uplifting music" },
        { icon: <BookOpen className="h-4 w-4" />, text: "Journal: 'Capture this moment'" },
      ],
      color: "from-yellow-400 to-orange-400",
    },
    Sleepy: {
      title: "Restful Transition",
      steps: [
        { icon: <Moon className="h-4 w-4" />, text: "Sleep breathing pattern" },
        { icon: <Volume2 className="h-4 w-4" />, text: "White noise" },
        { icon: <BedDouble className="h-4 w-4" />, text: "Sleep countdown timer" },
      ],
      color: "from-blue-600 to-indigo-700",
    },
  }

  const rec = mood ? recommendations[mood] : null

  if (!rec) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white mb-2">Recommended Therapy Flow</h3>

      <div className={`p-4 rounded-lg bg-gradient-to-r ${rec.color}`}>
        <h4 className="text-white font-medium mb-3">{rec.title}</h4>
        <div className="space-y-2">
          {rec.steps.map((step, i) => (
            <div
              key={i}
              className="flex items-center bg-white/10 p-2 rounded-md backdrop-blur-sm transform transition-all duration-300 hover:scale-105"
            >
              <div className="mr-3 bg-white/20 p-1.5 rounded-full">{step.icon}</div>
              <span className="text-white/90">{step.text}</span>
            </div>
          ))}
        </div>
        <Button className="w-full mt-3 bg-white/20 hover:bg-white/30 border-none transform transition-all duration-300 hover:scale-105">
          Start Flow
        </Button>
      </div>
    </div>
  )
}

// Mood Selection Component (replacing 3D scene)
const MoodSelector = ({ onMoodSelect, selectedMood }) => {
  const moods = [
    { emoji: "😰", label: "Anxious", color: "from-purple-500 to-blue-500", bgColor: "from-purple-100 to-blue-100" },
    { emoji: "😔", label: "Sad", color: "from-blue-500 to-cyan-500", bgColor: "from-blue-100 to-cyan-100" },
    { emoji: "😠", label: "Angry", color: "from-red-500 to-orange-500", bgColor: "from-red-100 to-orange-100" },
    { emoji: "😊", label: "Happy", color: "from-yellow-400 to-orange-400", bgColor: "from-yellow-100 to-orange-100" },
    { emoji: "😴", label: "Sleepy", color: "from-blue-600 to-indigo-700", bgColor: "from-blue-100 to-indigo-100" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-4xl mx-auto">
      {moods.map((mood) => (
        <motion.div
          key={mood.label}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative cursor-pointer rounded-xl overflow-hidden shadow-xl ${
            selectedMood === mood.label ? "ring-4 ring-white" : ""
          }`}
          onClick={() => onMoodSelect(mood.label)}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-80`}></div>
          <div className="relative p-6 flex flex-col items-center justify-center">
            <span className="text-6xl mb-4">{mood.emoji}</span>
            <span className="text-white font-medium text-lg">{mood.label}</span>
            {selectedMood === mood.label && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 bg-white rounded-full p-1"
              >
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Therapy Options Component
const TherapyOptions = ({ mood, onReset, onLogMood }) => {
  const [activeTab, setActiveTab] = useState("sounds")
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [sessionTime, setSessionTime] = useState(null)
  const [breathingPattern, setBreathingPattern] = useState("box")
  const [journalEntry, setJournalEntry] = useState("")
  const [showEmergencyMode, setShowEmergencyMode] = useState(false)
  const audioRef = useRef(null)
  const timerRef = useRef(null)

  const therapyMap = {
    Anxious: {
      sounds: [
        { name: "Forest Birds", src: "/sounds/forest_birds.mp3", icon: <Wind className="h-5 w-5" /> },
        { name: "Gentle Stream", src: "/sounds/stream.mp3", icon: <Waves className="h-5 w-5" /> },
        { name: "Wind Chimes", src: "/sounds/wind_chimes.mp3", icon: <Wind className="h-5 w-5" /> },
      ],
      meditations: [
        { name: "1-Minute Calm", duration: 1, src: "/meditations/anxious_1min.mp3" },
        { name: "3-Minute Grounding", duration: 3, src: "/meditations/anxious_3min.mp3" },
        { name: "5-Minute Relief", duration: 5, src: "/meditations/anxious_5min.mp3" },
      ],
      messages: [
        "This feeling is temporary and will pass.",
        "Focus on what you can control right now.",
        "Your anxiety is not a reflection of reality.",
        "Take one small step at a time.",
      ],
      color: "#d4a5d4",
      icon: <Wind className="h-8 w-8" />,
      voice: "I sense some tension. Let's find calm together.",
      gradient: "from-purple-500 to-blue-500",
    },
    Sad: {
      sounds: [
        { name: "Gentle Rain", src: "/sounds/rain.mp3", icon: <CloudRain className="h-5 w-5" /> },
        { name: "Ocean Waves", src: "/sounds/ocean.mp3", icon: <Waves className="h-5 w-5" /> },
        { name: "Soft Piano", src: "/sounds/piano.mp3", icon: <Sparkles className="h-5 w-5" /> },
      ],
      meditations: [
        { name: "1-Minute Comfort", duration: 1, src: "/meditations/sad_1min.mp3" },
        { name: "3-Minute Acceptance", duration: 3, src: "/meditations/sad_3min.mp3" },
        { name: "5-Minute Healing", duration: 5, src: "/meditations/sad_5min.mp3" },
      ],
      messages: [
        "It's okay to feel your emotions fully.",
        "This sadness is teaching you something valuable.",
        "You've moved through difficult feelings before.",
        "Be gentle with yourself today.",
      ],
      color: "#b3cde0",
      icon: <CloudRain className="h-8 w-8" />,
      voice: "It's okay to feel heavy. I'm here with you.",
      gradient: "from-blue-500 to-cyan-500",
    },
    Angry: {
      sounds: [
        { name: "Waterfall", src: "/sounds/waterfall.mp3", icon: <Waves className="h-5 w-5" /> },
        { name: "Thunder Storm", src: "/sounds/thunder.mp3", icon: <CloudRain className="h-5 w-5" /> },
        { name: "Crackling Fire", src: "/sounds/fire.mp3", icon: <Flame className="h-5 w-5" /> },
      ],
      meditations: [
        { name: "1-Minute Cooling", duration: 1, src: "/meditations/angry_1min.mp3" },
        { name: "3-Minute Release", duration: 3, src: "/meditations/angry_3min.mp3" },
        { name: "5-Minute Transform", duration: 5, src: "/meditations/angry_5min.mp3" },
      ],
      messages: [
        "Your anger is valid, but it doesn't need to control you.",
        "Breathe through the heat of this emotion.",
        "What's beneath this anger that needs your attention?",
        "This energy can be channeled constructively.",
      ],
      color: "#f4b7b7",
      icon: <Flame className="h-8 w-8" />,
      voice: "Let's cool those flames with some breathing.",
      gradient: "from-red-500 to-orange-500",
    },
    Happy: {
      sounds: [
        { name: "Meadow Sounds", src: "/sounds/meadow.mp3", icon: <Sun className="h-5 w-5" /> },
        { name: "Cheerful Birds", src: "/sounds/birds.mp3", icon: <Wind className="h-5 w-5" /> },
        { name: "Uplifting Music", src: "/sounds/uplifting.mp3", icon: <Sparkles className="h-5 w-5" /> },
      ],
      meditations: [
        { name: "1-Minute Gratitude", duration: 1, src: "/meditations/happy_1min.mp3" },
        { name: "3-Minute Joy", duration: 3, src: "/meditations/happy_3min.mp3" },
        { name: "5-Minute Abundance", duration: 5, src: "/meditations/happy_5min.mp3" },
      ],
      messages: [
        "Savor this feeling of joy fully.",
        "Your happiness ripples out to those around you.",
        "Notice what brought you this feeling today.",
        "This moment is a gift - treasure it.",
      ],
      color: "#f7e4bc",
      icon: <Sun className="h-8 w-8" />,
      voice: "Your joy is infectious! Let's amplify it.",
      gradient: "from-yellow-400 to-orange-400",
    },
    Sleepy: {
      sounds: [
        { name: "White Noise", src: "/sounds/white_noise.mp3", icon: <Wind className="h-5 w-5" /> },
        { name: "Gentle Lullaby", src: "/sounds/lullaby.mp3", icon: <Moon className="h-5 w-5" /> },
        { name: "Night Sounds", src: "/sounds/night.mp3", icon: <Moon className="h-5 w-5" /> },
      ],
      meditations: [
        { name: "1-Minute Wind Down", duration: 1, src: "/meditations/sleepy_1min.mp3" },
        { name: "3-Minute Relaxation", duration: 3, src: "/meditations/sleepy_3min.mp3" },
        { name: "5-Minute Sleep Prep", duration: 5, src: "/meditations/sleepy_5min.mp3" },
      ],
      messages: [
        "Allow your body to rest deeply now.",
        "Each breath brings you closer to peaceful sleep.",
        "Release the day and embrace the night.",
        "Your mind and body deserve this rest.",
      ],
      color: "#a3bffa",
      icon: <Moon className="h-8 w-8" />,
      voice: "Ready to drift off? Let's prepare for restful sleep.",
      gradient: "from-blue-600 to-indigo-700",
    },
  }

  const therapy = therapyMap[mood]

  // Initialize audio
  useEffect(() => {
    if (therapy && activeTab === "sounds" && therapy.sounds.length > 0) {
      audioRef.current = new Audio(therapy.sounds[0].src)
      audioRef.current.volume = volume
      audioRef.current.loop = true
      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
      }
    }
  }, [therapy, activeTab, volume])

  // Log mood
  useEffect(() => {
    onLogMood(mood)
  }, [mood, onLogMood])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Micro-moment timer
  useEffect(() => {
    if (sessionTime) {
      timerRef.current = setTimeout(
        () => {
          if (audioRef.current) {
            audioRef.current.pause()
            setIsPlaying(false)
          }
          setSessionTime(null)
        },
        sessionTime * 60 * 1000,
      )
      return () => clearTimeout(timerRef.current)
    }
  }, [sessionTime])

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSoundSelect = (src) => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused
      audioRef.current.pause()
      audioRef.current = new Audio(src)
      audioRef.current.volume = volume
      audioRef.current.loop = true
      if (wasPlaying) {
        audioRef.current.play()
      }
    }
  }

  const handleVolumeChange = (value) => {
    setVolume(value[0])
  }

  const startMeditation = (duration, src) => {
    setSessionTime(duration)
    if (audioRef.current) {
      audioRef.current.pause()
    }
    audioRef.current = new Audio(src)
    audioRef.current.volume = volume
    audioRef.current.play()
    setIsPlaying(true)
  }

  const activateEmergencyMode = () => {
    setShowEmergencyMode(true)
    setActiveTab("breathing")
    setBreathingPattern("calm")
    if (audioRef.current) {
      audioRef.current.pause()
    }
    // Play calming sound
    audioRef.current = new Audio("/sounds/calm_emergency.mp3")
    audioRef.current.volume = volume
    audioRef.current.loop = true
    audioRef.current.play()
    setIsPlaying(true)
  }

  const exitEmergencyMode = () => {
    setShowEmergencyMode(false)
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const getRandomMessage = () => {
    const messages = therapy.messages
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return (
    <AnimatePresence>
      {showEmergencyMode ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-black/90 to-purple-900/90 flex flex-col items-center justify-center p-6 backdrop-blur-lg"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Emergency Relief Mode</h2>
            <p className="text-white/80">Focus on your breathing. You are safe.</p>
          </div>

          <FlowerBreathingAnimation isActive={true} />

          <div className="mt-8 text-center">
            <p className="text-xl text-white/90 italic mb-8 px-4 py-3 bg-white/10 rounded-lg backdrop-blur-md">
              {getRandomMessage()}
            </p>
            <Button
              onClick={exitEmergencyMode}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-none transform transition-all duration-300 hover:scale-105"
            >
              Exit Emergency Mode
            </Button>
          </div>
        </motion.div>
      ) : (
        <Card className="w-full max-w-md backdrop-blur-lg bg-black/40 border-none shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={onReset} className="mr-2 hover:bg-white/10 text-white">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="mr-2">{therapy.icon}</span>
                  {mood} Therapy
                </h2>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={activateEmergencyMode}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-none"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Emergency
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md mb-6">
              <p className="text-white/90 italic text-lg">{therapy.voice}</p>
            </div>

            <MoodToActionRecommender mood={mood} />

            <Tabs defaultValue="sounds" value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
                <TabsList className="grid grid-cols-5 mb-4 bg-white/10 p-1">
                  <TabsTrigger
                    value="sounds"
                    className="flex items-center justify-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Sounds</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="breathing"
                    className="flex items-center justify-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
                  >
                    <Wind className="h-4 w-4" />
                    <span className="hidden sm:inline">Breathing</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="meditations"
                    className="flex items-center justify-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
                  >
                    <Moon className="h-4 w-4" />
                    <span className="hidden sm:inline">Meditate</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="journal"
                    className="flex items-center justify-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Journal</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="tools"
                    className="flex items-center justify-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
                  >
                    <Wand2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Tools</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sounds" className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    {therapy.sounds.map((sound, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="flex items-center justify-start gap-2 bg-gradient-to-r from-white/10 to-white/5 border-none hover:from-white/15 hover:to-white/10 transform transition-all duration-300 hover:scale-105"
                        onClick={() => handleSoundSelect(sound.src)}
                      >
                        {sound.icon}
                        <span>{sound.name}</span>
                      </Button>
                    ))}
                  </div>

                <div className="flex flex-col space-y-4 p-4 rounded-lg bg-gradient-to-r from-white/10 to-white/5">
                  <Button
                    onClick={handlePlayPause}
                    variant="outline"
                    className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-none hover:from-purple-500/30 hover:to-indigo-500/30 transform transition-all duration-300 hover:scale-105"
                  >
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>

                  <div className="flex items-center space-x-4">
                    <VolumeX className="h-4 w-4 text-white/70" />
                    <Slider
                      defaultValue={[0.5]}
                      max={1}
                      step={0.01}
                      value={[volume]}
                      onValueChange={handleVolumeChange}
                      className="flex-1"
                    />
                    <Volume2 className="h-4 w-4 text-white/70" />
                  </div>
                </div>

                <SoundLayerMixer />
              </TabsContent>

              <TabsContent value="breathing" className="space-y-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <Button
                    variant={breathingPattern === "box" ? "default" : "outline"}
                    className={
                      breathingPattern === "box"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 border-none"
                        : "bg-white/10 border-none hover:bg-white/20"
                    }
                    onClick={() => setBreathingPattern("box")}
                  >
                    Box
                  </Button>
                  <Button
                    variant={breathingPattern === "calm" ? "default" : "outline"}
                    className={
                      breathingPattern === "calm"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-none"
                        : "bg-white/10 border-none hover:bg-white/20"
                    }
                    onClick={() => setBreathingPattern("calm")}
                  >
                    4-7-8
                  </Button>
                  <Button
                    variant={breathingPattern === "relaxing" ? "default" : "outline"}
                    className={
                      breathingPattern === "relaxing"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-none"
                        : "bg-white/10 border-none hover:bg-white/20"
                    }
                    onClick={() => setBreathingPattern("relaxing")}
                  >
                    Relaxing
                  </Button>
                </div>

                <div className="flex justify-center p-6 rounded-lg bg-gradient-to-r from-white/10 to-white/5">
                  <FlowerBreathingAnimation isActive={true} />
                </div>
              </TabsContent>

              <TabsContent value="meditations" className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {therapy.meditations.map((meditation, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start bg-gradient-to-r from-white/10 to-white/5 border-none hover:from-white/15 hover:to-white/10 transform transition-all duration-300 hover:scale-105"
                      onClick={() => startMeditation(meditation.duration, meditation.src)}
                    >
                      <Timer className="h-4 w-4 mr-2" />
                      <span>{meditation.name}</span>
                      <span className="ml-auto">{meditation.duration} min</span>
                    </Button>
                  ))}
                </div>

                {sessionTime && (
                  <div className="p-4 rounded-lg bg-gradient-to-r from-white/10 to-white/5 text-center">
                    <p className="text-white mb-2">Meditation in progress</p>
                    <Progress
                      value={
                        ((sessionTime * 60 - (timerRef.current ? timerRef.current._idleStart : 0)) /
                          (sessionTime * 60)) *
                        100
                      }
                      className="mb-2"
                    />
                    <p className="text-sm text-white/70">{sessionTime} minutes</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="journal" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-white/10 to-white/5">
                    <p className="text-white mb-2">Today's Reflection</p>
                    <p className="text-white/70 italic mb-4 p-3 bg-white/10 rounded-lg">{getRandomMessage()}</p>
                    <textarea
                      className="w-full h-24 p-2 rounded-md bg-gradient-to-r from-white/10 to-white/5 text-white border-none focus:ring-2 focus:ring-white/30"
                      placeholder="How are you feeling about this mood? What triggered it?"
                      value={journalEntry}
                      onChange={(e) => setJournalEntry(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-white/10 to-white/5">
                    <p className="text-white mb-2">Mood Calendar</p>
                    <Calendar mode="single" className="rounded-md border-none bg-white/5 text-white" />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-none transform transition-all duration-300 hover:scale-105">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Save Journal Entry
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="tools" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-4">
                    <AIMoodCompanion />
                  </div>
                  <div className="space-y-4">
                    <ProgressiveRelaxation />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      )}
    </AnimatePresence>
  )
}

// Mood Dashboard Component
const MoodDashboard = ({ logs, currentMood }) => {
  const [isOpen, setIsOpen] = useState(false)

  const getMoodEmoji = (mood) => {
    const emojiMap = {
      Anxious: "😰",
      Sad: "😔",
      Angry: "😠",
      Happy: "😊",
      Sleepy: "😴",
    }
    return emojiMap[mood] || "😐"
  }

  const getSuggestion = () => {
    // Simple suggestion engine based on mood patterns
    if (logs.length < 3) return null

    const moodCounts = logs.reduce((acc, log) => {
      acc[log.mood] = (acc[log.mood] || 0) + 1
      return acc
    }, {})

    const mostFrequentMood = Object.keys(moodCounts).reduce((a, b) => (moodCounts[a] > moodCounts[b] ? a : b), null)

    if (mostFrequentMood === "Anxious" && moodCounts["Anxious"] >= 2) {
      return "You've been feeling anxious lately. Would you like to try a 5-minute guided meditation?"
    } else if (mostFrequentMood === "Sad" && moodCounts["Sad"] >= 2) {
      return "I've noticed you've been feeling sad. Consider journaling about your feelings."
    } else if (mostFrequentMood === "Sleepy" && moodCounts["Sleepy"] >= 2) {
      return "You've been feeling sleepy often. Would you like to set a bedtime reminder?"
    }

    return null
  }

  const suggestion = getSuggestion()

  return (
    <Card className="absolute bottom-4 right-4 w-80 backdrop-blur-lg bg-gradient-to-br from-purple-900/90 via-fuchsia-900/90 to-blue-900/90 border-none shadow-xl ">
      <div className="p-4">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="w-full bg-gradient-to-r from-white/10 to-white/5 border-none hover:from-white/15 hover:to-white/10 flex items-center transform transition-all duration-300 hover:scale-105"
        >
          <BarChart className="h-4 w-4 mr-2" />
          {isOpen ? "Hide Dashboard" : "Mood Dashboard"}
        </Button>

        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4 overflow-hidden"
          >
            {currentMood && (
              <div className="p-3 rounded-lg bg-gradient-to-r from-white/10 to-white/5">
                <p className="text-white font-medium">Current Mood</p>
                <div className="flex items-center mt-2">
                  <span className="text-2xl mr-2">{getMoodEmoji(currentMood)}</span>
                  <span className="text-white/80">{currentMood}</span>
                </div>
              </div>
            )}

            <div className="p-3 rounded-lg bg-gradient-to-r from-white/10 to-white/5">
              <p className="text-white font-medium mb-2">Mood History</p>
              {logs.length > 0 ? (
                <ul className="space-y-2">
                  {logs.map((log, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-sm text-white/80 flex items-center p-2 bg-white/10 rounded-md"
                    >
                      <span className="mr-2">{getMoodEmoji(log.mood)}</span>
                      <span>{log.mood}</span>
                      <span className="ml-auto text-xs text-white/60">{log.time}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-white/60 italic">No moods logged yet.</p>
              )}
            </div>

            {suggestion && (
              <div className="p-3 rounded-lg bg-gradient-to-r from-white/10 to-white/5">
                <p className="text-white font-medium mb-1">Suggestion</p>
                <p className="text-sm text-white/80">{suggestion}</p>
                <Button className="w-full mt-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-none text-sm h-8 transform transition-all duration-300 hover:scale-105">
                  Try Now
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Card>
  )
}

// Main Component
export default function Page() {
  const [selectedMood, setSelectedMood] = useState(null)
  const [moodLogs, setMoodLogs] = useState([])

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
  }

  const resetMood = () => {
    setSelectedMood(null)
  }

  const onLogMood = useCallback((mood) => {
    const time = new Date().toLocaleTimeString()
    setMoodLogs((prev) => [...prev, { mood, time }].slice(-5))
  }, [])

  return (
    <div className="relative w-full h-screen scroll-smooth">
      <AnimatedBackground mood={selectedMood} />

      <div className="relative z-10 w-full h-full flex flex-col items-center">
        {!selectedMood ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10 mb-6 text-center"
            >
              <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MoodScape
              </h1>
              <p className="text-xl text-white/80">Let your mood shape your healing journey</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full px-4 py-8"
            >
              <MoodSelector selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />
            </motion.div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <TherapyOptions mood={selectedMood} onReset={resetMood} onLogMood={onLogMood} />
            <div className="ml-4 mb-4"><Button className="bg-gradient-to-r from-purple-500 to-pink-500" onClick={() => window.location.reload()}>
  Home
</Button></div>
          </div>
        )}
        <MoodDashboard logs={moodLogs} currentMood={selectedMood} />
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;700&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: #000;
          color: #fff;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        /* Rain Animation */
        .rain-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .raindrop {
          position: absolute;
          width: 2px;
          height: 20px;
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.6));
          top: -20px;
          animation: rain linear infinite;
        }
        
        @keyframes rain {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        /* Forest Animation */
        .forest-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .leaf {
          position: absolute;
          width: 15px;
          height: 15px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(255,255,255,0.1));
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          animation: float linear infinite;
        }
        
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translate(100px, 100px) rotate(360deg); opacity: 0; }
        }
        
        /* Fire Animation */
        .fire-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .fire-center {
          position: absolute;
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(255,150,50,0.8), rgba(255,50,0,0.4));
          border-radius: 50%;
          filter: blur(10px);
          animation: pulse 2s infinite alternate;
        }
        
        .ember {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(255,200,100,0.8), rgba(255,100,50,0.4));
          border-radius: 50%;
          bottom: 20%;
          animation: ember ease-out infinite;
        }
        
        @keyframes ember {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }
        
        @keyframes pulse {
          0% { transform: translateX(-50%) scale(1); opacity: 0.8; }
          100% { transform: translateX(-50%) scale(1.2); opacity: 1; }
        }
        
        /* Sun Animation */
        .sun-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .sun {
          position: absolute;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(255,200,100,1), rgba(255,150,50,0.8));
          border-radius: 50%;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 60px rgba(255,200,100,0.8);
          animation: pulse 5s infinite alternate;
        }
        
        .sun-rays {
          position: absolute;
          width: 140px;
          height: 140px;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(255,200,100,0.4) 30%, transparent 70%);
          border-radius: 50%;
          animation: rays 10s infinite linear;
        }
        
        .cloud {
          position: absolute;
          width: 100px;
          height: 40px;
          background: rgba(255,255,255,0.8);
          border-radius: 20px;
          animation: drift linear infinite;
        }
        
        @keyframes rays {
          0% { transform: translateX(-50%) rotate(0deg); }
          100% { transform: translateX(-50%) rotate(360deg); }
        }
        
        @keyframes drift {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        
        /* Stars Animation */
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle ease-in-out infinite;
        }
        
        .moon {
          position: absolute;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(200,200,255,0.8));
          border-radius: 50%;
          top: 15%;
          right: 15%;
          box-shadow: 0 0 20px rgba(255,255,255,0.4);
        }
        
        .moon-glow {
          position: absolute;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%);
          border-radius: 50%;
          top: 15%;
          right: 15%;
          transform: translate(20px, -20px);
        }
        
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0.2; transform: scale(1); }
        }
        
        /* Breathing Animation */
        @keyframes breathe {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.2); }
          100% { transform: scale(0.8); }
        }

        /* Tension Release Animation */
        @keyframes tension-progress {
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        /* Animation Delays */
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        
        /* Fog Layer */
        .fog-layer {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 30%;
          background: linear-gradient(to top, rgba(255,255,255,0.1), transparent);
          animation: fog 20s infinite alternate;
        }
        
        @keyframes fog {
          0% { opacity: 0.1; transform: translateY(0); }
          100% { opacity: 0.3; transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}
