
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { 
  MapPinIcon, 
  PlusCircle, 
  Clock, 
  ShoppingBag, 
  CalendarIcon, 
  ClipboardList, 
  Package, 
  Trash2 
} from "lucide-react";

export const VendorDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [locations, setLocations] = useState<Record<string, string>>({
    [new Date().toISOString().split('T')[0]]: "Main St & 5th Ave",
    [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: "Downtown Food Court"
  });
  const [newLocation, setNewLocation] = useState("");
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Carne Asada Taco", price: 4.99, description: "Grilled steak taco with onions and cilantro" },
    { id: 2, name: "Chicken Quesadilla", price: 7.99, description: "Flour tortilla with cheese and grilled chicken" }
  ]);
  const [newMenuItem, setNewMenuItem] = useState({ name: "", price: "", description: "" });
  const [orders, setOrders] = useState([
    { id: 1, customer: "John Doe", items: ["Carne Asada Taco (2)", "Chicken Quesadilla (1)"], total: 17.97, status: "pending", pickupTime: "12:30 PM" },
    { id: 2, customer: "Jane Smith", items: ["Chicken Quesadilla (2)"], total: 15.98, status: "completed", pickupTime: "11:45 AM" }
  ]);

  const handleLocationUpdate = () => {
    if (!selectedDate || !newLocation.trim()) return;
    
    const dateKey = selectedDate.toISOString().split('T')[0];
    setLocations(prev => ({
      ...prev,
      [dateKey]: newLocation
    }));
    setNewLocation("");
  };

  const handleAddMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.price) return;
    
    setMenuItems(prev => [
      ...prev, 
      {
        id: Date.now(), 
        name: newMenuItem.name, 
        price: parseFloat(newMenuItem.price), 
        description: newMenuItem.description
      }
    ]);
    setNewMenuItem({ name: "", price: "", description: "" });
  };

  const handleRemoveMenuItem = (id: number) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const handleOrderStatusChange = (orderId: number, newStatus: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const currentDateKey = selectedDate?.toISOString().split('T')[0];
  const currentLocation = currentDateKey ? locations[currentDateKey] : undefined;

  return (
    <div className="container mx-auto px-4 pt-20 pb-16">
      <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>
      
      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="schedule">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="menu">
            <ClipboardList className="w-4 h-4 mr-2" />
            Menu
          </TabsTrigger>
          <TabsTrigger value="orders">
            <Package className="w-4 h-4 mr-2" />
            Orders
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Schedule</CardTitle>
              <CardDescription>
                Set your truck location for each day
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
                
                <div className="space-y-4">
                  {currentDateKey && (
                    <div className="p-4 border rounded-md bg-muted/50">
                      <h4 className="font-medium mb-2">
                        {selectedDate?.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                      </h4>
                      <p className="text-sm">
                        {currentLocation ? (
                          <span className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1 text-secondary" />
                            {currentLocation}
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic">No location scheduled</span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Update Location</Label>
                    <div className="flex space-x-2">
                      <Input 
                        id="location"
                        value={newLocation} 
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="Enter location for selected date"
                        className="flex-1"
                      />
                      <Button onClick={handleLocationUpdate}>Save</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hours">Business Hours</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="time" 
                        id="start-time" 
                        defaultValue="11:00" 
                        className="w-24"
                      />
                      <span>to</span>
                      <Input 
                        type="time" 
                        id="end-time" 
                        defaultValue="20:00" 
                        className="w-24"
                      />
                      <Button variant="outline">Set Hours</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Menu Management</CardTitle>
              <CardDescription>
                Add, edit, or remove menu items
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Menu</h3>
                {menuItems.length > 0 ? (
                  <div className="space-y-3">
                    {menuItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                          <div className="text-sm font-medium">${item.price.toFixed(2)}</div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveMenuItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No menu items yet. Add your first item below.
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-3">Add New Item</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="item-name">Item Name</Label>
                      <Input
                        id="item-name"
                        value={newMenuItem.name}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Beef Taco"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-price">Price ($)</Label>
                      <Input
                        id="item-price"
                        type="number"
                        step="0.01"
                        value={newMenuItem.price}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="e.g., 4.99"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-description">Description</Label>
                    <Textarea
                      id="item-description"
                      value={newMenuItem.description}
                      onChange={(e) => setNewMenuItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your menu item"
                      rows={2}
                    />
                  </div>
                  <Button 
                    onClick={handleAddMenuItem} 
                    className="w-full"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Menu Item
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Orders</CardTitle>
              <CardDescription>
                View and update pickup orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Order #{order.id}</div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                          order.status === 'preparing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </div>
                      <div className="text-sm mb-2">Customer: {order.customer}</div>
                      <div className="flex items-center text-sm mb-2">
                        <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                        Pickup: {order.pickupTime}
                      </div>
                      <div className="text-sm mb-4">
                        <div className="font-medium mb-1">Items:</div>
                        <ul className="list-disc list-inside">
                          {order.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Total: ${order.total.toFixed(2)}</div>
                        <div className="flex space-x-2">
                          {order.status !== 'completed' && (
                            <>
                              {order.status === 'pending' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleOrderStatusChange(order.id, 'preparing')}
                                >
                                  Start Preparing
                                </Button>
                              )}
                              {order.status === 'preparing' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleOrderStatusChange(order.id, 'completed')}
                                >
                                  Mark as Completed
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No orders yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
