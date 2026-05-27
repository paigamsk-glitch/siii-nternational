const CITY_CODES: Record<string, string> = {
  "delhi": "DEL", "new delhi": "DEL",
  "mumbai": "BOM", "bombay": "BOM",
  "bangalore": "BLR", "bengaluru": "BLR",
  "chennai": "MAA", "madras": "MAA",
  "hyderabad": "HYD",
  "kolkata": "CCU", "calcutta": "CCU",
  "pune": "PNQ",
  "ahmedabad": "AMD",
  "goa": "GOI",
  "kochi": "COK", "cochin": "COK",
  "jaipur": "JAI",
  "amritsar": "ATQ",
  "varanasi": "VNS",
  "agra": "AGR",
  "leh": "IXL", "ladakh": "IXL",
  "shimla": "SLV",
  "udaipur": "UDR",
  "dubai": "DXB",
  "abu dhabi": "AUH",
  "doha": "DOH",
  "riyadh": "RUH",
  "muscat": "MCT",
  "kuwait": "KWI",
  "bahrain": "BAH",
  "singapore": "SIN",
  "bangkok": "BKK",
  "kuala lumpur": "KUL",
  "hong kong": "HKG",
  "phuket": "HKT",
  "krabi": "KBV",
  "bali": "DPS",
  "jakarta": "CGK",
  "manila": "MNL",
  "tokyo": "NRT",
  "osaka": "KIX",
  "seoul": "ICN",
  "beijing": "PEK",
  "shanghai": "PVG",
  "taipei": "TPE",
  "london": "LHR",
  "paris": "CDG",
  "amsterdam": "AMS",
  "frankfurt": "FRA",
  "rome": "FCO",
  "milan": "MXP",
  "barcelona": "BCN",
  "madrid": "MAD",
  "zurich": "ZRH",
  "vienna": "VIE",
  "brussels": "BRU",
  "istanbul": "IST",
  "turkey": "IST",
  "ankara": "ESB",
  "new york": "JFK",
  "los angeles": "LAX",
  "chicago": "ORD",
  "toronto": "YYZ",
  "vancouver": "YVR",
  "sydney": "SYD",
  "melbourne": "MEL",
  "maldives": "MLE", "male": "MLE",
  "colombo": "CMB", "sri lanka": "CMB",
  "kathmandu": "KTM", "nepal": "KTM",
  "cairo": "CAI",
  "nairobi": "NBO",
  "johannesburg": "JNB",
  "kenya": "NBO",
};

function getCityCode(city: string): string {
  const lower = city.toLowerCase().trim();
  if (CITY_CODES[lower]) return CITY_CODES[lower];
  for (const [key, code] of Object.entries(CITY_CODES)) {
    if (lower.includes(key) || key.includes(lower)) return code;
  }
  return city.substring(0, 3).toUpperCase();
}

function isInternationalRoute(from: string, to: string): boolean {
  const indianCities = ["delhi", "mumbai", "bangalore", "bengaluru", "chennai", "hyderabad",
    "kolkata", "pune", "ahmedabad", "goa", "kochi", "jaipur", "amritsar",
    "varanasi", "agra", "leh", "ladakh", "shimla", "udaipur"];
  const fromLower = from.toLowerCase();
  const toLower = to.toLowerCase();
  const fromIsIndia = indianCities.some(c => fromLower.includes(c));
  const toIsIndia = indianCities.some(c => toLower.includes(c));
  return !(fromIsIndia && toIsIndia);
}

function getBasePrice(from: string, to: string, cabinClass: string): number {
  const isIntl = isInternationalRoute(from, to);
  const toLower = to.toLowerCase();

  let base: number;
  if (!isIntl) {
    base = 3500;
  } else if (["dubai", "abu dhabi", "doha", "muscat", "riyadh", "kuwait", "bahrain"].some(c => toLower.includes(c))) {
    base = 18000;
  } else if (["singapore", "kuala lumpur", "bangkok", "phuket", "bali", "jakarta", "manila", "krabi"].some(c => toLower.includes(c))) {
    base = 22000;
  } else if (["hong kong", "tokyo", "osaka", "seoul", "beijing", "shanghai", "taipei"].some(c => toLower.includes(c))) {
    base = 35000;
  } else if (["london", "paris", "amsterdam", "frankfurt", "rome", "milan", "barcelona", "madrid", "zurich", "vienna", "istanbul", "turkey"].some(c => toLower.includes(c))) {
    base = 48000;
  } else if (["new york", "los angeles", "chicago", "toronto", "vancouver"].some(c => toLower.includes(c))) {
    base = 68000;
  } else if (["sydney", "melbourne"].some(c => toLower.includes(c))) {
    base = 72000;
  } else if (["maldives", "male", "colombo", "kathmandu"].some(c => toLower.includes(c))) {
    base = 14000;
  } else {
    base = isIntl ? 32000 : 4000;
  }

  if (cabinClass === "business") return Math.round(base * 3.2);
  if (cabinClass === "first") return Math.round(base * 6.5);
  return base;
}

function getFlightDuration(from: string, to: string): { hours: number; minutes: number } {
  const isIntl = isInternationalRoute(from, to);
  const toLower = to.toLowerCase();

  if (!isIntl) return { hours: 2, minutes: 15 };
  if (["dubai", "doha", "abu dhabi", "muscat", "riyadh"].some(c => toLower.includes(c))) return { hours: 3, minutes: 30 };
  if (["maldives", "male", "colombo", "colombo"].some(c => toLower.includes(c))) return { hours: 2, minutes: 45 };
  if (["kathmandu"].some(c => toLower.includes(c))) return { hours: 1, minutes: 40 };
  if (["singapore", "kuala lumpur", "bangkok", "phuket", "bali", "jakarta", "manila"].some(c => toLower.includes(c))) return { hours: 6, minutes: 0 };
  if (["hong kong"].some(c => toLower.includes(c))) return { hours: 7, minutes: 30 };
  if (["tokyo", "osaka", "seoul", "beijing", "shanghai"].some(c => toLower.includes(c))) return { hours: 9, minutes: 0 };
  if (["london", "paris", "amsterdam", "frankfurt", "rome", "milan", "barcelona", "madrid", "zurich", "vienna"].some(c => toLower.includes(c))) return { hours: 10, minutes: 0 };
  if (["istanbul", "turkey"].some(c => toLower.includes(c))) return { hours: 7, minutes: 0 };
  if (["new york", "los angeles", "chicago"].some(c => toLower.includes(c))) return { hours: 16, minutes: 0 };
  if (["toronto", "vancouver"].some(c => toLower.includes(c))) return { hours: 15, minutes: 0 };
  if (["sydney", "melbourne"].some(c => toLower.includes(c))) return { hours: 13, minutes: 0 };
  if (isIntl) return { hours: 8, minutes: 0 };
  return { hours: 2, minutes: 30 };
}

function addTime(base: { h: number; m: number }, duration: { hours: number; minutes: number }): string {
  let h = base.h + duration.hours;
  let m = base.m + duration.minutes;
  if (m >= 60) { h += 1; m -= 60; }
  h = h % 24;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const AIRLINES = [
  { airline: "Air India", code: "AI", amenities: ["In-flight meal", "Entertainment system", "USB charging", "Checked baggage 25kg"] },
  { airline: "IndiGo", code: "6E", amenities: ["USB charging", "Snacks available", "Checked baggage 15kg"] },
  { airline: "Emirates", code: "EK", amenities: ["Gourmet meal", "ICE entertainment", "USB & power outlet", "Amenity kit", "Checked baggage 30kg"] },
  { airline: "Qatar Airways", code: "QR", amenities: ["Award-winning meal", "Oryx entertainment", "Wi-Fi onboard", "Checked baggage 30kg"] },
  { airline: "Vistara", code: "UK", amenities: ["Premium meal", "Entertainment system", "USB charging", "Checked baggage 20kg"] },
  { airline: "Singapore Airlines", code: "SQ", amenities: ["Gourmet meal", "KrisWorld entertainment", "USB & power outlet", "Amenity kit"] },
  { airline: "Turkish Airlines", code: "TK", amenities: ["Award-winning meal", "Entertainment system", "USB charging", "Checked baggage 30kg"] },
  { airline: "Lufthansa", code: "LH", amenities: ["European dining", "Entertainment system", "Power outlets", "Checked baggage 23kg"] },
];

const DEPART_TIMES = [
  { h: 5, m: 45 }, { h: 7, m: 0 }, { h: 9, m: 30 },
  { h: 12, m: 15 }, { h: 15, m: 0 }, { h: 18, m: 45 }, { h: 22, m: 0 },
];

export function generateDynamicFlights(from: string, to: string, cabinClass?: string) {
  const fromCode = getCityCode(from);
  const toCode = getCityCode(to);
  const duration = getFlightDuration(from, to);
  const durationStr = `${duration.hours}h ${String(duration.minutes).padStart(2, "0")}m`;
  const isIntl = isInternationalRoute(from, to);
  const airlines = isIntl ? AIRLINES : AIRLINES.filter(a => ["AI", "6E", "UK"].includes(a.code));
  const picks = airlines.slice(0, isIntl ? 5 : 4);

  return picks.map((a, i) => {
    const depTime = DEPART_TIMES[i % DEPART_TIMES.length];
    const arrTime = addTime(depTime, duration);
    const basePrice = getBasePrice(from, to, cabinClass || "economy");
    const variance = [1.0, 0.88, 1.15, 0.95, 1.22][i];
    const price = Math.round((basePrice * variance) / 100) * 100;
    const stops = i === 3 && isIntl ? 1 : 0;
    const cabinAmenities = cabinClass === "business"
      ? ["Lie-flat seat", "Lounge access", "Gourmet dining", "Priority boarding", "Checked baggage 40kg"]
      : cabinClass === "first"
        ? ["Private suite", "Chauffeur service", "Michelin dining", "Dedicated lounge", "Checked baggage 50kg"]
        : a.amenities;

    return {
      id: `DYN-${fromCode}-${toCode}-${i}-${Date.now()}`,
      airline: a.airline,
      airlineCode: a.code,
      flightNumber: `${a.code}-${1000 + i * 111}`,
      from: from,
      fromCode,
      to: to,
      toCode,
      departureTime: `${String(depTime.h).padStart(2, "0")}:${String(depTime.m).padStart(2, "0")}`,
      arrivalTime: arrTime,
      duration: durationStr,
      stops,
      cabinClass: cabinClass || "economy",
      price,
      currency: "INR",
      seatsLeft: [3, 8, 15, 5, 22][i],
      amenities: cabinAmenities,
    };
  });
}

export const flightsData = [
  {
    id: "FL001",
    airline: "Air India",
    airlineCode: "AI",
    flightNumber: "AI-101",
    from: "Delhi",
    fromCode: "DEL",
    to: "Mumbai",
    toCode: "BOM",
    departureTime: "06:00",
    arrivalTime: "08:10",
    duration: "2h 10m",
    stops: 0,
    cabinClass: "economy",
    price: 4850,
    currency: "INR",
    seatsLeft: 12,
    amenities: ["In-flight meal", "USB charging", "Entertainment system"],
  },
  {
    id: "FL002",
    airline: "IndiGo",
    airlineCode: "6E",
    flightNumber: "6E-202",
    from: "Delhi",
    fromCode: "DEL",
    to: "Mumbai",
    toCode: "BOM",
    departureTime: "08:30",
    arrivalTime: "10:40",
    duration: "2h 10m",
    stops: 0,
    cabinClass: "economy",
    price: 3990,
    currency: "INR",
    seatsLeft: 5,
    amenities: ["USB charging", "Snacks available"],
  },
  {
    id: "FL003",
    airline: "Vistara",
    airlineCode: "UK",
    flightNumber: "UK-303",
    from: "Delhi",
    fromCode: "DEL",
    to: "Bangalore",
    toCode: "BLR",
    departureTime: "07:15",
    arrivalTime: "09:45",
    duration: "2h 30m",
    stops: 0,
    cabinClass: "business",
    price: 12500,
    currency: "INR",
    seatsLeft: 3,
    amenities: ["Business lounge access", "Premium meal", "Wide seats", "Priority boarding"],
  },
  {
    id: "FL004",
    airline: "SpiceJet",
    airlineCode: "SG",
    flightNumber: "SG-404",
    from: "Mumbai",
    fromCode: "BOM",
    to: "Goa",
    toCode: "GOI",
    departureTime: "10:00",
    arrivalTime: "11:15",
    duration: "1h 15m",
    stops: 0,
    cabinClass: "economy",
    price: 2750,
    currency: "INR",
    seatsLeft: 20,
    amenities: ["Snacks available", "USB charging"],
  },
  {
    id: "FL005",
    airline: "Air India",
    airlineCode: "AI",
    flightNumber: "AI-505",
    from: "Delhi",
    fromCode: "DEL",
    to: "Dubai",
    toCode: "DXB",
    departureTime: "14:00",
    arrivalTime: "16:30",
    duration: "3h 30m",
    stops: 0,
    cabinClass: "economy",
    price: 18500,
    currency: "INR",
    seatsLeft: 8,
    amenities: ["In-flight meal", "Entertainment system", "USB charging"],
  },
  {
    id: "FL006",
    airline: "Emirates",
    airlineCode: "EK",
    flightNumber: "EK-606",
    from: "Mumbai",
    fromCode: "BOM",
    to: "Dubai",
    toCode: "DXB",
    departureTime: "09:00",
    arrivalTime: "11:00",
    duration: "2h 45m",
    stops: 0,
    cabinClass: "business",
    price: 45000,
    currency: "INR",
    seatsLeft: 2,
    amenities: ["Lie-flat seats", "Gourmet dining", "Lounge access", "Chauffeur service"],
  },
  {
    id: "FL007",
    airline: "IndiGo",
    airlineCode: "6E",
    flightNumber: "6E-707",
    from: "Bangalore",
    fromCode: "BLR",
    to: "Chennai",
    toCode: "MAA",
    departureTime: "12:00",
    arrivalTime: "13:05",
    duration: "1h 05m",
    stops: 0,
    cabinClass: "economy",
    price: 2200,
    currency: "INR",
    seatsLeft: 30,
    amenities: ["USB charging"],
  },
  {
    id: "FL008",
    airline: "Vistara",
    airlineCode: "UK",
    flightNumber: "UK-808",
    from: "Delhi",
    fromCode: "DEL",
    to: "London",
    toCode: "LHR",
    departureTime: "22:00",
    arrivalTime: "04:30",
    duration: "9h 30m",
    stops: 0,
    cabinClass: "economy",
    price: 42000,
    currency: "INR",
    seatsLeft: 15,
    amenities: ["In-flight meal", "Entertainment system", "USB charging", "Blanket & pillow"],
  },
  {
    id: "FL009",
    airline: "Singapore Airlines",
    airlineCode: "SQ",
    flightNumber: "SQ-909",
    from: "Mumbai",
    fromCode: "BOM",
    to: "Singapore",
    toCode: "SIN",
    departureTime: "01:30",
    arrivalTime: "09:30",
    duration: "6h 00m",
    stops: 0,
    cabinClass: "economy",
    price: 28000,
    currency: "INR",
    seatsLeft: 10,
    amenities: ["Gourmet meal", "KrisWorld entertainment", "USB & power outlets", "Amenity kit"],
  },
  {
    id: "FL010",
    airline: "Air India",
    airlineCode: "AI",
    flightNumber: "AI-1010",
    from: "Delhi",
    fromCode: "DEL",
    to: "New York",
    toCode: "JFK",
    departureTime: "03:00",
    arrivalTime: "11:00",
    duration: "15h 30m",
    stops: 1,
    cabinClass: "economy",
    price: 68000,
    currency: "INR",
    seatsLeft: 22,
    amenities: ["In-flight meals", "Entertainment system", "USB charging", "Blanket & pillow", "Checked baggage"],
  },
];

export function searchFlights(params: {
  from?: string;
  to?: string;
  cabinClass?: string;
  travelers?: number;
}) {
  let results = [...flightsData];

  if (params.from) {
    const fromLower = params.from.toLowerCase();
    results = results.filter(
      (f) =>
        f.from.toLowerCase().includes(fromLower) ||
        f.fromCode.toLowerCase().includes(fromLower)
    );
  }
  if (params.to) {
    const toLower = params.to.toLowerCase();
    results = results.filter(
      (f) =>
        f.to.toLowerCase().includes(toLower) ||
        f.toCode.toLowerCase().includes(toLower)
    );
  }
  if (params.cabinClass) {
    results = results.filter((f) => f.cabinClass === params.cabinClass);
  }

  if (params.from && params.to && results.length === 0) {
    results = generateDynamicFlights(params.from, params.to, params.cabinClass);
  }

  return results;
}
