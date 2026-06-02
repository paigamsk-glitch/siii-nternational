import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Package, Building2, BookOpen, Users, DollarSign, Mail, TrendingUp, RefreshCw } from "lucide-react";
import { BASE_URL, ADMIN_KEY } from "./index";
import { format, parseISO } from "date-fns";

interface Stats {
  bookings: number;
  users: number;
  packages: number;
  hotels: number;
  destinations: number;
  inquiries: number;
  revenue: number;
}

const MOCK_CHART = [
  { month: "Jan", bookings: 12, revenue: 145000 },
  { month: "Feb", bookings: 19, revenue: 228000 },
  { month: "Mar", bookings: 15, revenue: 180000 },
  { month: "Apr", bookings: 28, revenue: 336000 },
  { month: "May", bookings: 22, revenue: 264000 },
  { month: "Jun", bookings: 35, revenue: 420000 },
];

export function Dashboard({ darkMode }: { darkMode: boolean }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${BASE_URL}/api/admin/stats`, {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      const data = await r.json();
      setStats(data.stats);
      setRecentBookings(data.recentBookings || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const card = `rounded-2xl p-6 shadow-sm border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`;

  const statCards = [
    { label: "Total Bookings", value: stats?.bookings ?? "—", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Total Users", value: stats?.users ?? "—", icon: Users, color: "text-violet-500", bg: "bg-violet-50" },
    { label: "Packages", value: stats?.packages ?? "—", icon: Package, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Hotels", value: stats?.hotels ?? "—", icon: Building2, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Revenue (paid)", value: stats ? `₹${(stats.revenue / 1000).toFixed(0)}K` : "—", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Inquiries", value: stats?.inquiries ?? "—", icon: Mail, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Overview</h2>
        <button onClick={fetchStats} className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={card}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{loading ? "…" : s.value}</p>
              <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={card}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <h3 className={`font-semibold ${darkMode ? "text-white" : "text-slate-700"}`}>Monthly Bookings</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_CHART}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: darkMode ? "#94a3b8" : "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: darkMode ? "#94a3b8" : "#64748b" }} />
              <Tooltip
                contentStyle={{
                  background: darkMode ? "#1e293b" : "#fff",
                  border: "1px solid " + (darkMode ? "#334155" : "#e2e8f0"),
                  borderRadius: 8, fontSize: 12,
                }}
              />
              <Bar dataKey="bookings" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={card}>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-green-500" />
            <h3 className={`font-semibold ${darkMode ? "text-white" : "text-slate-700"}`}>Revenue Trend (₹)</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MOCK_CHART}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: darkMode ? "#94a3b8" : "#64748b" }} />
              <YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 12, fill: darkMode ? "#94a3b8" : "#64748b" }} />
              <Tooltip
                formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Revenue"]}
                contentStyle={{
                  background: darkMode ? "#1e293b" : "#fff",
                  border: "1px solid " + (darkMode ? "#334155" : "#e2e8f0"),
                  borderRadius: 8, fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent bookings */}
      <div className={card}>
        <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-700"}`}>Recent Bookings</h3>
        {recentBookings.length === 0 ? (
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                  {["Guest", "Type", "Amount", "Status", "Date"].map(h => (
                    <th key={h} className={`text-left pb-3 font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id} className={`border-b last:border-0 ${darkMode ? "border-slate-700/50" : "border-slate-100"}`}>
                    <td className="py-3 font-medium">{b.contactName}</td>
                    <td className="py-3 capitalize">{b.type}</td>
                    <td className="py-3 font-semibold text-green-600">₹{Number(b.totalAmount).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        b.status === "confirmed" ? "bg-green-100 text-green-700" :
                        b.status === "pending" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>{b.status}</span>
                    </td>
                    <td className={`py-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {b.createdAt ? format(parseISO(b.createdAt), "dd MMM yyyy") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
