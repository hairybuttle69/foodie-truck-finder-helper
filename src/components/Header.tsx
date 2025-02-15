
import { MapIcon, TruckIcon, MenuIcon } from "lucide-react";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TruckIcon className="w-6 h-6 text-primary" />
          <span className="text-xl font-semibold">FoodTruck Finder</span>
        </div>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" className="flex items-center space-x-2">
            <MapIcon className="w-5 h-5" />
            <span>Map</span>
          </Button>
          <Button variant="ghost" className="flex items-center space-x-2">
            <MenuIcon className="w-5 h-5" />
            <span>Menu</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};
