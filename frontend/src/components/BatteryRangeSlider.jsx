import React from "react";
import { Battery, Zap, Sliders, Shield } from "lucide-react";

export default function BatteryRangeSlider({
  batteryPct,
  onChangeBattery,
  fullRangeKm,
  remainingRangeKm,
  safeRangeKm,
  safetyFactor = 0.8,
  onChangeSafetyFactor,
  reachableCount = 0,
  compact = false
}) {
  // Preset percentages for quick examiner simulation
  const presets = [
    { label: "10% Critical", val: 10 },
    { label: "25% Low", val: 25 },
    { label: "50% Half", val: 50 },
    { label: "80% Trip", val: 80 },
    { label: "100% Full", val: 100 }
  ];

  const getStatusColor = () => {
    if (batteryPct <= 15) return "text-red-600 bg-red-50 border-red-200";
    if (batteryPct <= 30) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-emerald-700 bg-emerald-50 border-emerald-200";
  };

  const getBatteryFillColor = () => {
    if (batteryPct <= 15) return "bg-red-500";
    if (batteryPct <= 30) return "bg-amber-500";
    return "bg-emerald-500";
  };

  // Calculate percentage fill for track gradient
  const minVal = 2;
  const maxVal = 100;
  const fillPct = Math.min(100, Math.max(0, ((batteryPct - minVal) / (maxVal - minVal)) * 100));

  const getTrackFillColor = () => {
    if (batteryPct <= 15) return "#EF4444"; // Red for critical
    if (batteryPct <= 30) return "#F59E0B"; // Amber for low
    return "#00A86B"; // Apple Electric Emerald Green
  };

  const trackStyle = {
    background: `linear-gradient(to right, ${getTrackFillColor()} 0%, ${getTrackFillColor()} ${fillPct}%, #E5E5EA ${fillPct}%, #E5E5EA 100%)`
  };

  if (compact) {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`px-2 py-0.5 rounded-full border text-xs font-mono font-bold ${getStatusColor()}`}>
              {batteryPct}%
            </div>
            <span className="text-xs text-zinc-500 font-medium">State of Charge</span>
          </div>
          <div className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-emerald-600" />
            <span>{reachableCount} reachable</span>
          </div>
        </div>

        <div className="py-1">
          <input
            type="range"
            min="2"
            max="100"
            step="1"
            value={batteryPct}
            onChange={(e) => onChangeBattery(Number(e.target.value))}
            className="apple-slider"
            style={trackStyle}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>Safe Range: <strong className="font-mono text-zinc-900 font-semibold">{safeRangeKm} km</strong></span>
          <span className="font-mono text-zinc-400">Total: {remainingRangeKm} km</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Top Header & Range Readout */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
            Battery & Reachable Range
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 font-mono">
              {safeRangeKm}
            </span>
            <span className="text-lg font-medium text-zinc-500">km safe range</span>
            <span className="text-xs text-zinc-400 font-mono">({remainingRangeKm} km rated)</span>
          </div>
        </div>

        {/* Live Reachable Counter Pill */}
        <div className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold">
            {reachableCount} {reachableCount === 1 ? "station" : "stations"} reachable
          </span>
        </div>
      </div>

      {/* Battery Percentage Display & Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 rounded-sm border border-zinc-400 p-0.5 flex items-center relative">
              <div
                className={`h-full rounded-2xs transition-all duration-200 ${getBatteryFillColor()}`}
                style={{ width: `${Math.max(8, batteryPct)}%` }}
              ></div>
              <div className="w-0.5 h-1.5 bg-zinc-400 rounded-r-xs absolute -right-1 top-0.5"></div>
            </div>
            <span className="text-sm font-semibold text-zinc-900 font-mono">{batteryPct}%</span>
            <span className="text-xs text-zinc-500">battery level</span>
          </div>

          <span className="text-xs text-zinc-400 font-mono">
            {fullRangeKm} km full capacity
          </span>
        </div>

        {/* Slider Input with Apple styling & dynamic track gradient */}
        <div className="py-1">
          <input
            type="range"
            min="2"
            max="100"
            step="1"
            value={batteryPct}
            onChange={(e) => onChangeBattery(Number(e.target.value))}
            className="apple-slider"
            style={trackStyle}
          />
        </div>

        {/* Clean Tick Indicators */}
        <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono px-0.5">
          <span>2% Critical</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100% Full</span>
        </div>
      </div>

      {/* Quick Test Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-100">
        <span className="text-[11px] font-medium text-zinc-400 mr-1">Presets:</span>
        {presets.map((p) => (
          <button
            key={p.val}
            onClick={() => onChangeBattery(p.val)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              batteryPct === p.val
                ? "bg-zinc-900 text-white shadow-2xs"
                : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100 border border-zinc-200/60"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Safety Buffer Setting (Progressive Disclosure) */}
      {onChangeSafetyFactor && (
        <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-zinc-400" />
            <span>
              Conservative Safety Margin (α):{" "}
              <strong className="text-zinc-800 font-mono">{(safetyFactor * 100).toFixed(0)}%</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeSafetyFactor(0.7)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                safetyFactor === 0.7 ? "bg-zinc-800 text-white border-zinc-800" : "border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              70% High Buffer
            </button>
            <button
              onClick={() => onChangeSafetyFactor(0.8)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                safetyFactor === 0.8 ? "bg-zinc-800 text-white border-zinc-800" : "border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              80% Standard
            </button>
            <button
              onClick={() => onChangeSafetyFactor(0.9)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                safetyFactor === 0.9 ? "bg-zinc-800 text-white border-zinc-800" : "border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              90% Mild
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
