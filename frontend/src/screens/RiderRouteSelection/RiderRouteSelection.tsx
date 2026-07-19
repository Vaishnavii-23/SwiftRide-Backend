import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Zap as ZapIcon, Shield as ShieldIcon, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { RideDetailCard, type RideData, type RoutePriority } from "../../components/RideDetailCard";
import { safetyService } from "../../services/safety.service";
import { rideService } from "../../services/ride.service";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";

export const RiderRouteSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const destName = location.state?.destination || "Dropoff Location";
  const pickupName = location.state?.pickup || "Pickup Location";

  const pickupLat = location.state?.pickupLat || 28.6139;
  const pickupLng = location.state?.pickupLng || 77.209;
  
  // Resolve dropoff coordinates
  const dropoffLat = location.state?.dropoffLat || (pickupLat + 0.015);
  const dropoffLng = location.state?.dropoffLng || (pickupLng + 0.015);

  const pickupPoint: [number, number] = [pickupLat, pickupLng];
  const dropoffPoint: [number, number] = [dropoffLat, dropoffLng];

  // Polyline paths for Safest (green) and Fastest (orange)
  const fastestPath: [number, number][] = [
    pickupPoint,
    [pickupPoint[0] + (dropoffPoint[0] - pickupPoint[0]) * 0.4 + 0.003, pickupPoint[1] + (dropoffPoint[1] - pickupPoint[1]) * 0.4 - 0.003],
    [pickupPoint[0] + (dropoffPoint[0] - pickupPoint[0]) * 0.7 + 0.002, pickupPoint[1] + (dropoffPoint[1] - pickupPoint[1]) * 0.7 - 0.002],
    dropoffPoint
  ];

  const safestPath: [number, number][] = [
    pickupPoint,
    [pickupPoint[0] + (dropoffPoint[0] - pickupPoint[0]) * 0.4 - 0.003, pickupPoint[1] + (dropoffPoint[1] - pickupPoint[1]) * 0.4 + 0.003],
    [pickupPoint[0] + (dropoffPoint[0] - pickupPoint[0]) * 0.7 - 0.002, pickupPoint[1] + (dropoffPoint[1] - pickupPoint[1]) * 0.7 + 0.002],
    dropoffPoint
  ];

  const [routeOptions, setRouteOptions] = useState<RideData[]>([]);
  const [priority, setPriority] = useState<RoutePriority>("safest");
  const [selected, setSelected] = useState("safest");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const res = await safetyService.getSafetyScore(pickupLat, pickupLng, dropoffLat, dropoffLng);
        const routeData = (res as any).data;
        if (!routeData || !routeData.fastestRoute || !routeData.safestRoute) {
          throw new Error("Invalid route options returned");
        }
        
        // Base fare ₹50 + per km + per minute.
        // Let's compute a realistic Indian Rupee fare breakdown
        const fastestDistance = routeData.fastestRoute.distance || 0;
        const fastestTime = parseInt(routeData.fastestRoute.estimatedTime) || 15;
        const fastestFare = Math.round(50 + fastestDistance * 12 + fastestTime * 2);

        const safestDistance = routeData.safestRoute.distance || 0;
        const safestTime = parseInt(routeData.safestRoute.estimatedTime) || 20;
        const safestFare = Math.round(50 + safestDistance * 12 + safestTime * 2 + 10); // Safest safety premium

        const fastestRide: RideData = {
          id: "fastest",
          pickup: pickupName,
          destination: destName,
          route: routeData.fastestRoute.description || "Express Highway",
          duration: `${fastestTime} min`,
          distance: `${fastestDistance} km`,
          price: `₹${fastestFare}`,
          safetyScore: Math.round((routeData.fastestRoute.safetyScore || 5) * 10),
          priority: "fastest"
        };

        const safestRide: RideData = {
          id: "safest",
          pickup: pickupName,
          destination: destName,
          route: routeData.safestRoute.description || "Well-Lit Boulevard",
          duration: `${safestTime} min`,
          distance: `${safestDistance} km`,
          price: `₹${safestFare}`,
          safetyScore: Math.round((routeData.safestRoute.safetyScore || 5) * 10),
          priority: "safest"
        };

        setRouteOptions([fastestRide, safestRide]);
      } catch (err: any) {
        console.error("Failed to load routes:", err);
        setError("Failed to calculate route safety scores. Showing standard routes.");
        
        // Fallback options in INR
        setRouteOptions([
          {
            id: "fastest",
            pickup: pickupName,
            destination: destName,
            route: "Express Highway",
            duration: "18 min",
            distance: "12.4 km",
            price: "₹180",
            safetyScore: 75,
            priority: "fastest"
          },
          {
            id: "safest",
            pickup: pickupName,
            destination: destName,
            route: "Well-Lit Boulevard",
            duration: "26 min",
            distance: "14.8 km",
            price: "₹210",
            safetyScore: 95,
            priority: "safest"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [pickupLat, pickupLng, dropoffLat, dropoffLng, pickupName, destName]);

  const sorted = useMemo(() => {
    return [...routeOptions].sort((a, b) => {
      if (priority === "fastest") {
        return a.priority === "fastest" ? -1 : 1;
      } else {
        return b.safetyScore - a.safetyScore;
      }
    });
  }, [priority, routeOptions]);

  const handleConfirm = async () => {
    setBooking(true);
    setError("");
    try {
      const response = await rideService.requestRide({
        pickupLat,
        pickupLng,
        dropoffLat,
        dropoffLng,
        pickupAddress: pickupName,
        dropoffAddress: destName,
        routeType: selected === "fastest" ? "FASTEST" : "SAFEST"
      });
      
      navigate("/rider/matching", { 
        state: { 
          destination: destName,
          rideId: response.id,
          pickupAddress: pickupName,
          pickupLat,
          pickupLng,
          dropoffLat,
          dropoffLng
        } 
      });
    } catch (err: any) {
      setError(err.message || "Failed to book ride. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="shrink-0 mb-4">
        <button
          onClick={() => navigate("/rider")}
          className="flex items-center gap-2 font-sans text-sm font-bold text-muted-foreground hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="font-serif text-2xl font-normal text-charcoal mt-2">Choose Your Route</h1>
        <p className="font-sans text-sm text-muted-foreground mt-0.5">
          {pickupName.split(',')[0]} to {destName.split(',')[0]} · {loading ? "Finding options..." : `${routeOptions.length} routes calculated`}
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-red-600 border border-red-200 shrink-0">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="font-sans text-xs">{error}</span>
        </div>
      )}

      {/* Split Layout: Left Map, Right Route Cards */}
      <div className="flex flex-col lg:flex-row gap-6 w-full lg:h-[calc(100vh-190px)] min-h-0">
        
        {/* Left Side: Leaflet Map */}
        <div className="w-full lg:w-1/2 h-[350px] lg:h-full relative overflow-hidden rounded-3xl border border-gray-200 shadow-sm z-0 shrink-0">
          <MapContainer 
            key={`${pickupLat}-${pickupLng}`}
            center={pickupPoint} 
            zoom={13} 
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <Marker position={pickupPoint}><Popup>Pickup: {pickupName}</Popup></Marker>
            <Marker position={dropoffPoint}><Popup>Dropoff: {destName}</Popup></Marker>
            
            {!loading && (
              <>
                {/* Fastest Path */}
                <Polyline 
                  positions={fastestPath} 
                  pathOptions={{ 
                    color: '#c66a3a', 
                    weight: selected === 'fastest' ? 7 : 3, 
                    opacity: selected === 'fastest' ? 1 : 0.4 
                  }} 
                />
                {/* Safest Path */}
                <Polyline 
                  positions={safestPath} 
                  pathOptions={{ 
                    color: '#4a7c59', 
                    weight: selected === 'safest' ? 7 : 3, 
                    opacity: selected === 'safest' ? 1 : 0.4 
                  }} 
                />
              </>
            )}
          </MapContainer>
        </div>

        {/* Right Side: Route options selection */}
        <div className="w-full lg:w-1/2 overflow-y-auto lg:pr-3 flex flex-col gap-5 justify-between">
          
          <div className="space-y-4">
            {/* Priority selection tabs */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setPriority("fastest"); setSelected("fastest"); }}
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 transition-all duration-200 ${
                  selected === "fastest"
                    ? "border-black bg-black text-white"
                    : "border-cream-400 bg-white text-charcoal hover:bg-cream-200"
                }`}
              >
                <ZapIcon className="h-5 w-5 animate-pulse" />
                <span className="font-sans text-sm font-bold">Fastest</span>
              </button>
              <button
                onClick={() => { setPriority("safest"); setSelected("safest"); }}
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 transition-all duration-200 ${
                  selected === "safest"
                    ? "border-black bg-black text-white"
                    : "border-cream-400 bg-white text-charcoal hover:bg-cream-200"
                }`}
              >
                <ShieldIcon className="h-5 w-5 text-green-500" />
                <span className="font-sans text-sm font-bold">Safest</span>
              </button>
            </div>

            {/* Render selected details cards */}
            <div className="space-y-3">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-28 w-full rounded-2xl bg-cream-200 animate-pulse" />
                  <div className="h-28 w-full rounded-2xl bg-cream-200 animate-pulse" />
                </div>
              ) : (
                sorted.map((route) => (
                  <div
                    key={route.id}
                    className={`transition-all duration-200 rounded-2xl border p-4 ${
                      route.id === selected 
                        ? "border-black bg-white shadow-sm ring-1 ring-black"
                        : "border-gray-200 bg-white/70 hover:bg-cream-200 hover:border-cream-400"
                    }`}
                  >
                    <RideDetailCard
                      ride={route}
                      selected={route.id === selected}
                      onClick={() => setSelected(route.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <Button
            onClick={handleConfirm}
            disabled={booking || loading}
            className="h-12 w-full rounded-xl bg-black text-white font-sans text-base font-bold shadow-lg hover:bg-gray-800 disabled:opacity-50 mt-4 shrink-0 flex items-center justify-center"
          >
            {booking ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Requesting ride...
              </span>
            ) : (
              <>
                Confirm & Find Driver
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
};
export default RiderRouteSelection;
