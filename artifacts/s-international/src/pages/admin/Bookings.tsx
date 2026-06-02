import { useState, useEffect } from "react";
import { RefreshCw, Loader2, Search, Eye, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BASE_URL, ADMIN_KEY } from "./index";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface Booking {
  id: string;
  type: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  totalAmount: string;
  currency: string;
  status: string;
  paymentStatus: string;
  travelers: number;
  checkIn?: string;
  checkOut?: string;
  createdAt: string;
  itemDetails?: any;
  notes?: string;
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

const PAYMENT_COLORS: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-amber-100 text-amber-700",
  refunded: "bg-slate-100 text-slate-700",
  failed: "bg-red-100 text-red-700",
};

export function Bookings({ darkMode }: { darkMode: boolean }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const card = `rounded-2xl shadow-sm border ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`;
  const input = `${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" : ""}`;

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${BASE_URL}/api/admin/bookings`, { headers: { "x-admin-key": ADMIN_KEY } });
      const data = await r.json();
      setBookings(data.bookings || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, status?: string, paymentStatus?: string) => {
    setUpdatingId(id);
    try {
      await fetch(`${BASE_URL}/api/admin/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "x-admin-key": ADMIN_KEY, "content-type": "application/json" },
        body: JSON.stringify({ status, paymentStatus }),
      });
      setBookings(b => b.map(x => x.id === id ? { ...x, status: status || x.status, paymentStatus: paymentStatus || x.paymentStatus } : x));
      if (selectedBooking?.id === id) {
        setSelectedBooking(prev => prev ? { ...prev, status: status || prev.status, paymentStatus: paymentStatus || prev.paymentStatus } : null);
      }
    } catch {}
    setUpdatingId(null);
  };

  const filtered = bookings.filter(b =>
    !search || b.contactName.toLowerCase().includes(search.toLowerCase()) ||
    b.contactEmail.toLowerCase().includes(search.toLowerCase()) ||
    b.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = bookings.filter(b => b.paymentStatus === "paid").reduce((sum, b) => sum + Number(b.totalAmount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Booking Management</h2>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{bookings.length} bookings · ₹{totalRevenue.toLocaleString()} collected</p>
        </div>
        <button onClick={fetchBookings} className="p-2 text-blue-500"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></button>
      </div>

      <div className={`${card} p-4`}>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search bookings…" value={search} onChange={e => setSearch(e.target.value)} className={`pl-9 ${input}`} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : (
        <div className={`${card} overflow-x-auto`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                {["Guest", "Type", "Amount", "Status", "Payment", "Date", "Actions"].map(h => (
                  <th key={h} className={`text-left px-4 py-3 font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400">No bookings found.</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id} className={`border-b last:border-0 ${darkMode ? "border-slate-700/50" : "border-slate-100"}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{b.contactName}</p>
                    <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{b.contactEmail}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{b.type}</td>
                  <td className="px-4 py-3 font-bold text-green-600">₹{Number(b.totalAmount).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      onChange={e => updateStatus(b.id, e.target.value)}
                      disabled={updatingId === b.id}
                      className={`text-xs px-2 py-1.5 rounded-lg font-semibold border-0 cursor-pointer ${STATUS_COLORS[b.status] || "bg-slate-100 text-slate-600"}`}
                    >
                      {["pending", "confirmed", "cancelled", "completed"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={b.paymentStatus}
                      onChange={e => updateStatus(b.id, undefined, e.target.value)}
                      disabled={updatingId === b.id}
                      className={`text-xs px-2 py-1.5 rounded-lg font-semibold border-0 cursor-pointer ${PAYMENT_COLORS[b.paymentStatus] || "bg-slate-100"}`}
                    >
                      {["unpaid", "paid", "refunded", "failed"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className={`px-4 py-3 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {b.createdAt ? format(parseISO(b.createdAt), "dd MMM yy") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedBooking(b)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-lg rounded-2xl shadow-2xl ${darkMode ? "bg-slate-800 text-white" : "bg-white"} p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Booking Details</h3>
                <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className={`grid grid-cols-2 gap-3 text-sm`}>
                {[
                  ["Guest", selectedBooking.contactName],
                  ["Email", selectedBooking.contactEmail],
                  ["Phone", selectedBooking.contactPhone],
                  ["Type", selectedBooking.type],
                  ["Travelers", selectedBooking.travelers],
                  ["Amount", `₹${Number(selectedBooking.totalAmount).toLocaleString()}`],
                  ["Check-In", selectedBooking.checkIn || "—"],
                  ["Check-Out", selectedBooking.checkOut || "—"],
                  ["Status", selectedBooking.status],
                  ["Payment", selectedBooking.paymentStatus],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
                    <p className="font-medium capitalize">{value as string}</p>
                  </div>
                ))}
              </div>
              {selectedBooking.itemDetails && (
                <div className="mt-4">
                  <p className={`text-xs font-semibold mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Item Details</p>
                  <pre className={`text-xs p-3 rounded-xl overflow-auto max-h-32 ${darkMode ? "bg-slate-700" : "bg-slate-50"}`}>
                    {JSON.stringify(selectedBooking.itemDetails, null, 2)}
                  </pre>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => updateStatus(selectedBooking.id, "confirmed", "paid")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Confirm & Mark Paid
                </button>
                <button
                  onClick={() => updateStatus(selectedBooking.id, "cancelled")}
                  className="px-4 bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
