"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

const AICompanion = ({ mood, onAction }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Initial greeting based on mood
  useEffect(() => {
    if (mood) {
      const initialGreetings = {
        Anxious: "I notice you're feeling anxious. How can I help you find some calm today? 🌿",
        Sad: "I see you're feeling down. I'm here to listen and support you. 💙",
        Angry: "I can sense your frustration. Would you like to talk about it or try a calming exercise? 🔥",
        Happy: "Your positive energy is wonderful! How can I help you maintain this good mood? ☀️",
        Sleepy: "Feeling tired? Let me help you relax or energize, depending on what you need. 🌙",
      }

      addBotMessage(initialGreetings[mood] || "Hello! How are you feeling today?")
    }
  }, [mood])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const addBotMessage = (text) => {
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text }])
      setIsTyping(false)
    }, 1000)
  }

  const addActionButton = (label, action, params = {}) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        isAction: true,
        actionLabel: label,
        action,
        params,
      },
    ])
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }])
    const userMessage = input
    setInput("")

    // Process user message and generate response
    processUserMessage(userMessage)
  }

  const processUserMessage = (message) => {
    const lowerMessage = message.toLowerCase()

    // Simple rule-based responses
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("stress")) {
      addBotMessage("I understand anxiety can be difficult. Would you like to try a 2-minute breathing exercise? 🌬️")
      setTimeout(() => {
        addBotMessage("Just tap the button below to start.")
        addActionButton("Start Breathing Exercise", "breathing", { pattern: "calm" })
      }, 1500)
    } else if (lowerMessage.includes("sad") || lowerMessage.includes("down") || lowerMessage.includes("depressed")) {
      addBotMessage("I'm sorry you're feeling down. Sometimes gentle sounds can help shift our mood. 🎵")
      setTimeout(() => {
        addActionButton("Play Soothing Sounds", "sounds", { sound: "rain.mp3" })
      }, 1500)
    } else if (lowerMessage.includes("angry") || lowerMessage.includes("frustrated") || lowerMessage.includes("mad")) {
      addBotMessage(
        "It's okay to feel angry. Would you like to try a quick journaling exercise to express your feelings? 📝",
      )
      setTimeout(() => {
        addActionButton("Open Journal", "journal")
      }, 1500)
    } else if (lowerMessage.includes("happy") || lowerMessage.includes("good") || lowerMessage.includes("great")) {
      addBotMessage(
        "That's wonderful to hear! Would you like to try a gratitude meditation to enhance these positive feelings? ✨",
      )
      setTimeout(() => {
        addActionButton("Start Gratitude Meditation", "meditations", { meditation: "happy_3min.mp3" })
      }, 1500)
    } else if (
      lowerMessage.includes("tired") ||
      lowerMessage.includes("sleepy") ||
      lowerMessage.includes("exhausted")
    ) {
      addBotMessage("Rest is important. Would you like to try some calming night sounds to help you relax? 🌙")
      setTimeout(() => {
        addActionButton("Play Night Sounds", "sounds", { sound: "night.mp3" })
      }, 1500)
    } else if (lowerMessage.includes("help") || lowerMessage.includes("what can you do")) {
      addBotMessage(
        "I'm here to support your emotional wellbeing. I can suggest breathing exercises, meditations, journaling prompts, or soothing sounds based on how you're feeling. Just let me know what you need! 💫",
      )
    } else {
      addBotMessage(
        "I'm here for you. Would you like to try a breathing exercise, listen to some calming sounds, or perhaps journal about your feelings?",
      )
      setTimeout(() => {
        addActionButton("Breathing Exercise", "breathing", { pattern: "box" })
        setTimeout(() => {
          addActionButton("Calming Sounds", "sounds")
          setTimeout(() => {
            addActionButton("Open Journal", "journal")
          }, 500)
        }, 500)
      }, 1500)
    }
  }

  const handleActionClick = (action, params) => {
    if (onAction) {
      onAction(action, params)
    }
  }

  return (
    <Card className="w-full max-w-md h-[400px] backdrop-blur-lg bg-black/40 border-none shadow-xl flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white">MoodScape Companion</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            {message.isAction ? (
              <Button
                onClick={() => handleActionClick(message.action, message.params)}
                className="bg-white/10 hover:bg-white/20 text-white border-none"
              >
                {message.actionLabel}
              </Button>
            ) : (
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === "user" ? "bg-white/20 text-white" : "bg-white/10 text-white"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-white/10 text-white">
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

      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 border-none rounded-l-md p-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
        />
        <Button type="submit" className="rounded-l-none bg-white/20 hover:bg-white/30 border-none">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  )
}

export default AICompanion
