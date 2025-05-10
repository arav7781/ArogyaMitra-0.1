"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CloudRain, Wind, Flame, Waves, Moon, Volume2, VolumeX, Play, Pause } from "lucide-react"

const SoundMixer = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [masterVolume, setMasterVolume] = useState(0.5)
  const [layers, setLayers] = useState([
    {
      id: "rain",
      name: "Rain",
      icon: <CloudRain className="h-4 w-4" />,
      src: "/sounds/rain.mp3",
      volume: 0.5,
      active: false,
      audio: null,
    },
    {
      id: "wind",
      name: "Wind",
      icon: <Wind className="h-4 w-4" />,
      src: "/sounds/wind.mp3",
      volume: 0.5,
      active: false,
      audio: null,
    },
    {
      id: "fire",
      name: "Fire",
      icon: <Flame className="h-4 w-4" />,
      src: "/sounds/fire.mp3",
      volume: 0.5,
      active: false,
      audio: null,
    },
    {
      id: "waves",
      name: "Ocean",
      icon: <Waves className="h-4 w-4" />,
      src: "/sounds/ocean.mp3",
      volume: 0.5,
      active: false,
      audio: null,
    },
    {
      id: "night",
      name: "Night",
      icon: <Moon className="h-4 w-4" />,
      src: "/sounds/night.mp3",
      volume: 0.5,
      active: false,
      audio: null,
    },
  ])

  // Initialize audio objects
  useEffect(() => {
    const updatedLayers = layers.map((layer) => {
      const audio = new Audio(layer.src)
      audio.loop = true
      audio.volume = layer.volume * masterVolume
      return { ...layer, audio }
    })

    setLayers(updatedLayers)

    return () => {
      // Cleanup audio objects
      updatedLayers.forEach((layer) => {
        if (layer.audio) {
          layer.audio.pause()
          layer.audio.src = ""
        }
      })
    }
  }, [])

  // Handle master volume changes
  useEffect(() => {
    layers.forEach((layer) => {
      if (layer.audio) {
        layer.audio.volume = layer.volume * masterVolume
      }
    })
  }, [masterVolume, layers])

  const toggleLayer = (id) => {
    setLayers(
      layers.map((layer) => {
        if (layer.id === id) {
          const newActive = !layer.active
          if (layer.audio) {
            if (newActive && isPlaying) {
              layer.audio.play()
            } else {
              layer.audio.pause()
            }
          }
          return { ...layer, active: newActive }
        }
        return layer
      }),
    )
  }

  const updateLayerVolume = (id, volume) => {
    setLayers(
      layers.map((layer) => {
        if (layer.id === id) {
          if (layer.audio) {
            layer.audio.volume = volume * masterVolume
          }
          return { ...layer, volume }
        }
        return layer
      }),
    )
  }

  const togglePlayback = () => {
    const newIsPlaying = !isPlaying
    setIsPlaying(newIsPlaying)

    layers.forEach((layer) => {
      if (layer.active && layer.audio) {
        if (newIsPlaying) {
          layer.audio.play()
        } else {
          layer.audio.pause()
        }
      }
    })
  }

  const savePreset = () => {
    const preset = {
      name: "Custom Mix",
      layers: layers.map(({ id, active, volume }) => ({ id, active, volume })),
      masterVolume,
    }

    // In a real app, you would save this to localStorage or a database
    console.log("Saved preset:", preset)
    alert("Preset saved!")
  }

  return (
    <Card className="w-full max-w-md backdrop-blur-lg bg-black/40 border-none shadow-xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Sound Layer Mixer</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/10 text-white">
            Close
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium">Master Volume</h3>
            <Button
              onClick={togglePlayback}
              variant="outline"
              size="sm"
              className="bg-white/10 border-none hover:bg-white/20"
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <VolumeX className="h-4 w-4 text-white/70" />
            <Slider
              defaultValue={[0.5]}
              max={1}
              step={0.01}
              value={[masterVolume]}
              onValueChange={(value) => setMasterVolume(value[0])}
              className="flex-1"
            />
            <Volume2 className="h-4 w-4 text-white/70" />
          </div>
        </div>

        <div className="space-y-4">
          {layers.map((layer) => (
            <div key={layer.id} className="p-3 rounded-lg bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Button
                    variant={layer.active ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLayer(layer.id)}
                    className={
                      layer.active ? "bg-white/30 hover:bg-white/40" : "bg-white/10 border-none hover:bg-white/20"
                    }
                  >
                    {layer.icon}
                    <span className="ml-2">{layer.name}</span>
                  </Button>
                </div>
                <span className="text-xs text-white/60">{Math.round(layer.volume * 100)}%</span>
              </div>

              <Slider
                defaultValue={[0.5]}
                max={1}
                step={0.01}
                value={[layer.volume]}
                onValueChange={(value) => updateLayerVolume(layer.id, value[0])}
                disabled={!layer.active}
                className={`${!layer.active ? "opacity-50" : ""}`}
              />
            </div>
          ))}
        </div>

        <Button onClick={savePreset} className="w-full mt-6 bg-white/10 hover:bg-white/20 border-none">
          Save Current Mix
        </Button>
      </div>
    </Card>
  )
}

export default SoundMixer
