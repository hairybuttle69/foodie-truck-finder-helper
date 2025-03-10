
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { MapPin, Clock, DollarSign, Users, Truck as TruckIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { useAuth } from "@/contexts/AuthContext";

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
              <CardHeader>
                <CardTitle>Location Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage your truck schedule and locations.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Menu Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage your menu items, prices, and availability.
                </p>
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
      )}
    </div>
  );
};
