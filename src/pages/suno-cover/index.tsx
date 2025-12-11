/**
 * Suno Cover 翻唱提示词生成页面
 * 负责处理用户输入的翻唱配置信息，并生成高质量的 Suno 翻唱歌曲提示词
 */

// Ant Design Icons
import { CopyOutlined } from '@ant-design/icons';

// Ant Design Pro Components
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';

// Umi
import { history } from '@umijs/max';

// Ant Design Base Components
import {
  Alert,
  Button,
  Col,
  Flex,
  Form,
  Input,
  Modal,
  message,
  Row,
  Space,
  Spin,
} from 'antd';

// React
import React, { memo, useCallback, useEffect, useState } from 'react';
// 可复用的结果卡片组件
import { ResultCard } from '@/components';

// Custom Hook
import { useApiKey } from '@/hooks/useApiKey';
import { container } from '@/services/ai/container';
import { DeepSeekService } from '@/services/ai/models/deepseekService';
import { GeminiService } from '@/services/ai/models/geminiService';
import { db } from '@/services/db';
import { mockGenerate } from '@/services/mockData';
// Custom Services and Types
import type {
  GenerateRequest,
  GenerateResponse,
  PromptRecord,
} from '@/shared/types';
// Shared Utils
import { copyToClipboard } from '@/shared/utils';

const SunoCover: React.FC = () => {
  // 使用antd的message hook
  const [messageApi, contextHolder] = message.useMessage();
  // 使用自定义hook管理API Key和模型
  const {
    apiKey,
    model,
    isLoading: apiKeyLoading,
    saveApiKey,
    deleteApiKey,
    validateApiKey,
  } = useApiKey();

  // 表单实例，用于管理翻唱配置表单的数据
  const [form] = Form.useForm<GenerateRequest>();

  // 状态管理 - 使用对象分组相关状态
  const [state, setState] = useState({
    loading: false, // 加载状态，用于显示加载动画
    stylesResult: '', // 存储生成的 Styles 提示词
    lyricsResult: '', // 存储生成的 Lyrics 提示词
  });

  // 更新状态的辅助函数
  const updateState = useCallback((newState: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...newState }));
  }, []);

  // 检查API Key
  const checkApiKey = useCallback(() => {
    if (!apiKey) {
      Modal.confirm({
        title: '尚未设置 AI API Key',
        content: '设置完成后即可使用该功能，是否现在去设置？',
        okText: '去设置',
        cancelText: '取消',
        onOk() {
          history.push('/ai-setting');
        },
      });
      return false;
    }
    return true;
  }, [apiKey, history]);

  // 保存记录到数据库
  const saveRecordToDB = useCallback(
    async (values: GenerateRequest, result: any) => {
      try {
        const userId = 1; // 模拟当前用户ID

        // 转换参考歌曲为字符串数组
        const referenceSongs = values.reference_songs
          .filter((song: { title?: string }) => song.title)
          .map(
            (song: { title: string; artist?: string }) =>
              `${song.title}${song.artist ? ` - ${song.artist}` : ''}`,
          );

        await db.createPromptRecord({
          userId,
          userInput: {
            songName: values.song_name,
            songLanguage: values.song_language,
            targetSinger: values.target_artist,
            referenceSongs,
            styleDescription: values.style_note || '',
            lyrics: values.lyrics_raw,
            scene: values.extra_note || '',
          },
          aiResult: {
            styles: result.styles,
            lyrics: result.lyrics,
            model: model, // 记录使用的 AI 模型
          },
          model: model, // 保存使用的模型名称
        });
        console.log('记录已成功保存');
        messageApi.success('记录已成功保存');
      } catch (dbError) {
        console.error('记录保存失败：', dbError);
      }
    },
    [model, messageApi],
  );

  /**
   * 从localStorage加载记录数据和检查API Key
   * 当用户从记录页面跳转到生成页面时，自动填充之前保存的配置和结果
   */ // 从localStorage加载记录数据
  useEffect(() => {
    // 加载记录数据
    const selectedRecord = localStorage.getItem('selectedPromptRecord');
    if (selectedRecord) {
      try {
        const record: PromptRecord = JSON.parse(selectedRecord);

        // 填充表单数据
        form.setFieldsValue({
          song_name: record.userInput.songName, // 使用歌曲名称字段
          song_language: record.userInput.songLanguage,
          target_artist: record.userInput.targetSinger,
          reference_songs: record.userInput.referenceSongs.map(
            (song: string) => {
              const [title, artist] = song.split(' - ');
              return {
                title: title.trim(),
                artist: artist?.trim() || '',
              };
            },
          ),
          style_note: record.userInput.styleDescription,
          extra_note: record.userInput.scene,
          lyrics_raw: record.userInput.lyrics,
        });

        // 填充结果数据 - 支持多模型的 aiResult 字段
        updateState({
          stylesResult:
            record.aiResult?.styles || record.deepSeekResult?.styles || '', // 向后兼容
          lyricsResult:
            record.aiResult?.lyrics || record.deepSeekResult?.lyrics || '', // 向后兼容
        });

        // 清空localStorage中的记录数据
        localStorage.removeItem('selectedPromptRecord');
      } catch (error) {
        console.error('数据解析失败：', error);
      }
    }
  }, [form, updateState]);

  // 选择AI服务
  const getAIService = () => {
    switch (model) {
      case 'deepseek':
        return container.resolve(DeepSeekService);
      case 'gemini':
        return container.resolve(GeminiService);
      default:
        throw new Error(`Unsupported AI model: ${model}`);
    }
  };

  /**
   * 表单提交处理函数
   * 验证用户输入，调用选定的 AI 模型 API 生成提示词，并保存结果到数据库
   */
  const handleSubmit = useCallback(
    async (values: GenerateRequest) => {
      if (!checkApiKey()) return;

      updateState({ loading: true });
      try {
        // 使用 DI 容器获取对应的服务实例
        const aiService = getAIService();
        const result = await aiService.generate({ ...values, apiKey, model });

        updateState({
          stylesResult: result.styles,
          lyricsResult: result.lyrics,
        });

        messageApi.success('提示词已成功生成！');

        // 转换参考歌曲为字符串数组
        const referenceSongs = values.reference_songs
          .filter((song: { title?: string }) => song.title)
          .map(
            (song: { title: string; artist?: string }) =>
              `${song.title}${song.artist ? ` - ${song.artist}` : ''}`,
          );

        // 保存记录到数据库
        const record = await db.createPromptRecord({
          userId: 1, // 模拟当前用户ID
          userInput: {
            songName: values.song_name,
            songLanguage: values.song_language,
            targetSinger: values.target_artist,
            referenceSongs,
            styleDescription: values.style_note || '',
            lyrics: values.lyrics_raw,
            scene: values.extra_note || '',
          },
          aiResult: {
            styles: result.styles,
            lyrics: result.lyrics,
            model: model,
          },
          model: model,
        });

        console.log('记录已成功保存');
        messageApi.success('记录已成功保存');
      } catch (error) {
        console.error(`${model} API 调用失败：`, error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : `调用 ${model} API 失败，请检查 API Key 或稍后再试。`;
        messageApi.error(errorMessage);
      } finally {
        updateState({ loading: false });
      }
    },
    [checkApiKey, updateState, apiKey, model, messageApi],
  );

  /**
   * 模拟生成提示词函数
   * 用于开发和测试，生成模拟的 Styles 和 Lyrics 提示词，并保存结果到数据库
   */
  const handleMockGenerate = useCallback(async () => {
    updateState({ loading: true });
    try {
      // 调用模拟生成服务
      const result = await mockGenerate();

      // 回填页面内容
      updateState({
        stylesResult: result.styles,
        lyricsResult: result.lyrics,
      });

      messageApi.success('模拟生成已完成');

      // 保存记录到数据库
      const formValues = form.getFieldsValue();

      // 转换参考歌曲为字符串数组
      const referenceSongs = (formValues.reference_songs || [])
        .filter((song: any) => song.title)
        .map(
          (song: any) =>
            `${song.title}${song.artist ? ` - ${song.artist}` : ''}`,
        );

      // 确保必填字段有默认值
      const songLanguage = formValues.song_language || 'Mandarin';
      const targetSinger = formValues.target_artist || '未知艺术家';
      const lyrics = formValues.lyrics_raw || '无歌词';

      await db.createPromptRecord({
        userId: 1, // 模拟当前用户ID
        userInput: {
          songName: formValues.song_name,
          songLanguage,
          targetSinger,
          referenceSongs,
          styleDescription: formValues.style_note || '',
          lyrics,
          scene: formValues.extra_note || '',
        },
        aiResult: {
          styles: result.styles,
          lyrics: result.lyrics,
          model: 'mock', // 模拟生成使用的模型标记
        },
        model: 'mock', // 保存使用的模型名称
      });

      console.log('模拟记录已保存到数据库');
      messageApi.success('记录已成功保存');
    } catch (error) {
      console.error('模拟生成失败:', error);
      messageApi.error('模拟生成失败，请稍后再试');
    } finally {
      updateState({ loading: false });
    }
  }, [form, updateState, messageApi]);

  // 处理翻唱配置标题点击事件
  const handleTitleClick = useCallback(() => {
    handleMockGenerate();
  }, [handleMockGenerate]);

  return (
    <>
      {contextHolder}
      <PageContainer>
        {/* 只有在用户没有设置AI API Key时才显示Alert提示 */}
        {!apiKey && (
          <Alert
            title="尚未设置 AI API Key，设置完成后即可使用该功能，是否现在去设置？"
            banner
            style={{ marginBottom: 24 }}
            action={
              <Button type="link" onClick={() => history.push('/ai-setting')}>
                去设置
              </Button>
            }
          />
        )}

        {/* 全屏加载器 */}
        <Spin
          spinning={state.loading}
          fullscreen
          tip="正在生成，请稍候"
          size="large"
        />

        <Row gutter={[24, 0]}>
          {/* 左侧输入表单 */}
          <Col span={8}>
            <ProCard
              title={
                <span onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
                  翻唱配置
                </span>
              }
            >
              <ProForm
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  song_language: 'Mandarin',
                }}
                submitter={{
                  render: () => (
                    <Flex vertical gap="small" style={{ marginTop: 16 }}>
                      {/* 主要生成按钮 */}
                      <Button
                        type="primary"
                        onClick={() => form.submit()}
                        loading={state.loading}
                        size="large"
                        block
                      >
                        生成提示词
                      </Button>
                    </Flex>
                  ),
                }}
              >
                {/* 歌曲名称 */}
                <ProFormText
                  name="song_name"
                  label="歌曲名称"
                  placeholder="请输入歌曲名称，仅作为记录方便查询"
                  rules={[{ required: true, message: '请填写歌曲名称' }]}
                  fieldProps={{ showCount: true }}
                />

                {/* 歌曲语言 */}
                <ProFormSelect
                  name="song_language"
                  label="歌曲语言"
                  placeholder="请选择歌曲语言"
                  rules={[{ required: true, message: '请选择歌曲语言' }]}
                  options={[
                    { value: 'Mandarin', label: '华语（普通话）' },
                    { value: 'Cantonese', label: '粤语' },
                    { value: 'Minnan', label: '闽南语' },
                    { value: 'English', label: '英语' },
                    { value: 'Korean', label: '韩语' },
                    { value: 'Japanese', label: '日语' },
                    { value: 'Other', label: '其他' },
                  ]}
                />

                {/* 参考艺术家 */}
                <ProFormText
                  name="target_artist"
                  label="想模仿哪位艺术家？"
                  placeholder="例如：张惠妹、陈奕迅、周杰伦等"
                  rules={[
                    { required: true, message: '请填写模仿的艺术家姓名' },
                  ]}
                  fieldProps={{ showCount: true }}
                />

                {/* 参考歌曲 */}
                <ProFormList
                  name="reference_songs"
                  label="参考歌曲（可选，最多 3 首）"
                  rules={[
                    {
                      validator: (_, songs) => {
                        if (songs && songs.length > 3) {
                          return Promise.reject(
                            new Error('最多可添加 3 首参考歌曲'),
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  initialValue={[]}
                  creatorButtonProps={{
                    creatorButtonText: '添加参考歌曲',
                    type: 'dashed',
                    block: true,
                  }}
                  deleteIconProps={{
                    tooltipText: '删除该参考歌曲',
                  }}
                  copyIconProps={false}
                  max={3}
                >
                  {(meta, _index, _action, _count) => (
                    <Space key={meta.key} style={{ width: '100%' }}>
                      <ProFormText
                        {...meta}
                        name={[meta.name, 'title']}
                        placeholder="歌曲名"
                        rules={[
                          { required: true, message: '歌曲名称不能为空' },
                        ]}
                        style={{ marginBottom: 0, flex: 1 }}
                        fieldProps={{ style: { width: '100%' } }}
                      />
                      <ProFormText
                        {...meta}
                        name={[meta.name, 'artist']}
                        placeholder="演唱者（可选）"
                        style={{ marginBottom: 0, flex: 1 }}
                        fieldProps={{ style: { width: '100%' } }}
                      />
                    </Space>
                  )}
                </ProFormList>

                {/* 风格备注 */}
                <ProFormTextArea
                  name="style_note"
                  label="风格备注（可选）"
                  placeholder="例如：主歌要像《人质》一样极度克制，副歌接近《听海》的情绪爆发。"
                  fieldProps={{ showCount: true, rows: 3 }}
                />

                {/* 附加说明 */}
                <ProFormTextArea
                  name="extra_note"
                  label="特殊说明（如场景、受众等，可选）"
                  placeholder="例如：演唱会现场版、录音室版本等"
                  fieldProps={{ showCount: true, rows: 3 }}
                />

                {/* 歌词全文 */}
                <ProFormTextArea
                  name="lyrics_raw"
                  label="段落与歌词"
                  placeholder="请填写歌词，并使用任意标签划分段落，例如：【主歌】、【副歌】、[Verse]、[Chorus] 等"
                  rules={[
                    { required: true, message: '请输入段落与歌词' },
                    { max: 2000, message: '段落歌词长度不能超过 2000 字' },
                  ]}
                  fieldProps={{
                    showCount: true,
                    autoSize: { minRows: 10, maxRows: 12 },
                  }}
                />
              </ProForm>
            </ProCard>
          </Col>

          {/* 中间Styles输出 */}
          <Col span={8}>
            <ResultCard
              title="Styles 提示词（可直接复制用于 Suno）"
              value={state.stylesResult}
              onCopy={() => copyToClipboard(state.stylesResult, 'Styles')}
            />
          </Col>

          {/* 右侧Lyrics输出 */}
          <Col span={8}>
            <ResultCard
              title="Lyrics 提示词（可直接复制用于 Suno）"
              value={state.lyricsResult}
              onCopy={() => copyToClipboard(state.lyricsResult, 'Lyrics')}
            />
          </Col>
        </Row>
      </PageContainer>
    </>
  );
};

export default SunoCover;
