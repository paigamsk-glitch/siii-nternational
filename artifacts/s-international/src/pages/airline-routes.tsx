import { useState, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Search, X, Plane, Clock, Ruler, ArrowRight,
  RotateCcw, ZoomIn, ZoomOut, Info, LayoutGrid, ChevronRight
} from "lucide-react";
import { Link } from "wouter";
import {
  AIRLINES, AIRPORTS, AIRLINE_ROUTES, Airport,
  getRouteDistance, getFlightTime, getMarkerColor
} from "@/data/aviation";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";

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

const AIRLINE_ICAO: Record<string, string> = {
  "indigo": "IGO", "air-india": "AIC", "emirates": "UAE",
  "qatar-airways": "QTR", "singapore-airlines": "SIA", "british-airways": "BAW",
  "lufthansa": "DLH", "etihad": "ETD", "air-france": "AFR",
  "turkish-airlines": "THY", "thai-airways": "THA", "malaysia-airlines": "MAS",
};

function greatCirclePoints(lat1: number, lng1: number, lat2: number, lng2: number, n = 50): [number, number][] {
  const toR = (d: number) => (d * Math.PI) / 180;
  const toD = (r: number) => (r * 180) / Math.PI;
  const φ1 = toR(lat1), λ1 = toR(lng1), φ2 = toR(lat2), λ2 = toR(lng2);
  const d = 2 * Math.asin(Math.sqrt(Math.sin((φ2 - φ1) / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2));
  if (d === 0) return [[lat1, lng1]];
  return Array.from({ length: n + 1 }, (_, i) => {
    const f = i / n, A = Math.sin((1 - f) * d) / Math.sin(d), B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    return [toD(Math.atan2(z, Math.sqrt(x ** 2 + y ** 2))), toD(Math.atan2(y, x))];
  });
}

function MapController({ center, zoom, resetKey }: { center: [number, number]; zoom: number; resetKey: number }) {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom); }, [resetKey, center, zoom]);
  return null;
}

function ZoomControls({ onReset }: { onReset: () => void }) {
  const map = useMap();
  return (
    <div className="absolute top-3 right-3 z-[999] flex flex-col gap-1">
      <button onClick={() => map.zoomIn()} className="w-9 h-9 bg-white border border-border rounded-lg shadow-md flex items-center justify-center hover:bg-muted transition-colors"><ZoomIn className="w-4 h-4" /></button>
      <button onClick={() => map.zoomOut()} className="w-9 h-9 bg-white border border-border rounded-lg shadow-md flex items-center justify-center hover:bg-muted transition-colors"><ZoomOut className="w-4 h-4" /></button>
    </div>
  );
}

type SidebarTab = "info" | "airports";

export function AirlineRoutes() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();

  const airline = AIRLINES.find(a => a.slug === params.slug);
  const rawRoutes = AIRLINE_ROUTES[params.slug] ?? [];

  // sidebar tabs
  const [tab, setTab] = useState<SidebarTab>("info");

  // info tab state
  const [routeSort, setRouteSort] = useState<"new" | "popular" | "longest">("new");
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [selectedRoute, setSelectedRoute] = useState<{ origin: string; destination: string } | null>(null);

  // airport tab state
  const [airportSearch, setAirportSearch] = useState("");
  const [airportSort, setAirportSort] = useState("standard");

  // airport destination view
  const [focusedAirport, setFocusedAirport] = useState<string | null>(null);
  const [destSearch, setDestSearch] = useState("");

  // map state
  const [resetKey, setResetKey] = useState(0);
  const [showColorGuide, setShowColorGuide] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 80]);
  const [mapZoom, setMapZoom] = useState(3);

  const enrichedRoutes = useMemo(() => {
    return rawRoutes.map(r => {
      const orig = AIRPORTS[r.origin], dest = AIRPORTS[r.destination];
      if (!orig || !dest) return null;
      const dist = getRouteDistance(orig, dest);
      return { ...r, originAirport: orig, destAirport: dest, distance: dist, flightTime: getFlightTime(dist) };
    }).filter(Boolean) as Array<{
      origin: string; destination: string; originAirport: Airport; destAirport: Airport; distance: number; flightTime: string;
    }>;
  }, [rawRoutes]);

  const airportRouteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    enrichedRoutes.forEach(r => {
      counts[r.origin] = (counts[r.origin] ?? 0) + 1;
      counts[r.destination] = (counts[r.destination] ?? 0) + 1;
    });
    return counts;
  }, [enrichedRoutes]);

  // per-airport destinations (outbound only)
  const airportDestinations = useMemo(() => {
    const map: Record<string, string[]> = {};
    enrichedRoutes.forEach(r => {
      if (!map[r.origin]) map[r.origin] = [];
      map[r.origin].push(r.destination);
    });
    return map;
  }, [enrichedRoutes]);

  const usedAirports = useMemo(() => {
    const set = new Set<string>();
    enrichedRoutes.forEach(r => { set.add(r.origin); set.add(r.destination); });
    return Array.from(set).map(iata => AIRPORTS[iata]).filter(Boolean);
  }, [enrichedRoutes]);

  const countryRouteMap = useMemo(() => {
    const map: Record<string, number> = {};
    enrichedRoutes.forEach(r => {
      [r.originAirport.country, r.destAirport.country].forEach(c => { map[c] = (map[c] ?? 0) + 1; });
    });
    return map;
  }, [enrichedRoutes]);

  const sortedCountries = useMemo(() =>
    Object.entries(countryRouteMap).sort(([, a], [, b]) => b - a), [countryRouteMap]);

  const hubs = useMemo(() => {
    return Object.entries(airportDestinations)
      .map(([iata, dests]) => ({ iata, airport: AIRPORTS[iata], dests: dests.length }))
      .filter(h => h.airport)
      .sort((a, b) => b.dests - a.dests)
      .slice(0, 8);
  }, [airportDestinations]);

  // filtered routes for display + map
  const filteredRoutes = useMemo(() => {
    let list = enrichedRoutes;
    if (countryFilter !== "all") {
      list = list.filter(r => r.originAirport.country === countryFilter || r.destAirport.country === countryFilter);
    }
    if (focusedAirport) {
      list = list.filter(r => r.origin === focusedAirport || r.destination === focusedAirport);
    }
    if (search.trim()) {
      const q = search.trim().toUpperCase();
      list = list.filter(r =>
        r.origin.includes(q) || r.destination.includes(q) ||
        r.originAirport.city.toUpperCase().includes(q) || r.destAirport.city.toUpperCase().includes(q)
      );
    }
    switch (routeSort) {
      case "longest":  return [...list].sort((a, b) => b.distance - a.distance);
      case "popular":  return [...list].sort((a, b) => (airportRouteCounts[b.origin] ?? 0) - (airportRouteCounts[a.origin] ?? 0));
      default:         return list;
    }
  }, [enrichedRoutes, countryFilter, focusedAirport, search, routeSort, airportRouteCounts]);

  // airport tab list
  const sortedAirportList = useMemo(() => {
    let list = usedAirports.filter(a => {
      if (!airportSearch.trim()) return true;
      const q = airportSearch.trim().toUpperCase();
      return a.iata.includes(q) || a.city.toUpperCase().includes(q) || a.country.toUpperCase().includes(q);
    });
    switch (airportSort) {
      case "name-az":    return [...list].sort((a, b) => a.city.localeCompare(b.city));
      case "name-za":    return [...list].sort((a, b) => b.city.localeCompare(a.city));
      case "country-az": return [...list].sort((a, b) => a.country.localeCompare(b.country));
      case "country-za": return [...list].sort((a, b) => b.country.localeCompare(a.country));
      default: return [...list].sort((a, b) => (airportRouteCounts[b.iata] ?? 0) - (airportRouteCounts[a.iata] ?? 0));
    }
  }, [usedAirports, airportSearch, airportSort, airportRouteCounts]);

  // focused airport destinations
  const focusedAirportData = focusedAirport ? AIRPORTS[focusedAirport] : null;
  const focusedDests = useMemo(() => {
    if (!focusedAirport) return [];
    return enrichedRoutes
      .filter(r => r.origin === focusedAirport || r.destination === focusedAirport)
      .map(r => r.origin === focusedAirport ? r : { ...r, originAirport: r.destAirport, destAirport: r.originAirport, origin: r.destination, destination: r.origin })
      .filter(r => {
        if (!destSearch.trim()) return true;
        const q = destSearch.trim().toUpperCase();
        return r.destination.includes(q) || r.destAirport.city.toUpperCase().includes(q);
      })
      .sort((a, b) => a.distance - b.distance);
  }, [focusedAirport, enrichedRoutes, destSearch]);

  const flightsPerDay = (dist: number) => {
    if (dist < 400) return "8-12 flights per day";
    if (dist < 1000) return "5-8 flights per day";
    if (dist < 2000) return "3-5 flights per day";
    if (dist < 5000) return "1-3 flights per day";
    return "1-2 flights per day";
  };

  const hubRank = (iata: string) => {
    const sorted = hubs.map(h => h.iata);
    const idx = sorted.indexOf(iata);
    if (idx === 0) return "primary";
    if (idx < 3) return "hub";
    return null;
  };

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

  const mapRoutesToShow = selectedRoute
    ? filteredRoutes.filter(r => r.origin === selectedRoute.origin && r.destination === selectedRoute.destination)
    : filteredRoutes;

  const handleCountryClick = (country: string) => {
    setCountryFilter(prev => prev === country ? "all" : country);
    setFocusedAirport(null);
    setSelectedRoute(null);
  };

  const handleAirportFocus = (iata: string) => {
    setFocusedAirport(prev => prev === iata ? null : iata);
    setSelectedRoute(null);
    setCountryFilter("all");
    const ap = AIRPORTS[iata];
    if (ap) { setMapCenter([ap.lat, ap.lng]); setMapZoom(4); setResetKey(k => k + 1); }
  };

  const handleMarkerClick = (iata: string) => {
    handleAirportFocus(iata);
    setTab("info");
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-background">
      {/* Airline Header */}
      <div className="border-b border-border bg-white px-4 py-2.5 flex items-center gap-3 shrink-0">
        <button onClick={() => setLocation("/airlines")} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors shrink-0">
          <ArrowLeft className="w-4 h-4" /> Airlines
        </button>
        <div className="w-px h-5 bg-border" />
        <div className="w-9 h-9 bg-muted rounded-lg border border-border flex items-center justify-center overflow-hidden shrink-0">
          <img src={airline.logo} alt={airline.name} className="w-8 h-8 object-contain"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-xs font-bold text-primary">${airline.iata}</span>`; }} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-foreground text-sm leading-tight">{airline.name} — route map</h1>
          <p className="text-xs text-muted-foreground">{COUNTRY_FLAGS[airline.country] || "🌐"} {airline.country} · {airline.iata} · {airline.alliance}</p>
        </div>
        <div className="hidden md:flex items-center gap-4 text-center shrink-0">
          {[
            { label: "Routes", value: filteredRoutes.length },
            { label: "Airports", value: usedAirports.length },
            { label: "Countries", value: Object.keys(countryRouteMap).length },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-base font-bold text-primary leading-none">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <div className="w-72 shrink-0 border-r border-border bg-white flex flex-col overflow-hidden">

          {/* ── INFO TAB ── */}
          {tab === "info" && (
            <div className="flex-1 overflow-y-auto">
              {/* Search + Sort bar (sticky) */}
              <div className="sticky top-0 z-10 bg-white border-b border-border p-2.5 space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); setFocusedAirport(null); }}
                    placeholder="Search city, IATA code…"
                    className="w-full pl-8 pr-7 py-1.5 text-xs border border-border rounded-lg bg-background focus:border-primary focus:outline-none"
                  />
                  {search && <button onClick={() => setSearch("")} className="absolute right-2 top-2.5"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>}
                </div>
                {countryFilter !== "all" && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      {COUNTRY_FLAGS[countryFilter]} {countryFilter}
                      <button onClick={() => setCountryFilter("all")}><X className="w-3 h-3" /></button>
                    </span>
                  </div>
                )}
                {focusedAirport && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="bg-secondary/10 text-secondary font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      ✈ {focusedAirport} — {AIRPORTS[focusedAirport]?.city}
                      <button onClick={() => { setFocusedAirport(null); setResetKey(k => k + 1); setMapCenter([20, 80]); setMapZoom(3); }}><X className="w-3 h-3" /></button>
                    </span>
                  </div>
                )}
              </div>

              {/* ── AIRPORT DESTINATION VIEW ── */}
              {focusedAirport ? (
                <div>
                  <div className="px-3 py-3 border-b border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Destinations from {focusedAirportData?.city} ({focusedAirport})
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{focusedDests.length} destinations</p>
                    <div className="relative mt-2">
                      <Search className="absolute left-2.5 top-2 w-3 h-3 text-muted-foreground" />
                      <input value={destSearch} onChange={e => setDestSearch(e.target.value)}
                        placeholder="Search destination…"
                        className="w-full pl-7 pr-3 py-1.5 text-xs border border-border rounded-lg bg-background focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                  {focusedDests.map((r, i) => (
                    <div key={r.destination + i} className="px-3 py-2.5 border-b border-border hover:bg-muted/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span>{COUNTRY_FLAGS[r.destAirport.country] || "🌐"}</span>
                          <div>
                            <p className="text-xs font-bold text-foreground">{r.destAirport.city} <span className="text-primary font-mono">{r.destination}</span></p>
                            <p className="text-xs text-muted-foreground">{flightsPerDay(r.distance)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-foreground">{r.flightTime}</p>
                          <span className="inline-block text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono mt-0.5">{airline.iata}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* ── ROUTES SECTION ── */}
                  <div className="px-3 pt-3 pb-1">
                    <p className="font-bold text-foreground text-sm">Routes</p>
                    <div className="flex gap-1 mt-2 border-b border-border pb-2">
                      {(["new", "popular", "longest"] as const).map(s => (
                        <button key={s} onClick={() => setRouteSort(s)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors border ${routeSort === s ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-transparent hover:bg-muted"}`}>
                          {s.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Routes {routeSort === "new" ? "launched" : routeSort === "popular" ? "ranked" : "sorted"} by {airline.name}.
                    </p>
                  </div>

                  {filteredRoutes.map((route, i) => {
                    const isActive = selectedRoute?.origin === route.origin && selectedRoute?.destination === route.destination;
                    return (
                      <div key={`${route.origin}-${route.destination}-${i}`}
                        onClick={() => setSelectedRoute(isActive ? null : { origin: route.origin, destination: route.destination })}
                        className={`px-3 py-2 border-b border-border cursor-pointer hover:bg-primary/5 transition-colors ${isActive ? "bg-primary/10 border-l-2 border-l-primary" : ""}`}>
                        <div className="flex items-center gap-1 flex-wrap text-xs">
                          <span>{COUNTRY_FLAGS[route.originAirport.country] || "🌐"}</span>
                          <span className="font-mono font-bold text-primary">{route.origin}</span>
                          <span className="text-foreground font-medium">{route.originAirport.city}</span>
                          <span className="text-muted-foreground">↔</span>
                          <span className="text-foreground font-medium">{route.destAirport.city}</span>
                          <span className="font-mono font-bold text-primary">{route.destination}</span>
                          <span>{COUNTRY_FLAGS[route.destAirport.country] || "🌐"}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                          <span className="text-emerald-600 font-medium">↻ Is operating</span>
                          <span><Clock className="inline w-2.5 h-2.5 mr-0.5" />{route.flightTime}</span>
                          <span><Ruler className="inline w-2.5 h-2.5 mr-0.5" />{route.distance.toLocaleString()} km</span>
                        </div>
                      </div>
                    );
                  })}

                  {filteredRoutes.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm px-3">No routes match your search.</div>
                  )}

                  {/* ── COUNTRIES SECTION ── */}
                  <div className="px-3 pt-4 pb-1 border-t border-border mt-1">
                    <p className="font-bold text-foreground text-sm">Countries</p>
                    <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                      The most popular destination countries with {airline.name} ordered by total passenger capacity.
                    </p>
                  </div>
                  {sortedCountries.map(([country, count]) => (
                    <button key={country} onClick={() => handleCountryClick(country)}
                      className={`w-full flex items-center justify-between px-3 py-2 border-b border-border/50 hover:bg-muted/50 transition-colors text-xs ${countryFilter === country ? "bg-primary/10" : ""}`}>
                      <span className="flex items-center gap-2">
                        <span className="text-sm">{COUNTRY_FLAGS[country] || "🌐"}</span>
                        <span className={`font-medium ${countryFilter === country ? "text-primary font-semibold" : "text-foreground"}`}>{country}</span>
                      </span>
                      <span className="text-muted-foreground font-semibold">{Math.floor(count / 2)} routes</span>
                    </button>
                  ))}

                  {/* ── HUBS SECTION ── */}
                  <div className="px-3 pt-4 pb-1 border-t border-border mt-1">
                    <p className="font-bold text-foreground text-sm">Hubs</p>
                    <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                      Key hubs and focus cities in the {airline.name} route network.
                    </p>
                  </div>
                  {hubs.map(h => (
                    <button key={h.iata} onClick={() => handleAirportFocus(h.iata)}
                      className="w-full flex items-center justify-between px-3 py-2 border-b border-border/50 hover:bg-muted/50 transition-colors text-xs">
                      <span className="flex items-center gap-2">
                        <span className="text-sm">{COUNTRY_FLAGS[h.airport.country] || "🌐"}</span>
                        <span className="font-mono text-primary font-bold">{h.iata}</span>
                        <span className="text-foreground font-medium">{h.airport.city}</span>
                      </span>
                      <span className="text-muted-foreground font-semibold">{h.dests} destinations</span>
                    </button>
                  ))}

                  {/* ── AIRLINE INFO BOX ── */}
                  <div className="mx-3 my-4 border border-border rounded-xl p-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                    {[
                      ["IATA code", airline.iata],
                      ["Airports", usedAirports.length.toString()],
                      ["ICAO code", AIRLINE_ICAO[airline.slug] ?? "—"],
                      ["Countries", Object.keys(countryRouteMap).length.toString()],
                      ["Alliance", airline.alliance],
                      ["Routes", filteredRoutes.length.toString()],
                      ["Origin", airline.country],
                      ["Flights/day", airline.dailyFlights.toLocaleString()],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <span className="text-muted-foreground">{label}: </span>
                        <span className="font-semibold text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-border px-3 py-3 text-xs text-muted-foreground text-center">
                    Home · Privacy Policy · About us
                    <div className="mt-1 text-primary font-bold">S International</div>
                    <div className="mt-0.5">© 2017–2026 S International</div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── AIRPORTS TAB ── */}
          {tab === "airports" && (
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white border-b border-border px-3 py-2.5 space-y-2">
                <p className="text-xs font-bold text-foreground uppercase tracking-wider">{airline.name.toUpperCase()} DESTINATIONS</p>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 w-3 h-3 text-muted-foreground" />
                  <input value={airportSearch} onChange={e => setAirportSearch(e.target.value)}
                    placeholder="Search airport…"
                    className="w-full pl-7 pr-3 py-1.5 text-xs border border-border rounded-lg bg-background focus:border-primary focus:outline-none" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">Sort:</span>
                  <select value={airportSort} onChange={e => setAirportSort(e.target.value)}
                    className="flex-1 text-xs border border-border rounded-lg px-2 py-1 bg-background focus:border-primary focus:outline-none">
                    <option value="standard">Standard</option>
                    <option value="name-az">Name A-Z</option>
                    <option value="name-za">Name Z-A</option>
                    <option value="country-az">Country A-Z</option>
                    <option value="country-za">Country Z-A</option>
                  </select>
                </div>
              </div>

              {sortedAirportList.map((airport, i) => {
                const dests = airportDestinations[airport.iata]?.length ?? 0;
                const rank = hubRank(airport.iata);
                const totalRoutes = airportRouteCounts[airport.iata] ?? 0;
                const fpd = totalRoutes * 3;
                return (
                  <button key={airport.iata} onClick={() => handleAirportFocus(airport.iata)}
                    className="w-full flex items-center justify-between px-3 py-2.5 border-b border-border hover:bg-primary/5 transition-colors text-xs">
                    <div className="text-left">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span>{COUNTRY_FLAGS[airport.country] || "🌐"}</span>
                        <span className="font-mono font-bold text-primary">{airport.iata}</span>
                        <span className="font-semibold text-foreground">{airport.city}</span>
                        {rank === "primary" && <span className="bg-amber-100 text-amber-700 text-xs px-1.5 py-0 rounded font-semibold">Primary hub</span>}
                        {rank === "hub" && <span className="bg-blue-50 text-blue-600 text-xs px-1.5 py-0 rounded font-semibold">Hub</span>}
                      </div>
                      <p className="text-muted-foreground">{Math.max(fpd - 5, 1)}-{fpd + 3} flights per day</p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="font-bold text-foreground">{dests > 0 ? dests : totalRoutes}</p>
                      <p className="text-muted-foreground">destinations</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── BOTTOM TAB BAR ── */}
          <div className="border-t-2 border-border bg-white shrink-0 flex">
            <button onClick={() => setTab("info")}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold transition-colors border-t-2 -mt-0.5 ${tab === "info" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <Info className="w-4 h-4" />
              Info
            </button>
            <button onClick={() => setTab("airports")}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold transition-colors border-t-2 -mt-0.5 ${tab === "airports" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <LayoutGrid className="w-4 h-4" />
              Airports
            </button>
          </div>
        </div>

        {/* ── MAP ── */}
        <div className="flex-1 relative">
          <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%" }} zoomControl={false} attributionControl={false}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <MapController center={mapCenter} zoom={mapZoom} resetKey={resetKey} />
            <ZoomControls onReset={() => { setResetKey(k => k + 1); setMapCenter([20, 80]); setMapZoom(3); }} />

            {/* Routes */}
            {mapRoutesToShow.map((route, idx) => {
              const pts = greatCirclePoints(route.originAirport.lat, route.originAirport.lng, route.destAirport.lat, route.destAirport.lng);
              const isSelected = selectedRoute?.origin === route.origin && selectedRoute?.destination === route.destination;
              const isFocused = focusedAirport === route.origin || focusedAirport === route.destination;
              return (
                <Polyline key={`${route.origin}-${route.destination}-${idx}`} positions={pts}
                  pathOptions={{ color: isSelected || isFocused ? "hsl(var(--primary))" : "#e879f9", weight: isSelected || isFocused ? 2.5 : 1, opacity: isSelected || isFocused ? 0.9 : 0.45 }}
                  eventHandlers={{ click: () => setSelectedRoute(isSelected ? null : { origin: route.origin, destination: route.destination }) }}>
                  <Popup>
                    <div className="text-xs min-w-[180px]">
                      <div className="flex items-center gap-2 mb-1 font-bold text-sm">
                        <span>{route.origin}</span><ArrowRight className="w-3 h-3" /><span>{route.destination}</span>
                      </div>
                      <p className="text-muted-foreground mb-2">{route.originAirport.city} → {route.destAirport.city}</p>
                      <div className="flex gap-3">
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
              const showInFilter = countryFilter === "all" || airport.country === countryFilter;
              if (!showInFilter) return null;
              const isFocused = focusedAirport === airport.iata;
              return (
                <CircleMarker key={airport.iata} center={[airport.lat, airport.lng]}
                  radius={isFocused ? 11 : count > 20 ? 8 : count > 10 ? 6 : 5}
                  pathOptions={{ fillColor: isFocused ? "hsl(var(--primary))" : getMarkerColor(count), fillOpacity: 0.85, color: "#ffffff", weight: 1.5 }}
                  eventHandlers={{ click: () => handleMarkerClick(airport.iata) }}>
                  <Popup>
                    <div className="text-xs min-w-[190px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl font-bold text-primary">{airport.iata}</span>
                        <div>
                          <p className="font-bold text-sm leading-tight">{airport.city}</p>
                          <p className="text-muted-foreground text-xs">{airport.country}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{airport.name}</p>
                      <p className="font-semibold text-primary">{count} Route{count !== 1 ? "s" : ""}</p>
                      <button onClick={() => handleAirportFocus(airport.iata)}
                        className="mt-2 text-xs bg-primary text-white px-2 py-1 rounded-lg w-full">
                        View Destinations
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Top-left controls */}
          <div className="absolute top-3 left-3 z-[999] flex flex-col gap-2">
            <button onClick={() => { setResetKey(k => k + 1); setMapCenter([20, 80]); setMapZoom(3); setCountryFilter("all"); setFocusedAirport(null); setSelectedRoute(null); }}
              className="flex items-center gap-1.5 bg-white border border-border rounded-lg px-3 py-1.5 text-xs font-medium shadow-md hover:bg-muted transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Reset map
            </button>
            {(countryFilter !== "all" || focusedAirport || selectedRoute) && (
              <button onClick={() => { setCountryFilter("all"); setFocusedAirport(null); setSelectedRoute(null); }}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-medium shadow-md">
                <X className="w-3.5 h-3.5" /> Clear filter
              </button>
            )}
          </div>

          {/* Color guide */}
          {showColorGuide && (
            <div className="absolute bottom-5 left-3 z-[999] bg-white border border-border rounded-xl shadow-lg p-3 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">Color guide</span>
                <button onClick={() => setShowColorGuide(false)}><X className="w-3 h-3 text-muted-foreground" /></button>
              </div>
              {[["#22c55e", ">100 routes"], ["#3b82f6", "36–100 routes"], ["#f97316", "6–35 routes"], ["#9ca3af", "<6 routes"]].map(([color, label]) => (
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
