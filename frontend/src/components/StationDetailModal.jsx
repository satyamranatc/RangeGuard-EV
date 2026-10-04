import React from "react";
import { X, ExternalLink, Navigation, Zap, Clock, Phone, MapPin, Check, AlertTriangle } from "lucide-react";

export default function StationDetailModal({ station, onClose }) {
  if (!station) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 w-full max-w-xl p-5 sm:p-8 space-y-4 sm:space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 sm:pb-4 border-b border-zinc-100">
          <div>
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
              {station.operator} • {station.city}
            </span>
            <h2 className="text-base sm:text-xl font-bold text-zinc-950 tracking-tight mt-0.5">
              {station.name}
            </h2>
            <p className="text-xs text-zinc-500 mt-1 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{station.address}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reachability Telemetry Summary */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-50 border border-zinc-100 text-center">
          <div>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 block mb-0.5">Distance</span>
            <span className="text-sm sm:text-lg font-bold text-zinc-900 font-mono">
              {station.distanceKm} km
            </span>
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 block mb-0.5">Est. Drain</span>
            <span className="text-sm sm:text-lg font-bold text-amber-700 font-mono">
              ~{station.batteryDrainPct}%
            </span>
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 block mb-0.5">Buffer</span>
            <span className="text-sm sm:text-lg font-bold text-emerald-700 font-mono">
              ~{station.arrivalBufferPct}%
            </span>
          </div>
        </div>

        {/* Installed Ports & Speeds */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-900 uppercase tracking-wider text-[11px]">
              Installed Ports ({station.totalBays} Bays)
            </span>
            <span className="text-zinc-500 font-mono text-[11px]">{station.powerOutput}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {station.chargers?.map((c, i) => (
              <div
                key={i}
                className="p-2.5 sm:p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-zinc-800">{c.count}x {c.type}</span>
                </div>
                <span className="font-mono text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200/80 text-[11px]">
                  {c.speed}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tariffs & Hours */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-400 block mb-0.5 text-[11px]">Energy Tariff</span>
            <span className="font-semibold text-zinc-900 font-mono text-xs sm:text-sm block">
              {station.tariffDc ? `₹${station.tariffDc.toFixed(2)}/kWh` : `₹${station.tariffAc.toFixed(2)}/kWh`}
            </span>
            <span className="text-[10px] text-zinc-400">
              {station.tariffDc ? "DC Fast Rate" : "AC Standard Rate"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-400 block mb-0.5 text-[11px]">Operating Hours</span>
            <span className="font-semibold text-zinc-900 text-xs sm:text-sm block">
              {station.hours}
            </span>
            <span className="text-[10px] text-zinc-400">
              {station.is24Hours ? "Open 24 Hours Daily" : "Standard Mall Timings"}
            </span>
          </div>
        </div>

        {/* Operational Context & Support */}
        <div className="text-[11px] text-zinc-500 space-y-1 p-3 rounded-xl bg-zinc-50/70 border border-zinc-100">
          <div>
            <strong className="text-zinc-700">Parking Facility:</strong> {station.parkingNote}
          </div>
          <div>
            <strong className="text-zinc-700">Landmark:</strong> {station.landmark}
          </div>
          <div>
            <strong className="text-zinc-700">Operator Helpline:</strong> {station.helpline}
          </div>
          <div className="font-mono text-[10px] pt-0.5 text-zinc-400">
            Verified Source ID: {station.registryId}
          </div>
        </div>

        {/* Action Buttons (Stacked on mobile, row on desktop) */}
        <div className="pt-2 border-t border-zinc-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
          <a
            href={station.appUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl border border-zinc-300 hover:border-zinc-400 text-xs font-semibold text-zinc-800 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <span>Operator Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              station.name + " " + station.address
            )}`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
}
