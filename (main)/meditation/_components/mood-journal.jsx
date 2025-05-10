"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useMoodStore } from "@/lib/mood-store"

const MoodJournal = () => {
  const [journalEntry, setJournalEntry] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState("")
  const [journalEntries, setJournalEntries] = useState([])
  const [saveStatus, setSaveStatus] = useState("")
  const { addJournalEntry } = useMoodStore()

  const emojis = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😰", label: "Anxious" },
    { emoji: "😠", label: "Angry" },
    { emoji: "😴", label: "Sleepy" },
    { emoji: "😵", label: "Stressed" },
    { emoji: "🥰", label: "Loved" },
    { emoji: "🤔", label: "Curious" },
    { emoji: "😌", label: "Calm" },
    { emoji: "🤩", label: "Excited" },
    { emoji: "😢", label: "Tearful" },
    { emoji: "😮", label: "Surprised" },
  ]

  // Load journal entries from localStorage
  useEffect(() => {
    const storedEntries = localStorage.getItem("journalEntries")
    if (storedEntries) {
      setJournalEntries(JSON.parse(storedEntries))
    }
  }, [])

  const handleSubmit = () => {
    if (!journalEntry.trim() || !selectedEmoji) return

    const newEntry = {
      id: Date.now(),
      text: journalEntry,
      emoji: selectedEmoji,
      timestamp: new Date().toISOString(),
    }

    const updatedEntries = [newEntry, ...journalEntries]
    setJournalEntries(updatedEntries)
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))

    // Add to mood store
    addJournalEntry(newEntry)

    // Reset form
    setJournalEntry("")
    setSelectedEmoji("")

    // Show save status
    setSaveStatus("Saved!")
    setTimeout(() => setSaveStatus(""), 2000)
  }

  const deleteEntry = (id) => {
    const updatedEntries = journalEntries.filter((entry) => entry.id !== id)
    setJournalEntries(updatedEntries)
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mood Journal</CardTitle>
          <CardDescription>Record how you're feeling today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">How do you feel?</label>
            <div className="flex flex-wrap gap-2">
              {emojis.map((item) => (
                <Button
                  key={item.label}
                  variant="outline"
                  className={`h-10 w-10 p-0 ${selectedEmoji === item.emoji ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
                  onClick={() => setSelectedEmoji(item.emoji)}
                >
                  <span className="text-lg">{item.emoji}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Today I feel...</label>
            <Textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write about your feelings, thoughts, or experiences..."
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <span className="text-sm text-green-600">{saveStatus}</span>
          <Button onClick={handleSubmit} disabled={!journalEntry.trim() || !selectedEmoji}>
            Save Entry
          </Button>
        </CardFooter>
      </Card>

      {journalEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {journalEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{entry.emoji}</span>
                      <span className="text-sm text-gray-500">{new Date(entry.timestamp).toLocaleDateString()}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry.id)} className="h-8 w-8 p-0">
                      &times;
                    </Button>
                  </div>
                  <p className="whitespace-pre-wrap">{entry.text}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default MoodJournal
