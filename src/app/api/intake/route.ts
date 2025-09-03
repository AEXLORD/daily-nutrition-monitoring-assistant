import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import IntakeRecord from '@/models/IntakeRecord';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { verifyToken } = await import('@/lib/auth');
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let query: any = { userId: payload.userId };
    
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.date = {
        $gte: targetDate,
        $lt: nextDay,
      };
    }
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    
    const records = await IntakeRecord.find(query)
      .populate('meals.items.foodId', 'name category baseNutrition')
      .sort({ date: -1, 'meals.timestamp': -1 })
      .limit(limit);
    
    return NextResponse.json({ records });
    
  } catch (error: any) {
    console.error('Get intake records error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { verifyToken } = await import('@/lib/auth');
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const intakeData = await request.json();
    
    // 计算总营养
    const totalNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      sodium: 0,
      sugar: 0,
    };
    
    intakeData.meals.forEach((meal: any) => {
      meal.items.forEach((item: any) => {
        totalNutrition.calories += item.estimatedNutrition.calories || 0;
        totalNutrition.protein += item.estimatedNutrition.protein || 0;
        totalNutrition.carbs += item.estimatedNutrition.carbs || 0;
        totalNutrition.fat += item.estimatedNutrition.fat || 0;
        totalNutrition.sodium += item.estimatedNutrition.sodium || 0;
        totalNutrition.sugar += item.estimatedNutrition.sugar || 0;
      });
    });
    
    const record = new IntakeRecord({
      userId: payload.userId,
      date: intakeData.date || new Date(),
      meals: intakeData.meals,
      totalNutrition,
      sourceType: intakeData.sourceType || 'home',
      notes: intakeData.notes,
    });
    
    await record.save();
    await record.populate('meals.items.foodId', 'name category baseNutrition');
    
    return NextResponse.json({
      message: 'Intake record created successfully',
      record,
    });
    
  } catch (error: any) {
    console.error('Create intake record error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}