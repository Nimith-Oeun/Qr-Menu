import type { DisplayMenuItem } from "@shared/api";

const drinkImages = [
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85",
];

const foodImages = [
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=85",
];

export const mockMenuItems: DisplayMenuItem[] = [
  { id: 101, name: "Signature Iced Latte", size: "M", price: "$3.50", image: drinkImages[0], category: "drink", description: "Silky espresso, cold milk, and a touch of sweetness." },
  { id: 102, name: "Caramel Macchiato", size: "L", price: "$4.25", image: drinkImages[1], category: "drink", description: "Bold espresso layered with caramel and steamed milk." },
  { id: 103, name: "Fresh Lime Tea", size: "M", price: "$2.75", image: drinkImages[2], category: "drink", description: "A refreshing blend of tea, lime, and crushed ice." },
  { id: 104, name: "Grilled Chicken Bowl", size: "M", price: "$6.50", image: foodImages[0], category: "food", description: "Smoky grilled chicken served with greens and rice." },
  { id: 105, name: "Garden Fresh Salad", size: "M", price: "$5.25", image: foodImages[1], category: "food", description: "Crisp seasonal vegetables with our house dressing." },
  { id: 106, name: "Creamy Pasta", size: "L", price: "$7.50", image: foodImages[2], category: "food", description: "Comforting pasta tossed in a rich creamy sauce." },
  { id: 107, name: "Cafe Sharing Set", size: "Set", price: "$12.00", image: foodImages[0], category: "food_set", description: "A generous combination for sharing with friends." },
  { id: 108, name: "BBQ Duo Set", size: "Set", price: "$15.00", image: foodImages[2], category: "food_set", description: "Our customer-favorite BBQ pairing with sides." },
];

export function getMockMenuItems() {
  return mockMenuItems.map((item) => ({ ...item }));
}

export function getMockMenuSeparated() {
  const items = getMockMenuItems();
  return {
    drinks: items.filter((item) => item.category === "drink"),
    foods: items.filter((item) => item.category === "food"),
    foodSets: items.filter((item) => item.category === "food_set"),
  };
}

export function isApiUnavailable(error: unknown) {
  return error instanceof Error && ("status" in error ? (error as { status: number }).status === 0 || (error as { status: number }).status === 408 : true);
}
