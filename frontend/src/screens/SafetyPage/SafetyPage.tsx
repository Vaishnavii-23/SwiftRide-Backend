import { Share2, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Shield, Eye as EyeIcon, Users as UsersIcon, MessageSquare as MessageSquareIcon, Phone as PhoneIcon, MapPin as MapPinIcon } from "lucide-react";
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

const deepDive = [
  {
    icon: Shield,
    title: "Dynamic Safety Scoring",
    description:
      "Every route is scored in real time using historical incident data, street lighting coverage, and community reports. Scores update as conditions change throughout the day.",
  },
  {
    icon: UsersIcon,
    title: "Trusted Contact Sharing",
    description:
      "Share your live trip details with up to five trusted contacts. They receive a link to follow your journey in real time without needing an account.",
  },
  {
    icon: EyeIcon,
    title: "Well-Lit Route Preference",
    description:
      "Our routing engine prioritizes streets with adequate lighting after dark, avoiding unlit alleys and low-visibility areas automatically.",
  },
  {
    icon: MessageSquareIcon,
    title: "Community Reports",
    description:
      "Riders flag unsafe areas and incidents. Reports are verified and feed directly into our safety scoring model within minutes.",
  },
];

const tips = [
  "Always confirm the license plate and driver name before getting in.",
  "Share your trip with a trusted contact before departure.",
  "Choose the safest route option when traveling at night.",
  "Keep your phone charged and the app open during your ride.",
  "Trust your instincts — cancel the ride if something feels off.",
];

const emergencyContacts = [
  { label: "SwiftRide Safety Line", value: "1-800-SAFE-RIDE", icon: PhoneIcon },
  { label: "Emergency Services", value: "911", icon: AlertCircle },
];

export const SafetyPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-sage-500">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center px-4 py-16 text-center sm:px-6 md:py-20">
          <p className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-white/70">
            SAFETY FIRST
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-4xl font-normal leading-tight text-white sm:text-5xl">
            Every route, scored for your peace of mind.
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-lg leading-relaxed text-white/80">
            We combine real-time data, community input, and smart routing to
            help you choose the safest path — not just the fastest one.
          </p>
        </div>
      </section>

      {/* Safety Features Grid (matching the provided pattern) */}
      <section className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {safetyCards.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="rounded-2xl border-cream-300 bg-cream-200 shadow-sm animate-fade-up"
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
      </section>

      {/* Deep Dive */}
      <section className="bg-cream-200">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl font-normal text-charcoal">
              How Safety Scoring Works
            </h2>
            <p className="mt-4 font-sans text-base text-muted-foreground">
              Our scoring engine analyzes multiple data sources to produce a
              0–100 safety rating for every possible route.
            </p>
            <div className="mt-8 space-y-6">
              {[
                { n: "1", t: "Data Collection", d: "Street lighting maps, incident reports, traffic patterns, and community feedback are aggregated continuously." },
                { n: "2", t: "Route Analysis", d: "Each segment of a route is evaluated and weighted based on time of day and current conditions." },
                { n: "3", t: "Score Generation", d: "A composite score is produced and displayed alongside travel time and price so you can make an informed choice." },
              ].map((step) => (
                <div key={step.n} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-500 font-sans text-sm font-bold text-white">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="font-sans text-base font-bold text-charcoal">{step.t}</h3>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-muted-foreground">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-serif text-3xl font-normal text-charcoal">
              Rider Safety Tips
            </h2>
            <p className="mt-4 font-sans text-base text-muted-foreground">
              Simple habits that make every ride safer.
            </p>
            <ul className="mt-8 space-y-4">
              {tips.map((tip, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm"
                >
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-sage-500" />
                  <span className="font-sans text-sm leading-relaxed text-charcoal">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Emergency */}
      <section className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl bg-charcoal p-8 sm:p-12">
          <h2 className="font-serif text-3xl font-normal text-white">
            Emergency Resources
          </h2>
          <p className="mt-3 font-sans text-base text-white/70">
            If you ever feel unsafe during a ride, reach out immediately.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {emergencyContacts.map((contact) => {
              const Icon = contact.icon;
              return (
                <div key={contact.label} className="flex items-center gap-4 rounded-2xl bg-white/5 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-sans text-xs font-bold uppercase tracking-wider text-white/60">
                      {contact.label}
                    </p>
                    <p className="mt-1 font-serif text-xl font-normal text-white">{contact.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
