import { Typography } from 'antd';

const { Text } = Typography;

import React from 'react';

/** 单行依赖状态展示 */
export function StatusRow({
  label,
  ok,
  port,
  hint,
}: {
  label: string;
  ok: boolean | null;
  port?: number | null;
  hint?: string;
}) {
  const mark = ok === null ? '—' : ok ? '✅' : '❌';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid #F3F4F6',
      }}
    >
      <span style={{ fontSize: 14 }}>
        {label}
        {hint && (
          <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
            {hint}
          </Text>
        )}
      </span>
      <span style={{ fontFamily: 'monospace', fontSize: 13 }}>
        {mark}
        {ok && port ? ` (localhost:${port})` : ''}
      </span>
    </div>
  );
}

export default StatusRow;
