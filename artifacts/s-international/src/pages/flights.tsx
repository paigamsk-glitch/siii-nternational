import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  Plane, Clock, Briefcase, Utensils, Wifi, Luggage,
  Calendar as CalendarIcon, ArrowRight, ArrowLeftRight,
  Sparkles, Map
} from "lucide-react";
import { Link } from "wouter";
import {
  useSearchFlights,
  getSearchFlightsQueryKey,
  SearchFlightsTripType,
  SearchFlightsCabinClass,
  FlightOffer
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CityAutocomplete } from "@/components/city-autocomplete";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/lib/booking-store";

function getAmenityIcon(amenity: string) {
  const lower = amenity.toLowerCase();
  if (lower.includes("meal") || lower.includes("dining") || lower.includes("food")) return <Utensils className="w-3.5 h-3.5" />;
  if (lower.includes("baggage") || lower.includes("luggage")) return <Luggage className="w-3.5 h-3.5" />;
  if (lower.includes("wifi") || lower.includes("entertainment")) return <Wifi className="w-3.5 h-3.5" />;
  if (lower.includes("lounge") || lower.includes("seat")) return <Briefcase className="w-3.5 h-3.5" />;
  return <Clock className="w-3.5 h-3.5" />;
}

const CABIN_OPTIONS = [
  { label: "1 Passenger · Economy", value: "1-economy" },
  { label: "2 Passengers · Economy", value: "2-economy" },
  { label: "3 Passengers · Economy", value: "3-economy" },
  { label: "4 Passengers · Economy", value: "4-economy" },
  { label: "1 Passenger · Business", value: "1-business" },
  { label: "2 Passengers · Business", value: "2-business" },
  { label: "1 Passenger · First Class", value: "1-first" },
  { label: "2 Passengers · First Class", value: "2-first" },
];

export function Flights() {
  const [, setLocation] = useLocation();
  const setBookingItem = useBookingStore(state => state.setBookingItem);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [tripType, setTripType] = useState<SearchFlightsTripType>("one-way");
  const [travelers, setTravelers] = useState(1);
  const [cabinClass, setCabinClass] = useState<SearchFlightsCabinClass>("economy");
  const [sortBy, setSortBy] = useState("price");
  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("from")) setFrom(params.get("from") as string);
    if (params.get("to")) setTo(params.get("to") as string);
    if (params.get("date")) {
      try { setDate(parseISO(params.get("date") as string)); } catch (e) {}
    }
  }, []);

  const handleSwap = () => {
    const tmp = from;
    setFrom(to);
    setTo(tmp);
    setSwapped(s => !s);
  };

  const searchParams = {
    from: from || undefined,
    to: to || undefined,
    date: date ? format(date, "yyyy-MM-dd") : undefined,
    tripType,
    travelers,
    cabinClass,
  };

  const { data, isLoading } = useSearchFlights(searchParams, {
    query: { queryKey: getSearchFlightsQueryKey(searchParams) },
  });

  const handleBook = (flight: FlightOffer) => {
    setBookingItem("flight", flight, {
      travelers,
      date: date ? format(date, "yyyy-MM-dd") : undefined,
      returnDate: returnDate ? format(returnDate, "yyyy-MM-dd") : undefined,
      tripType,
    });
    setLocation("/checkout");
  };

  const sortedFlights = [...(data?.flights ?? [])].sort((a, b) => {
    if (sortBy === "price") return (a.price as number) - (b.price as number);
    if (sortBy === "duration") return (a.duration ?? "").localeCompare(b.duration ?? "");
    if (sortBy === "departure") return (a.departureTime ?? "").localeCompare(b.departureTime ?? "");
    return 0;
  });

  const roundTripMultiplier = tripType === "round-trip" ? 1.9 : 1;

  return (
    <div className="min-h-screen pb-20" style={{ background: "hsl(232 22% 97%)" }}>
      {/* Hero search bar */}
      <div className="text-white pt-10 pb-16 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: "cover", backgroundPosition: "center"
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Plane className="w-6 h-6 text-secondary" />
              <span className="text-secondary text-sm font-semibold tracking-widest uppercase">Flight Search</span>
            </div>
            <Link href="/airlines">
              <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all">
                <Map className="w-4 h-4" />
                Explore Airlines &amp; Routes
              </button>
            </Link>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-8">Find the Best Fares</h1>

          <div className="bg-white/10 backdrop-blur-md text-foreground rounded-2xl shadow-2xl border border-white/20 p-6">
            <div className="flex items-center gap-4 mb-6">
              <Tabs value={tripType} onValueChange={(v) => setTripType(v as SearchFlightsTripType)}>
                <TabsList className="bg-white/20 text-white">
                  <TabsTrigger value="one-way" className="data-[state=active]:bg-white data-[state=active]:text-primary text-white/80">One Way</TabsTrigger>
                  <TabsTrigger value="round-trip" className="data-[state=active]:bg-white data-[state=active]:text-primary text-white/80">Round Trip</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className={cn("grid gap-3", tripType === "round-trip"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-6"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
            )}>
              {/* From */}
              <div className="space-y-1.5 lg:col-span-1">
                <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">From</Label>
                <div className="bg-white rounded-xl overflow-hidden">
                  <CityAutocomplete value={from} onChange={setFrom} placeholder="Departure city" />
                </div>
              </div>

              {/* Swap button + To */}
              <div className="space-y-1.5 lg:col-span-1 relative">
                <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">To</Label>
                <div className="bg-white rounded-xl overflow-hidden">
                  <CityAutocomplete value={to} onChange={setTo} placeholder="Destination city" />
                </div>
                <button
                  onClick={handleSwap}
                  className="absolute right-3 top-6 bg-secondary text-secondary-foreground rounded-full p-1.5 shadow-lg hover:scale-110 transition-transform z-10"
                  title="Swap cities"
                >
                  <motion.div animate={{ rotate: swapped ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </motion.div>
                </button>
              </div>

              {/* Departure date */}
              <div className="space-y-1.5">
                <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">Departure</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start bg-white border-0 rounded-xl h-10 font-normal", !date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {date ? format(date, "dd MMM yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus disabled={(d) => d < new Date()} />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Return date — only for round trip */}
              <AnimatePresence>
                {tripType === "round-trip" && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">Return</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start bg-white border-0 rounded-xl h-10 font-normal", !returnDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4 text-secondary" />
                          {returnDate ? format(returnDate, "dd MMM yyyy") : "Return date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={returnDate}
                          onSelect={setReturnDate}
                          initialFocus
                          disabled={(d) => d < (date ?? new Date())}
                        />
                      </PopoverContent>
                    </Popover>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Passengers & Class */}
              <div className="space-y-1.5">
                <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">Passengers & Class</Label>
                <Select value={`${travelers}-${cabinClass}`} onValueChange={(val) => {
                  const [t, c] = val.split("-");
                  setTravelers(parseInt(t, 10));
                  setCabinClass(c as SearchFlightsCabinClass);
                }}>
                  <SelectTrigger className="bg-white border-0 rounded-xl h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CABIN_OPTIONS.map(o => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="flex items-end">
                <Button className="w-full h-10 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold shadow-lg">
                  <Plane className="w-4 h-4 mr-2" /> Search Flights
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
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                Searching all available flights...
              </div>
            ) : (
              <p className="text-sm font-medium text-foreground">
                <span className="text-primary font-bold text-base">{sortedFlights.length}</span>
                <span className="text-muted-foreground ml-1">
                  {sortedFlights.length === 1 ? "flight" : "flights"} found
                  {from && to ? ` · ${from} → ${to}` : ""}
                  {tripType === "round-trip" ? " (Round Trip)" : ""}
                </span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground hidden sm:block">Sort:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 border-none bg-muted/50 shadow-none focus:ring-0 font-semibold gap-1 rounded-lg text-sm w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Lowest Price</SelectItem>
                <SelectItem value="duration">Shortest Duration</SelectItem>
                <SelectItem value="departure">Earliest Departure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Round trip info banner */}
        {tripType === "round-trip" && !isLoading && sortedFlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary/10 border border-secondary/30 rounded-xl px-4 py-3 mb-4 flex items-center gap-3"
          >
            <ArrowLeftRight className="w-4 h-4 text-secondary shrink-0" />
            <p className="text-sm font-medium text-foreground">
              <strong>Round Trip selected</strong> — prices shown include both outbound and return legs.
              {returnDate && date && (
                <span className="text-muted-foreground ml-2">
                  {format(date, "dd MMM")} → {format(returnDate, "dd MMM yyyy")}
                </span>
              )}
            </p>
          </motion.div>
        )}

        {/* Flight cards */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-border h-44 animate-pulse" />
            ))}
          </div>
        ) : sortedFlights.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-16 text-center">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-5">
              <Plane className="w-10 h-10 text-primary/40" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">No flights found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a departure and destination city above to search flights. We support routes across India and worldwide.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedFlights.map((flight, i) => {
              const price = typeof flight.price === "number" ? flight.price : 0;
              const displayPrice = tripType === "round-trip" ? Math.round(price * roundTripMultiplier) : price;

              return (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col md:flex-row"
                >
                  {/* Airline ribbon */}
                  <div className="md:w-3 bg-gradient-to-b from-primary to-accent shrink-0" />

                  <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row gap-5">
                    {/* Left: flight info */}
                    <div className="flex-1">
                      {/* Airline row */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center text-primary font-black text-sm">
                          {(flight.airlineCode || flight.airline?.substring(0, 2) || "AI").toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{flight.airline}</p>
                          <p className="text-xs text-muted-foreground">{flight.flightNumber}</p>
                        </div>
                        {flight.stops === 0 && (
                          <Badge className="ml-auto bg-accent/10 text-accent border-0 text-xs font-semibold">Non-Stop</Badge>
                        )}
                        {flight.stops > 0 && (
                          <Badge variant="secondary" className="ml-auto text-xs">{flight.stops} Stop</Badge>
                        )}
                      </div>

                      {/* Route timeline */}
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="text-3xl font-bold text-foreground tracking-tight">{flight.departureTime}</div>
                          <div className="text-sm font-semibold text-primary mt-0.5">{flight.fromCode}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 max-w-[100px] truncate">{flight.from}</div>
                        </div>

                        <div className="flex-1 px-4 flex flex-col items-center gap-1">
                          <span className="text-xs text-muted-foreground font-medium">{flight.duration}</span>
                          <div className="w-full flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full border-2 border-primary bg-white" />
                            <div className="flex-1 h-px bg-gradient-to-r from-primary via-secondary to-primary" />
                            <Plane className="w-4 h-4 text-secondary fill-secondary" />
                            <div className="flex-1 h-px bg-gradient-to-r from-secondary to-primary" />
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">
                            {flight.stops === 0 ? "Direct" : `${flight.stops} stop via hub`}
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="text-3xl font-bold text-foreground tracking-tight">{flight.arrivalTime}</div>
                          <div className="text-sm font-semibold text-primary mt-0.5">{flight.toCode}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 max-w-[100px] truncate text-right">{flight.to}</div>
                        </div>
                      </div>

                      {/* Amenities */}
                      {flight.amenities && flight.amenities.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border">
                          {flight.amenities.slice(0, 4).map(amenity => (
                            <div key={amenity} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              {getAmenityIcon(amenity)}
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right: pricing */}
                    <div className="md:w-52 md:border-l md:border-border md:pl-6 flex flex-row md:flex-col justify-between md:justify-center items-end md:items-center gap-4 pt-4 md:pt-0 border-t border-border md:border-t-0">
                      <div className="text-center md:mb-2">
                        <div className="text-xs text-muted-foreground mb-1 capitalize">
                          {flight.cabinClass} · {travelers} traveller{travelers > 1 ? "s" : ""}
                        </div>
                        <div className="text-3xl font-bold text-primary leading-none">
                          ₹{displayPrice.toLocaleString("en-IN")}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {tripType === "round-trip" ? "round trip total" : "per traveller"}
                        </div>
                        {tripType === "round-trip" && (
                          <div className="text-xs text-muted-foreground">
                            (₹{price.toLocaleString("en-IN")} × 1.9)
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-2 w-full">
                        <Button onClick={() => handleBook(flight)} className="w-full hover-elevate bg-primary hover:bg-primary/90 rounded-xl font-semibold">
                          {tripType === "round-trip" ? "Book Round Trip" : "Select"}
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                        {flight.seatsLeft && flight.seatsLeft < 10 && (
                          <div className="text-xs text-destructive font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Only {flight.seatsLeft} seats left
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
