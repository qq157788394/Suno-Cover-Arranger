import { Space, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";

const { Text } = Typography;

interface AudioPreviewProps {
  blob: Blob | null;
}

/**
 * 音频预览播放器
 * 使用 HTML5 <audio> 标签播放处理后的音频
 */
const AudioPreview: React.FC<AudioPreviewProps> = ({ blob }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    // 创建新的 URL
    if (blob && blob.size > 0) {
      const url = URL.createObjectURL(blob);
      setObjectUrl(url);
      // 直接设置 audio 元素的 src 并加载，确保播放器可用
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
      }
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [blob]);

  if (!blob) return null;

  return (
    <Space
      direction="vertical"
      style={{ marginTop: 16, marginBottom: 16, width: "100%" }}
    >
      <Text strong>预览</Text>
      {/* biome-ignore lint/a11y/useMediaCaption: 用户上传的音频无需字幕 */}
      <audio
        ref={audioRef}
        controls
        style={{ width: "100%" }}
        src={objectUrl || undefined}
        aria-label="音频预览"
      >
        您的浏览器不支持音频播放
      </audio>
    </Space>
  );
};

export default AudioPreview;
