import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { Alert, Form, message, Radio, Space, Typography } from 'antd';
import React, { useEffect } from 'react';

import { useApiKey } from '@/hooks/useApiKey';

const { Text, Paragraph, Title, Link } = Typography;

const AISettingPage: React.FC = () => {
  // 使用自定义hook管理API Key，包括新添加的switchModel方法
  const {
    apiKey,
    model,
    isLoading,
    saveApiKey,
    deleteApiKey,
    validateApiKey,
    switchModel,
  } = useApiKey();
  // 创建 FormInstance 的引用
  const [form] = Form.useForm();

  // 当API Key加载完成后，设置到表单中
  useEffect(() => {
    if (!isLoading) {
      form.setFieldsValue({
        model: model || 'deepseek',
        apiKey: apiKey,
      });
    }
  }, [apiKey, model, isLoading, form]);

  // 处理模型变化，使用新添加的switchModel方法
  const handleModelChange = async (e: any) => {
    const newModel = e.target.value;
    console.log('Changing model to:', newModel);
    await switchModel(newModel);
  };

  // 表单提交处理
  const handleFormSubmit = async (values: {
    model: string;
    apiKey: string;
  }) => {
    // 验证API Key格式
    if (!validateApiKey(values.apiKey)) {
      message.error('API Key格式不正确，请输入有效的API Key');
      return;
    }

    const result = await saveApiKey(values.apiKey, values.model);
    if (result) {
      message.success('API Key 已成功保存');
    } else {
      message.error('保存API Key失败，请稍后重试');
    }
  };

  // 表单重置处理
  const handleFormReset = async () => {
    const result = await deleteApiKey();
    if (result) {
      // 清空表单内容
      form.setFieldsValue({
        model: 'deepseek',
        apiKey: '',
      });
      message.success('API Key 已删除');
    } else {
      message.error('删除API Key失败，请稍后重试');
    }
  };

  // 使用条件渲染避免 initialValues 警告
  if (isLoading) {
    return <PageContainer loading />;
  }

  return (
    <PageContainer>
      <Space orientation="vertical" size="large">
        <ProCard>
          <ProForm
            layout="vertical"
            initialValues={{
              model: model || 'deepseek',
              apiKey: apiKey,
            }}
            form={form}
            onFinish={handleFormSubmit}
            onReset={handleFormReset}
            submitter={{
              searchConfig: {
                submitText: '保存 API Key',
                resetText: '删除 API Key',
              },
            }}
            loading={false}
          >
            <ProForm.Item
              name="model"
              label="首选 AI 模型"
              rules={[{ required: true, message: '请选择首选 AI 模型' }]}
            >
              <Radio.Group
                value={model}
                options={[
                  {
                    value: 'deepseek',
                    label: 'DeepSeek v3.2（需充值，10元起步，支持国货💪）',
                  },
                  {
                    value: 'gemini',
                    label: 'Google Gemini 3（推荐，可白嫖）',
                  },
                  {
                    value: 'glm',
                    label: '智谱AI GLM-4.6V-Flash（可白嫖）',
                  },
                  {
                    value: 'mimo',
                    label:
                      '小米MiMo V2 Flash（限时免费，但需要本地运行，不会写代码的别用）',
                  },
                ]}
                onChange={handleModelChange}
              />
            </ProForm.Item>

            <ProFormText.Password
              name="apiKey"
              label="API Key"
              placeholder="请输入所选 AI 模型的 API Key"
              fieldProps={{
                size: 'large',
              }}
              rules={[
                {
                  required: true,
                  message: '请输入 API Key',
                },
                {
                  validator: (_rule, value) => {
                    if (!value || validateApiKey(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('API Key格式不正确，请输入有效的 API Key'),
                    );
                  },
                },
              ]}
            />

            <Alert
              title="温馨提示"
              description={
                <Paragraph>
                  <ul>
                    <li>您的 API Key 仅保存在本地设备</li>
                    <li>不会上传至任何第三方服务器</li>
                    <li>仅通过 HTTPS 直连 AI 模型官方 API</li>
                    <li>您可随时删除保存的 API Key</li>
                  </ul>
                </Paragraph>
              }
              type="success"
              style={{ marginBottom: 24 }}
            />
          </ProForm>
        </ProCard>

        <ProCard split="vertical">
          <ProCard colSpan={12}>
            <Title level={4}>
              DeepSeek API Key 一分钟申请 + 充值指南（新手版）
            </Title>
            <Paragraph>
              <ol>
                <li>
                  打开官网：
                  <Link href="https://platform.deepseek.com/" target="_blank">
                    https://platform.deepseek.com/
                  </Link>
                </li>
                <li>
                  点击右上角 <Text code>登录 / 注册</Text>
                  （手机号、邮箱、微信都可以）
                </li>
                <li>根据提示完成注册（手机号、邮箱、微信都可以）</li>
                <li>
                  登录后，在左侧找到 <Text code>API 密钥 / API Keys</Text>
                </li>
                <li>
                  点击 <Text code>创建 API Key</Text>，输入名称并确认
                </li>
                <li>复制生成的 API Key（记得先保存好，之后看不到完整内容）</li>
                <li>在 DeepSeek 平台完成充值：10 元起充，支持微信、支付宝</li>
                <li>回到本应用 → 打开 设置 / AI 设置 → 粘贴 API Key → 保存</li>
                <li>完成！现在就可以正常使用各项 AI 生成功能了</li>
              </ol>
              <Title level={4}>💡 常见问题</Title>
              <ul>
                <li>需要付费吗？ 需要。充值 10 元就能用好久</li>
              </ul>
            </Paragraph>
          </ProCard>
          <ProCard colSpan={12}>
            <Title level={4}>Gemini API Key 一分钟申请指南（新手版）</Title>
            <Paragraph>
              <ol>
                <li>
                  打开官网：
                  <Link href="https://aistudio.google.com/" target="_blank">
                    https://aistudio.google.com/
                  </Link>
                  （注：需要科学上网环境）
                </li>
                <li>
                  登录账号 点击页面上的 <Text code>Sign in</Text>，使用 Google
                  账号（Gmail）登录。
                </li>
                <li>
                  获取密钥 登录后，点击左上角的 <Text code>Get API key</Text>{' '}
                  按钮
                </li>
                <li>
                  创建密钥 点击 <Text code>Create API key</Text>{' '}
                  按钮，如果弹窗询问，选择{' '}
                  <Text code>Create API key in new project</Text>
                  （在新项目中创建）
                </li>
                <li>
                  复制并保存 系统会生成一串 AIza 开头的字符，点击 Copy 复制
                </li>
                <li>回到本应用 → 打开 设置 / AI 设置 → 粘贴 API Key → 保存</li>
                <li>完成！现在就可以正常使用各项 AI 生成功能了</li>
              </ol>
              <Title level={4}>💡 常见问题</Title>
              <ul>
                <li>
                  需要付费吗？ 不需要。Gemini API
                  提供免费额度，对于日常使用完全足够，无需绑定信用卡
                </li>
              </ul>
            </Paragraph>
          </ProCard>
        </ProCard>

        <ProCard split="vertical">
          <ProCard colSpan={12}>
            <Title level={4}>智谱AI API Key 一分钟申请指南（新手版）</Title>
            <Paragraph>
              <ol>
                <li>
                  打开官网：
                  <Link href="https://open.bigmodel.cn/" target="_blank">
                    https://open.bigmodel.cn/
                  </Link>
                </li>
                <li>
                  点击右上角 <Text code>登录 / 注册</Text>
                  （手机号、邮箱都可以）
                </li>
                <li>根据提示完成注册（手机号、邮箱都可以）</li>
                <li>
                  登录后，在左侧找到 <Text code>API 密钥 / API Keys</Text>
                </li>
                <li>
                  点击 <Text code>创建 API Key</Text>，输入名称并确认
                </li>
                <li>复制生成的 API Key（记得先保存好，之后看不到完整内容）</li>
                <li>回到本应用 → 打开 设置 / AI 设置 → 粘贴 API Key → 保存</li>
                <li>完成！现在就可以正常使用各项 AI 生成功能了</li>
              </ol>
              <Title level={4}>💡 常见问题</Title>
              <ul>
                <li>需要付费吗？ 不需要，GLM-4.6V-Flash是免费模型。</li>
                <li>是国货么？ 国货</li>
                <li>模型水平如何？ 写代码水平不错。</li>
              </ul>
            </Paragraph>
          </ProCard>
          <ProCard colSpan={12}>
            <Title level={4}>小米MiMo API Key 申请指南（新手版）</Title>
            <Paragraph>
              <ol>
                <li>
                  打开官网：
                  <Link href="https://platform.xiaomimimo.com/" target="_blank">
                    https://platform.xiaomimimo.com/
                  </Link>
                </li>
                <li>
                  在页面中找到 <Text code>申请 API Key</Text> 按钮，点击
                </li>
                <li>
                  按页面提示，登录 / 注册小米账号 <Text code>登录 / 注册</Text>
                </li>
                <li>
                  创建密钥 点击 <Text code>新建 API Key</Text>{' '}
                  按钮，输入名称并确认
                </li>
                <li>复制并保存 系统会生成一串 sk-开头的字符，点击复制按钮</li>
                <li>回到本应用 → 打开 设置 / AI 设置 → 粘贴 API Key → 保存</li>
                <li>完成！现在就可以正常使用各项 AI 生成功能了</li>
              </ol>
              <Title level={4}>💡 常见问题</Title>
              <ul>
                <li>
                  无法使用？
                  请确保在本地运行项目，线上环境无法使用，不会写代码就别折腾了
                </li>
                <li>需要付费吗？ 新模型，面向全球公测，限时免费！</li>
                <li>
                  模型水平如何？ 新模型，up主只开发了功能，并没有深入进行测试
                </li>
              </ul>
            </Paragraph>
          </ProCard>
        </ProCard>
      </Space>
    </PageContainer>
  );
};

export default AISettingPage;
