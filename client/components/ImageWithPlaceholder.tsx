import { useState } from "react";
import { ImageOff, Coffee, UtensilsCrossed } from "lucide-react";

interface ImageWithPlaceholderProps {
  src?: string;
  alt: string;
  className?: string;
  category: 'drink' | 'food';
  isVisible?: boolean;
}

export default function ImageWithPlaceholder({ 
  src, 
  alt, 
  className = "", 
  category,
  isVisible = true 
}: ImageWithPlaceholderProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  // Show placeholder if no src provided or if image failed to load
  const showPlaceholder = !src || imageError;

  const PlaceholderContent = () => (
    <div className="w-full h-full bg-gradient-to-br from-cafe-bg-light to-gray-200 flex flex-col items-center justify-center">
      <div className="text-cafe-text-light mb-2">
        {category === 'drink' ? (
          <Coffee className="h-8 w-8 sm:h-10 sm:w-10" />
        ) : (
          <UtensilsCrossed className="h-8 w-8 sm:h-10 sm:w-10" />
        )}
      </div>
      <div className="text-center px-2">
        <p className="text-cafe-text-medium text-xs sm:text-sm font-medium mb-1">
          {category === 'drink' ? 'Drink' : 'Food'}
        </p>
        <p className="text-cafe-text-light text-xs flex items-center justify-center gap-1">
          <ImageOff className="h-3 w-3" />
          No Image
        </p>
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Loading skeleton */}
      {!imageLoaded && !showPlaceholder && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      {/* Image */}
      {src && !imageError && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isVisible ? "scale-100 hover:scale-110" : "scale-110"
          } ${!imageLoaded ? "opacity-0" : "opacity-100"}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
      
      {/* Placeholder */}
      {showPlaceholder && <PlaceholderContent />}
      
      {/* Hover overlay */}
      {isVisible && !showPlaceholder && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
    </div>
  );
}
