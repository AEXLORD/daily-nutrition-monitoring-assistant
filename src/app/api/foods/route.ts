import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Food from '@/models/Food';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    
    let query: any = { isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    const skip = (page - 1) * limit;
    
    const foods = await Food.find(query)
      .select('name nameEn category baseNutrition commonMeasurements')
      .limit(limit)
      .skip(skip)
      .sort({ name: 1 });
    
    const total = await Food.countDocuments(query);
    
    return NextResponse.json({
      foods,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error: any) {
    console.error('Get foods error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const foodData = await request.json();
    
    const food = new Food(foodData);
    await food.save();
    
    return NextResponse.json({
      message: 'Food created successfully',
      food,
    });
    
  } catch (error: any) {
    console.error('Create food error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}