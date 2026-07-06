/**
 * 音乐理解 — 深度学习音频分析
 *
 * 两阶段交互：
 * 1. 上传音频 → 特征提取（所有模型共用）
 * 2. 选择模型维度 → 逐个分析 → 展示结果
 */
import {
  PlayCircleOutlined,
  ReloadOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Alert, Button, message, Space, Typography } from 'antd';
import React, { useCallback, useRef } from 'react';
import { useMusicInsight } from '@/hooks/useMusicInsight';
import type { ModelRawOutput } from '@/shared/types/types';
import AnalysisProgress from './components/AnalysisProgress';
import GroupResultCard from './components/GroupResultCard';
import StructuredResultCard from './components/StructuredResultCard';

const { Text } = Typography;

// ==================== 常量 ====================

const SUPPORTED_EXTENSIONS = ['.mp3', '.wav', '.flac', '.ogg', '.aac', '.m4a'];
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/** 独立模型按钮 */
const SOLO_MODELS = [
  { key: 'genre', label: '风格分析·通用' },
  { key: 'genre_tzanetakis', label: '风格分析·GTZAN数据集' },
  { key: 'genre_electronic', label: '风格分析·电子乐细分' },
  { key: 'urbansound8k', label: '场景分析' },
] as const;

/** 情绪分组（4 个模型串行分析，结果合并展示） */
const MOOD_MODELS = [
  'mood_happy',
  'mood_sad',
  'mood_relaxed',
  'mood_aggressive',
] as const;

/** 能量分组（4 个模型串行分析，结果合并展示） */
const ENERGY_MODELS = [
  'mood_acoustic',
  'mood_electronic',
  'mood_party',
  'danceability',
] as const;

/** 二分类子维度标签 */
const BINARY_LABELS: Record<string, string> = {
  mood_happy: '欢快',
  mood_sad: '悲伤',
  mood_relaxed: '放松',
  mood_aggressive: '激烈',
  mood_acoustic: '原声',
  mood_electronic: '电子',
  mood_party: '派对',
  danceability: '可舞性',
};

// ==================== 子组件 ====================

/** 上传卡片 */
const UploadCard: React.FC<{ onFileSelect: (file: File) => void }> = ({
  onFileSelect,
}) => {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((file: File): boolean => {
    const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      message.error(`不支持的格式：${ext}。支持 MP3、WAV、FLAC、OGG、AAC`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      message.error(
        `文件过大（${(file.size / (1024 * 1024)).toFixed(0)}MB），请选择 50MB 以内的文件`,
      );
      return false;
    }
    return true;
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && validate(file)) onFileSelect(file);
    },
    [onFileSelect, validate],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && validate(file)) onFileSelect(file);
      if (inputRef.current) inputRef.current.value = '';
    },
    [onFileSelect, validate],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px ${dragging ? 'solid' : 'dashed'} ${dragging ? '#FF9000' : '#D9D9D9'}`,
        borderRadius: 12,
        padding: '56px 24px',
        textAlign: 'center' as const,
        cursor: 'pointer',
        background: dragging ? 'rgba(255,144,0,0.04)' : '#FAFAFA',
        transition: 'all 0.2s',
      }}
    >
      <SoundOutlined
        style={{ fontSize: 40, color: '#FF9000', marginBottom: 16 }}
      />
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
        点击或拖拽音频文件到此处
      </div>
      <Text type="secondary">
        支持 MP3、WAV、FLAC、OGG、AAC 格式，单个文件不超过 50MB
      </Text>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
};

// ==================== 主页面 ====================

/** 模型按钮 */
const ModelBtn: React.FC<{
  model: string;
  label: string;
  done: boolean;
  busy: boolean;
  onClick: () => void;
}> = ({ model, label, done, busy, onClick }) => (
  <Button
    key={model}
    size="small"
    type={done ? 'default' : 'primary'}
    ghost={!done}
    icon={
      done ? <span style={{ color: 'green' }}>✓</span> : <PlayCircleOutlined />
    }
    loading={busy}
    onClick={onClick}
    style={{
      borderRadius: 8,
      borderColor: done ? 'green' : undefined,
      color: done ? 'green' : undefined,
    }}
  >
    {label}
  </Button>
);

/** 分组按钮 */
const GroupBtn: React.FC<{
  label: string;
  groupModels: readonly string[];
  results: Record<string, ModelRawOutput>;
  busyKey: string | null;
  onClick: () => void;
}> = ({ label, groupModels, results, busyKey, onClick }) => {
  const doneCount = groupModels.filter((m) => !!results[m]?.raw).length;
  const allDone = doneCount === groupModels.length;
  const someBusy = groupModels.some((m) => busyKey === m);
  return (
    <Button
      size="small"
      type={allDone ? 'default' : 'primary'}
      ghost={!allDone}
      icon={
        allDone ? (
          <span style={{ color: 'green' }}>✓</span>
        ) : (
          <PlayCircleOutlined />
        )
      }
      loading={someBusy}
      onClick={onClick}
      style={{
        borderRadius: 8,
        borderColor: allDone ? 'green' : undefined,
        color: allDone ? 'green' : undefined,
      }}
    >
      {label} ({doneCount}/{groupModels.length})
    </Button>
  );
};

const MusicInsightPage: React.FC = () => {
  const {
    status,
    models,
    results,
    fileName,
    duration,
    error,
    analyzing,
    handleFileSelect,
    handleAnalyzeModel,
    handleAnalyzeGroup,
    handleReset,
  } = useMusicInsight();

  const isIdle = status === 'IDLE';
  const isDecoding = status === 'DECODING';
  const isExtracting = status === 'EXTRACTING';
  const isProcessing = isDecoding || isExtracting;
  const isError = status === 'ERROR';
  const showButtons = status === 'READY' || status === 'ANALYZING';

  const doneCount = Object.values(results).filter((r) => r.raw).length;

  // ==================== 渲染 ====================

  return (
    <PageContainer
      header={{
        title: '音乐理解',
        subTitle: '上传歌曲，查看深度学习模型的音频分析结果',
        ghost: true,
      }}
    >
      <ProCard>
        {/* ========== 状态 A: IDLE — 未上传 ========== */}
        {isIdle && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <UploadCard onFileSelect={handleFileSelect} />
          </div>
        )}

        {/* ========== 状态 B: 处理中 ========== */}
        {isProcessing && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <AnalysisProgress
              status={isDecoding ? '解码音频' : '提取特征'}
              fileName={fileName || undefined}
              percent={isExtracting ? 50 : 20}
            />
          </div>
        )}

        {/* ========== 状态 C: 就绪 / 分析中 ========== */}
        {showButtons && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 文件信息 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Text style={{ fontSize: 15, fontWeight: 600 }}>{fileName}</Text>
              <Text type="secondary">{duration.toFixed(1)}s</Text>
              <Text type="secondary">
                {doneCount}/{models.length} 已分析
              </Text>
              <Button
                type="text"
                size="small"
                icon={<ReloadOutlined />}
                onClick={handleReset}
                style={{
                  marginLeft: 'auto',
                  borderRadius: 8,
                  color: '#6B7280',
                }}
              >
                重新上传
              </Button>
            </div>

            {/* 按钮区 */}
            <ProCard size="small" title="选择分析维度" bordered>
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                {/* 独立模型 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SOLO_MODELS.map((m) => (
                    <ModelBtn
                      key={m.key}
                      model={m.key}
                      label={m.label}
                      done={!!results[m.key]?.raw}
                      busy={analyzing === m.key}
                      onClick={() => handleAnalyzeModel(m.key)}
                    />
                  ))}
                </div>
                {/* 分组 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <GroupBtn
                    label="情绪分析"
                    groupModels={MOOD_MODELS}
                    results={results}
                    busyKey={analyzing}
                    onClick={() => handleAnalyzeGroup([...MOOD_MODELS])}
                  />
                  <GroupBtn
                    label="能量分析"
                    groupModels={ENERGY_MODELS}
                    results={results}
                    busyKey={analyzing}
                    onClick={() => handleAnalyzeGroup([...ENERGY_MODELS])}
                  />
                </div>
              </Space>
            </ProCard>

            {/* 结果区 */}
            {doneCount > 0 && (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                {/* 独立模型结果 */}
                {SOLO_MODELS.filter((m) => results[m.key]?.raw).map((m) => (
                  <StructuredResultCard
                    key={m.key}
                    modelName={m.key}
                    title={m.label}
                    data={results[m.key]}
                  />
                ))}

                {/* 情绪分组 */}
                {MOOD_MODELS.some((m) => results[m]?.raw) && (
                  <GroupResultCard
                    title="情绪分析"
                    items={MOOD_MODELS.map((m) => ({
                      label: BINARY_LABELS[m],
                      data: results[m],
                    }))}
                  />
                )}

                {/* 能量分组 */}
                {ENERGY_MODELS.some((m) => results[m]?.raw) && (
                  <GroupResultCard
                    title="能量分析"
                    items={ENERGY_MODELS.map((m) => ({
                      label: BINARY_LABELS[m],
                      data: results[m],
                    }))}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* ========== 错误状态 ========== */}
        {isError && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <Alert
              type="error"
              message="分析失败"
              description={error}
              showIcon
              style={{ borderRadius: 12 }}
              action={
                <Button
                  size="small"
                  onClick={handleReset}
                  style={{ borderRadius: 8 }}
                >
                  重新上传
                </Button>
              }
            />
          </div>
        )}
      </ProCard>
    </PageContainer>
  );
};

export default MusicInsightPage;
