
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Star, ImagePlus, X } from "lucide-react";
import { Input } from "./ui/input";

interface ReviewFormProps {
  onSubmit: (review: { rating: number; comment: string; media?: File[] }) => void;
}

export const ReviewForm = ({ onSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ rating, comment, media: selectedFiles });
    setRating(0);
    setComment("");
    setSelectedFiles([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isUnder5MB = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValid && isUnder5MB;
    });
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
      <div className="space-y-2">
        <label htmlFor="media-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ImagePlus className="w-4 h-4" />
            <span>Add photos or videos</span>
          </div>
          <Input
            id="media-upload"
            type="file"
            className="hidden"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
          />
        </label>
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
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
