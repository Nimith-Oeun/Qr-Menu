import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { menuApi, MenuItem, ApiError } from "../lib/api";
import ImageWithPlaceholder from "../components/ImageWithPlaceholder";

export default function Index() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("drink");
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First test API connectivity
        console.log('Testing API connectivity...');
        await menuApi.test();
        console.log('API test successful, fetching menu...');
        
        const response = await menuApi.getMenuSeparated();
        
        // Combine drinks and foods with proper typing
        const allItems: MenuItem[] = [...response.drinks, ...response.foods];
        setMenuItems(allItems);
        console.log('Menu data loaded successfully:', allItems.length, 'items');
      } catch (err) {
        console.error('Failed to fetch menu:', err);
        if (err instanceof ApiError) {
          setError(`Failed to load menu: ${err.message} (Status: ${err.status})`);
        } else {
          setError('Failed to load menu. Please try again later.');
        }
        
        // Fallback to mock data if API fails
        console.log('Using fallback mock data...');
        const mockItems: MenuItem[] = [
          // Drinks
          ...Array.from({ length: 7 }, (_, i) => ({
            id: `drink-${i + 1}`,
            name: `Drink ${i + 1}`,
            size: i % 2 === 0 ? "M" : "L",
            price: `${2 + (i % 3)}$`,
            image: "https://api.builder.io/api/v1/image/assets/TEMP/2e811b0fa84092c929b579286fded5e620c45c19?width=347",
            category: 'drink' as const,
          })),
          // Foods
          ...Array.from({ length: 8 }, (_, i) => ({
            id: `food-${i + 1}`,
            name: `Food ${i + 1}`,
            size: i % 2 === 0 ? "M" : "L",
            price: `${4 + (i % 4)}$`,
            image: "https://api.builder.io/api/v1/image/assets/TEMP/977e1ee7cf4be018cd9e90c67e54df15c36e50b0?width=347",
            category: 'food' as const,
          })),
        ];
        setMenuItems(mockItems);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll("[data-item-id]");
  
    // If not scrollable, show all items immediately
    const pageNotScrollable = document.body.scrollHeight <= window.innerHeight;
  
    if (pageNotScrollable) {
      const allVisible = new Set(Array.from(items).map((item) => item.getAttribute("data-item-id")));
      setVisibleItems(allVisible);
      return;
    }
  
    // Otherwise, use observer as usual
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.getAttribute("data-item-id")!]));
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -50px 0px",
      }
    );
  
    items.forEach((item) => observer.observe(item));
  
    return () => observer.disconnect();
  }, [activeTab]);
    // Filter items based on active tab
  const currentMenuItems = menuItems.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/d4d912cb4847166258ac81f8b4ca3abecc963aab?width=2560"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Fixed Menu Header */}
      <div
        className={`z-50 transition-all duration-300 ${
          isScrolled
            ? "fixed top-[-230px] left-0 right-0 bg-white/98 backdrop-blur-md shadow-lg border-b border-gray-200"
            : "bg-white/95 backdrop-blur-sm border-b border-gray-100"
        }`}
      >
        {/* Logo */}
        <div className="flex justify-center px-4 mb-6">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/f2aaa14515154ad18f8cfe5439814ab435d6222d?width=793"
            alt="Chhong Cafe & BBQ Logo"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto rounded-[23px] shadow-lg"
          />
        </div>

        {isScrolled && (
          <div className="h-1 bg-gradient-to-r from-cafe-orange via-cafe-brown to-cafe-orange animate-pulse h-100px"></div>
        )}

        <h1
          className={`text-center font-sriracha text-cafe-brown mb-4 transition-all duration-300 ${
            isScrolled
              ? "text-2xl sm:text-3xl md:text-4xl"
              : "text-3xl sm:text-4xl md:text-5xl"
          }`}
        >
          Menu
        </h1>

        <div className="flex justify-center">
          <div
            className={`relative bg-cafe-bg-light rounded-[20px] h-[58px] w-[278px] max-w-full p-[3px] transition-all duration-300 ${
              isScrolled ? "shadow-md ring-2 ring-cafe-orange/20" : ""
            }`}
          >
            <div
              className={`absolute top-[3px] w-[calc(50%-3px)] h-[53px] bg-cafe-orange rounded-[20px] transition-transform duration-300 ${
                activeTab === "food" ? "translate-x-full" : "translate-x-0"
              }`}
            />
            <div className="relative flex h-full">
              <button
                onClick={() => {
                  setActiveTab("drink");
                  setVisibleItems(new Set());
                }}
                className={`flex-1 flex items-center justify-center font-poppins font-bold text-lg sm:text-xl transition-colors duration-300 ${
                  activeTab === "drink" ? "text-white" : "text-black"
                }`}
              >
                Drink
              </button>
              <button
                onClick={() => {
                  setActiveTab("food");
                  setVisibleItems(new Set());
                }}
                className={`flex-1 flex items-center justify-center font-poppins font-bold text-lg sm:text-xl transition-colors duration-300 ${
                  activeTab === "food" ? "text-white" : "text-black"
                }`}
              >
                Food
              </button>
            </div>
          </div>
        </div>

        {/* Add Item Button */}
        {/* <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate("/qr-menu-chhong_caffe/create-item")}
            className="flex items-center gap-2 px-4 py-2 bg-cafe-orange text-white rounded-lg hover:bg-cafe-brown transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-4 w-4" />
            Add New Item
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
              <p className="mt-2 text-cafe-text-medium">Loading menu...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-cafe-orange text-white rounded-lg hover:bg-cafe-brown transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
              {currentMenuItems.map((item, index) => {
              const isVisible = visibleItems.has(item.id.toString());
              return (
                <div key={item.id} className="w-full" data-item-id={item.id}>
                  <div
                    className={`bg-white rounded-[15px] shadow-lg overflow-hidden transition-all duration-500 ${
                      isVisible
                        ? "opacity-100 transform translate-y-0 scale-100 hover:shadow-xl hover:scale-105"
                        : "opacity-0 transform translate-y-8 scale-95"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {isVisible && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cafe-orange to-cafe-brown animate-pulse" />
                    )}
                    <div className="aspect-[174/119] overflow-hidden relative">
                      <ImageWithPlaceholder
                        src={item.image}
                        alt={item.name}
                        category={item.category}
                        isVisible={isVisible}
                        className="w-full h-full"
                      />
                    </div>
                    <div
                      className={`p-3 sm:p-4 bg-white/50 transition-all duration-500 ${
                        isVisible ? "translate-y-0" : "translate-y-4"
                      }`}
                    >
                      <h3
                        className={`font-poppins font-bold text-lg sm:text-xl text-cafe-text-dark mb-2 text-left ${
                          isVisible ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {item.name}
                      </h3>
                      <div
                        className={`space-y-1 ${
                          isVisible
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-4"
                        }`}
                      >
                        <p className="font-poppins text-sm sm:text-base text-cafe-text-light">
                          size : {item.size}
                        </p>
                        <p className="font-poppins text-sm sm:text-base text-cafe-text-medium">
                          price : {item.price}
                        </p>
                      </div>
                    </div>
                    {isVisible && (
                      <div className="absolute inset-0 rounded-[15px] ring-2 ring-cafe-orange/20 pointer-events-none animate-pulse"></div>
                    )}
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
