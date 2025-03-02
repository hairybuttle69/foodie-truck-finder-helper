
import { MapIcon, TruckIcon, MenuIcon, ChefHat } from "lucide-react";
import { Button } from "./ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { useState } from "react";

interface HeaderProps {
  onMapToggle: () => void;
  showMap: boolean;
  isVendorMode: boolean;
  onVendorModeToggle: () => void;
}

export const Header = ({ onMapToggle, showMap, isVendorMode, onVendorModeToggle }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TruckIcon className="w-6 h-6 text-primary" />
          <span className="text-xl font-semibold">FoodTruck Finder</span>
          {isVendorMode && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-white">
              <ChefHat className="mr-1 h-3 w-3" />
              Vendor Mode
            </span>
          )}
        </div>
        <nav className="flex items-center space-x-4">
          {!isVendorMode && (
            <Button
              variant={showMap ? "default" : "ghost"}
              className="flex items-center space-x-2"
              onClick={onMapToggle}
            >
              <MapIcon className="w-5 h-5" />
              <span>{showMap ? "List View" : "Map View"}</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <MenuIcon className="w-5 h-5" />
                <span>Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Favorites</DropdownMenuItem>
              <DropdownMenuItem>Order History</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onVendorModeToggle}>
                {isVendorMode ? "Switch to Customer Mode" : "Switch to Vendor Mode"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};
