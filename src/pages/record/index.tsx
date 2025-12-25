import {
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  type ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { Alert, Button, Modal, message, Space, Tooltip } from 'antd';
import React, { useCallback, useEffect, useMemo } from 'react';
import { usePromptRecords } from '@/hooks/usePromptRecords';
import type { PromptRecord } from '@/shared/types/types';

// 结构化日志系统
const log = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data || '');
  },
  error: (message: string, error?: any) => {
    console.error(
      `[ERROR] ${new Date().toISOString()}: ${message}`,
      error || '',
    );
  },
  debug: (message: string, data?: any) => {
    console.debug(
      `[DEBUG] ${new Date().toISOString()}: ${message}`,
      data || '',
    );
  },
};

const RecordPage: React.FC = () => {
  // 模拟当前用户ID，实际应用中应该从登录状态获取
  const currentUserId = 1;
  // 使用自定义 hook 管理提示词记录
  const { records, loading, fetchRecords, deleteRecord } =
    usePromptRecords(currentUserId);
  // 使用Umi的useNavigate进行路由跳转
  const navigate = useNavigate();

  // 组件挂载时获取初始数据
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // 查看详情
  const handleViewDetail = useCallback(
    (record: PromptRecord) => {
      try {
        log.info('点击查看详情，准备传递的记录ID', {
          recordId: record.id,
          record,
        });

        // 确保record对象存在且有ID
        if (!record || !record.id) {
          log.error('record或record.id为空', { record });
          message.error('查看详情失败，记录数据不完整');
          return;
        }

        // 使用URL参数传递记录ID
        log.info('开始跳转到首页，携带记录ID参数', { recordId: record.id });
        navigate(`/?recordId=${record.id}`);
      } catch (error) {
        log.error('导航到详情页失败', error);
        message.error('查看详情失败，请稍后重试');
      }
    },
    [navigate],
  );

  // 删除单条记录
  const handleDelete = useCallback(
    async (record: PromptRecord) => {
      Modal.confirm({
        title: '确认删除',
        content: '确定要删除这条记录吗？该操作无法恢复。',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          try {
            if (!record.id) {
              message.error('记录ID不存在');
              return;
            }
            await deleteRecord(record.id);
            message.success('删除成功');
          } catch (error) {
            message.error('删除失败');
            console.error('删除失败：', error);
          }
        },
      });
    },
    [deleteRecord],
  );

  // 处理搜索表单提交前的参数处理
  const beforeSearchSubmit = useCallback((params: any) => {
    // 直接返回处理后的参数，这些参数会传递给request函数
    return params;
  }, []);

  // 处理表格参数变化并获取数据
  const handleTableChange = useCallback(
    async (_pagination: any, _filters: any, _sorter: any, extra: any) => {
      // 从extra中获取搜索表单的参数
      const { action, searchFormValues } = extra;

      // 只有在搜索操作时才执行筛选
      if (action === 'search') {
        const keyword = searchFormValues?.keyword || '';
        const dateRange = searchFormValues?.created_at;
        const songLanguages = searchFormValues?.song_language;
        const targetSinger = searchFormValues?.target_singer;
        const styleDescription = searchFormValues?.style_description;
        const songName = searchFormValues?.song_name;

        await fetchRecords({
          keyword,
          dateRange,
          songLanguages,
          targetSinger,
          styleDescription,
          songName,
        });
      }
    },
    [fetchRecords],
  );

  // 表格列配置
  const columns = useMemo<ProColumns<PromptRecord>[]>(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        hideInSearch: true,
      },
      {
        title: '时间',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 180,
        valueType: 'dateRange',
        render: (_, record) => {
          const createdAt = record.created_at || new Date(0);
          return (
            <Tooltip title={new Date(createdAt).toLocaleString()}>
              <Space>
                <ClockCircleOutlined />
                {new Date(createdAt).toLocaleString()}
              </Space>
            </Tooltip>
          );
        },
      },
      {
        title: '歌曲名称',
        dataIndex: ['user_input', 'song_name'],
        key: 'song_name',
        width: 150,
        search: true,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: '歌曲语言',
        dataIndex: ['user_input', 'song_language'],
        key: 'song_language',
        width: 120,
        valueType: 'select',
        valueEnum: {
          Mandarin: { text: '华语（普通话）' },
          Cantonese: { text: '粤语' },
          Minnan: { text: '闽南语' },
          English: { text: '英语' },
          Korean: { text: '韩语' },
          Japanese: { text: '日语' },
          Other: { text: '其他' },
        },
        search: true,
        // 使用自定义筛选配置，通过类型断言绕过 TypeScript 检查
        ...({
          search: {
            multiple: true,
            fieldProps: {
              mode: 'multiple',
              options: [
                { value: 'Mandarin', label: '华语（普通话）' },
                { value: 'Cantonese', label: '粤语' },
                { value: 'Minnan', label: '闽南语' },
                { value: 'English', label: '英语' },
                { value: 'Korean', label: '韩语' },
                { value: 'Japanese', label: '日语' },
                { value: 'Other', label: '其他' },
              ],
              maxTagCount: 'responsive',
            },
          },
        } as any),
      },
      {
        title: '模仿歌手',
        dataIndex: ['user_input', 'target_singer'],
        key: 'target_singer',
        width: 150,
        search: true,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: '风格备注',
        dataIndex: ['user_input', 'style_description'],
        key: 'style_description',
        width: 200,
        search: true,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        fixed: 'right',
        hideInSearch: true,
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title="查看提示词">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                size="small"
                onClick={() => handleViewDetail(record)}
              >
                详情
              </Button>
            </Tooltip>
            <Tooltip title="删除">
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => handleDelete(record)}
              >
                删除
              </Button>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [handleViewDetail, handleDelete],
  );

  return (
    <PageContainer>
      <Alert
        title="生成记录仅保存在本地设备，不会上传至服务器，更换设备或浏览器后记录将无法查看。"
        banner
        style={{ marginBottom: 24 }}
      />
      <ProTable
        rowKey="id"
        columns={columns}
        // 直接使用records状态作为数据来源
        dataSource={records}
        loading={loading}
        headerTitle="提示词生成记录"
        options={{
          reload: () => fetchRecords(),
          density: true,
          fullScreen: true,
        }}
        scroll={{ x: 'max-content' }}
        // 使用onChange处理表格参数变化
        onChange={handleTableChange}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number) => `共 ${total} 条记录`,
        }}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
          span: 6,
        }}
        // 添加request属性以确保表格能正确处理数据
        request={async (params, _sort, _filter) => {
          // 当表格首次加载或分页变化时也会调用此方法
          // params包含了搜索表单的值
          const keyword = params?.keyword || '';
          const dateRange = params?.created_at;
          const songLanguages = params?.song_language;
          const targetSinger = params?.target_singer;
          const styleDescription = params?.style_description;
          const songName = params?.song_name;

          await fetchRecords({
            keyword,
            dateRange,
            songLanguages,
            targetSinger,
            styleDescription,
            songName,
          });

          return {
            data: records,
            success: true,
            total: records.length,
          };
        }}
        // 在搜索表单提交前处理参数
        beforeSearchSubmit={beforeSearchSubmit}
      />
    </PageContainer>
  );
};

export default React.memo(RecordPage);
