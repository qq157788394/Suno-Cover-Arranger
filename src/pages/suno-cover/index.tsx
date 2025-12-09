import { CopyOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Spin,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { callDeepSeekAPI, type GenerateRequest } from '@/services/deepseek';
import { mockGenerate } from '@/services/mockData';

const { TextArea } = Input;

const SunoCover: React.FC = () => {
  // 表单实例
  const [form] = Form.useForm<GenerateRequest>();

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [stylesResult, setStylesResult] = useState('');
  const [lyricsResult, setLyricsResult] = useState('');
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  // 从localStorage加载API Key
  useEffect(() => {
    const savedApiKey = localStorage.getItem('deepseekApiKey');
    if (savedApiKey) {
      form.setFieldsValue({
        apiKey: savedApiKey,
        rememberApiKey: true,
      });
    }
  }, [form]);

  // 表单提交处理
  const handleSubmit = async (values: GenerateRequest) => {
    // 保存API Key到localStorage
    if (values.rememberApiKey) {
      localStorage.setItem('deepseekApiKey', values.apiKey);
    } else {
      localStorage.removeItem('deepseekApiKey');
    }

    // 调用API
    setLoading(true);
    try {
      const result = await callDeepSeekAPI(values);
      setStylesResult(result.styles);
      setLyricsResult(result.lyrics);
      message.success('生成成功！');
    } catch (error) {
      // 捕获并显示具体的错误信息
      console.error('API调用失败:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '调用DeepSeek API失败，请检查API Key或稍后重试。';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success(`${type}已复制到剪贴板！`);
      })
      .catch(() => {
        message.error('复制失败，请手动复制。');
      });
  };

  // 定义模拟生成函数，使用外部服务的mockGenerate
  const handleMockGenerate = async () => {
    setLoading(true);
    try {
      // 调用模拟生成服务
      const result = await mockGenerate();
      // 回填页面内容
      setStylesResult(result.styles);
      setLyricsResult(result.lyrics);
      message.success('模拟生成成功！');
    } catch (error) {
      console.error('模拟生成失败:', error);
      message.error('模拟生成失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  // 准备卡片操作按钮
  // 仅在非生产环境显示模拟生成按钮
  // 开发环境强制显示模拟按钮，生产环境构建时自动移除
  // 为了确保开发环境能看到模拟按钮，我们暂时强制设置为false
  const isProduction = false;

  return (
    <PageContainer>
      {/* 全屏加载器 */}
      <Spin
        spinning={loading}
        fullscreen
        tip="生成中，请耐心等待"
        size="large"
      />
      <Row gutter={[24, 0]}>
        {/* 左侧输入表单 */}
        <Col span={8}>
          <Card
            title="翻唱设置"
            actions={[
              // 使用div包装按钮，实现自定义样式
              <Flex
                key="buttons"
                vertical
                gap="small"
                style={{ width: '100%', padding: '0 16px' }}
              >
                {/* 主要生成按钮 */}
                <Button
                  type="primary"
                  onClick={() => form.submit()}
                  loading={loading}
                  size="large"
                  block
                >
                  生成提示词
                </Button>

                {/* 仅在非生产环境显示模拟生成按钮 */}
                {!isProduction && (
                  <Button
                    onClick={handleMockGenerate}
                    loading={loading}
                    size="large"
                    type="text"
                    block
                  >
                    模拟提示词
                  </Button>
                )}
              </Flex>,
            ]}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                song_language: 'Mandarin',
                reference_songs: [{ title: '', artist: '' }],
                rememberApiKey: false,
              }}
            >
              {/* DeepSeek API Key */}
              <Form.Item
                name="apiKey"
                label="DeepSeek API Key"
                rules={[{ required: true, message: '请输入DeepSeek API Key' }]}
              >
                <Input.Password
                  placeholder="请输入DeepSeek API Key"
                  visibilityToggle={{
                    visible: isApiKeyVisible,
                    onVisibleChange: setIsApiKeyVisible,
                  }}
                />
              </Form.Item>

              <Form.Item name="rememberApiKey" valuePropName="checked">
                <Checkbox>记住在本机</Checkbox>
              </Form.Item>

              <Divider />

              {/* 歌曲语言 */}
              <Form.Item
                name="song_language"
                label="歌曲语言"
                rules={[{ required: true, message: '请选择歌曲语言' }]}
              >
                <Select placeholder="请选择歌曲语言">
                  <Select.Option value="Mandarin">华语（普通话）</Select.Option>
                  <Select.Option value="Cantonese">粤语</Select.Option>
                  <Select.Option value="Minnan">闽南语</Select.Option>
                  <Select.Option value="English">英语</Select.Option>
                  <Select.Option value="Korean">韩语</Select.Option>
                  <Select.Option value="Japanese">日语</Select.Option>
                  <Select.Option value="Other">其他</Select.Option>
                </Select>
              </Form.Item>

              {/* 参考艺术家 */}
              <Form.Item
                name="target_artist"
                label="模仿哪位艺术家？"
                rules={[{ required: true, message: '请输入模仿艺术家名称' }]}
              >
                <Input placeholder="例如：张惠妹、陈奕迅、周杰伦……" />
              </Form.Item>

              {/* 参考歌曲 */}
              <Form.List
                name="reference_songs"
                rules={[
                  {
                    validator: (_, songs) => {
                      if (songs && songs.length > 3) {
                        return Promise.reject(new Error('参考歌曲最多3首'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    <Form.Item label="参考歌曲（0-3首，可选）">
                      <Space
                        direction="vertical"
                        style={{ width: '100%' }}
                        size="middle"
                      >
                        {fields.map(({ key, name, ...restField }) => (
                          <Space
                            key={key}
                            style={{ width: '100%' }}
                            align="center"
                            size="middle"
                          >
                            <Form.Item
                              {...restField}
                              name={[name, 'title']}
                              rules={[
                                { required: true, message: '歌曲名不能为空' },
                              ]}
                              style={{ flex: 1, marginBottom: 0 }}
                            >
                              <Input
                                placeholder="歌曲名"
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'artist']}
                              style={{ flex: 1, marginBottom: 0 }}
                            >
                              <Input
                                placeholder="演唱者（选填）"
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}>
                              <Button
                                type="text"
                                danger
                                icon={<MinusOutlined />}
                                onClick={() => remove(name)}
                                disabled={fields.length === 1}
                                size="small"
                              >
                                删除
                              </Button>
                            </Form.Item>
                          </Space>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            disabled={fields.length >= 3}
                            block
                            icon={<PlusOutlined />}
                          >
                            添加参考歌曲
                          </Button>
                        </Form.Item>
                      </Space>
                    </Form.Item>
                    <Form.ErrorList errors={errors} />
                  </>
                )}
              </Form.List>

              {/* 风格备注 */}
              <Form.Item name="style_note" label="风格备注（选填）">
                <TextArea
                  placeholder="例如：主歌要像《人质》一样极度克制，副歌接近《听海》的情绪爆发。"
                  rows={3}
                />
              </Form.Item>

              {/* 附加说明 */}
              <Form.Item
                name="extra_note"
                label="特殊说明（场景/受众等，可选）"
              >
                <TextArea
                  placeholder="例如：演唱会现场，录音室版本……"
                  rows={2}
                />
              </Form.Item>

              {/* 歌词全文 */}
              <Form.Item
                name="lyrics_raw"
                label="段落和歌词"
                rules={[
                  { required: true, message: '请输入歌词' },
                  { max: 2000, message: '歌词长度不能超过2000字' },
                ]}
              >
                <TextArea
                  placeholder="请输入歌词，自行用任意标签划分段落，如：【主歌】、【副歌】、[Verse]、[Chorus] 等"
                  rows={8}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* 中间Styles输出 */}
        <Col span={8}>
          <Card
            title="Styles（可直接复制投喂Suno）"
            extra={
              <Button
                type="text"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(stylesResult, 'Styles')}
                disabled={!stylesResult}
                size="small"
              >
                复制
              </Button>
            }
            style={{ marginBottom: 24 }}
          >
            <TextArea
              value={stylesResult}
              readOnly
              placeholder="生成的Styles将显示在这里..."
              style={{ height: '100%', resize: 'none' }}
              autoSize={{ minRows: 40, maxRows: Infinity }}
            />
          </Card>
        </Col>

        {/* 右侧Lyrics输出 */}
        <Col span={8}>
          <Card
            title="Lyrics（可直接复制投喂Suno）"
            extra={
              <Button
                type="text"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(lyricsResult, 'Lyrics')}
                disabled={!lyricsResult}
                size="small"
              >
                复制
              </Button>
            }
            style={{ marginBottom: 24 }}
          >
            <TextArea
              value={lyricsResult}
              readOnly
              placeholder="生成的Lyrics将显示在这里..."
              style={{ height: '100%', resize: 'none' }}
              autoSize={{ minRows: 40, maxRows: Infinity }}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default SunoCover;
