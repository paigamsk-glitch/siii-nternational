import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Plane, Building2, Map, ShieldCheck, User, Clock, Luggage,
  Utensils, Wifi, Star, MapPin, Calendar, Moon, Users,
  CheckCircle2, ArrowRight, CreditCard, Lock
} from "lucide-react";
import {
  useGetSession, getGetSessionQueryKey,
  useCreateBooking
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useBookingStore } from "@/lib/booking-store";

const checkoutSchema = z.object({
  contactName: z.string().min(2, "Name must be at least 2 characters"),
  contactEmail: z.string().email("Valid email required"),
  contactPhone: z.string().min(8, "Valid phone required"),
  notes: z.string().optional(),
});

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

function fmt(n: number) { return n.toLocaleString("en-IN"); }
function currSym(c: string) { return c === "USD" ? "$" : c === "EUR" ? "€" : c === "GBP" ? "£" : "₹"; }

export function Checkout() {
  const [, setLocation] = useLocation();
  const { type, item, searchParams } = useBookingStore();

  const { data: session, isLoading: sessionLoading } = useGetSession({
    query: { queryKey: getGetSessionQueryKey() }
  });

  useEffect(() => {
    if (!item || !type) setLocation("/");
  }, [item, type, setLocation]);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      contactName: session?.user?.name || "",
      contactEmail: session?.user?.email || "",
      contactPhone: session?.user?.phone || "",
      notes: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        contactName: session.user.name,
        contactEmail: session.user.email,
        contactPhone: session.user.phone || "",
        notes: "",
      });
    }
  }, [session, form]);

  const createBookingMutation = useCreateBooking({
    mutation: {
      onSuccess: (data) => {
        setLocation(`/payment?bookingId=${data.id}`);
      }
    }
  });

  if (!item || !type) return null;

  const travelers = searchParams.travelers || searchParams.guests || 1;
  const sym = currSym((item as any).currency || "INR");

  let price = 0;
  if (type === "flight") price = (item as any).price * (searchParams.tripType === "round-trip" ? 1.9 : 1) * travelers;
  else if (type === "hotel") price = (item as any).pricePerNight * (searchParams.rooms || 1);
  else if (type === "holiday") price = (item as any).price * travelers;

  const taxes = Math.round(price * 0.15);
  const total = price + taxes;

  const onSubmit = (data: z.infer<typeof checkoutSchema>) => {
    if (!session?.authenticated) { setLocation("/login"); return; }
    createBookingMutation.mutate({
      data: {
        type: type as any,
        itemId: (item as any).id,
        travelers,
        checkIn: searchParams.date || searchParams.checkIn,
        checkOut: searchParams.checkOut,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        totalAmount: total,
        currency: (item as any).currency || "INR",
        notes: data.notes,
      }
    });
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header stripe */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-4 h-4 text-secondary" />
            <span className="text-secondary text-xs font-semibold uppercase tracking-widest">Secure Checkout</span>
          </div>
          <h1 className="text-3xl font-serif font-bold">Complete Your Booking</h1>

          {/* Progress steps */}
          <div className="flex items-center gap-0 mt-6 max-w-sm">
            {["Details", "Payment", "Confirmed"].map((step, i) => (
              <div key={step} className="flex items-center gap-0">
                <div className={`flex items-center gap-2 ${i === 0 ? "text-white" : "text-white/40"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i === 0 ? "bg-secondary text-secondary-foreground border-secondary" : "border-white/30"}`}>
                    {i + 1}
                  </div>
                  <span className="text-sm font-semibold hidden sm:block">{step}</span>
                </div>
                {i < 2 && <div className="w-8 h-px bg-white/20 mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Booking item card + Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Item details card */}
            {type === "flight" && <FlightCard item={item as any} searchParams={searchParams} sym={sym} />}
            {type === "hotel" && <HotelCard item={item as any} searchParams={searchParams} sym={sym} />}
            {type === "holiday" && <PackageCard item={item as any} travelers={travelers} sym={sym} />}

            {/* Sign in prompt */}
            {!session?.authenticated && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Sign in for faster checkout</div>
                    <div className="text-sm text-muted-foreground">Access your saved details and earn rewards.</div>
                  </div>
                </div>
                <Link href="/login">
                  <Button variant="outline" className="rounded-xl border-primary/30 text-primary hover:bg-primary hover:text-white shrink-0">Sign In</Button>
                </Link>
              </div>
            )}

            {/* Traveler info form */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="bg-muted/40 px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                <h2 className="text-lg font-serif font-bold">Traveler Information</h2>
              </div>
              <div className="p-6">
                <Form {...form}>
                  <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField control={form.control} name="contactName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Lead Traveler Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="As it appears on ID / Passport" {...field} className="bg-muted/40 rounded-xl h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="contactEmail" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="For booking confirmation" {...field} className="bg-muted/40 rounded-xl h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="contactPhone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98765 43210 (for urgent updates)" {...field} className="bg-muted/40 rounded-xl h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Special Requests <span className="font-normal text-muted-foreground">(Optional)</span></FormLabel>
                        <FormControl>
                          <Textarea placeholder="Dietary requirements, accessibility needs, room preferences, anniversary / birthday celebration..." className="bg-muted/40 rounded-xl min-h-[90px] resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </form>
                </Form>
              </div>
            </div>

            {/* Payment step preview */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden opacity-60">
              <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">2</div>
                <h2 className="text-lg font-serif font-bold text-muted-foreground">Payment</h2>
              </div>
              <div className="p-6 flex items-center gap-3 text-muted-foreground">
                <CreditCard className="w-5 h-5" />
                <span className="text-sm">Payment collected securely on the next step via Credit Card, UPI, or Net Banking.</span>
              </div>
            </div>
          </div>

          {/* Right: Pricing sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-primary px-6 py-5 text-primary-foreground">
                <div className="text-primary-foreground/70 text-sm mb-1">Total Amount</div>
                <div className="text-4xl font-bold">{sym}{fmt(total)}</div>
                <div className="text-primary-foreground/60 text-xs mt-1">incl. all taxes & fees</div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base price</span>
                    <span className="font-medium">{sym}{fmt(price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST & taxes (15%)</span>
                    <span className="font-medium">{sym}{fmt(taxes)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{sym}{fmt(total)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  form="checkout-form"
                  className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-bold text-base shadow-lg"
                  disabled={createBookingMutation.isPending || !session?.authenticated}
                >
                  {createBookingMutation.isPending ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</span>
                  ) : (
                    <span className="flex items-center gap-2">Proceed to Payment <ArrowRight className="w-4 h-4" /></span>
                  )}
                </Button>

                {!session?.authenticated && (
                  <p className="text-xs text-center text-destructive font-medium">Please sign in to complete your booking.</p>
                )}

                {/* Security badges */}
                <div className="pt-4 border-t border-border space-y-2">
                  {[
                    { icon: <ShieldCheck className="w-4 h-4 text-green-600" />, label: "SSL encrypted & secure payment" },
                    { icon: <CheckCircle2 className="w-4 h-4 text-accent" />, label: "Free cancellation available" },
                    { icon: <Lock className="w-4 h-4 text-primary" />, label: "PCI-DSS compliant checkout" },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      {icon} {label}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  By proceeding, you agree to our <a href="#" className="underline">Terms</a> & <a href="#" className="underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlightCard({ item, searchParams, sym }: { item: any; searchParams: any; sym: string }) {
  const isRoundTrip = searchParams.tripType === "round-trip";
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary/8 to-secondary/5 px-6 py-4 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Plane className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Flight Booking</div>
          <div className="font-serif font-bold">{item.from} → {item.to}</div>
        </div>
        <Badge className="ml-auto bg-accent/10 text-accent border-0 text-xs font-bold">
          {isRoundTrip ? "Round Trip" : "One Way"}
        </Badge>
      </div>

      <div className="p-6">
        {/* Airline + route */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center font-black text-primary text-sm">
            {item.airlineCode || item.airline?.substring(0, 2) || "AI"}
          </div>
          <div>
            <div className="font-bold">{item.airline}</div>
            <div className="text-sm text-muted-foreground">{item.flightNumber} · {item.cabinClass} class</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs text-muted-foreground">Stops</div>
            <div className="font-bold text-sm">{item.stops === 0 ? "Non-stop" : `${item.stops} stop`}</div>
          </div>
        </div>

        {/* Route timeline */}
        <div className="flex items-center justify-between mb-6 bg-muted/30 rounded-2xl p-5">
          <div>
            <div className="text-4xl font-bold">{item.departureTime}</div>
            <div className="text-primary font-bold text-sm mt-0.5">{item.fromCode}</div>
            <div className="text-muted-foreground text-xs">{item.from}</div>
          </div>
          <div className="flex-1 px-4 flex flex-col items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium">{item.duration}</span>
            <div className="w-full flex items-center gap-1">
              <div className="w-2 h-2 rounded-full border-2 border-primary bg-white" />
              <div className="flex-1 h-px bg-gradient-to-r from-primary to-secondary" />
              <Plane className="w-4 h-4 text-secondary fill-secondary" />
              <div className="flex-1 h-px bg-gradient-to-r from-secondary to-primary" />
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <span className="text-xs text-muted-foreground">{item.stops === 0 ? "Direct flight" : "Via hub"}</span>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{item.arrivalTime}</div>
            <div className="text-primary font-bold text-sm mt-0.5">{item.toCode}</div>
            <div className="text-muted-foreground text-xs">{item.to}</div>
          </div>
        </div>

        {/* Dates */}
        {(searchParams.date || searchParams.returnDate) && (
          <div className="flex items-center gap-6 mb-4 pb-4 border-b border-border">
            {searchParams.date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-muted-foreground text-xs">Departure</div>
                  <div className="font-semibold">{searchParams.date}</div>
                </div>
              </div>
            )}
            {isRoundTrip && searchParams.returnDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-secondary" />
                <div>
                  <div className="text-muted-foreground text-xs">Return</div>
                  <div className="font-semibold">{searchParams.returnDate}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-accent" />
              <div>
                <div className="text-muted-foreground text-xs">Passengers</div>
                <div className="font-semibold">{searchParams.travelers || 1}</div>
              </div>
            </div>
          </div>
        )}

        {/* Amenities */}
        {item.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.amenities.map((a: string) => (
              <div key={a} className="flex items-center gap-1.5 text-xs bg-muted/60 rounded-lg px-2.5 py-1.5 text-muted-foreground">
                {a.toLowerCase().includes("meal") ? <Utensils className="w-3 h-3" /> :
                  a.toLowerCase().includes("luggage") || a.toLowerCase().includes("baggage") ? <Luggage className="w-3 h-3" /> :
                  a.toLowerCase().includes("wifi") ? <Wifi className="w-3 h-3" /> :
                  <CheckCircle2 className="w-3 h-3 text-accent" />}
                {a}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function HotelCard({ item, searchParams, sym }: { item: any; searchParams: any; sym: string }) {
  const checkIn = searchParams.checkIn;
  const checkOut = searchParams.checkOut;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="h-52 relative">
        <img src={item.imageUrl || item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge className="bg-secondary text-secondary-foreground text-xs font-bold">{item.category}</Badge>
        </div>
        <div className="absolute bottom-4 left-5 text-white">
          <div className="flex gap-0.5 mb-1">
            {Array(Math.round(item.rating || 4)).fill(0).map((_: any, i: number) => <span key={i} className="text-secondary text-sm">★</span>)}
          </div>
          <h3 className="text-2xl font-serif font-bold">{item.name}</h3>
          <div className="flex items-center gap-1.5 text-white/80 text-sm mt-0.5">
            <MapPin className="w-3.5 h-3.5" />{item.destination}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="bg-muted/40 rounded-xl p-3 text-center">
            <Calendar className="w-4 h-4 text-primary mx-auto mb-1" />
            <div className="text-xs text-muted-foreground">Check-in</div>
            <div className="font-bold text-sm">{checkIn || "—"}</div>
          </div>
          <div className="bg-muted/40 rounded-xl p-3 text-center">
            <Calendar className="w-4 h-4 text-secondary mx-auto mb-1" />
            <div className="text-xs text-muted-foreground">Check-out</div>
            <div className="font-bold text-sm">{checkOut || "—"}</div>
          </div>
          <div className="bg-muted/40 rounded-xl p-3 text-center">
            <Moon className="w-4 h-4 text-accent mx-auto mb-1" />
            <div className="text-xs text-muted-foreground">Nights</div>
            <div className="font-bold text-sm">{searchParams.rooms || 1} room{(searchParams.rooms || 1) > 1 ? "s" : ""}</div>
          </div>
        </div>

        {item.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.amenities.slice(0, 6).map((a: string) => (
              <div key={a} className="text-xs bg-muted/60 rounded-lg px-2.5 py-1.5 text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-accent" />{a}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function PackageCard({ item, travelers, sym }: { item: any; travelers: number; sym: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="h-52 relative">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-5 text-white">
          <div className="flex items-center gap-2 text-xs text-secondary font-semibold uppercase tracking-widest mb-1">
            <Map className="w-3.5 h-3.5" /> Package Holiday
          </div>
          <h3 className="text-2xl font-serif font-bold">{item.title}</h3>
          <div className="flex items-center gap-3 text-white/80 text-sm mt-1">
            <span>{item.duration} Days · {item.nights} Nights</span>
            <span>·</span>
            <span>{item.destination}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-muted/40 rounded-xl p-3">
            <div className="text-xs text-muted-foreground mb-0.5">Travelers</div>
            <div className="font-bold flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" />{travelers} {travelers === 1 ? "person" : "people"}</div>
          </div>
          <div className="bg-muted/40 rounded-xl p-3">
            <div className="text-xs text-muted-foreground mb-0.5">Duration</div>
            <div className="font-bold flex items-center gap-1.5"><Clock className="w-4 h-4 text-secondary" />{item.duration} Days</div>
          </div>
        </div>
        {item.inclusions?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.inclusions.map((inc: string) => (
              <div key={inc} className="text-xs bg-accent/8 text-accent border border-accent/20 rounded-lg px-2.5 py-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />{inc}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
