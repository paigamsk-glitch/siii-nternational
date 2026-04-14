import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plane, Building2, Map, ShieldCheck, User } from "lucide-react";
import { 
  useGetSession, getGetSessionQueryKey,
  useCreateBooking
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useBookingStore } from "@/lib/booking-store";

const checkoutSchema = z.object({
  contactName: z.string().min(2, "Name must be at least 2 characters"),
  contactEmail: z.string().email("Valid email required"),
  contactPhone: z.string().min(8, "Valid phone required"),
  notes: z.string().optional(),
});

export function Checkout() {
  const [, setLocation] = useLocation();
  const { type, item, searchParams } = useBookingStore();
  
  // Auth check
  const { data: session, isLoading: sessionLoading } = useGetSession({
    query: { queryKey: getGetSessionQueryKey() }
  });

  // Redirect if no item to book
  useEffect(() => {
    if (!item || !type) {
      setLocation("/");
    }
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

  // Update form if session loads later
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

  // Calculate totals based on type
  let title = "";
  let subtitle = "";
  let price = 0;
  let currency = "";
  let travelers = searchParams.travelers || searchParams.guests || 1;
  let summaryImage = "";

  if (type === "flight") {
    const flight = item as any;
    title = `${flight.fromCode} to ${flight.toCode}`;
    subtitle = `${flight.airline} • ${flight.flightNumber} • ${flight.cabinClass}`;
    price = flight.price * travelers;
    currency = flight.currency;
    summaryImage = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop";
  } else if (type === "hotel") {
    const hotel = item as any;
    title = hotel.name;
    subtitle = hotel.destination;
    // Simplistic calculation: price * rooms
    let rooms = searchParams.rooms || 1;
    price = hotel.pricePerNight * rooms;
    currency = hotel.currency;
    summaryImage = hotel.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop";
  } else if (type === "holiday") {
    const pkg = item as any;
    title = pkg.title;
    subtitle = `${pkg.duration} Days • ${pkg.destination}`;
    price = pkg.price * travelers;
    currency = pkg.currency;
    summaryImage = pkg.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop";
  }

  const taxes = price * 0.15; // 15% tax
  const totalAmount = price + taxes;
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '';

  const onSubmit = (data: z.infer<typeof checkoutSchema>) => {
    if (!session?.authenticated) {
      // Must be logged in to book
      setLocation("/login");
      return;
    }

    createBookingMutation.mutate({
      data: {
        type: type as any,
        itemId: item.id,
        travelers: travelers,
        checkIn: searchParams.date || searchParams.checkIn,
        checkOut: searchParams.checkOut,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        totalAmount: totalAmount,
        currency: currency,
        notes: data.notes
      }
    });
  };

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-serif font-bold mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {!session?.authenticated && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Have an account?</h3>
                    <p className="text-sm text-muted-foreground">Sign in for faster checkout and to earn rewards.</p>
                  </div>
                </div>
                <Link href="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
              </div>
            )}

            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
                Traveler Information
              </h2>

              <Form {...form}>
                <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="As it appears on ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="For booking confirmation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="For urgent updates" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Dietary requirements, accessibility needs..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">2</span>
                Payment
              </h2>
              <p className="text-muted-foreground mb-4">
                Payment will be collected securely on the next step.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-4 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
                Your information is encrypted and securely processed.
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl overflow-hidden sticky top-24 shadow-sm">
              <div className="h-32 w-full relative">
                <img src={summaryImage} alt="Summary" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1 text-white/80">
                    {type === 'flight' ? <Plane className="w-3 h-3" /> : 
                     type === 'hotel' ? <Building2 className="w-3 h-3" /> : 
                     <Map className="w-3 h-3" />}
                    {type}
                  </div>
                  <h3 className="font-serif font-bold text-lg leading-tight truncate w-56">{title}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-sm text-muted-foreground mb-6">
                  {subtitle}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Price ({travelers}x)</span>
                    <span className="font-medium">{currencySymbol}{price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes & Fees</span>
                    <span className="font-medium">{currencySymbol}{taxes.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-4" />
                
                <div className="flex justify-between items-end mb-6">
                  <span className="font-bold text-foreground">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">{currencySymbol}{totalAmount.toFixed(2)}</span>
                    <div className="text-xs text-muted-foreground">Prices in {currency}</div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  form="checkout-form"
                  className="w-full h-12 text-lg hover-elevate"
                  disabled={createBookingMutation.isPending || !session?.authenticated}
                >
                  {createBookingMutation.isPending ? "Processing..." : "Proceed to Payment"}
                </Button>
                
                {!session?.authenticated && (
                  <p className="text-xs text-center text-destructive mt-3">
                    Please sign in to complete your booking.
                  </p>
                )}
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  By proceeding, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
