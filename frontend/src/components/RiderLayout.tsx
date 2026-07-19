import {
  Home as HomeIcon,
  Clock as ClockIcon,
  Shield as ShieldIcon,
  User as UserIcon,
  Menu as MenuIcon,
  Bone as XIcon,
  LogOut as LogOutIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

const sidebarItems = [
  { to: "/rider", label: "Home", icon: HomeIcon, end: true },
  { to: "/rider/history", label: "History", icon: ClockIcon, end: false },
  { to: "/rider/safety", label: "Safety", icon: ShieldIcon, end: false },
  { to: "/rider/profile", label: "Profile", icon: UserIcon, end: false },
];

export const RiderLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("rider-sidebar-collapsed") === "true";
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("rider-sidebar-collapsed", String(next));
      return next;
    });
  };

  const displayName = user?.email?.split("@")[0] || "Rider";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar for Desktop, hidden by default on mobile unless sidebarOpen */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform border-r border-gray-200 bg-gray-50 transition-all duration-300 flex flex-col md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <div className="flex items-center justify-between px-4 py-5 h-16 border-b border-gray-200">
          <Link
            to="/"
            className={`font-sans text-xl font-semibold text-black truncate transition-all duration-300 ${
              isCollapsed ? "opacity-0 w-0 pointer-events-none hidden" : "opacity-100 w-auto"
            }`}
          >
            SwiftRide
          </Link>
          {isCollapsed && (
            <Link
              to="/"
              className="font-sans text-xl font-bold text-black mx-auto"
            >
              SR
            </Link>
          )}
          
          <button
            onClick={toggleCollapse}
            className="hidden md:flex items-center justify-center text-muted-foreground hover:bg-gray-200 hover:text-black rounded-lg p-1.5 transition-all"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>

          <button
            className="text-muted-foreground md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* User profile card in sidebar */}
        <div className="px-3 py-4 border-b border-gray-200">
          <div
            className={`flex items-center gap-3 rounded-xl bg-white p-2 shadow-sm transition-all duration-300 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className="bg-black text-white font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="truncate font-sans text-sm font-bold text-black">
                  {displayName}
                </p>
                <p className="truncate font-sans text-xs text-muted-foreground">
                  Rider
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation list */}
        <nav className="mt-4 px-3 flex-1">
          <ul className="space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-3 font-sans text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? "bg-black text-white"
                          : "text-muted-foreground hover:bg-gray-200 hover:text-black"
                      } ${isCollapsed ? "justify-center" : ""}`
                    }
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && (
                      <span className="transition-opacity duration-300">
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse and Sign Out controls */}
        <div className="p-3 border-t border-gray-200 flex flex-col gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className={`w-full justify-start gap-3 font-sans text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 p-2.5 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOutIcon className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col pb-16 md:pb-0 min-w-0">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-6 md:hidden shrink-0">
          <Link to="/" className="font-sans text-xl font-semibold text-black">
            SwiftRide
          </Link>
          <button
            className="text-muted-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto md:p-6 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-1 flex-col items-center gap-1 py-1.5 tap-scale transition-colors ${
                    isActive ? "text-black font-bold" : "text-muted-foreground"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span className="font-sans text-[10px]">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
export default RiderLayout;
