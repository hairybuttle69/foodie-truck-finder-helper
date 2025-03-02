
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { toast } from "sonner";

export const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [locationPermissionState, setLocationPermissionState] = useState<"granted" | "denied" | "prompt">("prompt");

  useEffect(() => {
    if (!mapContainer.current) return;

    // Please enter your Mapbox token here
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40], // Default to US center
      zoom: 4
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Check if we have permission to access location
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        setLocationPermissionState(result.state as "granted" | "denied" | "prompt");
        
        // If permission is already granted, get location
        if (result.state === 'granted') {
          getUserLocation();
        } else if (result.state === 'prompt') {
          // Show a more friendly prompt to the user
          toast.message("Enable location services", {
            description: "For the best experience, allow location access to find food trucks near you",
            action: {
              label: "Enable",
              onClick: () => getUserLocation()
            }
          });
        }
      });
    } else {
      // Fallback for browsers that don't support permissions API
      getUserLocation();
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (map.current) {
            map.current.flyTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 11
            });
            
            // Add a marker for the user's location
            new mapboxgl.Marker({ color: "#4668F2" })
              .setLngLat([position.coords.longitude, position.coords.latitude])
              .addTo(map.current);
              
            setLocationPermissionState("granted");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermissionState("denied");
          toast.error("Unable to access your location. Some features may be limited.");
        },
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {locationPermissionState === "denied" && (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-3 rounded-lg shadow-lg text-sm">
          <p className="font-medium text-red-600">Location access denied</p>
          <p className="text-gray-600">Please enable location services in your browser settings to see food trucks near you.</p>
        </div>
      )}
    </div>
  );
};
