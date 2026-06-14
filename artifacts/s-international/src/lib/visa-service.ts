export interface VisaDocument {
  id: string;
  label: string;
  icon: string;
  required: boolean;
  description?: string;
}

export interface VisaType {
  id: string;
  name: string;
  type: "Tourist" | "Business" | "Student" | "Transit" | "Work";
  entryType: "Single" | "Multiple" | "Double";
  validity: string;
  stayPeriod: string;
  processingTime: string;
  govFee: number;        // Real government fee in INR
  serviceFee: number;    // S International commission (₹500)
  tag?: "stickervisa" | "evisa" | "on-arrival" | "visa-free";
  documents: VisaDocument[];
  notes?: string;
}

export interface VisaCountry {
  code: string;
  name: string;
  flag: string;
  region: string;
  visaTypes: VisaType[];
  countryNotes?: string;
}

export interface PassportCountry {
  code: string;
  name: string;
  flag: string;
}

export const COMMISSION = 500; // ₹500 S International commission

export const PASSPORT_COUNTRIES: PassportCountry[] = [
  { code: "IND", name: "India", flag: "🇮🇳" },
  { code: "USA", name: "United States", flag: "🇺🇸" },
  { code: "GBR", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AUS", name: "Australia", flag: "🇦🇺" },
  { code: "CAN", name: "Canada", flag: "🇨🇦" },
  { code: "DEU", name: "Germany", flag: "🇩🇪" },
  { code: "FRA", name: "France", flag: "🇫🇷" },
  { code: "ARE", name: "UAE", flag: "🇦🇪" },
  { code: "SGP", name: "Singapore", flag: "🇸🇬" },
  { code: "ZAF", name: "South Africa", flag: "🇿🇦" },
  { code: "NGA", name: "Nigeria", flag: "🇳🇬" },
  { code: "PAK", name: "Pakistan", flag: "🇵🇰" },
  { code: "BGD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "LKA", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "NPL", name: "Nepal", flag: "🇳🇵" },
];

// ─── Common document sets ──────────────────────────────────────────────────
const PASSPORT_DOCS: VisaDocument[] = [
  { id: "passport-front", label: "Passport Front", icon: "passport", required: true, description: "Bio data/first page" },
  { id: "passport-back", label: "Passport Back", icon: "passport", required: true, description: "Last page" },
];
const STANDARD_DOCS: VisaDocument[] = [
  ...PASSPORT_DOCS,
  { id: "photograph", label: "Photograph", icon: "photo", required: true, description: "White background, 35×45mm" },
  { id: "aadhar", label: "Aadhaar / National ID", icon: "id", required: true, description: "Govt-issued ID proof" },
  { id: "bank-statement", label: "Bank Statement", icon: "bank", required: true, description: "Last 3–6 months" },
  { id: "flight-booking", label: "Return Flight Booking", icon: "flight", required: true, description: "Confirmed return ticket" },
  { id: "hotel-reservation", label: "Hotel Reservation", icon: "hotel", required: true, description: "Confirmed accommodation" },
  { id: "travel-insurance", label: "Travel Insurance", icon: "insurance", required: false, description: "Min $30,000 coverage" },
  { id: "covering-letter", label: "Covering Letter", icon: "letter", required: false, description: "Personal cover letter" },
  { id: "employment", label: "Employment Letter / ITR", icon: "letter", required: true, description: "Latest salary slip or ITR" },
];
const EVISA_DOCS: VisaDocument[] = [
  ...PASSPORT_DOCS,
  { id: "photograph", label: "Photograph", icon: "photo", required: true, description: "White background" },
  { id: "aadhar", label: "Aadhaar / National ID", icon: "id", required: true },
  { id: "flight-booking", label: "Return Flight Booking", icon: "flight", required: true },
  { id: "hotel-reservation", label: "Hotel Reservation", icon: "hotel", required: true },
  { id: "bank-statement", label: "Bank Statement", icon: "bank", required: true },
];

// ─── Country Data ──────────────────────────────────────────────────────────
// govFee = official government visa fee in INR (converted at mid-market rates)
// serviceFee = ₹500 fixed S International commission
// Sources: Official embassy/consulate websites (June 2025 rates)

export const VISA_COUNTRIES: VisaCountry[] = [
  // ── AMERICAS ──────────────────────────────────────────────────────────────
  {
    code: "USA", name: "United States", flag: "🇺🇸", region: "Americas",
    countryNotes: "Biometric appointment at US Consulate required. Processing times vary by consulate location.",
    visaTypes: [
      {
        id: "usa-tourist-b2", name: "USA Tourist Visa (B-2)", type: "Tourist",
        entryType: "Multiple", validity: "10 Years", stayPeriod: "Up to 180 days",
        processingTime: "5–15 Days", govFee: 15520, serviceFee: COMMISSION, tag: "stickervisa",
        documents: [...STANDARD_DOCS, { id: "ds160", label: "DS-160 Form", icon: "form", required: true }],
        notes: "MRV fee of $185 (₹15,520) paid to US Consulate directly.",
      },
      {
        id: "usa-business-b1", name: "USA Business Visa (B-1)", type: "Business",
        entryType: "Multiple", validity: "10 Years", stayPeriod: "Up to 90 days",
        processingTime: "7–15 Days", govFee: 15520, serviceFee: COMMISSION, tag: "stickervisa",
        documents: [...STANDARD_DOCS, { id: "invite", label: "Business Invitation Letter", icon: "letter", required: true }],
      },
    ],
  },
  {
    code: "CAN", name: "Canada", flag: "🇨🇦", region: "Americas",
    countryNotes: "Biometrics (₹6,300) may be required separately. Processed online via IRCC portal.",
    visaTypes: [
      {
        id: "can-tourist", name: "Canada Tourist Visa (TRV)", type: "Tourist",
        entryType: "Multiple", validity: "10 Years", stayPeriod: "Up to 6 Months",
        processingTime: "4–8 Weeks", govFee: 6200, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
        notes: "Application fee CAD 100 (₹6,200). Biometrics extra.",
      },
    ],
  },
  {
    code: "BRA", name: "Brazil", flag: "🇧🇷", region: "Americas",
    visaTypes: [
      {
        id: "bra-tourist", name: "Brazil Tourist Visa", type: "Tourist",
        entryType: "Multiple", validity: "5 Years", stayPeriod: "Up to 90 days",
        processingTime: "5–10 Days", govFee: 3700, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
  {
    code: "ARG", name: "Argentina", flag: "🇦🇷", region: "Americas",
    visaTypes: [
      {
        id: "arg-tourist", name: "Argentina Tourist Visa", type: "Tourist",
        entryType: "Multiple", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "7–10 Days", govFee: 4150, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
      {
        id: "arg-business", name: "Argentina Business Visa", type: "Business",
        entryType: "Multiple", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "7–10 Days", govFee: 4150, serviceFee: COMMISSION, tag: "stickervisa",
        documents: [...STANDARD_DOCS, { id: "invite", label: "Business Invitation Letter", icon: "letter", required: true }],
      },
    ],
  },
  {
    code: "MEX", name: "Mexico", flag: "🇲🇽", region: "Americas",
    visaTypes: [
      {
        id: "mex-tourist", name: "Mexico Tourist Visa", type: "Tourist",
        entryType: "Single", validity: "6 Months", stayPeriod: "Up to 180 days",
        processingTime: "3–5 Days", govFee: 2700, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },

  // ── EUROPE ────────────────────────────────────────────────────────────────
  {
    code: "GBR", name: "United Kingdom", flag: "🇬🇧", region: "Europe",
    countryNotes: "UK is not Schengen. Apply separately from other European countries.",
    visaTypes: [
      {
        id: "uk-tourist", name: "UK Standard Visitor Visa", type: "Tourist",
        entryType: "Multiple", validity: "2 Years", stayPeriod: "Up to 180 days",
        processingTime: "3 Weeks", govFee: 11900, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
        notes: "Fee £115 (₹11,900). Biometric enrollment at VFS required.",
      },
      {
        id: "uk-business", name: "UK Business Visitor Visa", type: "Business",
        entryType: "Multiple", validity: "2 Years", stayPeriod: "Up to 180 days",
        processingTime: "3 Weeks", govFee: 11900, serviceFee: COMMISSION, tag: "stickervisa",
        documents: [...STANDARD_DOCS, { id: "invite", label: "Business Invitation Letter", icon: "letter", required: true }],
      },
    ],
  },
  {
    code: "FRA", name: "France (Schengen)", flag: "🇫🇷", region: "Europe",
    countryNotes: "Schengen visa valid for 26 EU countries. Apply at the country of longest stay.",
    visaTypes: [
      {
        id: "schengen-fr", name: "Schengen Visa – France", type: "Tourist",
        entryType: "Multiple", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "10–15 Days", govFee: 7200, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
        notes: "Visa fee €80 (₹7,200). Apply 3 months before travel.",
      },
    ],
  },
  {
    code: "DEU", name: "Germany (Schengen)", flag: "🇩🇪", region: "Europe",
    visaTypes: [
      {
        id: "schengen-de", name: "Schengen Visa – Germany", type: "Tourist",
        entryType: "Multiple", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "10–15 Days", govFee: 7200, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
  {
    code: "ITA", name: "Italy (Schengen)", flag: "🇮🇹", region: "Europe",
    visaTypes: [
      {
        id: "schengen-it", name: "Schengen Visa – Italy", type: "Tourist",
        entryType: "Multiple", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "10–15 Days", govFee: 7200, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
  {
    code: "ESP", name: "Spain (Schengen)", flag: "🇪🇸", region: "Europe",
    visaTypes: [
      {
        id: "schengen-es", name: "Schengen Visa – Spain", type: "Tourist",
        entryType: "Multiple", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "10–15 Days", govFee: 7200, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
  {
    code: "NLD", name: "Netherlands (Schengen)", flag: "🇳🇱", region: "Europe",
    visaTypes: [
      {
        id: "schengen-nl", name: "Schengen Visa – Netherlands", type: "Tourist",
        entryType: "Multiple", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "10–15 Days", govFee: 7200, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
  {
    code: "CHE", name: "Switzerland (Schengen)", flag: "🇨🇭", region: "Europe",
    visaTypes: [
      {
        id: "schengen-ch", name: "Schengen Visa – Switzerland", type: "Tourist",
        entryType: "Multiple", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "10–15 Days", govFee: 7200, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
  {
    code: "GRC", name: "Greece (Schengen)", flag: "🇬🇷", region: "Europe",
    visaTypes: [
      {
        id: "schengen-gr", name: "Schengen Visa – Greece", type: "Tourist",
        entryType: "Multiple", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "10–15 Days", govFee: 7200, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
  {
    code: "PRT", name: "Portugal (Schengen)", flag: "🇵🇹", region: "Europe",
    visaTypes: [
      {
        id: "schengen-pt", name: "Schengen Visa – Portugal", type: "Tourist",
        entryType: "Multiple", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "10–15 Days", govFee: 7200, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
  {
    code: "SWE", name: "Sweden (Schengen)", flag: "🇸🇪", region: "Europe",
    visaTypes: [
      {
        id: "schengen-se", name: "Schengen Visa – Sweden", type: "Tourist",
        entryType: "Multiple", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "10–15 Days", govFee: 7200, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
  {
    code: "NOR", name: "Norway (Schengen)", flag: "🇳🇴", region: "Europe",
    visaTypes: [
      {
        id: "schengen-no", name: "Schengen Visa – Norway", type: "Tourist",
        entryType: "Multiple", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "10–15 Days", govFee: 7200, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
  {
    code: "AUT", name: "Austria (Schengen)", flag: "🇦🇹", region: "Europe",
    visaTypes: [
      {
        id: "schengen-at", name: "Schengen Visa – Austria", type: "Tourist",
        entryType: "Multiple", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "10–15 Days", govFee: 7200, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
  {
    code: "IRL", name: "Ireland", flag: "🇮🇪", region: "Europe",
    countryNotes: "Ireland is not part of the Schengen Area. Separate visa required.",
    visaTypes: [
      {
        id: "ire-tourist", name: "Ireland Tourist Visa", type: "Tourist",
        entryType: "Multiple", validity: "5 Years", stayPeriod: "Up to 90 days",
        processingTime: "4–8 Weeks", govFee: 10400, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
        notes: "Fee £100 (₹10,400).",
      },
    ],
  },
  {
    code: "RUS", name: "Russia", flag: "🇷🇺", region: "Europe",
    visaTypes: [
      {
        id: "rus-tourist", name: "Russia e-Visa", type: "Tourist",
        entryType: "Single", validity: "2 Months", stayPeriod: "Up to 16 days",
        processingTime: "4 Days", govFee: 2920, serviceFee: COMMISSION, tag: "evisa",
        documents: EVISA_DOCS,
        notes: "e-Visa fee $35 (₹2,920). Available online.",
      },
    ],
  },
  {
    code: "TUR", name: "Turkey", flag: "🇹🇷", region: "Europe",
    visaTypes: [
      {
        id: "tur-evisa", name: "Turkey e-Visa", type: "Tourist",
        entryType: "Multiple", validity: "180 Days", stayPeriod: "Up to 90 days",
        processingTime: "1–3 Days", govFee: 4580, serviceFee: COMMISSION, tag: "evisa",
        documents: EVISA_DOCS,
        notes: "e-Visa fee $55 (₹4,580). Instant approval usually.",
      },
    ],
  },

  // ── MIDDLE EAST ───────────────────────────────────────────────────────────
  {
    code: "ARE", name: "Dubai / UAE", flag: "🇦🇪", region: "Middle East",
    countryNotes: "UAE visa delivered to email within 1–5 days. Multiple entry visa also available.",
    visaTypes: [
      {
        id: "uae-30-single", name: "Dubai 30-Day Visa (Single)", type: "Tourist",
        entryType: "Single", validity: "58 Days (from issue)", stayPeriod: "30 Days",
        processingTime: "3–5 Days", govFee: 6700, serviceFee: COMMISSION, tag: "evisa",
        documents: [...PASSPORT_DOCS, { id: "photograph", label: "Photograph", icon: "photo", required: true }, { id: "aadhar", label: "Aadhaar Card", icon: "id", required: true }],
        notes: "AED 300 (₹6,700). Most popular for short visits.",
      },
      {
        id: "uae-60-multi", name: "Dubai 60-Day Visa (Multiple)", type: "Tourist",
        entryType: "Multiple", validity: "58 Days (from issue)", stayPeriod: "60 Days",
        processingTime: "3–5 Days", govFee: 14500, serviceFee: COMMISSION, tag: "evisa",
        documents: [...PASSPORT_DOCS, { id: "photograph", label: "Photograph", icon: "photo", required: true }, { id: "aadhar", label: "Aadhaar Card", icon: "id", required: true }],
        notes: "AED 650 (₹14,500). Best value for longer stays.",
      },
      {
        id: "uae-90-multi", name: "Dubai 90-Day Visa (Multiple)", type: "Tourist",
        entryType: "Multiple", validity: "120 Days (from issue)", stayPeriod: "90 Days",
        processingTime: "5–7 Days", govFee: 22300, serviceFee: COMMISSION, tag: "evisa",
        documents: [...PASSPORT_DOCS, { id: "photograph", label: "Photograph", icon: "photo", required: true }, { id: "aadhar", label: "Aadhaar Card", icon: "id", required: true }],
      },
    ],
  },
  {
    code: "SAU", name: "Saudi Arabia", flag: "🇸🇦", region: "Middle East",
    visaTypes: [
      {
        id: "sau-tourist", name: "Saudi Arabia Tourist e-Visa", type: "Tourist",
        entryType: "Multiple", validity: "1 Year", stayPeriod: "Up to 90 days",
        processingTime: "1–3 Days", govFee: 6600, serviceFee: COMMISSION, tag: "evisa",
        documents: EVISA_DOCS,
        notes: "SAR 300 (₹6,600). Online e-Visa via Visit Saudi portal.",
      },
    ],
  },
  {
    code: "QAT", name: "Qatar", flag: "🇶🇦", region: "Middle East",
    visaTypes: [
      {
        id: "qat-tourist", name: "Qatar Tourist Visa", type: "Tourist",
        entryType: "Single", validity: "30 Days", stayPeriod: "30 Days",
        processingTime: "3–5 Days", govFee: 4500, serviceFee: COMMISSION, tag: "evisa",
        documents: EVISA_DOCS,
        notes: "QAR 200 (₹4,500).",
      },
    ],
  },
  {
    code: "BHR", name: "Bahrain", flag: "🇧🇭", region: "Middle East",
    visaTypes: [
      {
        id: "bhr-tourist", name: "Bahrain e-Visa", type: "Tourist",
        entryType: "Multiple", validity: "2 Weeks", stayPeriod: "14 Days",
        processingTime: "1–3 Days", govFee: 6300, serviceFee: COMMISSION, tag: "evisa",
        documents: EVISA_DOCS,
        notes: "BHD 29 (₹6,300). Online via Bahrain e-Visa portal.",
      },
    ],
  },
  {
    code: "OMN", name: "Oman", flag: "🇴🇲", region: "Middle East",
    visaTypes: [
      {
        id: "omn-tourist", name: "Oman Tourist e-Visa", type: "Tourist",
        entryType: "Multiple", validity: "1 Year", stayPeriod: "Up to 30 days",
        processingTime: "1–3 Days", govFee: 4300, serviceFee: COMMISSION, tag: "evisa",
        documents: EVISA_DOCS,
        notes: "OMR 20 (₹4,300). Apply at eVisa.rop.gov.om.",
      },
    ],
  },
  {
    code: "KWT", name: "Kuwait", flag: "🇰🇼", region: "Middle East",
    visaTypes: [
      {
        id: "kwt-tourist", name: "Kuwait Visit Visa", type: "Tourist",
        entryType: "Single", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "10–15 Days", govFee: 800, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
        notes: "KWD 3 (₹800) visa fee. Requires sponsor/invitation in Kuwait.",
      },
    ],
  },

  // ── ASIA PACIFIC ──────────────────────────────────────────────────────────
  {
    code: "AUS", name: "Australia", flag: "🇦🇺", region: "Asia Pacific",
    countryNotes: "Biometrics required. Apply online via ImmiAccount. Process can take 2–6 weeks.",
    visaTypes: [
      {
        id: "aus-tourist", name: "Australia Tourist Visa (Subclass 600)", type: "Tourist",
        entryType: "Multiple", validity: "12 Months", stayPeriod: "Up to 3 Months",
        processingTime: "2–6 Weeks", govFee: 7900, serviceFee: COMMISSION, tag: "evisa",
        documents: STANDARD_DOCS,
        notes: "AUD 145 (₹7,900). Online application only.",
      },
      {
        id: "aus-business", name: "Australia Business Visa (Subclass 600)", type: "Business",
        entryType: "Multiple", validity: "12 Months", stayPeriod: "Up to 3 Months",
        processingTime: "2–6 Weeks", govFee: 7900, serviceFee: COMMISSION, tag: "evisa",
        documents: [...STANDARD_DOCS, { id: "invite", label: "Business Invitation Letter", icon: "letter", required: true }],
      },
    ],
  },
  {
    code: "NZL", name: "New Zealand", flag: "🇳🇿", region: "Asia Pacific",
    visaTypes: [
      {
        id: "nzl-tourist", name: "New Zealand Visitor Visa", type: "Tourist",
        entryType: "Multiple", validity: "9 Months", stayPeriod: "Up to 9 Months",
        processingTime: "3–5 Weeks", govFee: 9900, serviceFee: COMMISSION, tag: "evisa",
        documents: STANDARD_DOCS,
        notes: "NZD 211 (₹9,900). Apply online via Immigration NZ portal.",
      },
    ],
  },
  {
    code: "SGP", name: "Singapore", flag: "🇸🇬", region: "Asia Pacific",
    visaTypes: [
      {
        id: "sgp-tourist", name: "Singapore Tourist Visa", type: "Tourist",
        entryType: "Single", validity: "30 Days", stayPeriod: "30 Days",
        processingTime: "3–5 Days", govFee: 1800, serviceFee: COMMISSION, tag: "stickervisa",
        documents: EVISA_DOCS,
        notes: "SGD 30 (₹1,800). Apply via ICA-appointed agent.",
      },
    ],
  },
  {
    code: "JPN", name: "Japan", flag: "🇯🇵", region: "Asia Pacific",
    countryNotes: "Apply at Japanese Consulate. No appointment required in some cities.",
    visaTypes: [
      {
        id: "jpn-single", name: "Japan Tourist Visa (Single)", type: "Tourist",
        entryType: "Single", validity: "3 Months", stayPeriod: "15 Days",
        processingTime: "5–7 Days", govFee: 1490, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
        notes: "¥3,000 (₹1,490) consular fee.",
      },
      {
        id: "jpn-multi", name: "Japan Tourist Visa (Multiple)", type: "Tourist",
        entryType: "Multiple", validity: "5 Years", stayPeriod: "Up to 90 days each stay",
        processingTime: "5–7 Days", govFee: 3000, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
  {
    code: "KOR", name: "South Korea", flag: "🇰🇷", region: "Asia Pacific",
    visaTypes: [
      {
        id: "kor-tourist", name: "South Korea Tourist Visa", type: "Tourist",
        entryType: "Single", validity: "3 Months", stayPeriod: "30 Days",
        processingTime: "5–7 Days", govFee: 3600, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
        notes: "KRW 60,000 (₹3,600).",
      },
    ],
  },
  {
    code: "CHN", name: "China", flag: "🇨🇳", region: "Asia Pacific",
    countryNotes: "Biometric fingerprinting required at Chinese Visa Application Centre.",
    visaTypes: [
      {
        id: "chn-tourist", name: "China Tourist Visa (L)", type: "Tourist",
        entryType: "Single", validity: "3 Months", stayPeriod: "30 Days",
        processingTime: "4–7 Days", govFee: 11700, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
        notes: "CNY 1,000 (₹11,700) approx.",
      },
    ],
  },
  {
    code: "THA", name: "Thailand", flag: "🇹🇭", region: "Asia Pacific",
    visaTypes: [
      {
        id: "tha-tourist-evisa", name: "Thailand Tourist e-Visa (TR)", type: "Tourist",
        entryType: "Single", validity: "3 Months", stayPeriod: "30 Days",
        processingTime: "2–5 Days", govFee: 2000, serviceFee: COMMISSION, tag: "evisa",
        documents: EVISA_DOCS,
        notes: "THB 2,000 (₹4,500 approx). Online via Thailand e-Visa portal.",
      },
    ],
  },
  {
    code: "VNM", name: "Vietnam", flag: "🇻🇳", region: "Asia Pacific",
    visaTypes: [
      {
        id: "vnm-evisa", name: "Vietnam e-Visa", type: "Tourist",
        entryType: "Multiple", validity: "90 Days", stayPeriod: "Up to 90 days",
        processingTime: "3 Days", govFee: 2100, serviceFee: COMMISSION, tag: "evisa",
        documents: EVISA_DOCS,
        notes: "$25 (₹2,100). Apply via evisa.xuatnhapcanh.gov.vn.",
      },
    ],
  },
  {
    code: "IDN", name: "Indonesia (Bali)", flag: "🇮🇩", region: "Asia Pacific",
    visaTypes: [
      {
        id: "idn-voa", name: "Indonesia Visa on Arrival", type: "Tourist",
        entryType: "Single", validity: "30 Days", stayPeriod: "30 Days (extendable)",
        processingTime: "On Arrival", govFee: 4150, serviceFee: COMMISSION, tag: "on-arrival",
        documents: [...PASSPORT_DOCS, { id: "return-ticket", label: "Return Flight Ticket", icon: "flight", required: true }],
        notes: "IDR 500,000 (₹2,500) paid on arrival. Pre-pay e-VOA online.",
      },
    ],
  },
  {
    code: "MYS", name: "Malaysia", flag: "🇲🇾", region: "Asia Pacific",
    visaTypes: [
      {
        id: "mys-voa", name: "Malaysia Visa on Arrival / eNTRI", type: "Tourist",
        entryType: "Single", validity: "15 Days", stayPeriod: "15 Days",
        processingTime: "On Arrival", govFee: 0, serviceFee: COMMISSION, tag: "visa-free",
        documents: [...PASSPORT_DOCS, { id: "return-ticket", label: "Return Ticket", icon: "flight", required: true }],
        notes: "Indians can enter visa-free for 30 days. eNTRI note for 15 days.",
      },
    ],
  },
  {
    code: "PHL", name: "Philippines", flag: "🇵🇭", region: "Asia Pacific",
    visaTypes: [
      {
        id: "phl-voa", name: "Philippines Visa on Arrival", type: "Tourist",
        entryType: "Single", validity: "30 Days", stayPeriod: "30 Days",
        processingTime: "On Arrival", govFee: 0, serviceFee: COMMISSION, tag: "visa-free",
        documents: [...PASSPORT_DOCS, { id: "return-ticket", label: "Onward/Return Ticket", icon: "flight", required: true }],
        notes: "Indians get 30 days visa-free.",
      },
    ],
  },
  {
    code: "LKA", name: "Sri Lanka", flag: "🇱🇰", region: "Asia Pacific",
    visaTypes: [
      {
        id: "lka-eta", name: "Sri Lanka ETA (e-Visa)", type: "Tourist",
        entryType: "Double", validity: "6 Months", stayPeriod: "30 Days",
        processingTime: "1–3 Days", govFee: 2940, serviceFee: COMMISSION, tag: "evisa",
        documents: EVISA_DOCS,
        notes: "$35 (₹2,940). Apply at eta.gov.lk.",
      },
    ],
  },
  {
    code: "MDV", name: "Maldives", flag: "🇲🇻", region: "Asia Pacific",
    visaTypes: [
      {
        id: "mdv-voa", name: "Maldives Visa on Arrival", type: "Tourist",
        entryType: "Single", validity: "30 Days", stayPeriod: "30 Days",
        processingTime: "On Arrival", govFee: 0, serviceFee: COMMISSION, tag: "visa-free",
        documents: [...PASSPORT_DOCS, { id: "hotel", label: "Hotel/Resort Booking", icon: "hotel", required: true }, { id: "return-ticket", label: "Return Ticket", icon: "flight", required: true }],
        notes: "Free 30-day tourist visa on arrival for all passport holders.",
      },
    ],
  },
  {
    code: "NPL", name: "Nepal", flag: "🇳🇵", region: "Asia Pacific",
    visaTypes: [
      {
        id: "npl-voa", name: "Nepal Visa on Arrival", type: "Tourist",
        entryType: "Single", validity: "15 Days", stayPeriod: "15 Days",
        processingTime: "On Arrival", govFee: 0, serviceFee: COMMISSION, tag: "visa-free",
        documents: [...PASSPORT_DOCS],
        notes: "Indian citizens do NOT need a visa for Nepal (free entry with valid ID).",
      },
    ],
  },

  // ── AFRICA ────────────────────────────────────────────────────────────────
  {
    code: "ZAF", name: "South Africa", flag: "🇿🇦", region: "Africa",
    visaTypes: [
      {
        id: "zaf-tourist", name: "South Africa Tourist Visa", type: "Tourist",
        entryType: "Single", validity: "3 Months", stayPeriod: "30 Days",
        processingTime: "7–15 Days", govFee: 6500, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
        notes: "ZAR 1,520 (₹6,500). Apply at SA High Commission.",
      },
    ],
  },
  {
    code: "KEN", name: "Kenya", flag: "🇰🇪", region: "Africa",
    visaTypes: [
      {
        id: "ken-evisa", name: "Kenya e-Visa", type: "Tourist",
        entryType: "Single", validity: "3 Months", stayPeriod: "90 Days",
        processingTime: "3–5 Days", govFee: 4200, serviceFee: COMMISSION, tag: "evisa",
        documents: EVISA_DOCS,
        notes: "$50 (₹4,200). Apply at evisa.go.ke.",
      },
    ],
  },
  {
    code: "TZA", name: "Tanzania", flag: "🇹🇿", region: "Africa",
    visaTypes: [
      {
        id: "tza-evisa", name: "Tanzania e-Visa", type: "Tourist",
        entryType: "Single", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "3–5 Days", govFee: 4200, serviceFee: COMMISSION, tag: "evisa",
        documents: EVISA_DOCS,
        notes: "$50 (₹4,200). Apply at immigration.go.tz.",
      },
    ],
  },
  {
    code: "ETH", name: "Ethiopia", flag: "🇪🇹", region: "Africa",
    visaTypes: [
      {
        id: "eth-evisa", name: "Ethiopia e-Visa", type: "Tourist",
        entryType: "Single", validity: "3 Months", stayPeriod: "30 Days",
        processingTime: "3–5 Days", govFee: 4350, serviceFee: COMMISSION, tag: "evisa",
        documents: EVISA_DOCS,
        notes: "$52 (₹4,350). Ethiopia e-Visa online.",
      },
    ],
  },
  {
    code: "EGY", name: "Egypt", flag: "🇪🇬", region: "Africa",
    visaTypes: [
      {
        id: "egy-evisa", name: "Egypt e-Visa", type: "Tourist",
        entryType: "Single", validity: "3 Months", stayPeriod: "30 Days",
        processingTime: "1–3 Days", govFee: 2100, serviceFee: COMMISSION, tag: "evisa",
        documents: EVISA_DOCS,
        notes: "$25 (₹2,100). Apply at visa2egypt.gov.eg.",
      },
    ],
  },
  {
    code: "MAR", name: "Morocco", flag: "🇲🇦", region: "Africa",
    visaTypes: [
      {
        id: "mar-tourist", name: "Morocco Tourist Visa", type: "Tourist",
        entryType: "Single", validity: "3 Months", stayPeriod: "Up to 90 days",
        processingTime: "5–10 Days", govFee: 2100, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
        notes: "Moroccan consulate sticker visa.",
      },
    ],
  },

  // ── SOUTH ASIA ────────────────────────────────────────────────────────────
  {
    code: "BGD", name: "Bangladesh", flag: "🇧🇩", region: "South Asia",
    visaTypes: [
      {
        id: "bgd-tourist", name: "Bangladesh Tourist Visa", type: "Tourist",
        entryType: "Single", validity: "30 Days", stayPeriod: "30 Days",
        processingTime: "5–7 Days", govFee: 4300, serviceFee: COMMISSION, tag: "stickervisa",
        documents: STANDARD_DOCS,
        notes: "$51 (₹4,300) approx.",
      },
    ],
  },
  {
    code: "BTN", name: "Bhutan", flag: "🇧🇹", region: "South Asia",
    visaTypes: [
      {
        id: "btn-tourist", name: "Bhutan Tourist Permit", type: "Tourist",
        entryType: "Single", validity: "As per itinerary", stayPeriod: "As per itinerary",
        processingTime: "3–5 Days", govFee: 16700, serviceFee: COMMISSION, tag: "evisa",
        documents: [...PASSPORT_DOCS, { id: "itinerary", label: "Approved Tour Itinerary", icon: "letter", required: true }],
        notes: "SDF USD 200/day/person (₹16,700+). Mandatory. Indians pay reduced rate.",
      },
    ],
  },
];

// ─── Helper functions ──────────────────────────────────────────────────────
export function getVisaCountry(code: string): VisaCountry | undefined {
  return VISA_COUNTRIES.find((c) => c.code === code);
}

export function formatPrice(amount: number): string {
  if (amount === 0) return "INR 0.00";
  return `INR ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

export function formatPriceShort(amount: number): string {
  if (amount === 0) return "₹0";
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function getTagLabel(tag?: string): string {
  if (tag === "evisa") return "e-Visa";
  if (tag === "on-arrival") return "On Arrival";
  if (tag === "visa-free") return "Visa Free";
  return "Sticker Visa";
}

export function getTagColor(tag?: string): string {
  if (tag === "evisa") return "bg-blue-500 text-white";
  if (tag === "on-arrival") return "bg-emerald-500 text-white";
  if (tag === "visa-free") return "bg-teal-500 text-white";
  return "bg-primary text-primary-foreground";
}

export const REGIONS = ["All", "Americas", "Europe", "Middle East", "Asia Pacific", "Africa", "South Asia"];

export function generateRefNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "SIN";
  for (let i = 0; i < 8; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

// Promo codes
export const PROMO_CODES: Record<string, number> = {
  "VISA10": 10,    // 10% off
  "FIRST15": 15,   // 15% off for first-time users
  "SINT20": 20,    // 20% off S International special
  "TRAVEL5": 5,    // 5% off
  "SAVE100": 0,    // Fixed ₹100 off (handled separately)
};

export function applyPromo(code: string, total: number): { valid: boolean; discount: number; message: string } {
  const upper = code.toUpperCase().trim();
  if (upper === "SAVE100") return { valid: true, discount: 100, message: "₹100 flat discount applied!" };
  const pct = PROMO_CODES[upper];
  if (!pct) return { valid: false, discount: 0, message: "Invalid promo code. Try VISA10 or FIRST15." };
  const discount = Math.round((total * pct) / 100);
  return { valid: true, discount, message: `${pct}% discount applied! You saved ${formatPriceShort(discount)}` };
}
