
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { TruckCard } from '@/components/TruckCard';
import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [isVendorMode, setIsVendorMode] = useState(false);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const storedFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
      setFavorites(storedFavorites);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Please sign in to view your favorites</h1>
          <p className="text-muted-foreground mb-4">You need to be logged in to access this page</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header 
        onMapToggle={() => setShowMap(!showMap)} 
        showMap={showMap}
        isVendorMode={isVendorMode}
        onVendorModeToggle={() => setIsVendorMode(!isVendorMode)}
        isDeveloperMode={isDeveloperMode}
        onDeveloperModeToggle={() => setIsDeveloperMode(!isDeveloperMode)}
      />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            Your Favorite Spots
            <Heart className="ml-3 h-6 w-6 fill-current text-red-500" />
          </h1>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((truck) => (
              <TruckCard
                key={truck.id}
                id={truck.id}
                name={truck.name}
                cuisine={truck.cuisine}
                distance={truck.distance}
                image={truck.image}
                status={truck.status}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">Click the heart icon on any food truck to add it to your favorites</p>
            <Button onClick={() => navigate('/')}>
              Explore Food Trucks
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Favorites;
