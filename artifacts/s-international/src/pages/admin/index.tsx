import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, LayoutDashboard, Package, Building2, Map, BookOpen,
  Users, Settings, LogOut, Menu, X, ChevronRight, Plane, Sun, Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dashboard } from "./Dashboard";
import { Packages } from "./Packages";
import { Hotels } from "./Hotels";
import { Destinations } from "./Destinations";
import { Bookings } from "./Bookings";
import { AdminUsers } from "./Users";
import { CMS } from "./CMS";
import { Inquiries } from "./Inquiries";
import { Mail } from "lucide-react";

export const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");
export const ADMIN_KEY = "admin2024";

const ADMIN_CREDENTIALS = [
  { email: "paigam785@gmail.com", password: "Shaikh@3786" },
  { email: "admin@sinternational.com", password: "admin2024" },
];

type Section = "dashboard" | "packages" | "hotels" | "destinations" | "bookings" | "users" | "inquiries" | "cms";

const NAV_ITEMS: { id: Section; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "packages", label: "Packages", icon: Package },
  { id: "hotels", label: "Hotels", icon: Building2 },
  { id: "destinations", label: "Destinations", icon: Map },
  { id: "bookings", label: "Bookings", icon: BookOpen },
  { id: "users", label: "Users", icon: Users },
  { id: "inquiries", label: "Inquiries", icon: Mail },
  { id: "cms", label: "Website CMS", icon: Settings },
];

export function Admin() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [section, setSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = () => {
    const ok = ADMIN_CREDENTIALS.some(c => c.email === email && c.password === password);
    if (ok) {
      setAuthed(true);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">S International Travel</p>
          </div>
          <div className="space-y-3">
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Admin email"
              className={`h-12 ${loginError ? "border-red-400" : ""}`}
            />
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Password"
              className={`h-12 ${loginError ? "border-red-400" : ""}`}
            />
            <AnimatePresence>
              {loginError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-red-500 text-sm text-center">
                  Invalid credentials. Please try again.
                </motion.p>
              )}
            </AnimatePresence>
            <Button onClick={handleLogin} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold">
              Sign In to Admin Panel
            </Button>
          </div>
          <p className="text-center text-xs text-slate-400 mt-6">Authorized personnel only</p>
        </motion.div>
      </div>
    );
  }

  const activeNav = NAV_ITEMS.find(n => n.id === section);

  return (
    <div className={`min-h-screen flex ${darkMode ? "dark bg-slate-900" : "bg-slate-100"}`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-30 flex flex-col
        bg-slate-900 text-white shadow-2xl
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-white rotate-45" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">S International</p>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setSection(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setAuthed(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className={`sticky top-0 z-10 flex items-center gap-4 px-6 py-4 border-b ${
          darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
        } shadow-sm`}>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h1 className="font-bold text-lg">{activeNav?.label}</h1>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              S International Travel Admin
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? "text-yellow-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className={`text-right hidden sm:block`}>
              <p className="text-sm font-semibold">{email}</p>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Administrator</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 p-6 ${darkMode ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {section === "dashboard" && <Dashboard darkMode={darkMode} />}
              {section === "packages" && <Packages darkMode={darkMode} />}
              {section === "hotels" && <Hotels darkMode={darkMode} />}
              {section === "destinations" && <Destinations darkMode={darkMode} />}
              {section === "bookings" && <Bookings darkMode={darkMode} />}
              {section === "users" && <AdminUsers darkMode={darkMode} />}
              {section === "inquiries" && <Inquiries darkMode={darkMode} />}
              {section === "cms" && <CMS darkMode={darkMode} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
