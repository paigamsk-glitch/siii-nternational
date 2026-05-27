import { useState } from "react";
import { Plane, Building2, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { CityAutocomplete } from "@/components/city-autocomplete";

export function HeroSearch() {
  const [, setLocation] = useLocation();
  const [date, setDate] = useState<Date>();
  const [flightFrom, setFlightFrom] = useState("");
  const [flightTo, setFlightTo] = useState("");
  const [hotelDest, setHotelDest] = useState("");
  const [pkgDest, setPkgDest] = useState("");

  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (flightFrom) params.append("from", flightFrom);
    if (flightTo) params.append("to", flightTo);
    if (date) params.append("date", format(date, "yyyy-MM-dd"));
    setLocation(`/flights?${params.toString()}`);
  };

  const handleHotelSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (hotelDest) params.append("destination", hotelDest);
    if (date) params.append("checkIn", format(date, "yyyy-MM-dd"));
    setLocation(`/hotels?${params.toString()}`);
  };

  const handlePackageSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (pkgDest) params.append("q", pkgDest);
    setLocation(`/packages?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto -mt-24 relative z-10 bg-card rounded-2xl shadow-2xl p-4 md:p-6 border border-border">
      <Tabs defaultValue="flights" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6 bg-muted/50 p-1">
          <TabsTrigger value="flights" className="data-[state=active]:bg-background data-[state=active]:text-primary rounded-md">
            <Plane className="w-4 h-4 mr-2" />
            Flights
          </TabsTrigger>
          <TabsTrigger value="hotels" className="data-[state=active]:bg-background data-[state=active]:text-primary rounded-md">
            <Building2 className="w-4 h-4 mr-2" />
            Hotels
          </TabsTrigger>
          <TabsTrigger value="packages" className="data-[state=active]:bg-background data-[state=active]:text-primary rounded-md">
            <Package className="w-4 h-4 mr-2" />
            Packages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flights" className="mt-0">
          <form onSubmit={handleFlightSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <CityAutocomplete
                id="from"
                name="from"
                placeholder="City or Airport"
                value={flightFrom}
                onChange={setFlightFrom}
              />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <CityAutocomplete
                id="to"
                name="to"
                placeholder="City or Airport"
                value={flightTo}
                onChange={setFlightTo}
              />
            </div>
            <div className="space-y-2">
              <Label>Departure</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background border-input",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full h-10 hover-elevate">Search Flights</Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="hotels" className="mt-0">
          <form onSubmit={handleHotelSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Destination</Label>
              <CityAutocomplete
                id="hotel-destination"
                name="destination"
                placeholder="City, Hotel, or Landmark"
                value={hotelDest}
                onChange={setHotelDest}
              />
            </div>
            <div className="space-y-2">
              <Label>Check-in</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background border-input",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full h-10 hover-elevate">Search Hotels</Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="packages" className="mt-0">
          <form onSubmit={handlePackageSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-3">
              <Label>Where do you want to go?</Label>
              <CityAutocomplete
                id="pkg-destination"
                name="destination"
                placeholder="Bali, Maldives, Paris, Dubai..."
                value={pkgDest}
                onChange={setPkgDest}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full h-10 hover-elevate">Find Packages</Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
