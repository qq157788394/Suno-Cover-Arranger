/**
 * 参考音频预处理页面
 * 上传音频 → 选择预设 → 频谱指纹混淆 → (可选) 变速 → MP3 编码 → 下载
 * 使用 ProForm 实现表单布局，对齐 lyrics-craft 页面风格
 */

import { DownloadOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProDescriptions,
  ProForm,
  type ProFormInstance,
  ProFormRadio,
} from '@ant-design/pro-components';
import { Button, Col, Empty, message, Row, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { runCoverPreprocessPipeline } from '@/services/audio';
import type {
  PipelineOutput,
  PipelineProgress,
  PresetLevel,
  SpeedMode,
} from '@/shared/types/types';
import AudioPreview from './components/AudioPreview';
import AudioUploader from './components/AudioUploader';
import ProcessProgress from './components/ProcessProgress';

/** 表单数据类型定义 */
interface CoverPreprocessFormData {
  /** 音频文件（非标准表单字段，通过 ProForm.Item 自定义渲染） */
  audioFile: File | null;
  /** 预设强度 */
  preset: PresetLevel;
  /** 变速模式 */
  speedMode: SpeedMode;
}

/** 预设选项配置 */
const PRESET_OPTIONS: {
  value: PresetLevel;
  label: string;
}[] = [
  { value: 'none', label: '不处理' },
  { value: 'light', label: '轻度' },
  { value: 'medium', label: '中度' },
  { value: 'heavy', label: '重度（推荐）' },
];

/** 变速模式选项配置 */
const SPEED_MODE_OPTIONS: { value: SpeedMode; label: string }[] = [
  { value: 'none', label: '不变速' },
  { value: 'slowdown', label: '0.5 倍' },
  { value: 'speedup', label: '2 倍' },
];

/** 默认表单值 */
const DEFAULT_FORM_VALUES: Partial<CoverPreprocessFormData> = {
  preset: 'heavy',
  speedMode: 'none',
};

/** 格式化毫秒为可读时长 */
function formatProcessingTime(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

/** 格式化秒数为 mm:ss 格式 */
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** 下载 Blob 为文件 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const CoverPreprocess: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const formRef = useRef<ProFormInstance<CoverPreprocessFormData>>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<PipelineProgress | null>(null);
  const [result, setResult] = useState<PipelineOutput | null>(null);

  /**
   * 处理表单提交：执行参考音频预处理流水线
   * @param values - 表单提交的值
   * @returns 是否成功完成处理
   */
  const handleSubmit = async (
    values: CoverPreprocessFormData,
  ): Promise<boolean> => {
    if (!values.audioFile) {
      messageApi.warning('请先上传音频文件');
      return false;
    }

    setProcessing(true);
    setProgress(null);
    setResult(null);

    try {
      const output = await runCoverPreprocessPipeline({
        audioFile: values.audioFile,
        preset: values.preset,
        speedMode: values.speedMode,
        onProgress: setProgress,
      });
      setResult(output);
      setProgress(null);
      messageApi.success('预处理完成！');
      return true;
    } catch (error) {
      messageApi.error(`预处理失败：${(error as Error).message}`);
      return false;
    } finally {
      setProcessing(false);
    }
  };

  /** 下载处理结果 */
  const handleDownload = () => {
    if (!result) return;

    // 从表单获取文件名和参数信息
    const formValues = formRef.current?.getFieldsValue();
    const originalName = formValues?.audioFile?.name
      ? formValues.audioFile.name.replace(/\.[^.]+$/, '')
      : 'output';
    const speedLabel =
      formValues?.speedMode === 'slowdown'
        ? '_0.5x'
        : formValues?.speedMode === 'speedup'
          ? '_2x'
          : '';
    const filename = `${originalName}_${formValues?.preset || 'medium'}${speedLabel}.mp3`;
    downloadBlob(result.mp3Blob, filename);
  };

  return (
    <>
      {contextHolder}
      <PageContainer>
        <Row gutter={[24, 0]}>
          {/* 左侧：表单配置区域 */}
          <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
            <ProCard title="预处理配置" style={{ height: '100%' }}>
              <ProForm<CoverPreprocessFormData>
                layout="vertical"
                grid
                onFinish={handleSubmit}
                formRef={formRef}
                initialValues={DEFAULT_FORM_VALUES}
                submitter={{
                  render: () => (
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={processing}
                      size="large"
                      block
                    >
                      开始预处理
                    </Button>
                  ),
                }}
              >
                {/* 音频上传（自定义 ProForm.Item 渲染） */}
                <ProForm.Item
                  name="audioFile"
                  label="原始音频"
                  rules={[{ required: true, message: '请上传原始音频文件' }]}
                  colProps={{ span: 24 }}
                  style={{ width: '100%' }}
                >
                  <AudioUploader disabled={processing} />
                </ProForm.Item>

                {/* 预设强度选择 */}
                <ProFormRadio.Group
                  name="preset"
                  label="预设强度"
                  options={PRESET_OPTIONS.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                  rules={[{ required: true, message: '请选择预设强度' }]}
                  fieldProps={{
                    disabled: processing,
                  }}
                  colProps={{ span: 24 }}
                />

                {/* 变速模式选择 */}
                <ProFormRadio.Group
                  name="speedMode"
                  label="变速模式"
                  options={SPEED_MODE_OPTIONS.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                  fieldProps={{
                    disabled: processing,
                  }}
                  colProps={{ span: 24 }}
                />
              </ProForm>
            </ProCard>
          </Col>

          {/* 右侧：处理结果展示 */}
          <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
            <ProCard title="处理结果" style={{ height: '100%' }}>
              {processing && progress ? (
                /* 处理中：展示仪表盘式进度条 */
                <ProcessProgress progress={progress} />
              ) : !result ? (
                /* 未处理：空状态 */
                <Empty
                  description="上传音频并点击「开始预处理」后，结果将在此显示"
                  style={{ marginTop: 80 }}
                />
              ) : (
                /* 处理完成：展示结果 */
                <>
                  <ProDescriptions column={1} size="small" bordered>
                    <ProDescriptions.Item label="原始时长">
                      {formatDuration(result.originalDuration)}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="处理后时长">
                      {formatDuration(result.processedDuration)}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="处理耗时">
                      {formatProcessingTime(result.processingTimeMs)}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="预设强度">
                      {result.preset === 'light'
                        ? '轻度'
                        : result.preset === 'medium'
                          ? '中度'
                          : '重度'}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="输出大小">
                      <Tag>
                        {(result.mp3Blob.size / (1024 * 1024)).toFixed(2)} MB
                      </Tag>
                    </ProDescriptions.Item>
                  </ProDescriptions>

                  <AudioPreview blob={result.mp3Blob} />

                  <Button
                    type="primary"
                    size="large"
                    icon={<DownloadOutlined />}
                    onClick={handleDownload}
                  >
                    下载 MP3
                  </Button>
                </>
              )}
            </ProCard>
          </Col>
        </Row>
      </PageContainer>
    </>
  );
};

export default CoverPreprocess;
