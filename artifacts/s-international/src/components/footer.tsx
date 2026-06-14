import { Link } from "wouter";
import { Plane } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { useCMS } from "@/hooks/useCMS";

export function Footer() {
  const cms = useCMS();

  const tagline = cms("footer_tagline", "Curating exceptional journeys for the discerning traveler. Discover the world with confidence and style.");
  const copyright = cms("footer_copyright", "S International. All rights reserved.");
  const phone = cms("contact_phone", "+91 99675 53351");
  const email = cms("contact_email", "sagarinternationaltravels@mail.com");
  const address = cms("contact_address", "313 Metro Market, Shop No. 2, Abdul Rehman Street, Mumbai – 400008, India");
  const fbUrl = cms("social_facebook", "#");
  const twUrl = cms("social_twitter", "#");
  const igUrl = cms("social_instagram", "#");
  const liUrl = cms("social_linkedin", "#");
  const ytUrl = cms("social_youtube", "");

  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary/20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-primary-foreground mb-4">
              <Plane className="h-6 w-6 rotate-45 text-secondary" />
              <span className="font-serif text-xl font-bold tracking-tight">S International</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">{tagline}</p>
            <div className="flex items-center gap-4">
              {fbUrl && fbUrl !== "#" || true ? (
                <a href={fbUrl || "#"} target={fbUrl && fbUrl !== "#" ? "_blank" : undefined} rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  <FaFacebook className="h-5 w-5" />
                </a>
              ) : null}
              <a href={twUrl || "#"} target={twUrl && twUrl !== "#" ? "_blank" : undefined} rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href={igUrl || "#"} target={igUrl && igUrl !== "#" ? "_blank" : undefined} rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href={liUrl || "#"} target={liUrl && liUrl !== "#" ? "_blank" : undefined} rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                <FaLinkedin className="h-5 w-5" />
              </a>
              {ytUrl && (
                <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  <FaYoutube className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 font-serif text-secondary">Explore</h3>
            <ul className="space-y-3">
              <li><Link href="/flights" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Flights</Link></li>
              <li><Link href="/hotels" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Hotels</Link></li>
              <li><Link href="/packages" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Travel Packages</Link></li>
              <li><Link href="/destinations" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Popular Destinations</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 font-serif text-secondary">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/faq" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/terms" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 font-serif text-secondary">Contact</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              {phone && <li>{phone}</li>}
              {email && <li>{email}</li>}
              {address && (
                <li>
                  {address.split(",").map((line, i, arr) => (
                    <span key={i}>{line.trim()}{i < arr.length - 1 ? <br /> : null}</span>
                  ))}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} {copyright}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>ATOL Protected</span>
            <span>IATA Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
