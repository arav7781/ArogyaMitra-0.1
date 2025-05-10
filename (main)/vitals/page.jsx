"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { v4 as uuidv4 } from "uuid"
import GradientText from "@/components/ui/GradientText"
import { useUser } from "@stackframe/stack"

export default function VitalAnalysisDashboard() {
  // State for biometric data and UI
  const [results, setResults] = useState(null)
  const [ppgData, setPpgData] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [signalQuality, setSignalQuality] = useState(0)
  const [amplitude, setAmplitude] = useState(0)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [showAiInsight, setShowAiInsight] = useState(false)
  const [aiInsight, setAiInsight] = useState(null)
  const [isLoadingInsight, setIsLoadingInsight] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [serverStatus, setServerStatus] = useState("checking")
  const [roi, setRoi] = useState({ x: 0.425, y: 0.425, width: 0.15, height: 0.15 })
  const user = useUser()

  // Refs
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const reportCanvasRef = useRef(null)
  const ppgChartRef = useRef(null)
  const hrvChartRef = useRef(null)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  // Check server status
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:5000/health', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        if (response.ok) {
          const data = await response.json()
          setServerStatus(data.status === 'healthy' ? 'healthy' : 'unreachable')
          if (data.status !== 'healthy') {
            setError('Server responded but is not healthy.')
          }
        } else {
          setServerStatus('unreachable')
          setError(`Server returned status ${response.status}`)
        }
      } catch (err) {
        setServerStatus('unreachable')
        setError('Failed to connect to server. Ensure backend is running on http://localhost:5000.')
      }
    }
    checkServer()
  }, [])

  // Handle webcam signal capture
  useEffect(() => {
    let interval, timerInterval
    if (isRecording) {
      const constraints = { video: { facingMode: 'user', width: 640, height: 480, frameRate: { ideal: 30 } } }
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            interval = setInterval(() => {
              if (videoRef.current && canvasRef.current) {
                const context = canvasRef.current.getContext('2d')
                context.drawImage(videoRef.current, 0, 0, 640, 480)
                const imageData = context.getImageData(0, 0, 640, 480)
                const data = imageData.data
                const w = 640,
                  h = 480
                const roiX = Math.floor(roi.x * w)
                const roiY = Math.floor(roi.y * h)
                const roiW = Math.floor(roi.width * w)
                const roiH = Math.floor(roi.height * h)
                let sum = 0,
                  count = 0
                for (let y = roiY; y < roiY + roiH && y < h; y++) {
                  for (let x = roiX; x < roiX + roiW && x < w; x++) {
                    const i = (y * w + x) * 4
                    sum += data[i + 1] // Green channel
                    count++
                  }
                }
                const intensity = count > 0 ? sum / count : 0
                setPpgData((prev) => {
                  const newSignal = [...prev, intensity].slice(-1200)
                  const recent = newSignal.slice(-90)
                  const amp = recent.length > 1 ? Math.max(...recent) - Math.min(...recent) : 0
                  setAmplitude(amp.toFixed(2))
                  setSignalQuality(Math.min(1, Math.max(0, amp / 2.0)))
                  return newSignal
                })
              }
            }, 33)
            timerInterval = setInterval(() => setRecordingTime((prev) => prev + 0.033), 33)
          }
        })
        .catch((err) => {
          setError(`Camera access failed: ${err.message}. Please grant permissions.`)
          setIsRecording(false)
        })
    }
    return () => {
      if (interval) clearInterval(interval)
      if (timerInterval) clearInterval(timerInterval)
      if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
      setRecordingTime(0)
    }
  }, [isRecording, roi])

  // Draw PPG chart with normalization and smoothing
  useEffect(() => {
    if (ppgChartRef.current && ppgData.length > 0) {
      const ctx = ppgChartRef.current.getContext('2d')
      const width = ppgChartRef.current.width
      const height = ppgChartRef.current.height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw background
      ctx.fillStyle = 'rgba(10, 17, 25, 0.2)'
      ctx.fillRect(0, 0, width, height)

      // Draw grid lines
      ctx.strokeStyle = 'rgba(66, 153, 225, 0.1)'
      ctx.lineWidth = 1
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }

      // Normalize and smooth PPG data
      const dataPoints = ppgData.slice(-width)
      const minVal = Math.min(...dataPoints)
      const maxVal = Math.max(...dataPoints)
      const range = maxVal - minVal || 1
      const normalized = dataPoints.map((val) => (val - minVal) / range)

      // Apply simple moving average (window size 5)
      const smoothed = []
      const window = 5
      for (let i = 0; i < normalized.length; i++) {
        const start = Math.max(0, i - Math.floor(window / 2))
        const end = Math.min(normalized.length, i + Math.ceil(window / 2))
        const slice = normalized.slice(start, end)
        const avg = slice.reduce((sum, val) => sum + val, 0) / slice.length
        smoothed.push(avg)
      }

      // Draw PPG waveform
      ctx.strokeStyle = '#00ffaa'
      ctx.lineWidth = 2
      ctx.beginPath()

      const step = width / smoothed.length
      smoothed.forEach((point, index) => {
        const x = index * step
        const y = height - (point * (height - 20) + 10) // Center and scale
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Add glow effect
      ctx.shadowColor = '#00ffaa'
      ctx.shadowBlur = 10
      ctx.strokeStyle = 'rgba(0, 255, 170, 0.7)'
      ctx.stroke()

      // Reset shadow
      ctx.shadowBlur = 0
    }
  }, [ppgData])

  // Draw HRV chart
  useEffect(() => {
    if (hrvChartRef.current && results?.pulse_sensor?.hrv?.HRV_RMSSD) {
      const ctx = hrvChartRef.current.getContext('2d')
      const width = hrvChartRef.current.width
      const height = hrvChartRef.current.height

      // Generate HRV data points (single point for now)
      const hrvPoints = [
        { value: results.pulse_sensor.hrv.HRV_RMSSD, timestamp: Date.now() },
      ]

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw background
      ctx.fillStyle = 'rgba(10, 17, 25, 0.2)'
      ctx.fillRect(0, 0, width, height)

      // Draw grid
      ctx.strokeStyle = 'rgba(66, 153, 225, 0.1)'
      ctx.lineWidth = 1
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }

      // Draw HRV bars
      const barWidth = (width / hrvPoints.length) * 0.7
      const gap = (width / hrvPoints.length) * 0.3

      hrvPoints.forEach((point, index) => {
        const x = index * (barWidth + gap) + gap / 2
        const barHeight = (point.value / 100) * height
        const y = height - barHeight

        const gradient = ctx.createLinearGradient(x, y, x, height)
        gradient.addColorStop(0, '#3498db')
        gradient.addColorStop(1, '#00c6ff')

        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth, barHeight)

        ctx.shadowColor = '#00c6ff'
        ctx.shadowBlur = 15
        ctx.fillRect(x, y, barWidth, barHeight)

        ctx.shadowBlur = 0
      })
    }
  }, [results])

  // Toggle recording
  const toggleRecording = async () => {
    if (!isRecording) {
      if (serverStatus !== 'healthy') {
        setError('Cannot start recording: Server is unreachable.')
        return
      }
      setIsRecording(true)
      setPpgData([])
      setResults(null)
      setError(null)
      setSignalQuality(0)
      setAmplitude(0)
      setRecordingTime(0)
      setAiInsight(null)
      setShowAiInsight(false)
    } else {
      setIsRecording(false)
      if (ppgData.length < 600) {
        setError('Signal too short (<20s). Please record for at least 20 seconds.')
        return
      }
      setIsLoading(true)
      try {
        const response = await fetch('http://localhost:5000/analyze_ppg', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            duration: recordingTime,
            sampling_rate: 30,
            roi,
            signal: ppgData,
          }),
        })
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`)
        }
        const data = await response.json()
        if (data.error) {
          setError(`Analysis failed: ${data.error}`)
          setResults(null)
        } else {
          setResults(data)
          setPpgData(data.webcam?.signal || ppgData)
          setError(data.warnings?.join(' ') || null)
        }
      } catch (err) {
        setError(`Analysis failed: ${err.message}`)
        setResults(null)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Fetch AI insight
  const fetchAiInsight = async () => {
    if (!results) {
      setError('No analysis data available. Please record and analyze a signal first.')
      return
    }
    setIsLoadingInsight(true)
    setShowAiInsight(true)
    try {
      const message = `Analyze the following vital signs from a pulse sensor: Heart Rate: ${
        results.pulse_sensor.heart_rate.toFixed(1)
      } BPM, HRV (RMSSD): ${
        results.pulse_sensor.hrv?.HRV_RMSSD.toFixed(1) || '--'
      } ms, Signal Quality: ${
        (results.pulse_sensor.quality_metrics?.quality * 100).toFixed(0) || '--'
      }%. Provide health insights with a title, content, and recommendation. Respond in plain text with JSON structure: {"title": "...", "content": "...", "recommendation": "..."}.`
      const conversation_id = uuidv4()
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversation_id,
          model: 'gemma2-9b-it',
        }),
      })
      if (!response.ok) {
        throw new Error(`Chat endpoint error: ${response.status}`)
      }
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      if (data.answer) {
        try {
          // Try parsing answer as JSON
          const parsedInsight = JSON.parse(data.answer)
          if (parsedInsight.title && parsedInsight.content && parsedInsight.recommendation) {
            setAiInsight(parsedInsight)
          } else {
            throw new Error('Invalid insight format')
          }
        } catch {
          // Fallback to plain text
          setAiInsight({
            title: 'Health Analysis',
            content: data.answer,
            recommendation: 'Consult a healthcare professional for detailed advice.',
          })
        }
      } else {
        throw new Error('No answer provided by the server.')
      }
    } catch (err) {
      setAiInsight(null)
      setError(`Failed to fetch AI insight: ${err.message}`)
    } finally {
      setIsLoadingInsight(false)
    }
  }

  // Generate and download report
  // Generate and download report
  const downloadReport = () => {
    if (!results?.pulse_sensor) {
      setError('No analysis data available. Please record and analyze a signal first.')
      return
    }
  
    const canvas = reportCanvasRef.current
    canvas.width = 800
    canvas.height = 600
    const ctx = canvas.getContext('2d')
  
    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#ffffff')
    gradient.addColorStop(1, '#ffffff')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  
    // Draw the logo at the top, adjust size and position
    const logo = new Image()
    logo.src = '/ss1.png'
    logo.onload = () => {
      const logoWidth = 100
      const logoHeight = 100
      const logoX = 30
      const logoY = 30
      ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight)
  
      // Title and other report content after logo is loaded
      ctx.fillStyle = '#00f2fe'
      ctx.font = 'bold 36px Arial'
      ctx.fillText('VitalSense Biometric Report', 150, 80) // Adjusted to make space for logo
  
      // Date text
      ctx.fillStyle = '#94a3b8'
      ctx.font = '16px Arial'
      const date = new Date().toLocaleString()
      ctx.fillText(`Generated: ${date}`, 150, 120) // Adjusted position to align with the title
  
      // Line separator
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(40, 140)
      ctx.lineTo(canvas.width - 40, 140)
      ctx.stroke()
  
      // Define consistent gap between sections
      const sectionGap = 60
  
      // Report section labels
      ctx.font = '20px Arial'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('Name:', 40, 170)
      ctx.fillText('Heart Rate:', 40, 170 + sectionGap)
      ctx.fillText('HRV (RMSSD):', 40, 170 + sectionGap * 2)
  
      // Fill in the user details and pulse sensor information
      ctx.fillStyle = '#00f2fe'
      ctx.font = 'bold 20px Arial'
      ctx.fillText(`${user?.displayName || 'No Display Name'}`, 200, 170)
      ctx.fillText(
        `${results.pulse_sensor.heart_rate > 0 ? results.pulse_sensor.heart_rate.toFixed(1) + ' BPM' : '--'} (${
          results.pulse_sensor.heart_rate < 60
            ? 'Low'
            : results.pulse_sensor.heart_rate > 100
            ? 'High'
            : 'Normal'
        })`,
        200,
        170 + sectionGap
      )
      ctx.fillText(
        `${
          results.pulse_sensor.hrv?.HRV_RMSSD > 0 && results.pulse_sensor.hrv.HRV_RMSSD < 200
            ? results.pulse_sensor.hrv.HRV_RMSSD.toFixed(1) + ' ms'
            : '--'
        } (${
          results.pulse_sensor.hrv?.HRV_RMSSD < 30
            ? 'Low'
            : results.pulse_sensor.hrv.HRV_RMSSD > 70
            ? 'High'
            : 'Normal'
        })`,
        200,
        170 + sectionGap * 2
      )
  
      // Footer with copyright text
      ctx.fillStyle = '#94a3b8'
      ctx.font = '14px Arial'
      ctx.fillText('© 2025 VitalSense | Advanced Biometric Analysis', canvas.width / 2 - 150, canvas.height - 30)
  
      // Convert canvas to image and trigger download
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `VitalSense_Report_${new Date().toISOString().slice(0, 10)}.png`
      link.href = dataUrl
      link.click()
    }
  }
  
  


  // Calculate heart rate status
  const getHeartRateStatus = () => {
    if (!results?.pulse_sensor?.heart_rate) return 'N/A'
    if (results.pulse_sensor.heart_rate < 60) return 'Low'
    if (results.pulse_sensor.heart_rate > 100) return 'High'
    return 'Normal'
  }

  // Calculate HRV status
  const getHrvStatus = () => {
    if (!results?.pulse_sensor?.hrv?.HRV_RMSSD) return 'N/A'
    if (results.pulse_sensor.hrv.HRV_RMSSD < 30) return 'Low'
    if (results.pulse_sensor.hrv.HRV_RMSSD > 70) return 'High'
    return 'Normal'
  }

  // Handle ROI change
  const handleRoiChange = (e) => {
    const { name, value } = e.target
    const newValue = parseFloat(value)
    if (isNaN(newValue)) return
    setRoi((prev) => {
      const newRoi = { ...prev, [name]: newValue }
      newRoi.x = Math.max(0, Math.min(0.85, newRoi.x))
      newRoi.y = Math.max(0, Math.min(0.85, newRoi.y))
      newRoi.width = Math.max(0.05, Math.min(0.5, newRoi.width))
      newRoi.height = Math.max(0.05, Math.min(0.5, newRoi.height))
      if (newRoi.x + newRoi.width > 1) newRoi.width = 1 - newRoi.x
      if (newRoi.y + newRoi.height > 1) newRoi.height = 1 - newRoi.y
      return newRoi
    })
  }

  return (
    <div className="min-h-screen min-h-full bg-gray-900 text-gray-100 font-sans relative overflow-x-hidden bg-fixed">
  {/* Background layer */}
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black"></div>
    <div className="absolute inset-0 opacity-20">
      <div className="h-full w-full bg-[linear-gradient(to_right,#4f46e520_1px,transparent_1px),linear-gradient(to_bottom,#4f46e520_1px,transparent_1px)] bg-[size:14px_24px]"></div>
    </div>
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-[120px] opacity-10 animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-500 rounded-full filter blur-[100px] opacity-10 animate-pulse delay-1000"></div>
    <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-500 rounded-full filter blur-[120px] opacity-10 animate-pulse delay-2000"></div>
  </div>

      {/* Header */}
      <header className="relative bg-gray-800/70 border-b border-gray-700/50 shadow-lg backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              <GradientText>VitalSense</GradientText>
            </h1>
            <div className="hidden md:flex items-center space-x-1 text-xs text-cyan-500/70">
              <span>v1.0</span>
              <span>|</span>
              <span>ArogyaMitra</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`text-sm ${
                serverStatus === 'healthy'
                  ? 'text-green-400'
                  : serverStatus === 'checking'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            >
              Server: {serverStatus === 'healthy' ? 'Connected' : serverStatus === 'checking' ? 'Checking...' : 'Disconnected'}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInfo(!showInfo)}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Video Capture Section */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50 shadow-lg backdrop-blur-sm"
          >
            <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-cyan-400">PPG Capture</h2>
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-300"></div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-black/80 aspect-video border border-gray-700/50 shadow-inner">
                {isRecording ? (
                  <video ref={videoRef} autoPlay muted className="w-full h-full object-cover"></video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto mb-2 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm">Camera inactive</p>
                    </div>
                  </div>
                )}
                <div
                  className="absolute border-2 border-red-500"
                  style={{
                    left: `${roi.x * 100}%`,
                    top: `${roi.y * 100}%`,
                    width: `${roi.width * 100}%`,
                    height: `${roi.height * 100}%`,
                  }}
                ></div>
                {isRecording && (
                  <div className="absolute top-2 right-2 flex items-center space-x-2 bg-black/70 rounded-full px-2 py-1 border border-red-500/30">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs">REC {recordingTime.toFixed(1)}s</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 right-2 flex items-center space-x-2">
                  <div className="w-full h-1 bg-gray-800/80 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className={`h-full rounded-full ${
                        signalQuality > 0.7
                          ? 'bg-gradient-to-r from-green-500 to-cyan-400'
                          : signalQuality > 0.4
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-400'
                          : 'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}
                      style={{ width: `${signalQuality * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs whitespace-nowrap bg-black/50 px-1.5 py-0.5 rounded-full">
                    {(signalQuality * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <canvas ref={canvasRef} width="640" height="480" className="hidden"></canvas>
              <canvas ref={reportCanvasRef} className="hidden"></canvas>
              <div className="grid grid-cols-2 gap-2">
                <label className="text-sm text-gray-400">
                  ROI X
                  <input
                    type="number"
                    name="x"
                    value={roi.x}
                    onChange={handleRoiChange}
                    min="0"
                    max="0.85"
                    step="0.01"
                    className="w-full p-1 border border-gray-700 rounded bg-gray-800 text-white"
                  />
                </label>
                <label className="text-sm text-gray-400">
                  ROI Y
                  <input
                    type="number"
                    name="y"
                    value={roi.y}
                    onChange={handleRoiChange}
                    min="0"
                    max="0.85"
                    step="0.01"
                    className="w-full p-1 border border-gray-700 rounded bg-gray-800 text-white"
                  />
                </label>
                <label className="text-sm text-gray-400">
                  Width
                  <input
                    type="number"
                    name="width"
                    value={roi.width}
                    onChange={handleRoiChange}
                    min="0.05"
                    max="0.5"
                    step="0.01"
                    className="w-full p-1 border border-gray-700 rounded bg-gray-800 text-white"
                  />
                </label>
                <label className="text-sm text-gray-400">
                  Height
                  <input
                    type="number"
                    name="height"
                    value={roi.height}
                    onChange={handleRoiChange}
                    min="0.05"
                    max="0.5"
                    step="0.01"
                    className="w-full p-1 border border-gray-700 rounded bg-gray-800 text-white"
                  />
                </label>
              </div>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleRecording}
                  className={`px-6 py-2 rounded-lg text-white ${
                    isRecording
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 border border-red-400/30'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-400/30'
                  } transition-colors shadow-lg relative overflow-hidden group`}
                  disabled={isLoading || serverStatus !== 'healthy'}
                >
                  <span className="relative z-10">{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Metrics and Charts Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            {/* Vital Signs Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Heart Rate Card */}
              <motion.div
                className="bg-gray-800/40 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden backdrop-blur-sm"
                whileHover={{
                  y: -5,
                  boxShadow: '0 10px 25px -5px rgba(0, 200, 255, 0.2), 0 10px 10px -5px rgba(0, 200, 255, 0.1)',
                }}
              >
                <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-cyan-400">Heart Rate</h2>
                  <div className="text-xs text-cyan-500/70 bg-cyan-900/20 px-2 py-0.5 rounded-full border border-cyan-800/30">
                    REAL-TIME
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <defs>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#1e2a3a" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#heartRateGradient)"
                        strokeWidth="10"
                        strokeDasharray={`${
                          results?.pulse_sensor?.heart_rate
                            ? Math.min(280, (results.pulse_sensor.heart_rate / 200) * 280)
                            : 0
                        } 280`}
                        strokeDashoffset="70"
                        strokeLinecap="round"
                        filter="url(#glow)"
                      />
                      <defs>
                        <linearGradient id="heartRateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00c6ff" />
                          <stop offset="100%" stopColor="#0072ff" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`text-red-500 ${isRecording || results ? 'animate-[pulse_1s_ease-in-out_infinite]' : 'opacity-50'}`}
                        style={{
                          filter: isRecording || results ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.7))' : 'none',
                          animation: isRecording
                            ? `pulse ${60 / (results?.pulse_sensor?.heart_rate || 72)}s ease-in-out infinite`
                            : 'none',
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {results?.pulse_sensor?.heart_rate ? Math.round(results.pulse_sensor.heart_rate) : '--'}
                      <span className="text-lg ml-1 text-gray-400">BPM</span>
                    </div>
                    <div
                      className={`text-sm mt-2 ${
                        getHeartRateStatus() === 'Normal'
                          ? 'text-green-400'
                          : getHeartRateStatus() === 'High'
                          ? 'text-red-400'
                          : getHeartRateStatus() === 'Low'
                          ? 'text-yellow-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {getHeartRateStatus()}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* HRV Card */}
              <motion.div
                className="bg-gray-800/40 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden backdrop-blur-sm"
                whileHover={{
                  y: -5,
                  boxShadow: '0 10px 25px -5px rgba(0, 255, 170, 0.2), 0 10px 10px -5px rgba(0, 255, 170, 0.1)',
                }}
              >
                <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-cyan-400">HRV (RMSSD)</h2>
                  <div className="text-xs text-cyan-500/70 bg-cyan-900/20 px-2 py-0.5 rounded-full border border-cyan-800/30">
                    REAL-TIME
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <defs>
                        <filter id="hrvGlow">
                          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#1e2a3a" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#hrvGradient)"
                        strokeWidth="10"
                        strokeDasharray={`${
                          results?.pulse_sensor?.hrv?.HRV_RMSSD
                            ? Math.min(280, (results.pulse_sensor.hrv.HRV_RMSSD / 100) * 280)
                            : 0
                        } 280`}
                        strokeDashoffset="70"
                        strokeLinecap="round"
                        filter="url(#hrvGlow)"
                      />
                      <defs>
                        <linearGradient id="hrvGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00ffaa" />
                          <stop offset="100%" stopColor="#00cc88" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`text-cyan-500 ${isRecording || results ? 'opacity-100' : 'opacity-50'}`}
                        style={{
                          filter: isRecording || results ? 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.7))' : 'none',
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
                      {results?.pulse_sensor?.hrv?.HRV_RMSSD ? Math.round(results.pulse_sensor.hrv.HRV_RMSSD) : '--'}
                      <span className="text-lg ml-1 text-gray-400">ms</span>
                    </div>
                    <div
                      className={`text-sm mt-2 ${
                        getHrvStatus() === 'Normal'
                          ? 'text-green-400'
                          : getHrvStatus() === 'High'
                          ? 'text-cyan-400'
                          : getHrvStatus() === 'Low'
                          ? 'text-yellow-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {getHrvStatus()}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="bg-gray-800/40 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden backdrop-blur-sm"
                whileHover={{
                  y: -5,
                  boxShadow: '0 10px 25px -5px rgba(0, 200, 255, 0.2), 0 10px 10px -5px rgba(0, 200, 255, 0.1)',
                }}
              >
                <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-cyan-400">PPG Waveform</h2>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse delay-150"></div>
                  </div>
                </div>
                <div className="p-4">
                  <canvas ref={ppgChartRef} width="400" height="200" className="w-full h-48"></canvas>
                </div>
              </motion.div>
              <motion.div
                className="bg-gray-800/40 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden backdrop-blur-sm"
                whileHover={{
                  y: -5,
                  boxShadow: '0 10px 25px -5px rgba(0, 255, 170, 0.2), 0 10px 10px -5px rgba(0, 255, 170, 0.1)',
                }}
              >
                <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-cyan-400">HRV Trend</h2>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-150"></div>
                  </div>
                </div>
                <div className="p-4">
                  <canvas ref={hrvChartRef} width="400" height="200" className="w-full h-48"></canvas>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="bg-gray-800/40 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden backdrop-blur-sm max-w-full"
              whileHover={{
                y: -5,
                boxShadow: '0 10px 25px -5px rgba(0, 200, 255, 0.2), 0 10px 10px -5px rgba(0, 200, 255, 0.1)',
              }}
            >
              <div className="p-4 border-b border-gray-700/50">
                <h2 className="text-lg font-semibold text-cyan-400">Analysis Tools</h2>
              </div>
              <div className="p-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchAiInsight}
                  disabled={!results || isLoading || isLoadingInsight}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-500/30 shadow-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11.992 9.868l-.255.145a1 1 0 01-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L5 12.848l1.254-.716a1 1 0 11.992 1.736L7 14.152V15a1 1 0 11-2 0v-2a.995.995 0 01.52-.878l1.734-.99a1 1 0 011.364.372zM15 9.586l-1.707-1.707A1 1 0 0114 6.172V6h1v.172a1 1 0 01-.293.707L13 8.586V9a1 1 0 11-2 0V7a1 1 0 01.293-.707l2-2A1 1 0 0114 3.172V3h1v.172a1 1 0 01-.293.707l-2 2A1 1 0 0112 6.172V7h1v-.586l1.707-1.707A1 1 0 0115 4v-1h-1v1a1 1 0 01-.293.707L12 6.414V7a1 1 0 11-2 0V5a1 1 0 01.293-.707l2-2A1 1 0 0113 1.172V1h1v.172a1 1 0 01-.293.707l-2 2A1 1 0 0111 4.172V5h1v-.586l1.707-1.707A1 1 0 0114 2v-1h-1v1a1 1 0 01-.293.707L11 4.414V5a1 1 0 11-2 0V3a1 1 0 01.293-.707l2-2A1 1 0 0112 0h3a1 1 0 011 1v3a1 1 0 01-.293.707L16 6.414V7a1 1 0 11-2 0V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    ArogyaBot Insight
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadReport}
                  disabled={!results}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 border border-blue-500/30 shadow-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Download Report
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {(error || isLoading || showInfo || showAiInsight) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800/90 rounded-xl border border-cyan-800/30 p-6 max-w-md w-full shadow-2xl"
            >
              {isLoading ? (
                <>
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 border-4 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-300">Processing signal...</p>
                  </div>
                </>
              ) : error ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                      Error
                    </h3>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse delay-150"></div>
                    </div>
                  </div>
                  <p className="text-gray-300">{error}</p>
                  <div className="mt-6 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setError(null)}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg text-white border border-red-400/30 shadow-lg"
                    >
                      Close
                    </motion.button>
                  </div>
                </>
              ) : showInfo ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      About VitalSense
                    </h3>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-300"></div>
                    </div>
                  </div>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      VitalSense uses your webcam to capture photoplethysmography (PPG) signals, which detect subtle color
                      changes in your skin that correspond to your pulse.
                    </p>
                    <p>
                      <strong className="text-cyan-400">Heart Rate:</strong> Measured in beats per minute (BPM), indicates
                      how fast your heart is beating.
                    </p>
                    <p>
                      <strong className="text-cyan-400">HRV (RMSSD):</strong> Heart Rate Variability measures the variation
                      in time between heartbeats, an indicator of autonomic nervous system health.
                    </p>
                    <p>For best results, ensure good lighting on your face and remain still during recording.</p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowInfo(false)}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white border border-cyan-400/30 shadow-lg"
                    >
                      Close
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                      <GradientText>ArogyaBot Insight</GradientText>
                    </h3>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-150"></div>
                    </div>
                  </div>
                  {isLoadingInsight ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-12 h-12 border-4 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-300">Analyzing biometric patterns...</p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-gray-300">
                      <div className="bg-indigo-900/20 rounded-lg p-4 border border-indigo-800/30">
                        <h4 className="text-lg font-semibold text-indigo-400 mb-2">{aiInsight?.title || 'Analysis'}</h4>
                        <p>{aiInsight?.content || 'No significant patterns detected in current biometric data.'}</p>
                      </div>
                      {aiInsight?.recommendation && (
                        <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-800/30">
                          <h4 className="text-lg font-semibold text-purple-400 mb-2">Recommendation</h4>
                          <p>{aiInsight.recommendation}</p>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 italic">
                        Analysis based on current biometric readings. Not medical advice.
                      </div>
                    </div>
                  )}
                  <div className="mt-6 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAiInsight(false)}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white border border-indigo-400/30 shadow-lg"
                    >
                      Close
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {/* <footer className="relative bg-gray-800/70 border-t border-gray-700/50 py-4 mt-8 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent inline-block">
            © 2025 VitalSense | ArogyaMitra
          </p>
        </div>
      </footer> */}
    </div>
  )
}