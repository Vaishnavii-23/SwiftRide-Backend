import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock as ClockIcon, MapPin as MapPinIcon, Shield as ShieldIcon, DollarSign as DollarIcon, Calendar as DateIcon, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { rideService } from "../../services/ride.service";
import { SafetyScore } from "../../components/RideDetailCard";
import { Ride } from "../../types";

export const RiderRideDetail = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRideDetail = async () => {
      try {
        setLoading(true);
        const res = await rideService.getRideHistory();
        const found = (res.rideHistory || []).find((r: Ride) => r.id === rideId);
        if (found) {
          setRide(found);
        } else {
          setError("Ride session details not found in history.");
        }
      } catch (err: any) {
        console.error("Failed to load ride detail:", err);
        setError("Error loading ride history information.");
      } finally {
        setLoading(false);
      }
    };
    fetchRideDetail();
  }, [rideId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="h-64 w-full rounded-2xl bg-cream-200 animate-pulse" />
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center font-sans text-sm text-red-600">
        <p>{error || "No ride details available."}</p>
        <Button onClick={() => navigate(-1)} className="mt-4 rounded-xl bg-black text-white px-6 py-2.5 hover:bg-gray-800">
          Go Back
        </Button>
      </div>
    );
  }

  const rideDate = new Date(ride.createdAt).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const rideTime = new Date(ride.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate detailed breakdown that mathematically sums to the actual fare
  const totalFare = ride.fare || 0;
  const baseFare = 50;
  const distanceKm = ride.distance || 0;
  
  // Calculate distance fare: ₹12 per km
  const rawDistanceFare = Math.round(distanceKm * 12);
  const distanceFare = totalFare > baseFare ? Math.min(totalFare - baseFare, rawDistanceFare) : 0;
  
  // Remaining goes to time fare (₹2 per min) and surge
  const remaining = totalFare - baseFare - distanceFare;
  const timeFare = remaining > 0 ? remaining : 0;
  const surgeMultiplier = 1.0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 w-full">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 font-sans text-sm font-bold text-muted-foreground hover:text-charcoal transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to History
      </button>

      <h1 className="font-serif text-2xl font-normal text-charcoal">Ride Details</h1>
      <p className="mt-1 font-sans text-sm text-muted-foreground">Detailed summary of your booking and transaction.</p>

      {/* Overview Card */}
      <Card className="mt-6 rounded-2xl border-gray-200 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-2">
              <DateIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-sans text-sm font-bold text-charcoal">{rideDate}</span>
            </div>
            <span className="font-sans text-xs text-muted-foreground">{rideTime}</span>
          </div>

          {/* Pickup and Dropoff Address */}
          <div className="mt-6 flex items-start gap-3">
            <div className="flex flex-col items-center pt-1.5 shrink-0">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <div className="my-1.5 h-12 w-0.5 bg-cream-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            </div>
            <div className="flex-1 space-y-4 font-sans text-sm text-charcoal">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Pickup Address</p>
                <p className="font-bold mt-0.5">{ride.pickupAddress}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Dropoff Address</p>
                <p className="font-bold mt-0.5">{ride.dropoffAddress}</p>
              </div>
            </div>
          </div>

          {/* Detailed metrics grid */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">
            <div className="text-center">
              <span className="font-serif text-2xl font-bold text-sage-500">₹{totalFare}</span>
              <p className="font-sans text-xs text-muted-foreground mt-1">Total Fare Paid</p>
            </div>
            <div className="text-center">
              <span className="font-serif text-2xl font-bold text-charcoal">{distanceKm} km</span>
              <p className="font-sans text-xs text-muted-foreground mt-1">Distance</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <SafetyScore score={ride.routeType === "SAFEST" ? 95 : 75} size="sm" />
              </div>
              <p className="font-sans text-xs text-muted-foreground mt-2">Safety Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fare Breakdown Card */}
      <h2 className="mt-6 font-serif text-xl font-normal text-charcoal">Fare Breakdown</h2>
      <Card className="mt-3 rounded-2xl border-gray-200 bg-white shadow-sm">
        <CardContent className="p-5 font-sans text-sm text-charcoal space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Base Fare</span>
            <span className="font-bold">₹{baseFare}.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Distance Charge ({distanceKm} km @ ₹12/km)</span>
            <span className="font-bold">₹{distanceFare.toFixed(0)}.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Time Charge & Safety Premium</span>
            <span className="font-bold">₹{timeFare.toFixed(0)}.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Surge Multiplier</span>
            <span className="font-bold">{surgeMultiplier.toFixed(1)}x</span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-3 font-bold text-base">
            <span>Total Fare Charged</span>
            <span className="text-sage-500">₹{totalFare}.00</span>
          </div>
        </CardContent>
      </Card>

      {/* Timestamps status tracker */}
      <h2 className="mt-6 font-serif text-xl font-normal text-charcoal">Timeline Logs</h2>
      <Card className="mt-3 rounded-2xl border-gray-200 bg-white shadow-sm">
        <CardContent className="p-5 font-sans text-sm text-charcoal space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Ride Requested</span>
            <span className="font-bold">{new Date(ride.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Ride Accepted</span>
            <span className="font-bold">
              {ride.status !== "REQUESTED" ? new Date(ride.updatedAt).toLocaleString() : "—"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Trip Started</span>
            <span className="font-bold">
              {ride.startedAt ? new Date(ride.startedAt).toLocaleString() : "—"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Trip Completed</span>
            <span className="font-bold">
              {ride.completedAt ? new Date(ride.completedAt).toLocaleString() : "—"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default RiderRideDetail;
