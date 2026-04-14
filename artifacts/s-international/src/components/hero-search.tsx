import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Building2, Map } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

export function HeroSearch() {
  const [, setLocation] = useLocation();
  const [date, setDate] = useState<Date>();
  
  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const params = new URLSearchParams();
    if (formData.get("from")) params.append("from", formData.get("from") as string);
    if (formData.get("to")) params.append("to", formData.get("to") as string);
    if (date) params.append("date", format(date, "yyyy-MM-dd"));
    
    setLocation(`/flights?${params.toString()}`);
  };

  const handleHotelSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const params = new URLSearchParams();
    if (formData.get("destination")) params.append("destination", formData.get("destination") as string);
    if (date) params.append("checkIn", format(date, "yyyy-MM-dd"));
    
    setLocation(`/hotels?${params.toString()}`);
  };

  const handleHolidaySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const params = new URLSearchParams();
    if (formData.get("destination")) params.append("destination", formData.get("destination") as string);
    
    setLocation(`/holidays?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto -mt-24 relative z-10 bg-card rounded-xl shadow-xl p-4 md:p-6 border border-border">
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
          <TabsTrigger value="holidays" className="data-[state=active]:bg-background data-[state=active]:text-primary rounded-md">
            <Map className="w-4 h-4 mr-2" />
            Holidays
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flights" className="mt-0">
          <form onSubmit={handleFlightSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Input id="from" name="from" placeholder="City or Airport" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input id="to" name="to" placeholder="City or Airport" required />
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
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" name="destination" placeholder="City, Hotel, or Landmark" required />
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

        <TabsContent value="holidays" className="mt-0">
          <form onSubmit={handleHolidaySearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="holiday-destination">Where do you want to go?</Label>
              <Input id="holiday-destination" name="destination" placeholder="Country or Region" />
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
