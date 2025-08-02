import { RequestHandler } from "express";
import { MenuResponse, DisplayMenuItem, MenuByCategoryResponse } from "@shared/api";

// Mock data - replace this with your actual database calls
let mockMenuItems: DisplayMenuItem[] = [
  // Drinks
  ...Array.from({ length: 7 }, (_, i) => ({
    id: i + 1,
    name: `Drink ${i + 1}`,
    size: i % 2 === 0 ? "M" : "L",
    price: `${2 + (i % 3)}`,
    image: "https://api.builder.io/api/v1/image/assets/TEMP/2e811b0fa84092c929b579286fded5e620c45c19?width=347",
    category: 'drink' as const,
  })),
  // Foods
  ...Array.from({ length: 8 }, (_, i) => ({
    id: i + 8,
    name: `Food ${i + 1}`,
    size: i % 2 === 0 ? "M" : "L",
    price: `${4 + (i % 4)}`,
    image: "https://api.builder.io/api/v1/image/assets/TEMP/977e1ee7cf4be018cd9e90c67e54df15c36e50b0?width=347",
    category: 'food' as const,
  })),
];

// Get all menu items
export const handleGetMenu: RequestHandler = async (req, res) => {
  try {
    // TODO: Replace with actual database call
    // const items = await db.menuItems.findAll();
    
    const response: MenuResponse = {
      items: mockMenuItems.map(item => ({
        ...item,
        category: item.category === 'drink' ? 'DRINK' : 'FOOD',
        isActive: true,
        createdAt: '', // or new Date().toISOString() if you want a timestamp
        updatedAt: '', // or new Date().toISOString()
      })),
    };
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
};

// Get menu items by category
export const handleGetMenuByCategory: RequestHandler = async (req, res) => {
  try {
    const { category } = req.params;
    
    if (category && !['drink', 'food'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category. Must be "drink" or "food"' });
    }

    // TODO: Replace with actual database call
    // const items = category 
    //   ? await db.menuItems.findAll({ where: { category } })
    //   : await db.menuItems.findAll();

    const filteredItems = category 
      ? mockMenuItems.filter(item => item.category === category)
      : mockMenuItems;

    const response: MenuResponse = {
      items: filteredItems.map(item => ({
        ...item,
        category: item.category === 'drink' ? 'DRINK' : 'FOOD',
        isActive: true,
        createdAt: '', // or new Date().toISOString()
        updatedAt: '', // or new Date().toISOString()
      })),
    };
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching menu by category:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
};

// Get drinks and foods separately
export const handleGetMenuSeparated: RequestHandler = async (req, res) => {
  try {
    console.log('handleGetMenuSeparated called'); // Debug log
    
    // TODO: Replace with actual database calls
    // const drinks = await db.menuItems.findAll({ where: { category: 'drink' } });
    // const foods = await db.menuItems.findAll({ where: { category: 'food' } });

    const drinks = mockMenuItems
      .filter(item => item.category === 'drink')
      .map(item => ({
        ...item,
        category: 'DRINK' as 'DRINK',
        isActive: true,
        createdAt: '', // or new Date().toISOString()
        updatedAt: '', // or new Date().toISOString()
      }));
    const foods = mockMenuItems
      .filter(item => item.category === 'food')
      .map(item => ({
        ...item,
        category: 'FOOD' as 'FOOD',
        isActive: true,
        createdAt: '', // or new Date().toISOString()
        updatedAt: '', // or new Date().toISOString()
      }));

    const response: MenuByCategoryResponse = {
      drinks,
      foods,
    };
    
    console.log('Sending response:', { drinksCount: drinks.length, foodsCount: foods.length }); // Debug log
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching separated menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
};

// Add a new menu item
export const handleAddMenuItem: RequestHandler = async (req, res) => {
  try {
    console.log('handleAddMenuItem called with body:', req.body); // Debug log
    
    const { name, size, price, image, category, description } = req.body;
    
    // Validate required fields
    if (!name || !size || !price || !category) {
      return res.status(400).json({ 
        error: 'Missing required fields. Name, size, price, and category are required.' 
      });
    }
    
    // Validate category
    if (!['drink', 'food'].includes(category)) {
      return res.status(400).json({ 
        error: 'Invalid category. Must be "drink" or "food"' 
      });
    }
    
    // Generate new ID
    const newId = Math.max(...mockMenuItems.map(item => item.id), 0) + 1;
    
    // Create new item
    const newItem: DisplayMenuItem = {
      id: newId,
      name: name.trim(),
      size: size.trim(),
      price: price.trim(),
      image: image || (category === 'drink' 
        ? "https://api.builder.io/api/v1/image/assets/TEMP/2e811b0fa84092c929b579286fded5e620c45c19?width=347"
        : "https://api.builder.io/api/v1/image/assets/TEMP/977e1ee7cf4be018cd9e90c67e54df15c36e50b0?width=347"),
      category: category as 'drink' | 'food',
      description: description?.trim() || undefined,
    };
    
    // Add to mock data (TODO: Replace with actual database call)
    mockMenuItems.push(newItem);
    
    console.log('New item added:', newItem); // Debug log
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
};

// Update a menu item
export const handleUpdateMenuItem: RequestHandler = async (req, res) => {
  try {
    console.log('handleUpdateMenuItem called with params:', req.params, 'body:', req.body); // Debug log
    
    const { id } = req.params;
    const { name, size, price, image, category, description } = req.body;
    
    // Find the item to update
    const itemIndex = mockMenuItems.findIndex(item => item.id === parseInt(id));
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    // Validate required fields
    if (!name || !size || !price || !category) {
      return res.status(400).json({ 
        error: 'Missing required fields. Name, size, price, and category are required.' 
      });
    }
    
    // Validate category
    if (!['drink', 'food'].includes(category)) {
      return res.status(400).json({ 
        error: 'Invalid category. Must be "drink" or "food"' 
      });
    }
    
    // Update the item
    const updatedItem: DisplayMenuItem = {
      id: parseInt(id),
      name: name.trim(),
      size: size.trim(),
      price: price.trim(),
      image: image || (category === 'drink' 
        ? "https://api.builder.io/api/v1/image/assets/TEMP/2e811b0fa84092c929b579286fded5e620c45c19?width=347"
        : "https://api.builder.io/api/v1/image/assets/TEMP/977e1ee7cf4be018cd9e90c67e54df15c36e50b0?width=347"),
      category: category as 'drink' | 'food',
      description: description?.trim() || undefined,
    };
    
    // Update in mock data (TODO: Replace with actual database call)
    mockMenuItems[itemIndex] = updatedItem;
    
    console.log('Item updated:', updatedItem); // Debug log
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
};

// Delete a menu item
export const handleDeleteMenuItem: RequestHandler = async (req, res) => {
  try {
    console.log('handleDeleteMenuItem called with params:', req.params); // Debug log
    
    const { id } = req.params;
    
    // Find the item to delete
    const itemIndex = mockMenuItems.findIndex(item => item.id === parseInt(id));
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    // Remove from mock data (TODO: Replace with actual database call)
    const deletedItem = mockMenuItems.splice(itemIndex, 1)[0];
    
    console.log('Item deleted:', deletedItem); // Debug log
    res.status(200).json({ message: 'Menu item deleted successfully', item: deletedItem });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
};
