/**
 * 歌词记录列表页面
 * 使用ProTable展示所有歌词生成记录
 */

import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { Button, message, Popconfirm, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { MASTER_STYLE_CARDS } from '@/config/masterStyleConfig';
import { useLyricsRecords } from '@/hooks/useLyricsRecords';
import { db } from '@/services/db';
import type { LyricsRecord } from '@/shared/types/types';

const LyricsRecordsPage: React.FC = () => {
  const navigate = useNavigate();
  const { deleteRecord } = useLyricsRecords();
  const actionRef = useRef<ActionType>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteRecord(id);
      if (result.success) {
        message.success('删除成功');
        actionRef.current?.reload();
      } else {
        message.error('删除失败');
      }
    } catch (_error) {
      message.error('删除失败');
    }
  };

  const columns: ProColumns<LyricsRecord>[] = [
    {
      title: '歌曲名称',
      dataIndex: ['form_data', 'song_name'],
      width: 150,
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '风格大师',
      dataIndex: ['form_data', 'master_id'],
      width: 120,
      render: (_, record) => {
        const masterId = record.form_data.master_id;
        if (!masterId) {
          return <Tag>无</Tag>;
        }
        const master = MASTER_STYLE_CARDS.find((m) => m.id === masterId);
        return master ? (
          <Tag color="blue">{master.name}</Tag>
        ) : (
          <Tag>{masterId}</Tag>
        );
      },
    },
    {
      title: '语言',
      dataIndex: ['form_data', 'song_language'],
      width: 100,
      render: (_, record) => {
        const languageMap: Record<string, string> = {
          mandarin: '普通话',
          cantonese: '粤语',
          minnan: '闽南语',
        };
        return (
          <Tag>
            {languageMap[record.form_data.song_language] ||
              record.form_data.song_language}
          </Tag>
        );
      },
    },
    {
      title: '风格',
      dataIndex: ['form_data', 'song_style'],
      width: 100,
      render: (_, record) => {
        const styleMap: Record<string, string> = {
          pop: '流行',
          rock: '摇滚',
          ballad: '民谣',
          rnb: 'R&B',
          folk: '古风',
          electronic: '电子',
        };
        return (
          <Tag color="purple">
            {styleMap[record.form_data.song_style] ||
              record.form_data.song_style}
          </Tag>
        );
      },
    },
    {
      title: '贴近度',
      dataIndex: ['form_data', 'closeness'],
      width: 100,
      render: (_, record) => {
        const closeness = record.form_data.closeness;
        let color = 'default';
        if (closeness >= 80) color = 'red';
        else if (closeness >= 60) color = 'orange';
        else if (closeness >= 40) color = 'green';
        return <Tag color={color}>{closeness}%</Tag>;
      },
    },
    {
      title: '生成时间',
      dataIndex: 'created_at',
      width: 180,
      valueType: 'dateTime',
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_, record) => [
        <Button
          key="view"
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => record.id && navigate(`/lyrics-records/${record.id}`)}
        >
          查看
        </Button>,
        <Popconfirm
          key="delete"
          title="确认删除"
          description="确定要删除这条记录吗？"
          onConfirm={() => record.id && handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer title="歌词记录">
      <ProTable<LyricsRecord>
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort) => {
          setLoading(true);
          try {
            const records = await db.getAllLyricsRecords();

            let filteredRecords = [...records];

            if (params.current && params.pageSize) {
              const start = (params.current - 1) * params.pageSize;
              const end = start + params.pageSize;
              filteredRecords = filteredRecords.slice(start, end);
            }

            if (sort && Object.keys(sort).length > 0) {
              const sortKey = Object.keys(sort)[0];
              const sortOrder = sort[sortKey];
              filteredRecords.sort((a, b) => {
                const aVal = a[sortKey as keyof LyricsRecord];
                const bVal = b[sortKey as keyof LyricsRecord];
                if (aVal === undefined && bVal === undefined) return 0;
                if (aVal === undefined) return 1;
                if (bVal === undefined) return -1;
                if (sortOrder === 'ascend') {
                  return aVal > bVal ? 1 : -1;
                } else {
                  return aVal < bVal ? 1 : -1;
                }
              });
            }

            return {
              data: filteredRecords,
              success: true,
              total: records.length,
            };
          } catch (_error) {
            message.error('加载数据失败');
            return {
              data: [],
              success: false,
              total: 0,
            };
          } finally {
            setLoading(false);
          }
        }}
        rowKey="id"
        search={false}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ x: 1200 }}
        loading={loading}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => navigate('/lyrics-craft')}
          >
            创建新歌词
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default LyricsRecordsPage;
