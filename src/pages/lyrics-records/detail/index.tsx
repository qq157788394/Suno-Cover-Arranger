/**
 * 歌词记录详情页面
 * 展示歌词生成记录的详细信息，包括表单数据和生成的歌词
 */

import {
  ArrowLeftOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProDescriptions,
} from '@ant-design/pro-components';
import { useNavigate, useParams } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  message,
  Popconfirm,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { MASTER_STYLE_CARDS } from '@/config/masterStyleConfig';
import { useLyricsRecords } from '@/hooks/useLyricsRecords';
import type { LyricsRecord } from '@/shared/types/types';

const { Paragraph, Text } = Typography;

const LyricsRecordDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getRecord, deleteRecord } = useLyricsRecords();
  const [loading, setLoading] = useState<boolean>(true);
  const [record, setRecord] = useState<LyricsRecord | null>(null);

  useEffect(() => {
    loadRecord();
  }, [id]);

  const loadRecord = async () => {
    if (!id) {
      message.error('记录ID不存在');
      navigate('/lyrics-records');
      return;
    }

    setLoading(true);
    try {
      const recordData = await getRecord(Number(id));
      if (recordData) {
        setRecord(recordData);
      } else {
        message.error('记录不存在');
        navigate('/lyrics-records');
      }
    } catch (_ror) {
      message.error('加载记录失败');
      navigate('/lyrics-records');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!record?.id) return;

    try {
      const result = await deleteRecord(record.id);
      if (result.success) {
        message.success('删除成功');
        navigate('/lyrics-records');
      } else {
        message.error('删除失败');
      }
    } catch (_error) {
      message.error('删除失败');
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('复制成功');
    } catch (_error) {
      message.error('复制失败');
    }
  };

  const getMasterInfo = (masterId: string | undefined) => {
    if (!masterId) {
      return undefined;
    }
    return MASTER_STYLE_CARDS.find((m) => m.id === masterId);
  };

  const renderLyrics = (lyrics: string) => {
    const sections = lyrics.split('\n\n---\n\n');
    return sections.map((section) => {
      const sectionKey = section.substring(0, 50).replace(/\s/g, '');
      return (
        <Card key={`section-${sectionKey}`} style={{ marginBottom: 16 }}>
          <Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            {section}
          </Paragraph>
        </Card>
      );
    });
  };

  if (loading) {
    return (
      <PageContainer title="歌词详情">
        <div style={{ textAlign: 'center', padding: '100px 0' }}>加载中...</div>
      </PageContainer>
    );
  }

  if (!record) {
    return (
      <PageContainer title="歌词详情">
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          记录不存在
        </div>
      </PageContainer>
    );
  }

  const masterInfo = getMasterInfo(record.form_data.master_id);
  const languageMap: Record<string, string> = {
    mandarin: '普通话',
    cantonese: '粤语',
    minnan: '闽南语',
  };
  const styleMap: Record<string, string> = {
    pop: '流行',
    rock: '摇滚',
    ballad: '民谣',
    rnb: 'R&B',
    folk: '古风',
    electronic: '电子',
  };

  return (
    <PageContainer
      title="歌词详情"
      extra={
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/lyrics-records')}
          >
            返回列表
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这条记录吗？"
            onConfirm={handleDelete}
            okText="确定"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />}>
              删除记录
            </Button>
          </Popconfirm>
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <ProCard title="基本信息" headerBordered>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <ProDescriptions column={1}>
                <ProDescriptions.Item label="歌曲名称">
                  {record.form_data.song_name}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="语言">
                  <Tag>
                    {languageMap[record.form_data.song_language] ||
                      record.form_data.song_language}
                  </Tag>
                </ProDescriptions.Item>
                <ProDescriptions.Item label="风格">
                  <Tag color="purple">
                    {styleMap[record.form_data.song_style] ||
                      record.form_data.song_style}
                  </Tag>
                </ProDescriptions.Item>
                <ProDescriptions.Item label="曲式结构">
                  {record.form_data.song_structure}
                </ProDescriptions.Item>
              </ProDescriptions>
            </Col>
            <Col xs={24} md={12}>
              <ProDescriptions column={1}>
                <ProDescriptions.Item label="风格大师">
                  {masterInfo ? (
                    <Space direction="vertical" size="small">
                      <Space>
                        <Tag color="blue">{masterInfo.name}</Tag>
                        <Text type="secondary">{masterInfo.description}</Text>
                      </Space>
                    </Space>
                  ) : (
                    <Tag>无</Tag>
                  )}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="贴近度">
                  <Tag
                    color={
                      record.form_data.closeness >= 80
                        ? 'red'
                        : record.form_data.closeness >= 60
                          ? 'orange'
                          : 'green'
                    }
                  >
                    {record.form_data.closeness}%
                  </Tag>
                </ProDescriptions.Item>
                <ProDescriptions.Item label="创作模式">
                  {record.form_data.creation_mode}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="生成时间">
                  {new Date(record.created_at).toLocaleString('zh-CN')}
                </ProDescriptions.Item>
              </ProDescriptions>
            </Col>
          </Row>
        </ProCard>

        <ProCard
          title="创作参数"
          headerBordered
          extra={
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() =>
                handleCopy(
                  `创作模式：${record.form_data.creation_mode}\n人设：${record.form_data.persona}\n措辞风格：${record.form_data.wording_style}\n押韵类型：${record.form_data.rhyme_type}`,
                )
              }
            >
              复制参数
            </Button>
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Text strong>创作模式：</Text>
              <Text>{record.form_data.creation_mode}</Text>
            </Col>
            <Col xs={24} md={8}>
              <Text strong>人设：</Text>
              <Text>{record.form_data.persona}</Text>
            </Col>
            <Col xs={24} md={8}>
              <Text strong>措辞风格：</Text>
              <Text>{record.form_data.wording_style}</Text>
            </Col>
            <Col xs={24} md={8}>
              <Text strong>押韵类型：</Text>
              <Text>{record.form_data.rhyme_type}</Text>
            </Col>
            <Col xs={24} md={8}>
              <Text strong>输出数量：</Text>
              <Text>{record.form_data.output_count}</Text>
            </Col>
          </Row>
        </ProCard>

        <ProCard
          title="原始素材"
          headerBordered
          extra={
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record.form_data.raw_material)}
            >
              复制素材
            </Button>
          }
        >
          <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
            {record.form_data.raw_material}
          </Paragraph>
        </ProCard>

        <ProCard
          title="生成的歌词"
          headerBordered
          extra={
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record.ai_result.lyrics)}
            >
              复制歌词
            </Button>
          }
        >
          {renderLyrics(record.ai_result.lyrics)}
        </ProCard>

        <ProCard title="AI信息" headerBordered>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Text strong>模型：</Text>
              <Text>{record.ai_result.model}</Text>
            </Col>
            <Col xs={24} md={12}>
              <Text strong>贴近度：</Text>
              <Text>{record.ai_result.closeness}%</Text>
            </Col>
          </Row>
        </ProCard>
      </Space>
    </PageContainer>
  );
};

export default LyricsRecordDetailPage;
