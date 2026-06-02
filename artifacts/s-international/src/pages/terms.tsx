import { motion } from "framer-motion";
import { Link } from "wouter";
import { FileText, ArrowRight } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Introduction",
    content: `These Terms and Conditions ("Terms") govern your use of the S International Travel website (the "Site") and the travel services offered by S International Travels ("we", "us", "our"). By accessing the Site or making a booking, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use our services.

S International Travels is a licensed travel agency registered in India, operating in compliance with applicable tourism and consumer protection laws.`,
  },
  {
    title: "2. Booking & Contract",
    content: `A binding contract between you and S International is formed when we issue a booking confirmation to your registered email address. All bookings are subject to availability and may be withdrawn prior to confirmation.

You must be at least 18 years of age to make a booking. By booking on behalf of other travellers, you confirm you have their authority to accept these Terms on their behalf and that all information you provide is accurate and complete.`,
  },
  {
    title: "3. Pricing & Payment",
    content: `All prices displayed on the Site are in Indian Rupees (INR) unless otherwise stated and include applicable taxes at the time of quotation. We reserve the right to correct pricing errors. If a pricing error is identified after your booking, we will notify you and offer the option to proceed at the correct price or receive a full refund.

Payment must be made in full at the time of booking unless an instalment plan has been explicitly agreed in writing. We accept major debit/credit cards, UPI, and net banking. All payments are processed through PCI-DSS compliant gateways.`,
  },
  {
    title: "4. Cancellations & Amendments",
    content: `Cancellation and amendment policies vary by service provider (airlines, hotels, tour operators) and fare class. The specific terms applicable to your booking will be communicated at the time of booking and available in your confirmation email.

General cancellation charges:
• Cancellation more than 30 days before departure: up to 25% of booking value
• Cancellation 15–30 days before departure: up to 50% of booking value
• Cancellation 7–14 days before departure: up to 75% of booking value
• Cancellation less than 7 days before departure: up to 100% of booking value

These are indicative figures only; actual charges depend on supplier terms. Non-refundable bookings are clearly indicated at the time of purchase.`,
  },
  {
    title: "5. Passports, Visas & Health Requirements",
    content: `It is your sole responsibility to ensure you hold all necessary travel documents (valid passport, visas, health certificates) required for your journey. We provide visa guidance as a courtesy service only and cannot be held liable for any loss or expense arising from failure to obtain correct documentation.

Passports must generally be valid for at least 6 months beyond your intended return date. Entry requirements can change at short notice; always check with the relevant embassy or consulate before travel.`,
  },
  {
    title: "6. Travel Insurance",
    content: `We strongly recommend that all travellers obtain comprehensive travel insurance prior to departure. Insurance should cover medical emergencies, trip cancellation, personal liability, and loss or theft of property. For certain visa applications (e.g., Schengen), travel insurance is a mandatory requirement.

We offer travel insurance products at checkout; however, these are optional unless your destination requires it. Review the policy wording carefully to ensure coverage meets your needs.`,
  },
  {
    title: "7. Our Liability",
    content: `S International acts as an agent for third-party service providers (airlines, hotels, car hire companies, etc.). We are not liable for any act, omission, or default of such third parties. Our total liability to you for any claim arising from our services shall not exceed the total amount paid by you for the relevant booking, except in cases of death or personal injury caused by our negligence.

We are not responsible for losses arising from events beyond our reasonable control, including but not limited to natural disasters, government actions, strikes, pandemic/epidemic restrictions, or terrorism.`,
  },
  {
    title: "8. Force Majeure",
    content: `Neither party shall be liable for failure to perform obligations where such failure results from circumstances beyond reasonable control, including natural disasters, acts of war, pandemic restrictions, regulatory changes, or other events that could not have been foreseen or prevented. In such cases, we will work with you to find a suitable alternative or provide a credit note, subject to what we can recover from our own suppliers.`,
  },
  {
    title: "9. Complaints",
    content: `If you have a complaint during your trip, please inform the relevant service provider (hotel manager, tour guide, airline) at the time so that they have the opportunity to rectify it. Any unresolved complaints must be reported to us in writing within 28 days of your return.

Email: sagarinternationaltravels@mail.com
Phone: +91 99675 53351

We will acknowledge your complaint within 5 business days and aim to provide a full response within 28 days.`,
  },
  {
    title: "10. Intellectual Property",
    content: `All content on this Site — including text, images, logos, graphics, and software — is the property of S International Travels or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.`,
  },
  {
    title: "11. Privacy",
    content: `Your use of the Site is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information. By using our services, you consent to the practices described in the Privacy Policy.`,
  },
  {
    title: "12. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.`,
  },
  {
    title: "13. Amendments to Terms",
    content: `We reserve the right to amend these Terms at any time. Updated Terms will be posted on this page with a revised effective date. Your continued use of the Site after such changes constitutes your acceptance of the revised Terms. We recommend reviewing this page periodically.`,
  },
];

export function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative bg-primary py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 text-secondary text-sm font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <FileText className="w-4 h-4" />
              Legal
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
              Terms & Conditions
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Please read these terms carefully before making a booking with S International.
            </p>
            <p className="text-white/50 text-sm mt-4">Last updated: June 2025</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Quick nav */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-10">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Contents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SECTIONS.map((s) => (
                <a
                  key={s.title}
                  href={`#${s.title.replace(/\s+/g, "-").toLowerCase()}`}
                  className="text-sm text-primary hover:underline flex items-center gap-1 group"
                >
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {SECTIONS.map((section, i) => (
              <motion.div
                key={section.title}
                id={section.title.replace(/\s+/g, "-").toLowerCase()}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <h2 className="text-xl font-serif font-bold mb-4 text-foreground">{section.title}</h2>
                <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-10 bg-muted/50 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:sagarinternationaltravels@mail.com" className="text-primary hover:underline">
                sagarinternationaltravels@mail.com
              </a>{" "}
              or call <a href="tel:+919967553351" className="text-primary hover:underline">+91 99675 53351</a>.
            </p>
            <Link href="/privacy">
              <span className="text-sm text-primary hover:underline font-medium">
                View our Privacy Policy →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
