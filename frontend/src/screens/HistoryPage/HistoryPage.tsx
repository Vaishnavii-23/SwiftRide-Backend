import { useMemo, useState } from "react";
import { Clock as ClockIcon, MapPin as MapPinIcon, ShieldCheck as ShieldCheckIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";

interface TripRecord {
  id: string;
  date: string;
  pickup: string;
  destination: string;
  route: string;
  duration: string;
  price: string;
  safetyScore: number;
  priority: "fastest" | "safest";
}

const tripHistory: TripRecord[] = [
  {
    id: "trip-001",
    date: "Jul 14, 2026 · 9:32 AM",
    pickup: "Downtown Station",
    destination: "Riverside Park",
    route: "Express Highway",
    duration: "18 min",
    price: "$24.50",
    safetyScore: 72,
    priority: "fastest",
  },
  {
    id: "trip-002",
    date: "Jul 12, 2026 · 7:15 PM",
    pickup: "City Library",
    destination: "Hillcrest Avenue",
    route: "Well-Lit Boulevard",
    duration: "26 min",
    price: "$28.00",
    safetyScore: 94,
    priority: "safest",
  },
  {
    id: "trip-003",
    date: "Jul 10, 2026 · 2:48 PM",
    pickup: "Harbor Point",
    destination: "Tech District",
    route: "City Center Loop",
    duration: "22 min",
    price: "$26.00",
    safetyScore: 81,
    priority: "fastest",
  },
  {
    id: "trip-004",
    date: "Jul 8, 2026 · 6:05 PM",
    pickup: "University Campus",
    destination: "Old Town Market",
    route: "Well-Lit Boulevard",
    duration: "31 min",
    price: "$31.50",
    safetyScore: 96,
    priority: "safest",
  },
  {
    id: "trip-005",
    date: "Jul 5, 2026 · 11:20 AM",
    pickup: "Central Plaza",
    destination: "Airport Terminal 2",
    route: "Express Highway",
    duration: "24 min",
    price: "$33.00",
    safetyScore: 75,
    priority: "fastest",
  },
];

type Filter = "all" | "fastest" | "safest";

export const HistoryPage = (): JSX.Element => {
  const [filter, setFilter] = useState<Filter>("all");

  const filteredTrips = useMemo(() => {
    if (filter === "all") return tripHistory;
    return tripHistory.filter((t) => t.priority === filter);
  }, [filter]);

  const totalSpent = filteredTrips.reduce((sum, t) => {
    const value = parseFloat(t.price.replace(/[$,]/g, ""));
    return sum + value;
  }, 0);

  const avgSafety = filteredTrips.length
    ? Math.round(
        filteredTrips.reduce((sum, t) => sum + t.safetyScore, 0) /
          filteredTrips.length,
      )
    : 0;

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <p className="[font-family:'Nunito_Sans',Helvetica] text-sm font-bold uppercase tracking-[0.70px] text-[#8a7440]">
          YOUR TRIPS
        </p>
        <h1 className="mt-3 [font-family:'Literata',Helvetica] text-4xl font-normal leading-tight text-[#2e3230]">
          Ride History
        </h1>
        <p className="mt-3 [font-family:'Nunito_Sans',Helvetica] text-base font-normal leading-6 text-[#5d625d]">
          Review your past journeys, routes taken, and safety scores.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-[#e4e0d8] bg-[#f0ece4] shadow-[0px_4px_20px_#2e32300f]">
          <CardContent className="p-6">
            <p className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]">
              Total Trips
            </p>
            <p className="mt-2 [font-family:'Literata',Helvetica] text-3xl font-normal text-[#2e3230]">
              {filteredTrips.length}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-[#e4e0d8] bg-[#f0ece4] shadow-[0px_4px_20px_#2e32300f]">
          <CardContent className="p-6">
            <p className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]">
              Total Spent
            </p>
            <p className="mt-2 [font-family:'Literata',Helvetica] text-3xl font-normal text-[#2e3230]">
              ${totalSpent.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-[#e4e0d8] bg-[#f0ece4] shadow-[0px_4px_20px_#2e32300f]">
          <CardContent className="p-6">
            <p className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]">
              Avg Safety Score
            </p>
            <p className="mt-2 [font-family:'Literata',Helvetica] text-3xl font-normal text-[#4a7c59]">
              {avgSafety}/100
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "fastest", "safest"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-5 py-2 [font-family:'Nunito_Sans',Helvetica] text-sm font-bold capitalize transition-colors ${
              filter === f
                ? "bg-[#4a7c59] text-white"
                : "bg-[#f0ece4] text-[#6b6f6a] hover:bg-[#e4e0d8]"
            }`}
          >
            {f === "all" ? "All Trips" : f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredTrips.map((trip) => (
          <Card
            key={trip.id}
            className="rounded-2xl border-[#e4e0d8] bg-white shadow-[0px_4px_20px_#2e32300f]"
          >
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 [font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider ${
                      trip.priority === "fastest"
                        ? "bg-[#4a7c59]/10 text-[#4a7c59]"
                        : "bg-[#705c30]/10 text-[#705c30]"
                    }`}
                  >
                    {trip.priority}
                  </span>
                  <span className="[font-family:'Nunito_Sans',Helvetica] text-sm font-normal text-[#8b8f8a]">
                    {trip.date}
                  </span>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 shrink-0 text-[#4a7c59]" />
                    <span className="[font-family:'Nunito_Sans',Helvetica] text-sm font-normal text-[#2e3230]">
                      {trip.pickup}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 shrink-0 text-[#705c30]" />
                    <span className="[font-family:'Nunito_Sans',Helvetica] text-sm font-normal text-[#2e3230]">
                      {trip.destination}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 sm:gap-8">
                <div className="flex flex-col">
                  <span className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]">
                    Route
                  </span>
                  <span className="mt-1 [font-family:'Nunito_Sans',Helvetica] text-sm font-bold text-[#2e3230]">
                    {trip.route}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]">
                    Duration
                  </span>
                  <span className="mt-1 flex items-center gap-1 [font-family:'Nunito_Sans',Helvetica] text-sm font-bold text-[#2e3230]">
                    <ClockIcon className="h-3.5 w-3.5 text-[#6b6f6a]" />
                    {trip.duration}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]">
                    Safety
                  </span>
                  <span className="mt-1 flex items-center gap-1 [font-family:'Nunito_Sans',Helvetica] text-sm font-bold text-[#2e3230]">
                    <ShieldCheckIcon className="h-3.5 w-3.5 text-[#6b6f6a]" />
                    {trip.safetyScore}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]">
                    Fare
                  </span>
                  <span className="mt-1 [font-family:'Nunito_Sans',Helvetica] text-sm font-bold text-[#4a7c59]">
                    {trip.price}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
