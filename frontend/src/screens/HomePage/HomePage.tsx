import { Link } from "react-router-dom";
import { Share2, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Shield, Zap, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

const safetyCards = [
  {
    title: "Real-time Tracking",
    description:
      "Share your live location and trip status with trusted contacts in one tap.",
    icon: Share2,
    color: "bg-sage-500/10 text-sage-500",
  },
  {
    title: "Verified Drivers",
    description:
      "Every driver undergoes rigorous background checks and KYC verification.",
    icon: CheckCircle2,
    color: "bg-sage-500/10 text-sage-500",
  },
  {
    title: "Emergency Support",
    description:
      "24/7 dedicated safety team and in-app SOS button for immediate assistance.",
    icon: AlertCircle,
    color: "bg-red-50 text-red-600",
  },
  {
    title: "Route Analysis",
    description:
      "Proprietary algorithms score routes based on lighting, traffic, and historical data.",
    icon: Shield,
    color: "bg-sage-500/10 text-sage-500",
  },
];

const steps = [
  {
    number: "01",
    title: "Enter Destination",
    description:
      "Tell us where you want to go. Our map instantly plots every available route option.",
  },
  {
    number: "02",
    title: "Choose Your Priority",
    description:
      "Pick the fastest route to save time, or the safest route vetted by our scoring engine.",
  },
  {
    number: "03",
    title: "Get Matched",
    description:
      "We connect you with a verified driver nearby who matches your chosen route.",
  },
  {
    number: "04",
    title: "Ride with Confidence",
    description:
      "Track your journey in real time and share your location with trusted contacts.",
  },
];

export const HomePage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid w-full max-w-screen-xl grid-cols-1 items-center gap-12 px-4 pb-20 pt-14 sm:px-6 md:gap-16 md:pt-20 lg:grid-cols-2 lg:py-16">
        <div className="flex flex-col items-start animate-fade-up">
          <p className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-terracotta-600">
            YOUR JOURNEY, YOUR CHOICE
          </p>
          <h1 className="mt-4 max-w-[560px] font-serif text-[44px] font-normal leading-[0.98] text-charcoal sm:text-[56px] sm:leading-[60px]">
            Choose the <span className="text-sage-500">Fastest</span>
            <br />
            or the <span className="text-terracotta-600">Safest</span> Route.
          </h1>
          <p className="mt-4 max-w-[520px] font-sans text-lg leading-relaxed text-muted-foreground">
            Navigate the city on your terms. SwiftRide empowers you with
            real-time data to select a route optimized for speed, or one vetted
            for maximum safety.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link to="/register">
              <Button className="h-auto rounded-3xl bg-sage-500 px-8 py-4 font-sans text-base font-bold text-white shadow-lg hover:bg-sage-600">
                Get Started
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button
                variant="outline"
                className="h-auto rounded-3xl border-cream-400 bg-cream-100 px-8 py-4 font-sans text-base font-bold text-sage-500 hover:bg-cream-200 hover:text-sage-500"
              >
                How It Works
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <div className="h-[360px] w-[172px] rounded-[32px] bg-charcoal shadow-[0px_20px_40px_#2e323026] sm:h-[460px] sm:w-[220px] sm:rounded-[40px] lg:h-[600px] lg:w-72 lg:rounded-[48px]" />
        </div>
      </section>

      {/* Safety Features */}
      <section className="bg-cream-200">
        <div className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-serif text-3xl font-normal text-charcoal">
              Designed for Peace of Mind
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-base text-muted-foreground">
              Every feature is built to ensure you arrive comfortably and safely,
              without compromising on efficiency.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {safetyCards.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="rounded-2xl border-cream-300 bg-white shadow-sm animate-fade-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <CardContent className="flex h-full flex-col p-8">
                    <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-xl font-normal text-charcoal">
                      {feature.title}
                    </h3>
    <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-serif text-3xl font-normal text-charcoal">
            How It Works
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-base text-muted-foreground">
            Four simple steps stand between you and a smarter, safer ride.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-start">
              <span className="font-serif text-5xl font-normal leading-none text-sage-500/30">
                {step.number}
              </span>
              <h3 className="mt-4 font-serif text-xl font-normal text-charcoal">
                {step.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-8 rounded-3xl bg-sage-500 px-8 py-12 text-center sm:px-16 md:flex-row md:text-left">
          <div>
            <h2 className="font-serif text-3xl font-normal text-white">
              Ready to ride smarter?
            </h2>
            <p className="mt-3 font-sans text-base text-white/80">
              Join thousands of riders who choose safety and speed every day.
            </p>
          </div>
          <Link to="/register">
            <Button className="h-auto rounded-3xl bg-white px-8 py-4 font-sans text-base font-bold text-sage-500 shadow-lg hover:bg-cream-200">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
