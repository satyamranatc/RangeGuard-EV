import React from "react";
import { Zap, Navigation, Clock, Check, ArrowRight, ShieldAlert } from "lucide-react";

export default function StationCard({
  station,
  isSelected = false,
  onSelect,
  onOpenDetails
}) {
  const isOperational = station.status === "operational";
  const isReachable = station.isReachable;

  return (
    <div
      onClick={onSelect}
      className={`group text-left bg-white rounded-2xl p-5 border transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-zinc-950 shadow-md ring-2 ring-zinc-950/10"
          : "border-zinc-200/80 hover:border-zinc-300 hover:shadow-xs"
      }`}
    >
      {/* Top Header: Operator & Operational Badge */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
          {station.operator}
        </span>

        {isOperational ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Operational</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-700 border border-red-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            <span>Non-Operational</span>
          </span>
        )}
      </div>

      {/* Station Title & Distance */}
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <h3 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight leading-snug line-clamp-1 group-hover:text-zinc-950">
          {station.name}
        </h3>
        <div className="shrink-0 text-right">
          <span className="text-sm sm:text-base font-extrabold text-zinc-900 font-mono">
            {station.distanceKm}
          </span>
          <span className="text-xs text-zinc-500 ml-0.5">km</span>
        </div>
      </div>

      {/* Area & Landmark */}
      <p className="text-xs text-zinc-500 line-clamp-1 mb-3">
        {station.area} • {station.landmark}
      </p>

      {/* Hardware Delivery Strip */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs mb-4">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 font-medium">
          <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
          <span>{station.powerOutput}</span>
        </div>
        <span className="text-zinc-300">•</span>
        <span className="text-zinc-600 font-medium">{station.totalBays} Bays</span>
        <span className="text-zinc-300">•</span>
        <span className="font-mono text-zinc-600">
          {station.tariffDc ? `₹${station.tariffDc.toFixed(2)}/kWh` : `₹${station.tariffAc.toFixed(2)}/kWh`}
        </span>
      </div>

      {/* Estimated Arrival Range Progress Bar */}
      {isReachable && (
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 mb-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">Estimated battery on arrival</span>
            <span className="font-mono font-bold text-emerald-700">~{station.arrivalBufferPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(5, station.arrivalBufferPct))}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
            <span>Trip drain: ~{station.batteryDrainPct}%</span>
            <span>Safe arrival buffer</span>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenDetails) onOpenDetails(station);
          }}
          className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 transition-colors"
        >
          <span>View station</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            station.name + " " + station.address
          )}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors"
        >
          <Navigation className="w-3 h-3 text-zinc-300" />
          <span>Directions</span>
        </a>
      </div>
    </div>
  );
}
