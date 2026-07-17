import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Car as CarIcon, Phone as PhoneIcon, MessageSquare as MessageSquareIcon, Shield as ShieldIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { SafetyScore } from "../../components/RideDetailCard";
import { fetchApi } from "../../lib/api";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

const pickupPoint: [number, number] = [40.7128, -74.0060];
const dropoffPoint: [number, number] = [40.7300, -73.9900];

export const RiderRideInProgress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const destName = location.state?.destination || "Riverside Park";

  const [eta, setEta] = useState(18);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => (prev > 0 ? prev - 1 : 0));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleEndRide = async () => {
    // In a real app, the driver ends the ride or there is a specific flow.
    // For now we will mock completing the ride if the user clicks it
    navigate("/rider/complete");
  };

  return (
    <div className="w-full">
      <h1 className="font-serif text-2xl font-normal text-charcoal mb-4">Ride In Progress</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Map using Leaflet */}
        <div className="relative h-64 md:h-[600px] w-full overflow-hidden rounded-3xl shadow-sm z-0">
          <MapContainer center={pickupPoint} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {/* Active route polyline */}
            <Polyline positions={[pickupPoint, dropoffPoint]} pathOptions={{ color: '#4a7c59', weight: 6 }} />
            <Marker position={pickupPoint}><Popup>Starting Point</Popup></Marker>
            <Marker position={dropoffPoint}><Popup>Destination</Popup></Marker>
          </MapContainer>
        </div>

        <div className="flex flex-col gap-4">
          {/* ETA */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-wider text-terracotta-600">Arriving in</p>
                <p className="mt-1 font-serif text-3xl font-normal text-charcoal">{eta} min</p>
              </div>
              <SafetyScore score={94} size="lg" />
            </div>
          </div>

          {/* Route info */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center pt-1">
                <div className="h-3 w-3 rounded-full bg-sage-500" />
                <div className="my-1 h-8 w-0.5 bg-cream-400" />
                <div className="h-3 w-3 rounded-full bg-terracotta-500" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="font-sans text-xs text-muted-foreground">From</p>
                  <p className="font-sans text-sm font-bold text-charcoal">Current Location</p>
                </div>
                <div>
                  <p className="font-sans text-xs text-muted-foreground">To</p>
                  <p className="font-sans text-sm font-bold text-charcoal">{destName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Driver info */}
          <div className="rounded-2xl bg-white p-5 shadow-sm flex-1">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-charcoal text-lg font-bold text-white">
                JB
              </div>
              <div className="flex-1">
                <p className="font-sans text-base font-bold text-charcoal">Jordan Blake</p>
                <p className="font-sans text-sm text-muted-foreground">Silver Toyota Camry · 7XK-4291</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl border-cream-400 py-3 text-sage-500 hover:bg-cream-200">
                <PhoneIcon className="h-4 w-4" /> Call
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl border-cream-400 py-3 text-sage-500 hover:bg-cream-200">
                <MessageSquareIcon className="h-4 w-4" /> Message
              </Button>
            </div>
          </div>

          {/* Safety actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-2xl border-sage-500/30 bg-sage-500/5 py-3 font-sans text-sm font-bold text-sage-500 hover:bg-sage-500/10"
            >
              <ShieldIcon className="h-4 w-4" /> Share Trip
            </Button>
            <Button
              onClick={handleEndRide}
              className="flex-1 rounded-2xl bg-terracotta-600 py-3 font-sans text-sm font-bold text-white hover:bg-terracotta-700"
            >
              End Ride
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
