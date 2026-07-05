/**
 * Mock 分析 Pipeline — 用于 UI 开发和调试
 *
 * 返回模拟的 SongAnalysis 数据，无需 essentia.js 加载。
 * 生产环境切换为真实的 analyzePipeline。
 */

import type { SongAnalysis, ChordSegment } from '@/shared/types/types';

const MOCK_CHORDS: ChordSegment[] = [
  { startTime: 0, endTime: 2.0, chord: 'Cmaj7', degree: 'IM7', confidence: 0.85 },
  { startTime: 2.0, endTime: 4.0, chord: 'Am7', degree: 'VIm7', confidence: 0.82 },
  { startTime: 4.0, endTime: 6.0, chord: 'Dm7', degree: 'IIm7', confidence: 0.88 },
  { startTime: 6.0, endTime: 8.0, chord: 'G7', degree: 'V7', confidence: 0.90 },
  { startTime: 8.0, endTime: 10.0, chord: 'Cmaj7', degree: 'IM7', confidence: 0.86 },
  { startTime: 10.0, endTime: 12.0, chord: 'Am7', degree: 'VIm7', confidence: 0.83 },
  { startTime: 12.0, endTime: 14.0, chord: 'Dm7', degree: 'IIm7', confidence: 0.87 },
  { startTime: 14.0, endTime: 16.0, chord: 'G7', degree: 'V7', confidence: 0.91 },
  { startTime: 16.0, endTime: 18.0, chord: 'Fmaj7', degree: 'IVM7', confidence: 0.84 },
  { startTime: 18.0, endTime: 20.0, chord: 'Em7', degree: 'IIIm7', confidence: 0.80 },
  { startTime: 20.0, endTime: 22.0, chord: 'Dm7', degree: 'IIm7', confidence: 0.86 },
  { startTime: 22.0, endTime: 24.0, chord: 'G7', degree: 'V7', confidence: 0.89 },
];

export async function analyzePipeline(
  audioBuffer: AudioBuffer,
  fileName: string,
  fileHash: string,
  onProgress?: (step: string, percent: number) => void,
): Promise<SongAnalysis> {
  // 模拟分析进度
  const steps = [
    { step: 'hpcp', percent: 10, delay: 200 },
    { step: 'key_bpm', percent: 35, delay: 200 },
    { step: 'chord_match', percent: 50, delay: 300 },
    { step: 'viterbi', percent: 65, delay: 300 },
    { step: 'romanize', percent: 80, delay: 300 },
    { step: 'done', percent: 100, delay: 200 },
  ];

  for (const s of steps) {
    await new Promise((r) => setTimeout(r, s.delay));
    onProgress?.(s.step, s.percent);
  }

  // 根据音频实际长度裁剪和弦
  const maxTime = audioBuffer.duration;
  const chords = MOCK_CHORDS.filter((c) => c.startTime < maxTime);

  return {
    fileHash,
    fileName,
    fileSize: 0,
    duration: audioBuffer.duration,
    sampleRate: audioBuffer.sampleRate,
    key: 'C Major',
    keyConfidence: 0.92,
    bpm: 70,
    bpmConfidence: 0.88,
    chordSegments: chords,
    vocabularyLevel: 'extended',
    analyzedAt: Date.now(),
    analysisDurationMs: 1500,
  };
}
