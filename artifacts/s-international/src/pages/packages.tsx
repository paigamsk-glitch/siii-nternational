import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Map, Clock, Star, Heart, Mountain, Umbrella, Building, Users,
  Search, SlidersHorizontal, ArrowRight, CheckCircle2, Plane
} from "lucide-react";
import { travelPackages, themes, type Theme } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const THEME_ICONS: Record<string, React.ReactNode> = {
  Romantic: <Heart className="w-4 h-4" />,
  Adventure: <Mountain className="w-4 h-4" />,
  Beach: <Umbrella className="w-4 h-4" />,
  Cultural: <Building className="w-4 h-4" />,
  Family: <Users className="w-4 h-4" />,
};

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "duration-asc", label: "Duration: Short to Long" },
  { value: "rating", label: "Top Rated" },
];

const DURATION_FILTERS = [
  { label: "All", min: 0, max: 999 },
  { label: "1–4 Days", min: 1, max: 4 },
  { label: "5–7 Days", min: 5, max: 7 },
  { label: "8+ Days", min: 8, max: 999 },
];

export function Packages() {
  const [search, setSearch] = useState("");
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [activeDuration, setActiveDuration] = useState(0);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  const durationFilter = DURATION_FILTERS[activeDuration];

  const filtered = travelPackages
    .filter((pkg) => {
      if (activeTheme && pkg.theme !== activeTheme) return false;
      if (pkg.duration < durationFilter.min || pkg.duration > durationFilter.max) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          pkg.title.toLowerCase().includes(q) ||
          pkg.destination.toLowerCase().includes(q) ||
          pkg.country.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "duration-asc") return a.duration - b.duration;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Hero */}
      <div className="relative bg-primary pt-20 pb-32 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <Plane className="w-3.5 h-3.5" />
              Handcrafted Travel Packages
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-5 leading-tight">
              Find Your<br />Perfect Journey
            </h1>
            <p className="text-lg text-white/75 mb-10 max-w-xl mx-auto">
              Every package is curated by travel experts — seamless logistics, premium stays and unforgettable experiences, all in one price.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destination, country, or experience..."
              className="h-14 pl-14 pr-5 text-base rounded-full bg-white text-foreground border-none shadow-2xl focus-visible:ring-2 focus-visible:ring-secondary"
            />
          </motion.div>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-10">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            {/* Theme Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTheme(null)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  activeTheme === null
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-foreground"
                )}
              >
                All
              </button>
              {themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setActiveTheme(theme === activeTheme ? null : theme)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                    activeTheme === theme
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-foreground"
                  )}
                >
                  {THEME_ICONS[theme]}
                  {theme}
                </button>
              ))}
            </div>

            {/* Sort + Filter Toggle */}
            <div className="flex items-center gap-3 shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 h-9 px-4 rounded-lg border text-sm font-medium transition-all",
                  showFilters ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-border"
            >
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-sm font-medium text-muted-foreground">Duration:</span>
                {DURATION_FILTERS.map((df, idx) => (
                  <button
                    key={df.label}
                    onClick={() => setActiveDuration(idx)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm border transition-all",
                      activeDuration === idx
                        ? "bg-secondary text-secondary-foreground border-secondary"
                        : "border-border text-muted-foreground hover:border-secondary hover:text-foreground"
                    )}
                  >
                    {df.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground text-sm">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> packages
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 max-w-md mx-auto">
            <Map className="w-16 h-16 text-muted-foreground opacity-30 mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-3">No packages found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters.</p>
            <Button variant="outline" onClick={() => { setSearch(""); setActiveTheme(null); setActiveDuration(0); }}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={pkg.images[0]}
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full shadow">
                      {pkg.badge}
                    </div>
                  )}

                  {/* Duration pill */}
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {pkg.duration} Days
                  </div>

                  {/* Theme pill */}
                  <div className="absolute bottom-4 right-4 bg-white/90 text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow">
                    {THEME_ICONS[pkg.theme]}
                    {pkg.theme}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-secondary uppercase tracking-widest">
                      {pkg.destination}, {pkg.country}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-medium bg-muted px-2 py-1 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{pkg.rating}</span>
                      <span className="text-muted-foreground">({pkg.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                    {pkg.title}
                  </h3>

                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                    {pkg.description}
                  </p>

                  {/* Top Highlights */}
                  <div className="space-y-1.5 mb-5">
                    {pkg.highlights.slice(0, 2).map((h, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-foreground/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0" />
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border flex items-end justify-between">
                    <div>
                      {pkg.originalPrice > pkg.price && (
                        <div className="text-xs text-muted-foreground line-through mb-0.5">
                          ₹{pkg.originalPrice.toLocaleString("en-IN")}
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary">
                          ₹{pkg.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-muted-foreground">/person</span>
                      </div>
                    </div>
                    <Link href={`/packages/${pkg.slug}`}>
                      <Button className="gap-2 hover-elevate">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Trust Strip */}
      <div className="container mx-auto px-4 mt-20">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "50,000+", label: "Happy Travellers" },
            { value: "100%", label: "Secure Booking" },
            { value: "24/7", label: "Travel Support" },
            { value: "5★", label: "Expert Curation" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-2xl font-bold text-primary mb-1">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
