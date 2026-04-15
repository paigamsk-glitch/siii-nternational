import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Map, Clock, Star, Heart, Mountain, Umbrella, Building, Users, Compass } from "lucide-react";
import { 
  useSearchHolidays, 
  getSearchHolidaysQueryKey,
  HolidayPackage
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/lib/booking-store";

const THEME_ICONS: Record<string, React.ReactNode> = {
  'Romantic': <Heart className="w-5 h-5" />,
  'Adventure': <Mountain className="w-5 h-5" />,
  'Beach': <Umbrella className="w-5 h-5" />,
  'Cultural': <Building className="w-5 h-5" />,
  'Family': <Users className="w-5 h-5" />,
};

export function Holidays() {
  const [, setLocation] = useLocation();
  const setBookingItem = useBookingStore(state => state.setBookingItem);
  
  // Search state
  const [destination, setDestination] = useState("");
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  
  // Read params from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("destination")) setDestination(params.get("destination") as string);
    if (params.get("theme")) setActiveTheme(params.get("theme") as string);
  }, []);

  const searchParams = {
    destination: destination || undefined,
    theme: activeTheme || undefined,
  };

  const { data, isLoading } = useSearchHolidays(searchParams, {
    query: {
      queryKey: getSearchHolidaysQueryKey(searchParams),
    }
  });

  const handleBook = (holiday: HolidayPackage) => {
    setBookingItem("holiday", holiday);
    setLocation("/checkout");
  };

  const themes = [
    { id: 'Romantic', label: 'Couples & Romance' },
    { id: 'Adventure', label: 'Thrill & Adventure' },
    { id: 'Beach', label: 'Sun & Sea' },
    { id: 'Cultural', label: 'Heritage & Culture' },
    { id: 'Family', label: 'Family Friendly' },
  ];

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Hero Header */}
      <div className="bg-primary pt-16 pb-24 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Curated Journeys</h1>
          <p className="text-lg text-primary-foreground/80 mb-10">
            Discover our collection of expertly crafted itineraries. Handpicked accommodations, exclusive experiences, and seamless logistics.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Input 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Search by country, region, or experience..." 
              className="h-14 pl-6 pr-14 text-lg rounded-full bg-white text-foreground border-none focus-visible:ring-secondary focus-visible:ring-2"
            />
            <Button size="icon" className="absolute right-2 top-2 rounded-full bg-primary hover:bg-primary/90">
              <Compass className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Theme Filters */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-16">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-4 flex flex-wrap justify-center gap-2 md:gap-4 max-w-4xl mx-auto">
          <button 
            onClick={() => setActiveTheme(null)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all border",
              activeTheme === null 
                ? "bg-secondary text-secondary-foreground border-secondary" 
                : "bg-transparent text-muted-foreground border-border hover:border-secondary hover:text-foreground"
            )}
          >
            All Experiences
          </button>
          {themes.map(theme => (
            <button 
              key={theme.id}
              onClick={() => setActiveTheme(theme.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                activeTheme === theme.id 
                  ? "bg-secondary text-secondary-foreground border-secondary" 
                  : "bg-transparent text-muted-foreground border-border hover:border-secondary hover:text-foreground"
              )}
            >
              {THEME_ICONS[theme.id]}
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-card rounded-2xl h-[450px] animate-pulse border border-border" />
            ))}
          </div>
        ) : data?.packages.length === 0 ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <Map className="w-16 h-16 text-muted-foreground opacity-30 mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-3">No journeys found</h3>
            <p className="text-muted-foreground">We couldn't find any packages matching your search. Try a different destination or theme.</p>
            <Button variant="outline" className="mt-6" onClick={() => { setDestination(""); setActiveTheme(null); }}>
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.packages.map((pkg, i) => (
              <motion.div 
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={pkg.imageUrl || `https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop`} 
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm flex items-center gap-1.5">
                    {THEME_ICONS[pkg.theme]}
                    {pkg.theme}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-primary/90 backdrop-blur px-3 py-1.5 rounded-lg text-white shadow-md">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      {pkg.duration} Days
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium tracking-wide text-secondary uppercase">
                      {pkg.country || pkg.destination}
                    </div>
                    {pkg.rating && (
                      <div className="flex items-center gap-1 text-sm font-medium bg-muted px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                        {pkg.rating}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                    {pkg.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                    {pkg.description || `Immerse yourself in the beauty and culture of ${pkg.destination}. A perfectly balanced itinerary.`}
                  </p>
                  
                  {pkg.highlights && (
                    <div className="mb-6 space-y-2">
                      {pkg.highlights.slice(0, 2).map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                          <span className="line-clamp-1">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="pt-5 border-t border-border mt-auto flex items-end justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-1">From</div>
                      <div className="text-2xl font-bold text-primary">
                        {pkg.currency === 'USD' ? '$' : pkg.currency === 'EUR' ? '€' : pkg.currency === 'GBP' ? '£' : pkg.currency === 'INR' ? '₹' : ''}
                        {typeof pkg.price === 'number' ? pkg.price.toLocaleString('en-IN') : pkg.price}
                      </div>
                    </div>
                    <Button onClick={() => handleBook(pkg)} className="hover-elevate">View Details</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
