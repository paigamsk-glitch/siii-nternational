import { useState, useEffect } from "react";
import { RefreshCw, Loader2, Search, UserX, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BASE_URL, ADMIN_KEY } from "./index";
import { format, parseISO } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  isBlocked: boolean;
}

export function AdminUsers({ darkMode }: { darkMode: boolean }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const card = `rounded-2xl shadow-sm border ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`;
  const input = `${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" : ""}`;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${BASE_URL}/api/admin/users`, { headers: { "x-admin-key": ADMIN_KEY } });
      const data = await r.json();
      setUsers(data.users || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleBlock = async (userId: string) => {
    setTogglingId(userId);
    try {
      const r = await fetch(`${BASE_URL}/api/admin/users/${userId}/block`, {
        method: "PATCH",
        headers: { "x-admin-key": ADMIN_KEY },
      });
      const data = await r.json();
      setUsers(u => u.map(x => x.id === userId ? { ...x, isBlocked: data.blocked } : x));
    } catch {}
    setTogglingId(null);
  };

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const blockedCount = users.filter(u => u.isBlocked).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>User Management</h2>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{users.length} users · {blockedCount} blocked</p>
        </div>
        <button onClick={fetchUsers} className="p-2 text-blue-500"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></button>
      </div>

      <div className={`${card} p-4`}>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} className={`pl-9 ${input}`} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : (
        <div className={`${card} overflow-x-auto`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                {["User", "Phone", "Joined", "Status", "Actions"].map(h => (
                  <th key={h} className={`text-left px-4 py-3 font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400">No registered users yet.</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className={`border-b last:border-0 ${darkMode ? "border-slate-700/50" : "border-slate-100"} ${u.isBlocked ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">{u.name[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{u.phone || "—"}</td>
                  <td className={`px-4 py-3 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {u.createdAt ? format(parseISO(u.createdAt), "dd MMM yyyy") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleBlock(u.id)}
                      disabled={togglingId === u.id}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                        u.isBlocked
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      {togglingId === u.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : u.isBlocked ? (
                        <><UserCheck className="w-3.5 h-3.5" /> Unblock</>
                      ) : (
                        <><UserX className="w-3.5 h-3.5" /> Block</>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
