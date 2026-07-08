import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Typography, Upload } from "antd";
import React from "react";

const { Dragger } = Upload;
const { Text, Paragraph } = Typography;

/** 支持的音频格式 */
const ACCEPTED_AUDIO_TYPES = [".mp3", ".wav", ".flac", ".m4a"];

/** 支持的 MIME 类型 */
const ACCEPTED_MIME_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/flac",
  "audio/x-flac",
  "audio/mp4",
  "audio/x-m4a",
];

interface AudioUploaderProps {
  /** 当前选中的文件（ProForm.Item 注入） */
  value?: File | null;
  /** 文件变更回调（ProForm.Item 注入） */
  onChange?: (file: File | null) => void;
  /** 是否禁用上传 */
  disabled?: boolean;
}

/**
 * 音频上传组件
 * 支持拖拽上传和点击选择，限制音频格式和大小
 * 兼容 ProForm.Item 的 value/onChange 模式
 */
const AudioUploader: React.FC<AudioUploaderProps> = ({
  value: _value,
  onChange,
  disabled = false,
}) => {
  /**
   * 处理文件选择
   * @param file - 用户选择的文件
   */
  const handleFileSelect = (file: File) => {
    // 检查文件类型
    const isValidType =
      ACCEPTED_MIME_TYPES.includes(file.type) ||
      ACCEPTED_AUDIO_TYPES.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      message.error("仅支持 MP3、WAV、FLAC、M4A 格式的音频文件");
      return;
    }

    // 检查文件大小（限制 200MB）
    const maxSize = 200 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error("文件大小不能超过 200MB");
      return;
    }

    onChange?.(file);
  };

  const uploadProps: UploadProps = {
    name: "audio",
    multiple: false,
    accept: ACCEPTED_AUDIO_TYPES.join(","),
    maxCount: 1,
    disabled,
    // 阻止自动上传，改为手动处理
    beforeUpload: (file) => {
      handleFileSelect(file as File);
      return false; // 阻止自动上传
    },
    onRemove: () => {
      onChange?.(null);
    },
    showUploadList: {
      showRemoveIcon: true,
    },
  };

  return (
    <Dragger {...uploadProps}>
      <Typography>
        <UploadOutlined
          style={{ fontSize: 48, color: "var(--ant-color-primary)" }}
        />
        <Paragraph>点击或拖拽音频文件到此区域上传</Paragraph>
        <Text type="secondary">
          支持 MP3、WAV、FLAC、M4A 格式，单文件不超过 200MB
        </Text>
      </Typography>
    </Dragger>
  );
};

export default AudioUploader;
