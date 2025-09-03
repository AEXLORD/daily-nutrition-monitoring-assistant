import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Food from '@/models/Food';

export async function GET() {
  try {
    await connectDB();
    
    const categories = await Food.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    
    const formattedCategories = categories.map(cat => ({
      id: cat._id,
      name: cat._id,
      count: cat.count,
    }));
    
    return NextResponse.json(formattedCategories);
    
  } catch (error: any) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}