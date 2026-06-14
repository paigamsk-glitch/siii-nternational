import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Globe, Search, ChevronDown, CheckCircle2, Shield, Clock, Star, Award, ArrowRight, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VISA_COUNTRIES, PASSPORT_COUNTRIES } from "@/lib/visa-service";

// ─── 3-letter ISO → 2-letter for flagcdn.com ─────────────────────────────
const ISO3: Record<string, string> = {
  IND:"in", USA:"us", GBR:"gb", AUS:"au", CAN:"ca", DEU:"de", FRA:"fr",
  ARE:"ae", SGP:"sg", ZAF:"za", NGA:"ng", PAK:"pk", BGD:"bd", LKA:"lk", NPL:"np",
  BRA:"br", ARG:"ar", MEX:"mx", ITA:"it", ESP:"es", NLD:"nl", CHE:"ch", GRC:"gr",
  PRT:"pt", SWE:"se", NOR:"no", AUT:"at", IRL:"ie", RUS:"ru", TUR:"tr", BEL:"be",
  POL:"pl", DNK:"dk", FIN:"fi", SAU:"sa", QAT:"qa", BHR:"bh", OMN:"om", KWT:"kw",
  NZL:"nz", JPN:"jp", KOR:"kr", CHN:"cn", THA:"th", VNM:"vn", IDN:"id", MYS:"my",
  PHL:"ph", MDV:"mv", KEN:"ke", TZA:"tz", ETH:"et", EGY:"eg", MAR:"ma", BTN:"bt",
  CHI:"ch", SRB:"rs", HRV:"hr", ROU:"ro", BGR:"bg", HUN:"hu", CZE:"cz", SVK:"sk",
  SVN:"si", EST:"ee", LVA:"lv", LTU:"lt", ISL:"is", MLT:"mt", LUX:"lu", CYP:"cy",
  UKR:"ua", BLR:"by", GEO:"ge", ARM:"am", AZE:"az", KAZ:"kz", UZB:"uz", MNG:"mn",
  TWN:"tw", HKG:"hk", MAC:"mo", BRN:"bn", KHM:"kh", LAO:"la", MMR:"mm", TLS:"tl",
  NIC:"ni", GTM:"gt", HND:"hn", SLV:"sv", CRI:"cr", PAN:"pa", CUB:"cu", JAM:"jm",
  HTI:"ht", DOM:"do", PRI:"pr", TTO:"tt", COL:"co", VEN:"ve", PER:"pe", ECU:"ec",
  BOL:"bo", CHL:"cl", PRY:"py", URY:"uy", GUY:"gy", SUR:"sr", ZWE:"zw", ZMB:"zm",
  MOZ:"mz", MWI:"mw", UGA:"ug", RWA:"rw", TUN:"tn", LBY:"ly", DZA:"dz", GHA:"gh",
  CMR:"cm", CIV:"ci", SEN:"sn", MLI:"ml", NER:"ne", TCD:"td", SDN:"sd", SOM:"so",
  PYF:"pf", NCL:"nc",
};

function flagUrl(iso3: string): string {
  const code = ISO3[iso3] ?? iso3.slice(0, 2).toLowerCase();
  return `https://flagcdn.com/w20/${code}.png`;
}

function FlagImg({ iso3, size = 20 }: { iso3: string; size?: number }) {
  return (
    <img
      src={flagUrl(iso3)}
      alt={iso3}
      width={size}
      height={Math.round(size * 0.75)}
      className="rounded-sm object-cover shrink-0"
      style={{ width: size, height: Math.round(size * 0.75) }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

const POPULAR = ["USA", "GBR", "CAN", "AUS", "ARE", "FRA", "SGP", "JPN", "THA", "ARG"];

const WHY_US = [
  { icon: Shield, title: "Secure & Safe", desc: "Your documents are handled with bank-level encryption and confidentiality." },
  { icon: CheckCircle2, title: "Expert Quality Check", desc: "Every application is reviewed by certified immigration specialists." },
  { icon: Clock, title: "Speed & Simplicity", desc: "Easy online process — fill once, submit once, track in real time." },
  { icon: Award, title: "Awesome Support", desc: "Dedicated visa experts available 7 days a week to assist you." },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Select & Upload", desc: "Choose your destination visa and upload the required documents." },
  { step: 2, title: "We Do All The Work", desc: "Our team fills the forms and submits to the Department of Immigration." },
  { step: 3, title: "Receive Visa", desc: "Real-time status updates will keep you informed until delivery." },
];

export function Visa() {
  const [, setLocation] = useLocation();
  const [passportCode, setPassportCode] = useState("IND");
  const [destCode, setDestCode] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [passportOpen, setPassportOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [destSearch, setDestSearch] = useState("");
  const [passportSearch, setPassportSearch] = useState("");

  const selectedPassport = PASSPORT_COUNTRIES.find((c) => c.code === passportCode);
  const selectedDest = VISA_COUNTRIES.find((c) => c.code === destCode);

  const filteredDest = VISA_COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(destSearch.toLowerCase()) ||
    c.code.toLowerCase().includes(destSearch.toLowerCase())
  );
  const filteredPassport = PASSPORT_COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(passportSearch.toLowerCase()) ||
    c.code.toLowerCase().includes(passportSearch.toLowerCase())
  );

  function handleCheck() {
    if (!destCode) return;
    setLocation(`/visa/${destCode}?passport=${passportCode}${travelDate ? `&date=${travelDate}` : ""}`);
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-16 pb-40 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white/80 text-sm font-medium mb-6">
              <Globe className="h-4 w-4" /> Visa Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight">
              Quicker, Easier,<br />
              <span className="text-secondary">Smarter Visas</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
              S International simplifies your visa application with personalized assistance from start to finish.
              We help you fill and submit visa forms, and even pre-fill forms for future applications.
            </p>
          </motion.div>

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Passport Country */}
              <div className="relative">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Nationality
                </label>
                <button
                  type="button"
                  onClick={() => { setPassportOpen(!passportOpen); setDestOpen(false); setPassportSearch(""); }}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border-2 border-border bg-white hover:border-primary transition-colors text-sm font-medium text-foreground"
                >
                  <span className="flex items-center gap-2">
                    {selectedPassport && <FlagImg iso3={selectedPassport.code} />}
                    <span>{selectedPassport?.name ?? "Select"}</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${passportOpen ? "rotate-180" : ""}`} />
                </button>
                {passportOpen && (
                  <div className="absolute top-full mt-1 left-0 w-full bg-white border border-border rounded-xl shadow-xl z-50">
                    <div className="p-2 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                          autoFocus
                          placeholder="Search country..."
                          value={passportSearch}
                          onChange={(e) => setPassportSearch(e.target.value)}
                          className="w-full pl-7 pr-6 py-1.5 text-sm bg-muted rounded-lg outline-none"
                        />
                        {passportSearch && (
                          <button onClick={() => setPassportSearch("")} className="absolute right-2 top-2">
                            <X className="h-3 w-3 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredPassport.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => { setPassportCode(c.code); setPassportOpen(false); setPassportSearch(""); }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left ${c.code === passportCode ? "bg-primary/5 font-semibold text-primary" : ""}`}
                        >
                          <FlagImg iso3={c.code} /> {c.name}
                        </button>
                      ))}
                      {filteredPassport.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm py-4">No results found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Destination Country */}
              <div className="relative">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Destination
                </label>
                <button
                  type="button"
                  onClick={() => { setDestOpen(!destOpen); setPassportOpen(false); }}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border-2 transition-colors text-sm font-medium ${
                    destCode ? "border-primary text-foreground" : "border-border text-muted-foreground"
                  } bg-white hover:border-primary`}
                >
                  <span className="flex items-center gap-2">
                    {selectedDest ? (
                      <><FlagImg iso3={selectedDest.code} /><span>{selectedDest.name}</span></>
                    ) : (
                      <><Search className="h-4 w-4" /><span>Search destination</span></>
                    )}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${destOpen ? "rotate-180" : ""}`} />
                </button>
                {destOpen && (
                  <div className="absolute top-full mt-1 left-0 w-full bg-white border border-border rounded-xl shadow-xl z-50">
                    <div className="p-2 border-b border-border">
                      <input
                        autoFocus
                        placeholder="Search country..."
                        value={destSearch}
                        onChange={(e) => setDestSearch(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-muted rounded-lg outline-none"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredDest.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => { setDestCode(c.code); setDestOpen(false); setDestSearch(""); }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left ${c.code === destCode ? "bg-primary/5 font-semibold text-primary" : ""}`}
                        >
                          <FlagImg iso3={c.code} /> {c.name}
                        </button>
                      ))}
                      {filteredDest.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm py-4">No results found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Travel Date */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Travel Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-white text-sm text-foreground focus:border-primary outline-none transition-colors hover:border-primary cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Button
                size="lg"
                onClick={handleCheck}
                disabled={!destCode}
                className="px-10 gap-2 text-base font-semibold"
              >
                <Search className="h-4 w-4" />
                Check Visa Requirements
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-muted/30 border-y border-border py-6 -mt-2">
        <div className="container mx-auto px-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center mb-4">
            Popular Destinations
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.map((code) => {
              const c = VISA_COUNTRIES.find((v) => v.code === code);
              if (!c) return null;
              return (
                <button
                  key={code}
                  onClick={() => setLocation(`/visa/${code}?passport=IND`)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors shadow-sm"
                >
                  <FlagImg iso3={code} size={18} /> {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-3">How It Works Once You Apply?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Our qualified team helps you fill up the forms and ensures that all necessary documents are in place before submitting the visa application.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              {i < 2 && (
                <div className="hidden md:block absolute top-10 left-full w-full border-t-2 border-dashed border-secondary/40 z-0 -translate-x-1/2" />
              )}
              <div className="relative z-10">
                <div className="inline-flex flex-col items-center gap-1 mb-4">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Step</span>
                  <span className="text-7xl font-serif font-black text-primary/10 leading-none -mb-4 select-none">
                    {step.step}
                  </span>
                  <div className="w-16 h-16 bg-primary/5 border-2 border-primary/20 rounded-full flex items-center justify-center text-primary text-2xl font-bold z-10">
                    {step.step}
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <div className="bg-primary py-10 text-center">
        <p className="text-primary-foreground/70 text-sm font-medium mb-2">Trusted by</p>
        <h2 className="text-3xl font-serif font-bold text-primary-foreground mb-4">4 Million Customers Worldwide</h2>
        <div className="inline-flex items-center gap-3 bg-secondary px-6 py-3 rounded-xl">
          <span className="text-secondary-foreground font-bold text-sm uppercase tracking-wide">Excellent</span>
          <div className="flex gap-1">
            {[1,2,3,4].map((i) => <Star key={i} className="h-4 w-4 fill-secondary-foreground text-secondary-foreground" />)}
            <Star className="h-4 w-4 fill-secondary-foreground/60 text-secondary-foreground/60" />
          </div>
          <span className="text-secondary-foreground text-sm font-semibold">4.8 Average · 2,400+ Reviews</span>
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold text-center text-foreground mb-12">Why Choose S International?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-card-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All Destinations */}
      <section className="pb-20 container mx-auto px-4">
        <h2 className="text-2xl font-serif font-bold text-foreground mb-8">All Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {VISA_COUNTRIES.map((country, i) => (
            <motion.div
              key={country.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 8) * 0.05 }}
            >
              <button
                onClick={() => setLocation(`/visa/${country.code}?passport=IND`)}
                className="w-full text-left bg-card border border-card-border rounded-2xl p-5 hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FlagImg iso3={country.code} size={32} />
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {country.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {country.visaTypes.length} visa type{country.visaTypes.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {country.visaTypes.map((vt) => (
                    <span key={vt.id} className="text-xs px-2 py-0.5 bg-primary/8 text-primary rounded-full font-medium">
                      {vt.type}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  From {country.visaTypes[0].processingTime}
                </p>
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
