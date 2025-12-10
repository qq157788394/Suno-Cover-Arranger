import { useEffect, useState } from 'react';
import { db } from '@/services/db';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 加载 API Key（暂时使用用户ID 1，实际应用中需要从用户登录状态获取）
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        console.log('Loading API Key...');
        const currentApiKey = await db.getCurrentApiKey(1);
        console.log('Current API Key from DB:', currentApiKey);
        setApiKey(currentApiKey?.apiKey || '');
      } catch (error) {
        console.error('Failed to load API Key:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKey();
  }, []);

  // 保存 API Key（暂时使用用户ID 1，实际应用中需要从用户登录状态获取）
  const saveApiKey = async (newApiKey: string) => {
    try {
      console.log('Saving API Key:', newApiKey);
      const savedApiKey = await db.createApiKey({
        userId: 1,
        apiKey: newApiKey,
        isCurrent: true,
      });
      console.log('Saved API Key to DB:', savedApiKey);
      setApiKey(newApiKey);
      return true;
    } catch (error) {
      console.error('Failed to save API Key:', error);
      return false;
    }
  };

  // 删除 API Key（暂时使用用户ID 1，实际应用中需要从用户登录状态获取）
  const deleteApiKey = async () => {
    try {
      const currentApiKey = await db.getCurrentApiKey(1);
      if (currentApiKey) {
        await db.deleteApiKey(currentApiKey.id!);
      }
      setApiKey('');
      return true;
    } catch (error) {
      console.error('Failed to delete API Key:', error);
      return false;
    }
  };

  // 验证API Key格式
  const validateApiKey = (apiKeyToValidate: string) => {
    // DeepSeek API Key格式通常是sk-开头的字符串
    const apiKeyRegex = /^sk-/;
    return apiKeyRegex.test(apiKeyToValidate.trim());
  };

  return {
    apiKey,
    isLoading,
    saveApiKey,
    deleteApiKey,
    validateApiKey,
  };
};
