
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Save, X, ImagePlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MenuItem, getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, fileToDataUrl } from "@/utils/vendorManagement";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MenuItemsEditorProps {
  truckId: string;
}

export const MenuItemsEditor: React.FC<MenuItemsEditorProps> = ({ truckId }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    available: true,
    image: "/placeholder.svg"
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Load initial menu items
  useEffect(() => {
    const loadItems = () => {
      const menuItems = getMenuItems(truckId);
      setItems(menuItems);
      setLoading(false);
    };
    
    loadItems();
  }, [truckId]);

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewItem({
      name: "",
      description: "",
      price: 0,
      category: "",
      available: true,
      image: "/placeholder.svg"
    });
    setImageFile(null);
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      try {
        const imageUrl = await fileToDataUrl(file);
        setNewItem(prev => ({ ...prev, image: imageUrl }));
      } catch (error) {
        toast.error("Failed to process image. Please try again.");
      }
    }
  };

  const handleItemDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMenuItem(truckId, id);
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Handle price as a number
      setNewItem(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setNewItem(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAvailabilityChange = (checked: boolean) => {
    setNewItem(prev => ({
      ...prev,
      available: checked
    }));
  };

  const handleSaveNewItem = async () => {
    try {
      // Validate required fields
      if (!newItem.name?.trim()) {
        toast.error("Menu item name is required");
        return;
      }
      
      if (!newItem.category?.trim()) {
        toast.error("Category is required");
        return;
      }
      
      if (newItem.price === undefined || newItem.price <= 0) {
        toast.error("Price must be greater than zero");
        return;
      }
      
      // Create new menu item
      const createdItem = addMenuItem(truckId, {
        name: newItem.name,
        description: newItem.description || "",
        price: newItem.price,
        category: newItem.category,
        available: newItem.available ?? true,
        image: newItem.image
      });
      
      // Update local state
      setItems([...items, createdItem]);
      setIsAddingNew(false);
      
      // Reset form
      setNewItem({
        name: "",
        description: "",
        price: 0,
        category: "",
        available: true,
        image: "/placeholder.svg"
      });
      setImageFile(null);
      
    } catch (error) {
      toast.error("Failed to add menu item. Please try again.");
    }
  };

  // Toggle item availability
  const toggleItemAvailability = (id: string, currentAvailability: boolean) => {
    const updatedItem = updateMenuItem(truckId, id, { available: !currentAvailability });
    if (updatedItem) {
      setItems(items.map(item => item.id === id ? updatedItem : item));
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading menu items...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Menu Items</h3>
        {!isAddingNew && (
          <Button onClick={handleAddNew} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        )}
      </div>

      {isAddingNew && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="font-medium flex items-center justify-between">
              <span>New Menu Item</span>
              <Button variant="ghost" size="sm" onClick={handleCancelAdd}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col items-center mb-4">
              <img 
                src={newItem.image || "/placeholder.svg"} 
                alt="Preview" 
                className="w-24 h-24 object-cover rounded-md mb-2"
              />
              <Label htmlFor="item-image" className="cursor-pointer">
                <div className="flex items-center space-x-2 text-sm text-primary">
                  <ImagePlus className="h-4 w-4" />
                  <span>{imageFile ? 'Change Image' : 'Add Image'}</span>
                </div>
                <Input 
                  id="item-image" 
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </Label>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={newItem.name}
                  onChange={handleNewItemChange}
                  placeholder="Item name"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  name="category"
                  value={newItem.category}
                  onChange={handleNewItemChange}
                  placeholder="e.g., Appetizers, Main Course"
                />
              </div>
              
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newItem.price}
                  onChange={handleNewItemChange}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newItem.description}
                  onChange={handleNewItemChange}
                  placeholder="Describe this menu item"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={newItem.available}
                  onCheckedChange={handleAvailabilityChange}
                />
                <Label htmlFor="available">Available</Label>
              </div>
            </div>
            
            <Button onClick={handleSaveNewItem} className="w-full">
              <Save className="h-4 w-4 mr-1" /> Save Item
            </Button>
          </CardContent>
        </Card>
      )}

      <ScrollArea className="h-[400px] pr-4 -mr-4">
        {items.length === 0 && !isAddingNew ? (
          <div className="text-center py-8 text-muted-foreground">
            No menu items. Add your first item to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src={item.image || "/placeholder.svg"} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium truncate">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${item.price.toFixed(2)}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleItemDelete(item.id, item.name)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-sm mt-1 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex items-center mt-2">
                        <Switch
                          id={`available-${item.id}`}
                          checked={item.available}
                          onCheckedChange={() => toggleItemAvailability(item.id, item.available)}
                          className="mr-2"
                        />
                        <Label htmlFor={`available-${item.id}`} className="text-xs">
                          {item.available ? 'Available' : 'Unavailable'}
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

