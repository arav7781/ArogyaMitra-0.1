"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExpertsList } from "@/services/Options"
import { useUser } from "@stackframe/stack"
import Image from "next/image"
import { BlurFade } from "@/components/magicui/blur-fade"
import UserInputDialog from "./UserInputDialog"
import GradientText from "@/components/ui/GradientText"
import ProfileDialog from "./Profile"
import Link from "next/link"
import { User, Bell } from "lucide-react"
import { Meteors } from "@/components/ui/meteors"

export function FeaturesAssistants() {
  const user = useUser()
  const [hoveredCard, setHoveredCard] = useState(null)

  return (
    <div className="relative h-200px w-full overflow-hidden bg-gradient-to-b from-white to-blue-50 px-4 pb-4 rounded-lg">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-white opacity-70"></div>

      <div className="mx-auto max-w-7xl">
        {/* Header section */}
        <div className="mb-12 flex flex-col justify-between gap-6 rounded-2xl bg-white/80 p-6 backdrop-blur-md md:flex-row md:items-center">
          <div>
            <h2 className="font-medium text-gray-500">My Healthspace</h2>
            <h2 className="text-3xl text-gray-600 md:text-4xl">
              Hello,{" "}
              <GradientText as="span" className="inline">
                {user?.displayName || "User"}
              </GradientText>
            </h2>
          </div>

          {/* Enhanced Profile Button */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-2 border-blue-200 shadow-sm transition-all hover:border-blue-400"
            >
              <Bell className="h-5 w-5 text-blue-500" />
            </Button>

            <ProfileDialog>
              <Button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 pl-3 pr-4 py-6 text-base font-medium shadow-md transition-all hover:-translate-y-1 hover:opacity-90 hover:shadow-lg">
                <div className="rounded-full bg-white/30 p-1">
                  <User className="h-5 w-5" />
                </div>
                Profile
              </Button>
            </ProfileDialog>
          </div>
        </div>

        {/* 3D Grid container */}
        <div className="perspective-1000 w-full mb-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {/* ExpertsList mapped items */}
            {ExpertsList.map((option, index) => (
              <BlurFade key={index} delay={0.25 + index * 0.05} inView>
                <div
                  className="group relative h-64 w-full transform-gpu transition-all duration-300 hover:z-10 hover:scale-105 "
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-300/20 to-blue-300/20 opacity-80 blur-xl transition-all duration-300 group-hover:opacity-100"></div>
                  <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/20  p-6 shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:border-purple-200 group-hover:shadow-purple-200/20 bg-gradient-to-r from-purple-500/20 via-white/20 to-blue-500/20">
                    <UserInputDialog CoachingOption={option}>
                      <div className="flex h-full flex-col items-center justify-center">
                        <div className="mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                          <Image
                            src={option.icon || "/placeholder.svg"}
                            alt={option.name}
                            width={100}
                            height={100}
                            className="cursor-pointer"
                          />
                        </div>
                        <p className="text-center text-lg font-medium text-gray-800">{option.name}</p>
                      </div>
                    </UserInputDialog>
                    {hoveredCard === index && <Meteors number={10} />}
                  </div>
                </div>
              </BlurFade>
            ))}

            {/* ArogyaBot card */}
            <BlurFade delay={0.5} inView>
              <div
                className="group relative h-64 w-full transform-gpu transition-all duration-300 hover:z-10 hover:scale-105 "
                onMouseEnter={() => setHoveredCard("arogyabot")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-300/20 to-purple-300/20 opacity-80 blur-xl transition-all duration-300 group-hover:opacity-100"></div>
                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/20  p-6 shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:border-blue-200 group-hover:shadow-blue-200/20 bg-gradient-to-r from-purple-500/20 via-white/20 to-blue-500/20">
                  <div className="flex h-full flex-col items-center justify-center">
                    <div className="mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Image
                        src="/Arogyalogo.png"
                        alt="BlueBot"
                        width={90}
                        height={90}
                        className="cursor-pointer"
                      />
                    </div>
                    <Button
                      className="mt-4 w-full rounded-md bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-sm text-white shadow-md transition-opacity hover:opacity-90"
                      asChild
                    >
                      <Link href="/chatbot" className="w-full text-center">
                        ArogyaBot
                      </Link>
                    </Button>
                  </div>
                  {hoveredCard === "arogyabot" && <Meteors number={10} />}
                </div>
              </div>
            </BlurFade>

            {/* Coming Soon card */}
            <BlurFade delay={0.55} inView>
              <div
                className="group relative h-64 w-full transform-gpu transition-all duration-300 hover:z-10 hover:scale-105"
                onMouseEnter={() => setHoveredCard("coming-soon")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-300/20 to-blue-300/20 opacity-80 blur-xl transition-all duration-300 group-hover:opacity-100"></div>
                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r from-purple-500/20 via-white/20 to-blue-500/20 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:border-gray-200 group-hover:shadow-gray-200/20">
                  <div className="flex h-full flex-col items-center justify-center text-gray-500">
                    <div className="mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Image src="/call.png" alt="VideoCall" width={90} height={90} className="cursor-pointer" />
                    </div>
                    <h1 className="text-lg font-medium text-gray-400">Coming Soon!</h1>
                  </div>
                  {hoveredCard === "coming-soon" && <Meteors number={10} />}
                </div>
              </div>
            </BlurFade>

            {/* VitalSense card */}
            <BlurFade delay={0.6} inView>
              <div
                className="group relative h-64 w-full transform-gpu transition-all duration-300 hover:z-10 hover:scale-105"
                onMouseEnter={() => setHoveredCard("vitalsense")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-300/20 to-blue-300/20 opacity-80 blur-xl transition-all duration-300 group-hover:opacity-100"></div>
                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r from-purple-500/20 via-white/20 to-blue-500/20 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:border-purple-200 group-hover:shadow-purple-200/20">
                  <div className="flex h-full flex-col items-center justify-center">
                    <div className="mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Image src="/acc.png" alt="VitalSense" width={90} height={90} className="cursor-pointer" />
                    </div>
                    <Button
                      className="mt-4 w-full rounded-md bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-sm text-white shadow-md transition-opacity hover:opacity-90"
                      asChild
                    >
                      <Link href="/metrics" className="w-full text-center">
                        Our Accuracy
                      </Link>
                    </Button>
                  </div>
                  {hoveredCard === "vitalsense" && <Meteors number={10} />}
                </div>
              </div>
            </BlurFade>

            {/* Meditation card */}
            <BlurFade delay={0.65} inView>
              <div
                className="group relative h-64 w-full transform-gpu transition-all duration-300 hover:z-10 hover:scale-105"
                onMouseEnter={() => setHoveredCard("meditation")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-300/20 to-purple-300/20 opacity-80 blur-xl transition-all duration-300 group-hover:opacity-100"></div>
                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r from-purple-500/20 via-white/20 to-blue-500/20 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:border-blue-200 group-hover:shadow-blue-200/20">
                  <div className="flex h-full flex-col items-center justify-center">
                    <div className="mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Image src="/dev.png" alt="Meditation" width={90} height={90} className="cursor-pointer" />
                    </div>
                    <Button
                      className="mt-4 w-full rounded-md bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-sm text-white shadow-md transition-opacity hover:rgb-opacity-90"
                      asChild
                    >
                      <Link href="https://arav-portfolio.vercel.app/" target="_blank" className="w-full text-center">
                        Developer's Portfolio
                      </Link>
                    </Button>
                  </div>
                  {hoveredCard === "meditation" && <Meteors number={10} />}
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturesAssistants