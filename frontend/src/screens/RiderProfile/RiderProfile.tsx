import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { LogOut as LogOutIcon, Star as StarIcon, Shield as ShieldIcon, CreditCard as CreditCardIcon, Bell as BellIcon, CircleHelp as HelpCircleIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { fetchApi } from "../../lib/api";

const menuItems = [
  { icon: StarIcon, label: "Ratings & Reviews" },
  { icon: ShieldIcon, label: "Safety Preferences" },
  { icon: CreditCardIcon, label: "Payment Methods" },
  { icon: BellIcon, label: "Notifications" },
  { icon: HelpCircleIcon, label: "Help & Support" },
];

export const RiderProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ trips: 0, rating: 5.0, safety: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetchApi("/ride/history");
        const history = res.rideHistory || [];
        setStats({
          trips: history.length,
          rating: user?.rating || 5.0,
          safety: history.length > 0 ? 90 : 0,
        });
      } catch {
        // If no history yet, keep defaults
      }
    };
    fetchStats();
  }, []);

  // Backend User has no name field - use email prefix as display name
  const displayName = user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 w-full">
      <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
          {initials}
        </div>
        <p className="mt-3 font-serif text-xl font-normal text-charcoal">{displayName}</p>
        <p className="font-sans text-sm text-muted-foreground">{user?.email}</p>
        {user?.phone && (
          <p className="font-sans text-xs text-muted-foreground mt-1">{user.phone}</p>
        )}
        <div className="mt-4 flex gap-6">
          <div className="text-center">
            <p className="font-serif text-2xl font-normal text-charcoal">{stats.trips}</p>
            <p className="font-sans text-xs text-muted-foreground">Trips</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-2xl font-normal text-charcoal">{stats.rating}</p>
            <p className="font-sans text-xs text-muted-foreground">Rating</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-2xl font-normal text-sage-500">{stats.safety}</p>
            <p className="font-sans text-xs text-muted-foreground">Avg Safety</p>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 px-5 py-4 text-left tap-scale transition-colors hover:bg-cream-200 ${
                i > 0 ? "border-t border-gray-200" : ""
              }`}
            >
              <Icon className="h-5 w-5 text-sage-500" />
              <span className="font-sans text-sm font-bold text-charcoal">{item.label}</span>
            </button>
          );
        })}
      </div>

      <Button
        onClick={() => { logout(); navigate("/"); }}
        variant="outline"
        className="mt-4 h-auto w-full rounded-2xl border-cream-400 py-4 font-sans text-base font-bold text-terracotta-600 hover:bg-terracotta-50"
      >
        <LogOutIcon className="h-5 w-5" /> Sign Out
      </Button>
    </div>
  );
};
