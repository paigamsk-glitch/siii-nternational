import { useState, useEffect, useCallback } from "react";
import {
  Star, Trash2, RefreshCw, Search, ShieldCheck, ShieldOff, Loader2,
  ChevronDown, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL, ADMIN_KEY } from "./index";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AdminReview {
  id: string;
  packageId: string;
  packageTitle: string;
  packageSlug: string;
  reviewerName: string;
  reviewerCity: string;
  rating: number;
  title: string;
  body: string;
  travelMonth: string;
  helpfulCount: number;
  isVerified: number;
  createdAt: string;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={cn("w-3.5 h-3.5", s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
      ))}
    </div>
  );
}

export function AdminReviews({ darkMode }: { darkMode: boolean }) {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [filterPkg, setFilterPkg] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const card = darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800";
  const muted = darkMode ? "text-slate-400" : "text-slate-500";
  const inputCls = darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" : "";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${BASE_URL}/api/admin/reviews`, {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      const data = await r.json();
      setReviews(data.reviews || []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await fetch(`${BASE_URL}/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": ADMIN_KEY },
      });
      setReviews(prev => prev.filter(r => r.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVerified = async (review: AdminReview) => {
    setTogglingId(review.id);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/reviews/${review.id}/verified`, {
        method: "PATCH",
        headers: { "x-admin-key": ADMIN_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: review.isVerified === 1 ? 0 : 1 }),
      });
      const data = await res.json();
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, isVerified: data.isVerified } : r));
    } finally {
      setTogglingId(null);
    }
  };

  const packages = Array.from(new Set(reviews.map(r => r.packageSlug)))
    .map(slug => ({ slug, title: reviews.find(r => r.packageSlug === slug)!.packageTitle }));

  const filtered = reviews.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.reviewerName.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.body.toLowerCase().includes(q) || r.packageTitle.toLowerCase().includes(q);
    const matchRating = filterRating === "all" || Math.round(r.rating) === filterRating;
    const matchPkg = filterPkg === "all" || r.packageSlug === filterPkg;
    return matchSearch && matchRating && matchPkg;
  });

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";
  const verifiedCount = reviews.filter(r => r.isVerified === 1).length;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Reviews", value: reviews.length, color: "text-blue-600" },
          { label: "Avg Rating", value: avgRating, color: "text-amber-500" },
          { label: "Verified", value: verifiedCount, color: "text-emerald-600" },
          { label: "Unverified", value: reviews.length - verifiedCount, color: "text-slate-400" },
        ].map(s => (
          <div key={s.label} className={cn("border rounded-xl p-4", card)}>
            <p className={cn("text-xs font-medium mb-1", muted)}>{s.label}</p>
            <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={cn("border rounded-xl p-4 flex flex-wrap gap-3 items-center", card)}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reviews…"
            className={cn("pl-9", inputCls)}
          />
        </div>

        <select
          value={filterPkg}
          onChange={e => setFilterPkg(e.target.value)}
          className={cn("h-10 rounded-lg border px-3 text-sm", darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-700")}
        >
          <option value="all">All Packages</option>
          {packages.map(p => (
            <option key={p.slug} value={p.slug}>{p.title}</option>
          ))}
        </select>

        <select
          value={filterRating}
          onChange={e => setFilterRating(e.target.value === "all" ? "all" : Number(e.target.value))}
          className={cn("h-10 rounded-lg border px-3 text-sm", darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-700")}
        >
          <option value="all">All Ratings</option>
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n !== 1 ? "s" : ""}</option>)}
        </select>

        <Button variant="outline" size="sm" onClick={load} disabled={loading} className={darkMode ? "border-slate-600 text-slate-300 hover:bg-slate-700" : ""}>
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
        </Button>

        <span className={cn("text-sm ml-auto", muted)}>
          {filtered.length} of {reviews.length}
        </span>
      </div>

      {/* Review list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className={cn("border rounded-xl text-center py-16", card)}>
          <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className={muted}>No reviews match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.map(review => {
              const isExpanded = expandedId === review.id;
              const initials = review.reviewerName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
              const colors = ["bg-blue-100 text-blue-700","bg-emerald-100 text-emerald-700","bg-violet-100 text-violet-700","bg-orange-100 text-orange-700","bg-rose-100 text-rose-700","bg-teal-100 text-teal-700"];
              const avatarColor = colors[review.reviewerName.charCodeAt(0) % colors.length];
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className={cn("border rounded-xl overflow-hidden", card)}
                >
                  {/* Main row */}
                  <div className="flex items-start gap-4 p-4">
                    {/* Avatar */}
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5", avatarColor)}>
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{review.reviewerName}</span>
                        <span className={cn("text-xs", muted)}>{review.reviewerCity}</span>
                        <span className={cn("text-xs", muted)}>·</span>
                        <span className={cn("text-xs", muted)}>{review.travelMonth}</span>
                        {review.isVerified === 1 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                            <ShieldCheck className="w-2.5 h-2.5" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-full">
                            <ShieldOff className="w-2.5 h-2.5" /> Unverified
                          </span>
                        )}
                        <span className={cn("ml-auto text-xs px-2 py-0.5 rounded-full font-medium", darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600")}>
                          {review.packageTitle}
                        </span>
                      </div>

                      <StarRow rating={review.rating} />

                      <p className="font-semibold text-sm mt-1.5">{review.title}</p>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className={cn("text-sm mt-1 leading-relaxed overflow-hidden", muted)}
                          >
                            {review.body}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      {!isExpanded && (
                        <p className={cn("text-sm mt-1 truncate", muted)}>{review.body}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : review.id)}
                        className={cn("p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1", darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500")}
                        title={isExpanded ? "Collapse" : "Expand"}
                      >
                        <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                      </button>

                      <button
                        onClick={() => handleToggleVerified(review)}
                        disabled={togglingId === review.id}
                        title={review.isVerified === 1 ? "Unmark verified" : "Mark verified"}
                        className={cn("p-1.5 rounded-lg transition-colors", review.isVerified === 1
                          ? "text-emerald-600 hover:bg-emerald-50"
                          : (darkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-400 hover:bg-slate-100")
                        )}
                      >
                        {togglingId === review.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : review.isVerified === 1
                            ? <ShieldCheck className="w-4 h-4" />
                            : <ShieldOff className="w-4 h-4" />
                        }
                      </button>

                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                        title="Delete review"
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        {deletingId === review.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </div>

                  {/* Footer bar */}
                  <div className={cn("px-4 py-2 border-t flex items-center gap-3 text-xs", darkMode ? "border-slate-700 text-slate-400" : "border-slate-100 text-slate-400")}>
                    <span>{review.helpfulCount} found helpful</span>
                    <span>·</span>
                    <span>Posted {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span className={cn("ml-auto font-medium", review.rating >= 4 ? "text-emerald-500" : review.rating >= 3 ? "text-amber-500" : "text-red-400")}>
                      {review.rating}/5 ★
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
