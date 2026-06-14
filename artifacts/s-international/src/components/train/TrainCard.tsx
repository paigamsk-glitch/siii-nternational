import { Train, Clock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Train as TrainType } from "@/lib/trainApi";
import { useLocation } from "wouter";

interface TrainCardProps {
  train: TrainType;
  searchDate: string;
}

const TYPE_COLORS: Record<string, string> = {
  Rajdhani: "bg-amber-100 text-amber-800",
  Shatabdi: "bg-blue-100 text-blue-800",
  Express: "bg-green-100 text-green-800",
  Superfast: "bg-purple-100 text-purple-800",
  Mail: "bg-gray-100 text-gray-700",
};

export function TrainCard({ train, searchDate }: TrainCardProps) {
  const [, setLocation] = useLocation();

  const lowestFare = Math.min(...train.classes.map((c) => c.fare));
  const hasAvailability = train.classes.some((c) => c.available > 0);

  function handleBook(classCode: string) {
    const params = new URLSearchParams({
      trainId: train.id,
      classCode,
      date: searchDate,
      from: train.from.city,
      to: train.to.city,
    });
    setLocation(`/trains/book?${params.toString()}`);
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow p-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Train name + number */}
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 rounded-lg p-2 mt-0.5">
            <Train className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base">{train.name}</h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[train.type] ?? TYPE_COLORS.Express}`}>
                {train.type}
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-mono">#{train.number}</p>
          </div>
        </div>

        {/* Route timings */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold tabular-nums">{train.departureTime}</p>
            <p className="text-xs text-muted-foreground font-medium">{train.from.code}</p>
            <p className="text-xs text-muted-foreground">{train.from.city}</p>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1 min-w-[80px]">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {train.duration}
            </div>
            <div className="flex items-center w-full gap-1">
              <div className="flex-1 h-px bg-border" />
              <ArrowRight className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 h-px bg-border" />
            </div>
            <p className="text-xs text-muted-foreground">
              {train.runningDays.length === 7 ? "Daily" : train.runningDays.join(", ")}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold tabular-nums">{train.arrivalTime}</p>
            <p className="text-xs text-muted-foreground font-medium">{train.to.code}</p>
            <p className="text-xs text-muted-foreground">{train.to.city}</p>
          </div>
        </div>

        {/* Fare summary */}
        <div className="text-right shrink-0">
          <p className="text-xs text-muted-foreground">Starts from</p>
          <p className="text-2xl font-bold text-primary">₹{lowestFare.toLocaleString("en-IN")}</p>
          <div className="flex items-center justify-end gap-1 mt-1">
            {hasAvailability ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs text-green-600 font-medium">Available</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs text-amber-600 font-medium">Waitlist only</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Class rows */}
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {train.classes.map((cls) => (
          <button
            key={cls.code}
            onClick={() => handleBook(cls.code)}
            className="group flex flex-col items-start p-2.5 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-xs font-mono font-bold text-primary">{cls.code}</span>
              {cls.available > 0 ? (
                <span className="text-xs text-green-600">{cls.available} seats</span>
              ) : (
                <span className="text-xs text-amber-500">WL {cls.waitlist}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-tight">{cls.label}</p>
            <p className="text-sm font-semibold mt-1">₹{cls.fare.toLocaleString("en-IN")}</p>
          </button>
        ))}
      </div>

      {/* Book button */}
      <div className="mt-3 flex justify-end">
        <Button
          onClick={() => handleBook(train.classes[0].code)}
          className="hover-elevate"
          disabled={!hasAvailability}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}
