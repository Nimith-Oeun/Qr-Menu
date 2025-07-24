import { useState, useEffect } from "react";

export default function Index() {
  const [activeTab, setActiveTab] = useState('drink');
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // scroll threshold to fix the menu
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, (entry.target as HTMLElement).dataset.itemId]));
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const items = document.querySelectorAll('[data-item-id]');
    items.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const menuItems = [...Array(13).keys()].map((i) => ({
    id: i + 1,
    name: i % 2 === 0 ? "ស៊ុបគ្រឿងសមុទ្រ" : "ស៊ាណូត្រី",
    size: i % 3 === 0 ? "L" : "M",
    price: `${4 + (i % 4)}$`,
    image: i % 2 === 0
      ? "https://api.builder.io/api/v1/image/assets/TEMP/2e811b0fa84092c929b579286fded5e620c45c19?width=347"
      : "https://api.builder.io/api/v1/image/assets/TEMP/977e1ee7cf4be018cd9e90c67e54df15c36e50b0?width=347"
  }));

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
      
      <div className={`z-50 transition-all duration-300 ${isScrolled ? 'fixed top-[-230px] left-0 right-0 bg-white/98 backdrop-blur-md shadow-lg border-b border-gray-200' : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'}`}>
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

        <h1 className={`text-center font-sriracha text-cafe-brown mb-4 transition-all duration-300 ${
          isScrolled ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-3xl sm:text-4xl md:text-5xl'
        }`}>
          Menu
        </h1>

        <div className="flex justify-center">
          <div className={`relative bg-cafe-bg-light rounded-[20px] h-[58px] w-[278px] max-w-full p-[3px] transition-all duration-300 ${
            isScrolled ? 'shadow-md ring-2 ring-cafe-orange/20' : ''
          }`}>
            <div
              className={`absolute top-[3px] w-[calc(50%-3px)] h-[53px] bg-cafe-orange rounded-[20px] transition-transform duration-300 ${
                activeTab === 'food' ? 'translate-x-full' : 'translate-x-0'
              }`}
            />
            <div className="relative flex h-full">
              <button
                onClick={() => setActiveTab('drink')}
                className={`flex-1 flex items-center justify-center font-poppins font-bold text-lg sm:text-xl transition-colors duration-300 ${
                  activeTab === 'drink' ? 'text-white' : 'text-black'
                }`}
              >
                Drink
              </button>
              <button
                onClick={() => setActiveTab('food')}
                className={`flex-1 flex items-center justify-center font-poppins font-bold text-lg sm:text-xl transition-colors duration-300 ${
                  activeTab === 'food' ? 'text-white' : 'text-black'
                }`}
              >
                Food
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed menu */}
      {/* <div className={`${isScrolled ? `h-[370px]` : `h-[150px]`}`}></div> */}
      <div className= "h-[30px]"></div>

      {/* Logo */}
      {/* <div className="flex justify-center px-4 mb-6">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/f2aaa14515154ad18f8cfe5439814ab435d6222d?width=793"
          alt="Chhong Cafe & BBQ Logo"
          className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto rounded-[23px] shadow-lg"
        />
      </div> */}

      {/* Menu Grid */}
      <div className="px-4 pb-8">
        <div className="max-w-sm mx-auto sm:max-w-md md:max-w-2xl lg:max-w-4xl">
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
            {menuItems.map((item, index) => {
              const isVisible = visibleItems.has(item.id.toString());
              return (
                <div
                  key={item.id}
                  className="w-full"
                  data-item-id={item.id}
                >
                  <div
                    className={`bg-white rounded-[15px] shadow-lg overflow-hidden transition-all duration-500 ${
                      isVisible
                        ? 'opacity-100 transform translate-y-0 scale-100 hover:shadow-xl hover:scale-105'
                        : 'opacity-0 transform translate-y-8 scale-95'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {isVisible && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cafe-orange to-cafe-brown animate-pulse" />
                    )}
                    <div className="aspect-[174/119] overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isVisible ? 'scale-100 hover:scale-110' : 'scale-110'
                        }`}
                      />
                      {isVisible && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </div>
                    <div className={`p-3 sm:p-4 bg-white/50 transition-all duration-500 ${
                      isVisible ? 'translate-y-0' : 'translate-y-4'
                    }`}>
                      <h3 className={`font-poppins font-bold text-lg sm:text-xl text-cafe-text-dark mb-2 text-center ${
                        isVisible ? 'opacity-100' : 'opacity-0'
                      }`}>
                        {item.name}
                      </h3>
                      <div className={`space-y-1 ${
                        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                      }`}>
                        <p className="font-poppins font-bold text-sm sm:text-base text-cafe-text-light">
                          size : {item.size}
                        </p>
                        <p className="font-poppins font-bold text-sm sm:text-base text-cafe-text-medium">
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
        </div>
      </div>
    </div>
  );
}
