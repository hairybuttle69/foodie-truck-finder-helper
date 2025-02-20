
import { MapPinIcon, CalendarIcon, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { ReviewForm } from "./ReviewForm";
import { ReviewCard } from "./ReviewCard";

interface TruckCardProps {
  name: string;
  cuisine: string;
  distance: string;
  image: string;
  status: "open" | "closed";
}

export const TruckCard = ({ name, cuisine, distance, image, status }: TruckCardProps) => {
  const [reviews, setReviews] = useState([
    {
      author: "John D.",
      rating: 4,
      comment: "Great tacos and friendly service!",
      date: "2 days ago",
      media: []
    }
  ]);

  const handleReviewSubmit = async (review: { rating: number; comment: string; media?: File[] }) => {
    // Convert Files to URLs (in a real app, these would be uploaded to a server)
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
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-2"
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
    </Card>
  );
};
