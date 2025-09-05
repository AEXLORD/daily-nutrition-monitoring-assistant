import { getFoodsCollection } from './collections';
import { Food } from './types';

export async function findFoods(query: string = '', category: string = ''): Promise<Food[]> {
  const foods = await getFoodsCollection();
  
  const filter: any = {};
  
  if (query) {
    filter.name = { $regex: query, $options: 'i' };
  }
  
  if (category) {
    filter.category = category;
  }
  
  return foods.find(filter).limit(50).toArray();
}

export async function findFoodById(id: string): Promise<Food | null> {
  const foods = await getFoodsCollection();
  return foods.findOne({ _id: id });
}

export async function getFoodCategories(): Promise<string[]> {
  const foods = await getFoodsCollection();
  return foods.distinct('category');
}

export async function createFood(foodData: Omit<Food, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const foods = await getFoodsCollection();
  
  const result = await foods.insertOne({
    ...foodData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return result.insertedId.toString();
}

export async function seedFoods(foodsData: Omit<Food, '_id' | 'createdAt' | 'updatedAt'>[]): Promise<number> {
  const foods = await getFoodsCollection();
  
  const foodsWithTimestamps = foodsData.map(food => ({
    ...food,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  
  const result = await foods.insertMany(foodsWithTimestamps);
  return result.insertedCount;
}