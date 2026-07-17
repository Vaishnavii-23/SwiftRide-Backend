import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation as NavigationIcon, Phone as PhoneIcon, MessageSquare as MessageSquareIcon, MapPin as MapPinIcon, CircleCheck as CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";

export const DriverNavigation = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"pickup" | "destination" | "complete">("pickup");
  const [eta, setEta] = useState(4);

  useEffect(() => {
    if (eta <= 0) {
      if (phase === "pickup") {
        setPhase("destination");
        setEta(18);
      } else if (phase === "destination") {
        setPhase("complete");
      }
      return;
    }
    const timer = setTimeout(() => setEta((e) => e - 1), 2000);
    return () => clearTimeout(timer);
  }, [eta, phase]);

  if (phase === "complete") {
    return (
      <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-4 py-8 text-center animate-bounce-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage-500 text-white shadow-lg">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-serif text-2xl font-normal text-charcoal">Trip Complete!</h1>
        <p className="mt-2 font-sans text-sm text-muted-foreground">You earned $24.50 on this trip.</p>
        <Button
          onClick={() => navigate("/driver")}
          className="mt-6 rounded-2xl bg-sage-500 px-8 py-4 font-sans text-base font-bold text-white hover:bg-sage-600"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Map */}
        <div className="relative h-72 overflow-hidden rounded-3xl bg-gradient-to-br from-sage-100 to-cream-300 shadow-sm">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, #4a7c59 1px, transparent 1px), radial-gradient(circle at 70% 60%, #c66a3a 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse-ring rounded-full bg-sage-500/30" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-sage-500 text-white shadow-lg">
                <NavigationIcon className="h-7 w-7" />
              </div>
            </div>
          </div>
        </div>

        {/* Status banner */}
        <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-wider text-terracotta-600">
                {phase === "pickup" ? "En route to pickup" : "En route to destination"}
              </p>
              <p className="mt-1 font-serif text-3xl font-normal text-charcoal">{eta} min</p>
            </div>
            <div className="rounded-full bg-sage-500/10 px-4 py-2">
              <span className="font-sans text-sm font-bold text-sage-500">
                {phase === "pickup" ? "Pickup" : "Drop-off"}
              </span>
            </div>
          </div>
        </div>

        {/* Rider info */}
        <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-charcoal text-lg font-bold text-white">
              AR
            </div>
            <div className="flex-1">
              <p className="font-sans text-base font-bold text-charcoal">Alex Rivera</p>
              <p className="font-sans text-sm text-muted-foreground">4.9 ★ · Riverside Park</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-xl border-cream-400 text-sage-500 hover:bg-cream-200">
                <PhoneIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-xl border-cream-400 text-sage-500 hover:bg-cream-200">
                <MessageSquareIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Next action */}
        <Button
          onClick={() => {
            if (phase === "pickup") { setPhase("destination"); setEta(18); }
            else { setPhase("complete"); }
          }}
          className="mt-4 h-auto w-full rounded-2xl bg-sage-500 py-4 font-sans text-base font-bold text-white shadow-lg hover:bg-sage-600"
        >
          {phase === "pickup" ? "Arrived at Pickup — Start Trip" : "Arrived at Destination — End Trip"}
          <MapPinIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
