/**
 * 大师扒谱 — 页面主入口（薄编排层）
 *
 * 形态：Tauri 薄壳远程加载本页（gh-pages）→ 调用本机 Python 引擎（localhost）→ 展示和弦时间轴。
 * 与「大师扒谱·网页版」并列、互不影响。
 *
 * 本页只做顶层编排：浏览器 → 引导下载客户端；客户端 → ChordTranscriptionClient 容器。
 * 引擎检测 / 安装 / 上传分析等业务逻辑已下沉到 useEngineStatus 与 ChordTranscriptionClient。
 * 环境切换的隐藏触发已移至 App.tsx 的全局顶栏（EnvSwitchTrigger），本页不再涉及。
 */
import { PageContainer, ProCard } from '@ant-design/pro-components';
import React, { useMemo } from 'react';
import { isRunningInTauri } from '@/shared/utils/tauri';
import { ChordTranscriptionClient } from './ChordTranscriptionClient';
import ClientRequiredPanel from './components/ClientRequiredPanel';

const ChordTranscriptionPage: React.FC = () => {
  // 环境判定：只在最顶层判一次。浏览器 → 面板引导下载；客户端 → 全部走本地引擎逻辑。
  const isClient = useMemo(() => isRunningInTauri(), []);

  return (
    <PageContainer
      header={{
        title: '大师扒谱·引擎版',
        subTitle:
          '调用本地模型，识别歌曲和弦 / 调性 / BPM / 节奏，分析精度约70%',
        ghost: true,
      }}
    >
      {!isClient ? (
        <ClientRequiredPanel />
      ) : (
        <ProCard>
          <ChordTranscriptionClient />
        </ProCard>
      )}
    </PageContainer>
  );
};

export default ChordTranscriptionPage;
