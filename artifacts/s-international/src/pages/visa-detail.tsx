import { useState, useRef } from "react";
import { useParams, useSearch, useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Plane, Clock, FileText, User, CheckCircle2,
  ChevronDown, ChevronUp, AlertCircle, Info, Phone, Send,
  CreditCard, Shield, CheckCheck, Users, Plus, Minus, X,
  FileBadge2, Lock, Smartphone, Wallet, ArrowRight, Tag, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getVisaCountry, formatPrice, formatPriceShort, getTagLabel, getTagColor,
  type VisaType, PASSPORT_COUNTRIES, applyPromo, generateRefNumber, COMMISSION
} from "@/lib/visa-service";

const STEPS = ["Select Visa", "Traveller Details", "Upload Documents", "Payment"];
const CARD_NETWORKS = ["VISA", "MC", "AMEX", "RuPay", "Maestro"];

/* ── Doc icon ── */
function DocIcon({ type }: { type: string }) {
  const base = "w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center text-primary mx-auto mb-2";
  if (type === "photo") return <div className={base}><User className="h-5 w-5" /></div>;
  if (type === "flight" || type === "return-ticket") return <div className={base}><Plane className="h-5 w-5" /></div>;
  if (type === "letter" || type === "form") return <div className={base}><FileText className="h-5 w-5" /></div>;
  return <div className={base}><FileBadge2 className="h-5 w-5" /></div>;
}

/* ── Visa summary card (red sidebar) ── */
function VisaSummaryCard({ passportCode, destCode, destName, visa }: {
  passportCode: string; destCode: string; destName: string; visa: VisaType;
}) {
  const passport = PASSPORT_COUNTRIES.find((c) => c.code === passportCode);
  return (
    <div className="bg-primary text-primary-foreground rounded-2xl overflow-hidden shadow-xl">
      <div className="relative px-5 pt-5 pb-8">
        <div className="absolute left-5 right-5 bottom-4 border-t-2 border-dashed border-primary-foreground/20" />
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-primary-foreground/60 text-[10px] font-semibold uppercase tracking-wider">Visa For Citizen Of</p>
            <p className="text-3xl font-black font-serif leading-none mt-1">{passportCode}</p>
            <p className="text-primary-foreground/70 text-xs mt-0.5">{passport?.name}</p>
          </div>
          <div className="bg-secondary rounded-full p-2.5 shadow-lg">
            <Plane className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div className="text-right">
            <p className="text-primary-foreground/60 text-[10px] font-semibold uppercase tracking-wider">Destination Country</p>
            <p className="text-3xl font-black font-serif leading-none mt-1">{destCode}</p>
            <p className="text-primary-foreground/70 text-xs mt-0.5">{destName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            ["Visa Type", visa.type],
            ["Entry Type", visa.entryType],
            ["Validity Period", visa.validity],
            ["Stay Period", visa.stayPeriod],
          ].map(([label, val]) => (
            <div key={label} className="bg-primary-foreground/10 rounded-xl p-2.5">
              <p className="text-primary-foreground/60 text-[10px] mb-0.5">{label}</p>
              <p className="font-semibold text-xs">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── main component ── */
export function VisaDetail() {
  const { countryCode } = useParams<{ countryCode: string }>();
  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(search);
  const passportCode = params.get("passport") ?? "IND";
  const initDate = params.get("date") ?? "";

  const country = getVisaCountry(countryCode ?? "");

  const [selectedVisaId, setSelectedVisaId] = useState<string>(country?.visaTypes[0]?.id ?? "");
  const [step, setStep] = useState(0);
  const [travelDate, setTravelDate] = useState(initDate);
  const [travellerCount, setTravellerCount] = useState(1);
  const [docsOpen, setDocsOpen] = useState(true);
  const [selectedOptionalDocs, setSelectedOptionalDocs] = useState<Set<string>>(
    () => new Set((country?.visaTypes[0]?.documents ?? []).filter(d => !d.required).map(d => d.id))
  );

  // Traveller form
  const [travellers, setTravellers] = useState([{ firstName: "", lastName: "", dob: "", passport: "", email: "", phone: "" }]);
  const [passportError, setPassportError] = useState("");

  // Uploads
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Payment
  const [payMethod, setPayMethod] = useState("card");
  const [cardFlipped, setCardFlipped] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState<{ valid: boolean; discount: number; message: string } | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [payDone, setPayDone] = useState(false);
  const [refNumber] = useState(() => generateRefNumber());

  // Expert talk
  const [phoneCode, setPhoneCode] = useState("+91");
  const [phoneNum, setPhoneNum] = useState("");
  const [expertSubmitted, setExpertSubmitted] = useState(false);

  if (!country) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <Globe className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Country Not Found</h2>
        <p className="text-muted-foreground mb-6">We don't have visa info for that destination yet.</p>
        <Button onClick={() => setLocation("/visa")}>Back to Visa Services</Button>
      </div>
    );
  }

  const selectedVisa = country.visaTypes.find((v) => v.id === selectedVisaId) ?? country.visaTypes[0];
  const totalGovFee = selectedVisa.govFee * travellerCount;
  const totalServiceFee = selectedVisa.serviceFee * travellerCount;
  const subtotal = totalGovFee + totalServiceFee;
  const promoDiscount = promoResult?.valid ? promoResult.discount : 0;
  const grandTotal = Math.max(0, subtotal - promoDiscount);

  function validatePassport(val: string) {
    const p1 = /^[A-Za-z]\d{6}$/;
    const p2 = /^[A-Za-z0-9]{7,9}$/;
    setPassportError(!p1.test(val) && !p2.test(val)
      ? "Passport Number is invalid. Use 1 letter + 6 digits (e.g. A123456) or 7–9 alphanumeric characters."
      : "");
  }

  function handleProceed() {
    if (step === 0) {
      if (!travelDate) { alert("Please select a travel date to continue."); return; }
    }
    if (step === 1) {
      for (const t of travellers) {
        if (!t.firstName || !t.lastName || !t.dob || !t.passport || !t.email) {
          alert("Please fill all required traveller details."); return;
        }
      }
      if (passportError) { alert("Please fix the passport number error."); return; }
    }
    setStep(s => s + 1);
  }

  function handleApplyPromo() {
    if (!promoCode.trim()) return;
    setPromoResult(applyPromo(promoCode, subtotal));
  }

  function handlePayNow(e: React.FormEvent) {
    e.preventDefault();
    if (payMethod === "card" && (!cardNumber || !cardName || !expiry || !cvv)) {
      alert("Please fill all card details."); return;
    }
    setPayLoading(true);
    setTimeout(() => { setPayLoading(false); setPayDone(true); }, 2200);
  }

  /* ── Success screen ── */
  if (payDone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.6 }}>
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCheck className="h-12 w-12 text-accent" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Application Submitted!</h2>
          <p className="text-muted-foreground mb-1 max-w-md">Your {country.name} {selectedVisa.type} Visa application has been received and payment confirmed.</p>
          <p className="text-sm text-muted-foreground mb-2">Estimated processing: <span className="font-semibold text-foreground">{selectedVisa.processingTime}</span></p>
          <div className="bg-primary/5 border border-primary/20 rounded-xl px-6 py-3 inline-block mb-8">
            <p className="text-xs text-muted-foreground">Application Reference</p>
            <p className="text-xl font-mono font-black text-primary tracking-widest">{refNumber}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Save this for status tracking</p>
          </div>
          <div className="bg-card border border-card-border rounded-2xl p-6 max-w-sm mx-auto text-left mb-8 shadow-lg">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Payment Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Destination</span><span className="font-medium">{country.flag} {country.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Visa Type</span><span className="font-medium">{selectedVisa.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Travellers</span><span className="font-medium">{travellerCount}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Govt. Fee</span><span className="font-medium">{formatPrice(totalGovFee)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Service Fee</span><span className="font-medium">{formatPrice(totalServiceFee)}</span></div>
              {promoDiscount > 0 && <div className="flex justify-between text-accent"><span>Promo Discount</span><span>- {formatPriceShort(promoDiscount)}</span></div>}
              <div className="flex justify-between pt-2 border-t border-border text-base font-bold">
                <span>Total Paid</span><span className="text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setLocation("/visa/status")}>Track Application</Button>
            <Button onClick={() => setLocation("/visa")}>Apply Another Visa</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Breadcrumb */}
      <div className="bg-muted/40 border-b border-border">
        <div className="container mx-auto px-4 py-2.5 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/visa" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{country.name}</span>
        </div>
      </div>

      {/* Citizenship bar */}
      <div className="bg-foreground/90 text-primary-foreground py-3">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center gap-5 bg-foreground/80 rounded-xl px-5 py-2.5">
            <div>
              <p className="text-[10px] text-primary-foreground/60 uppercase tracking-wider">With Citizenship Of</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span>{PASSPORT_COUNTRIES.find(c => c.code === passportCode)?.flag}</span>
                <span className="font-semibold text-sm">{PASSPORT_COUNTRIES.find(c => c.code === passportCode)?.name ?? passportCode}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Plane className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div className="border-t border-dashed border-primary-foreground/30 w-12 mt-1" />
            </div>
            <div>
              <p className="text-[10px] text-primary-foreground/60 uppercase tracking-wider">Destination</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span>{country.flag}</span>
                <span className="font-semibold text-sm">{country.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-5">
        <button onClick={() => setLocation("/visa")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-5">
          <ArrowLeft className="h-4 w-4" /> Back to Visa Services
        </button>

        {/* Step bar */}
        <div className="flex items-center gap-1 mb-7 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 shrink-0">
              <div className={`flex items-center gap-2 ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors shrink-0 ${
                  i < step ? "bg-primary border-primary text-primary-foreground" :
                  i === step ? "border-primary text-primary bg-primary/10" :
                  "border-muted-foreground/30 text-muted-foreground/50"
                }`}>
                  {i < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={`hidden sm:block text-xs font-medium whitespace-nowrap ${i === step ? "text-primary font-semibold" : ""}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-6 md:w-10 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <h2 className="text-lg font-serif font-bold text-foreground mb-5">
          {country.name} Visa For {PASSPORT_COUNTRIES.find(c => c.code === passportCode)?.name ?? passportCode}s
        </h2>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── LEFT ── */}
          <div className="flex-1 space-y-4 min-w-0">

            {/* STEP 0 */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Visa cards */}
                <div className="flex flex-wrap gap-3">
                  {country.visaTypes.map((vt) => (
                    <button
                      key={vt.id}
                      onClick={() => { setSelectedVisaId(vt.id); setSelectedOptionalDocs(new Set(vt.documents.filter(d => !d.required).map(d => d.id))); }}
                      className={`relative text-left rounded-2xl border-2 p-5 min-w-[200px] max-w-[260px] transition-all ${
                        selectedVisaId === vt.id
                          ? "border-primary bg-primary text-primary-foreground shadow-lg"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      {vt.tag && (
                        <span className={`absolute -top-2.5 right-3 text-[10px] px-2 py-0.5 rounded-full font-bold ${getTagColor(vt.tag)}`}>
                          {getTagLabel(vt.tag)}
                        </span>
                      )}
                      <h3 className="font-bold mb-3 text-sm leading-tight">{vt.name}</h3>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                        {[["Type", vt.type], ["Entry", vt.entryType], ["Validity", vt.validity], ["Stay", vt.stayPeriod]].map(([l, v]) => (
                          <div key={l}>
                            <span className={`block ${selectedVisaId === vt.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{l}</span>
                            <span className="font-semibold">{v}</span>
                          </div>
                        ))}
                      </div>
                      <div className={`mt-3 pt-3 border-t ${selectedVisaId === vt.id ? "border-primary-foreground/20" : "border-border"}`}>
                        <div className="flex items-end gap-1">
                          <span className="text-base font-black text-secondary">{formatPriceShort(vt.govFee + vt.serviceFee)}</span>
                          <span className={`text-[10px] pb-0.5 ${selectedVisaId === vt.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>/person (incl. ₹500 service)</span>
                        </div>
                        <p className={`text-[10px] mt-0.5 flex items-center gap-1 ${selectedVisaId === vt.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                          <Clock className="h-2.5 w-2.5" /> {vt.processingTime}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Travel date */}
                <div className="bg-card border border-card-border rounded-2xl p-5">
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    When Are You Travelling? <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:border-primary outline-none transition-colors w-full max-w-xs cursor-pointer"
                  />
                </div>

                {/* Required Documents */}
                <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setDocsOpen(!docsOpen)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Required Documents</span>
                    {docsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  <AnimatePresence>
                    {docsOpen && (
                      <motion.div key="docs" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-5 pb-5">
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {selectedVisa.documents.map((doc) => {
                              const isOptional = !doc.required;
                              const isIncluded = !isOptional || selectedOptionalDocs.has(doc.id);
                              return (
                                <div
                                  key={doc.id}
                                  className={`text-center relative rounded-xl p-1 transition-all ${
                                    isOptional
                                      ? isIncluded
                                        ? "cursor-pointer hover:bg-muted/40"
                                        : "cursor-pointer opacity-40 hover:opacity-60"
                                      : ""
                                  }`}
                                  onClick={isOptional ? () => {
                                    setSelectedOptionalDocs(prev => {
                                      const next = new Set(prev);
                                      if (next.has(doc.id)) next.delete(doc.id);
                                      else next.add(doc.id);
                                      return next;
                                    });
                                  } : undefined}
                                  title={isOptional ? (isIncluded ? "Click to exclude this optional document" : "Click to include this optional document") : undefined}
                                >
                                  {isOptional && !isIncluded && (
                                    <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-destructive/80 flex items-center justify-center">
                                      <X className="h-2.5 w-2.5 text-white" />
                                    </div>
                                  )}
                                  {isOptional && isIncluded && (
                                    <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                                      <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                                    </div>
                                  )}
                                  <DocIcon type={doc.icon} />
                                  <p className="text-xs text-foreground font-medium leading-snug">{doc.label}</p>
                                  {isOptional && (
                                    <p className={`text-[10px] font-medium ${isIncluded ? "text-accent" : "text-muted-foreground"}`}>
                                      {isIncluded ? "included" : "excluded"}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
                            <span className="inline-block w-3 h-3 rounded-full bg-accent/80 shrink-0" /> Optional documents are included by default — click any to toggle them on or off.
                          </p>
                          <div className="mt-3 p-3 bg-muted/40 rounded-xl text-xs text-muted-foreground space-y-1">
                            <p className="font-semibold text-foreground/80">Note:</p>
                            <p>{country.countryNotes ?? "Additional documents may be required by the Embassy. Final decision is at the discretion of the Embassy."}</p>
                            <p className="text-accent font-medium flex items-center gap-1.5 mt-2">
                              <Shield className="h-3 w-3" /> You are now secured with Cyber Protect
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* STEP 1 – Traveller Details */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {travellers.map((t, idx) => (
                  <div key={idx} className="bg-card border border-card-border rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-sm font-semibold">Traveller {idx + 1}{idx === 0 ? " (Applicant)" : ""}</span>
                      </div>
                      {idx > 0 && (
                        <button onClick={() => setTravellers(travellers.filter((_, i) => i !== idx))}>
                          <X className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "First Name", key: "firstName", placeholder: "First Name" },
                        { label: "Last Name", key: "lastName", placeholder: "Last Name" },
                        { label: "Email", key: "email", placeholder: "email@example.com", type: "email" },
                        { label: "Phone", key: "phone", placeholder: "Phone number" },
                      ].map(({ label, key, placeholder, type }) => (
                        <div key={key}>
                          <label className="text-xs text-muted-foreground font-medium mb-1 block">{label}</label>
                          <Input
                            type={type ?? "text"}
                            placeholder={placeholder}
                            value={(t as any)[key]}
                            onChange={(e) => {
                              const updated = [...travellers];
                              (updated[idx] as any)[key] = e.target.value;
                              setTravellers(updated);
                            }}
                          />
                        </div>
                      ))}
                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1 block">Passport Number</label>
                        <Input
                          placeholder="e.g. A123456"
                          value={t.passport}
                          onChange={(e) => {
                            const updated = [...travellers];
                            updated[idx].passport = e.target.value;
                            setTravellers(updated);
                            if (idx === 0) validatePassport(e.target.value);
                          }}
                          className={idx === 0 && passportError ? "border-amber-400" : ""}
                        />
                        {idx === 0 && passportError && (
                          <p className="mt-1.5 text-xs text-amber-700 flex items-start gap-1.5 bg-amber-50 border border-amber-200 p-2 rounded-lg">
                            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {passportError}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1 block">Date of Birth</label>
                        <input
                          type="date"
                          value={t.dob}
                          onChange={(e) => {
                            const updated = [...travellers];
                            updated[idx].dob = e.target.value;
                            setTravellers(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-primary outline-none transition-colors cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {travellers.length < travellerCount && (
                  <button
                    onClick={() => setTravellers([...travellers, { firstName: "", lastName: "", dob: "", passport: "", email: "", phone: "" }])}
                    className="w-full py-3 border-2 border-dashed border-border rounded-2xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add New Traveller
                  </button>
                )}
              </motion.div>
            )}

            {/* STEP 2 – Upload Documents */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                {/* Checklist progress tracker */}
                {(() => {
                  const allDocs = selectedVisa.documents.filter(doc => doc.required || selectedOptionalDocs.has(doc.id));
                  const requiredDocs = allDocs.filter(d => d.required);
                  const optionalDocs = allDocs.filter(d => !d.required);
                  const requiredUploaded = requiredDocs.filter(d => uploads[d.id]).length;
                  const optionalUploaded = optionalDocs.filter(d => uploads[d.id]).length;
                  const totalUploaded = requiredUploaded + optionalUploaded;
                  const totalDocs = allDocs.length;
                  const pct = totalDocs > 0 ? Math.round((totalUploaded / totalDocs) * 100) : 0;
                  const allRequiredDone = requiredUploaded === requiredDocs.length;
                  return (
                    <div className="bg-card border border-card-border rounded-2xl p-4 mb-3">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">Upload Progress</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${allRequiredDone ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
                          {allRequiredDone ? "Ready to proceed" : "Required docs pending"}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                        <motion.div
                          className="h-full rounded-full bg-accent"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${requiredUploaded === requiredDocs.length && requiredDocs.length > 0 ? "bg-accent" : "bg-destructive/70"}`} />
                          <span className="text-xs text-muted-foreground">
                            Required: <span className="font-semibold text-foreground">{requiredUploaded}/{requiredDocs.length}</span>
                          </span>
                        </div>
                        {optionalDocs.length > 0 && (
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${optionalUploaded === optionalDocs.length ? "bg-accent" : "bg-muted-foreground/40"}`} />
                            <span className="text-xs text-muted-foreground">
                              Optional: <span className="font-semibold text-foreground">{optionalUploaded}/{optionalDocs.length}</span>
                            </span>
                          </div>
                        )}
                        <div className="ml-auto text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">{totalUploaded}</span>/{totalDocs} uploaded
                        </div>
                      </div>
                    </div>
                  );
                })()}
                <div className="bg-card border border-card-border rounded-2xl p-5">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-foreground mb-5">Upload Documents</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedVisa.documents.filter(doc => doc.required || selectedOptionalDocs.has(doc.id)).map((doc) => (
                      <div key={doc.id}>
                        <input
                          type="file" accept=".pdf,.jpg,.jpeg,.png"
                          ref={(el) => { fileRefs.current[doc.id] = el; }}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setUploads(prev => ({ ...prev, [doc.id]: file.name }));
                          }}
                        />
                        <button
                          onClick={() => fileRefs.current[doc.id]?.click()}
                          className={`w-full text-center p-4 rounded-xl border-2 border-dashed transition-all hover:border-primary group ${
                            uploads[doc.id] ? "border-accent bg-accent/5" : "border-border bg-muted/20"
                          }`}
                        >
                          {uploads[doc.id] ? (
                            <><CheckCircle2 className="h-8 w-8 text-accent mx-auto mb-2" /><p className="text-xs text-accent font-medium truncate">{uploads[doc.id]}</p></>
                          ) : (
                            <><DocIcon type={doc.icon} /><p className="text-xs text-foreground font-medium">{doc.label}</p><p className="text-xs text-muted-foreground">{doc.required ? "Required" : "Optional"}</p><p className="text-xs text-primary mt-1 opacity-0 group-hover:opacity-100">Click to upload</p></>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-muted/40 rounded-xl text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground/80 mb-1">Note:</p>
                    <p>{country.countryNotes ?? "Additional documents may be required. Final decision is at Embassy's discretion."}</p>
                    <p className="text-accent font-medium flex items-center gap-1.5 mt-2"><Shield className="h-3 w-3" /> Secured with Cyber Protect</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3 – PAYMENT GATEWAY */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Animated card preview */}
                {payMethod === "card" && (
                  <motion.div
                    className="relative h-48 rounded-2xl overflow-hidden cursor-pointer select-none"
                    style={{ perspective: 1000 }}
                    onClick={() => setCardFlipped(f => !f)}
                    title="Click to flip"
                  >
                    <motion.div
                      className="w-full h-full relative"
                      animate={{ rotateY: cardFlipped ? 180 : 0 }}
                      transition={{ duration: 0.5 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between"
                        style={{ background: "linear-gradient(135deg, hsl(236 72% 15%), hsl(236 72% 25%), hsl(24 94% 40%))", backfaceVisibility: "hidden" }}>
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-white/60" />
                          </div>
                          <div className="text-white/80 text-sm font-bold tracking-widest">VISA</div>
                        </div>
                        <div>
                          <div className="text-white font-mono text-lg tracking-widest mb-2">
                            {cardNumber ? cardNumber.replace(/\d{4}(?=.)/g, "$& ") : "•••• •••• •••• ••••"}
                          </div>
                          <div className="flex justify-between text-white/80 text-xs">
                            <div><div className="text-white/50 text-xs mb-0.5">CARD HOLDER</div>{cardName || "YOUR NAME"}</div>
                            <div className="text-right"><div className="text-white/50 text-xs mb-0.5">EXPIRES</div>{expiry || "MM/YY"}</div>
                          </div>
                        </div>
                      </div>
                      {/* Back */}
                      <div className="absolute inset-0 rounded-2xl"
                        style={{ background: "linear-gradient(135deg, hsl(236 60% 20%), hsl(236 72% 15%))", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                        <div className="mt-8 bg-black/40 h-12" />
                        <div className="px-6 pt-4 flex justify-end">
                          <div className="bg-white rounded px-3 py-2 font-mono text-sm font-bold text-foreground min-w-[60px] text-center">{cvv || "•••"}</div>
                        </div>
                        <div className="px-6 pt-2 text-white/50 text-xs text-right">CVV</div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
                  {/* Promo code at top of payment */}
                  <div className="px-6 pt-5 pb-4 border-b border-border">
                    <p className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <Tag className="h-4 w-4 text-secondary" /> Promo / Coupon Code
                    </p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          placeholder="Enter promo code (try VISA10)"
                          value={promoCode}
                          onChange={(e) => { setPromoCode(e.target.value); setPromoResult(null); }}
                          className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background focus:border-secondary outline-none transition-colors font-medium tracking-wider uppercase"
                        />
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0" onClick={handleApplyPromo} disabled={!promoCode.trim()}>
                        Apply
                      </Button>
                    </div>
                    {promoResult && (
                      <p className={`text-xs mt-2 flex items-center gap-1.5 ${promoResult.valid ? "text-accent" : "text-destructive"}`}>
                        {promoResult.valid ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                        {promoResult.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1.5">Try: <span className="font-mono font-semibold text-foreground">VISA10</span>, <span className="font-mono font-semibold text-foreground">FIRST15</span>, <span className="font-mono font-semibold text-foreground">SINT20</span>, <span className="font-mono font-semibold text-foreground">SAVE100</span></p>
                  </div>

                  {/* Payment methods */}
                  <div className="px-6 pt-5">
                    <Tabs value={payMethod} onValueChange={setPayMethod}>
                      <TabsList className="grid grid-cols-3 mb-5 bg-muted/50 p-1 rounded-xl">
                        <TabsTrigger value="card" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 font-semibold">
                          <CreditCard className="w-4 h-4" /> Card
                        </TabsTrigger>
                        <TabsTrigger value="upi" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 font-semibold">
                          <Smartphone className="w-4 h-4" /> UPI
                        </TabsTrigger>
                        <TabsTrigger value="wallet" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 font-semibold">
                          <Wallet className="w-4 h-4" /> Wallets
                        </TabsTrigger>
                      </TabsList>

                      <form id="visa-pay-form" onSubmit={handlePayNow}>
                        <TabsContent value="card" className="space-y-4 outline-none">
                          <div className="space-y-1.5">
                            <Label className="font-semibold text-sm">Cardholder Name</Label>
                            <Input value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} placeholder="AS ON CARD" className="bg-muted/40 rounded-xl h-11 font-mono tracking-wider" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="font-semibold text-sm">Card Number</Label>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                                placeholder="0000 0000 0000 0000"
                                className="pl-10 bg-muted/40 rounded-xl h-11 font-mono tracking-widest"
                              />
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {CARD_NETWORKS.map(n => (
                                <span key={n} className="text-xs bg-muted border border-border rounded px-1.5 py-0.5 text-muted-foreground font-mono">{n}</span>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="font-semibold text-sm">Expiry Date</Label>
                              <Input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM / YY" className="bg-muted/40 rounded-xl h-11 font-mono" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="font-semibold text-sm">CVV</Label>
                              <Input
                                value={cvv}
                                onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                placeholder="•••"
                                type="password"
                                maxLength={4}
                                onFocus={() => setCardFlipped(true)}
                                onBlur={() => setCardFlipped(false)}
                                className="bg-muted/40 rounded-xl h-11 font-mono"
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="upi" className="space-y-4 outline-none">
                          <div className="space-y-1.5">
                            <Label className="font-semibold text-sm">UPI ID / VPA</Label>
                            <Input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" className="bg-muted/40 rounded-xl h-11" />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            {["GPay", "PhonePe", "Paytm"].map(app => (
                              <button key={app} type="button" onClick={() => setUpiId(`${app.toLowerCase()}@upi`)}
                                className="h-14 rounded-xl border-2 border-border hover:border-primary text-sm font-bold transition-colors bg-muted/30 hover:bg-primary/5">
                                {app}
                              </button>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground bg-muted/40 rounded-xl p-3">
                            A payment request will be sent to your UPI app. Please approve within 5 minutes.
                          </p>
                        </TabsContent>

                        <TabsContent value="wallet" className="space-y-4 outline-none">
                          <div className="grid grid-cols-2 gap-3">
                            {["PayPal", "Amazon Pay", "Mobikwik", "Ola Money"].map(w => (
                              <button key={w} type="button"
                                className="h-16 rounded-xl border-2 border-border hover:border-primary font-bold transition-colors bg-muted/30 hover:bg-primary/5 text-sm">
                                {w}
                              </button>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground text-center">You'll be redirected to authenticate and complete payment.</p>
                        </TabsContent>
                      </form>
                    </Tabs>
                  </div>

                  {/* Pay button */}
                  <div className="px-6 pb-6 pt-4">
                    <Button
                      type="submit"
                      form="visa-pay-form"
                      className="w-full h-13 text-base bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-bold shadow-lg py-4"
                      disabled={payLoading}
                    >
                      {payLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
                          Processing Payment...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Pay {formatPriceShort(grandTotal)} Securely
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: <Shield className="w-5 h-5 text-emerald-600" />, label: "256-bit SSL", sub: "Encryption" },
                    { icon: <Lock className="w-5 h-5 text-primary" />, label: "PCI DSS", sub: "Compliant" },
                    { icon: <CheckCircle2 className="w-5 h-5 text-accent" />, label: "RBI", sub: "Approved" },
                  ].map(({ icon, label, sub }) => (
                    <div key={label} className="bg-card border border-border rounded-xl p-3 flex flex-col items-center text-center">
                      {icon}
                      <div className="font-bold text-xs mt-1">{label}</div>
                      <div className="text-muted-foreground text-xs">{sub}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Nav buttons */}
            <div className="flex gap-3 pt-1">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(s => s - 1)}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
              {step < 3 && (
                <Button onClick={handleProceed} className="flex-1 sm:flex-none sm:px-10 gap-2">
                  {step === 0 ? "Proceed To Fill Details" : step === 1 ? "Proceed to Upload Docs" : "Proceed to Payment"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="w-full lg:w-80 space-y-4 lg:sticky lg:top-24 lg:self-start">
            <VisaSummaryCard
              passportCode={passportCode}
              destCode={countryCode ?? ""}
              destName={country.name}
              visa={selectedVisa}
            />

            {/* Traveller count + price */}
            <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
              <div className="bg-primary px-4 py-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary-foreground" />
                <span className="font-semibold text-primary-foreground text-sm">Travellers</span>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Applicant(s)</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setTravellerCount(Math.max(1, travellerCount - 1))}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-bold w-6 text-center">{travellerCount}</span>
                    <button onClick={() => setTravellerCount(Math.min(10, travellerCount + 1))}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1">Govt. Visa Fees <Info className="h-3 w-3" /></span>
                    <span>{formatPrice(totalGovFee)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1">S International Service Fee <Info className="h-3 w-3" /></span>
                    <span>{formatPrice(totalServiceFee)}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-accent font-medium">
                      <span>Promo Discount</span>
                      <span>- {formatPriceShort(promoDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                    <span>Total Amount</span>
                    <span className="text-primary text-base">{formatPrice(grandTotal)}</span>
                  </div>
                  <p className="text-center text-muted-foreground uppercase tracking-wider text-[10px]">TO BE PAID NOW</p>
                </div>

                <div className="bg-secondary/10 rounded-xl p-2.5 text-xs text-muted-foreground flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
                  <span>Includes ₹{COMMISSION} S International service commission per person</span>
                </div>
              </div>
            </div>

            {/* Talk to expert */}
            <div className="bg-card border border-card-border rounded-2xl p-4">
              <p className="font-semibold text-sm text-foreground mb-0.5">Talk to a Visa Expert</p>
              <p className="text-xs text-muted-foreground mb-3">Still unsure? Talk to our Visa experts for guidance.</p>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 px-2 py-2 border border-border rounded-lg bg-muted/30">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <select value={phoneCode} onChange={e => setPhoneCode(e.target.value)} className="bg-transparent text-xs outline-none cursor-pointer">
                    {["+91", "+1", "+44", "+61", "+971", "+65", "+81"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <input placeholder="Mobile number" value={phoneNum} onChange={e => setPhoneNum(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:border-primary outline-none" />
              </div>
              <Button className="w-full mt-3 gap-2" variant="outline"
                onClick={() => { if (phoneNum) { setExpertSubmitted(true); setTimeout(() => setExpertSubmitted(false), 3000); } }}>
                {expertSubmitted
                  ? <><CheckCircle2 className="h-4 w-4 text-accent" /> Request Sent!</>
                  : <><Send className="h-4 w-4" /> Submit Request</>}
              </Button>
            </div>

            {/* Status tracker link */}
            <button onClick={() => setLocation("/visa/status")}
              className="w-full text-center text-xs text-primary hover:underline py-1">
              Track existing application →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
