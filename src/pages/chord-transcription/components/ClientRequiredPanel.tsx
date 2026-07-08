import { ProCard } from '@ant-design/pro-components';
import { Button, Result } from 'antd';
import React from 'react';

/** 浏览器模式面板：本功能需桌面客户端，引导下载后永远结束（不再进入引擎逻辑） */
export function ClientRequiredPanel() {
  return (
    <ProCard>
      <Result
        status="403"
        title="本功能需要「大师来了」桌面客户端"
        subTitle="大师扒谱功能需安装本地分析模型，浏览器无法运行，请下载安装后试用"
        extra={
          <Button
            type="primary"
            href="https://github.com/qq157788394/Suno-Cover-Arranger/releases/latest"
            target="_blank"
            rel="noreferrer"
          >
            下载客户端
          </Button>
        }
      ></Result>
    </ProCard>
  );
}

export default ClientRequiredPanel;
