import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Check as CheckIcon,
  X as XIcon,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  AlertCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { rideService } from "../../services/ride.service";

export const DriverIncomingRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const rideId = location.state?.rideId;
  const pickupAddress = location.state?.pickupAddress || "Pickup Location";
  const dropoffAddress = location.state?.dropoffAddress || "Dropoff Location";
  const pickupLat = location.state?.pickupLat;
  const pickupLng = location.state?.pickupLng;
  const dropoffLat = location.state?.dropoffLat;
  const dropoffLng = location.state?.dropoffLng;

  const [timeLeft, setTimeLeft] = useState(30);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  // Redirect to dashboard if no rideId
  useEffect(() => {
    if (!rideId) {
      navigate("/driver");
    }
  }, [rideId, navigate]);

  // Countdown timer — 30 seconds
  useEffect(() => {
    if (accepted || timeLeft <= 0) {
      if (timeLeft <= 0 && !accepted) {
        // Auto-decline when timer expires
        navigate("/driver");
      }
      return;
    }

    timerRef.current = window.setTimeout(
      () => setTimeLeft((t) => t - 1),
      1000
    );
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, accepted, navigate]);

  const handleAccept = async () => {
    if (!rideId) {
      setError("No ride ID provided. Cannot accept.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await rideService.acceptRide(rideId);
      setAccepted(true);
      // Navigate to active ride screen after brief confirmation
      setTimeout(() => {
        navigate("/driver/active", {
          state: {
            rideId,
            pickupAddress,
            dropoffAddress,
            pickupLat,
            pickupLng,
            dropoffLat,
            dropoffLng,
          },
        });
      }, 1500);
    } catch (err: any) {
      console.error("Failed to accept ride request:", err);
      setError(
        err.message ||
          "Failed to accept ride. It might have been accepted by another driver."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = () => {
    navigate("/driver");
  };

  // Success state
  if (accepted) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-4 py-8 text-center animate-fade-up">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
          <CheckIcon className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-serif text-2xl font-normal text-charcoal">
          Ride Accepted!
        </h1>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          Navigating to pickup location...
        </p>
      </div>
    );
  }

  // Timer progress percentage
  const timerPercent = (timeLeft / 30) * 100;

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-md">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
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

        <div className="text-center">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
            {/* Circular timer background */}
            <svg className="absolute inset-0 h-20 w-20 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-cream-300"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - timerPercent / 100)}`}
                strokeLinecap="round"
                className={`transition-all duration-1000 ${
                  timeLeft <= 10 ? "text-red-500" : "text-sage-500"
                }`}
              />
            </svg>
            <span
              className={`relative font-sans text-2xl font-bold ${
                timeLeft <= 10 ? "text-red-500" : "text-charcoal"
              }`}
            >
              {timeLeft}s
            </span>
          </div>
          <h1 className="mt-5 font-serif text-2xl font-normal text-charcoal">
            Incoming Ride Request
          </h1>
          <p className="mt-1 font-sans text-sm text-muted-foreground">
            Accept before the timer runs out
          </p>
        </div>

        {/* Trip details */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div className="my-1 h-10 w-0.5 bg-cream-400" />
              <div className="h-3 w-3 rounded-full bg-red-500" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Pickup
                </p>
                <p className="mt-0.5 font-sans text-sm font-bold text-charcoal">
                  {pickupAddress}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Destination
                </p>
                <p className="mt-0.5 font-sans text-sm font-bold text-charcoal">
                  {dropoffAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            onClick={handleAccept}
            disabled={loading || timeLeft <= 0}
            className="flex-1 rounded-2xl bg-green-600 py-4 font-sans text-base font-bold text-white shadow-lg hover:bg-green-700 disabled:opacity-50 h-auto"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Accepting...
              </span>
            ) : (
              <>
                <CheckIcon className="h-5 w-5 mr-2" /> Accept Ride
              </>
            )}
          </Button>
          <Button
            onClick={handleDecline}
            disabled={loading}
            variant="outline"
            className="rounded-2xl border-cream-400 px-6 py-4 font-sans text-base font-bold text-charcoal hover:bg-gray-100 h-auto"
          >
            <XIcon className="h-5 w-5 mr-1" /> Decline
          </Button>
        </div>
      </div>
    </div>
  );
};
export default DriverIncomingRequest;
