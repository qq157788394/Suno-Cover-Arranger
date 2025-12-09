import {
  Button,
  Card,
  Form,
  Input,
  List,
  message,
  Select,
  Space,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { db, type StyleConfig } from '../../services/db';

const { Option } = Select;
const { Title, Text } = Typography;

const DbExample: React.FC = () => {
  const [form] = Form.useForm();
  const [styleConfigs, setStyleConfigs] = useState<StyleConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // 模拟用户ID
  const mockUserId = 1;

  // 加载所有风格配置
  const loadStyleConfigs = async () => {
    try {
      setLoading(true);
      const configs = await db.getUserStyleConfigs(mockUserId);
      setStyleConfigs(configs);
    } catch (error) {
      console.error('Failed to load style configs:', error);
      message.error('加载风格配置失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadStyleConfigs();
  }, []);

  // 创建或更新风格配置
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const configData = {
        name: values.name,
        config: {
          genre: values.genre,
          dynamics: values.dynamics,
          mood: values.mood,
          arrangement: values.arrangement,
        },
        userId: mockUserId,
        isDefault: values.isDefault,
      };

      if (editingId) {
        // 更新现有配置
        await db.updateStyleConfig(editingId, configData);
        message.success('风格配置更新成功');
        setEditingId(null);
      } else {
        // 创建新配置
        await db.createStyleConfig(configData);
        message.success('风格配置创建成功');
      }

      // 重置表单并重新加载数据
      form.resetFields();
      loadStyleConfigs();
    } catch (error) {
      console.error('Failed to save style config:', error);
      message.error('保存风格配置失败');
    } finally {
      setLoading(false);
    }
  };

  // 编辑风格配置
  const handleEdit = (config: StyleConfig) => {
    setEditingId(config.id);
    form.setFieldsValue({
      name: config.name,
      genre: config.config.genre,
      dynamics: config.config.dynamics,
      mood: config.config.mood,
      arrangement: config.config.arrangement,
      isDefault: config.isDefault,
    });
  };

  // 删除风格配置
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await db.deleteStyleConfig(id);
      message.success('风格配置删除成功');
      loadStyleConfigs();
    } catch (error) {
      console.error('Failed to delete style config:', error);
      message.error('删除风格配置失败');
    } finally {
      setLoading(false);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    setEditingId(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>IndexedDB 示例 - 风格配置管理</Title>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 表单卡片 */}
        <Card title={editingId ? '编辑风格配置' : '创建新风格配置'}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ isDefault: false }}
          >
            <Form.Item
              name="name"
              label="配置名称"
              rules={[{ required: true, message: '请输入配置名称' }]}
            >
              <Input placeholder="输入配置名称" />
            </Form.Item>

            <Form.Item
              name="genre"
              label="音乐类型"
              rules={[{ required: true, message: '请选择音乐类型' }]}
            >
              <Select placeholder="选择音乐类型">
                <Option value="pop">流行</Option>
                <Option value="rock">摇滚</Option>
                <Option value="ballad">民谣</Option>
                <Option value="electronic">电子</Option>
                <Option value="classical">古典</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="dynamics"
              label="动态变化"
              rules={[{ required: true, message: '请选择动态变化' }]}
            >
              <Select placeholder="选择动态变化">
                <Option value="calm-to-explosive">平静到爆发</Option>
                <Option value="consistent">稳定</Option>
                <Option value="build-up">逐步增强</Option>
                <Option value="dynamic-shifts">频繁变化</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="mood"
              label="情绪"
              rules={[{ required: true, message: '请选择情绪' }]}
            >
              <Select placeholder="选择情绪">
                <Option value="happy">快乐</Option>
                <Option value="sad">悲伤</Option>
                <Option value="angry">愤怒</Option>
                <Option value="romantic">浪漫</Option>
                <Option value="nostalgic">怀旧</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="arrangement"
              label="编曲"
              rules={[{ required: true, message: '请选择编曲' }]}
            >
              <Select placeholder="选择编曲">
                <Option value="piano-driven">钢琴主导</Option>
                <Option value="guitar-driven">吉他主导</Option>
                <Option value="orchestral">管弦乐</Option>
                <Option value="electronic">电子音效</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="isDefault"
              label="设为默认"
              valuePropName="checked"
            >
              <Select placeholder="是否设为默认">
                <Option value={true}>是</Option>
                <Option value={false}>否</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingId ? '更新' : '创建'}
                </Button>
                {editingId && <Button onClick={handleCancel}>取消</Button>}
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* 配置列表 */}
        <Card title="现有风格配置">
          <Button
            type="primary"
            onClick={loadStyleConfigs}
            loading={loading}
            style={{ marginBottom: 16 }}
          >
            刷新列表
          </Button>

          <List
            loading={loading}
            dataSource={styleConfigs}
            renderItem={(config) => (
              <List.Item
                actions={[
                  <Button
                    key="edit"
                    type="link"
                    onClick={() => handleEdit(config)}
                  >
                    编辑
                  </Button>,
                  <Button
                    key="delete"
                    type="link"
                    danger
                    onClick={() => handleDelete(config.id || 0)}
                  >
                    删除
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Text strong>{config.name}</Text>
                      {config.isDefault && (
                        <span style={{ color: '#1890ff', fontSize: '12px' }}>
                          (默认)
                        </span>
                      )}
                    </Space>
                  }
                  description={
                    <div>
                      <Text type="secondary">
                        音乐类型：{config.config.genre}
                      </Text>
                      <br />
                      <Text type="secondary">
                        动态变化：{config.config.dynamics}
                      </Text>
                      <br />
                      <Text type="secondary">情绪：{config.config.mood}</Text>
                      <br />
                      <Text type="secondary">
                        编曲：{config.config.arrangement}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Space>
    </div>
  );
};

export default DbExample;
