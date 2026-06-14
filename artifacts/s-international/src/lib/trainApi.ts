export interface TrainStation {
  name: string;
  code: string;
  city: string;
  state: string;
}

export interface TrainClass {
  code: string;
  label: string;
  fare: number;
  available: number;
  waitlist?: number;
  tatkal?: boolean;
  availType?: "GNWL" | "TQWL" | "RAC" | "AVAILABLE";
  updatedMinsAgo?: number;
  freeCancellation?: boolean;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  from: TrainStation;
  to: TrainStation;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runningDays: string[];
  classes: TrainClass[];
  type: "Rajdhani" | "Shatabdi" | "Express" | "Superfast" | "Mail";
  via?: string;
}

export interface TrainSearchParams {
  from: string;
  to: string;
  date: string;
  classCode?: string;
}

// ─── Station Master ─────────────────────────────────────────────────────────────
export const STATIONS: TrainStation[] = [
  // Delhi cluster
  { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
  { name: "Hazrat Nizamuddin", code: "NZM", city: "Delhi", state: "Delhi" },
  { name: "Old Delhi Junction", code: "DLI", city: "Delhi", state: "Delhi" },
  { name: "Anand Vihar Terminal", code: "ANVT", city: "Delhi", state: "Delhi" },
  { name: "Sarai Rohilla", code: "DEE", city: "Delhi", state: "Delhi" },
  // Mumbai cluster
  { name: "Mumbai Central", code: "MMCT", city: "Mumbai", state: "Maharashtra" },
  { name: "Chhatrapati Shivaji Terminus", code: "CSTM", city: "Mumbai", state: "Maharashtra" },
  { name: "Mumbai Dadar", code: "DR", city: "Mumbai", state: "Maharashtra" },
  { name: "Bandra Terminus", code: "BDTS", city: "Mumbai", state: "Maharashtra" },
  { name: "Lokmanya Tilak Terminus", code: "LTT", city: "Mumbai", state: "Maharashtra" },
  // Kolkata cluster
  { name: "Howrah Junction", code: "HWH", city: "Kolkata", state: "West Bengal" },
  { name: "Sealdah", code: "SDAH", city: "Kolkata", state: "West Bengal" },
  { name: "Kolkata Station", code: "KOAA", city: "Kolkata", state: "West Bengal" },
  // Chennai cluster
  { name: "Chennai Central", code: "MAS", city: "Chennai", state: "Tamil Nadu" },
  { name: "Chennai Egmore", code: "MS", city: "Chennai", state: "Tamil Nadu" },
  { name: "Chennai Beach", code: "MSB", city: "Chennai", state: "Tamil Nadu" },
  // Bangalore cluster
  { name: "Bangalore City Junction", code: "SBC", city: "Bangalore", state: "Karnataka" },
  { name: "Yeshvantpur Junction", code: "YPR", city: "Bangalore", state: "Karnataka" },
  { name: "Bangalore Cantt", code: "BNC", city: "Bangalore", state: "Karnataka" },
  // Hyderabad cluster
  { name: "Hyderabad Deccan", code: "HYB", city: "Hyderabad", state: "Telangana" },
  { name: "Secunderabad Junction", code: "SC", city: "Hyderabad", state: "Telangana" },
  { name: "Kacheguda", code: "KCG", city: "Hyderabad", state: "Telangana" },
  // Pune
  { name: "Pune Junction", code: "PUNE", city: "Pune", state: "Maharashtra" },
  { name: "Shivajinagar", code: "SHV", city: "Pune", state: "Maharashtra" },
  // Ahmedabad
  { name: "Ahmedabad Junction", code: "ADI", city: "Ahmedabad", state: "Gujarat" },
  { name: "Gandhinagar Capital", code: "GNC", city: "Gandhinagar", state: "Gujarat" },
  { name: "Vadodara Junction", code: "BRC", city: "Vadodara", state: "Gujarat" },
  // Rajasthan
  { name: "Jaipur Junction", code: "JP", city: "Jaipur", state: "Rajasthan" },
  { name: "Jodhpur Junction", code: "JU", city: "Jodhpur", state: "Rajasthan" },
  { name: "Udaipur City", code: "UDZ", city: "Udaipur", state: "Rajasthan" },
  { name: "Ajmer Junction", code: "AII", city: "Ajmer", state: "Rajasthan" },
  { name: "Bikaner Junction", code: "BKN", city: "Bikaner", state: "Rajasthan" },
  // UP
  { name: "Lucknow Charbagh", code: "LKO", city: "Lucknow", state: "Uttar Pradesh" },
  { name: "Agra Cantt", code: "AGC", city: "Agra", state: "Uttar Pradesh" },
  { name: "Varanasi Junction", code: "BSB", city: "Varanasi", state: "Uttar Pradesh" },
  { name: "Allahabad Junction", code: "ALD", city: "Prayagraj", state: "Uttar Pradesh" },
  { name: "Kanpur Central", code: "CNB", city: "Kanpur", state: "Uttar Pradesh" },
  { name: "Mathura Junction", code: "MTJ", city: "Mathura", state: "Uttar Pradesh" },
  // Bihar / Jharkhand
  { name: "Patna Junction", code: "PNBE", city: "Patna", state: "Bihar" },
  { name: "Ranchi Junction", code: "RNC", city: "Ranchi", state: "Jharkhand" },
  { name: "Gaya Junction", code: "GAYA", city: "Gaya", state: "Bihar" },
  // MP
  { name: "Bhopal Junction", code: "BPL", city: "Bhopal", state: "Madhya Pradesh" },
  { name: "Indore Junction", code: "INDB", city: "Indore", state: "Madhya Pradesh" },
  { name: "Nagpur Junction", code: "NGP", city: "Nagpur", state: "Maharashtra" },
  { name: "Jabalpur", code: "JBP", city: "Jabalpur", state: "Madhya Pradesh" },
  // Goa
  { name: "Goa Madgaon", code: "MAO", city: "Goa", state: "Goa" },
  { name: "Vasco-da-Gama", code: "VSG", city: "Goa", state: "Goa" },
  // Punjab / Haryana / HP
  { name: "Amritsar Junction", code: "ASR", city: "Amritsar", state: "Punjab" },
  { name: "Chandigarh", code: "CDG", city: "Chandigarh", state: "Punjab" },
  { name: "Ludhiana Junction", code: "LDH", city: "Ludhiana", state: "Punjab" },
  { name: "Jammu Tawi", code: "JAT", city: "Jammu", state: "J&K" },
  // Kerala
  { name: "Ernakulam Junction", code: "ERS", city: "Kochi", state: "Kerala" },
  { name: "Trivandrum Central", code: "TVC", city: "Thiruvananthapuram", state: "Kerala" },
  { name: "Kozhikode", code: "CLT", city: "Kozhikode", state: "Kerala" },
  { name: "Palakkad Junction", code: "PGT", city: "Palakkad", state: "Kerala" },
  // Assam / NE
  { name: "Guwahati", code: "GHY", city: "Guwahati", state: "Assam" },
  { name: "Dibrugarh", code: "DBRG", city: "Dibrugarh", state: "Assam" },
  // Tamil Nadu
  { name: "Coimbatore Junction", code: "CBE", city: "Coimbatore", state: "Tamil Nadu" },
  { name: "Madurai Junction", code: "MDU", city: "Madurai", state: "Tamil Nadu" },
  { name: "Salem Junction", code: "SA", city: "Salem", state: "Tamil Nadu" },
  // Odisha
  { name: "Bhubaneswar", code: "BBS", city: "Bhubaneswar", state: "Odisha" },
  { name: "Puri", code: "PURI", city: "Puri", state: "Odisha" },
  // Intermediate / Via stations
  { name: "Kota Junction", code: "KOTA", city: "Kota", state: "Rajasthan" },
  { name: "Ratlam Junction", code: "RTM", city: "Ratlam", state: "Madhya Pradesh" },
  { name: "Surat", code: "ST", city: "Surat", state: "Gujarat" },
  { name: "Borivali", code: "BVI", city: "Mumbai", state: "Maharashtra" },
  { name: "Visakhapatnam", code: "VSKP", city: "Visakhapatnam", state: "Andhra Pradesh" },
  { name: "Vijayawada Junction", code: "BZA", city: "Vijayawada", state: "Andhra Pradesh" },
  { name: "Warangal", code: "WL", city: "Warangal", state: "Telangana" },
  { name: "Gudur Junction", code: "GDR", city: "Gudur", state: "Andhra Pradesh" },
  { name: "Raipur Junction", code: "R", city: "Raipur", state: "Chhattisgarh" },
  { name: "Bilaspur Junction", code: "BSP", city: "Bilaspur", state: "Chhattisgarh" },
  { name: "Itarsi Junction", code: "ET", city: "Itarsi", state: "Madhya Pradesh" },
  { name: "Katni Junction", code: "KTE", city: "Katni", state: "Madhya Pradesh" },
  { name: "Jhansi Junction", code: "JHS", city: "Jhansi", state: "Uttar Pradesh" },
  { name: "Gwalior", code: "GWL", city: "Gwalior", state: "Madhya Pradesh" },
  { name: "Muzaffarpur Junction", code: "MFP", city: "Muzaffarpur", state: "Bihar" },
  { name: "Darbhanga Junction", code: "DBG", city: "Darbhanga", state: "Bihar" },
  { name: "Gorakhpur Junction", code: "GKP", city: "Gorakhpur", state: "Uttar Pradesh" },
  { name: "Mughalsarai Junction", code: "MGS", city: "Chandauli", state: "Uttar Pradesh" },
  { name: "Tatanagar Junction", code: "TATA", city: "Jamshedpur", state: "Jharkhand" },
  { name: "Kharagpur Junction", code: "KGP", city: "Kharagpur", state: "West Bengal" },
];

// ─── Train Database ─────────────────────────────────────────────────────────────
const ALL_TRAINS: Train[] = [
  // Delhi ↔ Mumbai
  {
    id: "12951",
    number: "12951",
    name: "Mumbai Rajdhani Express",
    from: { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
    to: { name: "Mumbai Central", code: "MMCT", city: "Mumbai", state: "Maharashtra" },
    departureTime: "16:55",
    arrivalTime: "08:35",
    duration: "15h 40m",
    via: "Kota · Vadodara",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Rajdhani",
    classes: [
      { code: "1A", label: "AC First Class", fare: 4895, available: 0, waitlist: 8, availType: "GNWL", updatedMinsAgo: 240, freeCancellation: true },
      { code: "1A", label: "AC First Class", fare: 5270, available: 0, waitlist: 8, availType: "GNWL", tatkal: true, updatedMinsAgo: 480, freeCancellation: false },
      { code: "2A", label: "AC 2 Tier", fare: 2875, available: 33, availType: "AVAILABLE", updatedMinsAgo: 15, freeCancellation: true },
      { code: "2A", label: "AC 2 Tier", fare: 3650, available: 0, waitlist: 11, availType: "TQWL", tatkal: true, updatedMinsAgo: 420, freeCancellation: false },
      { code: "3A", label: "AC 3 Tier", fare: 1990, available: 0, waitlist: 67, availType: "GNWL", updatedMinsAgo: 900, freeCancellation: true },
      { code: "3A", label: "AC 3 Tier", fare: 2595, available: 0, waitlist: 14, availType: "TQWL", tatkal: true, updatedMinsAgo: 420, freeCancellation: false },
    ],
  },
  {
    id: "12953",
    number: "12953",
    name: "August Kranti Rajdhani",
    from: { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
    to: { name: "Mumbai Central", code: "MMCT", city: "Mumbai", state: "Maharashtra" },
    departureTime: "17:40",
    arrivalTime: "10:55",
    duration: "17h 15m",
    via: "Ratlam · Surat",
    runningDays: ["Mon", "Wed", "Fri", "Sun"],
    type: "Rajdhani",
    classes: [
      { code: "1A", label: "AC First Class", fare: 4895, available: 8, availType: "AVAILABLE", updatedMinsAgo: 90, freeCancellation: true },
      { code: "2A", label: "AC 2 Tier", fare: 2875, available: 22, availType: "AVAILABLE", updatedMinsAgo: 30, freeCancellation: true },
      { code: "2A", label: "AC 2 Tier", fare: 3650, available: 0, waitlist: 11, availType: "TQWL", tatkal: true, updatedMinsAgo: 420, freeCancellation: false },
      { code: "3A", label: "AC 3 Tier", fare: 1990, available: 0, waitlist: 14, availType: "GNWL", updatedMinsAgo: 30, freeCancellation: true },
      { code: "3A", label: "AC 3 Tier", fare: 2490, available: 0, waitlist: 14, availType: "TQWL", tatkal: true, updatedMinsAgo: 420, freeCancellation: false },
    ],
  },
  {
    id: "12137",
    number: "12137",
    name: "Punjab Mail",
    from: { name: "Mumbai Central", code: "MMCT", city: "Mumbai", state: "Maharashtra" },
    to: { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
    departureTime: "19:30",
    arrivalTime: "16:05",
    duration: "20h 35m",
    via: "Vadodara · Kota",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Mail",
    classes: [
      { code: "1A", label: "AC First Class", fare: 3950, available: 6 },
      { code: "2A", label: "AC 2 Tier", fare: 2250, available: 45 },
      { code: "3A", label: "AC 3 Tier", fare: 1580, available: 112 },
      { code: "SL", label: "Sleeper", fare: 545, available: 320 },
    ],
  },
  // Delhi ↔ Kolkata
  {
    id: "12301",
    number: "12301",
    name: "Howrah Rajdhani Express",
    from: { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
    to: { name: "Howrah Junction", code: "HWH", city: "Kolkata", state: "West Bengal" },
    departureTime: "16:55",
    arrivalTime: "10:00",
    duration: "17h 05m",
    via: "Kanpur · Allahabad",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Rajdhani",
    classes: [
      { code: "1A", label: "AC First Class", fare: 4525, available: 10 },
      { code: "2A", label: "AC 2 Tier", fare: 2660, available: 28 },
      { code: "3A", label: "AC 3 Tier", fare: 1855, available: 65 },
    ],
  },
  {
    id: "12305",
    number: "12305",
    name: "Howrah Rajdhani (via Patna)",
    from: { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
    to: { name: "Howrah Junction", code: "HWH", city: "Kolkata", state: "West Bengal" },
    departureTime: "14:00",
    arrivalTime: "08:30",
    duration: "18h 30m",
    via: "Kanpur · Patna",
    runningDays: ["Tue", "Thu", "Sat"],
    type: "Rajdhani",
    classes: [
      { code: "2A", label: "AC 2 Tier", fare: 2660, available: 40 },
      { code: "3A", label: "AC 3 Tier", fare: 1855, available: 90 },
      { code: "SL", label: "Sleeper", fare: 640, available: 240 },
    ],
  },
  // Delhi ↔ Chennai
  {
    id: "12621",
    number: "12621",
    name: "Tamil Nadu Express",
    from: { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
    to: { name: "Chennai Central", code: "MAS", city: "Chennai", state: "Tamil Nadu" },
    departureTime: "22:30",
    arrivalTime: "07:40",
    duration: "33h 10m",
    via: "Bhopal · Nagpur · Vijayawada",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express",
    classes: [
      { code: "1A", label: "AC First Class", fare: 5800, available: 14 },
      { code: "2A", label: "AC 2 Tier", fare: 3350, available: 52 },
      { code: "3A", label: "AC 3 Tier", fare: 2340, available: 88 },
      { code: "SL", label: "Sleeper", fare: 805, available: 480 },
    ],
  },
  // Delhi ↔ Bangalore
  {
    id: "12627",
    number: "12627",
    name: "Karnataka Express",
    from: { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
    to: { name: "Bangalore City Junction", code: "SBC", city: "Bangalore", state: "Karnataka" },
    departureTime: "21:20",
    arrivalTime: "06:45",
    duration: "33h 25m",
    via: "Bhopal · Nagpur · Wadi",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express",
    classes: [
      { code: "1A", label: "AC First Class", fare: 5950, available: 10 },
      { code: "2A", label: "AC 2 Tier", fare: 3450, available: 44 },
      { code: "3A", label: "AC 3 Tier", fare: 2415, available: 102 },
      { code: "SL", label: "Sleeper", fare: 830, available: 510 },
    ],
  },
  // Mumbai ↔ Goa
  {
    id: "10111",
    number: "10111",
    name: "Konkan Kanya Express",
    from: { name: "Chhatrapati Shivaji Terminus", code: "CSTM", city: "Mumbai", state: "Maharashtra" },
    to: { name: "Goa Madgaon", code: "MAO", city: "Goa", state: "Goa" },
    departureTime: "23:00",
    arrivalTime: "11:40",
    duration: "12h 40m",
    via: "Ratnagiri · Kudal",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express",
    classes: [
      { code: "2A", label: "AC 2 Tier", fare: 1450, available: 38 },
      { code: "3A", label: "AC 3 Tier", fare: 1010, available: 74 },
      { code: "SL", label: "Sleeper", fare: 350, available: 290 },
    ],
  },
  {
    id: "12133",
    number: "12133",
    name: "Mangala Lakshadweep Express",
    from: { name: "Mumbai Dadar", code: "DR", city: "Mumbai", state: "Maharashtra" },
    to: { name: "Goa Madgaon", code: "MAO", city: "Goa", state: "Goa" },
    departureTime: "10:05",
    arrivalTime: "22:10",
    duration: "12h 05m",
    via: "Ratnagiri",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express",
    classes: [
      { code: "2A", label: "AC 2 Tier", fare: 1380, available: 20 },
      { code: "3A", label: "AC 3 Tier", fare: 970, available: 55 },
      { code: "SL", label: "Sleeper", fare: 335, available: 0, waitlist: 22 },
    ],
  },
  // Mumbai ↔ Ahmedabad
  {
    id: "12009",
    number: "12009",
    name: "Shatabdi Express",
    from: { name: "Mumbai Central", code: "MMCT", city: "Mumbai", state: "Maharashtra" },
    to: { name: "Ahmedabad Junction", code: "ADI", city: "Ahmedabad", state: "Gujarat" },
    departureTime: "06:25",
    arrivalTime: "13:10",
    duration: "6h 45m",
    via: "Surat · Vadodara",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Shatabdi",
    classes: [
      { code: "CC", label: "AC Chair Car", fare: 1145, available: 180 },
      { code: "EC", label: "Executive Chair Car", fare: 2065, available: 48 },
    ],
  },
  // Delhi ↔ Jaipur
  {
    id: "12015",
    number: "12015",
    name: "Ajmer Shatabdi",
    from: { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
    to: { name: "Jaipur Junction", code: "JP", city: "Jaipur", state: "Rajasthan" },
    departureTime: "06:05",
    arrivalTime: "10:35",
    duration: "4h 30m",
    via: "Alwar · Bandikui",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Shatabdi",
    classes: [
      { code: "CC", label: "AC Chair Car", fare: 720, available: 220 },
      { code: "EC", label: "Executive Chair Car", fare: 1360, available: 56 },
    ],
  },
  // Mumbai ↔ Pune
  {
    id: "11007",
    number: "11007",
    name: "Deccan Express",
    from: { name: "Chhatrapati Shivaji Terminus", code: "CSTM", city: "Mumbai", state: "Maharashtra" },
    to: { name: "Pune Junction", code: "PUNE", city: "Pune", state: "Maharashtra" },
    departureTime: "07:15",
    arrivalTime: "10:55",
    duration: "3h 40m",
    via: "Kalyan · Lonavala",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express",
    classes: [
      { code: "CC", label: "AC Chair Car", fare: 380, available: 95 },
      { code: "SL", label: "Sleeper", fare: 130, available: 320 },
    ],
  },
  // Hyderabad ↔ Chennai
  {
    id: "12759",
    number: "12759",
    name: "Charminar SF Express",
    from: { name: "Hyderabad Deccan", code: "HYB", city: "Hyderabad", state: "Telangana" },
    to: { name: "Chennai Central", code: "MAS", city: "Chennai", state: "Tamil Nadu" },
    departureTime: "18:15",
    arrivalTime: "06:00",
    duration: "11h 45m",
    via: "Gudur · Renigunta",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Superfast",
    classes: [
      { code: "1A", label: "AC First Class", fare: 2750, available: 8 },
      { code: "2A", label: "AC 2 Tier", fare: 1620, available: 36 },
      { code: "3A", label: "AC 3 Tier", fare: 1130, available: 82 },
      { code: "SL", label: "Sleeper", fare: 390, available: 280 },
    ],
  },
  // Delhi ↔ Amritsar
  {
    id: "12029",
    number: "12029",
    name: "Amritsar Shatabdi",
    from: { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
    to: { name: "Amritsar Junction", code: "ASR", city: "Amritsar", state: "Punjab" },
    departureTime: "07:20",
    arrivalTime: "13:15",
    duration: "5h 55m",
    via: "Ludhiana · Jalandhar",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Shatabdi",
    classes: [
      { code: "CC", label: "AC Chair Car", fare: 910, available: 160 },
      { code: "EC", label: "Executive Chair Car", fare: 1740, available: 40 },
    ],
  },
  // Mumbai ↔ Kolkata
  {
    id: "12809",
    number: "12809",
    name: "Mumbai–Howrah Mail",
    from: { name: "Mumbai Central", code: "MMCT", city: "Mumbai", state: "Maharashtra" },
    to: { name: "Howrah Junction", code: "HWH", city: "Kolkata", state: "West Bengal" },
    departureTime: "21:45",
    arrivalTime: "06:35",
    duration: "32h 50m",
    via: "Nagpur · Raipur · Tatanagar",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Mail",
    classes: [
      { code: "2A", label: "AC 2 Tier", fare: 3100, available: 28 },
      { code: "3A", label: "AC 3 Tier", fare: 2160, available: 66 },
      { code: "SL", label: "Sleeper", fare: 745, available: 380 },
    ],
  },
  // Chennai ↔ Bangalore
  {
    id: "12007",
    number: "12007",
    name: "Chennai Shatabdi",
    from: { name: "Chennai Central", code: "MAS", city: "Chennai", state: "Tamil Nadu" },
    to: { name: "Bangalore City Junction", code: "SBC", city: "Bangalore", state: "Karnataka" },
    departureTime: "06:00",
    arrivalTime: "11:00",
    duration: "5h 00m",
    via: "Katpadi · Jolarpettai",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Shatabdi",
    classes: [
      { code: "CC", label: "AC Chair Car", fare: 875, available: 145 },
      { code: "EC", label: "Executive Chair Car", fare: 1660, available: 38 },
    ],
  },
  // Delhi ↔ Lucknow
  {
    id: "12003",
    number: "12003",
    name: "Lucknow Shatabdi",
    from: { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
    to: { name: "Lucknow Charbagh", code: "LKO", city: "Lucknow", state: "Uttar Pradesh" },
    departureTime: "06:10",
    arrivalTime: "12:30",
    duration: "6h 20m",
    via: "Kanpur Central",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Shatabdi",
    classes: [
      { code: "CC", label: "AC Chair Car", fare: 840, available: 188 },
      { code: "EC", label: "Executive Chair Car", fare: 1580, available: 52 },
    ],
  },
  // Mumbai ↔ Hyderabad
  {
    id: "11303",
    number: "11303",
    name: "Udyan Express",
    from: { name: "Mumbai Dadar", code: "DR", city: "Mumbai", state: "Maharashtra" },
    to: { name: "Hyderabad Deccan", code: "HYB", city: "Hyderabad", state: "Telangana" },
    departureTime: "08:05",
    arrivalTime: "02:00",
    duration: "17h 55m",
    via: "Solapur · Bidar",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express",
    classes: [
      { code: "2A", label: "AC 2 Tier", fare: 1800, available: 32 },
      { code: "3A", label: "AC 3 Tier", fare: 1250, available: 88 },
      { code: "SL", label: "Sleeper", fare: 435, available: 320 },
    ],
  },
  // Kolkata ↔ Chennai
  {
    id: "12841",
    number: "12841",
    name: "Coromandel Express",
    from: { name: "Howrah Junction", code: "HWH", city: "Kolkata", state: "West Bengal" },
    to: { name: "Chennai Central", code: "MAS", city: "Chennai", state: "Tamil Nadu" },
    departureTime: "08:45",
    arrivalTime: "04:25",
    duration: "19h 40m",
    via: "Bhubaneswar · Visakhapatnam",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express",
    classes: [
      { code: "2A", label: "AC 2 Tier", fare: 2450, available: 42 },
      { code: "3A", label: "AC 3 Tier", fare: 1710, available: 96 },
      { code: "SL", label: "Sleeper", fare: 590, available: 440 },
    ],
  },
  // Delhi ↔ Patna
  {
    id: "12309",
    number: "12309",
    name: "Rajendra Nagar Rajdhani",
    from: { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
    to: { name: "Patna Junction", code: "PNBE", city: "Patna", state: "Bihar" },
    departureTime: "17:05",
    arrivalTime: "05:55",
    duration: "12h 50m",
    via: "Kanpur · Allahabad",
    runningDays: ["Mon", "Wed", "Fri", "Sun"],
    type: "Rajdhani",
    classes: [
      { code: "1A", label: "AC First Class", fare: 3850, available: 6 },
      { code: "2A", label: "AC 2 Tier", fare: 2260, available: 30 },
      { code: "3A", label: "AC 3 Tier", fare: 1575, available: 72 },
    ],
  },
  // Delhi ↔ Varanasi
  {
    id: "15017",
    number: "15017",
    name: "Kashi Express",
    from: { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
    to: { name: "Varanasi Junction", code: "BSB", city: "Varanasi", state: "Uttar Pradesh" },
    departureTime: "21:05",
    arrivalTime: "08:15",
    duration: "11h 10m",
    via: "Kanpur · Allahabad",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express",
    classes: [
      { code: "2A", label: "AC 2 Tier", fare: 1820, available: 36 },
      { code: "3A", label: "AC 3 Tier", fare: 1270, available: 84 },
      { code: "SL", label: "Sleeper", fare: 440, available: 360 },
    ],
  },
  // Bangalore ↔ Hyderabad
  {
    id: "12785",
    number: "12785",
    name: "Kaghaznagar Express",
    from: { name: "Yeshvantpur Junction", code: "YPR", city: "Bangalore", state: "Karnataka" },
    to: { name: "Secunderabad Junction", code: "SC", city: "Hyderabad", state: "Telangana" },
    departureTime: "23:00",
    arrivalTime: "08:15",
    duration: "9h 15m",
    via: "Dharmavaram",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express",
    classes: [
      { code: "2A", label: "AC 2 Tier", fare: 1150, available: 24 },
      { code: "3A", label: "AC 3 Tier", fare: 800, available: 68 },
      { code: "SL", label: "Sleeper", fare: 275, available: 280 },
    ],
  },
  // Delhi ↔ Agra
  {
    id: "12279",
    number: "12279",
    name: "Taj Express",
    from: { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
    to: { name: "Agra Cantt", code: "AGC", city: "Agra", state: "Uttar Pradesh" },
    departureTime: "07:15",
    arrivalTime: "10:00",
    duration: "2h 45m",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express",
    classes: [
      { code: "CC", label: "AC Chair Car", fare: 560, available: 110 },
      { code: "SL", label: "Sleeper", fare: 170, available: 280 },
    ],
  },
];

// ─── enrichClasses: auto-generates full IRCTC-style class set ─────────────────
const TATKAL_MULT: Record<string, number> = {
  "1A": 1.08, "2A": 1.27, "3A": 1.30, SL: 1.55, CC: 1.25, EC: 1.10,
};
const MINS_POOL = [15, 30, 60, 120, 240, 420, 480, 7 * 60, 15 * 60];
const WL_POOL = [8, 11, 14, 18, 22, 33, 44, 52, 67, 118];

function enrichClasses(classes: TrainClass[], seed: number): TrainClass[] {
  const result: TrainClass[] = [];

  classes.forEach((cls, i) => {
    // Skip if already enriched (has tatkal field set)
    const mins = cls.updatedMinsAgo ?? MINS_POOL[(seed + i * 3) % MINS_POOL.length];
    let derivedAvailType: TrainClass["availType"] = "AVAILABLE";
    if (cls.available === 0 && (cls.waitlist ?? 0) > 0) {
      derivedAvailType = (seed + i) % 2 === 0 ? "GNWL" : "TQWL";
    }

    result.push({
      ...cls,
      availType: cls.availType ?? derivedAvailType,
      updatedMinsAgo: mins,
      freeCancellation: cls.freeCancellation ?? (!cls.tatkal && cls.code !== "GN" && cls.code !== "2S"),
    });

    // Only add Tatkal if not already a tatkal entry and class supports it
    if (!cls.tatkal && TATKAL_MULT[cls.code]) {
      const tFare = Math.ceil((cls.fare * TATKAL_MULT[cls.code]) / 5) * 5;
      const wl = WL_POOL[(seed + i * 2 + 1) % WL_POOL.length];
      const tMins = MINS_POOL[(seed + i * 3 + 2) % MINS_POOL.length];
      result.push({
        code: cls.code,
        label: cls.label,
        fare: tFare,
        available: 0,
        waitlist: wl,
        tatkal: true,
        availType: (seed + i) % 2 === 0 ? "TQWL" : "GNWL",
        updatedMinsAgo: tMins,
        freeCancellation: false,
      });
    }
  });

  // Add 2S (Second Sitting) for long-distance overnight trains that have SL
  const hasSL = classes.some((c) => c.code === "SL");
  if (hasSL && !classes.some((c) => c.code === "2S")) {
    const slFare = classes.find((c) => c.code === "SL")!.fare;
    result.push({
      code: "2S",
      label: "Second Sitting",
      fare: Math.round(slFare * 0.4),
      available: 0,
      waitlist: WL_POOL[(seed + 4) % WL_POOL.length],
      availType: "GNWL",
      updatedMinsAgo: MINS_POOL[(seed + 5) % MINS_POOL.length],
      freeCancellation: false,
    });
  }

  // Add GN (General/Unreserved) for all overnight trains
  if (hasSL && !classes.some((c) => c.code === "GN")) {
    result.push({
      code: "GN",
      label: "General / Unreserved",
      fare: 0,
      available: 999,
      availType: "AVAILABLE",
      updatedMinsAgo: MINS_POOL[seed % MINS_POOL.length],
      freeCancellation: false,
    });
  }

  return result;
}

function applyEnrich(train: Train): Train {
  // Don't double-enrich — check if already has tatkal entries
  const alreadyEnriched = train.classes.some((c) => c.tatkal === true);
  if (alreadyEnriched) return train;
  const seed = parseInt(train.id.slice(-2), 10) || 0;
  return { ...train, classes: enrichClasses(train.classes, seed) };
}

// ─── Featured/Popular Trains ───────────────────────────────────────────────────
export function getPopularTrains(): Train[] {
  return [
    ALL_TRAINS.find((t) => t.id === "12951")!,
    ALL_TRAINS.find((t) => t.id === "12301")!,
    ALL_TRAINS.find((t) => t.id === "12621")!,
    ALL_TRAINS.find((t) => t.id === "10111")!,
    ALL_TRAINS.find((t) => t.id === "12759")!,
    ALL_TRAINS.find((t) => t.id === "12009")!,
  ].filter(Boolean).map(applyEnrich);
}

// ─── API Layer ──────────────────────────────────────────────────────────────────
function normalise(s: string) {
  return s.toLowerCase().trim();
}

function stationMatches(station: TrainStation, query: string): boolean {
  const q = normalise(query);
  return (
    normalise(station.city).includes(q) ||
    normalise(station.name).includes(q) ||
    normalise(station.code).includes(q) ||
    normalise(station.state).includes(q)
  );
}

export async function searchTrains(params: TrainSearchParams): Promise<Train[]> {
  await new Promise((r) => setTimeout(r, 800));

  const results = ALL_TRAINS.filter(
    (t) => stationMatches(t.from, params.from) && stationMatches(t.to, params.to)
  );

  if (results.length === 0) {
    return ALL_TRAINS.filter(
      (t) => stationMatches(t.to, params.from) && stationMatches(t.from, params.to)
    ).map((t) => applyEnrich({
      ...t,
      from: t.to,
      to: t.from,
      departureTime: t.arrivalTime,
      arrivalTime: t.departureTime,
    }));
  }

  return results.map(applyEnrich);
}

export function getTrainById(id: string): Train | undefined {
  return ALL_TRAINS.find((t) => t.id === id);
}

export function searchStations(query: string): TrainStation[] {
  if (!query || query.length < 1) return STATIONS.slice(0, 8);
  const q = normalise(query);
  return STATIONS.filter(
    (s) =>
      normalise(s.city).startsWith(q) ||
      normalise(s.name).startsWith(q) ||
      normalise(s.code).startsWith(q) ||
      normalise(s.city).includes(q) ||
      normalise(s.name).includes(q) ||
      normalise(s.code).includes(q)
  ).slice(0, 10);
}

// ─── Live Train Status ────────────────────────────────────────────────────────

export interface TrainStopSchedule {
  name: string;
  code: string;
  distance: number;           // km from origin
  scheduledArrival: string;   // "HH:MM" or "" for source
  scheduledDeparture: string; // "HH:MM" or "" for dest
  day: number;                // 1, 2, 3…
  platform: number;
  haltMins: number;           // 0 at origin/destination
}

export interface LiveStopResult extends TrainStopSchedule {
  status: "departed" | "current" | "upcoming";
  actualArrival?: string;
  actualDeparture?: string;
  delayMins: number;
}

export interface TrainLiveStatusResult {
  trainNumber: string;
  trainName: string;
  trainType: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  runningDays: string[];
  delayMins: number;
  currentStopIdx: number;
  percentComplete: number;
  currentBetween?: [string, string]; // [prev, next] station names when moving
  lastUpdated: string;
  stops: LiveStopResult[];
  found: boolean;
}

// ── Timetable data for major trains ──────────────────────────────────────────
const TRAIN_STOPS: Record<string, TrainStopSchedule[]> = {
  "12951": [ // Mumbai Rajdhani Express NDLS→MMCT
    { name: "New Delhi",       code: "NDLS", distance: 0,    scheduledArrival: "",      scheduledDeparture: "16:55", day: 1, platform: 16, haltMins: 0 },
    { name: "Mathura Junction",code: "MTJ",  distance: 141,  scheduledArrival: "18:15", scheduledDeparture: "18:17", day: 1, platform: 3,  haltMins: 2 },
    { name: "Kota Junction",   code: "KOTA", distance: 468,  scheduledArrival: "21:35", scheduledDeparture: "21:40", day: 1, platform: 1,  haltMins: 5 },
    { name: "Ratlam Junction", code: "RTM",  distance: 660,  scheduledArrival: "00:15", scheduledDeparture: "00:20", day: 2, platform: 1,  haltMins: 5 },
    { name: "Vadodara Junction",code:"BRC",  distance: 968,  scheduledArrival: "03:15", scheduledDeparture: "03:20", day: 2, platform: 2,  haltMins: 5 },
    { name: "Surat",           code: "ST",   distance: 1115, scheduledArrival: "04:40", scheduledDeparture: "04:42", day: 2, platform: 1,  haltMins: 2 },
    { name: "Borivali",        code: "BVI",  distance: 1341, scheduledArrival: "07:32", scheduledDeparture: "07:34", day: 2, platform: 5,  haltMins: 2 },
    { name: "Mumbai Central",  code: "MMCT", distance: 1384, scheduledArrival: "08:35", scheduledDeparture: "",      day: 2, platform: 1,  haltMins: 0 },
  ],
  "12952": [ // Mumbai Rajdhani Return MMCT→NDLS
    { name: "Mumbai Central",  code: "MMCT", distance: 0,    scheduledArrival: "",      scheduledDeparture: "17:05", day: 1, platform: 1,  haltMins: 0 },
    { name: "Borivali",        code: "BVI",  distance: 43,   scheduledArrival: "17:40", scheduledDeparture: "17:42", day: 1, platform: 5,  haltMins: 2 },
    { name: "Surat",           code: "ST",   distance: 269,  scheduledArrival: "20:15", scheduledDeparture: "20:17", day: 1, platform: 1,  haltMins: 2 },
    { name: "Vadodara Junction",code:"BRC",  distance: 416,  scheduledArrival: "21:40", scheduledDeparture: "21:45", day: 1, platform: 2,  haltMins: 5 },
    { name: "Ratlam Junction", code: "RTM",  distance: 724,  scheduledArrival: "00:55", scheduledDeparture: "01:00", day: 2, platform: 1,  haltMins: 5 },
    { name: "Kota Junction",   code: "KOTA", distance: 916,  scheduledArrival: "03:55", scheduledDeparture: "04:00", day: 2, platform: 1,  haltMins: 5 },
    { name: "Mathura Junction",code: "MTJ",  distance: 1243, scheduledArrival: "07:00", scheduledDeparture: "07:02", day: 2, platform: 3,  haltMins: 2 },
    { name: "New Delhi",       code: "NDLS", distance: 1384, scheduledArrival: "08:35", scheduledDeparture: "",      day: 2, platform: 16, haltMins: 0 },
  ],
  "12301": [ // Howrah Rajdhani NDLS→HWH
    { name: "New Delhi",          code: "NDLS", distance: 0,    scheduledArrival: "",      scheduledDeparture: "16:55", day: 1, platform: 5,  haltMins: 0 },
    { name: "Kanpur Central",     code: "CNB",  distance: 440,  scheduledArrival: "21:45", scheduledDeparture: "21:50", day: 1, platform: 4,  haltMins: 5 },
    { name: "Allahabad Junction", code: "ALD",  distance: 634,  scheduledArrival: "23:55", scheduledDeparture: "00:00", day: 2, platform: 6,  haltMins: 5 },
    { name: "Varanasi Junction",  code: "BSB",  distance: 791,  scheduledArrival: "02:30", scheduledDeparture: "02:35", day: 2, platform: 1,  haltMins: 5 },
    { name: "Gaya Junction",      code: "GAYA", distance: 997,  scheduledArrival: "05:10", scheduledDeparture: "05:15", day: 2, platform: 2,  haltMins: 5 },
    { name: "Dhanbad Junction",   code: "DHN",  distance: 1155, scheduledArrival: "07:25", scheduledDeparture: "07:30", day: 2, platform: 3,  haltMins: 5 },
    { name: "Howrah Junction",    code: "HWH",  distance: 1448, scheduledArrival: "10:00", scheduledDeparture: "",      day: 2, platform: 9,  haltMins: 0 },
  ],
  "12621": [ // Tamil Nadu Express NDLS→MAS
    { name: "New Delhi",          code: "NDLS", distance: 0,    scheduledArrival: "",      scheduledDeparture: "22:30", day: 1, platform: 2,  haltMins: 0 },
    { name: "Agra Cantt",         code: "AGC",  distance: 190,  scheduledArrival: "00:40", scheduledDeparture: "00:45", day: 2, platform: 1,  haltMins: 5 },
    { name: "Bhopal Junction",    code: "BPL",  distance: 706,  scheduledArrival: "06:45", scheduledDeparture: "06:55", day: 2, platform: 3,  haltMins: 10},
    { name: "Nagpur Junction",    code: "NGP",  distance: 1093, scheduledArrival: "13:30", scheduledDeparture: "13:45", day: 2, platform: 1,  haltMins: 15},
    { name: "Warangal",           code: "WL",   distance: 1492, scheduledArrival: "21:35", scheduledDeparture: "21:40", day: 2, platform: 2,  haltMins: 5 },
    { name: "Vijayawada Junction",code: "BZA",  distance: 1651, scheduledArrival: "00:25", scheduledDeparture: "00:30", day: 3, platform: 1,  haltMins: 5 },
    { name: "Gudur Junction",     code: "GDR",  distance: 1875, scheduledArrival: "03:55", scheduledDeparture: "04:00", day: 3, platform: 1,  haltMins: 5 },
    { name: "Chennai Central",    code: "MAS",  distance: 2182, scheduledArrival: "07:40", scheduledDeparture: "",      day: 3, platform: 8,  haltMins: 0 },
  ],
  "12009": [ // Mumbai Shatabdi MMCT→ADI
    { name: "Mumbai Central",  code: "MMCT", distance: 0,   scheduledArrival: "",      scheduledDeparture: "06:25", day: 1, platform: 1,  haltMins: 0 },
    { name: "Bharuch Junction",code: "BH",   distance: 206, scheduledArrival: "08:45", scheduledDeparture: "08:47", day: 1, platform: 2,  haltMins: 2 },
    { name: "Surat",           code: "ST",   distance: 261, scheduledArrival: "09:35", scheduledDeparture: "09:40", day: 1, platform: 3,  haltMins: 5 },
    { name: "Vadodara Junction",code:"BRC",  distance: 391, scheduledArrival: "11:00", scheduledDeparture: "11:05", day: 1, platform: 4,  haltMins: 5 },
    { name: "Anand Junction",  code: "ANND", distance: 436, scheduledArrival: "11:35", scheduledDeparture: "11:37", day: 1, platform: 1,  haltMins: 2 },
    { name: "Ahmedabad Junction",code:"ADI", distance: 493, scheduledArrival: "13:10", scheduledDeparture: "",      day: 1, platform: 1,  haltMins: 0 },
  ],
  "12007": [ // Chennai Shatabdi MAS→SBC
    { name: "Chennai Central",    code: "MAS", distance: 0,   scheduledArrival: "",      scheduledDeparture: "06:00", day: 1, platform: 8,  haltMins: 0 },
    { name: "Katpadi Junction",   code: "KPD", distance: 130, scheduledArrival: "08:10", scheduledDeparture: "08:15", day: 1, platform: 2,  haltMins: 5 },
    { name: "Jolarpettai Junction",code:"JTJ", distance: 187, scheduledArrival: "08:55", scheduledDeparture: "08:57", day: 1, platform: 1,  haltMins: 2 },
    { name: "Bangalore Cantt",    code: "BNC", distance: 358, scheduledArrival: "10:35", scheduledDeparture: "10:37", day: 1, platform: 3,  haltMins: 2 },
    { name: "Bangalore City Jn",  code: "SBC", distance: 362, scheduledArrival: "11:00", scheduledDeparture: "",      day: 1, platform: 1,  haltMins: 0 },
  ],
  "12759": [ // Charminar SF Express HYB→MAS
    { name: "Hyderabad Deccan",   code: "HYB", distance: 0,   scheduledArrival: "",      scheduledDeparture: "18:15", day: 1, platform: 1,  haltMins: 0 },
    { name: "Nalgonda",           code: "NLDA",distance: 87,  scheduledArrival: "19:30", scheduledDeparture: "19:32", day: 1, platform: 1,  haltMins: 2 },
    { name: "Miryalaguda",        code: "MYL", distance: 135, scheduledArrival: "20:18", scheduledDeparture: "20:20", day: 1, platform: 1,  haltMins: 2 },
    { name: "Gudur Junction",     code: "GDR", distance: 405, scheduledArrival: "00:40", scheduledDeparture: "00:45", day: 2, platform: 2,  haltMins: 5 },
    { name: "Renigunta Junction", code: "RU",  distance: 505, scheduledArrival: "02:30", scheduledDeparture: "02:35", day: 2, platform: 1,  haltMins: 5 },
    { name: "Chennai Central",    code: "MAS", distance: 794, scheduledArrival: "06:00", scheduledDeparture: "",      day: 2, platform: 8,  haltMins: 0 },
  ],
  "12015": [ // Ajmer Shatabdi NDLS→JP
    { name: "New Delhi",        code: "NDLS", distance: 0,   scheduledArrival: "",      scheduledDeparture: "06:05", day: 1, platform: 9,  haltMins: 0 },
    { name: "Gurgaon",          code: "GGN",  distance: 32,  scheduledArrival: "06:38", scheduledDeparture: "06:40", day: 1, platform: 1,  haltMins: 2 },
    { name: "Alwar",            code: "AWR",  distance: 154, scheduledArrival: "08:00", scheduledDeparture: "08:02", day: 1, platform: 2,  haltMins: 2 },
    { name: "Jaipur Junction",  code: "JP",   distance: 303, scheduledArrival: "10:35", scheduledDeparture: "",      day: 1, platform: 1,  haltMins: 0 },
  ],
  "12029": [ // Amritsar Shatabdi NDLS→ASR
    { name: "New Delhi",         code: "NDLS", distance: 0,   scheduledArrival: "",      scheduledDeparture: "07:20", day: 1, platform: 5,  haltMins: 0 },
    { name: "Ambala Cantt",      code: "UMB",  distance: 195, scheduledArrival: "09:25", scheduledDeparture: "09:27", day: 1, platform: 1,  haltMins: 2 },
    { name: "Ludhiana Junction", code: "LDH",  distance: 313, scheduledArrival: "10:40", scheduledDeparture: "10:45", day: 1, platform: 2,  haltMins: 5 },
    { name: "Jalandhar City",    code: "JUC",  distance: 368, scheduledArrival: "11:25", scheduledDeparture: "11:27", day: 1, platform: 3,  haltMins: 2 },
    { name: "Amritsar Junction", code: "ASR",  distance: 447, scheduledArrival: "13:15", scheduledDeparture: "",      day: 1, platform: 1,  haltMins: 0 },
  ],
  "12627": [ // Karnataka Express NDLS→SBC
    { name: "New Delhi",          code: "NDLS", distance: 0,    scheduledArrival: "",      scheduledDeparture: "21:20", day: 1, platform: 4,  haltMins: 0 },
    { name: "Agra Cantt",         code: "AGC",  distance: 190,  scheduledArrival: "23:40", scheduledDeparture: "23:45", day: 1, platform: 1,  haltMins: 5 },
    { name: "Jhansi Junction",    code: "JHS",  distance: 403,  scheduledArrival: "02:10", scheduledDeparture: "02:15", day: 2, platform: 1,  haltMins: 5 },
    { name: "Bhopal Junction",    code: "BPL",  distance: 706,  scheduledArrival: "06:00", scheduledDeparture: "06:10", day: 2, platform: 2,  haltMins: 10},
    { name: "Nagpur Junction",    code: "NGP",  distance: 1093, scheduledArrival: "12:40", scheduledDeparture: "12:50", day: 2, platform: 1,  haltMins: 10},
    { name: "Wadi Junction",      code: "WADI", distance: 1402, scheduledArrival: "18:55", scheduledDeparture: "19:00", day: 2, platform: 2,  haltMins: 5 },
    { name: "Bangalore City Jn",  code: "SBC",  distance: 2059, scheduledArrival: "06:45", scheduledDeparture: "",      day: 3, platform: 1,  haltMins: 0 },
  ],
  "10111": [ // Konkan Kanya Express CSTM→MAO
    { name: "Chhatrapati Shivaji Terminus",code:"CSTM",distance:0,   scheduledArrival: "",      scheduledDeparture: "23:00", day: 1, platform: 11, haltMins: 0 },
    { name: "Panvel",             code: "PNVL", distance: 56,  scheduledArrival: "23:58", scheduledDeparture: "00:00", day: 2, platform: 1,  haltMins: 2 },
    { name: "Roha",               code: "ROHA", distance: 115, scheduledArrival: "01:10", scheduledDeparture: "01:12", day: 2, platform: 1,  haltMins: 2 },
    { name: "Ratnagiri",          code: "RN",   distance: 360, scheduledArrival: "05:05", scheduledDeparture: "05:10", day: 2, platform: 1,  haltMins: 5 },
    { name: "Kudal",              code: "KUDL", distance: 510, scheduledArrival: "08:20", scheduledDeparture: "08:22", day: 2, platform: 1,  haltMins: 2 },
    { name: "Goa Madgaon",        code: "MAO",  distance: 582, scheduledArrival: "11:40", scheduledDeparture: "",      day: 2, platform: 1,  haltMins: 0 },
  ],
};

function timeToMins(t: string): number {
  if (!t) return -1;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minsToTime(m: number): string {
  const h = Math.floor(((m % 1440) + 1440) % 1440 / 60);
  const min = ((m % 1440) + 1440) % 1440 % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

// Deterministic delay per train (5–55 mins)
function trainDelay(trainNumber: string): number {
  const seed = trainNumber.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const delays = [0, 0, 5, 8, 12, 15, 18, 22, 28, 33, 42, 55];
  return delays[seed % delays.length];
}

export function getTrainLiveStatus(trainNumber: string): TrainLiveStatusResult | null {
  const schedule = TRAIN_STOPS[trainNumber];
  const trainMeta = ALL_TRAINS.find((t) => t.number === trainNumber);

  if (!schedule || !trainMeta) {
    // Return a not-found result
    return null;
  }

  const delayMins = trainDelay(trainNumber);
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  // Convert each stop's departure/arrival to absolute minutes accounting for multi-day
  const depBaseMins = timeToMins(schedule[0].scheduledDeparture);

  // Build absolute minutes for each stop relative to departure (day 1 = 0..1439, day 2 = 1440..2879…)
  function absTime(stop: TrainStopSchedule, useArr: boolean): number {
    const t = useArr ? stop.scheduledArrival : stop.scheduledDeparture;
    if (!t) return -1;
    return (stop.day - 1) * 1440 + timeToMins(t);
  }

  const depAbs = absTime(schedule[0], false); // always day 1 departure

  // Elapsed minutes since departure (using today's clock, wrapping)
  let elapsedMins = ((nowMins - depBaseMins) + 1440) % 1440;
  // If departure is in the future (train hasn't started yet), elapsed = -ve (show as "Not yet departed")
  if (nowMins < depBaseMins && nowMins < depBaseMins - 60) {
    elapsedMins = 0; // treat as just departed
  }

  // Determine current position among stops
  let currentStopIdx = 0;
  for (let i = 0; i < schedule.length; i++) {
    const stop = schedule[i];
    const depAbs_i = absTime(stop, false);
    const arrAbs_i = absTime(stop, true);
    const refAbs = depAbs_i >= 0 ? depAbs_i : arrAbs_i;
    const stopElapsed = (refAbs - depAbs + 1440) % 1440;
    if (stopElapsed <= elapsedMins) {
      currentStopIdx = i;
    }
  }

  // Cap at last stop
  if (currentStopIdx >= schedule.length - 1) currentStopIdx = schedule.length - 1;

  const totalDistance = schedule[schedule.length - 1].distance;
  const currentDistance = schedule[currentStopIdx].distance;
  const percentComplete = Math.round((currentDistance / totalDistance) * 100);

  // Build live stops
  const stops: LiveStopResult[] = schedule.map((stop, idx) => {
    let status: "departed" | "current" | "upcoming";
    if (idx < currentStopIdx) status = "departed";
    else if (idx === currentStopIdx) status = "current";
    else status = "upcoming";

    const arrSched = stop.scheduledArrival;
    const depSched = stop.scheduledDeparture;

    let actualArrival: string | undefined;
    let actualDeparture: string | undefined;

    if (status === "departed") {
      actualArrival = arrSched ? minsToTime(timeToMins(arrSched) + delayMins) : undefined;
      actualDeparture = depSched ? minsToTime(timeToMins(depSched) + delayMins) : undefined;
    } else if (status === "current") {
      actualArrival = arrSched ? minsToTime(timeToMins(arrSched) + delayMins) : undefined;
    } else {
      // upcoming — show expected (sched + delay)
      actualArrival = arrSched ? minsToTime(timeToMins(arrSched) + delayMins) : undefined;
      actualDeparture = depSched ? minsToTime(timeToMins(depSched) + delayMins) : undefined;
    }

    return { ...stop, status, actualArrival, actualDeparture, delayMins: status === "upcoming" ? delayMins : delayMins };
  });

  // "Between" label for when train is moving
  let currentBetween: [string, string] | undefined;
  if (currentStopIdx < schedule.length - 1) {
    currentBetween = [schedule[currentStopIdx].name, schedule[currentStopIdx + 1].name];
  }

  const updMins = [2, 3, 4, 5, 7, 8, 10];
  const lastUpdated = `${updMins[parseInt(trainNumber.slice(-1)) % updMins.length]} mins ago`;

  return {
    trainNumber: trainMeta.number,
    trainName: trainMeta.name,
    trainType: trainMeta.type,
    from: trainMeta.from.city,
    fromCode: trainMeta.from.code,
    to: trainMeta.to.city,
    toCode: trainMeta.to.code,
    runningDays: trainMeta.runningDays,
    delayMins,
    currentStopIdx,
    percentComplete,
    currentBetween,
    lastUpdated,
    stops,
    found: true,
  };
}

export function getLiveStatusTrains(): { number: string; name: string; from: string; to: string }[] {
  return Object.keys(TRAIN_STOPS).map((num) => {
    const t = ALL_TRAINS.find((x) => x.number === num);
    return t ? { number: t.number, name: t.name, from: t.from.city, to: t.to.city } : null;
  }).filter(Boolean) as { number: string; name: string; from: string; to: string }[];
}

export const CLASS_LABELS: Record<string, string> = {
  "1A": "AC First Class",
  "2A": "AC 2 Tier",
  "3A": "AC 3 Tier",
  SL: "Sleeper",
  CC: "AC Chair Car",
  EC: "Executive Chair Car",
  "2S": "Second Seating",
};

export const CLASS_ORDER = ["1A", "2A", "3A", "SL", "CC", "EC", "2S"];
