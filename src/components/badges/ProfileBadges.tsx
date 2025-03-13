
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Award, Badge as BadgeIcon, BadgeCheck, Star, Trophy } from "lucide-react";
import { getEarnedBadges, BADGES, Badge as BadgeType } from "@/utils/badgeService";
import { UserBadges } from "./UserBadges";

interface ProfileBadgesProps {
  userId: string;
  userName: string;
}

export const ProfileBadges: React.FC<ProfileBadgesProps> = ({ userId, userName }) => {
  const badges = getEarnedBadges(userId);
  
  const getIconForBadge = (iconName: string) => {
    switch (iconName) {
      case 'award':
        return <Award className="h-5 w-5" />;
      case 'badge':
        return <BadgeIcon className="h-5 w-5" />;
      case 'badge-check':
        return <BadgeCheck className="h-5 w-5" />;
      case 'star':
        return <Star className="h-5 w-5" />;
      case 'trophy':
        return <Trophy className="h-5 w-5" />;
      default:
        return <BadgeIcon className="h-5 w-5" />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-90">
          <Badge variant="outline" className="px-2 py-1">
            <Award className="h-4 w-4 mr-1" />
            <span>{badges.length} Badges</span>
          </Badge>
          <UserBadges userId={userId} limit={3} />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{userName}'s Badges</DialogTitle>
          <DialogDescription>
            Achievements earned through food truck orders and reviews
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {badges.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {badges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-3 p-2 rounded-md border">
                  <div className="p-2 bg-muted rounded-full">
                    {getIconForBadge(badge.icon)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{badge.name}</h4>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4">
              <BadgeIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No badges earned yet</p>
            </div>
          )}
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Available Badges</h4>
          <div className="grid grid-cols-1 gap-2">
            {BADGES.filter(b => !badges.some(earned => earned.id === b.id)).map((badge) => (
              <div key={badge.id} className="flex items-center gap-3 p-2 rounded-md border border-dashed">
                <div className="p-2 bg-muted rounded-full opacity-50">
                  {getIconForBadge(badge.icon)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-muted-foreground">{badge.name}</h4>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
