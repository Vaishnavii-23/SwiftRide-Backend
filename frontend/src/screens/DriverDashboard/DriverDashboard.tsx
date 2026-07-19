import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign as DollarSignIcon,
  Car as CarIcon,
  Clock as ClockIcon,
  Star as StarIcon,
  Power as PowerIcon,
  AlertCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle,
} from "lucide-react";
import { StatCard } from "../../components/RideDetailCard";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { locationService } from "../../services/location.service";
import { rideService } from "../../services/ride.service";
import { authService } from "../../services/auth.service";
import { getAccessToken } from "../../lib/api";
import { Ride } from "../../types";

export const DriverDashboard = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(() => localStorage.getItem("isOnline") === "true");
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [driverRating, setDriverRating] = useState<string>("—");

  const locationUpdateInterval = useRef<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const wsReconnectRef = useRef<number | null>(null);

  const fetchDriverData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [historyRes, meRes] = await Promise.allSettled([
        rideService.getRideHistory(),
        authService.getMe(),
      ]);

      if (historyRes.status === "fulfilled") {
        const history = historyRes.value.rideHistory || [];
        setRides(history);
      } else {
        console.error("Failed to fetch ride history:", historyRes.reason);
      }

      if (meRes.status === "fulfilled") {
        setDriverRating("4.9");
      } else {
        console.error("Failed to fetch user profile:", meRes.reason);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDriverData();
    if (isOnline) {
      connectWebSocket();
      startLocationTracking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startLocationTracking = () => {
    if (navigator.geolocation) {
      locationUpdateInterval.current = window.setInterval(async () => {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              await locationService.updateLocation(
                pos.coords.latitude,
                pos.coords.longitude
              );
            } catch (e) {
              console.error("Periodic location update failed:", e);
            }
          },
          (err) => console.error("Geolocation error:", err),
          { enableHighAccuracy: true }
        );
      }, 8000);
    }
  };

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
    }

    const ws = new WebSocket("ws://localhost:3000");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Driver WS connected");
      const token = getAccessToken();
      if (token) {
        ws.send(JSON.stringify({ type: "auth", token }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Driver WS message:", data);

        if (data.type === "ride_request" && data.rideId) {
          navigate("/driver/request", {
            state: {
              rideId: data.rideId,
              pickupAddress: data.pickupAddress || "Pickup Location",
              dropoffAddress: data.dropoffAddress || "Dropoff Location",
              pickupLat: data.pickupLat,
              pickupLng: data.pickupLng,
              dropoffLat: data.dropoffLat,
              dropoffLng: data.dropoffLng,
            },
          });
        }
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };

    ws.onclose = () => {
      console.log("Driver WS closed");
      wsReconnectRef.current = window.setTimeout(() => {
        if (localStorage.getItem("isOnline") === "true") {
          connectWebSocket();
        }
      }, 3000);
    };

    ws.onerror = (err) => {
      console.error("Driver WS error:", err);
    };
  }, [navigate]);

  const disconnectWebSocket = useCallback(() => {
    if (wsReconnectRef.current) {
      clearTimeout(wsReconnectRef.current);
      wsReconnectRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnectWebSocket();
      if (locationUpdateInterval.current) {
        clearInterval(locationUpdateInterval.current);
      }
    };
  }, [disconnectWebSocket]);

  const handleToggleStatus = async () => {
    setError(null);
    setTogglingStatus(true);
    try {
      if (isOnline) {
        await locationService.goOffline();
        setIsOnline(false);
        localStorage.setItem("isOnline", "false");
        disconnectWebSocket();
        if (locationUpdateInterval.current) {
          clearInterval(locationUpdateInterval.current);
          locationUpdateInterval.current = null;
        }
      } else {
        await locationService.goOnline();
        setIsOnline(true);
        localStorage.setItem("isOnline", "true");
        startLocationTracking();
        connectWebSocket();
      }
    } catch (err: any) {
      console.error("Failed to toggle online status:", err);
      setError(
        err.message || "Could not update status. Please complete KYC first."
      );
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleCheckPending = async () => {
    try {
      const res = await rideService.getRideHistory();
      const history = res.rideHistory || [];
      const pendingRide = history.find((r: Ride) => r.status === "REQUESTED");
      if (pendingRide) {
        navigate("/driver/request", {
          state: {
            rideId: pendingRide.id,
            pickupAddress: pendingRide.pickupAddress || "Pickup Location",
            dropoffAddress: pendingRide.dropoffAddress || "Dropoff Location",
            pickupLat: (pendingRide as any).pickupLat,
            pickupLng: (pendingRide as any).pickupLng,
            dropoffLat: (pendingRide as any).dropoffLat,
            dropoffLng: (pendingRide as any).dropoffLng,
          },
        });
      } else {
        setError("No pending ride requests found at this time.");
        setTimeout(() => setError(null), 3000);
      }
    } catch (e: any) {
      setError("Failed to check for pending rides.");
    }
  };

  const completedRides = rides.filter((r) => r.status === "COMPLETED");
  const totalEarnings = completedRides.reduce(
    (sum, ride) => sum + (ride.fare || 0),
    0
  );
  const todayStr = new Date().toDateString();
  const todayRides = completedRides.filter(
    (r) => new Date(r.createdAt).toDateString() === todayStr
  );
  const todayEarnings = todayRides.reduce(
    (sum, ride) => sum + (ride.fare || 0),
    0
  );

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3.5 text-red-600 border border-red-200">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-sans text-sm flex-1">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="text-red-600 hover:bg-red-100 font-bold"
            >
              Dismiss
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${
                isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <div>
              <h1 className="font-sans text-3xl font-bold text-black">
                Driver Dashboard
              </h1>
              <p className="mt-1 font-sans text-sm text-gray-500 flex items-center gap-1.5">
                {isOnline ? (
                  <>
                    <Wifi className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-600 font-bold">Online</span> —
                    ready to accept rides
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3.5 w-3.5 text-red-500" />
                    <span className="text-red-500 font-bold">Offline</span> —
                    you won't receive ride requests
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {isOnline && (
                <Button onClick={handleCheckPending} variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Check Pending
                </Button>
            )}
            <Button
              onClick={handleToggleStatus}
              disabled={togglingStatus}
              className={`rounded-lg px-6 py-3 font-sans text-sm font-bold transition-all ${
                isOnline
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-black text-white hover:bg-gray-800"
              } disabled:opacity-50 h-auto`}
            >
              <PowerIcon className="h-4 w-4 mr-2" />
              {togglingStatus
                ? "Updating..."
                : isOnline
                ? "Go Offline"
                : "Go Online"}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Earnings"
            value={`₹${totalEarnings.toFixed(0)}`}
            icon={DollarSignIcon}
            accent="sage"
            sublabel={`${completedRides.length} completed trips`}
          />
          <StatCard
            label="Today"
            value={`₹${todayEarnings.toFixed(0)}`}
            icon={CarIcon}
            accent="terracotta"
            sublabel={`${todayRides.length} trips`}
          />
          <StatCard
            label="Status"
            value={isOnline ? "Online" : "Offline"}
            icon={ClockIcon}
            accent="charcoal"
          />
          <StatCard
            label="Rating"
            value={driverRating}
            icon={StarIcon}
            accent="sage"
          />
        </div>

        {/* Incoming request prompt */}
        {isOnline && (
          <Card className="mt-6 rounded-lg border-green-500/20 bg-green-50/50 shadow-sm animate-fade-up">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/20" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                    <CarIcon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <p className="font-sans text-base font-bold text-black">
                    Waiting for Ride Requests...
                  </p>
                  <p className="font-sans text-sm text-gray-500">
                    You'll be auto-redirected when a ride comes in
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCheckPending}
                className="rounded-lg bg-green-600 text-white hover:bg-green-700 font-sans text-sm font-bold px-4 py-2.5 h-auto shrink-0"
              >
                <CarIcon className="h-4 w-4 mr-1.5" />
                Accept Ride
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recent rides */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="font-sans text-xl font-bold text-black">
            Recent Rides
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchDriverData}
            disabled={loading}
            className="text-gray-500 hover:text-black"
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 w-full rounded-lg bg-gray-50 animate-pulse border border-gray-200"
                />
              ))}
            </div>
          ) : rides.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-8 text-center border border-gray-200">
              <CarIcon className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-3 font-sans text-sm text-gray-500">
                No rides yet. Go online to start accepting ride requests!
              </p>
            </div>
          ) : (
            rides.slice(0, 10).map((ride) => (
              <Card
                key={ride.id}
                className="rounded-lg border-gray-200 bg-white shadow-sm"
              >
                <CardContent className="flex items-center justify-between p-5">
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-xs text-gray-500">
                      {new Date(ride.createdAt).toLocaleString("en-IN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="mt-1.5 font-sans text-sm font-bold text-black truncate">
                      {ride.pickupAddress?.split(",")[0] || "Pickup"} →{" "}
                      {ride.dropoffAddress?.split(",")[0] || "Dropoff"}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span
                        className={`inline-block rounded-lg px-2.5 py-0.5 font-sans text-xs font-bold ${
                          ride.status === "COMPLETED"
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : ride.status === "CANCELLED"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : ride.status === "IN_PROGRESS"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                        }`}
                      >
                        {ride.status}
                      </span>
                      {ride.distance && (
                        <span className="font-sans text-xs text-gray-500">
                          {ride.distance} km
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-sans text-lg font-bold text-black shrink-0 ml-4">
                    ₹{ride.fare || 0}
                  </span>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default DriverDashboard;
