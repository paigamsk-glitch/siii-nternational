import { useEffect, useRef, useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Clock, Users, ChevronDown, ChevronUp, MapPin, Calendar,
  Shield, CheckCircle2, XCircle, Bed, ArrowLeft, Share2,
  Heart, Camera
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { getPackageBySlug } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/lib/booking-store";

export function PackageDetail() {
  const [, params] = useRoute("/packages/:slug");
  const [, setLocation] = useLocation();
  const slug = params?.slug ?? "";
  const pkg = getPackageBySlug(slug);

  const setBookingItem = useBookingStore((state) => state.setBookingItem);

  const [openDay, setOpenDay] = useState<number | null>(0);
  const [travelers, setTravelers] = useState(2);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"itinerary" | "inclusions" | "info">("itinerary");
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-serif font-bold">Package not found</h2>
        <Link href="/packages">
          <Button variant="outline">Browse All Packages</Button>
        </Link>
      </div>
    );
  }

  const tax = pkg.price * travelers * 0.15;
  const total = pkg.price * travelers + tax;

  const handleBook = () => {
    const bookingItem = {
      id: pkg.id,
      title: pkg.title,
      destination: pkg.destination,
      duration: pkg.duration,
      price: pkg.price,
      currency: pkg.currency,
      imageUrl: pkg.images[0],
      theme: pkg.theme,
      country: pkg.country,
      rating: pkg.rating,
      description: pkg.description,
      highlights: pkg.highlights,
    } as any;
    setBookingItem("holiday", bookingItem, { travelers });
    setLocation("/packages/book/" + pkg.slug);
  };

  const tabs = [
    { key: "itinerary", label: "Itinerary" },
    { key: "inclusions", label: "Inclusions" },
    { key: "info", label: "Trip Info" },
  ] as const;

  return (
    <div className="bg-background min-h-screen">
      {/* Gallery with Swiper */}
      <div className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden bg-muted">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop
          className="w-full h-full package-swiper"
        >
          {pkg.images.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-full">
                <img src={img} alt={`${pkg.title} — image ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 md:px-8 pb-8">
          <div className="container mx-auto">
            <Link href="/packages" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              All Packages
            </Link>

            {pkg.badge && (
              <div className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full mb-3">
                {pkg.badge}
              </div>
            )}

            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3 leading-tight max-w-3xl">
              {pkg.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/85">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {pkg.destination}, {pkg.country}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {pkg.duration} Days
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {pkg.rating} ({pkg.reviewCount} reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                {pkg.images.length} Photos
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all"
          >
            <Heart className={cn("w-5 h-5", isWishlisted && "fill-red-400 text-red-400")} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left — Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div>
              <p className="text-muted-foreground leading-relaxed text-base">{pkg.description}</p>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-5">Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.highlights.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 bg-muted/40 rounded-xl p-4"
                  >
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground">{h}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex border-b border-border mb-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px",
                      activeTab === tab.key
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Itinerary Tab */}
                {activeTab === "itinerary" && (
                  <motion.div
                    key="itinerary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    {pkg.itinerary.map((day, i) => (
                      <div
                        key={day.day}
                        className="border border-border rounded-xl overflow-hidden"
                      >
                        <button
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                          onClick={() => setOpenDay(openDay === i ? null : i)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                              {day.day}
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground font-medium mb-0.5">Day {day.day}</div>
                              <div className="font-semibold text-foreground">{day.title}</div>
                            </div>
                          </div>
                          {openDay === i
                            ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                            : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                          }
                        </button>

                        <AnimatePresence initial={false}>
                          {openDay === i && (
                            <motion.div
                              key="content"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 border-t border-border">
                                <p className="text-muted-foreground text-sm mt-4 mb-4 leading-relaxed">
                                  {day.description}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {day.activities.map((act, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                      <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                                      {act}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Inclusions Tab */}
                {activeTab === "inclusions" && (
                  <motion.div
                    key="inclusions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    <div>
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        What's Included
                      </h3>
                      <div className="space-y-3">
                        {pkg.inclusions.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-400" />
                        Not Included
                      </h3>
                      <div className="space-y-3">
                        {pkg.exclusions.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm">
                            <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Trip Info Tab */}
                {activeTab === "info" && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {[
                      { icon: Clock, label: "Duration", value: `${pkg.duration} Days / ${pkg.duration - 1} Nights` },
                      { icon: Users, label: "Max Group Size", value: `${pkg.maxGroupSize} Travellers` },
                      { icon: MapPin, label: "Difficulty", value: pkg.difficulty },
                      { icon: Calendar, label: "Best Time to Visit", value: pkg.bestTime },
                      { icon: Bed, label: "Accommodation", value: pkg.accommodation },
                      { icon: Shield, label: "Booking Security", value: "100% Secure & Encrypted" },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-4 bg-muted/30 rounded-xl p-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-medium mb-0.5">{label}</div>
                          <div className="text-sm font-semibold text-foreground">{value}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right — Sticky Booking Sidebar */}
          <div className="lg:col-span-1" ref={stickyRef}>
            <div className="sticky top-24 space-y-4">
              <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
                {/* Price Header */}
                <div className="bg-primary p-6 text-white">
                  <div className="text-sm text-white/70 mb-1">Starting from</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">₹{pkg.price.toLocaleString("en-IN")}</span>
                    <span className="text-white/60 text-sm">/person</span>
                  </div>
                  {pkg.originalPrice > pkg.price && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-white/50 line-through">₹{pkg.originalPrice.toLocaleString("en-IN")}</span>
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-bold">
                        {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-5">
                  {/* Travellers Picker */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Travellers</label>
                    <div className="flex items-center justify-between border border-border rounded-xl p-3">
                      <button
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center font-bold text-foreground transition-colors"
                      >
                        −
                      </button>
                      <span className="font-semibold text-lg">{travelers} {travelers === 1 ? "Person" : "People"}</span>
                      <button
                        onClick={() => setTravelers(Math.min(pkg.maxGroupSize, travelers + 1))}
                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center font-bold text-foreground transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">₹{pkg.price.toLocaleString("en-IN")} × {travelers} persons</span>
                      <span className="font-medium">₹{(pkg.price * travelers).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes & Fees (15%)</span>
                      <span className="font-medium">₹{tax.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="border-t border-border pt-2.5 flex justify-between font-bold text-base">
                      <span>Total</span>
                      <span className="text-primary">₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>

                  <Button onClick={handleBook} className="w-full h-12 text-base font-semibold hover-elevate">
                    Book This Package
                  </Button>

                  <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                    <Shield className="w-3.5 h-3.5 text-green-500" />
                    100% Secure Checkout • Free Cancellation
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-muted/30 border border-border rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">Need help planning?</p>
                <Link href="/contact">
                  <Button variant="outline" className="w-full text-sm">Talk to a Travel Expert</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-card border-t border-border px-4 py-3 flex items-center justify-between shadow-2xl">
        <div>
          <div className="text-xs text-muted-foreground">From</div>
          <div className="text-xl font-bold text-primary">₹{pkg.price.toLocaleString("en-IN")}</div>
          <div className="text-xs text-muted-foreground">per person</div>
        </div>
        <Button onClick={handleBook} className="h-12 px-8 text-base font-semibold hover-elevate">
          Book Now
        </Button>
      </div>
    </div>
  );
}
