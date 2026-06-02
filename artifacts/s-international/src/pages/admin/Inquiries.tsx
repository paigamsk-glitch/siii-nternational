import { useState, useEffect } from "react";
import { RefreshCw, Loader2, Search, Trash2, Mail, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BASE_URL, ADMIN_KEY } from "./index";
import { format, parseISO } from "date-fns";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType: string;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  general: "bg-blue-100 text-blue-700",
  booking: "bg-green-100 text-green-700",
  complaint: "bg-red-100 text-red-700",
  feedback: "bg-amber-100 text-amber-700",
  partnership: "bg-purple-100 text-purple-700",
};

export function Inquiries({ darkMode }: { darkMode: boolean }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const card = `rounded-2xl shadow-sm border ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`;
  const input = `${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" : ""}`;

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${BASE_URL}/api/admin/inquiries`, { headers: { "x-admin-key": ADMIN_KEY } });
      const data = await r.json();
      setInquiries(data.inquiries || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchInquiries(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    setDeleting(id);
    try {
      await fetch(`${BASE_URL}/api/admin/inquiries/${id}`, {
        method: "DELETE", headers: { "x-admin-key": ADMIN_KEY },
      });
      setInquiries(i => i.filter(x => x.id !== id));
    } catch {}
    setDeleting(null);
  };

  const filtered = inquiries.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase()) ||
    i.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Customer Inquiries</h2>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{inquiries.length} total inquiries</p>
        </div>
        <button onClick={fetchInquiries} className="p-2 text-blue-500"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></button>
      </div>

      <div className={`${card} p-4`}>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search inquiries…" value={search} onChange={e => setSearch(e.target.value)} className={`pl-9 ${input}`} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : filtered.length === 0 ? (
        <div className={`${card} p-12 text-center`}>
          <p className={`${darkMode ? "text-slate-400" : "text-slate-500"}`}>No inquiries found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inq => (
            <div key={inq.id} className={`${card} overflow-hidden`}>
              <div
                className={`flex items-center justify-between p-4 cursor-pointer hover:${darkMode ? "bg-slate-700/50" : "bg-slate-50"} transition-colors`}
                onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                    <span className="font-bold text-sm text-slate-600">{inq.name[0]?.toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{inq.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TYPE_COLORS[inq.inquiryType] || "bg-slate-100 text-slate-600"}`}>
                        {inq.inquiryType}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{inq.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs hidden sm:block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {inq.createdAt ? format(parseISO(inq.createdAt), "dd MMM yyyy") : ""}
                  </span>
                  {expanded === inq.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
              {expanded === inq.id && (
                <div className={`border-t px-4 pb-4 pt-4 ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-4">
                    <div>
                      <p className={`text-xs font-medium mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Email</p>
                      <p>{inq.email}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Phone</p>
                      <p>{inq.phone || "—"}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Date</p>
                      <p>{inq.createdAt ? format(parseISO(inq.createdAt), "dd MMM yyyy, HH:mm") : "—"}</p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl text-sm mb-4 ${darkMode ? "bg-slate-700" : "bg-slate-50"}`}>
                    {inq.message}
                  </div>
                  <div className="flex gap-3">
                    <a href={`mailto:${inq.email}?subject=Re: ${inq.subject}`} className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors">
                      <Mail className="w-4 h-4" /> Reply via Email
                    </a>
                    {inq.phone && (
                      <a href={`https://wa.me/91${inq.phone.replace(/\D/g, "").slice(-10)}?text=Hi ${inq.name}, regarding your inquiry: ${inq.subject}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-colors">
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(inq.id)}
                      disabled={deleting === inq.id}
                      className="ml-auto flex items-center gap-2 text-sm text-red-500 hover:text-red-700 px-3 py-2 rounded-xl transition-colors"
                    >
                      {deleting === inq.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
