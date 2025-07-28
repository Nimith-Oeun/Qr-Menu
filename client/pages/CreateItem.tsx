import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { menuApi, MenuItem, ApiError } from "../lib/api";
import ImageWithPlaceholder from "../components/ImageWithPlaceholder";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";

export default function CreateItem() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const newItem: Omit<MenuItem, 'id'> = {
        name: formData.name.trim(),
        size: formData.size.trim(),
        price: formData.price.trim(),
        image: formData.image.trim() || undefined,
        category: formData.category as 'drink' | 'food',
        description: formData.description.trim() || undefined,
      };

      await menuApi.addMenuItem(newItem);

      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: "",
        size: "",
        price: "",
        image: "",
        category: "",
        description: "",
      });
      setErrors({});

      // Auto redirect after 2 seconds
      setTimeout(() => {
        navigate("/qr-menu-chhong_caffe");
      }, 2000);

    } catch (err) {
      console.error("Failed to add item:", err);
      if (err instanceof ApiError) {
        setError(`Failed to add item: ${err.message} (Status: ${err.status})`);
      } else {
        setError('Failed to add item. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (success) {
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/d4d912cb4847166258ac81f8b4ca3abecc963aab?width=2560"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f2aaa14515154ad18f8cfe5439814ab435d6222d?width=793"
              alt="Chhong Cafe & BBQ Logo"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto rounded-[23px] shadow-lg"
            />
          </div>

          <h1 className="text-center font-sriracha text-cafe-brown text-3xl sm:text-4xl md:text-5xl mb-4">
            Create New Item
          </h1>

          {/* Back Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/qr-menu-chhong_caffe")}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-cafe-text-dark flex items-center gap-2">
                <Plus className="h-5 w-5 text-cafe-orange" />
                Add New Menu Item
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
                  <p className="font-medium">Item added successfully!</p>
                  <p className="text-sm">Redirecting to menu...</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

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
                    onClick={() => navigate("/qr-menu-chhong_caffe")}
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
      </div>
    </div>
  );
}
