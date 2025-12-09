import { CopyOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
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
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import type { PromptRecord } from '@/services/db';
import { db } from '@/services/db';
import { callDeepSeekAPI, type GenerateRequest } from '@/services/deepseek';
import { mockGenerate } from '@/services/mockData';

const SunoCover: React.FC = () => {
  // 表单实例
  const [form] = Form.useForm<GenerateRequest>();

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [stylesResult, setStylesResult] = useState('');
  const [lyricsResult, setLyricsResult] = useState('');

  // 从localStorage加载记录数据
  useEffect(() => {
    // 加载记录数据
    const selectedRecord = localStorage.getItem('selectedPromptRecord');
    if (selectedRecord) {
      try {
        const record: PromptRecord = JSON.parse(selectedRecord);

        // 填充表单数据
        form.setFieldsValue({
          song_language: record.userInput.songLanguage,
          target_artist: record.userInput.targetSinger,
          reference_songs: record.userInput.referenceSongs.map((song) => {
            const [title, artist] = song.split(' - ');
            return {
              title: title.trim(),
              artist: artist?.trim() || '',
            };
          }),
          style_note: record.userInput.styleDescription,
          extra_note: record.userInput.scene,
          lyrics_raw: record.userInput.lyrics,
        });

        // 填充结果数据
        setStylesResult(record.deepSeekResult.styles);
        setLyricsResult(record.deepSeekResult.lyrics);

        // 清空localStorage中的记录数据
        localStorage.removeItem('selectedPromptRecord');
      } catch (error) {
        console.error('数据解析失败：', error);
      }
    }
  }, [form]);

  // 表单提交处理
  const handleSubmit = async (values: GenerateRequest) => {
    // 从localStorage获取API Key
    const apiKey = localStorage.getItem('deepseekApiKey') || '';
    if (!apiKey) {
      Modal.confirm({
        title: '尚未设置 DeepSeek API Key',
        content: '设置完成后即可使用该功能，是否现在去设置？',
        okText: '去设置',
        cancelText: '取消',
        onOk() {
          history.push('/ai-setting');
        },
        onCancel() {
          // 取消操作，不做任何处理
        },
      });
      return;
    }

    // 调用API
    setLoading(true);
    try {
      // 将API Key添加到values中
      const result = await callDeepSeekAPI({ ...values, apiKey });
      setStylesResult(result.styles);
      setLyricsResult(result.lyrics);
      message.success('提示词已成功生成生成成功！');

      // 保存记录到数据库
      try {
        // 模拟当前用户ID，实际应用中应该从登录状态获取
        const userId = 1;

        // 转换参考歌曲为字符串数组
        const referenceSongs = values.reference_songs
          .filter((song) => song.title)
          .map(
            (song) => `${song.title}${song.artist ? ` - ${song.artist}` : ''}`,
          );

        await db.createPromptRecord({
          userId,
          userInput: {
            songLanguage: values.song_language,
            targetSinger: values.target_artist,
            referenceSongs,
            styleDescription: values.style_note || '',
            lyrics: values.lyrics_raw,
            scene: values.extra_note || '',
          },
          deepSeekResult: {
            styles: result.styles,
            lyrics: result.lyrics,
          },
        });
        console.log('记录已成功保存');
      } catch (dbError) {
        console.error('记录保存失败：', dbError);
        // 数据库保存失败不影响用户体验，仅记录日志
      }
    } catch (error) {
      // 捕获并显示具体的错误信息
      console.error('DeepSeek API 调用失败：', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '调用 DeepSeek API 失败，请检查 API Key 或稍后再试。';
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
        message.success(`${type}已成功复制到剪贴板`);
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
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
      message.success('模拟生成已完成');

      // 保存记录到数据库
      try {
        // 模拟当前用户ID，实际应用中应该从登录状态获取
        const userId = 1;

        // 从表单获取数据，使用getFieldsValue而不是validateFields，避免必填字段验证失败
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
          userId,
          userInput: {
            songLanguage,
            targetSinger,
            referenceSongs,
            styleDescription: formValues.style_note || '',
            lyrics,
            scene: formValues.extra_note || '',
          },
          deepSeekResult: {
            styles: result.styles,
            lyrics: result.lyrics,
          },
        });
        console.log('模拟记录已保存到数据库');
        message.success('记录已成功保存');
      } catch (dbError) {
        console.error('保存模拟记录到数据库失败:', dbError);
        message.error('记录保存失败，请查看控制台日志');
      }
    } catch (error) {
      console.error('模拟生成失败:', error);
      message.error('模拟生成失败，请稍后再试');
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
      <Spin spinning={loading} fullscreen tip="正在生成，请稍候" size="large" />
      <Row gutter={[24, 0]}>
        {/* 左侧输入表单 */}
        <Col span={8}>
          <ProCard
            title="翻唱配置"
            actions={[
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
            <ProForm
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                song_language: 'Mandarin',
                reference_songs: [{ title: '', artist: '' }],
              }}
              submitter={false}
            >
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
                rules={[{ required: true, message: '请填写模仿的艺术家姓名' }]}
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
                {(meta, _index, _action, _count) => (
                  <Row
                    key={meta.key}
                    align="middle"
                    gutter={16}
                    style={{ width: '100%' }}
                  >
                    <Col span={12}>
                      <ProFormText
                        {...meta}
                        name={[meta.name, 'title']}
                        placeholder="歌曲名"
                        rules={[
                          { required: true, message: '歌曲名称不能为空' },
                        ]}
                        style={{ marginBottom: 0 }}
                        fieldProps={{ style: { width: '100%' } }}
                      />
                    </Col>
                    <Col span={12}>
                      <ProFormText
                        {...meta}
                        name={[meta.name, 'artist']}
                        placeholder="演唱者（可选）"
                        style={{ marginBottom: 0 }}
                        fieldProps={{ style: { width: '100%' } }}
                      />
                    </Col>
                  </Row>
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
                  autoSize: { minRows: 8, maxRows: 12 },
                }}
              />
            </ProForm>
          </ProCard>
        </Col>

        {/* 中间Styles输出 */}
        <Col span={8}>
          <ProCard
            title="Styles 提示词（可直接复制用于 Suno）"
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
            <ProFormTextArea
              value={stylesResult}
              readOnly
              placeholder="生成的 Styles 提示词将展示在此处…"
              fieldProps={{ showCount: true, rows: 40 }}
            />
          </ProCard>
        </Col>

        {/* 右侧Lyrics输出 */}
        <Col span={8}>
          <ProCard
            title="Lyrics 提示词（可直接复制用于 Suno）"
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
            <ProFormTextArea
              value={lyricsResult}
              readOnly
              placeholder="生成的 Lyrics 提示词将展示在此处…"
              fieldProps={{ showCount: true, rows: 40 }}
            />
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default SunoCover;
