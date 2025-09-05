import { NextRequest, NextResponse } from 'next/server';
import { findFoods } from '@/lib/db/foods';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';

    const foods = await findFoods(query, category);

    return NextResponse.json({ foods });
  } catch (error) {
    console.error('Get foods error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}