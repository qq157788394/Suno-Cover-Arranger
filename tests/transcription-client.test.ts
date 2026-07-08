/**
 * transcription/client 单元测试
 *
 * 覆盖审查修复点：
 * - #2 / #10：validateAudioFile（大小 + 格式，与重上传共用）
 * - #15：normalizeRaw 丢弃时间戳非法的和弦段并提示
 * - #10：normalizeChordLabel 与 local-engine/analyze.py 逐字符一致（对拍）
 * - #8：ENGINE_OFFLINE_MARKER 标记常量存在且可被前端识别
 */

import {
  ENGINE_OFFLINE_MARKER,
  MAX_AUDIO_FILE_SIZE,
  normalizeChordLabel,
  normalizeRaw,
  validateAudioFile,
} from '@/services/transcription/client';

const mp3 = (name = 'song.mp3', size = 1024) =>
  new File([new Uint8Array(size)], name, { type: 'audio/mpeg' });

describe('validateAudioFile', () => {
  it('接受合法 mp3', () => {
    expect(validateAudioFile(mp3()).ok).toBe(true);
  });

  it('拒绝超过 50MB 的文件', () => {
    const big = new File([new Uint8Array(1024)], 'big.mp3', {
      type: 'audio/mpeg',
    });
    Object.defineProperty(big, 'size', { value: MAX_AUDIO_FILE_SIZE + 1 });
    const r = validateAudioFile(big);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/50MB/);
  });

  it('拒绝不支持的格式', () => {
    const txt = new File([new Uint8Array(10)], 'note.txt', {
      type: 'text/plain',
    });
    expect(validateAudioFile(txt).ok).toBe(false);
  });

  it('按扩展名接受 wav', () => {
    expect(validateAudioFile(mp3('a.wav')).ok).toBe(true);
  });
});

describe('normalizeRaw', () => {
  it('丢弃时间戳非法的和弦段并提示 warning（#15）', () => {
    const r = normalizeRaw({
      chords: [
        { start_time: 0, end_time: 2, chord: 'C:maj' },
        { start_time: 'x', end_time: 4, chord: 'G:maj' }, // 非法 start
        { start_time: 2, end_time: NaN, chord: 'A:min' }, // 非法 end
      ],
    });
    expect(r.chords).toHaveLength(1);
    expect(r.chords[0].chordLabel).toBe('C');
    expect(r.warnings.some((w) => w.includes('非法'))).toBe(true);
  });

  it('空 chords 不报错', () => {
    const r = normalizeRaw({ chords: null });
    expect(r.chords).toEqual([]);
  });
});

describe('normalizeChordLabel（与 Python 对拍 #10）', () => {
  it('去冒号、min→m、裸 maj 省略', () => {
    expect(normalizeChordLabel('Bb:min')).toBe('Bbm');
    expect(normalizeChordLabel('F:maj')).toBe('F');
    expect(normalizeChordLabel('A:min7')).toBe('Am7');
    expect(normalizeChordLabel('C:maj7')).toBe('Cmaj7');
    expect(normalizeChordLabel('N')).toBe('N');
    expect(normalizeChordLabel('')).toBe('N');
  });
});

describe('ENGINE_OFFLINE_MARKER（#8）', () => {
  it('存在且可被前端字符串包含识别', () => {
    expect(ENGINE_OFFLINE_MARKER).toContain('ENGINE_OFFLINE');
    const msg = `${ENGINE_OFFLINE_MARKER}: 无法连接`;
    expect(msg.includes(ENGINE_OFFLINE_MARKER)).toBe(true);
  });
});
