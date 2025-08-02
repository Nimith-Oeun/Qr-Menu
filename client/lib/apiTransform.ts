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
    category: item.category.toLowerCase() as 'drink' | 'food',
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
export function getDefaultImage(category: 'DRINK' | 'FOOD'): string {
  return category === 'DRINK'
    ? "https://api.builder.io/api/v1/image/assets/TEMP/drink-default-image.png"
    : "https://api.builder.io/api/v1/image/assets/TEMP/food-default-image.png";
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
