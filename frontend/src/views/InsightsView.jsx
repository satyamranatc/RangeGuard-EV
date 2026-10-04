import React from "react";
import { Zap, TrendingUp, Sparkles, Building2, BatteryCharging } from "lucide-react";
import { INSIGHTS_DATA } from "../data/evData";

export default function InsightsView() {
  const { totalStations, totalStates, totalCities, stateDistribution, operatorBreakdown, connectorBreakdown } =
    INSIGHTS_DATA;

  return (
    <div className="space-y-16 py-6 sm:py-10 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* ── 1. CONFIDENT EDITORIAL HEADLINE ── */}
      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Infrastructure Intelligence
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight">
          Charging infrastructure.
        </h1>
        <div className="flex flex-wrap items-baseline gap-2 text-2xl sm:text-3xl font-bold text-zinc-800 font-mono">
          <span className="text-zinc-950 font-extrabold">{totalStations.toLocaleString()}</span>
          <span>verified stations</span>
          <span className="text-zinc-400 font-normal">across {totalStates} states</span>
        </div>
      </div>

      {/* ── 2. PRIMARY VISUALIZATION: STATIONS BY STATE ── */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight">
              Stations by Territory
            </h2>
            <p className="text-xs text-zinc-500">
              Concentration of verified public charging hubs across major states
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400">Normalized Index</span>
        </div>

        {/* Clean, Restrained Horizontal Bar Chart */}
        <div className="space-y-4 pt-2">
          {stateDistribution.map((s) => (
            <div key={s.state} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800">{s.state}</span>
                <span className="font-mono font-bold text-zinc-900">{s.stations}</span>
              </div>
              <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-900 rounded-full transition-all duration-500 hover:bg-emerald-600"
                  style={{ width: `${s.pct}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Editorial "What We're Seeing" Narrative Block */}
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/60 space-y-2 mt-6">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>What we're seeing</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Maharashtra and Delhi currently host the highest absolute number of public stations in the dataset due to early EV policy incentives. However, rapidly electrifying Tier-2 corridors—such as Madhya Pradesh (Indore-Bhopal corridor) and Gujarat—are exhibiting faster relative deployment of high-power DC fast chargers (≥60 kW) per installed site.
          </p>
        </div>
      </div>

      {/* ── 3. SECONDARY STORY: POWER ARCHITECTURE & OPERATOR SHARE ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Power Delivery: AC vs DC */}
        <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                  Power Delivery Architecture
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">Split</span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-3xl font-extrabold text-zinc-950 font-mono">52.4%</span>
                <span className="text-xs text-zinc-500 block">DC Fast Charging</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-zinc-600 font-mono">47.6%</span>
                <span className="text-xs text-zinc-400 block">AC Standard</span>
              </div>
            </div>

            {/* Split Visual Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-zinc-100">
              <div className="h-full bg-emerald-600" style={{ width: "52.4%" }}></div>
              <div className="h-full bg-zinc-300" style={{ width: "47.6%" }}></div>
            </div>

            {/* Connector Types */}
            <div className="space-y-2 pt-2 border-t border-zinc-100 text-xs">
              <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px] block">
                Standard Ports
              </span>
              {connectorBreakdown.map((c) => (
                <div key={c.type} className="flex items-center justify-between py-1">
                  <span className="text-zinc-700 font-medium">{c.type}</span>
                  <span className="font-mono text-zinc-900 font-semibold">{c.share}%</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 pt-3 border-t border-zinc-100">
            CCS2 has consolidated as the standard protocol for commercial 4W charging across India.
          </p>
        </div>

        {/* Operator Network Share */}
        <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-zinc-700" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                  Charge Point Operators (CPOs)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">Market Share</span>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              {operatorBreakdown.map((op) => (
                <div key={op.operator} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-800 font-semibold">{op.operator}</span>
                    <span className="font-mono text-zinc-900 font-bold">{op.share}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-800 rounded-full"
                      style={{ width: `${(op.share / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs flex items-center justify-between">
            <span className="text-zinc-500">Average Commercial Tariff</span>
            <span className="font-mono font-bold text-zinc-900">₹18.65 / kWh</span>
          </div>
        </div>
      </div>
    </div>
  );
}
