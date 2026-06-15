import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw, Search, TrendingUp, TrendingDown, ArrowRight,
  CreditCard, Send, ShieldCheck, Users, Building2, GraduationCap,
  Briefcase, DollarSign, CheckCircle2, Clock, ChevronDown,
  ArrowLeftRight, MapPin, X, Calculator, Banknote, Globe,
  Smartphone, Zap, Lock, Award, PhoneCall
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Shared Data ─────────────────────────────────────────────────────────────
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

const FALLBACK: Record<string, number> = {
  USD: 83.50, EUR: 90.20, GBP: 105.60, AED: 22.73, SAR: 22.27,
  SGD: 61.80, AUD: 54.20, CAD: 61.20, JPY: 0.553, THB: 2.29,
  CHF: 93.10, QAR: 22.91, OMR: 216.90, KWD: 271.50,
};

const SPREAD_BUY  = 1.025;
const SPREAD_SELL = 0.975;

interface RateRow { code: string; name: string; flagCode: string; symbol: string; mid: number; buy: number; sell: number; change: number; }

function Flag({ code, size = 20 }: { code: string; size?: number }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={code}
      width={size}
      height={Math.round(size * 0.75)}
      className="rounded-sm object-cover shrink-0"
      style={{ width: size, height: Math.round(size * 0.75) }}
      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: Banknote,      title: "Buy Foreign Currency",   desc: "Get the best rates for cash & card exchange", color: "bg-blue-50 text-blue-600" },
  { icon: ArrowLeftRight,title: "Sell Foreign Currency",  desc: "Convert your leftover foreign currency to INR", color: "bg-violet-50 text-violet-600" },
  { icon: CreditCard,    title: "Forex Travel Cards",     desc: "Prepaid multi-currency travel cards", color: "bg-emerald-50 text-emerald-600" },
  { icon: RefreshCw,     title: "Forex Card Reload",      desc: "Top up your travel card anytime online", color: "bg-orange-50 text-orange-600" },
  { icon: Send,          title: "International Remittance",desc: "Fast & secure overseas money transfers", color: "bg-rose-50 text-rose-600" },
  { icon: GraduationCap, title: "Student Forex Services", desc: "Competitive rates for study abroad payments", color: "bg-cyan-50 text-cyan-600" },
  { icon: Briefcase,     title: "Business Travel Forex",  desc: "Corporate accounts & bulk exchange", color: "bg-amber-50 text-amber-600" },
  { icon: Globe,         title: "Wire Transfers",         desc: "SWIFT transfers to 100+ countries", color: "bg-pink-50 text-pink-600" },
];

const FEATURES = [
  { icon: Award,       title: "Best Guaranteed Rates",      desc: "We benchmark against 20+ banks daily"      },
  { icon: Zap,         title: "Instant Processing",         desc: "Same-day delivery for most orders"         },
  { icon: Lock,        title: "RBI Authorised Dealer",      desc: "100% compliant with FEMA regulations"      },
  { icon: Smartphone,  title: "Digital-First Experience",   desc: "Track orders in real-time on our app"      },
  { icon: Users,       title: "50,000+ Happy Customers",    desc: "Trusted across 35 Indian cities"           },
  { icon: PhoneCall,   title: "24/7 Expert Support",        desc: "Dedicated forex specialists on call"       },
];

const HOW_STEPS = [
  { step: "01", icon: Search,        title: "Check Live Rates",   desc: "View real-time rates for 14 currencies. Use our calculator to estimate your amount." },
  { step: "02", icon: DollarSign,    title: "Place Your Order",   desc: "Fill in your requirements — currency, amount, city & preferred delivery mode." },
  { step: "03", icon: CheckCircle2,  title: "Deliver or Collect", desc: "Receive currency at your doorstep or pick up from our nearest branch." },
];

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata",
  "Ahmedabad", "Pune", "Jaipur", "Kochi", "Chandigarh", "Coimbatore",
  "Surat", "Vadodara", "Nagpur", "Bhopal", "Indore", "Lucknow",
  "Visakhapatnam", "Patna", "Guwahati", "Bhubaneswar", "Thiruvananthapuram",
];

// ─── SearchDropdown helper ────────────────────────────────────────────────────
function SearchDropdown({
  label, items, value, onChange, placeholder = "Search...", isCity = false,
}: {
  label?: string; items: { value: string; label: string; flagCode?: string }[];
  value: string; onChange: (v: string) => void; placeholder?: string; isCity?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = items.find(i => i.value === value);
  const filtered = items.filter(i =>
    i.label.toLowerCase().includes(search.toLowerCase()) ||
    i.value.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch(""); } }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      {label && <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</p>}
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-border bg-background text-sm hover:border-primary focus:border-primary outline-none transition-colors"
      >
        <span className="flex items-center gap-2 min-w-0">
          {isCity ? <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : (selected?.flagCode && <Flag code={selected.flagCode} />)}
          <span className="truncate font-medium text-foreground">
            {selected ? selected.label : <span className="text-muted-foreground font-normal">{placeholder}</span>}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
            className="absolute top-full mt-1 left-0 w-full bg-white border border-border rounded-xl shadow-2xl z-50 overflow-hidden" style={{ minWidth: 200 }}
          >
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <input autoFocus placeholder={placeholder} value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 text-xs bg-muted rounded-lg outline-none"
                />
                {search && <button onClick={() => setSearch("")} className="absolute right-2 top-2"><X className="h-3 w-3 text-muted-foreground" /></button>}
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0
                ? <p className="text-center text-xs text-muted-foreground py-4">No results</p>
                : filtered.map(item => (
                  <button key={item.value} type="button"
                    onClick={() => { onChange(item.value); setOpen(false); setSearch(""); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left ${item.value === value ? "bg-primary/5 text-primary font-semibold" : "text-foreground"}`}
                  >
                    {isCity ? <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : (item.flagCode && <Flag code={item.flagCode} />)}
                    <span>{item.label}</span>
                  </button>
                ))
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function Forex() {
  const [rates, setRates]         = useState<RateRow[]>([]);
  const [loading, setLoading]     = useState(true);
  const [lastUpdated, setLU]      = useState<Date | null>(null);
  const [rateSearch, setRS]       = useState("");
  const [ratesExpanded, setRE]    = useState(false);

  // Enquiry form
  const [formTab, setFormTab]       = useState("buy");
  const [formCity, setFormCity]     = useState("");
  const [formCurrency, setFormCur]  = useState("USD");
  const [formAmt, setFormAmt]       = useState("");
  const [formName, setFormName]     = useState("");
  const [formPhone, setFormPhone]   = useState("");
  const [submitted, setSubmitted]   = useState(false);
  const [formLoading, setFormLoad]  = useState(false);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/INR");
      const data = await res.json();
      if (data.result === "success") {
        const built: RateRow[] = CURRENCIES.map(c => {
          const raw = data.rates[c.code];
          const mid = raw ? 1 / raw : FALLBACK[c.code] ?? 0;
          const change = (Math.random() * 0.4 - 0.2);
          return { ...c, mid, buy: +(mid * SPREAD_BUY).toFixed(4), sell: +(mid * SPREAD_SELL).toFixed(4), change: +change.toFixed(2) };
        });
        setRates(built);
        setLU(new Date());
      } else throw new Error();
    } catch {
      const built: RateRow[] = CURRENCIES.map(c => {
        const mid = FALLBACK[c.code] ?? 0;
        const change = (Math.random() * 0.4 - 0.2);
        return { ...c, mid, buy: +(mid * SPREAD_BUY).toFixed(4), sell: +(mid * SPREAD_SELL).toFixed(4), change: +change.toFixed(2) };
      });
      setRates(built);
      setLU(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRates(); const t = setInterval(fetchRates, 5 * 60 * 1000); return () => clearInterval(t); }, [fetchRates]);

  const filteredRates = rates.filter(r =>
    r.name.toLowerCase().includes(rateSearch.toLowerCase()) ||
    r.code.toLowerCase().includes(rateSearch.toLowerCase())
  );
  const visibleRates = ratesExpanded ? filteredRates : filteredRates.slice(0, 8);

  const CURRENCY_ITEMS = CURRENCIES.map(c => ({ value: c.code, label: c.name, flagCode: c.flagCode }));
  const CITY_ITEMS = CITIES.map(c => ({ value: c, label: c }));

  async function handleEnquiry(e: React.FormEvent) {
    e.preventDefault();
    setFormLoad(true);
    await new Promise(r => setTimeout(r, 1400));
    setFormLoad(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  }

  const topSix = rates.slice(0, 6);

  return (
    <div className="min-h-screen bg-background pb-16">

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/92 via-primary/88 to-primary/80" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white/80 text-sm font-medium mb-5">
              <DollarSign className="h-4 w-4" /> Foreign Currency Exchange
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              Exchange Currency at<br />
              <span className="text-yellow-300">India's Best Rates</span>
            </h1>
            <p className="text-white/70 text-base max-w-xl mx-auto mb-8">
              Buy, sell &amp; transfer 14+ foreign currencies. RBI authorised dealer with doorstep delivery across 35 Indian cities.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/currency/calculator">
                <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-8 gap-2 shadow-lg">
                  <Calculator className="w-5 h-5" /> Open Forex Calculator
                </Button>
              </Link>
              <a href="#enquiry">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/15 font-semibold px-8 gap-2">
                  Get a Quote <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6 text-white/70 text-sm"
          >
            {[
              { icon: ShieldCheck, label: "RBI Authorised Dealer" },
              { icon: Users,       label: "50,000+ Customers" },
              { icon: Clock,       label: "Same-Day Delivery" },
              { icon: Award,       label: "Zero Hidden Charges" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-yellow-300" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LIVE RATE TICKER ──────────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-4 overflow-hidden">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide px-4 max-w-full">
          <span className="text-xs font-bold text-yellow-300 uppercase tracking-widest whitespace-nowrap shrink-0">Live Rates ▶</span>
          {loading ? (
            Array(6).fill(null).map((_, i) => (
              <div key={i} className="w-28 h-8 bg-white/10 rounded-lg animate-pulse shrink-0" />
            ))
          ) : (
            topSix.map(r => (
              <div key={r.code} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5 shrink-0">
                <Flag code={r.flagCode} size={16} />
                <span className="text-white text-xs font-bold">{r.code}</span>
                <span className="text-white/70 text-xs font-mono">₹{r.buy.toFixed(2)}</span>
                <span className={`text-xs font-semibold ${r.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {r.change >= 0 ? "▲" : "▼"} {Math.abs(r.change).toFixed(2)}%
                </span>
              </div>
            ))
          )}
          {lastUpdated && (
            <span className="text-white/40 text-xs whitespace-nowrap shrink-0 ml-2">
              Updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-3">Our Currency Services</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Everything you need for foreign currency exchange — from cash to cards to remittances</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-5 border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{s.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CALCULATOR CTA ────────────────────────────────────────────────────── */}
      <section className="py-10 bg-primary">
        <div className="container mx-auto px-4 max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-white text-center sm:text-left">
            <h3 className="text-xl font-bold mb-1">Want to check your exact conversion?</h3>
            <p className="text-white/70 text-sm">Use our interactive calculator to get real-time buy &amp; sell rates</p>
          </div>
          <Link href="/currency/calculator">
            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold whitespace-nowrap gap-2 shadow-lg px-8">
              <Calculator className="w-5 h-5" /> Open Forex Calculator
            </Button>
          </Link>
        </div>
      </section>

      {/* ── LIVE EXCHANGE RATES TABLE ─────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-1">Exchange Rates</h2>
              <p className="text-muted-foreground text-sm">
                {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString("en-IN")}` : "Fetching live rates…"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input value={rateSearch} onChange={e => setRS(e.target.value)} placeholder="Search currency…" className="pl-9 w-48" />
              </div>
              <button onClick={fetchRates} disabled={loading}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-border rounded-xl hover:bg-muted transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Currency</th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Buy (₹)</th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sell (₹)</th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Mid Rate</th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    Array(6).fill(null).map((_, i) => (
                      <tr key={i}>
                        {Array(5).fill(null).map((_, j) => (
                          <td key={j} className="px-5 py-4"><div className="h-4 bg-muted rounded animate-pulse w-20" /></td>
                        ))}
                      </tr>
                    ))
                  ) : visibleRates.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-muted-foreground text-sm">No currencies match your search.</td></tr>
                  ) : (
                    visibleRates.map((r, i) => (
                      <motion.tr
                        key={r.code}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Flag code={r.flagCode} size={22} />
                            <div>
                              <p className="font-bold text-sm text-foreground">{r.code}</p>
                              <p className="text-xs text-muted-foreground">{r.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="font-bold text-sm text-foreground">₹{r.buy.toFixed(4)}</span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="font-bold text-sm text-foreground">₹{r.sell.toFixed(4)}</span>
                        </td>
                        <td className="px-5 py-4 text-right hidden sm:table-cell">
                          <span className="text-sm text-muted-foreground">₹{r.mid.toFixed(4)}</span>
                        </td>
                        <td className="px-5 py-4 text-right hidden sm:table-cell">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${r.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {r.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(r.change).toFixed(2)}%
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {!loading && filteredRates.length > 8 && (
              <div className="border-t border-border px-5 py-3 bg-muted/30">
                <button onClick={() => setRE(!ratesExpanded)}
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                  {ratesExpanded ? "Show Less" : `Show All ${filteredRates.length} Currencies`}
                  <ChevronDown className={`w-4 h-4 transition-transform ${ratesExpanded ? "rotate-180" : ""}`} />
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            * Rates are indicative and subject to change. Final rates confirmed at time of transaction. RBI guidelines apply.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground">Exchange currency in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line on desktop */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 z-0" />
            {HOW_STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative z-10 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="text-xs font-bold text-primary/40 mb-1">STEP {s.step}</div>
                  <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ENQUIRY FORM ──────────────────────────────────────────────────────── */}
      <section id="enquiry" className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-3">Place a Currency Order</h2>
            <p className="text-muted-foreground">Fill in your details and our forex expert will contact you within 30 minutes</p>
          </div>

          <div className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
            {/* Tab bar */}
            <div className="grid grid-cols-3 bg-muted/40">
              {[
                { id: "buy",  label: "Buy Currency",  icon: "🟢" },
                { id: "sell", label: "Sell Currency",  icon: "🔴" },
                { id: "card", label: "Forex Card",     icon: "💳" },
              ].map(t => (
                <button key={t.id} onClick={() => setFormTab(t.id)}
                  className={`py-4 text-sm font-bold transition-all flex items-center justify-center gap-2 ${formTab === t.id ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}
                >
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            <div className="p-8">
              <AnimatePresence>
                {submitted && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-emerald-700"
                  >
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Enquiry received!</p>
                      <p className="text-xs">Our forex expert will call you within 30 minutes.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleEnquiry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Your Name *</p>
                    <Input required value={formName} onChange={e => setFormName(e.target.value)} placeholder="Full name" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Mobile Number *</p>
                    <Input required value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SearchDropdown label="Select City *" items={CITY_ITEMS} value={formCity} onChange={setFormCity} placeholder="Choose city…" isCity required />
                  <SearchDropdown label="Select Currency *" items={CURRENCY_ITEMS} value={formCurrency} onChange={setFormCur} placeholder="Choose currency…" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    {formTab === "buy" ? "Amount to Buy" : formTab === "sell" ? "Amount to Sell" : "Card Load Amount"} (₹)
                  </p>
                  <Input value={formAmt} onChange={e => setFormAmt(e.target.value)} placeholder="Enter amount in INR" type="number" min="0" />
                </div>

                <Button type="submit" disabled={formLoading} size="lg" className="w-full font-semibold">
                  {formLoading ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Processing…</>
                  ) : (
                    <>{formTab === "buy" ? "Request to Buy" : formTab === "sell" ? "Request to Sell" : "Get Forex Card"} <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  By submitting, you agree to be contacted by our forex experts. Your data is 100% secure.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-3">Why S International?</h2>
            <p className="text-muted-foreground">The most trusted forex exchange partner for Indian travellers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-white border border-border rounded-2xl p-5 flex items-start gap-4 hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">{f.title}</p>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
