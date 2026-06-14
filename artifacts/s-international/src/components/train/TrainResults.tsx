import { Train, ArrowRight, Search } from "lucide-react";
import { TrainCard } from "./TrainCard";
import { type Train as TrainType } from "@/lib/trainApi";

interface TrainResultsProps {
  trains: TrainType[];
  from: string;
  to: string;
  date: string;
  loading: boolean;
}

export function TrainResults({ trains, from, to, date, loading }: TrainResultsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-40 bg-muted rounded" />
                <div className="h-3 w-20 bg-muted rounded" />
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <div className="h-8 w-16 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted rounded self-center" />
              <div className="h-8 w-16 bg-muted rounded" />
              <div className="h-8 w-20 bg-muted rounded" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-16 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (trains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-muted rounded-full p-5 mb-4">
          <Train className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No trains found</h3>
        <p className="text-muted-foreground max-w-sm">
          No direct trains found between <strong>{from}</strong> and <strong>{to}</strong>.
          Try searching with the city name or a major nearby station.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Search className="w-4 h-4" />
        <span>
          {trains.length} train{trains.length !== 1 ? "s" : ""} found
        </span>
        <span className="flex items-center gap-1 font-medium text-foreground">
          {from}
          <ArrowRight className="w-3 h-3" />
          {to}
        </span>
      </div>
      {trains.map((train) => (
        <TrainCard key={train.id} train={train} searchDate={date} />
      ))}
    </div>
  );
}
