import { toast } from "@/components/ui/use-toast";
import { MenuItem } from "./vendorManagement";
import { processStripePayment } from "./stripeIntegration";

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
  paymentStatus: "processing" | "completed" | "failed";
  transactionId?: string;
  paymentProcessor?: "stripe" | "manual";
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
  stripePaymentMethodId?: string;
}

export interface VendorAccount {
  vendorId: string;
  balance: number;
  pendingBalance: number;
  transactions: Transaction[];
}

export interface PlatformAccount {
  balance: number;
  pendingBalance: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  type: "payment" | "payout" | "refund";
  vendorId?: string;
  description: string;
}

const processPaymentWithGateway = async (
  amount: number, 
  paymentMethod: string, 
  cardDetails?: CardDetails
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  if (paymentMethod.includes('stripe')) {
    return { success: true, transactionId: `processed_outside` };
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const isSuccessful = Math.random() < 0.9;
      
      console.log(`Payment gateway ${isSuccessful ? 'succeeded' : 'failed'} for $${amount.toFixed(2)} using ${paymentMethod}`);
      
      if (isSuccessful) {
        resolve({ 
          success: true, 
          transactionId: `tx_${Math.random().toString(36).substr(2, 9)}`
        });
      } else {
        resolve({ 
          success: false, 
          error: "Payment declined by issuing bank. Please try again."
        });
      }
    }, 1500);
  });
};

export const getVendorAccounts = (): Record<string, VendorAccount> => {
  const accounts = localStorage.getItem('vendorAccounts');
  return accounts ? JSON.parse(accounts) : {};
};

export const saveVendorAccounts = (accounts: Record<string, VendorAccount>): void => {
  localStorage.setItem('vendorAccounts', JSON.stringify(accounts));
};

export const getPlatformAccount = (): PlatformAccount => {
  const account = localStorage.getItem('platformAccount');
  return account ? JSON.parse(account) : {
    balance: 0,
    pendingBalance: 0,
    transactions: []
  };
};

export const savePlatformAccount = (account: PlatformAccount): void => {
  localStorage.setItem('platformAccount', JSON.stringify(account));
};

export const initializeVendorAccount = (vendorId: string): VendorAccount => {
  const accounts = getVendorAccounts();
  
  if (!accounts[vendorId]) {
    accounts[vendorId] = {
      vendorId,
      balance: 0,
      pendingBalance: 0,
      transactions: []
    };
    saveVendorAccounts(accounts);
  }
  
  return accounts[vendorId];
};

export const getVendorBalance = (vendorId: string): { available: number; pending: number } => {
  const account = initializeVendorAccount(vendorId);
  return {
    available: account.balance,
    pending: account.pendingBalance
  };
};

const distributePayment = (
  orderId: string,
  vendorId: string,
  total: number,
  commission: number
): void => {
  const vendorAmount = total - commission;
  const transactionId = `tx_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();
  
  const accounts = getVendorAccounts();
  const vendorAccount = initializeVendorAccount(vendorId);
  
  vendorAccount.pendingBalance += vendorAmount;
  
  vendorAccount.transactions.push({
    id: transactionId,
    orderId,
    amount: total,
    fee: commission,
    netAmount: vendorAmount,
    status: "pending",
    createdAt: now,
    type: "payment",
    vendorId,
    description: `Payment for order ${orderId}`
  });
  
  accounts[vendorId] = vendorAccount;
  saveVendorAccounts(accounts);
  
  const platformAccount = getPlatformAccount();
  
  platformAccount.balance += commission;
  
  platformAccount.transactions.push({
    id: `${transactionId}_commission`,
    orderId,
    amount: commission,
    fee: 0,
    netAmount: commission,
    status: "completed",
    createdAt: now,
    type: "payment",
    vendorId,
    description: `Commission from order ${orderId}`
  });
  
  savePlatformAccount(platformAccount);
  
  console.log(`Payment distributed: $${vendorAmount.toFixed(2)} to vendor (pending), $${commission.toFixed(2)} to platform`);
};

export const finalizePayment = (orderId: string): boolean => {
  const orders = getOrders();
  const orderIndex = orders.findIndex((order: Order) => order.id === orderId);
  
  if (orderIndex === -1 || orders[orderIndex].status !== "completed") {
    return false;
  }
  
  const order = orders[orderIndex];
  const vendorId = order.vendorId;
  const vendorAmount = order.total - order.commission;
  
  const accounts = getVendorAccounts();
  const vendorAccount = accounts[vendorId];
  
  if (!vendorAccount) {
    return false;
  }
  
  vendorAccount.pendingBalance -= vendorAmount;
  vendorAccount.balance += vendorAmount;
  
  const transaction = vendorAccount.transactions.find(t => t.orderId === orderId);
  if (transaction) {
    transaction.status = "completed";
  }
  
  accounts[vendorId] = vendorAccount;
  saveVendorAccounts(accounts);
  
  orders[orderIndex].paymentStatus = "completed";
  saveOrders(orders);
  
  console.log(`Payment finalized: $${vendorAmount.toFixed(2)} moved to vendor available balance`);
  return true;
};

export const processRefund = (orderId: string): boolean => {
  const orders = getOrders();
  const orderIndex = orders.findIndex((order: Order) => order.id === orderId);
  
  if (orderIndex === -1 || orders[orderIndex].status !== "cancelled") {
    return false;
  }
  
  const order = orders[orderIndex];
  const vendorId = order.vendorId;
  const vendorAmount = order.total - order.commission;
  
  const accounts = getVendorAccounts();
  const vendorAccount = accounts[vendorId];
  
  if (!vendorAccount) {
    return false;
  }
  
  vendorAccount.pendingBalance -= vendorAmount;
  
  vendorAccount.transactions.push({
    id: `refund_${Math.random().toString(36).substr(2, 9)}`,
    orderId,
    amount: -vendorAmount,
    fee: 0,
    netAmount: -vendorAmount,
    status: "completed",
    createdAt: new Date(),
    type: "refund",
    vendorId,
    description: `Refund for order ${orderId}`
  });
  
  accounts[vendorId] = vendorAccount;
  saveVendorAccounts(accounts);
  
  const platformAccount = getPlatformAccount();
  platformAccount.balance -= order.commission;
  
  platformAccount.transactions.push({
    id: `refund_commission_${Math.random().toString(36).substr(2, 9)}`,
    orderId,
    amount: -order.commission,
    fee: 0,
    netAmount: -order.commission,
    status: "completed",
    createdAt: new Date(),
    type: "refund",
    vendorId,
    description: `Commission refund for order ${orderId}`
  });
  
  savePlatformAccount(platformAccount);
  
  orders[orderIndex].paymentStatus = "failed";
  saveOrders(orders);
  
  console.log(`Refund processed: $${vendorAmount.toFixed(2)} removed from vendor pending balance, $${order.commission.toFixed(2)} removed from platform balance`);
  return true;
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
    total,
    stripePaymentMethodId
  } = orderRequest;
  
  initializeVendorAccount(vendorId);
  
  let paymentResult;
  let paymentProcessor: "stripe" | "manual" = "manual";
  
  if (stripePaymentMethodId) {
    paymentProcessor = "stripe";
    
    paymentResult = await processStripePayment(
      stripePaymentMethodId,
      total * 100,
      'usd',
      `Order for ${truckName}`
    );
  } else {
    paymentResult = await processPaymentWithGateway(total, paymentMethod, cardDetails);
  }
  
  if (!paymentResult.success) {
    throw new Error(paymentResult.error || "Payment processing failed");
  }
  
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
    paymentStatus: "completed",
    transactionId: paymentResult.transactionId,
    paymentProcessor,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const existingOrders = getOrders();
  saveOrders([...existingOrders, newOrder]);
  
  distributePayment(newOrder.id, vendorId, total, commission);
  
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
  
  if (status === "completed") {
    finalizePayment(orderId);
  } else if (status === "cancelled") {
    processRefund(orderId);
  }
  
  toast({
    title: "Order updated",
    description: `Order status changed to ${status}.`
  });
  
  return updatedOrder;
};

const sendVendorNotification = (vendorId: string, order: Order): void => {
  console.log(`Notification sent to vendor ${vendorId} about new order ${order.id}`);
  
  if (localStorage.getItem('currentVendorId') === vendorId) {
    toast({
      title: "New order received!",
      description: `Order #${order.id.substring(0, 8)} for ${order.customerInfo.name} - $${order.total.toFixed(2)}`,
    });
  }
};
