
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  assignVendorToLocation, 
  removeVendorFromLocation, 
  getVendorAssignments,
  VendorLocationAssignment 
} from "@/utils/vendorManagement";
import { UserCheck, UserX, Search, Truck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface TruckInfo {
  id: string;
  name: string;
}

export const VendorAssignmentManager = ({ trucks }: { trucks: TruckInfo[] }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedTruckId, setSelectedTruckId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [assignments, setAssignments] = useState<VendorLocationAssignment[]>([]);
  const [users, setUsers] = useState<{ id: string; email: string }[]>([]);
  
  const { user } = useAuth();

  // Load assignments
  useEffect(() => {
    setAssignments(getVendorAssignments());
    
    // In a real app, you would fetch real users from a database
    // This is just mock data for demonstration
    setUsers([
      { id: user?.id || "current-user", email: user?.email || "current@user.com" },
      { id: "user-1", email: "vendor1@example.com" },
      { id: "user-2", email: "vendor2@example.com" },
      { id: "user-3", email: "vendor3@example.com" }
    ]);
  }, [user]);

  const handleAssign = () => {
    if (!selectedUserId || !selectedTruckId) return;
    
    const truck = trucks.find(t => t.id === selectedTruckId);
    if (!truck) return;
    
    assignVendorToLocation(
      selectedUserId, 
      selectedTruckId, 
      truck.name,
      user?.email || "unknown"
    );
    
    setAssignments(getVendorAssignments());
  };

  const handleRemove = (userId: string, truckId: string) => {
    removeVendorFromLocation(userId, truckId);
    setAssignments(getVendorAssignments());
  };

  const findUserEmail = (userId: string) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? foundUser.email : userId;
  };

  const findTruckName = (truckId: string) => {
    const truck = trucks.find(t => t.id === truckId);
    return truck ? truck.name : truckId;
  };

  const searchUsers = () => {
    // In a real app, you would filter users from the database
    // For this demo, we just filter the mock data
    if (!userEmail) return;
    
    setSelectedUserId(
      users.find(u => u.email.toLowerCase().includes(userEmail.toLowerCase()))?.id || ""
    );
  };

  return (
    <Card className="p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Vendor Location Assignment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="user-search">Find User by Email</Label>
          <div className="flex space-x-2">
            <Input 
              id="user-search"
              value={userEmail} 
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter user email" 
            />
            <Button onClick={searchUsers} size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <Label htmlFor="user-select">Select User</Label>
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger id="user-select">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map(u => (
                <SelectItem key={u.id} value={u.id}>{u.email}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="truck-select">Select Food Truck/Location</Label>
        <Select value={selectedTruckId} onValueChange={setSelectedTruckId}>
          <SelectTrigger id="truck-select">
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {trucks.map(truck => (
              <SelectItem key={truck.id} value={truck.id}>{truck.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={handleAssign} 
        disabled={!selectedUserId || !selectedTruckId}
        className="w-full mb-6"
      >
        <UserCheck className="mr-2 h-4 w-4" />
        Assign Vendor to Location
      </Button>
      
      <h3 className="font-medium mb-2">Current Assignments</h3>
      {assignments.length === 0 ? (
        <p className="text-muted-foreground text-sm">No vendor assignments yet.</p>
      ) : (
        <div className="space-y-2">
          {assignments.map((assignment, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex flex-col">
                <span className="font-medium">{findUserEmail(assignment.userId)}</span>
                <span className="text-sm text-muted-foreground flex items-center">
                  <Truck className="h-3 w-3 mr-1" />
                  {assignment.truckName}
                </span>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleRemove(assignment.userId, assignment.truckId)}
              >
                <UserX className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
