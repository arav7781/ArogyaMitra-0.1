"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  Zap,
  Database,
  Users,
  Globe,
  MessageSquare,
  Sparkles,
  Check,
  X,
  ChevronUp,
  Star,
  Menu,
  XIcon,
  Moon,
  Sun,
  ChevronDown,
  Quote,
  ArrowUp,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeProvider, useTheme } from "next-themes"
import * as THREE from "three"
import Link from "next/link"
import GradientText from "@/components/ui/GradientText"
import { BlurFade } from "@/components/magicui/blur-fade"
import Image from "next/image"

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  const menuItems = [
    { name: "Pricing", href: "#pricing" },
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-50 to-indigo-50 dark:bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
                    <Image
                      src="/Arogyalogo.png"
                      alt="logo"
                      width={40}
                      height={35}
                    />
                    <GradientText className="text-2xl md:text-3xl font-semibold">ArogyaMitra</GradientText>
                  </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-neutral-700 hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/handler/signup">
              <Button className="hidden md:flex bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500">login</Button>
            </Link>
            <button
              className="md:hidden p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium text-neutral-700 hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400 transition-colors py-2"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </a>
                ))}
                <Button className="w-full mt-2">Get Started</Button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// AnimatedPricingCard Component
const AnimatedPricingCard = ({
  title,
  price,
  yearlyPrice,
  description,
  features,
  isFeatured = false,
  billingCycle,
  ctaText = "Start 14-day free trial",
  ctaVariant = "default",
}) => {
  return (
    <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
      <Card
        className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl h-full ${
          isFeatured ? "border-0" : "border-neutral-200 dark:border-neutral-800"
        }`}
      >
        {isFeatured && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 opacity-90 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500"></div>
            <div className="absolute -top-6 -right-6">
              <div className="relative w-24 h-24 rotate-12 bg-yellow-400 text-yellow-900 font-bold text-xs flex items-center justify-center rounded-full">
                <span className="rotate-[-12deg]">
                  MOST
                  <br />
                  POPULAR
                </span>
              </div>
            </div>
          </>
        )}
        <div className={`${isFeatured ? "relative z-10" : ""}`}>
          <CardHeader className="pb-8">
            <CardTitle className={`text-4xl font-bold tracking-tight ${isFeatured ? "text-white" : ""}`}>
              {title}
            </CardTitle>
            <div
              className={`mt-4 flex items-baseline ${isFeatured ? "text-white" : "text-neutral-900 dark:text-neutral-50"}`}
            >
              <span className="text-4xl font-extrabold tracking-tight">
                {billingCycle === "monthly" ? price : yearlyPrice}
              </span>
              <span
                className={`ml-1 text-xl ${isFeatured ? "text-blue-100" : "text-neutral-500 dark:text-neutral-400"}`}
              >
                /{billingCycle === "monthly" ? "month" : "year"}
              </span>
            </div>
            <CardDescription className={`mt-4 text-base ${isFeatured ? "text-blue-100" : ""}`}>
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`mr-3 flex-shrink-0 rounded-full p-1 ${
                      isFeatured
                        ? "bg-blue-400/30 text-white"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </div>
                  <span className={`text-sm ${isFeatured ? "text-white" : "text-neutral-700 dark:text-neutral-300"}`}>
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 pt-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
              <Button
                className={`w-full ${
                  isFeatured
                    ? "bg-white text-blue-700 hover:bg-blue-50 dark:bg-white dark:text-blue-700 dark:hover:bg-blue-50"
                    : ctaVariant === "outline"
                      ? "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                }`}
                variant={ctaVariant}
              >
                {ctaText}
              </Button>
            </motion.div>
            <p className={`text-xs text-center ${isFeatured ? "text-blue-100" : "text-neutral-500"}`}>
              No credit card required
            </p>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  )
}

// ThreeBackground Component with Enhanced Interactivity
const ThreeBackground = () => {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const particlesRef = useRef(null)
  const frameRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 20
    cameraRef.current = camera

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 1500
    const posArray = new Float32Array(particlesCount * 3)
    const colorsArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      // Position
      posArray[i] = (Math.random() - 0.5) * 50

      // Colors - blue to purple gradient
      if (i % 3 === 0) {
        colorsArray[i] = Math.random() * 0.2 + 0.1 // R - low for blue/purple
      } else if (i % 3 === 1) {
        colorsArray[i] = Math.random() * 0.3 + 0.3 // G - medium for blue/purple
      } else {
        colorsArray[i] = Math.random() * 0.5 + 0.5 // B - high for blue/purple
      }
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)
    particlesRef.current = particles

    // Handle mouse movement
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      particles.rotation.x += 0.0005
      particles.rotation.y += 0.0005

      // Respond to mouse movement
      particles.rotation.x += mouseRef.current.y * 0.0005
      particles.rotation.y += mouseRef.current.x * 0.0005

      renderer.render(scene, camera)
      frameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }

      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }

      // Dispose resources
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 -z-10" />
}


// AnimatedFeatureCard Component
const AnimatedFeatureCard = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="mb-4 rounded-full bg-blue-100 p-3 w-fit text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
    </motion.div>
  )
}

// AnimatedParticles Component
const AnimatedParticles = () => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Create initial particles
    const initialParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))

    setParticles(initialParticles)

    // Add new particles periodically
    const interval = setInterval(() => {
      setParticles((prev) => [
        ...prev.slice(-40), // Keep only the last 40 particles to prevent too many DOM elements
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: 100 + Math.random() * 20, // Start from bottom
          size: Math.random() * 4 + 2,
          duration: Math.random() * 20 + 10,
          delay: 0,
        },
      ])
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white opacity-30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          initial={{ y: 0, opacity: 0.3 }}
          animate={{
            y: -Math.random() * 100 - 50,
            opacity: [0.3, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}

// ComparisonTable Component
const ComparisonTable = () => {
  const features = [
    { name: "AI Chat Interface", solo: true, enterprise: true, custom: true },
    { name: "Voice Assistant", solo: "English only", enterprise: "5 languages", custom: "Custom languages" },
    { name: "Knowledge Base", solo: "Basic", enterprise: "Advanced", custom: "Custom" },
    { name: "SQL Integration", solo: false, enterprise: true, custom: true },
    { name: "API Access", solo: false, enterprise: true, custom: true },
    { name: "Custom Model Training", solo: false, enterprise: false, custom: true },
    { name: "Monthly Queries", solo: "100", enterprise: "Unlimited", custom: "Unlimited" },
    { name: "Support", solo: "Email", enterprise: "Priority", custom: "Dedicated" },
    { name: "SLA Guarantee", solo: false, enterprise: false, custom: true },
    { name: "Data Retention", solo: "30 days", enterprise: "1 year", custom: "Custom" },
    { name: "User Roles", solo: "1 admin", enterprise: "Multiple roles", custom: "Custom roles" },
    { name: "Analytics Dashboard", solo: "Basic", enterprise: "Advanced", custom: "Custom" },
  ]

  return (
    <section id="comparison" className="py-16 bg-white dark:bg-neutral-900 rounded-2xl mb-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Compare Plans</Badge>
          <h2 className="text-3xl font-bold mb-4"><GradientText>Feature Comparison</GradientText></h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Compare our plans to find the perfect fit for your healthcare needs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-100 dark:bg-neutral-800">
                <TableHead className="w-1/3 font-bold">Feature</TableHead>
                <TableHead className="text-center font-bold">Solo</TableHead>
                <TableHead className="text-center font-bold">Enterprise</TableHead>
                <TableHead className="text-center font-bold">Custom</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature, index) => (
                <TableRow
                  key={feature.name}
                  className={index % 2 === 0 ? "bg-white dark:bg-neutral-900" : "bg-neutral-50 dark:bg-neutral-800/50"}
                >
                  <TableCell className="font-medium">{feature.name}</TableCell>
                  <TableCell className="text-center">
                    {typeof feature.solo === "boolean" ? (
                      feature.solo ? (
                        <Check className="h-5 w-5 mx-auto text-green-500" />
                      ) : (
                        <X className="h-5 w-5 mx-auto text-red-500" />
                      )
                    ) : (
                      feature.solo
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {typeof feature.enterprise === "boolean" ? (
                      feature.enterprise ? (
                        <Check className="h-5 w-5 mx-auto text-green-500" />
                      ) : (
                        <X className="h-5 w-5 mx-auto text-red-500" />
                      )
                    ) : (
                      feature.enterprise
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {typeof feature.custom === "boolean" ? (
                      feature.custom ? (
                        <Check className="h-5 w-5 mx-auto text-green-500" />
                      ) : (
                        <X className="h-5 w-5 mx-auto text-red-500" />
                      )
                    ) : (
                      feature.custom
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </section>
  )
}

// Testimonials Component
const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      content:
        "ArogyaMitra has transformed how we analyze healthcare data. The voice assistant feature saves us hours every week, and the insights are incredibly accurate.",
      author: "Sarah Johnson",
      role: "CTO, TechVision Inc.",
      avatar: "/axa.jpeg?height=80&width=80",
      rating: 5,
    },
    {
      id: 2,
      content:
        "We've tried several AI solutions, but ArogyaMitra stands out with its intuitive interface and powerful knowledge base. Our team was up and running in minutes.",
      author: "Michael Chen",
      role: "Data Analyst, Global Retail",
      avatar: "/asojaK.jpg?height=80&width=80",
      rating: 5,
    },
    {
      id: 3,
      content:
        "The custom model training has been a game-changer for our specific healthcare needs. The dedicated account manager ensures we're always getting the most value.",
      author: "Priya Patel",
      role: "VP of Operations, HealthTech Solutions",
      avatar: "/dd.webp?height=80&width=80",
      rating: 5,
    },
    {
      id: 4,
      content:
        "Even on the Solo plan, we've seen tremendous value. The AI chat interface understands our queries with remarkable accuracy, and the support team is fantastic.",
      author: "David Rodriguez",
      role: "Small Hospital Owner",
      avatar: "/nna.jpeg?height=80&width=80",
      rating: 4,
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(null)

  const nextTestimonial = () => {
    setDirection("right")
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setDirection("left")
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const variants = {
    enter: (direction) => ({
      x: direction === "right" ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction === "right" ? -300 : 300,
      opacity: 0,
    }),
  }

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Testimonials</Badge>
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Discover how ArogyaMitra is helping healthcare providers of all sizes make better decisions with AI-powered insights.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <div className="overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-800 p-8 md:p-12 shadow-sm">
            <div className="absolute top-6 left-8 text-blue-500 opacity-20">
              <Quote className="w-16 h-16" />
            </div>

            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative z-10"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="flex mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg md:text-xl mb-8 italic text-neutral-700 dark:text-neutral-300">
                    "{testimonials[currentIndex].content}"
                  </p>
                  <Avatar className="w-16 h-16 border-4 border-white dark:border-neutral-800">
                    <AvatarImage
                      src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                      alt={testimonials[currentIndex].author}
                    />
                    <AvatarFallback>
                      {testimonials[currentIndex].author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-4">
                    <h4 className="font-semibold">{testimonials[currentIndex].author}</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full"
                aria-label="Previous testimonial"
              >
                <ChevronUp className="h-4 w-4 rotate-270" />
              </Button>
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentIndex ? "bg-blue-600 dark:bg-blue-400" : "bg-neutral-300 dark:bg-neutral-600"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full"
                aria-label="Next testimonial"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// FAQ Component
const FAQ = () => {
  const faqs = [
    {
      question: "How does the 14-day trial work?",
      answer:
        "You can try any plan free for 14 days with no credit card required. After your trial ends, you can choose to subscribe or your account will be downgraded to our free tier with limited features. All your data will be preserved regardless of which option you choose.",
    },
    {
      question: "Can I switch plans later?",
      answer:
        "Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next billing cycle. When upgrading, you'll get immediate access to new features, and we'll prorate the cost for the remainder of your current billing period.",
    },
    {
      question: "What languages are supported?",
      answer:
        "The Solo plan supports English only. The Enterprise plan supports English, Hindi, Marathi, Gujarati, and Tamil. Custom plans can support additional languages based on your specific requirements. We're constantly adding new languages to our platform.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, ArogyaMitra uses enterprise-grade encryption and follows strict data privacy protocols. We never share your data with third parties. All data is encrypted both in transit and at rest, and we're compliant with GDPR, CCPA, and other major privacy regulations.",
    },
    {
      question: "Do you offer custom integrations?",
      answer:
        "Yes, our Enterprise and Custom plans include API access for integrations with your existing tools. The Custom plan also includes dedicated engineering support for building specialized integrations with your proprietary systems.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "Solo plans include email support during business hours. Enterprise plans include priority support with 24/7 availability via email and chat. Custom plans include a dedicated account manager and technical support team available via phone, email, and chat.",
    },
    {
      question: "Can I deploy ArogyaMitra on-premise?",
      answer:
        "Yes, on-premise deployment is available with our Custom plan. This includes installation support, security reviews, and regular updates. Contact our sales team for more information about on-premise deployment options.",
    },
    {
      question: "How does the AI model training work?",
      answer:
        "With the Custom plan, we train specialized AI models on your healthcare data and processes. This typically takes 2-4 weeks and involves collaboration with our data science team to ensure the model meets your specific requirements and use cases.",
    },
  ]

  return (
    <section id="faq" className="py-24 bg-white dark:bg-neutral-900 rounded-2xl">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">FAQ</Badge>
          <h2 className="text-3xl font-bold mb-4"><GradientText>Frequently Asked Questions</GradientText></h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Find answers to common questions about ArogyaMitra and our pricing plans.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <AccordionItem value={`item-${index}`} className="border rounded-lg bg-white dark:bg-neutral-800 px-6">
                  <AccordionTrigger className="text-left font-medium py-4">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-neutral-600 dark:text-neutral-400 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="mb-6 text-neutral-600 dark:text-neutral-400">Still have questions? We're here to help.</p>
          <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
            Contact Support
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

// Newsletter Component
const Newsletter = () => {
  return (
    <section className="py-16 bg-white dark:bg-neutral-900 rounded-2xl">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Newsletter</Badge>
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Subscribe to our newsletter for the latest updates, AI insights, and exclusive offers.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="flex-grow" />
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                Subscribe
              </Button>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-300 to-indigo-300dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                AM
              </div>
              <GradientText className="text-xl">ArogyaMitra</GradientText>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Powerful AI solutions for healthcare providers of all sizes. Make better decisions with data-driven insights.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Reviews
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Updates
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Partners
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  API Status
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} ArogyaMitra. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Back to Top Button
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// Main Page Component
export default function Page() {
  const [billingCycle, setBillingCycle] = useState("monthly")
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50])

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const soloFeatures = [
    "AI-powered chat interface",
    "Voice assistant (English only)",
    "Basic hospital knowledge base",
    "Human escalation support",
    "Up to 100 queries per month",
    "Email support (business hours)",
  ]

  const enterpriseFeatures = [
    "Advanced AI chat with context memory",
    "Multilingual voice assistant (5 languages)",
    "Custom hospital knowledge base",
    "SQL integration & data analysis",
    "Priority support with 24/7 availability",
    "Unlimited queries & API access",
  ]

  const customFeatures = [
    "All Enterprise features",
    "Custom AI model training",
    "Dedicated account manager",
    "On-premise deployment options",
    "Custom integrations & workflows",
    "SLA guarantees",
  ]

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Three.js animated background */}
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
       
      
      <ThreeBackground />

      {/* Header */}
      <Header />
        
      {/* Back to Top Button */}
      <BackToTopButton />

      {/* Hero section with pricing */}
      <section id="pricing" className="relative pt-32 pb-32">
        <div className="container mx-auto px-4">
          <motion.div className="mx-auto mb-16 max-w-3xl text-center" style={{ opacity, scale, y }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900">
                Pricing
              </Badge>
            </motion.div>

            <motion.h2
              className="mb-4 text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <GradientText>Choose Your ArogyaMitra Plan</GradientText>
            </motion.h2>

            <motion.p
              className="text-xl tracking-tight text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Powerful healthcare intelligence solutions tailored to your needs. Start your 14-day free trial today.
            </motion.p>

            <motion.div
              className="flex items-center justify-center mt-8 space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Label
                htmlFor="billing-toggle"
                className={billingCycle === "monthly" ? "font-medium" : "text-neutral-500"}
              >
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={billingCycle === "yearly"}
                onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
              />
              <Label
                htmlFor="billing-toggle"
                className={billingCycle === "yearly" ? "font-medium" : "text-neutral-500"}
              >
                Yearly{" "}
                <Badge className="ml-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900">
                  Save 20%
                </Badge>
              </Label>
            </motion.div>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <AnimatedPricingCard
                title="Solo"
                price="₹29"
                yearlyPrice="₹279"
                description="Perfect for small hospitals getting started with AI."
                features={soloFeatures}
                billingCycle={billingCycle}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <AnimatedPricingCard
                title="Enterprise"
                price="₹99"
                yearlyPrice="₹950"
                description="Ideal for growing hospitals with advanced AI requirements."
                features={enterpriseFeatures}
                isFeatured={true}
                billingCycle={billingCycle}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AnimatedPricingCard
                title="Custom"
                price="₹399"
                yearlyPrice="₹3,990"
                description="Tailored solutions for hospitals with specific requirements."
                features={customFeatures}
                billingCycle={billingCycle}
                ctaText="Contact sales"
                ctaVariant="outline"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features section with animations */}
      <section id="features" className="relative py-24 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg">
        <ThreeBackground />
        <div className="container mx-auto px-4">
          <motion.div
            className="mx-auto mb-16 max-w-3xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Features</Badge>
            <h2 className="mb-4 text-4xl font-bold tracking-tight">Why choose ArogyaMitra?</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Our AI-powered healthcare intelligence platform helps you make better decisions faster.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AnimatedFeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="Voice-Powered Intelligence"
              description="Interact with your data using natural language voice commands in multiple languages."
              delay={0}
            />
            <AnimatedFeatureCard
              icon={<Database className="h-6 w-6" />}
              title="Hospital Knowledge Base"
              description="ArogyaMitra learns your hospital processes and data to provide contextual insights."
              delay={0.1}
            />
            <AnimatedFeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="SQL Integration"
              description="Connect directly to your hospital databases for real-time analytics and reporting."
              delay={0.2}
            />
            <AnimatedFeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Human Escalation"
              description="Seamlessly transition to human support when needed for complex queries."
              delay={0.3}
            />
            <AnimatedFeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Multi-Language Support"
              description="Communicate in your preferred language with our multilingual voice assistant."
              delay={0.4}
            />
            <AnimatedFeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Custom Branding"
              description="Make ArogyaMitra your own with custom branding and personalization options."
              delay={0.5}
            />
          </div>
        </div>
      </section>
      <BlurFade delay={0.4}>
      
      <ThreeBackground />
      {/* Comparison Table */}
      <ComparisonTable />
      
     
      {/* Testimonials */}
      <Testimonials />
  
  
      {/* FAQ */}
      <FAQ />

      {/* CTA section */}
      <section className="relative py-20 overflow-hidden">
        <div className="mr-4 ml-4 absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 dark:from-purple-900 dark:to-indigo-900 opacity-90 rounded-2xl"></div>

        {/* Animated particles */}
        <AnimatedParticles />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-white">
              <GradientText>Ready to transform your hospital intelligence?</GradientText>
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-300">
              Join thousands of hospitals already using ArogyaMitra to make data-driven decisions faster.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:bg-white/90">
                  Start Free Trial
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-gradient-to-r from-purple-500 to-indigo-500">
                  Schedule Demo
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      </BlurFade>
    <BlurFade delay={0.4}>

      {/* Newsletter Section */}
      <Newsletter />
  
  
      {/* Footer */}
      <Footer />
    </BlurFade>
      </ThemeProvider>
    </div>
  )
}
