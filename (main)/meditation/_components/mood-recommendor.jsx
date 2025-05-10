"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wind, CloudRain, Flame, Sun, Moon, ArrowRight } from "lucide-react"

const MoodToActionRecommender = ({ mood, onSelectAction }) => {
  const [recommendation, setRecommendation] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  const moodMatrix = {
    Anxious: [
      {
        title: "Guided Breathing",
        description: "4-7-8 breathing technique to calm your nervous system",
        icon: <Wind className="h-5 w-5" />,
        action: "breathing",
        pattern: "calm",
      },
      {
        title: "Nature Sounds",
        description: "Forest birds and gentle stream to create a peaceful environment",
        icon: <Wind className="h-5 w-5" />,
        action: "sounds",
        sound: "forest_birds.mp3",
      },
      {
        title: "Grounding Meditation",
        description: "3-minute meditation to reconnect with the present moment",
        icon: <Moon className="h-5 w-5" />,
        action: "meditations",
        meditation: "anxious_3min.mp3",
      },
    ],
    Sad: [
      {
        title: "Warm Affirmations",
        description: "Gentle reminders of your inner strength and resilience",
        icon: <Sun className="h-5 w-5" />,
        action: "journal",
      },
      {
        title: "Soothing Rain",
        description: "Gentle rain sounds to match and gradually lift your mood",
        icon: <CloudRain className="h-5 w-5" />,
        action: "sounds",
        sound: "rain.mp3",
      },
      {
        title: "Acceptance Practice",
        description: "3-minute meditation on accepting emotions without judgment",
        icon: <Moon className="h-5 w-5" />,
        action: "meditations",
        meditation: "sad_3min.mp3",
      },
    ],
    Angry: [
      {
        title: "Cooling Breath",
        description: "Relaxing breathing pattern to reduce intensity of emotions",
        icon: <Wind className="h-5 w-5" />,
        action: "breathing",
        pattern: "relaxing",
      },
      {
        title: "Transformative Meditation",
        description: "5-minute practice to transform anger into constructive energy",
        icon: <Flame className="h-5 w-5" />,
        action: "meditations",
        meditation: "angry_5min.mp3",
      },
      {
        title: "Reflection Journal",
        description: "Guided prompts to explore what's beneath your anger",
        icon: <Flame className="h-5 w-5" />,
        action: "journal",
      },
    ],
    Happy: [
      {
        title: "Gratitude Practice",
        description: "Journal what you're thankful for to amplify positive feelings",
        icon: <Sun className="h-5 w-5" />,
        action: "journal",
      },
      {
        title: "Joy Meditation",
        description: "3-minute meditation to savor and extend your positive state",
        icon: <Sun className="h-5 w-5" />,
        action: "meditations",
        meditation: "happy_3min.mp3",
      },
      {
        title: "Uplifting Sounds",
        description: "Cheerful audio to complement your positive mood",
        icon: <Sun className="h-5 w-5" />,
        action: "sounds",
        sound: "uplifting.mp3",
      },
    ],
    Sleepy: [
      {
        title: "Sleep Preparation",
        description: "5-minute meditation to prepare your mind for restful sleep",
        icon: <Moon className="h-5 w-5" />,
        action: "meditations",
        meditation: "sleepy_5min.mp3",
      },
      {
        title: "Night Sounds",
        description: "Gentle ambient sounds to help you drift off peacefully",
        icon: <Moon className="h-5 w-5" />,
        action: "sounds",
        sound: "night.mp3",
      },
      {
        title: "Wind Down Breathing",
        description: "Slow, deep breathing pattern to prepare for sleep",
        icon: <Wind className="h-5 w-5" />,
        action: "breathing",
        pattern: "relaxing",
      },
    ],
  }

  useEffect(() => {
    if (mood && moodMatrix[mood]) {
      // Select a recommendation based on the mood
      const recommendations = moodMatrix[mood]
      const selected = recommendations[Math.floor(Math.random() * recommendations.length)]
      setRecommendation(selected)

      // Show after a short delay
      setTimeout(() => {
        setIsVisible(true)
      }, 1000)
    } else {
      setIsVisible(false)
    }
  }, [mood])

  if (!recommendation || !isVisible) return null

  return (
    <Card className="absolute bottom-20 left-4 w-80 backdrop-blur-lg bg-black/40 border-none shadow-xl overflow-hidden">
      <div className="p-4">
        <h3 className="text-white font-medium mb-2">Recommended for your mood</h3>
        <div className="p-3 rounded-lg bg-white/10 mb-3">
          <div className="flex items-center mb-2">
            <div className="mr-3 p-2 rounded-full bg-white/10">{recommendation.icon}</div>
            <div>
              <h4 className="text-white font-medium">{recommendation.title}</h4>
              <p className="text-white/70 text-sm">{recommendation.description}</p>
            </div>
          </div>
          <Button
            onClick={() => onSelectAction(recommendation.action, recommendation)}
            className="w-full mt-2 bg-white/10 hover:bg-white/20 border-none"
          >
            Try Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default MoodToActionRecommender
