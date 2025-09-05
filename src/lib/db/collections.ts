import { Collection } from 'mongodb';
import connectDB from '@/lib/mongodb';
import { User, Food, IntakeRecord } from './types';

export async function getUsersCollection(): Promise<Collection<User>> {
  const client = await connectDB();
  return client.db('nutrition-monitoring').collection<User>('users');
}

export async function getFoodsCollection(): Promise<Collection<Food>> {
  const client = await connectDB();
  return client.db('nutrition-monitoring').collection<Food>('foods');
}

export async function getIntakeRecordsCollection(): Promise<Collection<IntakeRecord>> {
  const client = await connectDB();
  return client.db('nutrition-monitoring').collection<IntakeRecord>('intakerecords');
}