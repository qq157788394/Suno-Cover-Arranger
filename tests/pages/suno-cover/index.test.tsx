// Jest全局变量会自动注入，无需显式导入
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SunoCover from '@/pages/suno-cover';
import { generateUserPrompt } from '@/services/deepseek';

// 模拟deepseek服务
jest.mock('@/services/deepseek', () => ({
  generateUserPrompt: jest.fn(),
}));

describe('SunoCover Component', () => {
  beforeEach(() => {
    // 清空所有mock调用
    jest.clearAllMocks();

    // 模拟localStorage
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn().mockReturnValue(null);
  });

  it('should render the component with correct title', () => {
    render(<SunoCover />);

    // 检查页面标题
    expect(screen.getByText('翻唱设置')).toBeInTheDocument();

    // 检查主要按钮是否存在
    expect(screen.getByText('生成提示词')).toBeInTheDocument();
    expect(screen.getByText('模拟提示词')).toBeInTheDocument();
  });

  it('should display error message when submitting empty form', async () => {
    render(<SunoCover />);

    // 点击生成提示词按钮
    fireEvent.click(screen.getByText('生成提示词'));

    // 检查是否显示错误信息
    await waitFor(() => {
      expect(screen.getByText('请输入API密钥')).toBeInTheDocument();
      expect(screen.getByText('请输入目标翻唱艺术家')).toBeInTheDocument();
      expect(screen.getByText('请输入原始歌词')).toBeInTheDocument();
    });
  });

  it('should call generateUserPrompt when form is submitted with valid data', async () => {
    // 模拟generateUserPrompt返回值
    (generateUserPrompt as jest.Mock).mockReturnValue('Test prompt');

    render(<SunoCover />);

    // 填写表单数据
    fireEvent.change(screen.getByLabelText('API密钥'), {
      target: { value: 'test-api-key' },
    });

    fireEvent.change(screen.getByLabelText('目标翻唱艺术家'), {
      target: { value: 'Test Artist' },
    });

    fireEvent.change(screen.getByLabelText('原始歌词'), {
      target: { value: 'Test lyrics' },
    });

    // 点击生成提示词按钮
    fireEvent.click(screen.getByText('生成提示词'));

    // 检查generateUserPrompt是否被调用
    await waitFor(() => {
      expect(generateUserPrompt).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle mock generation button click', async () => {
    render(<SunoCover />);

    // 点击模拟提示词按钮
    fireEvent.click(screen.getByText('模拟提示词'));

    // 检查是否显示模拟结果
    await waitFor(() => {
      expect(
        screen.getByText('Styles（可直接复制投喂Suno）'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Lyrics（可直接复制投喂Suno）'),
      ).toBeInTheDocument();
    });
  });

  it('should handle copy to clipboard functionality', async () => {
    // 模拟navigator.clipboard.writeText
    navigator.clipboard.writeText = jest.fn().mockResolvedValue(true);

    render(<SunoCover />);

    // 先点击模拟提示词按钮生成内容
    fireEvent.click(screen.getByText('模拟提示词'));

    // 等待模拟结果生成
    await waitFor(() => {
      expect(
        screen.getByText('Styles（可直接复制投喂Suno）'),
      ).toBeInTheDocument();
    });

    // 点击复制Styles按钮
    const copyStylesButton = screen.getByText('复制 Styles');
    fireEvent.click(copyStylesButton);

    // 检查复制函数是否被调用
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });
  });
});
