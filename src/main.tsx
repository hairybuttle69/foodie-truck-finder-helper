
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// Using the provided Clerk publishable key
const PUBLISHABLE_KEY = 'pk_test_Y2xldmVyLXRhaHItMTEuY2xlcmsuYWNjb3VudHMuZGV2JA';

// Debug the Clerk key
console.log("Clerk key available:", !!PUBLISHABLE_KEY);

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    routing="path"
    navigationFallback={<div>Loading...</div>}
  >
    <App />
  </ClerkProvider>
);
