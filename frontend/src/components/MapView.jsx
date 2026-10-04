import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, Zap, AlertCircle } from "lucide-react";

export default function MapView({
  userLat,
  userLon,
  safeRangeKm,
  stations = [],
  selectedStation = null,
  onSelectStation,
  className = "w-full h-full min-h-[500px]"
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const circleRef = useRef(null);
  const userMarkerRef = useRef(null);
  const stationMarkersRef = useRef([]);

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // CartoDB Positron: Pristine, Apple-like monochrome architectural map tiles
      const map = L.map(mapContainerRef.current, {
        center: [userLat, userLon],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd"
      }).addTo(map);

      // Minimalist zoom control in top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update User Marker & Safe Range Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // User Marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userIcon = L.divIcon({
      className: "custom-user-marker",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-emerald-500/20 animate-ping"></div>
          <div class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white">
            <div class="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    userMarkerRef.current = L.marker([userLat, userLon], {
      icon: userIcon,
      zIndexOffset: 1000
    }).addTo(map);

    // Safe Range Circle
    if (circleRef.current) {
      circleRef.current.remove();
    }

    const radiusMeters = Math.max(100, (safeRangeKm || 1) * 1000);
    circleRef.current = L.circle([userLat, userLon], {
      radius: radiusMeters,
      color: "#00A86B",
      weight: 1.5,
      dashArray: "6, 6",
      fillColor: "#00A86B",
      fillOpacity: 0.06
    }).addTo(map);

  }, [userLat, userLon, safeRangeKm]);

  // Update Station Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing station markers
    stationMarkersRef.current.forEach((m) => m.remove());
    stationMarkersRef.current = [];

    stations.forEach((st) => {
      const isSelected = selectedStation?.stationId === st.stationId;
      const isOperational = st.status === "operational";
      const isReachable = st.isReachable;

      let markerHtml = "";
      let iconSize = [32, 32];
      let iconAnchor = [16, 16];

      if (!isOperational) {
        // Excluded / Non-operational
        markerHtml = `
          <div class="station-pin non-op group cursor-pointer transition-transform duration-200 hover:scale-110">
            <div class="w-7 h-7 rounded-full bg-zinc-100 border border-red-300 text-red-500 shadow-xs flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line></svg>
            </div>
          </div>
        `;
        iconSize = [28, 28];
        iconAnchor = [14, 14];
      } else if (isReachable) {
        // Operational & Reachable
        markerHtml = `
          <div class="station-pin reachable cursor-pointer transition-all duration-300 ${
            isSelected ? "scale-125 z-50" : "hover:scale-115"
          }">
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
              isSelected
                ? "bg-zinc-950 text-emerald-400 border border-emerald-400/80 shadow-lg ring-4 ring-emerald-500/20"
                : "bg-white text-zinc-900 border border-zinc-200/90 shadow-sm hover:border-emerald-500 hover:shadow-md"
            }">
              <svg class="w-3 h-3 ${isSelected ? "text-emerald-400 fill-emerald-400" : "text-emerald-600 fill-emerald-600"}" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              <span class="text-[11px] font-semibold tracking-tight font-mono">${st.powerKw}k</span>
            </div>
          </div>
        `;
        iconSize = [56, 28];
        iconAnchor = [28, 14];
      } else {
        // Operational but Out of Range
        markerHtml = `
          <div class="station-pin out-of-range cursor-pointer opacity-50 hover:opacity-90 transition-opacity">
            <div class="w-6 h-6 rounded-full bg-zinc-200 border border-zinc-300 text-zinc-600 flex items-center justify-center">
              <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
          </div>
        `;
        iconSize = [24, 24];
        iconAnchor = [12, 12];
      }

      const icon = L.divIcon({
        className: "custom-station-marker",
        html: markerHtml,
        iconSize: iconSize,
        iconAnchor: iconAnchor
      });

      const marker = L.marker([st.latitude, st.longitude], {
        icon: icon,
        zIndexOffset: isSelected ? 500 : isReachable ? 200 : 50
      }).addTo(map);

      marker.on("click", () => {
        if (onSelectStation) {
          onSelectStation(st);
        }
      });

      stationMarkersRef.current.push(marker);
    });
  }, [stations, selectedStation, onSelectStation]);

  // Center on selected station when it changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedStation) return;

    map.flyTo([selectedStation.latitude, selectedStation.longitude], 14, {
      duration: 0.8,
      easeLinearity: 0.25
    });
  }, [selectedStation]);

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([userLat, userLon], 12, { duration: 0.6 });
  };

  return (
    <div className={`relative ${className} bg-[#F4F4F6] overflow-hidden`}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Recenter Pill */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-2">
        <button
          onClick={handleRecenter}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-zinc-200/80 text-xs font-medium text-zinc-800 shadow-sm hover:bg-white hover:border-zinc-300 transition-all active:scale-95"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-600" />
          <span>My Location</span>
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-xs text-zinc-600 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Safe Range: <strong className="font-mono text-zinc-900">{safeRangeKm} km</strong></span>
        </div>
      </div>
    </div>
  );
}
