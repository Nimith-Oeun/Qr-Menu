import { MenuItem, DisplayMenuItem, ApiResponse } from "@shared/api";

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
    ? "https://api.builder.io/api/v1/image/assets/TEMP/2e811b0fa84092c929b579286fded5e620c45c19?width=347"
    : "https://api.builder.io/api/v1/image/assets/TEMP/977e1ee7cf4be018cd9e90c67e54df15c36e50b0?width=347";
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
