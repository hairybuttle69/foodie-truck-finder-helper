
import { MapIcon, TruckIcon, MenuIcon, ChefHat, CodeIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { LoginModal } from "./LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import { UserAvatar } from "./auth/UserAvatar";

interface HeaderProps {
  onMapToggle: () => void;
  showMap: boolean;
  isVendorMode: boolean;
  onVendorModeToggle: () => void;
  isDeveloperMode: boolean;
  onDeveloperModeToggle: () => void;
}

export const Header = ({ 
  onMapToggle, 
  showMap, 
  isVendorMode, 
  onVendorModeToggle,
  isDeveloperMode,
  onDeveloperModeToggle
}: HeaderProps) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { user } = useAuth();

  const handleDeveloperModeToggle = () => {
    setMenuOpen(false); // Close the dropdown menu first
    
    if (!isDeveloperMode) {
      // If not in developer mode, show login modal
      setShowLoginModal(true);
    } else {
      // If already in developer mode, simply toggle it off
      onDeveloperModeToggle();
    }
  };

  const handleVendorModeToggle = () => {
    setMenuOpen(false); // Close the dropdown menu first
    onVendorModeToggle();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TruckIcon className="w-6 h-6 text-primary" />
          <span className="text-xl font-semibold">The Spot</span>
          {isVendorMode && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-white">
              <ChefHat className="mr-1 h-3 w-3" />
              Vendor Mode
            </span>
          )}
          {isDeveloperMode && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500 text-white">
              <CodeIcon className="mr-1 h-3 w-3" />
              Developer Mode
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
              <span className="hidden sm:inline">{showMap ? "List View" : "Map View"}</span>
            </Button>
          )}

          {/* Always show UserAvatar since authentication is required */}
          <UserAvatar />

          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <MenuIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Favorites</DropdownMenuItem>
              <DropdownMenuItem>Order History</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleVendorModeToggle}>
                {isVendorMode ? "Switch to Customer Mode" : "Switch to Vendor Mode"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeveloperModeToggle}>
                {isDeveloperMode ? "Exit Developer Mode" : "Enter Developer Mode"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onSuccess={() => {
          setShowLoginModal(false);
          onDeveloperModeToggle();
        }} 
      />
    </header>
  );
};
