import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Car as CarIcon, Star as StarIcon, X as XIcon, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { rideService } from "../../services/ride.service";

// Deterministic helper to show realistic Indian vehicle details based on driverId
export function getVehicleDetails(driverId: string) {
  const cars = [
    "White Suzuki Swift",
    "Silver Hyundai i20",
    "Black Honda City",
    "Red Tata Altroz",
    "Grey Kia Seltos"
  ];
  if (!driverId) return { car: "SwiftRide Partner Car", plate: "MH-12-SR-1234" };
  let hash = 0;
  for (let i = 0; i < driverId.length; i++) {
    hash = driverId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % cars.length;
  const num = Math.abs(hash) % 9000 + 1000;
  const letters = String.fromCharCode(65 + (Math.abs(hash) % 26)) + String.fromCharCode(65 + (Math.abs(hash >> 1) % 26));
  return {
    car: cars[index],
    plate: `MH-12-${letters}-${num}`
  };
}

export const RiderMatching = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const destName = location.state?.destination || "Dropoff Destination";
  const rideId = location.state?.rideId;
  const pickupAddress = location.state?.pickupAddress || "Pickup Location";
  const pickupLat = location.state?.pickupLat;
  const pickupLng = location.state?.pickupLng;
  const dropoffLat = location.state?.dropoffLat;
  const dropoffLng = location.state?.dropoffLng;

  const [status, setStatus] = useState<string>("REQUESTED");
  const [driverName, setDriverName] = useState<string>("Driver Partner");
  const [driverRating, setDriverRating] = useState<string>("4.9");
  const [vehicleInfo, setVehicleInfo] = useState<string>("SwiftRide Partner Car");
  const [initials, setInitials] = useState<string>("DP");
  const [error, setError] = useState<string | null>(null);

  // Redirect if no rideId
  useEffect(() => {
    if (!rideId) {
      navigate("/rider");
    }
  }, [rideId, navigate]);

  // Poll GET /api/ride/history every 3 seconds
  useEffect(() => {
    if (!rideId) return;

    const checkRideStatus = async () => {
      try {
        const response = await rideService.getRideHistory();
        const history = response.rideHistory || [];
        const currentRide = history.find((r: any) => r.id === rideId);
        
        if (currentRide) {
          setStatus(currentRide.status);

          let resolvedName = "Driver Partner";
          let resolvedRating = "4.9";
          let resolvedVehicle = "SwiftRide Partner Car";
          let resolvedInitials = "DP";

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

          // If the status is ACCEPTED (or IN_PROGRESS, etc.), automatically navigate to RideInProgress
          if (
            currentRide.status === "ACCEPTED" || 
            currentRide.status === "IN_PROGRESS"
          ) {
            // Automatically route to RideInProgress page
            navigate("/rider/ride", {
              state: {
                rideId,
                destination: destName,
                pickupAddress,
                pickupLat,
                pickupLng,
                dropoffLat,
                dropoffLng,
                driverName: resolvedName,
                driverRating: resolvedRating,
                vehicleInfo: resolvedVehicle,
                initials: resolvedInitials
              }
            });
          }
        }
      } catch (err: any) {
        console.error("Polling error in RiderMatching:", err);
      }
    };

    // Run first check immediately
    checkRideStatus();

    const intervalId = setInterval(checkRideStatus, 3000);
    return () => clearInterval(intervalId);
  }, [rideId, navigate, destName, pickupAddress, pickupLat, pickupLng, dropoffLat, dropoffLng]);

  const handleCancel = () => {
    // Navigate back to home screen
    navigate("/rider");
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col items-center justify-center px-4 py-8">
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-red-600 border border-red-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="font-sans text-sm">{error}</span>
        </div>
      )}

      {status === "REQUESTED" ? (
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-black/5" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-black text-white shadow-lg">
              <CarIcon className="h-10 w-10 animate-bounce" />
            </div>
          </div>
          <h1 className="mt-8 font-serif text-2xl font-normal text-charcoal flex items-center gap-2.5">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            Finding your driver...
          </h1>
          <p className="mt-2 font-sans text-sm text-muted-foreground max-w-xs">
            Connecting you with the closest verified driver matching your route.
          </p>

          <Button
            onClick={handleCancel}
            className="mt-8 rounded-xl bg-red-600 px-6 py-3 font-sans text-sm font-bold text-white hover:bg-red-700"
          >
            Cancel Request
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-md animate-fade-up">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-white shadow-lg">
              <CarIcon className="h-9 w-9" />
            </div>
            <h1 className="mt-5 font-serif text-2xl font-normal text-charcoal">Driver Found!</h1>
            <p className="mt-1 font-sans text-sm text-muted-foreground">Arriving to your pickup location</p>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-lg font-bold text-white">
                {initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-sans text-base font-bold text-charcoal">{driverName}</p>
                  <span className="flex items-center gap-1 font-sans text-sm text-yellow-500 font-bold">
                    <StarIcon className="h-3.5 w-3.5 fill-current" /> {driverRating}
                  </span>
                </div>
                <p className="font-sans text-xs text-muted-foreground mt-0.5">Verified Partner · {vehicleInfo}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => {
                navigate("/rider/ride", {
                  state: {
                    rideId,
                    destination: destName,
                    pickupAddress,
                    pickupLat,
                    pickupLng,
                    dropoffLat,
                    dropoffLng,
                    driverName,
                    driverRating,
                    vehicleInfo,
                    initials
                  }
                });
              }}
              className="h-12 flex-1 rounded-xl bg-black py-4 font-sans text-base font-bold text-white shadow-lg hover:bg-gray-800"
            >
              Track Live Ride
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="h-12 rounded-xl border-cream-400 px-4 py-4 text-muted-foreground hover:bg-cream-200"
            >
              <XIcon className="h-5 w-5" /> Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default RiderMatching;
