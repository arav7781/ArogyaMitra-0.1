"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMoodStore } from "@/lib/mood-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const MoodLog = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { moodHistory } = useMoodStore()

  // Get the last 7 days of mood data
  const recentMoods = moodHistory.slice(0, 7)

  // Count occurrences of each mood
  const moodCounts = recentMoods.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1
    return acc
  }, {})

  // Find the most common mood
  let dominantMood = "neutral"
  let maxCount = 0

  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > maxCount) {
      dominantMood = mood
      maxCount = count
    }
  })

  // Get mood color
  const getMoodColor = (mood) => {
    switch (mood) {
      case "Happy":
        return "bg-yellow-100 text-yellow-800"
      case "Sad":
        return "bg-blue-100 text-blue-800"
      case "Anxious":
        return "bg-purple-100 text-purple-800"
      case "Angry":
        return "bg-red-100 text-red-800"
      case "Sleepy":
        return "bg-indigo-100 text-indigo-800"
      case "Stressed":
        return "bg-pink-100 text-pink-800"
      case "Loved":
        return "bg-rose-100 text-rose-800"
      case "Curious":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get mood emoji
  const getMoodEmoji = (mood) => {
    switch (mood) {
      case "Happy":
        return "😊"
      case "Sad":
        return "😔"
      case "Anxious":
        return "😰"
      case "Angry":
        return "😠"
      case "Sleepy":
        return "😴"
      case "Stressed":
        return "😵"
      case "Loved":
        return "🥰"
      case "Curious":
        return "🤔"
      default:
        return "😐"
    }
  }

  // Get mood message
  const getMoodMessage = () => {
    if (recentMoods.length === 0) return "No mood data yet"

    switch (dominantMood) {
      case "Happy":
        return "Your week has been mostly joyful 💛"
      case "Sad":
        return "Your week has been mostly melancholic 💙"
      case "Anxious":
        return "Your week has been mostly anxious 💜"
      case "Angry":
        return "Your week has been mostly intense ❤️"
      case "Sleepy":
        return "Your week has been mostly tired 💤"
      case "Stressed":
        return "Your week has been mostly tense 🧠"
      case "Loved":
        return "Your week has been mostly loving 💖"
      case "Curious":
        return "Your week has been mostly inquisitive 💚"
      default:
        return "Your week has been mixed 🌈"
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Mood History</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Hide mood history" : "Show mood history"}
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>{getMoodMessage()}</CardDescription>
      </CardHeader>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CardContent>
              {recentMoods.length > 0 ? (
                <div className="space-y-2">
                  {recentMoods.map((entry, index) => (
                    <motion.div
                      key={entry.timestamp}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn("flex items-center justify-between p-2 rounded-md", getMoodColor(entry.mood))}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                        <span>{entry.mood}</span>
                      </div>
                      <span className="text-sm opacity-70">{new Date(entry.timestamp).toLocaleString()}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No mood data yet</p>
              )}

              {recentMoods.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Mood Distribution</h4>
                  <div className="flex gap-1 h-8">
                    {Object.entries(moodCounts).map(([mood, count]) => {
                      const percentage = (count / recentMoods.length) * 100
                      return (
                        <motion.div
                          key={mood}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          className={cn(
                            "h-full rounded-md flex items-center justify-center text-xs font-medium",
                            getMoodColor(mood),
                          )}
                          style={{ minWidth: percentage > 5 ? "auto" : "0" }}
                        >
                          {percentage > 10 && (
                            <span className="px-1">
                              {getMoodEmoji(mood)} {Math.round(percentage)}%
                            </span>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

export default MoodLog
