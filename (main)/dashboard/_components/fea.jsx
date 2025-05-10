"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// TextComponent with glowing beam effect
export function TextComponent({ number, title, content, isOpen, loadingWidthPercent }) {
  // State to manage glow color
  const [glowColor, setGlowColor] = useState("rgba(59, 130, 246, 0.5)"); // Default: blue

  // Colors for transition (blue, purple, pink, orange)
  const colors = [
    "rgba(59, 130, 246, 0.5)", // Blue
    "rgba(147, 51, 234, 0.5)", // Purple
    "rgba(236, 72, 153, 0.5)", // Pink
    "rgba(249, 115, 22, 0.5)", // Orange
  ];

  // Cycle through colors every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowColor((prevColor) => {
        const currentIndex = colors.indexOf(prevColor);
        const nextIndex = (currentIndex + 1) % colors.length;
        return colors[nextIndex];
      });
    }, 3000); // Change color every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [colors]);

  return (
    <div
      className={cn(
        "transform-gpu rounded-lg border transition-all relative overflow-hidden",
        isOpen
          ? "border-neutral-500/10 bg-gradient-to-b from-neutral-200/15 to-neutral-200/5 dark:border-neutral-500/15 dark:from-neutral-600/15 dark:to-neutral-600/5 dark:shadow-[2px_4px_25px_0px_rgba(248,248,248,0.06)_inset]"
          : "scale-90 border-transparent opacity-50 saturate-0"
      )}
      style={{
        boxShadow: `0 0 15px 5px ${glowColor}`,
        transition: "box-shadow 0.5s ease-in-out",
      }}
    >
      <div className="flex w-full items-center gap-4 p-4">
        <p className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-neutral-500/20 text-neutral-600">
          {number}
        </p>
        <h2 className="text-left text-xl font-medium text-neutral-800 dark:text-neutral-200">
          {title}
        </h2>
      </div>
      <div
        className={cn(
          "w-full transform-gpu overflow-hidden text-left text-neutral-600 transition-all duration-500 dark:text-neutral-400",
          isOpen ? "max-h-64" : "max-h-0"
        )}
      >
        <p className="p-4 text-lg">{content}</p>
        <div className="w-full px-4 pb-4">
          <div className="relative h-1 w-full overflow-hidden rounded-full">
            <div
              className="absolute left-0 top-0 h-1 bg-neutral-500"
              style={{ width: `${loadingWidthPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample Image Component
function ImageComponent() {
  return (
    <img
      src="/your-image-path.png"
      alt="Demo visual"
      className="w-64 h-auto object-contain"
    />
  );
}

// Wrapper Layout with four TextComponents
export default function FeatureSection() {
  return (
    <div className="flex flex-col md:flex-row items-start gap-6 px-4 py-10">
      {/* Text Components */}
      <div className="w-full md:w-1/2 space-y-6">
        {[
          {
            number: 1,
            title: "Innovate with BlueBox",
            content:
              "We’re redefining business intelligence with voice-to-voice multilingual experts, smart chatbots that think, and vision capabilities built for modern product design.",
            isOpen: true,
            loadingWidthPercent: 70,
          },
          {
            number: 2,
            title: "Seamless Integration",
            content:
              "Integrate effortlessly with your existing systems, enabling real-time data processing and advanced analytics for smarter decisions.",
            isOpen: false,
            loadingWidthPercent: 50,
          },
          {
            number: 3,
            title: "Scalable Solutions",
            content:
              "Our platform scales with your business, from startups to enterprises, ensuring consistent performance and reliability.",
            isOpen: false,
            loadingWidthPercent: 30,
          },
          {
            number: 4,
            title: "Future-Ready Tech",
            content:
              "Stay ahead with cutting-edge AI and vision tech, designed to evolve with emerging trends and industry demands.",
            isOpen: false,
            loadingWidthPercent: 90,
          },
        ].map((item) => (
          <TextComponent
            key={item.number}
            number={item.number}
            title={item.title}
            content={item.content}
            isOpen={item.isOpen}
            loadingWidthPercent={item.loadingWidthPercent}
          />
        ))}
      </div>

      {/* ImageComponent shown below text on mobile, right on desktop */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-6 md:mt-0">
        <ImageComponent />
      </div>
    </div>
  );
}