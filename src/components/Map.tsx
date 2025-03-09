import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Locate } from "lucide-react";
import { toast } from "./ui/use-toast";

interface Location {
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface TruckMapData {
  id: string;
  name: string;
  cuisine: string;
  location?: [number, number]; // [longitude, latitude]
  // For our dynamic locations storage
  locations?: Record<string, Location>;
}

interface MapProps {
  trucks?: TruckMapData[];
  truckLocations?: Record<string, Record<string, Location>>;
}

export const Map = ({ trucks = [], truckLocations = {} }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

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

  // Get all available truck locations for the selected date
  const getVisibleTrucks = () => {
    let visibleTrucks: Array<{name: string, coordinates: [number, number], cuisine: string}> = [];
    
    // First add trucks with static locations
    trucks.forEach(truck => {
      if (truck.location) {
        visibleTrucks.push({
          name: truck.name,
          coordinates: truck.location,
          cuisine: truck.cuisine
        });
      }
    });
    
    // Then add trucks with dynamic locations for the selected date
    Object.entries(truckLocations).forEach(([truckName, datesToLocations]) => {
      if (datesToLocations[selectedDate]) {
        const matchingTruck = trucks.find(t => t.name === truckName);
        visibleTrucks.push({
          name: truckName,
          coordinates: datesToLocations[selectedDate].coordinates,
          cuisine: matchingTruck?.cuisine || 'Unknown'
        });
      }
    });
    
    return visibleTrucks;
  };

  // Generate OpenStreetMap URL with markers for all trucks
  const generateMapUrl = () => {
    // Default location (center of US) if no trucks or user location
    let centerLat = 39.8283;
    let centerLon = -98.5795;
    let zoom = 4;
    
    const visibleTrucks = getVisibleTrucks();
    
    // If user location is available, center on that
    if (userLocation) {
      centerLat = userLocation[1];
      centerLon = userLocation[0];
      zoom = 13;
    } 
    // Otherwise if we have trucks with locations, center on first truck
    else if (visibleTrucks.length > 0) {
      centerLat = visibleTrucks[0].coordinates[1];
      centerLon = visibleTrucks[0].coordinates[0];
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

  // Handle date change for viewing truck locations
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  // Get visible trucks for the current selected date
  const visibleTrucks = getVisibleTrucks();

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
      
      {/* Date selector */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 p-2 rounded-md shadow-md">
        <input 
          type="date" 
          value={selectedDate}
          onChange={handleDateChange}
          className="p-1 rounded border"
        />
      </div>
      
      {/* Truck list overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 p-4 rounded-md shadow-md max-w-xs max-h-[70vh] overflow-y-auto">
        <h3 className="font-medium text-lg mb-2">
          Food Trucks ({selectedDate})
          <span className="text-sm font-normal ml-2 text-gray-500">
            {visibleTrucks.length} available
          </span>
        </h3>
        {visibleTrucks.length > 0 ? (
          <ul className="space-y-2">
            {visibleTrucks.map((truck, index) => (
              <li key={index} className="border-b pb-2 last:border-0">
                <strong>{truck.name}</strong>
                <p className="text-sm text-gray-600">{truck.cuisine}</p>
                <p className="text-xs text-gray-500">
                  {truck.coordinates[1].toFixed(4)}, {truck.coordinates[0].toFixed(4)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No trucks available on this date.</p>
        )}
      </div>
    </div>
  );
};
