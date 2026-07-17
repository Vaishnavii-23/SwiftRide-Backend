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
    score >= 90 ? "text-sage-500 bg-sage-500/10"
    : score >= 75 ? "text-sage-600 bg-sage-600/10"
    : score >= 60 ? "text-terracotta-500 bg-terracotta-500/10"
    : "text-red-600 bg-red-50";

  const sizeClass = size === "lg" ? "text-3xl" : size === "sm" ? "text-sm" : "text-lg";

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans font-bold", color, sizeClass)}>
      <ShieldIcon className={size === "lg" ? "h-6 w-6" : "h-4 w-4"} />
      {score}/100
    </span>
  );
};

export const PriorityBadge = ({ priority }: { priority: RoutePriority }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider",
      priority === "fastest"
        ? "bg-sage-500/10 text-sage-500"
        : "bg-terracotta-500/10 text-terracotta-600",
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
  <div className="rounded-2xl border border-cream-300 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          accent === "sage" && "bg-sage-500/10 text-sage-500",
          accent === "terracotta" && "bg-terracotta-500/10 text-terracotta-500",
          accent === "charcoal" && "bg-charcoal/10 text-charcoal",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <p className="mt-3 font-serif text-3xl font-normal text-charcoal">{value}</p>
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
      "w-full rounded-2xl border p-5 text-left transition-all tap-scale",
      selected
        ? "border-sage-500 bg-white shadow-md"
        : "border-cream-300 bg-cream-200 hover:border-sage-500/40",
    )}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={ride.priority} />
          <h3 className="truncate font-serif text-lg font-normal text-charcoal">{ride.route}</h3>
        </div>
        {!compact && (
          <p className="mt-1 font-sans text-sm text-muted-foreground">
            {ride.pickup} → {ride.destination}
          </p>
        )}
      </div>
      <span className="shrink-0 rounded-full bg-sage-500/10 px-3 py-1 font-sans text-sm font-bold text-sage-500">
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
