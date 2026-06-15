import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Plane, MapPin, Globe, TrendingUp } from "lucide-react";
import { AIRLINES } from "@/data/aviation";

const COUNTRY_FLAGS: Record<string, string> = {
  "India": "🇮🇳", "UAE": "🇦🇪", "Qatar": "🇶🇦", "Singapore": "🇸🇬",
  "United Kingdom": "🇬🇧", "Germany": "🇩🇪", "France": "🇫🇷",
  "Turkey": "🇹🇷", "Thailand": "🇹🇭", "Malaysia": "🇲🇾",
};

export function Airlines() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <section className="relative pt-14 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/85 to-primary/75" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white/80 text-sm font-medium mb-5">
              <Plane className="h-4 w-4" /> Airline Route Explorer
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Explore Airline Routes
            </h1>
            <p className="text-white/70 text-base max-w-xl mx-auto">
              Click any airline to view its full interactive route map, destinations, and flight details.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Airlines Grid */}
      <div className="container mx-auto px-4 max-w-6xl -mt-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AIRLINES.map((airline, i) => (
            <motion.div
              key={airline.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => setLocation(`/airline/${airline.slug}/routes`)}
              className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer group overflow-hidden"
            >
              {/* Header band */}
              <div className="bg-primary/5 border-b border-border px-5 py-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-xl border border-border flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  <img
                    src={airline.logo}
                    alt={airline.name}
                    className="w-12 h-12 object-contain"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-2xl font-bold text-primary">${airline.iata}</span>`;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors truncate">{airline.name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <span>{COUNTRY_FLAGS[airline.country] || "🌐"}</span>
                    <span>{airline.country}</span>
                    <span className="text-border mx-1">·</span>
                    <span className="font-mono font-bold text-primary">{airline.iata}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="px-5 py-4 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{airline.totalRoutes.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Routes</p>
                </div>
                <div className="text-center border-x border-border">
                  <p className="text-lg font-bold text-foreground">{airline.totalDestinations}</p>
                  <p className="text-xs text-muted-foreground">Destinations</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{airline.dailyFlights.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Flights/day</p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Hub: <strong className="text-foreground">{airline.hub}</strong></span>
                  <span className="text-border mx-1">·</span>
                  <Globe className="w-3.5 h-3.5" />
                  <span>{airline.alliance}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                  View Routes
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
