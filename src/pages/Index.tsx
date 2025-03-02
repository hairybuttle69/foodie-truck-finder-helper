
import { Header } from "@/components/Header";
import { TruckList } from "@/components/TruckList";
import { Map } from "@/components/Map";
import { AddTruckForm } from "@/components/AddTruckForm";
import { VendorDashboard } from "@/components/vendor/VendorDashboard";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [showMap, setShowMap] = useState(false);
  const [isVendorMode, setIsVendorMode] = useState(false);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

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
              <Map />
            ) : (
              <div className="pb-8 pt-4">
                <TruckList isDeveloperMode={isDeveloperMode} />
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
