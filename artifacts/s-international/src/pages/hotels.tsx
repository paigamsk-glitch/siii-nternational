import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { format, parseISO, differenceInDays } from "date-fns";
import {
  Building2, MapPin, Star, Wifi, Coffee, Waves, Dumbbell,
  Car, Calendar as CalendarIcon, ArrowRight, Eye,
  UtensilsCrossed, Sparkles, ChevronRight
} from "lucide-react";
import {
  useSearchHotels,
  getSearchHotelsQueryKey,
  HotelListing
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CityAutocomplete } from "@/components/city-autocomplete";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/lib/booking-store";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Free WiFi": <Wifi className="w-3.5 h-3.5" />,
  "Pool": <Waves className="w-3.5 h-3.5" />,
  "Beach Access": <Waves className="w-3.5 h-3.5" />,
  "Gym": <Dumbbell className="w-3.5 h-3.5" />,
  "Fitness Center": <Dumbbell className="w-3.5 h-3.5" />,
  "Breakfast": <Coffee className="w-3.5 h-3.5" />,
  "Restaurant": <UtensilsCrossed className="w-3.5 h-3.5" />,
  "Parking": <Car className="w-3.5 h-3.5" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  "Ultra Luxury": "bg-secondary text-secondary-foreground",
  "Luxury": "bg-primary/10 text-primary",
  "Heritage Luxury": "bg-accent/10 text-accent",
  "Boutique Luxury": "bg-purple-100 text-purple-700",
  "Wellness Luxury": "bg-emerald-100 text-emerald-700",
  "Iconic": "bg-amber-100 text-amber-700",
  "Business Luxury": "bg-sky-100 text-sky-700",
};

export function Hotels() {
  const [, setLocation] = useLocation();
  const setBookingItem = useBookingStore(state => state.setBookingItem);

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("destination")) setDestination(params.get("destination") as string);
    if (params.get("promo")) setPromoCode(params.get("promo"));
    if (params.get("checkIn")) {
      try { setCheckIn(parseISO(params.get("checkIn") as string)); } catch (e) {}
    }
  }, []);

  const searchParams = {
    destination: destination || undefined,
    checkIn: checkIn ? format(checkIn, "yyyy-MM-dd") : undefined,
    checkOut: checkOut ? format(checkOut, "yyyy-MM-dd") : undefined,
    guests,
    rooms,
  };

  const { data, isLoading } = useSearchHotels(searchParams, {
    query: { queryKey: getSearchHotelsQueryKey(searchParams) },
  });

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 1;

  const sortedHotels = [...(data?.hotels ?? [])].sort((a, b) => {
    if (sortBy === "price_low") return (a.pricePerNight as number) - (b.pricePerNight as number);
    if (sortBy === "price_high") return (b.pricePerNight as number) - (a.pricePerNight as number);
    if (sortBy === "rating") return (b.rating as number) - (a.rating as number);
    return 0;
  });

  const handleBook = (hotel: HotelListing) => {
    setBookingItem("hotel", hotel, {
      guests, rooms,
      checkIn: checkIn ? format(checkIn, "yyyy-MM-dd") : undefined,
      checkOut: checkOut ? format(checkOut, "yyyy-MM-dd") : undefined,
    });
    setLocation("/checkout");
  };

  const handleViewDetails = (hotel: HotelListing) => {
    setLocation(`/hotels/${hotel.id}`);
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: "hsl(232 22% 97%)" }}>
      {/* Hero search */}
      <div className="bg-primary text-primary-foreground pt-10 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: "cover", backgroundPosition: "center"
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-6 h-6 text-secondary" />
            <span className="text-secondary text-sm font-semibold tracking-widest uppercase">Hotel Search</span>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-8">Discover Exceptional Hotels</h1>

          <div className="bg-white/10 backdrop-blur-md text-foreground rounded-2xl shadow-2xl border border-white/20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Destination */}
              <div className="space-y-1.5 lg:col-span-2">
                <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">Destination</Label>
                <div className="bg-white rounded-xl overflow-hidden">
                  <CityAutocomplete value={destination} onChange={setDestination} placeholder="City, hotel, or landmark" />
                </div>
              </div>

              {/* Check-in */}
              <div className="space-y-1.5">
                <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">Check-in</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start bg-white border-0 rounded-xl h-10 font-normal", !checkIn && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {checkIn ? format(checkIn, "dd MMM yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus disabled={(d) => d < new Date()} />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out */}
              <div className="space-y-1.5">
                <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">Check-out</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start bg-white border-0 rounded-xl h-10 font-normal", !checkOut && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4 text-secondary" />
                      {checkOut ? format(checkOut, "dd MMM yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus disabled={(d) => d < (checkIn ?? new Date())} />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests */}
              <div className="space-y-1.5">
                <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">Guests & Rooms</Label>
                <Select value={`${guests}-${rooms}`} onValueChange={(val) => {
                  const [g, r] = val.split("-");
                  setGuests(parseInt(g, 10));
                  setRooms(parseInt(r, 10));
                }}>
                  <SelectTrigger className="bg-white border-0 rounded-xl h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-1">1 Guest · 1 Room</SelectItem>
                    <SelectItem value="2-1">2 Guests · 1 Room</SelectItem>
                    <SelectItem value="3-1">3 Guests · 1 Room</SelectItem>
                    <SelectItem value="4-2">4 Guests · 2 Rooms</SelectItem>
                    <SelectItem value="6-3">6 Guests · 3 Rooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl px-8 font-semibold shadow-lg">
                <Building2 className="w-4 h-4 mr-2" /> Search Hotels
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Promo banner */}
      {promoCode === "HOTEL20" && (
        <div className="bg-secondary/10 border-b border-secondary/30">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="font-semibold">Hotel Stay & Save applied!</span>
              <span className="text-muted-foreground text-sm ml-1">Use code <span className="font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">HOTEL20</span> at checkout for 20% off.</span>
            </div>
            <button onClick={() => setPromoCode(null)} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 -mt-4">
        {/* Results toolbar */}
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-border px-5 py-3 mb-5">
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                Searching properties...
              </div>
            ) : (
              <p className="text-sm font-medium">
                <span className="text-primary font-bold text-base">{sortedHotels.length}</span>
                <span className="text-muted-foreground ml-1">
                  {sortedHotels.length === 1 ? "property" : "properties"}
                  {destination ? ` in ${destination}` : " available"}
                  {checkIn && checkOut ? ` · ${nights} night${nights > 1 ? "s" : ""}` : ""}
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
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price_low">Lowest Price</SelectItem>
                <SelectItem value="price_high">Highest Price</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Hotel cards */}
        {isLoading ? (
          <div className="space-y-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-border h-72 animate-pulse" />
            ))}
          </div>
        ) : sortedHotels.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-16 text-center">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-5">
              <Building2 className="w-10 h-10 text-primary/40" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">No properties found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter any destination to find hotels. We cover India and major international cities.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {sortedHotels.map((hotel, i) => {
              const pricePerNight = typeof hotel.pricePerNight === "number" ? hotel.pricePerNight : 0;
              const totalPrice = pricePerNight * Math.max(nights, 1);

              return (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col md:flex-row group"
                >
                  {/* Photo section */}
                  <div className="md:w-80 h-52 md:h-auto relative shrink-0 overflow-hidden">
                    <img
                      src={(hotel as any).imageUrl || hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", CATEGORY_COLORS[hotel.category || "Luxury"] || "bg-primary/10 text-primary")}>
                        {hotel.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur text-white px-2 py-1 rounded-lg">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">5 Photos</span>
                    </div>
                  </div>

                  {/* Info section */}
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-1.5">
                          {Array(Math.round(hotel.rating ?? 4)).fill(0).map((_, idx) => (
                            <Star key={idx} className="w-4 h-4 fill-secondary text-secondary" />
                          ))}
                        </div>
                        <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                          {hotel.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 bg-primary text-primary-foreground px-2.5 py-1 rounded-xl ml-4 shrink-0">
                        <span className="font-bold text-sm">{hotel.rating}</span>
                        <span className="text-xs opacity-80">/ 5</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4 mr-1.5 text-secondary shrink-0" />
                      {hotel.destination}
                      {hotel.address && <span className="ml-1 hidden sm:inline">· {hotel.address}</span>}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {hotel.description}
                    </p>

                    {/* Amenities */}
                    {hotel.amenities && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {hotel.amenities.slice(0, 5).map(amenity => (
                          <div key={amenity} className="flex items-center gap-1.5 text-xs font-medium text-foreground bg-muted px-2.5 py-1 rounded-lg border border-border/50">
                            {AMENITY_ICONS[amenity] || <div className="w-1.5 h-1.5 rounded-full bg-secondary" />}
                            {amenity}
                          </div>
                        ))}
                        {hotel.amenities.length > 5 && (
                          <div className="text-xs font-medium text-muted-foreground flex items-center px-2 py-1">
                            +{hotel.amenities.length - 5} more
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pricing & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          ₹{pricePerNight.toLocaleString("en-IN")}
                          <span className="text-sm font-normal text-muted-foreground ml-1">/ night</span>
                        </div>
                        {checkIn && checkOut && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            ₹{totalPrice.toLocaleString("en-IN")} total for {nights} night{nights > 1 ? "s" : ""}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">incl. taxes & fees</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleViewDetails(hotel)}
                          className="hover-elevate rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <Eye className="w-4 h-4 mr-1.5" /> View Hotel
                        </Button>
                        <Button
                          onClick={() => handleBook(hotel)}
                          className="hover-elevate rounded-xl bg-primary font-semibold px-6"
                        >
                          Book Now <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
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
