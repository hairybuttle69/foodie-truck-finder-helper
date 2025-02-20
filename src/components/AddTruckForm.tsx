
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { PlusCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export const AddTruckForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    description: "",
    address: "",
    schedule: "",
    type: "foodtruck" as "foodtruck" | "restaurant",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // We'll implement this when we add Supabase integration
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0">
          <PlusCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Add New Establishment</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-8">
          <div className="space-y-2">
            <Label>Type</Label>
            <RadioGroup
              defaultValue="foodtruck"
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, type: value as "foodtruck" | "restaurant" }))
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="foodtruck" id="foodtruck" />
                <Label htmlFor="foodtruck">Food Truck</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="restaurant" id="restaurant" />
                <Label htmlFor="restaurant">Hole-in-the-Wall</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">
              {formData.type === "foodtruck" ? "Truck Name" : "Restaurant Name"}
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cuisine">Cuisine Type</Label>
            <Input
              id="cuisine"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              placeholder="e.g., Mexican, Italian, etc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your establishment"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Location</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter location"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Input
              id="schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              placeholder="e.g., Mon-Fri 11AM-8PM"
            />
          </div>
          <Button type="submit" className="w-full">
            Add {formData.type === "foodtruck" ? "Food Truck" : "Restaurant"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
