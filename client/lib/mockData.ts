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
  { id: 104, name: "Honey Cold Brew", size: "M", price: "$3.75", image: drinkImages[0], category: "drink", description: "Slow-steeped coffee rounded out with local honey." },
  { id: 105, name: "Matcha Cloud", size: "L", price: "$4.50", image: drinkImages[1], category: "drink", description: "Bright matcha topped with a silky chilled foam." },
  { id: 106, name: "Peach Sparkler", size: "M", price: "$3.25", image: drinkImages[2], category: "drink", description: "Juicy peach, citrus, and sparkling soda over ice." },
  { id: 107, name: "Grilled Chicken Bowl", size: "M", price: "$6.50", image: foodImages[0], category: "food", description: "Smoky grilled chicken served with greens and rice." },
  { id: 108, name: "Garden Fresh Salad", size: "M", price: "$5.25", image: foodImages[1], category: "food", description: "Crisp seasonal vegetables with our house dressing." },
  { id: 109, name: "Creamy Pasta", size: "L", price: "$7.50", image: foodImages[2], category: "food", description: "Comforting pasta tossed in a rich creamy sauce." },
  { id: 110, name: "Crispy BBQ Wings", size: "M", price: "$8.25", image: foodImages[0], category: "food", description: "Crispy wings glazed with our smoky house BBQ sauce." },
  { id: 111, name: "Coconut Rice Plate", size: "M", price: "$6.75", image: foodImages[1], category: "food", description: "Fragrant coconut rice with vegetables and herbs." },
  { id: 112, name: "Cafe Sharing Set", size: "Set", price: "$12.00", image: foodImages[0], category: "food_set", description: "A generous combination for sharing with friends." },
  { id: 113, name: "BBQ Duo Set", size: "Set", price: "$15.00", image: foodImages[2], category: "food_set", description: "Our customer-favorite BBQ pairing with sides." },
  { id: 114, name: "Weekend Feast Set", size: "Set", price: "$18.50", image: foodImages[1], category: "food_set", description: "A relaxed feast with mains, sides, and dipping sauces." },
  { id: 115, name: "Friends Platter", size: "Set", price: "$22.00", image: foodImages[0], category: "food_set", description: "A shareable platter made for the whole table." },
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
