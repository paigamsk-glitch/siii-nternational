import { useState, useEffect } from "react";
import { Save, RefreshCw, Loader2, Globe, Image, Star, MessageSquare, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BASE_URL, ADMIN_KEY } from "./index";

const CMS_FIELDS = [
  { key: "hero_title", label: "Homepage Hero Title", type: "text", placeholder: "Discover the World with S International", section: "Homepage" },
  { key: "hero_subtitle", label: "Homepage Hero Subtitle", type: "text", placeholder: "Expert-crafted journeys to 50+ destinations", section: "Homepage" },
  { key: "hero_image", label: "Homepage Hero Image URL", type: "url", placeholder: "https://images.unsplash.com/...", section: "Homepage" },
  { key: "contact_phone", label: "Contact Phone Number", type: "text", placeholder: "+91 9867860209", section: "Contact" },
  { key: "contact_email", label: "Contact Email", type: "text", placeholder: "info@sinternational.com", section: "Contact" },
  { key: "contact_address", label: "Office Address", type: "text", placeholder: "Mumbai, Maharashtra", section: "Contact" },
  { key: "whatsapp_number", label: "WhatsApp Number (for chat button)", type: "text", placeholder: "917777027454", section: "Contact" },
  { key: "about_tagline", label: "About Tagline", type: "text", placeholder: "Your trusted travel partner since 2010", section: "About" },
  { key: "featured_banner_image", label: "Packages Page Banner Image", type: "url", placeholder: "https://images.unsplash.com/...", section: "Banners" },
  { key: "hotels_banner_image", label: "Hotels Page Banner Image", type: "url", placeholder: "https://images.unsplash.com/...", section: "Banners" },
  { key: "flights_banner_image", label: "Flights Page Banner Image", type: "url", placeholder: "https://images.unsplash.com/...", section: "Banners" },
  { key: "announcement_bar", label: "Top Announcement Bar Text", type: "text", placeholder: "🎉 Summer Sale — Up to 30% off all packages!", section: "Announcements" },
  { key: "promo_code", label: "Active Promo Code", type: "text", placeholder: "SUMMER30", section: "Announcements" },
];

const SECTION_ICONS: Record<string, React.ElementType> = {
  Homepage: Globe,
  Contact: MessageSquare,
  About: Star,
  Banners: Image,
  Announcements: Bell,
};

export function CMS({ darkMode }: { darkMode: boolean }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const card = `rounded-2xl shadow-sm border ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`;
  const input = `${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" : ""}`;

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

  const saveField = async (key: string, label: string) => {
    setSaving(key);
    try {
      await fetch(`${BASE_URL}/api/admin/cms/${key}`, {
        method: "PUT",
        headers: { "x-admin-key": ADMIN_KEY, "content-type": "application/json" },
        body: JSON.stringify({ value: values[key] || "", type: "text", label }),
      });
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch {}
    setSaving(null);
  };

  const sections = [...new Set(CMS_FIELDS.map(f => f.section))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Website CMS Controls</h2>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage website content and settings</p>
        </div>
        <button onClick={fetchCMS} className="p-2 text-blue-500"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
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
                  <h3 className="font-bold">{section} Settings</h3>
                </div>
                <div className="p-6 space-y-4">
                  {fields.map(field => (
                    <div key={field.key}>
                      <label className={`text-sm font-medium block mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{field.label}</label>
                      <div className="flex gap-2">
                        {field.key.includes("subtitle") || field.key.includes("tagline") || field.key.includes("announcement") ? (
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
                            className={`flex-1 ${input}`}
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
