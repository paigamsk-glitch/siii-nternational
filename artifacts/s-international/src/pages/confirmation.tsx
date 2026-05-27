import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import {
  CheckCircle2, FileText, Calendar, ArrowRight, Download,
  Mail, Plane, Building2, Map, Phone, Share2,
  Star, Gift, Clock
} from "lucide-react";
import { useGetBookingById, getGetBookingByIdQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function fmt(n: number) { return n.toLocaleString("en-IN"); }
function currSym(c?: string) { return c === "USD" ? "$" : c === "EUR" ? "€" : c === "GBP" ? "£" : "₹"; }

export function Confirmation() {
  const [, setLocation] = useLocation();
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("bookingId");
    if (id) setBookingId(id);
    else setLocation("/");
  }, [setLocation]);

  const { data: booking, isLoading } = useGetBookingById(bookingId || "", {
    query: { enabled: !!bookingId, queryKey: getGetBookingByIdQueryKey(bookingId || "") }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }
  if (!booking) return null;

  const sym = currSym(booking.currency);
  const amount = typeof booking.totalAmount === "number" ? booking.totalAmount : 0;
  const typeIcon = booking.type === "flight" ? <Plane className="w-5 h-5" /> :
    booking.type === "hotel" ? <Building2 className="w-5 h-5" /> : <Map className="w-5 h-5" />;

  const details = booking.itemDetails as any;
  let bookingTitle = "";
  let bookingSubtitle = "";
  if (booking.type === "flight" && details?.airline) {
    bookingTitle = `${details.fromCode || "?"} → ${details.toCode || "?"}`;
    bookingSubtitle = `${details.airline} · ${details.flightNumber} · ${details.cabinClass}`;
  } else if (booking.type === "hotel" && details?.name) {
    bookingTitle = details.name;
    bookingSubtitle = details.destination;
  } else if (booking.type === "holiday" && details?.title) {
    bookingTitle = details.title;
    bookingSubtitle = `${details.duration} Days · ${details.destination}`;
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Celebration header */}
      <div className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1920&auto=format&fit=crop')",
          backgroundSize: "cover", backgroundPosition: "center"
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary" />
        {/* Confetti-like dots */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: [0, 1, 0], y: [0, 60 + i * 10] }}
            transition={{ delay: i * 0.1, duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${8 + i * 8}%`,
              top: "20%",
              background: i % 3 === 0 ? "hsl(24 94% 57%)" : i % 3 === 1 ? "white" : "hsl(162 65% 25%)"
            }}
          />
        ))}

        <div className="relative z-10 container mx-auto px-4 py-16 text-center text-primary-foreground">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <CheckCircle2 className="w-12 h-12 text-secondary-foreground" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="flex items-center justify-center gap-2 text-secondary text-sm font-semibold uppercase tracking-widest mb-3">
              <Star className="w-4 h-4 fill-secondary" /> Booking Confirmed
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              You're All Set!
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-lg mx-auto">
              {booking.contactName.split(" ")[0]}, your journey is confirmed. A confirmation has been sent to{" "}
              <span className="text-secondary font-semibold">{booking.contactEmail}</span>
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-6 relative z-10">

        {/* Reference card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden mb-6"
        >
          {/* Booking type banner */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              {typeIcon}
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold capitalize">{booking.type} Booking</div>
              <div className="font-serif font-bold text-lg">{bookingTitle}</div>
              {bookingSubtitle && <div className="text-sm text-muted-foreground">{bookingSubtitle}</div>}
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200 font-bold">Confirmed</Badge>
          </div>

          {/* Key details grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border border-b border-border">
            {[
              { label: "Booking Ref", value: booking.id.substring(0, 8).toUpperCase(), mono: true },
              { label: "Status", value: "Confirmed", badge: "green" },
              { label: "Payment", value: booking.paymentStatus || "Paid", capitalize: true },
              { label: "Amount", value: `${sym}${fmt(amount)}`, highlight: true },
            ].map(({ label, value, mono, badge, capitalize, highlight }) => (
              <div key={label} className="p-5 text-center">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{label}</div>
                {badge ? (
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded text-sm font-bold">{value}</div>
                ) : (
                  <div className={`font-bold text-lg ${mono ? "font-mono" : ""} ${capitalize ? "capitalize" : ""} ${highlight ? "text-primary" : ""}`}>{value}</div>
                )}
              </div>
            ))}
          </div>

          {/* Guest info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
            {[
              { icon: <Mail className="w-4 h-4 text-secondary" />, label: "Email", value: booking.contactEmail },
              { icon: <Phone className="w-4 h-4 text-accent" />, label: "Phone", value: booking.contactPhone },
              { icon: <Calendar className="w-4 h-4 text-primary" />, label: "Travel Date", value: booking.checkIn || "As booked" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">{icon}</div>
                <div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="font-semibold text-sm truncate max-w-[160px]">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What's next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-6"
        >
          <h2 className="text-xl font-serif font-bold mb-6">What Happens Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Mail className="w-6 h-6 text-secondary" />,
                bg: "bg-secondary/10",
                step: "01",
                title: "Confirmation Email",
                desc: "A detailed confirmation with booking summary has been sent to your email address."
              },
              {
                icon: <FileText className="w-6 h-6 text-primary" />,
                bg: "bg-primary/10",
                step: "02",
                title: "Travel Documents",
                desc: "E-tickets and vouchers will be available in your dashboard 48 hours before departure."
              },
              {
                icon: <Gift className="w-6 h-6 text-accent" />,
                bg: "bg-accent/10",
                step: "03",
                title: "Bon Voyage!",
                desc: "Our concierge team is available 24/7 to assist with any questions before and during your trip."
              },
            ].map(({ icon, bg, step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
                  {icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground mb-1">STEP {step}</div>
                  <div className="font-bold mb-1">{title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Support card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="bg-primary/5 border border-primary/15 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-bold">Need Help?</div>
            <div className="text-sm text-muted-foreground">Our travel experts are available 24/7 — call <a href="tel:+919967553351" className="text-primary font-semibold">+91 99675 53351</a> or WhatsApp <a href="https://wa.me/917777027454" className="text-green-600 font-semibold">+91 77770 27454</a></div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
            <Clock className="w-3.5 h-3.5" /> 24/7 Support
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/bookings" className="flex-1">
            <Button className="w-full h-12 bg-primary hover:bg-primary/90 rounded-xl font-bold">
              View My Bookings <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button variant="outline" className="flex-1 h-12 rounded-xl border-primary/20 text-primary hover:bg-primary/5">
            <Download className="w-4 h-4 mr-2" /> Download Receipt
          </Button>
          <Button variant="outline" className="flex-1 h-12 rounded-xl">
            <Share2 className="w-4 h-4 mr-2" /> Share Itinerary
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
