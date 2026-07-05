/**
 * FileDropZone — 文件拖拽上传组件
 * 使用 Upload.Dragger 封装，支持拖拽/点击上传音频文件
 * 校验文件格式 + 大小，通过 onChange 回调触发分析流程
 */

import { InboxOutlined } from '@ant-design/icons';
import { message, Typography, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useCallback } from 'react';

const { Dragger } = Upload;
const { Text } = Typography;

/** 支持的音频格式 */
const SUPPORTED_AUDIO_MIME_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/flac',
  'audio/ogg',
  'audio/aac',
  'audio/x-m4a',
  'audio/mp4',
];

const SUPPORTED_EXTENSIONS = ['.mp3', '.wav', '.flac', '.ogg', '.aac', '.m4a'];

/** 文件大小上限：50MB */
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export interface FileDropZoneProps {
  /** 是否禁用（分析进行中时禁用） */
  disabled: boolean;
  /** 文件选择回调 */
  onFileSelect: (file: File) => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  disabled,
  onFileSelect,
}) => {
  const beforeUpload = useCallback(
    (file: File) => {
      // 文件大小校验
      if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(0);
        message.error(`文件过大（${sizeMB}MB），请选择 50MB 以内的文件`);
        return Upload.LIST_IGNORE;
      }

      // 文件格式校验
      const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const isSupportedExt = SUPPORTED_EXTENSIONS.includes(ext);
      const isSupportedMime = SUPPORTED_AUDIO_MIME_TYPES.includes(file.type);

      if (!isSupportedExt && !isSupportedMime) {
        message.error('不支持的文件格式。支持：MP3、WAV、FLAC、OGG、AAC');
        return Upload.LIST_IGNORE;
      }

      // 校验通过，触发回调
      onFileSelect(file);
      return false; // 阻止自动上传
    },
    [onFileSelect],
  );

  const handleChange = useCallback((info: { file: UploadFile }) => {
    const { status } = info.file;
    if (status === 'error') {
      message.error('文件读取失败，请重试');
    }
  }, []);

  return (
    <Dragger
      name="audio"
      multiple={false}
      maxCount={1}
      accept="audio/*"
      disabled={disabled}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      showUploadList={false}
      style={{ padding: 24 }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <Text strong style={{ fontSize: 16 }}>
        点击或拖拽音频文件到此处
      </Text>
      <br />
      <Text type="secondary" style={{ fontSize: 13 }}>
        支持 MP3、WAV、FLAC、OGG、AAC 格式，文件大小不超过 50MB
      </Text>
    </Dragger>
  );
};

export default FileDropZone;
