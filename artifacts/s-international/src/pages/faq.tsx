import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, Phone } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const FAQ_CATEGORIES = [
  {
    category: "Bookings & Reservations",
    icon: "✈️",
    items: [
      {
        q: "How do I make a booking with S International?",
        a: "You can book directly through our website by selecting Flights, Hotels, or Packages. Browse available options, choose your preferred itinerary, and proceed to checkout. For complex or custom trips, contact our concierge team for a personalised quote.",
      },
      {
        q: "Can I book for a group or family?",
        a: "Yes. Our platform supports multi-traveller bookings. For large groups (10+ travellers), we recommend contacting our team directly for special group rates and coordinated arrangements.",
      },
      {
        q: "How soon will I receive my booking confirmation?",
        a: "Most bookings are confirmed instantly. For complex itineraries or bespoke packages, you'll receive a confirmation within 2 business hours. All confirmations are sent to your registered email address.",
      },
      {
        q: "Can I book a trip for someone else?",
        a: "Yes. You can book on behalf of another traveller by entering their details during checkout. Ensure all passenger details (names, passport numbers) match official travel documents exactly.",
      },
    ],
  },
  {
    category: "Cancellations & Refunds",
    icon: "🔄",
    items: [
      {
        q: "What is your cancellation policy?",
        a: "Cancellation terms depend on the fare type and service provider. Flexible fares can generally be cancelled up to 24 hours before departure for a full refund. Non-refundable fares may incur charges. Always review your booking's specific terms before confirming.",
      },
      {
        q: "How do I cancel or modify my booking?",
        a: "Log in to your account and go to 'My Bookings'. From there you can request modifications or cancellations. Alternatively, contact our support team directly for assistance.",
      },
      {
        q: "How long does a refund take?",
        a: "Refunds are typically processed within 7–14 business days once approved. The amount will be credited to your original payment method. Bank processing times may vary.",
      },
      {
        q: "What happens if the airline cancels my flight?",
        a: "If your flight is cancelled by the airline, you are entitled to a full refund or rebooking at no extra cost. Our team will proactively contact you to arrange an alternative and guide you through your options.",
      },
    ],
  },
  {
    category: "Payments & Pricing",
    icon: "💳",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards (Visa, Mastercard, American Express), UPI, net banking, and select EMI options. All transactions are secured with 256-bit SSL encryption.",
      },
      {
        q: "Are there any hidden fees?",
        a: "No hidden fees. The price you see includes all applicable taxes and surcharges. Any optional add-ons (seat selection, extra baggage, travel insurance) are clearly listed before checkout.",
      },
      {
        q: "Can I pay in instalments?",
        a: "Yes. For bookings above ₹25,000, EMI options are available through select cards and NBFCs. EMI details and applicable interest rates are displayed at checkout.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We never store your card details on our servers. All payments are processed through PCI-DSS compliant payment gateways. Look for the padlock icon in your browser to confirm a secure connection.",
      },
    ],
  },
  {
    category: "Visas & Travel Documents",
    icon: "🛂",
    items: [
      {
        q: "Do you provide visa assistance?",
        a: "Yes. Our concierge team provides comprehensive visa guidance for most popular destinations. We can help with document checklists, appointment scheduling, and application review. Contact us with your destination and travel dates for specific advice.",
      },
      {
        q: "What documents do I need for international travel?",
        a: "Generally you'll need a valid passport (with at least 6 months validity), a visa (if required), travel insurance, and your booking confirmations. Some destinations also require proof of onward travel and accommodation.",
      },
      {
        q: "How early should I apply for a visa?",
        a: "We recommend applying at least 4–6 weeks before your travel date. Processing times vary by country and season. Our team will advise the optimal timeline for your specific destination.",
      },
    ],
  },
  {
    category: "Travel Insurance",
    icon: "🛡️",
    items: [
      {
        q: "Do you offer travel insurance?",
        a: "Yes. We offer comprehensive travel insurance covering trip cancellation, medical emergencies, lost luggage, and flight delays. Insurance options are available at checkout and can be added to any booking.",
      },
      {
        q: "Is travel insurance mandatory?",
        a: "Travel insurance is not mandatory for domestic travel but is strongly recommended. For certain international destinations (particularly Schengen countries), travel insurance is a visa requirement.",
      },
      {
        q: "What does the travel insurance cover?",
        a: "Our standard plan covers: medical emergencies and evacuation, trip cancellation/interruption, lost or delayed baggage, flight delays, personal liability, and 24/7 emergency assistance.",
      },
    ],
  },
  {
    category: "On-Trip Support",
    icon: "📞",
    items: [
      {
        q: "What support is available during my trip?",
        a: "We provide 24/7 emergency support via WhatsApp (+91 77770 27454) and phone (+91 99675 53351). For non-urgent queries, you can email or use the contact form on our website.",
      },
      {
        q: "What if something goes wrong during my trip?",
        a: "Contact our emergency line immediately. We have protocols in place for lost passports, medical emergencies, missed connections, and hotel issues. We'll work with local partners to resolve the situation as quickly as possible.",
      },
      {
        q: "Do you have local representatives at destinations?",
        a: "For our package holidays, we have local ground partners and representatives at most major destinations who can assist with on-ground logistics, guided tours, and any issues that arise.",
      },
    ],
  },
];

export function FAQ() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const toggleItem = (key: string) => {
    setOpenItem(openItem === key ? null : key);
  };

  const categories = ["All", ...FAQ_CATEGORIES.map((c) => c.category)];

  const visibleCategories =
    activeCategory === "All"
      ? FAQ_CATEGORIES
      : FAQ_CATEGORIES.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative bg-primary py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 text-secondary text-sm font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <HelpCircle className="w-4 h-4" />
              Help Centre
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light">
              Everything you need to know about booking, travelling, and managing your trip with S International.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-card border-b border-border sticky top-16 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-10">
          {visibleCategories.map((section, si) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.05 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-2xl font-serif font-bold">{section.category}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map((item, ii) => {
                  const key = `${si}-${ii}`;
                  return (
                    <div key={key} className="bg-card border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full text-left px-6 py-5 flex justify-between items-start gap-4 font-semibold hover:text-primary transition-colors"
                      >
                        <span className="text-sm md:text-base leading-snug">{item.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-muted-foreground shrink-0 mt-0.5 transition-transform ${
                            openItem === key ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {openItem === key && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-primary rounded-3xl p-10 text-primary-foreground text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold mb-3">Still have questions?</h2>
            <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
              Our expert travel concierges are available 6 days a week and on WhatsApp around the clock.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="rounded-xl font-semibold gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Send a Message
                </Button>
              </Link>
              <a href="tel:+919967553351">
                <Button size="lg" variant="outline" className="rounded-xl font-semibold gap-2 border-white/30 text-white hover:bg-white/10">
                  <Phone className="w-5 h-5" />
                  Call Us Now
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
