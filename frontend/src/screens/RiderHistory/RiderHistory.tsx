import { useMemo, useState, useEffect } from "react";
import { Clock as ClockIcon, MapPin as MapPinIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { SafetyScore, PriorityBadge } from "../../components/RideDetailCard";
import { fetchApi } from "../../lib/api";

type Filter = "all" | "fastest" | "safest";

export const RiderHistory = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const res = await fetchApi("/ride/history");
        const rawHistory = res.rideHistory || [];
        
        // Map backend schema to frontend needs if possible
        const mappedTrips = rawHistory.map((trip: any, i: number) => ({
          id: trip.id,
          date: new Date(trip.createdAt).toLocaleString(),
          pickup: trip.pickupAddress || "Unknown Pickup",
          destination: trip.dropoffAddress || "Unknown Dropoff",
          route: trip.routeType || "Standard",
          duration: "Unknown", // Backend doesn't store
          price: "$25.00", // Backend doesn't store price currently
          safetyScore: trip.routeType === "SAFEST" ? 95 : 75,
          priority: trip.routeType?.toLowerCase() || "fastest",
        }));
        
        setTrips(mappedTrips);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };
    getHistory();
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? trips : trips.filter((t) => t.priority === filter)),
    [filter, trips],
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 w-full">
      <h1 className="font-serif text-2xl font-normal text-charcoal">Trip History</h1>

      <div className="mt-4 flex gap-2">
        {(["all", "fastest", "safest"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 font-sans text-sm font-bold capitalize transition-colors ${
              filter === f ? "bg-sage-500 text-white" : "bg-cream-200 text-muted-foreground"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          <p className="text-muted-foreground">Loading history...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground">No rides found in your history.</p>
        ) : (
          filtered.map((trip) => (
            <Card key={trip.id} className="rounded-2xl border-cream-300 bg-white shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <PriorityBadge priority={trip.priority as any} />
                  <span className="font-sans text-xs text-muted-foreground">{trip.date}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 shrink-0 text-sage-500" />
                  <span className="font-sans text-sm text-charcoal">{trip.pickup}</span>
                  <span className="font-sans text-xs text-muted-foreground">→</span>
                  <span className="font-sans text-sm font-bold text-charcoal">{trip.destination}</span>
                </div>
                <div className="mt-3 flex items-center gap-4 font-sans text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><ClockIcon className="h-3.5 w-3.5" />{trip.duration}</span>
                  <SafetyScore score={trip.safetyScore} size="sm" />
                  <span className="ml-auto font-bold text-sage-500">{trip.price}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
