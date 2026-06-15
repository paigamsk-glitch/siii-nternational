import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

// Pages
import { Home } from "@/pages/home";
import { Flights } from "@/pages/flights";
import { Hotels } from "@/pages/hotels";
import { HotelDetail } from "@/pages/hotel-detail";
import { Contact } from "@/pages/contact";
import { Login } from "@/pages/login";
import { Signup } from "@/pages/signup";
import { Bookings } from "@/pages/bookings";
import { Checkout } from "@/pages/checkout";
import { Payment } from "@/pages/payment";
import { Confirmation } from "@/pages/confirmation";
import { Destination } from "@/pages/destination";
import { Packages } from "@/pages/packages";
import { PackageDetail } from "@/pages/package-detail";
import { PackageBooking } from "@/pages/package-booking";
import { Admin } from "@/pages/admin";
import { Destinations } from "@/pages/destinations";
import { FAQ } from "@/pages/faq";
import { Terms } from "@/pages/terms";
import { Privacy } from "@/pages/privacy";
import { Trains } from "@/pages/trains";
import { TrainBookingPage } from "@/pages/train-booking";
import { TrainCheckout } from "@/pages/train-checkout";
import { PNRStatus } from "@/pages/pnr";
import { LiveTrainStatus } from "@/pages/live-status";
import { TrainSchedule } from "@/pages/train-schedule";
import { Visa } from "@/pages/visa";
import { VisaDetail } from "@/pages/visa-detail";
import { VisaStatus } from "@/pages/visa-status";
import { Forex } from "@/pages/forex";
import { ForexCalculator } from "@/pages/forex-calculator";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Admin — standalone, no site header/footer */}
      <Route path="/admin" component={Admin} />

      {/* All other pages wrapped in site Layout */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/flights" component={Flights} />
            <Route path="/hotels" component={Hotels} />
            <Route path="/hotels/:id" component={HotelDetail} />
            <Route path="/contact" component={Contact} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/bookings" component={Bookings} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/payment" component={Payment} />
            <Route path="/confirmation" component={Confirmation} />
            <Route path="/destination" component={Destination} />
            <Route path="/packages" component={Packages} />
            <Route path="/packages/book/:slug" component={PackageBooking} />
            <Route path="/packages/:slug" component={PackageDetail} />
            <Route path="/destinations" component={Destinations} />
            <Route path="/faq" component={FAQ} />
            <Route path="/terms" component={Terms} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/trains" component={Trains} />
            <Route path="/trains/book" component={TrainBookingPage} />
            <Route path="/train-checkout" component={TrainCheckout} />
            <Route path="/pnr" component={PNRStatus} />
            <Route path="/live-status" component={LiveTrainStatus} />
            <Route path="/train-schedule" component={TrainSchedule} />
            <Route path="/visa" component={Visa} />
            <Route path="/visa/status" component={VisaStatus} />
            <Route path="/visa/:countryCode" component={VisaDetail} />
            <Route path="/forex" component={Forex} />
            <Route path="/currency/calculator" component={ForexCalculator} />
            <Route path="/currency" component={Forex} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
