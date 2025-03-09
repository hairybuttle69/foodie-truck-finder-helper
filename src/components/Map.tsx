import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Locate } from "lucide-react";
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
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Request user's location when the component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
          
          toast({
            title: "Location found",
            description: "Using your current location for the map view.",
          });
        },
        (error) => {
          console.log("Error getting location:", error);
          toast({
            title: "Location not available",
            description: "Could not get your location. Using default view.",
            variant: "destructive"
          });
        }
      );
    }
  }, []);

  // Function to handle the "locate me" button click
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
          
          // Center the map on user's location
          if (mapContainer.current) {
            const iframe = mapContainer.current.querySelector('iframe');
            if (iframe) {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01},${lat-0.01},${lon+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lon}`;
            }
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

  // Generate OpenStreetMap URL with markers for all trucks
  const generateMapUrl = () => {
    // Default location (center of US) if no trucks or user location
    let centerLat = 39.8283;
    let centerLon = -98.5795;
    let zoom = 4;
    
    // If user location is available, center on that
    if (userLocation) {
      centerLat = userLocation[1];
      centerLon = userLocation[0];
      zoom = 13;
    } 
    // Otherwise if we have trucks, center on first truck
    else if (trucks.length > 0 && trucks[0].location) {
      centerLat = trucks[0].location[1];
      centerLon = trucks[0].location[0];
      zoom = 13;
    }
    
    // Base map URL
    let mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${centerLon-0.1},${centerLat-0.1},${centerLon+0.1},${centerLat+0.1}&layer=mapnik&zoom=${zoom}`;
    
    // Add user location marker if available
    if (userLocation) {
      mapUrl += `&marker=${userLocation[1]},${userLocation[0]}`;
    }
    
    return mapUrl;
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div ref={mapContainer} className="absolute inset-0">
        <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0} 
          src={generateMapUrl()} 
          style={{ border: "1px solid #ccc" }}
          title="Food Truck Map"
          className="rounded-md"
        />
        
        {/* Truck marker overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {trucks.map((truck, index) => {
            if (!truck.location) return null;
            
            // This is a simplified representation since we can't add custom markers directly to the iframe
            return (
              <div 
                key={index}
                className="absolute z-10 bg-primary text-white px-2 py-1 rounded-md transform -translate-x-1/2 -translate-y-full pointer-events-auto hover:z-20"
                style={{ 
                  // This is a rough estimation for positioning - in a real app would need more precise calculation
                  left: '50%',
                  top: '50%',
                  display: 'none' // Hide these markers since we can't precisely position them on the iframe
                }}
                onClick={() => {
                  toast({
                    title: truck.name,
                    description: `${truck.cuisine} food truck`
                  });
                }}
              >
                {truck.name}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 z-10">
        <Button
          onClick={handleLocateMe}
          className="rounded-full h-12 w-12 p-0"
          variant="secondary"
        >
          <Locate className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Truck list overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 p-4 rounded-md shadow-md max-w-xs max-h-[70vh] overflow-y-auto">
        <h3 className="font-medium text-lg mb-2">Food Trucks</h3>
        <ul className="space-y-2">
          {trucks.map((truck, index) => (
            <li key={index} className="border-b pb-2 last:border-0">
              <strong>{truck.name}</strong>
              <p className="text-sm text-gray-600">{truck.cuisine}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
