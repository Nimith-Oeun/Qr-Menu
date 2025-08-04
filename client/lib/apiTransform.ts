import { MenuItem, DisplayMenuItem, ApiResponse } from "@shared/api";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";

/**
 * Transform Spring Boot MenuItem to frontend DisplayMenuItem
 */
export function transformMenuItem(item: MenuItem): DisplayMenuItem {
  return {
    id: item.id,
    name: item.name,
    size: item.size,
    price: item.price,
    image: item.image || getDefaultImage(item.category),
    category: item.category.toLowerCase().replace('_', '_') as 'drink' | 'food' | 'food_set',
    description: item.description,
  };
}

/**
 * Transform array of Spring Boot MenuItems to DisplayMenuItems
 */
export function transformMenuItems(items: MenuItem[]): DisplayMenuItem[] {
  return items.filter(item => item.isActive).map(transformMenuItem);
}

/**
 * Get default image based on category
 */
export function getDefaultImage(category: 'DRINK' | 'FOOD' | 'FOOD_SET'): string {
  switch (category) {
    case 'DRINK':
      return "https://api.builder.io/api/v1/image/assets/TEMP/drink-default-image.png";
    case 'FOOD':
      return "https://api.builder.io/api/v1/image/assets/TEMP/food-default-image.png";
    case 'FOOD_SET':
      return "https://api.builder.io/api/v1/image/assets/TEMP/c4f8c9b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8?width=347"; // New default image for food sets
    default:
      return "https://api.builder.io/api/v1/image/assets/TEMP/placeholder.png";
  }
}

/**
 * Extract data from Spring Boot API response
 */
export function extractApiData<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(response.message || 'API request failed');
  }
  return response.data;
}
