import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { 
  Building2, MapPin, Star, Wifi, Coffee, Waves, Dumbbell, 
  Car, SlidersHorizontal, Calendar as CalendarIcon
} from "lucide-react";
import { 
  useSearchHotels, 
  getSearchHotelsQueryKey,
  HotelListing
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/lib/booking-store";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Wi-Fi': <Wifi className="w-4 h-4" />,
  'Pool': <Waves className="w-4 h-4" />,
  'Gym': <Dumbbell className="w-4 h-4" />,
  'Breakfast': <Coffee className="w-4 h-4" />,
  'Parking': <Car className="w-4 h-4" />,
};

export function Hotels() {
  const [, setLocation] = useLocation();
  const setBookingItem = useBookingStore(state => state.setBookingItem);
  
  // Search state
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  
  // Read params from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("destination")) setDestination(params.get("destination") as string);
    if (params.get("checkIn")) {
      try { setCheckIn(parseISO(params.get("checkIn") as string)); } catch (e) {}
    }
  }, []);

  const searchParams = {
    destination: destination || undefined,
    checkIn: checkIn ? format(checkIn, "yyyy-MM-dd") : undefined,
    checkOut: checkOut ? format(checkOut, "yyyy-MM-dd") : undefined,
    guests,
    rooms
  };

  const { data, isLoading } = useSearchHotels(searchParams, {
    query: {
      queryKey: getSearchHotelsQueryKey(searchParams),
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleBook = (hotel: HotelListing) => {
    setBookingItem("hotel", hotel, { 
      guests, 
      rooms,
      checkIn: checkIn ? format(checkIn, "yyyy-MM-dd") : undefined,
      checkOut: checkOut ? format(checkOut, "yyyy-MM-dd") : undefined
    });
    setLocation("/checkout");
  };

  return (
    <div className="bg-muted/20 min-h-screen pb-20">
      {/* Header Search */}
      <div className="bg-primary text-primary-foreground py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-serif font-bold mb-8">Discover Exceptional Hotels</h1>
          
          <div className="bg-card text-card-foreground p-6 rounded-xl shadow-lg border border-border/50">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2 lg:col-span-2">
                <Label>Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={destination} 
                    onChange={e => setDestination(e.target.value)} 
                    placeholder="City, landmark, or property name" 
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Check-in</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal border-input",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "MMM d, yyyy") : <span>Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Guests & Rooms</Label>
                <Select value={`${guests}-${rooms}`} onValueChange={(val) => {
                  const [g, r] = val.split("-");
                  setGuests(parseInt(g, 10));
                  setRooms(parseInt(r, 10));
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-1">1 Guest, 1 Room</SelectItem>
                    <SelectItem value="2-1">2 Guests, 1 Room</SelectItem>
                    <SelectItem value="3-1">3 Guests, 1 Room</SelectItem>
                    <SelectItem value="4-2">4 Guests, 2 Rooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button type="submit" className="w-full h-10">Search</Button>
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
                <h2 className="font-bold font-serif text-lg">Refine</h2>
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
              
              <div className="space-y-6 text-sm">
                <div>
                  <h3 className="font-semibold mb-3">Star Rating</h3>
                  <div className="space-y-2">
                    {[5, 4, 3].map(rating => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-input" defaultChecked={rating >= 4} />
                        <span className="flex items-center">
                          {rating} <Star className="w-3.5 h-3.5 ml-1 fill-secondary text-secondary" />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="space-y-2">
                    {['Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Room Service'].map(amenity => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-input" />
                        <span>{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Property Type</h3>
                  <div className="space-y-2">
                    {['Hotel', 'Resort', 'Boutique', 'Villa'].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-input" defaultChecked={type === 'Hotel' || type === 'Resort'} />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold">
                {isLoading ? "Searching..." : destination ? `Hotels in ${destination}` : "Curated Properties"}
              </h2>
              <div className="flex items-center gap-2 text-sm bg-card px-3 py-1.5 rounded-lg border border-border">
                <span className="text-muted-foreground">Sort by:</span>
                <Select defaultValue="recommended">
                  <SelectTrigger className="h-6 border-none bg-transparent shadow-none focus:ring-0 p-0 font-semibold gap-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price_low">Lowest Price</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-card border border-border rounded-xl h-64 animate-pulse" />
                ))}
              </div>
            ) : data?.hotels.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-12 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-serif font-bold mb-2">No properties found</h3>
                <p className="text-muted-foreground">We couldn't find any hotels matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {data?.hotels.map((hotel, i) => (
                  <motion.div 
                    key={hotel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col md:flex-row"
                  >
                    <div className="md:w-72 h-48 md:h-auto relative shrink-0">
                      <img 
                        src={hotel.imageUrl || `https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop`} 
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                        {hotel.category}
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            {Array(Math.floor(hotel.rating)).fill(0).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                            ))}
                            {hotel.rating % 1 !== 0 && <Star className="w-4 h-4 fill-secondary/50 text-secondary" />}
                          </div>
                          <h3 className="text-2xl font-serif font-bold text-foreground">{hotel.name}</h3>
                        </div>
                        <div className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded">
                          <span className="font-bold">{hotel.rating}</span>
                          <span className="text-xs font-medium">/ 5</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        {hotel.destination} {hotel.address && `• ${hotel.address}`}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {hotel.description || "Experience unparalleled luxury and comfort at this exquisite property, designed to cater to your every need and desire."}
                      </p>
                      
                      {hotel.amenities && (
                        <div className="flex flex-wrap gap-3 mb-6">
                          {hotel.amenities.slice(0, 4).map(amenity => (
                            <div key={amenity} className="flex items-center gap-1.5 text-xs font-medium text-foreground bg-muted px-2 py-1 rounded-md">
                              {AMENITY_ICONS[amenity] || <div className="w-1 h-1 rounded-full bg-primary" />}
                              {amenity}
                            </div>
                          ))}
                          {hotel.amenities.length > 4 && (
                            <div className="text-xs font-medium text-muted-foreground flex items-center px-2 py-1">
                              +{hotel.amenities.length - 4} more
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-end justify-between mt-auto pt-4 border-t border-border">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {hotel.currency === 'USD' ? '$' : hotel.currency === 'EUR' ? '€' : hotel.currency === 'GBP' ? '£' : ''}
                            {hotel.pricePerNight}
                          </div>
                          <div className="text-xs text-muted-foreground">per night / incl. taxes</div>
                        </div>
                        <Button onClick={() => handleBook(hotel)} className="hover-elevate px-8">View Rooms</Button>
                      </div>
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
