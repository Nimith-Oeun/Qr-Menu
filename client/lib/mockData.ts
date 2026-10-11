import type { DisplayMenuItem } from "@shared/api";

const drinkImages = [
  "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=900&q=85",
];

const foodImages = [
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=85",
];

export const mockMenuItems: DisplayMenuItem[] = [
  { id: 1, name: "Iced Americano", size: "M", price: "3.50", image: drinkImages[0], category: "drink", description: "Bold espresso, chilled and bright." },
  { id: 2, name: "Honey Latte", size: "L", price: "4.25", image: drinkImages[1], category: "drink", description: "Silky milk with a touch of local honey." },
  { id: 3, name: "Coconut Cold Brew", size: "M", price: "4.75", image: drinkImages[2], category: "drink", description: "Slow-steeped coffee with coconut cream." },
  { id: 4, name: "Matcha Cloud", size: "L", price: "4.50", image: drinkImages[3], category: "drink", description: "Ceremonial matcha topped with soft foam." },
  { id: 5, name: "BBQ Chicken Bowl", size: "Regular", price: "8.50", image: foodImages[0], category: "food", description: "Charred chicken, herbs, rice and house sauce." },
  { id: 6, name: "Chhong Fried Rice", size: "Regular", price: "7.50", image: foodImages[1], category: "food", description: "Wok-tossed rice with seasonal vegetables." },
  { id: 7, name: "Garden Avocado Salad", size: "Regular", price: "6.75", image: foodImages[2], category: "food", description: "Fresh greens, avocado and sesame dressing." },
  { id: 8, name: "Mango Sticky Rice", size: "Regular", price: "5.25", image: foodImages[3], category: "food", description: "Sweet mango, coconut cream and warm rice." },
  { id: 9, name: "Cafe Taster", size: "Set", price: "12.00", image: foodImages[0], category: "food_set", description: "A little of our BBQ bowl, salad and a drink." },
  { id: 10, name: "BBQ Sharing Set", size: "Set", price: "18.00", image: foodImages[1], category: "food_set", description: "Perfect for two, served with rice and sides." },
  { id: 11, name: "Sweet Afternoon Set", size: "Set", price: "10.50", image: foodImages[3], category: "food_set", description: "Dessert, coffee and a slow afternoon." },
];

export function getMockMenuSeparated() {
  return {
    drinks: mockMenuItems.filter((item) => item.category === "drink"),
    foods: mockMenuItems.filter((item) => item.category === "food"),
    foodSets: mockMenuItems.filter((item) => item.category === "food_set"),
  };
}

export function isDemoMode() {
  return import.meta.env.VITE_USE_MOCK_DATA === "true";
}

export function getMockItem(id: number) {
  return mockMenuItems.find((item) => item.id === id);
}

export function getMockItems() {
  return mockMenuItems.map((item) => ({ ...item }));
}

export function getMockDataNotice() {
  return "Demo menu data · Connect the API to show live items";
}

export function createMockId() {
  return Math.max(...mockMenuItems.map((item) => item.id), 0) + 1;
}

export function isMockImage(image?: string) {
  return Boolean(image?.includes("images.unsplash.com"));
}

export function normalizeMockPrice(price: string) {
  return price.replace(/[^0-9.]/g, "");
}

export function mockCategoryLabel(category: DisplayMenuItem["category"]) {
  return category === "food_set" ? "Food set" : category === "drink" ? "Drinks" : "Food";
}

export function getMockCategoryCount(category: DisplayMenuItem["category"]) {
  return mockMenuItems.filter((item) => item.category === category).length;
}

export function getMockMenuByCategory(category: DisplayMenuItem["category"]) {
  return mockMenuItems.filter((item) => item.category === category);
}
