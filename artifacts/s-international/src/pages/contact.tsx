import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  inquiryType: z.enum(["general", "booking", "complaint", "feedback", "partnership"]),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function Contact() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      inquiryType: "general",
      subject: "",
      message: "",
    },
  });

  const submitMutation = useSubmitContact({
    mutation: {
      onSuccess: () => {
        setIsSubmitted(true);
        form.reset();
        toast({
          title: "Message Sent",
          description: "Our concierge team will get back to you shortly.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: error?.error || "There was a problem sending your message. Please try again.",
        });
      }
    }
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    submitMutation.mutate({ data });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">At Your Service</h1>
          <p className="text-lg text-primary-foreground/80 font-medium">
            Whether you're ready to plan your next journey or need assistance with an existing reservation, our travel concierges are available 24/7.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-16">
          
          {/* Contact Info & FAQ */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-8">Global Offices</h2>
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">New York Headquarters</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      123 Global Avenue, Suite 400<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                    <div className="space-y-2 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" /> <span>+1 (800) 555-0199</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" /> <span>ny@sinternational.com</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">London Office</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      45 Curzon Street, Mayfair<br />
                      London W1J 7TW<br />
                      United Kingdom
                    </p>
                    <div className="space-y-2 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" /> <span>+44 20 7123 4567</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" /> <span>london@sinternational.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-8 rounded-2xl border border-border">
              <h2 className="text-2xl font-serif font-bold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-semibold">How do I modify my booking?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    You can modify most bookings directly through the "My Bookings" portal when logged in. For complex itineraries or package holidays, please contact your dedicated concierge.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-semibold">What is your cancellation policy?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Cancellation policies vary by service provider (airline, hotel) and fare type. Premium flexible fares can often be cancelled up to 24 hours before departure. Please check your specific booking details.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-semibold">Do you provide visa assistance?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Yes, our concierge team provides comprehensive guidance on visa requirements for your destination and can assist with the application process for select countries.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-card rounded-2xl shadow-xl border border-border p-8 md:p-10 relative overflow-hidden">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <Send className="w-10 h-10 ml-1" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-foreground">Message Received</h3>
                  <p className="text-muted-foreground text-lg max-w-md">
                    Thank you for reaching out. A dedicated travel concierge will be in touch with you shortly.
                  </p>
                  <Button 
                    className="mt-8 hover-elevate" 
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-serif font-bold mb-2">Send an Inquiry</h2>
                    <p className="text-muted-foreground">Fill out the form below and we'll connect you with the right expert.</p>
                  </div>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Jane Doe" {...field} className="bg-muted/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="jane@example.com" {...field} className="bg-muted/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 000-0000" {...field} className="bg-muted/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="inquiryType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Inquiry Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-muted/50">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="general">General Question</SelectItem>
                                  <SelectItem value="booking">Existing Booking</SelectItem>
                                  <SelectItem value="partnership">Partnership/Corporate</SelectItem>
                                  <SelectItem value="feedback">Feedback</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="How can we help?" {...field} className="bg-muted/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please provide as much detail as possible..." 
                                className="min-h-[150px] resize-none bg-muted/50" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full h-12 text-lg hover-elevate" 
                        disabled={submitMutation.isPending}
                      >
                        {submitMutation.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
