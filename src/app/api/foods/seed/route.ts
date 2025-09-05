import { NextResponse } from 'next/server';
import { seedFoods } from '@/lib/db/foods';

const sampleFoods = [
  {
    name: '苹果',
    category: '水果',
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fiber: 2.4,
    sugar: 10,
    vitaminC: 4.6,
    servingSize: '1',
    servingUnit: '个'
  },
  {
    name: '鸡胸肉',
    category: '肉类',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: '100',
    servingUnit: '克'
  },
  {
    name: '米饭',
    category: '主食',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    servingSize: '100',
    servingUnit: '克'
  }
];

export async function POST() {
  try {
    const count = await seedFoods(sampleFoods);

    return NextResponse.json(
      { message: `Seeded ${count} foods` },
      { status: 201 }
    );
  } catch (error) {
    console.error('Seed foods error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}