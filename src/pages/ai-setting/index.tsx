import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { Alert, message, Space, Typography } from 'antd';
import React from 'react';

const { Text, Paragraph, Title } = Typography;

const AISettingPage: React.FC = () => {
  // 从 localStorage 读取 API Key 作为初始值
  const initialApiKey = localStorage.getItem('deepseekApiKey') || '';

  return (
    <PageContainer>
      <Space direction="vertical" size="large" style={{ display: 'flex' }}>
        <ProCard>
          <ProForm
            layout="vertical"
            initialValues={{
              apiKey: initialApiKey,
            }}
            onFinish={(values) => {
              localStorage.setItem('deepseekApiKey', values.apiKey);
              message.success('API Key 已成功保存');
            }}
            onReset={() => {
              localStorage.removeItem('deepseekApiKey');
              message.success('API Key 已删除');
            }}
            submitter={{
              searchConfig: {
                submitText: '保存 API Key',
                resetText: '删除 API Key',
              },
            }}
          >
            <ProFormText.Password
              name="apiKey"
              label="DeepSeek API Key"
              placeholder="请输入 DeepSeek API Key"
              fieldProps={{
                size: 'large',
              }}
            />

            <Alert
              message="温馨提示"
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
