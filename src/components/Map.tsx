
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "./ui/button";
import { MapPin, Locate } from "lucide-react";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

interface MapProps {
  trucks?: {
    name: string;
    cuisine: string;
    location?: [number, number]; // [longitude, latitude]
  }[];
}

export const Map = ({ trucks = [] }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState(() => {
    return localStorage.getItem("mapbox_token") || "";
  });
  const [tokenInput, setTokenInput] = useState(mapboxToken);
  const [mapLoaded, setMapLoaded] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;
    
    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.5, 40], // Default to US center
        zoom: 4
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setMapLoaded(true);
        
        // Get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (map.current) {
                map.current.flyTo({
                  center: [position.coords.longitude, position.coords.latitude],
                  zoom: 11
                });
                
                // Add a marker for user location
                new mapboxgl.Marker({ color: "#4B56D2" })
                  .setLngLat([position.coords.longitude, position.coords.latitude])
                  .setPopup(new mapboxgl.Popup().setHTML("<h3>You are here</h3>"))
                  .addTo(map.current);
              }
            },
            (error) => {
              console.log("Error getting location:", error);
              toast({
                title: "Location error",
                description: "Could not get your location. Using default view.",
                variant: "destructive"
              });
            }
          );
        }
      });
    } catch (error) {
      console.error("Mapbox initialization error:", error);
      toast({
        title: "Map error",
        description: "There was an error initializing the map. Please check your Mapbox token.",
        variant: "destructive"
      });
    }
  };

  // Add sample truck locations if no real data
  const sampleLocations = [
    { name: "Taco Time", cuisine: "Mexican", location: [-74.006, 40.7128] }, // NYC
    { name: "Burger Bliss", cuisine: "American", location: [-122.4194, 37.7749] }, // SF
    { name: "Sushi Roll", cuisine: "Japanese", location: [-87.6298, 41.8781] }, // Chicago
    { name: "Green Goodness", cuisine: "Healthy", location: [-118.2437, 34.0522] } // LA
  ];

  const displayTruckLocations = () => {
    if (!map.current || !mapLoaded) return;
    
    const trucksToDisplay = trucks.length > 0 && trucks[0].location ? 
      trucks : sampleLocations;
    
    trucksToDisplay.forEach(truck => {
      if (!truck.location) return;
      
      // Create a popup with truck info
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <h3 class="font-medium">${truck.name}</h3>
          <p class="text-sm">${truck.cuisine}</p>
          <button class="text-sm text-indigo-600 hover:text-indigo-800">
            View menu
          </button>
        `);
      
      // Add marker for each truck
      new mapboxgl.Marker({ color: "#10b981" })
        .setLngLat(truck.location)
        .setPopup(popup)
        .addTo(map.current);
    });
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap();
    }
    
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (mapLoaded) {
      displayTruckLocations();
    }
  }, [mapLoaded, trucks]);

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem("mapbox_token", tokenInput);
      setMapboxToken(tokenInput);
      
      if (map.current) {
        map.current.remove();
      }
      
      toast({
        title: "Token saved",
        description: "Your Mapbox token has been saved. Initializing map...",
      });
      
      initializeMap();
    } else {
      toast({
        title: "Token required",
        description: "Please enter a valid Mapbox token",
        variant: "destructive"
      });
    }
  };

  const handleLocateMe = () => {
    if (!map.current) return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (map.current) {
            map.current.flyTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 14,
              essential: true
            });
          }
        },
        (error) => {
          console.log("Error getting location:", error);
          toast({
            title: "Location error",
            description: "Could not get your location.",
            variant: "destructive"
          });
        }
      );
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      {!mapboxToken ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full space-y-4 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium">Mapbox Token Required</h3>
            <p className="text-sm text-gray-600">
              To use the map feature, you need to provide a Mapbox token. 
              You can get one for free at <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>.
            </p>
            <Input
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste your Mapbox token here"
              className="w-full"
            />
            <Button onClick={handleSaveToken} className="w-full">
              Save Token & Load Map
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div ref={mapContainer} className="absolute inset-0" />
          <div className="absolute bottom-4 right-4 z-10">
            <Button
              onClick={handleLocateMe}
              className="rounded-full h-12 w-12 p-0"
              variant="secondary"
            >
              <Locate className="h-5 w-5" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
