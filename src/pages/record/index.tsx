import {
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { PageContainer, type ProColumns } from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { Alert, Button, Modal, message, Space, Tooltip } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { ProTableWrapper } from '@/components';
import { usePromptRecords } from '@/hooks/usePromptRecords';
import type { PromptRecord } from '@/shared/types';

const RecordPage: React.FC = () => {
  // 模拟当前用户ID，实际应用中应该从登录状态获取
  const currentUserId = 1;
  // 使用自定义 hook 管理提示词记录
  const { records, loading, fetchRecords, deleteRecord } =
    usePromptRecords(currentUserId);
  // 使用Umi的useNavigate进行路由跳转
  const navigate = useNavigate();

  // 查看详情
  const handleViewDetail = useCallback(
    (record: PromptRecord) => {
      try {
        localStorage.setItem('selectedPromptRecord', JSON.stringify(record));
        // 使用Umi的navigate进行路由跳转
        navigate('/');
      } catch (error) {
        console.error('存储记录数据失败:', error);
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
            await deleteRecord(record.id!);
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

  // ProTable请求配置
  const request = useCallback(
    async (params: any) => {
      const keyword = params.keyword || '';
      const dateRange = params.createdAt;
      const songLanguages = params.songLanguage;
      const targetSinger = params.targetSinger;
      const styleDescription = params.styleDescription;

      const fetchedRecords = await fetchRecords({
        keyword,
        dateRange,
        songLanguages,
        targetSinger,
        styleDescription,
      });
      return {
        data: fetchedRecords,
        success: true,
        total: fetchedRecords.length,
      };
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
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 180,
        valueType: 'dateRange',
        render: (_, record) => {
          const createdAt = record.createdAt || new Date(0);
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
        title: '歌曲语言',
        dataIndex: ['userInput', 'songLanguage'],
        key: 'songLanguage',
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
        dataIndex: ['userInput', 'targetSinger'],
        key: 'targetSinger',
        width: 150,
        search: true,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: '风格备注',
        dataIndex: ['userInput', 'styleDescription'],
        key: 'styleDescription',
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
      <ProTableWrapper
        rowKey="id"
        columns={columns}
        request={request}
        loading={loading}
        title="提示词生成记录"
        options={{
          reload: () => fetchRecords(),
          density: true,
          fullScreen: true,
        }}
        scroll={{ x: 1200 }}
      />
    </PageContainer>
  );
};

export default React.memo(RecordPage);
