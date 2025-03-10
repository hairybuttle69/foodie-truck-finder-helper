
import { toast } from "@/components/ui/use-toast";
import { MenuItem } from "./vendorManagement";

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  pickupTime: string;
}

export interface CardDetails {
  number: string;
  expiry: string;
  cvc: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  truckId: string;
  truckName: string;
  vendorId: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  paymentMethod: string;
  subtotal: number;
  commission: number;
  total: number;
  status: "pending" | "accepted" | "ready" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderRequest {
  truckId: string;
  truckName: string;
  vendorId: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  paymentMethod: string;
  cardDetails?: CardDetails;
  subtotal: number;
  commission: number;
  total: number;
}

// Simulate payment processing
const processPayment = async (amount: number, paymentMethod: string, cardDetails?: CardDetails): Promise<boolean> => {
  // In a real app, this would integrate with a payment processor API
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Simulate occasional payment failures (10% chance)
      const isSuccessful = Math.random() < 0.9;
      console.log(`Payment ${isSuccessful ? 'succeeded' : 'failed'} for $${amount.toFixed(2)} using ${paymentMethod}`);
      resolve(isSuccessful);
    }, 1500);
  });
};

export const getOrders = (truckId?: string): Order[] => {
  const orders = localStorage.getItem('orders');
  const allOrders = orders ? JSON.parse(orders) : [];
  
  return truckId ? allOrders.filter((order: Order) => order.truckId === truckId) : allOrders;
};

export const saveOrders = (orders: Order[]): void => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const getVendorOrders = (vendorId: string): Order[] => {
  const allOrders = getOrders();
  return allOrders.filter(order => order.vendorId === vendorId);
};

export const processOrder = async (orderRequest: OrderRequest): Promise<Order> => {
  const { 
    truckId, 
    truckName, 
    vendorId, 
    items, 
    customerInfo, 
    paymentMethod, 
    cardDetails, 
    subtotal, 
    commission, 
    total 
  } = orderRequest;
  
  // Process payment first
  const paymentSuccessful = await processPayment(total, paymentMethod, cardDetails);
  
  if (!paymentSuccessful) {
    throw new Error("Payment processing failed");
  }
  
  // Create new order
  const newOrder: Order = {
    id: crypto.randomUUID(),
    truckId,
    truckName,
    vendorId,
    items,
    customerInfo,
    paymentMethod,
    subtotal,
    commission,
    total,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Save order
  const existingOrders = getOrders();
  saveOrders([...existingOrders, newOrder]);
  
  // Send notification to vendor (simulated)
  sendVendorNotification(vendorId, newOrder);
  
  return newOrder;
};

export const updateOrderStatus = (
  orderId: string, 
  status: "pending" | "accepted" | "ready" | "completed" | "cancelled"
): Order | null => {
  const orders = getOrders();
  const orderIndex = orders.findIndex((order: Order) => order.id === orderId);
  
  if (orderIndex === -1) {
    toast({
      title: "Order not found",
      description: "The order you're trying to update doesn't exist.",
      variant: "destructive"
    });
    return null;
  }
  
  const updatedOrder = {
    ...orders[orderIndex],
    status,
    updatedAt: new Date()
  };
  
  orders[orderIndex] = updatedOrder;
  saveOrders(orders);
  
  toast({
    title: "Order updated",
    description: `Order status changed to ${status}.`
  });
  
  return updatedOrder;
};

// Simulate sending notification to vendor
const sendVendorNotification = (vendorId: string, order: Order): void => {
  console.log(`Notification sent to vendor ${vendorId} about new order ${order.id}`);
  
  // In a real app, this would:
  // 1. Send a push notification 
  // 2. Send an email notification
  // 3. Update a real-time database to trigger UI updates
  
  // For our demo, we'll just show a toast notification if the vendor is viewing the app
  if (localStorage.getItem('currentVendorId') === vendorId) {
    toast({
      title: "New order received!",
      description: `Order #${order.id.substring(0, 8)} for ${order.customerInfo.name} - $${order.total.toFixed(2)}`,
    });
  }
};
