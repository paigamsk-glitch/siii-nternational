export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export interface Airline {
  id: string;
  slug: string;
  name: string;
  iata: string;
  country: string;
  logo: string;
  totalRoutes: number;
  totalDestinations: number;
  dailyFlights: number;
  hub: string;
  alliance: string;
}

export interface Route {
  origin: string;
  destination: string;
}

export const AIRPORTS: Record<string, Airport> = {
  DEL: { iata: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi", country: "India", lat: 28.5665, lng: 77.1031 },
  BOM: { iata: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "India", lat: 19.0896, lng: 72.8656 },
  BLR: { iata: "BLR", name: "Kempegowda International Airport", city: "Bengaluru", country: "India", lat: 13.1986, lng: 77.7066 },
  MAA: { iata: "MAA", name: "Chennai International Airport", city: "Chennai", country: "India", lat: 12.9941, lng: 80.1709 },
  HYD: { iata: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", country: "India", lat: 17.2403, lng: 78.4294 },
  CCU: { iata: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", country: "India", lat: 22.6546, lng: 88.4467 },
  COK: { iata: "COK", name: "Cochin International Airport", city: "Kochi", country: "India", lat: 10.1520, lng: 76.3920 },
  AMD: { iata: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad", country: "India", lat: 23.0772, lng: 72.6347 },
  PNQ: { iata: "PNQ", name: "Pune Airport", city: "Pune", country: "India", lat: 18.5821, lng: 73.9197 },
  GOI: { iata: "GOI", name: "Goa International Airport", city: "Goa", country: "India", lat: 15.3808, lng: 73.8314 },
  JAI: { iata: "JAI", name: "Jaipur International Airport", city: "Jaipur", country: "India", lat: 26.8242, lng: 75.8122 },
  LKO: { iata: "LKO", name: "Chaudhary Charan Singh International Airport", city: "Lucknow", country: "India", lat: 26.7606, lng: 80.8893 },
  PAT: { iata: "PAT", name: "Jay Prakash Narayan Airport", city: "Patna", country: "India", lat: 25.5913, lng: 85.0879 },
  GAU: { iata: "GAU", name: "Lokpriya Gopinath Bordoloi International Airport", city: "Guwahati", country: "India", lat: 26.1061, lng: 91.5859 },
  BBI: { iata: "BBI", name: "Biju Patnaik International Airport", city: "Bhubaneswar", country: "India", lat: 20.2444, lng: 85.8178 },
  VTZ: { iata: "VTZ", name: "Visakhapatnam International Airport", city: "Visakhapatnam", country: "India", lat: 17.7212, lng: 83.2245 },
  NAG: { iata: "NAG", name: "Dr. Babasaheb Ambedkar International Airport", city: "Nagpur", country: "India", lat: 21.0922, lng: 79.0473 },
  TRV: { iata: "TRV", name: "Thiruvananthapuram International Airport", city: "Thiruvananthapuram", country: "India", lat: 8.4812, lng: 76.9200 },
  IXM: { iata: "IXM", name: "Madurai Airport", city: "Madurai", country: "India", lat: 9.8350, lng: 78.0934 },
  ATQ: { iata: "ATQ", name: "Sri Guru Ram Dass Jee International Airport", city: "Amritsar", country: "India", lat: 31.7096, lng: 74.7973 },
  SXR: { iata: "SXR", name: "Sheikh ul-Alam International Airport", city: "Srinagar", country: "India", lat: 33.9871, lng: 74.7742 },
  IDR: { iata: "IDR", name: "Devi Ahilyabai Holkar International Airport", city: "Indore", country: "India", lat: 22.7218, lng: 75.8010 },
  VNS: { iata: "VNS", name: "Lal Bahadur Shastri International Airport", city: "Varanasi", country: "India", lat: 25.4524, lng: 82.8593 },
  IXC: { iata: "IXC", name: "Chandigarh International Airport", city: "Chandigarh", country: "India", lat: 30.6735, lng: 76.7885 },
  DMM: { iata: "DMM", name: "King Fahd International Airport", city: "Dammam", country: "Saudi Arabia", lat: 26.4712, lng: 49.7998 },
  DXB: { iata: "DXB", name: "Dubai International Airport", city: "Dubai", country: "UAE", lat: 25.2528, lng: 55.3644 },
  AUH: { iata: "AUH", name: "Abu Dhabi International Airport", city: "Abu Dhabi", country: "UAE", lat: 24.4330, lng: 54.6511 },
  DOH: { iata: "DOH", name: "Hamad International Airport", city: "Doha", country: "Qatar", lat: 25.2610, lng: 51.5650 },
  KWI: { iata: "KWI", name: "Kuwait International Airport", city: "Kuwait City", country: "Kuwait", lat: 29.2267, lng: 47.9689 },
  MCT: { iata: "MCT", name: "Muscat International Airport", city: "Muscat", country: "Oman", lat: 23.5933, lng: 58.2844 },
  BAH: { iata: "BAH", name: "Bahrain International Airport", city: "Manama", country: "Bahrain", lat: 26.2708, lng: 50.6336 },
  RUH: { iata: "RUH", name: "King Khalid International Airport", city: "Riyadh", country: "Saudi Arabia", lat: 24.9597, lng: 46.6988 },
  JED: { iata: "JED", name: "King Abdulaziz International Airport", city: "Jeddah", country: "Saudi Arabia", lat: 21.6789, lng: 39.1565 },
  MLE: { iata: "MLE", name: "Velana International Airport", city: "Malé", country: "Maldives", lat: 4.1918, lng: 73.5292 },
  CMB: { iata: "CMB", name: "Bandaranaike International Airport", city: "Colombo", country: "Sri Lanka", lat: 7.1808, lng: 79.8841 },
  KTM: { iata: "KTM", name: "Tribhuvan International Airport", city: "Kathmandu", country: "Nepal", lat: 27.6966, lng: 85.3591 },
  DAC: { iata: "DAC", name: "Hazrat Shahjalal International Airport", city: "Dhaka", country: "Bangladesh", lat: 23.8433, lng: 90.3978 },
  KHI: { iata: "KHI", name: "Jinnah International Airport", city: "Karachi", country: "Pakistan", lat: 24.9065, lng: 67.1609 },
  LHE: { iata: "LHE", name: "Allama Iqbal International Airport", city: "Lahore", country: "Pakistan", lat: 31.5216, lng: 74.3936 },
  SIN: { iata: "SIN", name: "Singapore Changi Airport", city: "Singapore", country: "Singapore", lat: 1.3644, lng: 103.9915 },
  KUL: { iata: "KUL", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia", lat: 2.7456, lng: 101.7099 },
  BKK: { iata: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand", lat: 13.6811, lng: 100.7475 },
  HKG: { iata: "HKG", name: "Hong Kong International Airport", city: "Hong Kong", country: "China", lat: 22.3080, lng: 113.9185 },
  PEK: { iata: "PEK", name: "Beijing Capital International Airport", city: "Beijing", country: "China", lat: 40.0799, lng: 116.6031 },
  PVG: { iata: "PVG", name: "Shanghai Pudong International Airport", city: "Shanghai", country: "China", lat: 31.1443, lng: 121.8083 },
  NRT: { iata: "NRT", name: "Narita International Airport", city: "Tokyo", country: "Japan", lat: 35.7648, lng: 140.3864 },
  ICN: { iata: "ICN", name: "Incheon International Airport", city: "Seoul", country: "South Korea", lat: 37.4691, lng: 126.4509 },
  SYD: { iata: "SYD", name: "Kingsford Smith Airport", city: "Sydney", country: "Australia", lat: -33.9399, lng: 151.1753 },
  MEL: { iata: "MEL", name: "Melbourne Airport", city: "Melbourne", country: "Australia", lat: -37.6690, lng: 144.8410 },
  LHR: { iata: "LHR", name: "Heathrow Airport", city: "London", country: "United Kingdom", lat: 51.4775, lng: -0.4614 },
  CDG: { iata: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France", lat: 49.0097, lng: 2.5478 },
  FRA: { iata: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany", lat: 50.0379, lng: 8.5622 },
  AMS: { iata: "AMS", name: "Amsterdam Schiphol Airport", city: "Amsterdam", country: "Netherlands", lat: 52.3086, lng: 4.7639 },
  MUC: { iata: "MUC", name: "Munich Airport", city: "Munich", country: "Germany", lat: 48.3538, lng: 11.7861 },
  ZRH: { iata: "ZRH", name: "Zurich Airport", city: "Zurich", country: "Switzerland", lat: 47.4647, lng: 8.5492 },
  IST: { iata: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey", lat: 41.2608, lng: 28.7418 },
  CAI: { iata: "CAI", name: "Cairo International Airport", city: "Cairo", country: "Egypt", lat: 30.1219, lng: 31.4056 },
  NBO: { iata: "NBO", name: "Jomo Kenyatta International Airport", city: "Nairobi", country: "Kenya", lat: -1.3192, lng: 36.9275 },
  JNB: { iata: "JNB", name: "O.R. Tambo International Airport", city: "Johannesburg", country: "South Africa", lat: -26.1392, lng: 28.2460 },
  JFK: { iata: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "USA", lat: 40.6413, lng: -73.7781 },
  LAX: { iata: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "USA", lat: 33.9425, lng: -118.4081 },
  ORD: { iata: "ORD", name: "O'Hare International Airport", city: "Chicago", country: "USA", lat: 41.9742, lng: -87.9073 },
  EWR: { iata: "EWR", name: "Newark Liberty International Airport", city: "Newark", country: "USA", lat: 40.6895, lng: -74.1745 },
  SFO: { iata: "SFO", name: "San Francisco International Airport", city: "San Francisco", country: "USA", lat: 37.6213, lng: -122.3790 },
  YYZ: { iata: "YYZ", name: "Toronto Pearson International Airport", city: "Toronto", country: "Canada", lat: 43.6777, lng: -79.6248 },
  MEX: { iata: "MEX", name: "Benito Juárez International Airport", city: "Mexico City", country: "Mexico", lat: 19.4363, lng: -99.0721 },
  GRU: { iata: "GRU", name: "São Paulo/Guarulhos International Airport", city: "São Paulo", country: "Brazil", lat: -23.4356, lng: -46.4731 },
};

export const AIRLINES: Airline[] = [
  {
    id: "indigo", slug: "indigo", name: "IndiGo", iata: "6E",
    country: "India", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Indigo_Airlines_Logo.svg/220px-Indigo_Airlines_Logo.svg.png",
    totalRoutes: 1296, totalDestinations: 142, dailyFlights: 2055, hub: "DEL", alliance: "Independent",
  },
  {
    id: "air-india", slug: "air-india", name: "Air India", iata: "AI",
    country: "India", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Air_India_Logo.svg/220px-Air_India_Logo.svg.png",
    totalRoutes: 876, totalDestinations: 102, dailyFlights: 900, hub: "DEL", alliance: "Star Alliance",
  },
  {
    id: "emirates", slug: "emirates", name: "Emirates", iata: "EK",
    country: "UAE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/220px-Emirates_logo.svg.png",
    totalRoutes: 2104, totalDestinations: 161, dailyFlights: 3600, hub: "DXB", alliance: "Independent",
  },
  {
    id: "qatar-airways", slug: "qatar-airways", name: "Qatar Airways", iata: "QR",
    country: "Qatar", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Qatar_Airways_Logo.svg/220px-Qatar_Airways_Logo.svg.png",
    totalRoutes: 1890, totalDestinations: 160, dailyFlights: 2200, hub: "DOH", alliance: "Oneworld",
  },
  {
    id: "singapore-airlines", slug: "singapore-airlines", name: "Singapore Airlines", iata: "SQ",
    country: "Singapore", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/220px-Singapore_Airlines_Logo_2.svg.png",
    totalRoutes: 1340, totalDestinations: 131, dailyFlights: 1400, hub: "SIN", alliance: "Star Alliance",
  },
  {
    id: "british-airways", slug: "british-airways", name: "British Airways", iata: "BA",
    country: "United Kingdom", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/42/British_Airways_Logo.svg/220px-British_Airways_Logo.svg.png",
    totalRoutes: 1200, totalDestinations: 183, dailyFlights: 1350, hub: "LHR", alliance: "Oneworld",
  },
  {
    id: "lufthansa", slug: "lufthansa", name: "Lufthansa", iata: "LH",
    country: "Germany", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lufthansa_Logo_2018.svg/220px-Lufthansa_Logo_2018.svg.png",
    totalRoutes: 1450, totalDestinations: 220, dailyFlights: 1800, hub: "FRA", alliance: "Star Alliance",
  },
  {
    id: "etihad", slug: "etihad", name: "Etihad Airways", iata: "EY",
    country: "UAE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Etihad-airways-logo.svg/220px-Etihad-airways-logo.svg.png",
    totalRoutes: 980, totalDestinations: 89, dailyFlights: 1000, hub: "AUH", alliance: "Independent",
  },
  {
    id: "air-france", slug: "air-france", name: "Air France", iata: "AF",
    country: "France", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Air_France_Logo.svg/220px-Air_France_Logo.svg.png",
    totalRoutes: 1280, totalDestinations: 190, dailyFlights: 1600, hub: "CDG", alliance: "SkyTeam",
  },
  {
    id: "turkish-airlines", slug: "turkish-airlines", name: "Turkish Airlines", iata: "TK",
    country: "Turkey", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Turkish_Airlines_logo_2019_compact.svg/220px-Turkish_Airlines_logo_2019_compact.svg.png",
    totalRoutes: 2456, totalDestinations: 315, dailyFlights: 3200, hub: "IST", alliance: "Star Alliance",
  },
  {
    id: "thai-airways", slug: "thai-airways", name: "Thai Airways", iata: "TG",
    country: "Thailand", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Thai_Airways_logo.svg/220px-Thai_Airways_logo.svg.png",
    totalRoutes: 780, totalDestinations: 84, dailyFlights: 700, hub: "BKK", alliance: "Star Alliance",
  },
  {
    id: "malaysia-airlines", slug: "malaysia-airlines", name: "Malaysia Airlines", iata: "MH",
    country: "Malaysia", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Malaysia_Airlines_Logo_%282010%E2%80%932019%29.svg/220px-Malaysia_Airlines_Logo_%282010%E2%80%932019%29.svg.png",
    totalRoutes: 680, totalDestinations: 59, dailyFlights: 620, hub: "KUL", alliance: "Oneworld",
  },
];

export const AIRLINE_ROUTES: Record<string, Route[]> = {
  "indigo": [
    { origin: "DEL", destination: "BOM" }, { origin: "DEL", destination: "BLR" },
    { origin: "DEL", destination: "HYD" }, { origin: "DEL", destination: "MAA" },
    { origin: "DEL", destination: "CCU" }, { origin: "DEL", destination: "COK" },
    { origin: "DEL", destination: "AMD" }, { origin: "DEL", destination: "PNQ" },
    { origin: "DEL", destination: "GOI" }, { origin: "DEL", destination: "JAI" },
    { origin: "DEL", destination: "LKO" }, { origin: "DEL", destination: "PAT" },
    { origin: "DEL", destination: "GAU" }, { origin: "DEL", destination: "BBI" },
    { origin: "DEL", destination: "VTZ" }, { origin: "DEL", destination: "NAG" },
    { origin: "DEL", destination: "TRV" }, { origin: "DEL", destination: "IXM" },
    { origin: "DEL", destination: "ATQ" }, { origin: "DEL", destination: "SXR" },
    { origin: "DEL", destination: "IDR" }, { origin: "DEL", destination: "VNS" },
    { origin: "DEL", destination: "IXC" }, { origin: "DEL", destination: "DXB" },
    { origin: "DEL", destination: "DOH" }, { origin: "DEL", destination: "KWI" },
    { origin: "DEL", destination: "MCT" }, { origin: "DEL", destination: "BAH" },
    { origin: "DEL", destination: "RUH" }, { origin: "DEL", destination: "JED" },
    { origin: "DEL", destination: "CMB" }, { origin: "DEL", destination: "KTM" },
    { origin: "DEL", destination: "DAC" }, { origin: "DEL", destination: "SIN" },
    { origin: "DEL", destination: "BKK" }, { origin: "DEL", destination: "KUL" },
    { origin: "BOM", destination: "BLR" }, { origin: "BOM", destination: "HYD" },
    { origin: "BOM", destination: "MAA" }, { origin: "BOM", destination: "COK" },
    { origin: "BOM", destination: "AMD" }, { origin: "BOM", destination: "GOI" },
    { origin: "BOM", destination: "PNQ" }, { origin: "BOM", destination: "CCU" },
    { origin: "BOM", destination: "DXB" }, { origin: "BOM", destination: "DOH" },
    { origin: "BOM", destination: "MCT" }, { origin: "BOM", destination: "KWI" },
    { origin: "BOM", destination: "BAH" }, { origin: "BOM", destination: "RUH" },
    { origin: "BOM", destination: "JED" }, { origin: "BOM", destination: "CMB" },
    { origin: "BOM", destination: "SIN" }, { origin: "BOM", destination: "BKK" },
    { origin: "BLR", destination: "HYD" }, { origin: "BLR", destination: "MAA" },
    { origin: "BLR", destination: "COK" }, { origin: "BLR", destination: "DXB" },
    { origin: "BLR", destination: "DOH" }, { origin: "BLR", destination: "SIN" },
    { origin: "HYD", destination: "MAA" }, { origin: "HYD", destination: "DXB" },
    { origin: "MAA", destination: "CMB" }, { origin: "MAA", destination: "SIN" },
    { origin: "COK", destination: "DXB" }, { origin: "COK", destination: "MLE" },
  ],
  "air-india": [
    { origin: "DEL", destination: "BOM" }, { origin: "DEL", destination: "BLR" },
    { origin: "DEL", destination: "HYD" }, { origin: "DEL", destination: "MAA" },
    { origin: "DEL", destination: "CCU" }, { origin: "DEL", destination: "COK" },
    { origin: "DEL", destination: "AMD" }, { origin: "DEL", destination: "PNQ" },
    { origin: "DEL", destination: "GOI" }, { origin: "DEL", destination: "JAI" },
    { origin: "DEL", destination: "ATQ" }, { origin: "DEL", destination: "SXR" },
    { origin: "DEL", destination: "KTM" }, { origin: "DEL", destination: "DAC" },
    { origin: "DEL", destination: "CMB" }, { origin: "DEL", destination: "DXB" },
    { origin: "DEL", destination: "DOH" }, { origin: "DEL", destination: "AUH" },
    { origin: "DEL", destination: "KWI" }, { origin: "DEL", destination: "BAH" },
    { origin: "DEL", destination: "RUH" }, { origin: "DEL", destination: "JED" },
    { origin: "DEL", destination: "MCT" }, { origin: "DEL", destination: "SIN" },
    { origin: "DEL", destination: "KUL" }, { origin: "DEL", destination: "BKK" },
    { origin: "DEL", destination: "HKG" }, { origin: "DEL", destination: "NRT" },
    { origin: "DEL", destination: "LHR" }, { origin: "DEL", destination: "CDG" },
    { origin: "DEL", destination: "FRA" }, { origin: "DEL", destination: "JFK" },
    { origin: "DEL", destination: "EWR" }, { origin: "DEL", destination: "ORD" },
    { origin: "DEL", destination: "SFO" }, { origin: "DEL", destination: "YYZ" },
    { origin: "DEL", destination: "IST" }, { origin: "DEL", destination: "AMS" },
    { origin: "DEL", destination: "MUC" }, { origin: "DEL", destination: "ZRH" },
    { origin: "DEL", destination: "SYD" }, { origin: "DEL", destination: "MEL" },
    { origin: "BOM", destination: "DXB" }, { origin: "BOM", destination: "LHR" },
    { origin: "BOM", destination: "JFK" }, { origin: "BOM", destination: "SIN" },
    { origin: "BOM", destination: "BKK" }, { origin: "BOM", destination: "NRT" },
    { origin: "BOM", destination: "CDG" }, { origin: "BOM", destination: "FRA" },
    { origin: "BLR", destination: "LHR" }, { origin: "BLR", destination: "SIN" },
    { origin: "MAA", destination: "SIN" }, { origin: "CCU", destination: "SIN" },
  ],
  "emirates": [
    { origin: "DXB", destination: "DEL" }, { origin: "DXB", destination: "BOM" },
    { origin: "DXB", destination: "BLR" }, { origin: "DXB", destination: "MAA" },
    { origin: "DXB", destination: "HYD" }, { origin: "DXB", destination: "CCU" },
    { origin: "DXB", destination: "COK" }, { origin: "DXB", destination: "AMD" },
    { origin: "DXB", destination: "PNQ" }, { origin: "DXB", destination: "GOI" },
    { origin: "DXB", destination: "JAI" }, { origin: "DXB", destination: "LKO" },
    { origin: "DXB", destination: "ATQ" }, { origin: "DXB", destination: "TRV" },
    { origin: "DXB", destination: "IXM" }, { origin: "DXB", destination: "CMB" },
    { origin: "DXB", destination: "KTM" }, { origin: "DXB", destination: "DAC" },
    { origin: "DXB", destination: "KHI" }, { origin: "DXB", destination: "LHE" },
    { origin: "DXB", destination: "SIN" }, { origin: "DXB", destination: "KUL" },
    { origin: "DXB", destination: "BKK" }, { origin: "DXB", destination: "HKG" },
    { origin: "DXB", destination: "PEK" }, { origin: "DXB", destination: "NRT" },
    { origin: "DXB", destination: "ICN" }, { origin: "DXB", destination: "SYD" },
    { origin: "DXB", destination: "MEL" }, { origin: "DXB", destination: "LHR" },
    { origin: "DXB", destination: "CDG" }, { origin: "DXB", destination: "FRA" },
    { origin: "DXB", destination: "AMS" }, { origin: "DXB", destination: "MUC" },
    { origin: "DXB", destination: "ZRH" }, { origin: "DXB", destination: "IST" },
    { origin: "DXB", destination: "JFK" }, { origin: "DXB", destination: "LAX" },
    { origin: "DXB", destination: "ORD" }, { origin: "DXB", destination: "JNB" },
    { origin: "DXB", destination: "NBO" }, { origin: "DXB", destination: "CAI" },
    { origin: "DXB", destination: "MLE" }, { origin: "DXB", destination: "GRU" },
    { origin: "DXB", destination: "DOH" }, { origin: "DXB", destination: "MCT" },
  ],
  "qatar-airways": [
    { origin: "DOH", destination: "DEL" }, { origin: "DOH", destination: "BOM" },
    { origin: "DOH", destination: "BLR" }, { origin: "DOH", destination: "MAA" },
    { origin: "DOH", destination: "HYD" }, { origin: "DOH", destination: "CCU" },
    { origin: "DOH", destination: "COK" }, { origin: "DOH", destination: "AMD" },
    { origin: "DOH", destination: "PNQ" }, { origin: "DOH", destination: "GOI" },
    { origin: "DOH", destination: "TRV" }, { origin: "DOH", destination: "ATQ" },
    { origin: "DOH", destination: "CMB" }, { origin: "DOH", destination: "KTM" },
    { origin: "DOH", destination: "DAC" }, { origin: "DOH", destination: "KHI" },
    { origin: "DOH", destination: "SIN" }, { origin: "DOH", destination: "KUL" },
    { origin: "DOH", destination: "BKK" }, { origin: "DOH", destination: "HKG" },
    { origin: "DOH", destination: "NRT" }, { origin: "DOH", destination: "ICN" },
    { origin: "DOH", destination: "SYD" }, { origin: "DOH", destination: "LHR" },
    { origin: "DOH", destination: "CDG" }, { origin: "DOH", destination: "FRA" },
    { origin: "DOH", destination: "AMS" }, { origin: "DOH", destination: "MUC" },
    { origin: "DOH", destination: "ZRH" }, { origin: "DOH", destination: "IST" },
    { origin: "DOH", destination: "JFK" }, { origin: "DOH", destination: "LAX" },
    { origin: "DOH", destination: "ORD" }, { origin: "DOH", destination: "JNB" },
    { origin: "DOH", destination: "NBO" }, { origin: "DOH", destination: "CAI" },
    { origin: "DOH", destination: "MLE" }, { origin: "DOH", destination: "DXB" },
    { origin: "DOH", destination: "AUH" }, { origin: "DOH", destination: "GRU" },
  ],
  "singapore-airlines": [
    { origin: "SIN", destination: "DEL" }, { origin: "SIN", destination: "BOM" },
    { origin: "SIN", destination: "BLR" }, { origin: "SIN", destination: "MAA" },
    { origin: "SIN", destination: "HYD" }, { origin: "SIN", destination: "CCU" },
    { origin: "SIN", destination: "CMB" }, { origin: "SIN", destination: "KTM" },
    { origin: "SIN", destination: "DAC" }, { origin: "SIN", destination: "KUL" },
    { origin: "SIN", destination: "BKK" }, { origin: "SIN", destination: "HKG" },
    { origin: "SIN", destination: "PEK" }, { origin: "SIN", destination: "PVG" },
    { origin: "SIN", destination: "NRT" }, { origin: "SIN", destination: "ICN" },
    { origin: "SIN", destination: "SYD" }, { origin: "SIN", destination: "MEL" },
    { origin: "SIN", destination: "LHR" }, { origin: "SIN", destination: "CDG" },
    { origin: "SIN", destination: "FRA" }, { origin: "SIN", destination: "AMS" },
    { origin: "SIN", destination: "MUC" }, { origin: "SIN", destination: "ZRH" },
    { origin: "SIN", destination: "JFK" }, { origin: "SIN", destination: "LAX" },
    { origin: "SIN", destination: "ORD" }, { origin: "SIN", destination: "SFO" },
    { origin: "SIN", destination: "DXB" }, { origin: "SIN", destination: "DOH" },
    { origin: "SIN", destination: "MLE" }, { origin: "SIN", destination: "JNB" },
  ],
  "british-airways": [
    { origin: "LHR", destination: "DEL" }, { origin: "LHR", destination: "BOM" },
    { origin: "LHR", destination: "BLR" }, { origin: "LHR", destination: "MAA" },
    { origin: "LHR", destination: "HYD" }, { origin: "LHR", destination: "COK" },
    { origin: "LHR", destination: "AMD" }, { origin: "LHR", destination: "CCU" },
    { origin: "LHR", destination: "CMB" }, { origin: "LHR", destination: "DXB" },
    { origin: "LHR", destination: "DOH" }, { origin: "LHR", destination: "SIN" },
    { origin: "LHR", destination: "KUL" }, { origin: "LHR", destination: "BKK" },
    { origin: "LHR", destination: "HKG" }, { origin: "LHR", destination: "NRT" },
    { origin: "LHR", destination: "SYD" }, { origin: "LHR", destination: "MEL" },
    { origin: "LHR", destination: "JFK" }, { origin: "LHR", destination: "LAX" },
    { origin: "LHR", destination: "ORD" }, { origin: "LHR", destination: "SFO" },
    { origin: "LHR", destination: "YYZ" }, { origin: "LHR", destination: "CDG" },
    { origin: "LHR", destination: "FRA" }, { origin: "LHR", destination: "AMS" },
    { origin: "LHR", destination: "MUC" }, { origin: "LHR", destination: "IST" },
    { origin: "LHR", destination: "JNB" }, { origin: "LHR", destination: "NBO" },
    { origin: "LHR", destination: "GRU" },
  ],
  "lufthansa": [
    { origin: "FRA", destination: "DEL" }, { origin: "FRA", destination: "BOM" },
    { origin: "FRA", destination: "BLR" }, { origin: "FRA", destination: "MAA" },
    { origin: "FRA", destination: "HYD" }, { origin: "FRA", destination: "CCU" },
    { origin: "FRA", destination: "DXB" }, { origin: "FRA", destination: "DOH" },
    { origin: "FRA", destination: "SIN" }, { origin: "FRA", destination: "BKK" },
    { origin: "FRA", destination: "HKG" }, { origin: "FRA", destination: "NRT" },
    { origin: "FRA", destination: "SYD" }, { origin: "FRA", destination: "JFK" },
    { origin: "FRA", destination: "LAX" }, { origin: "FRA", destination: "ORD" },
    { origin: "FRA", destination: "YYZ" }, { origin: "FRA", destination: "GRU" },
    { origin: "FRA", destination: "JNB" }, { origin: "FRA", destination: "NBO" },
    { origin: "FRA", destination: "IST" }, { origin: "FRA", destination: "CAI" },
    { origin: "MUC", destination: "DEL" }, { origin: "MUC", destination: "BOM" },
    { origin: "MUC", destination: "DXB" }, { origin: "MUC", destination: "SIN" },
    { origin: "MUC", destination: "JFK" }, { origin: "MUC", destination: "LAX" },
    { origin: "MUC", destination: "NRT" }, { origin: "MUC", destination: "BKK" },
  ],
  "etihad": [
    { origin: "AUH", destination: "DEL" }, { origin: "AUH", destination: "BOM" },
    { origin: "AUH", destination: "BLR" }, { origin: "AUH", destination: "MAA" },
    { origin: "AUH", destination: "HYD" }, { origin: "AUH", destination: "CCU" },
    { origin: "AUH", destination: "COK" }, { origin: "AUH", destination: "AMD" },
    { origin: "AUH", destination: "TRV" }, { origin: "AUH", destination: "GOI" },
    { origin: "AUH", destination: "CMB" }, { origin: "AUH", destination: "KTM" },
    { origin: "AUH", destination: "DAC" }, { origin: "AUH", destination: "KHI" },
    { origin: "AUH", destination: "SIN" }, { origin: "AUH", destination: "BKK" },
    { origin: "AUH", destination: "HKG" }, { origin: "AUH", destination: "SYD" },
    { origin: "AUH", destination: "MEL" }, { origin: "AUH", destination: "LHR" },
    { origin: "AUH", destination: "CDG" }, { origin: "AUH", destination: "FRA" },
    { origin: "AUH", destination: "AMS" }, { origin: "AUH", destination: "JFK" },
    { origin: "AUH", destination: "LAX" }, { origin: "AUH", destination: "ORD" },
    { origin: "AUH", destination: "JNB" }, { origin: "AUH", destination: "NBO" },
    { origin: "AUH", destination: "CAI" }, { origin: "AUH", destination: "MLE" },
  ],
  "air-france": [
    { origin: "CDG", destination: "DEL" }, { origin: "CDG", destination: "BOM" },
    { origin: "CDG", destination: "BLR" }, { origin: "CDG", destination: "MAA" },
    { origin: "CDG", destination: "DXB" }, { origin: "CDG", destination: "DOH" },
    { origin: "CDG", destination: "SIN" }, { origin: "CDG", destination: "BKK" },
    { origin: "CDG", destination: "HKG" }, { origin: "CDG", destination: "NRT" },
    { origin: "CDG", destination: "PEK" }, { origin: "CDG", destination: "ICN" },
    { origin: "CDG", destination: "SYD" }, { origin: "CDG", destination: "JFK" },
    { origin: "CDG", destination: "LAX" }, { origin: "CDG", destination: "ORD" },
    { origin: "CDG", destination: "YYZ" }, { origin: "CDG", destination: "GRU" },
    { origin: "CDG", destination: "JNB" }, { origin: "CDG", destination: "NBO" },
    { origin: "CDG", destination: "CAI" }, { origin: "CDG", destination: "IST" },
    { origin: "CDG", destination: "AMS" }, { origin: "CDG", destination: "FRA" },
    { origin: "CDG", destination: "MUC" }, { origin: "CDG", destination: "LHR" },
  ],
  "turkish-airlines": [
    { origin: "IST", destination: "DEL" }, { origin: "IST", destination: "BOM" },
    { origin: "IST", destination: "BLR" }, { origin: "IST", destination: "MAA" },
    { origin: "IST", destination: "HYD" }, { origin: "IST", destination: "CCU" },
    { origin: "IST", destination: "COK" }, { origin: "IST", destination: "DAC" },
    { origin: "IST", destination: "CMB" }, { origin: "IST", destination: "KTM" },
    { origin: "IST", destination: "DXB" }, { origin: "IST", destination: "DOH" },
    { origin: "IST", destination: "AUH" }, { origin: "IST", destination: "RUH" },
    { origin: "IST", destination: "JED" }, { origin: "IST", destination: "KWI" },
    { origin: "IST", destination: "SIN" }, { origin: "IST", destination: "BKK" },
    { origin: "IST", destination: "KUL" }, { origin: "IST", destination: "HKG" },
    { origin: "IST", destination: "NRT" }, { origin: "IST", destination: "ICN" },
    { origin: "IST", destination: "SYD" }, { origin: "IST", destination: "LHR" },
    { origin: "IST", destination: "CDG" }, { origin: "IST", destination: "FRA" },
    { origin: "IST", destination: "AMS" }, { origin: "IST", destination: "JFK" },
    { origin: "IST", destination: "LAX" }, { origin: "IST", destination: "ORD" },
    { origin: "IST", destination: "JNB" }, { origin: "IST", destination: "NBO" },
    { origin: "IST", destination: "CAI" }, { origin: "IST", destination: "GRU" },
  ],
  "thai-airways": [
    { origin: "BKK", destination: "DEL" }, { origin: "BKK", destination: "BOM" },
    { origin: "BKK", destination: "BLR" }, { origin: "BKK", destination: "MAA" },
    { origin: "BKK", destination: "COK" }, { origin: "BKK", destination: "CMB" },
    { origin: "BKK", destination: "KTM" }, { origin: "BKK", destination: "DAC" },
    { origin: "BKK", destination: "SIN" }, { origin: "BKK", destination: "KUL" },
    { origin: "BKK", destination: "HKG" }, { origin: "BKK", destination: "NRT" },
    { origin: "BKK", destination: "PEK" }, { origin: "BKK", destination: "ICN" },
    { origin: "BKK", destination: "SYD" }, { origin: "BKK", destination: "MEL" },
    { origin: "BKK", destination: "LHR" }, { origin: "BKK", destination: "FRA" },
    { origin: "BKK", destination: "AMS" }, { origin: "BKK", destination: "DXB" },
    { origin: "BKK", destination: "DOH" }, { origin: "BKK", destination: "MLE" },
  ],
  "malaysia-airlines": [
    { origin: "KUL", destination: "DEL" }, { origin: "KUL", destination: "BOM" },
    { origin: "KUL", destination: "BLR" }, { origin: "KUL", destination: "MAA" },
    { origin: "KUL", destination: "COK" }, { origin: "KUL", destination: "CMB" },
    { origin: "KUL", destination: "DAC" }, { origin: "KUL", destination: "SIN" },
    { origin: "KUL", destination: "BKK" }, { origin: "KUL", destination: "HKG" },
    { origin: "KUL", destination: "NRT" }, { origin: "KUL", destination: "ICN" },
    { origin: "KUL", destination: "SYD" }, { origin: "KUL", destination: "MEL" },
    { origin: "KUL", destination: "LHR" }, { origin: "KUL", destination: "CDG" },
    { origin: "KUL", destination: "AMS" }, { origin: "KUL", destination: "FRA" },
    { origin: "KUL", destination: "DXB" }, { origin: "KUL", destination: "DOH" },
    { origin: "KUL", destination: "JNB" }, { origin: "KUL", destination: "CAI" },
  ],
};

export function getRouteDistance(origin: Airport, dest: Airport): number {
  const R = 6371;
  const dLat = ((dest.lat - origin.lat) * Math.PI) / 180;
  const dLng = ((dest.lng - origin.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((origin.lat * Math.PI) / 180) *
    Math.cos((dest.lat * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function getFlightTime(distanceKm: number): string {
  const hours = distanceKm / 850;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

export function getMarkerColor(routeCount: number): string {
  if (routeCount > 100) return "#22c55e";
  if (routeCount > 35)  return "#3b82f6";
  if (routeCount > 5)   return "#f97316";
  return "#9ca3af";
}
