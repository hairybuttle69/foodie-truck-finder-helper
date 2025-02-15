
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // We'll implement the map in the next iteration
    // For now we'll just show a placeholder
    const mapPlaceholder = document.createElement("div");
    mapPlaceholder.className = "w-full h-full bg-gray-200 flex items-center justify-center";
    mapPlaceholder.textContent = "Map coming soon...";
    mapContainer.current.appendChild(mapPlaceholder);

    return () => {
      if (mapContainer.current) {
        mapContainer.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[400px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
    </div>
  );
};
