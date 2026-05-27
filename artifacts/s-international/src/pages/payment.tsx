import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  CreditCard, Wallet, Smartphone, ShieldCheck, Lock,
  Plane, Building2, Map, ArrowRight, CheckCircle2
} from "lucide-react";
import { useProcessPayment, useGetBookingById, getGetBookingByIdQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

function fmt(n: number) { return n.toLocaleString("en-IN"); }
function currSym(c?: string) { return c === "USD" ? "$" : c === "EUR" ? "€" : c === "GBP" ? "£" : "₹"; }

const CARD_NETWORKS = ["VISA", "MC", "AMEX", "RuPay", "Maestro"];

export function Payment() {
  const [, setLocation] = useLocation();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [method, setMethod] = useState("card");
  const [cardFlipped, setCardFlipped] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("bookingId");
    if (id) setBookingId(id);
    else setLocation("/");
  }, [setLocation]);

  const { data: booking, isLoading } = useGetBookingById(bookingId || "", {
    query: { enabled: !!bookingId, queryKey: getGetBookingByIdQueryKey(bookingId || "") }
  });

  const processPaymentMutation = useProcessPayment({
    mutation: {
      onSuccess: (data) => {
        if (data.success) setLocation(`/confirmation?bookingId=${bookingId}`);
      }
    }
  });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) return;
    processPaymentMutation.mutate({
      data: { bookingId, method: method as any, cardNumber: method === "card" ? "••••••••••••4242" : undefined }
    });
  };

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

  const typeIcon = booking.type === "flight" ? <Plane className="w-4 h-4" /> :
    booking.type === "hotel" ? <Building2 className="w-4 h-4" /> : <Map className="w-4 h-4" />;

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-secondary" />
            <span className="text-secondary text-xs font-semibold uppercase tracking-widest">Secure Payment</span>
          </div>
          <h1 className="text-3xl font-serif font-bold">Complete Your Payment</h1>
          {/* Progress */}
          <div className="flex items-center gap-0 mt-5 max-w-sm">
            {["Details", "Payment", "Confirmed"].map((step, i) => (
              <div key={step} className="flex items-center gap-0">
                <div className={`flex items-center gap-2 ${i === 1 ? "text-white" : i === 0 ? "text-white/50" : "text-white/30"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i === 1 ? "bg-secondary text-secondary-foreground border-secondary" : i === 0 ? "border-white/40 bg-white/10" : "border-white/20"}`}>
                    {i === 0 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className="text-sm font-semibold hidden sm:block">{step}</span>
                </div>
                {i < 2 && <div className="w-8 h-px bg-white/20 mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl pt-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          {/* Payment methods */}
          <div className="md:col-span-3 space-y-5">

            {/* Visual credit card */}
            {method === "card" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-48 rounded-2xl overflow-hidden cursor-pointer select-none"
                style={{ perspective: 1000 }}
                onClick={() => setCardFlipped(f => !f)}
              >
                <motion.div
                  className="w-full h-full relative"
                  animate={{ rotateY: cardFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between"
                    style={{ background: "linear-gradient(135deg, hsl(236 72% 15%), hsl(236 72% 25%), hsl(24 94% 40%))", backfaceVisibility: "hidden" }}>
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-white/20 rounded-lg" />
                      <div className="text-white/80 text-sm font-bold tracking-widest">VISA</div>
                    </div>
                    <div>
                      <div className="text-white font-mono text-lg tracking-widest mb-2">
                        {cardNumber ? cardNumber.replace(/\d{4}(?=.)/g, "$& ") : "•••• •••• •••• ••••"}
                      </div>
                      <div className="flex justify-between text-white/80 text-xs">
                        <div>
                          <div className="text-white/50 text-xs mb-0.5">CARD HOLDER</div>
                          {cardName || "YOUR NAME"}
                        </div>
                        <div className="text-right">
                          <div className="text-white/50 text-xs mb-0.5">EXPIRES</div>
                          {expiry || "MM/YY"}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 rounded-2xl"
                    style={{ background: "linear-gradient(135deg, hsl(236 60% 20%), hsl(236 72% 15%))", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <div className="mt-8 bg-black/40 h-12" />
                    <div className="px-6 pt-4 flex justify-end">
                      <div className="bg-white rounded px-3 py-2 font-mono text-sm font-bold text-foreground min-w-[60px] text-center">
                        {cvv || "•••"}
                      </div>
                    </div>
                    <div className="px-6 pt-2 text-white/50 text-xs text-right">CVV</div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-6 pt-6">
                <Tabs value={method} onValueChange={setMethod}>
                  <TabsList className="grid grid-cols-3 mb-6 bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="card" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 font-semibold">
                      <CreditCard className="w-4 h-4" /> Card
                    </TabsTrigger>
                    <TabsTrigger value="upi" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 font-semibold">
                      <Smartphone className="w-4 h-4" /> UPI
                    </TabsTrigger>
                    <TabsTrigger value="wallet" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 font-semibold">
                      <Wallet className="w-4 h-4" /> Wallets
                    </TabsTrigger>
                  </TabsList>

                  <form id="payment-form" onSubmit={handlePayment}>
                    <TabsContent value="card" className="space-y-4 outline-none">
                      <div className="space-y-2">
                        <Label className="font-semibold">Cardholder Name</Label>
                        <Input value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} placeholder="AS ON CARD" className="bg-muted/40 rounded-xl h-11 font-mono tracking-wider" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-semibold">Card Number</Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                            placeholder="0000 0000 0000 0000"
                            className="pl-10 bg-muted/40 rounded-xl h-11 font-mono tracking-widest"
                            required
                          />
                        </div>
                        <div className="flex gap-1">
                          {CARD_NETWORKS.map(n => (
                            <span key={n} className="text-xs bg-muted border border-border rounded px-1.5 py-0.5 text-muted-foreground font-mono">{n}</span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="font-semibold">Expiry Date</Label>
                          <Input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM / YY" className="bg-muted/40 rounded-xl h-11 font-mono" required />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-semibold">CVV</Label>
                          <Input
                            value={cvv}
                            onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            placeholder="•••"
                            type="password"
                            maxLength={4}
                            onFocus={() => setCardFlipped(true)}
                            onBlur={() => setCardFlipped(false)}
                            className="bg-muted/40 rounded-xl h-11 font-mono"
                            required
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="upi" className="space-y-4 outline-none">
                      <div className="space-y-2">
                        <Label className="font-semibold">UPI Virtual Payment Address</Label>
                        <Input placeholder="yourname@upi" className="bg-muted/40 rounded-xl h-11" required />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {["GPay", "PhonePe", "Paytm"].map(app => (
                          <button key={app} type="button" className="h-14 rounded-xl border-2 border-border hover:border-primary text-sm font-bold transition-colors bg-muted/30 hover:bg-primary/5">
                            {app}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground bg-muted/40 rounded-xl p-3">
                        A payment request will be sent to your UPI app. Please approve it within 5 minutes.
                      </p>
                    </TabsContent>

                    <TabsContent value="wallet" className="space-y-4 outline-none">
                      <div className="grid grid-cols-2 gap-3">
                        {["PayPal", "Amazon Pay", "Mobikwik", "Ola Money"].map(w => (
                          <button key={w} type="button" className="h-16 rounded-xl border-2 border-border hover:border-primary font-bold transition-colors bg-muted/30 hover:bg-primary/5 text-sm">
                            {w}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        You'll be redirected to authenticate and complete payment.
                      </p>
                    </TabsContent>
                  </form>
                </Tabs>
              </div>

              <div className="px-6 pb-6 pt-4">
                <Button
                  type="submit"
                  form="payment-form"
                  className="w-full h-13 text-base bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-bold shadow-lg py-3"
                  disabled={processPaymentMutation.isPending}
                >
                  {processPaymentMutation.isPending ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing Payment...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Lock className="w-4 h-4" />Pay {sym}{fmt(amount)} Securely <ArrowRight className="w-4 h-4" /></span>
                  )}
                </Button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <ShieldCheck className="w-5 h-5 text-green-600" />, label: "256-bit SSL", sub: "Encryption" },
                { icon: <Lock className="w-5 h-5 text-primary" />, label: "PCI DSS", sub: "Compliant" },
                { icon: <CheckCircle2 className="w-5 h-5 text-accent" />, label: "RBI", sub: "Approved" },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="bg-card border border-border rounded-xl p-3 flex flex-col items-center text-center">
                  {icon}
                  <div className="font-bold text-xs mt-1">{label}</div>
                  <div className="text-muted-foreground text-xs">{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment summary */}
          <div className="md:col-span-2">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl sticky top-24">
              <div className="bg-primary px-6 py-5 text-primary-foreground">
                <div className="text-primary-foreground/70 text-sm mb-1">Amount to Pay</div>
                <div className="text-4xl font-bold">{sym}{fmt(amount)}</div>
              </div>

              <div className="p-6 space-y-4">
                {/* Booking reference */}
                <div className="bg-muted/40 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {typeIcon}
                    <span className="font-semibold capitalize">{booking.type} Booking</span>
                    <Badge className="ml-auto bg-accent/10 text-accent border-0 text-xs">Confirmed</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs">Booking Ref</div>
                      <div className="font-mono font-bold">{booking.id.substring(0, 8).toUpperCase()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Guest</div>
                      <div className="font-bold truncate">{booking.contactName}</div>
                    </div>
                    {booking.checkIn && (
                      <div>
                        <div className="text-muted-foreground text-xs">Date</div>
                        <div className="font-bold">{booking.checkIn}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-muted-foreground text-xs">Travelers</div>
                      <div className="font-bold">{booking.travelers}</div>
                    </div>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Fare</span>
                    <span className="font-medium">{sym}{fmt(Math.round(amount / 1.15))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST & Taxes</span>
                    <span className="font-medium">{sym}{fmt(amount - Math.round(amount / 1.15))}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{sym}{fmt(amount)}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-center pt-1">
                  By paying, you agree to our Terms & Cancellation Policy.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
