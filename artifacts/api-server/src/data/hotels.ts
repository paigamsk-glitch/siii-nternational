export const hotelsData = [
  {
    id: "HTL001",
    name: "The Leela Palace",
    destination: "Delhi",
    address: "Diplomatic Enclave, Chanakyapuri, New Delhi",
    rating: 4.9,
    reviewCount: 2340,
    pricePerNight: 18500,
    currency: "INR",
    amenities: ["Free WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Concierge", "Valet Parking"],
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    category: "Luxury",
    description: "An iconic palace-style hotel offering world-class luxury in the heart of New Delhi's diplomatic enclave.",
    checkIn: "14:00",
    checkOut: "12:00",
  },
  {
    id: "HTL002",
    name: "Taj Mahal Palace",
    destination: "Mumbai",
    address: "Apollo Bunder, Colaba, Mumbai",
    rating: 4.8,
    reviewCount: 3120,
    pricePerNight: 22000,
    currency: "INR",
    amenities: ["Free WiFi", "Pool", "Spa", "Gym", "Multiple Restaurants", "Bar", "Butler Service"],
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
    category: "Luxury",
    description: "A legendary landmark hotel overlooking the Gateway of India, offering unmatched heritage and luxury.",
    checkIn: "14:00",
    checkOut: "12:00",
  },
  {
    id: "HTL003",
    name: "Park Hyatt",
    destination: "Goa",
    address: "Arossim Beach, Cansaulim, South Goa",
    rating: 4.7,
    reviewCount: 1850,
    pricePerNight: 14500,
    currency: "INR",
    amenities: ["Free WiFi", "Beach Access", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Water Sports"],
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    category: "Luxury",
    description: "A serene beachfront retreat in South Goa with Portuguese-inspired architecture and lush tropical gardens.",
    checkIn: "15:00",
    checkOut: "11:00",
  },
  {
    id: "HTL004",
    name: "Ritz-Carlton",
    destination: "Bangalore",
    address: "99, Residency Road, Bangalore",
    rating: 4.8,
    reviewCount: 980,
    pricePerNight: 16000,
    currency: "INR",
    amenities: ["Free WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Club Lounge"],
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
    category: "Luxury",
    description: "Bangalore's most prestigious address, offering refined luxury in the heart of the Garden City.",
    checkIn: "15:00",
    checkOut: "12:00",
  },
  {
    id: "HTL005",
    name: "Ibis Styles",
    destination: "Mumbai",
    address: "Andheri East, Mumbai",
    rating: 4.2,
    reviewCount: 2100,
    pricePerNight: 4800,
    currency: "INR",
    amenities: ["Free WiFi", "Restaurant", "Bar", "Business Center", "Gym"],
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    category: "Business",
    description: "A smart, modern hotel offering great value for business and leisure travelers in vibrant Andheri.",
    checkIn: "14:00",
    checkOut: "12:00",
  },
  {
    id: "HTL006",
    name: "Four Seasons",
    destination: "Dubai",
    address: "Jumeirah Beach Road, Dubai",
    rating: 4.9,
    reviewCount: 4200,
    pricePerNight: 38000,
    currency: "INR",
    amenities: ["Beach Access", "Multiple Pools", "World-Class Spa", "10 Restaurants", "Butler Service", "Private Beach"],
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    category: "Ultra Luxury",
    description: "Dubai's most iconic beachfront address, delivering unparalleled service with sweeping Arabian Gulf views.",
    checkIn: "15:00",
    checkOut: "12:00",
  },
  {
    id: "HTL007",
    name: "The Oberoi",
    destination: "Udaipur",
    address: "Hariprasad Niwas, Pichola Lake, Udaipur",
    rating: 4.9,
    reviewCount: 1560,
    pricePerNight: 28000,
    currency: "INR",
    amenities: ["Lake View", "Pool", "Spa", "Restaurant", "Boat Rides", "Yoga & Meditation"],
    imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
    category: "Luxury",
    description: "An extraordinary palace hotel on Lake Pichola offering breathtaking views and romantic ambiance.",
    checkIn: "14:00",
    checkOut: "12:00",
  },
  {
    id: "HTL008",
    name: "Holiday Inn Express",
    destination: "Chennai",
    address: "OMR Road, Chennai",
    rating: 4.0,
    reviewCount: 780,
    pricePerNight: 3500,
    currency: "INR",
    amenities: ["Free WiFi", "Complimentary Breakfast", "Gym", "Business Center"],
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    category: "Budget",
    description: "A reliable, comfortable hotel with complimentary breakfast and easy highway access.",
    checkIn: "14:00",
    checkOut: "11:00",
  },
];

export function searchHotels(params: {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}) {
  let results = [...hotelsData];

  if (params.destination) {
    const dest = params.destination.toLowerCase();
    results = results.filter((h) => h.destination.toLowerCase().includes(dest));
  }
  if (params.minPrice) {
    results = results.filter((h) => h.pricePerNight >= params.minPrice!);
  }
  if (params.maxPrice) {
    results = results.filter((h) => h.pricePerNight <= params.maxPrice!);
  }
  if (params.rating) {
    results = results.filter((h) => h.rating >= params.rating!);
  }

  return results;
}
