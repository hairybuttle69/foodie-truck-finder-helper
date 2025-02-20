
import { TruckCard } from "./TruckCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export const TruckList = () => {
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
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="foodtrucks" className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold">Nearby Establishments</h2>
          <TabsList>
            <TabsTrigger value="foodtrucks">Food Trucks</TabsTrigger>
            <TabsTrigger value="restaurants">Hole-in-the-Wall</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="foodtrucks" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trucks.map((truck) => (
              <TruckCard key={truck.name} {...truck} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="restaurants" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <TruckCard key={restaurant.name} {...restaurant} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
