import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Train, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { StationAutocomplete } from "@/components/train/StationAutocomplete";
import { TrainResults } from "@/components/train/TrainResults";
import { searchTrains, type Train as TrainType } from "@/lib/trainApi";

export function Trains() {
  const [location] = useLocation();
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );

  const [from, setFrom] = useState(params.get("from") ?? "");
  const [to, setTo] = useState(params.get("to") ?? "");
  const [dateStr, setDateStr] = useState(params.get("date") ?? "");
  const [date, setDate] = useState<Date | undefined>(
    dateStr ? parseISO(dateStr) : undefined
  );
  const [trains, setTrains] = useState<TrainType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (from && to && dateStr) {
      runSearch(from, to, dateStr);
    }
  }, []);

  async function runSearch(f: string, t: string, d: string) {
    setLoading(true);
    setSearched(true);
    const results = await searchTrains({ from: f, to: t, date: d });
    setTrains(results);
    setLoading(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const d = date ? format(date, "yyyy-MM-dd") : "";
    setDateStr(d);
    if (from && to) runSearch(from, to, d);
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <div className="bg-primary text-primary-foreground py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-2 mb-2">
            <Train className="w-6 h-6 text-secondary" />
            <h1 className="text-2xl font-bold font-serif">Train Tickets</h1>
          </div>
          <p className="text-primary-foreground/70 text-sm mb-6">
            Book confirmed train tickets across India
          </p>

          {/* Inline search bar */}
          <form
            onSubmit={handleSearch}
            className="bg-card text-foreground rounded-2xl p-4 grid grid-cols-1 md:grid-cols-5 gap-3 shadow-lg"
          >
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">From</Label>
              <StationAutocomplete
                id="train-from"
                placeholder="Departure city"
                value={from}
                onChange={setFrom}
              />
            </div>

            <div className="flex items-end justify-center pb-1">
              <button
                type="button"
                onClick={swap}
                className="p-1.5 rounded-full border border-border hover:bg-muted transition-colors"
                title="Swap stations"
              >
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">To</Label>
              <StationAutocomplete
                id="train-to"
                placeholder="Destination city"
                value={to}
                onChange={setTo}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Journey Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background border-input h-9",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd MMM yyyy") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end">
              <Button type="submit" className="w-full h-9 hover-elevate">
                Search Trains
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {searched ? (
          <TrainResults
            trains={trains}
            from={from}
            to={to}
            date={dateStr}
            loading={loading}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-primary/10 rounded-full p-5 mb-4">
              <Train className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Find Your Train</h2>
            <p className="text-muted-foreground max-w-sm">
              Search from popular Indian cities — Delhi, Mumbai, Kolkata, Chennai,
              Bangalore, Hyderabad, Goa, and more.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
