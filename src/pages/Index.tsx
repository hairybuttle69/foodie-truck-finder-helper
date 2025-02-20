
import { Header } from "@/components/Header";
import { TruckList } from "@/components/TruckList";
import { Map } from "@/components/Map";
import { AddTruckForm } from "@/components/AddTruckForm";
import { useState } from "react";

const Index = () => {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMapToggle={() => setShowMap(!showMap)} showMap={showMap} />
      <main className="pt-16">
        {showMap ? (
          <Map />
        ) : (
          <div className="pb-8 pt-4">
            <TruckList />
          </div>
        )}
        <AddTruckForm />
      </main>
    </div>
  );
};

export default Index;
