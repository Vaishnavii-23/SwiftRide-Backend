import { LayoutDashboard as LayoutDashboardIcon, Car as CarIcon, DollarSign as DollarSignIcon, FileCheck as FileCheckIcon, LogOut as LogOutIcon, Menu as MenuIcon, Bone as XIcon } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

const sidebarItems = [
  { to: "/driver", label: "Dashboard", icon: LayoutDashboardIcon, end: true },
  { to: "/driver/kyc", label: "KYC & Compliance", icon: FileCheckIcon, end: false },
  { to: "/driver/earnings", label: "Earnings", icon: DollarSignIcon, end: false },
  { to: "/driver/active", label: "Active Navigation", icon: CarIcon, end: false },
];

export const DriverLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream-100 text-charcoal">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-cream-300 bg-cream-200 transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Link to="/" className="font-serif text-xl font-semibold text-charcoal">
            SwiftRide
          </Link>
          <button
            className="text-muted-foreground md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="px-4 py-2">
          <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-sage-500 text-white">
                {user?.name?.split(" ").map((n) => n[0]).join("") ?? "D"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-sans text-sm font-bold text-charcoal">
                {user?.name ?? "Driver"}
              </p>
              <p className="truncate font-sans text-xs text-muted-foreground">Driver</p>
            </div>
          </div>
        </div>
        <nav className="mt-2 px-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm font-bold transition-colors tap-scale ${
                        isActive
                          ? "bg-sage-500 text-white"
                          : "text-muted-foreground hover:bg-cream-300 hover:text-charcoal"
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-cream-300 p-4">
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full justify-start gap-3 font-sans text-sm font-bold text-muted-foreground hover:text-charcoal"
          >
            <LogOutIcon className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-cream-300 bg-cream-100 px-4 py-4 sm:px-6">
          <button
            className="text-muted-foreground md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3">
            <span className="font-sans text-sm text-muted-foreground">Duty Status:</span>
            <span className="flex items-center gap-2 rounded-full bg-sage-500/10 px-3 py-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-sage-500" />
              <span className="font-sans text-sm font-bold text-sage-500">Online</span>
            </span>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
