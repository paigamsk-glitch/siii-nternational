import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, RefreshCw, X, Save, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL, ADMIN_KEY } from "./index";
import { motion, AnimatePresence } from "framer-motion";

interface Hotel {
  id: string;
  name: string;
  destination: string;
  country: string;
  address: string;
  stars: number;
  category: string;
  rating: number;
  reviewCount: number;
  pricePerNight: string;
  currency: string;
  description: string;
  amenities: string[];
  roomTypes: string[];
  imageUrl: string;
  isAvailable: boolean;
  checkIn: string;
  checkOut: string;
}

const emptyHotel = (): Partial<Hotel> => ({
  name: "", destination: "", country: "", address: "",
  stars: 4, category: "Luxury", rating: 4.5, reviewCount: 0,
  pricePerNight: "5000", currency: "INR", description: "",
  amenities: [], roomTypes: [], imageUrl: "", isAvailable: true,
  checkIn: "14:00", checkOut: "12:00",
});

export function Hotels({ darkMode }: { darkMode: boolean }) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Hotel> | null>(null);
  const [search, setSearch] = useState("");

  const card = `rounded-2xl shadow-sm border ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`;
  const input = `${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" : ""}`;

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${BASE_URL}/api/admin/hotels`, { headers: { "x-admin-key": ADMIN_KEY } });
      const data = await r.json();
      setHotels(data.hotels || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchHotels(); }, []);

  const openAdd = () => { setEditing(emptyHotel()); setShowModal(true); };
  const openEdit = (h: Hotel) => { setEditing({ ...h }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url = isNew ? `${BASE_URL}/api/admin/hotels` : `${BASE_URL}/api/admin/hotels/${editing.id}`;
      await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "x-admin-key": ADMIN_KEY, "content-type": "application/json" },
        body: JSON.stringify(editing),
      });
      await fetchHotels();
      closeModal();
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hotel?")) return;
    await fetch(`${BASE_URL}/api/admin/hotels/${id}`, {
      method: "DELETE", headers: { "x-admin-key": ADMIN_KEY },
    });
    setHotels(h => h.filter(x => x.id !== id));
  };

  const filtered = hotels.filter(h =>
    !search || h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Hotel Management</h2>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{hotels.length} hotels in database</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchHotels} className="p-2 text-blue-500 hover:text-blue-700">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Add Hotel
          </Button>
        </div>
      </div>

      <div className={`${card} p-4`}>
        <Input placeholder="Search hotels…" value={search} onChange={e => setSearch(e.target.value)} className={`max-w-xs ${input}`} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : filtered.length === 0 ? (
        <div className={`${card} p-12 text-center`}>
          <p className={`${darkMode ? "text-slate-400" : "text-slate-500"}`}>No hotels found. Add your first hotel!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className={`${card}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                  {["Hotel", "Location", "Stars", "Price/Night", "Status", "Actions"].map(h => (
                    <th key={h} className={`text-left px-4 py-3 font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(h => (
                  <tr key={h.id} className={`border-b last:border-0 ${darkMode ? "border-slate-700/50" : "border-slate-100"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {h.imageUrl && <img src={h.imageUrl} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                        <div>
                          <p className="font-medium truncate max-w-[160px]">{h.name}</p>
                          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{h.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p>{h.destination}</p>
                      <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{h.country}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex">
                        {Array.from({ length: h.stars }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-600">₹{Number(h.pricePerNight).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${h.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {h.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(h)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(h.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && editing && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-2xl rounded-2xl shadow-2xl ${darkMode ? "bg-slate-800 text-white" : "bg-white"} p-6`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">{editing.id ? "Edit Hotel" : "Add New Hotel"}</h3>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">Hotel Name *</label>
                  <Input value={editing.name || ""} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="e.g. The Leela Palace" className={input} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Destination *</label>
                  <Input value={editing.destination || ""} onChange={e => setEditing({ ...editing, destination: e.target.value })} placeholder="Delhi" className={input} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Country</label>
                  <Input value={editing.country || ""} onChange={e => setEditing({ ...editing, country: e.target.value })} placeholder="India" className={input} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">Address</label>
                  <Input value={editing.address || ""} onChange={e => setEditing({ ...editing, address: e.target.value })} placeholder="Street, Area, City" className={input} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Star Rating</label>
                  <Input type="number" min="1" max="7" value={editing.stars || 4} onChange={e => setEditing({ ...editing, stars: Number(e.target.value) })} className={input} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Category</label>
                  <Input value={editing.category || ""} onChange={e => setEditing({ ...editing, category: e.target.value })} placeholder="Luxury / Budget / Boutique" className={input} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Price per Night (₹) *</label>
                  <Input type="number" value={editing.pricePerNight || ""} onChange={e => setEditing({ ...editing, pricePerNight: e.target.value })} className={input} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Rating (0–5)</label>
                  <Input type="number" step="0.1" min="0" max="5" value={editing.rating || 4} onChange={e => setEditing({ ...editing, rating: Number(e.target.value) })} className={input} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">Cover Image URL</label>
                  <Input value={editing.imageUrl || ""} onChange={e => setEditing({ ...editing, imageUrl: e.target.value })} placeholder="https://images.unsplash.com/..." className={input} />
                  {editing.imageUrl && <img src={editing.imageUrl} className="mt-2 h-24 w-full object-cover rounded-lg" alt="" />}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">Description</label>
                  <textarea
                    value={editing.description || ""}
                    onChange={e => setEditing({ ...editing, description: e.target.value })}
                    rows={3} placeholder="Hotel description..."
                    className={`w-full rounded-xl border px-3 py-2 text-sm resize-none ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "border-slate-200"}`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Amenities (comma-separated)</label>
                  <Input
                    value={(editing.amenities || []).join(", ")}
                    onChange={e => setEditing({ ...editing, amenities: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    placeholder="WiFi, Pool, Spa, Gym" className={input}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Room Types (comma-separated)</label>
                  <Input
                    value={(editing.roomTypes || []).join(", ")}
                    onChange={e => setEditing({ ...editing, roomTypes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    placeholder="Deluxe, Suite, Presidential" className={input}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Check-In Time</label>
                  <Input value={editing.checkIn || "14:00"} onChange={e => setEditing({ ...editing, checkIn: e.target.value })} placeholder="14:00" className={input} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Check-Out Time</label>
                  <Input value={editing.checkOut || "12:00"} onChange={e => setEditing({ ...editing, checkOut: e.target.value })} placeholder="12:00" className={input} />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!editing.isAvailable} onChange={e => setEditing({ ...editing, isAvailable: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm">Available for booking</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {editing.id ? "Save Changes" : "Add Hotel"}
                </Button>
                <Button onClick={closeModal} variant="outline" className="px-6">Cancel</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
