/**
 * 歌词记录详情组件
 * 展示歌词生成记录的详细信息，包括表单数据和生成的歌词
 */

import { CopyOutlined } from "@ant-design/icons";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import { XMarkdown } from "@ant-design/x-markdown";
import {
  Button,
  Drawer,
  message,
  Space,
  Typography,
  Divider,
  Segmented,
} from "antd";
import React from "react";
import { MASTER_STYLE_CARDS } from "@/config/masterStyleConfig";
import {
  CLOSENESS_LEVEL_OPTIONS,
  CREATION_MODE_OPTIONS,
  PERSONA_OPTIONS,
  RHYME_TYPE_OPTIONS,
  SONG_LANGUAGE_OPTIONS,
  SONG_STYLE_OPTIONS,
  SONG_STRUCTURE_OPTIONS,
  WORDING_STYLE_OPTIONS,
} from "@/config/lyricsEnums";
import { useModel } from "@umijs/max";
import type { LyricsRecord } from "@/shared/types/types";

const { Paragraph, Text } = Typography;

interface LyricsRecordDetailProps {
  record: LyricsRecord;
  onClose: () => void;
}

const LyricsRecordDetail: React.FC<LyricsRecordDetailProps> = ({
  record,
  onClose,
}) => {
  const { initialState } = useModel("@@initialState");

  // 根据主题设置确定XMarkdown的主题类
  const isDarkTheme = initialState?.settings?.navTheme === "realDark";
  const markdownThemeClass = isDarkTheme
    ? "markdown-body-dark"
    : "markdown-body-light";

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("复制成功");
    } catch (_error) {
      message.error("复制失败");
    }
  };

  const getMasterInfo = (masterId: string | undefined) => {
    if (!masterId) {
      return undefined;
    }
    return MASTER_STYLE_CARDS.find((m) => m.id === masterId);
  };

  if (!record) {
    return (
      <Drawer
        title="歌词生成详情"
        placement="right"
        open={true}
        size={992}
        onClose={onClose}
      >
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          记录不存在
        </div>
      </Drawer>
    );
  }

  const masterInfo = getMasterInfo(record.form_data.master_id);

  // Segmented选项
  const segmentedOptions = [
    { label: "基本信息", value: "basic-info" },
    { label: "大师歌词", value: "generated-lyrics" },
    { label: "原始素材", value: "raw-material" },
    { label: "参考歌词", value: "reference-lyrics" },
    { label: "创作参数", value: "creation-parameters" },
  ];

  // 当前选中的Segmented项
  const [activeItem, setActiveItem] = React.useState<string>("basic-info");

  // 滚动到指定元素
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // 获取当前Drawer的滚动容器
      const currentDrawer = element.closest(".ant-drawer");
      if (currentDrawer) {
        const drawerContent = currentDrawer.querySelector(".ant-drawer-body");
        if (drawerContent instanceof HTMLElement) {
          // 计算滚动位置，考虑到顶部边距
          const elementTop = element.offsetTop - 57 - 24;
          drawerContent.scrollTo({
            top: elementTop,
            behavior: "smooth",
          });
        }
      }
    }
  };

  // 监听滚动事件，自动更新activeItem
  React.useEffect(() => {
    // 获取当前Drawer的滚动容器
    const basicInfoElement = document.getElementById("basic-info");
    if (!basicInfoElement) return;

    const currentDrawer = basicInfoElement.closest(".ant-drawer");
    if (!currentDrawer) return;

    const drawerContent = currentDrawer.querySelector(".ant-drawer-body");
    if (!(drawerContent instanceof HTMLElement)) return;

    const handleScroll = () => {
      const scrollPosition = drawerContent.scrollTop + 50;

      // 检查每个内容区域的位置
      for (const option of segmentedOptions) {
        const element = document.getElementById(option.value);
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveItem(option.value);
            break;
          }
        }
      }
    };

    // 添加滚动事件监听
    drawerContent.addEventListener("scroll", handleScroll);

    // 清理函数
    return () => {
      drawerContent.removeEventListener("scroll", handleScroll);
    };
  }, [segmentedOptions]);

  return (
    <Drawer
      title="歌词生成详情"
      placement="right"
      open={true}
      size={992}
      onClose={onClose}
      extra={
        <Segmented
          options={segmentedOptions}
          value={activeItem}
          onChange={(value) => {
            setActiveItem(value);
            scrollToElement(value);
          }}
        />
      }
    >
      <ProDescriptions id="basic-info" column={2} title="基本信息">
        <ProDescriptions.Item label="歌曲名称">
          {record.form_data.song_name}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="歌曲语言">
          {SONG_LANGUAGE_OPTIONS.find(
            (item) =>
              String(item.value) === String(record.form_data.song_language)
          )?.label || record.form_data.song_language}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="大师风格">
          {masterInfo ? (
            <Space>
              <Text>{masterInfo.name}</Text>
              <Text type="secondary">{masterInfo.description}</Text>
            </Space>
          ) : (
            <Text>无</Text>
          )}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="歌曲风格">
          {SONG_STYLE_OPTIONS.find(
            (item) => String(item.value) === String(record.form_data.song_style)
          )?.label || record.form_data.song_style}
        </ProDescriptions.Item>
      </ProDescriptions>

      <Divider />

      <ProCard
        id="generated-lyrics"
        title="大师歌词"
        ghost
        extra={
          <Button
            size="small"
            type="text"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(record.ai_result.lyrics)}
          >
            复制歌词
          </Button>
        }
      >
        <XMarkdown className={markdownThemeClass} config={{ breaks: true }}>
          {record.ai_result.lyrics}
        </XMarkdown>
      </ProCard>

      <Divider />

      <ProCard id="raw-material" title="原始素材" ghost>
        <XMarkdown className={markdownThemeClass} config={{ breaks: true }}>
          {record.form_data.raw_material}
        </XMarkdown>
      </ProCard>

      <Divider />

      <ProCard id="reference-lyrics" title="参考歌词" ghost>
        <XMarkdown className={markdownThemeClass} config={{ breaks: true }}>
          {record.form_data.reference_lyrics || "无"}
        </XMarkdown>
      </ProCard>

      <Divider />

      <ProDescriptions id="creation-parameters" column={2} title="创作参数">
        <ProDescriptions.Item label="参考歌词" span={2}></ProDescriptions.Item>
        <ProDescriptions.Item label="措辞要求">
          {Array.isArray(record.form_data.wording_style)
            ? record.form_data.wording_style
                .map(
                  (style) =>
                    WORDING_STYLE_OPTIONS.find(
                      (item) => String(item.value) === String(style)
                    )?.label || style
                )
                .join("、")
            : record.form_data.wording_style || "无"}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="贴近度">
          {CLOSENESS_LEVEL_OPTIONS.find(
            (item) => String(item.value) === String(record.form_data.closeness)
          )?.label || `${record.form_data.closeness}`}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="创作模式">
          {CREATION_MODE_OPTIONS.find(
            (item) =>
              String(item.value) === String(record.form_data.creation_mode)
          )?.label || record.form_data.creation_mode}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="曲式结构">
          {SONG_STRUCTURE_OPTIONS.find(
            (item) =>
              String(item.value) === String(record.form_data.song_structure)
          )?.label || record.form_data.song_structure}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="叙事人设">
          {PERSONA_OPTIONS.find(
            (item) => String(item.value) === String(record.form_data.persona)
          )?.label || record.form_data.persona}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="押韵类型">
          {RHYME_TYPE_OPTIONS.find(
            (item) => String(item.value) === String(record.form_data.rhyme_type)
          )?.label || record.form_data.rhyme_type}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="输出数量">
          {record.form_data.output_count}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="AI模型">
          {record.ai_result.model}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="生成时间">
          {new Date(record.created_at).toLocaleString("zh-CN")}
        </ProDescriptions.Item>
      </ProDescriptions>
    </Drawer>
  );
};

export default LyricsRecordDetail;
