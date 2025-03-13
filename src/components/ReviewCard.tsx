
import { Star } from "lucide-react";
import { Card } from "./ui/card";
import { UserBadges } from "./badges/UserBadges";

interface ReviewCardProps {
  author: string;
  authorId: string; // This is the required prop that was missing
  rating: number;
  comment: string;
  date: string;
  media?: Array<{
    type: 'image' | 'video';
    url: string;
  }>;
}

export const ReviewCard = ({ author, authorId, rating, comment, date, media }: ReviewCardProps) => {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{author}</span>
              <UserBadges userId={authorId} limit={2} />
            </div>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <p className="text-gray-600">{comment}</p>
      {media && media.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {media.map((item, index) => (
            <div key={index} className="aspect-square rounded overflow-hidden">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={`Review ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
