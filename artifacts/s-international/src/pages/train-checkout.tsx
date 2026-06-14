import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Train, Lock, ArrowRight, User, Calendar, Clock,
  CreditCard, ShieldCheck, CheckCircle2, Users, ChevronDown,
  MapPin, Armchair,
} from "lucide-react";
import {
  useGetSession, getGetSessionQueryKey, useCreateBooking,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useBookingStore } from "@/lib/booking-store";
import { CLASS_LABELS } from "@/lib/trainApi";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

function fmt(n: number) { return n.toLocaleString("en-IN"); }

// ─── Schema ────────────────────────────────────────────────────────────────────
const passengerSchema = z.object({
  name: z.string().min(2, "Enter full name (min 2 characters)"),
  age: z
    .string()
    .min(1, "Age required")
    .regex(/^\d+$/, "Enter numeric age")
    .refine((v) => +v >= 1 && +v <= 120, "Age must be between 1 and 120"),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Select gender",
  }),
});

const trainCheckoutSchema = z.object({
  passengers: z.array(passengerSchema).min(1),
  mobile: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Enter a valid email address"),
});

type TrainCheckoutForm = z.infer<typeof trainCheckoutSchema>;

// ─── Component ─────────────────────────────────────────────────────────────────
export function TrainCheckout() {
  const [, setLocation] = useLocation();
  const { type, item, searchParams } = useBookingStore();

  useEffect(() => {
    if (!item || type !== ("train" as any)) setLocation("/trains");
  }, [item, type, setLocation]);

  const { data: session } = useGetSession({
    query: { queryKey: getGetSessionQueryKey() },
  });

  const travelers = Math.max(1, parseInt(String(searchParams.travelers ?? 1), 10));

  const form = useForm<TrainCheckoutForm>({
    resolver: zodResolver(trainCheckoutSchema),
    defaultValues: {
      passengers: Array.from({ length: travelers }, () => ({
        name: "",
        age: "",
        gender: undefined as any,
      })),
      mobile: session?.user?.phone ?? "",
      email: session?.user?.email ?? "",
    },
  });

  const { fields } = useFieldArray({ control: form.control, name: "passengers" });

  useEffect(() => {
    if (session?.user) {
      form.setValue("email", session.user.email ?? "");
      form.setValue("mobile", session.user.phone ?? "");
      if (session.user.name) {
        form.setValue("passengers.0.name", session.user.name);
      }
    }
  }, [session, form]);

  const createBookingMutation = useCreateBooking({
    mutation: {
      onSuccess: (data) => {
        setLocation(`${BASE_URL}/payment?bookingId=${data.id}`);
      },
    },
  });

  if (!item || type !== ("train" as any)) return null;

  const train = item as any;
  const farePerPerson = train.price ?? 0;
  const baseFare = farePerPerson * travelers;
  const taxes = Math.round(baseFare * 0.05); // 5% GST on rail
  const totalFare = baseFare + taxes;

  const classLabel = CLASS_LABELS[train.classCode] ?? train.classCode ?? "";

  const onSubmit = (data: TrainCheckoutForm) => {
    if (!session?.authenticated) {
      setLocation(`${BASE_URL}/login`);
      return;
    }
    createBookingMutation.mutate({
      data: {
        type: "train" as any,
        itemId: train.id,
        travelers,
        checkIn: searchParams.date || "",
        contactName: data.passengers[0].name,
        contactEmail: data.email,
        contactPhone: data.mobile,
        totalAmount: totalFare,
        currency: "INR",
        notes: data.passengers
          .map((p, i) => `Pax ${i + 1}: ${p.name}, Age ${p.age}, ${p.gender}`)
          .join(" | "),
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-4 h-4 text-secondary" />
            <span className="text-secondary text-xs font-semibold uppercase tracking-widest">
              Secure Checkout
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold">Complete Your Booking</h1>

          {/* Progress steps */}
          <div className="flex items-center gap-0 mt-6 max-w-sm">
            {["Passenger Details", "Payment", "Confirmed"].map((step, i) => (
              <div key={step} className="flex items-center gap-0">
                <div
                  className={`flex items-center gap-2 ${i === 0 ? "text-white" : "text-white/40"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                      i === 0
                        ? "bg-secondary text-secondary-foreground border-secondary"
                        : "border-white/30"
                    }`}
                  >
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
          {/* ── Left column ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Train Summary */}
            <TrainSummaryCard train={train} classLabel={classLabel} searchParams={searchParams} travelers={travelers} />

            {/* Sign-in prompt */}
            {!session?.authenticated && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Sign in for faster checkout</div>
                    <div className="text-sm text-muted-foreground">
                      Access your saved details and earn rewards.
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setLocation(`${BASE_URL}/login`)}
                  className="rounded-xl border-primary/30 text-primary hover:bg-primary hover:text-white shrink-0"
                >
                  Sign In
                </Button>
              </div>
            )}

            <Form {...form}>
              <form id="train-checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* ── Per-passenger forms ─────────────────────────── */}
                {fields.map((field, idx) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden"
                  >
                    <div className="bg-muted/40 px-6 py-4 border-b border-border flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <h2 className="text-lg font-serif font-bold">
                        Passenger {idx + 1}
                        {idx === 0 && (
                          <span className="ml-2 text-xs font-normal text-muted-foreground">
                            (Lead passenger)
                          </span>
                        )}
                      </h2>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <FormField
                          control={form.control}
                          name={`passengers.${idx}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">
                                Full Name <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="As on Aadhaar / ID"
                                  {...field}
                                  className="bg-muted/40 rounded-xl h-11"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Age */}
                        <FormField
                          control={form.control}
                          name={`passengers.${idx}.age`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">
                                Age <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Age"
                                  maxLength={3}
                                  {...field}
                                  className="bg-muted/40 rounded-xl h-11"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {/* Gender */}
                      <FormField
                        control={form.control}
                        name={`passengers.${idx}.gender`}
                        render={({ field }) => (
                          <FormItem className="max-w-xs">
                            <FormLabel className="font-semibold">
                              Gender <span className="text-destructive">*</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-muted/40 rounded-xl h-11">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                ))}

                {/* ── Contact Details ─────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: fields.length * 0.06 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <div className="bg-muted/40 px-6 py-4 border-b border-border flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-serif font-bold">Contact Details</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Mobile */}
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Mobile Number <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-border bg-muted text-muted-foreground text-sm font-medium">
                                  +91
                                </span>
                                <Input
                                  placeholder="XXXXX XXXXX"
                                  maxLength={10}
                                  {...field}
                                  onChange={(e) => {
                                    const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                                    field.onChange(v);
                                  }}
                                  className="bg-muted/40 rounded-l-none rounded-r-xl h-11"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Email Address <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="you@email.com"
                                {...field}
                                className="bg-muted/40 rounded-xl h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Booking confirmation & updates will be sent to this contact.
                    </p>
                  </div>
                </motion.div>

                {/* ── Seat / Class Selection Review ────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (fields.length + 1) * 0.06 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <div className="bg-muted/40 px-6 py-4 border-b border-border flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                      <Armchair className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-serif font-bold">Seat / Class Selection</h2>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">
                          Selected Class
                        </div>
                        <div className="text-xl font-bold text-primary">
                          {train.classCode}
                          <span className="text-base font-normal text-muted-foreground ml-2">
                            — {classLabel}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          ₹{fmt(farePerPerson)} per passenger · {travelers}{" "}
                          {travelers === 1 ? "passenger" : "passengers"}
                        </div>
                      </div>
                      <div className="text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs"
                          onClick={() => window.history.back()}
                        >
                          Change Class
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
                      {[
                        { label: "Departure", value: train.departureTime },
                        { label: "Duration", value: train.duration },
                        { label: "Arrival", value: train.arrivalTime },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-muted/40 rounded-xl p-3">
                          <div className="text-muted-foreground mb-1">{label}</div>
                          <div className="font-bold text-sm">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* ── Payment preview ─────────────────────────────── */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden opacity-60">
                  <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h2 className="text-lg font-serif font-bold text-muted-foreground">Payment</h2>
                  </div>
                  <div className="p-6 flex items-center gap-3 text-muted-foreground">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-sm">
                      Pay securely via Credit/Debit Card, UPI, or Net Banking on the next step.
                    </span>
                  </div>
                </div>
              </form>
            </Form>
          </div>

          {/* ── Right: Fare Summary ─────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-primary px-6 py-5 text-primary-foreground">
                <div className="text-primary-foreground/70 text-sm mb-1">Total Amount</div>
                <div className="text-4xl font-bold">₹{fmt(totalFare)}</div>
                <div className="text-primary-foreground/60 text-xs mt-1">incl. all taxes & fees</div>
              </div>

              <div className="p-6 space-y-4">
                {/* Fare breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Base fare × {travelers}
                    </span>
                    <span className="font-medium">₹{fmt(baseFare)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Tax (5%)</span>
                    <span className="font-medium">₹{fmt(taxes)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">₹{fmt(totalFare)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  form="train-checkout-form"
                  className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-bold text-base shadow-lg"
                  disabled={
                    createBookingMutation.isPending || !session?.authenticated
                  }
                >
                  {createBookingMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Proceed to Payment <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                {!session?.authenticated && (
                  <p className="text-xs text-center text-destructive font-medium">
                    Please sign in to complete your booking.
                  </p>
                )}

                {/* Trust badges */}
                <div className="pt-4 border-t border-border space-y-2">
                  {[
                    { icon: <ShieldCheck className="w-4 h-4 text-green-600" />, label: "SSL encrypted & secure payment" },
                    { icon: <CheckCircle2 className="w-4 h-4 text-accent" />, label: "Free cancellation on select classes" },
                    { icon: <Lock className="w-4 h-4 text-primary" />, label: "PCI-DSS compliant checkout" },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      {icon} {label}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  By proceeding, you agree to our{" "}
                  <a href="#" className="underline">Terms</a> &{" "}
                  <a href="#" className="underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Train Summary Card ────────────────────────────────────────────────────────
function TrainSummaryCard({
  train, classLabel, searchParams, travelers,
}: {
  train: any; classLabel: string; searchParams: any; travelers: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-primary/8 to-secondary/5 px-6 py-4 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Train className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Train Booking
          </div>
          <div className="font-serif font-bold">
            {train.from} → {train.to}
          </div>
        </div>
        <Badge className="ml-auto bg-accent/10 text-accent border-0 text-xs font-bold">
          {classLabel || train.classCode}
        </Badge>
      </div>

      <div className="p-6">
        {/* Train name & number */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center font-black text-primary text-xs text-center leading-tight">
            {train.trainNumber ?? "—"}
          </div>
          <div>
            <div className="font-bold">{train.trainName}</div>
            <div className="text-sm text-muted-foreground">#{train.trainNumber} · {classLabel}</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs text-muted-foreground">Passengers</div>
            <div className="font-bold text-sm">{travelers}</div>
          </div>
        </div>

        {/* Route timeline */}
        <div className="flex items-center justify-between bg-muted/30 rounded-2xl p-5 mb-5">
          <div>
            <div className="text-4xl font-bold">{train.departureTime}</div>
            <div className="text-primary font-bold text-sm mt-0.5">{train.fromCode}</div>
            <div className="text-muted-foreground text-xs">{train.from}</div>
          </div>
          <div className="flex-1 px-4 flex flex-col items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium">{train.duration}</span>
            <div className="w-full flex items-center gap-1">
              <div className="w-2 h-2 rounded-full border-2 border-primary bg-white" />
              <div className="flex-1 h-px bg-gradient-to-r from-primary to-secondary" />
              <Train className="w-4 h-4 text-secondary" />
              <div className="flex-1 h-px bg-gradient-to-r from-secondary to-primary" />
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <span className="text-xs text-muted-foreground capitalize">{train.trainType ?? "Train"}</span>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{train.arrivalTime}</div>
            <div className="text-primary font-bold text-sm mt-0.5">{train.toCode}</div>
            <div className="text-muted-foreground text-xs">{train.to}</div>
          </div>
        </div>

        {/* Date + travelers */}
        <div className="flex items-center gap-6">
          {searchParams.date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <div className="text-muted-foreground text-xs">Journey Date</div>
                <div className="font-semibold">{searchParams.date}</div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-accent" />
            <div>
              <div className="text-muted-foreground text-xs">Passengers</div>
              <div className="font-semibold">
                {travelers} {travelers === 1 ? "Passenger" : "Passengers"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-secondary" />
            <div>
              <div className="text-muted-foreground text-xs">Class</div>
              <div className="font-semibold">{train.classCode}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
