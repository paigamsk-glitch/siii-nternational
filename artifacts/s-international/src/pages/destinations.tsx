import { motion } from "framer-motion";
import { Link } from "wouter";
import { MapPin, Star, ArrowRight, Globe, Plane, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ALL_DESTINATIONS = [
  {
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    startingPrice: 48000,
    tags: ["Beach", "Culture", "Luxury"],
    description: "Tropical paradise of temples, rice terraces, and world-class surf beaches.",
  },
  {
    name: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    startingPrice: 95000,
    tags: ["Romance", "Culture", "Luxury"],
    description: "The City of Light — iconic art, haute cuisine, and timeless elegance.",
  },
  {
    name: "Maldives",
    country: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    startingPrice: 125000,
    tags: ["Beach", "Luxury", "Honeymoon"],
    description: "Crystalline waters, overwater bungalows, and pristine coral reefs.",
  },
  {
    name: "Dubai",
    country: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
    rating: 4.7,
    startingPrice: 55000,
    tags: ["Shopping", "Adventure", "Luxury"],
    description: "Where futuristic skylines meet golden deserts and world-record attractions.",
  },
  {
    name: "Goa",
    country: "India",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop",
    rating: 4.5,
    startingPrice: 14000,
    tags: ["Beach", "Nightlife", "Budget"],
    description: "Sun-drenched beaches, Portuguese heritage, and vibrant coastal culture.",
  },
  {
    name: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    startingPrice: 68000,
    tags: ["Culture", "Food", "Adventure"],
    description: "A mesmerizing blend of ultra-modern technology and ancient tradition.",
  },
  {
    name: "Singapore",
    country: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1200&auto=format&fit=crop",
    rating: 4.7,
    startingPrice: 45000,
    tags: ["Family", "Shopping", "Food"],
    description: "Asia's gleaming city-state — world-class food, gardens, and entertainment.",
  },
  {
    name: "Switzerland",
    country: "Switzerland",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    startingPrice: 150000,
    tags: ["Nature", "Luxury", "Winter"],
    description: "Majestic Alps, pristine lakes, and charming villages wrapped in luxury.",
  },
  {
    name: "Bangkok",
    country: "Thailand",
    image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=1200&auto=format&fit=crop",
    rating: 4.6,
    startingPrice: 25000,
    tags: ["Culture", "Food", "Budget"],
    description: "Vibrant street life, golden temples, and legendary Thai hospitality.",
  },
  {
    name: "Rome",
    country: "Italy",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    startingPrice: 90000,
    tags: ["History", "Culture", "Romance"],
    description: "The Eternal City — two millennia of art, architecture, and cuisine.",
  },
  {
    name: "New York",
    country: "USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200&auto=format&fit=crop",
    rating: 4.7,
    startingPrice: 110000,
    tags: ["City", "Culture", "Shopping"],
    description: "The city that never sleeps — iconic skyline, Broadway, and global culture.",
  },
  {
    name: "Santorini",
    country: "Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    startingPrice: 105000,
    tags: ["Romance", "Beach", "Luxury"],
    description: "Iconic blue domes, volcanic cliffs, and the most breathtaking sunsets on earth.",
  },
];

const ALL_TAGS = ["All", "Beach", "Culture", "Luxury", "Romance", "Adventure", "Family", "Budget", "Nature", "History", "Food"];

export function Destinations() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const filtered = ALL_DESTINATIONS.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase());
    const matchesTag = activeTag === "All" || d.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[440px] max-h-[600px] overflow-hidden flex items-end">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop"
          alt="Popular destinations"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 pb-16 md:pb-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-2 text-secondary text-sm font-semibold tracking-widest uppercase mb-4">
              <Globe className="w-4 h-4" />
              S International Travel
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 leading-none">
              Popular<br />Destinations
            </h1>
            <p className="text-xl text-white/75 max-w-xl font-light leading-relaxed">
              Explore our handpicked collection of the world's most extraordinary travel destinations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-card border-b border-border sticky top-16 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search destinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeTag === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="container mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/destination?name=${encodeURIComponent(dest.name)}`}>
                  <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {dest.rating}
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <div className="flex flex-wrap gap-1">
                          {dest.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-serif font-bold text-lg leading-tight">{dest.name}</h3>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3" />
                        {dest.country}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                        {dest.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-muted-foreground">From </span>
                          <span className="font-bold text-primary">₹{dest.startingPrice.toLocaleString("en-IN")}</span>
                          <span className="text-xs text-muted-foreground">/person</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Plane className="w-3 h-3" />
                          Flights available
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Can't find your dream destination?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              Our travel experts can create a bespoke itinerary to any destination in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="rounded-xl font-semibold">
                  Talk to an Expert
                </Button>
              </Link>
              <Link href="/packages">
                <Button size="lg" variant="outline" className="rounded-xl font-semibold border-white/30 text-white hover:bg-white/10">
                  Browse All Packages
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
