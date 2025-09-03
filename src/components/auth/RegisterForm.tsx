'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('密码确认不一致');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 注册成功，刷新页面
        window.location.href = '/';
      } else {
        setError(data.error || '注册失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-gray-900">注册</h2>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <Input
            label="用户名"
            name="username"
            type="text"
            placeholder="请输入用户名"
            value={formData.username}
            onChange={handleChange}
            required
          />
          
          <Input
            label="邮箱"
            name="email"
            type="email"
            placeholder="请输入邮箱地址"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <Input
            label="密码"
            name="password"
            type="password"
            placeholder="请输入密码（至少6位）"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />
          
          <Input
            label="确认密码"
            name="confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength={6}
            required
          />
        </CardContent>
        
        <CardFooter>
          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
          >
            {isLoading ? '注册中...' : '注册'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}