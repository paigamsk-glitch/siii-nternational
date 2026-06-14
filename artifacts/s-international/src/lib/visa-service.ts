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
  govFee: number;
  serviceFee: number;
  tag?: "stickervisa" | "evisa" | "on-arrival";
  documents: VisaDocument[];
}

export interface VisaCountry {
  code: string;
  name: string;
  flag: string;
  visaTypes: VisaType[];
  notes?: string;
}

export interface PassportCountry {
  code: string;
  name: string;
  flag: string;
}

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

const STANDARD_DOCS: VisaDocument[] = [
  { id: "passport-front", label: "Passport Front", icon: "passport", required: true, description: "First/bio data page" },
  { id: "passport-back", label: "Passport Back", icon: "passport", required: true, description: "Last page of passport" },
  { id: "photograph", label: "Photograph", icon: "photo", required: true, description: "Recent passport-sized photo" },
  { id: "aadhar", label: "Aadhar Card / National ID", icon: "id", required: true, description: "Government-issued ID proof" },
  { id: "travel-insurance", label: "Travel Insurance", icon: "insurance", required: false, description: "Min. $30,000 coverage recommended" },
  { id: "flight-booking", label: "Flight Bookings Roundtrip", icon: "flight", required: true, description: "Confirmed return ticket" },
  { id: "hotel-reservation", label: "Hotel Reservation", icon: "hotel", required: true, description: "Confirmed accommodation" },
  { id: "covering-letter", label: "Covering Letter", icon: "letter", required: false, description: "Personal cover letter" },
  { id: "bank-statement", label: "Bank Statement", icon: "bank", required: true, description: "Last 3–6 months bank statements" },
];

export const VISA_COUNTRIES: VisaCountry[] = [
  {
    code: "USA",
    name: "United States",
    flag: "🇺🇸",
    notes: "Additional documents may be required by the Embassy. Final decision for approval of Visa is only at the discretion of the Embassy.",
    visaTypes: [
      {
        id: "usa-tourist-b2",
        name: "USA Tourist Visa (B-2)",
        type: "Tourist",
        entryType: "Multiple",
        validity: "10 Years",
        stayPeriod: "Up to 180 days",
        processingTime: "5–15 Days",
        govFee: 0,
        serviceFee: 8484,
        tag: "stickervisa",
        documents: [
          ...STANDARD_DOCS,
          { id: "ds160", label: "DS-160 Form", icon: "form", required: true, description: "Online non-immigrant visa application" },
          { id: "itin", label: "Travel Itinerary", icon: "flight", required: true, description: "Detailed travel plan" },
        ],
      },
      {
        id: "usa-business-b1",
        name: "USA Business Visa (B-1)",
        type: "Business",
        entryType: "Multiple",
        validity: "10 Years",
        stayPeriod: "Up to 90 days",
        processingTime: "7–15 Days",
        govFee: 0,
        serviceFee: 8484,
        tag: "stickervisa",
        documents: [
          ...STANDARD_DOCS,
          { id: "invitation", label: "Business Invitation Letter", icon: "letter", required: true },
          { id: "company-docs", label: "Company Registration Docs", icon: "id", required: true },
        ],
      },
    ],
  },
  {
    code: "GBR",
    name: "United Kingdom",
    flag: "🇬🇧",
    notes: "UK visa decisions are made by the Home Office. Processing times may vary.",
    visaTypes: [
      {
        id: "uk-tourist",
        name: "UK Standard Visitor Visa",
        type: "Tourist",
        entryType: "Multiple",
        validity: "2 Years",
        stayPeriod: "Up to 180 days",
        processingTime: "3 Weeks",
        govFee: 0,
        serviceFee: 12500,
        tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
      {
        id: "uk-business",
        name: "UK Business Visitor Visa",
        type: "Business",
        entryType: "Multiple",
        validity: "2 Years",
        stayPeriod: "Up to 180 days",
        processingTime: "3 Weeks",
        govFee: 0,
        serviceFee: 14000,
        tag: "stickervisa",
        documents: [
          ...STANDARD_DOCS,
          { id: "invitation", label: "Business Invitation Letter", icon: "letter", required: true },
        ],
      },
    ],
  },
  {
    code: "CAN",
    name: "Canada",
    flag: "🇨🇦",
    notes: "Biometrics may be required for Canadian visa applications.",
    visaTypes: [
      {
        id: "can-tourist",
        name: "Canada Tourist Visa (TRV)",
        type: "Tourist",
        entryType: "Multiple",
        validity: "10 Years",
        stayPeriod: "Up to 6 Months",
        processingTime: "2–4 Weeks",
        govFee: 0,
        serviceFee: 6500,
        tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
  {
    code: "AUS",
    name: "Australia",
    flag: "🇦🇺",
    notes: "Australian visas are processed online. Biometrics required.",
    visaTypes: [
      {
        id: "aus-tourist",
        name: "Australia Tourist Visa (600)",
        type: "Tourist",
        entryType: "Multiple",
        validity: "12 Months",
        stayPeriod: "Up to 3 Months",
        processingTime: "2–4 Weeks",
        govFee: 0,
        serviceFee: 9800,
        tag: "evisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
  {
    code: "ARE",
    name: "Dubai / UAE",
    flag: "🇦🇪",
    notes: "UAE visas are processed electronically and delivered via email.",
    visaTypes: [
      {
        id: "uae-30",
        name: "Dubai Tourist Visa – 30 Days",
        type: "Tourist",
        entryType: "Single",
        validity: "58 Days (from issue)",
        stayPeriod: "30 Days",
        processingTime: "3–5 Days",
        govFee: 0,
        serviceFee: 4500,
        tag: "evisa",
        documents: [
          { id: "passport-front", label: "Passport Front", icon: "passport", required: true },
          { id: "passport-back", label: "Passport Back", icon: "passport", required: true },
          { id: "photograph", label: "Photograph", icon: "photo", required: true, description: "White background" },
          { id: "aadhar", label: "Aadhar Card", icon: "id", required: true },
        ],
      },
      {
        id: "uae-60",
        name: "Dubai Tourist Visa – 60 Days",
        type: "Tourist",
        entryType: "Multiple",
        validity: "58 Days (from issue)",
        stayPeriod: "60 Days",
        processingTime: "3–5 Days",
        govFee: 0,
        serviceFee: 7200,
        tag: "evisa",
        documents: [
          { id: "passport-front", label: "Passport Front", icon: "passport", required: true },
          { id: "passport-back", label: "Passport Back", icon: "passport", required: true },
          { id: "photograph", label: "Photograph", icon: "photo", required: true },
          { id: "aadhar", label: "Aadhar Card", icon: "id", required: true },
        ],
      },
    ],
  },
  {
    code: "SGP",
    name: "Singapore",
    flag: "🇸🇬",
    notes: "Singapore visa applications are processed online via ICA.",
    visaTypes: [
      {
        id: "sgp-tourist",
        name: "Singapore Tourist Visa",
        type: "Tourist",
        entryType: "Single",
        validity: "30 Days",
        stayPeriod: "30 Days",
        processingTime: "3–5 Days",
        govFee: 0,
        serviceFee: 3200,
        tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
  {
    code: "FRA",
    name: "France (Schengen)",
    flag: "🇫🇷",
    notes: "Schengen visa allows travel across 26 European countries.",
    visaTypes: [
      {
        id: "schengen-tourist",
        name: "Schengen Tourist Visa",
        type: "Tourist",
        entryType: "Multiple",
        validity: "3 Months",
        stayPeriod: "Up to 90 days",
        processingTime: "10–15 Days",
        govFee: 0,
        serviceFee: 7500,
        tag: "stickervisa",
        documents: [
          ...STANDARD_DOCS,
          { id: "itin", label: "Travel Itinerary", icon: "flight", required: true },
          { id: "employment", label: "Employment Letter / ITR", icon: "letter", required: true },
        ],
      },
    ],
  },
  {
    code: "ARG",
    name: "Argentina",
    flag: "🇦🇷",
    notes: "Additional documents may be required by the Embassy.",
    visaTypes: [
      {
        id: "arg-tourist",
        name: "Argentina Tourist Visa",
        type: "Tourist",
        entryType: "Multiple",
        validity: "3 Months",
        stayPeriod: "Up to 90 days",
        processingTime: "7–10 Days",
        govFee: 0,
        serviceFee: 4484,
        tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
      {
        id: "arg-business",
        name: "Argentina Business Visa",
        type: "Business",
        entryType: "Multiple",
        validity: "3 Months",
        stayPeriod: "Up to 90 days",
        processingTime: "7–10 Days",
        govFee: 0,
        serviceFee: 4484,
        tag: "stickervisa",
        documents: [
          ...STANDARD_DOCS,
          { id: "invitation", label: "Business Invitation Letter", icon: "letter", required: true },
        ],
      },
    ],
  },
  {
    code: "THA",
    name: "Thailand",
    flag: "🇹🇭",
    notes: "Thailand offers e-Visa facility for Indian nationals.",
    visaTypes: [
      {
        id: "thai-tourist",
        name: "Thailand Tourist Visa",
        type: "Tourist",
        entryType: "Single",
        validity: "3 Months",
        stayPeriod: "30 Days",
        processingTime: "3–7 Days",
        govFee: 0,
        serviceFee: 3000,
        tag: "evisa",
        documents: [
          { id: "passport-front", label: "Passport Front", icon: "passport", required: true },
          { id: "passport-back", label: "Passport Back", icon: "passport", required: true },
          { id: "photograph", label: "Photograph", icon: "photo", required: true },
          { id: "flight-booking", label: "Flight Bookings Roundtrip", icon: "flight", required: true },
          { id: "hotel-reservation", label: "Hotel Reservation", icon: "hotel", required: true },
          { id: "bank-statement", label: "Bank Statement", icon: "bank", required: true },
        ],
      },
    ],
  },
  {
    code: "JPN",
    name: "Japan",
    flag: "🇯🇵",
    notes: "Japan visa requires appointment at the consulate.",
    visaTypes: [
      {
        id: "jpn-tourist",
        name: "Japan Tourist Visa",
        type: "Tourist",
        entryType: "Single",
        validity: "3 Months",
        stayPeriod: "15 Days",
        processingTime: "5–7 Days",
        govFee: 0,
        serviceFee: 4800,
        tag: "stickervisa",
        documents: STANDARD_DOCS,
      },
    ],
  },
];

export function getVisaCountry(code: string): VisaCountry | undefined {
  return VISA_COUNTRIES.find((c) => c.code === code);
}

export function formatPrice(amount: number): string {
  if (amount === 0) return "INR 0.00";
  return `INR ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

export function getTagLabel(tag?: string): string {
  if (tag === "evisa") return "e-Visa";
  if (tag === "on-arrival") return "On Arrival";
  return "Sticker Visa";
}
