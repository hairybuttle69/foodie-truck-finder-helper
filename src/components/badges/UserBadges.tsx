
import React from "react";
import { Award, Badge as BadgeIcon, BadgeCheck, Star, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge as BadgeType, getEarnedBadges } from "@/utils/badgeService";

interface UserBadgesProps {
  userId: string;
  limit?: number;
  showLabels?: boolean;
  className?: string;
}

export const UserBadges: React.FC<UserBadgesProps> = ({ 
  userId, 
  limit, 
  showLabels = false,
  className = ""
}) => {
  const badges = getEarnedBadges(userId);
  const displayBadges = limit ? badges.slice(0, limit) : badges;
  
  if (displayBadges.length === 0) {
    return null;
  }

  const getIconForBadge = (iconName: string) => {
    switch (iconName) {
      case 'award':
        return <Award className="h-4 w-4" />;
      case 'badge':
        return <BadgeIcon className="h-4 w-4" />;
      case 'badge-check':
        return <BadgeCheck className="h-4 w-4" />;
      case 'star':
        return <Star className="h-4 w-4" />;
      case 'trophy':
        return <Trophy className="h-4 w-4" />;
      default:
        return <BadgeIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {displayBadges.map((badge) => (
        <TooltipProvider key={badge.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="px-2 py-1">
                {getIconForBadge(badge.icon)}
                {showLabels && <span className="ml-1 text-xs">{badge.name}</span>}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{badge.name}</p>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      
      {limit && badges.length > limit && (
        <Badge variant="outline" className="px-2 py-1">
          +{badges.length - limit}
        </Badge>
      )}
    </div>
  );
};
