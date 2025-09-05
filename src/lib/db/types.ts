export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal?: 'maintain' | 'lose' | 'gain';
  createdAt: Date;
  updatedAt: Date;
}

export interface Food {
  _id?: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  vitaminE?: number;
  vitaminK?: number;
  vitaminB1?: number;
  vitaminB2?: number;
  vitaminB3?: number;
  vitaminB6?: number;
  vitaminB12?: number;
  folate?: number;
  calcium?: number;
  iron?: number;
  magnesium?: number;
  phosphorus?: number;
  potassium?: number;
  zinc?: number;
  selenium?: number;
  copper?: number;
  manganese?: number;
  servingSize: string;
  servingUnit: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntakeRecord {
  _id?: string;
  userId: string;
  foodId: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}