
import { TruckCard } from "./TruckCard";
import { CateringCard } from "./CateringCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";

export const TruckList = () => {
  const [activeTab, setActiveTab] = useState("all");

  const trucks = [
    {
      name: "Taco Time",
      cuisine: "Mexican",
      distance: "0.2 miles",
      image: "/placeholder.svg",
      status: "open" as const,
    },
    {
      name: "Burger Bliss",
      cuisine: "American",
      distance: "0.5 miles",
      image: "/placeholder.svg",
      status: "open" as const,
    },
    {
      name: "Sushi Roll",
      cuisine: "Japanese",
      distance: "0.8 miles",
      image: "/placeholder.svg",
      status: "closed" as const,
    },
    {
      name: "Green Goodness",
      cuisine: "Healthy",
      distance: "0.4 miles",
      image: "/placeholder.svg",
      status: "open" as const,
    },
    {
      name: "Fresh & Fit",
      cuisine: "Healthy",
      distance: "0.7 miles",
      image: "/placeholder.svg",
      status: "open" as const,
    }
  ];

  const restaurants = [
    {
      name: "Hidden Gem Diner",
      cuisine: "American",
      distance: "0.3 miles",
      image: "/placeholder.svg",
      status: "open" as const,
    },
    {
      name: "Little Italy",
      cuisine: "Italian",
      distance: "0.6 miles",
      image: "/placeholder.svg",
      status: "open" as const,
    },
    {
      name: "Salad Station",
      cuisine: "Healthy",
      distance: "0.5 miles",
      image: "/placeholder.svg",
      status: "open" as const,
    }
  ];

  // Helper function to filter by cuisine type
  const filterByCuisine = (items, cuisineType) => {
    if (cuisineType === "all") return items;
    return items.filter(item => item.cuisine === cuisineType);
  };

  const filteredTrucks = filterByCuisine(trucks, activeTab);
  const filteredRestaurants = filterByCuisine(restaurants, activeTab);

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="foodtrucks" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-4">
          <h2 className="text-2xl font-semibold">Nearby Establishments</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <TabsList>
              <TabsTrigger value="foodtrucks">Food Trucks</TabsTrigger>
              <TabsTrigger value="restaurants">Hole-in-the-Wall</TabsTrigger>
              <TabsTrigger value="catering">Catering</TabsTrigger>
            </TabsList>
            
            <TabsList className="mt-2 sm:mt-0">
              <TabsTrigger 
                value="cuisine-filter" 
                className="hidden" 
                aria-hidden="true"
              />
              <TabsTrigger 
                onClick={() => setActiveTab("all")}
                data-state={activeTab === "all" ? "active" : "inactive"}
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                onClick={() => setActiveTab("Mexican")}
                data-state={activeTab === "Mexican" ? "active" : "inactive"}
              >
                Mexican
              </TabsTrigger>
              <TabsTrigger 
                onClick={() => setActiveTab("American")}
                data-state={activeTab === "American" ? "active" : "inactive"}
              >
                American
              </TabsTrigger>
              <TabsTrigger 
                onClick={() => setActiveTab("Japanese")}
                data-state={activeTab === "Japanese" ? "active" : "inactive"}
              >
                Japanese
              </TabsTrigger>
              <TabsTrigger 
                onClick={() => setActiveTab("Italian")}
                data-state={activeTab === "Italian" ? "active" : "inactive"}
              >
                Italian
              </TabsTrigger>
              <TabsTrigger 
                onClick={() => setActiveTab("Healthy")}
                data-state={activeTab === "Healthy" ? "active" : "inactive"}
              >
                Healthy
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="foodtrucks" className="mt-0">
          {filteredTrucks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrucks.map((truck) => (
                <TruckCard key={truck.name} {...truck} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No food trucks found for this cuisine type.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="restaurants" className="mt-0">
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <TruckCard key={restaurant.name} {...restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No restaurants found for this cuisine type.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="catering" className="mt-0">
          <div className="max-w-2xl mx-auto mb-6">
            <p className="text-center text-gray-600">
              Looking to cater your next event? Our food trucks offer custom catering packages 
              for parties, corporate events, weddings, and more!
            </p>
          </div>
          {activeTab === "all" || activeTab === "Healthy" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByCuisine(trucks, activeTab).map((truck) => (
                <CateringCard key={truck.name} {...truck} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No catering options found for this cuisine type.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
