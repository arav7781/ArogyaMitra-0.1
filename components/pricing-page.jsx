"use client"

import { useState } from "react"
import { Check, Sparkles, Zap, Database, Users, Globe, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState("monthly")

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50 dark:from-neutral-950 dark:to-neutral-900 text-neutral-800 dark:text-neutral-50 lg:pb-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900">
            Pricing
          </Badge>
          <h2 className="mb-4 text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Choose Your BlueBox AI Plan
          </h2>
          <p className="text-xl tracking-tight text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Powerful business intelligence solutions tailored to your needs. Start your 14-day free trial today.
          </p>

          <div className="flex items-center justify-center mt-8 space-x-2">
            <Label htmlFor="billing-toggle" className={billingCycle === "monthly" ? "font-medium" : "text-neutral-500"}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={billingCycle === "yearly"}
              onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
            />
            <Label htmlFor="billing-toggle" className={billingCycle === "yearly" ? "font-medium" : "text-neutral-500"}>
              Yearly{" "}
              <Badge className="ml-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900">
                Save 20%
              </Badge>
            </Label>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {/* Solo Plan */}
          <Card className="relative overflow-hidden border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="pb-8">
              <CardTitle className="text-4xl font-bold tracking-tight">Solo</CardTitle>
              <div className="mt-4 flex items-baseline text-neutral-900 dark:text-neutral-50">
                <span className="text-4xl font-extrabold tracking-tight">
                  {billingCycle === "monthly" ? "₹29" : "₹279"}
                </span>
                <span className="ml-1 text-xl text-neutral-500 dark:text-neutral-400">
                  /{billingCycle === "monthly" ? "month" : "year"}
                </span>
              </div>
              <CardDescription className="mt-4 text-base">
                Perfect for solo entrepreneurs and small businesses getting started with AI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <FeatureItem icon={<MessageSquare className="h-4 w-4" />}>AI-powered chat interface</FeatureItem>
                <FeatureItem icon={<Zap className="h-4 w-4" />}>Voice assistant (English only)</FeatureItem>
                <FeatureItem icon={<Database className="h-4 w-4" />}>Basic business knowledge base</FeatureItem>
                <FeatureItem icon={<Users className="h-4 w-4" />}>Human escalation support</FeatureItem>
                <FeatureItem icon={<Check className="h-4 w-4" />}>Up to 100 queries per month</FeatureItem>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 pt-6">
              <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white">
                Start 14-day free trial
              </Button>
              <p className="text-xs text-center text-neutral-500">No credit card required</p>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative overflow-hidden border-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
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
            <div className="relative z-10">
              <CardHeader className="pb-8">
                <CardTitle className="text-4xl font-bold tracking-tight text-white">Enterprise</CardTitle>
                <div className="mt-4 flex items-baseline text-white">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {billingCycle === "monthly" ? "₹99" : "₹950"}
                  </span>
                  <span className="ml-1 text-xl text-blue-100">/{billingCycle === "monthly" ? "month" : "year"}</span>
                </div>
                <CardDescription className="mt-4 text-base text-blue-100">
                  Ideal for growing businesses with advanced AI requirements.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <FeatureItem light icon={<MessageSquare className="h-4 w-4" />}>
                    Advanced AI chat with context memory
                  </FeatureItem>
                  <FeatureItem light icon={<Zap className="h-4 w-4" />}>
                    Multilingual voice assistant (5 languages)
                  </FeatureItem>
                  <FeatureItem light icon={<Database className="h-4 w-4" />}>
                    Custom business knowledge base
                  </FeatureItem>
                  <FeatureItem light icon={<Globe className="h-4 w-4" />}>
                    SQL integration & data analysis
                  </FeatureItem>
                  <FeatureItem light icon={<Users className="h-4 w-4" />}>
                    Priority support with 24/7 availability
                  </FeatureItem>
                  <FeatureItem light icon={<Sparkles className="h-4 w-4" />}>
                    Unlimited queries & API access
                  </FeatureItem>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3 pt-6">
                <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 dark:bg-white dark:text-blue-700 dark:hover:bg-blue-50">
                  Start 14-day free trial
                </Button>
                <p className="text-xs text-center text-blue-100">No credit card required</p>
              </CardFooter>
            </div>
          </Card>

          {/* Custom Plan */}
          <Card className="relative overflow-hidden border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="pb-8">
              <CardTitle className="text-4xl font-bold tracking-tight">Custom</CardTitle>
              <div className="mt-4 flex items-baseline text-neutral-900 dark:text-neutral-50">
                <span className="text-4xl font-extrabold tracking-tight">From ₹399</span>
                <span className="ml-1 text-xl text-neutral-500 dark:text-neutral-400">/month</span>
              </div>
              <CardDescription className="mt-4 text-base">
                Tailored solutions for enterprises with specific requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <FeatureItem icon={<Check className="h-4 w-4" />}>All Enterprise features</FeatureItem>
                <FeatureItem icon={<Check className="h-4 w-4" />}>Custom AI model training</FeatureItem>
                <FeatureItem icon={<Check className="h-4 w-4" />}>Dedicated account manager</FeatureItem>
                <FeatureItem icon={<Check className="h-4 w-4" />}>On-premise deployment options</FeatureItem>
                <FeatureItem icon={<Check className="h-4 w-4" />}>Custom integrations & workflows</FeatureItem>
                <FeatureItem icon={<Check className="h-4 w-4" />}>SLA guarantees</FeatureItem>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col pt-6">
              <Button
                variant="outline"
                className="w-full border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Contact sales
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-20 max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
          <div className="grid gap-6 md:grid-cols-2 text-left">
            <FaqItem
              question="How does the 14-day trial work?"
              answer="You can try any plan free for 14 days with no credit card required. After your trial ends, you can choose to subscribe or your account will be downgraded to our free tier with limited features."
            />
            <FaqItem
              question="Can I switch plans later?"
              answer="Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next billing cycle."
            />
            <FaqItem
              question="What languages are supported?"
              answer="The Solo plan supports English only. The Enterprise plan supports English, Hindi, Marathi, Gujarati, and Tamil. Custom plans can support additional languages."
            />
            <FaqItem
              question="Is my data secure?"
              answer="Yes, BlueBox AI uses enterprise-grade encryption and follows strict data privacy protocols. We never share your data with third parties."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

const FeatureItem = ({ children, icon, light = false }) => {
  return (
    <div className="flex items-start">
      <div
        className={`mr-3 flex-shrink-0 rounded-full p-1 ${light ? "bg-blue-400/30 text-white" : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"}`}
      >
        {icon || <Check className="h-4 w-4" />}
      </div>
      <span className={`text-sm ${light ? "text-white" : "text-neutral-700 dark:text-neutral-300"}`}>{children}</span>
    </div>
  )
}

const FaqItem = ({ question, answer }) => {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">{question}</h4>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{answer}</p>
    </div>
  )
}

export default PricingPage
