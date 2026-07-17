import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation as NavigationIcon, Search as SearchIcon, Shield as ShieldIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { fetchApi } from "../../lib/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export const RiderHome = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("Current Location");
  const [destination, setDestination] = useState("");
  const [stats, setStats] = useState({ trips: 0, safety: 0, rating: 5.0 });
  const [recentDestinations, setRecentDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Default coordinates (e.g., center of a city)
  const defaultPosition: [number, number] = [40.7128, -74.0060];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchApi("/ride/history");
        const history = res.rideHistory || [];
        
        // Calculate basic stats from history
        const trips = history.length;
        setStats({ trips, safety: 95, rating: 4.9 }); // Mocking safety/rating for now as they might not be in history

        // Extract unique destinations
        const destinations = history
          .filter((h: any) => h.dropoffAddress)
          .map((h: any) => ({
            name: h.dropoffAddress.split(',')[0],
            address: h.dropoffAddress,
            distance: "Unknown" // Backend doesn't store distance yet
          }));

        // Get unique ones
        const unique = destinations.filter((v: any, i: number, a: any) => a.findIndex((t: any) => (t.name === v.name)) === i).slice(0, 3);
        setRecentDestinations(unique);
      } catch (error) {
        console.error("Failed to fetch rider history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full">
      {/* Map using React-Leaflet */}
      <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-sm z-0">
        <MapContainer center={defaultPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={defaultPosition}>
            <Popup>You are here</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="font-serif text-2xl font-normal text-charcoal">{stats.trips}</p>
          <p className="mt-1 font-sans text-xs text-muted-foreground">Trips</p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="font-serif text-2xl font-normal text-charcoal">{stats.safety}</p>
          <p className="mt-1 font-sans text-xs text-muted-foreground">Avg Safety</p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="font-serif text-2xl font-normal text-charcoal">{stats.rating}</p>
          <p className="mt-1 font-sans text-xs text-muted-foreground">Rating</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Search */}
        <div>
          <h2 className="font-serif text-xl font-normal text-charcoal">Where to?</h2>
          
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-cream-400 bg-white px-4 shadow-sm mb-3">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Pickup Location"
              className="h-12 flex-1 bg-transparent font-sans text-sm text-charcoal outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-cream-400 bg-white px-4 shadow-sm">
            <SearchIcon className="h-5 w-5 text-sage-500" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              className="h-12 flex-1 bg-transparent font-sans text-sm text-charcoal outline-none placeholder:text-muted-foreground"
            />
          </div>
          
          <Button
            onClick={() => navigate("/rider/route", { state: { pickup, destination } })}
            disabled={!destination || !pickup}
            className="mt-4 h-auto w-full rounded-2xl bg-sage-500 py-4 font-sans text-base font-bold text-white shadow-lg hover:bg-sage-600 disabled:opacity-50"
          >
            Find Routes
          </Button>
        </div>

        {/* Recent destinations */}
        <div>
          <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-terracotta-600">
            Recent Destinations
          </h3>
          <div className="mt-3 space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : recentDestinations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent destinations found.</p>
            ) : (
              recentDestinations.map((dest) => (
                <button
                  key={dest.name}
                  onClick={() => {
                    setDestination(dest.name);
                    navigate("/rider/route", { state: { pickup, destination: dest.name } });
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm tap-scale transition-colors hover:bg-cream-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-500/10">
                    <NavigationIcon className="h-5 w-5 text-sage-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-sans text-sm font-bold text-charcoal">{dest.name}</p>
                    <p className="truncate font-sans text-xs text-muted-foreground">{dest.address}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Safety banner */}
      <div className="mt-8 flex items-center gap-4 rounded-2xl bg-sage-500/5 p-5">
        <ShieldIcon className="h-10 w-10 shrink-0 text-sage-500" />
        <div>
          <p className="font-sans text-base font-bold text-charcoal">Safety-first routing</p>
          <p className="font-sans text-sm text-muted-foreground mt-1">Choose the safest route option on every trip.</p>
        </div>
      </div>
    </div>
  );
};
