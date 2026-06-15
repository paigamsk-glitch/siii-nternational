import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Train, Search, MapPin, Clock, ChevronRight, ArrowRight,
  Calendar, Loader2, AlertCircle, CheckCircle2, Info,
  Navigation, Timer, Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

// ─── Types ────────────────────────────────────────────────────────────────────
interface ScheduleStop {
  no: number;
  code: string;
  name: string;
  scheduledArrival: string | null;
  scheduledDeparture: string | null;
  haltMins: number;
  distance: number;
  platform: string;
  day: number;
}

interface TrainSchedule {
  trainNumber: string;
  trainName: string;
  trainType: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  durationMins: number;
  stops: ScheduleStop[];
}

interface SearchResult {
  number: string;
  name: string;
  from: string;
  to: string;
}

// ─── API helpers ──────────────────────────────────────────────────────────────
async function fetchSchedule(trainNumber: string): Promise<TrainSchedule | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/trains/schedule/${trainNumber.trim()}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

async function searchTrains(q: string): Promise<SearchResult[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/trains/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.success
      ? json.data.map((t: any) => ({ number: t.trainNumber, name: t.trainName, from: t.fromStation, to: t.toStation }))
      : [];
  } catch {
    return [];
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDuration(mins: number) {
  if (!mins) return "--";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m > 0 ? `${m}m` : ""}`.trim();
}

const TYPE_COLORS: Record<string, string> = {
  Rajdhani: "bg-blue-100 text-blue-700",
  Shatabdi: "bg-purple-100 text-purple-700",
  Duronto: "bg-indigo-100 text-indigo-700",
  Express: "bg-orange-100 text-orange-700",
  Mail: "bg-green-100 text-green-700",
  Superfast: "bg-red-100 text-red-700",
};

// ─── Stop Row ─────────────────────────────────────────────────────────────────
function StopRow({ stop, isFirst, isLast }: { stop: ScheduleStop; isFirst: boolean; isLast: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: stop.no * 0.02 }}
      className={cn(
        "relative flex gap-0 group",
        isFirst || isLast ? "bg-primary/4" : "",
      )}
    >
      {/* Stop number + connector line */}
      <div className="flex flex-col items-center w-12 shrink-0 pt-4">
        <div className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold z-10 shrink-0 border-2",
          isFirst ? "bg-primary text-primary-foreground border-primary" :
          isLast ? "bg-green-600 text-white border-green-600" :
          "bg-white text-muted-foreground border-border group-hover:border-primary/40",
        )}>
          {stop.no}
        </div>
        {!isLast && (
          <div className="flex-1 w-0.5 bg-border min-h-[24px] mt-1" />
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "flex-1 py-3 pr-4 border-b border-border/50 flex items-start gap-3",
        isLast && "border-b-0",
      )}>
        {/* Station info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "font-semibold text-sm leading-tight",
              isFirst || isLast ? "text-foreground" : "text-foreground/80",
            )}>
              {stop.name}
            </span>
            {isFirst && (
              <span className="text-[10px] bg-primary text-primary-foreground rounded px-1.5 py-0.5 font-bold">Origin</span>
            )}
            {isLast && (
              <span className="text-[10px] bg-green-600 text-white rounded px-1.5 py-0.5 font-bold">Destination</span>
            )}
            {stop.day > 1 && (
              <span className="text-[10px] bg-blue-100 text-blue-700 rounded px-1.5 py-0.5 font-bold">Day {stop.day}</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-xs font-mono font-bold text-primary/60 bg-primary/8 rounded px-1">{stop.code}</span>
            {stop.distance > 0 && (
              <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                <Navigation className="w-2.5 h-2.5" /> {stop.distance} km
              </span>
            )}
            <span className="text-[11px] text-muted-foreground">Pf. {stop.platform}</span>
            {stop.haltMins > 0 && (
              <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                <Timer className="w-2.5 h-2.5" /> {stop.haltMins} min halt
              </span>
            )}
          </div>
        </div>

        {/* Times */}
        <div className="text-right shrink-0 flex gap-4">
          {/* Arrival */}
          <div className="text-center">
            {stop.scheduledArrival ? (
              <>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Arr</div>
                <div className="text-sm font-bold tabular-nums text-foreground">
                  {stop.scheduledArrival}
                </div>
              </>
            ) : (
              <div className="text-[11px] text-muted-foreground mt-3">—</div>
            )}
          </div>
          {/* Departure */}
          <div className="text-center">
            {stop.scheduledDeparture ? (
              <>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Dep</div>
                <div className="text-sm font-bold tabular-nums text-foreground">
                  {stop.scheduledDeparture}
                </div>
              </>
            ) : (
              <div className="text-[11px] text-muted-foreground mt-3">—</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function TrainSchedule() {
  const [query, setQuery] = useState("");
  const [schedule, setSchedule] = useState<TrainSchedule | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [activeNum, setActiveNum] = useState("");

  // Pre-populate from URL hash if present
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && /^\d{4,5}$/.test(hash)) {
      handleSearch(hash);
    }
  }, []);

  // Debounced search for autocomplete
  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      setSuggestions(await searchTrains(query));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  async function handleSearch(num: string) {
    const n = num.trim();
    if (!n) return;
    setActiveNum(n);
    setQuery(n);
    setShowSuggestions(false);
    setIsLoading(true);
    setSchedule(null);
    setNotFound(false);
    const data = await fetchSchedule(n);
    setIsLoading(false);
    if (data) {
      setSchedule(data);
    } else {
      setNotFound(true);
    }
  }

  const POPULAR = [
    { number: "12951", name: "Mumbai Rajdhani" },
    { number: "12301", name: "Howrah Rajdhani" },
    { number: "12621", name: "Tamil Nadu Exp" },
    { number: "12627", name: "Karnataka Exp" },
    { number: "12009", name: "Shatabdi Exp" },
    { number: "10111", name: "Konkan Kanya" },
  ];

  return (
    <div className="min-h-screen pb-20" style={{ background: "hsl(232 22% 97%)" }}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative text-white pt-10 pb-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2000&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Calendar className="w-3.5 h-3.5" /> Train Timetable
          </div>
          <h1 className="text-4xl font-serif font-bold mb-1">Train Schedule</h1>
          <p className="text-white/70 text-sm mb-8">
            Full station-by-station timetable with arrival, departure, platform & distance
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter train number or name (e.g. 12951)"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch(query);
                    if (e.key === "Escape") setShowSuggestions(false);
                  }}
                  className="pl-10 h-12 rounded-xl bg-white text-foreground border-0 shadow-lg text-sm"
                />
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
                          onMouseDown={(e) => { e.preventDefault(); handleSearch(t.number); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                            <Train className="w-4 h-4 text-sky-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-foreground">{t.name}</div>
                            <div className="text-xs text-muted-foreground">#{t.number} · {t.from} → {t.to}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Button
                onClick={() => handleSearch(query)}
                className="h-12 px-6 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold shadow-lg"
              >
                View
              </Button>
            </div>
          </div>

          {/* Quick picks */}
          <div className="flex flex-wrap gap-2 mt-4">
            {POPULAR.map((t) => (
              <button
                key={t.number}
                onClick={() => handleSearch(t.number)}
                className="text-xs bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-lg px-3 py-1.5 transition-all font-medium backdrop-blur-sm"
              >
                {t.number} · {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-10 relative z-10 space-y-5">

        {/* ── Loading ──────────────────────────────────────────────────── */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-10 text-center shadow-lg"
          >
            <Loader2 className="w-10 h-10 text-sky-500 mx-auto mb-3 animate-spin" />
            <div className="font-bold text-lg mb-1">Loading Schedule…</div>
            <p className="text-muted-foreground text-sm">Fetching timetable for train #{activeNum}</p>
          </motion.div>
        )}

        {/* ── Not found ────────────────────────────────────────────────── */}
        {notFound && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-destructive/30 rounded-2xl p-8 text-center shadow-lg"
          >
            <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <div className="font-bold text-lg mb-1">Train #{activeNum} Not Found</div>
            <p className="text-muted-foreground text-sm">
              Try searching by train name or route, or use one of the quick picks above.
            </p>
          </motion.div>
        )}

        {/* ── Schedule result ──────────────────────────────────────────── */}
        {schedule && !isLoading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={schedule.trainNumber}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Header card */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-sky-700 to-sky-600 text-white px-6 py-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <Train className="w-5 h-5 text-sky-200" />
                        <span className={cn(
                          "text-xs font-bold rounded px-2 py-0.5",
                          TYPE_COLORS[schedule.trainType] ?? "bg-white/20 text-white",
                        )}>
                          {schedule.trainType}
                        </span>
                        <span className="text-sky-200 text-xs font-mono">#{schedule.trainNumber}</span>
                      </div>
                      <h2 className="text-2xl font-serif font-bold leading-tight">{schedule.trainName}</h2>
                      <div className="flex items-center gap-2 mt-2 text-sm text-white/80">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{schedule.fromStation}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        <span>{schedule.toStation}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      {schedule.departureTime !== "--:--" && (
                        <div>
                          <div className="text-[10px] text-sky-200 uppercase tracking-wide">Departure</div>
                          <div className="text-xl font-bold tabular-nums">{schedule.departureTime}</div>
                        </div>
                      )}
                      {schedule.arrivalTime !== "--:--" && (
                        <div>
                          <div className="text-[10px] text-sky-200 uppercase tracking-wide">Arrival</div>
                          <div className="text-xl font-bold tabular-nums">{schedule.arrivalTime}</div>
                        </div>
                      )}
                      {schedule.durationMins > 0 && (
                        <div className="text-sky-200 text-xs flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" /> {fmtDuration(schedule.durationMins)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
                  {[
                    { icon: <Hash className="w-3.5 h-3.5 text-sky-500" />, label: "Total Stops", value: `${schedule.stops.length}` },
                    { icon: <Navigation className="w-3.5 h-3.5 text-green-500" />, label: "Distance", value: schedule.stops[schedule.stops.length - 1]?.distance > 0 ? `~${schedule.stops[schedule.stops.length - 1].distance} km` : "—" },
                    { icon: <Timer className="w-3.5 h-3.5 text-orange-500" />, label: "Duration", value: schedule.durationMins > 0 ? fmtDuration(schedule.durationMins) : "—" },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-center gap-2.5 px-5 py-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        {icon}
                      </div>
                      <div>
                        <div className="text-[11px] text-muted-foreground">{label}</div>
                        <div className="font-bold text-sm">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Column header */}
                <div className="grid px-4 py-2 bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wide text-muted-foreground" style={{ gridTemplateColumns: "3rem 1fr auto" }}>
                  <span className="text-center">#</span>
                  <span>Station</span>
                  <div className="flex gap-4 pr-1">
                    <span className="w-12 text-center">Arr</span>
                    <span className="w-12 text-center">Dep</span>
                  </div>
                </div>

                {/* Stop list */}
                <div className="px-0">
                  {schedule.stops.map((stop, i) => (
                    <StopRow
                      key={stop.code + i}
                      stop={stop}
                      isFirst={i === 0}
                      isLast={i === schedule.stops.length - 1}
                    />
                  ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="w-3.5 h-3.5 text-amber-500" />
                    Times are scheduled. Actual times may vary.
                  </div>
                  <Link href={`/live-status`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-xs gap-1.5 border-sky-200 text-sky-700 hover:bg-sky-50"
                      onClick={() => {}}
                    >
                      <Train className="w-3.5 h-3.5" />
                      Track Live: #{schedule.trainNumber}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Empty state ──────────────────────────────────────────────── */}
        {!schedule && !isLoading && !notFound && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-10 text-center shadow-lg"
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-sky-500" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-2">View Any Train's Timetable</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Enter a train number above to see the full station-by-station timetable —
              arrival/departure times, platform numbers, halt durations, and distances.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
              {POPULAR.map((t) => (
                <button
                  key={t.number}
                  onClick={() => handleSearch(t.number)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl border border-border hover:border-sky-300 hover:bg-sky-50/50 transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-sky-50 group-hover:bg-sky-100 flex items-center justify-center">
                    <Train className="w-5 h-5 text-sky-500" />
                  </div>
                  <span className="font-bold text-xs text-foreground">{t.number}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight text-center">{t.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
