import { useEffect, useState } from 'react';
import { db } from '@/services/db';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>('deepseek');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 加载指定模型的API Key
  const loadApiKeyForModel = async (targetModel: string) => {
    try {
      console.log('Loading API Key for model:', targetModel);
      const userApiKeys = await db.getUserApiKeys(1);
      console.log('All user API Keys:', userApiKeys);

      // 查找指定模型的API Key
      const modelApiKey = userApiKeys.find((key) => key.model === targetModel);
      console.log('Found API Key for model', targetModel, ':', modelApiKey);

      setApiKey(modelApiKey?.api_key || '');
      setModel(targetModel);

      // 将所有API Key的isCurrent设置为false，然后将指定模型的API Key设置为当前
      console.log('Updating current API Key status for model', targetModel);
      for (const key of userApiKeys) {
        if (key.id) {
          await db.updateApiKey(key.id, {
            is_current: key.model === targetModel,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load API Key for model:', targetModel, error);
      setApiKey('');
      setModel(targetModel);
    }
  };

  // 加载初始API Key和模型
  useEffect(() => {
    const loadInitialApiKeyAndModel = async () => {
      try {
        console.log('Loading initial API Key and Model...');

        // 首先尝试获取当前设置的API Key
        const currentApiKey = await db.getCurrentApiKey(1);

        if (currentApiKey) {
          console.log('Found current API Key:', currentApiKey);
          setApiKey(currentApiKey.api_key);
          setModel(currentApiKey.model);
        } else {
          // 如果没有当前API Key，默认使用deepseek并尝试加载其API Key
          console.log('No current API Key found, using default model deepseek');
          await loadApiKeyForModel('deepseek');
        }
      } catch (error) {
        console.error('Failed to load initial API Key and Model:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialApiKeyAndModel();
  }, []);

  // 切换模型的方法
  const switchModel = async (newModel: string) => {
    if (newModel === model) return; // 如果是同一个模型，不做任何操作

    setIsLoading(true);
    await loadApiKeyForModel(newModel);
    setIsLoading(false);
  };

  // 保存 API Key 和模型（暂时使用用户ID 1，实际应用中需要从用户登录状态获取）
  const saveApiKey = async (
    newApiKey: string,
    newModel: string = 'deepseek',
  ) => {
    try {
      console.log('Saving API Key and Model:', {
        apiKey: newApiKey,
        model: newModel,
      });
      const savedApiKey = await db.createApiKey({
        user_id: 1,
        api_key: newApiKey,
        model: newModel,
        is_current: true,
      });
      console.log('Saved API Key and Model to DB:', savedApiKey);
      setApiKey(newApiKey);
      setModel(newModel);
      return true;
    } catch (error) {
      console.error('Failed to save API Key and Model:', error);
      return false;
    }
  };

  // 删除 API Key（删除当前模型对应的API Key）
  const deleteApiKey = async () => {
    try {
      console.log('Deleting API Key for model:', model);
      // 获取当前用户该模型对应的API Key
      const userApiKeys = await db.getUserApiKeys(1);
      const modelApiKey = userApiKeys.find((key) => key.model === model);

      if (modelApiKey?.id) {
        console.log('Deleting API Key with ID:', modelApiKey.id);
        await db.deleteApiKey(modelApiKey.id);
      }

      setApiKey('');
      console.log('API Key deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete API Key:', error);
      return false;
    }
  };

  // 验证API Key格式（支持不同模型的API Key格式）
  const validateApiKey = (apiKeyToValidate: string) => {
    // DeepSeek API Key格式：sk-开头的字符串
    // Google Gemini API Key格式：AIza开头的字符串
    // 小米MiMo API Key格式：sk-开头的字符串
    const deepSeekRegex = /^sk-/;
    const geminiRegex = /^AIza/;
    const mimoRegex = /^sk-/;

    const trimmedApiKey = apiKeyToValidate.trim();
    return (
      deepSeekRegex.test(trimmedApiKey) ||
      geminiRegex.test(trimmedApiKey) ||
      mimoRegex.test(trimmedApiKey)
    );
  };

  return {
    apiKey,
    model,
    isLoading,
    saveApiKey,
    deleteApiKey,
    validateApiKey,
    switchModel, // 新增切换模型的方法
  };
};
