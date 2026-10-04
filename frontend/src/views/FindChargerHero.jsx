import React, { useState } from "react";
import {
  MapPin,
  Car,
  Zap,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Compass,
  ChevronDown,
  Navigation,
  Sliders
} from "lucide-react";
import BatteryRangeSlider from "../components/BatteryRangeSlider";
import StationCard from "../components/StationCard";
import { LOCATION_PRESETS, VEHICLE_PRESETS } from "../data/evData";

export default function FindChargerHero({
  batteryPct,
  onChangeBattery,
  fullRangeKm,
  onChangeFullRange,
  selectedVehiclePreset,
  onChangeVehiclePreset,
  remainingRangeKm,
  safeRangeKm,
  safetyFactor,
  onChangeSafetyFactor,
  userLocationName,
  onChangeLocationPreset,
  onDetectGps,
  isGpsLoading,
  reachableStations = [],
  onNavigateToExplore,
  onOpenStationDetails
}) {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Top 2 recommended closest operational stations for hero preview
  const topRecommendations = reachableStations.slice(0, 2);

  return (
    <div className="space-y-16 py-6 sm:py-12 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* ── 1. CONFIDENT HERO TITLE & CONTEXT ── */}
      <div className="text-center space-y-4 max-w-2xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
          <span>RangeGuard-EV Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-950 tracking-tight leading-[1.08]">
          Find a charger.
        </h1>

        <p className="text-base sm:text-xl text-zinc-500 font-normal leading-relaxed">
          Enter your current battery level to immediately see charging stations you can safely reach.
        </p>
      </div>

      {/* ── 2. PRIMARY CHARGING INTELLIGENCE CONSOLE ── */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Core Battery & Range Interactive Slider */}
        <BatteryRangeSlider
          batteryPct={batteryPct}
          onChangeBattery={onChangeBattery}
          fullRangeKm={fullRangeKm}
          remainingRangeKm={remainingRangeKm}
          safeRangeKm={safeRangeKm}
          safetyFactor={safetyFactor}
          onChangeSafetyFactor={onChangeSafetyFactor}
          reachableCount={reachableStations.length}
        />

        {/* Location & Vehicle Selectors Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-100 text-xs">
          {/* Origin Location Selector */}
          <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Current Origin
              </span>
              <button
                onClick={onDetectGps}
                disabled={isGpsLoading}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isGpsLoading ? "animate-spin text-emerald-600" : ""}`} />
                <span>{isGpsLoading ? "Locating..." : "Use Live GPS"}</span>
              </button>
            </div>

            <div className="relative">
              <select
                value={userLocationName}
                onChange={(e) => {
                  const match = LOCATION_PRESETS.find((l) => l.name === e.target.value);
                  if (match) onChangeLocationPreset(match);
                }}
                className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 text-zinc-900 font-medium text-xs appearance-none pr-8 focus:outline-none focus:border-zinc-400"
              >
                {LOCATION_PRESETS.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name} ({loc.city})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Vehicle Model Selector */}
          <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-zinc-700" />
                Vehicle Profile
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {fullRangeKm} km rated
              </span>
            </div>

            <div className="relative">
              <select
                value={selectedVehiclePreset}
                onChange={(e) => {
                  const name = e.target.value;
                  const match = VEHICLE_PRESETS.find((v) => v.name === name);
                  if (match) {
                    onChangeVehiclePreset(match.name);
                    onChangeFullRange(match.fullRangeKm);
                  }
                }}
                className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 text-zinc-900 font-medium text-xs appearance-none pr-8 focus:outline-none focus:border-zinc-400"
              >
                {VEHICLE_PRESETS.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} — {v.fullRangeKm} km ({v.badge})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            onClick={onNavigateToExplore}
            className="w-full py-4 px-6 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
          >
            <span>Explore {reachableStations.length} Reachable Stations on Map</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* ── 3. RECOMMENDED STATIONS PREVIEW ── */}
      {topRecommendations.length > 0 && (
        <div className="space-y-4 px-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
                Recommended Nearest Fast Chargers
              </h2>
              <p className="text-xs text-zinc-500">
                Operational stations within your safe operating radius ({safeRangeKm} km)
              </p>
            </div>

            <button
              onClick={onNavigateToExplore}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
            >
              <span>View all {reachableStations.length}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topRecommendations.map((st) => (
              <StationCard
                key={st.stationId}
                station={st}
                onSelect={() => onOpenStationDetails(st)}
                onOpenDetails={() => onOpenStationDetails(st)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── 4. PRODUCT PILLARS & TRANSPARENCY ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-zinc-200/80 text-xs">
        <div className="space-y-1.5 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/60">
          <div className="flex items-center gap-2 text-zinc-900 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Conservative Buffer (α)</span>
          </div>
          <p className="text-zinc-500 leading-relaxed">
            Calculates reachability at 80% effective range to account for highway drag, HVAC load, and traffic.
          </p>
        </div>

        <div className="space-y-1.5 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/60">
          <div className="flex items-center gap-2 text-zinc-900 font-bold">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Haversine Geodesy</span>
          </div>
          <p className="text-zinc-500 leading-relaxed">
            Computes great-circle distances between GPS coordinates with spherical trigonometry.
          </p>
        </div>

        <div className="space-y-1.5 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/60">
          <div className="flex items-center gap-2 text-zinc-900 font-bold">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>Multi-CPO Registry</span>
          </div>
          <p className="text-zinc-500 leading-relaxed">
            Aggregates Tata Power, Jio-bp pulse, Statiq, and municipal smart city bays into one index.
          </p>
        </div>
      </div>
    </div>
  );
}
