import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { menuApi, CreateItemRequest, ApiError } from "../lib/api";
import ImageWithPlaceholder from "../components/ImageWithPlaceholder";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Plus, Coffee, UtensilsCrossed, Sparkles, CheckCircle, AlertCircle, ImageIcon } from "lucide-react";

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
      
      const newItem: CreateItemRequest = {
        name: formData.name.trim(),
        size: formData.size.trim(),
        price: formData.price.trim(),
        image: formData.image.trim() || undefined,
        category: formData.category.toUpperCase() as 'DRINK' | 'FOOD',
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
        navigate("/qr-menu-chhong_caffe/admin");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 relative overflow-hidden">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(99,102,241,0.1)_1px,_transparent_0)] bg-[size:20px_20px] opacity-30"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 blur-xl animate-pulse delay-2000"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg px-4 py-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/f2aaa14515154ad18f8cfe5439814ab435d6222d?width=793"
                alt="Chhong Cafe & BBQ Logo"
                className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto rounded-2xl shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Modern Title */}
          <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-cafe-brown mb-2">
              Create New Item
            </h1>
            <p className="text-lg text-gray-600 font-medium">Add a delicious item to your menu</p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Back Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/qr-menu-chhong_caffe/admin")}
              variant="outline"
              className="flex items-center gap-2 bg-white/50 hover:bg-white/80 border-gray-300/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/60 backdrop-blur-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                Add New Menu Item
              </CardTitle>
              <p className="text-gray-600 mt-2">Fill in the details below to create a new menu item</p>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              {/* Success Message */}
              {success && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 text-green-800 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-green-100 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Item added successfully!</p>
                      <p className="text-sm opacity-80">Redirecting to admin dashboard...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 text-red-800 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-red-100 rounded-full">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Error</p>
                      <p className="text-sm opacity-80">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Item Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Cappuccino, BBQ Ribs"
                    disabled={isSubmitting}
                    className={`transition-all duration-300 bg-white/50 border-gray-300/50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 ${errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Category Input */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <div className="flex gap-1">
                      <Coffee className="h-4 w-4 text-blue-500" />
                      <UtensilsCrossed className="h-4 w-4 text-green-500" />
                    </div>
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className={`transition-all duration-300 bg-white/50 border-gray-300/50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 ${errors.category ? "border-red-400" : ""}`}>
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200/50">
                      <SelectItem value="drink" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Coffee className="h-4 w-4 text-blue-500" />
                          Drink
                        </div>
                      </SelectItem>
                      <SelectItem value="food" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <UtensilsCrossed className="h-4 w-4 text-green-500" />
                          Food
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Size and Price Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Size Input */}
                  <div className="space-y-2">
                    <Label htmlFor="size" className="text-sm font-semibold text-gray-700">
                      Size *
                    </Label>
                    <Select
                      value={formData.size}
                      onValueChange={(value) => handleInputChange("size", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={`transition-all duration-300 bg-white/50 border-gray-300/50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 ${errors.size ? "border-red-400" : ""}`}>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200/50">
                        <SelectItem value="S">Small (S)</SelectItem>
                        <SelectItem value="M">Medium (M)</SelectItem>
                        <SelectItem value="L">Large (L)</SelectItem>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Half Rack">Half Rack</SelectItem>
                        <SelectItem value="Slice">Slice</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.size && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.size}
                      </p>
                    )}
                  </div>

                  {/* Price Input */}
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-semibold text-gray-700">
                      Price *
                    </Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="e.g., 5$, $5.99"
                      disabled={isSubmitting}
                      className={`transition-all duration-300 bg-white/50 border-gray-300/50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 ${errors.price ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.price}
                      </p>
                    )}
                  </div>
                </div>

                {/* Image URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-indigo-500" />
                    Image URL (Optional)
                  </Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    placeholder="https://example.com/delicious-food.jpg"
                    disabled={isSubmitting}
                    className="transition-all duration-300 bg-white/50 border-gray-300/50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    A beautiful image will be used automatically if none provided
                  </p>
                  
                  {/* Modern Image Preview */}
                  <div className="mt-4">
                    <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                      Preview
                    </Label>
                    <div className="relative">
                      <div className="w-40 h-32 border-2 border-dashed border-purple-300/50 rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 transition-all duration-300 hover:border-purple-400">
                        <ImageWithPlaceholder
                          src={formData.image}
                          alt="Preview"
                          category={formData.category || 'drink'}
                          isVisible={true}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <ImageIcon className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe what makes this item special..."
                    disabled={isSubmitting}
                    rows={4}
                    className="transition-all duration-300 bg-white/50 border-gray-300/50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/qr-menu-chhong_caffe/admin")}
                    disabled={isSubmitting}
                    className="flex-1 bg-white/50 hover:bg-white border-gray-300/50 transition-all duration-300 hover:scale-105"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Adding...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Item
                      </div>
                    )}
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