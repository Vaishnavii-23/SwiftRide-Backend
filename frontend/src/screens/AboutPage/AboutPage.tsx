import { Heart as HeartIcon, Leaf as LeafIcon, Shield as ShieldIcon, Zap as ZapIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";

const values = [
  {
    icon: ShieldIcon,
    title: "Safety Above All",
    description:
      "We believe every rider deserves to feel secure. Safety is never an afterthought — it's the foundation of every decision we make.",
  },
  {
    icon: HeartIcon,
    title: "Community Driven",
    description:
      "Our safety data comes from real riders. Community reports shape our routing and keep our scoring engine honest.",
  },
  {
    icon: ZapIcon,
    title: "Efficiency Without Compromise",
    description:
      "Fast doesn't have to mean reckless. We prove you can reach your destination quickly while still choosing a smart, safe path.",
  },
  {
    icon: LeafIcon,
    title: "Sustainable Mobility",
    description:
      "By optimizing routes and reducing unnecessary mileage, we lower our collective carbon footprint one ride at a time.",
  },
];

const milestones = [
  {
    year: "2023",
    title: "The Idea",
    description:
      "Founded by a group of urban commuters who believed ride-hailing could prioritize safety as much as speed.",
  },
  {
    year: "2024",
    title: "Safety Engine Launch",
    description:
      "Introduced our proprietary safety scoring system, analyzing over 50,000 street segments across three cities.",
  },
  {
    year: "2025",
    title: "Community Network",
    description:
      "Reached 100,000 active riders and launched our community reporting system for real-time incident flagging.",
  },
  {
    year: "2026",
    title: "Citywide Expansion",
    description:
      "Now operating across 12 metropolitan areas with a 95% on-time arrival rate and a 94% average safety score.",
  },
];

const team = [
  { name: "Maya Chen", role: "CEO & Co-Founder", initials: "MC" },
  { name: "Daniel Okafor", role: "CTO & Co-Founder", initials: "DO" },
  { name: "Priya Sharma", role: "Head of Safety", initials: "PS" },
  { name: "Liam Murphy", role: "Head of Operations", initials: "LM" },
];

export const AboutPage = (): JSX.Element => {
  return (
    <div>
      <section className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="[font-family:'Nunito_Sans',Helvetica] text-sm font-bold uppercase tracking-[0.70px] text-[#8a7440]">
            OUR STORY
          </p>
          <h1 className="mt-3 [font-family:'Literata',Helvetica] text-4xl font-normal leading-tight text-[#2e3230] sm:text-5xl">
            We're reimagining urban mobility around safety.
          </h1>
          <p className="mt-5 [font-family:'Nunito_Sans',Helvetica] text-lg font-normal leading-[1.65] text-[#5d625d]">
            SwiftRide was born from a simple frustration: why should riders have
            to choose between getting somewhere quickly and getting there
            safely? We built a platform where you never have to make that
            trade-off blind.
          </p>
        </div>
      </section>

      <section className="bg-[#f4efe8]">
        <div className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="[font-family:'Literata',Helvetica] text-3xl font-normal leading-9 text-[#2e3230]">
              What We Stand For
            </h2>
            <p className="mt-4 [font-family:'Nunito_Sans',Helvetica] text-base font-normal leading-6 text-[#5d625d]">
              The principles that guide every route, every feature, every ride.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className="rounded-2xl border-[#e4e0d8] bg-white shadow-[0px_4px_20px_#2e32300f]"
                >
                  <CardContent className="flex h-full flex-col p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#4a7c59]/10">
                      <Icon className="h-6 w-6 text-[#4a7c59]" />
                    </div>
                    <h3 className="[font-family:'Literata',Helvetica] text-xl font-normal leading-7 text-[#2e3230]">
                      {value.title}
                    </h3>
                    <p className="mt-3 [font-family:'Nunito_Sans',Helvetica] text-sm font-normal leading-[22.8px] text-[#4a4e4a]">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="[font-family:'Literata',Helvetica] text-3xl font-normal leading-9 text-[#2e3230]">
            Our Journey
          </h2>
          <p className="mt-4 [font-family:'Nunito_Sans',Helvetica] text-base font-normal leading-6 text-[#5d625d]">
            From a simple idea to a citywide safety-first ride platform.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((milestone) => (
            <div key={milestone.year} className="flex flex-col">
              <span className="[font-family:'Literata',Helvetica] text-4xl font-normal leading-none text-[#4a7c59]/30">
                {milestone.year}
              </span>
              <h3 className="mt-3 [font-family:'Literata',Helvetica] text-lg font-normal leading-7 text-[#2e3230]">
                {milestone.title}
              </h3>
              <p className="mt-2 [font-family:'Nunito_Sans',Helvetica] text-sm font-normal leading-6 text-[#5d625d]">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f4efe8]">
        <div className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="[font-family:'Literata',Helvetica] text-3xl font-normal leading-9 text-[#2e3230]">
              The Team
            </h2>
            <p className="mt-4 [font-family:'Nunito_Sans',Helvetica] text-base font-normal leading-6 text-[#5d625d]">
              The people building safety into every ride.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#4a7c59] text-2xl font-bold text-white">
                  {member.initials}
                </div>
                <h3 className="mt-4 [font-family:'Literata',Helvetica] text-lg font-normal leading-7 text-[#2e3230]">
                  {member.name}
                </h3>
                <p className="mt-1 [font-family:'Nunito_Sans',Helvetica] text-sm font-normal text-[#8a7440]">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
