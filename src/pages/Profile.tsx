
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileBadges } from '@/components/badges/ProfileBadges';
import { UserBadges } from '@/components/badges/UserBadges';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/Header';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [showMap, setShowMap] = useState(false);
  const [isVendorMode, setIsVendorMode] = useState(false);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Please sign in to view your profile</h1>
          <p className="text-muted-foreground mb-4">You need to be logged in to access this page</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update the user profile
    // For now, we'll just show a toast notification
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditing(false);
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
          <h1 className="text-3xl font-bold">Your Profile</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.photoUrl} alt={user.name || user.email} />
                  <AvatarFallback className="text-lg">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user.name || 'User'}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Your email"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Name</div>
                    <div className="col-span-2">{user.name || 'Not set'}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Email</div>
                    <div className="col-span-2">{user.email}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">User ID</div>
                    <div className="col-span-2 text-sm text-muted-foreground truncate">{user.id}</div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </CardFooter>
          </Card>
          
          {/* Badges Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Badges</CardTitle>
              <CardDescription>Achievements you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileBadges userId={user.id} userName={user.name || 'User'} />
              <Separator className="my-4" />
              <div className="space-y-4">
                <h3 className="font-medium">Recent Activity</h3>
                <div className="text-sm text-muted-foreground">
                  Continue ordering and leaving reviews to earn more badges!
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Profile;
