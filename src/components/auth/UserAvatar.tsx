
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Award } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Badge as BadgeType, BADGES, getUserBadges, markBadgeAsDisplayed } from "@/utils/badgeService";
import { UserBadges } from "@/components/badges/UserBadges";

export const UserAvatar = () => {
  const { user, signOut } = useAuth();
  
  useEffect(() => {
    if (user) {
      // Check for undisplayed badges to notify the user
      const userData = getUserBadges(user.id);
      const undisplayedBadges = Object.entries(userData.badges)
        .filter(([_, data]) => !data.displayed)
        .map(([badgeId]) => {
          return BADGES.find(badge => badge.id === badgeId);
        })
        .filter((badge): badge is BadgeType => badge !== undefined);
      
      // Notify and mark as displayed
      undisplayedBadges.forEach(badge => {
        toast({
          title: `🎖️ New Badge Earned: ${badge.name}`,
          description: badge.description,
          duration: 5000
        });
        markBadgeAsDisplayed(user.id, badge.id);
      });
    }
  }, [user]);
  
  if (!user) return null;
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem signing out.",
        variant: "destructive",
      });
    }
  };
  
  const getInitials = () => {
    if (user.name) {
      return user.name
        .split(" ")
        .map(name => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return user.email.substring(0, 2).toUpperCase();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-9 w-9 cursor-pointer">
          <AvatarImage src={user.photoUrl} alt={user.name || user.email} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium">
          <div className="flex flex-col space-y-1">
            <p className="text-foreground truncate">{user.name || "User"}</p>
            <p className="text-muted-foreground text-xs truncate">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <div className="flex items-center gap-2 mb-1">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Your Badges</span>
          </div>
          <UserBadges userId={user.id} showLabels={true} className="mb-1" />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>Favorites</DropdownMenuItem>
        <DropdownMenuItem>Order History</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
