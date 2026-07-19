import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Navigation as NavigationIcon,
  MapPin as MapPinIcon,
  CircleCheck as CheckCircle2,
  AlertCircle,
  Play,
  Flag,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { rideService } from "../../services/ride.service";
import { locationService } from "../../services/location.service";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export const DriverNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const rideId = location.state?.rideId;
  const pickupAddress = location.state?.pickupAddress || "Pickup Location";
  const dropoffAddress = location.state?.dropoffAddress || "Dropoff Location";
  const pickupLat = location.state?.pickupLat;
  const pickupLng = location.state?.pickupLng;
  const dropoffLat = location.state?.dropoffLat;
  const dropoffLng = location.state?.dropoffLng;

  const [phase, setPhase] = useState<"pickup" | "in_progress" | "complete">(
    "pickup"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fareEarned, setFareEarned] = useState<number>(0);
  const locationIntervalRef = useRef<number | null>(null);

  // Redirect to dashboard if no rideId
  useEffect(() => {
    if (!rideId) {
      navigate("/driver");
    }
  }, [rideId, navigate]);

  // Send location updates every 5 seconds while ride is active
  useEffect(() => {
    if (phase === "complete") return;

    const sendLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              await locationService.updateLocation(
                pos.coords.latitude,
                pos.coords.longitude
              );
            } catch (e) {
              console.error("Location update failed:", e);
            }
          },
          (err) => console.error("Geolocation error:", err),
          { enableHighAccuracy: true }
        );
      }
    };

    // Send immediately
    sendLocation();

    // Then every 5 seconds
    locationIntervalRef.current = window.setInterval(sendLocation, 5000);

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, [phase]);

  const handleStartRide = async () => {
    if (!rideId) {
      setError("No active ride session found");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await rideService.startRide(rideId);
      setPhase("in_progress");
    } catch (err: any) {
      console.error("Failed to start ride:", err);
      setError(err.message || "Failed to start ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRide = async () => {
    if (!rideId) {
      setError("No active ride session found");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await rideService.completeRide(rideId);
      setFareEarned(response.fare || 0);
      setPhase("complete");
      // Stop location updates
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    } catch (err: any) {
      console.error("Failed to complete ride:", err);
      setError(err.message || "Failed to complete ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Completion screen
  if (phase === "complete") {
    return (
      <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-4 py-8 text-center animate-fade-up">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-serif text-2xl font-normal text-charcoal">
          Trip Complete!
        </h1>
        <p className="mt-2 font-sans text-lg font-bold text-sage-500">
          ₹{fareEarned} earned
        </p>
        <p className="mt-1 font-sans text-sm text-muted-foreground">
          Great job! The fare has been added to your earnings.
        </p>
        <Button
          onClick={() => navigate("/driver")}
          className="mt-6 rounded-2xl bg-black px-8 py-4 font-sans text-base font-bold text-white hover:bg-gray-800 h-auto"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Calculate map center and bounds
  const hasPickupCoords = pickupLat !== undefined && pickupLng !== undefined;
  const hasDropoffCoords = dropoffLat !== undefined && dropoffLng !== undefined;

  const mapCenter: [number, number] = hasPickupCoords
    ? [pickupLat, pickupLng]
    : [28.6139, 77.209]; // Default to Delhi center

  return (
    <div className="flex flex-col h-full w-full">
      <div className="shrink-0 mb-4">
        <h1 className="font-serif text-2xl font-normal text-charcoal">Active Ride Navigation</h1>
        <p className="font-sans text-sm text-muted-foreground mt-0.5">
          {phase === "pickup" ? "Heading to Rider pickup point" : "En route to dropoff destination"}
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600 shrink-0">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="font-sans text-sm flex-1">{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="text-red-600 hover:bg-red-100"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Split layout: Map on Left, Details/Actions on Right */}
      <div className="flex flex-col lg:flex-row gap-6 w-full lg:h-[calc(100vh-170px)] min-h-0">
        
        {/* Left Map */}
        <div className="w-full lg:w-1/2 h-[350px] lg:h-full relative overflow-hidden rounded-3xl border border-gray-200 shadow-sm z-0 shrink-0">
          <MapContainer
            key={`${mapCenter[0]}-${mapCenter[1]}`}
            center={mapCenter}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {hasPickupCoords && (
              <Marker position={[pickupLat, pickupLng]}>
                <Popup>
                  <strong>Pickup:</strong> {pickupAddress}
                </Popup>
              </Marker>
            )}
            {hasDropoffCoords && (
              <Marker position={[dropoffLat, dropoffLng]}>
                <Popup>
                  <strong>Dropoff:</strong> {dropoffAddress}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2 overflow-y-auto lg:pr-3 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {/* Status Card */}
            <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 font-sans text-xs font-bold ${
                    phase === "pickup"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {phase === "pickup" ? "Navigate to Pickup" : "In Progress"}
                </span>
                <span className="font-sans text-xs text-muted-foreground">
                  Session ID: #{rideId?.substring(0, 8)}
                </span>
              </div>
            </div>

            {/* Trip Addresses */}
            <div className="rounded-2xl bg-white p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div className="my-1.5 h-10 w-0.5 bg-cream-400" />
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Pickup Address
                    </p>
                    <p className="mt-0.5 font-sans text-sm font-bold text-charcoal">
                      {pickupAddress}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Destination Address
                    </p>
                    <p className="mt-0.5 font-sans text-sm font-bold text-charcoal">
                      {dropoffAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="shrink-0">
            {phase === "pickup" ? (
              <Button
                onClick={handleStartRide}
                disabled={loading}
                className="h-14 w-full rounded-xl bg-black text-white font-sans text-base font-bold shadow-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Starting Ride...
                  </span>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Start Trip (Rider Picked Up)
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleCompleteRide}
                disabled={loading}
                className="h-14 w-full rounded-xl bg-black text-white font-sans text-base font-bold shadow-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Completing Ride...
                  </span>
                ) : (
                  <>
                    <Flag className="h-5 w-5" />
                    Arrived at Destination — End Trip
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
export default DriverNavigation;
