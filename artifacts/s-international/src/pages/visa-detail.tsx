import { useState, useRef } from "react";
import { useParams, useSearch, useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Plane, Clock, FileText, User, Upload, CheckCircle2,
  ChevronDown, ChevronUp, AlertCircle, Info, Phone, Send, CreditCard,
  Shield, CheckCheck, Users, Plus, Minus, X, FileBadge2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getVisaCountry, formatPrice, getTagLabel, type VisaType, PASSPORT_COUNTRIES } from "@/lib/visa-service";

/* ── helpers ── */
const STEPS = ["Select Visa", "Review Details", "Documents", "Payment"];

function DocIcon({ type }: { type: string }) {
  const base = "w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center text-primary mx-auto mb-2";
  if (type === "photo") return <div className={base}><User className="h-5 w-5" /></div>;
  if (type === "flight") return <div className={base}><Plane className="h-5 w-5" /></div>;
  if (type === "letter" || type === "form") return <div className={base}><FileText className="h-5 w-5" /></div>;
  return <div className={base}><FileBadge2 className="h-5 w-5" /></div>;
}

function VisaSummaryCard({ passportCode, destCode, destName, destFlag, visa }: {
  passportCode: string; destCode: string; destName: string; destFlag: string; visa: VisaType;
}) {
  const passport = PASSPORT_COUNTRIES.find((c) => c.code === passportCode);
  return (
    <div className="bg-primary text-primary-foreground rounded-2xl overflow-hidden shadow-xl">
      <div className="relative px-5 pt-5 pb-8">
        {/* dashed line */}
        <div className="absolute left-0 right-0 bottom-3 border-t-2 border-dashed border-primary-foreground/20" />
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-primary-foreground/60 text-xs font-medium uppercase tracking-wider">Visa For Citizen Of</p>
            <p className="text-3xl font-black font-serif">{passportCode}</p>
            <p className="text-primary-foreground/70 text-sm">{passport?.name}</p>
          </div>
          <div className="bg-secondary rounded-full p-2.5 shadow-lg">
            <Plane className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div className="text-right">
            <p className="text-primary-foreground/60 text-xs font-medium uppercase tracking-wider">Destination Country</p>
            <p className="text-3xl font-black font-serif">{destCode}</p>
            <p className="text-primary-foreground/70 text-sm">{destName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-primary-foreground/10 rounded-xl p-3">
            <p className="text-primary-foreground/60 text-xs mb-0.5">Visa Type</p>
            <p className="font-semibold text-sm">{visa.type}</p>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-3">
            <p className="text-primary-foreground/60 text-xs mb-0.5">Entry Type</p>
            <p className="font-semibold text-sm">{visa.entryType}</p>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-3">
            <p className="text-primary-foreground/60 text-xs mb-0.5">Validity Period</p>
            <p className="font-semibold text-sm">{visa.validity}</p>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-3">
            <p className="text-primary-foreground/60 text-xs mb-0.5">Stay Period</p>
            <p className="font-semibold text-sm">{visa.stayPeriod}</p>
          </div>
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
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [phoneCode, setPhoneCode] = useState("+91");
  const [phoneNum, setPhoneNum] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [payDone, setPayDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passportError, setPassportError] = useState("");

  // traveller form state
  const [travellers, setTravellers] = useState([{
    firstName: "", lastName: "", dob: "", passport: "", nationality: "Indian", email: "", phone: ""
  }]);

  // uploaded doc names per doc slot
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (!country) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <Globe2 className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Country Not Found</h2>
        <p className="text-muted-foreground mb-6">We don't have visa information for that destination yet.</p>
        <Button onClick={() => setLocation("/visa")}>Back to Visa Services</Button>
      </div>
    );
  }

  const selectedVisa = country.visaTypes.find((v) => v.id === selectedVisaId) ?? country.visaTypes[0];
  const totalGovFee = selectedVisa.govFee * travellerCount;
  const totalServiceFee = selectedVisa.serviceFee * travellerCount;
  const total = totalGovFee + totalServiceFee;

  function validatePassport(val: string) {
    const pattern1 = /^[A-Za-z]\d{6}$/;
    const pattern2 = /^[A-Za-z0-9]{7,9}$/;
    if (!pattern1.test(val) && !pattern2.test(val)) {
      setPassportError("Passport Number is invalid. Use 1 letter + 6 digits (e.g. A123456) or 7–9 alphanumeric characters.");
    } else {
      setPassportError("");
    }
  }

  function handleProceed() {
    if (step === 0 && !travelDate) {
      alert("Please select a travel date to continue.");
      return;
    }
    if (step === 1) {
      for (const t of travellers) {
        if (!t.firstName || !t.lastName || !t.dob || !t.passport || !t.email) {
          alert("Please fill all required traveller details.");
          return;
        }
        if (passportError) {
          alert("Please fix the passport number error.");
          return;
        }
      }
    }
    if (step < 3) setStep(step + 1);
  }

  function handlePayNow() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPayDone(true);
    }, 2000);
  }

  if (payDone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCheck className="h-12 w-12 text-accent" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-3">Application Submitted!</h2>
          <p className="text-muted-foreground mb-2 max-w-md">
            Your {country.name} visa application has been received. Our team will begin processing shortly.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Estimated processing: <span className="font-semibold text-foreground">{selectedVisa.processingTime}</span>
          </p>
          <div className="bg-card border border-card-border rounded-2xl p-6 max-w-sm mx-auto text-left mb-8">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Destination</span><span className="font-medium">{country.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Visa Type</span><span className="font-medium">{selectedVisa.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Travellers</span><span className="font-medium">{travellerCount}</span></div>
              <div className="flex justify-between pt-2 border-t border-border"><span className="font-semibold">Total Paid</span><span className="font-bold text-primary">{formatPrice(total)}</span></div>
            </div>
          </div>
          <Button onClick={() => setLocation("/visa")} variant="outline">Back to Visa Services</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Top bar */}
      <div className="bg-muted/40 border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/visa" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{country.name}</span>
        </div>
      </div>

      {/* Citizenship bar */}
      <div className="bg-foreground/90 text-primary-foreground py-4">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center gap-6 bg-foreground/80 rounded-xl px-6 py-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-primary-foreground/60">With Citizenship Of</span>
              <div className="flex items-center gap-2">
                <span className="text-lg">{PASSPORT_COUNTRIES.find(c => c.code === passportCode)?.flag}</span>
                <span className="font-semibold text-sm">
                  {PASSPORT_COUNTRIES.find(c => c.code === passportCode)?.name ?? passportCode}
                </span>
                <ChevronDown className="h-4 w-4 text-primary-foreground/50" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Plane className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div className="border-t border-dashed border-primary-foreground/30 w-10" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-primary-foreground/60">Destination</span>
              <div className="flex items-center gap-2">
                <span className="text-lg">{country.flag}</span>
                <span className="font-semibold text-sm">{country.name}</span>
                <ChevronDown className="h-4 w-4 text-primary-foreground/50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6">
        {/* Back + title */}
        <button onClick={() => setLocation("/visa")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Visa Services
        </button>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                    i < step ? "bg-primary border-primary text-primary-foreground" :
                    i === step ? "border-primary text-primary bg-primary/10" :
                    "border-muted-foreground/30 text-muted-foreground/50"
                  }`}>
                    {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`hidden sm:block text-xs font-medium ${i === step ? "text-primary" : ""}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-px w-8 ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-serif font-bold text-foreground mb-1">
          {country.name} Visa For {PASSPORT_COUNTRIES.find(c => c.code === passportCode)?.name ?? passportCode}s
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 space-y-4">

            {/* STEP 0: Select Visa + Travel Date */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                {/* Visa type cards */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {country.visaTypes.map((vt) => (
                    <button
                      key={vt.id}
                      onClick={() => setSelectedVisaId(vt.id)}
                      className={`relative text-left rounded-2xl border-2 p-5 min-w-[220px] transition-all ${
                        selectedVisaId === vt.id
                          ? "border-primary bg-primary text-primary-foreground shadow-lg"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      {vt.tag && (
                        <span className={`absolute -top-2.5 right-3 text-xs px-2 py-0.5 rounded-full font-semibold ${
                          selectedVisaId === vt.id ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
                        }`}>
                          {getTagLabel(vt.tag)}
                        </span>
                      )}
                      <h3 className="font-bold mb-3 text-sm">{vt.name}</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        <div>
                          <span className={selectedVisaId === vt.id ? "text-primary-foreground/60" : "text-muted-foreground"}>Type</span>
                          <p className="font-semibold">{vt.type}</p>
                        </div>
                        <div>
                          <span className={selectedVisaId === vt.id ? "text-primary-foreground/60" : "text-muted-foreground"}>Entry</span>
                          <p className="font-semibold">{vt.entryType}</p>
                        </div>
                        <div>
                          <span className={selectedVisaId === vt.id ? "text-primary-foreground/60" : "text-muted-foreground"}>Validity</span>
                          <p className="font-semibold">{vt.validity}</p>
                        </div>
                        <div>
                          <span className={selectedVisaId === vt.id ? "text-primary-foreground/60" : "text-muted-foreground"}>Stay</span>
                          <p className="font-semibold">{vt.stayPeriod}</p>
                        </div>
                      </div>
                      <div className={`mt-3 pt-3 border-t ${selectedVisaId === vt.id ? "border-primary-foreground/20" : "border-border"}`}>
                        <span className={`text-lg font-black ${selectedVisaId === vt.id ? "text-secondary" : "text-secondary"}`}>
                          {formatPrice(vt.serviceFee)}
                        </span>
                        <span className={`text-xs ml-1 ${selectedVisaId === vt.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                          /person
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Travel date */}
                <div className="bg-card border border-card-border rounded-2xl p-5">
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    When Are You Travelling? <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="px-4 py-3 rounded-xl border-2 border-border bg-background text-sm text-foreground focus:border-primary outline-none transition-colors w-full max-w-xs cursor-pointer"
                  />
                </div>

                {/* Required documents */}
                <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setDocsOpen(!docsOpen)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-sm font-bold text-foreground uppercase tracking-wide">Required Documents</span>
                    {docsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  {docsOpen && (
                    <div className="px-5 pb-5">
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {selectedVisa.documents.map((doc) => (
                          <div key={doc.id} className="text-center group">
                            <DocIcon type={doc.icon} />
                            <p className="text-xs text-foreground font-medium leading-snug">{doc.label}</p>
                            {!doc.required && (
                              <p className="text-xs text-muted-foreground">(optional)</p>
                            )}
                            <button className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Info className="h-3 w-3 text-muted-foreground mx-auto" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-muted/40 rounded-xl text-xs text-muted-foreground space-y-1">
                        <p className="font-semibold text-foreground/80">Note:</p>
                        <p>{country.notes}</p>
                        <p className="text-accent font-medium flex items-center gap-1.5 mt-2">
                          <Shield className="h-3 w-3" /> You are now secured with Cyber Protect
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 1: Traveller Details */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">Traveller Details <span className="text-destructive">*</span></h3>
                </div>

                {travellers.map((t, idx) => (
                  <div key={idx} className="bg-card border border-card-border rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">
                          Traveller {idx + 1}{idx === 0 ? " (Applicant)" : ""}
                        </span>
                      </div>
                      {idx > 0 && (
                        <button onClick={() => setTravellers(travellers.filter((_, i) => i !== idx))}>
                          <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1 block">First Name</label>
                        <Input
                          placeholder="First Name"
                          value={t.firstName}
                          onChange={(e) => {
                            const updated = [...travellers];
                            updated[idx].firstName = e.target.value;
                            setTravellers(updated);
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1 block">Last Name</label>
                        <Input
                          placeholder="Last Name"
                          value={t.lastName}
                          onChange={(e) => {
                            const updated = [...travellers];
                            updated[idx].lastName = e.target.value;
                            setTravellers(updated);
                          }}
                        />
                      </div>
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
                          className={idx === 0 && passportError ? "border-destructive" : ""}
                        />
                        {idx === 0 && passportError && (
                          <p className="mt-1.5 text-xs text-amber-600 flex items-start gap-1.5 bg-amber-50 border border-amber-200 p-2 rounded-lg">
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
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:border-primary outline-none transition-colors cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1 block">Email</label>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          value={t.email}
                          onChange={(e) => {
                            const updated = [...travellers];
                            updated[idx].email = e.target.value;
                            setTravellers(updated);
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1 block">Phone</label>
                        <Input
                          placeholder="Phone number"
                          value={t.phone}
                          onChange={(e) => {
                            const updated = [...travellers];
                            updated[idx].phone = e.target.value;
                            setTravellers(updated);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {travellers.length < travellerCount && (
                  <button
                    onClick={() => setTravellers([...travellers, { firstName: "", lastName: "", dob: "", passport: "", nationality: "Indian", email: "", phone: "" }])}
                    className="w-full py-3 border-2 border-dashed border-border rounded-2xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add New Traveller
                  </button>
                )}
              </motion.div>
            )}

            {/* STEP 2: Upload Documents */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-card border border-card-border rounded-2xl p-5">
                  <h3 className="font-bold text-foreground uppercase tracking-wide text-sm mb-5">Upload Documents</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedVisa.documents.map((doc) => (
                      <div key={doc.id}>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          ref={(el) => { fileRefs.current[doc.id] = el; }}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setUploads((prev) => ({ ...prev, [doc.id]: file.name }));
                          }}
                        />
                        <button
                          onClick={() => fileRefs.current[doc.id]?.click()}
                          className={`w-full text-center p-4 rounded-xl border-2 border-dashed transition-all hover:border-primary group ${
                            uploads[doc.id] ? "border-accent bg-accent/5" : "border-border bg-muted/20"
                          }`}
                        >
                          {uploads[doc.id] ? (
                            <>
                              <CheckCircle2 className="h-8 w-8 text-accent mx-auto mb-2" />
                              <p className="text-xs text-accent font-medium truncate">{uploads[doc.id]}</p>
                            </>
                          ) : (
                            <>
                              <DocIcon type={doc.icon} />
                              <p className="text-xs text-foreground font-medium">{doc.label}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {doc.required ? "Required" : "Optional"}
                              </p>
                              <p className="text-xs text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to upload
                              </p>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-muted/40 rounded-xl text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground/80 mb-1">Note:</p>
                    <p>{country.notes}</p>
                    <p className="text-accent font-medium flex items-center gap-1.5 mt-2">
                      <Shield className="h-3 w-3" /> You are now secured with Cyber Protect
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Review & Payment */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-card border border-card-border rounded-2xl p-5">
                  <h3 className="font-bold text-sm uppercase tracking-wide text-foreground mb-4">Review Your Application</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Destination</span>
                      <span className="font-semibold">{country.flag} {country.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Visa Type</span>
                      <span className="font-semibold">{selectedVisa.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Entry</span>
                      <span className="font-semibold">{selectedVisa.entryType}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Validity</span>
                      <span className="font-semibold">{selectedVisa.validity}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Travel Date</span>
                      <span className="font-semibold">{travelDate || "—"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Processing Time</span>
                      <span className="font-semibold text-accent">{selectedVisa.processingTime}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Travellers</span>
                      <span className="font-semibold">{travellerCount}</span>
                    </div>
                  </div>
                </div>

                {/* Payment card */}
                <div className="bg-card border border-card-border rounded-2xl p-5">
                  <h3 className="font-bold text-sm uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" /> Payment Details
                  </h3>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">No Of Travellers <Info className="h-3 w-3" /></span>
                      <span className="font-medium">{travellerCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">Govt. Visa Fees <Info className="h-3 w-3" /></span>
                      <span className="font-medium">{formatPrice(totalGovFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">Service Fees <Info className="h-3 w-3" /></span>
                      <span className="font-medium">{formatPrice(totalServiceFee)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-accent">
                        <span>Promo Discount</span>
                        <span className="font-medium">- {formatPrice(Math.round(totalServiceFee * 0.1))}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-3 border-t border-border text-base font-bold">
                      <span>Total – To Be Paid Now</span>
                      <span className="text-primary">
                        {promoApplied ? formatPrice(Math.round(total * 0.9)) : formatPrice(total)}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="w-full text-base font-bold py-6"
                    onClick={handlePayNow}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : "Pay Now"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
                    <Shield className="h-3 w-3 text-accent" /> Secured with 256-bit SSL encryption
                  </p>
                </div>
              </motion.div>
            )}

            {/* Navigate buttons */}
            <div className="flex gap-3 pt-2">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
              {step < 3 && (
                <Button onClick={handleProceed} className="flex-1 sm:flex-none sm:px-10">
                  {step === 0 ? "Proceed To Fill Details" : step === 1 ? "Proceed to Upload Docs" : "Review & Pay"}
                </Button>
              )}
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="w-full lg:w-80 space-y-4 lg:sticky lg:top-24 lg:self-start">
            {/* Visa summary card */}
            <VisaSummaryCard
              passportCode={passportCode}
              destCode={countryCode ?? ""}
              destName={country.name}
              destFlag={country.flag}
              visa={selectedVisa}
            />

            {/* Travellers selector */}
            <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
              <div className="bg-primary px-4 py-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary-foreground" />
                <span className="font-semibold text-primary-foreground text-sm">Travellers</span>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Applicant</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTravellerCount(Math.max(1, travellerCount - 1))}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-bold w-6 text-center">{travellerCount}</span>
                    <button
                      onClick={() => setTravellerCount(Math.min(10, travellerCount + 1))}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">Govt. Visa Fees <Info className="h-3 w-3" /></span>
                    <span>{formatPrice(totalGovFee)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">Service Fees <Info className="h-3 w-3" /></span>
                    <span>{formatPrice(totalServiceFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                    <span>Total Amount</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">TO BE PAID NOW</p>
                </div>
                {step === 0 && (
                  <Button className="w-full mt-2" onClick={handleProceed}>
                    Proceed To Fill Details
                  </Button>
                )}
              </div>
            </div>

            {/* Promo code */}
            <div className="bg-card border border-card-border rounded-2xl p-4">
              <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-primary">🏷</span> Promo Code
              </p>
              <div className="flex gap-2">
                <input
                  placeholder="Enter coupon code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:border-primary outline-none transition-colors"
                />
                <Button
                  size="sm"
                  disabled={!promoCode}
                  onClick={() => { if (promoCode) setPromoApplied(true); }}
                >
                  Apply
                </Button>
              </div>
              {promoApplied && (
                <p className="text-xs text-accent mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" /> 10% discount applied!
                </p>
              )}
            </div>

            {/* Talk to expert */}
            <div className="bg-card border border-card-border rounded-2xl p-4">
              <p className="font-semibold text-sm text-foreground mb-1">Talk to a Visa Expert</p>
              <p className="text-xs text-muted-foreground mb-4">Still unsure? Talk to our Visa experts for guidance.</p>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 px-2 py-2 border border-border rounded-lg bg-muted/30 text-sm">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <select
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    className="bg-transparent text-xs text-foreground outline-none cursor-pointer"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+971">+971</option>
                  </select>
                </div>
                <input
                  placeholder="Mobile number"
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:border-primary outline-none transition-colors"
                />
              </div>
              <Button
                className="w-full mt-3 gap-2"
                variant="outline"
                onClick={() => { if (phoneNum) { setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); } }}
              >
                {submitted ? (
                  <><CheckCircle2 className="h-4 w-4 text-accent" /> Request Sent!</>
                ) : (
                  <><Send className="h-4 w-4" /> Submit Request</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
