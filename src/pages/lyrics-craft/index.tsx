/**
 * 大师写歌词页面
 * 负责处理歌词创作相关功能，使用ProForm实现15个表单项
 */

import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormSlider,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { XMarkdown } from '@ant-design/x-markdown';
import { useModel, useNavigate } from '@umijs/max';
import { Button, Col, Divider, Empty, message, Row, Spin } from 'antd';
import React, { useState } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

import {
  CLOSENESS_LEVEL_OPTIONS,
  CREATION_MODE_OPTIONS,
  OUTPUT_COUNT_OPTIONS,
  PERSONA_OPTIONS,
  RHYME_TYPE_OPTIONS,
  SONG_LANGUAGE_OPTIONS,
  SONG_STRUCTURE_OPTIONS,
  SONG_STYLE_OPTIONS,
  WORDING_STYLE_OPTIONS,
} from '@/config/lyricsEnums';
import { MASTER_STYLE_CARDS } from '@/config/masterStyleConfig';
import { useApiKey } from '@/hooks/useApiKey';
import { useLyricsRecords } from '@/hooks/useLyricsRecords';
import {
  generateLyrics,
  validateLyricsRequest,
} from '@/services/lyricsService';
import type { LyricsFormData } from '@/shared/types/types';
import { copyToClipboard } from '@/shared/utils';

const LyricsCraftPage: React.FC = () => {
  const navigate = useNavigate();
  const { apiKey } = useApiKey();
  const { createRecord } = useLyricsRecords();
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedLyrics, setGeneratedLyrics] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();
  const { initialState } = useModel('@@initialState');
  const isDarkTheme = initialState?.settings?.navTheme === 'realDark';
  const markdownThemeClass = isDarkTheme
    ? 'x-markdown-dark'
    : 'x-markdown-light';

  const handleSubmit = async (values: LyricsFormData) => {
    if (!apiKey) {
      messageApi.error('请先在AI设置中配置API Key');
      navigate('/ai-setting');
      return;
    }

    const request = {
      ...values,
      api_key: apiKey,
    };

    const validation = validateLyricsRequest(request);
    if (!validation.valid) {
      messageApi.error(validation.error);
      return;
    }

    setLoading(true);
    setGeneratedLyrics('');

    try {
      const response = await generateLyrics(request);

      if (response.success && response.lyrics.length > 0) {
        const lyricsText = response.lyrics.join('\n\n---\n\n');
        setGeneratedLyrics(lyricsText);

        const result = await createRecord({
          form_data: values,
          ai_result: {
            lyrics: lyricsText,
            model: 'deepseek-chat',
            closeness: values.closeness,
          },
          created_at: new Date(),
        });

        if (result.success && result.data?.id) {
          messageApi.success('歌词生成成功！');
        } else {
          messageApi.error('歌词生成成功，但保存失败');
        }
      } else {
        messageApi.error(response.error || '歌词生成失败');
      }
    } catch (error) {
      console.error('歌词生成失败：', error);
      messageApi.error('歌词生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <PageContainer title="大师写歌词">
        <Spin spinning={loading} fullscreen size="large" />
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <ProCard title="创作配置" style={{ height: '100%' }}>
              <ProForm<LyricsFormData>
                layout="vertical"
                grid
                onFinish={handleSubmit}
                submitter={{
                  render: () => (
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      block
                    >
                      生成歌词
                    </Button>
                  ),
                }}
                initialValues={{
                  song_language: 'mandarin',
                  song_style: 'lyrical_pop',
                  song_structure: 'standard_pop',
                  creation_mode: 'new',
                  persona: 'unlimited',
                  allow_english: false,
                  closeness: 3,
                  rhyme_type: 'mix',
                  rhyme_strict: true,
                  output_count: 1,
                }}
              >
                <ProFormText
                  name="song_name"
                  label="歌曲名称"
                  placeholder="请输入歌曲名称"
                  rules={[
                    { required: true, message: '请输入歌曲名称' },
                    { max: 50, message: '歌曲名称最多50个字' },
                  ]}
                  colProps={{ span: 24 }}
                />
                <ProFormSelect
                  name="song_language"
                  label="歌曲语言"
                  placeholder="请选择歌曲语言"
                  options={SONG_LANGUAGE_OPTIONS}
                  rules={[{ required: true, message: '请选择歌曲语言' }]}
                  colProps={{ span: 12 }}
                />
                <ProFormSwitch
                  name="allow_english"
                  label="允许英语单词"
                  tooltip="想用一杯Latte把你灌醉？关闭时，歌词中禁止出现散装英语"
                  colProps={{ span: 6 }}
                />
                <ProFormRadio.Group
                  name="output_count"
                  label="输出方案数量"
                  options={OUTPUT_COUNT_OPTIONS.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                  rules={[{ required: true, message: '请选择输出方案数量' }]}
                  colProps={{ span: 6 }}
                />
                <ProFormSelect
                  name="master_id"
                  label="大师风格"
                  placeholder="请选择大师风格"
                  options={MASTER_STYLE_CARDS.map((master) => ({
                    label: master.name,
                    value: master.id,
                  }))}
                  rules={[{ required: true, message: '请选择大师风格' }]}
                  colProps={{ span: 12 }}
                />
                <ProFormSelect
                  name="wording_style"
                  label="措辞要求（可选，最多选2项）"
                  options={WORDING_STYLE_OPTIONS}
                  mode="multiple"
                  rules={[
                    {
                      validator: async (_rule, value) => {
                        if (value && value.length > 2) {
                          throw new Error('措辞要求最多选择2项');
                        }
                      },
                    },
                  ]}
                  colProps={{ span: 12 }}
                />
                <ProFormSlider
                  name="closeness"
                  label="贴近度"
                  rules={[{ required: true, message: '请选择贴近度' }]}
                  colProps={{ span: 24 }}
                  min={1}
                  max={5}
                  marks={CLOSENESS_LEVEL_OPTIONS.reduce(
                    (acc, opt) => {
                      acc[opt.value as number] = opt.label;
                      return acc;
                    },
                    {} as Record<number, React.ReactNode>,
                  )}
                  step={1}
                  fieldProps={{
                    tooltip: {
                      formatter: (value: number | undefined) => {
                        if (value === undefined) return '';
                        const option = CLOSENESS_LEVEL_OPTIONS.find(
                          (opt) => opt.value === value,
                        );
                        if (!option) return String(value);
                        return option.tooltip_example
                          ? `${option.description}。${option.tooltip_example}`
                          : option.description;
                      },
                    },
                    style: { margin: '0 32px' },
                  }}
                />
                <ProFormSelect
                  name="creation_mode"
                  label="创作模式"
                  placeholder="请选择创作模式"
                  options={CREATION_MODE_OPTIONS}
                  rules={[{ required: true, message: '请选择创作模式' }]}
                  colProps={{ span: 12 }}
                />
                <ProFormSelect
                  name="song_style"
                  label="歌曲风格"
                  placeholder="请选择歌曲风格"
                  options={SONG_STYLE_OPTIONS}
                  rules={[{ required: true, message: '请选择歌曲风格' }]}
                  colProps={{ span: 12 }}
                />

                <ProFormSelect
                  name="song_structure"
                  label="曲式结构"
                  placeholder="请选择曲式结构"
                  options={SONG_STRUCTURE_OPTIONS}
                  rules={[{ required: true, message: '请选择曲式结构' }]}
                  colProps={{ span: 12 }}
                />
                <ProFormSelect
                  name="persona"
                  label="叙事人设"
                  placeholder="请选择叙事人设"
                  options={PERSONA_OPTIONS}
                  rules={[{ required: true, message: '请选择叙事人设' }]}
                  colProps={{ span: 12 }}
                />
                <ProFormTextArea
                  name="raw_material"
                  label="原始素材"
                  placeholder="请输入原始素材（主题、大意、歌词片段等），每一行视为一个参考素材"
                  rules={[
                    { required: true, message: '请输入原始素材' },
                    { max: 1000, message: '原始素材最多1000字' },
                  ]}
                  fieldProps={{
                    rows: 6,
                    showCount: true,
                    maxLength: 1000,
                  }}
                  colProps={{ span: 12 }}
                />
                <ProFormTextArea
                  name="reference_lyrics"
                  label="参考歌曲和歌词（可选）"
                  placeholder="请输入参考歌曲名称和歌词全文，仅作为技法参考，不要求结构对齐"
                  rules={[{ max: 1000, message: '参考歌曲和歌词最多1000字' }]}
                  fieldProps={{
                    rows: 6,
                    showCount: true,
                    maxLength: 1000,
                  }}
                  colProps={{ span: 12 }}
                />
                <ProFormTextArea
                  name="requirements"
                  label="创作要求（可选）"
                  placeholder="请输入创作要求（情绪走向、禁止出现的内容等）"
                  rules={[{ max: 1000, message: '创作要求最多1000字' }]}
                  fieldProps={{
                    rows: 4,
                    showCount: true,
                    maxLength: 1000,
                  }}
                  colProps={{ span: 24 }}
                />
                <ProFormSelect
                  name="rhyme_type"
                  label="押韵类型"
                  placeholder="请选择押韵类型"
                  options={RHYME_TYPE_OPTIONS}
                  rules={[{ required: true, message: '请选择押韵类型' }]}
                  colProps={{ span: 9 }}
                />
                <ProFormText
                  name="rhyme_tone"
                  label="韵脚（可选）"
                  placeholder="请输入韵脚，留空则系统推荐"
                  colProps={{ span: 9 }}
                />
                <ProFormSwitch
                  name="rhyme_strict"
                  label="严格押韵"
                  tooltip="开启时，必须严格执行韵脚，不得出现近音字代替"
                  colProps={{ span: 6 }}
                />
              </ProForm>
            </ProCard>
          </Col>

          <Col span={12}>
            <ProCard
              title="生成的歌词"
              extra={
                generatedLyrics && (
                  <Button
                    size="small"
                    onClick={() => copyToClipboard(generatedLyrics, '歌词')}
                  >
                    复制歌词
                  </Button>
                )
              }
              style={{ height: '100%' }}
            >
              {!generatedLyrics ? (
                <Empty
                  description="请填写左侧表单并点击生成按钮"
                  style={{ marginTop: 80 }}
                />
              ) : (
                <XMarkdown className={markdownThemeClass}>
                  {generatedLyrics}
                </XMarkdown>
              )}
            </ProCard>
          </Col>
        </Row>
      </PageContainer>
    </>
  );
};

export default LyricsCraftPage;
