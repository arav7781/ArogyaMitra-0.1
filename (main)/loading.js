"use client"; // Required for using client-side features like animation

import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <CutoutTextLoader
        height="450px"
        background="white"
        imgUrl="/x33.png"
        text="ArogyaMitra..."
      />
    </div>
  );
}

const CutoutTextLoader = ({
  height,
  background,
  imgUrl,
  text = "ArogyaMitra...",
}) => {
  return (
    <div className="relative w-full" style={{ height }}>
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${imgUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: "blur(2px)",
        }}
      />
      
      {/* Pulsing Overlay */}
      <div
        style={{ background }}
        className="absolute inset-0 animate-pulse z-10 opacity-90"
      />
      
      {/* Cutout Text */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <span
          className="font-black bg-clip-text text-transparent pointer-events-none select-none"
          style={{
            backgroundImage: `url(${imgUrl})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            fontSize: "clamp(3rem, 12vw, 10rem)",
            lineHeight: "1",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            padding: "0 0.2em",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};