import { useState } from "react";
import { Plane, Building2, Package, Train } from "lucide-react";
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
import { StationAutocomplete } from "@/components/train/StationAutocomplete";

export function HeroSearch() {
  const [, setLocation] = useLocation();
  const [date, setDate] = useState<Date>();
  const [flightFrom, setFlightFrom] = useState("");
  const [flightTo, setFlightTo] = useState("");
  const [hotelDest, setHotelDest] = useState("");
  const [pkgDest, setPkgDest] = useState("");
  const [trainFrom, setTrainFrom] = useState("");
  const [trainTo, setTrainTo] = useState("");
  const [trainDate, setTrainDate] = useState<Date>();

  const handleTrainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (trainFrom) params.append("from", trainFrom);
    if (trainTo) params.append("to", trainTo);
    if (trainDate) params.append("date", format(trainDate, "yyyy-MM-dd"));
    setLocation(`/trains?${params.toString()}`);
  };

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
        <TabsList className="grid w-full max-w-lg grid-cols-4 mb-6 bg-muted/50 p-1">
          <TabsTrigger value="flights" className="data-[state=active]:bg-background data-[state=active]:text-primary rounded-md">
            <Plane className="w-4 h-4 mr-2" />
            Flights
          </TabsTrigger>
          <TabsTrigger value="trains" className="data-[state=active]:bg-background data-[state=active]:text-primary rounded-md">
            <Train className="w-4 h-4 mr-2" />
            Train
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

        <TabsContent value="trains" className="mt-0">
          <form onSubmit={handleTrainSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>From Station</Label>
              <StationAutocomplete
                id="train-from"
                placeholder="Departure city"
                value={trainFrom}
                onChange={setTrainFrom}
              />
            </div>
            <div className="space-y-2">
              <Label>To Station</Label>
              <StationAutocomplete
                id="train-to"
                placeholder="Destination city"
                value={trainTo}
                onChange={setTrainTo}
              />
            </div>
            <div className="space-y-2">
              <Label>Journey Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background border-input",
                      !trainDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {trainDate ? format(trainDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={trainDate}
                    onSelect={setTrainDate}
                    initialFocus
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full h-10 hover-elevate">Search Trains</Button>
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
