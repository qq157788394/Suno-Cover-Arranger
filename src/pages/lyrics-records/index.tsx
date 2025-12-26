/**
 * 歌词记录列表页面
 * 使用ProTable展示所有歌词生成记录
 */

import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { useNavigate } from "@umijs/max";
import { Alert, Button, message, Popconfirm } from "antd";
import React, { useRef, useState } from "react";
import { MASTER_STYLE_CARDS } from "@/config/masterStyleConfig";
import {
  CLOSENESS_LEVEL_OPTIONS,
  SONG_LANGUAGE_OPTIONS,
  SONG_STYLE_OPTIONS,
} from "@/config/lyricsEnums";
import { useLyricsRecords } from "@/hooks/useLyricsRecords";
import { db } from "@/services/db";
import type { LyricsRecord } from "@/shared/types/types";
import LyricsRecordDetail from "./detail"; // 导入详情组件

const LyricsRecordsPage: React.FC = () => {
  const navigate = useNavigate();
  const { deleteRecord } = useLyricsRecords();
  const actionRef = useRef<ActionType>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<LyricsRecord | null>(
    null
  );

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteRecord(id);
      if (result.success) {
        message.success("删除成功");
        actionRef.current?.reload();
        setOpen(false); // 删除后关闭Drawer
        setSelectedRecord(null);
      } else {
        message.error("删除失败");
      }
    } catch (_error) {
      message.error("删除失败");
    }
  };

  const handleView = (record: LyricsRecord) => {
    setSelectedRecord(record);
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setSelectedRecord(null);
  };

  const handleDrawerDelete = () => {
    // 由于详情组件已移除删除功能，此函数不再需要
    // 但为了保持组件接口一致性，保留此函数
  };

  /**
   * 获取歌词记录数据
   * 处理分页和排序逻辑
   */
  const fetchLyricsRecords = async (params: any, sort: any) => {
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
          if (sortOrder === "ascend") {
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
      message.error("加载数据失败");
      return {
        data: [],
        success: false,
        total: 0,
      };
    } finally {
      setLoading(false);
    }
  };

  const columns: ProColumns<LyricsRecord>[] = [
    {
      title: "歌曲名称",
      dataIndex: ["form_data", "song_name"],
      width: 150,
      fixed: "left",
      ellipsis: true,
    },
    {
      title: "风格大师",
      dataIndex: ["form_data", "master_id"],
      width: 120,
      render: (_, record) => {
        const masterId = record.form_data.master_id;
        if (!masterId) {
          return "无";
        }
        const master = MASTER_STYLE_CARDS.find((m) => m.id === masterId);
        return master ? master.name : masterId;
      },
    },
    {
      title: "语言",
      dataIndex: ["form_data", "song_language"],
      width: 100,
      render: (_, record) => {
        const language = SONG_LANGUAGE_OPTIONS.find(
          (item) =>
            String(item.value) === String(record.form_data.song_language)
        );
        return language?.label || record.form_data.song_language;
      },
    },
    {
      title: "风格",
      dataIndex: ["form_data", "song_style"],
      width: 100,
      render: (_, record) => {
        const style = SONG_STYLE_OPTIONS.find(
          (item) => String(item.value) === String(record.form_data.song_style)
        );
        return style?.label || record.form_data.song_style;
      },
    },
    {
      title: "贴近度",
      dataIndex: ["form_data", "closeness"],
      width: 100,
      render: (_, record) => {
        const closeness = record.form_data.closeness;
        const closenessOption = CLOSENESS_LEVEL_OPTIONS.find(
          (item) => String(item.value) === String(closeness)
        );
        return closenessOption?.label || `${closeness}级`;
      },
    },
    {
      title: "生成时间",
      dataIndex: "created_at",
      width: 180,
      valueType: "dateTime",
      sorter: true,
      defaultSortOrder: "descend",
    },
    {
      title: "操作",
      valueType: "option",
      width: 150,
      fixed: "right",
      render: (_, record) => [
        <Button
          key="view"
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
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
          <Button size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <Alert
        title="生成记录仅保存在本地设备，不会上传至服务器，更换设备或浏览器后记录将无法查看。"
        banner
        style={{ marginBottom: 24 }}
      />
      <ProTable<LyricsRecord>
        headerTitle="大师写歌词生成记录"
        columns={columns}
        actionRef={actionRef}
        request={fetchLyricsRecords}
        rowKey="id"
        search={false}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ x: "max-content" }}
        loading={loading}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => navigate("/lyrics-craft")}
          >
            创建新歌词
          </Button>,
        ]}
      />

      {/* 歌词详情Drawer */}
      {selectedRecord && (
        <LyricsRecordDetail
          record={selectedRecord}
          onClose={handleDrawerClose}
        />
      )}
    </PageContainer>
  );
};

export default LyricsRecordsPage;
