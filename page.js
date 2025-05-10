"use client"
import { useState, createContext, useContext } from "react"
import { motion, useScroll, useTransform ,useInView,AnimatePresence} from "framer-motion"
import Link from "next/link"
import {Button} from "@/components/ui/button";
import { BlurFade } from "@/components/magicui/blur-fade"
import IndiaGradient  from "@/components/ui/IndiaGradient"
import  GradientText  from "@/components/ui/GradientText"
import ShinyText from "@/components/ui/Shiny";
import InfiniteScrollingLogosAnimationReverse from "./components/revscroll";
import { Bot, MessageCircle, Activity } from "lucide-react"
// Icons
import { Heart, Shield, Clock, Star, Globe, ChevronDown, Menu, X } from "lucide-react"
import InfiniteScrollingLogosAnimation from "./components/scrolling";
import { RevealLinks } from "@/components/ui/links";
import Bubble from "@/components/ui/bubbletext";
import BubbleText from "@/components/ui/bubbletext";
import FloatingPhone from "@/components/ui/phone";
import InfiniteMenu from "@/components/ui/infinitemenu";
import Threads from "@/components/ui/wave";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import ScrollVelocity from "@/components/ui/scrolll";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import WorldMap from "@/components/ui/world-map";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { TestimonialCard, Testimonials } from "@/components/ui/testimonial";
import FeaturesSectionDemo from "./components/vitalssec";
import Globeee from "./components/Globe";
import { useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react"
import { Users, Hospital, Award , Quote, ChevronLeft, ChevronRight} from "lucide-react"
import { FaRocket, FaCommentAlt, FaHospital, FaBrain, FaStethoscope, FaMagic, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import TryChatbotSection from "@/components/ui/trychatbot";
import InteractiveChatbotPreview from "@/components/ui/chat";
import InteractiveHealthAssessment from "@/components/ui/healthassesment";
import AIPulseVisualizer from "@/components/ui/pulse-vizual";
import HolographicBodyScanner from "@/components/ui/bodycan";
import TechStackShowcase from "@/components/ui/TechStack";



// Create language context
const LanguageContext = createContext()

// Language provider component
const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en")

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

// Custom hook to use language
const useLanguage = () => useContext(LanguageContext)

// Translations
const translations = {
  en: {
    nav: {
      home: "Home",
      pricing: "Pricing",
      features: "Features",
      demo: "Demo",
      contact: "Contact",

    },
    hero: {
      title: "Your Health,",
      titleGradient: "Our Priority",
      callUs: "Call Us: +1(920)-375-7113",
      description:
        "We are committed to your health and well-being by providing you with the best healthcare services"
    },
    features: {
      title: "Features",
      heading: "How ArogyaMitra Helps You",
      description: "Our platform provides comprehensive health and wellness support with these key features",
      personalizedCare: {
        title: "Personalized Care",
        description: "Get tailored care based on your specific needs and history.",
      },
      availability: {
        title: "24/7 Availability",
        description: "Access care anytime, day or night, without waiting for appointments.",
      },
      secure: {
        title: "Secure & Private",
        description: "Your health data is protected with enterprise-grade security.",
      },
    },
    video: {
      title: "Watch & Learn",
      heading: "See ArogyaMitra in Action",
      description: "Watch how our AI business intelligence assistant can transform your business insights experience",
      demo: "ArogyaMitra AI Demo",
      seeHow: "See how our AI assistant works",
      tryIt: "Try It Yourself",
    },
    testimonials: {
      title: "Testimonials",
      heading: "What Our Users Say",
      description: "Hear from people who have transformed their health and wellness experience with ArogyaMitra",
    },
    cta: {
      heading: "Ready to transform your health and wellness experience?",
      description: "Join our community of users who have made ArogyaMitra their trusted health and wellness companion.",
      getStarted: "Get Started",
      contactUs: "Contact Us",
    },
    footer: {
      description:
        "AI-powered health and wellness assistant available 24/7 to address your health concerns and provide guidance with personalized insights.",
      rights: "All rights reserved.",
      quickLinks: "Quick Links",
      contact: "Contact",
      designedWith: "Designed with ❤️ by DataWizards",
    },
    languageSelector: "Language",
  },
  
}



// Language selector component
const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: "en", name: "English" },
  ]

  return (
    <div className="relative">
      <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900" onClick={() => setIsOpen(!isOpen)}>
        <Globe size={16} />
        <span>{languages.find((l) => l.code === language)?.name}</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setLanguage(lang.code)
                  setIsOpen(false)
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


// Header Component
const Header = () => {
  const { language } = useLanguage()
  const t = translations[language]
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-300 via-fuchsia-200 to-blue-300 animate-fade-in backdrop-blur-md ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 text-3xl">
            <img src="/Arogyalogo.png" alt="ArogyaMitra Logo" className="h-10 w-10" />
            <GradientText>ArogyaMitra</GradientText>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-blue-500 transition-colors">
                {t.nav.home}
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-blue-500 transition-colors">
                {t.nav.pricing}
              </Link>
              <Link href="#features" className="text-gray-600 hover:text-blue-500 transition-colors">
                {t.nav.features}
              </Link>
              <Link href="#video-section" className="text-gray-600 hover:text-blue-500 transition-colors">
                {t.nav.demo}
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-blue-500 transition-colors">
                {t.nav.contact}
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <LanguageSelector />

              <Button
                asChild
                variant="ghost"
                className="text-white p-2 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500 backdrop-blur-sm rounded-3xl"
              >
                <Link href="/handler/signup">Login</Link>
              </Button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <LanguageSelector />
            <button className="text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.home}
              </Link>
              <Link
                href="#features"
                className="text-gray-600 hover:text-blue-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.features}
              </Link>
              <Link
                href="#video-section"
                className="text-gray-600 hover:text-blue-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.demo}
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 hover:text-blue-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.contact}
              </Link>

              <Button
                asChild
                variant="ghost"
                className="text-white p-2 bg-gradient-to-r from-[#2AC9AF] to-[#4B79D9] backdrop-blur-sm rounded-3xl w-full mt-2"
              >
                <Link href="/handler/signup">Login</Link>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

// Dummy Contact Component
// const Contact = () => {
//   const { language } = useLanguage()
//   const t = translations[language]

//   return (
//     <div className="contact-section">
//       <div className="contact-header">
//         <h2 className="text-gray-500">{t.footer.contact}</h2>
//       </div>
//       <div className="contact-container">
//         <div className="contact-item">
//           <div className="contact-icon">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="18"
//               height="18"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <rect width="20" height="16" x="2" y="4" rx="2" />
//               <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
//             </svg>
//           </div>
//           <div className="contact-info">
//             <p>aravsaxena884@gmail.com</p>
//           </div>
//         </div>
//         <div className="contact-item">
//           <div className="contact-icon">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="18"
//               height="18"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
//             </svg>
//           </div>
//           <div className="contact-info">
//             <p>+91 96534 13126</p>
//           </div>
//         </div>
//         <div className="contact-item">
//           <div className="contact-icon">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="18"
//               height="18"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
//               <circle cx="12" cy="10" r="3" />
//             </svg>
//           </div>
//           <div className="contact-info">
//             <p>Pune, India</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Dummy DeveloperInfo Component
// const DeveloperInfo = () => {
//   return (
//     <div className="developer-info text-center ">
//       <h3 className="section-title text-gray-500">Developer Info</h3>
//       <div className="developer-container">
//         <div className="developer-grid">
//           <div className="developer-card">
//             <div className="developer-image">
//               <img src="/arav.jpg" alt="Developer" />
//             </div>
//             <h4 className="developer-name"><IndiaGradient>Arav Saxena</IndiaGradient></h4>
//             <p className="developer-role">Lead Developer</p>
//             <p className="developer-bio">Full-stack developer with expertise in AI and healthcare solutions.</p>
//             <div className="developer-links">
//               <a href="#" className="dev-link">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="16"
//                   height="16"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
//                   <rect x="2" y="9" width="4" height="12"></rect>
//                   <circle cx="4" cy="4" r="2"></circle>
//                 </svg>
//               </a>
//               <a href="#" className="dev-link">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="16"
//                   height="16"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
//                 </svg>
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// Hero Section Component
const HeroSection = () => {
  const { language } = useLanguage()
  const t = translations[language]
  const buttonRefs = [useRef(null), useRef(null)] // One ref per button

  // 3D button effect for each button
  useEffect(() => {
    buttonRefs.forEach((buttonRef) => {
      const button = buttonRef.current
      if (!button) return

      const handleMouseMove = (e) => {
        const rect = button.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = (y - centerY) / 10
        const rotateY = (centerX - x) / 10

        button.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
      }

      const handleMouseLeave = () => {
        button.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
      }

      button.addEventListener("mousemove", handleMouseMove)
      button.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        button.removeEventListener("mousemove", handleMouseMove)
        button.removeEventListener("mouseleave", handleMouseLeave)
      }
    })
  }, [])

  return (
    <div className="relative w-full min-h-[100vh] ">
      {/* Background Threads */}
      <div className="absolute inset-0 z-0">
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>

      {/* Foreground Content */}
      <BlurFade delay={0.9} inView>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 py-12 space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="mb-4 md:mb-0 bg-transparent">
              <h1 className="text-7xl sm:text-7xl md:text-7xl lg:text-7xl bg-clip-text text-transparent bg-black">
                {t.hero.title}<GradientText>Our Priority</GradientText>
              </h1>
              <h1 className="text-gray-500 font-bold">Call us: +1(507)-522-5320</h1>
              <p className="text-gray-500">
                We are committed to providing you with the best possible healthcare experience by providing services <br />such as voice ai powered healthcare assistant, 24/7 availability, secure and private, personalized care, <br />and more.
              </p>
            </div>
            <div>
              <FloatingPhone />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {[
              { href: "/handler/signup", text: "Get Started", ref: buttonRefs[0] },
              // { href: "/vitals", text: "Check Vitals for free", ref: buttonRefs[1] },
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
                  asChild
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
      </BlurFade>
      <BlurFade delay={0.9} inView>
        <div className="mt-16 relative z-10 flex flex-col gap-0 m-0 p-0">
          <ScrollVelocity
            texts={['ArogyaMitra']}
            velocity={100}
            className="custom-scroll-text text-gray-500"
          />
        </div>
      </BlurFade>
    </div>
  )
}


// Features Section Component
const FeaturesSection = () => {
  const { language } = useLanguage()
  const t = translations[language]

  const features = [
    {
      icon: <Heart className="w-10 h-10 text-red-500" />,
      title: t.features.personalizedCare.title,
      description: t.features.personalizedCare.description,
    },
    {
      icon: <Clock className="w-10 h-10 text-blue-500" />,
      title: t.features.availability.title,
      description: t.features.availability.description,
    },
    {
      icon: <Shield className="w-10 h-10 text-green-500" />,
      title: t.features.secure.title,
      description: t.features.secure.description,
    },
  ]

  return (
    <section id="features" className="py-20 bg-gradient-to-r from-purple-300 via-fuchsia-200 to-blue-300 animate-fade-in rounded-3xl mt-2 mb-2">
      <div className="container mx-auto px-4">
        <BlurFade delay={0.7} inView>
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-purple-50 text-purple-600 text-sm font-medium mb-4">
              {t.features.title}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText>{t.features.heading}</GradientText>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.features.description}</p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <BlurFade key={index} delay={0.5 + index * 0.2} inView>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="mb-6 p-4 rounded-full bg-gray-50 inline-block">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}




const WorldMapDemo = () => {
  return (
    <div className=" py-40 dark:bg-black  bg-gradient-to-r from-purple-300 via-fuchsia-200 to-blue-300 animate-fade-in w-full rounded-t-3xl">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-bold text-xl md:text-4xl dark:text-white text-black">
          <GradientText>Remote{" "}</GradientText>
          <span className="text-neutral-400">
            {"Connectivity".split("").map((word, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}>
                {word}
              </motion.span>
            ))}
          </span>
        </p>
        <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
          Break free from traditional boundaries. Connect from anywhere, at the
          comfort of your own apartment. Perfect for people from rural areas for getting medical guidance.
        </p>
      </div>
      <WorldMap
        dots={[
          {
            start: {
              lat: 64.2008,
              lng: -149.4937,
            }, // Alaska (Fairbanks)
            end: {
              lat: 34.0522,
              lng: -118.2437,
            }, // Los Angeles
          },
          {
            start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
            end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
          },
          {
            start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
            end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
          },
          {
            start: { lat: 51.5074, lng: -0.1278 }, // London
            end: { lat: 28.6139, lng: 77.209 }, // New Delhi
          },
          {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
          },
          {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
          },
        ]} />
    </div>
  );
}
const testimonials = [
  {
    id: 1,
    content:
      "ArogyaMitra's AI assistant helped me understand my medication when I couldn't read the doctor's handwriting. The voice instructions in Hindi made it so easy to follow!",
    author: "Rajesh Kumar",
    role: "Patient, Uttar Pradesh",
    avatar: "/asojaK.jpg?height=80&width=80",
  },
  {
    id: 2,
    content:
      "As a doctor serving in rural Maharashtra, the clinical note automation has saved me hours each day. I can now see more patients and provide better care.",
    author: "Dr. Priya Sharma",
    role: "Physician, Maharashtra",
    avatar: "/911677.jpg?height=80&width=80",
  },
  {
    id: 3,
    content:
      "The mental health chatbot has been a lifeline for many in our community who were hesitant to seek help due to stigma. Being able to talk in Tamil makes it accessible to everyone.",
    author: "Anitha Rajan",
    role: "Community Health Worker, Tamil Nadu",
    avatar: "/axa.jpeg?height=80&width=80",
  },
  {
    id: 4,
    content:
      "The fact-checking tool has been instrumental in combating health misinformation in our village WhatsApp groups. It's saving lives by preventing harmful practices.",
    author: "Vikram Singh",
    role: "Village Council Head, Rajasthan",
    avatar: "/axa.jpeg?height=80&width=80",
  },
]

const TestimonialCarousel = () => {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const timeoutRef = useRef(null)

  const nextTestimonial = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (autoplay) {
      timeoutRef.current = setTimeout(nextTestimonial, 5000)
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [current, autoplay])

  const handleMouseEnter = () => setAutoplay(false)
  const handleMouseLeave = () => setAutoplay(true)

  return (
    <div
      className="py-20 px-4 relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          style={{ filter: "blur(80px)" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-fuchsia-200/10 to-blue-500/10"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          style={{ filter: "blur(80px)" }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-200 to-blue-500">
              <GradientText>What People said during Hackathon</GradientText>
            </span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Real Feedbacks from people who used our AI platform during Hackathon
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Large quote icon */}
          <motion.div
            className="absolute -top-10 -left-10 text-purple-500/20 z-0"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Quote size={120} />
          </motion.div>

          {/* Testimonial cards */}
          <div className="relative h-[400px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 md:p-12 shadow-xl">
                  <p className="text-gray-500 text-lg md:text-xl italic mb-8 relative z-10">
                    "{testimonials[current].content}"
                  </p>

                  <div className="flex items-center">
                    <div className="mr-4">
                      <img
                        src={testimonials[current].avatar || "/placeholder.svg"}
                        alt={testimonials[current].author}
                        className="w-16 h-16 rounded-full border-2 border-purple-500"
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                        {testimonials[current].author}
                      </h4>
                      <p className="text-gray-500/70">{testimonials[current].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation controls */}
          <div className="flex justify-center mt-8 gap-4">
            <motion.button
              onClick={prevTestimonial}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(168, 85, 247, 0.2)" }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full border border-purple-500/30 text-purple-500 hover:bg-purple-500/10 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-3 h-3 rounded-full ${current === index ? "bg-purple-500" : "bg-purple-500/30"}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(168, 85, 247, 0.2)" }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full border border-purple-500/30 text-purple-500 hover:bg-purple-500/10 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
const StatCard2 = ({ icon, value, label, delay, suffix = "" }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = Number.parseInt(value.toString().replace(/,/g, ""))
      const duration = 2000
      const increment = end / (duration / 16) // 60fps

      const timer = setInterval(() => {
        start += increment
        if (start > end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className="relative p-6 rounded-xl backdrop-blur-lg border border-cyan-500/20 bg-gradient-to-br from-white/5 to-white/10 overflow-hidden group"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-300/10 to-blue-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Icon */}
      <motion.div
        className="mb-4 text-cyan-400 bg-cyan-500/10 p-3 rounded-lg inline-block"
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>

      {/* Counter */}
      <h3 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500">
        {formatNumber(count)}
        {suffix}
      </h3>

      {/* Label */}
      <p className="text-gray-500 text-lg">{label}</p>

      {/* Decorative corner element */}
      <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-purple-300/20 to-blue-300/20 rounded-full blur-xl"></div>
    </motion.div>
  )
}

const StatsCounter = () => {
  return (
    <div className="py-20 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-300/5 to-blue-300/5"
            animate={{
              x: [Math.random() * 100 - 50 + "%", Math.random* 100 - 50 + "%"],
              y: [Math.random() * 100 - 50 + "%", Math.random * 100 - 50 + "%"],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            style={{
              width: Math.random() * 500 + 300,
              height: Math.random() * 500 + 300,
              filter: "blur(80px)",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-fuchsia-200 to-blue-300">
              <GradientText>Our Impact in Numbers</GradientText>
            </span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-300 to-blue-300 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-500/80 max-w-2xl mx-auto text-lg">
            ArogyaMitra is making a significant difference in healthcare accessibility across India
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard2
            icon={<Users className="w-6 h-6" />}
            value={500000}
            label="Targeted Users"
            delay={0.1}
            suffix="+"
          />
          <StatCard2
            icon={<Hospital className="w-6 h-6" />}
            value={1200}
            label="Targeted Rural Clinics"
            delay={0.2}
            suffix="+"
          />
          <StatCard2 icon={<Award className="w-6 h-6" />} value={98} label="Targeted Satisfaction Rate" delay={0.3} suffix="%" />
          <StatCard2 icon={<Globe className="w-6 h-6" />} value={15} label="Targeted States" delay={0.4} />
        </div>
      </div>
    </div>
  )
}
// YouTube Video Section Component
const YouTubeSection = () => {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <section id="video-section" className="py-20 bg-gradient-to-r from-purple-300 via-fuchsia-200 to-blue-300 animate-fade-in">
      <div className="container mx-auto px-4">
        <BlurFade delay={0.3} inView>
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-purple-50 text-purple-600 text-sm font-medium mb-4">
              {t.video.title}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText>{t.video.heading}</GradientText>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.video.description}</p>
          </div>
        </BlurFade>

        <BlurFade delay={0.5} inView>
          <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/7zJOWGTwzXQ"
                title={t.video.demo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold">{t.video.demo}</h3>
                <p>{t.video.seeHow}</p>
              </div>
            </div>
          </div>
        </BlurFade>

        <div className="mt-12 text-center">
          <Button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all duration-300">
            <Link href="/handler/signup">{t.video.tryIt}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}




const GradientText2 = ({ children, from = "purple-400", via = "pink-500", to = "red-500" }) => {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-${from} via-${via} to-${to}`}>
      {children}
    </span>
  )
}

const FeatureCard = ({ icon, title, description, index }) => {
  const cardRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    }

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
      card.style.transition = "transform 0.5s ease"
    }

    card.addEventListener("mousemove", handleMouseMove)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mousemove", handleMouseMove)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/20 transition-all duration-300 relative overflow-hidden group"
      style={{ transformStyle: "preserve-3d", transition: "transform 0.1s ease" }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />

      {/* Glowing orb in corner */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-cyan-300/30 to-blue-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Floating icon with 3D effect */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        viewport={{ once: true }}
        animate={{ y: [0, -10, 0] }}
        // transition={{
        //   y: {
        //     duration: 3,
        //     repeat: Number.POSITIVE_INFINITY,
        //     repeatType: "reverse",
        //     ease: "easeInOut",
        //   },
        // }}
        className="text-5xl mb-6 relative"
        style={{ transform: "translateZ(20px)" }}
      >
        {icon}
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        viewport={{ once: true }}
        className="text-xl font-bold mb-4 relative"
        style={{ transform: "translateZ(15px)" }}
      >
        <GradientText2 from="purple-400" via="blue-400" to="indigo-500">
          {title}
        </GradientText2>
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
        viewport={{ once: true }}
        className="text-gray-500 relative"
        style={{ transform: "translateZ(10px)" }}
      >
        {description}
      </motion.p>

      {/* Animated corner accent */}
      <motion.div
        className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  )
}

const Features = () => {
  const solutions = [
    {
      icon: "🧠",
      title: "Lack of Doctor Access in Rural Areas",
      description:
        "Voice-based AI health assistants (multilingual) that can triage symptoms, suggest first aid, and escalate emergencies.",
    },
    {
      icon: "📄",
      title: "Low Health Literacy",
      description:
        "GenAI-powered explainers that convert prescriptions and diagnoses into simple regional languages (text/video).",
    },
    {
      icon: "✍️",
      title: "Overburdened Doctors",
      description: "Clinical note automation using AI scribes to summarize patient visits in real time.",
    },
    {
      icon: "🧘",
      title: "Mental Health Stigma",
      description: "Anonymous GenAI-powered mental health chatbots in Hindi, Marathi, Tamil, etc.",
    },
    {
      icon: "💊",
      title: "Medication Errors & Non-Adherence",
      description:
        "Voice-interactive pill reminders and multilingual instructions generated dynamically from prescription photos.",
    },
    {
      icon: "📰",
      title: "Fake Health News & Misinformation",
      description: "Fact-checking LLM agent that can explain if a message is false, with trusted medical links.",
    },
    {
      icon: "🌐",
      title: "Language Barriers in Hospitals",
      description: "Real-time translation + summarization tool for doctors and patients.",
    },
    {
      icon: "📄",
      title: "Digitizing Paper Health Records",
      description:
        "OCR + LLM summarization pipeline to digitize, classify, and summarize handwritten records into EMRs.",
    },
  ]

  // Particle animation setup
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const particleCount = 50

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5

        // Create a gradient color palette
        const colors = [
          "rgba(173, 216, 230, 0.3)", // Light blue
          "rgba(135, 206, 235, 0.3)", // Sky blue
          "rgba(0, 191, 255, 0.3)", // Deep sky blue
          "rgba(30, 144, 255, 0.3)", // Dodger blue
          "rgba(100, 149, 237, 0.3)", // Cornflower blue
        ]

        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.size > 0.2) this.size -= 0.1

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()

        // Connect particles with lines
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(135, 206, 250, ${0.1 - distance / 1000})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }

        if (particles[i].size <= 0.2) {
          particles.splice(i, 1)
          i--
          particles.push(new Particle())
        }
      }

      requestAnimationFrame(animate)
    }

    init()
    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "transparent",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Animated background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent z-0"></div>

      <section className="relative z-10 px-4 py-16 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <GradientText from="cyan-300" via="blue-400" to="indigo-500">
                  How ArogyaMitra will Solve Healthcare Challenges
                </GradientText>
              </h2>

              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="h-1 bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 mx-auto rounded-full"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-gray-500 max-w-2xl mx-auto text-lg"
            >
              Innovative AI-powered solutions addressing critical healthcare gaps in India
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {solutions.map((solution, index) => (
              <FeatureCard
                key={index}
                icon={solution.icon}
                title={solution.title}
                description={solution.description}
                index={index}
              />
            ))}
          </div>

          {/* Animated call to action */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <motion.a
              href="https://github.com/arav7781"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(225, 111, 248, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
>
  Explore Our Healthcare Solutions
</motion.a>


          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}


const timelineData = [
  {
    year: " 25 April 2025",
    title: "ArogyaMitra Ideated for Hack your Path 6.0",
    description: "Started with a mission to bridge healthcare gaps in rural India using AI technology.",
    icon: FaRocket,
  },
  {
    year: "09 May 2025(13:30PM)",
    title: "AI Voice Assistant Created",
    description: "Deployed our first multilingual voice assistant for medical triage and appointment booking in 5 languages.",
    icon: FaCommentAlt,
  },
  {
    year: "09 May 2025(21:30PM)",
    title: " Finetuned LLM for Medication reponses ",
    description: "Introduced ArogyaBot-1.0 and ArogyaBot-Base with vision and thinking capabilities.",
    icon: FaHospital,
  },
  {
    year: "10 May 2025(03:30AM)",
    title: "Mental Health Initiative",
    description: "Introduced anonymous mental health voice agents in 5 Indian regional languages.",
    icon: FaBrain,
  },
  {
    year: "10 May 2025(06:30AM)",
    title: "Performed Metrics on ArogyaBot-1.0",
    description: "Compared our Finetuned LLM with various other LLMs and found that our LLM was able to provide more accurate responses.",
    icon: FaStethoscope,
  },
  {
    year: "10 May 2025(09:30AM)",
    title: "Future Vision",
    description: "Expanding to all 28 states with comprehensive healthcare AI solutions.",
    icon: FaMagic,
  },
]
// const StatCard = ({ icon, value, label, delay, suffix = "" }) => {
//   const [count, setCount] = useState(0)
//   const ref = useRef(null)
//   const isInView = useInView(ref, { once: true, margin: "-100px" })

//   useEffect(() => {
//     if (isInView) {
//       let start = 0
//       const end = Number.parseInt(value.toString().replace(/,/g, ""))
//       const duration = 2000
//       const increment = end / (duration / 16) // 60fps

//       const timer = setInterval(() => {
//         start += increment
//         if (start > end) {
//           setCount(end)
//           clearInterval(timer)
//         } else {
//           setCount(Math.floor(start))
//         }
//       }, 16)

//       return () => clearInterval(timer)
//     }
//   }, [isInView, value])

//   const formatNumber = (num) => {
//     return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//   }

//   return (
//     <motion.div
//       ref={ref}
//       initial={{ opacity: 0, y: 50 }}
//       animate={isInView ? { opacity: 1, y: 0 } : {}}
//       transition={{ duration: 0.8, delay }}
//       className="relative p-6 rounded-xl backdrop-blur-lg border border-cyan-500/20 bg-gradient-to-br from-white/5 to-white/10 overflow-hidden group"
//     >
//       {/* Background glow effect */}
//       <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

//       {/* Icon */}
//       <motion.div
//         className="mb-4 text-cyan-400 bg-cyan-500/10 p-3 rounded-lg inline-block"
//         whileHover={{ rotate: [0, -10, 10, -10, 0] }}
//         transition={{ duration: 0.5 }}
//       >
//         {icon}
//       </motion.div>

//       {/* Counter */}
//       <h3 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-500">
//         {formatNumber(count)}
//         {suffix}
//       </h3>

//       {/* Label */}
//       <p className="text-gray-500 text-lg">{label}</p>

//       {/* Decorative corner element */}
//       <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-xl"></div>
//     </motion.div>
//   )
// }

const TimelineItem = ({ item, index, isActive, onClick }) => {
  return (
    <motion.div
      className={`relative ${index % 2 === 0 ? "md:text-right md:self-end" : "md:text-left md:self-start"} md:w-1/2 p-6 cursor-pointer`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      onClick={() => onClick(index)}
    >
      {/* Timeline connector */}
      <div
        className={`hidden md:block absolute top-1/2 w-12 h-0.5 bg-gradient-to-r from-purple-400 to-blue-500 transform -translate-y-1/2 z-10 ${index % 2 === 0 ? 'left-0' : 'right-0'}`}
      ></div>

      {/* Content card */}
      <motion.div
        className={`relative p-6 rounded-xl backdrop-blur-lg border ${isActive ? "border-purple-400 ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-900" : "border-purple-500/20"} bg-gradient-to-br ${isActive ? "from-white/20 to-white/10" : "from-white/10 to-white/5"} shadow-lg`}
        whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(56, 189, 248, 0.2)" }}
        transition={{ duration: 0.3 }}
      >
        {/* Year badge */}
        <div className="absolute -top-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-2 rounded-full font-bold text-base shadow-sm">
          {item.year}
        </div>

        {/* Icon */}
        <motion.div
          className="mb-4"
          animate={{ scale: isActive ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <item.icon className={`text-4xl transition-colors duration-300 ${isActive ? "text-white" : "text-purple-400"}`} />
        </motion.div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-600">
          {item.title}
        </h3>
        <p className="text-gray-500 text-base leading-6">{item.description}</p>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute inset-0 border-2 border-cyan-400 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            layoutId="activeTimelineItem"
          />
        )}
      </motion.div>
    </motion.div>
  )
}

const InteractiveTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  // Auto-advance timeline
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % timelineData.length)
    }, 3000)
    return () => clearTimeout(timer)
  }, [activeIndex])

  const prevItem = () => {
    setActiveIndex((prev) => (prev - 1 + timelineData.length) % timelineData.length)
  }

  const nextItem = () => {
    setActiveIndex((prev) => (prev + 1) % timelineData.length)
  }

  return (
    <div className="py-20 px-4 relative overflow-hidden" ref={containerRef}>
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/5 to-blue-500/5"
          style={{ opacity, scale, filter: "blur(80px)" }}
        />
      </div>

      <motion.div className="container mx-auto relative z-10" style={{ opacity, scale }}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-blue-400 to-indigo-500">
              <GradientText>Our Journey</GradientText>
            </span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            The evolution of ArogyaMitra's mission to transform healthcare
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-blue-500 to-indigo-600 transform -translate-x-1/2"></div>

          {/* Timeline items */}
          <div className="flex flex-col md:items-center relative gap-8">
            {timelineData.map((item, index) => (
              <TimelineItem
                key={index}
                item={item}
                index={index}
                isActive={index === activeIndex}
                onClick={setActiveIndex}
              />
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={prevItem}
            className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700 transition-all duration-300"
          >
            <FaChevronLeft className="text-xl" />
          </button>
          <button
            onClick={nextItem}
            className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700 transition-all duration-300"
          >
            <FaChevronRight className="text-xl" />
          </button>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {timelineData.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className="focus:outline-none"
              aria-label={`Go to timeline item ${index + 1}`}
            >
              <motion.div
                className={`w-3 h-3 rounded-full ${index === activeIndex ? "bg-purple-400" : "bg-purple-400/30"}`}
                animate={{ scale: index === activeIndex ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
              />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}



// Call to Action Section Component
const CTASection = () => {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <section className="py-20 bg-gradient-to-r from-purple-300 via-fuchsia-200 to-blue-300 animate-fade-in">
      <div className="container mx-auto px-4">
        <BlurFade delay={0.3} inView>
          <div className="bg-white rounded-3xl p-12 shadow-xl max-w-5xl mx-auto relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-b from-purple-300 via-fuchsia-200 to-blue-300 opacity-50 rounded-l-full"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <GradientText>{t.cta.heading}</GradientText>
                </h2>
                <p className="text-xl text-gray-600 mb-6">{t.cta.description}</p>
                <div className="flex flex-wrap gap-4">
                  <Button className="px-8 py-3 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all duration-300">
                    <Link href="/dashboard">{t.cta.getStarted}</Link>
                  </Button>
                  <Button variant="outline" className="px-8 py-3 border-2 rounded-full">
                    <Link href="#contact">{t.cta.contactUs}</Link>
                  </Button>
                </div>
              </div>

              <div className="w-full md:w-1/3 flex justify-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 2, 0, -2, 0],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 5,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src="/Arogyalogo.png"
                    alt="Healthcare illustration"
                    className="w-60 h-60"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </BlurFade>
        <BlurFade delay={1.2} inView>
      </BlurFade>
      </div>
    </section>
  )
}

const items = [
  {
  image: '/e5385861-45f3-4b25-a1fc-7281293dc5df.png?grayscale',
  link: 'http://localhost:3000/dashboard',
  title: '',
  description: 'Want to grow your business?'
  },
  {
  image: '/mll.jpg?grayscale',
  link: 'http://localhost:3000/dashboard',
  title: '',
  description: 'Start your journey with us today'
  },
  {
  image: '/e5385861-45f3-4b25-a1fc-7281293dc5df.png?height=400&width=400?grayscale',
  link: 'http://localhost:3000/dashboard',
  title: '',
  description: 'Your company needs BlueBox AI'
  },
  {
  image: '/Sales-and-Marketing-Sales.png?grayscale',
  link: 'http://localhost:3000/dashboard',
  title: '',
  description: 'Want to Boost your business?'
  }
  ];

 

// Footer Component
const Footer = () => {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <footer id="contact" className="py-10 bg-gradient-to-r from-purple-300 via-fuchsia-200 to-blue-300 animate-fade-in border-t border-gray-100 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/Arogyalogo.png?height=40&width=40" alt="logo" width={40} height={35} />
              <GradientText className="text-2xl font-semibold">ArogyaMitra</GradientText>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">{t.footer.description}</p>
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} ArogyaMitra. {t.footer.rights}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-500 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-600 hover:text-blue-500 transition-colors">
                  {t.nav.features}
                </Link>
              </li>
              <li>
                <Link href="#video-section" className="text-gray-600 hover:text-blue-500 transition-colors">
                  {t.nav.demo}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-600 hover:text-blue-500 transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.contact}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                aravsaxena884@gmail.com
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                +91 96534 13126
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Pune, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">{t.footer.designedWith}</p>

          <div className="flex gap-4">
            {/* GitHub */}
            <a
              href="https://github.com/arav7781"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 
      0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 
      1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.763-1.605-2.665-.3-5.467-1.334-5.467-5.933 
      0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.51 11.51 0 0 1 3-.404c1.02.005 
      2.045.138 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 
      1.235 3.22 0 4.61-2.807 5.63-5.48 5.922.43.37.823 1.102.823 2.222 
      0 1.606-.015 2.896-.015 3.286 0 .32.218.694.825.576C20.565 21.795 
      24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.instagram.com/arav_6555"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 
                  2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 
                  5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 
                  1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}


const ThreeDMarqueeDemo = () => {
  const images = [
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",
    "/m8.jpg",

  ];
  return (
    <div
      className="mx-auto my-10 max-w-7xl rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800 shadow-none">
      <ThreeDMarquee images={images} />
    </div>
  );
}

const words = [
 
  {
    text: "Hoverrrr!!!😄",
    className: "text-blue-500 dark:text-blue-500 space-y-4",
  },
];

const MacbookScrollDemo = () => {
  return (
    <div className="overflow-hidden bg-gradient-to-r from-purple-300 via-fuchsia-200 to-blue-300 animate-fade-in w-full p-0 m-0">
      <MacbookScroll
        title={
     <GradientText>
      </GradientText> 
        
        }
        badge={
          <Link href="http://localhost:3000/dashboard">
            <Badge className="h-10 w-10 transform -rotate-12" />
          </Link>
        }
        src="/m1.png"
        showGradient={false}
      />
    </div>
  );
}
const Badge = ({ className }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z" fill="#00AA45" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28 54C42.3594 54 54 42.3594 54 28C54 13.6406 42.3594 2 28 2C13.6406 2 2 13.6406 2 28C2 42.3594 13.6406 54 28 54ZM28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
        fill="#219653"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.0769 12H15V46H24.3846V38.8889H27.0769C34.7305 38.8889 41 32.9048 41 25.4444C41 17.984 34.7305 12 27.0769 12ZM24.3846 29.7778V21.1111H27.0769C29.6194 21.1111 31.6154 23.0864 31.6154 25.4444C31.6154 27.8024 29.6194 29.7778 27.0769 29.7778H24.3846Z"
        fill="#24292E"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 11H29.0769C36.2141 11 42 16.5716 42 23.4444C42 30.3173 36.2141 35.8889 29.0769 35.8889H25.3846V43H18V11ZM25.3846 28.7778H29.0769C32.1357 28.7778 34.6154 26.39 34.6154 23.4444C34.6154 20.4989 32.1357 18.1111 29.0769 18.1111H25.3846V28.7778Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 10H29.0769C36.7305 10 43 15.984 43 23.4444C43 30.9048 36.7305 36.8889 29.0769 36.8889H26.3846V44H17V10ZM19 12V42H24.3846V34.8889H29.0769C35.6978 34.8889 41 29.7298 41 23.4444C41 17.1591 35.6978 12 29.0769 12H19ZM24.3846 17.1111H29.0769C32.6521 17.1111 35.6154 19.9114 35.6154 23.4444C35.6154 26.9775 32.6521 29.7778 29.0769 29.7778H24.3846V17.1111ZM26.3846 19.1111V27.7778H29.0769C31.6194 27.7778 33.6154 25.8024 33.6154 23.4444C33.6154 21.0864 31.6194 19.1111 29.0769 19.1111H26.3846Z"
        fill="#24292E"
      />
    </svg>
  );
};

 

export const products = [
  {
    title: "Dashboard",
    link: "http://localhost:3000/dashboard",
    thumbnail:
      "/b1.png",
  },
  {
    title: "Product Designing",
    link: "http://localhost:3000/dashboard",
    thumbnail:
      "/x0.png",
  },
  {
    title: "Sales",
    link: "http://localhost:3000/dashboard",
    thumbnail:
      "/b222.png",
  },
 
  {
    title: "Process",
    link: "http://localhost:3000/dashboard",
    thumbnail:
      "/b4.png",
  },
  {
    title: "Designing Specs",
    link: "http://localhost:3000/dashboard",
    thumbnail:
      "/b5.jpg",
  },
  {
    title: "Business Intelligence",
    link: "http://localhost:3000/dashboard",
    thumbnail:
      "/b6.png",
  },
 
  {
    title: "Strategy",
    link: "http://localhost:3000/dashboard",
    thumbnail:
      "/b4.png",
  },
  {
    title: "Dashboard",
    link: "http://localhost:3000/dashboard",
    thumbnail:
      "/b5.jpg",
  },
  {
    title: "Designing",
    link: "http://localhost:3000/dashboard",
    thumbnail:
      "/b6.png",
  },
  {
    title: "Product",
    link: "http://localhost:3000/dashboard",
    thumbnail:
      "/b22.jpg",
  },
  {
    title: "Dashboard",
    link: "http://localhost:3000/dashboard",
    thumbnail:
      "/b1.png",
  },
 
  {
    title: "Product Demo",
    link: "http://localhost:3000/dashboard",
    thumbnail:
      "/b22.jpg",
  },
  {
    title: "Sales and Marketing",
    link: "http://localhost:3000/dashboard",
    thumbnail:
      "/x9.png",
  },
  {
    title: "Product Development",
    link: "http://localhost:3000/dashboard",
    thumbnail:
      "/x77.png",
  },
  {
    title:"Business Intelligence",
    link: "http://localhost:3000/dashboard",
    thumbnail:
      "/b5.jpg",
  },
];

// Main LandingPage Component
const LandingPage = () => {
  return (
    <LanguageProvider>
      <div className="bg-gradient-to-r from-purple-300 via-fuchsia-200 to-blue-300 animate-fade-in min-h-screen ">

        <Header />
      

        <HeroSection/>
        <div className="p-0 gap-0">
        
          {/* <MacbookScrollDemo /> */}
          <Features/>
        </div>
        <div>
          <InteractiveChatbotPreview/>
        </div>
        <div>
          <TechStackShowcase/>
        </div>
        <div>
          <InteractiveTimeline/>
        </div>
        {/* <div>
          <StatsCounter/>
        </div> */}
     
        {/* <TryChatbotSection /> */}
        {/* <div>
          <InteractiveHealthAssessment/>
        </div> */}
        {/* <div>
          <AIPulseVisualizer/>
        </div> */}
        {/* <div>
          <HolographicBodyScanner/>
        </div> */}
      
  

        {/* YouTube Video Section */}
        <YouTubeSection />
 
        <div>
      <TestimonialCarousel/>
    </div>
{/* 
        <ThreeDMarqueeDemo />
     */}

        {/* Testimonials with Animation */}
        {/* <TestimonialsSection /> */}
       
    
  
        {/* Call to Action */}
        <CTASection />
        <hr className="my-10" />
        {/* Footer */}
        <Footer />
     
      </div>
    </LanguageProvider>
  )
}

export default LandingPage
