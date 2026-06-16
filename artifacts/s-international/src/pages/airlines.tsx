import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Plane, MapPin, Globe, Search, X, TrendingUp, Map } from "lucide-react";
import { AIRLINES, AIRLINE_ROUTES } from "@/data/aviation";

const COUNTRY_FLAGS: Record<string, string> = {
  "India": "🇮🇳", "UAE": "🇦🇪", "Qatar": "🇶🇦", "Singapore": "🇸🇬",
  "United Kingdom": "🇬🇧", "Germany": "🇩🇪", "France": "🇫🇷",
  "Turkey": "🇹🇷", "Thailand": "🇹🇭", "Malaysia": "🇲🇾",
  "USA": "🇺🇸", "Australia": "🇦🇺", "Japan": "🇯🇵", "China": "🇨🇳",
  "South Korea": "🇰🇷", "Brazil": "🇧🇷", "Canada": "🇨🇦",
  "Netherlands": "🇳🇱", "Switzerland": "🇨🇭", "Egypt": "🇪🇬",
  "Russia": "🇷🇺", "Ireland": "🇮🇪", "Chile": "🇨🇱", "Colombia": "🇨🇴",
  "Mexico": "🇲🇽", "Spain": "🇪🇸", "Hungary": "🇭🇺", "New Zealand": "🇳🇿",
  "Panama": "🇵🇦", "Saudi Arabia": "🇸🇦", "Sweden": "🇸🇪", "Vietnam": "🇻🇳",
  "Austria": "🇦🇹", "Philippines": "🇵🇭", "Finland": "🇫🇮", "Indonesia": "🇮🇩",
  "Greece": "🇬🇷", "Poland": "🇵🇱", "Norway": "🇳🇴", "Ethiopia": "🇪🇹",
  "Hong Kong": "🇭🇰", "Malta": "🇲🇹", "Portugal": "🇵🇹",
};

function getRankStyle(rank: number): { bg: string; text: string; border: string } {
  if (rank === 1)  return { bg: "bg-amber-400",   text: "text-white",        border: "border-amber-500" };
  if (rank === 2)  return { bg: "bg-slate-400",    text: "text-white",        border: "border-slate-500" };
  if (rank === 3)  return { bg: "bg-orange-500",   text: "text-white",        border: "border-orange-600" };
  if (rank <= 5)   return { bg: "bg-primary",      text: "text-white",        border: "border-primary/80" };
  if (rank <= 10)  return { bg: "bg-blue-500",     text: "text-white",        border: "border-blue-600" };
  if (rank <= 20)  return { bg: "bg-indigo-500",   text: "text-white",        border: "border-indigo-600" };
  if (rank <= 30)  return { bg: "bg-violet-500",   text: "text-white",        border: "border-violet-600" };
  if (rank <= 40)  return { bg: "bg-purple-500",   text: "text-white",        border: "border-purple-600" };
  if (rank <= 50)  return { bg: "bg-fuchsia-500",  text: "text-white",        border: "border-fuchsia-600" };
  if (rank <= 60)  return { bg: "bg-rose-500",     text: "text-white",        border: "border-rose-600" };
  if (rank <= 70)  return { bg: "bg-red-500",      text: "text-white",        border: "border-red-600" };
  if (rank <= 80)  return { bg: "bg-orange-400",   text: "text-white",        border: "border-orange-500" };
  if (rank <= 90)  return { bg: "bg-teal-500",     text: "text-white",        border: "border-teal-600" };
  return              { bg: "bg-emerald-500",   text: "text-white",        border: "border-emerald-600" };
}

const RANKED_AIRLINES = [...AIRLINES].sort((a, b) => b.dailyFlights - a.dailyFlights);

const TOP_COUNTRIES = ["All", "USA", "China", "India", "United Kingdom", "Germany", "France", "UAE", "Australia", "Japan", "South Korea", "Brazil", "Canada", "Spain", "Turkey", "Netherlands", "Ireland", "Indonesia", "Philippines", "Vietnam", "Ethiopia", "Qatar", "Singapore", "Malaysia", "Saudi Arabia", "Russia", "Mexico", "Colombia", "Chile", "New Zealand", "Norway", "Sweden", "Finland", "Austria", "Poland", "Greece", "Portugal", "Hungary", "Malta", "Hong Kong", "Switzerland"];

export function Airlines() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");

  const countriesInList = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of RANKED_AIRLINES) {
      counts[a.country] = (counts[a.country] || 0) + 1;
    }
    return TOP_COUNTRIES.filter(c => c === "All" || counts[c]);
  }, []);

  const filtered = useMemo(() => {
    let list = RANKED_AIRLINES;
    if (countryFilter !== "All") list = list.filter(a => a.country === countryFilter);
    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.iata.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.alliance.toLowerCase().includes(q) ||
      a.hub.toLowerCase().includes(q)
    );
  }, [search, countryFilter]);

  const hasRoutes = (slug: string) => !!AIRLINE_ROUTES[slug];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <section className="relative pt-14 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/85 to-primary/80" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white/80 text-sm font-medium mb-5">
              <Plane className="h-4 w-4" /> Top 100 Biggest Airlines
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3">
              Airline Route Explorer
            </h1>
            <p className="text-white/70 text-base max-w-xl mx-auto mb-8">
              Ranked by number of daily departures. Click any airline to view its interactive route map.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search airline, IATA code, country, alliance…"
                className="w-full pl-12 pr-12 py-3.5 bg-white/15 backdrop-blur border border-white/30 rounded-2xl text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Country filter chips */}
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {countriesInList.map(country => (
                <button
                  key={country}
                  onClick={() => setCountryFilter(prev => prev === country ? "All" : country)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    countryFilter === country
                      ? "bg-white text-primary border-white shadow-lg scale-105"
                      : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:border-white/40"
                  }`}
                >
                  {country === "All" ? "🌐" : (COUNTRY_FLAGS[country] || "🌐")} {country}
                </button>
              ))}
            </div>

            {(search || countryFilter !== "All") && (
              <p className="text-white/60 text-sm mt-3">
                {filtered.length} airline{filtered.length !== 1 ? "s" : ""}
                {countryFilter !== "All" ? ` from ${COUNTRY_FLAGS[countryFilter] || ""} ${countryFilter}` : ""}
                {search ? ` matching "<span class="text-white font-medium">${search}</span>"` : ""}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Airlines List */}
      <div className="container mx-auto px-4 max-w-5xl -mt-16 relative z-10">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Plane className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No airlines found</p>
            <p className="text-sm">Try a different search term or filter</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((airline, idx) => {
              const rank = RANKED_AIRLINES.indexOf(airline) + 1;
              const routesAvailable = hasRoutes(airline.slug);
              const rankStyle = getRankStyle(rank);
              return (
                <motion.div
                  key={airline.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                  onClick={() => setLocation(`/airline/${airline.slug}/routes`)}
                  className="bg-white rounded-2xl border border-border shadow-sm transition-all flex items-center gap-4 px-4 py-3 hover:shadow-lg hover:border-primary/25 cursor-pointer group"
                >
                  {/* Rank badge */}
                  <div className="w-10 flex justify-center shrink-0">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border ${rankStyle.bg} ${rankStyle.text} ${rankStyle.border}`}>
                      {rank}
                    </span>
                  </div>

                  {/* Logo */}
                  <div className="w-12 h-12 bg-muted rounded-xl border border-border flex items-center justify-center shrink-0 overflow-hidden">
                    {airline.logo ? (
                      <img src={airline.logo} alt={airline.name} className="w-11 h-11 object-contain"
                        onError={e => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-xs font-bold text-primary">${airline.iata}</span>`;
                        }} />
                    ) : (
                      <span className="text-xs font-bold text-primary">{airline.iata}</span>
                    )}
                  </div>

                  {/* Name + info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{airline.name}</span>
                      <span className="font-mono text-xs text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">{airline.iata}</span>
                      {routesAvailable && (
                        <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-full font-medium">Route map</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                      <span>{COUNTRY_FLAGS[airline.country] || "🌐"} {airline.country}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {airline.hub}</span>
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {airline.alliance}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-5 text-center shrink-0">
                    <div>
                      <p className="text-sm font-bold text-foreground">{airline.dailyFlights.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">flights/day</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-bold text-foreground">{airline.totalDestinations}</p>
                      <p className="text-xs text-muted-foreground">destinations</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all shrink-0">
                    <Map className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{routesAvailable ? "View Routes" : "View Info"}</span>
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!search && countryFilter === "All" && (
          <p className="text-center text-xs text-muted-foreground mt-8 pb-4">
            Showing {RANKED_AIRLINES.length} airlines · Updated 2026 · Ranked by daily departures
          </p>
        )}
      </div>
    </div>
  );
}
