
import { TruckCard } from "./TruckCard";

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Nearby Food Trucks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trucks.map((truck) => (
          <TruckCard key={truck.name} {...truck} />
        ))}
      </div>
    </div>
  );
};
