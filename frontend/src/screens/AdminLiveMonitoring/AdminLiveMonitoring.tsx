import { Car as CarIcon, MapPin as MapPinIcon, Clock as ClockIcon, Shield as ShieldIcon, Navigation as NavigationIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { SafetyScore } from "../../components/RideDetailCard";

const activeRides = [
  { id: "ride1", rider: "Alex Rivera", driver: "Jordan Blake", route: "Downtown → Riverside Park", status: "In Progress", eta: "8 min", safety: 94, priority: "safest" as const },
  { id: "ride2", rider: "Maya Chen", driver: "Liam Murphy", route: "City Library → Hillcrest Ave", status: "Matching", eta: "—", safety: 88, priority: "fastest" as const },
  { id: "ride3", rider: "Priya Sharma", driver: "Daniel Okafor", route: "Harbor Point → Tech District", status: "In Progress", eta: "15 min", safety: 81, priority: "fastest" as const },
  { id: "ride4", rider: "Sam Morgan", driver: "Jordan Blake", route: "Central Plaza → Airport T2", status: "Pickup", eta: "3 min", safety: 96, priority: "safest" as const },
];

const statusColors: Record<string, string> = {
  "In Progress": "bg-sage-500/10 text-sage-500",
  Matching: "bg-terracotta-500/10 text-terracotta-600",
  Pickup: "bg-charcoal/10 text-charcoal",
};

export const AdminLiveMonitoring = () => {
  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-normal text-charcoal">Live Ride Monitoring</h1>
            <p className="mt-1 font-sans text-sm text-muted-foreground">Real-time view of all active rides.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-sage-500/10 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-sage-500" />
            <span className="font-sans text-sm font-bold text-sage-500">Live</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <CarIcon className="h-6 w-6 text-sage-500" />
            <p className="mt-2 font-serif text-2xl font-normal text-charcoal">{activeRides.length}</p>
            <p className="font-sans text-xs text-muted-foreground">Active Rides</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <NavigationIcon className="h-6 w-6 text-terracotta-500" />
            <p className="mt-2 font-serif text-2xl font-normal text-charcoal">1,247</p>
            <p className="font-sans text-xs text-muted-foreground">Drivers Online</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <ClockIcon className="h-6 w-6 text-charcoal" />
            <p className="mt-2 font-serif text-2xl font-normal text-charcoal">3.2m</p>
            <p className="font-sans text-xs text-muted-foreground">Avg Wait</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <ShieldIcon className="h-6 w-6 text-sage-500" />
            <p className="mt-2 font-serif text-2xl font-normal text-charcoal">92</p>
            <p className="font-sans text-xs text-muted-foreground">Avg Safety</p>
          </div>
        </div>

        {/* Map placeholder */}
        <Card className="mt-6 overflow-hidden rounded-2xl border-cream-300 bg-white shadow-sm">
          <div className="relative h-64 bg-gradient-to-br from-sage-100 to-cream-300">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, #4a7c59 2px, transparent 2px), radial-gradient(circle at 70% 60%, #c66a3a 2px, transparent 2px)", backgroundSize: "50px 50px" }} />
            {activeRides.map((ride, i) => (
              <div
                key={ride.id}
                className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-sage-500 text-white shadow-md"
                style={{ left: `${20 + i * 20}%`, top: `${30 + (i % 2) * 30}%` }}
              >
                <CarIcon className="h-4 w-4" />
              </div>
            ))}
          </div>
        </Card>

        {/* Active rides table */}
        <h2 className="mt-6 font-serif text-xl font-normal text-charcoal">Active Rides</h2>
        <div className="mt-4 space-y-3">
          {activeRides.map((ride, i) => (
            <Card
              key={ride.id}
              className="rounded-2xl border-cream-300 bg-white shadow-sm animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-xs font-bold text-white">
                    {ride.rider.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-bold text-charcoal">{ride.rider}</p>
                    <p className="font-sans text-xs text-muted-foreground">{ride.route}</p>
                    <p className="font-sans text-xs text-muted-foreground">Driver: {ride.driver}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <SafetyScore score={ride.safety} size="sm" />
                  <span className="flex items-center gap-1 font-sans text-xs text-muted-foreground">
                    <ClockIcon className="h-3.5 w-3.5" /> ETA {ride.eta}
                  </span>
                  <span className={`rounded-full px-3 py-1 font-sans text-xs font-bold ${statusColors[ride.status]}`}>
                    {ride.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
