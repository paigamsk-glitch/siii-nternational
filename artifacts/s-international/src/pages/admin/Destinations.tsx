import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, RefreshCw, X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL, ADMIN_KEY } from "./index";
import { motion, AnimatePresence } from "framer-motion";

interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  bannerImage: string;
  bestTimeToVisit: string;
  attractions: string[];
  tags: string[];
  startingPrice: string;
  rating: number;
  isPopular: boolean;
}

const empty = (): Partial<Destination> => ({
  name: "", country: "", description: "", bannerImage: "",
  bestTimeToVisit: "", attractions: [], tags: [],
  startingPrice: "25000", rating: 4.5, isPopular: false,
});

export function Destinations({ darkMode }: { darkMode: boolean }) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Destination> | null>(null);
  const [search, setSearch] = useState("");

  const card = `rounded-2xl shadow-sm border ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`;
  const input = `${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" : ""}`;

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${BASE_URL}/api/admin/destinations`, { headers: { "x-admin-key": ADMIN_KEY } });
      const data = await r.json();
      setDestinations(data.destinations || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchDestinations(); }, []);

  const openAdd = () => { setEditing(empty()); setShowModal(true); };
  const openEdit = (d: Destination) => { setEditing({ ...d }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url = isNew ? `${BASE_URL}/api/admin/destinations` : `${BASE_URL}/api/admin/destinations/${editing.id}`;
      await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "x-admin-key": ADMIN_KEY, "content-type": "application/json" },
        body: JSON.stringify(editing),
      });
      await fetchDestinations();
      closeModal();
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this destination?")) return;
    await fetch(`${BASE_URL}/api/admin/destinations/${id}`, {
      method: "DELETE", headers: { "x-admin-key": ADMIN_KEY },
    });
    setDestinations(d => d.filter(x => x.id !== id));
  };

  const filtered = destinations.filter(d =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Destination Management</h2>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{destinations.length} destinations in database</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchDestinations} className="p-2 text-blue-500"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></button>
          <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"><Plus className="w-4 h-4 mr-2" /> Add Destination</Button>
        </div>
      </div>
      <div className={`${card} p-4`}>
        <Input placeholder="Search destinations…" value={search} onChange={e => setSearch(e.target.value)} className={`max-w-xs ${input}`} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : filtered.length === 0 ? (
        <div className={`${card} p-12 text-center`}>
          <p className={`${darkMode ? "text-slate-400" : "text-slate-500"}`}>No destinations yet. Add your first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(d => (
            <div key={d.id} className={`${card} overflow-hidden`}>
              <div className="relative aspect-[16/9]">
                {d.bannerImage ? (
                  <img src={d.bannerImage} alt={d.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                    <span className="text-emerald-400 text-sm">No image</span>
                  </div>
                )}
                {d.isPopular && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Popular</div>
                )}
              </div>
              <div className="p-4">
                <h3 className={`font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>{d.name}</h3>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{d.country}</p>
                <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{d.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-green-600 font-semibold text-sm">From ₹{Number(d.startingPrice).toLocaleString()}</span>
                  <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>⭐ {d.rating}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(d)} className="flex-1 flex items-center justify-center gap-1.5 text-xs border rounded-lg py-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(d.id)} className="flex items-center gap-1.5 text-xs border rounded-lg px-3 py-2 text-red-500 border-red-200 hover:bg-red-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && editing && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-2xl rounded-2xl shadow-2xl ${darkMode ? "bg-slate-800 text-white" : "bg-white"} p-6`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">{editing.id ? "Edit Destination" : "Add New Destination"}</h3>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Destination Name *</label>
                  <Input value={editing.name || ""} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Bali" className={input} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Country</label>
                  <Input value={editing.country || ""} onChange={e => setEditing({ ...editing, country: e.target.value })} placeholder="Indonesia" className={input} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">Banner Image URL</label>
                  <Input value={editing.bannerImage || ""} onChange={e => setEditing({ ...editing, bannerImage: e.target.value })} placeholder="https://images.unsplash.com/..." className={input} />
                  {editing.bannerImage && <img src={editing.bannerImage} className="mt-2 h-24 w-full object-cover rounded-lg" alt="" />}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">Description</label>
                  <textarea
                    value={editing.description || ""}
                    onChange={e => setEditing({ ...editing, description: e.target.value })}
                    rows={3} placeholder="Describe this destination..."
                    className={`w-full rounded-xl border px-3 py-2 text-sm resize-none ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "border-slate-200"}`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Best Time to Visit</label>
                  <Input value={editing.bestTimeToVisit || ""} onChange={e => setEditing({ ...editing, bestTimeToVisit: e.target.value })} placeholder="April to October" className={input} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Starting Price (₹)</label>
                  <Input type="number" value={editing.startingPrice || ""} onChange={e => setEditing({ ...editing, startingPrice: e.target.value })} className={input} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Attractions (comma-separated)</label>
                  <Input
                    value={(editing.attractions || []).join(", ")}
                    onChange={e => setEditing({ ...editing, attractions: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    placeholder="Temples, Beaches, Rice Terraces" className={input}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Tags (comma-separated)</label>
                  <Input
                    value={(editing.tags || []).join(", ")}
                    onChange={e => setEditing({ ...editing, tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    placeholder="Beach, Culture, Luxury" className={input}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Rating (0–5)</label>
                  <Input type="number" step="0.1" min="0" max="5" value={editing.rating || 4.5} onChange={e => setEditing({ ...editing, rating: Number(e.target.value) })} className={input} />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mt-6">
                    <input type="checkbox" checked={!!editing.isPopular} onChange={e => setEditing({ ...editing, isPopular: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm">Show as Popular Destination</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {editing.id ? "Save Changes" : "Add Destination"}
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
