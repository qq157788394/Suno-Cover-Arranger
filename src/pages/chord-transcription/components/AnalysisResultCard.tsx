import { Alert, Button, Card, Flex, Segmented, Tag, Typography } from 'antd';

const { Title } = Typography;

import { ReloadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import type { TranscriptionResult } from '@/shared/types/types';
import BeatGrid from './BeatGrid';
import type { ChordDisplayMode } from './beatGridUtils';

/** 分析完成结果卡片：Key/BPM/节奏标签 + 和弦网格 + 分析提示 + 重新上传 */
export function AnalysisResultCard({
  result,
  fileName,
  audioUrl,
  onReupload,
}: {
  result: TranscriptionResult;
  fileName: string | null;
  audioUrl: string | null;
  onReupload: () => void;
}) {
  // 展示模式：和弦名称 or 功能级数（与网页版一致，默认和弦名称）
  const [displayMode, setDisplayMode] = useState<ChordDisplayMode>('chord');

  return (
    <Flex vertical gap="large">
      <Flex wrap={false} align="center">
        <Flex vertical flex="auto">
          <Title level={5}>{result.fileName || fileName}</Title>
          <Flex gap="small">
            {result.key != null && <Tag color="magenta">Key: {result.key}</Tag>}
            {result.bpm != null && <Tag color="orange">BPM：{result.bpm}</Tag>}
            {result.rhythm && (
              <Tag color="cyan">
                {result.rhythm.bars} 小节 / {result.rhythm.beats_per_bar ?? '?'}{' '}
                拍每小节
              </Tag>
            )}
          </Flex>
        </Flex>
        <Flex flex="none">
          <Button type="primary" icon={<ReloadOutlined />} onClick={onReupload}>
            重新上传
          </Button>
        </Flex>
      </Flex>
      <Card
        title="和弦网格"
        extra={
          <Segmented
            options={[
              { label: '和弦名称', value: 'chord' },
              { label: '功能级数', value: 'degree' },
            ]}
            value={displayMode}
            onChange={(v) => setDisplayMode(v as ChordDisplayMode)}
          />
        }
      >
        <BeatGrid
          chords={result.chords}
          rhythm={result.rhythm}
          roman={result.roman}
          audioUrl={audioUrl}
          displayMode={displayMode}
        />
      </Card>

      {result.warnings.length > 0 && (
        <Alert
          type="info"
          showIcon
          title="分析提示"
          description={
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {result.warnings.map((w) => (
                <li key={w} style={{ fontSize: 13 }}>
                  {w}
                </li>
              ))}
            </ul>
          }
        />
      )}
    </Flex>
  );
}

export default AnalysisResultCard;
