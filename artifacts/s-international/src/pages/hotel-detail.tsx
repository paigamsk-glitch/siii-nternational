import { useState, useEffect } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  MapPin, Star, Wifi, Waves, Dumbbell, Coffee, Car,
  UtensilsCrossed, ArrowLeft, Share2, Heart, Check,
  Calendar, Users, Moon, ChevronLeft, ChevronRight,
  Clock, Phone, Shield, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBookingStore } from "@/lib/booking-store";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Free WiFi": <Wifi className="w-5 h-5" />,
  "Pool": <Waves className="w-5 h-5" />,
  "Beach Access": <Waves className="w-5 h-5" />,
  "Gym": <Dumbbell className="w-5 h-5" />,
  "Fitness Center": <Dumbbell className="w-5 h-5" />,
  "Breakfast": <Coffee className="w-5 h-5" />,
  "Restaurant": <UtensilsCrossed className="w-5 h-5" />,
  "Multiple Restaurants": <UtensilsCrossed className="w-5 h-5" />,
  "Parking": <Car className="w-5 h-5" />,
  "Valet Parking": <Car className="w-5 h-5" />,
  "Spa": <Award className="w-5 h-5" />,
  "Bar": <Coffee className="w-5 h-5" />,
};

interface HotelData {
  id: string;
  slug?: string;
  name: string;
  destination: string;
  country: string;
  address: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  amenities: string[];
  imageUrl: string;
  images: string[];
  category: string;
  description: string;
  checkIn: string;
  checkOut: string;
}

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

export function HotelDetail() {
  const [, params] = useRoute("/hotels/:id");
  const [, setLocation] = useLocation();
  const setBookingItem = useBookingStore(state => state.setBookingItem);

  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [nights, setNights] = useState(3);

  const hotelId = params?.id;

  useEffect(() => {
    if (!hotelId) return;
    setLoading(true);
    fetch(`${BASE_URL}/api/hotels/${hotelId}`, { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data.hotel) {
          setHotel(data.hotel);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [hotelId]);

  const handleBook = () => {
    if (!hotel) return;
    setBookingItem("hotel", hotel as any, {
      guests: 2,
      rooms: 1,
      checkIn: format(new Date(), "yyyy-MM-dd"),
    });
    setLocation("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-2">Hotel not found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the hotel you're looking for.</p>
          <Link href="/hotels">
            <Button>Back to Hotels</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = hotel.images?.length ? hotel.images : [hotel.imageUrl];
  const totalPrice = hotel.pricePerNight * nights;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero Gallery — full bleed */}
      <div className="relative h-[55vh] min-h-[400px] max-h-[600px] overflow-hidden bg-primary/10">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{ prevEl: ".hotel-prev", nextEl: ".hotel-next" }}
          pagination={{ clickable: true, el: ".hotel-pagination" }}
          autoplay={{ delay: 5000, disableOnInteraction: true }}
          loop
          className="w-full h-full"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <img src={img} alt={`${hotel.name} photo ${i + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Gallery controls */}
        <button className="hotel-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur hover:bg-white/40 flex items-center justify-center transition-all">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button className="hotel-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur hover:bg-white/40 flex items-center justify-center transition-all">
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
        <div className="hotel-pagination absolute bottom-5 left-0 right-0 flex justify-center gap-1.5 z-20" />

        {/* Top nav overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4">
          <Link href="/hotels">
            <button className="flex items-center gap-2 bg-black/30 backdrop-blur text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-black/50 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Hotels
            </button>
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setSaved(s => !s)}
              className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur flex items-center justify-center hover:bg-black/50 transition-colors"
            >
              <Heart className={`w-5 h-5 ${saved ? "fill-red-500 text-red-500" : "text-white"}`} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur flex items-center justify-center hover:bg-black/50 transition-colors">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Bottom overlay info */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-6">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Badge className="bg-secondary text-secondary-foreground text-xs mb-2">{hotel.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white drop-shadow-lg">{hotel.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-white/80" />
                <span className="text-white/90 text-sm">{hotel.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur text-white px-3 py-2 rounded-xl shrink-0">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="font-bold">{hotel.rating}</span>
              <span className="text-white/70 text-xs">({hotel.reviewCount?.toLocaleString("en-IN")} reviews)</span>
            </div>
          </div>
        </div>

        {/* Photo counter */}
        <div className="absolute top-4 right-16 z-20 bg-black/40 backdrop-blur text-white text-xs px-2 py-1 rounded-lg font-medium">
          {images.length} Photos
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 space-y-8">
            {/* Star rating bar */}
            <div className="flex items-center gap-3 bg-white rounded-2xl border border-border p-4">
              <div className="flex items-center gap-1">
                {Array(Math.round(hotel.rating)).fill(0).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="font-bold text-lg">{hotel.rating} / 5</span>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-muted-foreground text-sm">{hotel.reviewCount?.toLocaleString("en-IN")} verified reviews</span>
              <Badge className="ml-auto bg-accent/10 text-accent border-0 font-semibold">
                {hotel.rating >= 4.8 ? "Exceptional" : hotel.rating >= 4.5 ? "Excellent" : "Very Good"}
              </Badge>
            </div>

            {/* About */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-xl font-serif font-bold mb-4">About This Property</h2>
              <p className="text-muted-foreground leading-relaxed text-base">{hotel.description}</p>
            </motion.div>

            {/* Amenities */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-xl font-serif font-bold mb-5">Amenities & Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {hotel.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border/50">
                    <div className="w-9 h-9 rounded-lg bg-primary/8 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                      {AMENITY_ICONS[amenity] || <Check className="w-5 h-5" />}
                    </div>
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Check-in/out policy */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-xl font-serif font-bold mb-5">Hotel Policies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5">Check-In</p>
                    <p className="text-muted-foreground text-sm">{hotel.checkIn}</p>
                    <p className="text-muted-foreground text-xs">Early check-in subject to availability</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5">Check-Out</p>
                    <p className="text-muted-foreground text-sm">{hotel.checkOut}</p>
                    <p className="text-muted-foreground text-xs">Late check-out fees may apply</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5">Cancellation</p>
                    <p className="text-muted-foreground text-sm">Free until 48 hrs</p>
                    <p className="text-muted-foreground text-xs">before check-in</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-xl font-serif font-bold mb-4">Location</h2>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">{hotel.name}</p>
                  <p className="text-muted-foreground text-sm">{hotel.address}</p>
                  <p className="text-muted-foreground text-sm">{hotel.destination}, {hotel.country}</p>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-border h-52">
                <iframe
                  title="Hotel Location"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(hotel.address + ', ' + hotel.destination + ', ' + hotel.country)}&output=embed&z=15`}
                  className="w-full h-full border-0"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address + ', ' + hotel.destination)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-2 text-xs text-primary hover:underline"
              >
                <MapPin className="w-3.5 h-3.5" />
                Open in Google Maps
              </a>
            </motion.div>
          </div>

          {/* Sticky sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
                {/* Price header */}
                <div className="bg-primary p-5 text-primary-foreground">
                  <div className="text-3xl font-bold mb-0.5">
                    ₹{hotel.pricePerNight.toLocaleString("en-IN")}
                  </div>
                  <div className="text-primary-foreground/70 text-sm">per night · incl. taxes</div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Night selector */}
                  <div className="flex items-center justify-between bg-muted/50 rounded-xl p-3 border border-border">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Nights</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setNights(n => Math.max(1, n - 1))} className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 font-bold transition-colors">−</button>
                      <span className="font-bold w-6 text-center">{nights}</span>
                      <button onClick={() => setNights(n => n + 1)} className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 font-bold transition-colors">+</button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">₹{hotel.pricePerNight.toLocaleString("en-IN")} × {nights} night{nights > 1 ? "s" : ""}</span>
                      <span className="font-medium">₹{(hotel.pricePerNight * nights).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes & fees (12%)</span>
                      <span className="font-medium">₹{Math.round(hotel.pricePerNight * nights * 0.12).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border font-bold text-base">
                      <span>Total</span>
                      <span className="text-primary">₹{Math.round(totalPrice * 1.12).toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <Button onClick={handleBook} className="w-full hover-elevate bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-bold h-12 text-base shadow-lg">
                    Book This Hotel
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">Free cancellation · No credit card needed</p>

                  {/* Trust badges */}
                  <div className="flex justify-around pt-2 border-t border-border">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Shield className="w-5 h-5 text-accent" />
                      <span className="text-xs text-muted-foreground">Secure</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Award className="w-5 h-5 text-secondary" />
                      <span className="text-xs text-muted-foreground">Best Price</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Phone className="w-5 h-5 text-primary" />
                      <span className="text-xs text-muted-foreground">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick contact */}
              <div className="bg-white rounded-2xl border border-border p-4">
                <p className="text-sm font-semibold mb-2">Need help choosing?</p>
                <p className="text-xs text-muted-foreground mb-3">Our travel experts are available 24/7 to assist you.</p>
                <a href="tel:+919867860209" className="block">
                  <Button variant="outline" className="w-full rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground text-sm">
                    <Phone className="w-4 h-4 mr-2" /> Call Now: 9867860209
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky book bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border px-4 py-3 flex items-center gap-4 shadow-2xl">
        <div className="flex-1">
          <div className="font-bold text-primary text-xl">₹{hotel.pricePerNight.toLocaleString("en-IN")}</div>
          <div className="text-xs text-muted-foreground">per night · incl. taxes</div>
        </div>
        <Button onClick={handleBook} className="hover-elevate bg-secondary text-secondary-foreground font-bold px-8 rounded-xl">
          Book Now
        </Button>
      </div>
    </div>
  );
}
