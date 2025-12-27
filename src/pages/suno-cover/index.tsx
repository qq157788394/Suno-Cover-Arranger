/**
 * Suno Cover 翻唱提示词生成页面
 * 负责处理用户输入的翻唱配置信息，并生成高质量的 Suno 翻唱歌曲提示词
 */

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
import { history, useSearchParams } from '@umijs/max';
// Ant Design Base Components
import {
  Button,
  Col,
  Flex,
  Form,
  Modal,
  message,
  Row,
  Space,
  Spin,
} from 'antd';
// React
import React, { useCallback, useEffect, useRef, useState } from 'react';
// 可复用的结果卡片组件
import { ApiKeyAlert, ResultCard } from '@/components';
import type { AIProviderModelType } from '@/config/aiProviderConfig';
import { BusinessType } from '@/config/aiTemperatureConfig';
import { SYSTEM_PROMPT } from '@/config/prompts';
// Custom Hook
import { useApiKey } from '@/hooks/useApiKey';
import { AIProviderFactory } from '@/services/ai/providers';
import { db } from '@/services/db';
import { mockGenerate } from '@/services/mockData';
import type { GenerateRequest } from '@/shared/types/types';
import { copyToClipboard } from '@/shared/utils';
import { FIELD_CONFIGS, VALIDATION_RULES } from './config/validationConfig';
import { loadRecordData } from './utils/dataLoader';
import { SunoCoverPromptBuilder } from './utils/promptBuilder';
import { SunoCoverResponseParser } from './utils/responseParser';

const SunoCover: React.FC = () => {
  // 使用antd的message hook
  const [messageApi, contextHolder] = message.useMessage();
  // 使用自定义hook管理API Key和模型
  const { apiKey, model, checkApiKey, shouldShowAlert, navigateToSettings } =
    useApiKey();

  // 表单实例，用于管理翻唱配置表单的数据
  const [form] = Form.useForm<GenerateRequest>();

  // ProFormList实例，用于直接控制参考歌曲列表数据
  const proFormListRef = useRef<any>(null);

  // 获取URL参数
  const [searchParams] = useSearchParams();

  // 简化的状态管理
  const [loading, setLoading] = useState(false); // 加载状态
  const [stylesResult, setStylesResult] = useState(''); // Styles提示词结果
  const [lyricsResult, setLyricsResult] = useState(''); // Lyrics提示词结果
  const [isFormInitialized, setIsFormInitialized] = useState(false); // 表单是否已初始化

  // 统一的数据库保存方法（可复用于正常提交和模拟生成）
  const saveRecordToDB = useCallback(
    async (values: any, result: any, isMock: boolean = false) => {
      const userId = 1; // 模拟当前用户ID

      // 获取参考歌曲
      const referenceSongsArray = Array.isArray(values.reference_songs)
        ? values.reference_songs
        : [];

      const referenceSongs = JSON.stringify(
        referenceSongsArray.filter(
          (song: any) => song?.title && typeof song.title === 'string',
        ),
      );

      // 确保必填字段有默认值
      const songLanguage = values.song_language || 'Mandarin';
      const targetSinger = values.target_artist || '未知艺术家';
      const lyrics = values.lyrics_raw || '无歌词';

      // 准备保存到数据库的记录
      const recordToSave = {
        user_id: userId,
        user_input: {
          song_name: values.song_name,
          song_language: songLanguage,
          target_singer: targetSinger,
          reference_songs: referenceSongs,
          style_description: values.style_note || '',
          lyrics,
          scene: values.extra_note || '',
        },
        ai_result: {
          styles: result.styles,
          lyrics: result.lyrics,
          model: isMock ? 'mock' : model, // 区分正常生成和模拟生成
        },
      };

      const record = await db.createPromptRecord(recordToSave);

      messageApi.success('记录已成功保存');

      return record;
    },
    [model, messageApi],
  );

  // 从URL参数加载记录数据并初始化表单
  useEffect(() => {
    const loadRecordFromURL = async () => {
      const recordId = searchParams.get('recordId');

      // 使用模块化函数加载数据
      const { formValues, hasRecord, stylesResult, lyricsResult } =
        await loadRecordData(recordId);

      // 设置结果数据
      if (hasRecord) {
        setStylesResult(stylesResult || '');
        setLyricsResult(lyricsResult || '');
      }

      // 设置表单值（无论是否有数据都设置）
      form.setFieldsValue(formValues);

      // 标记表单为已初始化
      setIsFormInitialized(true);
    };

    loadRecordFromURL();
  }, [searchParams, form]);

  /**
   * 表单提交处理函数
   * 验证用户输入，调用选定的 AI 模型 API 生成提示词，并保存结果到数据库
   */
  const handleSubmit = useCallback(
    async (values: GenerateRequest) => {
      if (!checkApiKey()) return;

      setLoading(true);
      try {
        const provider = AIProviderFactory.createProvider(
          model as AIProviderModelType,
        );

        const userPrompt = SunoCoverPromptBuilder.buildUserPrompt(values);

        const response = await provider.generate({
          api_key: apiKey,
          system_prompt: SYSTEM_PROMPT,
          user_prompt: userPrompt,
          business_type: BusinessType.ARRANGEMENT,
        });

        if (!response.success) {
          throw new Error(response.error || 'AI生成失败');
        }

        const result = SunoCoverResponseParser.parseResponse(response.content);

        setStylesResult(result.styles);
        setLyricsResult(result.lyrics);

        messageApi.success('提示词已成功生成！');

        await saveRecordToDB(values, result, false);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `调用 ${model} API 失败，请检查 API Key 或稍后再试。`;
        messageApi.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [checkApiKey, apiKey, model, messageApi],
  );

  /**
   * 模拟生成提示词函数
   * 用于开发和测试，生成模拟的 Styles 和 Lyrics 提示词，并保存结果到数据库
   */
  const handleMockGenerate = useCallback(async () => {
    setLoading(true);
    try {
      // 获取表单值并记录
      const formValues = form.getFieldsValue();

      // 调用模拟生成服务
      const result = await mockGenerate();

      // 回填页面内容
      setStylesResult(result.styles);
      setLyricsResult(result.lyrics);

      messageApi.success('模拟生成已完成');

      // 使用统一的数据库保存方法（标记为模拟生成）
      await saveRecordToDB(formValues, result, true);
    } catch (_error) {
      messageApi.error('模拟生成失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  }, [form, messageApi]);

  // 处理翻唱配置标题点击事件
  const handleTitleClick = useCallback(() => {
    handleMockGenerate();
  }, [handleMockGenerate]);

  return (
    <>
      {contextHolder}
      <PageContainer>
        {/* 只有在用户没有设置AI API Key时才显示Alert提示 */}
        <ApiKeyAlert
          visible={shouldShowAlert}
          onNavigateToSettings={navigateToSettings}
        />

        {/* 全屏加载器 */}
        <Spin spinning={loading} fullscreen size="large" />

        <Row gutter={[24, 0]}>
          {/* 左侧输入表单 */}
          <Col xxl={8} xl={8} lg={12} md={24} sm={24} xs={24}>
            <ProCard
              title={
                <span onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
                  翻唱配置
                </span>
              }
              style={{ height: '100%' }}
            >
              {/* 延迟渲染：只有在数据加载完成后才显示表单 */}
              {!isFormInitialized ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Spin size="large" />
                </div>
              ) : (
                <ProForm
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  submitter={{
                    render: () => (
                      <Flex vertical gap="small" style={{ marginTop: 16 }}>
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
                      </Flex>
                    ),
                  }}
                >
                  {/* 歌曲名称 */}
                  <ProFormText
                    name="song_name"
                    label="歌曲名称"
                    placeholder="请输入歌曲名称，仅作为记录方便查询"
                    rules={VALIDATION_RULES.songName}
                    fieldProps={FIELD_CONFIGS.songName}
                  />

                  {/* 歌曲语言 */}
                  <ProFormSelect
                    name="song_language"
                    label="歌曲语言"
                    placeholder="请选择歌曲语言"
                    rules={VALIDATION_RULES.language}
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
                    rules={VALIDATION_RULES.artistName}
                    fieldProps={FIELD_CONFIGS.artistName}
                  />

                  {/* 参考歌曲 */}
                  <ProFormList
                    actionRef={proFormListRef}
                    name="reference_songs"
                    label="参考歌曲（可选，最多 3 首）"
                    initialValue={[{ title: '', artist: '' }]}
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
                    {(meta) => (
                      <Space key={meta.name} style={{ width: '100%' }}>
                        <ProFormText
                          name="title"
                          placeholder="歌曲名"
                          rules={VALIDATION_RULES.referenceSongTitle}
                          fieldProps={{
                            style: { width: '100%' },
                            ...FIELD_CONFIGS.referenceSongTitle,
                          }}
                        />
                        <ProFormText
                          name="artist"
                          placeholder="演唱者（可选）"
                          rules={VALIDATION_RULES.referenceSongArtist}
                          fieldProps={{
                            style: { width: '100%' },
                            ...FIELD_CONFIGS.referenceSongArtist,
                          }}
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
                    rules={VALIDATION_RULES.lyrics}
                    fieldProps={FIELD_CONFIGS.lyrics}
                  />
                </ProForm>
              )}
            </ProCard>
          </Col>

          {/* 中间Styles输出 */}
          <Col xxl={8} xl={8} lg={6} md={12} sm={12} xs={12}>
            <ResultCard
              title="Styles 提示词（可直接复制用于 Suno）"
              value={stylesResult}
              onCopy={() => copyToClipboard(stylesResult, 'Styles')}
            />
          </Col>

          {/* 右侧Lyrics输出 */}
          <Col xxl={8} xl={8} lg={6} md={12} sm={12} xs={12}>
            <ResultCard
              title="Lyrics 提示词（可直接复制用于 Suno）"
              value={lyricsResult}
              onCopy={() => copyToClipboard(lyricsResult, 'Lyrics')}
            />
          </Col>
        </Row>
      </PageContainer>
    </>
  );
};

export default SunoCover;
