import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Train, Lock, ArrowRight, User, Calendar,
  CreditCard, ShieldCheck, CheckCircle2, Users,
  MapPin, Armchair, BookUser, Plus, Trash2,
  CheckCheck, ChevronDown, ChevronUp, Pencil, Star,
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
import { usePassengerStore, type SavedPassenger } from "@/lib/passenger-store";
import { CLASS_LABELS } from "@/lib/trainApi";
import { cn } from "@/lib/utils";

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
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Select gender" }),
});

const trainCheckoutSchema = z.object({
  passengers: z.array(passengerSchema).min(1),
  mobile: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Enter a valid email address"),
});

type TrainCheckoutForm = z.infer<typeof trainCheckoutSchema>;

// ─── Avatar helper ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500",
  "bg-rose-500", "bg-indigo-500", "bg-teal-500", "bg-orange-500",
];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}
function initials(name: string) {
  return name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

// ─── Saved Passenger Chip ──────────────────────────────────────────────────────
function PassengerChip({
  passenger, onClick, selected, compact = false,
}: {
  passenger: SavedPassenger;
  onClick: () => void;
  selected?: boolean;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-xl border transition-all",
        compact ? "px-2.5 py-1.5" : "px-3 py-2",
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border hover:border-primary/50 hover:bg-muted/60 bg-white",
      )}
    >
      <div className={cn(
        "rounded-full flex items-center justify-center text-white font-bold shrink-0",
        compact ? "w-6 h-6 text-[9px]" : "w-7 h-7 text-[10px]",
        avatarColor(passenger.name),
      )}>
        {initials(passenger.name)}
      </div>
      <div className="text-left min-w-0">
        <div className={cn("font-semibold truncate", compact ? "text-xs" : "text-sm")}>
          {passenger.name.split(" ")[0]}
        </div>
        <div className={cn("text-muted-foreground", compact ? "text-[10px]" : "text-xs")}>
          {passenger.age}y · {passenger.gender[0]}
        </div>
      </div>
      {selected && <CheckCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
    </button>
  );
}

// ─── Manage Travellers Panel ───────────────────────────────────────────────────
function ManageTravellersPanel({ onClose }: { onClose: () => void }) {
  const { passengers, removePassenger } = usePassengerStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-card border border-primary/20 rounded-2xl overflow-hidden shadow-xl"
    >
      <div className="bg-primary/5 px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <BookUser className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-bold text-sm">Saved Travellers</div>
            <div className="text-xs text-muted-foreground">
              {passengers.length} {passengers.length === 1 ? "person" : "people"} saved
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-xs rounded-xl h-8">
          Close
        </Button>
      </div>

      <div className="p-4">
        {passengers.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <BookUser className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No saved travellers yet. Fill a passenger form and click "Save to list".
          </div>
        ) : (
          <div className="space-y-2">
            {passengers.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-3"
              >
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0",
                  avatarColor(p.name),
                )}>
                  {initials(p.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Age {p.age} · {p.gender}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removePassenger(p.id)}
                  className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function TrainCheckout() {
  const [, setLocation] = useLocation();
  const { type, item, searchParams } = useBookingStore();
  const { passengers: savedList, addPassenger } = usePassengerStore();

  // Which passenger slot is "active" for quick-fill (highlighted)
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  // Which slots have been filled from saved list (chip index)
  const [filledFrom, setFilledFrom] = useState<Record<number, string>>({}); // slotIdx → savedId
  // Track which slots the user has saved during this session
  const [savedInSession, setSavedInSession] = useState<Set<number>>(new Set());
  // Show manage panel
  const [showManage, setShowManage] = useState(false);

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
      if (session.user.name) form.setValue("passengers.0.name", session.user.name);
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
  const taxes = Math.round(baseFare * 0.05);
  const totalFare = baseFare + taxes;
  const classLabel = CLASS_LABELS[train.classCode] ?? train.classCode ?? "";

  // Auto-fill a slot from a saved passenger
  function fillSlot(slotIdx: number, saved: SavedPassenger) {
    form.setValue(`passengers.${slotIdx}.name`, saved.name, { shouldValidate: true });
    form.setValue(`passengers.${slotIdx}.age`, saved.age, { shouldValidate: true });
    form.setValue(`passengers.${slotIdx}.gender`, saved.gender, { shouldValidate: true });
    setFilledFrom((prev) => ({ ...prev, [slotIdx]: saved.id }));
    setActiveSlot(null);
  }

  // Save current slot to the list
  function saveSlot(slotIdx: number) {
    const vals = form.getValues(`passengers.${slotIdx}`);
    if (!vals.name || !vals.age || !vals.gender) return;
    // Don't save duplicates (same name+age)
    const alreadyExists = savedList.some(
      (p) => p.name.toLowerCase() === vals.name.toLowerCase() && p.age === vals.age,
    );
    if (!alreadyExists) {
      addPassenger({ name: vals.name, age: vals.age, gender: vals.gender as any });
    }
    setSavedInSession((prev) => new Set(prev).add(slotIdx));
  }

  const onSubmit = (data: TrainCheckoutForm) => {
    if (!session?.authenticated) { setLocation(`${BASE_URL}/login`); return; }
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
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-4 h-4 text-secondary" />
            <span className="text-secondary text-xs font-semibold uppercase tracking-widest">Secure Checkout</span>
          </div>
          <h1 className="text-3xl font-serif font-bold">Complete Your Booking</h1>
          <div className="flex items-center gap-0 mt-6 max-w-sm">
            {["Passenger Details", "Payment", "Confirmed"].map((step, i) => (
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

          {/* ── Left column ──────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <TrainSummaryCard train={train} classLabel={classLabel} searchParams={searchParams} travelers={travelers} />

            {/* Sign-in prompt */}
            {!session?.authenticated && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold">Sign in for faster checkout</div>
                    <div className="text-sm text-muted-foreground">Access your saved travellers and earn rewards.</div>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setLocation(`${BASE_URL}/login`)} className="rounded-xl border-primary/30 text-primary hover:bg-primary hover:text-white shrink-0">
                  Sign In
                </Button>
              </div>
            )}

            {/* ── Saved Travellers banner ──────────────────────────── */}
            <AnimatePresence mode="wait">
              {showManage ? (
                <ManageTravellersPanel key="manage" onClose={() => setShowManage(false)} />
              ) : (
                <motion.div
                  key="banner"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <div className="px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <BookUser className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Saved Travellers</div>
                        <div className="text-xs text-muted-foreground">
                          {savedList.length === 0
                            ? "Save passengers for faster booking next time"
                            : `${savedList.length} saved · click to auto-fill any passenger slot`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {savedList.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowManage(true)}
                          className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
                        >
                          <Pencil className="w-3 h-3" /> Manage
                        </button>
                      )}
                    </div>
                  </div>

                  {savedList.length > 0 && (
                    <div className="px-5 pb-4 flex flex-wrap gap-2">
                      {savedList.map((p) => (
                        <div key={p.id} className="relative group">
                          <PassengerChip
                            passenger={p}
                            onClick={() => {
                              // Auto-fill the first empty slot, or the active slot
                              const emptySlot = fields.findIndex((_, i) => {
                                const v = form.getValues(`passengers.${i}`);
                                return !v.name;
                              });
                              const targetSlot = activeSlot ?? emptySlot;
                              if (targetSlot >= 0 && targetSlot < travelers) {
                                fillSlot(targetSlot, p);
                              }
                            }}
                            selected={Object.values(filledFrom).includes(p.id)}
                          />
                          {/* Slot selector tooltip on hover when multiple slots */}
                          {travelers > 1 && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-popover border border-border rounded-xl shadow-xl z-20 px-2 py-1.5 hidden group-hover:flex flex-col gap-1 min-w-[110px]">
                              <div className="text-[10px] text-muted-foreground font-medium text-center mb-0.5">Fill slot</div>
                              {fields.map((_, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); fillSlot(i, p); }}
                                  className="text-xs text-left hover:bg-muted/60 rounded-lg px-2 py-1 font-medium"
                                >
                                  Passenger {i + 1}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setShowManage(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-muted/40 transition-all text-xs text-muted-foreground"
                      >
                        <Plus className="w-3.5 h-3.5" /> View all
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Per-passenger forms ────────────────────────────────── */}
            <Form {...form}>
              <form id="train-checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {fields.map((field, idx) => {
                  const filledSavedId = filledFrom[idx];
                  const filledSaved = filledSavedId ? savedList.find((p) => p.id === filledSavedId) : null;
                  const isSavedSession = savedInSession.has(idx);
                  const currentVals = form.watch(`passengers.${idx}`);
                  const isFilledOut = currentVals.name?.length >= 2 && currentVals.age && currentVals.gender;

                  return (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className={cn(
                        "bg-card border rounded-2xl overflow-hidden transition-all",
                        activeSlot === idx ? "border-primary/40 shadow-md shadow-primary/10" : "border-border",
                      )}
                      onClick={() => setActiveSlot(idx)}
                    >
                      {/* Card header */}
                      <div className="bg-muted/40 px-6 py-4 border-b border-border">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                              filledSaved
                                ? cn(avatarColor(filledSaved.name), "text-white text-[10px]")
                                : "bg-primary text-primary-foreground",
                            )}>
                              {filledSaved ? initials(filledSaved.name) : idx + 1}
                            </div>
                            <div>
                              <h2 className="text-base font-serif font-bold leading-tight">
                                Passenger {idx + 1}
                                {idx === 0 && <span className="ml-2 text-xs font-normal text-muted-foreground">(Lead)</span>}
                              </h2>
                              {filledSaved && (
                                <div className="text-xs text-primary font-medium flex items-center gap-1 mt-0.5">
                                  <CheckCheck className="w-3 h-3" /> Auto-filled from saved travellers
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick-fill chips in header (compact) */}
                          {savedList.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] text-muted-foreground font-medium">Quick fill:</span>
                              {savedList.slice(0, 4).map((p) => (
                                <PassengerChip
                                  key={p.id}
                                  passenger={p}
                                  onClick={() => fillSlot(idx, p)}
                                  selected={filledFrom[idx] === p.id}
                                  compact
                                />
                              ))}
                              {savedList.length > 4 && (
                                <span className="text-[10px] text-muted-foreground">+{savedList.length - 4} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        {/* Name + Age */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`passengers.${idx}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-semibold">Full Name <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                  <Input placeholder="As on Aadhaar / ID" {...field} className="bg-muted/40 rounded-xl h-11" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`passengers.${idx}.age`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-semibold">Age <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                  <Input placeholder="Age" maxLength={3} {...field} className="bg-muted/40 rounded-xl h-11" />
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
                              <FormLabel className="font-semibold">Gender <span className="text-destructive">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
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

                        {/* Save to list footer */}
                        <AnimatePresence>
                          {isFilledOut && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-3 border-t border-border flex items-center justify-between gap-3"
                            >
                              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Star className="w-3 h-3 text-amber-500" />
                                Save for future bookings?
                              </div>
                              {isSavedSession ? (
                                <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved to travellers list
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => saveSlot(idx)}
                                  className="text-xs font-semibold text-primary flex items-center gap-1.5 hover:bg-primary/10 rounded-lg px-2 py-1.5 transition-colors"
                                >
                                  <Plus className="w-3 h-3" /> Save to list
                                </button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}

                {/* ── Contact Details ───────────────────────────────── */}
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
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Mobile Number <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-border bg-muted text-muted-foreground text-sm font-medium">+91</span>
                                <Input
                                  placeholder="XXXXX XXXXX"
                                  maxLength={10}
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                  className="bg-muted/40 rounded-l-none rounded-r-xl h-11"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Email Address <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@email.com" {...field} className="bg-muted/40 rounded-xl h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Booking confirmation & updates will be sent to this contact.</p>
                  </div>
                </motion.div>

                {/* ── Seat / Class Review ────────────────────────────── */}
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
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Selected Class</div>
                        <div className="text-xl font-bold text-primary">
                          {train.classCode}
                          <span className="text-base font-normal text-muted-foreground ml-2">— {classLabel}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">₹{fmt(farePerPerson)} per passenger · {travelers} {travelers === 1 ? "passenger" : "passengers"}</div>
                      </div>
                      <Button type="button" variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => window.history.back()}>
                        Change Class
                      </Button>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
                      {[
                        { label: "Departure", value: train.departureTime },
                        { label: "Duration",  value: train.duration },
                        { label: "Arrival",   value: train.arrivalTime },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-muted/40 rounded-xl p-3">
                          <div className="text-muted-foreground mb-1">{label}</div>
                          <div className="font-bold text-sm">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* ── Payment preview ───────────────────────────────── */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden opacity-60">
                  <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">2</div>
                    <h2 className="text-lg font-serif font-bold text-muted-foreground">Payment</h2>
                  </div>
                  <div className="p-6 flex items-center gap-3 text-muted-foreground">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-sm">Pay securely via Credit/Debit Card, UPI, or Net Banking on the next step.</span>
                  </div>
                </div>
              </form>
            </Form>
          </div>

          {/* ── Right: Fare Summary ──────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-primary px-6 py-5 text-primary-foreground">
                <div className="text-primary-foreground/70 text-sm mb-1">Total Amount</div>
                <div className="text-4xl font-bold">₹{fmt(totalFare)}</div>
                <div className="text-primary-foreground/60 text-xs mt-1">incl. all taxes & fees</div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base fare × {travelers}</span>
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
                  disabled={createBookingMutation.isPending || !session?.authenticated}
                >
                  {createBookingMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">Proceed to Payment <ArrowRight className="w-4 h-4" /></span>
                  )}
                </Button>

                {!session?.authenticated && (
                  <p className="text-xs text-center text-destructive font-medium">Please sign in to complete your booking.</p>
                )}

                {/* Saved travellers summary in sidebar */}
                {savedList.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <BookUser className="w-3.5 h-3.5" /> Saved Travellers
                      </span>
                      <button type="button" onClick={() => setShowManage(true)} className="text-[11px] text-primary font-semibold hover:underline">
                        Manage
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {savedList.slice(0, 4).map((p, i) => (
                        <div key={p.id} className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white", avatarColor(p.name))} title={p.name}>
                          {initials(p.name)}
                        </div>
                      ))}
                      {savedList.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                          +{savedList.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-border space-y-2">
                  {[
                    { icon: <ShieldCheck className="w-4 h-4 text-green-600" />, label: "SSL encrypted & secure payment" },
                    { icon: <CheckCircle2 className="w-4 h-4 text-accent" />,   label: "Free cancellation on select classes" },
                    { icon: <Lock className="w-4 h-4 text-primary" />,          label: "PCI-DSS compliant checkout" },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5 text-xs text-muted-foreground">{icon} {label}</div>
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

// ─── Train Summary Card ────────────────────────────────────────────────────────
function TrainSummaryCard({ train, classLabel, searchParams, travelers }: {
  train: any; classLabel: string; searchParams: any; travelers: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary/8 to-secondary/5 px-6 py-4 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Train className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Train Booking</div>
          <div className="font-serif font-bold">{train.from} → {train.to}</div>
        </div>
        <Badge className="ml-auto bg-accent/10 text-accent border-0 text-xs font-bold">{classLabel || train.classCode}</Badge>
      </div>
      <div className="p-6">
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
              <div className="font-semibold">{travelers} {travelers === 1 ? "Passenger" : "Passengers"}</div>
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
