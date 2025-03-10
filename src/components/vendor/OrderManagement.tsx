
import { useState, useEffect } from "react";
import { getVendorOrders, Order, updateOrderStatus } from "@/utils/orderManagement";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

interface OrderManagementProps {
  vendorId: string;
}

export function OrderManagement({ vendorId }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("pending");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  
  useEffect(() => {
    loadOrders();
    
    // Set current vendor ID in localStorage for notification demo
    localStorage.setItem('currentVendorId', vendorId);
    
    // Set up polling for new orders (every 30 seconds)
    const interval = setInterval(loadOrders, 30000);
    
    return () => {
      clearInterval(interval);
      localStorage.removeItem('currentVendorId');
    };
  }, [vendorId]);
  
  const loadOrders = () => {
    const vendorOrders = getVendorOrders(vendorId);
    setOrders(vendorOrders);
  };
  
  const handleStatusChange = (orderId: string, status: "pending" | "accepted" | "ready" | "completed" | "cancelled") => {
    const updatedOrder = updateOrderStatus(orderId, status);
    if (updatedOrder) {
      loadOrders();
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
    }
  };
  
  const filteredOrders = orders.filter(order => {
    if (selectedTab === "all") return true;
    return order.status === selectedTab;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "accepted":
        return <Badge variant="secondary" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Accepted</Badge>;
      case "ready":
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Ready</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status !== "cancelled")
      .reduce((sum, order) => sum + order.subtotal, 0);
  };
  
  const getTotalCommission = () => {
    return orders
      .filter(order => order.status !== "cancelled")
      .reduce((sum, order) => sum + order.commission, 0);
  };
  
  const getOrderCount = (status?: string) => {
    if (!status) return orders.length;
    return orders.filter(order => order.status === status).length;
  };
  
  const formatDateTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-xl font-semibold">
            ${getTotalRevenue().toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </Card>
        <Card className="p-4">
          <div className="text-xl font-semibold">
            {getOrderCount()}
          </div>
          <p className="text-sm text-muted-foreground">Total Orders</p>
        </Card>
        <Card className="p-4">
          <div className="text-xl font-semibold">
            ${getTotalCommission().toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">Platform Commission</p>
        </Card>
      </div>
      
      <Tabs defaultValue="pending" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="pending">
            Pending ({getOrderCount("pending")})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({getOrderCount("accepted")})
          </TabsTrigger>
          <TabsTrigger value="ready">
            Ready ({getOrderCount("ready")})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({getOrderCount("completed")})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Orders
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedTab} className="mt-4">
          <Card>
            <ScrollArea className="h-[calc(100vh-350px)]">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No orders found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Pickup Time</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                        <TableCell>{order.customerInfo.name}</TableCell>
                        <TableCell>{order.customerInfo.pickupTime}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewOrderDetails(order)}
                            >
                              Details
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="ml-auto">
                                  Status <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuRadioGroup 
                                  value={order.status}
                                  onValueChange={(value) => handleStatusChange(
                                    order.id, 
                                    value as "pending" | "accepted" | "ready" | "completed" | "cancelled"
                                  )}
                                >
                                  <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="accepted">Accepted</DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="ready">Ready for Pickup</DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="cancelled">Cancelled</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Order ID</p>
                  <p className="font-medium">{selectedOrder.id.substring(0, 8)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDateTime(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.customerInfo.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contact</p>
                  <p className="font-medium">{selectedOrder.customerInfo.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedOrder.customerInfo.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pickup Time</p>
                  <p className="font-medium">{selectedOrder.customerInfo.pickupTime}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <p className="font-medium capitalize">{selectedOrder.paymentMethod.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <div className="font-medium">{getStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex-1">
                        <span className="font-medium">{item.quantity}x </span>
                        <span>{item.name}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Fee (5%)</span>
                  <span>${selectedOrder.commission.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setOrderDetailsOpen(false)}
                >
                  Close
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      Update Status <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup 
                      value={selectedOrder.status}
                      onValueChange={(value) => handleStatusChange(
                        selectedOrder.id, 
                        value as "pending" | "accepted" | "ready" | "completed" | "cancelled"
                      )}
                    >
                      <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="accepted">Accepted</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="ready">Ready for Pickup</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="cancelled">Cancelled</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
