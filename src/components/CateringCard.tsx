
import { MapPinIcon, CalendarIcon, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface CateringCardProps {
  name: string;
  cuisine: string;
  distance: string;
  image: string;
  status: "open" | "closed";
}

export const CateringCard = ({ name, cuisine, distance, image }: CateringCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in">
      <div className="relative h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500 text-white">
            Catering Available
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
            <Clock className="w-4 h-4 mr-1" />
            2 day advance notice
          </div>
        </div>
        <div className="space-y-2">
          <Button className="w-full" variant="outline">View Catering Menu</Button>
          <Button className="w-full">Schedule Catering</Button>
        </div>
        <div className="text-sm text-gray-600">
          <p>• Minimum 20 people</p>
          <p>• Customizable menu options</p>
          <p>• Full service available</p>
        </div>
      </div>
    </Card>
  );
};
