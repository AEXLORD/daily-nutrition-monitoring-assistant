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
    const startDate = searchParams.get('startDate') || new Date().toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
    
    const records = await IntakeRecord.find({
      userId: payload.userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });
    
    // 计算汇总数据
    const summary = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalSodium: 0,
      totalSugar: 0,
      averageCalories: 0,
      averageProtein: 0,
      averageCarbs: 0,
      averageFat: 0,
      recordCount: records.length,
      days: records.length,
    };
    
    records.forEach(record => {
      summary.totalCalories += record.totalNutrition.calories;
      summary.totalProtein += record.totalNutrition.protein;
      summary.totalCarbs += record.totalNutrition.carbs;
      summary.totalFat += record.totalNutrition.fat;
      summary.totalSodium += record.totalNutrition.sodium || 0;
      summary.totalSugar += record.totalNutrition.sugar || 0;
    });
    
    if (records.length > 0) {
      summary.averageCalories = summary.totalCalories / records.length;
      summary.averageProtein = summary.totalProtein / records.length;
      summary.averageCarbs = summary.totalCarbs / records.length;
      summary.averageFat = summary.totalFat / records.length;
    }
    
    return NextResponse.json({
      period: { startDate, endDate },
      summary,
      records: records.length,
    });
    
  } catch (error: any) {
    console.error('Get intake summary error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}