import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, RefreshCw, ArrowLeftRight, TrendingUp,
  ChevronDown, Search, X, DollarSign
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

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
  { code: "MYR", name: "Malaysian Ringgit", flagCode: "my", symbol: "MYR" },
  { code: "NZD", name: "New Zealand Dollar",flagCode: "nz", symbol: "NZ$" },
  { code: "CNY", name: "Chinese Yuan",      flagCode: "cn", symbol: "¥"   },
  { code: "HKD", name: "Hong Kong Dollar",  flagCode: "hk", symbol: "HK$" },
];

const FALLBACK: Record<string, number> = {
  USD: 83.50, EUR: 90.20, GBP: 105.60, AED: 22.73, SAR: 22.27,
  SGD: 61.80, AUD: 54.20, CAD: 61.20, JPY: 0.553, THB: 2.29,
  CHF: 93.10, QAR: 22.91, OMR: 216.90, KWD: 271.50,
  MYR: 17.85, NZD: 49.60, CNY: 11.52, HKD: 10.68,
};

const SPREAD_BUY  = 1.025;
const SPREAD_SELL = 0.975;

interface RateRow { code: string; name: string; flagCode: string; symbol: string; mid: number; buy: number; sell: number; }

function Flag({ code, size = 20 }: { code: string; size?: number }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={code}
      width={size}
      height={Math.round(size * 0.75)}
      className="rounded-sm object-cover shrink-0"
      style={{ width: size, height: Math.round(size * 0.75) }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

function CurrencyDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = CURRENCIES.find(c => c.code === value);
  const filtered = CURRENCIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch(""); }
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-border hover:border-primary bg-background transition-colors"
      >
        {selected && <Flag code={selected.flagCode} size={24} />}
        <div className="flex-1 text-left">
          <p className="text-xs text-muted-foreground font-medium">Currency</p>
          <p className="text-sm font-bold text-foreground">{selected?.name ?? "Select"} ({selected?.code})</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-2 left-0 w-full bg-white border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
        >
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search currency..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-xl outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-2.5">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => { onChange(c.code); setOpen(false); setSearch(""); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors ${c.code === value ? "bg-primary/5 text-primary font-semibold" : "text-foreground"}`}
              >
                <Flag code={c.flagCode} size={20} />
                <span className="flex-1 text-left">{c.name}</span>
                <span className="text-xs font-mono text-muted-foreground">{c.code}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function ForexCalculator() {
  const [rates, setRates] = useState<RateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [currency, setCurrency] = useState("USD");
  const [foreignAmt, setForeignAmt] = useState("");
  const [inrAmt, setInrAmt] = useState("");
  const [direction, setDirection] = useState<"foreign-to-inr" | "inr-to-foreign">("foreign-to-inr");

  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/INR");
      const data = await res.json();
      if (data.result === "success") {
        const built: RateRow[] = CURRENCIES.map(c => {
          const raw = data.rates[c.code];
          const mid = raw ? 1 / raw : FALLBACK[c.code] ?? 0;
          return { ...c, mid, buy: +(mid * SPREAD_BUY).toFixed(4), sell: +(mid * SPREAD_SELL).toFixed(4) };
        });
        setRates(built);
        setLastUpdated(new Date());
      } else throw new Error();
    } catch {
      setRates(CURRENCIES.map(c => {
        const mid = FALLBACK[c.code] ?? 0;
        return { ...c, mid, buy: +(mid * SPREAD_BUY).toFixed(4), sell: +(mid * SPREAD_SELL).toFixed(4) };
      }));
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  const rateRow = rates.find(r => r.code === currency);
  const displayRate = rateRow ? (mode === "buy" ? rateRow.buy : rateRow.sell) : 0;

  const handleForeignChange = (val: string) => {
    setDirection("foreign-to-inr");
    setForeignAmt(val);
    if (val && displayRate) setInrAmt((+val * displayRate).toFixed(2));
    else setInrAmt("");
  };

  const handleInrChange = (val: string) => {
    setDirection("inr-to-foreign");
    setInrAmt(val);
    if (val && displayRate) setForeignAmt((+val / displayRate).toFixed(4));
    else setForeignAmt("");
  };

  useEffect(() => {
    if (!displayRate) return;
    if (direction === "foreign-to-inr" && foreignAmt)
      setInrAmt((+foreignAmt * displayRate).toFixed(2));
    else if (direction === "inr-to-foreign" && inrAmt)
      setForeignAmt((+inrAmt / displayRate).toFixed(4));
  }, [currency, mode, displayRate]);

  const selected = CURRENCIES.find(c => c.code === currency);
  const inrNum = foreignAmt && displayRate ? +foreignAmt * displayRate : 0;

  const LABELS: Record<string, string[]> = {
    "1": ["Poor", "bg-red-500"],
    "2": ["Fair", "bg-orange-400"],
    "3": ["Good", "bg-yellow-400"],
    "4": ["Very Good", "bg-emerald-400"],
    "5": ["Excellent", "bg-emerald-600"],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header bar */}
      <div className="bg-white border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 max-w-3xl flex items-center gap-4 h-16">
          <Link href="/currency">
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Currency
            </button>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live rates
              </>
            )}
          </div>
          <button onClick={fetchRates} disabled={loading} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
            <DollarSign className="w-4 h-4" /> Forex Calculator
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Currency Calculator</h1>
          <p className="text-muted-foreground text-sm">
            Convert between Indian Rupee and 18 foreign currencies at live rates
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Rates updated: {lastUpdated.toLocaleTimeString("en-IN")}
            </p>
          )}
        </motion.div>

        {/* Main calculator card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl border border-border overflow-hidden mb-6"
        >
          {/* Buy / Sell toggle */}
          <div className="grid grid-cols-2">
            <button
              onClick={() => setMode("buy")}
              className={`py-4 text-sm font-bold transition-all ${mode === "buy" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              🟢 Buy Foreign Currency
            </button>
            <button
              onClick={() => setMode("sell")}
              className={`py-4 text-sm font-bold transition-all ${mode === "sell" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              🔴 Sell Foreign Currency
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Currency selector */}
            <CurrencyDropdown value={currency} onChange={setCurrency} />

            {/* Conversion inputs */}
            <div className="space-y-3">
              {/* Foreign amount */}
              <div className="relative">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Amount in {selected?.name ?? "Foreign Currency"}
                </label>
                <div className="flex items-center gap-3 border-2 border-border hover:border-primary focus-within:border-primary rounded-2xl px-4 py-3 transition-colors bg-background">
                  {selected && <Flag code={selected.flagCode} size={20} />}
                  <span className="text-sm font-bold text-muted-foreground w-8">{selected?.code}</span>
                  <input
                    type="number"
                    min="0"
                    value={foreignAmt}
                    onChange={e => handleForeignChange(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 bg-transparent text-lg font-bold text-foreground outline-none placeholder:text-muted-foreground/30"
                  />
                </div>
              </div>

              {/* Swap icon */}
              <div className="flex justify-center">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4 text-primary" />
                </div>
              </div>

              {/* INR amount */}
              <div className="relative">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Amount in Indian Rupee (INR)
                </label>
                <div className="flex items-center gap-3 border-2 border-border hover:border-primary focus-within:border-primary rounded-2xl px-4 py-3 transition-colors bg-background">
                  <Flag code="in" size={20} />
                  <span className="text-sm font-bold text-muted-foreground w-8">INR</span>
                  <input
                    type="number"
                    min="0"
                    value={inrAmt}
                    onChange={e => handleInrChange(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 bg-transparent text-lg font-bold text-foreground outline-none placeholder:text-muted-foreground/30"
                  />
                </div>
              </div>
            </div>

            {/* Rate display */}
            {displayRate > 0 && (
              <motion.div
                key={`${currency}-${mode}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-muted/40 rounded-2xl px-4 py-3 flex items-center justify-between"
              >
                <div className="text-sm text-muted-foreground">
                  1 {currency} = <span className="font-bold text-foreground">₹{displayRate.toFixed(4)}</span>
                  <span className="ml-1.5 text-xs">({mode === "buy" ? "Our selling rate" : "Our buying rate"})</span>
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </motion.div>
            )}

            {/* Result highlight */}
            {inrNum > 0 && (
              <motion.div
                key={inrNum}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary rounded-2xl p-5 text-white text-center"
              >
                <p className="text-sm font-medium text-white/70 mb-1">You {mode === "buy" ? "pay" : "receive"}</p>
                <p className="text-4xl font-bold">
                  ₹{inrNum.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-white/60 mt-1">
                  {foreignAmt} {currency} @ ₹{displayRate.toFixed(4)}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* All rates quick ref */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Today's Rates</h2>
            <span className="text-xs text-muted-foreground">1 unit = ₹ (INR)</span>
          </div>
          <div className="divide-y divide-border">
            {(loading ? Array(6).fill(null) : rates).map((r, i) => (
              <div
                key={r?.code ?? i}
                onClick={() => r && setCurrency(r.code)}
                className={`flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30 cursor-pointer transition-colors ${r?.code === currency ? "bg-primary/5" : ""}`}
              >
                {r ? (
                  <>
                    <Flag code={r.flagCode} size={22} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{r.code}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Buy <span className="font-semibold text-foreground">₹{r.buy.toFixed(2)}</span></p>
                      <p className="text-xs text-muted-foreground">Sell <span className="font-semibold text-foreground">₹{r.sell.toFixed(2)}</span></p>
                    </div>
                    {r.code === currency && (
                      <div className="w-1.5 h-6 rounded-full bg-primary" />
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-6 h-5 bg-muted rounded animate-pulse" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-muted rounded w-12 animate-pulse" />
                      <div className="h-2.5 bg-muted rounded w-24 animate-pulse" />
                    </div>
                    <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                  </>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Rates are indicative and subject to change. Final rates confirmed at time of transaction.
        </p>
      </div>
    </div>
  );
}
