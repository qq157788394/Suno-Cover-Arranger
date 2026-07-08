import { message, Spin } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranscription } from '@/hooks/useTranscription';
import {
  LOCAL_ENGINE_BASE,
  validateAudioFile,
} from '@/services/transcription/client';
import { isRunningInTauri } from '@/shared/utils/tauri';
import AnalysisWorkspace from './components/AnalysisWorkspace';
import EngineSetupPanel from './components/EngineSetupPanel';
import { useEngineStatus } from './hooks/useEngineStatus';

/**
 * 客户端（Tauri 壳）内的大师扒谱容器：组合引擎状态机（useEngineStatus）与上传分析
 * （useTranscription），按引擎就绪度分发面板。
 *
 * 合并点：原 AnalysisWorkspace 的 ENGINE_OFFLINE 分支被上提到此处——引擎连接中断即视作
 * "回到未就绪"，清空上传态并统一渲染 EngineSetupPanel（offline 文案切换），消除重复的
 * "重新检测引擎"逻辑。
 */
export function ChordTranscriptionClient() {
  const {
    checking,
    detectError,
    engineReady,
    detail,
    prefetchingId,
    installing,
    installLog,
    detectEngine,
    installEngine,
    prefetchAsset,
  } = useEngineStatus();

  const { status, result, fileName, handleFileSelect, reset } =
    useTranscription();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileRef = useRef<File | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const handleFileSelectWithRef = useCallback(
    (file: File) => {
      fileRef.current = file;
      // 客户端已确认引擎在跑：直接打固定地址，跳过 discoverEngine 端口扫描
      handleFileSelect(
        file,
        isRunningInTauri() ? LOCAL_ENGINE_BASE : undefined,
      );
    },
    [handleFileSelect],
  );

  useEffect(() => {
    if (status === 'READY' && fileRef.current) {
      // 重上传会再次进入 READY：先回收上一次的 object URL，避免 blob 逐步泄漏（审查 #9）。
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      const url = URL.createObjectURL(fileRef.current);
      audioUrlRef.current = url;
      setAudioUrl(url);
    }
  }, [status]);

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  const handleReset = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioUrl(null);
    fileRef.current = null;
    reset();
  }, [reset]);

  const handleReupload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleReuploadFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      // 复用与首次上传一致的校验，杜绝重上传绕过校验传入超大或非法文件（审查 #2）。
      const check = validateAudioFile(file);
      if (!check.ok) {
        message.error(check.error);
        return;
      }
      handleFileSelectWithRef(file);
    },
    [handleFileSelectWithRef],
  );

  const isEngineOffline = status === 'ENGINE_OFFLINE';
  // 合并原 AnalysisWorkspace 的 ENGINE_OFFLINE 分支：引擎连接中断即视作回到未就绪，
  // 清空上传态并统一走 EngineSetupPanel（与原 detectEngine().then(reset) 等价）。
  const showSetup = !checking && (!engineReady || isEngineOffline);

  useEffect(() => {
    if (isEngineOffline) {
      handleReset();
    }
  }, [isEngineOffline, handleReset]);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        style={{ display: 'none' }}
        onChange={handleReuploadFileChange}
      />
      {checking ? (
        <Spin description="正在检测本地引擎…" size="large" />
      ) : showSetup ? (
        <EngineSetupPanel
          detail={detail}
          detectError={detectError}
          installing={installing}
          installLog={installLog}
          offline={isEngineOffline}
          prefetchingId={prefetchingId}
          onDetect={detectEngine}
          onInstall={installEngine}
          onPrefetch={prefetchAsset}
        />
      ) : (
        <AnalysisWorkspace
          status={status}
          result={result}
          fileName={fileName}
          audioUrl={audioUrl}
          onFileSelect={handleFileSelectWithRef}
          onReset={handleReset}
          onReupload={handleReupload}
        />
      )}
    </>
  );
}

export default ChordTranscriptionClient;
