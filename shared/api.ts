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
 * Menu item interface
 */
export interface MenuItem {
  id: string;
  name: string;
  size: string;
  price: string;
  image: string;
  category: 'drink' | 'food';
  description?: string;
}

/**
 * API response for menu items
 */
export interface MenuResponse {
  items: MenuItem[];
}

/**
 * API response for menu items by category
 */
export interface MenuByCategoryResponse {
  drinks: MenuItem[];
  foods: MenuItem[];
}
