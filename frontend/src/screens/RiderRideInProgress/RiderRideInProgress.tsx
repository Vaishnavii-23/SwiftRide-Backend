import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Car as CarIcon, Phone as PhoneIcon, MessageSquare as MessageSquareIcon, Shield as ShieldIcon, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { SafetyScore } from "../../components/RideDetailCard";
import { rideService } from "../../services/ride.service";
import { useWebSocket } from "../../hooks/useWebSocket";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { getVehicleDetails } from "../RiderMatching/RiderMatching";

// Custom icon for the driver's car
const carIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const RiderRideInProgress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const rideId = location.state?.rideId;
  const destName = location.state?.destination || "Dropoff Destination";
  const pickupAddress = location.state?.pickupAddress || "Pickup Location";
  const pickupLat = location.state?.pickupLat || 28.6139;
  const pickupLng = location.state?.pickupLng || 77.209;
  const dropoffLat = location.state?.dropoffLat || 28.625;
  const dropoffLng = location.state?.dropoffLng || 77.22;

  // Driver details passed down from Matching or loaded from history
  const [driverName, setDriverName] = useState(location.state?.driverName || "Driver Partner");
  const [driverRating, setDriverRating] = useState(location.state?.driverRating || "4.9");
  const [vehicleInfo, setVehicleInfo] = useState(location.state?.vehicleInfo || "SwiftRide Partner Car");
  const [initials, setInitials] = useState(location.state?.initials || "DP");

  const pickupPoint: [number, number] = [pickupLat, pickupLng];
  const dropoffPoint: [number, number] = [dropoffLat, dropoffLng];

  const [eta, setEta] = useState(15);
  const [status, setStatus] = useState<string>("REQUESTED");
  const [driverPos, setDriverPos] = useState<[number, number] | null>(null);
  const [rideDetails, setRideDetails] = useState<any>(null);

  // Connect to WebSocket and listen for driver location updates
  const { isConnected } = useWebSocket((message) => {
    if (message.type === "location" && message.latitude && message.longitude) {
      console.log("Live driver location received:", message.latitude, message.longitude);
      setDriverPos([message.latitude, message.longitude]);
    }
  });

  // Poll ride history to get status updates
  useEffect(() => {
    if (!rideId) return;

    const pollStatus = async () => {
      try {
        const res = await rideService.getRideHistory();
        const history = res.rideHistory || [];
        const currentRide = history.find((r: any) => r.id === rideId);
        
        if (currentRide) {
          setStatus(currentRide.status);
          setRideDetails(currentRide);

          let resolvedName = driverName;
          let resolvedRating = driverRating;
          let resolvedVehicle = vehicleInfo;
          let resolvedInitials = initials;

          if (currentRide.driver?.user) {
            const email = currentRide.driver.user.email || "";
            resolvedName = email ? (email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1)) : "Driver Partner";
            resolvedRating = currentRide.driver.user.rating ? currentRide.driver.user.rating.toFixed(1) : "4.9";
            resolvedInitials = resolvedName.slice(0, 2).toUpperCase();
            
            const v = getVehicleDetails(currentRide.driverId);
            resolvedVehicle = `${v.car} · ${v.plate}`;

            setDriverName(resolvedName);
            setDriverRating(resolvedRating);
            setInitials(resolvedInitials);
            setVehicleInfo(resolvedVehicle);
          }
          
          if (currentRide.status === "COMPLETED") {
            navigate("/rider/complete", {
              state: {
                rideId,
                fare: currentRide.fare || 180,
                distance: currentRide.distance || 12.4,
                destination: destName,
                driverName: resolvedName,
                vehicleInfo: resolvedVehicle
              }
            });
          }
        }
      } catch (err) {
        console.error("Error polling ride status:", err);
      }
    };

    // Initial check
    pollStatus();

    const interval = setInterval(pollStatus, 3000);
    return () => clearInterval(interval);
  }, [rideId, navigate, destName, driverName, driverRating, vehicleInfo, initials]);

  // Handle countdown simulation for ETA when ride is active
  useEffect(() => {
    if (status !== "IN_PROGRESS") return;
    const timer = setInterval(() => {
      setEta((prev) => (prev > 1 ? prev - 1 : 1));
    }, 15000);
    return () => clearInterval(timer);
  }, [status]);

  const handleEndRide = async () => {
    navigate("/rider/complete", {
      state: {
        rideId,
        fare: rideDetails?.fare || 180,
        distance: rideDetails?.distance || 12.4,
        destination: destName,
        driverName: driverName,
        vehicleInfo: vehicleInfo
      }
    });
  };

  const getStatusBanner = () => {
    switch (status) {
      case "REQUESTED":
        return {
          title: "Waiting for Acceptance",
          description: "Finding nearest driver to accept your ride request...",
          color: "bg-amber-500/10 text-amber-600 border-amber-500/20"
        };
      case "ACCEPTED":
        return {
          title: "Driver Accepted",
          description: "Your driver is heading to your pickup location.",
          color: "bg-green-500/10 text-green-600 border-green-500/20"
        };
      case "IN_PROGRESS":
        return {
          title: "Ride In Progress",
          description: "You are currently on your way to destination safely.",
          color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
        };
      case "COMPLETED":
        return {
          title: "Ride Completed",
          description: "Arrived at your destination! Redirecting...",
          color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
        };
      default:
        return {
          title: "Updating Status",
          description: "Checking current ride progress details...",
          color: "bg-cream-200 text-charcoal border-gray-200"
        };
    }
  };

  const banner = getStatusBanner();

  return (
    <div className="flex flex-col h-full w-full">
      <div className="shrink-0 mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-normal text-charcoal">Ride In Progress</h1>
          <p className="font-sans text-xs text-muted-foreground">Trip ID: #{rideId?.substring(0, 8)}</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-black px-3 py-1 font-sans text-xs font-bold text-white">
          <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
          {isConnected ? "WS Connected" : "Connecting Live..."}
        </span>
      </div>

      {/* WebSocket connectivity status */}
      <div className={`mb-4 flex items-center gap-2 rounded-xl border p-3 shrink-0 ${banner.color}`}>
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div>
          <p className="font-sans text-sm font-bold">{banner.title}</p>
          <p className="font-sans text-xs">{banner.description}</p>
        </div>
      </div>

      {/* Split layout: Left Map, Right Route Info / Action Cards */}
      <div className="flex flex-col lg:flex-row gap-6 w-full lg:h-[calc(100vh-210px)] min-h-0">
        
        {/* Left Side: Map */}
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
            <Polyline positions={[pickupPoint, dropoffPoint]} pathOptions={{ color: '#4a7c59', weight: 5 }} />
            <Marker position={pickupPoint}><Popup>Starting Point</Popup></Marker>
            <Marker position={dropoffPoint}><Popup>Destination</Popup></Marker>

            {/* Live driver location marker */}
            {driverPos ? (
              <Marker position={driverPos} icon={carIcon}>
                <Popup>Driver Partner's live location</Popup>
              </Marker>
            ) : (
              <Marker position={pickupPoint} icon={carIcon}>
                <Popup>Driver location not received yet</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Right Side: details and actions */}
        <div className="w-full lg:w-1/2 overflow-y-auto lg:pr-3 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {/* ETA */}
            <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {status === "IN_PROGRESS" ? "Arriving in" : "Ride Status"}
                  </p>
                  <p className="mt-1 font-serif text-3xl font-normal text-charcoal">
                    {status === "IN_PROGRESS" ? `${eta} min` : status}
                  </p>
                </div>
                <SafetyScore score={94} size="lg" />
              </div>
            </div>

            {/* Route info */}
            <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div className="my-1.5 h-10 w-0.5 bg-cream-400" />
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="font-sans text-xs text-muted-foreground font-bold">Pickup Address</p>
                    <p className="font-sans text-sm text-charcoal">{pickupAddress}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-muted-foreground font-bold">Destination Address</p>
                    <p className="font-sans text-sm text-charcoal">{destName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver info */}
            <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-lg font-bold text-white">
                  {initials}
                </div>
                <div className="flex-1">
                  <p className="font-sans text-base font-bold text-charcoal">{driverName}</p>
                  <p className="font-sans text-xs text-muted-foreground mt-0.5">{vehicleInfo}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl border-cream-400 py-3 text-black hover:bg-cream-200">
                  <PhoneIcon className="h-4 w-4 mr-2" /> Call Driver
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl border-cream-400 py-3 text-black hover:bg-cream-200">
                  <MessageSquareIcon className="h-4 w-4 mr-2" /> Message
                </Button>
              </div>
            </div>
          </div>

          {/* Safety actions */}
          <div className="flex gap-3 shrink-0">
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-cream-400 py-4 font-sans text-sm font-bold text-black hover:bg-cream-200"
            >
              <ShieldIcon className="h-4 w-4 mr-2" /> Share Live Trip
            </Button>
            <Button
              onClick={handleEndRide}
              className="flex-1 rounded-xl bg-black py-4 font-sans text-sm font-bold text-white hover:bg-gray-800"
            >
              End Ride
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
export default RiderRideInProgress;
