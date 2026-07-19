import { Shield as ShieldIcon, Zap as ZapIcon, Clock as ClockIcon, MapPin as MapPinIcon } from "lucide-react";
import { cn } from "../lib/utils";

export type RoutePriority = "fastest" | "safest";

export interface RideData {
  id: string;
  pickup: string;
  destination: string;
  route: string;
  duration: string;
  distance: string;
  price: string;
  safetyScore: number;
  priority: RoutePriority;
  driverName?: string;
  driverRating?: number;
  vehicleModel?: string;
  vehiclePlate?: string;
  status?: string;
}

export const SafetyScore = ({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) => {
  const color =
    score >= 90 ? "text-green-600 bg-green-50"
    : score >= 75 ? "text-yellow-600 bg-yellow-50"
    : "text-red-600 bg-red-50";

  const sizeClass = size === "lg" ? "text-3xl" : size === "sm" ? "text-sm" : "text-lg";

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-sans font-bold", color, sizeClass)}>
      <ShieldIcon className={size === "lg" ? "h-6 w-6" : "h-4 w-4"} />
      {score}/100
    </span>
  );
};

export const PriorityBadge = ({ priority }: { priority: RoutePriority }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-lg px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider",
      priority === "fastest"
        ? "bg-black text-white"
        : "bg-gray-100 text-black border border-gray-200",
    )}
  >
    {priority === "fastest" ? <ZapIcon className="h-3.5 w-3.5" /> : <ShieldIcon className="h-3.5 w-3.5" />}
    {priority}
  </span>
);

export const StatCard = ({
  label,
  value,
  icon: Icon,
  accent = "sage",
  sublabel,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "sage" | "terracotta" | "charcoal";
  sublabel?: string;
}) => (
  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-black">
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <p className="mt-3 font-sans text-3xl font-bold text-black">{value}</p>
    {sublabel && <p className="mt-1 font-sans text-xs text-muted-foreground">{sublabel}</p>}
  </div>
);

export const RideDetailCard = ({
  ride,
  onClick,
  selected,
  compact,
}: {
  ride: RideData;
  onClick?: () => void;
  selected?: boolean;
  compact?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "w-full rounded-lg border p-5 text-left transition-all",
      selected
        ? "border-black bg-white shadow-sm ring-1 ring-black"
        : "border-gray-200 bg-gray-50 hover:bg-gray-100",
    )}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={ride.priority} />
          <h3 className="truncate font-sans text-lg font-bold text-black">{ride.route}</h3>
        </div>
        {!compact && (
          <p className="mt-1.5 font-sans text-sm text-muted-foreground">
            {ride.pickup} → {ride.destination}
          </p>
        )}
      </div>
      <span className="shrink-0 rounded-lg bg-black px-3 py-1 font-sans text-sm font-bold text-white">
        {ride.price}
      </span>
    </div>
    <div className="mt-4 flex flex-wrap gap-4 font-sans text-sm text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <ClockIcon className="h-4 w-4" /> {ride.duration}
      </span>
      <span className="flex items-center gap-1.5">
        <MapPinIcon className="h-4 w-4" /> {ride.distance}
      </span>
      <SafetyScore score={ride.safetyScore} size="sm" />
    </div>
  </button>
);
