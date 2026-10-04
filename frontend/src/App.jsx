import React, { useState, useMemo } from "react";
import { Zap, Compass, MapPin, BarChart3, Layers, BookOpen, Battery } from "lucide-react";
import {
  STATIONS_REGISTRY,
  LOCATION_PRESETS,
  VEHICLE_PRESETS,
  haversineDistance
} from "./data/evData";

import FindChargerHero from "./views/FindChargerHero";
import ExploreMap from "./views/ExploreMap";
import CoverageView from "./views/CoverageView";
import InsightsView from "./views/InsightsView";
import DataView from "./views/DataView";
import StationDetailModal from "./components/StationDetailModal";

export default function App() {
  // Navigation State: 'find' | 'explore' | 'coverage' | 'insights' | 'data'
  const [activeTab, setActiveTab] = useState("find");

  // ── Core Vehicle & Reachability State ──
  const [selectedVehiclePreset, setSelectedVehiclePreset] = useState("Tata Nexon EV Max (40.5 kWh)");
  const [fullRangeKm, setFullRangeKm] = useState(312);
  const [batteryPct, setBatteryPct] = useState(62); // 62% signature default demonstration
  const [safetyFactor, setSafetyFactor] = useState(0.8); // 80% conservative buffer

  // Origin Geolocation
  const [userLocationName, setUserLocationName] = useState("Indore — Palasia (Center)");
  const [userLat, setUserLat] = useState(22.7196);
  const [userLon, setUserLon] = useState(75.8858);
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  // Directory & Map Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [filterOperator, setFilterOperator] = useState("All");
  const [filterFastOnly, setFilterFastOnly] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [modalStation, setModalStation] = useState(null);

  // ── Mathematical Calculations ──
  const remainingRangeKm = useMemo(() => {
    return Math.round((fullRangeKm * (batteryPct / 100)) * 10) / 10;
  }, [fullRangeKm, batteryPct]);

  const safeRangeKm = useMemo(() => {
    return Math.round((remainingRangeKm * safetyFactor) * 10) / 10;
  }, [remainingRangeKm, safetyFactor]);

  // Evaluate Reachability across all stations
  const { allEnrichedStations, recommendedStations, excludedNonOperational } = useMemo(() => {
    const recommended = [];
    const nonOp = [];
    const enrichedList = [];

    STATIONS_REGISTRY.forEach((st) => {
      const dist = haversineDistance(userLat, userLon, st.latitude, st.longitude);
      const drain = Math.round((dist / fullRangeKm) * 100 * 10) / 10;
      const arrivalBuffer = Math.max(0, Math.round((batteryPct - drain) * 10) / 10);
      const isReachable = dist <= safeRangeKm;

      const enriched = {
        ...st,
        distanceKm: dist,
        batteryDrainPct: drain,
        arrivalBufferPct: arrivalBuffer,
        isReachable
      };

      enrichedList.push(enriched);

      // Filtering criteria
      let matchesFilters = true;
      if (filterCity !== "All" && st.city !== filterCity) matchesFilters = false;
      if (filterOperator !== "All" && st.operator !== filterOperator) matchesFilters = false;
      if (filterFastOnly && st.powerKw < 50) matchesFilters = false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !st.name.toLowerCase().includes(q) &&
          !st.address.toLowerCase().includes(q) &&
          !st.operator.toLowerCase().includes(q) &&
          !st.area.toLowerCase().includes(q)
        ) {
          matchesFilters = false;
        }
      }

      if (matchesFilters) {
        if (st.status !== "operational") {
          if (isReachable) {
            nonOp.push({
              ...enriched,
              reason: "Marked non-operational in dataset (Excluded for safety)"
            });
          }
        } else if (isReachable) {
          recommended.push(enriched);
        }
      }
    });

    recommended.sort((a, b) => a.distanceKm - b.distanceKm);
    nonOp.sort((a, b) => a.distanceKm - b.distanceKm);
    enrichedList.sort((a, b) => a.distanceKm - b.distanceKm);

    return {
      allEnrichedStations: enrichedList,
      recommendedStations: recommended,
      excludedNonOperational: nonOp
    };
  }, [userLat, userLon, fullRangeKm, batteryPct, safeRangeKm, filterCity, filterOperator, filterFastOnly, searchQuery]);

  // Geolocation Handler
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(Math.round(pos.coords.latitude * 10000) / 10000);
        setUserLon(Math.round(pos.coords.longitude * 10000) / 10000);
        setUserLocationName("GPS Detected Location");
        setIsGpsLoading(false);
      },
      (err) => {
        alert("Unable to fetch location: " + err.message);
        setIsGpsLoading(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased selection:bg-zinc-900 selection:text-white flex flex-col">
      {/* ── TOP NAVIGATION BAR (APPLE-STYLE RESTRAINED SEGMENTED TABS) ── */}
      <header className="sticky top-0 z-40 bg-[#F5F5F7]/85 backdrop-blur-xl border-b border-[#E5E5EA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div
            onClick={() => setActiveTab("find")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-zinc-950 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-sm tracking-tight text-zinc-950">RangeGuard-EV</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold">
                  Platform
                </span>
              </div>
              <span className="text-[11px] text-[#6E6E73] font-normal hidden sm:inline">
                Charge Intelligence
              </span>
            </div>
          </div>

          {/* Desktop Segmented Tab Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#EBEBED] p-1 rounded-2xl text-xs font-semibold border border-zinc-200/50">
            <button
              onClick={() => setActiveTab("find")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "find"
                  ? "bg-white text-zinc-950 shadow-xs font-bold"
                  : "text-[#6E6E73] hover:text-zinc-950"
              }`}
            >
              Find Charger
            </button>

            <button
              onClick={() => setActiveTab("explore")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "explore"
                  ? "bg-white text-zinc-950 shadow-xs font-bold"
                  : "text-[#6E6E73] hover:text-zinc-950"
              }`}
            >
              Explore Map
            </button>

            <button
              onClick={() => setActiveTab("coverage")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "coverage"
                  ? "bg-white text-zinc-950 shadow-xs font-bold"
                  : "text-[#6E6E73] hover:text-zinc-950"
              }`}
            >
              Coverage
            </button>

            <button
              onClick={() => setActiveTab("insights")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "insights"
                  ? "bg-white text-zinc-950 shadow-xs font-bold"
                  : "text-[#6E6E73] hover:text-zinc-950"
              }`}
            >
              Insights
            </button>

            <button
              onClick={() => setActiveTab("data")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "data"
                  ? "bg-white text-zinc-950 shadow-xs font-bold"
                  : "text-[#6E6E73] hover:text-zinc-950"
              }`}
            >
              Data
            </button>
          </nav>

          {/* Right Live Battery Pill (Visible on both Mobile & Desktop) */}
          <div
            onClick={() => setActiveTab("find")}
            className="cursor-pointer flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white border border-[#E5E5EA] text-xs font-medium text-zinc-800 shadow-2xs hover:border-zinc-300 transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="font-mono font-semibold">{batteryPct}%</span>
            <span className="text-[#6E6E73]">· {safeRangeKm} km</span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER (Padded for mobile bottom nav) ── */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 pt-3 pb-24 md:py-8">
        {/* VIEW 1: FIND CHARGER HERO */}
        {activeTab === "find" && (
          <FindChargerHero
            batteryPct={batteryPct}
            onChangeBattery={setBatteryPct}
            fullRangeKm={fullRangeKm}
            onChangeFullRange={setFullRangeKm}
            selectedVehiclePreset={selectedVehiclePreset}
            onChangeVehiclePreset={setSelectedVehiclePreset}
            remainingRangeKm={remainingRangeKm}
            safeRangeKm={safeRangeKm}
            safetyFactor={safetyFactor}
            onChangeSafetyFactor={setSafetyFactor}
            userLocationName={userLocationName}
            onChangeLocationPreset={(loc) => {
              setUserLocationName(loc.name);
              setUserLat(loc.lat);
              setUserLon(loc.lon);
            }}
            onDetectGps={handleDetectGps}
            isGpsLoading={isGpsLoading}
            reachableStations={recommendedStations}
            onNavigateToExplore={() => setActiveTab("explore")}
            onOpenStationDetails={(st) => setModalStation(st)}
          />
        )}

        {/* VIEW 2: EXPLORE MAP CANVAS */}
        {activeTab === "explore" && (
          <ExploreMap
            userLat={userLat}
            userLon={userLon}
            batteryPct={batteryPct}
            onChangeBattery={setBatteryPct}
            fullRangeKm={fullRangeKm}
            remainingRangeKm={remainingRangeKm}
            safeRangeKm={safeRangeKm}
            safetyFactor={safetyFactor}
            allStations={allEnrichedStations}
            recommendedStations={recommendedStations}
            excludedNonOperational={excludedNonOperational}
            selectedStation={selectedStation}
            onSelectStation={setSelectedStation}
            onOpenStationDetails={(st) => setModalStation(st)}
            filterFastOnly={filterFastOnly}
            onToggleFastOnly={setFilterFastOnly}
            filterOperator={filterOperator}
            onChangeFilterOperator={setFilterOperator}
            filterCity={filterCity}
            onChangeFilterCity={setFilterCity}
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
          />
        )}

        {/* VIEW 3: K-MEANS COVERAGE BENCHMARKING */}
        {activeTab === "coverage" && <CoverageView />}

        {/* VIEW 4: INFRASTRUCTURE INSIGHTS */}
        {activeTab === "insights" && <InsightsView />}

        {/* VIEW 5: DATASET REGISTRY & METHODOLOGY */}
        {activeTab === "data" && (
          <DataView onOpenStationDetails={(st) => setModalStation(st)} />
        )}
      </main>

      {/* ── FOOTER & DEFENSE ACKNOWLEDGMENT ── */}
      <footer className="border-t border-[#E5E5EA] bg-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4 text-xs text-[#6E6E73]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-950">RangeGuard-EV</span>
              <span>— EV Charging Station Analysis & Reachability Recommendation Platform</span>
            </div>
            <div className="font-mono text-zinc-400">
              B.Tech Minor Project • Academic Defense Edition
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-[#86868B] border-t border-zinc-100 pt-3">
            <strong>Academic Disclosure:</strong> Reachability estimations are calculated using spherical Haversine geodesic trigonometry with conservative safety buffering (α = 0.80) on verified operational public dataset records. In alignment with engineering ethics, the platform does not assume unverified live dynamic telemetry.
          </p>
        </div>
      </footer>

      {/* ── STATION DETAIL SHEET / MODAL ── */}
      {modalStation && (
        <StationDetailModal
          station={modalStation}
          onClose={() => setModalStation(null)}
        />
      )}

      {/* ── MOBILE BOTTOM NAVIGATION (APPLE IOS TAB BAR STYLE) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F5F5F7]/95 backdrop-blur-xl border-t border-[#E5E5EA] px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab("find")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === "find"
              ? "text-emerald-700 font-bold"
              : "text-[#8E8E93] hover:text-zinc-900"
          }`}
        >
          <Zap className={`w-5 h-5 ${activeTab === "find" ? "fill-emerald-600 text-emerald-600" : ""}`} />
          <span className="text-[10px] tracking-tight">Find</span>
        </button>

        <button
          onClick={() => setActiveTab("explore")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === "explore"
              ? "text-emerald-700 font-bold"
              : "text-[#8E8E93] hover:text-zinc-900"
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === "explore" ? "text-emerald-600" : ""}`} />
          <span className="text-[10px] tracking-tight">Explore</span>
        </button>

        <button
          onClick={() => setActiveTab("coverage")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === "coverage"
              ? "text-emerald-700 font-bold"
              : "text-[#8E8E93] hover:text-zinc-900"
          }`}
        >
          <Layers className={`w-5 h-5 ${activeTab === "coverage" ? "text-emerald-600" : ""}`} />
          <span className="text-[10px] tracking-tight">Coverage</span>
        </button>

        <button
          onClick={() => setActiveTab("insights")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === "insights"
              ? "text-emerald-700 font-bold"
              : "text-[#8E8E93] hover:text-zinc-900"
          }`}
        >
          <BarChart3 className={`w-5 h-5 ${activeTab === "insights" ? "text-emerald-600" : ""}`} />
          <span className="text-[10px] tracking-tight">Insights</span>
        </button>

        <button
          onClick={() => setActiveTab("data")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === "data"
              ? "text-emerald-700 font-bold"
              : "text-[#8E8E93] hover:text-zinc-900"
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === "data" ? "text-emerald-600" : ""}`} />
          <span className="text-[10px] tracking-tight">Data</span>
        </button>
      </nav>
    </div>
  );
}
