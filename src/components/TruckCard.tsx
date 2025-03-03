import { MapPinIcon, CalendarIcon, MessageSquare, Calendar, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { ReviewForm } from "./ReviewForm";
import { ReviewCard } from "./ReviewCard";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";

interface TruckCardProps {
  name: string;
  cuisine: string;
  distance: string;
  image: string;
  status: "open" | "closed";
  isDeveloperMode?: boolean;
}

export const TruckCard = ({ 
  name, 
  cuisine, 
  distance, 
  image, 
  status, 
  isDeveloperMode = false 
}: TruckCardProps) => {
  const [reviews, setReviews] = useState([
    {
      author: "John D.",
      rating: 4,
      comment: "Great tacos and friendly service!",
      date: "2 days ago",
      media: []
    }
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [locations, setLocations] = useState<Record<string, string>>({
    [new Date().toISOString().split('T')[0]]: "Main St & 5th Ave",
    [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: "Downtown Food Court"
  });
  const [newLocation, setNewLocation] = useState("");

  const handleReviewSubmit = async (review: { rating: number; comment: string; media?: File[] }) => {
    const mediaUrls = await Promise.all((review.media || []).map(async (file) => ({
      type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
      url: URL.createObjectURL(file)
    })));

    setReviews([
      {
        author: "You",
        rating: review.rating,
        comment: review.comment,
        date: "Just now",
        media: mediaUrls
      },
      ...reviews
    ]);
  };

  const handleLocationUpdate = () => {
    if (!selectedDate || !newLocation.trim()) return;
    
    const dateKey = selectedDate.toISOString().split('T')[0];
    setLocations(prev => ({
      ...prev,
      [dateKey]: newLocation
    }));
    setNewLocation("");
  };

  const handleDelete = () => {
    toast({
      title: "Establishment deleted",
      description: `${name} has been removed from the listings.`,
    });
  };

  const currentDateKey = selectedDate?.toISOString().split('T')[0];
  const currentLocation = currentDateKey ? locations[currentDateKey] : undefined;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in relative">
      {isDeveloperMode && (
        <Button 
          variant="destructive" 
          size="sm" 
          className="absolute top-2 left-2 z-10 opacity-90 hover:opacity-100"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
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

        <div className="flex space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Locations
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{name} - Locations Schedule</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex flex-col space-y-4">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                  
                  {currentDateKey && (
                    <div className="p-3 border rounded-md bg-muted/50">
                      <h4 className="font-medium mb-1">
                        {selectedDate?.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                      </h4>
                      <p className="text-sm">
                        {currentLocation ? (
                          <span className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1 text-secondary" />
                            {currentLocation}
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic">No location scheduled</span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Update Location</Label>
                    <div className="flex space-x-2">
                      <Input 
                        id="location"
                        value={newLocation} 
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="Enter location for selected date"
                        className="flex-1"
                      />
                      <Button onClick={handleLocationUpdate}>Save</Button>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Reviews ({reviews.length})
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Reviews for {name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <ReviewForm onSubmit={handleReviewSubmit} />
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <ReviewCard key={index} {...review} />
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </Card>
  );
};
