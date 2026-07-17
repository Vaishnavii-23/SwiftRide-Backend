import { Link } from "react-router-dom";
import { MapPin as MapPinIcon, Zap as ZapIcon, ShieldCheck as ShieldCheckIcon, UserCheck as UserCheckIcon, Navigation as NavigationIcon, Star as StarIcon, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

const steps = [
  {
    number: "01",
    title: "Enter Destination",
    description:
      "Tell us where you want to go. Our map instantly plots every available route option with live traffic data.",
    icon: MapPinIcon,
  },
  {
    number: "02",
    title: "Choose Your Priority",
    description:
      "Pick the fastest route to save time, or the safest route vetted by our scoring engine. You're always in control.",
    icon: ZapIcon,
  },
  {
    number: "03",
    title: "Get Matched",
    description:
      "We connect you with a verified, KYC-cleared driver nearby who matches your chosen route and priority.",
    icon: UserCheckIcon,
  },
  {
    number: "04",
    title: "Ride with Confidence",
    description:
      "Track your journey in real time, share your location with trusted contacts, and rate your trip on arrival.",
    icon: ShieldCheckIcon,
  },
];

const riderSteps = [
  { icon: NavigationIcon, title: "Track in Real Time", description: "Watch your driver approach and follow your route live." },
  { icon: ShieldCheckIcon, title: "Share with Contacts", description: "Send your live trip status to trusted friends and family." },
  { icon: StarIcon, title: "Rate & Tip", description: "Leave feedback and tip your driver after every completed trip." },
];

export const HowItWorksPage = () => {
  return (
    <div>
      <section className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-terracotta-600">
            GETTING STARTED
          </p>
          <h1 className="mt-3 font-serif text-4xl font-normal leading-tight text-charcoal sm:text-5xl">
            How SwiftRide Works
          </h1>
          <p className="mt-5 font-sans text-lg leading-relaxed text-muted-foreground">
            From booking to arrival, here's everything that happens in a
            SwiftRide journey — designed to be simple, transparent, and safe.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.number}
                className="rounded-2xl border-cream-300 bg-white shadow-sm animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CardContent className="flex flex-col p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-500/10">
                      <Icon className="h-7 w-7 text-sage-500" />
                    </div>
                    <span className="font-serif text-4xl font-normal leading-none text-sage-500/30">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-normal text-charcoal">
                    {step.title}
                  </h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-cream-200">
        <div className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl font-normal text-charcoal">
              The Rider Experience
            </h2>
            <p className="mt-4 font-sans text-base text-muted-foreground">
              Three things that make every SwiftRide trip better.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {riderSteps.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white p-6 shadow-sm animate-fade-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-500/10">
                    <Icon className="h-6 w-6 text-terracotta-500" />
                  </div>
                  <h3 className="font-serif text-lg font-normal text-charcoal">{item.title}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-8 rounded-3xl bg-charcoal px-8 py-12 text-center sm:px-16 md:flex-row md:text-left">
          <div>
            <h2 className="font-serif text-3xl font-normal text-white">
              Ready to take your first ride?
            </h2>
            <p className="mt-3 font-sans text-base text-white/70">
              Create your account in under a minute and start riding smarter today.
            </p>
          </div>
          <Link to="/register">
            <Button className="h-auto rounded-3xl bg-sage-500 px-8 py-4 font-sans text-base font-bold text-white hover:bg-sage-600">
              Create Account
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
