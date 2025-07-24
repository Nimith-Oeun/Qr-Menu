import { MenuResponse, MenuItem, MenuByCategoryResponse } from "@shared/api";

// Use relative URLs since the API is served by the same Vite dev server
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string): Promise<T> {
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
  // Test endpoint to verify API is working
  test: (): Promise<any> => fetchApi('/api/test'),
  
  // Get all menu items
  getMenu: (): Promise<MenuResponse> => fetchApi('/api/menu'),
  
  // Get menu items by category
  getMenuByCategory: (category: 'drink' | 'food'): Promise<MenuResponse> => 
    fetchApi(`/api/menu/${category}`),
  
  // Get drinks and foods separately
  getMenuSeparated: (): Promise<MenuByCategoryResponse> => fetchApi('/api/menu-separated'),
};

export { ApiError };
export type { MenuItem };
