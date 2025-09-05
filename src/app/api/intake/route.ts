import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { createIntakeRecord, getUserIntakeRecords } from '@/lib/db/intake';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const date = dateParam ? new Date(dateParam) : new Date();

    const records = await getUserIntakeRecords(decoded.userId, date);

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Get intake records error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { foodId, foodName, quantity, unit, calories, protein, carbs, fat, mealType, date } = await request.json();

    if (!foodId || !foodName || !quantity || !unit || !calories || !mealType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const recordId = await createIntakeRecord({
      userId: decoded.userId,
      foodId,
      foodName,
      quantity,
      unit,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      mealType,
      date: date ? new Date(date) : new Date()
    });

    return NextResponse.json(
      { message: 'Intake record created', recordId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create intake record error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}