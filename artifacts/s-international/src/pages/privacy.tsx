import { motion } from "framer-motion";
import { Link } from "wouter";
import { Shield, ArrowRight } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Who We Are",
    content: `S International Travels ("we", "us", "our") is a licensed travel agency based in Mumbai, India. We operate the website at siii-nternational--sagarinternati1.replit.app (the "Site") and offer travel booking services including flights, hotels, and holiday packages.

For privacy-related queries, contact our Data Protection team:
Email: sagarinternationaltravels@mail.com
Phone: +91 99675 53351
Address: 313 Metro Market, Shop No. 2, Abdul Rehman Street, Mumbai – 400008, India`,
  },
  {
    title: "2. Information We Collect",
    content: `We collect the following categories of personal information:

Personal Identification: Full name, date of birth, passport/national ID number, nationality.

Contact Information: Email address, phone number, postal address.

Booking & Travel Data: Itinerary details, seat and meal preferences, frequent flyer numbers, special requirements (e.g., dietary, accessibility needs).

Payment Information: We do not store full card numbers. Payment transactions are handled by PCI-DSS compliant third-party processors who retain only tokenised references.

Technical Data: IP address, browser type and version, device identifiers, pages visited, time spent on pages, referral source. Collected via cookies and similar technologies.

Communication Records: Emails, chat messages, and call records when you contact our support team.`,
  },
  {
    title: "3. How We Use Your Information",
    content: `We use your personal information to:

• Process and manage your travel bookings and payments.
• Communicate with you about your bookings, itinerary changes, and travel advisories.
• Provide customer support and respond to enquiries.
• Comply with legal obligations (e.g., sharing passenger data with airlines and immigration authorities).
• Send you relevant promotional offers and travel inspiration (only with your consent; you may opt out at any time).
• Improve our website, services, and user experience through analytics.
• Detect and prevent fraud and ensure platform security.

We process your data on the legal bases of: contractual necessity (to fulfil your booking), legal obligation, legitimate interests (fraud prevention, service improvement), and consent (marketing communications).`,
  },
  {
    title: "4. Sharing Your Information",
    content: `We share your personal information only where necessary and with appropriate safeguards:

Service Providers: Airlines, hotels, car hire companies, tour operators, and other travel suppliers require your details to fulfil your booking.

Payment Processors: Your payment data is shared with our payment gateway providers solely to process transactions.

Technology Partners: We use trusted third-party tools for website analytics (e.g., Google Analytics), customer support, and email communication. These partners process data on our behalf under strict data processing agreements.

Legal Authorities: We may disclose information to regulatory bodies, law enforcement, or government agencies where required by law or to protect our legal rights.

Business Transfers: In the event of a merger, acquisition, or sale of assets, customer data may be transferred to the successor entity.

We never sell your personal data to third parties for their own marketing purposes.`,
  },
  {
    title: "5. Cookies & Tracking Technologies",
    content: `We use cookies and similar tracking technologies to enhance your experience on our Site.

Strictly Necessary Cookies: Required for the Site to function (e.g., session management, shopping cart). Cannot be disabled.

Analytics Cookies: Help us understand how visitors interact with the Site so we can improve it (e.g., Google Analytics). These are anonymised where possible.

Marketing Cookies: Used to deliver relevant advertisements and track the effectiveness of our campaigns. Only placed with your consent.

You can manage cookie preferences through your browser settings. Note that disabling certain cookies may affect Site functionality. For details on cookies used, refer to our Cookie Policy (available on request).`,
  },
  {
    title: "6. Data Retention",
    content: `We retain your personal data for as long as necessary to:

• Fulfil your booking and provide ongoing customer support.
• Comply with legal, regulatory, and accounting obligations (typically 7 years for financial records in India).
• Resolve disputes and enforce our agreements.

After the applicable retention period, your data is securely deleted or anonymised. You may request earlier deletion subject to any legal obligations we must fulfil.`,
  },
  {
    title: "7. Your Rights",
    content: `Depending on your jurisdiction, you may have the following rights in relation to your personal data:

Right of Access: Request a copy of the personal data we hold about you.
Right to Rectification: Request correction of inaccurate or incomplete data.
Right to Erasure: Request deletion of your data where we no longer have a lawful basis to hold it.
Right to Restriction: Request that we restrict processing of your data in certain circumstances.
Right to Data Portability: Receive your data in a structured, machine-readable format.
Right to Object: Object to processing based on legitimate interests or for direct marketing.
Right to Withdraw Consent: Where processing is based on your consent, you may withdraw it at any time.

To exercise any of these rights, contact us at sagarinternationaltravels@mail.com. We will respond within 30 days.`,
  },
  {
    title: "8. Data Security",
    content: `We implement industry-standard technical and organisational security measures to protect your personal data against unauthorised access, disclosure, alteration, or destruction. These include:

• HTTPS/TLS encryption for all data in transit.
• Access controls and role-based permissions for staff.
• Regular security audits and vulnerability assessments.
• PCI-DSS compliant payment processing.

No method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.`,
  },
  {
    title: "9. International Data Transfers",
    content: `Your data may be transferred to and processed in countries outside India (for example, when you book with international airlines or hotels). Where such transfers occur, we ensure appropriate safeguards are in place, including contractual clauses that provide equivalent data protection standards.`,
  },
  {
    title: "10. Children's Privacy",
    content: `Our services are not directed at children under the age of 18. We do not knowingly collect personal information from minors. If you are a parent or guardian and believe your child has provided us with personal data, please contact us immediately and we will delete the information.`,
  },
  {
    title: "11. Third-Party Links",
    content: `Our Site may contain links to third-party websites (e.g., airline sites, hotel booking portals). We are not responsible for the privacy practices of those sites. We encourage you to read their privacy policies before providing any personal information.`,
  },
  {
    title: "12. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated policy will be posted on this page with a revised effective date. We may also notify you by email for material changes. Your continued use of our services after such changes indicates your acceptance of the updated policy.`,
  },
];

export function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative bg-primary py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 text-secondary text-sm font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              Legal
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Your privacy matters. Here's how S International collects, uses, and protects your personal information.
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
              Questions about your privacy? Contact us at{" "}
              <a href="mailto:sagarinternationaltravels@mail.com" className="text-primary hover:underline">
                sagarinternationaltravels@mail.com
              </a>
            </p>
            <Link href="/terms">
              <span className="text-sm text-primary hover:underline font-medium">
                View our Terms & Conditions →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
