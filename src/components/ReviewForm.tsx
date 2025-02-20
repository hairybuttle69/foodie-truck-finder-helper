
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";

interface ReviewFormProps {
  onSubmit: (review: { rating: number; comment: string }) => void;
}

export const ReviewForm = ({ onSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            className="focus:outline-none"
            onMouseEnter={() => setHoveredRating(i + 1)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(i + 1)}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                i < (hoveredRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        className="min-h-[100px]"
      />
      <Button
        type="submit"
        disabled={rating === 0}
        className="w-full"
      >
        Submit Review
      </Button>
    </form>
  );
};
