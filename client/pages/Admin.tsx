import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { menuApi, DisplayMenuItem, CreateItemRequest, UpdateItemRequest, ApiError } from "../lib/api";
import ImageWithPlaceholder from "../components/ImageWithPlaceholder";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  Coffee,
  UtensilsCrossed,
  Package,
} from "lucide-react";

interface EditFormData {
  name: string;
  size: string;
  price: string;
  image: string;
  category: "drink" | "food" | "food_set" | "";
  description: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<DisplayMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "drink" | "food" | "food_set">(
    "all",
  );

  // Edit modal state
  const [editingItem, setEditingItem] = useState<DisplayMenuItem | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: "",
    size: "",
    price: "",
    image: "",
    category: "",
    description: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  // Fetch menu data
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await menuApi.getMenuSeparated();
        const allItems: DisplayMenuItem[] = [...response.drinks, ...response.foods, ...(response.foodSets || [])];
        setMenuItems(allItems);
        console.log("Admin menu data loaded:", allItems.length, "items");
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        if (err instanceof ApiError) {
          setError(
            `Failed to load menu: ${err.message} (Status: ${err.status})`,
          );
        } else {
          setError("Failed to load menu. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Filter items based on active filter
  const filteredItems = menuItems.filter(
    (item) => activeFilter === "all" || item.category === activeFilter,
  );

  // Stats
  const stats = {
    total: menuItems.length,
    drinks: menuItems.filter((item) => item.category === "drink").length,
    foods: menuItems.filter((item) => item.category === "food").length,
    foodSets: menuItems.filter((item) => item.category === "food_set").length,
  };

  // Open edit dialog
  const handleEditClick = (item: DisplayMenuItem) => {
    setEditingItem(item);
    setEditFormData({
      name: item.name,
      size: item.size,
      price: item.price,
      image: item.image || "",
      category: item.category,
      description: item.description || "",
    });
    setEditErrors({});
  };

  // Handle edit form changes
  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
    if (editErrors[field]) {
      setEditErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate edit form
  const validateEditForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editFormData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!editFormData.size.trim()) {
      newErrors.size = "Size is required";
    }
    if (!editFormData.price.trim()) {
      newErrors.price = "Price is required";
    }
    if (!editFormData.category) {
      newErrors.category = "Category is required";
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle update
  const handleUpdate = async () => {
    if (!editingItem || !validateEditForm()) return;

    try {
      setIsUpdating(true);

      const updatedItem = await menuApi.updateMenuItem(editingItem.id, {
        name: editFormData.name.trim(),
        size: editFormData.size.trim(),
        price: editFormData.price.trim(),
        image: editFormData.image.trim() || undefined,
        category: editFormData.category.toUpperCase() as "DRINK" | "FOOD" | "FOOD_SET",
        description: editFormData.description.trim() || undefined,
      });

      // Update local state
      setMenuItems((prev) =>
        prev.map((item) => (item.id === editingItem.id ? updatedItem : item)),
      );

      setEditingItem(null);
      setError(null);
      console.log("Item updated successfully:", updatedItem);
    } catch (err) {
      console.error("Failed to update item:", err);
      if (err instanceof ApiError) {
        setError(
          `Failed to update item: ${err.message} (Status: ${err.status})`,
        );
      } else {
        setError("Failed to update item. Please try again later.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete
  const handleDelete = async (item: DisplayMenuItem) => {
    try {
      await menuApi.deleteMenuItem(item.id);

      // Update local state
      setMenuItems((prev) => prev.filter((i) => i.id !== item.id));
      console.log("Item deleted successfully:", item);
    } catch (err) {
      console.error("Failed to delete item:", err);
      if (err instanceof ApiError) {
        setError(
          `Failed to delete item: ${err.message} (Status: ${err.status})`,
        );
      } else {
        setError("Failed to delete item. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-5">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/d4d912cb4847166258ac81f8b4ca3abecc963aab?width=2560"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 min-h-screen">
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
            Admin Panel
          </h1>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mb-6">
            <Button
              onClick={() => navigate("/qr-menu-chhong_caffe")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Menu
            </Button>
            <Button
              onClick={() => navigate("/qr-menu-chhong_caffe/create-item")}
              className="flex items-center gap-2 bg-cafe-orange hover:bg-cafe-brown"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-cafe-text-dark">
                    {stats.total}
                  </div>
                  <div className="text-sm text-cafe-text-medium">
                    Total Items
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-cafe-orange flex items-center justify-center gap-2">
                    <Coffee className="h-6 w-6" />
                    {stats.drinks}
                  </div>
                  <div className="text-sm text-cafe-text-medium">Drinks</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-cafe-brown flex items-center justify-center gap-2">
                    <UtensilsCrossed className="h-6 w-6" />
                    {stats.foods}
                  </div>
                  <div className="text-sm text-cafe-text-medium">Foods</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-cafe-brown flex items-center justify-center gap-2">
                    <Package className="h-6 w-6" />
                    {stats.foodSets}
                  </div>
                  <div className="text-sm text-cafe-text-medium">Food Sets</div>
                </CardContent>
              </Card>
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-center mb-6">
              <div className="bg-cafe-bg-light rounded-[20px] p-1">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-6 py-2 rounded-[16px] font-medium transition-all ${
                    activeFilter === "all"
                      ? "bg-cafe-orange text-white shadow-md"
                      : "text-cafe-text-dark hover:bg-white/50"
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setActiveFilter("drink")}
                  className={`px-6 py-2 rounded-[16px] font-medium transition-all ${
                    activeFilter === "drink"
                      ? "bg-cafe-orange text-white shadow-md"
                      : "text-cafe-text-dark hover:bg-white/50"
                  }`}
                >
                  Drinks
                </button>
                <button
                  onClick={() => setActiveFilter("food")}
                  className={`px-6 py-2 rounded-[16px] font-medium transition-all ${
                    activeFilter === "food"
                      ? "bg-cafe-orange text-white shadow-md"
                      : "text-cafe-text-dark hover:bg-white/50"
                  }`}
                >
                  Foods
                </button>
                <button
                  onClick={() => setActiveFilter("food_set")}
                  className={`px-6 py-2 rounded-[16px] font-medium transition-all ${
                    activeFilter === "food_set"
                      ? "bg-cafe-orange text-white shadow-md"
                      : "text-cafe-text-dark hover:bg-white/50"
                  }`}
                >
                  Food Sets
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
                <Button
                  onClick={() => setError(null)}
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                >
                  Dismiss
                </Button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cafe-orange"></div>
                <p className="mt-2 text-cafe-text-medium">Loading items...</p>
              </div>
            )}

            {/* Items Grid */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-[174/119] overflow-hidden relative">
                      <ImageWithPlaceholder
                        src={item.image}
                        alt={item.name}
                        category={item.category}
                        isVisible={true}
                        className="w-full h-full"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg text-cafe-text-dark mb-2 truncate">
                        {item.name}
                      </h3>
                      <div className="space-y-1 mb-4">
                        <p className="text-sm text-cafe-text-light">
                          Size: {item.size}
                        </p>
                        <p className="text-sm text-cafe-text-medium">
                          Price: {item.price}$
                        </p>
                        <p className="text-xs text-cafe-text-light capitalize">
                          Category: {item.category}
                        </p>
                        {item.description && (
                          <p className="text-xs text-cafe-text-light truncate">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleEditClick(item)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          {editingItem && (
                            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Menu Item</DialogTitle>
                              </DialogHeader>
                              {isUpdating && (
                                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
                                  <p className="font-medium">
                                    Item updated successfully!
                                  </p>
                                </div>
                              )}
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="edit-name">Name *</Label>
                                  <Input
                                    id="edit-name"
                                    value={editFormData.name}
                                    onChange={(e) =>
                                      handleEditInputChange(
                                        "name",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isUpdating}
                                    className={
                                      editErrors.name ? "border-red-500" : ""
                                    }
                                  />
                                  {editErrors.name && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {editErrors.name}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <Label htmlFor="edit-category">
                                    Category *
                                  </Label>
                                  <Select
                                    value={editFormData.category}
                                    onValueChange={(value) =>
                                      handleEditInputChange("category", value)
                                    }
                                    disabled={isUpdating}
                                  >
                                    <SelectTrigger
                                      className={
                                        editErrors.category
                                          ? "border-red-500"
                                          : ""
                                      }
                                    >
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="drink">Drink</SelectItem>
                                      <SelectItem value="food">Food</SelectItem>
                                      <SelectItem value="food_set">Food Set</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {editErrors.category && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {editErrors.category}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <Label htmlFor="edit-size">Size *</Label>
                                  <Input
                                    id="edit-size"
                                    value={editFormData.size}
                                    onChange={(e) =>
                                      handleEditInputChange(
                                        "size",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isUpdating}
                                    className={
                                      editErrors.size ? "border-red-500" : ""
                                    }
                                  />
                                  {editErrors.size && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {editErrors.size}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <Label htmlFor="edit-price">Price *</Label>
                                  <Input
                                    id="edit-price"
                                    value={editFormData.price}
                                    onChange={(e) =>
                                      handleEditInputChange(
                                        "price",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isUpdating}
                                    className={
                                      editErrors.price ? "border-red-500" : ""
                                    }
                                  />
                                  {editErrors.price && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {editErrors.price}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <Label htmlFor="edit-image">Image URL</Label>
                                  <Input
                                    id="edit-image"
                                    value={editFormData.image}
                                    onChange={(e) =>
                                      handleEditInputChange(
                                        "image",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isUpdating}
                                  />

                                  {/* Image Preview */}
                                  <div className="mt-3">
                                    <Label className="text-sm font-medium text-cafe-text-dark mb-2 block">
                                      Preview
                                    </Label>
                                    <div className="w-32 h-24 border border-gray-200 rounded-lg overflow-hidden">
                                      <ImageWithPlaceholder
                                        src={editFormData.image}
                                        alt="Preview"
                                        category={
                                          editFormData.category || "drink"
                                        }
                                        isVisible={true}
                                        className="w-full h-full"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="edit-description">
                                    Description
                                  </Label>
                                  <Textarea
                                    id="edit-description"
                                    value={editFormData.description}
                                    onChange={(e) =>
                                      handleEditInputChange(
                                        "description",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isUpdating}
                                    rows={3}
                                  />
                                </div>

                                <div className="flex gap-3 pt-4">
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditingItem(null)}
                                    disabled={isUpdating}
                                    className="flex-1"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleUpdate}
                                    disabled={isUpdating}
                                    className="flex-1 bg-cafe-orange hover:bg-cafe-brown"
                                  >
                                    {isUpdating ? "Updating..." : "Update"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          )}
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex-1"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Menu Item
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{item.name}"?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-cafe-text-light mb-4">
                  {activeFilter === "all" ? (
                    <Plus className="h-16 w-16 mx-auto" />
                  ) : activeFilter === "drink" ? (
                    <Coffee className="h-16 w-16 mx-auto" />
                  ) : activeFilter === "food" ? (
                    <UtensilsCrossed className="h-16 w-16 mx-auto" />
                  ) : (
                    <Package className="h-16 w-16 mx-auto" />
                  )}
                </div>
                <h3 className="text-xl font-medium text-cafe-text-dark mb-2">
                  No {activeFilter === "all" ? "items" : 
                      activeFilter === "food_set" ? "food sets" : 
                      activeFilter + "s"} found
                </h3>
                <p className="text-cafe-text-medium mb-4">
                  {activeFilter === "all"
                    ? "Start by adding your first menu item."
                    : activeFilter === "food_set"
                    ? "No food sets have been added yet."
                    : `No ${activeFilter}s have been added yet.`}
                </p>
                <Button
                  onClick={() => navigate("/qr-menu-chhong_caffe/create-item")}
                  className="bg-cafe-orange hover:bg-cafe-brown"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
