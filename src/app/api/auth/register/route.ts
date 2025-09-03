import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password, username } = await request.json();
    
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, password, and username are required' },
        { status: 400 }
      );
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }
    
    const user = new User({
      email,
      password,
      username,
    });
    
    await user.save();
    
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });
    
    const response = NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
    
    setAuthCookie(response, token);
    
    return response;
    
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}