"use client";
import Image from "next/image";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import GradientText from "@/components/ui/GradientText";

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 w-full h-full py-20 bg-gradient-to-r from-purple-50 to-blue-50">
      <h2
        className=" py-5 mt-3 text-4xl text-center max-w-7xl pl-2 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans"><GradientText>
        Get to know our Enhancements
      </GradientText></h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
            <p
              className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <Image
              src={data.src}
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"/>
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Buisness Intelligence",
    title: "You can do more with BlueBox.",
    src: "/WhatsApp Image 2025-04-14 at 18.10.34_0544f8c8.jpg",
    content: <DummyContent />,
  },
  {
    category: "Productivity",
    title: "Enhance your productivity.",
    src: "/WhatsApp Image 2025-04-14 at 18.10.34_29e2ac29.jpg",
    content: <DummyContent />,
  },
  {
    category: "Product",
    title: "Launch your new product with us.",
    src: "/WhatsApp Image 2025-04-14 at 18.10.33_56a843b9.jpg",
    content: <DummyContent />,
  },

  {
    category: "Analyze Sales",
    title: "Get insights from your sales data.",
    src: "/WhatsApp Image 2025-04-14 at 18.10.35_5da5109b.jpg",
    content: <DummyContent />,
  },
  {
    category: "Earnings",
    title: "Sales just got better.",
    src: "/WhatsApp Image 2025-04-14 at 18.10.35_69878596.jpg",
    content: <DummyContent />,
  },
  {
    category: "Postivity",
    title: "Stay positive with us.",
    src: "/WhatsApp Image 2025-04-14 at 18.10.35_2f9901bf.jpg",
    content: <DummyContent />,
  },
];


export default function WebFaetues() {
  return <AppleCardsCarouselDemo />;
}