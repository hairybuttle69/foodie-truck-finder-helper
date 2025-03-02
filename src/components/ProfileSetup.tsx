
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapPin } from "lucide-react";

interface ProfileSetupProps {
  onComplete: () => void;
}

export const ProfileSetup = ({ onComplete }: ProfileSetupProps) => {
  const { user } = useUser();
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLocationRequest = () => {
    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationPermission(true);
        toast.success("Location access granted!");
        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationPermission(false);
        toast.error("Please enable location services to find food trucks near you");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleComplete = () => {
    if (locationPermission === null) {
      toast.error("Please respond to the location request");
      return;
    }
    
    // Complete profile setup even if user denied location
    onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>
        
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-gray-500">
                  {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "?"}
                </span>
              )}
            </div>
            <p className="font-medium">Welcome, {user?.firstName || user?.username}!</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input 
              id="displayName" 
              defaultValue={user?.firstName || user?.username || ""} 
              placeholder="How should we call you?"
            />
          </div>

          <div className="border rounded-lg p-4 mt-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Location Services</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Allow access to your location to discover food trucks near you
                </p>
                
                {locationPermission === null ? (
                  <Button 
                    onClick={handleLocationRequest}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Requesting..." : "Enable Location"}
                  </Button>
                ) : locationPermission ? (
                  <div className="text-green-600 text-sm font-medium">
                    Location access granted ✓
                  </div>
                ) : (
                  <div className="text-amber-600 text-sm font-medium">
                    Location access denied. Some features may be limited.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleComplete}
          className="w-full mt-6"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
};
