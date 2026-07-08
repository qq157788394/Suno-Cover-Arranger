import { Alert, Button } from "antd";
import React from "react";

interface ApiKeyAlertProps {
  visible: boolean;
  onNavigateToSettings: () => void;
}

const ApiKeyAlert: React.FC<ApiKeyAlertProps> = ({
  visible,
  onNavigateToSettings,
}) => {
  if (!visible) return null;

  return (
    <Alert
      title="尚未设置 AI API Key，设置完成后即可使用该功能，是否现在去设置？"
      banner
      style={{ marginBottom: 24 }}
      action={
        <Button type="link" onClick={onNavigateToSettings}>
          去设置
        </Button>
      }
    />
  );
};

export default ApiKeyAlert;
