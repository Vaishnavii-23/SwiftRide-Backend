import { Menu as MenuIcon, Bone as XIcon } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Button } from "./ui/button";

const navItems = [
  { label: "How It Works", to: "/how-it-works" },
  { label: "Safety", to: "/safety" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export const PublicLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashLink =
    user?.role === "DRIVER"
      ? "/driver"
      : user?.role === "ADMIN"
        ? "/admin"
        : "/rider";

  return (
    <div className="flex min-h-screen flex-col bg-white text-charcoal">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/60 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-black hover:bg-transparent hover:text-black md:hidden"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-4 w-4" />}
            </Button>
            <Link to="/" className="font-serif text-2xl font-semibold text-charcoal">
              SwiftRide
            </Link>
          </div>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `font-sans text-sm transition-colors hover:text-charcoal ${
                        isActive ? "font-bold text-charcoal" : "text-muted-foreground"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button
                  onClick={() => navigate(dashLink)}
                  className="hidden rounded-3xl bg-black px-6 py-2.5 text-sm font-bold text-white hover:bg-gray-900 sm:inline-flex"
                >
                  Dashboard
                </Button>
                <button
                  onClick={logout}
                  className="font-sans text-sm font-bold text-muted-foreground hover:text-charcoal"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="font-sans text-sm font-bold text-charcoal">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="rounded-3xl bg-black px-6 py-2.5 text-sm font-bold text-white hover:bg-gray-900">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            
          </div>
        </div>
        {mobileOpen && (
          <nav aria-label="Mobile" className="border-t border-gray-200/60 bg-white md:hidden">
            <ul className="flex flex-col px-4 py-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block py-3 font-sans text-sm transition-colors hover:text-charcoal ${
                        isActive ? "font-bold text-charcoal" : "text-muted-foreground"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200/60 bg-gray-100">
        <div className="mx-auto grid w-full max-w-screen-xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="font-serif text-xl font-semibold text-charcoal">SwiftRide</div>
            <p className="mt-3 font-sans text-sm text-muted-foreground">
              Your journey, your choice. Navigate the city on your terms.
            </p>
          </div>
          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500">
              Product
            </h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/how-it-works" className="font-sans text-sm text-muted-foreground hover:text-charcoal">How It Works</Link></li>
              <li><Link to="/safety" className="font-sans text-sm text-muted-foreground hover:text-charcoal">Safety</Link></li>
              <li><Link to="/rider" className="font-sans text-sm text-muted-foreground hover:text-charcoal">Ride</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/about" className="font-sans text-sm text-muted-foreground hover:text-charcoal">About</Link></li>
              <li><Link to="/contact" className="font-sans text-sm text-muted-foreground hover:text-charcoal">Contact</Link></li>
              <li><Link to="/register" className="font-sans text-sm text-muted-foreground hover:text-charcoal">Become a Driver</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500">
              Stay Updated
            </h3>
            <p className="mt-4 font-sans text-sm text-muted-foreground">
              Get the latest safety tips and route updates.
            </p>
            <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="h-10 flex-1 rounded-lg border border-gray-300 bg-white px-3 font-sans text-sm text-charcoal outline-none focus:border-gray-500"
              />
              <Button type="submit" className="h-10 rounded-lg bg-black px-4 text-sm font-bold text-white hover:bg-gray-900">
                Join
              </Button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-6">
            <p className="font-sans text-xs text-muted-foreground">
              © {new Date().getFullYear()} SwiftRide. All rights reserved.
            </p>
            <p className="font-sans text-xs text-muted-foreground">Designed for peace of mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
