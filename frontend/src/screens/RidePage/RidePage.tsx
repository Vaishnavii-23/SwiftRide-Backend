import { useMemo, useState } from "react";
import { Clock as ClockIcon, MapPin as MapPinIcon, Navigation as NavigationIcon, ShieldCheck as ShieldCheckIcon, Zap as ZapIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

type RoutePriority = "fastest" | "safest";

interface RouteOption {
  id: string;
  label: string;
  priority: RoutePriority;
  duration: string;
  distance: string;
  price: string;
  safetyScore: number;
  description: string;
}

const routes: RouteOption[] = [
  {
    id: "route-a",
    label: "Express Highway",
    priority: "fastest",
    duration: "18 min",
    distance: "12.4 km",
    price: "$24.50",
    safetyScore: 72,
    description: "Direct highway route with the shortest travel time.",
  },
  {
    id: "route-b",
    label: "Well-Lit Boulevard",
    priority: "safest",
    duration: "26 min",
    distance: "14.8 km",
    price: "$28.00",
    safetyScore: 94,
    description: "Scenic, well-lit streets with high community safety scores.",
  },
  {
    id: "route-c",
    label: "City Center Loop",
    priority: "fastest",
    duration: "22 min",
    distance: "13.1 km",
    price: "$26.00",
    safetyScore: 81,
    description: "Balanced route through the downtown corridor.",
  },
];

export const RidePage = (): JSX.Element => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [priority, setPriority] = useState<RoutePriority>("fastest");
  const [selectedRoute, setSelectedRoute] = useState<string>("route-a");
  const [confirmed, setConfirmed] = useState(false);

  const filteredRoutes = useMemo(
    () =>
      priority === "fastest"
        ? routes.slice().sort((a, b) => a.duration.localeCompare(b.duration))
        : routes.slice().sort((a, b) => b.safetyScore - a.safetyScore),
    [priority],
  );

  const activeRoute =
    routes.find((r) => r.id === selectedRoute) ?? filteredRoutes[0];

  const handleConfirm = () => {
    if (!pickup || !destination) return;
    setConfirmed(true);
  };

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <p className="[font-family:'Nunito_Sans',Helvetica] text-sm font-bold uppercase tracking-[0.70px] text-[#8a7440]">
          BOOK A RIDE
        </p>
        <h1 className="mt-3 [font-family:'Literata',Helvetica] text-4xl font-normal leading-tight text-[#2e3230]">
          Where are you headed?
        </h1>
        <p className="mt-3 [font-family:'Nunito_Sans',Helvetica] text-base font-normal leading-6 text-[#5d625d]">
          Enter your trip details and choose the route that fits your priority.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
        <Card className="h-fit rounded-2xl border-[#e4e0d8] bg-[#f0ece4] shadow-[0px_4px_20px_#2e32300f]">
          <CardContent className="flex flex-col p-6 sm:p-8">
            <h2 className="[font-family:'Literata',Helvetica] text-xl font-normal leading-7 text-[#2e3230]">
              Trip Details
            </h2>
            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="pickup"
                  className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]"
                >
                  Pickup
                </label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-[#d6d1c8] bg-white px-3">
                  <MapPinIcon className="h-4 w-4 shrink-0 text-[#4a7c59]" />
                  <input
                    id="pickup"
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Current location"
                    className="h-11 flex-1 bg-transparent [font-family:'Nunito_Sans',Helvetica] text-sm text-[#2e3230] outline-none placeholder:text-[#8b8f8a]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="destination"
                  className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]"
                >
                  Destination
                </label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-[#d6d1c8] bg-white px-3">
                  <NavigationIcon className="h-4 w-4 shrink-0 text-[#705c30]" />
                  <input
                    id="destination"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where to?"
                    className="h-11 flex-1 bg-transparent [font-family:'Nunito_Sans',Helvetica] text-sm text-[#2e3230] outline-none placeholder:text-[#8b8f8a]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <span className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]">
                Route Priority
              </span>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPriority("fastest");
                    setSelectedRoute("route-a");
                  }}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-3 transition-colors ${
                    priority === "fastest"
                      ? "border-[#4a7c59] bg-[#4a7c59] text-white"
                      : "border-[#d6d1c8] bg-white text-[#2e3230] hover:border-[#4a7c59]/50"
                  }`}
                >
                  <ZapIcon className="h-4 w-4" />
                  <span className="[font-family:'Nunito_Sans',Helvetica] text-sm font-bold">
                    Fastest
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPriority("safest");
                    setSelectedRoute("route-b");
                  }}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-3 transition-colors ${
                    priority === "safest"
                      ? "border-[#705c30] bg-[#705c30] text-white"
                      : "border-[#d6d1c8] bg-white text-[#2e3230] hover:border-[#705c30]/50"
                  }`}
                >
                  <ShieldCheckIcon className="h-4 w-4" />
                  <span className="[font-family:'Nunito_Sans',Helvetica] text-sm font-bold">
                    Safest
                  </span>
                </button>
              </div>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={!pickup || !destination}
              className="mt-6 h-auto rounded-3xl bg-[#4a7c59] py-4 [font-family:'Nunito_Sans',Helvetica] text-base font-bold leading-6 text-white shadow-[0px_4px_20px_#2e32300f] hover:bg-[#426f50] disabled:opacity-50"
            >
              {confirmed ? "Ride Confirmed" : "Confirm Ride"}
            </Button>
            {confirmed && (
              <p className="mt-3 text-center [font-family:'Nunito_Sans',Helvetica] text-sm font-normal text-[#4a7c59]">
                Your driver is on the way. Track your ride in real time.
              </p>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-4 [font-family:'Literata',Helvetica] text-xl font-normal leading-7 text-[#2e3230]">
            Available Routes
          </h2>
          <div className="space-y-4">
            {filteredRoutes.map((route) => {
              const isActive = route.id === selectedRoute;
              return (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => setSelectedRoute(route.id)}
                  className={`w-full rounded-2xl border p-5 text-left transition-all ${
                    isActive
                      ? "border-[#4a7c59] bg-white shadow-[0px_4px_20px_#2e32300f]"
                      : "border-[#e4e0d8] bg-[#f0ece4] hover:border-[#4a7c59]/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        {route.priority === "fastest" ? (
                          <ZapIcon className="h-4 w-4 text-[#4a7c59]" />
                        ) : (
                          <ShieldCheckIcon className="h-4 w-4 text-[#705c30]" />
                        )}
                        <h3 className="[font-family:'Literata',Helvetica] text-lg font-normal leading-7 text-[#2e3230]">
                          {route.label}
                        </h3>
                      </div>
                      <p className="mt-1 [font-family:'Nunito_Sans',Helvetica] text-sm font-normal leading-6 text-[#5d625d]">
                        {route.description}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#4a7c59]/10 px-3 py-1 [font-family:'Nunito_Sans',Helvetica] text-sm font-bold text-[#4a7c59]">
                      {route.price}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 [font-family:'Nunito_Sans',Helvetica] text-sm font-normal text-[#4a4e4a]">
                    <span className="flex items-center gap-1.5">
                      <ClockIcon className="h-4 w-4 text-[#6b6f6a]" />
                      {route.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <NavigationIcon className="h-4 w-4 text-[#6b6f6a]" />
                      {route.distance}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheckIcon className="h-4 w-4 text-[#6b6f6a]" />
                      Safety {route.safetyScore}/100
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {activeRoute && (
            <Card className="mt-6 rounded-2xl border-[#e4e0d8] bg-white shadow-[0px_4px_20px_#2e32300f]">
              <CardContent className="flex flex-col p-6 sm:p-8">
                <h3 className="[font-family:'Literata',Helvetica] text-lg font-normal leading-7 text-[#2e3230]">
                  Trip Summary
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]">
                      Route
                    </p>
                    <p className="mt-1 [font-family:'Nunito_Sans',Helvetica] text-sm font-bold text-[#2e3230]">
                      {activeRoute.label}
                    </p>
                  </div>
                  <div>
                    <p className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]">
                      Duration
                    </p>
                    <p className="mt-1 [font-family:'Nunito_Sans',Helvetica] text-sm font-bold text-[#2e3230]">
                      {activeRoute.duration}
                    </p>
                  </div>
                  <div>
                    <p className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]">
                      Safety
                    </p>
                    <p className="mt-1 [font-family:'Nunito_Sans',Helvetica] text-sm font-bold text-[#2e3230]">
                      {activeRoute.safetyScore}/100
                    </p>
                  </div>
                  <div>
                    <p className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]">
                      Total
                    </p>
                    <p className="mt-1 [font-family:'Nunito_Sans',Helvetica] text-sm font-bold text-[#4a7c59]">
                      {activeRoute.price}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
