/**
 * EnvSwitchTrigger — 隐藏式环境切换触发点
 *
 * 取代原「仅本地开发源才显示」的悬浮按钮。行为变化：
 * - 仅在客户端（Tauri 桌面壳）渲染，浏览器下直接返回 null。
 * - 文字透明度设为 0，作为彩蛋式隐藏触发点（仍占布局、可点击）。
 * - 连续点击 10 次在 localhost:8000 与 GitHub Pages 之间切换，
 *   第 6 次起开始提示「即将切换」，逻辑见 useEnvSwitchTrigger。
 */
import { Typography } from "antd";
import { useEnvSwitchTrigger } from "../hooks/useEnvSwitch";

const { Text } = Typography;

const EnvSwitchTrigger: React.FC = () => {
  const { isClient, onClick, contextHolder } = useEnvSwitchTrigger();
  if (!isClient) return null;
  return (
    <>
      {contextHolder}
      <Text
        style={{ opacity: 0, cursor: "pointer", userSelect: "none" }}
        onClick={onClick}
      >
        环境切换
      </Text>
    </>
  );
};

export default EnvSwitchTrigger;
