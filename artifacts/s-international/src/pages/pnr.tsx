import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Train, Search, CheckCircle2, Clock, MapPin, User,
  AlertCircle, Calendar, RefreshCw, ArrowRight, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface PNRPassenger {
  name: string;
  age: number;
  gender: "M" | "F";
  bookingStatus: string;
  currentStatus: string;
  coach?: string;
  seat?: string;
}

interface PNRResult {
  pnr: string;
  trainNumber: string;
  trainName: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  className: string;
  classCode: string;
  chartStatus: "Chart Not Prepared" | "Chart Prepared";
  passengers: PNRPassenger[];
  boardingStation: string;
  distance: string;
  fare: number;
  refundable: boolean;
}

// Deterministic fake PNR result based on number
function getPNRResult(pnr: string): PNRResult | null {
  if (!/^\d{10}$/.test(pnr)) return null;

  const seed = pnr.split("").reduce((a, d) => a + parseInt(d), 0);
  const trains = [
    { number: "12951", name: "Mumbai Rajdhani Express", from: "New Delhi", fromCode: "NDLS", to: "Mumbai Central", toCode: "MMCT", dep: "16:55", arr: "08:35", dur: "15h 40m", dist: "1384 km" },
    { number: "12301", name: "Howrah Rajdhani Express", from: "New Delhi", fromCode: "NDLS", to: "Howrah Junction", toCode: "HWH", dep: "16:55", arr: "10:00", dur: "17h 05m", dist: "1448 km" },
    { number: "12621", name: "Tamil Nadu Express", from: "New Delhi", fromCode: "NDLS", to: "Chennai Central", toCode: "MAS", dep: "22:30", arr: "07:40", dur: "33h 10m", dist: "2180 km" },
    { number: "10111", name: "Konkan Kanya Express", from: "CSTM", fromCode: "CSTM", to: "Goa Madgaon", toCode: "MAO", dep: "23:00", arr: "11:40", dur: "12h 40m", dist: "582 km" },
    { number: "12759", name: "Charminar SF Express", from: "Hyderabad Deccan", fromCode: "HYB", to: "Chennai Central", toCode: "MAS", dep: "18:15", arr: "06:00", dur: "11h 45m", dist: "792 km" },
    { number: "12627", name: "Karnataka Express", from: "New Delhi", fromCode: "NDLS", to: "Bangalore City", toCode: "SBC", dep: "21:20", arr: "06:45", dur: "33h 25m", dist: "2444 km" },
  ];
  const classCodes = [
    { code: "SL", label: "Sleeper Class", fare: 545 },
    { code: "3A", label: "AC 3 Tier", fare: 1990 },
    { code: "2A", label: "AC 2 Tier", fare: 2875 },
    { code: "1A", label: "AC First Class", fare: 4895 },
  ];
  const statuses = ["CNF", "WL/4", "RAC/12", "CNF", "CNF", "WL/1"];
  const coaches = ["S4", "B2", "B3", "A1", "H1"];
  const firstNames = ["Rahul", "Priya", "Amit", "Deepa", "Vijay", "Sunita", "Arjun", "Meera"];
  const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Verma", "Mehta", "Gupta", "Nair"];

  const t = trains[seed % trains.length];
  const cls = classCodes[seed % classCodes.length];
  const paxCount = (seed % 3) + 1;
  const dateOffset = (seed % 14) + 1;
  const journeyDate = new Date();
  journeyDate.setDate(journeyDate.getDate() + dateOffset);
  const dateStr = journeyDate.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  const passengers: PNRPassenger[] = Array.from({ length: paxCount }, (_, i) => {
    const s = statuses[(seed + i) % statuses.length];
    const isConfirmed = s === "CNF";
    return {
      name: `${firstNames[(seed + i * 3) % firstNames.length]} ${lastNames[(seed + i * 2) % lastNames.length]}`,
      age: 22 + ((seed + i * 7) % 40),
      gender: i % 2 === 0 ? "M" : "F",
      bookingStatus: s.includes("WL") ? `WL/${(seed + i * 2) % 30 + 1}` : s,
      currentStatus: s,
      coach: isConfirmed ? coaches[seed % coaches.length] + (i + 1) : undefined,
      seat: isConfirmed ? String((seed % 60) + 1 + i * 4) : undefined,
    };
  });

  return {
    pnr,
    trainNumber: t.number,
    trainName: t.name,
    from: t.from,
    fromCode: t.fromCode,
    to: t.to,
    toCode: t.toCode,
    departureDate: dateStr,
    departureTime: t.dep,
    arrivalTime: t.arr,
    duration: t.dur,
    className: cls.label,
    classCode: cls.code,
    chartStatus: dateOffset <= 3 ? "Chart Prepared" : "Chart Not Prepared",
    passengers,
    boardingStation: t.from,
    distance: t.dist,
    fare: cls.fare * paxCount,
    refundable: cls.code !== "SL",
  };
}

const STATUS_STYLE: Record<string, string> = {
  CNF: "bg-green-100 text-green-800 border-green-200",
  RAC: "bg-blue-100 text-blue-800 border-blue-200",
  WL: "bg-amber-100 text-amber-800 border-amber-200",
};

function getStatusStyle(s: string) {
  if (s.startsWith("CNF")) return STATUS_STYLE.CNF;
  if (s.startsWith("RAC")) return STATUS_STYLE.RAC;
  return STATUS_STYLE.WL;
}

export function PNRStatus() {
  const [pnr, setPnr] = useState("");
  const [result, setResult] = useState<PNRResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState("");

  async function handleCheck() {
    const clean = pnr.trim();
    setError("");
    if (clean.length !== 10 || !/^\d+$/.test(clean)) {
      setError("Please enter a valid 10-digit PNR number.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const res = getPNRResult(clean);
    setResult(res);
    setLastChecked(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    setLoading(false);
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: "hsl(232 22% 97%)" }}>
      {/* Hero */}
      <div className="text-white pt-10 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2000&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/75" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Train className="w-5 h-5 text-secondary" />
            <span className="text-secondary text-sm font-semibold tracking-widest uppercase">
              Indian Railways
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-2">PNR Status</h1>
          <p className="text-white/70 mb-8 text-sm">Check your booking and seat confirmation status</p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 max-w-xl">
            <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
              Enter PNR Number
            </label>
            <div className="flex gap-3">
              <Input
                value={pnr}
                onChange={(e) => {
                  setPnr(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setError("");
                }}
                placeholder="10-digit PNR (e.g. 4501234567)"
                className="bg-white text-foreground border-0 rounded-xl h-11 font-mono text-base tracking-widest"
                maxLength={10}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              />
              <Button
                onClick={handleCheck}
                disabled={loading}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl h-11 px-5 font-semibold shrink-0"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <><Search className="w-4 h-4 mr-1.5" /> Check</>
                )}
              </Button>
            </div>
            {error && (
              <p className="text-red-300 text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {error}
              </p>
            )}
            <p className="text-white/50 text-xs mt-3 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Try any 10-digit number — e.g. <strong className="text-white/70">4501234567</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6 max-w-3xl">
        {/* Loading skeleton */}
        {loading && (
          <div className="bg-white rounded-2xl border border-border p-6 space-y-4 animate-pulse">
            <div className="h-6 bg-muted rounded-lg w-1/3" />
            <div className="h-24 bg-muted rounded-xl" />
            <div className="h-40 bg-muted rounded-xl" />
          </div>
        )}

        <AnimatePresence>
          {!loading && result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* PNR header */}
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="bg-primary/5 border-b border-border px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Train className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{result.trainName}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        #{result.trainNumber} · PNR: {result.pnr}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={`text-xs font-semibold border ${
                        result.chartStatus === "Chart Prepared"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-amber-100 text-amber-800 border-amber-200"
                      }`}
                    >
                      {result.chartStatus}
                    </Badge>
                    {lastChecked && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" /> Updated {lastChecked}
                      </p>
                    )}
                  </div>
                </div>

                {/* Route timeline */}
                <div className="flex items-center justify-between px-6 py-5 bg-muted/20">
                  <div>
                    <p className="text-3xl font-bold tabular-nums">{result.departureTime}</p>
                    <p className="text-xs font-bold text-primary">{result.fromCode}</p>
                    <p className="text-xs text-muted-foreground">{result.from}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {result.departureDate}
                    </p>
                  </div>
                  <div className="flex-1 px-5 flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground font-medium">{result.duration}</span>
                    <div className="w-full flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full border-2 border-primary bg-white" />
                      <div className="flex-1 h-px bg-gradient-to-r from-primary to-secondary" />
                      <Train className="w-3.5 h-3.5 text-secondary" />
                      <div className="flex-1 h-px bg-gradient-to-r from-secondary to-primary" />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">{result.distance}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold tabular-nums">{result.arrivalTime}</p>
                    <p className="text-xs font-bold text-primary">{result.toCode}</p>
                    <p className="text-xs text-muted-foreground">{result.to}</p>
                  </div>
                </div>

                {/* Class + fare */}
                <div className="px-6 pb-4 flex items-center justify-between text-sm border-t border-border pt-3">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      Boarding: <strong className="text-foreground">{result.boardingStation}</strong>
                    </span>
                    <Badge className="bg-primary/8 text-primary border-0 font-mono font-bold text-xs">
                      {result.classCode}
                    </Badge>
                    <span className="text-muted-foreground text-xs">{result.className}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total Fare</p>
                    <p className="font-bold text-primary">₹{result.fare.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>

              {/* Passengers */}
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm">
                    Passenger Details ({result.passengers.length})
                  </h3>
                </div>
                <div className="divide-y divide-border">
                  {result.passengers.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="px-5 py-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{p.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.age} yrs · {p.gender === "M" ? "Male" : "Female"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end mb-1">
                          <span className="text-xs text-muted-foreground">Booking:</span>
                          <Badge className={`text-xs font-bold border ${getStatusStyle(p.bookingStatus)}`}>
                            {p.bookingStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-xs text-muted-foreground">Current:</span>
                          <Badge className={`text-xs font-bold border ${getStatusStyle(p.currentStatus)}`}>
                            {p.currentStatus}
                          </Badge>
                        </div>
                        {p.coach && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Coach <strong>{p.coach}</strong> · Seat <strong>{p.seat}</strong>
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Status legend */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Status Guide
                </h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    { code: "CNF", label: "Confirmed — seat allotted", color: "bg-green-100 text-green-800 border-green-200" },
                    { code: "RAC", label: "Reservation Against Cancellation", color: "bg-blue-100 text-blue-800 border-blue-200" },
                    { code: "WL", label: "Waiting List", color: "bg-amber-100 text-amber-800 border-amber-200" },
                  ].map((s) => (
                    <div key={s.code} className="flex items-center gap-2">
                      <Badge className={`text-xs font-bold border ${s.color}`}>{s.code}</Badge>
                      <span className="text-xs text-muted-foreground">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refresh button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleCheck}
                  className="rounded-xl gap-2 text-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state — no result yet */}
        {!loading && !result && (
          <div className="bg-white rounded-2xl border border-border p-14 text-center">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-5">
              <Train className="w-10 h-10 text-primary/30" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-2">Enter your PNR</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Your 10-digit PNR number is printed on your ticket or available in the booking confirmation SMS.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
