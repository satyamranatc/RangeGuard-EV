import React, { useState } from "react";
import { ChevronDown, Info, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { MUNICIPAL_COVERAGE } from "../data/evData";

export default function CoverageView() {
  const [showMethodology, setShowMethodology] = useState(false);

  // Group cities by tier
  const strongCities = MUNICIPAL_COVERAGE.filter((c) => c.tierType === "strong");
  const developingCities = MUNICIPAL_COVERAGE.filter((c) => c.tierType === "developing");
  const limitedCities = MUNICIPAL_COVERAGE.filter((c) => c.tierType === "limited");

  return (
    <div className="space-y-12 py-6 sm:py-10 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* ── 1. HEADER ── */}
      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Spatial Benchmarking
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight">
          Charging coverage.
        </h1>
        <p className="text-base sm:text-lg text-zinc-500 max-w-2xl">
          How well connected are India's cities? We evaluate infrastructure readiness based on spatial density and DC fast readiness rather than deceptive raw station counts.
        </p>
      </div>

      {/* ── 2. THREE HUMAN COVERAGE TIERS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Strong Coverage */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Strong Coverage
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {strongCities.length} Cities
              </span>
            </div>

            <h3 className="text-lg font-bold text-zinc-950">
              Mature Transit Grids
            </h3>

            <p className="text-xs text-zinc-500 leading-relaxed">
              Cities with high charger density, high proportion of DC fast chargers, and short inter-station distances.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {strongCities.map((c) => (
                <span
                  key={c.city}
                  className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-medium"
                >
                  {c.city}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-zinc-400 block">Density Avg</span>
              <span className="font-mono font-bold text-zinc-900">48.2 / 100km²</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">Mean Spacing</span>
              <span className="font-mono font-bold text-emerald-700">&lt; 2.1 km</span>
            </div>
          </div>
        </div>

        {/* Developing Coverage */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Developing
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {developingCities.length} Cities
              </span>
            </div>

            <h3 className="text-lg font-bold text-zinc-950">
              Expanding Corridors
            </h3>

            <p className="text-xs text-zinc-500 leading-relaxed">
              Moderate charging availability with growing expressway connections and public-private transit hubs.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {developingCities.map((c) => (
                <span
                  key={c.city}
                  className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-medium"
                >
                  {c.city}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-zinc-400 block">Density Avg</span>
              <span className="font-mono font-bold text-zinc-900">18.4 / 100km²</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">Mean Spacing</span>
              <span className="font-mono font-bold text-amber-700">~3.6 km</span>
            </div>
          </div>
        </div>

        {/* Limited Coverage */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                  Limited Coverage
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {limitedCities.length} Cities
              </span>
            </div>

            <h3 className="text-lg font-bold text-zinc-950">
              Early Infrastructure
            </h3>

            <p className="text-xs text-zinc-500 leading-relaxed">
              Emerging network with wider inter-station gaps, requiring drivers to plan charging stops carefully.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {limitedCities.map((c) => (
                <span
                  key={c.city}
                  className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-medium"
                >
                  {c.city}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-zinc-400 block">Density Avg</span>
              <span className="font-mono font-bold text-zinc-900">7.6 / 100km²</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">Mean Spacing</span>
              <span className="font-mono font-bold text-zinc-600">&gt; 5.8 km</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. CITY COMPARISON MATRIX TABLE ── */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-zinc-950 tracking-tight">
              Standardized Municipal Indicators
            </h2>
            <p className="text-xs text-zinc-500">
              Comparative data normalized by municipal surface area and fast-charging proportions.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Silhouette Score: 0.5524
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-semibold border-b border-zinc-100">
              <tr>
                <th className="py-3 px-5">City & State</th>
                <th className="py-3 px-4">Municipal Area</th>
                <th className="py-3 px-4">Total Stations</th>
                <th className="py-3 px-4">Stations / 100 km²</th>
                <th className="py-3 px-4">DC Fast Ratio</th>
                <th className="py-3 px-4">Avg Spacing</th>
                <th className="py-3 px-5 text-right">Readiness Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {MUNICIPAL_COVERAGE.map((c) => (
                <tr key={c.city} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-zinc-900">
                    {c.city} <span className="text-zinc-400 font-normal">({c.state})</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-600">{c.areaSqKm} km²</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-zinc-900">{c.stations}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-950">{c.densityPer100SqKm.toFixed(1)}</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-700">{(c.dcRatio * 100).toFixed(0)}%</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-700">{c.avgDistKm} km</td>
                  <td className="py-3.5 px-5 text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        c.tierType === "strong"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : c.tierType === "developing"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-zinc-100 text-zinc-700 border-zinc-200"
                      }`}
                    >
                      {c.clusterTier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. PROGRESSIVE DISCLOSURE: HOW THIS WAS CALCULATED ── */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="space-y-0.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Methodology & Defense
            </span>
            <h3 className="text-base font-bold text-zinc-950 group-hover:text-emerald-700 transition-colors">
              How was this calculated?
            </h3>
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-zinc-200 flex items-center justify-center transition-colors">
            <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform duration-200 ${showMethodology ? "rotate-180" : ""}`} />
          </div>
        </button>

        {showMethodology && (
          <div className="pt-4 border-t border-zinc-100 space-y-5 text-xs text-zinc-600 animate-in fade-in duration-200">
            <div className="space-y-2">
              <h4 className="font-bold text-zinc-900">
                Unsupervised K-Means Clustering Algorithm (k = 3)
              </h4>
              <p className="leading-relaxed">
                We grouped municipal territories based on charging-infrastructure indicators using K-Means clustering. Rather than grouping by simple raw counts, the algorithm optimizes cluster centroids across normalized spatial feature vectors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                <span className="font-bold text-zinc-900 block">1. Spatial Density</span>
                <span className="text-zinc-500">
                  Stations per 100 km² to eliminate distortion from sheer city land area.
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                <span className="font-bold text-zinc-900 block">2. Fast-Charging Ratio</span>
                <span className="text-zinc-500">
                  Proportion of DC fast chargers (≥50 kW) vs slow AC residential sockets.
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                <span className="font-bold text-zinc-900 block">3. Mean Geodesic Gap</span>
                <span className="text-zinc-500">
                  Average distance to the nearest operational neighbor station in km.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Academic Defense: Why Raw Station Counts Distort Evaluation</span>
              </div>
              <p className="leading-relaxed text-emerald-900/90 text-[11px]">
                A mega-city like Delhi naturally records over 600 stations simply due to its vast 1,484 km² administrative boundary. However, on density and mean spacing, cities like Indore (13.96/100 km², 49% DC ratio) demonstrate that Tier-2 cities can offer comparable corridor access within their urban cores despite having fewer total aggregate chargers.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
