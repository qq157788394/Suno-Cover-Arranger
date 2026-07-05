/**
 * 大师看和弦 — 页面主入口
 *
 * 布局：PageContainer + Row(12/12) + ProCard 两栏
 * - 左栏：FileDropZone → KeyBpmDisplay → 播放控制 <audio>
 * - 右栏：ChordDisplay → WaveformCanvas → ChordSequence
 * 状态驱动：根据 analysisStatus 切换显示/隐藏组件
 */

import {
  CaretRightOutlined,
  PauseOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Alert, Button, Col, Row, Space, Typography } from 'antd';
import React from 'react';
import { useChordAnalysis } from '@/hooks/useChordAnalysis';
import AnalysisProgress from './components/AnalysisProgress';
import ChordDisplay from './components/ChordDisplay';
import ChordSequence from './components/ChordSequence';
import FileDropZone from './components/FileDropZone';
import KeyBpmDisplay from './components/KeyBpmDisplay';
import WaveformCanvas from './components/WaveformCanvas';

const ChordAnalysisPage: React.FC = () => {
  const {
    analysisStatus,
    playbackState,
    currentTime,
    currentChord,
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

  const isReady = analysisStatus === 'READY';
  const isError = analysisStatus === 'ERROR';
  const isIdle = analysisStatus === 'IDLE';
  const isPlaying = playbackState === 'PLAYING';

  return (
    <PageContainer
      header={{
        title: '大师看和弦',
        ghost: true,
      }}
    >
      <Row gutter={[24, 0]}>
        {/* 左栏：音频文件 */}
        <Col xs={24} lg={12}>
          <ProCard title="音频文件" bordered headerBordered>
            {/* 文件上传区域 */}
            <FileDropZone
              disabled={isLoading}
              onFileSelect={handleFileSelect}
            />

            {/* 分析进度 */}
            <AnalysisProgress
              status={analysisStatus}
              currentStep={currentStep}
              percent={progressPercent}
              fileName={fileName || undefined}
            />

            {/* Key / BPM 显示 */}
            {isReady && songAnalysis && (
              <KeyBpmDisplay
                keyName={songAnalysis.key}
                keyConfidence={songAnalysis.keyConfidence}
                bpm={songAnalysis.bpm}
                bpmConfidence={songAnalysis.bpmConfidence}
              />
            )}

            {/* 错误提示 */}
            {isError && error && (
              <Alert
                type="error"
                message="分析错误"
                description={error}
                showIcon
                style={{ marginTop: 16 }}
                action={
                  retryable ? (
                    <Button size="small" onClick={handleRetry}>
                      重试
                    </Button>
                  ) : undefined
                }
              />
            )}

            {/* 播放控制 + <audio> */}
            {isReady && audioUrl && (
              <div style={{ marginTop: 16 }}>
                {/* 原生 audio 元素（隐藏默认控件） */}
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                {/* biome-ignore lint/a11y/useMediaCaption: 用户上传的音频无需字幕 */}
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  preload="auto"
                  aria-label="音频播放"
                />

                {/* 自定义播放控件 */}
                <Space size={12}>
                  {isPlaying ? (
                    <Button
                      type="primary"
                      icon={<PauseOutlined />}
                      onClick={handlePause}
                    >
                      暂停
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      icon={<CaretRightOutlined />}
                      onClick={handlePlay}
                    >
                      播放
                    </Button>
                  )}
                  <Button
                    icon={<StopOutlined />}
                    onClick={handleStop}
                    disabled={playbackState === 'STOPPED'}
                  >
                    停止
                  </Button>
                  {songAnalysis && (
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                      {formatTime(currentTime)} /{' '}
                      {formatTime(songAnalysis.duration)}
                    </Typography.Text>
                  )}
                </Space>
              </div>
            )}
          </ProCard>
        </Col>

        {/* 右栏：和弦分析 */}
        <Col xs={24} lg={12}>
          <ProCard title="和弦分析" bordered headerBordered>
            {/* 空状态 */}
            {isIdle && !isError && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '64px 0',
                  minHeight: 300,
                }}
              >
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: 16, marginBottom: 8 }}
                >
                  上传音频文件开始分析
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  拖拽音频到左侧区域，自动识别和弦与级数
                </Typography.Text>
              </div>
            )}

            {/* 分析中 */}
            {isLoading && !isError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '64px 0',
                  minHeight: 300,
                }}
              >
                <AnalysisProgress
                  status={analysisStatus}
                  currentStep={currentStep}
                  percent={progressPercent}
                  fileName={fileName || undefined}
                />
              </div>
            )}

            {/* 分析结果 */}
            {isReady && (
              <>
                {/* 当前和弦大字 — 始终显示 */}
                <ChordDisplay
                  chord={currentChord?.chord || '—'}
                  degree={currentChord?.degree || ''}
                />

                {/* 波形可视化 — 普通 div 避免 antd 组件重渲染闪烁 */}
                <div
                  style={{
                    marginBottom: 16,
                    border: '1px solid #f0f0f0',
                    borderRadius: 8,
                    padding: 4,
                    overflow: 'hidden',
                  }}
                >
                  <WaveformCanvas
                    peaks={peaks}
                    duration={songAnalysis?.duration || 0}
                    chordSegments={songAnalysis?.chordSegments || []}
                    bpm={songAnalysis?.bpm || 120}
                    beats={songAnalysis?.beatList}
                    currentTime={currentTime}
                    isPlaying={isPlaying}
                    onSeek={handleSeek}
                  />
                </div>

                {/* 和弦序列 */}
                {songAnalysis && (
                  <ChordSequence
                    chordSegments={songAnalysis.chordSegments}
                    currentTime={currentTime}
                  />
                )}
              </>
            )}
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

/** 格式化时间 mm:ss */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default ChordAnalysisPage;
