import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Mail, Inbox, BarChart3, Users, Plane, Building2,
  Map, RefreshCw, Eye, Clock, CheckCircle2, XCircle, AlertCircle,
  Search, Filter, TrendingUp, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");
const ADMIN_KEY = "admin2024";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType: string;
  createdAt: string;
}

interface AdminBooking {
  id: string;
  type: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  totalAmount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  travelers: number;
  checkIn?: string;
  checkOut?: string;
  createdAt: string;
  itemDetails?: any;
}

const INQUIRY_TYPE_COLORS: Record<string, string> = {
  general: "bg-primary/10 text-primary",
  booking: "bg-accent/10 text-accent",
  complaint: "bg-red-100 text-red-700",
  feedback: "bg-amber-100 text-amber-700",
  partnership: "bg-purple-100 text-purple-700",
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-slate-100 text-slate-700",
};

const PAYMENT_COLORS: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  unpaid: "bg-amber-100 text-amber-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-slate-100 text-slate-700",
};

export function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "inquiries" | "bookings">("dashboard");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const handleLogin = () => {
    const validCredentials = [
      { email: "paigam785@gmail.com", password: "Shaikh@3786" },
      { email: "admin@sinternational.com", password: "admin2024" },
    ];
    const emailMatch = validCredentials.find(c => c.email === adminEmail && c.password === adminPassword);
    if (emailMatch || pin === "admin2024" || pin === "admin") {
      setAuthed(true);
      fetchData();
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 1500);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [inqRes, bkRes] = await Promise.all([
        fetch(`${BASE_URL}/api/admin/inquiries?key=${ADMIN_KEY}`),
        fetch(`${BASE_URL}/api/admin/bookings?key=${ADMIN_KEY}`),
      ]);
      if (inqRes.ok) {
        const d = await inqRes.json();
        setInquiries(d.inquiries || []);
      }
      if (bkRes.ok) {
        const d = await bkRes.json();
        setBookings(d.bookings || []);
      }
      setLastRefresh(new Date());
    } catch (e) {
      console.error("Admin fetch failed", e);
    }
    setLoading(false);
  };

  const sym = (c: string) => c === "USD" ? "$" : c === "EUR" ? "€" : "₹";

  const totalRevenue = bookings.reduce((s, b) => s + (b.totalAmount || 0), 0);
  const filteredInquiries = inquiries.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase()) ||
    i.subject.toLowerCase().includes(search.toLowerCase())
  );
  const filteredBookings = bookings.filter(b =>
    !search || b.contactName.toLowerCase().includes(search.toLowerCase()) ||
    b.contactEmail.toLowerCase().includes(search.toLowerCase()) ||
    b.type.toLowerCase().includes(search.toLowerCase())
  );

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
        >
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-serif font-bold mb-1">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mb-8">S International Travel — Restricted Access</p>

          <div className="space-y-3">
            <Input
              type="email"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Admin email address"
              className={`bg-muted/40 rounded-xl h-12 text-sm transition-all ${pinError ? "border-destructive ring-2 ring-destructive/20" : ""}`}
            />
            <Input
              type="password"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Password"
              className={`bg-muted/40 rounded-xl h-12 text-sm transition-all ${pinError ? "border-destructive ring-2 ring-destructive/20" : ""}`}
            />
            {pinError && (
              <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-destructive text-sm font-semibold">
                Incorrect email or password. Please try again.
              </motion.p>
            )}
            <Button onClick={handleLogin} className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90">
              Access Dashboard
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">Authorized personnel only.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6 px-4">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-secondary text-xs font-semibold uppercase tracking-widest mb-1">
              <Shield className="w-3.5 h-3.5" /> Admin Panel
            </div>
            <h1 className="text-2xl font-serif font-bold">S International — Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="text-primary-foreground/60 text-xs hidden md:block">
                Updated {format(lastRefresh, "HH:mm:ss")}
              </span>
            )}
            <Button onClick={fetchData} disabled={loading} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 pt-6">

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Inbox className="w-5 h-5 text-secondary" />, label: "Total Inquiries", value: inquiries.length, bg: "bg-secondary/10" },
            { icon: <BarChart3 className="w-5 h-5 text-primary" />, label: "Total Bookings", value: bookings.length, bg: "bg-primary/10" },
            { icon: <DollarSign className="w-5 h-5 text-accent" />, label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, bg: "bg-accent/10" },
            { icon: <TrendingUp className="w-5 h-5 text-purple-600" />, label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, bg: "bg-purple-100" },
          ].map(({ icon, label, value, bg }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>{icon}</div>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/50 p-1 rounded-xl mb-6 w-fit">
          {[
            { id: "dashboard" as const, label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
            { id: "inquiries" as const, label: `Inquiries (${inquiries.length})`, icon: <Inbox className="w-4 h-4" /> },
            { id: "bookings" as const, label: `Bookings (${bookings.length})`, icon: <Users className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-white shadow text-primary border border-border" : "text-muted-foreground hover:text-foreground"}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        {(activeTab === "inquiries" || activeTab === "bookings") && (
          <div className="relative mb-5 max-w-sm">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-10 bg-card rounded-xl" />
          </div>
        )}

        {/* Dashboard Overview */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Inquiries */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif font-bold text-lg">Recent Inquiries</h2>
                <button onClick={() => setActiveTab("inquiries")} className="text-primary text-sm font-semibold hover:underline">View all</button>
              </div>
              {inquiries.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 text-sm">No inquiries yet</div>
              ) : (
                <div className="space-y-3">
                  {inquiries.slice(0, 5).map(inq => (
                    <div key={inq.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                        {inq.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{inq.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${INQUIRY_TYPE_COLORS[inq.inquiryType] || ""}`}>{inq.inquiryType}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{inq.subject}</p>
                        <p className="text-xs text-muted-foreground">{format(parseISO(inq.createdAt), "dd MMM yyyy, HH:mm")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Bookings */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif font-bold text-lg">Recent Bookings</h2>
                <button onClick={() => setActiveTab("bookings")} className="text-primary text-sm font-semibold hover:underline">View all</button>
              </div>
              {bookings.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 text-sm">No bookings yet</div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map(bk => (
                    <div key={bk.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                        {bk.type === "flight" ? <Plane className="w-4 h-4" /> : bk.type === "hotel" ? <Building2 className="w-4 h-4" /> : <Map className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{bk.contactName}</div>
                        <div className="text-xs text-muted-foreground capitalize">{bk.type} · {bk.travelers} pax</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-primary text-sm">₹{bk.totalAmount?.toLocaleString("en-IN")}</div>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${STATUS_COLORS[bk.status] || ""}`}>{bk.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Booking type breakdown */}
            <div className="bg-card border border-border rounded-2xl p-6 md:col-span-2">
              <h2 className="font-serif font-bold text-lg mb-5">Booking Breakdown</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { type: "flight", icon: <Plane className="w-5 h-5 text-primary" />, label: "Flights", color: "bg-primary/10" },
                  { type: "hotel", icon: <Building2 className="w-5 h-5 text-secondary" />, label: "Hotels", color: "bg-secondary/10" },
                  { type: "holiday", icon: <Map className="w-5 h-5 text-accent" />, label: "Packages", color: "bg-accent/10" },
                ].map(({ type, icon, label, color }) => {
                  const count = bookings.filter(b => b.type === type).length;
                  const rev = bookings.filter(b => b.type === type).reduce((s, b) => s + (b.totalAmount || 0), 0);
                  return (
                    <div key={type} className={`${color} rounded-2xl p-5`}>
                      <div className="flex items-center gap-2 mb-3">{icon}<span className="font-bold">{label}</span></div>
                      <div className="text-3xl font-bold mb-1">{count}</div>
                      <div className="text-sm text-muted-foreground">₹{rev.toLocaleString("en-IN")} revenue</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Inquiries tab */}
        {activeTab === "inquiries" && (
          <div className="space-y-3">
            {filteredInquiries.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-16 text-center text-muted-foreground">
                <Inbox className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No inquiries found</p>
              </div>
            ) : filteredInquiries.map(inq => (
              <motion.div
                key={inq.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedInquiry(selectedInquiry?.id === inq.id ? null : inq)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {inq.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold">{inq.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${INQUIRY_TYPE_COLORS[inq.inquiryType] || "bg-muted text-muted-foreground"}`}>
                        {inq.inquiryType}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-0.5">{inq.email}{inq.phone ? ` · ${inq.phone}` : ""}</div>
                    <div className="font-semibold text-sm">{inq.subject}</div>
                    <AnimatePresence>
                      {selectedInquiry?.id === inq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/40 p-3 rounded-xl">{inq.message}</p>
                            <div className="flex gap-3 mt-3">
                              <a href={`mailto:${inq.email}?subject=Re: ${inq.subject}`}>
                                <Button size="sm" className="rounded-lg bg-primary gap-1.5">
                                  <Mail className="w-3.5 h-3.5" /> Reply via Email
                                </Button>
                              </a>
                              {inq.phone && (
                                <a href={`https://wa.me/${inq.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                                  <Button size="sm" variant="outline" className="rounded-lg gap-1.5 text-green-600 border-green-300 hover:bg-green-50">
                                    WhatsApp
                                  </Button>
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-muted-foreground">{format(parseISO(inq.createdAt), "dd MMM yyyy")}</div>
                    <div className="text-xs text-muted-foreground">{format(parseISO(inq.createdAt), "HH:mm")}</div>
                    <Eye className="w-4 h-4 text-muted-foreground mt-2 ml-auto" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bookings tab */}
        {activeTab === "bookings" && (
          <div className="space-y-3">
            {filteredBookings.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-16 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No bookings found</p>
              </div>
            ) : filteredBookings.map(bk => {
              const details = bk.itemDetails as any;
              let title = bk.type;
              if (bk.type === "flight" && details?.airline) title = `${details.fromCode} → ${details.toCode}`;
              else if (bk.type === "hotel" && details?.name) title = details.name;
              else if (bk.type === "holiday" && details?.title) title = details.title;

              return (
                <motion.div key={bk.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                      {bk.type === "flight" ? <Plane className="w-4 h-4" /> : bk.type === "hotel" ? <Building2 className="w-4 h-4" /> : <Map className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="font-bold">{bk.contactName}</span>
                        <span className="text-xs text-muted-foreground font-mono">#{bk.id.substring(0, 8).toUpperCase()}</span>
                      </div>
                      <div className="font-semibold text-sm capitalize text-primary">{title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {bk.contactEmail} · {bk.travelers} pax
                        {bk.checkIn ? ` · ${bk.checkIn}` : ""}
                      </div>
                    </div>
                    <div className="text-right shrink-0 space-y-1.5">
                      <div className="font-bold text-primary">₹{bk.totalAmount?.toLocaleString("en-IN")}</div>
                      <div className="flex justify-end gap-1">
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${STATUS_COLORS[bk.status] || ""}`}>{bk.status}</span>
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${PAYMENT_COLORS[bk.paymentStatus] || ""}`}>{bk.paymentStatus}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{format(parseISO(bk.createdAt), "dd MMM yyyy")}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
