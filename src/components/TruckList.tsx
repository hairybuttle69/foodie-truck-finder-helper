
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

interface TruckListProps {
  isDeveloperMode?: boolean;
}

export const TruckList = ({ isDeveloperMode = false }: TruckListProps) => {
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
                <TruckCard key={truck.name} {...truck} isDeveloperMode={isDeveloperMode} />
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
                <TruckCard key={restaurant.name} {...restaurant} isDeveloperMode={isDeveloperMode} />
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
