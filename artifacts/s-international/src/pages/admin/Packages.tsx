import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, RefreshCw, X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL, ADMIN_KEY } from "./index";
import { motion, AnimatePresence } from "framer-motion";

interface Pkg {
  id: string;
  slug: string;
  title: string;
  destination: string;
  country: string;
  theme: string;
  durationNights: number;
  durationDays: number;
  price: string;
  offerPrice?: string;
  imageUrl: string;
  images?: string[];
  rating: number;
  reviewCount?: number;
  category: string;
  isFeatured: boolean;
  isTrending: boolean;
  isPublished: boolean;
  overview: string;
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
}

const emptyPkg = (): Partial<Pkg> => ({
  slug: "", title: "", destination: "", country: "", theme: "General",
  durationNights: 3, durationDays: 4, price: "25000",
  offerPrice: "", imageUrl: "", rating: 4.5, reviewCount: 0, category: "Holiday",
  isFeatured: false, isTrending: false, isPublished: true,
  overview: "", inclusions: [], exclusions: [], highlights: [],
});

export function Packages({ darkMode }: { darkMode: boolean }) {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Pkg> | null>(null);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const card = `rounded-2xl shadow-sm border ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`;
  const input = `${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" : ""}`;

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${BASE_URL}/api/admin/packages`, {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      const data = await r.json();
      setPackages(data.packages || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchPackages(); }, []);

  const openAdd = () => { setEditing(emptyPkg()); setShowModal(true); };
  const openEdit = (p: Pkg) => { setEditing({ ...p }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url = isNew ? `${BASE_URL}/api/admin/packages` : `${BASE_URL}/api/admin/packages/${editing.id}`;
      const method = isNew ? "POST" : "PUT";
      await fetch(url, {
        method,
        headers: { "x-admin-key": ADMIN_KEY, "content-type": "application/json" },
        body: JSON.stringify(editing),
      });
      await fetchPackages();
      closeModal();
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this package?")) return;
    setDeleting(id);
    try {
      await fetch(`${BASE_URL}/api/admin/packages/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": ADMIN_KEY },
      });
      setPackages(p => p.filter(x => x.id !== id));
    } catch {}
    setDeleting(null);
  };

  const togglePublish = async (p: Pkg) => {
    await fetch(`${BASE_URL}/api/admin/packages/${p.id}`, {
      method: "PUT",
      headers: { "x-admin-key": ADMIN_KEY, "content-type": "application/json" },
      body: JSON.stringify({ isPublished: !p.isPublished }),
    });
    setPackages(pkgs => pkgs.map(x => x.id === p.id ? { ...x, isPublished: !p.isPublished } : x));
  };

  const filtered = packages.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Package Management</h2>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{packages.length} packages in database</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchPackages} className="p-2 text-blue-500 hover:text-blue-700">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Add Package
          </Button>
        </div>
      </div>

      <div className={`${card} p-4`}>
        <Input
          placeholder="Search packages…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`max-w-xs ${input}`}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className={`${card} p-12 text-center`}>
          <p className={`${darkMode ? "text-slate-400" : "text-slate-500"}`}>No packages found. Add your first package!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className={`${card} overflow-hidden`}>
              <div className="relative aspect-[16/9]">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <span className="text-blue-400 text-sm">No image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {p.isFeatured && <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Featured</span>}
                  {p.isTrending && <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">Trending</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.isPublished ? "bg-green-500 text-white" : "bg-slate-400 text-white"}`}>
                    {p.isPublished ? "Live" : "Draft"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className={`font-semibold text-sm truncate ${darkMode ? "text-white" : "text-slate-800"}`}>{p.title}</h3>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{p.destination}, {p.country}</p>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="text-green-600 font-bold text-sm">₹{Number(p.price).toLocaleString()}</span>
                    {p.offerPrice && <span className="text-slate-400 text-xs line-through ml-2">₹{Number(p.offerPrice).toLocaleString()}</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs">{p.rating}</span>
                  </div>
                </div>
                <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {p.durationNights}N/{p.durationDays}D · {p.theme}
                </p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 text-xs border rounded-lg py-2 text-blue-600 border-blue-200 hover:bg-blue-50 transition-colors">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => togglePublish(p)} className={`flex items-center gap-1.5 text-xs border rounded-lg px-3 py-2 transition-colors ${
                    p.isPublished ? "text-slate-500 border-slate-200 hover:bg-slate-50" : "text-green-600 border-green-200 hover:bg-green-50"
                  }`}>
                    {p.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    className="flex items-center gap-1.5 text-xs border rounded-lg px-3 py-2 text-red-500 border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deleting === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && editing && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-2xl rounded-2xl shadow-2xl ${darkMode ? "bg-slate-800 text-white" : "bg-white"} p-6`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">{editing.id ? "Edit Package" : "Add New Package"}</h3>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">Package Title *</label>
                  <Input value={editing.title || ""} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="e.g. Bali Honeymoon Paradise" className={input} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">URL Slug <span className="text-muted-foreground">(used in page URL)</span></label>
                  <Input value={editing.slug || ""} onChange={e => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} placeholder="e.g. bali-honeymoon-paradise" className={input} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Destination *</label>
                  <Input value={editing.destination || ""} onChange={e => setEditing({ ...editing, destination: e.target.value })} placeholder="Bali" className={input} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Country</label>
                  <Input value={editing.country || ""} onChange={e => setEditing({ ...editing, country: e.target.value })} placeholder="Indonesia" className={input} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Theme / Category</label>
                  <Input value={editing.theme || ""} onChange={e => setEditing({ ...editing, theme: e.target.value })} placeholder="Romantic" className={input} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Duration (e.g. 4N/5D)</label>
                  <div className="flex gap-2">
                    <Input type="number" value={editing.durationNights || 0} onChange={e => setEditing({ ...editing, durationNights: Number(e.target.value) })} placeholder="Nights" className={input} />
                    <Input type="number" value={editing.durationDays || 0} onChange={e => setEditing({ ...editing, durationDays: Number(e.target.value) })} placeholder="Days" className={input} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Price (₹) *</label>
                  <Input type="number" value={editing.price || ""} onChange={e => setEditing({ ...editing, price: e.target.value })} placeholder="85000" className={input} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Offer Price (₹)</label>
                  <Input type="number" value={editing.offerPrice || ""} onChange={e => setEditing({ ...editing, offerPrice: e.target.value })} placeholder="Leave blank if no offer" className={input} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">Cover Image URL</label>
                  <Input value={editing.imageUrl || ""} onChange={e => setEditing({ ...editing, imageUrl: e.target.value })} placeholder="https://images.unsplash.com/..." className={input} />
                  {editing.imageUrl && <img src={editing.imageUrl} className="mt-2 h-24 w-full object-cover rounded-lg" alt="" />}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">Overview</label>
                  <textarea
                    value={editing.overview || ""}
                    onChange={e => setEditing({ ...editing, overview: e.target.value })}
                    rows={3}
                    placeholder="Package description..."
                    className={`w-full rounded-xl border px-3 py-2 text-sm resize-none ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "border-slate-200"}`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Highlights (comma-separated)</label>
                  <Input
                    value={(editing.highlights || []).join(", ")}
                    onChange={e => setEditing({ ...editing, highlights: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    placeholder="Beach, Temple tour, Spa"
                    className={input}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Inclusions (comma-separated)</label>
                  <Input
                    value={(editing.inclusions || []).join(", ")}
                    onChange={e => setEditing({ ...editing, inclusions: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    placeholder="Flights, Hotel, Breakfast"
                    className={input}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Exclusions (comma-separated)</label>
                  <Input
                    value={(editing.exclusions || []).join(", ")}
                    onChange={e => setEditing({ ...editing, exclusions: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    placeholder="Visa fees, Travel insurance"
                    className={input}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Rating (0–5)</label>
                  <Input type="number" step="0.1" max="5" min="0" value={editing.rating || 4.5} onChange={e => setEditing({ ...editing, rating: Number(e.target.value) })} className={input} />
                </div>
                <div className="md:col-span-2 flex flex-wrap gap-4">
                  {(["isFeatured", "isTrending", "isPublished"] as const).map(key => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!(editing as any)[key]} onChange={e => setEditing({ ...editing, [key]: e.target.checked })} className="w-4 h-4 rounded" />
                      <span className="text-sm capitalize">{key.replace("is", "")}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {editing.id ? "Save Changes" : "Create Package"}
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
