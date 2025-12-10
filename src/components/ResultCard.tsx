// Ant Design Icons
import { CopyOutlined } from '@ant-design/icons';

// Ant Design Pro Components
import { ProCard } from '@ant-design/pro-components';

// Ant Design Base Components
import { Button, Input } from 'antd';

// React
import React, { memo } from 'react';

// 可复用的结果卡片组件
const ResultCard = memo(
  ({
    title,
    value,
    onCopy,
  }: {
    title: string;
    value: string;
    onCopy: () => void;
  }) => {
    return (
      <ProCard
        title={title}
        extra={
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={onCopy}
            disabled={!value}
            size="small"
          >
            复制
          </Button>
        }
        style={{ marginBottom: 24 }}
      >
        <Input.TextArea
          value={value}
          readOnly
          placeholder={`生成的 ${title} 提示词将展示在此处…`}
          showCount
          rows={40}
        />
      </ProCard>
    );
  },
);

export default ResultCard;
