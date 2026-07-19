import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Navigation as NavigationIcon,
  Search as SearchIcon,
  Shield as ShieldIcon,
  AlertCircle,
  Car as CarIcon,
  MapPin,
  RefreshCw,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { rideService } from "../../services/ride.service";
import { locationService } from "../../services/location.service";
import { useGeolocation } from "../../hooks/useGeolocation";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Custom Leaflet Icons for clean look
const riderIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const dropoffIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const driverIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Helper component to auto-pan the map when markers change
const MapController = ({ center, dropoff, isInitialLocationKnown }: { center: [number, number]; dropoff: [number, number] | null; isInitialLocationKnown: boolean }) => {
  const map = useMap();
  const hasPannedToInitial = useRef(false);

  useEffect(() => {
    if (dropoff) {
      const bounds = L.latLngBounds([center, dropoff]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (isInitialLocationKnown && !hasPannedToInitial.current) {
      map.setView(center, 14);
      hasPannedToInitial.current = true;
    }
  }, [center, dropoff, map, isInitialLocationKnown]);
  return null;
};

// Normalizes whatever shape the backend returns into a plain array.
// Handles: raw array, { drivers: [...] }, { data: [...] }, null/undefined.
function normalizeDrivers(res: any): any[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.drivers)) return res.drivers;
  if (Array.isArray(res?.data)) return res.data;
  console.warn("Unexpected nearbyDrivers response shape:", res);
  return [];
}

export const RiderHome = () => {
  const navigate = useNavigate();

  // Geolocation and map state
  const { lat, lng, loading: geoLoading, error: geoError } = useGeolocation();

  const [pickup, setPickup] = useState("Acquiring location...");
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState("");
  const [dropoffCoords, setDropoffCoords] = useState<[number, number] | null>(null);

  const [stats, setStats] = useState({ trips: 0, safety: 95, rating: 5.0 });
  const [recentDestinations, setRecentDestinations] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeRide, setActiveRide] = useState<any | null>(null);

  // Nearby drivers & address suggestions
  const [nearbyDrivers, setNearbyDrivers] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [reverseGeocoding, setReverseGeocoding] = useState(false);

  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [pickupSuggestionsLoading, setPickupSuggestionsLoading] = useState(false);
  const isPickupManuallyEdited = useRef(false);

  // Default coordinate (New Delhi)
  const defaultPosition: [number, number] = [28.6139, 77.209];
  const initialMapCenter = useRef<[number, number] | null>(null);

  if (!initialMapCenter.current && pickupCoords) {
    initialMapCenter.current = pickupCoords;
  }

  const mapCenter: [number, number] = initialMapCenter.current || defaultPosition;

  // Handle geolocation updates
  useEffect(() => {
    if (lat && lng) {
      if (!isPickupManuallyEdited.current) {
        const currentCoords: [number, number] = [lat, lng];
        setPickupCoords(currentCoords);

        const performReverseGeocode = async () => {
          setReverseGeocoding(true);
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            );
            if (response.ok) {
              const data = await response.json();
              const friendlyAddress = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
              setPickup(friendlyAddress);
            } else {
              setPickup(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
            }
          } catch (err) {
            console.error("Reverse geocoding failed:", err);
            setPickup(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          } finally {
            setReverseGeocoding(false);
          }
        };

        performReverseGeocode();
      }
    } else if (!geoLoading && geoError) {
      if (!isPickupManuallyEdited.current) {
        setPickup("Enter your pickup address...");
      }
    }
  }, [lat, lng, geoLoading, geoError]);

  // Poll nearby drivers in real-time every 5 seconds
  useEffect(() => {
    if (!lat || !lng) return;

    const fetchDrivers = async () => {
      try {
        const res = await locationService.getNearestDrivers(lat, lng);
        setNearbyDrivers(normalizeDrivers(res));
      } catch (err) {
        console.error("Failed to load nearby drivers:", err);
      }
    };

    fetchDrivers();
    const interval = setInterval(fetchDrivers, 5000);
    return () => clearInterval(interval);
  }, [lat, lng]);

  // Fetch recent trips on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await rideService.getRideHistory();
        const history = res.rideHistory || [];
        const completed = history.filter((h: any) => h.status === "COMPLETED");

        setStats({
          trips: completed.length,
          safety: completed.length > 0 ? 94 : 95,
          rating: 4.9,
        });

        const destinations = history
          .filter((h: any) => h.dropoffAddress)
          .map((h: any) => ({
            name: h.dropoffAddress.split(",")[0],
            address: h.dropoffAddress,
            dropoffLat: h.dropoffLat,
            dropoffLng: h.dropoffLng,
            distance: h.distance ? `${h.distance} km` : "Unknown",
          }));

        const unique = destinations
          .filter((v: any, i: number, a: any) => a.findIndex((t: any) => t.name === v.name) === i)
          .slice(0, 3);
        setRecentDestinations(unique);

        // Check for active rides (REQUESTED, ACCEPTED, IN_PROGRESS)
        const active = history.find((h: any) =>
          ["REQUESTED", "ACCEPTED", "IN_PROGRESS"].includes(h.status)
        );
        setActiveRide(active || null);
      } catch (error) {
        console.error("Failed to fetch rider history", error);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle typing destination & autocomplete suggestions
  const handleDestinationChange = async (val: string) => {
    setDestination(val);
    if (val.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setSuggestionsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5`
      );
      if (response.ok) {
        const data = await response.json();
        setSuggestions(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Suggestions fetch error:", err);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleSelectSuggestion = (sug: any) => {
    setDestination(sug.display_name);
    setDropoffCoords([parseFloat(sug.lat), parseFloat(sug.lon)]);
    setSuggestions([]);
  };

  const handlePickupChange = async (val: string) => {
    setPickup(val);
    isPickupManuallyEdited.current = true;
    if (val.trim().length < 3) {
      setPickupSuggestions([]);
      return;
    }
    setPickupSuggestionsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5`
      );
      if (response.ok) {
        const data = await response.json();
        setPickupSuggestions(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Pickup suggestions fetch error:", err);
    } finally {
      setPickupSuggestionsLoading(false);
    }
  };

  const handleSelectPickupSuggestion = (sug: any) => {
    setPickup(sug.display_name);
    const coords: [number, number] = [parseFloat(sug.lat), parseFloat(sug.lon)];
    setPickupCoords(coords);
    initialMapCenter.current = coords;
    setPickupSuggestions([]);
  };

  const handleFindRoutes = () => {
    if (!pickupCoords) {
      alert("Please wait for your pickup location to be resolved.");
      return;
    }
    if (!dropoffCoords) {
      alert("Please select a dropoff location from the search suggestions.");
      return;
    }

    navigate("/rider/route", {
      state: {
        pickup,
        destination,
        pickupLat: pickupCoords[0],
        pickupLng: pickupCoords[1],
        dropoffLat: dropoffCoords[0],
        dropoffLng: dropoffCoords[1],
      },
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full lg:h-[calc(100vh-100px)] min-h-0">
      {/* Map on the left side */}
      <div className="w-full lg:w-1/2 h-[350px] lg:h-full relative overflow-hidden rounded-3xl border border-gray-200 shadow-sm z-0 shrink-0">
        {geoLoading ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-white gap-3">
            <RefreshCw className="h-8 w-8 text-charcoal animate-spin" />
            <p className="font-sans text-sm text-muted-foreground animate-pulse">Locating you...</p>
          </div>
        ) : (
          <MapContainer
            center={mapCenter}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            <MapController center={pickupCoords || mapCenter} dropoff={dropoffCoords} isInitialLocationKnown={!!pickupCoords} />

            {pickupCoords && (
              <Marker position={pickupCoords} icon={riderIcon}>
                <Popup>
                  <div className="font-sans text-xs">
                    <strong>Pickup:</strong>
                    <br />
                    {pickup}
                  </div>
                </Popup>
              </Marker>
            )}

            {dropoffCoords && (
              <Marker position={dropoffCoords} icon={dropoffIcon}>
                <Popup>
                  <div className="font-sans text-xs">
                    <strong>Dropoff:</strong>
                    <br />
                    {destination}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Guarded: only maps if nearbyDrivers is actually an array */}
            {Array.isArray(nearbyDrivers) &&
              nearbyDrivers.map((driver) => (
                <Marker key={driver.id} position={[driver.latitude, driver.longitude]} icon={driverIcon}>
                  <Popup>
                    <div className="font-sans text-xs flex items-center gap-1.5 p-1">
                      <CarIcon className="h-4 w-4 text-blue-600" />
                      <div>
                        <strong className="text-charcoal">Driver Partner</strong>
                        <p className="text-muted-foreground text-[10px] mt-0.5">Nearby & Online</p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        )}
      </div>

      {/* Scrollable content on the right side */}
      <div className="w-full lg:w-1/2 overflow-y-auto lg:pr-3 flex flex-col gap-6">
        {geoError && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-red-600 border border-red-200 animate-fade-in">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-sans text-xs">
              GPS Signal: {geoError}. Please input locations manually or permit location sharing.
            </span>
          </div>
        )}

      {/* Active Ride Banner */}
        {activeRide && (
          <div
            className={`rounded-2xl border p-4 shadow-sm mb-2 ${
              activeRide.status === "REQUESTED"
                ? "bg-yellow-50 border-yellow-300"
                : activeRide.status === "ACCEPTED"
                ? "bg-blue-50 border-blue-300"
                : "bg-green-50 border-green-300"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    activeRide.status === "REQUESTED"
                      ? "bg-yellow-500"
                      : activeRide.status === "ACCEPTED"
                      ? "bg-blue-500"
                      : "bg-green-600"
                  } text-white`}
                >
                  <CarIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-sans text-sm font-bold text-charcoal">
                    {activeRide.status === "REQUESTED"
                      ? "🔍 Finding your driver..."
                      : activeRide.status === "ACCEPTED"
                      ? "✅ Driver on the way!"
                      : "🚗 Ride in progress"}
                  </p>
                  <p className="font-sans text-xs text-muted-foreground truncate mt-0.5">
                    To: {activeRide.dropoffAddress?.split(",")[0] || "Destination"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (activeRide.status === "REQUESTED") {
                    navigate("/rider/matching", {
                      state: {
                        rideId: activeRide.id,
                        destination: activeRide.dropoffAddress,
                        pickupAddress: activeRide.pickupAddress,
                        pickupLat: activeRide.pickupLat,
                        pickupLng: activeRide.pickupLng,
                        dropoffLat: activeRide.dropoffLat,
                        dropoffLng: activeRide.dropoffLng,
                      },
                    });
                  } else {
                    navigate("/rider/ride", {
                      state: {
                        rideId: activeRide.id,
                        destination: activeRide.dropoffAddress,
                        pickupAddress: activeRide.pickupAddress,
                        pickupLat: activeRide.pickupLat,
                        pickupLng: activeRide.pickupLng,
                        dropoffLat: activeRide.dropoffLat,
                        dropoffLng: activeRide.dropoffLng,
                      },
                    });
                  }
                }}
                className="flex shrink-0 items-center gap-1 rounded-xl bg-black px-3 py-2 font-sans text-xs font-bold text-white hover:bg-gray-800 transition-colors"
              >
                Track <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white p-4 text-center border border-gray-200 shadow-sm">
            <p className="font-serif text-2xl font-normal text-charcoal">{stats.trips}</p>
            <p className="mt-1 font-sans text-xs text-muted-foreground">Trips</p>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center border border-gray-200 shadow-sm">
            <p className="font-serif text-2xl font-normal text-charcoal">{stats.safety}%</p>
            <p className="mt-1 font-sans text-xs text-muted-foreground">Avg Safety</p>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center border border-gray-200 shadow-sm">
            <p className="font-serif text-2xl font-normal text-charcoal">{stats.rating}</p>
            <p className="mt-1 font-sans text-xs text-muted-foreground">Rating</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 border border-gray-200 shadow-sm">
          <h2 className="font-serif text-xl font-normal text-charcoal mb-4">Request a Ride</h2>

          <div className="space-y-4">
            <div className="relative">
              <label className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Pickup Location
              </label>
              <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-cream-400 bg-white px-4 h-12 focus-within:border-black transition-colors">
                <MapPin className="h-5 w-5 text-green-600 shrink-0" />
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => handlePickupChange(e.target.value)}
                  placeholder="Search pickup address..."
                  className="flex-1 bg-transparent font-sans text-sm text-charcoal outline-none placeholder:text-muted-foreground truncate"
                />
                {(reverseGeocoding || pickupSuggestionsLoading) && <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin shrink-0" />}
              </div>

              {pickupSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 z-50 mt-1 rounded-xl border border-gray-200 bg-white shadow-lg max-h-52 overflow-y-auto">
                  {pickupSuggestions.map((sug) => (
                    <button
                      key={sug.place_id}
                      onClick={() => handleSelectPickupSuggestion(sug)}
                      className="w-full text-left px-4 py-2.5 hover:bg-cream-200 transition-colors border-b border-cream-100 last:border-0 font-sans text-xs text-charcoal truncate block"
                    >
                      {sug.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Where to?
              </label>
              <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-cream-400 bg-white px-4 h-12 focus-within:border-black transition-colors">
                <SearchIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  placeholder="Search destination address..."
                  className="flex-1 bg-transparent font-sans text-sm text-charcoal outline-none placeholder:text-muted-foreground"
                />
                {suggestionsLoading && <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin shrink-0" />}
              </div>

              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 z-50 mt-1 rounded-xl border border-gray-200 bg-white shadow-lg max-h-52 overflow-y-auto">
                  {suggestions.map((sug) => (
                    <button
                      key={sug.place_id}
                      onClick={() => handleSelectSuggestion(sug)}
                      className="w-full text-left px-4 py-2.5 hover:bg-cream-200 transition-colors border-b border-cream-100 last:border-0 font-sans text-xs text-charcoal truncate block"
                    >
                      {sug.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleFindRoutes}
              disabled={!dropoffCoords || !pickupCoords || geoLoading}
              className="mt-6 h-12 w-full rounded-xl bg-black text-white font-sans text-base font-bold shadow-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {geoLoading ? "Resolving coordinates..." : "Request Ride"}
            </Button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 border border-gray-200 shadow-sm">
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Recent Destinations
          </h3>
          <div className="space-y-3">
            {historyLoading ? (
              <div className="space-y-3">
                <div className="h-16 w-full rounded-xl bg-white animate-pulse" />
                <div className="h-16 w-full rounded-xl bg-white animate-pulse" />
              </div>
            ) : recentDestinations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent destinations found.</p>
            ) : (
              recentDestinations.map((dest) => (
                <button
                  key={dest.address}
                  onClick={() => {
                    setDestination(dest.address);
                    setDropoffCoords([dest.dropoffLat, dest.dropoffLng]);
                  }}
                  className="flex w-full items-center gap-3.5 rounded-xl border border-gray-200 bg-white p-3.5 text-left transition-colors hover:bg-cream-200"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-charcoal">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-sans text-sm font-bold text-charcoal">{dest.name}</p>
                    <p className="truncate font-sans text-xs text-muted-foreground mt-0.5">{dest.address}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-black/5 p-5 border border-gray-200">
          <ShieldIcon className="h-8 w-8 text-black shrink-0" />
          <div>
            <p className="font-sans text-sm font-bold text-charcoal">Safety-First Routing Engine</p>
            <p className="font-sans text-xs text-muted-foreground mt-0.5">
              SwiftRide evaluates road lighting, traffic congestion, and history on every single request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RiderHome;