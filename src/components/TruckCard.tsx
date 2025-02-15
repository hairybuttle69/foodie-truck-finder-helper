
import { MapPinIcon, CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface TruckCardProps {
  name: string;
  cuisine: string;
  distance: string;
  image: string;
  status: "open" | "closed";
}

export const TruckCard = ({ name, cuisine, distance, image, status }: TruckCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in">
      <div className="relative h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === "open" ? "bg-secondary text-white" : "bg-gray-200 text-gray-700"
          }`}>
            {status}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-600">{cuisine}</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-1" />
            {distance}
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            Today 11AM-8PM
          </div>
        </div>
        <div className="flex space-x-2">
          <Button className="flex-1" variant="outline">View Menu</Button>
          <Button className="flex-1">Order Now</Button>
        </div>
      </div>
    </Card>
  );
};
