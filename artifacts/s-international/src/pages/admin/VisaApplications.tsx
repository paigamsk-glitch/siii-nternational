import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Eye, Edit3, CheckCircle2, XCircle, Clock, AlertCircle,
  X, Users, Globe, FileCheck, CreditCard, Loader2,
  ChevronLeft, ChevronRight, Phone, Mail, RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// ─── Types ─────────────────────────────────────────────────────────────────
type Status = "pending" | "docs-required" | "in-review" | "approved" | "rejected" | "payment-pending";

interface Application {
  id: string;
  name: string;
  email: string;
  mobile: string;
  passport: string;
  nationality: string;
  country: string;
  countryName: string;
  flagCode: string;
  visaType: string;
  status: Status;
  appliedDate: string;
  travelDate: string;
  travellers: number;
  amount: number;
  notes: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────
const MOCK: Application[] = [
  { id:"SINDEMOAPL1",  name:"Rahul Sharma",    email:"rahul.sharma@gmail.com",   mobile:"+91 98765 43210", passport:"N1234567", nationality:"India", country:"USA", countryName:"United States",      flagCode:"us", visaType:"Tourist Visa (B-2)",           status:"approved",        appliedDate:"2026-06-02", travelDate:"2026-07-15", travellers:2, amount:12300, notes:"All documents verified." },
  { id:"SINDEMO2BRZ",  name:"Priya Patel",     email:"priya.patel@yahoo.co.in",  mobile:"+91 87654 32109", passport:"N7654321", nationality:"India", country:"FRA", countryName:"France (Schengen)",  flagCode:"fr", visaType:"Schengen Tourist Visa",        status:"in-review",       appliedDate:"2026-06-05", travelDate:"2026-07-20", travellers:1, amount:8500,  notes:"Awaiting embassy slot." },
  { id:"SINDEMO3UK0",  name:"Arjun Nair",      email:"arjun.nair@outlook.com",   mobile:"+91 76543 21098", passport:"N9876543", nationality:"India", country:"GBR", countryName:"United Kingdom",      flagCode:"gb", visaType:"Standard Visitor Visa",        status:"docs-required",   appliedDate:"2026-06-07", travelDate:"2026-08-01", travellers:1, amount:9200,  notes:"Bank statement pending." },
  { id:"SINT20060401", name:"Meera Krishnan",  email:"meera.k@hotmail.com",      mobile:"+91 99887 76655", passport:"P2345678", nationality:"India", country:"AUS", countryName:"Australia",           flagCode:"au", visaType:"Visitor Visa (Subclass 600)",  status:"pending",         appliedDate:"2026-06-08", travelDate:"2026-09-10", travellers:3, amount:18900, notes:"New application." },
  { id:"SINT20060402", name:"Suresh Menon",    email:"suresh.menon@gmail.com",   mobile:"+91 88776 65544", passport:"P3456789", nationality:"India", country:"SGP", countryName:"Singapore",           flagCode:"sg", visaType:"Tourist Visa",                 status:"approved",        appliedDate:"2026-06-01", travelDate:"2026-06-25", travellers:2, amount:5400,  notes:"Visa stamped and dispatched." },
  { id:"SINT20060403", name:"Kavitha Rao",     email:"kavitha.rao@gmail.com",    mobile:"+91 77665 54433", passport:"P4567890", nationality:"India", country:"ARE", countryName:"Dubai / UAE",         flagCode:"ae", visaType:"30-Day Tourist Visa",          status:"approved",        appliedDate:"2026-05-28", travelDate:"2026-06-20", travellers:4, amount:14000, notes:"Group visa processed." },
  { id:"SINT20060404", name:"Deepak Verma",    email:"deepak.v@rediffmail.com",  mobile:"+91 66554 43322", passport:"P5678901", nationality:"India", country:"JPN", countryName:"Japan",               flagCode:"jp", visaType:"Tourist Visa",                 status:"payment-pending", appliedDate:"2026-06-09", travelDate:"2026-08-05", travellers:1, amount:7800,  notes:"Awaiting payment confirmation." },
  { id:"SINT20060405", name:"Anita Desai",     email:"anita.desai@gmail.com",    mobile:"+91 55443 32211", passport:"P6789012", nationality:"India", country:"CAN", countryName:"Canada",              flagCode:"ca", visaType:"Visitor Visa (TRV)",           status:"rejected",        appliedDate:"2026-06-03", travelDate:"2026-07-01", travellers:2, amount:0,     notes:"Rejected: Insufficient funds proof." },
  { id:"SINT20060406", name:"Rajesh Pillai",   email:"rajesh.p@gmail.com",       mobile:"+91 44332 21100", passport:"P7890123", nationality:"India", country:"THA", countryName:"Thailand",            flagCode:"th", visaType:"Tourist Visa on Arrival",      status:"approved",        appliedDate:"2026-06-10", travelDate:"2026-06-30", travellers:2, amount:4200,  notes:"Visa on arrival confirmed." },
  { id:"SINT20060407", name:"Sneha Iyer",      email:"sneha.iyer@icloud.com",    mobile:"+91 33221 10099", passport:"P8901234", nationality:"India", country:"DEU", countryName:"Germany (Schengen)",  flagCode:"de", visaType:"Schengen Tourist Visa",        status:"in-review",       appliedDate:"2026-06-06", travelDate:"2026-08-15", travellers:1, amount:9500,  notes:"Embassy appointment on 20 Jun." },
  { id:"SINT20060408", name:"Vikram Singh",    email:"vikram.s@gmail.com",       mobile:"+91 22110 09988", passport:"P9012345", nationality:"India", country:"USA", countryName:"United States",      flagCode:"us", visaType:"B-1/B-2 Multiple Entry",      status:"docs-required",   appliedDate:"2026-06-04", travelDate:"2026-09-01", travellers:1, amount:12800, notes:"ITR for last 3 years needed." },
  { id:"SINT20060409", name:"Lakshmi Bhat",    email:"lakshmi.bhat@gmail.com",   mobile:"+91 11009 98877", passport:"A1234567", nationality:"India", country:"NZL", countryName:"New Zealand",         flagCode:"nz", visaType:"Visitor Visa",                 status:"pending",         appliedDate:"2026-06-11", travelDate:"2026-10-05", travellers:2, amount:11200, notes:"New application." },
  { id:"SINT20060410", name:"Aditya Joshi",    email:"aditya.j@gmail.com",       mobile:"+91 90001 23456", passport:"A2345678", nationality:"India", country:"FRA", countryName:"France (Schengen)",  flagCode:"fr", visaType:"Schengen Business Visa",      status:"approved",        appliedDate:"2026-06-01", travelDate:"2026-06-18", travellers:1, amount:9000,  notes:"Business invitation letter accepted." },
  { id:"SINT20060411", name:"Pooja Sharma",    email:"pooja.s@hotmail.com",      mobile:"+91 91234 56789", passport:"A3456789", nationality:"India", country:"GBR", countryName:"United Kingdom",      flagCode:"gb", visaType:"Student Visa (Tier 4)",        status:"in-review",       appliedDate:"2026-06-08", travelDate:"2026-09-15", travellers:1, amount:15200, notes:"Awaiting CAS from university." },
  { id:"SINT20060412", name:"Kiran Kumar",     email:"kiran.kumar@gmail.com",    mobile:"+91 81234 56789", passport:"A4567890", nationality:"India", country:"ARE", countryName:"Dubai / UAE",         flagCode:"ae", visaType:"96-Hour Transit Visa",         status:"approved",        appliedDate:"2026-06-09", travelDate:"2026-06-28", travellers:1, amount:2800,  notes:"Transit visa issued." },
  { id:"SINT20060413", name:"Harsha Reddy",    email:"harsha.r@gmail.com",       mobile:"+91 70123 45678", passport:"B1234567", nationality:"India", country:"ITA", countryName:"Italy (Schengen)",   flagCode:"it", visaType:"Schengen Tourist Visa",        status:"pending",         appliedDate:"2026-06-12", travelDate:"2026-08-20", travellers:2, amount:10600, notes:"Documents under review." },
  { id:"SINT20060414", name:"Sunita Gupta",    email:"sunita.g@yahoo.in",        mobile:"+91 60987 65432", passport:"B2345678", nationality:"India", country:"THA", countryName:"Thailand",            flagCode:"th", visaType:"Multiple Entry Tourist Visa",  status:"in-review",       appliedDate:"2026-06-10", travelDate:"2026-07-25", travellers:2, amount:5800,  notes:"Awaiting consulate confirmation." },
  { id:"SINT20060415", name:"Ramesh Nambiar",  email:"ramesh.n@gmail.com",       mobile:"+91 50876 54321", passport:"B3456789", nationality:"India", country:"AUS", countryName:"Australia",           flagCode:"au", visaType:"Student Visa (Subclass 500)", status:"docs-required",   appliedDate:"2026-06-07", travelDate:"2026-09-30", travellers:1, amount:16500, notes:"Offer letter and health insurance needed." },
];

const ALL_STATUSES: Status[] = ["pending","docs-required","in-review","approved","rejected","payment-pending"];

const STATUS_CONFIG: Record<Status, { label: string; tw: string; icon: React.ElementType }> = {
  "pending":         { label: "Pending",         tw: "bg-amber-100 text-amber-800 border-amber-200",   icon: Clock },
  "docs-required":   { label: "Docs Required",   tw: "bg-orange-100 text-orange-800 border-orange-200",icon: AlertCircle },
  "in-review":       { label: "In Review",       tw: "bg-blue-100 text-blue-800 border-blue-200",      icon: Eye },
  "approved":        { label: "Approved",        tw: "bg-emerald-100 text-emerald-800 border-emerald-200",icon: CheckCircle2 },
  "rejected":        { label: "Rejected",        tw: "bg-red-100 text-red-800 border-red-200",         icon: XCircle },
  "payment-pending": { label: "Payment Pending", tw: "bg-violet-100 text-violet-800 border-violet-200",icon: CreditCard },
};

function FlagImg({ code }: { code: string }) {
  return (
    <img src={`https://flagcdn.com/w20/${code}.png`} alt={code} width={20} height={15}
      className="rounded-sm object-cover shrink-0" style={{ width: 20, height: 15 }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
  );
}

function StatusBadge({ status }: { status: Status }) {
  const c = STATUS_CONFIG[status];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.tw}`}>
      <Icon className="h-3 w-3" />{c.label}
    </span>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────
function AppModal({ app, darkMode, onClose, onUpdate }: {
  app: Application; darkMode: boolean;
  onClose: () => void; onUpdate: (id: string, s: Status, n: string) => void;
}) {
  const [newStatus, setNewStatus] = useState<Status>(app.status);
  const [notes, setNotes]         = useState(app.notes);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);

  const modal = darkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white text-slate-800 border-slate-200";
  const muted = darkMode ? "text-slate-400" : "text-slate-500";
  const inputCls = darkMode
    ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
    : "bg-white border-slate-200 text-slate-800";

  async function save() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    onUpdate(app.id, newStatus, notes);
    setSaving(false); setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className={`relative ${modal} border rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto z-10`}
      >
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-2xl flex items-start justify-between">
          <div>
            <p className="text-xs opacity-70 font-mono mb-0.5">Application ID</p>
            <h2 className="text-lg font-bold font-mono">{app.id}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Applicant */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${muted}`}>Applicant</p>
              <p className="font-bold">{app.name}</p>
              <p className={`text-sm flex items-center gap-1 mt-0.5 ${muted}`}><Mail className="h-3 w-3" />{app.email}</p>
              <p className={`text-sm flex items-center gap-1 mt-0.5 ${muted}`}><Phone className="h-3 w-3" />{app.mobile}</p>
            </div>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${muted}`}>Passport</p>
              <p className="font-mono font-bold">{app.passport}</p>
              <p className={`text-sm mt-0.5 ${muted}`}>Nationality: {app.nationality}</p>
              <p className={`text-sm mt-0.5 ${muted}`}>{app.travellers} Traveller{app.travellers > 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Visa Info */}
          <div className={`${darkMode ? "bg-slate-700/50" : "bg-slate-50"} rounded-xl p-4 grid grid-cols-2 gap-4`}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${muted}`}>Destination</p>
              <div className="flex items-center gap-2">
                <FlagImg code={app.flagCode} />
                <span className="font-semibold">{app.countryName}</span>
              </div>
              <p className={`text-sm mt-1 ${muted}`}>{app.visaType}</p>
            </div>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${muted}`}>Dates</p>
              <p className="text-sm"><span className={muted}>Applied:</span> {app.appliedDate}</p>
              <p className="text-sm mt-0.5"><span className={muted}>Travel:</span> {app.travelDate}</p>
            </div>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${muted}`}>Amount</p>
              <p className="font-bold text-lg text-blue-600">₹{app.amount > 0 ? app.amount.toLocaleString("en-IN") : "—"}</p>
            </div>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${muted}`}>Current Status</p>
              <StatusBadge status={app.status} />
            </div>
          </div>

          {/* Update */}
          <div className={`border ${darkMode ? "border-slate-700" : "border-slate-200"} rounded-xl p-4 space-y-3`}>
            <h3 className="font-semibold text-sm">Update Status</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_STATUSES.map((s) => {
                const c = STATUS_CONFIG[s];
                const Icon = c.icon;
                return (
                  <button key={s} onClick={() => setNewStatus(s)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all
                      ${newStatus === s
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : darkMode ? "border-slate-600 text-slate-300 hover:border-blue-400" : "border-slate-200 text-slate-600 hover:border-blue-400"}`}>
                    <Icon className="h-3.5 w-3.5" />{c.label}
                  </button>
                );
              })}
            </div>
            <div>
              <Label className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${muted}`}>Internal Notes</Label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors resize-none focus:border-blue-400 ${inputCls}`}
                placeholder="Add a note for this update..."
              />
            </div>
            <Button onClick={save} disabled={saving || saved} className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</>
                : saved ? <><CheckCircle2 className="h-4 w-4" />Saved!</>
                : "Save Status Update"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────
export function VisaApplications({ darkMode }: { darkMode: boolean }) {
  const [apps, setApps]                 = useState<Application[]>(MOCK);
  const [search, setSearch]             = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterStatus, setFilterStatus]   = useState<Status | "all">("all");
  const [selected, setSelected]           = useState<Application | null>(null);
  const [page, setPage]                   = useState(1);
  const [refreshing, setRefreshing]       = useState(false);
  const PER_PAGE = 8;

  const card  = `rounded-2xl shadow-sm border ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`;
  const muted = darkMode ? "text-slate-400" : "text-slate-500";
  const sel   = darkMode ? "bg-slate-700 border-slate-600 text-white" : "";

  const countries = useMemo(() => {
    const seen = new Set<string>();
    return apps.filter(a => { if (seen.has(a.country)) return false; seen.add(a.country); return true; })
      .map(a => ({ code: a.country, name: a.countryName }));
  }, [apps]);

  const filtered = useMemo(() => apps.filter(a => {
    const q = search.toLowerCase();
    return (!q || [a.name, a.id, a.email, a.passport].some(f => f.toLowerCase().includes(q)))
      && (filterCountry === "all" || a.country === filterCountry)
      && (filterStatus  === "all" || a.status  === filterStatus);
  }), [apps, search, filterCountry, filterStatus]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = useMemo(() => ({
    total:    apps.length,
    pending:  apps.filter(a => a.status === "pending").length,
    inReview: apps.filter(a => a.status === "in-review").length,
    approved: apps.filter(a => a.status === "approved").length,
    rejected: apps.filter(a => a.status === "rejected").length,
    docs:     apps.filter(a => a.status === "docs-required").length,
  }), [apps]);

  function handleUpdate(id: string, status: Status, notes: string) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status, notes } : a));
    setSelected(null);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setRefreshing(false);
  }

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label:"Total",       val: stats.total,    color:"text-blue-600",    bg: darkMode ? "bg-blue-900/30" : "bg-blue-50",    icon: Users },
          { label:"Pending",     val: stats.pending,  color:"text-amber-600",   bg: darkMode ? "bg-amber-900/30" : "bg-amber-50",  icon: Clock },
          { label:"Docs Needed", val: stats.docs,     color:"text-orange-600",  bg: darkMode ? "bg-orange-900/30" : "bg-orange-50",icon: AlertCircle },
          { label:"In Review",   val: stats.inReview, color:"text-blue-600",    bg: darkMode ? "bg-blue-900/30" : "bg-sky-50",     icon: Eye },
          { label:"Approved",    val: stats.approved, color:"text-emerald-600", bg: darkMode ? "bg-emerald-900/30" : "bg-emerald-50",icon: CheckCircle2 },
          { label:"Rejected",    val: stats.rejected, color:"text-red-600",     bg: darkMode ? "bg-red-900/30" : "bg-red-50",     icon: XCircle },
        ].map(({ label, val, color, bg, icon: Icon }) => (
          <div key={label} className={`${card} ${bg} p-4 text-center`}>
            <Icon className={`h-5 w-5 ${color} mx-auto mb-1.5`} />
            <p className={`text-2xl font-black ${color}`}>{val}</p>
            <p className={`text-[11px] font-medium ${muted}`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`${card} p-4`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-2.5 h-4 w-4 ${muted}`} />
            <input
              placeholder="Search by name, ID, email, passport..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none transition-colors focus:border-blue-400 ${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" : "bg-white border-slate-200"}`}
            />
          </div>
          <select value={filterCountry} onChange={e => { setFilterCountry(e.target.value); setPage(1); }}
            className={`px-3 py-2 rounded-xl border text-sm outline-none cursor-pointer min-w-[160px] focus:border-blue-400 ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200"}`}>
            <option value="all">All Countries</option>
            {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as Status | "all"); setPage(1); }}
            className={`px-3 py-2 rounded-xl border text-sm outline-none cursor-pointer min-w-[160px] focus:border-blue-400 ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200"}`}>
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
          </select>
          <button onClick={handleRefresh}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors whitespace-nowrap ${darkMode ? "border-slate-600 text-slate-300 hover:border-blue-400" : "border-slate-200 text-slate-600 hover:border-blue-400"}`}>
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          {(search || filterCountry !== "all" || filterStatus !== "all") && (
            <button onClick={() => { setSearch(""); setFilterCountry("all"); setFilterStatus("all"); setPage(1); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-sm hover:bg-red-50 transition-colors whitespace-nowrap">
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>
        <p className={`text-xs mt-2 ${muted}`}>
          Showing <strong>{filtered.length}</strong> of <strong>{apps.length}</strong> applications
        </p>
      </div>

      {/* Table */}
      <div className={`${card} overflow-hidden`}>
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b text-xs font-bold uppercase tracking-wider ${muted} ${darkMode ? "border-slate-700 bg-slate-700/40" : "border-slate-200 bg-slate-50"}`}>
                <th className="text-left px-5 py-3">Ref #</th>
                <th className="text-left px-5 py-3">Applicant</th>
                <th className="text-left px-5 py-3">Destination</th>
                <th className="text-left px-5 py-3">Visa Type</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Dates</th>
                <th className="text-left px-5 py-3">Amount</th>
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? "divide-slate-700" : "divide-slate-100"}`}>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className={`px-5 py-12 text-center text-sm ${muted}`}>No applications match your filters.</td></tr>
              ) : paginated.map((app, i) => (
                <motion.tr key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className={`transition-colors ${darkMode ? "hover:bg-slate-700/40" : "hover:bg-slate-50"}`}>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg">{app.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-sm">{app.name}</p>
                    <p className={`text-xs ${muted}`}>{app.travellers} traveller{app.travellers > 1 ? "s" : ""} · {app.passport}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <FlagImg code={app.flagCode} />
                      <span className="text-sm font-medium">{app.countryName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className={`text-xs max-w-[160px] leading-tight ${muted}`}>{app.visaType}</p>
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={app.status} /></td>
                  <td className="px-5 py-3.5">
                    <p className={`text-xs ${muted}`}>{app.appliedDate}</p>
                    <p className={`text-xs ${muted}`}>Travel: {app.travelDate}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-bold text-blue-600">{app.amount > 0 ? `₹${app.amount.toLocaleString("en-IN")}` : "—"}</p>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => setSelected(app)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors">
                      <Edit3 className="h-3 w-3" /> Manage
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className={`md:hidden divide-y ${darkMode ? "divide-slate-700" : "divide-slate-100"}`}>
          {paginated.length === 0 ? (
            <p className={`text-center py-10 text-sm ${muted}`}>No applications match your filters.</p>
          ) : paginated.map(app => (
            <div key={app.id} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{app.id}</span>
                  <p className="font-semibold text-sm mt-1">{app.name}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
              <div className="flex items-center gap-2">
                <FlagImg code={app.flagCode} />
                <span className="text-sm">{app.countryName}</span>
                <span className={`text-xs ${muted}`}>· {app.visaType}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-xs ${muted}`}>{app.appliedDate} · {app.travellers} traveller{app.travellers > 1 ? "s" : ""}</p>
                <p className="text-sm font-bold text-blue-600">{app.amount > 0 ? `₹${app.amount.toLocaleString("en-IN")}` : "—"}</p>
              </div>
              <button onClick={() => setSelected(app)}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold transition-colors">
                <Edit3 className="h-4 w-4" /> Manage Application
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`border-t px-5 py-3 flex items-center justify-between ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
            <p className={`text-xs ${muted}`}>Page {page} of {totalPages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center disabled:opacity-40 transition-colors ${darkMode ? "border-slate-600 hover:border-blue-400" : "border-slate-200 hover:border-blue-400"}`}>
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${page === i + 1 ? "bg-blue-600 text-white" : darkMode ? "border border-slate-600 hover:border-blue-400 text-slate-300" : "border border-slate-200 hover:border-blue-400 text-slate-700"}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center disabled:opacity-40 transition-colors ${darkMode ? "border-slate-600 hover:border-blue-400" : "border-slate-200 hover:border-blue-400"}`}>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes legend */}
      <div className={`${card} p-4`}>
        <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${muted}`}>Status Guide</p>
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map(s => <StatusBadge key={s} status={s} />)}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <AppModal app={selected} darkMode={darkMode} onClose={() => setSelected(null)} onUpdate={handleUpdate} />
        )}
      </AnimatePresence>
    </div>
  );
}
