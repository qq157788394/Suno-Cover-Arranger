import {
  type ProColumns,
  ProTable,
  type RequestData,
} from '@ant-design/pro-components';
import { Space } from 'antd';
import React from 'react';

interface ProTableWrapperProps<T extends Record<string, any>> {
  /** 表格列配置 */
  columns: ProColumns<T>[];
  /** 数据请求函数 */
  request?: (
    params: any,
    sort: Record<string, 'ascend' | 'descend' | null>,
    filter: Record<string, (string | number)[] | null>,
  ) => Promise<Partial<RequestData<T>>>;
  /** 数据源 */
  dataSource?: T[];
  /** 加载状态 */
  loading?: boolean;
  /** 表格标题 */
  title?: string;
  /** 是否显示搜索栏 */
  showSearch?: boolean;
  /** 是否显示操作按钮 */
  showActions?: boolean;
  /** 自定义操作按钮 */
  actionButtons?: React.ReactNode[];
  /** 表格行键 */
  rowKey?: string;
  /** 分页配置 */
  pagination?: any;
  /** 搜索配置 */
  searchConfig?: {
    labelWidth?: 'auto' | number;
    defaultCollapsed?: boolean;
    span?: number;
  };
  /** 表格选项配置 */
  options?: {
    reload?: () => void;
    density?: boolean;
    fullScreen?: boolean;
  };
  /** 滚动配置 */
  scroll?: {
    x?: number | string;
    y?: number | string;
  };
  /** 表格变化处理函数 */
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
}

const ProTableWrapper = <T extends Record<string, any>>({
  columns,
  request,
  dataSource,
  loading = false,
  title,
  showSearch = true,
  showActions = false,
  actionButtons = [],
  rowKey = 'id',
  pagination = {
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条记录`,
  },
  searchConfig = {
    labelWidth: 'auto',
    defaultCollapsed: false,
    span: 6,
  },
  options = {
    reload: () => {},
    density: true,
    fullScreen: true,
  },
  scroll,
  onChange,
}: ProTableWrapperProps<T>) => {
  return (
    <>
      {showActions && actionButtons.length > 0 && (
        <Space style={{ marginBottom: 16 }}>{actionButtons}</Space>
      )}
      <ProTable
        rowKey={rowKey}
        columns={columns}
        request={request}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        headerTitle={title}
        options={options}
        scroll={scroll}
        search={showSearch ? searchConfig : false}
        onChange={(_pagination, _filters, _sorter, _extra) =>
          onChange?.(_pagination, _filters, _sorter, _extra)
        }
      />
    </>
  );
};

export default ProTableWrapper;
