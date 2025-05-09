
import { TruckCard } from "./TruckCard";
import { CateringCard } from "./CateringCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface Location {
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface TruckData {
  id?: string;
  name: string;
  cuisine: string;
  distance: string;
  image: string;
  status: "open" | "closed";
  location?: [number, number];
}

interface TruckListProps {
  isDeveloperMode?: boolean;
  onLocationUpdate?: (truckName: string, date: string, location: Location) => void;
}

export const TruckList = ({ isDeveloperMode = false, onLocationUpdate }: TruckListProps) => {
  const [activeTab, setActiveTab] = useState("all");

  const trucks = [
    {
      id: "1",
      name: "Taco Time",
      cuisine: "Mexican",
      distance: "0.2 miles",
      image: "/placeholder.svg",
      status: "open" as const,
    },
    {
      id: "2",
      name: "Burger Bliss",
      cuisine: "American",
      distance: "0.5 miles",
      image: "/placeholder.svg",
      status: "open" as const,
    },
    {
      id: "3",
      name: "Sushi Roll",
      cuisine: "Japanese",
      distance: "0.8 miles",
      image: "/placeholder.svg",
      status: "closed" as const,
    },
    {
      id: "4",
      name: "Green Goodness",
      cuisine: "Healthy",
      distance: "0.4 miles",
      image: "/placeholder.svg",
      status: "open" as const,
    },
    {
      id: "5",
      name: "Fresh & Fit",
      cuisine: "Healthy",
      distance: "0.7 miles",
      image: "/placeholder.svg",
      status: "open" as const,
    }
  ];

  const restaurants = [
    {
      id: "6",
      name: "Hidden Gem Diner",
      cuisine: "American",
      distance: "0.3 miles",
      image: "/placeholder.svg",
      status: "open" as const,
    },
    {
      id: "7",
      name: "Little Italy",
      cuisine: "Italian",
      distance: "0.6 miles",
      image: "/placeholder.svg",
      status: "open" as const,
    },
    {
      id: "8",
      name: "Salad Station",
      cuisine: "Healthy",
      distance: "0.5 miles",
      image: "/placeholder.svg",
      status: "open" as const,
    }
  ];

  const filterByCuisine = (items, cuisineType) => {
    if (cuisineType === "all") return items;
    return items.filter(item => item.cuisine === cuisineType);
  };

  const filteredTrucks = filterByCuisine(trucks, activeTab);
  const filteredRestaurants = filterByCuisine(restaurants, activeTab);

  const cuisineTypes = ["all", "Mexican", "American", "Japanese", "Italian", "Healthy"];
  
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
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-between px-4 py-2 rounded-md border bg-background hover:bg-accent">
                <span>Cuisine: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {cuisineTypes.map((cuisine) => (
                  <DropdownMenuItem 
                    key={cuisine}
                    onClick={() => setActiveTab(cuisine)}
                    className={activeTab === cuisine ? "bg-accent" : ""}
                  >
                    {cuisine === "all" ? "All Cuisines" : cuisine}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <TabsContent value="foodtrucks" className="mt-0">
          {filteredTrucks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrucks.map((truck) => (
                <TruckCard 
                  key={truck.id}
                  id={truck.id} 
                  {...truck} 
                  isDeveloperMode={isDeveloperMode}
                  onLocationUpdate={onLocationUpdate}
                />
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
                <TruckCard 
                  key={restaurant.id} 
                  id={restaurant.id}
                  {...restaurant} 
                  isDeveloperMode={isDeveloperMode}
                  onLocationUpdate={onLocationUpdate} 
                />
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
