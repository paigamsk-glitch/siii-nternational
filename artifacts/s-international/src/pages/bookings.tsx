import { useEffect } from "react";
import { useLocation } from "wouter";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Plane, Building2, Map, Calendar, ChevronRight, AlertCircle, ArrowRight } from "lucide-react";
import { 
  useGetBookings, 
  getGetBookingsQueryKey,
  useGetSession,
  getGetSessionQueryKey,
  BookingStatus,
  BookingPaymentStatus
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export function Bookings() {
  const [location, setLocation] = useLocation();
  
  // Auth check
  const { data: session, isLoading: sessionLoading } = useGetSession({
    query: { queryKey: getGetSessionQueryKey() }
  });

  useEffect(() => {
    if (!sessionLoading && !session?.authenticated) {
      setLocation("/login");
    }
  }, [session, sessionLoading, setLocation]);

  const { data, isLoading: bookingsLoading } = useGetBookings({
    query: {
      queryKey: getGetBookingsQueryKey(),
      enabled: !!session?.authenticated
    }
  });

  if (sessionLoading || (session?.authenticated && bookingsLoading)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Loading your itineraries...</p>
      </div>
    );
  }

  if (!session?.authenticated) return null; // Will redirect

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50";
      case 'pending': return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50";
      case 'cancelled': return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50";
      case 'completed': return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return "bg-green-100 text-green-800";
      case 'unpaid': return "bg-amber-100 text-amber-800";
      case 'failed': return "bg-red-100 text-red-800";
      case 'refunded': return "bg-slate-100 text-slate-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="w-5 h-5 text-primary" />;
      case 'hotel': return <Building2 className="w-5 h-5 text-primary" />;
      case 'holiday': return <Map className="w-5 h-5 text-primary" />;
      default: return <Calendar className="w-5 h-5 text-primary" />;
    }
  };

  const bookings = data?.bookings || [];
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-muted/20 pb-24">
      <div className="bg-primary pt-12 pb-24 text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">My Journeys</h1>
          <p className="text-primary-foreground/80 font-medium text-lg">
            Welcome back, {session.user?.name?.split(' ')[0]}. Here are your upcoming and past travels.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-10">
        {bookings.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-lg border border-border p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-primary opacity-50" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-3">No bookings yet</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              You haven't planned any trips with us yet. The world is waiting to be explored.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/flights">
                <Button className="w-full sm:w-auto hover-elevate">Book a Flight</Button>
              </Link>
              <Link href="/holidays">
                <Button variant="outline" className="w-full sm:w-auto">Explore Holidays</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {upcomingBookings.length > 0 && (
              <section>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
                  Upcoming Trips
                  <Badge variant="secondary" className="ml-2 bg-secondary text-secondary-foreground">
                    {upcomingBookings.length}
                  </Badge>
                </h2>
                <div className="space-y-4">
                  {upcomingBookings.map((booking, i) => (
                    <BookingCard key={booking.id} booking={booking} index={i} getStatusColor={getStatusColor} getPaymentStatusColor={getPaymentStatusColor} getIcon={getIcon} />
                  ))}
                </div>
              </section>
            )}

            {pastBookings.length > 0 && (
              <section>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6 text-muted-foreground">Past & Cancelled</h2>
                <div className="space-y-4 opacity-80 transition-opacity hover:opacity-100">
                  {pastBookings.map((booking, i) => (
                    <BookingCard key={booking.id} booking={booking} index={i} getStatusColor={getStatusColor} getPaymentStatusColor={getPaymentStatusColor} getIcon={getIcon} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, index, getStatusColor, getPaymentStatusColor, getIcon }: any) {
  // Extract summary based on item details structure from API
  const details = booking.itemDetails as any;
  let title = "Booking Details";
  let subtitle = "";
  
  if (booking.type === "flight" && details?.airline) {
    title = `${details.fromCode || 'Origin'} to ${details.toCode || 'Destination'}`;
    subtitle = `${details.airline} • ${details.flightNumber}`;
  } else if (booking.type === "hotel" && details?.name) {
    title = details.name;
    subtitle = details.destination || 'Hotel Stay';
  } else if (booking.type === "holiday" && details?.title) {
    title = details.title;
    subtitle = `${details.duration} Days • ${details.destination || ''}`;
  }

  const formattedDate = booking.createdAt ? format(parseISO(booking.createdAt), "MMM d, yyyy") : "";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-xl p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-5 md:p-6 flex flex-col md:flex-row gap-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {getIcon(booking.type)}
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="uppercase text-xs font-bold tracking-wider text-muted-foreground">
              {booking.type}
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-muted-foreground text-xs">ID: {booking.id.substring(0,8).toUpperCase()}</span>
          </div>
          
          <h3 className="text-xl font-serif font-bold text-foreground mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
          
          <div className="flex flex-wrap gap-4 mt-4">
            {booking.checkIn && (
              <div className="text-sm">
                <span className="text-muted-foreground">Date: </span>
                <span className="font-medium">{format(parseISO(booking.checkIn), "MMM d, yyyy")}</span>
              </div>
            )}
            <div className="text-sm">
              <span className="text-muted-foreground">Travelers: </span>
              <span className="font-medium">{booking.travelers}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Booked: </span>
              <span className="font-medium">{formattedDate}</span>
            </div>
          </div>
        </div>
        
        <div className="md:w-48 md:border-l md:border-border md:pl-6 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-4 md:gap-2">
          <div className="flex flex-col items-start md:items-end">
            <div className="text-xl font-bold text-primary mb-1">
              {booking.currency === 'USD' ? '$' : booking.currency === 'EUR' ? '€' : booking.currency === 'GBP' ? '£' : ''}
              {booking.totalAmount}
            </div>
            <div className={`text-xs px-2 py-1 rounded font-semibold capitalize ${getPaymentStatusColor(booking.paymentStatus)}`}>
              {booking.paymentStatus}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className={`text-xs px-3 py-1 rounded-full font-bold border capitalize ${getStatusColor(booking.status)}`}>
              {booking.status}
            </div>
            
            {booking.status === 'pending' && booking.paymentStatus === 'unpaid' && (
              <Link href={`/payment?bookingId=${booking.id}`}>
                <Button size="sm" className="mt-2 text-xs h-8">Complete Payment</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Bar */}
      <div className="bg-muted/30 border-t border-border px-6 py-3 flex items-center justify-between text-sm">
        <div className="text-muted-foreground flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> 
          {booking.status === 'confirmed' ? "Ready for travel" : 
           booking.status === 'pending' ? "Awaiting payment" : "Booking inactive"}
        </div>
        <Button variant="ghost" size="sm" className="h-8 font-medium">
          View Itinerary <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}
