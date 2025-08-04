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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/40 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary Background Image with Better Overlay */}
        <div className="absolute inset-0 opacity-3">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/d4d912cb4847166258ac81f8b4ca3abecc963aab?width=2560"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Beautiful Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-amber-50/40 to-yellow-50/50" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/80 via-transparent to-cafe-orange/5" />
        
        {/* Modern Mesh Gradient Effects */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cafe-orange/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-bl from-amber-400/12 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '10s' }} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-tr from-yellow-400/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s', animationDuration: '12s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-tl from-cafe-brown/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s', animationDuration: '9s' }} />
        </div>
        
        {/* Floating Coffee Elements with Enhanced Animation */}
        <div className="absolute top-16 left-8 w-10 h-10 bg-gradient-to-br from-cafe-brown/25 to-cafe-brown/15 rounded-full animate-bounce shadow-xl backdrop-blur-sm" style={{ animationDelay: '0s', animationDuration: '4s' }} />
        <div className="absolute top-32 right-16 w-8 h-8 bg-gradient-to-br from-cafe-orange/25 to-amber-400/20 rounded-full animate-bounce shadow-lg backdrop-blur-sm" style={{ animationDelay: '1.5s', animationDuration: '5s' }} />
        <div className="absolute bottom-32 left-1/5 w-12 h-12 bg-gradient-to-br from-amber-400/20 to-yellow-400/15 rounded-full animate-bounce shadow-xl backdrop-blur-sm" style={{ animationDelay: '3s', animationDuration: '6s' }} />
        <div className="absolute bottom-16 right-1/4 w-9 h-9 bg-gradient-to-br from-cafe-brown/20 to-cafe-orange/15 rounded-full animate-bounce shadow-lg backdrop-blur-sm" style={{ animationDelay: '0.8s', animationDuration: '4.5s' }} />
        
        {/* Geometric Floating Elements */}
        <div className="absolute top-1/3 left-1/6 w-6 h-6 bg-gradient-to-br from-cafe-orange/20 to-amber-400/15 transform rotate-45 animate-spin shadow-md" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-1/3 right-1/6 w-8 h-8 bg-gradient-to-br from-yellow-400/15 to-cafe-brown/12 transform rotate-12 animate-spin shadow-lg" style={{ animationDelay: '5s', animationDuration: '25s' }} />
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-3" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,165,0,0.15) 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }} />
        
        {/* Elegant Light Rays */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-40 bg-gradient-to-b from-cafe-orange/20 to-transparent blur-sm opacity-50" />
        <div className="absolute bottom-0 right-1/3 w-1 h-32 bg-gradient-to-t from-amber-400/15 to-transparent blur-sm opacity-40" />
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Enhanced Header */}
        <div className="bg-white/90 backdrop-blur-lg border-b border-gradient-to-r from-cafe-orange/20 via-amber-400/15 to-yellow-400/20 px-4 py-8 shadow-xl">
          {/* Beautiful Header Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-orange-50/80 to-amber-50/60 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cafe-orange/5 to-transparent" />
          
          <div className="relative z-10">
            {/* Enhanced Logo Container */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                {/* Logo Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cafe-orange/20 to-amber-400/20 rounded-[30px] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-60 group-hover:opacity-80" />
                
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/f2aaa14515154ad18f8cfe5439814ab435d6222d?width=793"
                  alt="Chhong Cafe & BBQ Logo"
                  className="relative w-full max-w-xs sm:max-w-sm md:max-w-md h-auto rounded-[30px] shadow-2xl group-hover:shadow-3xl transition-all duration-500 ring-2 ring-white/50 group-hover:ring-cafe-orange/30"
                />
                
                {/* Corner Decorations */}
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-cafe-orange to-amber-400 rounded-full shadow-lg opacity-80" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-full shadow-md opacity-70" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-cafe-orange rounded-full shadow-md opacity-70" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-cafe-brown to-cafe-orange rounded-full shadow-lg opacity-80" />
              </div>
            </div>

            {/* Enhanced Title */}
            <div className="text-center mb-8">
              <h1 className="font-sriracha text-transparent bg-clip-text bg-gradient-to-r from-cafe-brown via-cafe-orange to-amber-500 text-4xl sm:text-5xl md:text-6xl mb-2 drop-shadow-lg">
                Admin Panel
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-cafe-orange to-amber-400 mx-auto rounded-full shadow-sm" />
              <p className="text-cafe-text-medium font-medium mt-3 text-lg">
                Manage your beautiful menu
              </p>
            </div>

            {/* Enhanced Navigation */}
            <div className="flex justify-center gap-6 mb-6">
              <Button
                onClick={() => navigate("/qr-menu-chhong_caffe")}
                variant="outline"
                className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm hover:bg-cafe-orange/10 border-2 border-cafe-orange/30 hover:border-cafe-orange/60 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl group"
              >
                <Eye className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-semibold">View Menu</span>
              </Button>
              <Button
                onClick={() => navigate("/qr-menu-chhong_caffe/create-item")}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cafe-orange to-amber-500 hover:from-cafe-brown hover:to-cafe-orange transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl group transform hover:scale-105"
              >
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-semibold">Add Item</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
              {/* Total Items Card */}
              <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-white to-gray-50/80 border-0 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-gray-600/10 group-hover:from-slate-500/10 group-hover:to-gray-600/15 transition-all duration-500" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 via-gray-500 to-slate-600" />
                <CardContent className="p-6 text-center relative z-10">
                  <div className="mb-3">
                    <Package className="h-8 w-8 text-slate-600 mx-auto group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-3xl font-bold text-slate-700 mb-1 group-hover:text-slate-800 transition-colors duration-300">
                    {stats.total}
                  </div>
                  <div className="text-sm font-semibold text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                    Total Items
                  </div>
                </CardContent>
                {/* Floating particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-slate-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-gray-500 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
              </Card>

              {/* Drinks Card */}
              <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-white to-orange-50/60 border-0 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cafe-orange/5 to-amber-400/10 group-hover:from-cafe-orange/10 group-hover:to-amber-400/15 transition-all duration-500" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cafe-orange via-amber-400 to-yellow-400" />
                <CardContent className="p-6 text-center relative z-10">
                  <div className="mb-3">
                    <Coffee className="h-8 w-8 text-cafe-orange mx-auto group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-3xl font-bold text-cafe-orange mb-1 group-hover:text-cafe-brown transition-colors duration-300">
                    {stats.drinks}
                  </div>
                  <div className="text-sm font-semibold text-cafe-text-medium group-hover:text-cafe-text-dark transition-colors duration-300">
                    Drinks
                  </div>
                </CardContent>
                {/* Coffee steam effect */}
                <div className="absolute top-3 right-5 w-1 h-4 bg-gradient-to-t from-cafe-orange/30 to-transparent rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 w-1 h-6 bg-gradient-to-t from-amber-400/30 to-transparent rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0.5s' }} />
              </Card>

              {/* Foods Card */}
              <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-white to-yellow-50/60 border-0 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-amber-500/10 group-hover:from-yellow-400/10 group-hover:to-amber-500/15 transition-all duration-500" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400" />
                <CardContent className="p-6 text-center relative z-10">
                  <div className="mb-3">
                    <UtensilsCrossed className="h-8 w-8 text-amber-600 mx-auto group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-3xl font-bold text-amber-600 mb-1 group-hover:text-amber-700 transition-colors duration-300">
                    {stats.foods}
                  </div>
                  <div className="text-sm font-semibold text-amber-500 group-hover:text-amber-600 transition-colors duration-300">
                    Foods
                  </div>
                </CardContent>
                {/* Food sparkles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                <div className="absolute bottom-4 left-5 w-1 h-1 bg-amber-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" style={{ animationDelay: '1s' }} />
              </Card>

              {/* Food Sets Card */}
              <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-white to-orange-50/60 border-0 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cafe-brown/5 to-orange-600/10 group-hover:from-cafe-brown/10 group-hover:to-orange-600/15 transition-all duration-500" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cafe-brown via-orange-500 to-red-400" />
                <CardContent className="p-6 text-center relative z-10">
                  <div className="mb-3">
                    <Package className="h-8 w-8 text-cafe-brown mx-auto group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-3xl font-bold text-cafe-brown mb-1 group-hover:text-orange-700 transition-colors duration-300">
                    {stats.foodSets}
                  </div>
                  <div className="text-sm font-semibold text-cafe-text-medium group-hover:text-cafe-text-dark transition-colors duration-300">
                    Food Sets
                  </div>
                </CardContent>
                {/* Set indicators */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-cafe-brown rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-5 right-6 w-1 h-1 bg-orange-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-red-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            </div>

            {/* Enhanced Filter Tabs */}
            <div className="flex justify-center mb-8">
              <div className="relative bg-gradient-to-r from-white via-gray-50/80 to-white rounded-[30px] p-2 shadow-2xl hover:shadow-3xl transition-all duration-500 ring-1 ring-gray-200/60 hover:ring-cafe-orange/30 backdrop-blur-sm">
                {/* Enhanced background with multiple layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50/60 via-white/90 to-gray-50/60 rounded-[30px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-amber-50/20 rounded-[30px]" />
                
                {/* Enhanced animated background slider */}
                <div
                  className={`absolute top-2 h-[53px] bg-gradient-to-r from-cafe-orange via-amber-500 to-yellow-400 rounded-[25px] transition-all duration-700 ease-out shadow-2xl ${
                    activeFilter === "all"
                      ? "w-[calc(25%-4px)] translate-x-1"
                      : activeFilter === "drink"
                      ? "w-[calc(25%-4px)] translate-x-[calc(100%+1px)]"
                      : activeFilter === "food"
                      ? "w-[calc(25%-4px)] translate-x-[calc(200%+2px)]"
                      : "w-[calc(25%-4px)] translate-x-[calc(300%+3px)]"
                  }`}
                >
                  {/* Multiple glowing effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/20 to-white/30 rounded-[25px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/15 rounded-[25px]" />
                  <div className="absolute inset-0 bg-gradient-to-br from-cafe-orange/50 via-transparent to-amber-400/50 rounded-[25px] blur-sm" />
                  
                  {/* Active button shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-[25px] animate-pulse" />
                </div>
                
                {/* Enhanced buttons container */}
                <div className="relative flex">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`flex-1 px-4 py-4 font-bold text-sm transition-all duration-700 rounded-[23px] relative overflow-hidden group ${
                      activeFilter === "all"
                        ? "text-white transform scale-105 shadow-lg"
                        : "text-gray-700 hover:text-cafe-orange hover:scale-105"
                    }`}
                  >
                    {/* Enhanced button hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cafe-orange/15 via-amber-400/10 to-yellow-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[23px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[23px]" />
                    
                    <div className="flex items-center gap-2 justify-center relative z-10">
                      <Package className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="whitespace-nowrap">All Items</span>
                    </div>
                    
                    {/* Enhanced active indicator */}
                    {activeFilter === "all" && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-white/60 rounded-full animate-pulse shadow-lg" />
                    )}
                    
                    {/* Corner glow for active state */}
                    {activeFilter === "all" && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-white/50 rounded-full animate-pulse" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveFilter("drink")}
                    className={`flex-1 px-4 py-4 font-bold text-sm transition-all duration-700 rounded-[23px] relative overflow-hidden group ${
                      activeFilter === "drink"
                        ? "text-white transform scale-105 shadow-lg"
                        : "text-gray-700 hover:text-cafe-orange hover:scale-105"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cafe-orange/15 via-amber-400/10 to-yellow-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[23px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[23px]" />
                    
                    <div className="flex items-center gap-2 justify-center relative z-10">
                      <Coffee className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="whitespace-nowrap">Drinks</span>
                    </div>
                    
                    {activeFilter === "drink" && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-white/60 rounded-full animate-pulse shadow-lg" />
                    )}
                    
                    {activeFilter === "drink" && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-white/50 rounded-full animate-pulse" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveFilter("food")}
                    className={`flex-1 px-4 py-4 font-bold text-sm transition-all duration-700 rounded-[23px] relative overflow-hidden group ${
                      activeFilter === "food"
                        ? "text-white transform scale-105 shadow-lg"
                        : "text-gray-700 hover:text-cafe-orange hover:scale-105"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cafe-orange/15 via-amber-400/10 to-yellow-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[23px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[23px]" />
                    
                    <div className="flex items-center gap-2 justify-center relative z-10">
                      <UtensilsCrossed className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="whitespace-nowrap">Foods</span>
                    </div>
                    
                    {activeFilter === "food" && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-white/60 rounded-full animate-pulse shadow-lg" />
                    )}
                    
                    {activeFilter === "food" && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-white/50 rounded-full animate-pulse" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveFilter("food_set")}
                    className={`flex-1 px-4 py-4 font-bold text-sm transition-all duration-700 rounded-[23px] relative overflow-hidden group ${
                      activeFilter === "food_set"
                        ? "text-white transform scale-105 shadow-lg"
                        : "text-gray-700 hover:text-cafe-orange hover:scale-105"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cafe-orange/15 via-amber-400/10 to-yellow-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[23px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[23px]" />
                    
                    <div className="flex items-center gap-2 justify-center relative z-10">
                      <Package className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="whitespace-nowrap">Food Sets</span>
                    </div>
                    
                    {activeFilter === "food_set" && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-white/60 rounded-full animate-pulse shadow-lg" />
                    )}
                    
                    {activeFilter === "food_set" && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-white/50 rounded-full animate-pulse" />
                    )}
                  </button>
                </div>
                
                {/* Enhanced shine effects */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-t-[30px]" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200/30 to-transparent rounded-b-[30px]" />
                
                {/* Floating sparkles */}
                <div className="absolute top-4 left-4 w-1 h-1 bg-cafe-orange/40 rounded-full animate-pulse" style={{ animationDelay: '0s', animationDuration: '2s' }} />
                <div className="absolute bottom-4 right-4 w-1 h-1 bg-amber-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }} />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-500 bg-white rounded-[20px] shadow-lg hover:scale-[1.02] group relative border-0"
                  >
                    {/* Top gradient bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cafe-orange via-yellow-400 to-cafe-brown opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Image Container */}
                    <div className="aspect-square overflow-hidden relative bg-gray-50">
                      <ImageWithPlaceholder
                        src={item.image}
                        alt={item.name}
                        category={item.category}
                        isVisible={true}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Overlay gradient for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Category badge */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-cafe-text-dark">
                        {item.category === "food_set" ? "Food Set" : item.category}
                      </div>
                    </div>
                    
                    {/* Content Container */}
                    <CardContent className="p-4 bg-gradient-to-b from-white to-gray-50/80 flex-1 flex flex-col justify-between min-h-[160px]">
                      {/* Title */}
                      <div className="flex-shrink-0 mb-3">
                        <h3 className="font-poppins font-bold text-lg text-cafe-text-dark text-center leading-tight h-12 flex items-center justify-center">
                          {item.name}
                        </h3>
                      </div>
                      
                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        <div className="bg-white/60 rounded-lg p-2 backdrop-blur-sm">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-cafe-text-light font-medium">Size:</span>
                              <span className="text-cafe-text-dark font-semibold bg-cafe-orange/10 px-2 py-0.5 rounded-full text-xs">
                                {item.size}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-cafe-text-light font-medium">Price:</span>
                              <span className="text-cafe-orange font-bold text-lg">
                                ${item.price}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {item.description && (
                          <div className="bg-gray-50/80 rounded-lg p-2">
                            <p className="text-xs text-cafe-text-light leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-auto">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 hover:bg-cafe-orange/10 hover:border-cafe-orange transition-all duration-300"
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
                              className="flex-1 hover:bg-red-600 transition-all duration-300"
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
                    
                    {/* Hover border effect */}
                    <div className="absolute inset-0 rounded-[20px] ring-2 ring-cafe-orange/0 group-hover:ring-cafe-orange/30 pointer-events-none transition-all duration-300"></div>
                    
                    {/* Corner accent */}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-cafe-orange rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"></div>
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
