"use client";

import { motion } from "framer-motion";
import GradientText from "@/components/ui/GradientText";
import { BlurFade } from "@/components/magicui/blur-fade";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function DeveloperInfo() {
  const testimonials = [
    {
      quote: "Everyone is slave to something.",
      name: "Arav Saxena",
      designation: "Lead Developer",
      src: "/arav.jpg",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Anmol Daneti",
      designation: "Database Developer",
      src: "/shreyy.jpg",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "Devank Upadhaya",
      designation: "Software Developer",
      src: "/dev.jpg",
    },
    {
      quote:
        "Crafting the future, not with code alone, but with the spark of human imagination and the power of artificial intelligence",
      name: "Sanchita Arora",
      designation: "GenAI Developer",
      src: "/san.jpg",
    },
  ];
  return <div className="bg-gradient-to-r from-purple-50 to-blue-50">
    <h1 className=" py-20 mt-3 text-4xl text-center max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans"><GradientText>Meet Our Team</GradientText></h1>
    <AnimatedTestimonials testimonials={testimonials} />;
  </div>;
}

export default DeveloperInfo;
