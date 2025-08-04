import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { menuApi, DisplayMenuItem, ApiError } from "../lib/api";
import ImageWithPlaceholder from "../components/ImageWithPlaceholder";

export default function Index() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("drink");
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [menuItems, setMenuItems] = useState<DisplayMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch menu data when component mounts
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 Auto-fetching menu data...");

        // Test API connectivity first
        await menuApi.test();
        console.log("✅ API connectivity test successful");

        // Fetch menu data
        const response = await menuApi.getMenuSeparated();
        console.log("📋 Menu data fetched:", {
          drinks: response.drinks.length,
          foods: response.foods.length,
        });

        // Combine drinks, foods, and food sets
        const allItems: DisplayMenuItem[] = [
          ...response.drinks,
          ...response.foods,
          ...(response.foodSets || []),
        ];
        setMenuItems(allItems);

        console.log(
          "✅ Menu loaded successfully:",
          allItems.length,
          "total items",
        );
      } catch (err) {
        console.error("❌ Failed to fetch menu:", err);

        if (err instanceof ApiError) {
          setError(
            `Failed to load menu: ${err.message} (Status: ${err.status})`,
          );
        } else {
          setError("Failed to load menu. Please check your connection.");
        }

        // Fallback to mock data
        console.log("🔄 Loading fallback mock data...");
        const mockItems: DisplayMenuItem[] = [
          // Drinks
          ...Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            name: `Coffee Drink ${i + 1}`,
            size: i % 2 === 0 ? "M" : "L",
            price: `${2 + (i % 3)}`,
            image:
              "https://api.builder.io/api/v1/image/assets/TEMP/2e811b0fa84092c929b579286fded5e620c45c19?width=347",
            category: "drink" as const,
            description: `Delicious coffee drink #${i + 1}`,
          })),
          // Foods
          ...Array.from({ length: 5 }, (_, i) => ({
            id: i + 6,
            name: `Food Item ${i + 1}`,
            size: i % 2 === 0 ? "M" : "L",
            price: `${4 + (i % 4)}`,
            image:
              "https://api.builder.io/api/v1/image/assets/TEMP/977e1ee7cf4be018cd9e90c67e54df15c36e50b0?width=347",
            category: "food" as const,
            description: `Tasty food item #${i + 1}`,
          })),
          // Food Sets
          ...Array.from({ length: 3 }, (_, i) => ({
            id: i + 11,
            name: `Food Set ${i + 1}`,
            size: "Set",
            price: `${8 + (i % 3)}`,
            image:
              "https://api.builder.io/api/v1/image/assets/TEMP/c4f8c9b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8?width=347",
            category: "food_set" as const,
            description: `Complete meal set #${i + 1}`,
          })),
        ];
        setMenuItems(mockItems);
        console.log("📋 Mock data loaded:", mockItems.length, "items");
      } finally {
        setLoading(false);
      }
    };

    // Auto-fetch immediately when component mounts
    fetchMenuData();
  }, []); // Empty dependency array ensures this runs only once when component mounts

  // Manual refresh function
  const refreshMenu = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔄 Manual refresh triggered...");
      const response = await menuApi.getMenuSeparated();
      const allItems: DisplayMenuItem[] = [
        ...response.drinks,
        ...response.foods,
        ...(response.foodSets || []),
      ];
      setMenuItems(allItems);
      console.log("✅ Menu refreshed successfully");
    } catch (err) {
      console.error("❌ Manual refresh failed:", err);
      setError("Failed to refresh menu");
    } finally {
      setLoading(false);
    }
  };

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for animations
  useEffect(() => {
    const items = document.querySelectorAll("[data-item-id]");

    // If not scrollable, show all items immediately
    const pageNotScrollable = document.body.scrollHeight <= window.innerHeight;

    if (pageNotScrollable) {
      const allVisible = new Set(
        Array.from(items).map((item) => item.getAttribute("data-item-id")),
      );
      setVisibleItems(allVisible);
      return;
    }

    // Otherwise, use observer as usual
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(
              (prev) =>
                new Set([...prev, entry.target.getAttribute("data-item-id")!]),
            );
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [activeTab, menuItems]); // Added menuItems to dependencies

  // Filter items based on active tab
  const currentMenuItems = menuItems.filter(
    (item) => item.category === activeTab,
  );

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

      {/* Enhanced Fixed Menu Header */}
      <div
        className={`z-50 transition-all duration-500 ${
          isScrolled
            ? "fixed transition-all duration-500 top-[-230px] left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gradient-to-r from-cafe-orange/20 via-amber-400/15 to-yellow-400/20"
            : "bg-white/90 backdrop-blur-lg border-b border-gradient-to-r from-cafe-orange/20 via-amber-400/15 to-yellow-400/20 shadow-xl"
        }`}
      >
        {/* Beautiful Header Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-orange-50/80 to-amber-50/60 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cafe-orange/5 to-transparent" />
        
        <div className="relative z-10">
          {/* Enhanced Logo Container */}
          <div className="flex justify-center px-4 mb-6">
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

          {isScrolled && (
            <div className="h-1 bg-gradient-to-r from-cafe-orange via-cafe-brown to-cafe-orange animate-pulse shadow-lg"></div>
          )}

          {/* Enhanced Title */}
          <div className="text-center mb-2">
            <h1
              className={`font-sriracha text-transparent bg-clip-text bg-gradient-to-r from-cafe-brown via-cafe-orange to-amber-500 drop-shadow-lg transition-all duration-500 ${
                isScrolled
                  ? "text-2xl sm:text-3xl md:text-4xl"
                  : "text-4xl sm:text-5xl md:text-6xl"
              }`}
            >
              Menu
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-cafe-orange to-amber-400 mx-auto rounded-full shadow-sm" />
            {/* <p className="text-cafe-text-medium font-medium mt-2 text-sm sm:text-base">
              Explore our delicious offerings
            </p> */}
          </div>
        </div>

        <div className="flex justify-center px-4">
          <div
            className={`relative bg-gradient-to-r from-white via-gray-50/80 to-white rounded-[30px] h-[58px] sm:h-[68px] w-full max-w-[380px] sm:max-w-[450px] p-2 transition-all duration-500 shadow-2xl hover:shadow-3xl ring-1 ring-gray-200/60 hover:ring-cafe-orange/30 backdrop-blur-sm ${
              isScrolled 
                ? "ring-2 ring-cafe-orange/30 shadow-xl bg-gradient-to-r from-cafe-orange/5 via-white to-cafe-orange/5" 
                : ""
            }`}
          >
            {/* Enhanced background with multiple layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50/60 via-white/90 to-gray-50/60 rounded-[30px]" />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-amber-50/20 rounded-[30px]" />
            
            {/* Enhanced animated background slider */}
            <div
              className={`absolute top-1 left-1 w-[calc(33.333%-4px)] h-[50px] sm:h-[60px] bg-gradient-to-r from-cafe-orange via-amber-500 to-yellow-400 rounded-[25px] transition-all duration-700 ease-out shadow-2xl ${
                activeTab === "food"
                  ? "translate-x-[calc(100%+2px)] shadow-orange-300/50"
                  : activeTab === "food_set"
                    ? "translate-x-[calc(200%+4px)] shadow-amber-300/50"
                    : "translate-x-[2px] shadow-orange-300/50"
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
            <div className="relative flex h-full">
              <button
                onClick={() => {
                  setActiveTab("drink");
                  setVisibleItems(new Set());
                }}
                className={`flex-1 flex items-center justify-center font-poppins font-bold text-xs sm:text-sm md:text-base transition-all duration-700 rounded-[23px] relative overflow-hidden group ${
                  activeTab === "drink" 
                    ? "text-white transform scale-105 shadow-lg" 
                    : "text-gray-700 hover:text-cafe-orange hover:scale-105"
                }`}
              >
                {/* Enhanced button hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cafe-orange/15 via-amber-400/10 to-yellow-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[23px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[23px]" />
                
                {/* Icon and text */}
                <div className="flex items-center gap-1 sm:gap-2 relative z-10">
                  <span className="font-khmer text-base sm:text-sm group-hover:scale-110 transition-transform duration-300">ភេសជ្ជៈ</span>
                </div>
                
                {/* Enhanced active indicator */}
                {activeTab === "drink" && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 sm:w-10 h-1 bg-white/60 rounded-full animate-pulse shadow-lg" />
                )}
                
                {/* Corner glow for active state */}
                {activeTab === "drink" && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-white/50 rounded-full animate-pulse" />
                )}
              </button>
              
              <button
                onClick={() => {
                  setActiveTab("food");
                  setVisibleItems(new Set());
                }}
                className={`flex-1 flex items-center justify-center font-poppins font-bold text-xs sm:text-sm md:text-base transition-all duration-700 rounded-[23px] relative overflow-hidden group ${
                  activeTab === "food" 
                    ? "text-white transform scale-105 shadow-lg" 
                    : "text-gray-700 hover:text-cafe-orange hover:scale-105"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cafe-orange/15 via-amber-400/10 to-yellow-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[23px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[23px]" />
                
                {/* Icon and text */}
                <div className="flex items-center gap-1 sm:gap-2 relative z-10">
                  <span className="font-khmer text-base sm:text-sm group-hover:scale-110 transition-transform duration-300">អាហារ</span>
                </div>
                
                {activeTab === "food" && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 sm:w-10 h-1 bg-white/60 rounded-full animate-pulse shadow-lg" />
                )}
                
                {activeTab === "food" && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-white/50 rounded-full animate-pulse" />
                )}
              </button>
              
              <button
                onClick={() => {
                  setActiveTab("food_set");
                  setVisibleItems(new Set());
                }}
                className={`flex-1 flex items-center justify-center font-poppins font-bold text-xs sm:text-sm md:text-base transition-all duration-700 rounded-[23px] relative overflow-hidden group ${
                  activeTab === "food_set" 
                    ? "text-white transform scale-105 shadow-lg" 
                    : "text-gray-700 hover:text-cafe-orange hover:scale-105"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cafe-orange/15 via-amber-400/10 to-yellow-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[23px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[23px]" />
                
                {/* Icon and text */}
                <div className="flex items-center gap-1 sm:gap-2 relative z-10">
                  <span className="font-khmer text-base sm:text-sm group-hover:scale-110 transition-transform duration-300">ឈុតអាហារ</span>
                </div>
                
                {activeTab === "food_set" && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 sm:w-10 h-1 bg-white/60 rounded-full animate-pulse shadow-lg" />
                )}
                
                {activeTab === "food_set" && (
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

        {/* Admin Controls
        <div className="flex justify-center gap-2 mt-4 px-4">
          <button
            onClick={() => navigate("/qr-menu-chhong_caffe/create-item")}
            className="px-3 py-2 bg-cafe-orange text-white rounded-lg hover:bg-cafe-brown transition-all duration-300 shadow-md hover:shadow-lg text-sm"
          >
            ➕ Add Item
          </button>
          <button
            onClick={() => navigate("/qr-menu-chhong_caffe/admin")}
            className="px-3 py-2 bg-cafe-brown text-white rounded-lg hover:bg-cafe-orange transition-all duration-300 shadow-md hover:shadow-lg text-sm"
          >
            ⚙️ Admin
          </button>
          <button
            onClick={refreshMenu}
            disabled={loading}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm disabled:opacity-50"
          >
            {loading ? "🔄" : "🔄"} Refresh
          </button>
        </div> */}
      </div>

      {/* Spacer */}
      <div className="h-[30px]"></div>

      {/* Menu Grid */}
      <div className="px-4 pb-8">
        <div className="max-w-sm mx-auto sm:max-w-md md:max-w-2xl lg:max-w-4xl">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cafe-orange"></div>
              <p className="mt-2 text-cafe-text-medium">
                🔄 Loading fresh menu data...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-8 bg-red-50 rounded-lg p-4 mx-4">
              <p className="text-red-600 mb-4">⚠️ {error}</p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={refreshMenu}
                  className="px-4 py-2 bg-cafe-orange text-white rounded-lg hover:bg-cafe-brown transition-colors"
                >
                  🔄 Retry
                </button>
                <button
                  onClick={() => setError(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ✖️ Dismiss
                </button>
              </div>
            </div>
          )}

          {!loading && !error && currentMenuItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-cafe-text-medium mb-4">
                📭 No {activeTab}s available
              </p>
              {/* <button
                onClick={() => navigate("/qr-menu-chhong_caffe/create-item")}
                className="px-4 py-2 bg-cafe-orange text-white rounded-lg hover:bg-cafe-brown transition-colors"
              >
                ➕ Add First {activeTab}
              </button> */}
            </div>
          )}

          {!loading && !error && currentMenuItems.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
              {currentMenuItems.map((item, index) => {
                const isVisible = visibleItems.has(item.id.toString());
                return (
                  <div key={item.id} className="w-full h-full" data-item-id={item.id}>
                    <div className="bg-white rounded-[20px] shadow-md overflow-hidden h-full flex flex-col relative">
                    
                      {/* Image Container */}
                      <div className="aspect-square overflow-hidden relative bg-gray-50">
                        <ImageWithPlaceholder
                          src={item.image}
                          alt={item.name}
                          category={item.category}
                          isVisible={isVisible}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Content Container - Fixed height for consistency */}
                      <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-b from-white to-gray-50/80 flex-1 flex flex-col justify-between min-h-[100px] sm:min-h-[120px]">
                        {/* Title with fixed height */}
                        <div className="flex-shrink-0 mb-2 sm:mb-3">
                          <h3
                            className="font-poppins font-bold text-base sm:text-base md:text-lg text-cafe-text-dark text-center leading-tight h-10 sm:h-12 flex items-center justify-center"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {item.name}
                          </h3>
                        </div>

                        {/* Details section */}
                        <div className="space-y-1.5 sm:space-y-2">
                          {/* Size and Price */}
                          <div className="bg-white/60 rounded-lg p-1.5 sm:p-2 backdrop-blur-sm">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              {(activeTab === "food" || activeTab === "food_set") && (
                                <div className="flex items-center gap-0.5 sm:gap-1">
                                  <span className="text-cafe-text-light font-medium text-xs">Size:</span>
                                  <span className="text-cafe-text-dark font-semibold bg-cafe-orange/10 px-1.5 sm:px-2 py-0.5 rounded-full text-xs">
                                    {item.size}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-0.5 sm:gap-1 ml-auto">
                                <span className="text-cafe-text-light font-medium text-xs">Price:</span>
                                <span className="text-cafe-orange font-bold text-base sm:text-lg">
                                  ${item.price}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          {item.description && (
                            <div className="bg-gray-50/80 rounded-lg p-1.5 sm:p-2">
                              <p 
                                className="font-poppins text-xs text-cafe-text-light leading-relaxed"
                                style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {item.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
