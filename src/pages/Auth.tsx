
import { useState } from "react";
import { SignIn, useUser } from "@clerk/clerk-react";
import { ProfileSetup } from "@/components/ProfileSetup";
import { Navigate } from "react-router-dom";

const Auth = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const [hasProfile, setHasProfile] = useState(false);

  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Welcome to FoodTruck Finder</h1>
            <p className="text-gray-600">Sign in to discover food trucks near you</p>
          </div>
          <SignIn path="/auth" routing="path" signUpUrl="/auth?sign-up=true" />
        </div>
      </div>
    );
  }

  if (isSignedIn && !hasProfile) {
    return <ProfileSetup onComplete={() => setHasProfile(true)} />;
  }

  return <Navigate to="/" replace />;
};

export default Auth;
