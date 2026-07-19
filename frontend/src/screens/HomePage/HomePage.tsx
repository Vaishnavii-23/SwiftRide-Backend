import { Link } from "react-router-dom";
import { Share2, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Shield, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const safetyCards = [
  {
    title: "Real-time Tracking",
    description: "Share your live location and trip status with trusted contacts in one tap.",
    icon: Share2,
  },
  {
    title: "Verified Drivers",
    description: "Every driver undergoes rigorous background checks and KYC verification.",
    icon: CheckCircle2,
  },
  {
    title: "Emergency Support",
    description: "24/7 dedicated safety team and in-app SOS button for immediate assistance.",
    icon: AlertCircle,
  },
  {
    title: "Route Analysis",
    description: "Proprietary algorithms score routes based on lighting, traffic, and historical data.",
    icon: Shield,
  },
];

const steps = [
  {
    number: "01",
    title: "Enter Destination",
    description: "Tell us where you want to go. Our map instantly plots every available route option.",
  },
  {
    number: "02",
    title: "Choose Your Priority",
    description: "Pick the fastest route to save time, or the safest route vetted by our scoring engine.",
  },
  {
    number: "03",
    title: "Get Matched",
    description: "We connect you with a verified driver nearby who matches your chosen route.",
  },
  {
    number: "04",
    title: "Ride with Confidence",
    description: "Track your journey in real time and share your location with trusted contacts.",
  },
];

export const HomePage = () => {
  return (
    <div className="bg-white text-black">

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-screen-xl grid-cols-1 items-center gap-12 px-4 pb-20 pt-1 sm:px-6 md:gap-16 md:pt-8 lg:grid-cols-2 lg:py-16">
        <div className="flex flex-col items-start">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            YOUR JOURNEY, YOUR CHOICE
          </p>
          <h1 className="mt-6 max-w-[560px] font-sans text-5xl font-black leading-tight text-black sm:text-6xl">
            Choose the <span className="text-gray-500 underline decoration-2 underline-offset-4">Fastest</span> or the <span className="text-teal-700 underline decoration-2 underline-offset-4">Safest</span> Route.
          </h1>
          <p className="mt-6 max-w-[480px] font-sans text-lg leading-relaxed text-gray-500">
            Navigate the city on your terms. SwiftRide empowers you with real-time data to select a route optimized for speed, or one vetted for maximum safety.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/register">
              <Button className="h-auto rounded-lg bg-black px-8 py-4 font-sans text-base font-bold text-white hover:bg-gray-900 transition-all">
                Get Started
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" className="h-auto rounded-lg border-gray-200 bg-white px-8 py-4 font-sans text-base font-bold text-black hover:bg-gray-50 transition-all">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end w-full">
          <div className="flex justify-center lg:justify-end w-full h-[600px]">
            <DotLottieReact
              src="https://lottie.host/26bb5789-3aff-4111-adc9-a7a1a3da3a85/dYQrtAjQBk.json"
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="bg-gray-50">
        <div className="mx-auto w-full max-w-screen-xl px-4 py-20 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-sans text-4xl font-black text-black">
              Designed for Peace of Mind
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-base text-gray-500">
              Every feature is built to ensure you arrive comfortably and safely, without compromising on efficiency.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {safetyCards.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="rounded-2xl border-gray-100 bg-white shadow-none hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <CardContent className="flex h-full flex-col p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-sans text-xl font-bold text-black">
                      {feature.title}
                    </h3>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-gray-500">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto w-full max-w-screen-xl px-4 py-20 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-sans text-4xl font-black text-black">
            How It Works
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-base text-gray-500">
            Four simple steps stand between you and a smarter, safer ride.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-start">
              <span className="font-sans text-5xl font-black leading-none text-gray-100">
                {step.number}
              </span>
              <h3 className="mt-4 font-sans text-lg font-bold text-black">
                {step.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-8 rounded-2xl bg-black px-8 py-16 text-center sm:px-16 md:flex-row md:text-left">
          <div>
            <h2 className="font-sans text-4xl font-black text-white">
              Ready to ride smarter?
            </h2>
            <p className="mt-3 font-sans text-base text-gray-400">
              Join thousands of riders who choose safety and speed every day.
            </p>
          </div>
          <Link to="/register">
            <Button className="h-auto rounded-lg bg-white px-8 py-4 font-sans text-base font-bold text-black hover:bg-gray-100 transition-all">
              Get Started
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

