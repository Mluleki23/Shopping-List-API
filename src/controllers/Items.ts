
import { Item } from "../types/Items";

let items: Item[] = [];
let currentId = 1;

// Get all items
export const getItems = (): Item[] => items;

// Get item by ID
export const getItemById = (id: number): Item | undefined => {
  return items.find((item) => item.id === id);
};

// Add new item
export const addItem = (
  name: string,
  quantity: number,
  purchased: boolean
): Item => {
  const newItem: Item = { id: currentId++, name, quantity, purchased };
  items.push(newItem);
  return newItem;
};

//  Update existing item
export const updateItem = (
  id: number,
  updatedData: Partial<Item>
): Item | undefined => {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return undefined;

  items[index] = { ...items[index], ...updatedData };
  return items[index];
};



