
import { toast } from "@/components/ui/use-toast";

export interface VendorLocationAssignment {
  userId: string;
  truckId: string;
  truckName: string;
  assignedBy: string;
  assignedAt: Date;
}

// Store vendor assignments in localStorage (in a real app, this would be in a database)
export const getVendorAssignments = (): VendorLocationAssignment[] => {
  const assignments = localStorage.getItem('vendorAssignments');
  return assignments ? JSON.parse(assignments) : [];
};

export const saveVendorAssignments = (assignments: VendorLocationAssignment[]): void => {
  localStorage.setItem('vendorAssignments', JSON.stringify(assignments));
};

export const assignVendorToLocation = (
  userId: string, 
  truckId: string,
  truckName: string,
  assignedBy: string
): void => {
  const assignments = getVendorAssignments();
  
  // Check if assignment already exists
  const existingAssignment = assignments.find(
    a => a.userId === userId && a.truckId === truckId
  );
  
  if (existingAssignment) {
    toast({
      title: "Assignment already exists",
      description: `${truckName} is already assigned to this user.`,
      variant: "destructive"
    });
    return;
  }
  
  // Add new assignment
  assignments.push({
    userId,
    truckId,
    truckName,
    assignedBy,
    assignedAt: new Date()
  });
  
  saveVendorAssignments(assignments);
  
  toast({
    title: "Vendor assigned",
    description: `${truckName} has been assigned to the selected user.`
  });
};

export const removeVendorFromLocation = (userId: string, truckId: string): void => {
  const assignments = getVendorAssignments();
  const assignment = assignments.find(a => a.userId === userId && a.truckId === truckId);
  
  if (!assignment) {
    toast({
      title: "Assignment not found",
      description: "This vendor is not assigned to this location.",
      variant: "destructive"
    });
    return;
  }
  
  const filteredAssignments = assignments.filter(
    a => !(a.userId === userId && a.truckId === truckId)
  );
  
  saveVendorAssignments(filteredAssignments);
  
  toast({
    title: "Assignment removed",
    description: `${assignment.truckName} has been unassigned from this user.`
  });
};

export const getLocationsByVendor = (userId: string): string[] => {
  const assignments = getVendorAssignments();
  return assignments
    .filter(a => a.userId === userId)
    .map(a => a.truckId);
};

export const getUsersByLocation = (truckId: string): string[] => {
  const assignments = getVendorAssignments();
  return assignments
    .filter(a => a.truckId === truckId)
    .map(a => a.userId);
};
