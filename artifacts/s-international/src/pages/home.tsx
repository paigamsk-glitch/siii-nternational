import { useGetOffers, useGetPopularDestinations, getGetOffersQueryKey, getGetPopularDestinationsQueryKey } from "@workspace/api-client-react";
import { HeroSearch } from "@/components/hero-search";
import { motion } from "framer-motion";
import { ArrowRight, Star, Plane, Map, Clock, CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { travelPackages } from "@/data/packages";

export function Home() {
  const [, setLocation] = useLocation();
  const { data: offersData, isLoading: loadingOffers } = useGetOffers({
    query: { queryKey: getGetOffersQueryKey() }
  });
  
  const { data: destData, isLoading: loadingDest } = useGetPopularDestinations({
    query: { queryKey: getGetPopularDestinationsQueryKey() }
  });

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop" 
          alt="Premium travel experience" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        <div className="container relative z-20 text-center px-4 pb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg"
          >
            The Art of Travel
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md"
          >
            Curated experiences for those who seek the extraordinary.
          </motion.p>
        </div>
      </section>

      {/* Search Section */}
      <section className="px-4">
        <HeroSearch />
      </section>

      {/* Popular Destinations */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Discover the Extraordinary</h2>
              <p className="text-muted-foreground max-w-2xl text-lg">
                Explore our handpicked collection of the world's most captivating destinations, curated for the discerning traveler.
              </p>
            </div>
            <Link href="/holidays" className="text-secondary font-medium flex items-center gap-2 hover:gap-3 transition-all mt-4 md:mt-0">
              View all packages <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingDest ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {destData?.destinations.slice(0, 3).map((dest, i) => (
                <motion.div 
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer hover-elevate"
                  onClick={() => setLocation(`/destination?name=${encodeURIComponent(dest.name)}`)}
                >
                  <img 
                    src={dest.imageUrl || `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop`} 
                    alt={dest.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-white/80 text-sm font-medium mb-1 tracking-wider uppercase">{dest.country}</p>
                        <h3 className="text-3xl font-serif font-bold text-white mb-2">{dest.name}</h3>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-secondary text-secondary" />
                        <span className="text-white text-sm font-medium">{dest.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <div className="text-secondary text-sm font-bold tracking-widest uppercase mb-3">Curated For You</div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Top Travel Packages</h2>
              <p className="text-muted-foreground max-w-xl text-lg">
                All-inclusive journeys designed by experts — flights, stays, tours and memories, all wrapped in one price.
              </p>
            </div>
            <Link
              href="/packages"
              className="text-secondary font-medium flex items-center gap-2 hover:gap-3 transition-all mt-4 md:mt-0 shrink-0"
            >
              Explore all packages <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {travelPackages
              .filter(p => p.badge)
              .slice(0, 3)
              .map((pkg, i) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={pkg.images[0]}
                      alt={pkg.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {pkg.badge && (
                      <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full shadow">
                        {pkg.badge}
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {pkg.duration} Days
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-secondary uppercase tracking-widest">
                        {pkg.destination}, {pkg.country}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {pkg.rating}
                      </div>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                      {pkg.title}
                    </h3>

                    <div className="space-y-1.5 mb-5 flex-1">
                      {pkg.highlights.slice(0, 2).map((h, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-foreground/75">
                          <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0" />
                          <span className="line-clamp-1">{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-border flex items-end justify-between">
                      <div>
                        {pkg.originalPrice > pkg.price && (
                          <div className="text-xs text-muted-foreground line-through mb-0.5">
                            ₹{pkg.originalPrice.toLocaleString("en-IN")}
                          </div>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-primary">
                            ₹{pkg.price.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-muted-foreground">/person</span>
                        </div>
                      </div>
                      <Link href={`/packages/${pkg.slug}`}>
                        <button className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
                          View Details <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-primary rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white"
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">Not sure where to go?</h3>
              <p className="text-white/70 text-base max-w-lg">
                Browse all 8 curated packages across 8 destinations — from Bali beaches to Paris romance.
              </p>
            </div>
            <Link href="/packages">
              <button className="shrink-0 bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2 text-base">
                Browse All Packages
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Offers */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Exclusive Privileges</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Unlock exceptional value with our seasonal offers and partner privileges.
            </p>
          </div>

          {loadingOffers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {offersData?.offers.map((offer, i) => (
                <motion.div 
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-xl overflow-hidden shadow-sm border border-border flex flex-col sm:flex-row"
                >
                  <div className="w-full sm:w-2/5 h-48 sm:h-auto relative">
                    <img 
                      src={offer.imageUrl || `https://images.unsplash.com/photo-1542314831-c6a420325142?q=80&w=800&auto=format&fit=crop`} 
                      alt={offer.title} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 sm:p-8 w-full sm:w-3/5 flex flex-col justify-center">
                    <div className="text-secondary text-sm font-bold tracking-wider uppercase mb-2">{offer.category}</div>
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-3">{offer.title}</h3>
                    <p className="text-muted-foreground mb-6 line-clamp-2">{offer.description}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="font-bold text-primary text-xl">{offer.discount}</div>
                      <button
                        onClick={() => {
                          if (offer.id === "OFF001") setLocation("/holidays?theme=Beach");
                          else if (offer.id === "OFF002") setLocation("/flights?to=Goa");
                          else if (offer.id === "OFF003") setLocation("/hotels?promo=HOTEL20");
                          else if (offer.id === "OFF004") setLocation("/holidays?theme=Romantic");
                          else setLocation("/holidays");
                        }}
                        className="text-sm font-medium hover:underline flex items-center gap-1"
                      >
                        Claim Offer <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Markers */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-primary-foreground/20">
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mb-6">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Curated Excellence</h3>
              <p className="text-primary-foreground/70">Every hotel, flight, and experience is rigorously vetted for quality and service.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mb-6">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Global Expertise</h3>
              <p className="text-primary-foreground/70">Our travel concierges possess deep knowledge of destinations worldwide.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mb-6">
                <Plane className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Seamless Journeys</h3>
              <p className="text-primary-foreground/70">From inspiration to return, we handle every detail of your itinerary.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
