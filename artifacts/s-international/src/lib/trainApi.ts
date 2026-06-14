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
      { code: "1A", label: "AC First Class", fare: 4895, available: 12 },
      { code: "2A", label: "AC 2 Tier", fare: 2875, available: 34 },
      { code: "3A", label: "AC 3 Tier", fare: 1990, available: 78 },
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
      { code: "1A", label: "AC First Class", fare: 4895, available: 8 },
      { code: "2A", label: "AC 2 Tier", fare: 2875, available: 22 },
      { code: "3A", label: "AC 3 Tier", fare: 1990, available: 0, waitlist: 14 },
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

// ─── Featured/Popular Trains ───────────────────────────────────────────────────
export function getPopularTrains(): Train[] {
  return [
    ALL_TRAINS.find((t) => t.id === "12951")!,
    ALL_TRAINS.find((t) => t.id === "12301")!,
    ALL_TRAINS.find((t) => t.id === "12621")!,
    ALL_TRAINS.find((t) => t.id === "10111")!,
    ALL_TRAINS.find((t) => t.id === "12759")!,
    ALL_TRAINS.find((t) => t.id === "12009")!,
  ].filter(Boolean);
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
    ).map((t) => ({
      ...t,
      from: t.to,
      to: t.from,
      departureTime: t.arrivalTime,
      arrivalTime: t.departureTime,
    }));
  }

  return results;
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
