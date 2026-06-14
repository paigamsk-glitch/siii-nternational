import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Train } from "lucide-react";
import { searchStations, type TrainStation } from "@/lib/trainApi";

interface StationAutocompleteProps {
  id?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function StationAutocomplete({
  id,
  placeholder = "Station or City",
  value,
  onChange,
  className,
}: StationAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const results = searchStations(value);

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
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          className
        )}
        onFocus={() => setOpen(true)}
        onBlur={() => {}}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
      />
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg overflow-hidden">
          {value.length === 0 && (
            <div className="px-3 py-2 text-xs text-muted-foreground font-medium border-b border-border">
              Popular stations
            </div>
          )}
          {results.map((station: TrainStation) => (
            <button
              key={station.code}
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors text-left"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(station.city);
                setOpen(false);
              }}
            >
              <Train className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm">{station.name}</span>
                <span className="text-xs text-muted-foreground ml-1.5">{station.state}</span>
              </div>
              <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                {station.code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
