import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { CreditCard, Wallet, Smartphone, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import { useProcessPayment, useGetBookingById, getGetBookingByIdQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export function Payment() {
  const [location, setLocation] = useLocation();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [method, setMethod] = useState("card");
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("bookingId");
    if (id) {
      setBookingId(id);
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  const { data: booking, isLoading: bookingLoading } = useGetBookingById(bookingId || "", {
    query: {
      enabled: !!bookingId,
      queryKey: getGetBookingByIdQueryKey(bookingId || "")
    }
  });

  const processPaymentMutation = useProcessPayment({
    mutation: {
      onSuccess: (data) => {
        if (data.success) {
          setLocation(`/confirmation?bookingId=${bookingId}`);
        }
      }
    }
  });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) return;

    // Simulate collecting form data
    processPaymentMutation.mutate({
      data: {
        bookingId,
        method: method as any,
        cardNumber: method === 'card' ? "••••••••••••4242" : undefined,
      }
    });
  };

  if (bookingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!booking) return null;

  const currencySymbol = booking.currency === 'USD' ? '$' : booking.currency === 'EUR' ? '€' : booking.currency === 'GBP' ? '£' : '';

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold mb-4">Complete Your Payment</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-green-700 font-medium">
            <Lock className="w-4 h-4" /> Secure 256-bit SSL Encryption
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Payment Methods */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <Tabs value={method} onValueChange={setMethod} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6 h-auto p-1">
                  <TabsTrigger value="card" className="flex flex-col gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs font-medium">Credit Card</span>
                  </TabsTrigger>
                  <TabsTrigger value="upi" className="flex flex-col gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                    <Smartphone className="w-5 h-5" />
                    <span className="text-xs font-medium">UPI</span>
                  </TabsTrigger>
                  <TabsTrigger value="wallet" className="flex flex-col gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                    <Wallet className="w-5 h-5" />
                    <span className="text-xs font-medium">Digital Wallet</span>
                  </TabsTrigger>
                </TabsList>

                <form id="payment-form" onSubmit={handlePayment}>
                  <TabsContent value="card" className="space-y-4 outline-none">
                    <div className="space-y-2">
                      <Label>Cardholder Name</Label>
                      <Input placeholder="As it appears on card" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="0000 0000 0000 0000" className="pl-10 font-mono" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input placeholder="MM/YY" className="font-mono" required />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input placeholder="123" type="password" maxLength={4} className="font-mono" required />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="upi" className="space-y-4 outline-none">
                    <div className="space-y-2">
                      <Label>UPI Virtual Payment Address</Label>
                      <Input placeholder="username@bank" required />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      A payment request will be sent to your UPI app. Please approve it within 5 minutes.
                    </p>
                  </TabsContent>

                  <TabsContent value="wallet" className="space-y-4 outline-none">
                    <div className="grid grid-cols-2 gap-4">
                      <Button type="button" variant="outline" className="h-16 flex flex-col justify-center border-2 hover:border-primary">
                        PayPal
                      </Button>
                      <Button type="button" variant="outline" className="h-16 flex flex-col justify-center border-2 hover:border-primary">
                        Apple Pay
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      You will be redirected to the selected wallet provider to authorize the payment.
                    </p>
                  </TabsContent>
                </form>
              </Tabs>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="md:col-span-2">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="font-serif font-bold text-xl mb-6">Payment Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking Ref</span>
                  <span className="font-mono font-medium">{booking.id.substring(0,8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium capitalize">{booking.type} Booking</span>
                </div>
                <Separator />
                <div className="flex justify-between items-end">
                  <span className="font-bold text-foreground">Total to Pay</span>
                  <span className="text-2xl font-bold text-primary">
                    {currencySymbol}{booking.totalAmount}
                  </span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="payment-form" 
                className="w-full h-12 text-lg hover-elevate"
                disabled={processPaymentMutation.isPending}
              >
                {processPaymentMutation.isPending ? "Processing..." : `Pay ${currencySymbol}${booking.totalAmount}`}
              </Button>
              
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  Guaranteed safe & secure checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
