import { LayoutDashboard as LayoutDashboardIcon, Users as UsersIcon, FileCheck as FileCheckIcon, Map as MapIcon, LogOut as LogOutIcon, Bell as BellIcon } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboardIcon, end: true },
  { to: "/admin/users", label: "User Management", icon: UsersIcon, end: false },
  { to: "/admin/kyc", label: "KYC Review", icon: FileCheckIcon, end: false },
  { to: "/admin/monitoring", label: "Live Monitoring", icon: MapIcon, end: false },
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-white text-charcoal">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-serif text-xl font-semibold text-charcoal">
            SwiftRide <span className="text-sm font-sans font-bold text-terracotta-500">Admin</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-3 py-2 font-sans text-sm font-bold transition-colors tap-scale ${
                      isActive
                        ? "bg-grey-500 text-black"
                        : "text-muted-foreground hover:bg-cream-300 hover:text-charcoal"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative rounded-full p-2 text-muted-foreground hover:bg-cream-300">
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-terracotta-500" />
          </button>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-charcoal text-black">
              {user?.name?.split(" ").map((n) => n[0]).join("") ?? "A"}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-muted-foreground hover:text-charcoal"
          >
            <LogOutIcon className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 overflow-x-auto border-b border-gray-200 px-4 py-2 md:hidden">
        {adminNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 font-sans text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-grey-500 text-black"
                    : "text-muted-foreground hover:bg-cream-300"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
