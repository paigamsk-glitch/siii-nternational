import { useEffect, useRef, useState, useCallback } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Clock, Users, ChevronDown, ChevronUp, MapPin, Calendar,
  Shield, CheckCircle2, XCircle, Bed, ArrowLeft, Share2,
  Heart, Camera, Loader2, ChevronLeft, ChevronRight, X, Expand
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

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

interface NormalizedDetail {
  id: string;
  slug: string;
  title: string;
  destination: string;
  country: string;
  theme: string;
  duration: number;
  price: number;
  originalPrice: number;
  currency: string;
  rating: number;
  reviewCount: number;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  images: string[];
  badge?: string;
  maxGroupSize: number;
  itinerary: Array<{ day: number; title: string; description: string; activities: string[] }>;
}

function normalizeDetail(p: any): NormalizedDetail {
  const price = Number(p.offerPrice || p.price || 0);
  const originalPrice = Number(p.offerPrice ? p.price : 0);
  let badge: string | undefined;
  if (p.isFeatured) badge = "Best Seller";
  else if (p.isTrending) badge = "Trending";
  const itinerary = Array.isArray(p.itinerary)
    ? p.itinerary.map((d: any) => ({
        day: d.day,
        title: d.title || "",
        description: d.description || "",
        activities: Array.isArray(d.activities) ? d.activities : [],
      }))
    : [];
  return {
    id: p.id,
    slug: p.slug || "",
    title: p.title,
    destination: p.destination,
    country: p.country,
    theme: p.theme,
    duration: p.durationDays || (p.durationNights ? p.durationNights + 1 : p.duration || 0),
    price,
    originalPrice,
    currency: p.currency || "INR",
    rating: p.rating || 4.5,
    reviewCount: p.reviewCount || 0,
    description: p.overview || p.description || "",
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    inclusions: Array.isArray(p.inclusions) ? p.inclusions : [],
    exclusions: Array.isArray(p.exclusions) ? p.exclusions : [],
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.imageUrl ? [p.imageUrl] : []),
    badge,
    maxGroupSize: p.maxTravelers || p.maxGroupSize || 15,
    itinerary,
  };
}

export function PackageDetail() {
  const [, params] = useRoute("/packages/:slug");
  const [, setLocation] = useLocation();
  const slug = params?.slug ?? "";

  const [pkg, setPkg] = useState<NormalizedDetail | null>(null);
  const [loadingPkg, setLoadingPkg] = useState(true);

  const setBookingItem = useBookingStore((state) => state.setBookingItem);

  const [openDay, setOpenDay] = useState<number | null>(0);
  const [travelers, setTravelers] = useState(2);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"itinerary" | "inclusions" | "info">("itinerary");
  const stickyRef = useRef<HTMLDivElement>(null);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const openLightbox = useCallback((i: number) => {
    setLightboxIdx(i);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const lightboxPrev = useCallback(() =>
    setLightboxIdx(i => (pkg ? (i - 1 + pkg.images.length) % pkg.images.length : 0)),
  [pkg]);

  const lightboxNext = useCallback(() =>
    setLightboxIdx(i => (pkg ? (i + 1) % pkg.images.length : 0)),
  [pkg]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, closeLightbox, lightboxPrev, lightboxNext]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoadingPkg(true);
    fetch(`${BASE_URL}/api/packages/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.package) {
          setPkg(normalizeDetail(data.package));
        } else {
          const staticPkg = getPackageBySlug(slug);
          if (staticPkg) setPkg(normalizeDetail(staticPkg));
          else setPkg(null);
        }
      })
      .catch(() => {
        const staticPkg = getPackageBySlug(slug);
        if (staticPkg) setPkg(normalizeDetail(staticPkg));
        else setPkg(null);
      })
      .finally(() => setLoadingPkg(false));
  }, [slug]);

  if (loadingPkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

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
              <div
                className="relative w-full h-full group cursor-zoom-in"
                onClick={() => openLightbox(i)}
              >
                <img src={img} alt={`${pkg.title} — image ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Zoom hint on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-black/40 backdrop-blur-sm rounded-full p-3">
                    <Expand className="w-6 h-6 text-white" />
                  </div>
                </div>
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

        {/* View all photos button */}
        {pkg.images.length > 1 && (
          <button
            onClick={() => openLightbox(0)}
            className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold px-3 py-2 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-105"
          >
            <Camera className="w-3.5 h-3.5" />
            View all {pkg.images.length} photos
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {pkg.images.length > 1 && (
        <div className="bg-muted/40 border-b border-border">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
              {pkg.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => openLightbox(i)}
                  className={cn(
                    "shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                    lightboxIdx === i && lightboxOpen
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent hover:border-primary/40"
                  )}
                >
                  <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
                  >
                    {pkg.itinerary.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Detailed itinerary coming soon.</p>
                      </div>
                    ) : (
                      <>
                        {/* Day quick-nav strip */}
                        <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
                          {pkg.itinerary.map((day, i) => (
                            <button
                              key={i}
                              onClick={() => setOpenDay(openDay === i ? null : i)}
                              className={cn(
                                "shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all",
                                openDay === i
                                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.04]"
                                  : "bg-muted/40 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                              )}
                            >
                              <span className="text-[10px] opacity-70">Day</span>
                              <span className="text-base leading-none">{day.day}</span>
                            </button>
                          ))}
                          <div className="ml-auto shrink-0 flex items-center">
                            <button
                              onClick={() => setOpenDay(openDay !== null ? null : 0)}
                              className="text-xs text-primary hover:underline font-medium whitespace-nowrap"
                            >
                              {openDay !== null ? "Collapse" : "Expand all"}
                            </button>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative">
                          {/* Vertical connector line */}
                          <div className="absolute left-[19px] top-6 bottom-6 w-px bg-border" />

                          <div className="space-y-3">
                            {pkg.itinerary.map((day, i) => (
                              <div key={day.day} className="relative">
                                <div
                                  className={cn(
                                    "ml-10 border rounded-xl overflow-hidden transition-all duration-200",
                                    openDay === i
                                      ? "border-primary/30 shadow-md shadow-primary/5"
                                      : "border-border hover:border-primary/20"
                                  )}
                                >
                                  {/* Day header */}
                                  <button
                                    className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/30"
                                    onClick={() => setOpenDay(openDay === i ? null : i)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div>
                                        <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">
                                          Day {day.day}
                                        </div>
                                        <div className="font-semibold text-foreground leading-snug">
                                          {day.title || "—"}
                                        </div>
                                        {day.activities.length > 0 && openDay !== i && (
                                          <div className="text-xs text-muted-foreground mt-0.5">
                                            {day.activities.length} activit{day.activities.length === 1 ? "y" : "ies"}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    {openDay === i
                                      ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                                      : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                                    }
                                  </button>

                                  {/* Expanded content */}
                                  <AnimatePresence initial={false}>
                                    {openDay === i && (
                                      <motion.div
                                        key="content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.22, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                      >
                                        <div className="px-5 pb-5 border-t border-border">
                                          {day.description && (
                                            <p className="text-muted-foreground text-sm mt-4 mb-4 leading-relaxed">
                                              {day.description}
                                            </p>
                                          )}
                                          {day.activities.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                              {day.activities.map((act, idx) => (
                                                <span
                                                  key={idx}
                                                  className="inline-flex items-center gap-1.5 bg-primary/8 text-primary border border-primary/15 text-xs font-medium px-3 py-1.5 rounded-full"
                                                >
                                                  <span className="w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                                                  {act}
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>

                                {/* Timeline dot — sits on the connector line, left of the card */}
                                <div
                                  className={cn(
                                    "absolute left-0 top-4 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-200 z-10",
                                    openDay === i
                                      ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg shadow-primary/30"
                                      : "bg-background text-muted-foreground border-border"
                                  )}
                                >
                                  {day.day}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
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
                      { icon: MapPin, label: "Destination", value: `${pkg.destination}, ${pkg.country}` },
                      { icon: Calendar, label: "Theme", value: pkg.theme },
                      { icon: Bed, label: "Category", value: pkg.theme },
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
              <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 border-2 border-secondary/40 rounded-xl p-5 text-center">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5 text-secondary-foreground" />
                </div>
                <p className="font-semibold text-base mb-1">Talk to a Travel Expert</p>
                <p className="text-xs text-muted-foreground mb-4">Our specialists are available 7 days a week to help craft your perfect trip.</p>
                <Link href="/contact">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-xl">Contact Us</Button>
                </Link>
                <a href="tel:+919867860209" className="block mt-2 text-xs text-muted-foreground hover:text-secondary transition-colors">📞 +91 98678 60209</a>
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

      {/* ── Lightbox Overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex flex-col bg-black/96 backdrop-blur-md"
            onClick={closeLightbox}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              onClick={e => e.stopPropagation()}
            >
              <div>
                <p className="text-white font-semibold text-sm">{pkg.title}</p>
                <p className="text-white/50 text-xs mt-0.5">
                  {lightboxIdx + 1} / {pkg.images.length}
                </p>
              </div>
              <button
                onClick={closeLightbox}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main image area */}
            <div className="flex-1 flex items-center justify-center relative min-h-0 px-14">
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIdx}
                  src={pkg.images[lightboxIdx]}
                  alt={`${pkg.title} — photo ${lightboxIdx + 1}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="max-h-full max-w-full object-contain rounded-xl select-none"
                  onClick={e => e.stopPropagation()}
                  draggable={false}
                />
              </AnimatePresence>

              {/* Prev arrow */}
              {pkg.images.length > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); lightboxPrev(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next arrow */}
              {pkg.images.length > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); lightboxNext(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom thumbnail strip */}
            {pkg.images.length > 1 && (
              <div
                className="shrink-0 flex justify-center gap-2 px-4 py-4 overflow-x-auto scrollbar-hide"
                onClick={e => e.stopPropagation()}
              >
                {pkg.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIdx(i)}
                    className={cn(
                      "shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all",
                      i === lightboxIdx
                        ? "border-white scale-110 shadow-lg"
                        : "border-white/20 opacity-50 hover:opacity-80 hover:border-white/50"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
                  </button>
                ))}
              </div>
            )}

            {/* Keyboard hint */}
            <p className="text-center text-white/25 text-xs pb-3 shrink-0">
              ← → to navigate · Esc to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
