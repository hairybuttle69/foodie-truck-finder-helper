
import { Header } from "@/components/Header";
import { TruckList } from "@/components/TruckList";
import { Map } from "@/components/Map";
import { AddTruckForm } from "@/components/AddTruckForm";
import { VendorDashboard } from "@/components/vendor/VendorDashboard";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";

interface Location {
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
}

const Index = () => {
  const [showMap, setShowMap] = useState(false);
  const [isVendorMode, setIsVendorMode] = useState(false);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  
  // State to store truck locations by truck name and date
  const [truckLocations, setTruckLocations] = useState<Record<string, Record<string, Location>>>({});
  
  // Sample truck data with locations - in a real app this would come from an API
  const truckData = [
    {
      id: "1",
      name: "Taco Time",
      cuisine: "Mexican",
      distance: "0.2 miles",
      image: "/placeholder.svg",
      status: "open" as const,
      location: [-74.006, 40.7128] as [number, number] // NYC - explicit tuple type
    },
    {
      id: "2",
      name: "Burger Bliss",
      cuisine: "American",
      distance: "0.5 miles",
      image: "/placeholder.svg",
      status: "open" as const,
      location: [-118.2437, 34.0522] as [number, number] // LA - explicit tuple type
    },
    {
      id: "3",
      name: "Sushi Roll",
      cuisine: "Japanese",
      distance: "0.8 miles",
      image: "/placeholder.svg",
      status: "closed" as const,
      location: [-87.6298, 41.8781] as [number, number] // Chicago - explicit tuple type
    }
  ];

  // Handle location updates from truck cards
  const handleLocationUpdate = (truckName: string, date: string, location: Location) => {
    setTruckLocations(prev => ({
      ...prev,
      [truckName]: {
        ...(prev[truckName] || {}),
        [date]: location
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onMapToggle={() => setShowMap(!showMap)} 
        showMap={showMap} 
        isVendorMode={isVendorMode}
        onVendorModeToggle={() => setIsVendorMode(!isVendorMode)}
        isDeveloperMode={isDeveloperMode}
        onDeveloperModeToggle={() => setIsDeveloperMode(!isDeveloperMode)}
      />
      <main className="pt-16">
        {isVendorMode ? (
          <VendorDashboard />
        ) : (
          <>
            {showMap ? (
              <Map trucks={truckData} truckLocations={truckLocations} />
            ) : (
              <div className="pb-8 pt-4">
                <TruckList 
                  isDeveloperMode={isDeveloperMode} 
                  onLocationUpdate={handleLocationUpdate}
                />
              </div>
            )}
            {/* Only show the AddTruckForm when in developer mode */}
            {isDeveloperMode && <AddTruckForm />}
          </>
        )}
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
