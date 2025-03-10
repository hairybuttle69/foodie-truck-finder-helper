
import { loadStripe } from '@stripe/stripe-js';
import { CardDetails, OrderRequest } from './orderManagement';

// Replace with your actual publishable key when in production
// This is a test publishable key which is safe to include in frontend code
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51OilseKcqd64M09GHEY0V9tCJTWibMSuXgzqgBfJNfqirgzaYg2X7gAa1fYjw7fHH39Yq7TZDzPJLJkTvXvfQmxX00KZfXXdys';

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Function to create a payment method using Stripe Elements
export const createPaymentMethod = async (
  stripe: any, 
  elements: any
): Promise<{ success: boolean; paymentMethodId?: string; error?: string }> => {
  if (!stripe || !elements) {
    return { success: false, error: 'Stripe not initialized' };
  }

  const cardElement = elements.getElement('card');
  
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });

  if (error) {
    console.error('Error creating payment method:', error);
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    paymentMethodId: paymentMethod.id 
  };
};

// Simulate a server-side process payment function
// In a real implementation, this would be an API call to your backend
export const processStripePayment = async (
  paymentMethodId: string,
  amount: number,
  currency: string = 'usd',
  description: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  console.log(`Processing Stripe payment with payment method: ${paymentMethodId}`);
  console.log(`Amount: ${amount}, Currency: ${currency}, Description: ${description}`);
  
  // Simulate API call to backend/server
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful payment most of the time
      const isSuccessful = Math.random() < 0.9;
      
      if (isSuccessful) {
        // Generate a fake transaction ID that looks like a Stripe payment intent ID
        const transactionId = `pi_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        resolve({ 
          success: true, 
          transactionId 
        });
      } else {
        resolve({ 
          success: false, 
          error: "Payment processing failed. Please try again."
        });
      }
    }, 1500);
  });
};

// Convert order details to Stripe-compatible format
export const prepareStripePayment = (orderRequest: OrderRequest) => {
  return {
    amount: orderRequest.total * 100, // Stripe requires amount in cents
    currency: 'usd',
    description: `Order for ${orderRequest.truckName}`,
    metadata: {
      truckId: orderRequest.truckId,
      vendorId: orderRequest.vendorId,
      customerName: orderRequest.customerInfo.name,
      customerEmail: orderRequest.customerInfo.email
    }
  };
};
