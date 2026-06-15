import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Train, Search, MapPin, Clock, AlertCircle, CheckCircle2,
  Radio, RefreshCw, ChevronRight, Zap, ArrowRight,
  Navigation, Timer, Calendar, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  getLiveStatusTrains,
  type TrainLiveStatusResult, type LiveStopResult,
} from "@/lib/trainApi";
import { cn } from "@/lib/utils";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

async function fetchTrainLiveStatus(trainNumber: string): Promise<TrainLiveStatusResult | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/trains/live-status/${trainNumber.trim()}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success) return null;
    return json.data as TrainLiveStatusResult;
  } catch {
    return null;
  }
}

async function searchTrainsAPI(q: string): Promise<{ number: string; name: string; from: string; to: string }[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/trains/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success) return [];
    return json.data.map((t: any) => ({
      number: t.trainNumber,
      name: t.trainName,
      from: t.fromStation,
      to: t.toStation,
    }));
  } catch {
    return [];
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function DelayBadge({ mins }: { mins: number }) {
  if (mins === 0) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 rounded px-1.5 py-0.5">
      <CheckCircle2 className="w-2.5 h-2.5" /> On Time
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-600 rounded px-1.5 py-0.5">
      <AlertCircle className="w-2.5 h-2.5" /> +{mins} min{mins > 1 ? "s" : ""}
    </span>
  );
}

function StatusDot({ status }: { status: "departed" | "current" | "upcoming" }) {
  if (status === "departed") return (
    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center z-10 shrink-0">
      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
    </div>
  );
  if (status === "current") return (
    <div className="relative w-4 h-4 shrink-0 z-10">
      <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-60" />
      <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-lg" />
    </div>
  );
  return (
    <div className="w-4 h-4 rounded-full border-2 border-border bg-background z-10 shrink-0" />
  );
}

// ─── Station Row ──────────────────────────────────────────────────────────────
function StopRow({ stop, isLast }: { stop: LiveStopResult; isLast: boolean }) {
  const isCurrent = stop.status === "current";
  const isDeparted = stop.status === "departed";
  const isSource = !stop.scheduledArrival;
  const isDest = !stop.scheduledDeparture;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "relative flex gap-4 pb-0",
        isCurrent && "bg-orange-50/60 border border-orange-200 rounded-xl -mx-2 px-2 py-3",
      )}
    >
      {/* Vertical line */}
      {!isLast && (
        <div className={cn(
          "absolute left-[7px] top-4 bottom-0 w-0.5",
          isDeparted ? "bg-green-400" : "bg-border",
        )} />
      )}

      <StatusDot status={stop.status} />

      <div className="flex-1 pb-5 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          {/* Station name + code */}
          <div>
            <div className={cn(
              "font-semibold text-sm leading-tight",
              isCurrent ? "text-orange-700" : isDeparted ? "text-foreground" : "text-muted-foreground",
            )}>
              {stop.name}
              {isCurrent && (
                <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold bg-orange-500 text-white rounded px-1.5 py-0.5 align-middle">
                  <Radio className="w-2.5 h-2.5" /> LIVE
                </span>
              )}
              {isSource && <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">(Origin)</span>}
              {isDest && <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">(Destination)</span>}
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs font-mono font-bold text-primary/70 bg-primary/8 rounded px-1">{stop.code}</span>
              {stop.distance > 0 && (
                <span className="text-[11px] text-muted-foreground">{stop.distance} km</span>
              )}
              <span className="text-[11px] text-muted-foreground">Pf. {stop.platform}</span>
              {stop.haltMins > 0 && (
                <span className="text-[11px] text-muted-foreground">{stop.haltMins} min halt</span>
              )}
              {stop.day > 1 && (
                <span className="text-[10px] bg-blue-100 text-blue-700 rounded px-1 font-bold">Day {stop.day}</span>
              )}
            </div>
          </div>

          {/* Times */}
          <div className="text-right shrink-0">
            {/* Arrival */}
            {stop.scheduledArrival && (
              <div className="mb-0.5">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Arr</div>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className={cn(
                    "text-sm font-bold tabular-nums",
                    isDeparted || isCurrent ? "text-foreground" : "text-muted-foreground",
                  )}>
                    {stop.actualArrival ?? stop.scheduledArrival}
                  </span>
                  {stop.delayMins > 0 && (isDeparted || isCurrent) && (
                    <span className="text-[10px] line-through text-muted-foreground tabular-nums">
                      {stop.scheduledArrival}
                    </span>
                  )}
                </div>
              </div>
            )}
            {/* Departure */}
            {stop.scheduledDeparture && (
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Dep</div>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className={cn(
                    "text-sm font-bold tabular-nums",
                    isDeparted ? "text-foreground" : isCurrent ? "text-orange-700" : "text-muted-foreground",
                  )}>
                    {stop.actualDeparture ?? stop.scheduledDeparture}
                  </span>
                  {stop.delayMins > 0 && isDeparted && (
                    <span className="text-[10px] line-through text-muted-foreground tabular-nums">
                      {stop.scheduledDeparture}
                    </span>
                  )}
                </div>
              </div>
            )}
            {stop.status === "upcoming" && <DelayBadge mins={stop.delayMins} />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function LiveTrainStatus() {
  const [query, setQuery] = useState("");
  const [trainNumber, setTrainNumber] = useState("");
  const [result, setResult] = useState<TrainLiveStatusResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState<{ number: string; name: string; from: string; to: string }[]>([]);

  const popular = getLiveStatusTrains();

  // For suggestions: use API results if we have them, else filter local list
  const suggestions = apiSuggestions.length > 0
    ? apiSuggestions
    : query.length >= 2
      ? popular.filter(
          (t) =>
            t.number.includes(query) ||
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.from.toLowerCase().includes(query.toLowerCase()) ||
            t.to.toLowerCase().includes(query.toLowerCase()),
        )
      : popular;

  // Debounced API search for suggestions
  useEffect(() => {
    if (query.length < 2) { setApiSuggestions([]); return; }
    const timer = setTimeout(async () => {
      const results = await searchTrainsAPI(query);
      setApiSuggestions(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  async function search(num: string) {
    const n = num.trim();
    if (!n) return;
    setTrainNumber(n);
    setQuery(n);
    setShowSuggestions(false);
    setIsLoading(true);
    setResult(null);
    setNotFound(false);
    const r = await fetchTrainLiveStatus(n);
    setIsLoading(false);
    if (r) {
      setResult(r);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
    setLastRefresh(new Date());
  }

  function refresh() {
    if (trainNumber) {
      search(trainNumber);
    }
  }

  // Auto-refresh every 60s
  useEffect(() => {
    if (!trainNumber) return;
    const t = setInterval(() => refresh(), 60000);
    return () => clearInterval(t);
  }, [trainNumber]);

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <div className="min-h-screen pb-20" style={{ background: "hsl(232 22% 97%)" }}>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative text-white pt-10 pb-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2000&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Train Tracker
          </div>
          <h1 className="text-4xl font-serif font-bold mb-1">Where Is My Train?</h1>
          <p className="text-white/70 text-sm mb-8">
            Real-time location, delay info & expected arrival for every station
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter train number (e.g. 12951)"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") search(query);
                    if (e.key === "Escape") setShowSuggestions(false);
                  }}
                  className="pl-10 h-12 rounded-xl bg-white text-foreground border-0 shadow-lg text-sm"
                />
                {/* Suggestions dropdown */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-2xl border border-border z-50 overflow-hidden"
                    >
                      {suggestions.slice(0, 8).map((t) => (
                        <button
                          key={t.number}
                          onMouseDown={(e) => { e.preventDefault(); search(t.number); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Train className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-foreground">{t.name}</div>
                            <div className="text-xs text-muted-foreground">
                              #{t.number} · {t.from} → {t.to}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Button
                onClick={() => search(query)}
                className="h-12 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg"
              >
                Track
              </Button>
            </div>
          </div>

          {/* Quick pick pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {popular.slice(0, 6).map((t) => (
              <button
                key={t.number}
                onClick={() => search(t.number)}
                className="text-xs bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-lg px-3 py-1.5 transition-all font-medium backdrop-blur-sm"
              >
                {t.number} · {t.from} → {t.to}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-10 relative z-10">

        {/* ── Loading ─────────────────────────────────────────────────── */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-10 text-center shadow-lg"
          >
            <Loader2 className="w-10 h-10 text-primary mx-auto mb-3 animate-spin" />
            <div className="font-bold text-lg mb-1">Fetching Live Status…</div>
            <p className="text-muted-foreground text-sm">Checking train #{trainNumber} position</p>
          </motion.div>
        )}

        {/* ── Not found ──────────────────────────────────────────────── */}
        {notFound && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-destructive/30 rounded-2xl p-8 text-center shadow-lg"
          >
            <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <div className="font-bold text-lg mb-1">Train #{trainNumber} Not Found</div>
            <p className="text-muted-foreground text-sm">
              This train number is not in our database. Try searching by train name, route, or
              use one of the quick picks above.
            </p>
          </motion.div>
        )}

        {/* ── Result ─────────────────────────────────────────────────── */}
        {result && (
          <AnimatePresence mode="wait">
            <motion.div
              key={result.trainNumber}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Train info banner */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Train className="w-5 h-5 text-secondary" />
                        <span className="text-secondary text-xs font-bold uppercase tracking-wider">
                          {result.trainType}
                        </span>
                        <span className="text-primary-foreground/60 text-xs">#{result.trainNumber}</span>
                      </div>
                      <h2 className="text-xl font-serif font-bold leading-tight">{result.trainName}</h2>
                      <div className="flex items-center gap-2 mt-1.5 text-sm text-primary-foreground/80">
                        <span>{result.from}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>{result.to}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-2xl font-bold",
                        result.delayMins === 0 ? "text-green-300" : "text-red-300",
                      )}>
                        {result.delayMins === 0 ? "On Time" : `+${result.delayMins} mins`}
                      </div>
                      <div className="text-primary-foreground/60 text-xs mt-0.5 flex items-center gap-1 justify-end">
                        <RefreshCw className="w-3 h-3" />
                        Updated {result.lastUpdated}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current location */}
                <div className="px-6 py-4 bg-orange-50 border-b border-orange-100 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
                    <div>
                      <div className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">
                        Current Location
                      </div>
                      {result.currentBetween ? (
                        <div className="text-sm font-semibold text-orange-800">
                          Between{" "}
                          <span className="font-bold">{result.currentBetween[0]}</span>
                          {" "}→{" "}
                          <span className="font-bold">{result.currentBetween[1]}</span>
                        </div>
                      ) : (
                        <div className="text-sm font-semibold text-orange-800">
                          Arrived at destination
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Journey</div>
                      <div className="font-bold text-sm">{result.percentComplete}%</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refresh}
                      className="rounded-xl text-xs gap-1.5 border-orange-200 text-orange-700 hover:bg-orange-100"
                    >
                      <RefreshCw className="w-3 h-3" /> Refresh
                    </Button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="px-6 py-3 bg-white">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="font-bold text-primary">{result.fromCode}</span>
                    <span className="font-medium">{result.percentComplete}% complete</span>
                    <span className="font-bold text-primary">{result.toCode}</span>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.percentComplete}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-orange-500 relative"
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-white shadow translate-x-1/2" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4 text-yellow-500" />, label: "Avg Speed", value: `${Math.round(60 + (parseInt(result.trainNumber.slice(-2)) % 40))} km/h` },
                  { icon: <MapPin className="w-4 h-4 text-primary" />, label: "Stations", value: `${result.stops.length} stops` },
                  { icon: <Navigation className="w-4 h-4 text-green-500" />, label: "Covered", value: `${result.stops.find(s => s.status === "current")?.distance ?? result.stops[0].distance} km` },
                  { icon: <Timer className="w-4 h-4 text-orange-500" />, label: "Delay", value: result.delayMins === 0 ? "On Time" : `${result.delayMins} min late` },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 shadow-sm">
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      {icon}
                    </div>
                    <div>
                      <div className="text-[11px] text-muted-foreground font-medium">{label}</div>
                      <div className="font-bold text-sm">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Station timeline */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Train className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">Station-wise Status</h3>
                      <p className="text-xs text-muted-foreground">
                        All times in IST · Last refreshed {fmtTime(lastRefresh)}
                      </p>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-green-500" /> Departed
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-orange-500" /> Current
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full border-2 border-border" /> Upcoming
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {result.stops.map((stop, i) => (
                    <StopRow key={stop.code + i} stop={stop} isLast={i === result.stops.length - 1} />
                  ))}
                </div>

                <div className="px-6 py-4 border-t border-border bg-muted/30 text-xs text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Delays shown are simulated estimates. Auto-refreshes every 60 seconds.
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Empty state ─────────────────────────────────────────────── */}
        {!result && !notFound && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-10 text-center shadow-lg"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Train className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-2">Track Any Train</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
              Enter a train number above or pick a popular route to see live location,
              delay info, and expected arrival at every station.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {popular.slice(0, 6).map((t) => (
                <button
                  key={t.number}
                  onClick={() => search(t.number)}
                  className="text-sm border border-border rounded-xl px-4 py-2 hover:bg-muted/50 transition-colors font-medium"
                >
                  {t.number} – {t.name.split(" ").slice(0, 2).join(" ")}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
