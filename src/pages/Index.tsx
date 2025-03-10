import { Header } from "@/components/Header";
import { TruckList } from "@/components/TruckList";
import { Map } from "@/components/Map";
import { AddTruckForm } from "@/components/AddTruckForm";
import { VendorDashboard } from "@/components/vendor/VendorDashboard";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { AuthSheet } from "@/components/auth/AuthSheet";
import { VendorAssignmentManager } from "@/components/developer/VendorAssignmentManager";
import { getLocationsByVendor } from "@/utils/vendorManagement";

interface Location {
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
}

const Index = () => {
  const [showMap, setShowMap] = useState(false);
  const [isVendorMode, setIsVendorMode] = useState(false);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  
  const [truckLocations, setTruckLocations] = useState<Record<string, Record<string, Location>>>({});
  
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !user) {
      setShowAuthPrompt(true);
    }
  }, [isLoading, user]);

  const locations = [
    {
      id: "1",
      name: "Taco Time",
      cuisine: "Mexican",
      distance: "0.2 miles",
      image: "/placeholder.svg",
      status: "open" as const,
      location: [-74.006, 40.7128] as [number, number], // NYC 
      type: "foodtruck" as const
    },
    {
      id: "2",
      name: "Burger Bliss",
      cuisine: "American",
      distance: "0.5 miles",
      image: "/placeholder.svg",
      status: "open" as const,
      location: [-118.2437, 34.0522] as [number, number], // LA
      type: "foodtruck" as const
    },
    {
      id: "3",
      name: "Sushi Roll",
      cuisine: "Japanese",
      distance: "0.8 miles",
      image: "/placeholder.svg",
      status: "closed" as const,
      location: [-87.6298, 41.8781] as [number, number], // Chicago
      type: "foodtruck" as const
    },
    {
      id: "4",
      name: "Pizza Corner",
      cuisine: "Italian",
      distance: "1.2 miles",
      image: "/placeholder.svg",
      status: "open" as const,
      location: [-122.4194, 37.7749] as [number, number], // San Francisco
      type: "restaurant" as const
    },
    {
      id: "5",
      name: "Noodle House",
      cuisine: "Asian",
      distance: "1.5 miles",
      image: "/placeholder.svg",
      status: "open" as const,
      location: [-80.1918, 25.7617] as [number, number], // Miami
      type: "restaurant" as const
    }
  ];

  const handleLocationUpdate = (locationName: string, date: string, location: Location) => {
    setTruckLocations(prev => ({
      ...prev,
      [locationName]: {
        ...(prev[locationName] || {}),
        [date]: location
      }
    }));
  };

  const getVendorLocations = () => {
    if (!user || !isVendorMode) return locations;
    
    const assignedLocationIds = getLocationsByVendor(user.id);
    return locations.filter(location => assignedLocationIds.includes(location.id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
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
        <AuthSheet 
          isOpen={showAuthPrompt}
          onClose={() => {}} // No close option - force login
        />
      </div>
    );
  }

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
          <VendorDashboard vendorLocations={getVendorLocations()} />
        ) : (
          <>
            {showMap ? (
              <Map trucks={locations} truckLocations={truckLocations} />
            ) : (
              <div className="pb-8 pt-4">
                <TruckList 
                  isDeveloperMode={isDeveloperMode} 
                  onLocationUpdate={handleLocationUpdate}
                />
              </div>
            )}
            {isDeveloperMode && (
              <div className="container mx-auto px-4">
                <VendorAssignmentManager locations={locations} />
                <AddTruckForm />
              </div>
            )}
          </>
        )}
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
