import React, { useEffect, useRef } from 'react';

/** 把安装日志渲染成终端式面板，报错行标红 */
export function TerminalLog({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLPreElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines]);
  return (
    <pre
      ref={ref}
      style={{
        marginTop: 16,
        maxHeight: 280,
        overflow: 'auto',
        background: '#0F1419',
        color: '#E5E7EB',
        padding: 16,
        borderRadius: 12,
        fontFamily: 'monospace',
        fontSize: 12,
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
      }}
    >
      {lines.map((l, i) => {
        const isErr = /失败|error|Error|✗|traceback|Exception/i.test(l);
        return (
          // 日志行 append-only 且内容会重复，无更稳定的 key；
          // 原用内容作 key 导致相同行渲染错配（审查 #18）。
          // biome-ignore lint/suspicious/noArrayIndexKey: 此处 index 是唯一稳定且正确的 key
          <div key={i} style={isErr ? { color: '#F87171' } : undefined}>
            {l}
          </div>
        );
      })}
    </pre>
  );
}

export default TerminalLog;
