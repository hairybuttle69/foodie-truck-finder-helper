
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Improved loading component with fallback timeout
const LoadingScreen = () => (
  <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
    <p className="text-gray-600">Loading FoodTruck Finder...</p>
  </div>
);

const AuthenticatedRoutes = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [authChecked, setAuthChecked] = useState(false);
  
  // Add initial logging to debug authentication state
  useEffect(() => {
    console.log("Auth state:", { isLoaded, isSignedIn, userId: user?.id });
    
    // Set a timeout to prevent indefinite loading state
    const timer = setTimeout(() => {
      if (!authChecked) {
        console.log("Auth check timeout reached, forcing render");
        setAuthChecked(true);
      }
    }, 3000);
    
    // If auth is loaded, clear timeout and set checked
    if (isLoaded) {
      clearTimeout(timer);
      setAuthChecked(true);
    }
    
    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn, user, authChecked]);

  // Show loading only for a reasonable time
  if (!isLoaded && !authChecked) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <>
            <SignedIn>
              <Index />
            </SignedIn>
            <SignedOut>
              <Navigate to="/auth" replace />
            </SignedOut>
          </>
        } 
      />
      <Route path="/auth" element={<Auth />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ClerkLoading>
          <LoadingScreen />
        </ClerkLoading>
        <ClerkLoaded>
          <AuthenticatedRoutes />
        </ClerkLoaded>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
