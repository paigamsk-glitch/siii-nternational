import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  Train, Clock, ArrowRight, ArrowLeftRight, CheckCircle,
  AlertCircle, Calendar as CalendarIcon, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StationAutocomplete } from "@/components/train/StationAutocomplete";
import { searchTrains, type Train as TrainType, CLASS_LABELS } from "@/lib/trainApi";
import { useBookingStore } from "@/lib/booking-store";
import { useLocation } from "wouter";

const TYPE_COLORS: Record<string, string> = {
  Rajdhani: "bg-amber-100 text-amber-800 border-amber-200",
  Shatabdi: "bg-blue-100 text-blue-800 border-blue-200",
  Express: "bg-green-100 text-green-800 border-green-200",
  Superfast: "bg-purple-100 text-purple-800 border-purple-200",
  Mail: "bg-gray-100 text-gray-700 border-gray-200",
};

const PASSENGER_OPTIONS = [
  { label: "1 Passenger", value: "1" },
  { label: "2 Passengers", value: "2" },
  { label: "3 Passengers", value: "3" },
  { label: "4 Passengers", value: "4" },
  { label: "5 Passengers", value: "5" },
  { label: "6 Passengers", value: "6" },
];

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const f = params.get("from");
    const t = params.get("to");
    const d = params.get("date");
    if (f) setFrom(f);
    if (t) setTo(t);
    if (d) { try { setDate(parseISO(d)); } catch (e) {} }
    if (f && t) {
      runSearch(f, t, d || "");
    }
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
      const d = date ? format(date, "yyyy-MM-dd") : "";
      runSearch(from, to, d);
    }
  }

  function handleBook(train: TrainType, classCode: string) {
    const cls = train.classes.find((c) => c.code === classCode) ?? train.classes[0];
    const pax = parseInt(passengers, 10);
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
      price: cls.fare,
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
      const aMin = Math.min(...a.classes.map((c) => c.fare));
      const bMin = Math.min(...b.classes.map((c) => c.fare));
      return aMin - bMin;
    }
    return 0;
  });

  return (
    <div className="min-h-screen pb-20" style={{ background: "hsl(232 22% 97%)" }}>
      {/* Hero search bar */}
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
              Train Search
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-8">Book Train Tickets</h1>

          <div className="bg-white/10 backdrop-blur-md text-foreground rounded-2xl shadow-2xl border border-white/20 p-6">
            <div className={cn("grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-5")}>
              {/* From */}
              <div className="space-y-1.5">
                <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                  From
                </Label>
                <div className="bg-white rounded-xl overflow-hidden">
                  <StationAutocomplete
                    id="train-from"
                    placeholder="Departure city"
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
                    placeholder="Destination city"
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
                    {PASSENGER_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search button */}
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
        {/* Results toolbar */}
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-border px-5 py-3 mb-5">
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                Searching available trains...
              </div>
            ) : (
              <p className="text-sm font-medium text-foreground">
                {searched ? (
                  <>
                    <span className="text-primary font-bold text-base">{sortedTrains.length}</span>
                    <span className="text-muted-foreground ml-1">
                      {sortedTrains.length === 1 ? "train" : "trains"} found
                      {from && to ? ` · ${from} → ${to}` : ""}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Search for trains above</span>
                )}
              </p>
            )}
          </div>
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
        </div>

        {/* Train cards */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-border h-52 animate-pulse" />
            ))}
          </div>
        ) : !searched ? (
          <div className="bg-white rounded-2xl border border-border p-16 text-center">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-5">
              <Train className="w-10 h-10 text-primary/40" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">Find Your Train</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Search trains between Delhi, Mumbai, Kolkata, Chennai, Bangalore, Hyderabad, Goa and more.
            </p>
          </div>
        ) : sortedTrains.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-16 text-center">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-5">
              <Train className="w-10 h-10 text-primary/40" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">No trains found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              No direct trains found between <strong>{from}</strong> and <strong>{to}</strong>.
              Try searching with the full city name.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTrains.map((train, i) => {
              const lowestFare = Math.min(...train.classes.map((c) => c.fare));
              const hasAvailability = train.classes.some((c) => c.available > 0);
              const pax = parseInt(passengers, 10);

              return (
                <motion.div
                  key={train.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col md:flex-row"
                >
                  {/* Side ribbon */}
                  <div className="md:w-3 bg-gradient-to-b from-primary to-accent shrink-0" />

                  <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row gap-5">
                    {/* Left: train info */}
                    <div className="flex-1">
                      {/* Train name row */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center">
                          <Train className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{train.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">#{train.number}</p>
                        </div>
                        <Badge className={`ml-auto text-xs font-semibold border ${TYPE_COLORS[train.type] ?? TYPE_COLORS.Express}`}>
                          {train.type}
                        </Badge>
                      </div>

                      {/* Route timeline */}
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="text-3xl font-bold text-foreground tracking-tight">
                            {train.departureTime}
                          </div>
                          <div className="text-sm font-semibold text-primary mt-0.5">
                            {train.from.code}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 max-w-[100px] truncate">
                            {train.from.city}
                          </div>
                        </div>

                        <div className="flex-1 px-4 flex flex-col items-center gap-1">
                          <span className="text-xs text-muted-foreground font-medium">
                            {train.duration}
                          </span>
                          <div className="w-full flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full border-2 border-primary bg-white" />
                            <div className="flex-1 h-px bg-gradient-to-r from-primary via-secondary to-primary" />
                            <Train className="w-4 h-4 text-secondary" />
                            <div className="flex-1 h-px bg-gradient-to-r from-secondary to-primary" />
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">
                            {train.runningDays.length === 7 ? "Daily" : train.runningDays.join(", ")}
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="text-3xl font-bold text-foreground tracking-tight">
                            {train.arrivalTime}
                          </div>
                          <div className="text-sm font-semibold text-primary mt-0.5">
                            {train.to.code}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 max-w-[100px] truncate text-right">
                            {train.to.city}
                          </div>
                        </div>
                      </div>

                      {/* Class chips */}
                      <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
                        {train.classes.map((cls) => (
                          <div
                            key={cls.code}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 rounded-lg px-2.5 py-1.5"
                          >
                            <span className="font-mono font-bold text-primary">{cls.code}</span>
                            <span>·</span>
                            <span>₹{cls.fare.toLocaleString("en-IN")}</span>
                            {cls.available > 0 ? (
                              <span className="text-green-600">· {cls.available} avail</span>
                            ) : (
                              <span className="text-amber-500">· WL</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: pricing */}
                    <div className="md:w-52 md:border-l md:border-border md:pl-6 flex flex-row md:flex-col justify-between md:justify-center items-end md:items-center gap-4 pt-4 md:pt-0 border-t border-border md:border-t-0">
                      <div className="text-center md:mb-2">
                        <div className="text-xs text-muted-foreground mb-1">
                          {passengers} passenger{parseInt(passengers) > 1 ? "s" : ""}
                        </div>
                        <div className="text-3xl font-bold text-primary leading-none">
                          ₹{(lowestFare * parseInt(passengers)).toLocaleString("en-IN")}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          ₹{lowestFare.toLocaleString("en-IN")} / person
                        </div>
                        <div className="flex items-center justify-center gap-1 mt-1.5">
                          {hasAvailability ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                              <span className="text-xs text-green-600 font-medium">Available</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                              <span className="text-xs text-amber-600 font-medium">Waitlist</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2 w-full">
                        <Button
                          onClick={() => handleBook(train, train.classes[0].code)}
                          className="w-full hover-elevate bg-primary hover:bg-primary/90 rounded-xl font-semibold"
                          disabled={!hasAvailability}
                        >
                          Book Now <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                        {train.classes[0].available > 0 && train.classes[0].available < 15 && (
                          <div className="text-xs text-destructive font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Only {train.classes[0].available} seats left
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
