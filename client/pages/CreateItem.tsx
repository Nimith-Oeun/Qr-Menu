import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { menuApi, CreateItemRequest, ApiError } from "../lib/api";
import ImageUploadService from "../lib/imageUpload";
import ImageWithPlaceholder from "../components/ImageWithPlaceholder";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Plus, Upload, X } from "lucide-react";

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
    category: "" as 'drink' | 'food' | 'food_set' | "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageData, setUploadedImageData] = useState<string | null>(null);

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
        image: uploadedImageData || formData.image.trim() || undefined,
        category: formData.category.toUpperCase() as 'DRINK' | 'FOOD' | 'FOOD_SET',
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
      setUploadedFile(null);
      setUploadProgress(0);
      setIsUploading(false);
      setUploadedImageData(null);

      // Reset file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

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

  // File upload functions
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = ImageUploadService.validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setUploadedFile(file);
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload file using the upload service
      const result = await ImageUploadService.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      // Store the base64 image data
      setUploadedImageData(result.url);
      setIsUploading(false);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
      setUploadedFile(null);
      setUploadProgress(0);
      setUploadedImageData(null);
    }
  };

  const simulateUpload = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await ImageUploadService.uploadFile(uploadedFile, (progress) => {
        setUploadProgress(progress);
      });

      handleInputChange('image', result.url);
      setIsUploading(false);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadedImageData(null);
    handleInputChange('image', '');
    
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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
              onClick={() => navigate("/qr-menu-chhong_caffe/admin")}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
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
                      <SelectItem value="food_set">Food Set</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>

                <div>
                  <Label htmlFor="size" className="text-sm font-medium text-cafe-text-dark">
                    Size *
                  </Label>
                  <Select
                    value={formData.size}
                    onValueChange={(value) => handleInputChange("size", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className={errors.size ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S">Small (S)</SelectItem>
                      <SelectItem value="M">Medium (M)</SelectItem>
                      <SelectItem value="L">Large (L)</SelectItem>
                      <SelectItem value="Set">Set</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label className="text-sm font-medium text-cafe-text-dark mb-3 block">
                    Item Image
                  </Label>
                  
                  {/* Upload Method Selection */}
                  <div className="space-y-4">
                    {/* File Upload Section */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-cafe-orange transition-colors">
                      {!uploadedFile ? (
                        <div>
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            Upload an image file
                          </p>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            disabled={isSubmitting}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            disabled={isSubmitting}
                            className="mb-2"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </Button>
                          <p className="text-xs text-gray-500">
                            Max 5MB • JPG, PNG, GIF
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Image Preview */}
                          {uploadedImageData && (
                            <div className="relative">
                              <img 
                                src={uploadedImageData} 
                                alt="Preview"
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Upload className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">
                                {uploadedFile.name}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeUploadedFile}
                              disabled={isSubmitting}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {isUploading && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-gray-600">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-cafe-orange h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          {!isUploading && uploadProgress === 100 && (
                            <div className="flex items-center space-x-2 text-green-600">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-sm">Upload complete</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="px-3 text-sm text-gray-500">OR</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* URL Input Section */}
                    <div>
                      <Label htmlFor="image" className="text-sm font-medium text-cafe-text-dark">
                        Image URL
                      </Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => handleInputChange("image", e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        disabled={isSubmitting || !!uploadedFile}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {uploadedFile ? 'File upload takes priority over URL' : 'Enter direct image URL as alternative'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Image Preview */}
                  <div className="mt-4">
                    <Label className="text-sm font-medium text-cafe-text-dark mb-2 block">
                      Preview
                    </Label>
                    <div className="w-full max-w-xs h-48 border border-gray-200 rounded-lg overflow-hidden mx-auto">
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
                    onClick={() => navigate("/qr-menu-chhong_caffe/admin")}
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