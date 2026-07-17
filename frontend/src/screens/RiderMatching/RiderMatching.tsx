import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car as CarIcon, Star as StarIcon, Bone as XIcon } from "lucide-react";
import { Button } from "../../components/ui/button";

export const RiderMatching = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"searching" | "matched">("searching");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("matched"), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col items-center justify-center px-4 py-8">
      {phase === "searching" ? (
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse-ring rounded-full bg-sage-500/30" />
            <div className="absolute inset-0 animate-pulse-ring rounded-full bg-sage-500/20" style={{ animationDelay: "0.5s" }} />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-sage-500 text-white shadow-lg">
              <CarIcon className="h-10 w-10" />
            </div>
          </div>
          <h1 className="mt-8 font-serif text-2xl font-normal text-charcoal">Finding your driver...</h1>
          <p className="mt-2 font-sans text-sm text-muted-foreground">
            Connecting you with nearby verified drivers
          </p>
        </div>
      ) : (
        <div className="w-full animate-bounce-in">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage-500 text-white shadow-lg">
              <CarIcon className="h-9 w-9" />
            </div>
            <h1 className="mt-5 font-serif text-2xl font-normal text-charcoal">Driver Found!</h1>
            <p className="mt-1 font-sans text-sm text-muted-foreground">Arriving in 4 minutes</p>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-charcoal text-lg font-bold text-white">
                JB
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-sans text-base font-bold text-charcoal">Jordan Blake</p>
                  <span className="flex items-center gap-1 font-sans text-sm text-sage-500">
                    <StarIcon className="h-3.5 w-3.5 fill-current" /> 4.9
                  </span>
                </div>
                <p className="font-sans text-sm text-muted-foreground">Silver Toyota Camry · 7XK-4291</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Button
              onClick={() => navigate("/rider/ride")}
              className="h-auto flex-1 rounded-2xl bg-sage-500 py-4 font-sans text-base font-bold text-white shadow-lg hover:bg-sage-600"
            >
              Track Ride
            </Button>
            <Button
              onClick={() => navigate("/rider")}
              variant="outline"
              className="h-auto rounded-2xl border-cream-400 px-4 py-4 text-muted-foreground hover:bg-cream-200"
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
