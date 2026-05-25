import { useEffect, useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User, CreditCard, CheckCircle, ChevronRight, Shield,
  MapPin, Clock, Star, Lock, ArrowLeft
} from "lucide-react";
import {
  useGetSession, getGetSessionQueryKey, useCreateBooking
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { getPackageBySlug } from "@/data/packages";
import { useBookingStore } from "@/lib/booking-store";
import { cn } from "@/lib/utils";

const travelerSchema = z.object({
  contactName: z.string().min(2, "Name must be at least 2 characters"),
  contactEmail: z.string().email("Valid email required"),
  contactPhone: z.string().min(8, "Valid phone number required"),
  notes: z.string().optional(),
});

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Enter a 16-digit card number"),
  cardName: z.string().min(2, "Enter name on card"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Use MM/YY format"),
  cvv: z.string().regex(/^\d{3,4}$/, "Enter 3 or 4 digit CVV"),
});

type TravelerForm = z.infer<typeof travelerSchema>;
type PaymentForm = z.infer<typeof paymentSchema>;

const STEPS = [
  { id: 1, title: "Traveller Info", icon: User },
  { id: 2, title: "Payment", icon: CreditCard },
  { id: 3, title: "Confirmed", icon: CheckCircle },
];

export function PackageBooking() {
  const [, params] = useRoute("/packages/book/:slug");
  const [, setLocation] = useLocation();
  const slug = params?.slug ?? "";
  const pkg = getPackageBySlug(slug);

  const { searchParams, clearBookingItem } = useBookingStore();
  const travelers = searchParams?.travelers || 2;

  const { data: session } = useGetSession({
    query: { queryKey: getGetSessionQueryKey() }
  });

  const [step, setStep] = useState(1);
  const [travelerData, setTravelerData] = useState<TravelerForm | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  const travelerForm = useForm<TravelerForm>({
    resolver: zodResolver(travelerSchema),
    defaultValues: {
      contactName: session?.user?.name || "",
      contactEmail: session?.user?.email || "",
      contactPhone: session?.user?.phone || "",
      notes: "",
    },
  });

  const paymentForm = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { cardNumber: "", cardName: "", expiry: "", cvv: "" },
  });

  useEffect(() => {
    if (session?.user) {
      travelerForm.reset({
        contactName: session.user.name,
        contactEmail: session.user.email,
        contactPhone: session.user.phone || "",
        notes: "",
      });
    }
  }, [session]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const createBooking = useCreateBooking({
    mutation: {
      onSuccess: (data) => {
        setBookingId(String(data.id));
        setConfirmationCode("SI-" + String(data.id).padStart(6, "0").toUpperCase());
        setStep(3);
        clearBookingItem();
      },
    },
  });

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-serif font-bold">Package not found</h2>
        <Link href="/packages"><Button variant="outline">Browse Packages</Button></Link>
      </div>
    );
  }

  const tax = pkg.price * travelers * 0.15;
  const total = pkg.price * travelers + tax;

  const onTravelerSubmit = (data: TravelerForm) => {
    if (!session?.authenticated) {
      setLocation("/login");
      return;
    }
    setTravelerData(data);
    setStep(2);
  };

  const onPaymentSubmit = (_data: PaymentForm) => {
    if (!travelerData) return;
    createBooking.mutate({
      data: {
        type: "holiday",
        itemId: pkg.id,
        travelers,
        contactName: travelerData.contactName,
        contactEmail: travelerData.contactEmail,
        contactPhone: travelerData.contactPhone,
        totalAmount: total,
        currency: pkg.currency,
        notes: travelerData.notes,
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-24">
      <div className="container mx-auto px-4 max-w-6xl py-10">
        {/* Back link */}
        {step < 3 && (
          <Link
            href={`/packages/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to package
          </Link>
        )}

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all",
                    step > s.id
                      ? "bg-green-500 border-green-500 text-white"
                      : step === s.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-border text-muted-foreground"
                  )}
                >
                  {step > s.id ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
                </div>
                <span className={cn(
                  "text-xs font-medium mt-1.5 hidden sm:block",
                  step === s.id ? "text-primary" : step > s.id ? "text-green-500" : "text-muted-foreground"
                )}>
                  {s.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  "w-16 sm:w-28 h-0.5 mx-2 transition-all",
                  step > s.id ? "bg-green-500" : "bg-border"
                )} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Traveller Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                    <h2 className="text-2xl font-serif font-bold mb-2">Traveller Information</h2>
                    <p className="text-muted-foreground text-sm mb-8">Please enter the lead traveller's details exactly as on your passport/ID.</p>

                    {!session?.authenticated && (
                      <div className="bg-primary/8 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-4 mb-8">
                        <div>
                          <p className="font-medium text-sm text-foreground">Sign in for faster checkout</p>
                          <p className="text-xs text-muted-foreground">Your details will be pre-filled automatically.</p>
                        </div>
                        <Link href="/login">
                          <Button variant="outline" size="sm">Sign In</Button>
                        </Link>
                      </div>
                    )}

                    <Form {...travelerForm}>
                      <form onSubmit={travelerForm.handleSubmit(onTravelerSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField control={travelerForm.control} name="contactName" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl><Input placeholder="As on passport or ID" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={travelerForm.control} name="contactEmail" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl><Input type="email" placeholder="For booking confirmation" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={travelerForm.control} name="contactPhone" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl><Input placeholder="+91 XXXXX XXXXX" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={travelerForm.control} name="notes" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Special Requests <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                              <FormControl><Input placeholder="Dietary needs, accessibility..." {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                        <div className="flex justify-end pt-2">
                          <Button type="submit" className="h-12 px-8 gap-2 hover-elevate">
                            Continue to Payment
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                    <h2 className="text-2xl font-serif font-bold mb-2">Secure Payment</h2>
                    <p className="text-muted-foreground text-sm mb-8">All transactions are protected by 256-bit SSL encryption.</p>

                    {/* Demo notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
                      <strong>Demo Mode:</strong> This is a simulated checkout. Enter any valid-looking card details to proceed.
                    </div>

                    <Form {...paymentForm}>
                      <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                        <FormField control={paymentForm.control} name="cardNumber" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="1234 5678 9012 3456"
                                maxLength={16}
                                {...field}
                                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={paymentForm.control} name="cardName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name on Card</FormLabel>
                            <FormControl><Input placeholder="JOHN DOE" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-6">
                          <FormField control={paymentForm.control} name="expiry" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  {...field}
                                  onChange={(e) => {
                                    const v = e.target.value.replace(/[^0-9/]/g, "");
                                    if (v.length === 2 && !v.includes("/")) {
                                      field.onChange(v + "/");
                                    } else {
                                      field.onChange(v);
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={paymentForm.control} name="cvv" render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="•••"
                                  type="password"
                                  maxLength={4}
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>

                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-4 rounded-xl border border-green-200">
                          <Lock className="w-4 h-4 shrink-0" />
                          Your card data is encrypted and never stored on our servers.
                        </div>

                        <div className="flex justify-between pt-2">
                          <Button type="button" variant="outline" onClick={() => setStep(1)} className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                          </Button>
                          <Button
                            type="submit"
                            className="h-12 px-8 gap-2 hover-elevate"
                            disabled={createBooking.isPending}
                          >
                            {createBooking.isPending ? "Processing..." : `Pay ₹${total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
                            {!createBooking.isPending && <Lock className="w-4 h-4" />}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-card border border-border rounded-2xl p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </motion.div>

                    <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Booking Confirmed!</h2>
                    <p className="text-muted-foreground mb-6">
                      Your adventure is officially booked. A confirmation has been sent to <strong>{travelerData?.contactEmail}</strong>.
                    </p>

                    <div className="bg-primary/5 border border-primary/15 rounded-xl p-6 mb-8 text-left">
                      <div className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-widest">Booking Reference</div>
                      <div className="text-3xl font-bold text-primary tracking-widest font-mono">{confirmationCode}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left mb-8">
                      {[
                        { label: "Package", value: pkg.title },
                        { label: "Destination", value: `${pkg.destination}, ${pkg.country}` },
                        { label: "Duration", value: `${pkg.duration} Days` },
                        { label: "Travellers", value: `${travelers} Person(s)` },
                        { label: "Total Paid", value: `₹${total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` },
                        { label: "Status", value: "Confirmed" },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-muted/30 rounded-xl p-4">
                          <div className="text-xs text-muted-foreground mb-1">{label}</div>
                          <div className="font-semibold text-sm text-foreground">{value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/bookings">
                        <Button variant="outline" className="w-full sm:w-auto">View My Bookings</Button>
                      </Link>
                      <Link href="/packages">
                        <Button className="w-full sm:w-auto hover-elevate">Explore More Packages</Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          {step < 3 && (
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl overflow-hidden sticky top-24 shadow-sm">
                <div className="relative h-36 overflow-hidden">
                  <img src={pkg.images[0]} alt={pkg.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="text-xs font-medium text-white/70 mb-0.5">{pkg.destination}, {pkg.country}</div>
                    <h3 className="font-serif font-bold text-base leading-tight">{pkg.title}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap gap-3 mb-5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />{pkg.duration} Days
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{pkg.rating} Rating
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />{pkg.country}
                    </div>
                  </div>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">₹{pkg.price.toLocaleString("en-IN")} × {travelers} persons</span>
                      <span>₹{(pkg.price * travelers).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes (15%)</span>
                      <span>₹{tax.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>

                  <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <Shield className="w-3.5 h-3.5 text-green-500" />
                    Secure booking guaranteed
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
