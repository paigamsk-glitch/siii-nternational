import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

const POPULAR_CITIES = [
  // India
  { city: "Delhi", code: "DEL", country: "India" },
  { city: "Mumbai", code: "BOM", country: "India" },
  { city: "Bangalore", code: "BLR", country: "India" },
  { city: "Chennai", code: "MAA", country: "India" },
  { city: "Kolkata", code: "CCU", country: "India" },
  { city: "Hyderabad", code: "HYD", country: "India" },
  { city: "Pune", code: "PNQ", country: "India" },
  { city: "Ahmedabad", code: "AMD", country: "India" },
  { city: "Goa", code: "GOI", country: "India" },
  { city: "Jaipur", code: "JAI", country: "India" },
  { city: "Kochi", code: "COK", country: "India" },
  { city: "Udaipur", code: "UDR", country: "India" },
  { city: "Agra", code: "AGR", country: "India" },
  { city: "Amritsar", code: "ATQ", country: "India" },
  // International
  { city: "Dubai", code: "DXB", country: "UAE" },
  { city: "London", code: "LHR", country: "UK" },
  { city: "New York", code: "JFK", country: "USA" },
  { city: "Paris", code: "CDG", country: "France" },
  { city: "Singapore", code: "SIN", country: "Singapore" },
  { city: "Bangkok", code: "BKK", country: "Thailand" },
  { city: "Bali", code: "DPS", country: "Indonesia" },
  { city: "Tokyo", code: "NRT", country: "Japan" },
  { city: "Kuala Lumpur", code: "KUL", country: "Malaysia" },
  { city: "Sydney", code: "SYD", country: "Australia" },
  { city: "Amsterdam", code: "AMS", country: "Netherlands" },
  { city: "Rome", code: "FCO", country: "Italy" },
  { city: "Barcelona", code: "BCN", country: "Spain" },
  { city: "Toronto", code: "YYZ", country: "Canada" },
  { city: "Hong Kong", code: "HKG", country: "China" },
  { city: "Colombo", code: "CMB", country: "Sri Lanka" },
  { city: "Kathmandu", code: "KTM", country: "Nepal" },
  { city: "Maldives", code: "MLE", country: "Maldives" },
];

interface CityAutocompleteProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CityAutocomplete({
  id,
  name,
  placeholder = "City or Airport",
  value,
  onChange,
  className,
}: CityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = value.length >= 1
    ? POPULAR_CITIES.filter(
        (c) =>
          c.city.toLowerCase().includes(value.toLowerCase()) ||
          c.code.toLowerCase().includes(value.toLowerCase()) ||
          c.country.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6)
    : POPULAR_CITIES.slice(0, 6);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        id={id}
        name={name}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          className
        )}
        onFocus={() => { setFocused(true); setOpen(true); }}
        onBlur={() => setFocused(false)}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
      />
      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg overflow-hidden">
          {!focused && value.length === 0 && (
            <div className="px-3 py-2 text-xs text-muted-foreground font-medium border-b border-border">
              Popular destinations
            </div>
          )}
          {filtered.map((item) => (
            <button
              key={item.code}
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors text-left"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(item.city);
                setOpen(false);
              }}
            >
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm">{item.city}</span>
                <span className="text-xs text-muted-foreground ml-1.5">{item.country}</span>
              </div>
              <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                {item.code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
