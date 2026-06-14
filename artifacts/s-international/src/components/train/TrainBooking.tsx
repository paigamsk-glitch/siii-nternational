import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Train, ArrowRight, CheckCircle, PlusCircle, Trash2 } from "lucide-react";
import { type Train as TrainType, CLASS_LABELS } from "@/lib/trainApi";

interface Passenger {
  name: string;
  age: string;
  gender: string;
  aadhar: string;
}

interface TrainBookingProps {
  train: TrainType;
  classCode: string;
  date: string;
}

const emptyPassenger = (): Passenger => ({ name: "", age: "", gender: "", aadhar: "" });

export function TrainBooking({ train, classCode, date }: TrainBookingProps) {
  const [, setLocation] = useLocation();
  const [passengers, setPassengers] = useState<Passenger[]>([emptyPassenger()]);
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const selectedClass = train.classes.find((c) => c.code === classCode) ?? train.classes[0];
  const totalFare = selectedClass.fare * passengers.length;

  function updatePassenger(idx: number, field: keyof Passenger, value: string) {
    setPassengers((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  }

  function addPassenger() {
    if (passengers.length < 6) setPassengers((p) => [...p, emptyPassenger()]);
  }

  function removePassenger(idx: number) {
    if (passengers.length > 1) setPassengers((p) => p.filter((_, i) => i !== idx));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setConfirmed(true);
  }

  if (confirmed) {
    const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
        <div className="bg-green-100 rounded-full p-5 mb-5">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground mb-6">
          Your train tickets have been booked successfully. Details have been sent to{" "}
          <strong>{email || "your email"}</strong>.
        </p>
        <div className="bg-card border border-border rounded-xl p-6 w-full text-left space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">PNR Number</span>
            <span className="font-bold font-mono tracking-widest text-primary">{pnr}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Train</span>
            <span className="font-medium">{train.name} (#{train.number})</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Route</span>
            <span className="font-medium flex items-center gap-1">
              {train.from.city} <ArrowRight className="w-3 h-3" /> {train.to.city}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Class</span>
            <span className="font-medium">{CLASS_LABELS[classCode] ?? classCode}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Passengers</span>
            <span className="font-medium">{passengers.length}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-semibold">Total Paid</span>
            <span className="font-bold text-lg text-primary">₹{totalFare.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <Button onClick={() => setLocation("/")}>Back to Home</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      {/* Summary card */}
      <div className="bg-primary text-primary-foreground rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <Train className="w-5 h-5 text-secondary" />
          <div>
            <h2 className="font-semibold">{train.name}</h2>
            <p className="text-primary-foreground/70 text-sm font-mono">#{train.number}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{train.departureTime}</p>
            <p className="text-sm text-primary-foreground/70">{train.from.city}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs text-primary-foreground/60">{train.duration}</p>
            <div className="flex items-center gap-1 my-1">
              <div className="h-px w-12 bg-primary-foreground/40" />
              <ArrowRight className="w-4 h-4" />
              <div className="h-px w-12 bg-primary-foreground/40" />
            </div>
            <p className="text-xs text-primary-foreground/60">{date}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{train.arrivalTime}</p>
            <p className="text-sm text-primary-foreground/70">{train.to.city}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-primary-foreground/20 flex items-center justify-between">
          <span className="text-sm text-primary-foreground/70">
            {CLASS_LABELS[classCode] ?? classCode} · ₹{selectedClass.fare.toLocaleString("en-IN")} / person
          </span>
          <span className="font-bold text-secondary text-lg">
            Total: ₹{totalFare.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Passenger details */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Passenger Details</h3>
          {passengers.length < 6 && (
            <button
              type="button"
              onClick={addPassenger}
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              <PlusCircle className="w-4 h-4" />
              Add Passenger
            </button>
          )}
        </div>
        <div className="space-y-5">
          {passengers.map((p, idx) => (
            <div key={idx} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Passenger {idx + 1}
                </p>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePassenger(idx)}
                    className="text-destructive hover:opacity-70"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Full Name *</Label>
                  <Input
                    required
                    placeholder="As on Aadhaar"
                    value={p.name}
                    onChange={(e) => updatePassenger(idx, "name", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Age *</Label>
                  <Input
                    required
                    type="number"
                    min={1}
                    max={120}
                    placeholder="Age"
                    value={p.age}
                    onChange={(e) => updatePassenger(idx, "age", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Gender *</Label>
                  <Select
                    required
                    value={p.gender}
                    onValueChange={(v) => updatePassenger(idx, "gender", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                      <SelectItem value="T">Transgender</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Aadhaar Number *</Label>
                  <Input
                    required
                    placeholder="12-digit Aadhaar"
                    maxLength={12}
                    value={p.aadhar}
                    onChange={(e) =>
                      updatePassenger(idx, "aadhar", e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
        <div className="bg-card border border-border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Mobile Number *</Label>
            <Input
              required
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Email Address *</Label>
            <Input
              required
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Payment placeholder */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment</h3>
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {["UPI", "Credit / Debit Card", "Net Banking", "Wallets"].map((method) => (
              <label
                key={method}
                className="flex items-center gap-2 border border-border rounded-lg p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors"
              >
                <input type="radio" name="payment" value={method} defaultChecked={method === "UPI"} />
                <span className="text-sm font-medium">{method}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            🔒 Payments are secured with 256-bit SSL encryption. This is a demo — no real
            payment will be processed.
          </p>
        </div>
      </div>

      {/* Total & submit */}
      <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-2xl font-bold text-primary">₹{totalFare.toLocaleString("en-IN")}</p>
          <p className="text-xs text-muted-foreground">
            {passengers.length} × ₹{selectedClass.fare.toLocaleString("en-IN")} (
            {CLASS_LABELS[classCode] ?? classCode})
          </p>
        </div>
        <Button type="submit" size="lg" className="hover-elevate px-8">
          Confirm & Pay
        </Button>
      </div>
    </form>
  );
}
