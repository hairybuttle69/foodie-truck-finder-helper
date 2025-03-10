
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  MapPin, Clock, DollarSign, Users, Truck as TruckIcon, 
  PlusCircle, Edit, Trash2, UtensilsCrossed, Calendar as CalendarIcon 
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getMenuItems, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  getScheduleEntries,
  addScheduleEntry,
  updateScheduleEntry,
  deleteScheduleEntry,
  MenuItem,
  ScheduleEntry
} from "@/utils/vendorManagement";

interface Truck {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  status: "open" | "closed";
  location?: [number, number];
  distance?: string;
}

interface VendorDashboardProps {
  vendorTrucks?: Truck[];
}

export const VendorDashboard = ({ vendorTrucks = [] }: VendorDashboardProps) => {
  const { user } = useAuth();
  const [date, setDate] = React.useState<Date>(new Date());
  
  // Use the provided trucks or fallback to empty array
  const displayedTrucks = vendorTrucks;
  
  // Selected truck for operations
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(
    displayedTrucks.length > 0 ? displayedTrucks[0] : null
  );
  
  // Menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newMenuItem, setNewMenuItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Main',
    available: true
  });
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  
  // Schedule state
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  const [newScheduleEntry, setNewScheduleEntry] = useState<Partial<ScheduleEntry>>({
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '16:00',
    location: '',
    address: '',
    coordinates: [-74.006, 40.7128], // Default to NYC
    notes: ''
  });
  const [editingScheduleEntry, setEditingScheduleEntry] = useState<ScheduleEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Load menu items and schedule when selected truck changes
  useEffect(() => {
    if (selectedTruck) {
      setMenuItems(getMenuItems(selectedTruck.id));
      setScheduleEntries(getScheduleEntries(selectedTruck.id));
    }
  }, [selectedTruck]);

  // Handler for adding new menu item
  const handleAddMenuItem = () => {
    if (!selectedTruck || !newMenuItem.name || !newMenuItem.price) return;
    
    const item = addMenuItem(selectedTruck.id, {
      name: newMenuItem.name,
      description: newMenuItem.description || '',
      price: Number(newMenuItem.price),
      category: newMenuItem.category || 'Main',
      available: newMenuItem.available !== false,
      image: newMenuItem.image
    });
    
    setMenuItems([...menuItems, item]);
    
    // Reset form
    setNewMenuItem({
      name: '',
      description: '',
      price: 0,
      category: 'Main',
      available: true
    });
  };

  // Handler for updating menu item
  const handleUpdateMenuItem = () => {
    if (!selectedTruck || !editingMenuItem) return;
    
    const updatedItem = updateMenuItem(selectedTruck.id, editingMenuItem.id, {
      name: editingMenuItem.name,
      description: editingMenuItem.description,
      price: editingMenuItem.price,
      category: editingMenuItem.category,
      available: editingMenuItem.available,
      image: editingMenuItem.image
    });
    
    if (updatedItem) {
      setMenuItems(menuItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
    }
    
    // Reset editing state
    setEditingMenuItem(null);
  };

  // Handler for deleting menu item
  const handleDeleteMenuItem = (itemId: string) => {
    if (!selectedTruck) return;
    
    deleteMenuItem(selectedTruck.id, itemId);
    setMenuItems(menuItems.filter(item => item.id !== itemId));
  };

  // Handler for adding new schedule entry
  const handleAddScheduleEntry = () => {
    if (!selectedTruck || !newScheduleEntry.date || !newScheduleEntry.location) return;
    
    const entry = addScheduleEntry(selectedTruck.id, {
      date: newScheduleEntry.date,
      startTime: newScheduleEntry.startTime || '08:00',
      endTime: newScheduleEntry.endTime || '16:00',
      location: newScheduleEntry.location,
      address: newScheduleEntry.address || '',
      coordinates: newScheduleEntry.coordinates || [-74.006, 40.7128],
      notes: newScheduleEntry.notes
    });
    
    setScheduleEntries([...scheduleEntries, entry]);
    
    // Reset form
    setNewScheduleEntry({
      date: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '16:00',
      location: '',
      address: '',
      coordinates: [-74.006, 40.7128],
      notes: ''
    });
  };

  // Handler for updating schedule entry
  const handleUpdateScheduleEntry = () => {
    if (!selectedTruck || !editingScheduleEntry) return;
    
    const updatedEntry = updateScheduleEntry(selectedTruck.id, editingScheduleEntry.id, {
      date: editingScheduleEntry.date,
      startTime: editingScheduleEntry.startTime,
      endTime: editingScheduleEntry.endTime,
      location: editingScheduleEntry.location,
      address: editingScheduleEntry.address,
      coordinates: editingScheduleEntry.coordinates,
      notes: editingScheduleEntry.notes
    });
    
    if (updatedEntry) {
      setScheduleEntries(scheduleEntries.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      ));
    }
    
    // Reset editing state
    setEditingScheduleEntry(null);
  };

  // Handler for deleting schedule entry
  const handleDeleteScheduleEntry = (entryId: string) => {
    if (!selectedTruck) return;
    
    deleteScheduleEntry(selectedTruck.id, entryId);
    setScheduleEntries(scheduleEntries.filter(entry => entry.id !== entryId));
  };

  // Helper to get schedule entries for a specific date
  const getEntriesForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    const dateString = date.toISOString().split('T')[0];
    return scheduleEntries.filter(entry => entry.date === dateString);
  };

  // Format price to currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vendor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your food trucks and locations
        </p>
      </div>
      
      {displayedTrucks.length === 0 ? (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <TruckIcon className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Assigned Locations</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any food trucks or locations assigned to your account yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Please contact an administrator to have locations assigned to your account.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {displayedTrucks.length > 1 && (
            <div className="mb-6">
              <Label htmlFor="truck-select">Select Location</Label>
              <Select 
                value={selectedTruck?.id} 
                onValueChange={(value) => {
                  const truck = displayedTrucks.find(t => t.id === value);
                  if (truck) setSelectedTruck(truck);
                }}
              >
                <SelectTrigger id="truck-select">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {displayedTrucks.map((truck) => (
                    <SelectItem key={truck.id} value={truck.id}>{truck.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="menu">Menu</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$4,231.89</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">+201 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Hours</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+89</div>
                    <p className="text-xs text-muted-foreground">+7% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Locations</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayedTrucks.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {displayedTrucks.length > 1 ? 'Multiple locations' : '1 active location'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Your Food Trucks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {displayedTrucks.map((truck) => (
                        <div key={truck.id} className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-md overflow-hidden">
                            <img src={truck.image} alt={truck.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{truck.name}</h3>
                            <p className="text-sm text-muted-foreground">{truck.cuisine}</p>
                          </div>
                          <Badge variant={truck.status === "open" ? "default" : "secondary"}>
                            {truck.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>Location Schedule</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Schedule
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Schedule</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="col-span-4">
                            <Label htmlFor="schedule-date">Date</Label>
                            <Input
                              id="schedule-date"
                              type="date"
                              value={newScheduleEntry.date}
                              onChange={(e) => setNewScheduleEntry({
                                ...newScheduleEntry,
                                date: e.target.value
                              })}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="start-time">Start Time</Label>
                            <Input
                              id="start-time"
                              type="time"
                              value={newScheduleEntry.startTime}
                              onChange={(e) => setNewScheduleEntry({
                                ...newScheduleEntry,
                                startTime: e.target.value
                              })}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="end-time">End Time</Label>
                            <Input
                              id="end-time"
                              type="time"
                              value={newScheduleEntry.endTime}
                              onChange={(e) => setNewScheduleEntry({
                                ...newScheduleEntry,
                                endTime: e.target.value
                              })}
                            />
                          </div>
                          <div className="col-span-4">
                            <Label htmlFor="location-name">Location Name</Label>
                            <Input
                              id="location-name"
                              value={newScheduleEntry.location}
                              onChange={(e) => setNewScheduleEntry({
                                ...newScheduleEntry,
                                location: e.target.value
                              })}
                              placeholder="E.g., Downtown Plaza"
                            />
                          </div>
                          <div className="col-span-4">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              value={newScheduleEntry.address}
                              onChange={(e) => setNewScheduleEntry({
                                ...newScheduleEntry,
                                address: e.target.value
                              })}
                              placeholder="Full street address"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                              id="longitude"
                              type="number"
                              step="0.000001"
                              value={newScheduleEntry.coordinates?.[0]}
                              onChange={(e) => setNewScheduleEntry({
                                ...newScheduleEntry,
                                coordinates: [parseFloat(e.target.value), newScheduleEntry.coordinates?.[1] || 0]
                              })}
                              placeholder="-74.006"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                              id="latitude"
                              type="number"
                              step="0.000001"
                              value={newScheduleEntry.coordinates?.[1]}
                              onChange={(e) => setNewScheduleEntry({
                                ...newScheduleEntry,
                                coordinates: [newScheduleEntry.coordinates?.[0] || 0, parseFloat(e.target.value)]
                              })}
                              placeholder="40.7128"
                            />
                          </div>
                          <div className="col-span-4">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                              id="notes"
                              value={newScheduleEntry.notes || ''}
                              onChange={(e) => setNewScheduleEntry({
                                ...newScheduleEntry,
                                notes: e.target.value
                              })}
                              placeholder="Any special instructions or details"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleAddScheduleEntry}>Save Schedule</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <h3 className="text-lg font-medium mb-4">
                        {selectedDate?.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                      </h3>
                      
                      {getEntriesForDate(selectedDate).length === 0 ? (
                        <div className="text-center py-8 border rounded-lg bg-muted/30">
                          <CalendarIcon className="w-8 h-8 mx-auto text-muted-foreground opacity-50 mb-2" />
                          <p className="text-muted-foreground">No schedule entries for this date</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {getEntriesForDate(selectedDate).map((entry) => (
                            <Card key={entry.id} className="overflow-hidden">
                              <CardHeader className="bg-muted/30 p-4 pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-base">{entry.location}</CardTitle>
                                  <div className="flex space-x-1">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => setEditingScheduleEntry(entry)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Edit Schedule</DialogTitle>
                                        </DialogHeader>
                                        {editingScheduleEntry && (
                                          <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 gap-4">
                                              <div className="col-span-4">
                                                <Label htmlFor="edit-schedule-date">Date</Label>
                                                <Input
                                                  id="edit-schedule-date"
                                                  type="date"
                                                  value={editingScheduleEntry.date}
                                                  onChange={(e) => setEditingScheduleEntry({
                                                    ...editingScheduleEntry,
                                                    date: e.target.value
                                                  })}
                                                />
                                              </div>
                                              <div className="col-span-2">
                                                <Label htmlFor="edit-start-time">Start Time</Label>
                                                <Input
                                                  id="edit-start-time"
                                                  type="time"
                                                  value={editingScheduleEntry.startTime}
                                                  onChange={(e) => setEditingScheduleEntry({
                                                    ...editingScheduleEntry,
                                                    startTime: e.target.value
                                                  })}
                                                />
                                              </div>
                                              <div className="col-span-2">
                                                <Label htmlFor="edit-end-time">End Time</Label>
                                                <Input
                                                  id="edit-end-time"
                                                  type="time"
                                                  value={editingScheduleEntry.endTime}
                                                  onChange={(e) => setEditingScheduleEntry({
                                                    ...editingScheduleEntry,
                                                    endTime: e.target.value
                                                  })}
                                                />
                                              </div>
                                              <div className="col-span-4">
                                                <Label htmlFor="edit-location-name">Location Name</Label>
                                                <Input
                                                  id="edit-location-name"
                                                  value={editingScheduleEntry.location}
                                                  onChange={(e) => setEditingScheduleEntry({
                                                    ...editingScheduleEntry,
                                                    location: e.target.value
                                                  })}
                                                />
                                              </div>
                                              <div className="col-span-4">
                                                <Label htmlFor="edit-address">Address</Label>
                                                <Input
                                                  id="edit-address"
                                                  value={editingScheduleEntry.address}
                                                  onChange={(e) => setEditingScheduleEntry({
                                                    ...editingScheduleEntry,
                                                    address: e.target.value
                                                  })}
                                                />
                                              </div>
                                              <div className="col-span-2">
                                                <Label htmlFor="edit-longitude">Longitude</Label>
                                                <Input
                                                  id="edit-longitude"
                                                  type="number"
                                                  step="0.000001"
                                                  value={editingScheduleEntry.coordinates[0]}
                                                  onChange={(e) => setEditingScheduleEntry({
                                                    ...editingScheduleEntry,
                                                    coordinates: [parseFloat(e.target.value), editingScheduleEntry.coordinates[1]]
                                                  })}
                                                />
                                              </div>
                                              <div className="col-span-2">
                                                <Label htmlFor="edit-latitude">Latitude</Label>
                                                <Input
                                                  id="edit-latitude"
                                                  type="number"
                                                  step="0.000001"
                                                  value={editingScheduleEntry.coordinates[1]}
                                                  onChange={(e) => setEditingScheduleEntry({
                                                    ...editingScheduleEntry,
                                                    coordinates: [editingScheduleEntry.coordinates[0], parseFloat(e.target.value)]
                                                  })}
                                                />
                                              </div>
                                              <div className="col-span-4">
                                                <Label htmlFor="edit-notes">Notes</Label>
                                                <Textarea
                                                  id="edit-notes"
                                                  value={editingScheduleEntry.notes || ''}
                                                  onChange={(e) => setEditingScheduleEntry({
                                                    ...editingScheduleEntry,
                                                    notes: e.target.value
                                                  })}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        <DialogFooter>
                                          <Button type="submit" onClick={handleUpdateScheduleEntry}>Update Schedule</Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeleteScheduleEntry(entry.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>{entry.startTime} - {entry.endTime}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>{entry.address}</span>
                                  </div>
                                </div>
                                {entry.notes && (
                                  <div className="mt-2 text-sm text-muted-foreground">
                                    <p>{entry.notes}</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="menu" className="space-y-4">
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>Menu Management</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Menu Item</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="col-span-4">
                            <Label htmlFor="item-name">Item Name</Label>
                            <Input
                              id="item-name"
                              value={newMenuItem.name}
                              onChange={(e) => setNewMenuItem({
                                ...newMenuItem,
                                name: e.target.value
                              })}
                              placeholder="E.g., Beef Taco"
                            />
                          </div>
                          <div className="col-span-4">
                            <Label htmlFor="item-description">Description</Label>
                            <Textarea
                              id="item-description"
                              value={newMenuItem.description || ''}
                              onChange={(e) => setNewMenuItem({
                                ...newMenuItem,
                                description: e.target.value
                              })}
                              placeholder="Brief description of the item"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="item-price">Price ($)</Label>
                            <Input
                              id="item-price"
                              type="number"
                              step="0.01"
                              min="0"
                              value={newMenuItem.price}
                              onChange={(e) => setNewMenuItem({
                                ...newMenuItem,
                                price: parseFloat(e.target.value)
                              })}
                              placeholder="9.99"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="item-category">Category</Label>
                            <Select
                              value={newMenuItem.category}
                              onValueChange={(value) => setNewMenuItem({
                                ...newMenuItem,
                                category: value
                              })}
                            >
                              <SelectTrigger id="item-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Appetizer">Appetizer</SelectItem>
                                <SelectItem value="Main">Main</SelectItem>
                                <SelectItem value="Side">Side</SelectItem>
                                <SelectItem value="Dessert">Dessert</SelectItem>
                                <SelectItem value="Drink">Drink</SelectItem>
                                <SelectItem value="Special">Special</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-4 flex items-center space-x-2">
                            <Switch
                              id="item-available"
                              checked={newMenuItem.available}
                              onCheckedChange={(checked) => setNewMenuItem({
                                ...newMenuItem,
                                available: checked
                              })}
                            />
                            <Label htmlFor="item-available">Available for order</Label>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleAddMenuItem}>Add to Menu</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {menuItems.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg bg-muted/30">
                      <UtensilsCrossed className="w-8 h-8 mx-auto text-muted-foreground opacity-50 mb-2" />
                      <p className="text-muted-foreground">No menu items added yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(
                        menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
                          if (!acc[item.category]) acc[item.category] = [];
                          acc[item.category].push(item);
                          return acc;
                        }, {})
                      ).map(([category, items]) => (
                        <Card key={category} className="overflow-hidden">
                          <CardHeader className="bg-muted/30 py-2">
                            <CardTitle className="text-base">{category}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="divide-y">
                              {items.map((item) => (
                                <div key={item.id} className="p-4">
                                  <div className="flex justify-between items-start mb-1">
                                    <div className="flex-1">
                                      <h4 className="font-medium flex items-center">
                                        {item.name}
                                        {!item.available && (
                                          <Badge variant="outline" className="ml-2 text-xs">Unavailable</Badge>
                                        )}
                                      </h4>
                                      {item.description && (
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                      )}
                                    </div>
                                    <div className="font-medium text-right">
                                      {formatPrice(item.price)}
                                    </div>
                                  </div>
                                  <div className="flex justify-end mt-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => setEditingMenuItem(item)}
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Edit Menu Item</DialogTitle>
                                        </DialogHeader>
                                        {editingMenuItem && (
                                          <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 gap-4">
                                              <div className="col-span-4">
                                                <Label htmlFor="edit-item-name">Item Name</Label>
                                                <Input
                                                  id="edit-item-name"
                                                  value={editingMenuItem.name}
                                                  onChange={(e) => setEditingMenuItem({
                                                    ...editingMenuItem,
                                                    name: e.target.value
                                                  })}
                                                />
                                              </div>
                                              <div className="col-span-4">
                                                <Label htmlFor="edit-item-description">Description</Label>
                                                <Textarea
                                                  id="edit-item-description"
                                                  value={editingMenuItem.description}
                                                  onChange={(e) => setEditingMenuItem({
                                                    ...editingMenuItem,
                                                    description: e.target.value
                                                  })}
                                                />
                                              </div>
                                              <div className="col-span-2">
                                                <Label htmlFor="edit-item-price">Price ($)</Label>
                                                <Input
                                                  id="edit-item-price"
                                                  type="number"
                                                  step="0.01"
                                                  min="0"
                                                  value={editingMenuItem.price}
                                                  onChange={(e) => setEditingMenuItem({
                                                    ...editingMenuItem,
                                                    price: parseFloat(e.target.value)
                                                  })}
                                                />
                                              </div>
                                              <div className="col-span-2">
                                                <Label htmlFor="edit-item-category">Category</Label>
                                                <Select
                                                  value={editingMenuItem.category}
                                                  onValueChange={(value) => setEditingMenuItem({
                                                    ...editingMenuItem,
                                                    category: value
                                                  })}
                                                >
                                                  <SelectTrigger id="edit-item-category">
                                                    <SelectValue placeholder="Select category" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="Appetizer">Appetizer</SelectItem>
                                                    <SelectItem value="Main">Main</SelectItem>
                                                    <SelectItem value="Side">Side</SelectItem>
                                                    <SelectItem value="Dessert">Dessert</SelectItem>
                                                    <SelectItem value="Drink">Drink</SelectItem>
                                                    <SelectItem value="Special">Special</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div className="col-span-4 flex items-center space-x-2">
                                                <Switch
                                                  id="edit-item-available"
                                                  checked={editingMenuItem.available}
                                                  onCheckedChange={(checked) => setEditingMenuItem({
                                                    ...editingMenuItem,
                                                    available: checked
                                                  })}
                                                />
                                                <Label htmlFor="edit-item-available">Available for order</Label>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        <DialogFooter>
                                          <Button type="submit" onClick={handleUpdateMenuItem}>Update Item</Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeleteMenuItem(item.id)}
                                    >
                                      <Trash2 className="h-3 w-3 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    View and manage customer orders.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};
