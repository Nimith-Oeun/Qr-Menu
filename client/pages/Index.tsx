import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { menuApi, DisplayMenuItem, ApiError } from "../lib/api";
import ImageWithPlaceholder from "../components/ImageWithPlaceholder";
import { Coffee, UtensilsCrossed, Sparkles, Star, Heart, Crown } from "lucide-react";

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
        
        console.log('🔄 Auto-fetching menu data...');
        
        // Test API connectivity first
        await menuApi.test();
        console.log('✅ API connectivity test successful');
        
        // Fetch menu data
        const response = await menuApi.getMenuSeparated();
        console.log('📋 Menu data fetched:', { 
          drinks: response.drinks.length, 
          foods: response.foods.length 
        });
        
        // Combine drinks and foods
        const allItems: DisplayMenuItem[] = [...response.drinks, ...response.foods];
        setMenuItems(allItems);
        
        console.log('✅ Menu loaded successfully:', allItems.length, 'total items');
        
      } catch (err) {
        console.error('❌ Failed to fetch menu:', err);
        
        if (err instanceof ApiError) {
          setError(`Failed to load menu: ${err.message} (Status: ${err.status})`);
        } else {
          setError('Failed to load menu. Please check your connection.');
        }
        
        // Fallback to realistic mock data
        console.log('🔄 Loading realistic menu mock data...');
        // const mockItems: DisplayMenuItem[] = [
        //   // 🥤 Drinks - Coffee & Beverages
        //   {
        //     id: 1,
        //     name: "Espresso",
        //     size: "S",
        //     price: "2.5",
        //     image: "https://api.builder.io/api/v1/image/assets/TEMP/2e811b0fa84092c929b579286fded5e620c45c19?width=347",
        //     category: 'drink' as const,
        //     description: "Rich, bold espresso shot - the perfect caffeine kick"
        //   },
        //   {
        //     id: 2,
        //     name: "Cappuccino",
        //     size: "M",
        //     price: "4.0",
        //     image: "https://api.builder.io/api/v1/image/assets/TEMP/2e811b0fa84092c929b579286fded5e620c45c19?width=347",
        //     category: 'drink' as const,
        //     description: "Classic Italian coffee with steamed milk and foam"
        //   },
        //   {
        //     id: 3,
        //     name: "Latte",
        //     size: "L",
        //     price: "4.5",
        //     image: "https://api.builder.io/api/v1/image/assets/TEMP/2e811b0fa84092c929b579286fded5e620c45c19?width=347",
        //     category: 'drink' as const,
        //     description: "Smooth espresso with steamed milk and light foam"
        //   },
        //   {
        //     id: 4,
        //     name: "Americano",
        //     size: "M",
        //     price: "3.0",
        //     image: "https://api.builder.io/api/v1/image/assets/TEMP/2e811b0fa84092c929b579286fded5e620c45c19?width=347",
        //     category: 'drink' as const,
        //     description: "Espresso diluted with hot water - clean and strong"
        //   },
        //   {
        //     id: 5,
        //     name: "Iced Coffee",
        //     size: "L",
        //     price: "3.5",
        //     image: "https://api.builder.io/api/v1/image/assets/TEMP/2e811b0fa84092c929b579286fded5e620c45c19?width=347",
        //     category: 'drink' as const,
        //     description: "Cold brew coffee served over ice - refreshing"
        //   },
        //   {
        //     id: 6,
        //     name: "Mocha",
        //     size: "M",
        //     price: "5.0",
        //     image: "https://api.builder.io/api/v1/image/assets/TEMP/2e811b0fa84092c929b579286fded5e620c45c19?width=347",
        //     category: 'drink' as const,
        //     description: "Espresso with chocolate syrup and steamed milk"
        //   },
        //   {
        //     id: 7,
        //     name: "Green Tea Latte",
        //     size: "M",
        //     price: "4.2",
        //     image: "https://api.builder.io/api/v1/image/assets/TEMP/2e811b0fa84092c929b579286fded5e620c45c19?width=347",
        //     category: 'drink' as const,
        //     description: "Matcha green tea with steamed milk - healthy choice"
        //   },
          
        //   // 🍽️ Foods - Meals & Snacks
        //   {
        //     id: 8,
        //     name: "Grilled Chicken Sandwich",
        //     size: "Regular",
        //     price: "8.5",
        //     image: "https://api.builder.io/api/v1/image/assets/TEMP/977e1ee7cf4be018cd9e90c67e54df15c36e50b0?width=347",
        //     category: 'food' as const,
        //     description: "Juicy grilled chicken breast with fresh vegetables"
        //   },
        //   {
        //     id: 9,
        //     name: "BBQ Pork Ribs",
        //     size: "Half Rack",
        //     price: "12.0",
        //     image: "https://api.builder.io/api/v1/image/assets/TEMP/977e1ee7cf4be018cd9e90c67e54df15c36e50b0?width=347",
        //     category: 'food' as const,
        //     description: "Tender pork ribs with Chhong's special BBQ sauce"
        //   },
        //   {
        //     id: 10,
        //     name: "Caesar Salad",
        //     size: "Large",
        //     price: "7.0",
        //     image: "https://api.builder.io/api/v1/image/assets/TEMP/977e1ee7cf4be018cd9e90c67e54df15c36e50b0?width=347",
        //     category: 'food' as const,
        //     description: "Fresh romaine lettuce with caesar dressing and croutons"
        //   },
        //   {
        //     id: 11,
        //     name: "Beef Burger",
        //     size: "Regular",
        //     price: "9.0",
        //     image: "https://api.builder.io/api/v1/image/assets/TEMP/977e1ee7cf4be018cd9e90c67e54df15c36e50b0?width=347",
        //     category: 'food' as const,
        //     description: "Premium beef patty with cheese, lettuce, and tomato"
        //   },
        //   {
        //     id: 12,
        //     name: "Fish & Chips",
        //     size: "Regular",
        //     price: "10.5",
        //     image: "https://api.builder.io/api/v1/image/assets/TEMP/977e1ee7cf4be018cd9e90c67e54df15c36e50b0?width=347",
        //     category: 'food' as const,
        //     description: "Crispy battered fish with golden french fries"
        //   },
        //   {
        //     id: 13,
        //     name: "Pasta Carbonara",
        //     size: "Regular",
        //     price: "11.0",
        //     image: "https://api.builder.io/api/v1/image/assets/TEMP/977e1ee7cf4be018cd9e90c67e54df15c36e50b0?width=347",
        //     category: 'food' as const,
        //     description: "Creamy pasta with bacon, eggs, and parmesan cheese"
        //   },
        //   {
        //     id: 14,
        //     name: "Vegetarian Pizza",
        //     size: "Medium",
        //     price: "13.5",
        //     image: "https://api.builder.io/api/v1/image/assets/TEMP/977e1ee7cf4be018cd9e90c67e54df15c36e50b0?width=347",
        //     category: 'food' as const,
        //     description: "Fresh vegetables on crispy thin crust with mozzarella"
        //   },
        //   {
        //     id: 15,
        //     name: "Chocolate Cake",
        //     size: "Slice",
        //     price: "5.5",
        //     image: "https://api.builder.io/api/v1/image/assets/TEMP/977e1ee7cf4be018cd9e90c67e54df15c36e50b0?width=347",
        //     category: 'food' as const,
        //     description: "Rich chocolate cake with creamy chocolate frosting"
        //   }
        // ];
        // setMenuItems(mockItems);
        // console.log('📋 Realistic mock data loaded:', mockItems.length, 'items');
        
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
      console.log('🔄 Manual refresh triggered...');
      const response = await menuApi.getMenuSeparated();
      const allItems: DisplayMenuItem[] = [...response.drinks, ...response.foods];
      setMenuItems(allItems);
      console.log('✅ Menu refreshed successfully');
    } catch (err) {
      console.error('❌ Manual refresh failed:', err);
      setError('Failed to refresh menu');
    } finally {
      setLoading(false);
    }
  };

  // Scroll handler with improved performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Improved intersection observer for animations
  useEffect(() => {
    const items = document.querySelectorAll("[data-item-id]");
  
    // If not scrollable, show all items immediately
    const pageNotScrollable = document.body.scrollHeight <= window.innerHeight;
  
    if (pageNotScrollable) {
      const allVisible = new Set(Array.from(items).map((item) => item.getAttribute("data-item-id")));
      setVisibleItems(allVisible);
      return;
    }
  
    // Enhanced observer with better performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.getAttribute("data-item-id")!]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );
  
    items.forEach((item) => observer.observe(item));
  
    return () => observer.disconnect();
  }, [activeTab, menuItems]);

  // Filter items based on active tab
  const currentMenuItems = menuItems.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 relative overflow-hidden">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(99,102,241,0.1)_1px,_transparent_0)] bg-[size:30px_30px] opacity-40"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 blur-xl animate-pulse delay-2000"></div>

      {/* Fixed Menu Header with Improved Scroll Behavior */}
      <div
        className={`z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? "fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-b border-purple-200/50"
            : "relative bg-white/80 backdrop-blur-sm"
        }`}
      >
        {/* Logo Section */}
        <div className={`flex justify-center px-4 transition-all duration-500 ${isScrolled ? "py-3" : "py-6"}`}>
          <div className="relative group flex flex-col items-center">
            {/* Modern Logo Container with Glassmorphism */}
            <div className={`relative rounded-3xl shadow-2xl overflow-hidden border border-purple-200/40 bg-white/60 backdrop-blur-xl transition-all duration-500 ${isScrolled ? "w-32 h-32 sm:w-40 sm:h-40" : "w-40 h-40 sm:w-56 sm:h-56"}`}>
              <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/f2aaa14515154ad18f8cfe5439814ab435d6222d?width=793"
          alt="Chhong Cafe & BBQ Logo"
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              {/* Animated Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {/* Floating Sparkle Badge */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <Sparkles className="h-4 w-4 text-white" />
              </div>
              {/* Subtle Glow Ring */}
              <div className="absolute inset-0 rounded-3xl ring-2 ring-purple-400/10 group-hover:ring-purple-400/30 pointer-events-none transition-all duration-300"></div>
            </div>
            {/* Cafe Name with Gradient Text */}
            {/* <span className={`mt-3 font-bold text-lg sm:text-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg transition-all duration-500 ${isScrolled ? "opacity-80" : "opacity-100"}`}>
              Chhong Cafe & BBQ
            </span> */}
          </div>
        </div>

        {/* Animated Progress Bar when Scrolled */}
        {isScrolled && (
          <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-pulse"></div>
        )}

        {/* Modern Title */}
        <div className={`text-center transition-all duration-500 ${isScrolled ? "mb-3" : "mb-6"}`}>
          <h1
            className={`font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-500 ${
              isScrolled
                ? "text-2xl sm:text-3xl"
                : "text-4xl sm:text-5xl md:text-6xl"
            }`}
          >
            Our Menu
          </h1>
          {!isScrolled && (
            <p className="text-lg text-gray-600 font-medium mt-2">Discover our delicious offerings</p>
          )}
          <div className={`bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full transition-all duration-500 ${
            isScrolled ? "w-16 h-0.5 mt-2" : "w-24 h-1 mt-4"
          }`}></div>
        </div>

        {/* Enhanced Tab Selector */}
        <div className={`flex justify-center px-4 transition-all duration-500 ${isScrolled ? "pb-3" : "pb-6"}`}>
          <div
            className={`relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200/50 p-1 transition-all duration-500 ${
              isScrolled ? "h-12 w-56" : "h-14 w-72"
            }`}
          >
            {/* Animated Background Slider */}
            <div
              className={`absolute top-1 w-[calc(50%-4px)] bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg transition-all duration-300 ${
                activeTab === "food" ? "translate-x-full" : "translate-x-0"
              } ${isScrolled ? "h-10 mx-1" : "h-12 mx-1"}`}
            />
            
            <div className="relative flex h-full">
              <button
                onClick={() => {
                  setActiveTab("drink");
                  setVisibleItems(new Set());
                }}
                className={`flex-1 flex items-center justify-center font-bold transition-all duration-300 ${
                  activeTab === "drink" ? "text-white" : "text-gray-700 hover:text-purple-600"
                } ${isScrolled ? "text-sm gap-1" : "text-lg gap-2"}`}
              >
                <Coffee className={`${isScrolled ? "h-4 w-4" : "h-5 w-5"}`} />
                <span>Drinks</span>
                {activeTab === "drink" && (
                  <div className="ml-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab("food");
                  setVisibleItems(new Set());
                }}
                className={`flex-1 flex items-center justify-center font-bold transition-all duration-300 ${
                  activeTab === "food" ? "text-white" : "text-gray-700 hover:text-purple-600"
                } ${isScrolled ? "text-sm gap-1" : "text-lg gap-2"}`}
              >
                <UtensilsCrossed className={`${isScrolled ? "h-4 w-4" : "h-5 w-5"}`} />
                <span>Foods</span>
                {activeTab === "food" && (
                  <div className="ml-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Spacer for Fixed Header */}
      {isScrolled && <div className="h-32"></div>}

      {/* Main Content */}
      <div className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Sparkles className="h-6 w-6 text-purple-600 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Menu</h3>
              <p className="text-gray-600">Preparing something delicious for you...</p>
            </div>
          )}

          {/* Enhanced Error State */}
          {error && (
            <div className="max-w-md mx-auto mt-8">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-2xl p-6 text-center backdrop-blur-sm">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-600 mb-6 text-sm">{error}</p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={refreshMenu} 
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => setError(null)} 
                    className="px-6 py-3 bg-white text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Empty State */}
          {!loading && !error && currentMenuItems.length === 0 && (
            <div className="max-w-md mx-auto mt-8">
              <div className="bg-white/60 backdrop-blur-xl border border-purple-200/50 rounded-2xl p-8 text-center shadow-xl">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {activeTab === "drink" ? (
                    <Coffee className="h-10 w-10 text-purple-600" />
                  ) : (
                    <UtensilsCrossed className="h-10 w-10 text-green-600" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No {activeTab}s available
                </h3>
                <p className="text-gray-600 mb-6">
                  We're working on adding delicious {activeTab}s to our menu. Check back soon!
                </p>
                <button
                  onClick={() => navigate("/qr-menu-chhong_caffe/create-item")}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Add First {activeTab}
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Menu Grid */}
          {!loading && !error && currentMenuItems.length > 0 && (
            <>
              {/* Category Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  {activeTab === "drink" ? (
                    <Coffee className="h-8 w-8 text-blue-500" />
                  ) : (
                    <UtensilsCrossed className="h-8 w-8 text-green-500" />
                  )}
                  <h2 className="text-2xl font-bold text-gray-800 capitalize">
                    Our {activeTab}s
                  </h2>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{currentMenuItems.length}</span>
                  </div>
                </div>
                {/* <p className="text-gray-600">
                  {activeTab === "drink" 
                    ? "Refresh yourself with our carefully crafted beverages" 
                    : "Satisfy your hunger with our delicious food options"
                  }
                </p> */}
              </div>

              {/* Improved Responsive Grid */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
                {currentMenuItems.map((item, index) => {
                const isVisible = visibleItems.has(item.id.toString());
                const isPopular = index < 3; // Mark first 3 items as popular
                
                return (
                  <div key={item.id} className="w-full" data-item-id={item.id}>
                    <div
                      className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all duration-700 ${
                        isVisible
                          ? "opacity-100 transform translate-y-0 scale-100 hover:shadow-2xl hover:scale-105"
                          : "opacity-0 transform translate-y-12 scale-95"
                      }`}
                      style={{ 
                        transitionDelay: `${index * 100}ms`,
                        animation: isVisible ? 'slideInUp 0.7s ease-out forwards' : 'none'
                      }}
                    >
                      {/* Popular Badge */}
                      {isPopular && isVisible && (
                        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <Crown className="h-3 w-3" />
                          Popular
                        </div>
                      )}

                      {/* Gradient Top Border */}
                      {isVisible && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-pulse" />
                      )}
                      
                      {/* Image Container with Improved Aspect Ratio */}
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <ImageWithPlaceholder
                          src={item.image}
                          alt={item.name}
                          category={item.category}
                          isVisible={isVisible}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Gradient Overlay on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Category Badge */}
                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                          item.category === 'drink' 
                            ? 'bg-blue-500/20 text-blue-700 border border-blue-300/50' 
                            : 'bg-green-500/20 text-green-700 border border-green-300/50'
                        }`}>
                          {item.category === 'drink' ? '🥤' : '🍽️'}
                        </div>
                      </div>
                      
                      {/* Enhanced Content Section */}
                      <div
                        className={`p-4 transition-all duration-700 ${
                          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        }`}
                      >
                        {/* Item Name with Better Typography */}
                        <h3
                          className={`font-bold text-gray-800 mb-3 text-center line-clamp-2 transition-all duration-500 group-hover:text-purple-600 ${
                            isVisible ? "opacity-100" : "opacity-0"
                          }`}
                          style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                        >
                          {item.name}
                        </h3>
                        
                        {/* Enhanced Info Section */}
                        <div
                          className={`space-y-2 transition-all duration-700 delay-100 ${
                            isVisible
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 translate-x-4"
                          }`}
                        >
                          {/* Size and Price in Modern Layout */}
                          <div className="flex items-center justify-between bg-gray-50/80 rounded-xl p-3 backdrop-blur-sm">
                            <div className="text-center flex-1">
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Size</p>
                              <p className="font-semibold text-gray-800">{item.size}</p>
                            </div>
                            <div className="w-px h-8 bg-gray-300"></div>
                            <div className="text-center flex-1">
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Price</p>
                              <p className="font-bold text-purple-600 text-lg">${item.price}</p>
                            </div>
                          </div>
                          
                          {/* Description with Better Typography */}
                          {item.description && (
                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 px-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Enhanced Hover Ring Effect */}
                      {isVisible && (
                        <div className="absolute inset-0 rounded-2xl ring-2 ring-purple-500/0 group-hover:ring-purple-500/30 transition-all duration-300 pointer-events-none"></div>
                      )}
                      
                      {/* Floating Action Hint */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                          <Star className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </>
          )}
        </div>
      </div>

      {/* Floating Back to Top Button */}
      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-xl flex items-center justify-center text-white hover:shadow-2xl transition-all duration-300 hover:scale-110 z-40"
        >
          <Sparkles className="h-5 w-5" />
        </button>
      )}

      {/* Enhanced CSS Animations */}
      <style>
        {`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (max-width: 475px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        `}
      </style>
    </div>
  );
}