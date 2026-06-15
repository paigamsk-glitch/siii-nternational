import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Building2, Package, Menu, X, User, Train, Globe, DollarSign, Plane } from "lucide-react";
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
    { label: "Currency", path: "/currency", icon: DollarSign },
    { label: "Contact", path: "/contact", icon: null },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <svg width="160" height="44" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="S International">
            {/* Emblem */}
            <circle cx="22" cy="22" r="20" stroke="url(#goldGrad)" strokeWidth="1.2" fill="none"/>
            <circle cx="22" cy="22" r="16.5" stroke="url(#goldGrad)" strokeWidth="0.5" fill="none" strokeDasharray="2 3"/>
            {/* Wing left */}
            <path d="M6 22 C9 16, 14 14, 18 17" stroke="url(#goldGrad)" strokeWidth="1" fill="none" strokeLinecap="round"/>
            <path d="M6 22 C8 20, 12 19, 16 20" stroke="url(#goldGrad)" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.6"/>
            {/* Wing right */}
            <path d="M38 22 C35 16, 30 14, 26 17" stroke="url(#goldGrad)" strokeWidth="1" fill="none" strokeLinecap="round"/>
            <path d="M38 22 C36 20, 32 19, 28 20" stroke="url(#goldGrad)" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.6"/>
            {/* S letterform */}
            <path d="M17.5 17.5 C17.5 15.5 19 14.5 21 14.5 C23.5 14.5 25 15.8 25 17.5 C25 19.2 23.5 20.2 21 21 C18.5 21.8 17 22.8 17 24.8 C17 26.8 18.5 28 21 28 C23.5 28 25 27 25 25" stroke="url(#goldGrad)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C9A84C"/>
                <stop offset="50%" stopColor="#F0D080"/>
                <stop offset="100%" stopColor="#A8732A"/>
              </linearGradient>
            </defs>
          </svg>
          {/* Wordmark */}
          <div className="ml-2 flex flex-col leading-none">
            <span className="text-[18px] font-semibold tracking-[0.18em] text-foreground" style={{fontFamily:"Georgia, 'Times New Roman', serif", letterSpacing:"0.18em"}}>
              S INTERNATIONAL
            </span>
            <span className="text-[8px] tracking-[0.35em] text-[#C9A84C] font-medium mt-0.5 uppercase">
              Travel &amp; Tourism
            </span>
          </div>
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
