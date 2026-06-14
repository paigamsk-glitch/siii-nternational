import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plane, Building2, Map, Package, Menu, X, User, Train, Globe, DollarSign } from "lucide-react";
import { useGetSession, useAuthLogout, getGetSessionQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: session } = useGetSession({ 
    query: { queryKey: getGetSessionQueryKey() } 
  });
  
  const logout = useAuthLogout({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSessionQueryKey() });
        setLocation("/");
      }
    }
  });

  const isAuthenticated = session?.authenticated;

  const navItems = [
    { label: "Flights", path: "/flights", icon: Plane },
    { label: "Train", path: "/trains", icon: Train },
    { label: "Hotels", path: "/hotels", icon: Building2 },
    { label: "Packages", path: "/packages", icon: Package },
    { label: "Visa", path: "/visa", icon: Globe },
    { label: "Forex", path: "/forex", icon: DollarSign },
    { label: "Contact", path: "/contact", icon: null },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <Plane className="h-6 w-6 rotate-45" />
          <span className="brand-name text-xl tracking-tight">S International</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === item.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href="/bookings" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                My Bookings
              </Link>
              <Button variant="outline" size="sm" onClick={() => logout.mutate()} disabled={logout.isPending}>
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Log in
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>

        <button 
          className="md:hidden p-2 text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-background"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium flex items-center gap-2 py-2 ${
                    location === item.path ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/bookings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-medium text-muted-foreground flex items-center gap-2 py-2"
                  >
                    <User className="h-4 w-4" />
                    My Bookings
                  </Link>
                  <Button variant="outline" className="w-full justify-start mt-2" onClick={() => { logout.mutate(); setIsMobileMenuOpen(false); }}>
                    Log out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
