import { toast } from "@/components/ui/use-toast";

export interface VendorLocationAssignment {
  userId: string;
  truckId: string;
  truckName: string;
  assignedBy: string;
  assignedAt: Date;
}

export interface MenuItem {
  id: string;
  truckId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleEntry {
  id: string;
  truckId: string;
  date: string; // ISO date string YYYY-MM-DD
  startTime: string; // 24-hour format HH:MM
  endTime: string; // 24-hour format HH:MM
  location: string;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TruckDetails {
  id: string;
  name: string;
  type: "foodtruck" | "restaurant";
  cuisine: string;
  description: string;
  address?: string;
  schedule?: string;
  mainImage: string;
  updatedAt: Date;
}

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

export const getMenuItems = (truckId: string): MenuItem[] => {
  const menuItems = localStorage.getItem(`menuItems-${truckId}`);
  return menuItems ? JSON.parse(menuItems) : [];
};

export const saveMenuItems = (truckId: string, items: MenuItem[]): void => {
  localStorage.setItem(`menuItems-${truckId}`, JSON.stringify(items));
};

export const addMenuItem = (
  truckId: string,
  item: Omit<MenuItem, 'id' | 'truckId' | 'createdAt' | 'updatedAt'>
): MenuItem => {
  const menuItems = getMenuItems(truckId);
  
  const newItem: MenuItem = {
    ...item,
    id: crypto.randomUUID(),
    truckId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  menuItems.push(newItem);
  saveMenuItems(truckId, menuItems);
  
  toast({
    title: "Menu item added",
    description: `${item.name} has been added to the menu.`
  });
  
  return newItem;
};

export const updateMenuItem = (
  truckId: string,
  itemId: string,
  updates: Partial<Omit<MenuItem, 'id' | 'truckId' | 'createdAt' | 'updatedAt'>>
): MenuItem | null => {
  const menuItems = getMenuItems(truckId);
  const itemIndex = menuItems.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    toast({
      title: "Menu item not found",
      description: "The menu item you're trying to update doesn't exist.",
      variant: "destructive"
    });
    return null;
  }
  
  const updatedItem: MenuItem = {
    ...menuItems[itemIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  menuItems[itemIndex] = updatedItem;
  saveMenuItems(truckId, menuItems);
  
  toast({
    title: "Menu item updated",
    description: `${updatedItem.name} has been updated.`
  });
  
  return updatedItem;
};

export const deleteMenuItem = (truckId: string, itemId: string): void => {
  const menuItems = getMenuItems(truckId);
  const item = menuItems.find(item => item.id === itemId);
  
  if (!item) {
    toast({
      title: "Menu item not found",
      description: "The menu item you're trying to delete doesn't exist.",
      variant: "destructive"
    });
    return;
  }
  
  const filteredItems = menuItems.filter(item => item.id !== itemId);
  saveMenuItems(truckId, filteredItems);
  
  toast({
    title: "Menu item deleted",
    description: `${item.name} has been removed from the menu.`
  });
};

export const getScheduleEntries = (truckId: string): ScheduleEntry[] => {
  const scheduleEntries = localStorage.getItem(`schedule-${truckId}`);
  return scheduleEntries ? JSON.parse(scheduleEntries) : [];
};

export const saveScheduleEntries = (truckId: string, entries: ScheduleEntry[]): void => {
  localStorage.setItem(`schedule-${truckId}`, JSON.stringify(entries));
};

export const addScheduleEntry = (
  truckId: string,
  entry: Omit<ScheduleEntry, 'id' | 'truckId' | 'createdAt' | 'updatedAt'>
): ScheduleEntry => {
  const scheduleEntries = getScheduleEntries(truckId);
  
  const newEntry: ScheduleEntry = {
    ...entry,
    id: crypto.randomUUID(),
    truckId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  scheduleEntries.push(newEntry);
  saveScheduleEntries(truckId, scheduleEntries);
  
  toast({
    title: "Schedule entry added",
    description: `New schedule for ${entry.date} has been added.`
  });
  
  return newEntry;
};

export const updateScheduleEntry = (
  truckId: string,
  entryId: string,
  updates: Partial<Omit<ScheduleEntry, 'id' | 'truckId' | 'createdAt' | 'updatedAt'>>
): ScheduleEntry | null => {
  const scheduleEntries = getScheduleEntries(truckId);
  const entryIndex = scheduleEntries.findIndex(entry => entry.id === entryId);
  
  if (entryIndex === -1) {
    toast({
      title: "Schedule entry not found",
      description: "The schedule entry you're trying to update doesn't exist.",
      variant: "destructive"
    });
    return null;
  }
  
  const updatedEntry: ScheduleEntry = {
    ...scheduleEntries[entryIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  scheduleEntries[entryIndex] = updatedEntry;
  saveScheduleEntries(truckId, scheduleEntries);
  
  toast({
    title: "Schedule updated",
    description: `Schedule for ${updatedEntry.date} has been updated.`
  });
  
  return updatedEntry;
};

export const deleteScheduleEntry = (truckId: string, entryId: string): void => {
  const scheduleEntries = getScheduleEntries(truckId);
  const entry = scheduleEntries.find(entry => entry.id === entryId);
  
  if (!entry) {
    toast({
      title: "Schedule entry not found",
      description: "The schedule entry you're trying to delete doesn't exist.",
      variant: "destructive"
    });
    return;
  }
  
  const filteredEntries = scheduleEntries.filter(entry => entry.id !== entryId);
  saveScheduleEntries(truckId, filteredEntries);
  
  toast({
    title: "Schedule entry deleted",
    description: `Schedule for ${entry.date} has been removed.`
  });
};

export const getTruckDetails = (truckId: string): TruckDetails | null => {
  const detailsStr = localStorage.getItem(`truckDetails-${truckId}`);
  return detailsStr ? JSON.parse(detailsStr) : null;
};

export const saveTruckDetails = (details: TruckDetails): void => {
  localStorage.setItem(`truckDetails-${details.id}`, JSON.stringify(details));
};

export const updateTruckMainImage = (truckId: string, imageUrl: string): TruckDetails | null => {
  const details = getTruckDetails(truckId);
  
  if (!details) {
    toast({
      title: "Error updating image",
      description: "Could not find the location details.",
      variant: "destructive"
    });
    return null;
  }
  
  const updatedDetails: TruckDetails = {
    ...details,
    mainImage: imageUrl,
    updatedAt: new Date()
  };
  
  saveTruckDetails(updatedDetails);
  
  toast({
    title: "Image updated",
    description: "The main image has been updated successfully."
  });
  
  return updatedDetails;
};

export const updateTruckDetails = (
  truckId: string,
  updates: Partial<Omit<TruckDetails, 'id' | 'updatedAt'>>
): TruckDetails => {
  const existingDetails = getTruckDetails(truckId);
  
  const updatedDetails: TruckDetails = {
    id: truckId,
    name: updates.name || (existingDetails?.name || ""),
    type: updates.type || (existingDetails?.type || "foodtruck"),
    cuisine: updates.cuisine || (existingDetails?.cuisine || ""),
    description: updates.description || (existingDetails?.description || ""),
    address: updates.address || existingDetails?.address,
    schedule: updates.schedule || existingDetails?.schedule,
    mainImage: updates.mainImage || (existingDetails?.mainImage || "/placeholder.svg"),
    updatedAt: new Date()
  };
  
  saveTruckDetails(updatedDetails);
  
  toast({
    title: "Details updated",
    description: `${updatedDetails.name} details have been updated.`
  });
  
  return updatedDetails;
};

export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
