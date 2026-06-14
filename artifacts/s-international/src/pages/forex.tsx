import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw, Search, TrendingUp, TrendingDown, ArrowRight,
  CreditCard, Send, ShieldCheck, Users, Building2, GraduationCap,
  Briefcase, DollarSign, CheckCircle2, Clock, Info, ChevronDown,
  ArrowLeftRight, ChevronUp, MapPin, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── Currencies ─────────────────────────────────────────────────────────────
const CURRENCIES = [
  { code: "USD", name: "US Dollar",         flagCode: "us", symbol: "$"   },
  { code: "EUR", name: "Euro",              flagCode: "eu", symbol: "€"   },
  { code: "GBP", name: "British Pound",     flagCode: "gb", symbol: "£"   },
  { code: "AED", name: "UAE Dirham",        flagCode: "ae", symbol: "AED" },
  { code: "SAR", name: "Saudi Riyal",       flagCode: "sa", symbol: "SAR" },
  { code: "SGD", name: "Singapore Dollar",  flagCode: "sg", symbol: "S$"  },
  { code: "AUD", name: "Australian Dollar", flagCode: "au", symbol: "A$"  },
  { code: "CAD", name: "Canadian Dollar",   flagCode: "ca", symbol: "C$"  },
  { code: "JPY", name: "Japanese Yen",      flagCode: "jp", symbol: "¥"   },
  { code: "THB", name: "Thai Baht",         flagCode: "th", symbol: "฿"   },
  { code: "CHF", name: "Swiss Franc",       flagCode: "ch", symbol: "CHF" },
  { code: "QAR", name: "Qatar Riyal",       flagCode: "qa", symbol: "QAR" },
  { code: "OMR", name: "Omani Rial",        flagCode: "om", symbol: "OMR" },
  { code: "KWD", name: "Kuwaiti Dinar",     flagCode: "kw", symbol: "KWD" },
];

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata",
  "Ahmedabad", "Pune", "Jaipur", "Kochi", "Chandigarh", "Coimbatore",
  "Surat", "Vadodara", "Nagpur", "Bhopal", "Indore", "Lucknow",
  "Visakhapatnam", "Patna", "Guwahati", "Bhubaneswar", "Thiruvananthapuram",
];

const SPREAD_BUY  = 1.025;
const SPREAD_SELL = 0.975;

const FALLBACK: Record<string, number> = {
  USD: 83.50, EUR: 90.20, GBP: 105.60, AED: 22.73, SAR: 22.27,
  SGD: 61.80, AUD: 54.20, CAD: 61.20, JPY: 0.553, THB: 2.29,
  CHF: 93.10, QAR: 22.91, OMR: 216.90, KWD: 271.50,
};

interface RateRow { code: string; name: string; flagCode: string; symbol: string; mid: number; buy: number; sell: number; }

function fmt(n: number, d = 2) { return n.toFixed(d); }
function fmtINR(n: number) { return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function flagUrl(code: string) { return `https://flagcdn.com/w20/${code}.png`; }

// ─── Flag Image ───────────────────────────────────────────────────────────────
function Flag({ code, size = 20 }: { code: string; size?: number }) {
  return (
    <img
      src={flagUrl(code)}
      alt={code}
      width={size}
      height={Math.round(size * 0.75)}
      className="rounded-sm object-cover shrink-0"
      style={{ width: size, height: Math.round(size * 0.75) }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

// ─── Searchable Dropdown ──────────────────────────────────────────────────────
interface DropItem { value: string; label: string; flagCode?: string; sub?: string; }

function SearchDropdown({
  label, items, value, onChange, placeholder = "Search...",
  className = "", required, isCity = false,
}: {
  label?: string; items: DropItem[]; value: string;
  onChange: (v: string) => void; placeholder?: string;
  className?: string; required?: boolean; isCity?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = items.find((i) => i.value === value);

  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(search.toLowerCase()) ||
    i.value.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={`relative ${className}`} ref={ref}>
      {label && <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{label}</Label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-border bg-background text-sm hover:border-primary focus:border-primary outline-none transition-colors"
      >
        <span className="flex items-center gap-2 min-w-0">
          {isCity
            ? <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            : selected?.flagCode && <Flag code={selected.flagCode} />
          }
          <span className="truncate font-medium text-foreground">
            {selected ? selected.label : <span className="text-muted-foreground font-normal">{placeholder}</span>}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full mt-1 left-0 w-full bg-white border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{ minWidth: 200 }}
          >
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder={placeholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 text-xs bg-muted rounded-lg outline-none border border-transparent focus:border-primary transition-colors"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-2 top-2">
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground py-4">No results</p>
              ) : (
                filtered.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => { onChange(item.value); setOpen(false); setSearch(""); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left ${item.value === value ? "bg-primary/5 text-primary font-semibold" : "text-foreground"}`}
                  >
                    {isCity
                      ? <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      : item.flagCode && <Flag code={item.flagCode} />
                    }
                    <span>{item.label}</span>
                    {item.sub && <span className="ml-auto text-xs text-muted-foreground font-mono">{item.sub}</span>}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Hero Currency Dropdown (larger, inline style) ─────────────────────────
function HeroCurrencySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = CURRENCIES.find((c) => c.code === value);
  const filtered = CURRENCIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch(""); }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 bg-transparent outline-none cursor-pointer"
      >
        {selected && <Flag code={selected.flagCode} size={18} />}
        <span className="text-sm font-semibold text-foreground truncate">{selected?.name ?? "Select"}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-auto shrink-0" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full mt-2 left-0 bg-white border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{ width: 220 }}
          >
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder="Search currency..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 text-xs bg-muted rounded-lg outline-none"
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { onChange(c.code); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left ${c.code === value ? "bg-primary/5 text-primary font-semibold" : "text-foreground"}`}
                >
                  <Flag code={c.flagCode} />
                  <span>{c.name}</span>
                  <span className="ml-auto text-xs font-mono text-muted-foreground">{c.code}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Hero City Dropdown (inline style) ────────────────────────────────────
function HeroCitySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const filtered = CITIES.filter((c) => c.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch(""); }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 bg-transparent outline-none cursor-pointer"
      >
        <span className="text-sm font-semibold text-foreground truncate">{value || CITIES[0]}</span>
        <span className="ml-auto text-xs text-primary font-medium hover:underline">Change</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full mt-2 left-0 bg-white border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{ width: 240 }}
          >
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder="Search city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 text-xs bg-muted rounded-lg outline-none"
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { onChange(c); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left ${c === value ? "bg-primary/5 text-primary font-semibold" : "text-foreground"}`}
                >
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {c}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: DollarSign,    title: "Buy Foreign Currency"     },
  { icon: ArrowLeftRight,title: "Sell Foreign Currency"    },
  { icon: CreditCard,    title: "Forex Travel Cards"       },
  { icon: RefreshCw,     title: "Forex Card Reload"        },
  { icon: Send,          title: "International Remittance" },
  { icon: GraduationCap, title: "Student Forex Services"   },
  { icon: Briefcase,     title: "Business Travel Forex"    },
];

const CURRENCY_ITEMS: DropItem[] = CURRENCIES.map((c) => ({
  value: c.code, label: c.name, flagCode: c.flagCode, sub: c.code,
}));
const CITY_ITEMS: DropItem[] = CITIES.map((c) => ({ value: c, label: c }));

// ─── Main Component ───────────────────────────────────────────────────────────
export function Forex() {
  const [rates, setRates]             = useState<RateRow[]>([]);
  const [ratesLoading, setLoading]    = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [rateSearch, setRateSearch]   = useState("");
  const [ratesExpanded, setRatesExpanded] = useState(false);

  // Hero calculator
  const [heroTab, setHeroTab]           = useState<"buy" | "sell">("buy");
  const [heroCity, setHeroCity]         = useState(CITIES[0]);
  const [heroCurrency, setHeroCurrency] = useState("USD");
  const [heroProduct, setHeroProduct]   = useState("Cash");
  const [heroQty, setHeroQty]           = useState("");

  // Full calculator
  const [calcMode, setCalcMode]         = useState<"buy" | "sell">("buy");
  const [calcCurrency, setCalcCurrency] = useState("USD");
  const [calcAmt, setCalcAmt]           = useState("");

  // Enquiry forms
  const [formTab, setFormTab]             = useState("buy");
  const [submitted, setSubmitted]         = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Buy form
  const [buyCity, setBuyCity]         = useState("");
  const [buyCurrency, setBuyCurrency] = useState("USD");

  // Sell form
  const [sellCity, setSellCity]         = useState("");
  const [sellCurrency, setSellCurrency] = useState("USD");

  // Card form
  const [cardCurrency, setCardCurrency] = useState("USD");

  // Fetch rates
  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/INR");
      const data = await res.json();
      if (data.result === "success") {
        const built: RateRow[] = CURRENCIES.map((c) => {
          const raw = data.rates[c.code];
          const mid = raw ? 1 / raw : FALLBACK[c.code] ?? 0;
          return { ...c, mid, buy: +(mid * SPREAD_BUY).toFixed(4), sell: +(mid * SPREAD_SELL).toFixed(4) };
        });
        setRates(built);
        setLastUpdated(new Date());
      } else throw new Error("bad");
    } catch {
      const built: RateRow[] = CURRENCIES.map((c) => {
        const mid = FALLBACK[c.code] ?? 0;
        return { ...c, mid, buy: +(mid * SPREAD_BUY).toFixed(4), sell: +(mid * SPREAD_SELL).toFixed(4) };
      });
      setRates(built);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const t = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [fetchRates]);

  const getRate   = (code: string) => rates.find((r) => r.code === code);
  const heroRate  = getRate(heroCurrency);
  const heroDisplayRate = heroRate ? (heroTab === "buy" ? heroRate.buy : heroRate.sell) : 0;
  const heroInr   = heroQty && heroDisplayRate ? (+heroQty * heroDisplayRate) : 0;

  const calcRate  = getRate(calcCurrency);
  const calcDisplayRate = calcRate ? (calcMode === "buy" ? calcRate.buy : calcRate.sell) : 0;
  const calcInr   = calcAmt && calcDisplayRate ? (+calcAmt * calcDisplayRate) : 0;

  const filteredRates = rates.filter((r) =>
    r.name.toLowerCase().includes(rateSearch.toLowerCase()) ||
    r.code.toLowerCase().includes(rateSearch.toLowerCase())
  );
  const visibleRates = ratesExpanded ? filteredRates : filteredRates.slice(0, 8);
  const topSix = rates.slice(0, 6);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitLoading(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  }

  const heroCurrencyObj = CURRENCIES.find((c) => c.code === heroCurrency);

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <div className="relative pt-16 pb-36 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/92 via-primary/85 to-primary/80" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white/80 text-sm font-medium mb-5">
              <DollarSign className="h-4 w-4" /> Foreign Currency Exchange
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3 leading-tight">
              Buy, Sell &amp; Reload<br />
              <span className="text-secondary">Foreign Currency</span>
            </h1>
            <p className="text-white/70 text-base max-w-xl mx-auto mb-10">
              Competitive forex rates for international travel. Forex cards, cash exchange &amp; remittances — all in one place.
            </p>
          </motion.div>

          {/* Lulu-style calculator */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-sm mx-auto overflow-visible"
          >
            {/* Buy / Sell toggle */}
            <div className="grid grid-cols-2 rounded-t-2xl overflow-hidden">
              <button
                onClick={() => setHeroTab("buy")}
                className={`py-4 text-sm font-bold transition-colors rounded-tl-2xl ${heroTab === "buy" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >Buy</button>
              <button
                onClick={() => setHeroTab("sell")}
                className={`py-4 text-sm font-bold transition-colors rounded-tr-2xl ${heroTab === "sell" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >Sell</button>
            </div>

            <div className="p-5 space-y-3">
              {/* Location */}
              <div className="border border-border rounded-xl px-4 py-3 bg-background text-left">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Your Current Location</p>
                <HeroCitySelect value={heroCity} onChange={setHeroCity} />
              </div>

              {/* Currency + Product */}
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-border rounded-xl px-4 py-3 bg-background text-left">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Select Currency *</p>
                  <HeroCurrencySelect value={heroCurrency} onChange={setHeroCurrency} />
                </div>
                <div className="border border-border rounded-xl px-4 py-3 bg-background text-left">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Select Product *</p>
                  <select
                    value={heroProduct}
                    onChange={(e) => setHeroProduct(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold outline-none text-foreground cursor-pointer"
                  >
                    {["Cash", "Forex Card", "Travel Card Reload"].map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Quantity */}
              <div className="border border-border rounded-xl px-4 py-3 bg-background text-left">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Forex Quantity *</p>
                <input
                  type="number"
                  placeholder="Enter Quantity"
                  value={heroQty}
                  onChange={(e) => setHeroQty(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold outline-none text-foreground placeholder:text-muted-foreground/50"
                  min="0"
                />
              </div>

              {/* INR Amount */}
              <div className="border border-border rounded-xl px-4 py-3 bg-background text-left">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Amount in INR *</p>
                  {heroRate && (
                    <span className="text-[10px] text-primary font-semibold flex items-center gap-1">
                      {heroCurrencyObj && <Flag code={heroCurrencyObj.flagCode} size={12} />}
                      1 {heroCurrency} = ₹{fmt(heroDisplayRate)}
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-foreground">{heroInr ? fmtINR(heroInr) : "0"}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 text-right">*Tax and charges applicable</p>
              </div>

              <Button className="w-full font-bold py-5 text-base gap-2 rounded-xl">
                Book now <ArrowRight className="h-4 w-4" />
              </Button>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("forex-calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-primary border-2 border-primary/30 hover:border-primary hover:bg-primary/5 rounded-xl transition-all"
              >
                <ArrowLeftRight className="h-4 w-4" /> Open Forex Calculator
              </button>
              <p className="text-center text-xs text-muted-foreground">
                By clicking Book Now, you agree to our{" "}
                <a href="#" className="text-primary underline">T&amp;C</a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6 space-y-10">

        {/* ── LIVE RATE STRIP ───────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-primary/5 border-b border-border px-5 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Live Exchange Rates</span>
              {lastUpdated && (
                <span className="text-xs text-muted-foreground">
                  • Updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
            <button onClick={fetchRates} disabled={ratesLoading}
              className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
              <RefreshCw className={`h-3.5 w-3.5 ${ratesLoading ? "animate-spin" : ""}`} />
              {ratesLoading ? "Refreshing..." : "Refresh Rates"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-border min-w-[480px]">
              {(ratesLoading ? CURRENCIES.slice(0, 6) : topSix).map((r) => {
                const row = rates.find((x) => x.code === r.code);
                return (
                  <div key={r.code} className="px-4 py-3 text-center">
                    <div className="flex justify-center mb-1">
                      <Flag code={r.flagCode} size={22} />
                    </div>
                    <div className="font-mono text-xs font-bold text-foreground">{r.code}</div>
                    {row && !ratesLoading ? (
                      <>
                        <div className="text-xs text-emerald-600 font-semibold mt-0.5">B: ₹{fmt(row.buy)}</div>
                        <div className="text-xs text-red-500 font-semibold">S: ₹{fmt(row.sell)}</div>
                      </>
                    ) : (
                      <div className="h-8 flex items-center justify-center">
                        <div className="w-12 h-3 bg-muted rounded animate-pulse" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── SERVICES ──────────────────────────────────────────────────────── */}
        <div>
          <div className="text-center mb-7">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-1">Our Forex Services</h2>
            <p className="text-muted-foreground text-sm">Complete foreign exchange solutions for every traveller</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {SERVICES.map((svc, i) => (
              <motion.div key={svc.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-2xl p-4 text-center hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/15 transition-colors">
                  <svc.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs font-semibold text-foreground leading-snug">{svc.title}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT: Enquiry Forms */}
          <div className="flex-1 min-w-0">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-primary px-6 py-5 text-primary-foreground">
                <h2 className="text-lg font-serif font-bold">Foreign Currency Exchange</h2>
                <p className="text-primary-foreground/70 text-sm mt-0.5">
                  Buy, Sell and Reload Foreign Currency &amp; Forex Travel Cards for International Travel.
                </p>
              </div>

              <div className="p-6">
                <Tabs value={formTab} onValueChange={setFormTab}>
                  <TabsList className="grid grid-cols-3 mb-6 bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="buy"  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-sm">Buy Currency</TabsTrigger>
                    <TabsTrigger value="sell" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-sm">Sell Currency</TabsTrigger>
                    <TabsTrigger value="card" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-sm">Forex Card</TabsTrigger>
                  </TabsList>

                  <form onSubmit={handleSubmit}>

                    {/* ── BUY ── */}
                    <TabsContent value="buy" className="space-y-4 outline-none">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <SearchDropdown
                          label="Current City *"
                          items={CITY_ITEMS}
                          value={buyCity}
                          onChange={setBuyCity}
                          placeholder="Search & select city"
                          isCity
                        />
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Destination Country *</Label>
                          <Input placeholder="e.g. United States" required />
                        </div>
                        <SearchDropdown
                          label="Currency Required *"
                          items={CURRENCY_ITEMS}
                          value={buyCurrency}
                          onChange={setBuyCurrency}
                          placeholder="Search currency"
                        />
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Travel Date *</Label>
                          <input type="date" min={new Date().toISOString().split("T")[0]}
                            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:border-primary outline-none transition-colors cursor-pointer" required />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Quantity Required *</Label>
                          <Input type="number" placeholder="Amount in foreign currency" min="0" required />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Traveller Name *</Label>
                          <Input placeholder="Full Name as on Passport" required />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Mobile Number *</Label>
                          <Input type="tel" placeholder="+91 98765 43210" required />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Email Address *</Label>
                          <Input type="email" placeholder="email@example.com" required />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Passport Number</Label>
                          <Input placeholder="e.g. A1234567" />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Remarks</Label>
                          <Input placeholder="Any special requirements..." />
                        </div>
                      </div>
                      <Button type="submit" className="w-full gap-2 py-5 text-base font-bold rounded-xl" disabled={submitLoading}>
                        {submitLoading
                          ? <><RefreshCw className="h-4 w-4 animate-spin" /> Submitting...</>
                          : <><TrendingUp className="h-4 w-4" /> Get Best Exchange Rate</>}
                      </Button>
                    </TabsContent>

                    {/* ── SELL ── */}
                    <TabsContent value="sell" className="space-y-4 outline-none">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <SearchDropdown
                          label="Current City *"
                          items={CITY_ITEMS}
                          value={sellCity}
                          onChange={setSellCity}
                          placeholder="Search & select city"
                          isCity
                        />
                        <SearchDropdown
                          label="Currency Available *"
                          items={CURRENCY_ITEMS}
                          value={sellCurrency}
                          onChange={setSellCurrency}
                          placeholder="Search currency"
                        />
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Quantity Available *</Label>
                          <Input type="number" placeholder="Amount in foreign currency" min="0" required />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Traveller Name *</Label>
                          <Input placeholder="Full Name as on Passport" required />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Mobile Number *</Label>
                          <Input type="tel" placeholder="+91 98765 43210" required />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Email *</Label>
                          <Input type="email" placeholder="email@example.com" required />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Remarks</Label>
                        <Input placeholder="Condition of notes, denominations, etc..." />
                      </div>
                      <Button type="submit" className="w-full gap-2 py-5 text-base font-bold rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90" disabled={submitLoading}>
                        {submitLoading
                          ? <><RefreshCw className="h-4 w-4 animate-spin" /> Submitting...</>
                          : <><TrendingDown className="h-4 w-4" /> Sell Currency</>}
                      </Button>
                    </TabsContent>

                    {/* ── FOREX CARD ── */}
                    <TabsContent value="card" className="space-y-4 outline-none">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Traveller Name *</Label>
                          <Input placeholder="Full Name as on Passport" required />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Mobile Number *</Label>
                          <Input type="tel" placeholder="+91 98765 43210" required />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Email *</Label>
                          <Input type="email" placeholder="email@example.com" required />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Passport Number</Label>
                          <Input placeholder="e.g. A1234567" />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Travel Date *</Label>
                          <input type="date" min={new Date().toISOString().split("T")[0]}
                            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:border-primary outline-none transition-colors cursor-pointer" required />
                        </div>
                        <SearchDropdown
                          label="Currency Required *"
                          items={CURRENCY_ITEMS}
                          value={cardCurrency}
                          onChange={setCardCurrency}
                          placeholder="Search currency"
                        />
                        <div className="sm:col-span-2">
                          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Amount Required (in foreign currency) *</Label>
                          <Input type="number" placeholder="e.g. 500" min="0" required />
                        </div>
                      </div>
                      <Button type="submit" className="w-full gap-2 py-5 text-base font-bold rounded-xl" disabled={submitLoading}>
                        {submitLoading
                          ? <><RefreshCw className="h-4 w-4 animate-spin" /> Submitting...</>
                          : <><CreditCard className="h-4 w-4" /> Apply for Forex Card</>}
                      </Button>
                    </TabsContent>
                  </form>
                </Tabs>

                {/* Success */}
                <AnimatePresence>
                  {submitted && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-emerald-800 text-sm mb-0.5">Enquiry Received!</p>
                        <p className="text-emerald-700 text-xs">Thank you. Your Forex request has been received. Our team will contact you shortly with the latest exchange rate and verification requirements.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Disclaimer */}
                <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    Foreign currency exchange services are subject to applicable RBI guidelines, KYC verification and documentation requirements. Exchange rates are indicative and subject to market fluctuations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Rate Table + Calculator */}
          <div className="w-full lg:w-96 space-y-5">

            {/* Full Rate Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-primary/5 border-b border-border px-5 py-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-foreground text-sm">Today's Exchange Rates</h3>
                  <p className="text-xs text-muted-foreground">Source: Open Exchange Rates (live)</p>
                </div>
                <button onClick={fetchRates} disabled={ratesLoading}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-medium">
                  <RefreshCw className={`h-3 w-3 ${ratesLoading ? "animate-spin" : ""}`} /> Refresh
                </button>
              </div>

              <div className="px-4 py-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <input placeholder="Search currency..." value={rateSearch} onChange={(e) => setRateSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-muted/40 border border-border rounded-lg outline-none focus:border-primary transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-0 bg-muted/50 border-b border-border px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <div className="col-span-2">Currency</div>
                <div className="text-right text-emerald-700">Buy (₹)</div>
                <div className="text-right text-red-600">Sell (₹)</div>
              </div>

              <div className="divide-y divide-border">
                {ratesLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-0 px-4 py-3 animate-pulse">
                      <div className="col-span-2 flex items-center gap-2">
                        <div className="w-5 h-4 bg-muted rounded" />
                        <div className="h-3 w-16 bg-muted rounded" />
                      </div>
                      <div className="flex justify-end items-center"><div className="h-3 w-12 bg-muted rounded" /></div>
                      <div className="flex justify-end items-center"><div className="h-3 w-12 bg-muted rounded" /></div>
                    </div>
                  ))
                ) : (
                  visibleRates.map((row) => (
                    <div key={row.code} className="grid grid-cols-4 gap-0 px-4 py-2.5 hover:bg-muted/30 transition-colors">
                      <div className="col-span-2 flex items-center gap-2">
                        <Flag code={row.flagCode} size={18} />
                        <div>
                          <div className="text-xs font-bold text-foreground font-mono">{row.code}</div>
                          <div className="text-[10px] text-muted-foreground truncate max-w-[80px]">{row.name}</div>
                        </div>
                      </div>
                      <div className="text-right text-xs font-semibold text-emerald-700 flex items-center justify-end">{fmt(row.buy)}</div>
                      <div className="text-right text-xs font-semibold text-red-500 flex items-center justify-end">{fmt(row.sell)}</div>
                    </div>
                  ))
                )}
              </div>

              {filteredRates.length > 8 && (
                <button onClick={() => setRatesExpanded(!ratesExpanded)}
                  className="w-full py-3 text-xs text-primary font-semibold flex items-center justify-center gap-1 hover:bg-muted/30 transition-colors border-t border-border">
                  {ratesExpanded
                    ? <><ChevronUp className="h-3.5 w-3.5" /> Show Less</>
                    : <><ChevronDown className="h-3.5 w-3.5" /> Show All {filteredRates.length} Currencies</>}
                </button>
              )}

              <div className="px-4 py-3 border-t border-border bg-muted/20">
                <p className="text-[10px] text-muted-foreground text-center">
                  Rates are indicative. Final rates confirmed after KYC per RBI/FEMA guidelines.
                </p>
              </div>
            </div>

            {/* Forex Calculator */}
            <div id="forex-calculator" className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg scroll-mt-20">
              <div className="bg-primary px-5 py-4 text-primary-foreground flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                <h3 className="font-bold text-sm">Forex Calculator</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {(["buy", "sell"] as const).map((m) => (
                    <button key={m} onClick={() => setCalcMode(m)}
                      className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all capitalize ${calcMode === m ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                      {m}
                    </button>
                  ))}
                </div>

                <SearchDropdown
                  label="Select Currency"
                  items={CURRENCY_ITEMS}
                  value={calcCurrency}
                  onChange={setCalcCurrency}
                  placeholder="Search currency"
                />

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Amount ({calcCurrency})</Label>
                  <Input type="number" placeholder="Enter amount" value={calcAmt} onChange={(e) => setCalcAmt(e.target.value)} min="0" />
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-muted-foreground font-medium">
                      {calcMode === "buy" ? "You Pay" : "You Receive"} (INR)
                    </p>
                    {calcRate && (
                      <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                        <Flag code={calcRate.flagCode} size={12} />
                        1 {calcCurrency} = ₹{fmt(calcDisplayRate)}
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-black text-primary font-mono">{calcInr ? fmtINR(calcInr) : "₹0.00"}</p>
                  {calcAmt && calcInr > 0 && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {calcAmt} {calcCurrency} × ₹{fmt(calcDisplayRate)} = {fmtINR(calcInr)}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-2">*Indicative rate. Actual rate may vary.</p>
                </div>
              </div>
            </div>

            {/* Trust */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-sm text-foreground">Why Choose S International Forex?</h3>
              {[
                { icon: ShieldCheck, text: "RBI Authorised Forex Dealer" },
                { icon: TrendingUp,  text: "Best Rates Guaranteed" },
                { icon: Clock,       text: "Quick Doorstep Delivery" },
                { icon: Users,       text: "10,000+ Happy Customers" },
                { icon: Building2,   text: "KYC Compliant & FEMA Approved" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  <div className="w-7 h-7 bg-primary/8 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-1">How It Works</h2>
            <p className="text-muted-foreground text-sm">Simple 3-step process to get your foreign currency</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { step: 1, title: "Submit Enquiry",           desc: "Fill in your forex requirement with destination, currency and quantity.", icon: Send },
              { step: 2, title: "KYC & Rate Confirmation",  desc: "Our team contacts you to confirm the rate and complete KYC as per RBI norms.", icon: ShieldCheck },
              { step: 3, title: "Delivery / Pickup",        desc: "Receive foreign currency at your doorstep or collect from our nearest branch.", icon: CheckCircle2 },
            ].map(({ step, title, desc, icon: Icon }) => (
              <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: step * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  {step}
                </div>
                <div className="w-12 h-12 bg-primary/8 rounded-2xl flex items-center justify-center mx-auto mb-3 mt-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── LEGAL ─────────────────────────────────────────────────────────── */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-800 mb-1">Important Legal Notice</p>
            <p className="text-amber-700 leading-relaxed">
              Exchange rates are indicative and subject to market fluctuations. Final rates will be confirmed after KYC verification and booking confirmation as per RBI/FEMA guidelines. All foreign exchange transactions are subject to applicable government taxes and regulatory charges. S International is an authorised Foreign Exchange Dealer regulated by the Reserve Bank of India (RBI).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
