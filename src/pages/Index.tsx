
import { Header } from "@/components/Header";
import { TruckList } from "@/components/TruckList";
import { Map } from "@/components/Map";
import { AddTruckForm } from "@/components/AddTruckForm";
import { VendorDashboard } from "@/components/vendor/VendorDashboard";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { AuthSheet } from "@/components/auth/AuthSheet";

interface Location {
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
}

const Index = () => {
  const [showMap, setShowMap] = useState(false);
  const [isVendorMode, setIsVendorMode] = useState(false);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  
  // State to store truck locations by truck name and date
  const [truckLocations, setTruckLocations] = useState<Record<string, Record<string, Location>>>({});
  
  const { user, isLoading } = useAuth();
  
  // Check if the user needs to authenticate when first loading the app
  useEffect(() => {
    if (!isLoading && !user) {
      // Auto-show auth sheet on first load if user is not logged in
      const hasSeenAuthPrompt = localStorage.getItem('hasSeenAuthPrompt');
      if (!hasSeenAuthPrompt) {
        setShowAuthPrompt(true);
        localStorage.setItem('hasSeenAuthPrompt', 'true');
      }
    }
  }, [isLoading, user]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
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
          user ? (
            <VendorDashboard />
          ) : (
            <div className="container mx-auto px-4 py-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
              <p className="mb-4">You need to sign in to access Vendor Mode.</p>
              <button 
                onClick={() => setShowAuthPrompt(true)}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                Sign In
              </button>
            </div>
          )
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
      
      <AuthSheet 
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
      />
    </div>
  );
};

export default Index;
