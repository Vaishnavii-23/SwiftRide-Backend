import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock as ClockIcon, MapPin as MapPinIcon, RefreshCw, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { SafetyScore } from "../../components/RideDetailCard";
import { rideService } from "../../services/ride.service";
import { Ride } from "../../types";

type Filter = "all" | "fastest" | "safest";

export const RiderHistory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [trips, setTrips] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await rideService.getRideHistory();
      setTrips(res.rideHistory || []);
    } catch (err: any) {
      console.error("Failed to fetch history:", err);
      setError("Failed to load your trip history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return trips;
    return trips.filter((t) => t.routeType?.toLowerCase() === filter);
  }, [filter, trips]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-normal text-charcoal">Trip History</h1>
          <p className="font-sans text-sm text-muted-foreground mt-0.5">
            Review all your past and active bookings.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchHistory}
          disabled={loading}
          className="text-muted-foreground hover:text-charcoal"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-red-50 p-3.5 text-red-600 border border-red-200">
          <span className="font-sans text-sm">{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchHistory}
            className="text-red-600 hover:bg-red-100 font-bold"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mt-6 flex gap-2.5">
        {(["all", "fastest", "safest"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-5 py-2 font-sans text-sm font-bold capitalize transition-all duration-200 ${
              filter === f
                ? "bg-black text-white"
                : "bg-cream-200 text-muted-foreground hover:bg-cream-300 hover:text-charcoal"
            }`}
          >
            {f === "all" ? "All Trips" : f}
          </button>
        ))}
      </div>

      {/* Trip List */}
      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 w-full rounded-2xl bg-cream-200 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-200 p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-serif text-lg text-charcoal">No Trips Found</p>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              You haven't requested any rides matching this filter.
            </p>
          </div>
        ) : (
          filtered.map((trip) => {
            const isActive = ["REQUESTED", "ACCEPTED", "IN_PROGRESS"].includes(trip.status);
            const handleClick = () => {
              if (trip.status === "REQUESTED") {
                navigate("/rider/matching", {
                  state: {
                    rideId: trip.id,
                    destination: trip.dropoffAddress,
                    pickupAddress: trip.pickupAddress,
                    pickupLat: trip.pickupLat,
                    pickupLng: trip.pickupLng,
                    dropoffLat: trip.dropoffLat,
                    dropoffLng: trip.dropoffLng,
                  },
                });
              } else if (trip.status === "ACCEPTED" || trip.status === "IN_PROGRESS") {
                navigate("/rider/ride", {
                  state: {
                    rideId: trip.id,
                    destination: trip.dropoffAddress,
                    pickupAddress: trip.pickupAddress,
                    pickupLat: trip.pickupLat,
                    pickupLng: trip.pickupLng,
                    dropoffLat: trip.dropoffLat,
                    dropoffLng: trip.dropoffLng,
                  },
                });
              } else {
                navigate(`/rider/history/${trip.id}`);
              }
            };
            return (
            <div
              key={trip.id}
              onClick={handleClick}
              className={`cursor-pointer transition-all duration-200 rounded-2xl border bg-white hover:bg-cream-200/50 hover:shadow-sm ${
                isActive ? "border-blue-300 ring-1 ring-blue-200" : "border-gray-200"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-sans text-[11px] font-bold ${
                        trip.routeType === "SAFEST"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-orange-50 text-orange-700 border-orange-200"
                      }`}
                    >
                      {trip.routeType}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-sans text-[11px] font-bold ${getStatusColor(
                        trip.status
                      )}`}
                    >
                      {trip.status}
                    </span>
                  </div>
                  <span className="font-sans text-[11px] text-muted-foreground">
                    {new Date(trip.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-2.5">
                  <div className="flex flex-col items-center pt-1.5 shrink-0">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <div className="h-6 w-0.5 bg-cream-400 my-0.5" />
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                  </div>
                  <div className="flex-1 min-w-0 font-sans text-sm text-charcoal">
                    <p className="truncate"><strong>From:</strong> {trip.pickupAddress}</p>
                    <p className="truncate mt-1.5"><strong>To:</strong> {trip.dropoffAddress}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 self-center" />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-cream-200 pt-3 text-xs text-muted-foreground font-sans">
                  <div className="flex gap-4">
                    {trip.distance !== undefined && (
                      <span>Distance: <strong>{trip.distance} km</strong></span>
                    )}
                    {trip.routeType === "SAFEST" && (
                      <SafetyScore score={95} size="sm" />
                    )}
                  </div>
                  <span className="font-sans text-base font-bold text-sage-500">
                    ₹{trip.fare || 0}
                  </span>
                </div>
              </CardContent>
            </div>
          );
          })
        )}
      </div>
    </div>
  );
};
export default RiderHistory;
