/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Spring Boot API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

/**
 * Menu item interface (matching Spring Boot MenuItem entity)
 */
export interface MenuItem {
  id: number;
  name: string;
  size: string;
  price: string;
  image?: string;
  category: 'DRINK' | 'FOOD' | 'FOOD_SET';
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Frontend display item (converted from Spring Boot format)
 */
export interface DisplayMenuItem {
  id: number;
  name: string;
  size: string;
  price: string;
  image: string;
  category: 'drink' | 'food' | 'food_set';
  description?: string;
}

/**
 * API response for menu items
 */
export interface MenuResponse {
  items: MenuItem[];
}

/**
 * API response for menu items by category (Spring Boot format)
 */
export interface MenuByCategoryResponse {
  drinks: MenuItem[];
  foods: MenuItem[];
  foodSets: MenuItem[];
}

/**
 * Create item request
 */
export interface CreateItemRequest {
  name: string;
  size: string;
  price: string;
  image?: string;
  category: 'DRINK' | 'FOOD' | 'FOOD_SET';
  description?: string;
}

/**
 * Update item request
 */
export interface UpdateItemRequest {
  name?: string;
  size?: string;
  price?: string;
  image?: string;
  category?: 'DRINK' | 'FOOD' | 'FOOD_SET';
  description?: string;
}
