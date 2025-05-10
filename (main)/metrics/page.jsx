"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  Eye,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Zap,
  Clock,
  ArrowUpRight,
  Database,
  BarChart3,
  LineChart,
  PieChart,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import GradientText from "@/components/ui/GradientText"
import Link from "next/link"
import { UserButton } from "@stackframe/stack"
import { MenuIcon, CloseIcon } from "lucide-react"
import { ButtonGroup } from "@heroui/button"


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
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
        <nav className="hidden md:flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/pricing">Pricing</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/Docs">Docs</Link>
          </Button>
          <UserButton />
        </nav>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            {menuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {menuOpen && (
        <div className="flex flex-col gap-2 mt-4 md:hidden">
          <Button asChild variant="ghost">
            <Link href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/Docs" onClick={() => setMenuOpen(false)}>Docs</Link>
          </Button>
          <UserButton />
        </div>
      )}
    </header>
  );
}


export default function ArogyaMitraBot() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isVisible, setIsVisible] = useState(false);
  const [currentVisionSlide, setCurrentVisionSlide] = useState(0);
  const [currentTextSlide, setCurrentTextSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  const buttonRefs = [useRef(null), useRef(null)] 

  // Vision model metrics
  const visionMetrics = [
    { name: "Accuracy", base: 0.8779, finetuned: 0.9827, improvement: 11.94, color: "#4f46e5" },
    { name: "Precision", base: 0.8802, finetuned: 0.9722, improvement: 10.45, color: "#8b5cf6" },
    { name: "Recall", base: 0.8698, finetuned: 0.9692, improvement: 11.43, color: "#ec4899" },
    { name: "F1 Score", base: 0.8747, finetuned: 0.9774, improvement: 11.74, color: "#f43f5e" },
    { name: "Speed", base: 0.3090, finetuned: 0.2347, improvement: 24.04, color: "#10b981", isInverted: true },
  ];

  // Text model metrics
  const textMetrics = [
    { name: "Accuracy", base: 0.7246, finetuned: 0.8971, improvement: 23.81, color: "#4f46e5" },
    { name: "Perplexity", base: 8.0100, finetuned: 4.3396, improvement: 45.82, color: "#8b5cf6", isInverted: true },
    { name: "ROUGE-L", base: 0.6150, finetuned: 0.8208, improvement: 33.46, color: "#ec4899" },
    { name: "BLEU Score", base: 0.6039, finetuned: 0.7801, improvement: 29.17, color: "#f43f5e" },
    { name: "Speed", base: 0.0444, finetuned: 0.0417, improvement: 5.91, color: "#10b981", isInverted: true },
  ];

  // Model comparisons
  const modelComparisons = [
    { name: "Llama 3.2 7B", accuracyDiff: 7.69, speedDiff: 76.23 },
    { name: "Gemma 2B", accuracyDiff: 17.77, speedDiff: 55.31 },
    { name: "Phi-3 Mini", accuracyDiff: 17.45, speedDiff: 41.29 },
  ];

  // Vision model slides
  const visionSlides = [
    {
      title: "Performance Metrics",
      description: "Key performance indicators showing the improvement of the fine-tuned model over the base model.",
      image: "/v1.jpg",
    },
    {
      title: "Wound Classification",
      description: "Comparison of classification accuracy across different wound types.",
      image: "/v2.jpg",
    },
    {
      title: "Precision Curve",
      description: "Mean Average Precision at different IoU thresholds.",
      image: "/v3.jpg",
    },
    {
      title: "Confusion Matrix",
      description: "Comparison of base and fine-tuned model classification accuracy.",
      image: "/v4.jpg",
    },
    {
      title: "Training Metrics",
      description: "Training and validation metrics showing model convergence.",
      image: "/v5.jpg",
    },
  ];

  // Text model slides
  const textSlides = [
    {
      title: "Performance Metrics",
      description: "Key performance indicators showing the improvement of the fine-tuned Qwen 0.5B model.",
      image: "/t2.png",
    },
    {
      title: "Tasks Comparision",
      description: "NLP tasks performance after fine-tuning on medical reasoning tasks.",
      image: "/t3.png",
    },
    {
      title: "Model Comparison",
      description: "Comparison with larger models like Llama 3.2 7B, Gemma 2B, and Phi-3 Mini.",
      image: "/t1.png",
    },
  ];

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const visionInterval = setInterval(() => {
      setCurrentVisionSlide((prev) => (prev + 1) % visionSlides.length);
    }, 8000);

    const textInterval = setInterval(() => {
      setCurrentTextSlide((prev) => (prev + 1) % textSlides.length);
    }, 10000);

    return () => {
      clearInterval(visionInterval);
      clearInterval(textInterval);
    };
  }, [visionSlides.length, textSlides.length]);

  const nextVisionSlide = () => {
    setCurrentVisionSlide((prev) => (prev + 1) % visionSlides.length);
  };

  const prevVisionSlide = () => {
    setCurrentVisionSlide((prev) => (prev - 1 + visionSlides.length) % visionSlides.length);
  };

  const nextTextSlide = () => {
    setCurrentTextSlide((prev) => (prev + 1) % textSlides.length);
  };

  const prevTextSlide = () => {
    setCurrentTextSlide((prev) => (prev - 1 + textSlides.length) % textSlides.length);
  };

  const formatValue = (value, isPerplexity = false) => {
    if (isPerplexity) {
      return value.toFixed(4);
    }
    return value.toFixed(4);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from purple-300 via-fuchsia-300 to-indigo-300 text-white relative overflow-x-hidden bg-fixed">
      {/* Hero Section */}
      <Header />
      <div
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-b from-purple-300 via-fuchsia-300 to-indigo-300 py-40"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-indigo-500/10"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.3 + Math.random() * 0.2,
                scale: 1,
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
              }}
              transition={{
                duration: 8 + Math.random() * 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 mb-4">
                <GradientText>ArogyaBot's Metrics</GradientText>
              </h1>
              <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                Advanced medical AI assistant powered by fine-tuned vision and text models
              </p>
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-900/50 p-2 rounded-lg">
                  <Eye className="h-6 w-6 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Vision Model</h2>
                  <p className="text-indigo-200 text-sm">Fine-tuned Llama3.2-11B-Vision</p>
                </div>
              </div>
              <p className="text-slate-300 mb-4">
                Specialized in medical wound classification with 98.27% accuracy, a 11.94% improvement over the base model.
              </p>
              <div className="flex justify-between items-center">
                <Badge className="bg-indigo-900/50 text-indigo-200 border-indigo-700/50">
                  <Database className="mr-1 h-3 w-3" /> 18,768 Training Images
                </Badge>
                <Badge className="bg-emerald-900/50 text-emerald-200 border-emerald-700/50">
                  <Zap className="mr-1 h-3 w-3" /> 24.04% Faster Inference
                </Badge>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-900/50 p-2 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Text Model</h2>
                  <p className="text-purple-200 text-sm">Fine-tuned Qwen 0.5B</p>
                </div>
              </div>
              <p className="text-slate-300 mb-4">
                Optimized for medical reasoning with 89.71% accuracy, a 23.81% improvement over the base model.
              </p>
              <div className="flex justify-between items-center">
                <Badge className="bg-purple-900/50 text-purple-200 border-purple-700/50">
                  <Database className="mr-1 h-3 w-3" /> Medical-o1-reasoning Dataset
                </Badge>
                <Badge className="bg-emerald-900/50 text-emerald-200 border-emerald-700/50">
                  <Zap className="mr-1 h-3 w-3" /> 45.82% Lower Perplexity
                </Badge>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                      {[
                        { href: "#dashboard-content", text: "Explore Performance Metrics", ref: buttonRefs[0] },
                        { href: "https://huggingface.co/devank2000/llama-3-vision-lora/", text: "Deployed Vision Model", ref: buttonRefs[1] },
                        { href: "https://huggingface.co/devank2000/qwen0.5B-fine-tunned/", text: "Deployed Text Model", ref: buttonRefs[2] },
                      ].map((button, index) => (
                        <motion.div
                          key={index}
                          className="group relative inline-block"
                          style={{ transformStyle: "preserve-3d", transition: "transform 0.1s ease" }}
                          ref={button.ref}
                        >
                          {/* Button glow effect */}
                          <motion.div
                            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500 blur-xl opacity-50 group-hover:opacity-70 transition-opacity"
                            animate={{
                              boxShadow: [
                                "0 0 20px rgba(168, 85, 247, 0.5)",
                                "0 0 40px rgba(168, 85, 247, 0.7)",
                                "0 0 20px rgba(168, 85, 247, 0.5)",
                              ],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          />
          
                          {/* Main button */}
                          <Button
                          
                            variant="ghost"
                            className="relative p-6 pl-16 pr-16 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500 backdrop-blur-sm rounded-3xl text-white  text-lg shadow-lg overflow-hidden z-10"
                     
                          >
                            <Link href={button.href}>
                            
                              {/* Shine effect */}
                              <motion.div
                                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                              />
          
                              {/* Button content */}
                              <div className="flex items-center justify-center gap-3 relative">
                                <span>{button.text}</span>
                              </div>
                            </Link>
                          
                          </Button>
          
                          {/* Floating particles around button */}
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-3 h-3 rounded-full bg-purple-500"
                              initial={{
                                x: Math.random() * 200 - 100,
                                y: Math.random() * 200 - 100,
                                scale: 0,
                                opacity: 0,
                              }}
                              animate={{
                                x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                                y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                                scale: [0, 1, 0],
                                opacity: [0, 0.8, 0],
                              }}
                              transition={{
                                duration: Math.random() * 2 + 2,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: Math.random() * 2,
                              }}
                            />
                          ))}
                        </motion.div>
                      ))}
                    </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div id="dashboard-content" className="container mx-auto px-4 py-12">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-8">
            <TabsList className="bg-slate-800/50 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600">
                <Brain className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="vision" className="data-[state=active]:bg-indigo-600">
                <Eye className="mr-2 h-4 w-4" />
                Vision Model
              </TabsTrigger>
              <TabsTrigger value="text" className="data-[state=active]:bg-indigo-600">
                <MessageSquare className="mr-2 h-4 w-4" />
                Text Model
              </TabsTrigger>
              <TabsTrigger value="comparison" className="data-[state=active]:bg-indigo-600">
                <BarChart3 className="mr-2 h-4 w-4" />
                Model Comparison
              </TabsTrigger>
            </TabsList>

            <Badge variant="outline" className="bg-indigo-900/30 text-indigo-200 border-indigo-500">
              <Sparkles className="mr-2 h-4 w-4" />
              ArogyaMitra's ArogyaBot
            </Badge>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-6 mb-8"
                >
                  <h2 className="text-2xl font-semibold text-white mb-4">ArogyaMitra's ArogyaBot</h2>
                  <p className="text-slate-300 mb-6">
                    ArogyaBot is an advanced medical AI assistant that combines the power of fine-tuned vision and text models
                    to provide comprehensive medical assistance. The system can analyze medical images for wound classification
                    and engage in medical reasoning dialogues with healthcare professionals and patients.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex gap-4">
                      <div className="mt-1 bg-indigo-900/30 p-2 rounded-lg h-fit">
                        <Eye className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white mb-1">Wound Classification</h3>
                        <p className="text-slate-300 text-sm">
                          Accurately identifies and classifies 9 different types of wounds including burns, cuts, and abrasions
                          with 98.27% accuracy.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="mt-1 bg-purple-900/30 p-2 rounded-lg h-fit">
                        <MessageSquare className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white mb-1">Medical Reasoning</h3>
                        <p className="text-slate-300 text-sm">
                          Provides medical reasoning and answers with 89.71% accuracy using a lightweight but powerful Qwen 0.5B
                          model.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="mt-1 bg-emerald-900/30 p-2 rounded-lg h-fit">
                        <Zap className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white mb-1">Efficient Performance</h3>
                        <p className="text-slate-300 text-sm">
                          Optimized for speed with 24.04% faster vision inference and 5.91% faster text generation than base
                          models.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="mt-1 bg-amber-900/30 p-2 rounded-lg h-fit">
                        <Layers className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white mb-1">Multimodal Capabilities</h3>
                        <p className="text-slate-300 text-sm">
                          Seamlessly integrates vision and text understanding for comprehensive medical assistance.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="bg-slate-800/40 border-slate-700 overflow-hidden">
                    <CardHeader className="bg-slate-800/60">
                      <CardTitle className="text-xl text-white">Performance Highlights</CardTitle>
                      <CardDescription className="text-slate-300">
                        Key improvements over base models
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-slate-800/60 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Eye className="h-5 w-5 text-indigo-400" />
                            <h3 className="text-lg font-medium text-white">Vision Model</h3>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-slate-300">Accuracy</span>
                                <span className="text-sm text-indigo-300">98.27%</span>
                              </div>
                              <Progress value={98.27} className="h-2 bg-slate-700">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                              </Progress>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-slate-300">F1 Score</span>
                                <span className="text-sm text-indigo-300">97.74%</span>
                              </div>
                              <Progress value={97.74} className="h-2 bg-slate-700">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                              </Progress>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-slate-300">Speed Improvement</span>
                                <span className="text-sm text-indigo-300">24.04%</span>
                              </div>
                              <Progress value={24.04} max={50} className="h-2 bg-slate-700">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                              </Progress>
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-800/60 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-5 w-5 text-purple-400" />
                            <h3 className="text-lg font-medium text-white">Text Model</h3>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-slate-300">Accuracy</span>
                                <span className="text-sm text-purple-300">89.71%</span>
                              </div>
                              <Progress value={89.71} className="h-2 bg-slate-700">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                              </Progress>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-slate-300">Perplexity Reduction</span>
                                <span className="text-sm text-purple-300">45.82%</span>
                              </div>
                              <Progress value={45.82} max={50} className="h-2 bg-slate-700">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                              </Progress>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-slate-300">ROUGE-L Score</span>
                                <span className="text-sm text-purple-300">82.08%</span>
                              </div>
                              <Progress value={82.08} className="h-2 bg-slate-700">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                              </Progress>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-800/60 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-white mb-3">Comparison with Larger Models</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {modelComparisons.map((model, index) => (
                            <div key={index} className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                              <h4 className="text-md font-medium text-white mb-2">{model.name}</h4>
                              <div className="flex items-center gap-1 text-emerald-400 text-sm mb-1">
                                <ArrowUpRight className="h-3 w-3" />
                                <span>+{model.accuracyDiff.toFixed(2)}% Accuracy</span>
                              </div>
                              <div className="flex items-center gap-1 text-emerald-400 text-sm">
                                <Zap className="h-3 w-3" />
                                <span>+{model.speedDiff.toFixed(2)}% Speed</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-slate-800/30 border-t border-slate-700/50 flex justify-between">
                      <span className="text-sm text-slate-400">
                        Compared to base models and larger alternatives
                      </span>
                      <Badge variant="outline" className="bg-indigo-900/30 text-indigo-200 border-indigo-500">
                        <Sparkles className="mr-2 h-3 w-3" />
                        Optimized for Medical Domain
                      </Badge>
                    </CardFooter>
                  </Card>
                </motion.div>
              </div>

              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="sticky top-6 space-y-6"
                >
                  <Card className="bg-slate-800/40 border-slate-700 overflow-hidden">
                    <CardHeader className="bg-slate-800/60">
                      <CardTitle className="text-xl text-white">Datasets</CardTitle>
                      <CardDescription className="text-slate-300">Training data information</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="bg-slate-900/60 rounded-lg p-4 border border-indigo-900/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="h-4 w-4 text-indigo-400" />
                          <h3 className="font-medium text-white">Vision Dataset</h3>
                        </div>
                        <p className="text-slate-300 text-sm mb-3">
                          Roboflow wound classification dataset with 18,768 annotated medical images.
                        </p>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="bg-slate-800/60 rounded p-2 text-center">
                            <div className="text-xs text-slate-400">Train</div>
                            <div className="text-sm font-medium text-white">15,456</div>
                          </div>
                          <div className="bg-slate-800/60 rounded p-2 text-center">
                            <div className="text-xs text-slate-400">Valid</div>
                            <div className="text-sm font-medium text-white">2,208</div>
                          </div>
                          <div className="bg-slate-800/60 rounded p-2 text-center">
                            <div className="text-xs text-slate-400">Test</div>
                            <div className="text-sm font-medium text-white">1,104</div>
                          </div>
                        </div>
                        <a
                          href="https://universe.roboflow.com/nandozz/wd5-copy/dataset/1"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 text-sm flex items-center hover:underline"
                        >
                          View Dataset <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>

                      <div className="bg-slate-900/60 rounded-lg p-4 border border-purple-900/30">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-purple-400" />
                          <h3 className="font-medium text-white">Text Dataset</h3>
                        </div>
                        <p className="text-slate-300 text-sm mb-3">
                          Medical-o1-reasoning-SFT dataset for medical reasoning and dialogue.
                        </p>
                        <a
                          href="https://huggingface.co/datasets/FreedomIntelligence/medical-o1-reasoning-SFT"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 text-sm flex items-center hover:underline"
                        >
                          View Dataset <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/40 border-slate-700 overflow-hidden">
                    <CardHeader className="bg-slate-800/60">
                      <CardTitle className="text-xl text-white">Training Notebooks</CardTitle>
                      <CardDescription className="text-slate-300">Fine-tuning resources</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="h-4 w-4 text-indigo-400" />
                          <h3 className="font-medium text-white">Vision Model Training</h3>
                        </div>
                        <a
                          href="https://colab.research.google.com/drive/1ItkwtocBTdgzDtWczkWfFIs0WCmCeX17"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 text-sm flex items-center hover:underline"
                        >
                          Open Colab Notebook <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>

                      <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-purple-400" />
                          <h3 className="font-medium text-white">Text Model Training</h3>
                        </div>
                        <a
                          href="https://colab.research.google.com/drive/1mVFQZzMSzJmzqVqEL3ESEo3Ug3qp4x7d"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 text-sm flex items-center hover:underline"
                        >
                          Open Colab Notebook <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          {/* Vision Model Tab */}
          <TabsContent value="vision" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {visionMetrics.map((metric, index) => (
                <MetricCard
                  key={index}
                  title={metric.name}
                  baseValue={metric.base}
                  fineTunedValue={metric.finetuned}
                  improvement={metric.improvement}
                  color={metric.color}
                  isInverted={metric.isInverted}
                  unit={metric.isInverted ? "s" : ""}
                />
              ))}
            </div>

            <Card className="bg-slate-800/40 border-slate-700 overflow-hidden mb-8">
              <CardHeader className="bg-slate-800/60">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl text-white">{visionSlides[currentVisionSlide].title}</CardTitle>
                    <CardDescription className="text-slate-300">
                      {visionSlides[currentVisionSlide].description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevVisionSlide}
                      className="bg-slate-700/50 hover:bg-slate-700 border-slate-600"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextVisionSlide}
                      className="bg-slate-700/50 hover:bg-slate-700 border-slate-600"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentVisionSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="p-6"
                  >
                    <div className="relative aspect-video w-full bg-slate-900/50 rounded-lg overflow-hidden">
                      <Image
                        src={visionSlides[currentVisionSlide].image}
                        alt={visionSlides[currentVisionSlide].title}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
              <CardFooter className="bg-slate-800/30 border-t border-slate-700/50 flex justify-between">
                <span className="text-sm text-slate-400">
                  Slide {currentVisionSlide + 1} of {visionSlides.length}
                </span>
                <Badge variant="outline" className="bg-indigo-900/30 text-indigo-200 border-indigo-500">
                  <Zap className="mr-2 h-3 w-3" />
                  Fine-tuned Llama3.2-11B-Vision
                </Badge>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/40 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Dataset Information</CardTitle>
                  <CardDescription className="text-slate-300">
                    Roboflow wound classification dataset
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                        <div className="text-sm text-slate-400">Total Images</div>
                        <div className="text-xl font-semibold text-white">18,768</div>
                      </div>
                      <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                        <div className="text-sm text-slate-400">Classes</div>
                        <div className="text-xl font-semibold text-white">9</div>
                      </div>
                      <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                        <div className="text-sm text-slate-400">Image Size</div>
                        <div className="text-xl font-semibold text-white">640×640</div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-2">Wound Classes</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                          <span className="text-sm text-slate-300">First-degree</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span className="text-sm text-slate-300">Second-degree</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                          <span className="text-sm text-slate-300">Third-degree</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-sm text-slate-300">Abrasions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                          <span className="text-sm text-slate-300">Bruises</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <span className="text-sm text-slate-300">Cut</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm text-slate-300">Laceration</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-lime-500"></div>
                          <span className="text-sm text-slate-300">Stab Wound</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm text-slate-300">Wound</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/40 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Training Details</CardTitle>
                  <CardDescription className="text-slate-300">
                    Fine-tuning process information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-2">Base Model</h3>
                      <p className="text-sm text-slate-300">
                        Llama3.2-11B-Vision, a multimodal model capable of processing both images and text.
                      </p>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-2">Fine-tuning Approach</h3>
                      <p className="text-sm text-slate-300 mb-2">
                        Parameter-efficient fine-tuning with LoRA adapters, optimized for medical wound classification.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Learning Rate</div>
                          <div className="text-sm font-medium text-white">2e-4</div>
                        </div>
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Batch Size</div>
                          <div className="text-sm font-medium text-white">16</div>
                        </div>
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Epochs</div>
                          <div className="text-sm font-medium text-white">20</div>
                        </div>
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">LoRA Rank</div>
                          <div className="text-sm font-medium text-white">16</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-2">Data Augmentation</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                          <span className="text-sm text-slate-300">Horizontal Flip</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                          <span className="text-sm text-slate-300">Vertical Flip</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                          <span className="text-sm text-slate-300">Rotation (±11°)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                          <span className="text-sm text-slate-300">Brightness (±15%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Text Model Tab */}
          <TabsContent value="text" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {textMetrics.map((metric, index) => (
                <MetricCard
                  key={index}
                  title={metric.name}
                  baseValue={metric.base}
                  fineTunedValue={metric.finetuned}
                  improvement={metric.improvement}
                  color={metric.color}
                  isInverted={metric.isInverted}
                  unit={metric.isInverted && metric.name === "Speed" ? "s" : ""}
                  isPerplexity={metric.name === "Perplexity"}
                />
              ))}
            </div>

            <Card className="bg-slate-800/40 border-slate-700 overflow-hidden mb-8">
              <CardHeader className="bg-slate-800/60">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl text-white">{textSlides[currentTextSlide].title}</CardTitle>
                    <CardDescription className="text-slate-300">
                      {textSlides[currentTextSlide].description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevTextSlide}
                      className="bg-slate-700/50 hover:bg-slate-700 border-slate-600"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextTextSlide}
                      className="bg-slate-700/50 hover:bg-slate-700 border-slate-600"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTextSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="p-6"
                  >
                    <div className="relative aspect-video w-full bg-slate-900/50 rounded-lg overflow-hidden">
                      <Image
                        src={textSlides[currentTextSlide].image || "/placeholder.svg"}
                        alt={textSlides[currentTextSlide].title}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
              <CardFooter className="bg-slate-800/30 border-t border-slate-700/50 flex justify-between">
                <span className="text-sm text-slate-400">
                  Slide {currentTextSlide + 1} of {textSlides.length}
                </span>
                <Badge variant="outline" className="bg-purple-900/30 text-purple-200 border-purple-700/50">
                  <Zap className="mr-2 h-3 w-3" />
                  Fine-tuned Qwen 0.5B
                </Badge>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/40 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Model Comparison</CardTitle>
                  <CardDescription className="text-slate-300">
                    Qwen 0.5B vs. larger models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-3">Accuracy vs. Model Size</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Qwen 0.5B (Fine-tuned)</span>
                            <span className="text-sm text-purple-300">89.71%</span>
                          </div>
                          <Progress value={89.71} className="h-2 bg-slate-700">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                          </Progress>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Phi-3 Mini (2.7B)</span>
                            <span className="text-sm text-slate-300">76.38%</span>
                          </div>
                          <Progress value={76.38} className="h-2 bg-slate-700">
                            <div className="h-full bg-slate-500 rounded-full" />
                          </Progress>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Gemma 2B</span>
                            <span className="text-sm text-slate-300">76.17%</span>
                          </div>
                          <Progress value={76.17} className="h-2 bg-slate-700">
                            <div className="h-full bg-slate-500 rounded-full" />
                          </Progress>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Llama 3.2 7B</span>
                            <span className="text-sm text-slate-300">83.30%</span>
                          </div>
                          <Progress value={83.3} className="h-2 bg-slate-700">
                            <div className="h-full bg-slate-500 rounded-full" />
                          </Progress>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-3">Inference Speed (seconds)</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Qwen 0.5B (Fine-tuned)</span>
                            <span className="text-sm text-purple-300">0.0417s</span>
                          </div>
                          <Progress value={4.17} max={20} className="h-2 bg-slate-700">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                          </Progress>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Phi-3 Mini (2.7B)</span>
                            <span className="text-sm text-slate-300">0.0710s</span>
                          </div>
                          <Progress value={7.1} max={20} className="h-2 bg-slate-700">
                            <div className="h-full bg-slate-500 rounded-full" />
                          </Progress>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Gemma 2B</span>
                            <span className="text-sm text-slate-300">0.0933s</span>
                          </div>
                          <Progress value={9.33} max={20} className="h-2 bg-slate-700">
                            <div className="h-full bg-slate-500 rounded-full" />
                          </Progress>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Llama 3.2 7B</span>
                            <span className="text-sm text-slate-300">0.1754s</span>
                          </div>
                          <Progress value={17.54} max={20} className="h-2 bg-slate-700">
                            <div className="h-full bg-slate-500 rounded-full" />
                          </Progress>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/40 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Training Details</CardTitle>
                  <CardDescription className="text-slate-300">
                    Fine-tuning process information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-2">Base Model</h3>
                      <p className="text-sm text-slate-300">
                        Qwen 0.5B, a lightweight but powerful language model optimized for efficiency.
                      </p>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-2">Dataset</h3>
                      <p className="text-sm text-slate-300 mb-2">
                        Medical-o1-reasoning-SFT dataset from FreedomIntelligence, containing medical reasoning tasks and dialogues.
                      </p>
                      <a
                        href="https://huggingface.co/datasets/FreedomIntelligence/medical-o1-reasoning-SFT"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 text-sm flex items-center hover:underline"
                      >
                        View Dataset <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-2">Fine-tuning Approach</h3>
                      <p className="text-sm text-slate-300 mb-2">
                        Full fine-tuning with optimized hyperparameters for medical domain adaptation.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Learning Rate</div>
                          <div className="text-sm font-medium text-white">5e-5</div>
                        </div>
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Batch Size</div>
                          <div className="text-sm font-medium text-white">32</div>
                        </div>
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Epochs</div>
                          <div className="text-sm font-medium text-white">3</div>
                        </div>
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Weight Decay</div>
                          <div className="text-sm font-medium text-white">0.01</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-2">Key Advantages</h3>
                      <ul className="text-sm text-slate-300 space-y-1 list-disc pl-4">
                        <li>Significantly smaller model size (0.5B vs 7B+ parameters)</li>
                        <li>4x faster inference than larger models</li>
                        <li>Competitive accuracy despite smaller size</li>
                        <li>Lower memory and compute requirements</li>
                        <li>Optimized for medical domain knowledge</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Model Comparison Tab */}
          <TabsContent value="comparison" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="bg-slate-800/40 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Vision vs. Text Model Performance</CardTitle>
                  <CardDescription className="text-slate-300">
                    Comparison of improvement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-3">Accuracy Improvement</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Vision Model</span>
                            <span className="text-sm text-indigo-300">+11.94%</span>
                          </div>
                          <Progress value={11.94} max={50} className="h-2 bg-slate-700">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" />
                          </Progress>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Text Model</span>
                            <span className="text-sm text-purple-300">+23.81%</span>
                          </div>
                          <Progress value={23.81} max={50} className="h-2 bg-slate-700">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                          </Progress>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-3">Speed Improvement</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Vision Model</span>
                            <span className="text-sm text-indigo-300">+24.04%</span>
                          </div>
                          <Progress value={24.04} max={50} className="h-2 bg-slate-700">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" />
                          </Progress>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Text Model</span>
                            <span className="text-sm text-purple-300">+5.91%</span>
                          </div>
                          <Progress value={5.91} max={50} className="h-2 bg-slate-700">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                          </Progress>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-3">Overall Improvement</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                          <div className="text-sm text-indigo-300 mb-1">Vision Model</div>
                          <div className="text-2xl font-semibold text-white">11.94%</div>
                          <div className="text-xs text-slate-400">Accuracy Improvement</div>
                        </div>
                        <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                          <div className="text-sm text-purple-300 mb-1">Text Model</div>
                          <div className="text-2xl font-semibold text-white">23.81%</div>
                          <div className="text-xs text-slate-400">Accuracy Improvement</div>
                        </div>
                        <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                          <div className="text-sm text-indigo-300 mb-1">Vision Model</div>
                          <div className="text-2xl font-semibold text-white">24.04%</div>
                          <div className="text-xs text-slate-400">Speed Improvement</div>
                        </div>
                        <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                          <div className="text-sm text-purple-300 mb-1">Text Model</div>
                          <div className="text-2xl font-semibold text-white">45.82%</div>
                          <div className="text-xs text-slate-400">Perplexity Reduction</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/40 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Model Size vs. Performance</CardTitle>
                  <CardDescription className="text-slate-300">
                    Efficiency analysis of fine-tuned models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-3">Model Parameters</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Llama3.2-11B-Vision</span>
                            <span className="text-sm text-indigo-300">11 Billion</span>
                          </div>
                          <Progress value={11} max={11} className="h-2 bg-slate-700">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" />
                          </Progress>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Qwen 0.5B</span>
                            <span className="text-sm text-purple-300">0.5 Billion</span>
                          </div>
                          <Progress value={0.5} max={11} className="h-2 bg-slate-700">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                          </Progress>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-3">Efficiency Analysis</h3>
                      <div className="space-y-4">
                        <p className="text-sm text-slate-300">
                          The fine-tuned models demonstrate exceptional efficiency in their respective domains:
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="bg-slate-800/60 rounded-lg p-3 border border-indigo-900/30">
                            <h4 className="text-sm font-medium text-indigo-300 mb-1">Vision Model Insights</h4>
                            <p className="text-xs text-slate-300">
                              The Llama3.2-11B-Vision model achieves state-of-the-art performance for wound classification
                              with 98.27% accuracy. While it has a large parameter count, the fine-tuning process focused
                              on optimizing specific layers for medical image analysis, resulting in a 24.04% speed improvement.
                            </p>
                          </div>
                          <div className="bg-slate-800/60 rounded-lg p-3 border border-purple-900/30">
                            <h4 className="text-sm font-medium text-purple-300 mb-1">Text Model Insights</h4>
                            <p className="text-xs text-slate-300">
                              The Qwen 0.5B model demonstrates that smaller models can achieve competitive performance
                              when properly fine-tuned. Despite being 22x smaller than Llama 3.2 7B, it achieves 7.69%
                              better accuracy and 76.23% faster inference, making it ideal for resource-constrained environments.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                      <h3 className="text-md font-medium text-white mb-3">Combined System Benefits</h3>
                      <ul className="text-sm text-slate-300 space-y-1 list-disc pl-4">
                        <li>Specialized models for different medical tasks</li>
                        <li>Optimized performance-to-resource ratio</li>
                        <li>Complementary capabilities (vision + reasoning)</li>
                        <li>Domain-specific fine-tuning for healthcare</li>
                        <li>Balanced approach to model size and performance</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/40 border-slate-700 overflow-hidden">
              <CardHeader className="bg-slate-800/60">
                <CardTitle className="text-xl text-white">ArogyaBot System Architecture</CardTitle>
                <CardDescription className="text-slate-300">
                  Integration of vision and text models for comprehensive medical assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-slate-900/60 rounded-lg p-6 border border-slate-700/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 bg-indigo-900/20 rounded-lg p-4 border border-indigo-900/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="h-5 w-5 text-indigo-400" />
                        <h3 className="text-lg font-medium text-white">Vision Module</h3>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">
                        Fine-tuned Llama3.2-11B-Vision model specialized in medical wound classification.
                      </p>
                      <div className="space-y-2">
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Input</div>
                          <div className="text-sm font-medium text-white">Medical Images</div>
                        </div>
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Output</div>
                          <div className="text-sm font-medium text-white">Wound Classification</div>
                        </div>
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Accuracy</div>
                          <div className="text-sm font-medium text-white">98.27%</div>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-1 bg-purple-900/20 rounded-lg p-4 border border-purple-900/30">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="h-5 w-5 text-purple-400" />
                        <h3 className="text-lg font-medium text-white">Text Module</h3>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">
                        Fine-tuned Qwen 0.5B model optimized for medical reasoning and dialogue.
                      </p>
                      <div className="space-y-2">
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Input</div>
                          <div className="text-sm font-medium text-white">Medical Queries</div>
                        </div>
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Output</div>
                          <div className="text-sm font-medium text-white">Medical Reasoning</div>
                        </div>
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Accuracy</div>
                          <div className="text-sm font-medium text-white">89.71%</div>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-1 bg-emerald-900/20 rounded-lg p-4 border border-emerald-900/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="h-5 w-5 text-emerald-400" />
                        <h3 className="text-lg font-medium text-white">Integration Layer</h3>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">
                        Orchestration system that combines vision and text model outputs for comprehensive assistance.
                      </p>
                      <div className="space-y-2">
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Function</div>
                          <div className="text-sm font-medium text-white">Multimodal Fusion</div>
                        </div>
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Output</div>
                          <div className="text-sm font-medium text-white">Unified Response</div>
                        </div>
                        <div className="bg-slate-800/60 rounded p-2">
                          <div className="text-xs text-slate-400">Interface</div>
                          <div className="text-sm font-medium text-white">ArogyaBot API</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-slate-800/60 rounded-lg p-4 border border-slate-700/50">
                    <h3 className="text-md font-medium text-white mb-3">System Workflow</h3>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="text-center p-3">
                        <div className="bg-slate-700/60 rounded-full p-3 inline-block mb-2">
                          <Database className="h-6 w-6 text-slate-300" />
                        </div>
                        <div className="text-sm text-slate-300">Input Data</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-500 rotate-90 md:rotate-0 my-2 md:my-0" />
                      <div className="text-center p-3">
                        <div className="bg-indigo-900/30 rounded-full p-3 inline-block mb-2">
                          <Eye className="h-6 w-6 text-indigo-300" />
                        </div>
                        <div className="text-sm text-slate-300">Vision Analysis</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-500 rotate-90 md:rotate-0 my-2 md:my-0" />
                      <div className="text-center p-3">
                        <div className="bg-purple-900/30 rounded-full p-3 inline-block mb-2">
                          <MessageSquare className="h-6 w-6 text-purple-300" />
                        </div>
                        <div className="text-sm text-slate-300">Text Reasoning</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-500 rotate-90 md:rotate-0 my-2 md:my-0" />
                      <div className="text-center p-3">
                        <div className="bg-emerald-900/30 rounded-full p-3 inline-block mb-2">
                          <Brain className="h-6 w-6 text-emerald-300" />
                        </div>
                        <div className="text-sm text-slate-300">Integration</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-500 rotate-90 md:rotate-0 my-2 md:my-0" />
                      <div className="text-center p-3">
                        <div className="bg-amber-900/30 rounded-full p-3 inline-block mb-2">
                          <Sparkles className="h-6 w-6 text-amber-300" />
                        </div>
                        <div className="text-sm text-slate-300">Response</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-800/30 border-t border-slate-700/50 flex justify-between">
                <span className="text-sm text-slate-400">
                  ArogyaMitra's ArogyaBot - Advanced Medical AI Assistant
                </span>
                <Badge variant="outline" className="bg-indigo-900/30 text-indigo-200 border-indigo-500">
                  <Sparkles className="mr-2 h-3 w-3" />
                  Multimodal Medical AI
                </Badge>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="py-8 px-4 md:px-8 bg-gradient-to-b from-purple-300 via-fuchsia-300 to-indigo-300">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 text-sm">
            ArogyaBot - Powered by Fine-tuned Llama3.2-11B-Vision and Qwen 0.5B Models
          </p>
          <p className="text-slate-500 text-xs mt-2">
            © {new Date().getFullYear()} ArogyaMitra Medical AI Research Team
          </p>
        </div>
      </footer>
    </div>
  );
}

function MetricCard({ title, baseValue, fineTunedValue, improvement, color, isInverted = false, unit = "", isPerplexity = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="bg-slate-800/40 border-slate-700 h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg text-white">{title}</CardTitle>
            {title === "Accuracy" && <PieChart className="h-5 w-5" style={{ color }} />}
            {title === "Precision" && <BarChart3 className="h-5 w-5" style={{ color }} />}
            {title === "Recall" && <BarChart3 className="h-5 w-5" style={{ color }} />}
            {title === "F1 Score" && <BarChart3 className="h-5 w-5" style={{ color }} />}
            {title === "Speed" && <Clock className="h-5 w-5" style={{ color }} />}
            {title === "Perplexity" && <LineChart className="h-5 w-5" style={{ color }} />}
            {title === "ROUGE-L" && <BarChart3 className="h-5 w-5" style={{ color }} />}
            {title === "BLEU Score" && <BarChart3 className="h-5 w-5" style={{ color }} />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/60 rounded-lg p-3">
              <div className="text-sm text-slate-400 mb-1">Base Model</div>
              <div className="text-xl font-semibold text-slate-200">
                {isPerplexity
                  ? baseValue.toFixed(4)
                  : isInverted
                  ? baseValue.toFixed(4) + unit
                  : (baseValue * 100).toFixed(2) + "%"}
              </div>
            </div>
            <div className="bg-slate-900/30 rounded-lg p-3 border" style={{ borderColor: `${color}30` }}>
              <div className="text-sm mb-1" style={{ color }}>
                Fine-tuned
              </div>
              <div className="text-xl font-semibold text-slate-200">
                {isPerplexity
                  ? fineTunedValue.toFixed(4)
                  : isInverted
                  ? fineTunedValue.toFixed(4) + unit
                  : (fineTunedValue * 100).toFixed(2) + "%"}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center">
            <Zap className="h-4 w-4 text-emerald-400 mr-1" />
            <span className="text-emerald-400 font-medium">
              {isInverted ? "-" : "+"}
              {improvement.toFixed(2)}%
            </span>
            <span className="ml-1 text-slate-400 text-sm">
              {isInverted ? "reduction" : "improvement"}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
