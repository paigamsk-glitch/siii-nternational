import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  Train, ArrowRight, ArrowLeftRight, CheckCircle,
  AlertCircle, Calendar as CalendarIcon, Sparkles, MapPin, Clock, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StationAutocomplete } from "@/components/train/StationAutocomplete";
import {
  searchTrains, getPopularTrains,
  type Train as TrainType, CLASS_LABELS, CLASS_ORDER
} from "@/lib/trainApi";
import { useBookingStore } from "@/lib/booking-store";
import { useLocation, Link } from "wouter";

const TYPE_COLORS: Record<string, string> = {
  Rajdhani: "bg-amber-100 text-amber-800 border-amber-200",
  Shatabdi: "bg-blue-100 text-blue-800 border-blue-200",
  Express: "bg-green-100 text-green-800 border-green-200",
  Superfast: "bg-purple-100 text-purple-800 border-purple-200",
  Mail: "bg-gray-100 text-gray-700 border-gray-200",
};

const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Availability helpers ─────────────────────────────────────────────────────
function fmtUpdated(mins?: number): string {
  if (!mins) return "";
  if (mins < 60) return `Updated ${mins} min${mins !== 1 ? "s" : ""} ago`;
  const h = Math.round(mins / 60);
  return `Updated ${h} hr${h !== 1 ? "s" : ""} ago`;
}

function AvailBadge({ cls }: { cls: import("@/lib/trainApi").TrainClass }) {
  if (cls.available > 0) {
    const type = cls.availType === "AVAILABLE" ? "Avbl" : (cls.availType ?? "Avbl");
    return (
      <span className="text-[11px] font-bold text-green-600">
        {type === "Avbl" ? `Avbl ${cls.available}` : `${type} ${cls.available}`}
      </span>
    );
  }
  if (cls.waitlist) {
    const type = cls.availType ?? "GNWL";
    return (
      <span className="text-[11px] font-bold text-amber-600">
        {type} {cls.waitlist}
      </span>
    );
  }
  return <span className="text-[11px] font-bold text-red-500">Not Avbl</span>;
}

// ─── TrainResultCard ──────────────────────────────────────────────────────────
function TrainResultCard({
  train,
  passengers,
  onBook,
  index,
}: {
  train: TrainType;
  passengers: number;
  onBook: (train: TrainType, classCode: string, fare: number) => void;
  index: number;
}) {
  // Use index-based selection so duplicate codes (regular vs Tatkal) work
  const defaultIdx = (() => {
    const firstAvail = train.classes.findIndex((c) => c.available > 0 && !c.tatkal);
    return firstAvail >= 0 ? firstAvail : 0;
  })();

  const [selectedIdx, setSelectedIdx] = useState(defaultIdx);
  const selectedCls = train.classes[selectedIdx] ?? train.classes[0];
  const totalFare = selectedCls.fare * passengers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center">
            <Train className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-bold text-sm">{train.name}</p>
            <p className="text-xs text-muted-foreground font-mono">
              #{train.number}
              {train.via && (
                <span className="ml-2 text-muted-foreground/70">via {train.via}</span>
              )}
            </p>
          </div>
        </div>
        <Badge className={`text-xs font-semibold border ${TYPE_COLORS[train.type] ?? TYPE_COLORS.Express}`}>
          {train.type}
        </Badge>
      </div>

      {/* Route row */}
      <div className="flex items-center justify-between px-5 py-3 border-y border-border bg-muted/20">
        <div>
          <p className="text-2xl font-bold tabular-nums">{train.departureTime}</p>
          <p className="text-xs font-bold text-primary">{train.from.code}</p>
          <p className="text-xs text-muted-foreground">{train.from.city}</p>
        </div>
        <div className="flex-1 px-4 flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {train.duration}
          </span>
          <div className="w-full flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full border-2 border-primary bg-white" />
            <div className="flex-1 h-px bg-gradient-to-r from-primary via-secondary to-primary" />
            <Train className="w-3.5 h-3.5 text-secondary" />
            <div className="flex-1 h-px bg-gradient-to-r from-secondary to-primary" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
          <div className="flex gap-0.5">
            {DAY_SHORT.map((d) => (
              <span
                key={d}
                className={`text-[9px] font-bold px-0.5 rounded ${
                  train.runningDays.includes(d) ? "text-primary" : "text-muted-foreground/30"
                }`}
              >
                {d[0]}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums">{train.arrivalTime}</p>
          <p className="text-xs font-bold text-primary">{train.to.code}</p>
          <p className="text-xs text-muted-foreground">{train.to.city}</p>
        </div>
      </div>

      {/* IRCTC-style class selector */}
      <div className="px-5 py-3">
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2.5">
          Select Class
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {train.classes.map((cls, i) => {
            const isSelected = i === selectedIdx;
            return (
              <button
                key={`${cls.code}-${i}`}
                onClick={() => setSelectedIdx(i)}
                className={cn(
                  "flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left gap-0.5",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 hover:bg-muted/20"
                )}
              >
                {/* Row 1: code + TATKAL badge + fare */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("text-sm font-bold font-mono", isSelected ? "text-primary" : "text-foreground")}>
                      {cls.code}
                    </span>
                    {cls.tatkal && (
                      <span className="text-[10px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded leading-none">
                        TATKAL
                      </span>
                    )}
                  </div>
                  <span className={cn("text-sm font-bold tabular-nums", isSelected ? "text-primary" : "text-foreground")}>
                    ₹{cls.fare.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Row 2: Availability */}
                <AvailBadge cls={cls} />

                {/* Row 3: Free Cancellation */}
                <span className={cn(
                  "text-[10px] font-medium flex items-center gap-0.5",
                  cls.freeCancellation ? "text-green-600" : "text-muted-foreground"
                )}>
                  {cls.freeCancellation
                    ? <><CheckCircle className="w-2.5 h-2.5" /> Free Cancellation</>
                    : "No Cancellation"
                  }
                </span>

                {/* Row 4: Updated X hrs ago */}
                {cls.updatedMinsAgo != null && (
                  <span className="text-[10px] text-muted-foreground/70">
                    {fmtUpdated(cls.updatedMinsAgo)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom: total + Book */}
      <div className="px-5 pb-4 flex items-center justify-between gap-4 border-t border-border pt-3">
        <div>
          <p className="text-xs text-muted-foreground">
            {passengers} × ₹{selectedCls.fare.toLocaleString("en-IN")}
            {" · "}{selectedCls.label}
            {selectedCls.tatkal && <span className="text-orange-500 font-semibold ml-1">(Tatkal)</span>}
          </p>
          <p className="text-xl font-bold text-primary">
            ₹{totalFare.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            {selectedCls.available > 0 ? (
              <>
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">Available</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span className="text-xs text-amber-600 font-medium">
                  {selectedCls.availType ?? "GNWL"} {selectedCls.waitlist}
                </span>
              </>
            )}
            {selectedCls.available > 0 && selectedCls.available < 12 && (
              <span className="text-xs text-destructive font-semibold ml-2 flex items-center gap-0.5">
                <Sparkles className="w-3 h-3" /> Only {selectedCls.available} left!
              </span>
            )}
          </div>
        </div>
        <Button
          onClick={() => onBook(train, selectedCls.code, selectedCls.fare)}
          className="hover-elevate bg-primary hover:bg-primary/90 rounded-xl font-semibold px-6"
        >
          Book Now <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── PopularRouteCard ─────────────────────────────────────────────────────────
function PopularRouteCard({ train, onClick }: { train: TrainType; onClick: () => void }) {
  const cheapest = [...train.classes].sort((a, b) => a.fare - b.fare)[0];
  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-border p-4 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <Badge className={`text-xs border ${TYPE_COLORS[train.type] ?? TYPE_COLORS.Express}`}>
          {train.type}
        </Badge>
        <span className="text-xs text-muted-foreground font-mono">#{train.number}</span>
      </div>
      <h3 className="font-bold text-sm mb-1">{train.name}</h3>
      <div className="flex items-center gap-2 text-muted-foreground mb-3">
        <span className="text-xs font-semibold">{train.from.city}</span>
        <ArrowRight className="w-3 h-3" />
        <span className="text-xs font-semibold">{train.to.city}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          <Clock className="w-3 h-3 inline mr-1" />
          {train.duration}
        </div>
        <div>
          <span className="text-xs text-muted-foreground">from </span>
          <span className="font-bold text-primary">₹{cheapest.fare.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function Trains() {
  const [, setLocation] = useLocation();
  const setBookingItem = useBookingStore((state) => state.setBookingItem);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date>();
  const [passengers, setPassengers] = useState("1");
  const [swapped, setSwapped] = useState(false);
  const [sortBy, setSortBy] = useState("departure");
  const [trains, setTrains] = useState<TrainType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const popularTrains = getPopularTrains();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const f = params.get("from");
    const t = params.get("to");
    const d = params.get("date");
    if (f) setFrom(f);
    if (t) setTo(t);
    if (d) { try { setDate(parseISO(d)); } catch (e) {} }
    if (f && t) runSearch(f, t, d || "");
  }, []);

  async function runSearch(f: string, t: string, d: string) {
    setLoading(true);
    setSearched(true);
    const results = await searchTrains({ from: f, to: t, date: d });
    setTrains(results);
    setLoading(false);
  }

  function handleSwap() {
    setFrom(to);
    setTo(from);
    setSwapped((s) => !s);
  }

  function handleSearch() {
    if (from && to) {
      runSearch(from, to, date ? format(date, "yyyy-MM-dd") : "");
    }
  }

  function handleBook(train: TrainType, classCode: string, farePerPerson: number) {
    const pax = parseInt(passengers, 10);
    const cls = train.classes.find((c) => c.code === classCode)!;
    const bookingItem = {
      id: `train-${train.id}-${classCode}`,
      trainId: train.id,
      trainNumber: train.number,
      trainName: train.name,
      from: train.from.city,
      fromCode: train.from.code,
      to: train.to.city,
      toCode: train.to.code,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      duration: train.duration,
      trainType: train.type,
      classCode,
      className: CLASS_LABELS[classCode] ?? classCode,
      // price = per-person fare so checkout can multiply by travelers
      price: farePerPerson,
      currency: "INR",
      seatsAvailable: cls.available,
    } as any;

    setBookingItem("train" as any, bookingItem, {
      travelers: pax,
      date: date ? format(date, "yyyy-MM-dd") : "",
      classCode,
    });
    setLocation("/checkout");
  }

  const sortedTrains = [...trains].sort((a, b) => {
    if (sortBy === "departure") return a.departureTime.localeCompare(b.departureTime);
    if (sortBy === "duration") return a.duration.localeCompare(b.duration);
    if (sortBy === "price") {
      const af = Math.min(...a.classes.filter(c => c.available > 0).map(c => c.fare));
      const bf = Math.min(...b.classes.filter(c => c.available > 0).map(c => c.fare));
      return af - bf;
    }
    return 0;
  });

  return (
    <div className="min-h-screen pb-20" style={{ background: "hsl(232 22% 97%)" }}>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="text-white pt-10 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2000&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Train className="w-6 h-6 text-secondary" />
            <span className="text-secondary text-sm font-semibold tracking-widest uppercase">
              Train Booking
            </span>
          </div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-serif font-bold">Book Train Tickets</h1>
            <Link href="/pnr">
              <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-xl px-4 py-2 text-sm font-semibold transition-all backdrop-blur-sm">
                <Search className="w-3.5 h-3.5" /> PNR Status
              </button>
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-md text-foreground rounded-2xl shadow-2xl border border-white/20 p-6">
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
              {/* From */}
              <div className="space-y-1.5">
                <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                  From
                </Label>
                <div className="bg-white rounded-xl overflow-hidden">
                  <StationAutocomplete
                    id="train-from"
                    placeholder="City or Station"
                    value={from}
                    onChange={setFrom}
                  />
                </div>
              </div>

              {/* Swap + To */}
              <div className="space-y-1.5 relative">
                <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                  To
                </Label>
                <div className="bg-white rounded-xl overflow-hidden">
                  <StationAutocomplete
                    id="train-to"
                    placeholder="City or Station"
                    value={to}
                    onChange={setTo}
                  />
                </div>
                <button
                  onClick={handleSwap}
                  className="absolute right-3 top-6 bg-secondary text-secondary-foreground rounded-full p-1.5 shadow-lg hover:scale-110 transition-transform z-10"
                  title="Swap stations"
                >
                  <motion.div
                    animate={{ rotate: swapped ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </motion.div>
                </button>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                  Journey Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start bg-white border-0 rounded-xl h-10 font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {date ? format(date, "dd MMM yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Passengers */}
              <div className="space-y-1.5">
                <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                  Passengers
                </Label>
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger className="bg-white border-0 rounded-xl h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} Passenger{n > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full h-10 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold shadow-lg"
                >
                  <Train className="w-4 h-4 mr-2" /> Search Trains
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-4">
        {/* ── Results toolbar ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-border px-5 py-3 mb-5">
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                Searching trains...
              </div>
            ) : searched ? (
              <p className="text-sm font-medium text-foreground">
                <span className="text-primary font-bold text-base">{sortedTrains.length}</span>
                <span className="text-muted-foreground ml-1">
                  {sortedTrains.length === 1 ? "train" : "trains"} found
                  {from && to ? ` · ${from} → ${to}` : ""}
                </span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Popular trains shown below</p>
            )}
          </div>
          {searched && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground hidden sm:block">Sort:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-8 border-none bg-muted/50 shadow-none focus:ring-0 font-semibold gap-1 rounded-lg text-sm w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="departure">Earliest Departure</SelectItem>
                  <SelectItem value="price">Lowest Fare</SelectItem>
                  <SelectItem value="duration">Shortest Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* ── Loading skeletons ────────────────────────────────────────── */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-border h-64 animate-pulse" />
            ))}
          </div>
        )}

        {/* ── Search results ───────────────────────────────────────────── */}
        {!loading && searched && sortedTrains.length === 0 && (
          <div className="bg-white rounded-2xl border border-border p-16 text-center">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-5">
              <Train className="w-10 h-10 text-primary/40" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">No trains found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              No direct trains found between <strong>{from}</strong> and <strong>{to}</strong>.
              Try searching with the city name or a major station.
            </p>
          </div>
        )}

        {!loading && searched && sortedTrains.length > 0 && (
          <div className="space-y-4">
            {sortedTrains.map((train, i) => (
              <TrainResultCard
                key={train.id}
                train={train}
                passengers={parseInt(passengers)}
                onBook={handleBook}
                index={i}
              />
            ))}
          </div>
        )}

        {/* ── Popular trains (shown when not searched yet) ─────────────── */}
        {!searched && !loading && (
          <div>
            <h2 className="text-lg font-bold mb-4">Popular Train Routes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularTrains.map((train) => (
                <PopularRouteCard
                  key={train.id}
                  train={train}
                  onClick={() => {
                    setFrom(train.from.city);
                    setTo(train.to.city);
                    runSearch(train.from.city, train.to.city, "");
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
