"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, ArrowLeft, Timer, Focus, Moon } from "lucide-react"

const ProgressiveRelaxation = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("tension")
  const [isActive, setIsActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(null)

  // Tension Release sequence
  const tensionSteps = [
    { part: "Forehead", instruction: "Tense your forehead by raising your eyebrows as high as possible", duration: 5 },
    { part: "Eyes", instruction: "Close your eyes tightly", duration: 5 },
    { part: "Jaw", instruction: "Clench your jaw and tighten mouth muscles", duration: 5 },
    { part: "Neck", instruction: "Push your head back into your headrest or pillow", duration: 5 },
    { part: "Shoulders", instruction: "Raise your shoulders up toward your ears", duration: 5 },
    { part: "Arms", instruction: "Tense your biceps by drawing your forearms up toward your shoulders", duration: 5 },
    { part: "Hands", instruction: "Clench your fists tightly", duration: 5 },
    { part: "Back", instruction: "Arch your back slightly", duration: 5 },
    { part: "Stomach", instruction: "Tighten your stomach muscles", duration: 5 },
    { part: "Legs", instruction: "Tense your thigh muscles", duration: 5 },
    { part: "Feet", instruction: "Curl your toes downward", duration: 5 },
    { part: "Whole Body", instruction: "Take a deep breath and tense your entire body", duration: 10 },
    { part: "Complete", instruction: "Relax your entire body and notice how calm you feel", duration: 10 },
  ]

  useEffect(() => {
    let timer

    if (isActive && activeTab === "tension") {
      if (currentStep < tensionSteps.length) {
        const step = tensionSteps[currentStep]
        setTimeRemaining(step.duration)

        timer = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(timer)

              // Move to next step or finish
              if (currentStep < tensionSteps.length - 1) {
                setCurrentStep((prev) => prev + 1)
              } else {
                setIsActive(false)
                setCurrentStep(0)
                setProgress(100)
              }

              return 0
            }
            return prev - 1
          })

          // Update progress
          const totalDuration = tensionSteps.reduce((sum, step) => sum + step.duration, 0)
          const elapsed =
            tensionSteps.slice(0, currentStep).reduce((sum, step) => sum + step.duration, 0) +
            (step.duration - timeRemaining)
          setProgress((elapsed / totalDuration) * 100)
        }, 1000)
      }
    } else if (isActive && activeTab === "focus") {
      // Focus bubble timer (5 minutes)
      setTimeRemaining(5 * 60)

      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setIsActive(false)
            return 0
          }

          setProgress(((5 * 60 - prev) / (5 * 60)) * 100)
          return prev - 1
        })
      }, 1000)
    } else if (isActive && activeTab === "sleep") {
      // Sleep countdown timer (10 minutes)
      setTimeRemaining(10 * 60)

      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setIsActive(false)
            return 0
          }

          setProgress(((10 * 60 - prev) / (10 * 60)) * 100)
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isActive, currentStep, activeTab, timeRemaining])

  const toggleActive = () => {
    if (!isActive) {
      setProgress(0)
      setCurrentStep(0)
    }
    setIsActive(!isActive)
  }

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "--:--"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full max-w-md backdrop-blur-lg bg-black/40 border-none shadow-xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onClose} className="mr-2 hover:bg-white/10 text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold text-white">Progressive Relaxation</h2>
          </div>
        </div>

        <Tabs defaultValue="tension" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="tension" className="text-white" disabled={isActive}>
              <Timer className="h-4 w-4 mr-2" />
              <span>Tension Release</span>
            </TabsTrigger>
            <TabsTrigger value="focus" className="text-white" disabled={isActive}>
              <Focus className="h-4 w-4 mr-2" />
              <span>Focus Bubble</span>
            </TabsTrigger>
            <TabsTrigger value="sleep" className="text-white" disabled={isActive}>
              <Moon className="h-4 w-4 mr-2" />
              <span>Sleep</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tension" className="space-y-4">
            <div className="p-4 rounded-lg bg-white/10 text-center">
              {isActive ? (
                <>
                  <h3 className="text-lg font-medium text-white mb-2">{tensionSteps[currentStep].part}</h3>
                  <p className="text-white/80 mb-4">{tensionSteps[currentStep].instruction}</p>
                  <div className="flex justify-center items-center mb-2">
                    <div className="text-2xl font-bold text-white">{timeRemaining}s</div>
                  </div>
                  <p className="text-sm text-white/60">
                    {currentStep === 0 ? "Tense for 5 seconds, then relax" : "Tense... then relax and release"}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-white mb-2">Progressive Muscle Relaxation</h3>
                  <p className="text-white/80 mb-4">
                    This technique involves tensing and then releasing each muscle group in your body.
                  </p>
                  <p className="text-sm text-white/60">
                    For each step, tense the muscle group for 5 seconds, then relax for 5 seconds before moving on.
                  </p>
                </>
              )}
            </div>

            <Progress value={progress} className="h-2" />

            <Button onClick={toggleActive} className="w-full bg-white/10 hover:bg-white/20 border-none">
              {isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" /> Pause Session
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Begin Session
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="focus" className="space-y-4">
            <div className={`p-4 rounded-lg bg-white/10 text-center ${isActive ? "h-60" : ""}`}>
              {isActive ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-white/5 animate-ping"></div>
                    <div className="relative w-32 h-32 rounded-full bg-white/10 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                        <div className="text-xl font-bold text-white">{formatTime(timeRemaining)}</div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-white/80">Focus on your breath and this bubble</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-white mb-2">Focus Bubble</h3>
                  <p className="text-white/80 mb-4">
                    A simple visual and sound loop to help you concentrate and reduce distractions.
                  </p>
                  <p className="text-sm text-white/60">
                    The session lasts for 5 minutes. Focus on the bubble and your breathing.
                  </p>
                </>
              )}
            </div>

            <Progress value={progress} className="h-2" />

            <Button onClick={toggleActive} className="w-full bg-white/10 hover:bg-white/20 border-none">
              {isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" /> End Session
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Start Focus Session
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="sleep" className="space-y-4">
            <div className={`p-4 rounded-lg bg-white/10 text-center ${isActive ? "h-60" : ""}`}>
              {isActive ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-3xl font-bold text-white mb-4">{formatTime(timeRemaining)}</div>
                  <div className="w-32 h-32 rounded-full bg-gradient-to-b from-indigo-500/30 to-purple-500/30 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-b from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
                  </div>
                  <p className="mt-4 text-white/80">Relax and prepare for sleep...</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-white mb-2">Sleep Countdown</h3>
                  <p className="text-white/80 mb-4">
                    A gentle countdown with ambient sound to help you drift off to sleep.
                  </p>
                  <p className="text-sm text-white/60">
                    The screen will gradually dim over 10 minutes as you prepare for sleep.
                  </p>
                </>
              )}
            </div>

            <Progress value={progress} className="h-2" />

            <Button onClick={toggleActive} className="w-full bg-white/10 hover:bg-white/20 border-none">
              {isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" /> Cancel Countdown
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Start Sleep Countdown
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  )
}

export default ProgressiveRelaxation
