import { getIntakeRecordsCollection } from './collections';
import { IntakeRecord } from './types';

export async function createIntakeRecord(recordData: Omit<IntakeRecord, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const records = await getIntakeRecordsCollection();
  
  const result = await records.insertOne({
    ...recordData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return result.insertedId.toString();
}

export async function getUserIntakeRecords(userId: string, date: Date): Promise<IntakeRecord[]> {
  const records = await getIntakeRecordsCollection();
  
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return records.find({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay }
  }).sort({ date: 1 }).toArray();
}

export async function getDailyNutritionSummary(userId: string, date: Date): Promise<{
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}> {
  const records = await getUserIntakeRecords(userId, date);
  
  const summary = records.reduce((acc, record) => ({
    totalCalories: acc.totalCalories + record.calories,
    totalProtein: acc.totalProtein + record.protein,
    totalCarbs: acc.totalCarbs + record.carbs,
    totalFat: acc.totalFat + record.fat
  }), {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0
  });
  
  return summary;
}

export async function deleteIntakeRecord(recordId: string): Promise<boolean> {
  const records = await getIntakeRecordsCollection();
  
  const result = await records.deleteOne({ _id: recordId });
  return result.deletedCount > 0;
}