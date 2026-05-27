import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Globe, Award, Shield, HeartHandshake, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  inquiryType: z.enum(["general", "booking", "complaint", "feedback", "partnership"]),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const FAQS = [
  { q: "How do I modify my booking?", a: "You can modify most bookings directly through the 'My Bookings' portal when logged in. For complex itineraries or package holidays, please contact your dedicated concierge." },
  { q: "What is your cancellation policy?", a: "Cancellation policies vary by service provider (airline, hotel) and fare type. Premium flexible fares can often be cancelled up to 24 hours before departure. Please check your specific booking details." },
  { q: "Do you provide visa assistance?", a: "Yes, our concierge team provides comprehensive guidance on visa requirements for your destination and can assist with the application process for select countries." },
  { q: "How long does it take to receive a booking confirmation?", a: "Most bookings are confirmed instantly. In rare cases involving complex itineraries, our team will reach out within 2 hours during business hours." },
];

export function Contact() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", inquiryType: "general", subject: "", message: "" },
  });

  const submitMutation = useSubmitContact({
    mutation: {
      onSuccess: () => {
        setIsSubmitted(true);
        form.reset();
        toast({ title: "Message Sent", description: "Our concierge team will get back to you shortly." });
      },
      onError: (error) => {
        toast({ variant: "destructive", title: "Submission Failed", description: error?.error || "There was a problem sending your message." });
      }
    }
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    submitMutation.mutate({ data });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[70vh] min-h-[500px] max-h-[680px] overflow-hidden flex items-end">
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1920&auto=format&fit=crop"
          alt="Travel world map"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 pb-16 md:pb-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-2 text-secondary text-sm font-semibold tracking-widest uppercase mb-4">
              <Globe className="w-4 h-4" />
              S International Travel
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 leading-none">
              At Your<br />Service
            </h1>
            <p className="text-xl text-white/75 max-w-xl font-light leading-relaxed">
              Whether you're planning your next journey or need help with an existing reservation — our expert concierges are always here.
            </p>
          </motion.div>
        </div>

        {/* Trust strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 divide-x divide-white/20 py-3">
              {[
                { icon: <Award className="w-4 h-4 text-secondary" />, label: "30+ Years Experience" },
                { icon: <Shield className="w-4 h-4 text-secondary" />, label: "100% Secure Bookings" },
                { icon: <HeartHandshake className="w-4 h-4 text-secondary" />, label: "24/7 Expert Support" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center justify-center gap-2 px-4 py-1">
                  {icon}
                  <span className="text-white/90 text-xs font-semibold hidden sm:block">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-16">

          {/* Left: Info + FAQ */}
          <div className="lg:col-span-5 space-y-10">

            {/* Office card */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-primary rounded-3xl p-8 text-primary-foreground relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
              <h2 className="text-2xl font-serif font-bold mb-8 relative z-10">Our Office</h2>
              <div className="space-y-7 relative z-10">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">Mumbai Headquarters</div>
                    <div className="text-primary-foreground/70 text-sm leading-relaxed">
                      313 Metro Market, Shop No. 2<br />
                      Abdul Rehman Street, Opp. Abdus Salam Masjid<br />
                      Mumbai – 400008, India
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">Phone</div>
                    <a href="tel:+919967553351" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">+91 99675 53351</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">Email</div>
                    <a href="mailto:sagarinternationaltravels@mail.com" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm break-all">sagarinternationaltravels@mail.com</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">Office Hours</div>
                    <div className="text-primary-foreground/70 text-sm space-y-1">
                      <div className="flex justify-between gap-8">
                        <span>Monday – Saturday</span>
                        <span className="text-primary-foreground font-semibold">10 AM – 7 PM</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Sunday</span>
                        <span className="text-primary-foreground font-semibold">11 AM – 4 PM</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-green-400 font-semibold text-xs">WhatsApp available 24/7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* WhatsApp CTA */}
            <a href="https://wa.me/917777027454" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-5 hover:bg-[#25D366]/20 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-[#25D366] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground text-lg">Message Us on WhatsApp</div>
                <div className="text-muted-foreground text-sm">Get an instant reply — typically within minutes</div>
                <div className="text-[#25D366] font-mono text-xs font-semibold mt-0.5">+91 77770 27454</div>
              </div>
            </a>

            {/* Office photo */}
            <div className="rounded-2xl overflow-hidden h-52 relative">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                alt="Office"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent flex items-end p-5">
                <div className="text-white">
                  <div className="font-serif font-bold text-lg">Mumbai Headquarters</div>
                  <div className="text-white/70 text-sm">Abdul Rehman Street</div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left px-5 py-4 flex justify-between items-center font-semibold text-sm hover:text-primary transition-colors"
                    >
                      {faq.q}
                      <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-4 text-muted-foreground text-sm leading-relaxed border-t border-border pt-3">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">

              {/* Form header */}
              <div className="bg-gradient-to-br from-primary to-primary/80 px-8 pt-8 pb-10 text-primary-foreground relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="relative z-10">
                  <div className="text-secondary text-sm font-semibold uppercase tracking-widest mb-3">Send an Inquiry</div>
                  <h2 className="text-3xl font-serif font-bold mb-2">How Can We Help You?</h2>
                  <p className="text-primary-foreground/70">Fill out the form and we'll connect you with the right expert within 24 hours.</p>
                </div>
              </div>

              <div className="p-8 md:p-10">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-5"
                    >
                      <div className="w-24 h-24 rounded-full bg-accent/10 border-4 border-accent/20 flex items-center justify-center">
                        <Send className="w-10 h-10 text-accent" />
                      </div>
                      <h3 className="text-3xl font-serif font-bold">Message Received!</h3>
                      <p className="text-muted-foreground text-lg max-w-sm">
                        Thank you for reaching out. A dedicated travel concierge will contact you shortly.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-xl">
                        <Clock className="w-4 h-4" />
                        Typical response time: under 2 hours
                      </div>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-4 rounded-xl">
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField control={form.control} name="name" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-semibold">Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Jane Doe" {...field} className="bg-muted/40 border-border/60 rounded-xl h-11 focus:border-primary" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-semibold">Email Address *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="jane@example.com" {...field} className="bg-muted/40 border-border/60 rounded-xl h-11 focus:border-primary" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField control={form.control} name="phone" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-semibold">Phone (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="+91 98765 43210" {...field} className="bg-muted/40 border-border/60 rounded-xl h-11 focus:border-primary" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="inquiryType" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-semibold">Inquiry Type *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-muted/40 border-border/60 rounded-xl h-11">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="general">General Question</SelectItem>
                                    <SelectItem value="booking">New / Existing Booking</SelectItem>
                                    <SelectItem value="complaint">Complaint</SelectItem>
                                    <SelectItem value="feedback">Feedback</SelectItem>
                                    <SelectItem value="partnership">Partnership / Corporate</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>

                          <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">Subject *</FormLabel>
                              <FormControl>
                                <Input placeholder="How can we help you?" {...field} className="bg-muted/40 border-border/60 rounded-xl h-11 focus:border-primary" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <FormField control={form.control} name="message" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">Message *</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Please provide as much detail as possible — destination, travel dates, number of travelers, special requirements..." className="min-h-[140px] resize-none bg-muted/40 border-border/60 rounded-xl focus:border-primary" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <Button type="submit" className="w-full h-13 text-base rounded-xl bg-primary hover:bg-primary/90 font-bold shadow-lg py-3" disabled={submitMutation.isPending}>
                            {submitMutation.isPending ? (
                              <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</span>
                            ) : (
                              <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Send Message</span>
                            )}
                          </Button>

                          <p className="text-xs text-center text-muted-foreground">
                            By submitting, you agree to our Privacy Policy. We never share your information with third parties.
                          </p>
                        </form>
                      </Form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Testimonial strip */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { name: "Priya Sharma", text: "Exceptional service. Booked our Maldives honeymoon and it was flawless.", stars: 5 },
                { name: "Rahul Mehta", text: "Quick responses, great pricing. Our Dubai trip was perfectly organized.", stars: 5 },
                { name: "Anjali Gupta", text: "The concierge team went above and beyond. Highly recommend!", stars: 5 },
              ].map(({ name, text, stars }) => (
                <div key={name} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex gap-0.5 mb-2">
                    {Array(stars).fill(0).map((_, i) => <span key={i} className="text-secondary text-sm">★</span>)}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">"{text}"</p>
                  <p className="text-xs font-bold">— {name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
