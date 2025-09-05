import bcrypt from 'bcryptjs';
import { getUsersCollection } from './collections';
import { User } from './types';

export async function createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const users = await getUsersCollection();
  
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  
  const result = await users.insertOne({
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return result.insertedId.toString();
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await getUsersCollection();
  return users.findOne({ email });
}

export async function findUserById(id: string): Promise<User | null> {
  const users = await getUsersCollection();
  return users.findOne({ _id: id });
}

export async function updateUser(id: string, updates: Partial<Omit<User, '_id' | 'email' | 'password' | 'createdAt'>>): Promise<boolean> {
  const users = await getUsersCollection();
  
  const result = await users.updateOne(
    { _id: id },
    { $set: { ...updates, updatedAt: new Date() } }
  );
  
  return result.modifiedCount > 0;
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}