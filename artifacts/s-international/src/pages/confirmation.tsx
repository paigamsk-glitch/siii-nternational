import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, Calendar, ArrowRight, Download, Mail } from "lucide-react";
import { useGetBookingById, getGetBookingByIdQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

export function Confirmation() {
  const [location, setLocation] = useLocation();
  const [bookingId, setBookingId] = useState<string | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("bookingId");
    if (id) {
      setBookingId(id);
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  const { data: booking, isLoading } = useGetBookingById(bookingId || "", {
    query: {
      enabled: !!bookingId,
      queryKey: getGetBookingByIdQueryKey(bookingId || "")
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-muted/20 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-primary px-8 py-12 text-primary-foreground text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-white text-primary rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Booking Confirmed!</h1>
              <p className="text-primary-foreground/80 text-lg max-w-lg mx-auto">
                Thank you, {booking.contactName.split(' ')[0]}. Your journey is set. A confirmation email has been sent to {booking.contactEmail}.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-10 border-b border-border">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Booking Ref</p>
                <p className="font-mono font-bold text-lg">{booking.id.substring(0,8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <div className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded text-sm font-bold uppercase">
                  {booking.status}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment</p>
                <p className="font-semibold text-foreground capitalize">{booking.paymentStatus}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Amount</p>
                <p className="font-bold text-primary">
                  {booking.currency === 'USD' ? '$' : booking.currency === 'EUR' ? '€' : booking.currency === 'GBP' ? '£' : booking.currency === 'INR' ? '₹' : ''}
                  {booking.totalAmount}
                </p>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-serif font-bold mb-4">What's Next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Travel Documents</h4>
                    <p className="text-sm text-muted-foreground">Your e-tickets and vouchers will be available 48 hours before departure.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Manage Booking</h4>
                    <p className="text-sm text-muted-foreground">Add special requests or modify your booking in your account dashboard.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/bookings" className="flex-1">
                <Button className="w-full h-12 hover-elevate">
                  View My Bookings <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" className="flex-1 h-12">
                <Download className="w-4 h-4 mr-2" /> Download Receipt
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
