'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/ui/Layout';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {isAuthenticated ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">欢迎回来！</h1>
              <Button variant="outline" onClick={handleLogout}>
                退出登录
              </Button>
            </div>
            
            <ProfileForm />
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                下一步计划
              </h3>
              <p className="text-blue-700">
                接下来我们将开发食物数据库和摄入记录功能，让您能够开始跟踪每日营养摄入。
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                营养监测助手
              </h1>
              <p className="text-lg text-gray-600">
                智能记录、分析您的每日营养摄入，助您达成健康目标
              </p>
            </div>

            {showRegister ? <RegisterForm /> : <LoginForm />}

            <div className="text-center">
              <button
                onClick={() => setShowRegister(!showRegister)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {showRegister ? '已有账号？立即登录' : '没有账号？立即注册'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
