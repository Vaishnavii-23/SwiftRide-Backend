import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Zap as ZapIcon, Shield as ShieldIcon, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { RideDetailCard, type RideData, type RoutePriority } from "../../components/RideDetailCard";
import { fetchApi } from "../../lib/api";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";

// Hardcoded coordinates for the demonstration of 3 distinct routes
const pickupPoint: [number, number] = [40.7128, -74.0060]; // e.g. City Center
const dropoffPoint: [number, number] = [40.7300, -73.9900]; // e.g. Destination

// Polyline paths for Red, Green, Orange
const routeA_Red: [number, number][] = [pickupPoint, [40.715, -74.005], [40.720, -73.995], dropoffPoint]; // Fastest, least safe
const routeB_Green: [number, number][] = [pickupPoint, [40.710, -74.000], [40.725, -73.980], dropoffPoint]; // Safest, longest
const routeC_Orange: [number, number][] = [pickupPoint, [40.718, -74.002], [40.722, -73.988], dropoffPoint]; // Balanced

const routes: RideData[] = [
  {
    id: "route-a",
    pickup: "Current Location",
    destination: "Riverside Park", // Will be overridden by state
    route: "Express Highway",
    duration: "18 min",
    distance: "12.4 km",
    price: "$24.50",
    safetyScore: 45, // Map 4.5/10 to 45% for the card, or adjust card to show /10
    priority: "fastest",
  },
  {
    id: "route-b",
    pickup: "Current Location",
    destination: "Riverside Park",
    route: "Well-Lit Boulevard",
    duration: "26 min",
    distance: "14.8 km",
    price: "$28.00",
    safetyScore: 95, // 9.5/10
    priority: "safest",
  },
  {
    id: "route-c",
    pickup: "Current Location",
    destination: "Riverside Park",
    route: "City Center Loop",
    duration: "22 min",
    distance: "13.1 km",
    price: "$26.00",
    safetyScore: 72, // 7.2/10
    priority: "fastest", // Just generic fallback
  },
];

export const RiderRouteSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const destName = location.state?.destination || "Riverside Park";
  const pickupName = location.state?.pickup || "Current Location";

  const [priority, setPriority] = useState<RoutePriority>("safest");
  const [selected, setSelected] = useState("route-b");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sorted = useMemo(() => {
    // Override destinations with the one from previous screen
    const mappedRoutes = routes.map(r => ({ ...r, pickup: pickupName, destination: destName }));
    return priority === "fastest"
      ? mappedRoutes.sort((a, b) => a.duration.localeCompare(b.duration))
      : mappedRoutes.sort((a, b) => b.safetyScore - a.safetyScore);
  }, [priority, destName]);

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    const selectedRoute = routes.find(r => r.id === selected);
    
    try {
      await fetchApi('/ride/request', {
        method: 'POST',
        body: JSON.stringify({
          pickupLat: pickupPoint[0],
          pickupLng: pickupPoint[1],
          dropoffLat: dropoffPoint[0],
          dropoffLng: dropoffPoint[1],
          pickupAddress: pickupName,
          dropoffAddress: destName,
          routeType: priority === "fastest" ? "FASTEST" : "SAFEST"
        })
      });
      // Route to matching screen after successful booking
      navigate("/rider/matching", { state: { destination: destName } });
    } catch (err: any) {
      setError(err.message || "Failed to book ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={() => navigate("/rider")}
        className="mb-4 flex items-center gap-2 font-sans text-sm font-bold text-muted-foreground hover:text-charcoal"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="font-serif text-2xl font-normal text-charcoal">Choose Your Route</h1>
      <p className="mt-1 font-sans text-sm text-muted-foreground">
        {pickupName} to {destName} · 3 options available
      </p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="font-sans text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-5">
        {/* Left Side: Map showing 3 routes */}
        <div className="relative h-80 md:h-[500px] w-full overflow-hidden rounded-3xl shadow-sm z-0">
          <MapContainer center={pickupPoint} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={pickupPoint}><Popup>Pickup</Popup></Marker>
            <Marker position={dropoffPoint}><Popup>Dropoff</Popup></Marker>
            
            {/* Red Route: Fastest, least safe */}
            <Polyline 
              positions={routeA_Red} 
              pathOptions={{ color: 'red', weight: selected === 'route-a' ? 8 : 4, opacity: selected === 'route-a' ? 1 : 0.5 }} 
            />
            {/* Green Route: Safest */}
            <Polyline 
              positions={routeB_Green} 
              pathOptions={{ color: 'green', weight: selected === 'route-b' ? 8 : 4, opacity: selected === 'route-b' ? 1 : 0.5 }} 
            />
            {/* Orange Route: Balanced */}
            <Polyline 
              positions={routeC_Orange} 
              pathOptions={{ color: 'orange', weight: selected === 'route-c' ? 8 : 4, opacity: selected === 'route-c' ? 1 : 0.5 }} 
            />
          </MapContainer>
        </div>

        {/* Right Side: Options */}
        <div className="flex flex-col">
          {/* Priority toggle */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              onClick={() => { setPriority("fastest"); setSelected("route-a"); }}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 transition-colors tap-scale ${
                priority === "fastest"
                  ? "border-sage-500 bg-sage-500 text-white"
                  : "border-cream-400 bg-white text-charcoal hover:border-sage-500/40"
              }`}
            >
              <ZapIcon className="h-5 w-5" />
              <span className="font-sans text-sm font-bold">Fastest</span>
            </button>
            <button
              onClick={() => { setPriority("safest"); setSelected("route-b"); }}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 transition-colors tap-scale ${
                priority === "safest"
                  ? "border-terracotta-600 bg-terracotta-600 text-white"
                  : "border-cream-400 bg-white text-charcoal hover:border-terracotta-600/40"
              }`}
            >
              <ShieldIcon className="h-5 w-5" />
              <span className="font-sans text-sm font-bold">Safest</span>
            </button>
          </div>

          {/* Route cards */}
          <div className="space-y-3 flex-1 overflow-y-auto">
            {sorted.map((route) => (
              <RideDetailCard
                key={route.id}
                ride={route}
                selected={route.id === selected}
                onClick={() => setSelected(route.id)}
              />
            ))}
          </div>

          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="mt-5 h-auto w-full rounded-2xl bg-sage-500 py-4 font-sans text-base font-bold text-white shadow-lg hover:bg-sage-600 disabled:opacity-50"
          >
            {loading ? "Booking..." : "Confirm & Find Driver"}
            {!loading && <ArrowRight className="h-5 w-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
