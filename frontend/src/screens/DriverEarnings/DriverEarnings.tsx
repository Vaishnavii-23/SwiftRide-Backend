import { useEffect, useState, useCallback } from "react";
import {
  DollarSign as DollarSignIcon,
  Car as CarIcon,
  TrendingUp as TrendingUpIcon,
  AlertCircle,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { StatCard } from "../../components/RideDetailCard";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { rideService } from "../../services/ride.service";
import { Ride } from "../../types";

interface DailyBreakdown {
  date: string;
  displayDate: string;
  rides: Ride[];
  totalFare: number;
}

export const DriverEarnings = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEarnings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await rideService.getRideHistory();
      const allRides = res.rideHistory || [];
      setRides(allRides);
    } catch (err: any) {
      console.error("Failed to fetch ride history:", err);
      setError(err.message || "Failed to load earnings data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  // Filter completed rides
  const completedRides = rides.filter((r) => r.status === "COMPLETED");

  // Total earnings
  const totalEarnings = completedRides.reduce(
    (sum, r) => sum + (r.fare || 0),
    0
  );
  const rideCount = completedRides.length;
  const avgFare = rideCount > 0 ? totalEarnings / rideCount : 0;

  // Today's earnings
  const todayStr = new Date().toDateString();
  const todayRides = completedRides.filter(
    (r) => new Date(r.createdAt).toDateString() === todayStr
  );
  const todayEarnings = todayRides.reduce(
    (sum, r) => sum + (r.fare || 0),
    0
  );

  // Group rides by date (daily breakdown)
  const dailyBreakdown: DailyBreakdown[] = (() => {
    const groups: Record<string, Ride[]> = {};
    completedRides.forEach((ride) => {
      const dateKey = new Date(ride.createdAt).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(ride);
    });

    return Object.entries(groups)
      .map(([dateKey, dayRides]) => ({
        date: dateKey,
        displayDate: new Date(dateKey).toLocaleDateString("en-IN", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        rides: dayRides,
        totalFare: dayRides.reduce((sum, r) => sum + (r.fare || 0), 0),
      }))
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  })();

  // Bar chart data from daily breakdown (last 7 days)
  const chartData = dailyBreakdown.slice(0, 7).reverse();
  const maxEarning = Math.max(
    ...chartData.map((d) => d.totalFare),
    1 // avoid division by 0
  );

  if (loading) {
    return (
      <div className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-48 rounded bg-cream-200 animate-pulse" />
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-cream-200 animate-pulse"
              />
            ))}
          </div>
          <div className="mt-6 h-64 rounded-2xl bg-cream-200 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-normal text-charcoal">
              Earnings Dashboard
            </h1>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              Track your daily and overall performance.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchEarnings}
            className="text-muted-foreground hover:text-charcoal"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-sans text-sm flex-1">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchEarnings}
              className="text-red-600 hover:bg-red-100"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Earnings"
            value={`₹${totalEarnings.toFixed(0)}`}
            icon={DollarSignIcon}
            accent="sage"
            sublabel={`${rideCount} trips`}
          />
          <StatCard
            label="Today"
            value={`₹${todayEarnings.toFixed(0)}`}
            icon={TrendingUpIcon}
            accent="terracotta"
            sublabel={`${todayRides.length} trips`}
          />
          <StatCard
            label="Avg / Trip"
            value={`₹${avgFare.toFixed(0)}`}
            icon={CarIcon}
            accent="charcoal"
          />
          <StatCard
            label="Total Rides"
            value={rideCount.toString()}
            icon={CarIcon}
            accent="sage"
          />
        </div>

        {/* Bar chart */}
        {chartData.length > 0 && (
          <Card className="mt-6 rounded-2xl border-gray-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-sans text-sm font-bold text-charcoal">
                Recent Daily Earnings
              </h3>
              <div
                className="mt-6 flex items-end justify-between gap-2"
                style={{ height: "200px" }}
              >
                {chartData.map((d, i) => (
                  <div
                    key={d.date}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <span className="font-sans text-xs font-bold text-muted-foreground">
                      ₹{d.totalFare}
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-black transition-all duration-500 animate-fade-up"
                      style={{
                        height: `${(d.totalFare / maxEarning) * 140}px`,
                        animationDelay: `${i * 0.08}s`,
                        minHeight: d.totalFare > 0 ? "8px" : "2px",
                      }}
                    />
                    <span className="font-sans text-xs text-muted-foreground">
                      {new Date(d.date).toLocaleDateString("en-IN", {
                        weekday: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily breakdown */}
        <h2 className="mt-8 font-serif text-xl font-normal text-charcoal flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          Daily Breakdown
        </h2>

        {dailyBreakdown.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-white p-8 text-center">
            <CarIcon className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 font-sans text-sm text-muted-foreground">
              No completed rides yet. Start driving to see your earnings!
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {dailyBreakdown.map((day) => (
              <Card
                key={day.date}
                className="rounded-2xl border-gray-200 bg-white shadow-sm"
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-sans text-sm font-bold text-charcoal">
                      {day.displayDate}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="font-sans text-xs text-muted-foreground">
                        {day.rides.length} trip
                        {day.rides.length !== 1 ? "s" : ""}
                      </span>
                      <span className="font-sans text-lg font-bold text-sage-500">
                        ₹{day.totalFare.toFixed(0)}
                      </span>
                    </div>
                  </div>
                  {/* Individual rides for this day */}
                  <div className="space-y-2 border-t border-gray-200 pt-3">
                    {day.rides.map((ride) => (
                      <div
                        key={ride.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-sm text-charcoal truncate">
                            {ride.pickupAddress?.split(",")[0] || "Pickup"} →{" "}
                            {ride.dropoffAddress?.split(",")[0] || "Dropoff"}
                          </p>
                          <p className="font-sans text-xs text-muted-foreground">
                            {new Date(ride.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {ride.distance
                              ? ` · ${ride.distance} km`
                              : ""}
                          </p>
                        </div>
                        <span className="font-sans text-sm font-bold text-charcoal shrink-0 ml-3">
                          ₹{ride.fare || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default DriverEarnings;
