import { useState } from "react";
import { CreateItemRequest } from "../lib/api";
import ImageWithPlaceholder from "./ImageWithPlaceholder";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X } from "lucide-react";

interface AddItemFormProps {
  onSubmit: (item: CreateItemRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function AddItemForm({ onSubmit, onCancel, isSubmitting }: AddItemFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    price: "",
    image: "",
    category: "" as 'drink' | 'food' | "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.size.trim()) {
      newErrors.size = "Size is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        size: formData.size.trim(),
        price: formData.price.trim(),
        image: formData.image.trim() || undefined,
        category: formData.category.toUpperCase() as 'DRINK' | 'FOOD',
        description: formData.description.trim() || undefined,
      });

      // Reset form on success
      setFormData({
        name: "",
        size: "",
        price: "",
        image: "",
        category: "",
        description: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold text-cafe-text-dark">Add New Item</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-cafe-text-dark">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter item name"
                disabled={isSubmitting}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium text-cafe-text-dark">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drink">Drink</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <Label htmlFor="size" className="text-sm font-medium text-cafe-text-dark">
                Size *
              </Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
                placeholder="e.g., M, L, XL"
                disabled={isSubmitting}
                className={errors.size ? "border-red-500" : ""}
              />
              {errors.size && <p className="text-red-500 text-xs mt-1">{errors.size}</p>}
            </div>

            <div>
              <Label htmlFor="price" className="text-sm font-medium text-cafe-text-dark">
                Price *
              </Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="e.g., 5$, $5.99"
                disabled={isSubmitting}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <Label htmlFor="image" className="text-sm font-medium text-cafe-text-dark">
                Image URL
              </Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional. Default image will be used if not provided.
              </p>
              
              {/* Image Preview */}
              <div className="mt-3">
                <Label className="text-sm font-medium text-cafe-text-dark mb-2 block">
                  Preview
                </Label>
                <div className="w-32 h-24 border border-gray-200 rounded-lg overflow-hidden">
                  <ImageWithPlaceholder
                    src={formData.image}
                    alt="Preview"
                    category={formData.category || 'drink'}
                    isVisible={true}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-cafe-text-dark">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Optional description"
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-cafe-orange hover:bg-cafe-brown text-white"
              >
                {isSubmitting ? "Adding..." : "Add Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
