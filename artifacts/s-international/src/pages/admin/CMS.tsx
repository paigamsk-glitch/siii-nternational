import { useState, useEffect } from "react";
import {
  Save, RefreshCw, Loader2, Globe, Image, Star, MessageSquare, Bell,
  Share2, Layout, Search, Users, Plus, Trash2, Edit2, Check, X, Quote
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BASE_URL, ADMIN_KEY } from "./index";
import { invalidateCMSCache } from "@/hooks/useCMS";

const CMS_FIELDS = [
  // Homepage
  { key: "hero_title", label: "Hero Title", type: "text", placeholder: "The Art of Travel", section: "Homepage" },
  { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea", placeholder: "Curated experiences for those who seek the extraordinary.", section: "Homepage" },
  { key: "hero_image", label: "Hero Background Image URL", type: "url", placeholder: "https://images.unsplash.com/...", section: "Homepage" },
  { key: "about_tagline", label: "About Tagline", type: "textarea", placeholder: "Your trusted travel partner since 2010", section: "Homepage" },
  // Trust Markers
  { key: "trust_1_title", label: "Trust Block 1 — Title", type: "text", placeholder: "Curated Excellence", section: "Homepage" },
  { key: "trust_1_desc", label: "Trust Block 1 — Description", type: "textarea", placeholder: "Every hotel, flight, and experience is rigorously vetted.", section: "Homepage" },
  { key: "trust_2_title", label: "Trust Block 2 — Title", type: "text", placeholder: "Global Expertise", section: "Homepage" },
  { key: "trust_2_desc", label: "Trust Block 2 — Description", type: "textarea", placeholder: "Our travel concierges possess deep knowledge of destinations worldwide.", section: "Homepage" },
  { key: "trust_3_title", label: "Trust Block 3 — Title", type: "text", placeholder: "Seamless Journeys", section: "Homepage" },
  { key: "trust_3_desc", label: "Trust Block 3 — Description", type: "textarea", placeholder: "From inspiration to return, we handle every detail.", section: "Homepage" },
  // Contact
  { key: "contact_phone", label: "Phone Number", type: "text", placeholder: "+91 9867860209", section: "Contact" },
  { key: "contact_email", label: "Email Address", type: "text", placeholder: "info@sinternational.com", section: "Contact" },
  { key: "contact_address", label: "Office Address", type: "textarea", placeholder: "313 Metro Market, Mumbai – 400008", section: "Contact" },
  { key: "whatsapp_number", label: "WhatsApp Number (digits only)", type: "text", placeholder: "917777027454", section: "Contact" },
  // Social Media
  { key: "social_facebook", label: "Facebook Page URL", type: "url", placeholder: "https://facebook.com/sinternational", section: "Social Media" },
  { key: "social_instagram", label: "Instagram Profile URL", type: "url", placeholder: "https://instagram.com/sinternational", section: "Social Media" },
  { key: "social_twitter", label: "Twitter / X Profile URL", type: "url", placeholder: "https://twitter.com/sinternational", section: "Social Media" },
  { key: "social_linkedin", label: "LinkedIn Page URL", type: "url", placeholder: "https://linkedin.com/company/sinternational", section: "Social Media" },
  { key: "social_youtube", label: "YouTube Channel URL", type: "url", placeholder: "https://youtube.com/@sinternational", section: "Social Media" },
  // Footer
  { key: "footer_tagline", label: "Footer Brand Tagline", type: "textarea", placeholder: "Curating exceptional journeys for the discerning traveler.", section: "Footer" },
  { key: "footer_copyright", label: "Copyright Text (after © year)", type: "text", placeholder: "S International. All rights reserved.", section: "Footer" },
  // Banners
  { key: "featured_banner_image", label: "Packages Page Banner Image URL", type: "url", placeholder: "https://images.unsplash.com/...", section: "Banners" },
  { key: "hotels_banner_image", label: "Hotels Page Banner Image URL", type: "url", placeholder: "https://images.unsplash.com/...", section: "Banners" },
  { key: "flights_banner_image", label: "Flights Page Banner Image URL", type: "url", placeholder: "https://images.unsplash.com/...", section: "Banners" },
  { key: "visa_banner_image", label: "Visa Page Banner Image URL", type: "url", placeholder: "https://images.unsplash.com/...", section: "Banners" },
  // SEO
  { key: "seo_site_title", label: "Site Title (browser tab)", type: "text", placeholder: "S International Travel", section: "SEO" },
  { key: "seo_meta_description", label: "Meta Description (160 chars max)", type: "textarea", placeholder: "Expert travel packages, flights, hotels, and visa services.", section: "SEO" },
  { key: "seo_og_image", label: "Open Graph / Share Image URL", type: "url", placeholder: "https://...", section: "SEO" },
  // Announcements
  { key: "announcement_bar", label: "Top Announcement Bar Text", type: "textarea", placeholder: "🎉 Summer Sale — Up to 30% off all packages!", section: "Announcements" },
  { key: "promo_code", label: "Active Promo Code", type: "text", placeholder: "SUMMER30", section: "Announcements" },
  { key: "promo_discount", label: "Promo Discount Description", type: "text", placeholder: "30% off on all packages", section: "Announcements" },
];

const SECTION_ICONS: Record<string, React.ElementType> = {
  Homepage: Globe,
  Contact: MessageSquare,
  "Social Media": Share2,
  Footer: Layout,
  Banners: Image,
  SEO: Search,
  Announcements: Bell,
};

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar?: string;
}

function TestimonialsManager({ darkMode, values, onSave }: {
  darkMode: boolean;
  values: Record<string, string>;
  onSave: (key: string, value: string) => Promise<void>;
}) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Partial<Testimonial>>({ rating: 5 });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = values["testimonials_json"];
      if (raw) setTestimonials(JSON.parse(raw));
    } catch {}
  }, [values]);

  const card = `rounded-2xl shadow-sm border ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`;
  const inp = `w-full rounded-xl border px-3 py-2 text-sm ${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" : "border-slate-200"}`;

  const persistTestimonials = async (updated: Testimonial[]) => {
    setSaving(true);
    await onSave("testimonials_json", JSON.stringify(updated));
    setTestimonials(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  const handleAdd = async () => {
    if (!draft.name || !draft.quote) return;
    const newItem: Testimonial = {
      id: Date.now().toString(),
      name: draft.name,
      role: draft.role || "",
      quote: draft.quote,
      rating: draft.rating ?? 5,
      avatar: draft.avatar,
    };
    await persistTestimonials([...testimonials, newItem]);
    setAdding(false);
    setDraft({ rating: 5 });
  };

  const handleEdit = async () => {
    if (!editing) return;
    const updated = testimonials.map(t => t.id === editing.id ? editing : t);
    await persistTestimonials(updated);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    await persistTestimonials(testimonials.filter(t => t.id !== id));
  };

  const FormFields = ({ data, onChange }: { data: Partial<Testimonial>; onChange: (d: Partial<Testimonial>) => void }) => (
    <div className="space-y-3 mt-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={`text-xs font-medium block mb-1 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Name *</label>
          <input value={data.name || ""} onChange={e => onChange({ ...data, name: e.target.value })} placeholder="Priya Sharma" className={inp} />
        </div>
        <div>
          <label className={`text-xs font-medium block mb-1 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Role / Location</label>
          <input value={data.role || ""} onChange={e => onChange({ ...data, role: e.target.value })} placeholder="Mumbai, India" className={inp} />
        </div>
      </div>
      <div>
        <label className={`text-xs font-medium block mb-1 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Testimonial Quote *</label>
        <textarea
          value={data.quote || ""}
          onChange={e => onChange({ ...data, quote: e.target.value })}
          placeholder="S International made our honeymoon absolutely perfect..."
          rows={3}
          className={`${inp} resize-none`}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={`text-xs font-medium block mb-1 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Rating (1–5)</label>
          <select value={data.rating ?? 5} onChange={e => onChange({ ...data, rating: parseInt(e.target.value) })} className={inp}>
            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} ★</option>)}
          </select>
        </div>
        <div>
          <label className={`text-xs font-medium block mb-1 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Avatar URL (optional)</label>
          <input value={data.avatar || ""} onChange={e => onChange({ ...data, avatar: e.target.value })} placeholder="https://..." className={inp} />
        </div>
      </div>
    </div>
  );

  return (
    <div className={card}>
      <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Quote className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold">Testimonials</h3>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{testimonials.length} review{testimonials.length !== 1 ? "s" : ""} on website</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-green-500 font-medium">Saved ✓</span>}
          {saving && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          <button
            onClick={() => { setAdding(true); setEditing(null); setDraft({ rating: 5 }); }}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
          >
            <Plus className="w-3.5 h-3.5" /> Add Testimonial
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Add Form */}
        {adding && (
          <div className={`rounded-xl border-2 border-blue-400 p-4 ${darkMode ? "bg-slate-700/50" : "bg-blue-50/50"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-blue-600">New Testimonial</span>
              <button onClick={() => setAdding(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <FormFields data={draft} onChange={setDraft} />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAdd}
                disabled={!draft.name || !draft.quote || saving}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                <Check className="w-3.5 h-3.5" /> Save Testimonial
              </button>
              <button onClick={() => setAdding(false)} className={`text-xs px-4 py-2 rounded-lg border ${darkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}>Cancel</button>
            </div>
          </div>
        )}

        {/* List */}
        {testimonials.length === 0 && !adding && (
          <div className={`text-center py-12 rounded-xl border-2 border-dashed ${darkMode ? "border-slate-700 text-slate-500" : "border-slate-200 text-slate-400"}`}>
            <Quote className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No testimonials yet. Click "Add Testimonial" to get started.</p>
          </div>
        )}

        {testimonials.map(t => (
          <div key={t.id} className={`rounded-xl border p-4 ${darkMode ? "border-slate-700 bg-slate-700/30" : "border-slate-100 bg-slate-50/50"}`}>
            {editing?.id === t.id ? (
              <>
                <FormFields data={editing} onChange={d => setEditing(d as Testimonial)} />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleEdit}
                    disabled={saving}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                  >
                    <Check className="w-3.5 h-3.5" /> Update
                  </button>
                  <button onClick={() => setEditing(null)} className={`text-xs px-4 py-2 rounded-lg border ${darkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}>Cancel</button>
                </div>
              </>
            ) : (
              <div className="flex items-start gap-4">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" onError={e => (e.currentTarget.style.display = "none")} />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="font-semibold text-sm">{t.name}</span>
                      {t.role && <span className={`text-xs ml-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{t.role}</span>}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-xs text-amber-500">{"★".repeat(t.rating)}</span>
                      <button onClick={() => { setEditing(t); setAdding(false); }} className="p-1 text-blue-500 hover:text-blue-700"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <p className={`text-sm leading-relaxed line-clamp-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>"{t.quote}"</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CMS({ darkMode }: { darkMode: boolean }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"content" | "testimonials">("content");

  const card = `rounded-2xl shadow-sm border ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`;
  const inp = `${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" : ""}`;

  const fetchCMS = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${BASE_URL}/api/admin/cms`, { headers: { "x-admin-key": ADMIN_KEY } });
      const data = await r.json();
      const map: Record<string, string> = {};
      Object.entries(data.content || {}).forEach(([k, v]) => {
        map[k] = typeof v === "string" ? v : JSON.stringify(v);
      });
      setValues(map);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchCMS(); }, []);

  const saveField = async (key: string, label: string, overrideValue?: string) => {
    const val = overrideValue !== undefined ? overrideValue : (values[key] || "");
    setSaving(key);
    try {
      await fetch(`${BASE_URL}/api/admin/cms/${key}`, {
        method: "PUT",
        headers: { "x-admin-key": ADMIN_KEY, "content-type": "application/json" },
        body: JSON.stringify({ value: val, type: "text", label }),
      });
      if (overrideValue !== undefined) setValues(prev => ({ ...prev, [key]: overrideValue }));
      setSaved(key);
      invalidateCMSCache();
      setTimeout(() => setSaved(null), 2000);
    } catch {}
    setSaving(null);
  };

  const sections = [...new Set(CMS_FIELDS.map(f => f.section))];

  const tabBtn = (tab: "content" | "testimonials", label: string, Icon: React.ElementType) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
        activeTab === tab
          ? "bg-blue-600 text-white"
          : darkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"
      }`}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Website CMS Controls</h2>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Edit anything visible on the public website</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchCMS} className="p-2 text-blue-500"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex items-center gap-2 p-1 rounded-2xl w-fit ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
        {tabBtn("content", "Content & Settings", Globe)}
        {tabBtn("testimonials", "Testimonials", Quote)}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : activeTab === "testimonials" ? (
        <TestimonialsManager
          darkMode={darkMode}
          values={values}
          onSave={(key, value) => saveField(key, "Testimonials", value)}
        />
      ) : (
        <div className="space-y-6">
          {sections.map(section => {
            const Icon = SECTION_ICONS[section] || Globe;
            const fields = CMS_FIELDS.filter(f => f.section === section);
            return (
              <div key={section} className={card}>
                <div className={`flex items-center gap-3 px-6 py-4 border-b ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold">{section}</h3>
                    <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{fields.length} field{fields.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  {fields.map(field => (
                    <div key={field.key}>
                      <label className={`text-sm font-medium block mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{field.label}</label>
                      <div className="flex gap-2 items-start">
                        {field.type === "textarea" ? (
                          <textarea
                            value={values[field.key] || ""}
                            onChange={e => setValues({ ...values, [field.key]: e.target.value })}
                            placeholder={field.placeholder}
                            rows={2}
                            className={`flex-1 rounded-xl border px-3 py-2 text-sm resize-none ${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" : "border-slate-200"}`}
                          />
                        ) : (
                          <Input
                            type={field.type === "url" ? "url" : "text"}
                            value={values[field.key] || ""}
                            onChange={e => setValues({ ...values, [field.key]: e.target.value })}
                            placeholder={field.placeholder}
                            className={`flex-1 ${inp}`}
                          />
                        )}
                        <Button
                          onClick={() => saveField(field.key, field.label)}
                          disabled={saving === field.key}
                          className={`shrink-0 px-4 rounded-xl ${saved === field.key ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                        >
                          {saving === field.key ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : saved === field.key ? (
                            "Saved ✓"
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {field.type === "url" && values[field.key] && (
                        <img src={values[field.key]} className="mt-2 h-20 w-full object-cover rounded-lg opacity-80" alt="" onError={e => (e.currentTarget.style.display = "none")} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
