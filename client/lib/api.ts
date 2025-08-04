import { MenuResponse, MenuItem, MenuByCategoryResponse, ApiResponse, CreateItemRequest, UpdateItemRequest } from "@shared/api";
import { extractApiData, transformMenuItems, transformMenuItem } from "./apiTransform";

// Spring Boot backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Fetching from:', url); // Debug log
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error('API Response not OK:', response.status, response.statusText); // Debug log
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data); // Debug log
    return data;
  } catch (error) {
    console.error('API Error:', error); // Debug log
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout');
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const menuApi = {
  // Test endpoint to verify Spring Boot API is working
  test: async () => {
    const response = await fetchApi<ApiResponse<MenuItem[]>>('/api/menu');
    return extractApiData(response);
  },
  
  // Get all menu items
  getMenu: async () => {
    const response = await fetchApi<ApiResponse<MenuItem[]>>('/api/menu');
    const items = extractApiData(response);
    return transformMenuItems(items);
  },
  
  // Get menu items by category (Spring Boot expects UPPERCASE)
  getMenuByCategory: async (category: 'drink' | 'food' | 'food_set') => {
    const categoryMap = {
      'drink': 'DRINK',
      'food': 'FOOD',
      'food_set': 'FOOD_SET'
    };
    const response = await fetchApi<ApiResponse<MenuItem[]>>(`/api/menu/${categoryMap[category]}`);
    const items = extractApiData(response);
    return transformMenuItems(items);
  },
  
  // Get drinks and foods separately
  getMenuSeparated: async () => {
    const response = await fetchApi<ApiResponse<MenuByCategoryResponse>>('/api/menu-separated');
    const data = extractApiData(response);
    return {
      drinks: transformMenuItems(data.drinks || []),
      foods: transformMenuItems(data.foods || []),
      foodSets: transformMenuItems(data.foodSets || []),
    };
  },
  
  // Add a new menu item
  addMenuItem: async (item: CreateItemRequest) => {
    const response = await fetchApi<ApiResponse<MenuItem>>('/api/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return extractApiData(response);
  },
  
  // Update a menu item
  updateMenuItem: async (id: number, item: UpdateItemRequest) => {
    const response = await fetchApi<ApiResponse<MenuItem>>(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
    const menuItem = extractApiData(response);
    return transformMenuItem(menuItem);
  },
  
  // Delete a menu item
  deleteMenuItem: async (id: number) => {
    const response = await fetchApi<ApiResponse<void>>(`/api/items/${id}`, {
      method: 'DELETE',
    });
    return extractApiData(response);
  },
};

export { ApiError };
export type { MenuItem, DisplayMenuItem, CreateItemRequest, UpdateItemRequest } from "@shared/api";
