import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check as CheckIcon, Bone as XIcon, MapPin as MapPinIcon, Clock as ClockIcon, DollarSign as DollarSignIcon, Shield as ShieldIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { SafetyScore } from "../../components/RideDetailCard";

export const DriverIncomingRequest = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(15);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(() => navigate("/driver/active"), 1500);
  };

  if (accepted) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-4 py-8 text-center animate-bounce-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage-500 text-white shadow-lg">
          <CheckIcon className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-serif text-2xl font-normal text-charcoal">Ride Accepted!</h1>
        <p className="mt-2 font-sans text-sm text-muted-foreground">Navigating to pickup location...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 animate-pulse-ring rounded-full bg-sage-500/30" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-sage-500 text-white shadow-lg">
              <MapPinIcon className="h-8 w-8" />
            </div>
          </div>
          <h1 className="mt-5 font-serif text-2xl font-normal text-charcoal">Incoming Request</h1>
          <p className="mt-1 font-sans text-sm text-terracotta-600 font-bold">
            Respond in {timeLeft}s
          </p>
        </div>

        {/* Trip details */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="h-3 w-3 rounded-full bg-sage-500" />
              <div className="my-1 h-8 w-0.5 bg-cream-400" />
              <div className="h-3 w-3 rounded-full bg-terracotta-500" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="font-sans text-xs text-muted-foreground">Pickup</p>
                <p className="font-sans text-sm font-bold text-charcoal">Downtown Station · 2 min away</p>
              </div>
              <div>
                <p className="font-sans text-xs text-muted-foreground">Destination</p>
                <p className="font-sans text-sm font-bold text-charcoal">Riverside Park · 12.4 km</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-cream-300 pt-4">
            <div className="text-center">
              <DollarSignIcon className="mx-auto h-5 w-5 text-sage-500" />
              <p className="mt-1 font-sans text-lg font-bold text-charcoal">$24.50</p>
              <p className="font-sans text-xs text-muted-foreground">Fare</p>
            </div>
            <div className="text-center">
              <ClockIcon className="mx-auto h-5 w-5 text-sage-500" />
              <p className="mt-1 font-sans text-lg font-bold text-charcoal">18 min</p>
              <p className="font-sans text-xs text-muted-foreground">Duration</p>
            </div>
            <div className="text-center">
              <ShieldIcon className="mx-auto h-5 w-5 text-sage-500" />
              <p className="mt-1 font-sans text-lg font-bold text-charcoal">94</p>
              <p className="font-sans text-xs text-muted-foreground">Safety</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <Button
            onClick={handleAccept}
            className="flex-1 rounded-2xl bg-sage-500 py-4 font-sans text-base font-bold text-white shadow-lg hover:bg-sage-600"
          >
            <CheckIcon className="h-5 w-5" /> Accept
          </Button>
          <Button
            onClick={() => navigate("/driver")}
            variant="outline"
            className="rounded-2xl border-cream-400 px-6 py-4 font-sans text-base font-bold text-muted-foreground hover:bg-cream-200"
          >
            <XIcon className="h-5 w-5" /> Decline
          </Button>
        </div>
      </div>
    </div>
  );
};
