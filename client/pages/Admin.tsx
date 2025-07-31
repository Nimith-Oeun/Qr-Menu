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
  Search,
  Filter,
  Grid3X3,
  List,
  Settings,
  Sparkles,
  TrendingUp,
  BarChart3,
  Zap,
  RefreshCw,
} from "lucide-react";

interface EditFormData {
  name: string;
  size: string;
  price: string;
  image: string;
  category: "drink" | "food" | "";
  description: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<DisplayMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "drink" | "food">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
        const allItems: DisplayMenuItem[] = [...response.drinks, ...response.foods];
        setMenuItems(allItems);
        console.log("Admin menu data loaded:", allItems.length, "items");
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        if (err instanceof ApiError) {
          setError(`Failed to load menu: ${err.message} (Status: ${err.status})`);
        } else {
          setError("Failed to load menu. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Filter and search items
  const filteredItems = menuItems.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.category === activeFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Stats
  const stats = {
    total: menuItems.length,
    drinks: menuItems.filter((item) => item.category === "drink").length,
    foods: menuItems.filter((item) => item.category === "food").length,
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
        category: editFormData.category.toUpperCase() as "DRINK" | "FOOD",
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
        setError(`Failed to update item: ${err.message} (Status: ${err.status})`);
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
        setError(`Failed to delete item: ${err.message} (Status: ${err.status})`);
      } else {
        setError("Failed to delete item. Please try again later.");
      }
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await menuApi.getMenuSeparated();
      const allItems: DisplayMenuItem[] = [...response.drinks, ...response.foods];
      setMenuItems(allItems);
      setError(null);
    } catch (err) {
      console.error("Failed to refresh:", err);
      setError("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(99,102,241,0.1)_1px,_transparent_0)] bg-[size:20px_20px] opacity-30"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 blur-xl animate-pulse delay-2000"></div>

      <div className="relative z-10 min-h-screen">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Logo Section */}
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

            {/* Title with Modern Typography */}
            <div className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-cafe-brown mb-2">
                Admin Dashboard
                </h1>
              <p className="text-lg text-gray-600 font-medium">Manage your menu with style</p>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Button
                onClick={() => navigate("/qr-menu-chhong_caffe")}
                variant="outline"
                className="flex items-center gap-2 bg-white/50 hover:bg-white/80 border-gray-300/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Eye className="h-4 w-4" />
                View Menu
              </Button>
              <Button
                onClick={() => navigate("/qr-menu-chhong_caffe/create-item")}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Plus className="h-4 w-4" />
                Add New Item
              </Button>
              <Button
                onClick={handleRefresh}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2 bg-white/50 hover:bg-white/80 border-gray-300/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Modern Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold mb-1">{stats.total}</div>
                    <div className="text-purple-100 font-medium">Total Items</div>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <BarChart3 className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold mb-1">{stats.drinks}</div>
                    <div className="text-blue-100 font-medium">Drinks</div>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <Coffee className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald-500 to-green-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold mb-1">{stats.foods}</div>
                    <div className="text-emerald-100 font-medium">Foods</div>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <UtensilsCrossed className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modern Controls Bar */}
          <Card className="mb-8 border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300/50 bg-white/50 focus:bg-white transition-all duration-300"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-gray-100/80 rounded-xl p-1 backdrop-blur-sm">
                  {[
                    { id: "all", label: "All Items", icon: Filter },
                    { id: "drink", label: "Drinks", icon: Coffee },
                    { id: "food", label: "Foods", icon: UtensilsCrossed },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveFilter(id as typeof activeFilter)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                        activeFilter === id
                          ? "bg-white shadow-md text-purple-600 scale-105"
                          : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>

                {/* View Toggle */}
                <div className="flex bg-gray-100/80 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-300 ${
                      viewMode === "grid" ? "bg-white shadow-sm text-purple-600" : "text-gray-600"
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-300 ${
                      viewMode === "list" ? "bg-white shadow-sm text-purple-600" : "text-gray-600"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Zap className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                  <Button
                    onClick={() => setError(null)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-100"
                  >
                    ✕
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Sparkles className="h-6 w-6 text-purple-600 animate-pulse" />
                </div>
              </div>
              <p className="text-gray-600 font-medium">Loading your amazing menu...</p>
            </div>
          )}

          {/* Items Grid/List */}
          {!loading && (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
            }>
              {filteredItems.map((item, index) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/60 backdrop-blur-sm"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {viewMode === "grid" ? (
                    <>
                      <div className="aspect-[174/119] overflow-hidden relative">
                        <ImageWithPlaceholder
                          src={item.image}
                          alt={item.name}
                          category={item.category}
                          isVisible={true}
                          className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
                            {item.name}
                          </h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.category === 'drink' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {item.category}
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Size:</span>
                            <span className="font-medium text-gray-800">{item.size}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-bold text-purple-600">{item.price}</span>
                          </div>
                        </div>
                        
                        {item.description && (
                          <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                            {item.description}
                          </p>
                        )}

                        {/* Modern Action Buttons */}
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 bg-white/50 hover:bg-white border-gray-300/50 transition-all duration-300 hover:scale-105"
                                onClick={() => handleEditClick(item)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            {editingItem && (
                              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Edit Menu Item
                                  </DialogTitle>
                                </DialogHeader>
                                {isUpdating && (
                                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-4 backdrop-blur-sm">
                                    <div className="flex items-center gap-2">
                                      <Sparkles className="h-4 w-4 animate-pulse" />
                                      <p className="font-medium">Item updated successfully!</p>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700">Name *</Label>
                                    <Input
                                      id="edit-name"
                                      value={editFormData.name}
                                      onChange={(e) => handleEditInputChange("name", e.target.value)}
                                      disabled={isUpdating}
                                      className={`mt-1 ${editErrors.name ? "border-red-500" : "border-gray-300/50"} bg-white/50 focus:bg-white transition-all duration-300`}
                                    />
                                    {editErrors.name && (
                                      <p className="text-red-500 text-xs mt-1">{editErrors.name}</p>
                                    )}
                                  </div>

                                  <div>
                                    <Label htmlFor="edit-category" className="text-sm font-medium text-gray-700">Category *</Label>
                                    <Select
                                      value={editFormData.category}
                                      onValueChange={(value) => handleEditInputChange("category", value)}
                                      disabled={isUpdating}
                                    >
                                      <SelectTrigger className={`mt-1 ${editErrors.category ? "border-red-500" : "border-gray-300/50"} bg-white/50`}>
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="drink">Drink</SelectItem>
                                        <SelectItem value="food">Food</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    {editErrors.category && (
                                      <p className="text-red-500 text-xs mt-1">{editErrors.category}</p>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-size" className="text-sm font-medium text-gray-700">Size *</Label>
                                      <Input
                                        id="edit-size"
                                        value={editFormData.size}
                                        onChange={(e) => handleEditInputChange("size", e.target.value)}
                                        disabled={isUpdating}
                                        className={`mt-1 ${editErrors.size ? "border-red-500" : "border-gray-300/50"} bg-white/50 focus:bg-white transition-all duration-300`}
                                      />
                                      {editErrors.size && (
                                        <p className="text-red-500 text-xs mt-1">{editErrors.size}</p>
                                      )}
                                    </div>

                                    <div>
                                      <Label htmlFor="edit-price" className="text-sm font-medium text-gray-700">Price *</Label>
                                      <Input
                                        id="edit-price"
                                        value={editFormData.price}
                                        onChange={(e) => handleEditInputChange("price", e.target.value)}
                                        disabled={isUpdating}
                                        className={`mt-1 ${editErrors.price ? "border-red-500" : "border-gray-300/50"} bg-white/50 focus:bg-white transition-all duration-300`}
                                      />
                                      {editErrors.price && (
                                        <p className="text-red-500 text-xs mt-1">{editErrors.price}</p>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="edit-image" className="text-sm font-medium text-gray-700">Image URL</Label>
                                    <Input
                                      id="edit-image"
                                      value={editFormData.image}
                                      onChange={(e) => handleEditInputChange("image", e.target.value)}
                                      disabled={isUpdating}
                                      className="mt-1 border-gray-300/50 bg-white/50 focus:bg-white transition-all duration-300"
                                    />

                                    {/* Modern Image Preview */}
                                    <div className="mt-4">
                                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Preview</Label>
                                      <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50/50">
                                        <ImageWithPlaceholder
                                          src={editFormData.image}
                                          alt="Preview"
                                          category={editFormData.category || "drink"}
                                          isVisible={true}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">Description</Label>
                                    <Textarea
                                      id="edit-description"
                                      value={editFormData.description}
                                      onChange={(e) => handleEditInputChange("description", e.target.value)}
                                      disabled={isUpdating}
                                      rows={3}
                                      className="mt-1 border-gray-300/50 bg-white/50 focus:bg-white transition-all duration-300"
                                    />
                                  </div>

                                  <div className="flex gap-3 pt-6">
                                    <Button
                                      variant="outline"
                                      onClick={() => setEditingItem(null)}
                                      disabled={isUpdating}
                                      className="flex-1 bg-white/50 hover:bg-white border-gray-300/50"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handleUpdate}
                                      disabled={isUpdating}
                                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300"
                                    >
                                      {isUpdating ? (
                                        <>
                                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                          Updating...
                                        </>
                                      ) : (
                                        "Update Item"
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 bg-red-50/50 hover:bg-red-100 border-red-200/50 text-red-600 hover:text-red-700 transition-all duration-300 hover:scale-105"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-bold text-gray-800">
                                  Delete Menu Item
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600">
                                  Are you sure you want to delete "<span className="font-medium text-gray-800">{item.name}</span>"?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-white/50 hover:bg-white border-gray-300/50">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item)}
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                                >
                                  Delete Item
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    // List View
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <ImageWithPlaceholder
                            src={item.image}
                            alt={item.name}
                            category={item.category}
                            isVisible={true}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800 truncate">{item.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span>Size: {item.size}</span>
                                <span>Price: <span className="font-bold text-purple-600">{item.price}</span></span>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.category === 'drink' 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                  {item.category}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditClick(item)}
                                    className="bg-white/50 hover:bg-white border-gray-300/50"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-red-50/50 hover:bg-red-100 border-red-200/50 text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Modern Empty State */}
          {!loading && filteredItems.length === 0 && (
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <CardContent className="text-center py-16">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
                    {activeFilter === "all" ? (
                      <Plus className="h-12 w-12 text-purple-600" />
                    ) : activeFilter === "drink" ? (
                      <Coffee className="h-12 w-12 text-blue-600" />
                    ) : (
                      <UtensilsCrossed className="h-12 w-12 text-green-600" />
                    )}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No {activeFilter === "all" ? "items" : activeFilter + "s"} found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm 
                    ? `No items match "${searchTerm}". Try a different search term.`
                    : activeFilter === "all"
                      ? "Your menu is empty. Start by adding your first delicious item!"
                      : `No ${activeFilter}s have been added yet. Add some amazing ${activeFilter}s to get started!`
                  }
                </p>
                
                {!searchTerm && (
                  <Button
                    onClick={() => navigate("/qr-menu-chhong_caffe/create-item")}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First {activeFilter === "all" ? "Item" : activeFilter}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}