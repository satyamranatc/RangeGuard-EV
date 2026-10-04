import React, { useState } from "react";
import {
  Filter,
  Sliders,
  Search,
  Zap,
  MapPin,
  ChevronDown,
  X,
  AlertTriangle,
  Check,
  Navigation
} from "lucide-react";
import MapView from "../components/MapView";
import StationCard from "../components/StationCard";
import BatteryRangeSlider from "../components/BatteryRangeSlider";

export default function ExploreMap({
  userLat,
  userLon,
  batteryPct,
  onChangeBattery,
  fullRangeKm,
  remainingRangeKm,
  safeRangeKm,
  safetyFactor,
  allStations = [],
  recommendedStations = [],
  excludedNonOperational = [],
  selectedStation,
  onSelectStation,
  onOpenStationDetails,
  filterFastOnly,
  onToggleFastOnly,
  filterOperator,
  onChangeFilterOperator,
  filterCity,
  onChangeFilterCity,
  searchQuery,
  onChangeSearchQuery
}) {
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showBatteryControls, setShowBatteryControls] = useState(false); // Collapsed by default on mobile for clean map view
  const [mobileView, setMobileView] = useState("map"); // 'map' | 'list' on phones

  // Available unique operators and cities
  const operators = ["All", ...new Set(allStations.map((s) => s.operator))];
  const cities = ["All", ...new Set(allStations.map((s) => s.city))];

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] md:h-[calc(100vh-5.5rem)] min-h-[500px] flex flex-col lg:flex-row overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200/80 bg-zinc-100 shadow-sm animate-in fade-in duration-300">
      {/* ── MOBILE VIEW TOGGLE (MAP VS LIST) ── */}
      <div className="lg:hidden absolute top-3 left-1/2 -translate-x-1/2 z-[410] bg-white/95 backdrop-blur-md p-1 rounded-full border border-zinc-200 shadow-md flex items-center gap-1">
        <button
          onClick={() => setMobileView("map")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            mobileView === "map"
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setMobileView("list")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            mobileView === "list"
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          Stations ({recommendedStations.length})
        </button>
      </div>

      {/* ── 1. MAIN INTERACTIVE MAP CANVAS ── */}
      <div className={`relative flex-1 w-full h-full min-h-[300px] order-1 ${mobileView === "list" ? "hidden lg:block" : "block"}`}>
        <MapView
          userLat={userLat}
          userLon={userLon}
          safeRangeKm={safeRangeKm}
          stations={allStations}
          selectedStation={selectedStation}
          onSelectStation={(st) => {
            onSelectStation(st);
            if (mobileView === "map") {
              onOpenStationDetails(st);
            }
          }}
          className="w-full h-full"
        />

        {/* Floating Top Control Bar Over Map */}
        <div className="absolute top-14 lg:top-4 left-3 right-3 lg:left-4 lg:right-4 z-[400] flex items-center justify-between pointer-events-none">
          {/* Left: Battery & Range Live Indicator */}
          <div className="pointer-events-auto">
            <button
              onClick={() => setShowBatteryControls(!showBatteryControls)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-zinc-200/90 text-[11px] sm:text-xs font-medium text-zinc-900 shadow-md hover:bg-white transition-all active:scale-95"
            >
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                <strong>{safeRangeKm} km</strong> Safe ({batteryPct}%)
              </span>
              <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 transition-transform ${showBatteryControls ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Right: Floating Filter Button */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => setShowFilterSheet(!showFilterSheet)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl backdrop-blur-md border text-xs font-semibold shadow-md transition-all active:scale-95 ${
                filterFastOnly || filterOperator !== "All" || filterCity !== "All"
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white/95 text-zinc-800 border-zinc-200/90 hover:bg-white"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(filterFastOnly || filterOperator !== "All" || filterCity !== "All") && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              )}
            </button>
          </div>
        </div>

        {/* Floating Battery Range Popover */}
        {showBatteryControls && (
          <div className="absolute top-16 left-4 z-[400] w-80 max-w-[calc(100vw-2rem)]">
            <BatteryRangeSlider
              compact={true}
              batteryPct={batteryPct}
              onChangeBattery={onChangeBattery}
              fullRangeKm={fullRangeKm}
              remainingRangeKm={remainingRangeKm}
              safeRangeKm={safeRangeKm}
              reachableCount={recommendedStations.length}
            />
          </div>
        )}

        {/* Floating Filter Sheet */}
        {showFilterSheet && (
          <div className="absolute top-16 right-4 z-[400] w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 p-5 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Filter Stations
              </span>
              <button
                onClick={() => setShowFilterSheet(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Fast Charging Only Toggle */}
            <label className="flex items-center justify-between cursor-pointer py-1 text-xs">
              <span className="text-zinc-700 font-medium">DC Fast Chargers Only (≥50 kW)</span>
              <input
                type="checkbox"
                checked={filterFastOnly}
                onChange={(e) => onToggleFastOnly(e.target.checked)}
                className="w-4 h-4 accent-zinc-900 rounded cursor-pointer"
              />
            </label>

            {/* Operator Filter */}
            <div className="space-y-1 text-xs">
              <label className="text-zinc-500 font-medium">Operator Network</label>
              <select
                value={filterOperator}
                onChange={(e) => onChangeFilterOperator(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-zinc-800 text-xs"
              >
                {operators.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div className="space-y-1 text-xs">
              <label className="text-zinc-500 font-medium">Municipal Territory</label>
              <select
                value={filterCity}
                onChange={(e) => onChangeFilterCity(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-zinc-800 text-xs"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                onToggleFastOnly(false);
                onChangeFilterOperator("All");
                onChangeFilterCity("All");
              }}
              className="w-full py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Mobile Floating Bottom Station List CTA */}
        <div className="lg:hidden absolute bottom-4 left-4 right-4 z-[400] flex justify-center pointer-events-none">
          <button
            onClick={() => setMobileView("list")}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-semibold shadow-xl border border-white/20 active:scale-95 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            <span>View {recommendedStations.length} Stations in Range</span>
          </button>
        </div>
      </div>

      {/* ── 2. FLOATING STATIONS CARDS PANEL ── */}
      <div
        className={`w-full lg:w-[420px] h-full bg-white/95 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-zinc-200/80 flex flex-col z-10 order-2 shadow-lg ${
          mobileView === "map" ? "hidden lg:flex" : "flex"
        }`}
      >
        {/* Panel Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-bold text-zinc-950 tracking-tight">
              Reachable Stations
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              {recommendedStations.length} available
            </span>
          </div>

          <p className="text-xs text-zinc-500 leading-normal">
            Stations you can reach safely within <strong className="font-mono text-zinc-900">{safeRangeKm} km</strong>, sorted by geodesic distance.
          </p>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              placeholder="Search by area, mall, or operator..."
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200/80 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400"
            />
          </div>
        </div>

        {/* Scrollable Cards Stack */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {recommendedStations.length === 0 ? (
            <div className="p-8 text-center space-y-3 text-xs text-zinc-500">
              <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto" />
              <div className="font-semibold text-zinc-800">No Operational Stations Within Safe Range</div>
              <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
                Increase your battery state-of-charge slider or adjust the origin location to expand the reachable radius.
              </p>
            </div>
          ) : (
            recommendedStations.map((st) => (
              <StationCard
                key={st.stationId}
                station={st}
                isSelected={selectedStation?.stationId === st.stationId}
                onSelect={() => onSelectStation(st)}
                onOpenDetails={() => onOpenStationDetails(st)}
              />
            ))
          )}

          {/* Excluded Non-Operational Academic Disclosure Drawer */}
          {excludedNonOperational.length > 0 && (
            <div className="mt-4 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  Excluded Non-Operational ({excludedNonOperational.length})
                </span>
                <span className="text-[10px] uppercase font-mono text-zinc-400">Dataset Filter</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-tight">
                Stations within range whose ground-truth dataset status is non-operational are excluded from active recommendations.
              </p>
              {excludedNonOperational.map((ex) => (
                <div key={ex.stationId} className="p-2 bg-white rounded-xl border border-zinc-200/60 text-[11px]">
                  <div className="font-medium text-zinc-800">{ex.name}</div>
                  <div className="text-zinc-400">{ex.distanceKm} km away • Status: Maintenance</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
