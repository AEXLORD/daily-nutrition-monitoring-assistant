'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';

interface ProfileData {
  profile?: {
    gender?: string;
    birthDate?: string;
    height?: number;
    weight?: number;
    waist?: number;
    hip?: number;
    activityLevel?: string;
    goal?: string;
  };
  preferences?: {
    dietType?: string;
    allergies?: string[];
    dislikedFoods?: string[];
  };
  settings?: {
    unitSystem?: string;
    language?: string;
    notification?: boolean;
  };
}

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        setError('获取个人资料失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('个人资料更新成功');
        setProfileData(data);
      } else {
        setError(data.error || '更新失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (section: keyof ProfileData, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900">个人资料</h2>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {message && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-600">{message}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="身高 (cm)"
              type="number"
              value={profileData.profile?.height || ''}
              onChange={(e) => handleChange('profile', 'height', Number(e.target.value))}
              min="0"
            />
            
            <Input
              label="体重 (kg)"
              type="number"
              value={profileData.profile?.weight || ''}
              onChange={(e) => handleChange('profile', 'weight', Number(e.target.value))}
              min="0"
              step="0.1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                性别
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={profileData.profile?.gender || ''}
                onChange={(e) => handleChange('profile', 'gender', e.target.value)}
              >
                <option value="">请选择</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                活动水平
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={profileData.profile?.activityLevel || ''}
                onChange={(e) => handleChange('profile', 'activityLevel', e.target.value)}
              >
                <option value="">请选择</option>
                <option value="sedentary">久坐</option>
                <option value="light">轻度活动</option>
                <option value="moderate">中度活动</option>
                <option value="active">重度活动</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              目标
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={profileData.profile?.goal || ''}
              onChange={(e) => handleChange('profile', 'goal', e.target.value)}
            >
              <option value="">请选择</option>
              <option value="weight_loss">减重</option>
              <option value="maintenance">维持体重</option>
              <option value="muscle_gain">增肌</option>
            </select>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button
            type="submit"
            loading={isSaving}
            className="w-full md:w-auto"
          >
            {isSaving ? '保存中...' : '保存更改'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}