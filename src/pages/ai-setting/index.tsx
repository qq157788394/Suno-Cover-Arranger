import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { Alert, Form, message, Space, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useApiKey } from '@/hooks/useApiKey';

const { Text, Paragraph, Title } = Typography;

const AISettingPage: React.FC = () => {
  // 使用自定义hook管理API Key
  const { apiKey, isLoading, saveApiKey, deleteApiKey, validateApiKey } =
    useApiKey();
  // 创建 FormInstance 的引用
  const [form] = Form.useForm();

  // 当API Key加载完成后，设置到表单中
  useEffect(() => {
    if (!isLoading) {
      form.setFieldsValue({ apiKey: apiKey });
    }
  }, [apiKey, isLoading, form]);

  // 表单提交处理
  const handleFormSubmit = async (values: { apiKey: string }) => {
    // 验证API Key格式
    if (!validateApiKey(values.apiKey)) {
      message.error('API Key格式不正确，请输入以sk-开头的API Key');
      return;
    }

    const result = await saveApiKey(values.apiKey);
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
      form.setFieldsValue({ apiKey: '' });
      message.success('API Key 已删除');
    } else {
      message.error('删除API Key失败，请稍后重试');
    }
  };

  return (
    <PageContainer>
      <Space direction="vertical" size="large" style={{ display: 'flex' }}>
        <ProCard>
          <ProForm
            layout="vertical"
            initialValues={{
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
            loading={isLoading}
          >
            <ProFormText.Password
              name="apiKey"
              label="DeepSeek API Key"
              placeholder="请输入以sk-开头的DeepSeek API Key"
              fieldProps={{
                size: 'large',
              }}
              rules={[
                {
                  required: true,
                  message: '请输入DeepSeek API Key',
                },
                {
                  validator: (_rule, value) => {
                    if (!value || validateApiKey(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('API Key格式不正确，请输入以sk-开头的API Key'),
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
                    <li>仅通过 HTTPS 直连 DeepSeek 官方 API</li>
                    <li>您可随时删除保存的 API Key</li>
                  </ul>
                </Paragraph>
              }
              type="success"
              style={{ marginBottom: 24 }}
            />
          </ProForm>
        </ProCard>

        <ProCard>
          <Title level={4}>
            DeepSeek API Key 一分钟申请 + 充值指南（新手版）
          </Title>
          <Paragraph>
            <ol>
              <li>
                打开官网：
                <a
                  href="https://platform.deepseek.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.deepseek.cn/register
                </a>
              </li>
              <li>点击右上角 【登录 / 注册】（手机号、邮箱、微信都可以）</li>
              <li>根据提示完成注册（手机号、邮箱、微信都可以）</li>
              <li>登录后，在左侧找到 【API 密钥 / API Keys】</li>
              <li>点击 【创建 API Key】，输入名称并确认</li>
              <li>复制生成的 API Key（记得先保存好，之后看不到完整内容）</li>
              <li>
                在 DeepSeek 平台完成充值：10 元起充，支持微信、支付宝，10
                元一般能用挺久。
              </li>
              <li>回到本应用 → 打开 设置 / AI 设置 → 粘贴 API Key → 保存。</li>
              <li>完成！现在就可以正常使用各项 AI 生成功能了。</li>
            </ol>
          </Paragraph>
        </ProCard>
      </Space>
    </PageContainer>
  );
};

export default AISettingPage;
