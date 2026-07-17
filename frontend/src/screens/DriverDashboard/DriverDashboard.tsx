import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign as DollarSignIcon, Car as CarIcon, Clock as ClockIcon, Star as StarIcon, Power as PowerIcon, ArrowRight } from "lucide-react";
import { StatCard } from "../../components/RideDetailCard";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { fetchApi } from "../../lib/api";

export const DriverDashboard = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        // Assume history works similarly for drivers in this backend
        const res = await fetchApi("/ride/history");
        const rawHistory = res.rideHistory || [];
        
        const mappedRides = rawHistory.map((trip: any) => ({
          id: trip.id,
          time: new Date(trip.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          route: `${trip.pickupAddress?.split(',')[0] || "Unknown"} → ${trip.dropoffAddress?.split(',')[0] || "Unknown"}`,
          fare: "$25.00",
          rating: 5,
        }));
        
        setRides(mappedRides);
      } catch (error) {
        console.error("Failed to fetch driver history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDriverData();
  }, []);

  const handleToggleStatus = async () => {
    try {
      if (isOnline) {
        await fetchApi("/location/offline", { method: "POST" });
        setIsOnline(false);
      } else {
        await fetchApi("/location/online", { method: "POST" });
        setIsOnline(true);
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-normal text-charcoal">Driver Dashboard</h1>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              {isOnline ? "You're online and ready to ride." : "You are currently offline."}
            </p>
          </div>
          <Button
            onClick={handleToggleStatus}
            variant="outline"
            className={`rounded-2xl border-cream-400 px-4 py-2 font-sans text-sm font-bold ${
              isOnline ? "text-terracotta-600 hover:bg-terracotta-50" : "text-sage-500 hover:bg-sage-50"
            }`}
          >
            <PowerIcon className="h-4 w-4 mr-2" /> {isOnline ? "Go Offline" : "Go Online"}
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Earnings" value="$0.00" icon={DollarSignIcon} accent="sage" sublabel={`${rides.length} trips`} />
          <StatCard label="Trips" value={rides.length.toString()} icon={CarIcon} accent="terracotta" />
          <StatCard label="Online Hours" value="0h" icon={ClockIcon} accent="charcoal" />
          <StatCard label="Rating" value="5.0" icon={StarIcon} accent="sage" />
        </div>

        {/* Incoming request prompt - For demo purposes we can leave this static or hide it */}
        {isOnline && (
          <Card className="mt-6 rounded-2xl border-sage-500/30 bg-sage-500/5 shadow-sm animate-fade-up">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse-ring rounded-full bg-sage-500/30" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-sage-500 text-white">
                    <CarIcon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <p className="font-sans text-base font-bold text-charcoal">Waiting for Requests...</p>
                  <p className="font-sans text-sm text-muted-foreground">Ensure your location is enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent rides */}
        <h2 className="mt-8 font-serif text-xl font-normal text-charcoal">Recent Rides</h2>
        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="text-muted-foreground">Loading recent rides...</p>
          ) : rides.length === 0 ? (
            <p className="text-muted-foreground">No recent rides found.</p>
          ) : (
            rides.map((ride) => (
              <Card key={ride.id} className="rounded-2xl border-cream-300 bg-white shadow-sm">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="font-sans text-xs text-muted-foreground">{ride.time}</p>
                    <p className="mt-1 font-sans text-sm font-bold text-charcoal">{ride.route}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-sans text-xs text-muted-foreground">
                      <StarIcon className="h-3.5 w-3.5 fill-terracotta-500 text-terracotta-500" /> {ride.rating}
                    </span>
                    <span className="font-sans text-sm font-bold text-sage-500">{ride.fare}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
