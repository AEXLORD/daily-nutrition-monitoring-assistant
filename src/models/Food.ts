import mongoose, { Document, Schema } from 'mongoose';

export interface IFood extends Document {
  name: string;
  nameEn?: string;
  category: string;
  baseNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    cholesterol?: number;
  };
  vitamins?: {
    vitaminA?: number;
    vitaminD?: number;
    vitaminE?: number;
    vitaminK?: number;
    vitaminB1?: number;
    vitaminB2?: number;
    vitaminB6?: number;
    vitaminB12?: number;
    vitaminC?: number;
    folate?: number;
    niacin?: number;
    pantothenicAcid?: number;
  };
  minerals?: {
    calcium?: number;
    phosphorus?: number;
    potassium?: number;
    sodium?: number;
    magnesium?: number;
    iron?: number;
    zinc?: number;
    selenium?: number;
    copper?: number;
    manganese?: number;
    iodine?: number;
    chromium?: number;
    molybdenum?: number;
  };
  cookingMethods?: {
    raw?: { coefficient: number; description: string };
    steamed?: { coefficient: number; description: string };
    boiled?: { coefficient: number; description: string };
    stirFried?: { coefficient: number; description: string };
    deepFried?: { coefficient: number; description: string };
  };
  commonMeasurements?: {
    bowl?: { weight: number; description: string };
    spoon?: { weight: number; description: string };
    piece?: { weight: number; description: string };
  };
  tags?: string[];
  isActive: boolean;
  source?: string;
}

const FoodSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  nameEn: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      '谷物', '蔬菜', '水果', '肉类', '水产', '蛋奶', '豆制品', 
      '坚果', '油脂', '调味品', '饮料', '其他'
    ],
  },
  baseNutrition: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: Number,
    sugar: Number,
    sodium: Number,
    cholesterol: Number,
  },
  vitamins: {
    vitaminA: Number,
    vitaminD: Number,
    vitaminE: Number,
    vitaminK: Number,
    vitaminB1: Number,
    vitaminB2: Number,
    vitaminB6: Number,
    vitaminB12: Number,
    vitaminC: Number,
    folate: Number,
    niacin: Number,
    pantothenicAcid: Number,
  },
  minerals: {
    calcium: Number,
    phosphorus: Number,
    potassium: Number,
    sodium: Number,
    magnesium: Number,
    iron: Number,
    zinc: Number,
    selenium: Number,
    copper: Number,
    manganese: Number,
    iodine: Number,
    chromium: Number,
    molybdenum: Number,
  },
  cookingMethods: {
    raw: { coefficient: Number, description: String },
    steamed: { coefficient: Number, description: String },
    boiled: { coefficient: Number, description: String },
    stirFried: { coefficient: Number, description: String },
    deepFried: { coefficient: Number, description: String },
  },
  commonMeasurements: {
    bowl: { weight: Number, description: String },
    spoon: { weight: Number, description: String },
    piece: { weight: Number, description: String },
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  source: String,
}, {
  timestamps: true,
});

FoodSchema.index({ name: 'text', nameEn: 'text' });
FoodSchema.index({ category: 1 });
FoodSchema.index({ isActive: 1 });

export default mongoose.models.Food || mongoose.model<IFood>('Food', FoodSchema);