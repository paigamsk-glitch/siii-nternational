import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Search, X, MapPin, Plane, Globe, Filter,
  ChevronDown, ZoomIn, ZoomOut, Maximize2, RotateCcw,
  ArrowRight, Clock, Ruler
} from "lucide-react";
import { Link } from "wouter";
import {
  AIRLINES, AIRPORTS, AIRLINE_ROUTES, Airport,
  getRouteDistance, getFlightTime, getMarkerColor
} from "@/data/aviation";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap } from "react-leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: "", iconUrl: "", shadowUrl: "" });

const COUNTRY_FLAGS: Record<string, string> = {
  "India": "🇮🇳", "UAE": "🇦🇪", "Qatar": "🇶🇦", "Singapore": "🇸🇬",
  "United Kingdom": "🇬🇧", "Germany": "🇩🇪", "France": "🇫🇷",
  "Turkey": "🇹🇷", "Thailand": "🇹🇭", "Malaysia": "🇲🇾",
  "USA": "🇺🇸", "Australia": "🇦🇺", "Japan": "🇯🇵", "China": "🇨🇳",
  "South Korea": "🇰🇷", "Brazil": "🇧🇷", "Canada": "🇨🇦",
  "Netherlands": "🇳🇱", "Switzerland": "🇨🇭", "Egypt": "🇪🇬",
  "Kenya": "🇰🇪", "South Africa": "🇿🇦", "Nepal": "🇳🇵",
  "Sri Lanka": "🇱🇰", "Bangladesh": "🇧🇩", "Pakistan": "🇵🇰",
  "Maldives": "🇲🇻", "Kuwait": "🇰🇼", "Oman": "🇴🇲",
  "Bahrain": "🇧🇭", "Saudi Arabia": "🇸🇦", "Mexico": "🇲🇽",
};

function greatCirclePoints(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
  numPoints = 50
): [number, number][] {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const φ1 = toRad(lat1), λ1 = toRad(lng1);
  const φ2 = toRad(lat2), λ2 = toRad(lng2);
  const d = 2 * Math.asin(Math.sqrt(
    Math.sin((φ2 - φ1) / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2
  ));
  if (d === 0) return [[lat1, lng1]];
  const pts: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    pts.push([toDeg(Math.atan2(z, Math.sqrt(x ** 2 + y ** 2))), toDeg(Math.atan2(y, x))]);
  }
  return pts;
}

function MapController({ resetKey }: { resetKey: number }) {
  const map = useMap();
  useEffect(() => { map.setView([20, 80], 3); }, [resetKey, map]);
  return null;
}

function ZoomControls() {
  const map = useMap();
  return (
    <div className="absolute top-3 right-3 z-[999] flex flex-col gap-1">
      {[
        { icon: ZoomIn, action: () => map.zoomIn(), title: "Zoom In" },
        { icon: ZoomOut, action: () => map.zoomOut(), title: "Zoom Out" },
      ].map(({ icon: Icon, action, title }) => (
        <button
          key={title} onClick={action} title={title}
          className="w-9 h-9 bg-white border border-border rounded-lg shadow-md flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Icon className="w-4 h-4 text-foreground" />
        </button>
      ))}
    </div>
  );
}

export function AirlineRoutes() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();

  const airline = AIRLINES.find(a => a.slug === params.slug);
  const rawRoutes = AIRLINE_ROUTES[params.slug] ?? [];

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"new" | "popular" | "longest" | "shortest">("new");
  const [countryFilter, setCountryFilter] = useState("all");
  const [selectedRoute, setSelectedRoute] = useState<{ origin: string; destination: string } | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [showColorGuide, setShowColorGuide] = useState(true);

  const enrichedRoutes = useMemo(() => {
    return rawRoutes.map(r => {
      const orig = AIRPORTS[r.origin];
      const dest = AIRPORTS[r.destination];
      if (!orig || !dest) return null;
      const dist = getRouteDistance(orig, dest);
      return { ...r, originAirport: orig, destAirport: dest, distance: dist, flightTime: getFlightTime(dist) };
    }).filter(Boolean) as Array<{
      origin: string; destination: string;
      originAirport: Airport; destAirport: Airport;
      distance: number; flightTime: string;
    }>;
  }, [rawRoutes]);

  const countries = useMemo(() => {
    const set = new Set<string>();
    enrichedRoutes.forEach(r => {
      set.add(r.originAirport.country);
      set.add(r.destAirport.country);
    });
    return Array.from(set).sort();
  }, [enrichedRoutes]);

  const airportRouteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    enrichedRoutes.forEach(r => {
      counts[r.origin] = (counts[r.origin] ?? 0) + 1;
      counts[r.destination] = (counts[r.destination] ?? 0) + 1;
    });
    return counts;
  }, [enrichedRoutes]);

  const usedAirports = useMemo(() => {
    const set = new Set<string>();
    enrichedRoutes.forEach(r => { set.add(r.origin); set.add(r.destination); });
    return Array.from(set).map(iata => AIRPORTS[iata]).filter(Boolean);
  }, [enrichedRoutes]);

  const filteredRoutes = useMemo(() => {
    let list = enrichedRoutes;
    if (countryFilter !== "all") {
      list = list.filter(r =>
        r.originAirport.country === countryFilter ||
        r.destAirport.country === countryFilter
      );
    }
    if (search.trim()) {
      const q = search.trim().toUpperCase();
      list = list.filter(r =>
        r.origin.includes(q) || r.destination.includes(q) ||
        r.originAirport.city.toUpperCase().includes(q) ||
        r.destAirport.city.toUpperCase().includes(q)
      );
    }
    switch (sortBy) {
      case "longest":  return [...list].sort((a, b) => b.distance - a.distance);
      case "shortest": return [...list].sort((a, b) => a.distance - b.distance);
      case "popular":  return [...list].sort((a, b) => (airportRouteCounts[b.origin] ?? 0) - (airportRouteCounts[a.origin] ?? 0));
      default:         return list;
    }
  }, [enrichedRoutes, search, sortBy, countryFilter, airportRouteCounts]);

  const countryRouteCount = useMemo(() => {
    const map: Record<string, number> = {};
    enrichedRoutes.forEach(r => {
      [r.originAirport.country, r.destAirport.country].forEach(c => {
        map[c] = (map[c] ?? 0) + 1;
      });
    });
    return map;
  }, [enrichedRoutes]);

  const topCountries = useMemo(() =>
    Object.entries(countryRouteCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8),
    [countryRouteCount]
  );

  if (!airline) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Airline not found</h2>
          <Link href="/airlines"><button className="text-primary underline">Back to Airlines</button></Link>
        </div>
      </div>
    );
  }

  const activeRoutes = selectedRoute
    ? enrichedRoutes.filter(r => r.origin === selectedRoute.origin && r.destination === selectedRoute.destination)
    : filteredRoutes;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-background">
      {/* Airline Header */}
      <div className="border-b border-border bg-white px-4 py-3 flex items-center gap-4 shrink-0">
        <button
          onClick={() => setLocation("/airlines")}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" /> Airlines
        </button>
        <div className="w-px h-6 bg-border" />
        <div className="w-10 h-10 bg-muted rounded-lg border border-border flex items-center justify-center overflow-hidden shrink-0">
          <img
            src={airline.logo} alt={airline.name}
            className="w-9 h-9 object-contain"
            onError={e => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-sm font-bold text-primary">${airline.iata}</span>`;
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-foreground text-base leading-tight">
            {airline.name} — route map
          </h1>
          <p className="text-xs text-muted-foreground">
            {COUNTRY_FLAGS[airline.country] || "🌐"} {airline.country} · {airline.iata} · {airline.alliance}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-5 text-center">
          {[
            { label: "Routes", value: filteredRoutes.length },
            { label: "Airports", value: usedAirports.length },
            { label: "Countries", value: countries.length },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-lg font-bold text-primary leading-none">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main layout: sidebar + map */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div className="w-72 shrink-0 border-r border-border bg-white flex flex-col overflow-hidden">
          {/* Search + Sort */}
          <div className="p-3 border-b border-border space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search routes, city, IATA…"
                className="w-full pl-8 pr-8 py-2 text-xs border border-border rounded-lg bg-background focus:border-primary focus:outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-2.5">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="flex-1 text-xs border border-border rounded-lg px-2 py-1.5 bg-background focus:border-primary focus:outline-none"
              >
                <option value="new">New Routes</option>
                <option value="popular">Most Popular</option>
                <option value="longest">Longest</option>
                <option value="shortest">Shortest</option>
              </select>
              <select
                value={countryFilter}
                onChange={e => setCountryFilter(e.target.value)}
                className="flex-1 text-xs border border-border rounded-lg px-2 py-1.5 bg-background focus:border-primary focus:outline-none"
              >
                <option value="all">All Countries</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Routes label */}
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <div className="flex gap-2">
              {(["new", "popular", "longest"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${sortBy === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{filteredRoutes.length} routes</span>
          </div>

          {/* Route List */}
          <div className="flex-1 overflow-y-auto">
            {filteredRoutes.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">No routes match your search.</div>
            ) : (
              filteredRoutes.map((route, i) => {
                const isActive = selectedRoute?.origin === route.origin && selectedRoute?.destination === route.destination;
                return (
                  <motion.div
                    key={`${route.origin}-${route.destination}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.02, 0.4) }}
                    onClick={() => setSelectedRoute(isActive ? null : { origin: route.origin, destination: route.destination })}
                    className={`px-3 py-2.5 border-b border-border cursor-pointer hover:bg-primary/5 transition-colors ${isActive ? "bg-primary/10 border-l-2 border-l-primary" : ""}`}
                  >
                    {/* flightsfrom.com style: flag IATA City ↔ City IATA flag */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-base leading-none">{COUNTRY_FLAGS[route.originAirport.country] || "🌐"}</span>
                      <span className="font-bold text-xs text-primary font-mono">{route.origin}</span>
                      <span className="text-xs text-foreground font-medium">{route.originAirport.city}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="text-xs text-foreground font-medium">{route.destAirport.city}</span>
                      <span className="font-bold text-xs text-primary font-mono">{route.destination}</span>
                      <span className="text-base leading-none">{COUNTRY_FLAGS[route.destAirport.country] || "🌐"}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-emerald-600 font-medium">↻ Is operating</span>
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><Clock className="w-2.5 h-2.5" /> {route.flightTime}</span>
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><Ruler className="w-2.5 h-2.5" /> {route.distance.toLocaleString()} km</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Countries breakdown */}
          <div className="border-t border-border p-3 max-h-52 overflow-y-auto">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Countries</p>
            {topCountries.map(([country, count]) => (
              <button
                key={country}
                onClick={() => setCountryFilter(countryFilter === country ? "all" : country)}
                className={`w-full flex items-center justify-between py-1.5 px-1 rounded-lg text-xs hover:bg-muted transition-colors ${countryFilter === country ? "bg-primary/10 text-primary font-semibold" : "text-foreground"}`}
              >
                <span className="flex items-center gap-1.5">
                  <span>{COUNTRY_FLAGS[country] || "🌐"}</span>
                  <span>{country}</span>
                </span>
                <span className="font-bold text-muted-foreground">{Math.floor(count / 2)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* MAP */}
        <div className="flex-1 relative">
          <MapContainer
            center={[20, 80]}
            zoom={3}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <MapController resetKey={resetKey} />
            <ZoomControls />

            {/* Route lines */}
            {activeRoutes.map(route => {
              const pts = greatCirclePoints(
                route.originAirport.lat, route.originAirport.lng,
                route.destAirport.lat, route.destAirport.lng
              );
              const isSelected = selectedRoute?.origin === route.origin && selectedRoute?.destination === route.destination;
              return (
                <Polyline
                  key={`${route.origin}-${route.destination}`}
                  positions={pts}
                  pathOptions={{
                    color: isSelected ? "hsl(var(--primary))" : "#e879f9",
                    weight: isSelected ? 2.5 : 1,
                    opacity: isSelected ? 0.9 : 0.45,
                  }}
                  eventHandlers={{
                    click: () => setSelectedRoute(isSelected ? null : { origin: route.origin, destination: route.destination }),
                  }}
                >
                  <Popup>
                    <div className="text-xs min-w-[180px]">
                      <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                        <span>{route.origin}</span>
                        <ArrowRight className="w-3 h-3" />
                        <span>{route.destination}</span>
                      </div>
                      <p className="text-muted-foreground">{route.originAirport.city} → {route.destAirport.city}</p>
                      <div className="mt-2 flex gap-3">
                        <span className="flex items-center gap-1"><Ruler className="w-3 h-3 text-primary" /> {route.distance.toLocaleString()} km</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary" /> {route.flightTime}</span>
                      </div>
                    </div>
                  </Popup>
                </Polyline>
              );
            })}

            {/* Airport markers */}
            {usedAirports.map(airport => {
              const count = airportRouteCounts[airport.iata] ?? 0;
              const color = getMarkerColor(count);
              const isSelected = selectedAirport === airport.iata;
              const showInFilter = countryFilter === "all" || airport.country === countryFilter;
              if (!showInFilter) return null;
              return (
                <CircleMarker
                  key={airport.iata}
                  center={[airport.lat, airport.lng]}
                  radius={isSelected ? 10 : count > 20 ? 8 : count > 10 ? 6 : 5}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.85,
                    color: "#ffffff",
                    weight: 1.5,
                  }}
                  eventHandlers={{
                    click: () => setSelectedAirport(isSelected ? null : airport.iata),
                  }}
                >
                  <Popup>
                    <div className="text-xs min-w-[200px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-primary">{airport.iata}</span>
                        <div>
                          <p className="font-bold text-sm leading-tight">{airport.city}</p>
                          <p className="text-muted-foreground">{airport.country}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{airport.name}</p>
                      <p className="font-semibold text-primary">{count} Route{count !== 1 ? "s" : ""}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Map controls overlay */}
          <div className="absolute top-3 left-3 z-[999] flex flex-col gap-2">
            <button
              onClick={() => setResetKey(k => k + 1)}
              className="flex items-center gap-1.5 bg-white border border-border rounded-lg px-3 py-1.5 text-xs font-medium shadow-md hover:bg-muted transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset map
            </button>
            {selectedRoute && (
              <button
                onClick={() => setSelectedRoute(null)}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground border border-primary rounded-lg px-3 py-1.5 text-xs font-medium shadow-md hover:bg-primary/90 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear selection
              </button>
            )}
          </div>

          {/* Color guide */}
          {showColorGuide && (
            <div className="absolute bottom-6 left-3 z-[999] bg-white border border-border rounded-xl shadow-lg p-3 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">Color guide</span>
                <button onClick={() => setShowColorGuide(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              </div>
              {[
                { color: "#22c55e", label: ">100 routes" },
                { color: "#3b82f6", label: "36–100 routes" },
                { color: "#f97316", label: "6–35 routes" },
                { color: "#9ca3af", label: "<6 routes" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2 py-0.5">
                  <span className="w-3 h-3 rounded-full border border-white shadow-sm shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
