import { useState, useEffect, useRef } from "react";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Star, RefreshCw, X, Save,
  Loader2, ChevronDown, ChevronUp, GripVertical, MapPin, Calendar,
  ImageIcon, ListChecks, Route
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL, ADMIN_KEY } from "./index";
import { motion, AnimatePresence } from "framer-motion";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

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
  itinerary: ItineraryDay[];
}

const emptyPkg = (): Partial<Pkg> => ({
  slug: "", title: "", destination: "", country: "", theme: "General",
  durationNights: 3, durationDays: 4, price: "25000",
  offerPrice: "", imageUrl: "", rating: 4.5, reviewCount: 0, category: "Holiday",
  isFeatured: false, isTrending: false, isPublished: true,
  overview: "", inclusions: [], exclusions: [], highlights: [], itinerary: [],
});

// ── Itinerary Builder Component ──────────────────────────────────────────────
function ItineraryBuilder({
  days, onChange, darkMode, inputCls,
}: {
  days: ItineraryDay[];
  onChange: (days: ItineraryDay[]) => void;
  darkMode: boolean;
  inputCls: string;
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const dragNode = useRef<HTMLDivElement | null>(null);

  const addDay = () => {
    const next: ItineraryDay = { day: days.length + 1, title: "", description: "", activities: [] };
    onChange([...days, next]);
    setExpandedIdx(days.length);
  };

  const updateDay = (i: number, patch: Partial<ItineraryDay>) => {
    onChange(days.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  };

  const deleteDay = (i: number) => {
    const updated = days.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 }));
    onChange(updated);
    setExpandedIdx(prev => {
      if (prev === i) return null;
      if (prev !== null && prev > i) return prev - 1;
      return prev;
    });
  };

  const addActivity = (i: number) => {
    updateDay(i, { activities: [...days[i].activities, ""] });
  };

  const updateActivity = (i: number, ai: number, val: string) => {
    const activities = days[i].activities.map((a, idx) => (idx === ai ? val : a));
    updateDay(i, { activities });
  };

  const removeActivity = (i: number, ai: number) => {
    updateDay(i, { activities: days[i].activities.filter((_, idx) => idx !== ai) });
  };

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, i: number) => {
    setDraggedIdx(i);
    dragNode.current = e.currentTarget as HTMLDivElement;
    e.dataTransfer.effectAllowed = "move";
    // Ghost image: use the element itself but make it slightly transparent
    e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
    // Delay so the dragged card renders ghosted rather than highlighted
    setTimeout(() => dragNode.current?.classList.add("opacity-40"), 0);
  };

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (i !== draggedIdx) setDragOverIdx(i);
  };

  const handleDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) {
      cleanup();
      return;
    }
    const reordered = [...days];
    const [moved] = reordered.splice(draggedIdx, 1);
    reordered.splice(dropIdx, 0, moved);
    onChange(reordered.map((d, idx) => ({ ...d, day: idx + 1 })));
    // Adjust expanded index to follow the moved card
    setExpandedIdx(prev => {
      if (prev === null) return null;
      if (prev === draggedIdx) return dropIdx;
      if (draggedIdx < dropIdx) {
        if (prev > draggedIdx && prev <= dropIdx) return prev - 1;
      } else {
        if (prev >= dropIdx && prev < draggedIdx) return prev + 1;
      }
      return prev;
    });
    cleanup();
  };

  const handleDragEnd = () => {
    dragNode.current?.classList.remove("opacity-40");
    cleanup();
  };

  const cleanup = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
    dragNode.current = null;
  };

  const ta = `w-full rounded-xl border px-3 py-2 text-sm resize-none ${
    darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" : "border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
  }`;

  return (
    <div className="space-y-1">
      {days.length === 0 && (
        <p className={`text-xs italic py-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          No days added yet. Click "Add Day 1" to get started.
        </p>
      )}

      {days.map((day, i) => (
        <div key={i}>
          {/* Drop zone indicator — shown above the hovered card */}
          {dragOverIdx === i && draggedIdx !== null && draggedIdx !== i && (
            <div className="h-0.5 mx-2 bg-blue-500 rounded-full my-1 shadow-[0_0_6px_1px_rgba(59,130,246,0.6)]" />
          )}

          <div
            draggable
            onDragStart={e => handleDragStart(e, i)}
            onDragOver={e => handleDragOver(e, i)}
            onDrop={e => handleDrop(e, i)}
            onDragEnd={handleDragEnd}
            className={`border rounded-xl overflow-hidden transition-all duration-150 ${
              darkMode ? "border-slate-600 bg-slate-700/40" : "border-slate-200 bg-white"
            } ${expandedIdx === i ? (darkMode ? "border-blue-500/50" : "border-blue-200") : ""}
            ${draggedIdx === i ? "opacity-40 scale-[0.98]" : ""}
            ${dragOverIdx === i && draggedIdx !== i ? (darkMode ? "border-blue-500 bg-blue-500/5" : "border-blue-400 bg-blue-50/50") : ""}`}
          >
            {/* Day header row */}
            <div
              className={`flex items-center gap-2 px-3 py-2.5 select-none transition-colors ${
                darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
              }`}
            >
              {/* Drag handle */}
              <div
                className={`cursor-grab active:cursor-grabbing p-1 -ml-1 rounded transition-colors ${
                  darkMode ? "text-slate-600 hover:text-slate-400" : "text-slate-300 hover:text-slate-400"
                }`}
                title="Drag to reorder"
                onMouseDown={e => e.stopPropagation()}
              >
                <GripVertical className="w-4 h-4" />
              </div>

              <div
                className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {day.day}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${!day.title ? (darkMode ? "text-slate-500" : "text-slate-400") : ""}`}>
                    {day.title || `Day ${day.day} — click to edit`}
                  </p>
                  {day.activities.length > 0 && (
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                      {day.activities.length} activit{day.activities.length === 1 ? "y" : "ies"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); deleteDay(i); }}
                  className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                  title="Delete day"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div
                  className="cursor-pointer"
                  onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                >
                  {expandedIdx === i
                    ? <ChevronUp className="w-4 h-4 text-slate-400" />
                    : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>
            </div>

          {/* Expanded editor */}
          <AnimatePresence initial={false}>
            {expandedIdx === i && (
              <motion.div
                key="expanded"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className={`px-3 pb-4 space-y-3 border-t ${darkMode ? "border-slate-600" : "border-slate-100"}`}>
                  <div className="pt-3 space-y-2">
                    <Input
                      value={day.title}
                      onChange={e => updateDay(i, { title: e.target.value })}
                      placeholder={`Day ${day.day} title — e.g. Arrival & Seminyak`}
                      className={`text-sm ${inputCls}`}
                    />
                    <textarea
                      value={day.description}
                      onChange={e => updateDay(i, { description: e.target.value })}
                      rows={2}
                      placeholder="Brief description of what happens this day…"
                      className={ta}
                    />
                  </div>

                  {/* Activities */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        Activities
                      </span>
                      <button
                        type="button"
                        onClick={() => addActivity(i)}
                        className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add activity
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {day.activities.map((act, ai) => (
                        <div key={ai} className="flex items-center gap-2 group">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                          <Input
                            value={act}
                            onChange={e => updateActivity(i, ai, e.target.value)}
                            placeholder={`Activity ${ai + 1} — e.g. Airport pickup`}
                            className={`flex-1 h-8 text-sm ${inputCls}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeActivity(i, ai)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {day.activities.length === 0 && (
                        <p className={`text-xs italic ${darkMode ? "text-slate-600" : "text-slate-400"}`}>
                          No activities yet — click "Add activity" above.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addDay}
        className={`w-full py-2.5 border-2 border-dashed rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
          darkMode
            ? "border-slate-600 text-slate-500 hover:border-blue-500 hover:text-blue-400"
            : "border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500"
        }`}
      >
        <Plus className="w-4 h-4" />
        Add Day {days.length + 1}
      </button>
    </div>
  );
}

// ── Section Heading ───────────────────────────────────────────────────────────
function SectionHeading({ icon: Icon, label, darkMode }: { icon: any; label: string; darkMode: boolean }) {
  return (
    <div className={`flex items-center gap-2 pt-2 pb-1 border-b ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
      <Icon className="w-4 h-4 text-blue-500" />
      <span className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
        {label}
      </span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function Packages({ darkMode }: { darkMode: boolean }) {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Pkg> | null>(null);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const card = `rounded-2xl shadow-sm border ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`;
  const inputCls = `${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" : ""}`;
  const ta = `w-full rounded-xl border px-3 py-2 text-sm resize-none ${
    darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" : "border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
  }`;

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
  const openEdit = (p: Pkg) => { setEditing({ ...p, itinerary: Array.isArray(p.itinerary) ? p.itinerary : [] }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const set = (patch: Partial<Pkg>) => setEditing(prev => prev ? { ...prev, ...patch } : prev);

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

  const itinerary = (editing?.itinerary || []) as ItineraryDay[];

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Search */}
      <div className={`${card} p-4`}>
        <Input
          placeholder="Search packages…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`max-w-xs ${inputCls}`}
        />
      </div>

      {/* Grid */}
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
                {Array.isArray(p.itinerary) && p.itinerary.length > 0 && (
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Route className="w-3 h-3" />
                    {p.itinerary.length} days
                  </div>
                )}
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

      {/* ── Edit / Add Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && editing && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-6 bg-black/60 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`w-full max-w-3xl rounded-2xl shadow-2xl ${darkMode ? "bg-slate-800 text-white" : "bg-white"} overflow-hidden`}
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
                <div>
                  <h3 className="text-lg font-bold">{editing.id ? "Edit Package" : "Add New Package"}</h3>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {editing.title || "Untitled"}
                  </p>
                </div>
                <button onClick={closeModal} className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="px-6 py-5 space-y-5 max-h-[78vh] overflow-y-auto">

                {/* ── Basics ── */}
                <SectionHeading icon={MapPin} label="Basic Info" darkMode={darkMode} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium block mb-1">Package Title *</label>
                    <Input value={editing.title || ""} onChange={e => set({ title: e.target.value })} placeholder="e.g. Bali Honeymoon Paradise" className={inputCls} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium block mb-1">URL Slug</label>
                    <Input value={editing.slug || ""} onChange={e => set({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} placeholder="e.g. bali-honeymoon-paradise" className={inputCls} />
                    <p className={`text-xs mt-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Used in the URL: /packages/<strong>{editing.slug || "your-slug-here"}</strong></p>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Destination *</label>
                    <Input value={editing.destination || ""} onChange={e => set({ destination: e.target.value })} placeholder="Bali" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Country</label>
                    <Input value={editing.country || ""} onChange={e => set({ country: e.target.value })} placeholder="Indonesia" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Theme</label>
                    <select
                      value={editing.theme || "General"}
                      onChange={e => set({ theme: e.target.value })}
                      className={`w-full h-9 rounded-lg border px-3 text-sm ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "border-slate-200"}`}
                    >
                      {["Beach", "Romantic", "Adventure", "Cultural", "Family", "General"].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Duration</label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input type="number" value={editing.durationNights || 0} onChange={e => set({ durationNights: Number(e.target.value) })} placeholder="Nights" className={inputCls} />
                        <p className="text-xs text-slate-400 mt-0.5 text-center">Nights</p>
                      </div>
                      <div className="flex-1">
                        <Input type="number" value={editing.durationDays || 0} onChange={e => set({ durationDays: Number(e.target.value) })} placeholder="Days" className={inputCls} />
                        <p className="text-xs text-slate-400 mt-0.5 text-center">Days</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium block mb-1">Overview / Description</label>
                    <textarea
                      value={editing.overview || ""}
                      onChange={e => set({ overview: e.target.value })}
                      rows={3}
                      placeholder="Describe this package in a few sentences…"
                      className={ta}
                    />
                  </div>
                </div>

                {/* ── Pricing & Media ── */}
                <SectionHeading icon={ImageIcon} label="Pricing & Media" darkMode={darkMode} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">Base Price (₹) *</label>
                    <Input type="number" value={editing.price || ""} onChange={e => set({ price: e.target.value })} placeholder="119999" className={inputCls} />
                    <p className={`text-xs mt-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Original / was-price shown as strikethrough</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Offer Price (₹)</label>
                    <Input type="number" value={editing.offerPrice || ""} onChange={e => set({ offerPrice: e.target.value })} placeholder="89999 (leave blank if no offer)" className={inputCls} />
                    <p className={`text-xs mt-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Discounted price shown to customers</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium block mb-1">Cover Image URL</label>
                    <Input value={editing.imageUrl || ""} onChange={e => set({ imageUrl: e.target.value })} placeholder="https://images.unsplash.com/…" className={inputCls} />
                    {editing.imageUrl && (
                      <img src={editing.imageUrl} className="mt-2 h-28 w-full object-cover rounded-xl" alt="Cover preview" />
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Rating (0–5)</label>
                    <Input type="number" step="0.1" max="5" min="0" value={editing.rating || 4.5} onChange={e => set({ rating: Number(e.target.value) })} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Review Count</label>
                    <Input type="number" value={editing.reviewCount || 0} onChange={e => set({ reviewCount: Number(e.target.value) })} placeholder="0" className={inputCls} />
                  </div>
                  <div className="md:col-span-2 flex flex-wrap gap-5">
                    {(["isFeatured", "isTrending", "isPublished"] as const).map(key => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!(editing as any)[key]}
                          onChange={e => set({ [key]: e.target.checked } as any)}
                          className="w-4 h-4 rounded accent-blue-600"
                        />
                        <span className="text-sm">
                          {key === "isFeatured" ? "⭐ Featured" : key === "isTrending" ? "🔥 Trending" : "✅ Published (Live)"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ── Inclusions / Exclusions ── */}
                <SectionHeading icon={ListChecks} label="Inclusions & Exclusions" darkMode={darkMode} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">Highlights <span className={`${darkMode ? "text-slate-500" : "text-slate-400"}`}>(comma-separated)</span></label>
                    <textarea
                      rows={2}
                      value={(editing.highlights || []).join(", ")}
                      onChange={e => set({ highlights: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                      placeholder="Sunrise trek, Infinity pool, Cooking class"
                      className={ta}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Inclusions <span className={`${darkMode ? "text-slate-500" : "text-slate-400"}`}>(comma-separated)</span></label>
                    <textarea
                      rows={2}
                      value={(editing.inclusions || []).join(", ")}
                      onChange={e => set({ inclusions: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                      placeholder="Return flights, Hotel, Daily breakfast"
                      className={ta}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium block mb-1">Exclusions <span className={`${darkMode ? "text-slate-500" : "text-slate-400"}`}>(comma-separated)</span></label>
                    <textarea
                      rows={2}
                      value={(editing.exclusions || []).join(", ")}
                      onChange={e => set({ exclusions: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                      placeholder="Visa fees, Travel insurance, Personal expenses"
                      className={ta}
                    />
                  </div>
                </div>

                {/* ── Itinerary Builder ── */}
                <SectionHeading icon={Route} label={`Day-by-Day Itinerary ${itinerary.length > 0 ? `· ${itinerary.length} days` : ""}`} darkMode={darkMode} />
                <ItineraryBuilder
                  days={itinerary}
                  onChange={days => set({ itinerary: days })}
                  darkMode={darkMode}
                  inputCls={inputCls}
                />
              </div>

              {/* Footer */}
              <div className={`flex gap-3 px-6 py-4 border-t ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-slate-50"}`}>
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
