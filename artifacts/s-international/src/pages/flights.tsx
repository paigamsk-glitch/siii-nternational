import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { 
  Plane, Search, Filter, SlidersHorizontal, ChevronDown, 
  Clock, Calendar as CalendarIcon, Briefcase, CreditCard
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/lib/booking-store";

export function Flights() {
  const [, setLocation] = useLocation();
  const setBookingItem = useBookingStore(state => state.setBookingItem);
  
  // Search state
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date>();
  const [tripType, setTripType] = useState<SearchFlightsTripType>("one-way");
  const [travelers, setTravelers] = useState(1);
  const [cabinClass, setCabinClass] = useState<SearchFlightsCabinClass>("economy");
  
  // Read params from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("from")) setFrom(params.get("from") as string);
    if (params.get("to")) setTo(params.get("to") as string);
    if (params.get("date")) {
      try {
        setDate(parseISO(params.get("date") as string));
      } catch (e) {
        // ignore invalid dates
      }
    }
  }, []);

  const searchParams = {
    from: from || undefined,
    to: to || undefined,
    date: date ? format(date, "yyyy-MM-dd") : undefined,
    tripType,
    travelers,
    cabinClass
  };

  const { data, isLoading } = useSearchFlights(searchParams, {
    query: {
      queryKey: getSearchFlightsQueryKey(searchParams),
      // Only fetch if we have minimum criteria (or we just want to show all by default)
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query automatically refetches because searchParams changes
  };

  const handleBook = (flight: FlightOffer) => {
    setBookingItem("flight", flight, { travelers, date: date ? format(date, "yyyy-MM-dd") : undefined });
    setLocation("/checkout");
  };

  return (
    <div className="bg-muted/20 min-h-screen pb-20">
      {/* Header Search */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold mb-8">Search Flights</h1>
          
          <div className="bg-card text-card-foreground p-6 rounded-xl shadow-lg">
            <form onSubmit={handleSearch} className="flex flex-col gap-6">
              <Tabs value={tripType} onValueChange={(v) => setTripType(v as SearchFlightsTripType)} className="w-full max-w-[400px]">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="one-way">One Way</TabsTrigger>
                  <TabsTrigger value="round-trip">Round Trip</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>From</Label>
                  <CityAutocomplete value={from} onChange={setFrom} placeholder="City or Airport" />
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <CityAutocomplete value={to} onChange={setTo} placeholder="City or Airport" />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal border-input",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Passengers & Class</Label>
                  <Select value={`${travelers}-${cabinClass}`} onValueChange={(val) => {
                    const [t, c] = val.split("-");
                    setTravelers(parseInt(t, 10));
                    setCabinClass(c as SearchFlightsCabinClass);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-economy">1 Passenger, Economy</SelectItem>
                      <SelectItem value="2-economy">2 Passengers, Economy</SelectItem>
                      <SelectItem value="1-business">1 Passenger, Business</SelectItem>
                      <SelectItem value="2-business">2 Passengers, Business</SelectItem>
                      <SelectItem value="1-first">1 Passenger, First</SelectItem>
                      <SelectItem value="2-first">2 Passengers, First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full h-10">Search</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold font-serif text-lg">Filters</h2>
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
              
              <div className="space-y-6 text-sm">
                <div>
                  <h3 className="font-semibold mb-3">Stops</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" defaultChecked />
                      <span>Direct (0 stops)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" defaultChecked />
                      <span>1 stop</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" defaultChecked />
                      <span>2+ stops</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Airlines</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" defaultChecked />
                      <span>Emirates</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" defaultChecked />
                      <span>Qatar Airways</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" defaultChecked />
                      <span>Singapore Airlines</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" defaultChecked />
                      <span>British Airways</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
              <p className="text-sm font-medium">
                {isLoading ? "Searching flights..." : `${data?.flights.length || 0} flights found`}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Sort by:</span>
                <Select defaultValue="price">
                  <SelectTrigger className="h-8 border-none bg-transparent shadow-none focus:ring-0 p-0 font-semibold gap-1">
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

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-card border border-border rounded-xl p-6 h-40 animate-pulse" />
                ))}
              </div>
            ) : data?.flights.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-12 text-center">
                <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-serif font-bold mb-2">No flights found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or dates.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data?.flights.map((flight, i) => (
                  <motion.div 
                    key={flight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {flight.airlineCode || flight.airline.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold">{flight.airline}</span>
                        <span className="text-muted-foreground text-sm ml-auto">{flight.flightNumber}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-center relative">
                        <div className="flex flex-col items-start w-1/4">
                          <span className="text-2xl font-bold">{flight.departureTime}</span>
                          <span className="text-sm font-medium text-muted-foreground">{flight.fromCode}</span>
                          <span className="text-xs text-muted-foreground mt-1 truncate max-w-full">{flight.from}</span>
                        </div>
                        
                        <div className="flex flex-col items-center w-2/4 px-4 relative z-10">
                          <span className="text-xs text-muted-foreground mb-2">{flight.duration}</span>
                          <div className="w-full flex items-center">
                            <div className="h-px bg-border flex-1" />
                            <Plane className="w-4 h-4 text-primary mx-2" />
                            <div className="h-px bg-border flex-1" />
                          </div>
                          <span className="text-xs text-primary font-medium mt-2 bg-primary/10 px-2 py-0.5 rounded-full">
                            {flight.stops === 0 ? "Direct" : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-end w-1/4">
                          <span className="text-2xl font-bold">{flight.arrivalTime}</span>
                          <span className="text-sm font-medium text-muted-foreground">{flight.toCode}</span>
                          <span className="text-xs text-muted-foreground mt-1 truncate max-w-full text-right">{flight.to}</span>
                        </div>
                      </div>
                      
                      {flight.amenities && flight.amenities.length > 0 && (
                        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border">
                          {flight.amenities.map(amenity => (
                            <div key={amenity} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              {amenity.toLowerCase().includes('baggage') ? <Briefcase className="w-3.5 h-3.5" /> : 
                               amenity.toLowerCase().includes('meal') ? <CreditCard className="w-3.5 h-3.5" /> : 
                               <Clock className="w-3.5 h-3.5" />}
                              {amenity}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="md:w-48 md:border-l md:border-border md:pl-6 flex flex-col justify-center items-end md:items-center">
                      <div className="text-sm text-muted-foreground mb-1">{flight.cabinClass}</div>
                      <div className="text-3xl font-bold text-primary mb-1">
                        {flight.currency === 'USD' ? '$' : flight.currency === 'EUR' ? '€' : flight.currency === 'GBP' ? '£' : flight.currency === 'INR' ? '₹' : ''}
                        {typeof flight.price === 'number' ? flight.price.toLocaleString('en-IN') : flight.price}
                      </div>
                      <div className="text-xs text-muted-foreground mb-4">per traveler</div>
                      <Button onClick={() => handleBook(flight)} className="w-full hover-elevate">Select</Button>
                      {flight.seatsLeft && flight.seatsLeft < 10 && (
                        <div className="text-xs text-destructive mt-2 font-medium">Only {flight.seatsLeft} seats left</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
