import mongoose, { Document, Schema } from 'mongoose';

export interface IIntakeItem {
  foodId: mongoose.Types.ObjectId;
  foodName: string;
  quantity: number;
  unit: string;
  cookedWeight?: number;
  cookingMethod?: string;
  estimatedNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sodium?: number;
    sugar?: number;
  };
}

export interface IIntakeRecord extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  meals: {
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    timestamp: Date;
    items: IIntakeItem[];
  }[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sodium?: number;
    sugar?: number;
  };
  sourceType: 'home' | 'restaurant' | 'takeout';
  notes?: string;
  createdAt: Date;
}

const IntakeItemSchema: Schema = new Schema({
  foodId: {
    type: Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  foodName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
    enum: ['g', 'bowl', 'spoon', 'piece', 'portion'],
  },
  cookedWeight: Number,
  cookingMethod: {
    type: String,
    enum: ['raw', 'steamed', 'boiled', 'stirFried', 'deepFried'],
  },
  estimatedNutrition: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    sodium: Number,
    sugar: Number,
  },
});

const IntakeRecordSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  meals: [{
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    items: [IntakeItemSchema],
  }],
  totalNutrition: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: Number,
    sodium: Number,
    sugar: Number,
  },
  sourceType: {
    type: String,
    enum: ['home', 'restaurant', 'takeout'],
    default: 'home',
  },
  notes: String,
}, {
  timestamps: true,
});

IntakeRecordSchema.index({ userId: 1, date: 1 });
IntakeRecordSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.IntakeRecord || mongoose.model<IIntakeRecord>('IntakeRecord', IntakeRecordSchema);