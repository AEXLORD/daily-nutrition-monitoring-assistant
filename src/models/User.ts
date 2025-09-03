import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  profile: {
    gender?: 'male' | 'female';
    birthDate?: Date;
    height?: number;
    weight?: number;
    waist?: number;
    hip?: number;
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active';
    goal?: 'weight_loss' | 'maintenance' | 'muscle_gain';
  };
  preferences: {
    dietType?: 'normal' | 'vegetarian' | 'vegan';
    allergies?: string[];
    dislikedFoods?: string[];
  };
  settings: {
    unitSystem?: 'metric' | 'imperial';
    language?: string;
    notification?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  profile: {
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    birthDate: Date,
    height: Number,
    weight: Number,
    waist: Number,
    hip: Number,
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active'],
    },
    goal: {
      type: String,
      enum: ['weight_loss', 'maintenance', 'muscle_gain'],
    },
  },
  preferences: {
    dietType: {
      type: String,
      enum: ['normal', 'vegetarian', 'vegan'],
      default: 'normal',
    },
    allergies: [String],
    dislikedFoods: [String],
  },
  settings: {
    unitSystem: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric',
    },
    language: {
      type: String,
      default: 'zh-CN',
    },
    notification: {
      type: Boolean,
      default: true,
    },
  },
}, {
  timestamps: true,
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(String(this.password), salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);