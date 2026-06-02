import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, Plane, ArrowRight, Clock, Users, Tag } from "lucide-react";
import { Link } from "wouter";
import { useGetPopularDestinations, useGetOffers, getGetPopularDestinationsQueryKey, getGetOffersQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/lib/booking-store";

const DESTINATION_PACKAGES: Record<string, {
  highlights: string[];
  bestTime: string;
  currency: string;
  language: string;
  flights: { from: string; price: number; duration: string }[];
  packages: { title: string; duration: number; price: number; inclusions: string[] }[];
}> = {
  "Bali": {
    highlights: ["Tegallalang Rice Terraces", "Tanah Lot Temple", "Ubud Monkey Forest", "Seminyak Beach", "Kecak Fire Dance"],
    bestTime: "April – October",
    currency: "Indonesian Rupiah (IDR)",
    language: "Bahasa Indonesia",
    flights: [
      { from: "Delhi", price: 32000, duration: "7h 30m" },
      { from: "Mumbai", price: 28000, duration: "6h 15m" },
      { from: "Bangalore", price: 29000, duration: "6h 45m" },
    ],
    packages: [
      { title: "Bali Paradise Escape", duration: 7, price: 48000, inclusions: ["Flights", "Beachfront Villa", "Breakfast", "Spa Session"] },
      { title: "Bali Honeymoon Special", duration: 10, price: 75000, inclusions: ["Flights", "Luxury Villa", "All Meals", "Private Tours"] },
    ],
  },
  "Paris": {
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre Dame Cathedral", "Montmartre", "Seine River Cruise"],
    bestTime: "April – June, September – October",
    currency: "Euro (EUR)",
    language: "French",
    flights: [
      { from: "Delhi", price: 52000, duration: "8h 45m" },
      { from: "Mumbai", price: 58000, duration: "9h 30m" },
    ],
    packages: [
      { title: "Paris Romance Getaway", duration: 6, price: 95000, inclusions: ["Flights", "Boutique Hotel", "Breakfast", "City Tour"] },
      { title: "European Dream Tour", duration: 12, price: 145000, inclusions: ["Flights", "4-Star Hotels", "Breakfast", "Eurostar"] },
    ],
  },
  "Maldives": {
    highlights: ["Overwater Bungalows", "Coral Reef Snorkeling", "Private Sandbank", "Underwater Restaurant", "Dolphin Cruises"],
    bestTime: "November – April",
    currency: "Maldivian Rufiyaa (MVR)",
    language: "Dhivehi",
    flights: [
      { from: "Delhi", price: 22000, duration: "4h 30m" },
      { from: "Mumbai", price: 18000, duration: "3h 45m" },
      { from: "Bangalore", price: 20000, duration: "4h 10m" },
    ],
    packages: [
      { title: "Maldives Overwater Luxury", duration: 6, price: 125000, inclusions: ["Flights", "Seaplane Transfer", "Overwater Bungalow", "All-Inclusive"] },
      { title: "Maldives Honeymoon Special", duration: 8, price: 160000, inclusions: ["Flights", "Premium Villa", "All Meals", "Spa", "Water Sports"] },
    ],
  },
  "Dubai": {
    highlights: ["Burj Khalifa Summit", "Desert Safari", "Dubai Frame", "Gold Souk", "Dubai Mall & Aquarium"],
    bestTime: "November – March",
    currency: "UAE Dirham (AED)",
    language: "Arabic",
    flights: [
      { from: "Delhi", price: 12000, duration: "3h 30m" },
      { from: "Mumbai", price: 10000, duration: "2h 45m" },
      { from: "Bangalore", price: 14000, duration: "3h 50m" },
    ],
    packages: [
      { title: "Dubai City & Desert Adventure", duration: 5, price: 55000, inclusions: ["Flights", "5-Star Hotel", "Breakfast", "Desert Safari", "Burj Khalifa"] },
      { title: "Dubai Family Fun Pack", duration: 7, price: 72000, inclusions: ["Flights", "Hotel", "Breakfast", "All Attractions", "Waterpark"] },
    ],
  },
  "Goa": {
    highlights: ["Calangute Beach", "Fort Aguada", "Dudhsagar Waterfalls", "Spice Plantation", "Anjuna Market"],
    bestTime: "November – February",
    currency: "Indian Rupee (INR)",
    language: "Konkani, Hindi, English",
    flights: [
      { from: "Delhi", price: 5500, duration: "2h 30m" },
      { from: "Mumbai", price: 3200, duration: "1h 15m" },
      { from: "Bangalore", price: 3800, duration: "1h 20m" },
    ],
    packages: [
      { title: "Goa Beach Bliss", duration: 5, price: 18000, inclusions: ["Flights", "Beach Resort", "Breakfast", "Water Sports"] },
      { title: "Goa Party Package", duration: 4, price: 14000, inclusions: ["Flights", "Hotel", "Airport Transfers", "Club Access"] },
    ],
  },
  "Tokyo": {
    highlights: ["Mt Fuji Day Trip", "Shibuya Crossing", "Fushimi Inari Shrine", "Nara Deer Park", "Tsukiji Fish Market"],
    bestTime: "March – May, October – November",
    currency: "Japanese Yen (JPY)",
    language: "Japanese",
    flights: [
      { from: "Delhi", price: 42000, duration: "8h 30m" },
      { from: "Mumbai", price: 38000, duration: "8h 00m" },
    ],
    packages: [
      { title: "Japan Cultural Odyssey", duration: 10, price: 110000, inclusions: ["Flights", "Hotels", "JR Rail Pass", "Breakfast", "Tea Ceremony"] },
      { title: "Tokyo City Break", duration: 6, price: 68000, inclusions: ["Flights", "Hotel", "Breakfast", "City Pass"] },
    ],
  },
};

const HIGHLIGHT_DESCRIPTIONS: Record<string, string> = {
  "Tegallalang Rice Terraces": "Iconic stepped rice paddies carved into the hillsides — best visited at sunrise for golden reflections in the water channels.",
  "Tanah Lot Temple": "A dramatic sea temple perched on a rocky outcrop, surrounded by ocean waves — most magical at sunset.",
  "Ubud Monkey Forest": "A sacred sanctuary home to over 700 long-tailed macaques set within an ancient Hindu temple complex.",
  "Seminyak Beach": "Bali's most glamorous stretch of sand, lined with sunset beach clubs, boutiques, and world-class surf breaks.",
  "Kecak Fire Dance": "A mesmerizing Balinese cultural performance where a choir of 50+ men chant rhythmically around a blazing fire.",
  "Eiffel Tower": "The world's most photographed iron lattice tower, offering panoramic views of Paris from its three observation decks.",
  "Louvre Museum": "The world's largest art museum and a historic monument, home to 35,000 works including the Mona Lisa.",
  "Notre Dame Cathedral": "A masterpiece of French Gothic architecture on the Île de la Cité, famous for its rose windows and gargoyles.",
  "Montmartre": "Paris's bohemian hilltop neighbourhood where Picasso and Monet once lived — crowned by the white-domed Sacré-Cœur.",
  "Seine River Cruise": "An hour-long boat journey past 37 bridges, the Eiffel Tower, and Notre Dame — wonderful at dusk.",
  "Overwater Bungalows": "Private villas perched above crystal-clear lagoons with glass floors, direct ocean access, and stunning sunrise views.",
  "Coral Reef Snorkeling": "Dive into the world's third-largest coral reef system, home to sea turtles, rays, and thousands of tropical fish.",
  "Private Sandbank": "A personal desert island experience — picnic on a pristine sandbar surrounded by turquoise ocean on all sides.",
  "Underwater Restaurant": "Dine 5 metres below the ocean surface with panoramic views of the reef through floor-to-ceiling glass panels.",
  "Dolphin Cruises": "Early morning boat trip to spot spinner dolphins in their natural habitat as they ride the bow waves.",
  "Burj Khalifa Summit": "Ascend to the 148th-floor observation deck of the world's tallest building for 360° views of Dubai and beyond.",
  "Desert Safari": "A thrilling dune-bashing 4x4 adventure followed by a camp dinner under the stars with belly dancing and shisha.",
  "Dubai Frame": "Step inside a giant 150m picture frame bridging old and new Dubai — with a glass-floored sky bridge at the top.",
  "Gold Souk": "A dazzling labyrinth of 380 jewellers selling gold, silver, and diamonds in the heart of Deira.",
  "Dubai Mall & Aquarium": "Shop at the world's largest mall then watch sharks and rays glide past in a 10-million-litre tank.",
  "Calangute Beach": "Goa's 'Queen of Beaches' — a golden arc of sand stretching 7km, popular for water sports and beach shacks.",
  "Fort Aguada": "A 17th-century Portuguese sea fort commanding dramatic coastal views, with a lighthouse still in operation.",
  "Dudhsagar Waterfalls": "A four-tiered cascade tumbling 310m down jungle cliffs — most spectacular after the monsoon season.",
  "Spice Plantation": "Walk through fragrant groves of cardamom, vanilla, and pepper on a guided plantation tour with a farm lunch.",
  "Anjuna Market": "Goa's legendary Wednesday flea market with hundreds of stalls selling clothing, jewellery, and local handicrafts.",
  "Mt Fuji Day Trip": "A day excursion from Tokyo to Japan's iconic snow-capped volcano — perfect backdrop for landscapes and photos.",
  "Shibuya Crossing": "The world's busiest pedestrian crossing where up to 3,000 people cross simultaneously from all directions.",
  "Fushimi Inari Shrine": "A tunnel of 10,000 vermillion torii gates winding through the forested slopes of Mount Inari.",
  "Nara Deer Park": "Walk freely among 1,200 sacred deer that roam the ancient temples and grounds of Japan's former capital.",
  "Tsukiji Fish Market": "Tokyo's legendary seafood bazaar — arrive early for a fresh sushi breakfast and watch tuna auctions.",
  "Guided City Tours": "Explore the city's iconic landmarks, hidden gems, and cultural hotspots led by expert local guides.",
  "Cultural Experiences": "Immerse yourself in local traditions through cooking classes, craft workshops, and community visits.",
  "Local Cuisine": "Savour authentic flavours at top-rated local restaurants, street food stalls, and traditional eateries.",
  "Historical Sites": "Discover ancient ruins, heritage monuments, and UNESCO World Heritage sites with expert commentary.",
  "Natural Wonders": "Marvel at breathtaking landscapes — from waterfalls and canyons to forests and mountain vistas.",
};

const DEFAULT_PACKAGE = {
  highlights: ["Guided City Tours", "Cultural Experiences", "Local Cuisine", "Historical Sites", "Natural Wonders"],
  bestTime: "Year-round",
  currency: "Local Currency",
  language: "Local Language",
  flights: [
    { from: "Delhi", price: 35000, duration: "Varies" },
    { from: "Mumbai", price: 32000, duration: "Varies" },
  ],
  packages: [
    { title: "Explorer Package", duration: 7, price: 65000, inclusions: ["Flights", "Hotel", "Breakfast", "City Tour"] },
  ],
};

export function Destination() {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const destName = params.get("name") || "";

  const { data: destData } = useGetPopularDestinations({
    query: { queryKey: getGetPopularDestinationsQueryKey() }
  });

  const dest = destData?.destinations.find(
    (d) => d.name.toLowerCase() === destName.toLowerCase()
  );

  const info = DESTINATION_PACKAGES[destName] || DEFAULT_PACKAGE;

  if (!dest && !destName) {
    setLocation("/destinations");
    return null;
  }

  const displayName = dest?.name || destName;
  const displayCountry = dest?.country || "";
  const displayImage = dest?.imageUrl || `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop`;
  const displayRating = dest?.rating || 4.5;
  const displayPrice = dest?.startingPrice || info.packages[0]?.price || 35000;
  const displayCurrency = dest?.currency || "INR";
  const displayTags = dest?.tags || [];
  const displayDescription = dest?.description || `Discover the wonders of ${displayName} — a destination that captivates travelers with its unique blend of culture, nature, and experiences.`;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={displayImage}
          alt={displayName}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute top-6 left-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-white/80 text-sm font-medium tracking-widest uppercase mb-2">
              <MapPin className="w-3.5 h-3.5 inline mr-1" />
              {displayCountry}
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">{displayName}</h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-semibold">{displayRating}</span>
              </div>
              {displayTags.map((tag) => (
                <span key={tag} className="text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left - Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-serif font-bold mb-4">About {displayName}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">{displayDescription}</p>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-serif font-bold mb-6">Top Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {info.highlights.map((h, i) => (
                  <div key={h} className="flex gap-3 p-4 bg-card border border-border rounded-xl hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">{h}</p>
                      {HIGHLIGHT_DESCRIPTIONS[h] && (
                        <p className="text-xs text-muted-foreground leading-relaxed">{HIGHLIGHT_DESCRIPTIONS[h]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Available Packages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-serif font-bold mb-6">Available Packages</h2>
              <div className="space-y-4">
                {info.packages.map((pkg) => (
                  <div key={pkg.title} className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{pkg.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{pkg.duration} nights</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Per person</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pkg.inclusions.map((inc) => (
                          <span key={inc} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{inc}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-1">
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </div>
                      <div className="text-xs text-muted-foreground mb-3">per person</div>
                      <Button size="sm" onClick={() => setLocation(`/packages`)}>
                        Book Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Flights to this destination */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-serif font-bold mb-6">Flights to {displayName}</h2>
              <div className="space-y-3">
                {info.flights.map((f) => (
                  <div key={f.from} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Plane className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{f.from} → {displayName}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />{f.duration}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">₹{f.price.toLocaleString("en-IN")}</div>
                      <div className="text-xs text-muted-foreground mb-2">onwards</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLocation(`/flights?from=${encodeURIComponent(f.from)}&to=${encodeURIComponent(displayName)}`)}
                      >
                        Search Flights
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right - Quick Info */}
          <div className="space-y-6">
            {/* Quick Book Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-6 sticky top-24"
            >
              <div className="text-center mb-6">
                <div className="text-sm text-muted-foreground mb-1">Packages starting from</div>
                <div className="text-4xl font-bold text-primary">₹{displayPrice.toLocaleString("en-IN")}</div>
                <div className="text-sm text-muted-foreground mt-1">per person</div>
              </div>

              <div className="space-y-3 mb-6">
                <Button
                  className="w-full"
                  onClick={() => setLocation(`/packages`)}
                >
                  Browse Packages <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation(`/flights?to=${encodeURIComponent(displayName)}`)}
                >
                  <Plane className="w-4 h-4 mr-2" /> Search Flights
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation(`/hotels?destination=${encodeURIComponent(displayName)}`)}
                >
                  Find Hotels
                </Button>
              </div>

              <hr className="my-4 border-border" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Best time to visit</span>
                  <span className="font-medium text-right">{info.bestTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency</span>
                  <span className="font-medium text-right text-xs">{info.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language</span>
                  <span className="font-medium text-right text-xs">{info.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {displayRating}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Need Help */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center"
            >
              <h3 className="font-bold mb-2">Need Help Planning?</h3>
              <p className="text-sm text-muted-foreground mb-4">Our travel specialists can build a custom itinerary just for you.</p>
              <Link href="/contact">
                <Button variant="outline" size="sm" className="w-full">Talk to an Expert</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
