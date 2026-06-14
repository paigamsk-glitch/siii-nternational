import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CheckCircle2, Clock, Globe, FileText, Plane,
  AlertCircle, RefreshCw, Phone, ArrowRight, Shield,
  Package, CheckCheck, XCircle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock application data keyed by reference number
const MOCK_APPLICATIONS: Record<string, MockApp> = {
  "SINDEMOAPL1": {
    ref: "SINDEMOAPL1",
    country: "🇺🇸 United States",
    visaType: "Tourist Visa (B-2)",
    applicant: "Rahul Sharma",
    submitted: "10 Jun 2026",
    travelDate: "15 Jul 2026",
    travellers: 1,
    total: "INR 16,020.00",
    status: "submitted-embassy",
  },
  "SINDEMO2BRZ": {
    ref: "SINDEMO2BRZ",
    country: "🇧🇷 Brazil",
    visaType: "Tourist Visa",
    applicant: "Priya Nair",
    submitted: "08 Jun 2026",
    travelDate: "20 Jul 2026",
    travellers: 2,
    total: "INR 8,400.00",
    status: "approved",
  },
  "SINDEMO3UK0": {
    ref: "SINDEMO3UK0",
    country: "🇬🇧 United Kingdom",
    visaType: "Standard Visitor Visa",
    applicant: "Amit Patel",
    submitted: "01 Jun 2026",
    travelDate: "25 Jun 2026",
    travellers: 1,
    total: "INR 12,400.00",
    status: "docs-verification",
  },
};

type AppStatus = "received" | "docs-verification" | "submitted-embassy" | "decision-awaited" | "approved" | "rejected" | "delivered";

interface MockApp {
  ref: string;
  country: string;
  visaType: string;
  applicant: string;
  submitted: string;
  travelDate: string;
  travellers: number;
  total: string;
  status: AppStatus;
}

interface TimelineStep {
  id: AppStatus;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

const TIMELINE: TimelineStep[] = [
  { id: "received",          label: "Application Received",         sublabel: "We've received your application & payment",   icon: <FileText className="h-4 w-4" /> },
  { id: "docs-verification", label: "Documents Verified",           sublabel: "Our team is reviewing your documents",         icon: <CheckCircle2 className="h-4 w-4" /> },
  { id: "submitted-embassy", label: "Submitted to Embassy",         sublabel: "Application submitted to the Embassy / Dept.", icon: <Plane className="h-4 w-4" /> },
  { id: "decision-awaited",  label: "Decision Awaited",             sublabel: "Embassy is processing your application",       icon: <Clock className="h-4 w-4" /> },
  { id: "approved",          label: "Visa Approved",                sublabel: "Congratulations! Your visa has been approved", icon: <CheckCheck className="h-4 w-4" /> },
  { id: "delivered",         label: "Visa Delivered",               sublabel: "Visa has been dispatched / sent to your email",icon: <Package className="h-4 w-4" /> },
];

const STATUS_ORDER: AppStatus[] = ["received", "docs-verification", "submitted-embassy", "decision-awaited", "approved", "delivered"];

function getStatusIndex(status: AppStatus): number {
  if (status === "rejected") return -1;
  return STATUS_ORDER.indexOf(status);
}

function getStatusBadge(status: AppStatus) {
  const map: Record<AppStatus, { label: string; className: string }> = {
    "received":          { label: "Received",           className: "bg-blue-100 text-blue-700 border-blue-200" },
    "docs-verification": { label: "Under Review",        className: "bg-amber-100 text-amber-700 border-amber-200" },
    "submitted-embassy": { label: "At Embassy",          className: "bg-purple-100 text-purple-700 border-purple-200" },
    "decision-awaited":  { label: "Decision Pending",    className: "bg-orange-100 text-orange-700 border-orange-200" },
    "approved":          { label: "Approved ✓",          className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    "rejected":          { label: "Rejected",            className: "bg-red-100 text-red-700 border-red-200" },
    "delivered":         { label: "Delivered ✓",         className: "bg-teal-100 text-teal-700 border-teal-200" },
  };
  return map[status];
}

const TIPS = [
  "Keep your reference number safe — you'll need it for all communication.",
  "Processing times may vary depending on the Embassy's workload.",
  "You'll receive email updates at every stage of your application.",
  "Our visa experts are available 7 days a week if you need assistance.",
  "Do not make non-refundable travel bookings until your visa is approved.",
];

export function VisaStatus() {
  const [, setLocation] = useLocation();
  const [refInput, setRefInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MockApp | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [tipIdx] = useState(() => Math.floor(Math.random() * TIPS.length));

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!refInput.trim()) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);
    setTimeout(() => {
      const key = refInput.trim().toUpperCase();
      const found = MOCK_APPLICATIONS[key];
      setLoading(false);
      if (found) setResult(found);
      else setNotFound(true);
    }, 1500);
  }

  const currentIdx = result ? getStatusIndex(result.status) : -1;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="relative pt-16 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary/70" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white/80 text-sm font-medium mb-5">
              <Search className="h-4 w-4" /> Application Status Tracker
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3 leading-tight">
              Track Your Visa<br /><span className="text-secondary">Application</span>
            </h1>
            <p className="text-white/70 text-base max-w-xl mx-auto mb-10">
              Enter your application reference number to get real-time updates on your visa status.
            </p>
          </motion.div>

          {/* Search card */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-2xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="text-left">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Application Reference Number <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. SINDEMOAPL1"
                  value={refInput}
                  onChange={(e) => { setRefInput(e.target.value.toUpperCase()); setNotFound(false); setResult(null); }}
                  className="font-mono tracking-widest uppercase h-12 text-base"
                />
              </div>
              <div className="text-left">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Registered Email (optional)
                </label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full gap-2 text-base font-semibold" disabled={!refInput.trim() || loading}>
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Searching...</>
              ) : (
                <><Search className="h-4 w-4" /> Track Application</>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Try demo refs: <span className="font-mono font-semibold text-foreground cursor-pointer hover:text-primary" onClick={() => setRefInput("SINDEMOAPL1")}>SINDEMOAPL1</span>,{" "}
              <span className="font-mono font-semibold text-foreground cursor-pointer hover:text-primary" onClick={() => setRefInput("SINDEMO2BRZ")}>SINDEMO2BRZ</span>,{" "}
              <span className="font-mono font-semibold text-foreground cursor-pointer hover:text-primary" onClick={() => setRefInput("SINDEMO3UK0")}>SINDEMO3UK0</span>
            </p>
          </motion.form>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        {/* Not found */}
        <AnimatePresence>
          {notFound && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4"
            >
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700 mb-1">Application Not Found</p>
                <p className="text-red-600 text-sm">We couldn't find an application with reference <span className="font-mono font-bold">{refInput}</span>. Please check and try again, or contact our support team.</p>
                <button onClick={() => setLocation("/contact")} className="text-sm text-red-600 underline mt-2">Contact Support →</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: timeline */}
                <div className="flex-1 space-y-4">
                  {/* App summary */}
                  <div className="bg-card border border-card-border rounded-2xl p-5">
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Application Reference</p>
                        <p className="font-mono text-xl font-black text-primary tracking-widest">{result.ref}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(result.status).className}`}>
                        {getStatusBadge(result.status).label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border text-sm">
                      {[
                        ["Destination", result.country],
                        ["Visa Type", result.visaType],
                        ["Applicant", result.applicant],
                        ["Submitted On", result.submitted],
                        ["Travel Date", result.travelDate],
                        ["Travellers", String(result.travellers)],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                          <p className="font-semibold">{val}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Paid</span>
                      <span className="font-bold text-primary text-lg">{result.total}</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-card border border-card-border rounded-2xl p-5">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-foreground mb-5 flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-primary" /> Application Progress
                    </h3>

                    {result.status === "rejected" ? (
                      <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <XCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-red-700 mb-1">Application Rejected</p>
                          <p className="text-red-600 text-sm">Unfortunately your visa application was rejected by the Embassy. Please contact our support team for next steps and refund information.</p>
                          <button className="text-sm text-red-600 underline mt-2" onClick={() => setLocation("/contact")}>Contact Support →</button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0">
                        {TIMELINE.map((step, i) => {
                          const isDone = i <= currentIdx;
                          const isActive = i === currentIdx;
                          const isPending = i > currentIdx;
                          return (
                            <div key={step.id} className="flex gap-4">
                              {/* Icon column */}
                              <div className="flex flex-col items-center">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                                  isDone && !isActive ? "bg-accent border-accent text-accent-foreground shadow-sm" :
                                  isActive ? "bg-primary border-primary text-primary-foreground shadow-md ring-4 ring-primary/20" :
                                  "bg-muted border-border text-muted-foreground"
                                }`}>
                                  {isDone && !isActive
                                    ? <CheckCircle2 className="h-4 w-4" />
                                    : isActive
                                    ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>{step.icon}</motion.div>
                                    : step.icon}
                                </div>
                                {i < TIMELINE.length - 1 && (
                                  <div className={`w-0.5 h-10 mt-1 ${isDone ? "bg-accent" : "bg-border"}`} />
                                )}
                              </div>
                              {/* Content */}
                              <div className="pb-6">
                                <p className={`font-semibold text-sm ${isActive ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground"}`}>
                                  {step.label}
                                  {isActive && <span className="ml-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">Current</span>}
                                </p>
                                <p className={`text-xs mt-0.5 ${isPending ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
                                  {step.sublabel}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Special approved message */}
                  {result.status === "approved" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center"
                    >
                      <CheckCheck className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
                      <h3 className="font-bold text-emerald-800 text-lg mb-1">Visa Approved! 🎉</h3>
                      <p className="text-emerald-700 text-sm mb-3">Your visa has been approved. We will dispatch the physical visa / email the e-Visa within 24 hours.</p>
                      <p className="text-xs text-emerald-600">Have a great trip to {result.country}!</p>
                    </motion.div>
                  )}
                </div>

                {/* Right: help + tips */}
                <div className="w-full lg:w-72 space-y-4 lg:self-start">
                  <div className="bg-card border border-card-border rounded-2xl p-4">
                    <p className="font-semibold text-sm text-foreground mb-0.5">Need Help?</p>
                    <p className="text-xs text-muted-foreground mb-3">Our visa experts are available 7 days a week.</p>
                    <div className="space-y-2">
                      <button onClick={() => setLocation("/contact")} className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium group">
                        <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> Call Us</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </button>
                      <button onClick={() => setLocation("/contact")} className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium group">
                        <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Email Support</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-card border border-card-border rounded-2xl p-4">
                    <p className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" /> Helpful Tip
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{TIPS[tipIdx]}</p>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-center">
                    <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-semibold text-foreground mb-2">Apply for Another Visa</p>
                    <Button size="sm" className="w-full" onClick={() => setLocation("/visa")}>
                      New Application
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state tips */}
        {!result && !notFound && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto mt-4">
            <h3 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">What to Expect</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <FileText className="h-5 w-5 text-primary" />, title: "Application Tracking", desc: "Real-time updates at every stage of your visa journey." },
                { icon: <Clock className="h-5 w-5 text-secondary" />, title: "Processing Updates", desc: "Get notified when your application moves forward." },
                { icon: <CheckCheck className="h-5 w-5 text-accent" />, title: "Approval Alerts", desc: "Instant notification when your visa is approved." },
              ].map(item => (
                <div key={item.title} className="bg-card border border-card-border rounded-2xl p-5 text-center">
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3">{item.icon}</div>
                  <p className="font-semibold text-sm text-foreground mb-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
