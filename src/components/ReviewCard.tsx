
import { Star } from "lucide-react";
import { Card } from "./ui/card";

interface ReviewCardProps {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export const ReviewCard = ({ author, rating, comment, date }: ReviewCardProps) => {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{author}</span>
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
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <p className="text-gray-600">{comment}</p>
    </Card>
  );
};
