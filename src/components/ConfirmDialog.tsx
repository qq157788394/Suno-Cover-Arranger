import { Modal } from 'antd';
import React from 'react';

interface ConfirmDialogProps {
  /** 对话框标题 */
  title?: string;
  /** 对话框内容 */
  content?: React.ReactNode;
  /** 是否显示对话框 */
  visible: boolean;
  /** 确定按钮文本 */
  okText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 确定按钮类型 */
  okType?: 'primary' | 'default' | 'dashed' | 'text' | 'link' | 'danger';
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 是否显示遮罩 */
  mask?: boolean;
  /** 点击遮罩是否关闭对话框 */
  maskClosable?: boolean;
  /** 确认回调函数 */
  onConfirm: () => void | Promise<void>;
  /** 取消回调函数 */
  onCancel: () => void;
  /** 对话框宽度 */
  width?: number | string;
  /** 对话框样式 */
  style?: React.CSSProperties;
  /** 对话框内容样式 */
  contentStyle?: React.CSSProperties;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title = '确认操作',
  content = '确定要执行此操作吗？',
  visible,
  okText = '确定',
  cancelText = '取消',
  okType = 'primary',
  closable = true,
  mask = true,
  maskClosable = false,
  onConfirm,
  onCancel,
  width = 416,
  style,
  contentStyle,
}) => {
  // 处理确认操作，支持异步操作
  const handleOk = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('确认操作失败:', error);
    }
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      okType={okType}
      closable={closable}
      mask={mask}
      maskClosable={maskClosable}
      width={width}
      style={style}
    >
      <div style={contentStyle}>{content}</div>
    </Modal>
  );
};

export default ConfirmDialog;
