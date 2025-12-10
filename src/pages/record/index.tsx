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
import { Alert, Button, Modal, message, Space, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import type { PromptRecord } from '@/services/db';
import { db } from '@/services/db';

const RecordPage: React.FC = () => {
  // 模拟当前用户ID，实际应用中应该从登录状态获取
  const currentUserId = 1;
  const [loading, setLoading] = useState<boolean>(false);
  // 使用状态变量来触发表格重新加载
  const [reloadKey, setReloadKey] = useState(0);

  // 获取记录列表
  const fetchRecords = async (
    keyword?: string,
    dateRange?: [string, string],
    songLanguages?: string | string[],
    targetSinger?: string,
    styleDescription?: string,
  ) => {
    setLoading(true);
    try {
      let records: PromptRecord[];

      // 先根据关键字搜索或获取所有记录
      if (keyword) {
        records = await db.searchPromptRecords(currentUserId, keyword);
      } else {
        records = await db.getUserPromptRecords(currentUserId);
      }

      // 调试：打印原始记录数量
      console.log('Original records:', records.length);

      // 日期范围筛选
      if (
        dateRange &&
        Array.isArray(dateRange) &&
        dateRange[0] &&
        dateRange[1]
      ) {
        console.log('Applying date range filter:', dateRange);
        const startDate = new Date(dateRange[0]);
        const endDate = new Date(dateRange[1]);
        // 设置结束日期为当天的23:59:59
        endDate.setHours(23, 59, 59, 999);
        records = records.filter((record) => {
          const recordDate = new Date(record.createdAt);
          return recordDate >= startDate && recordDate <= endDate;
        });
        console.log('After date filter:', records.length);
      }

      // 歌曲语言多选筛选
      if (songLanguages) {
        // 确保 songLanguages 是数组
        const languages = Array.isArray(songLanguages)
          ? songLanguages
          : [songLanguages];
        console.log('Applying song language filter:', languages);
        records = records.filter((record) => {
          return languages.includes(record.userInput.songLanguage);
        });
        console.log('After language filter:', records.length);
      }

      // 目标歌手筛选
      if (targetSinger && targetSinger.trim()) {
        console.log('Applying target singer filter:', targetSinger);
        records = records.filter((record) => {
          return record.userInput.targetSinger
            .toLowerCase()
            .includes(targetSinger.toLowerCase());
        });
        console.log('After target singer filter:', records.length);
      }

      // 风格描述筛选
      if (styleDescription && styleDescription.trim()) {
        console.log('Applying style description filter:', styleDescription);
        records = records.filter((record) => {
          return record.userInput.styleDescription
            .toLowerCase()
            .includes(styleDescription.toLowerCase());
        });
        console.log('After style description filter:', records.length);
      }

      return records;
    } catch (error) {
      message.error('获取记录失败');
      console.error('获取记录失败：', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchRecords();
  }, []);

  // 查看详情
  const handleViewDetail = (record: PromptRecord) => {
    try {
      // 将记录数据存储到localStorage，供首页读取
      localStorage.setItem('selectedPromptRecord', JSON.stringify(record));

      // 跳转到首页
      history.push('/');
    } catch (error) {
      console.error('存储记录数据失败:', error);
      message.error('查看详情失败，请稍后重试');
    }
  };

  // 删除单条记录
  const handleDelete = async (record: PromptRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记录吗？该操作无法恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await db.deletePromptRecord(record.id!);
          message.success('删除成功');
          // 通过更新 reloadKey 触发表格重新加载
          setReloadKey((prevKey) => prevKey + 1);
        } catch (error) {
          message.error('删除失败');
          console.error('删除失败：', error);
        }
      },
    });
  };

  // ProTable请求配置
  const request = async (params: any) => {
    // 获取所有筛选条件
    const keyword = params.keyword || '';
    const dateRange = params.createdAt;
    const songLanguages = params.songLanguage;
    const targetSinger = params.targetSinger;
    const styleDescription = params.styleDescription;

    // 调试：打印所有筛选条件
    console.log('Request params:', params);
    console.log('Date range:', dateRange);
    console.log('Song languages:', songLanguages);

    const records = await fetchRecords(
      keyword,
      dateRange,
      songLanguages,
      targetSinger,
      styleDescription,
    );
    return {
      data: records,
      success: true,
      total: records.length,
    };
  };

  // 表格列配置
  const columns: ProColumns<PromptRecord>[] = [
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
        const createdAt = record.createdAt;
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
      // 配置搜索为多选下拉框
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
  ];

  return (
    <PageContainer>
      <Alert
        title="生成记录仅保存在本地设备，不会上传至服务器，更换设备或浏览器后记录将无法查看。"
        banner
      />
      <ProTable
        key={reloadKey}
        rowKey="id"
        columns={columns}
        request={request}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number) => `共 ${total} 条记录`,
        }}
        headerTitle="提示词生成记录"
        options={{
          reload: () => fetchRecords(),
          density: true,
          fullScreen: true,
        }}
        scroll={{ x: 1200 }}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
          span: 6,
        }}
      />
    </PageContainer>
  );
};

export default RecordPage;
