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
import { Holidays } from "@/pages/holidays";
import { Contact } from "@/pages/contact";
import { Login } from "@/pages/login";
import { Signup } from "@/pages/signup";
import { Bookings } from "@/pages/bookings";
import { Checkout } from "@/pages/checkout";
import { Payment } from "@/pages/payment";
import { Confirmation } from "@/pages/confirmation";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/flights" component={Flights} />
        <Route path="/hotels" component={Hotels} />
        <Route path="/holidays" component={Holidays} />
        <Route path="/contact" component={Contact} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/bookings" component={Bookings} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/payment" component={Payment} />
        <Route path="/confirmation" component={Confirmation} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
