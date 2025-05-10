"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Zap, Database, Users, Globe, MessageSquare, Sparkles } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedPricingCard } from "./animated-pricing-card";
import ThreeBackground from "./three-background"

const AnimatedPricingPage = () => {
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
    "Basic business knowledge base",
    "Human escalation support",
    "Up to 100 queries per month",
    "Email support (business hours)",
  ]

  const enterpriseFeatures = [
    "Advanced AI chat with context memory",
    "Multilingual voice assistant (5 languages)",
    "Custom business knowledge base",
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
      <ThreeBackground />

      {/* Hero section with pricing */}
      <section className="relative pt-24 pb-32">
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
              Choose Your BlueBox AI Plan
            </motion.h2>

            <motion.p
              className="text-xl tracking-tight text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Powerful business intelligence solutions tailored to your needs. Start your 14-day free trial today.
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
                description="Perfect for solo entrepreneurs and small businesses getting started with AI."
                features={soloFeatures}
                billingCycle={billingCycle}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <AnimatedPricingCard
                title="Enterprise"
                price="₹99"
                yearlyPrice="₹950"
                description="Ideal for growing businesses with advanced AI requirements."
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
                description="Tailored solutions for enterprises with specific requirements."
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
      <section className="relative py-24 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <motion.div
            className="mx-auto mb-16 max-w-3xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-4xl font-bold tracking-tight">Why choose BlueBox AI?</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Our AI-powered business intelligence platform helps you make better decisions faster.
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
              title="Business Knowledge Base"
              description="BlueBox AI learns your business processes and data to provide contextual insights."
              delay={0.1}
            />
            <AnimatedFeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="SQL Integration"
              description="Connect directly to your databases for real-time analytics and reporting."
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
              description="Make BlueBox AI your own with custom branding and personalization options."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>

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
              Ready to transform your business intelligence?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
              Join thousands of businesses already using BlueBox AI to make data-driven decisions faster.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90">
                  Start Free Trial
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Schedule Demo
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

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
        ...prev,
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

export default AnimatedPricingPage
