import React, { useState } from "react";
import { Search, Database, FileText, CheckCircle2, ShieldAlert, Code, BookOpen, ExternalLink, Navigation } from "lucide-react";
import { STATIONS_REGISTRY } from "../data/evData";

export default function DataView({ onOpenStationDetails }) {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedOperator, setSelectedOperator] = useState("All");

  const cities = ["All", ...new Set(STATIONS_REGISTRY.map((s) => s.city))];
  const operators = ["All", ...new Set(STATIONS_REGISTRY.map((s) => s.operator))];

  const filtered = STATIONS_REGISTRY.filter((st) => {
    if (selectedCity !== "All" && st.city !== selectedCity) return false;
    if (selectedOperator !== "All" && st.operator !== selectedOperator) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        st.name.toLowerCase().includes(q) ||
        st.address.toLowerCase().includes(q) ||
        st.operator.toLowerCase().includes(q) ||
        st.area.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-16 py-6 sm:py-10 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* ── 1. HEADER ── */}
      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Transparency & Methodology
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight">
          Dataset & Pipeline.
        </h1>
        <p className="text-base sm:text-lg text-zinc-500 max-w-2xl">
          Curated ground-truth public EV charging registry with data cleaning protocols, mathematical formulas, and academic defense benchmarks.
        </p>
      </div>

      {/* ── 2. MATHEMATICAL FORMULAS & ARCHITECTURE ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reachability & Safety Margin Formulation */}
        <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
              Reachability Formulation
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 font-mono text-xs space-y-2 text-zinc-800">
            <div>
              <span className="text-zinc-400">// Remaining vehicle range</span>
              <div className="font-bold text-zinc-950">R_rem = FullRange × (SoC / 100)</div>
            </div>
            <div className="pt-1 border-t border-zinc-200/60">
              <span className="text-zinc-400">// Conservative safe operational radius</span>
              <div className="font-bold text-emerald-700">R_safe = R_rem × α</div>
              <span className="text-[10px] text-zinc-500 font-sans block mt-0.5">
                where α = 0.80 default buffer for HVAC, speed drag, and battery degradation.
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            A station is marked candidate reachable if and only if its Haversine geodesic distance $d \le R_{safe}$ AND its recorded dataset status is operational.
          </p>
        </div>

        {/* Haversine Geodesic Formulation */}
        <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-zinc-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
              Geodesic Haversine Formulation
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 font-mono text-xs space-y-2 text-zinc-800">
            <div>
              <span className="text-zinc-400">// Spherical great-circle distance</span>
              <div className="font-bold text-zinc-950">a = sin²(Δφ/2) + cos φ₁ cos φ₂ sin²(Δλ/2)</div>
              <div className="font-bold text-zinc-950">c = 2 · atan2( √a, √(1−a) )</div>
              <div className="font-bold text-emerald-700">d = R · c   (R = 6,371 km)</div>
            </div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            Eliminates planar flat-surface distortion across interstate corridors and preserves mathematical rigor for distance sorting.
          </p>
        </div>
      </div>

      {/* ── 3. DATA CLEANING & ETHICAL TRANSPARENCY ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-50 border border-zinc-200/80 space-y-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm">
          <ShieldAlert className="w-4 h-4 text-zinc-700" />
          <span>Academic Data Governance & Integrity Scope</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-zinc-600">
          <div className="space-y-1">
            <strong className="text-zinc-800 block">1. Operational Filtering</strong>
            <p className="text-[11px] leading-relaxed">
              Stations under maintenance or marked non-operational in the source dataset are strictly excluded from recommendation lists, preventing false availability claims.
            </p>
          </div>

          <div className="space-y-1">
            <strong className="text-zinc-800 block">2. Standardized Connectors</strong>
            <p className="text-[11px] leading-relaxed">
              Legacy port labels were cleaned and standardized into four definitive protocols: CCS2, Type 2 AC, Bharat DC-001, and 15A Domestic Socket.
            </p>
          </div>

          <div className="space-y-1">
            <strong className="text-zinc-800 block">3. Static Dataset Scope</strong>
            <p className="text-[11px] leading-relaxed">
              Transparently discloses that reachability is computed on curated public dataset records without claiming live telemetry or live bay occupancy.
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. VERIFIED STATION REGISTRY TABLE ── */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
              Verified Station Registry
            </h2>
            <p className="text-xs text-zinc-500">
              Ground-truth multi-operator dataset records ({STATIONS_REGISTRY.length} stations)
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search registry..."
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs text-zinc-800 font-medium"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">Operator:</span>
            <select
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs text-zinc-800 font-medium"
            >
              {operators.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-500 font-semibold border-b border-zinc-100">
              <tr>
                <th className="py-3 px-4">Station & Operator</th>
                <th className="py-3 px-3">City / Area</th>
                <th className="py-3 px-3">Power & Ports</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Tariff</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((st) => (
                <tr key={st.stationId} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-zinc-900">{st.name}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{st.operator}</div>
                  </td>
                  <td className="py-3 px-3 text-zinc-600">
                    <div>{st.city}</div>
                    <div className="text-[11px] text-zinc-400">{st.area}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-zinc-900">{st.powerOutput}</span>
                    <span className="text-[11px] text-zinc-400 block font-mono">{st.totalBays} bays</span>
                  </td>
                  <td className="py-3 px-3">
                    {st.status === "operational" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Operational
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-800 border border-red-200">
                        Maintenance
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-700">
                    {st.tariffDc ? `₹${st.tariffDc.toFixed(2)}/kWh` : `₹${st.tariffAc.toFixed(2)}/kWh`}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenStationDetails(st)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-medium transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
