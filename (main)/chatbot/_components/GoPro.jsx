"use client"
import { Star, Eye, Stethoscope, Image } from "lucide-react"
import { BlurFade } from "@/components/magicui/blur-fade"
import GradientText from "@/components/ui/GradientText"
import Link from "next/link"

const GoPro = () => {
  return (
    <section
      id="go-pro"
      className="py-20 bg-gradient-to-r from-purple-300 via-fuchsia-200 to-blue-300 mt-5 rounded-3xl"
      style={{ boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="container mx-auto px-4 rounded-3xl box-shadow-lg">
        <BlurFade delay={0.3} inView>
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-4">
              Upgrade to Pro
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText>Unlock Thinking Capabilities with Pro</GradientText>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Take your healthcare assistant to the next level with advanced visual analysis. Pro users can access AI-driven tools for healthcare in multilingual voices, and other image-based products analysis.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <BlurFade delay={0.5} inView>
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <Eye className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Vision based Product Analysis</h3>
              <p className="text-gray-600">
                Upload images to detect defects and get instant suggestions powered by computer vision.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.7} inView>
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <Image className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Sales boosting insights</h3>
              <p className="text-gray-600">
                Get insights to boost sales with high-accuracy responses.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.9} inView>
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <Stethoscope className="w-10 h-10 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Smarter Business Guidance</h3>
              <p className="text-gray-600">
                Get better recommendations based on healthcare trends and market history just like a healthcare assistant.
              </p>
            </div>
          </BlurFade>
        </div>

        {/* Go Pro Call-to-Action */}
        <BlurFade delay={1.2} inView>
          <div className="mt-20 text-center bg-white rounded-2xl p-10 shadow-md">
            <div className="flex justify-center mb-4 animate-pulse">
              <Star className="w-10 h-10 text-yellow-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              Why Go Pro?
            </h3>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
              With <span className="text-purple-600 font-semibold">ArogyaMitra Pro</span>, you don’t just chat—you see and analyze. Whether it’s injury analysis, sales insights, or healthcare guidance, our AI is trained to assist like a real specialist. Faster insights. Smarter healthcare.
            </p>
            <Link href="/handler/signup" passHref>
              <button className="px-6 py-3  bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all duration-300">
                Go Pro Now
              </button>
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

export default GoPro
