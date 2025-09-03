import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Food from '@/models/Food';

const sampleFoods = [
  {
    name: '白米饭',
    category: '谷物',
    baseNutrition: {
      calories: 130,
      protein: 2.7,
      carbs: 28.2,
      fat: 0.3,
      fiber: 0.4,
      sodium: 1,
    },
    commonMeasurements: {
      bowl: { weight: 150, description: '一碗' },
    },
  },
  {
    name: '鸡胸肉',
    category: '肉类',
    baseNutrition: {
      calories: 165,
      protein: 31.0,
      carbs: 0.0,
      fat: 3.6,
      sodium: 74,
    },
    commonMeasurements: {
      piece: { weight: 100, description: '一块' },
    },
  },
  {
    name: '鸡蛋',
    category: '蛋奶',
    baseNutrition: {
      calories: 155,
      protein: 13.0,
      carbs: 1.1,
      fat: 11.0,
      sodium: 124,
    },
    commonMeasurements: {
      piece: { weight: 50, description: '一个' },
    },
  },
  {
    name: '牛奶',
    category: '蛋奶',
    baseNutrition: {
      calories: 61,
      protein: 3.2,
      carbs: 4.8,
      fat: 3.3,
      sodium: 40,
    },
    commonMeasurements: {
      bowl: { weight: 200, description: '一杯' },
    },
  },
  {
    name: '苹果',
    category: '水果',
    baseNutrition: {
      calories: 52,
      protein: 0.3,
      carbs: 14.0,
      fat: 0.2,
      fiber: 2.4,
      sodium: 1,
    },
    commonMeasurements: {
      piece: { weight: 150, description: '一个' },
    },
  },
  {
    name: '香蕉',
    category: '水果',
    baseNutrition: {
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      fiber: 2.6,
      sodium: 1,
    },
    commonMeasurements: {
      piece: { weight: 120, description: '一根' },
    },
  },
  {
    name: '西兰花',
    category: '蔬菜',
    baseNutrition: {
      calories: 34,
      protein: 2.8,
      carbs: 7.0,
      fat: 0.4,
      fiber: 2.6,
      sodium: 33,
    },
    commonMeasurements: {
      bowl: { weight: 100, description: '一碗' },
    },
  },
  {
    name: '胡萝卜',
    category: '蔬菜',
    baseNutrition: {
      calories: 41,
      protein: 0.9,
      carbs: 9.6,
      fat: 0.2,
      fiber: 2.8,
      sodium: 69,
    },
    commonMeasurements: {
      piece: { weight: 60, description: '一根' },
    },
  },
  {
    name: '三文鱼',
    category: '水产',
    baseNutrition: {
      calories: 208,
      protein: 20.4,
      carbs: 0.0,
      fat: 13.4,
      sodium: 59,
    },
    commonMeasurements: {
      piece: { weight: 100, description: '一块' },
    },
  },
  {
    name: '豆腐',
    category: '豆制品',
    baseNutrition: {
      calories: 76,
      protein: 8.1,
      carbs: 1.9,
      fat: 4.8,
      sodium: 7,
    },
    commonMeasurements: {
      piece: { weight: 200, description: '一块' },
    },
  },
];

export async function POST() {
  try {
    await connectDB();
    
    // 清空现有数据（可选）
    await Food.deleteMany({});
    
    // 插入样本数据
    await Food.insertMany(sampleFoods);
    
    const count = await Food.countDocuments();
    
    return NextResponse.json({
      message: 'Sample foods seeded successfully',
      count,
    });
    
  } catch (error: any) {
    console.error('Seed foods error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}