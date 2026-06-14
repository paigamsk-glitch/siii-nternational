import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrainBooking } from "@/components/train/TrainBooking";
import { getTrainById } from "@/lib/trainApi";

export function TrainBookingPage() {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );

  const trainId = params.get("trainId") ?? "";
  const classCode = params.get("classCode") ?? "";
  const date = params.get("date") ?? "";
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";

  const train = getTrainById(trainId);

  if (!train) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Train not found. Please go back and search again.</p>
        <Button onClick={() => setLocation("/trains")}>Back to Train Search</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-6 px-4">
        <div className="container mx-auto max-w-3xl">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to results
          </button>
          <h1 className="text-xl font-bold font-serif">Complete Your Booking</h1>
          <p className="text-primary-foreground/70 text-sm">
            {from} → {to} · {date}
          </p>
        </div>
      </div>
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <TrainBooking train={train} classCode={classCode} date={date} />
      </div>
    </div>
  );
}
