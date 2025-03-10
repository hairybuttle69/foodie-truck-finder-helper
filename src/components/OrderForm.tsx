
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { CheckCircle, CreditCard, Smartphone, Loader2 } from "lucide-react";
import { MenuItem } from "@/utils/vendorManagement";
import { processOrder } from "@/utils/orderManagement";
import { toast } from "./ui/use-toast";
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise, createPaymentMethod, prepareStripePayment, processStripePayment } from "@/utils/stripeIntegration";
import { StripeCardForm } from "./payments/StripeCardForm";

interface OrderItem extends MenuItem {
  quantity: number;
}

interface OrderFormProps {
  truckId: string;
  truckName: string;
  vendorId: string;
  menuItems: MenuItem[];
  onClose: () => void;
}

// Wrapper component that provides Stripe context
export const OrderForm = (props: OrderFormProps) => {
  return (
    <Elements stripe={stripePromise}>
      <OrderFormContent {...props} />
    </Elements>
  );
};

// Main component inside Stripe context
const OrderFormContent = ({ truckId, truckName, vendorId, menuItems, onClose }: OrderFormProps) => {
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "apple-pay" | "google-pay">("credit-card");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    pickupTime: ""
  });
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: ""
  });
  const [currentStep, setCurrentStep] = useState<"select-items" | "customer-info" | "payment" | "confirmation">("select-items");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState({
    orderNumber: "",
    orderTime: new Date()
  });
  const [cardError, setCardError] = useState<string | null>(null);
  
  // Get Stripe objects from the context
  const stripe = useStripe();
  const elements = useElements();
  
  const availableItems = menuItems.filter(item => item.available);
  
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const commission = subtotal * 0.05; // 5% commission
  const total = subtotal + commission;

  const handleAddItem = (item: MenuItem) => {
    const existingItemIndex = selectedItems.findIndex(i => i.id === item.id);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1
      };
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const existingItemIndex = selectedItems.findIndex(i => i.id === itemId);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      
      if (updatedItems[existingItemIndex].quantity > 1) {
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity - 1
        };
        setSelectedItems(updatedItems);
      } else {
        setSelectedItems(updatedItems.filter(i => i.id !== itemId));
      }
    }
  };

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    if (currentStep === "select-items") {
      if (selectedItems.length === 0) {
        toast({
          title: "No items selected",
          description: "Please select at least one item to continue.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep("customer-info");
    } else if (currentStep === "customer-info") {
      if (!customerInfo.name || !customerInfo.phone || !customerInfo.email || !customerInfo.pickupTime) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields to continue.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep("payment");
    }
  };

  const handleCardChange = (event: any) => {
    setCardError(event.error ? event.error.message : null);
  };

  const handleSubmitOrder = async () => {
    if (!stripe || !elements) {
      toast({
        title: "Payment system unavailable",
        description: "The payment system is currently unavailable. Please try again later.",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === "credit-card" && cardError) {
      toast({
        title: "Invalid card details",
        description: cardError,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      let paymentProcessResult;
      
      if (paymentMethod === "credit-card") {
        // Create a payment method using Stripe Elements
        const paymentMethodResult = await createPaymentMethod(stripe, elements);
        
        if (!paymentMethodResult.success) {
          throw new Error(paymentMethodResult.error || "Failed to create payment method");
        }
        
        // Prepare the order details for Stripe
        const stripePaymentDetails = prepareStripePayment({
          truckId,
          truckName,
          vendorId,
          items: selectedItems,
          customerInfo,
          paymentMethod,
          subtotal,
          commission,
          total
        });
        
        // Process the payment with Stripe
        paymentProcessResult = await processStripePayment(
          paymentMethodResult.paymentMethodId!,
          stripePaymentDetails.amount,
          stripePaymentDetails.currency,
          stripePaymentDetails.description
        );
      } else {
        // For Apple Pay and Google Pay, use the existing payment processing for now
        // In a real implementation, you would use Stripe's Apple Pay and Google Pay integrations
        paymentProcessResult = { success: true, transactionId: `tx_${Math.random().toString(36).substr(2, 9)}` };
      }
      
      if (!paymentProcessResult.success) {
        throw new Error(paymentProcessResult.error || "Payment processing failed");
      }

      // Process the order in the system
      const order = await processOrder({
        truckId,
        truckName,
        vendorId,
        items: selectedItems,
        customerInfo,
        paymentMethod,
        cardDetails: paymentMethod === "credit-card" ? cardDetails : undefined,
        subtotal,
        commission,
        total
      });

      // Set order confirmation details
      setOrderConfirmation({
        orderNumber: order.id.substring(0, 8).toUpperCase(),
        orderTime: new Date()
      });

      toast({
        title: "Payment successful",
        description: `Your payment of $${total.toFixed(2)} has been processed successfully.`,
      });

      setCurrentStep("confirmation");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "There was an error processing your payment";
      
      toast({
        title: "Payment failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewOrder = () => {
    setSelectedItems([]);
    setCustomerInfo({
      name: "",
      phone: "",
      email: "",
      pickupTime: ""
    });
    setCardDetails({
      number: "",
      expiry: "",
      cvc: ""
    });
    setCurrentStep("select-items");
  };

  const itemsByCategory: Record<string, MenuItem[]> = availableItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-6">
      {currentStep === "select-items" && (
        <>
          <h3 className="text-lg font-medium">Select Items</h3>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6">
              {availableItems.length > 0 ? (
                Object.entries(itemsByCategory).map(([category, items]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="text-base font-medium">{category}</h4>
                    <div className="space-y-2">
                      {items.map(item => {
                        const selectedItem = selectedItems.find(i => i.id === item.id);
                        const quantity = selectedItem?.quantity || 0;
                        
                        return (
                          <Card key={item.id} className="p-3">
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span className="font-medium">{item.name}</span>
                                  <span>${item.price.toFixed(2)}</span>
                                </div>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-2 ml-4">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleRemoveItem(item.id)}
                                  disabled={quantity === 0}
                                >
                                  -
                                </Button>
                                <span className="w-6 text-center">{quantity}</span>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleAddItem(item)}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No menu items available at this time.</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {selectedItems.length > 0 && (
            <div className="space-y-3 pt-4">
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Service Fee (5%)</span>
                <span>${commission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button className="w-full" onClick={handleContinue}>Continue</Button>
            </div>
          )}
        </>
      )}

      {currentStep === "customer-info" && (
        <>
          <h3 className="text-lg font-medium">Customer Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                name="name"
                value={customerInfo.name}
                onChange={handleCustomerInfoChange}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone"
                name="phone"
                value={customerInfo.phone}
                onChange={handleCustomerInfoChange}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={customerInfo.email}
                onChange={handleCustomerInfoChange}
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <Label htmlFor="pickupTime">Pickup Time</Label>
              <Input 
                id="pickupTime"
                name="pickupTime"
                type="time"
                value={customerInfo.pickupTime}
                onChange={handleCustomerInfoChange}
              />
            </div>
          </div>
          
          <div className="pt-4 space-y-2">
            <Button className="w-full" onClick={handleContinue}>Continue to Payment</Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setCurrentStep("select-items")}
            >
              Back
            </Button>
          </div>
        </>
      )}

      {currentStep === "payment" && (
        <>
          <h3 className="text-lg font-medium">Payment</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Card 
                className={`p-3 cursor-pointer ${paymentMethod === "credit-card" ? "border-primary" : ""}`}
                onClick={() => setPaymentMethod("credit-card")}
              >
                <div className="flex flex-col items-center justify-center h-20">
                  <CreditCard className="h-6 w-6 mb-2" />
                  <span className="text-sm">Credit Card</span>
                </div>
              </Card>
              <Card 
                className={`p-3 cursor-pointer ${paymentMethod === "apple-pay" ? "border-primary" : ""}`}
                onClick={() => setPaymentMethod("apple-pay")}
              >
                <div className="flex flex-col items-center justify-center h-20">
                  <Smartphone className="h-6 w-6 mb-2" />
                  <span className="text-sm">Apple Pay</span>
                </div>
              </Card>
              <Card 
                className={`p-3 cursor-pointer ${paymentMethod === "google-pay" ? "border-primary" : ""}`}
                onClick={() => setPaymentMethod("google-pay")}
              >
                <div className="flex flex-col items-center justify-center h-20">
                  <Smartphone className="h-6 w-6 mb-2" />
                  <span className="text-sm">Google Pay</span>
                </div>
              </Card>
            </div>
            
            {paymentMethod === "credit-card" && (
              <StripeCardForm onChange={handleCardChange} />
            )}
            
            {(paymentMethod === "apple-pay" || paymentMethod === "google-pay") && (
              <div className="text-center py-6 text-muted-foreground">
                <p>You'll be redirected to complete your payment when you click "Pay Now".</p>
              </div>
            )}
            
            <div className="space-y-3 pt-4">
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Service Fee (5%)</span>
                <span>${commission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button 
                className="w-full" 
                onClick={handleSubmitOrder}
                disabled={isProcessing || !stripe || !elements}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setCurrentStep("customer-info")}
                disabled={isProcessing}
              >
                Back
              </Button>
              
              <div className="text-xs text-muted-foreground text-center pt-2">
                <p>Payment is processed securely. 5% of the total amount goes to Spot as a service fee.</p>
              </div>
            </div>
          </div>
        </>
      )}

      {currentStep === "confirmation" && (
        <div className="text-center space-y-6 py-10">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">Order Confirmed!</h3>
            <p className="text-muted-foreground">
              Your order has been placed successfully. You'll receive a confirmation email shortly.
            </p>
          </div>
          
          <div className="py-4">
            <h4 className="text-lg font-medium">Order Details</h4>
            <div className="text-start mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Order Number:</span>
                <span className="font-medium">{orderConfirmation.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Pickup Time:</span>
                <span className="font-medium">{customerInfo.pickupTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 space-y-2">
            <Button className="w-full" onClick={handleNewOrder}>Place Another Order</Button>
            <Button variant="outline" className="w-full" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
