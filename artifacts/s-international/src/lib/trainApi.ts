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
}

export interface TrainSearchParams {
  from: string;
  to: string;
  date: string;
  classCode?: string;
}

// ─── Station Master ────────────────────────────────────────────────────────────
export const STATIONS: TrainStation[] = [
  { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
  { name: "Hazrat Nizamuddin", code: "NZM", city: "Delhi", state: "Delhi" },
  { name: "Old Delhi", code: "DLI", city: "Delhi", state: "Delhi" },
  { name: "Mumbai Central", code: "MMCT", city: "Mumbai", state: "Maharashtra" },
  { name: "Chhatrapati Shivaji Terminus", code: "CSTM", city: "Mumbai", state: "Maharashtra" },
  { name: "Mumbai Dadar", code: "DR", city: "Mumbai", state: "Maharashtra" },
  { name: "Howrah Junction", code: "HWH", city: "Kolkata", state: "West Bengal" },
  { name: "Sealdah", code: "SDAH", city: "Kolkata", state: "West Bengal" },
  { name: "Chennai Central", code: "MAS", city: "Chennai", state: "Tamil Nadu" },
  { name: "Chennai Egmore", code: "MS", city: "Chennai", state: "Tamil Nadu" },
  { name: "Bangalore City", code: "SBC", city: "Bangalore", state: "Karnataka" },
  { name: "Yeshvantpur", code: "YPR", city: "Bangalore", state: "Karnataka" },
  { name: "Hyderabad Deccan", code: "HYB", city: "Hyderabad", state: "Telangana" },
  { name: "Secunderabad", code: "SC", city: "Hyderabad", state: "Telangana" },
  { name: "Pune Junction", code: "PUNE", city: "Pune", state: "Maharashtra" },
  { name: "Ahmedabad Junction", code: "ADI", city: "Ahmedabad", state: "Gujarat" },
  { name: "Jaipur Junction", code: "JP", city: "Jaipur", state: "Rajasthan" },
  { name: "Lucknow Charbagh", code: "LKO", city: "Lucknow", state: "Uttar Pradesh" },
  { name: "Patna Junction", code: "PNBE", city: "Patna", state: "Bihar" },
  { name: "Bhopal Junction", code: "BPL", city: "Bhopal", state: "Madhya Pradesh" },
  { name: "Indore Junction", code: "INDB", city: "Indore", state: "Madhya Pradesh" },
  { name: "Nagpur Junction", code: "NGP", city: "Nagpur", state: "Maharashtra" },
  { name: "Goa Madgaon", code: "MAO", city: "Goa", state: "Goa" },
  { name: "Amritsar Junction", code: "ASR", city: "Amritsar", state: "Punjab" },
  { name: "Chandigarh", code: "CDG", city: "Chandigarh", state: "Punjab" },
  { name: "Kochi Ernakulam", code: "ERS", city: "Kochi", state: "Kerala" },
  { name: "Trivandrum Central", code: "TVC", city: "Thiruvananthapuram", state: "Kerala" },
  { name: "Agra Cantt", code: "AGC", city: "Agra", state: "Uttar Pradesh" },
  { name: "Varanasi Junction", code: "BSB", city: "Varanasi", state: "Uttar Pradesh" },
  { name: "Guwahati", code: "GHY", city: "Guwahati", state: "Assam" },
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
    to: { name: "Bangalore City", code: "SBC", city: "Bangalore", state: "Karnataka" },
    departureTime: "21:20",
    arrivalTime: "06:45",
    duration: "33h 25m",
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
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express",
    classes: [
      { code: "CC", label: "AC Chair Car", fare: 380, available: 95 },
      { code: "2S", label: "Second Seating", fare: 130, available: 320 },
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
    to: { name: "Bangalore City", code: "SBC", city: "Bangalore", state: "Karnataka" },
    departureTime: "06:00",
    arrivalTime: "11:00",
    duration: "5h 00m",
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
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express",
    classes: [
      { code: "2A", label: "AC 2 Tier", fare: 1800, available: 32 },
      { code: "3A", label: "AC 3 Tier", fare: 1250, available: 88 },
      { code: "SL", label: "Sleeper", fare: 435, available: 320 },
    ],
  },
];

// ─── API Layer ──────────────────────────────────────────────────────────────────
// This service layer is designed to be replaced with a live API.
// To connect IRCTC / RapidAPI:
//   1. Set VITE_TRAIN_API_URL and VITE_TRAIN_API_KEY in your .env
//   2. Replace the mock logic below with real fetch() calls

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
  // ── Swap this block for a real API call ──────────────────────────────────────
  // const res = await fetch(`${import.meta.env.VITE_TRAIN_API_URL}/trains/search`, {
  //   headers: { "x-api-key": import.meta.env.VITE_TRAIN_API_KEY },
  //   body: JSON.stringify(params),
  //   method: "POST",
  // });
  // return res.json();
  // ─────────────────────────────────────────────────────────────────────────────

  await new Promise((r) => setTimeout(r, 900)); // Simulate network delay

  const results = ALL_TRAINS.filter(
    (t) => stationMatches(t.from, params.from) && stationMatches(t.to, params.to)
  );

  // Also try reverse if no results (some routes stored only one direction)
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
      normalise(s.city).includes(q) ||
      normalise(s.name).includes(q) ||
      normalise(s.code).includes(q)
  ).slice(0, 8);
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
