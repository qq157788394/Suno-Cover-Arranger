/**
 * 音乐理解 — 文件上传区域
 * 与「大师扒谱」FileDropZone 保持一致的视觉语言
 */
import { SoundOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useCallback, useRef, useState } from "react";

const { Text } = Typography;

const SUPPORTED = ".mp3,.wav,.flac,.ogg,.aac";
const MAX_SIZE = 50 * 1024 * 1024;

interface Props {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFileSelect, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkFile = useCallback(
    (file: File) => {
      const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!SUPPORTED.includes(ext)) {
        alert(`不支持的格式: ${ext}。支持 ${SUPPORTED}`);
        return;
      }
      if (file.size > MAX_SIZE) {
        alert("文件过大，请选择 50MB 以内的文件");
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) checkFile(file);
    },
    [checkFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) checkFile(file);
      // reset 以便同一个文件可以重新选
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [checkFile],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => {
        if (!disabled) fileInputRef.current?.click();
      }}
      style={{
        border: `2px ${dragging ? "solid" : "dashed"} ${dragging ? "#FF9000" : "#d9d9d9"}`,
        borderRadius: 12,
        padding: "48px 24px",
        textAlign: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        background: dragging ? "rgba(255,144,0,0.04)" : "#fafafa",
        transition: "all 0.2s",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <SoundOutlined
        style={{ fontSize: 40, color: "#FF9000", marginBottom: 16 }}
      />
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
        点击或拖拽音频文件到此处
      </div>
      <Text type="secondary">
        支持 MP3、WAV、FLAC、OGG、AAC 格式，单个文件不超过 50MB
      </Text>
      <input
        ref={fileInputRef}
        type="file"
        accept={SUPPORTED}
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </div>
  );
}
