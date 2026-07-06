/**
 * 大师看和弦 — 页面主入口
 *
 * 布局：单列全宽垂直布局（Bento Attio Flat Modern 风格）
 * - 状态A (IDLE)：大卡片上传区域
 * - 状态B (LOADING)：分析进度
 * - 状态C (READY)：文件信息栏 → 播放控制栏 → 波形可视化 → 进度条 → 和弦网格
 */

import {
  CaretRightOutlined,
  PauseOutlined,
  ReloadOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Alert, Button, message, Segmented, Slider, Space } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import { useChordAnalysis } from '@/hooks/useChordAnalysis';
import AnalysisProgress from './components/AnalysisProgress';
import ChordGrid from './components/ChordGrid';
import FileDropZone from './components/FileDropZone';
import FileInfoBar from './components/FileInfoBar';
import WaveformCanvas from './components/WaveformCanvas';

/** 支持的音频格式 */
const SUPPORTED_EXTENSIONS = ['.mp3', '.wav', '.flac', '.ogg', '.aac', '.m4a'];
const SUPPORTED_AUDIO_MIME_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/flac',
  'audio/ogg',
  'audio/aac',
  'audio/x-m4a',
  'audio/mp4',
];
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/** 格式化时间 mm:ss */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const ChordAnalysisPage: React.FC = () => {
  const {
    analysisStatus,
    playbackState,
    currentTime,
    songAnalysis,
    error,
    retryable,
    currentStep,
    progressPercent,
    fileName,
    isLoading,
    handleFileSelect,
    handlePlay,
    handlePause,
    handleStop,
    handleSeek,
    handleRetry,
    audioRef,
    audioUrl,
    peaks,
  } = useChordAnalysis();

  // 展示模式：和弦名称 or 功能级数
  const [displayMode, setDisplayMode] = useState<'chord' | 'degree'>('chord');

  // 隐藏文件选择器用于重新上传
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isReady = analysisStatus === 'READY';
  const isError = analysisStatus === 'ERROR';
  const isIdle = analysisStatus === 'IDLE';
  const isPlaying = playbackState === 'PLAYING';

  /** 触发重新上传 — 直接弹出文件选择框覆盖 */
  const handleReupload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /** 处理重新上传的文件选择 */
  const handleReuploadFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // 文件大小校验
      if (file.size > MAX_FILE_SIZE) {
        message.error(
          `文件过大（${(file.size / (1024 * 1024)).toFixed(0)}MB），请选择 50MB 以内的文件`,
        );
        e.target.value = '';
        return;
      }

      // 文件格式校验
      const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const isSupportedExt = SUPPORTED_EXTENSIONS.includes(ext);
      const isSupportedMime = SUPPORTED_AUDIO_MIME_TYPES.includes(file.type);
      if (!isSupportedExt && !isSupportedMime) {
        message.error('不支持的文件格式。支持：MP3、WAV、FLAC、OGG、AAC');
        e.target.value = '';
        return;
      }

      handleFileSelect(file);
      e.target.value = ''; // 清空 input 以允许重复选择同一文件
    },
    [handleFileSelect],
  );

  return (
    <PageContainer
      header={{
        title: '大师看和弦',
        subTitle: '分析音频文件，自动识别调弦、BPM 与和弦进行',
        ghost: true,
      }}
    >
      <ProCard>
        {/* 隐藏文件选择器（用于重新上传） */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          style={{ display: 'none' }}
          onChange={handleReuploadFileChange}
        />

        {/* ========== 状态A: IDLE — 未上传 ========== */}
        {isIdle && !isError && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            {/* 上传区域 */}
            <FileDropZone disabled={false} onFileSelect={handleFileSelect} />
          </div>
        )}

        {/* ========== 状态B: 分析中 ========== */}
        {isLoading && !isError && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <AnalysisProgress
              status={analysisStatus}
              currentStep={currentStep}
              percent={progressPercent}
              fileName={fileName || undefined}
            />
          </div>
        )}

        {/* ========== 状态C: READY — 分析完成 ========== */}
        {isReady && songAnalysis && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 1. 文件信息栏 */}
            <FileInfoBar
              fileName={songAnalysis.fileName}
              duration={songAnalysis.duration}
              fileSize={songAnalysis.fileSize}
              key={songAnalysis.key}
              keyConfidence={songAnalysis.keyConfidence}
              bpm={songAnalysis.bpm}
              bpmConfidence={songAnalysis.bpmConfidence}
            />

            {/* 2. 播放控制栏 + 停止按钮 + 时间 */}
            <Space size={12}>
              {isPlaying ? (
                <Button
                  type="default"
                  icon={<PauseOutlined />}
                  onClick={handlePause}
                  style={{ borderRadius: 8 }}
                >
                  暂停
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<CaretRightOutlined />}
                  onClick={handlePlay}
                  style={{
                    borderRadius: 8,
                    background: '#FF9000',
                    borderColor: '#FF9000',
                  }}
                >
                  播放
                </Button>
              )}
              <Button
                icon={<StopOutlined />}
                onClick={handleStop}
                disabled={playbackState === 'STOPPED'}
                style={{ borderRadius: 8 }}
              >
                停止
              </Button>
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={handleReupload}
                style={{ borderRadius: 8, color: '#6B7280' }}
              >
                重新上传
              </Button>
            </Space>

            {/* 3. 波形可视化（保留 Canvas） */}
            <div
              style={{
                border: '1px solid #F0F0F0',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <WaveformCanvas
                peaks={peaks}
                duration={songAnalysis.duration}
                chordSegments={songAnalysis.chordSegments}
                bpm={songAnalysis.bpm}
                beats={songAnalysis.beatList}
                currentTime={currentTime}
                isPlaying={isPlaying}
                onSeek={handleSeek}
              />
            </div>

            {/* 4. 播放进度条 */}
            <div style={{ padding: '0 4px' }}>
              <Slider
                min={0}
                max={songAnalysis.duration}
                value={currentTime}
                step={0.1}
                onChange={handleSeek}
                tooltip={{ formatter: (val) => formatTime(val || 0) }}
                styles={{
                  track: { background: '#FF9000' },
                  rail: { background: '#F3F4F6' },
                }}
              />
            </div>

            {/* 5. 和弦网格 */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #F3F4F6',
                padding: '20px 16px',
                overflowX: 'auto',
              }}
            >
              {/* 展示模式切换 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: 16,
                }}
              >
                <Segmented
                  options={[
                    { label: '和弦名称', value: 'chord' },
                    { label: '功能级数', value: 'degree' },
                  ]}
                  value={displayMode}
                  onChange={(v) => setDisplayMode(v as 'chord' | 'degree')}
                />
              </div>
              <ChordGrid
                beatChords={songAnalysis.beatChords || []}
                bpm={songAnalysis.bpm}
                currentTime={currentTime}
                displayMode={displayMode}
              />
            </div>

            {/* 隐藏的 audio 元素 */}
            {/* biome-ignore lint/a11y/useMediaCaption: 用户上传的音频无需字幕 */}
            <audio
              ref={audioRef}
              src={audioUrl || undefined}
              preload="auto"
              aria-label="音频播放"
              style={{ display: 'none' }}
            />
          </div>
        )}

        {/* ========== 错误状态 ========== */}
        {isError && error && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <Alert
              type="error"
              message="分析错误"
              description={error}
              showIcon
              style={{ marginTop: 16, borderRadius: 12 }}
              action={
                retryable ? (
                  <Button
                    size="small"
                    onClick={handleRetry}
                    style={{ borderRadius: 8 }}
                  >
                    重试
                  </Button>
                ) : undefined
              }
            />
          </div>
        )}
      </ProCard>
    </PageContainer>
  );
};

export default ChordAnalysisPage;
