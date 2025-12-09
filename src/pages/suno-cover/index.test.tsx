import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { callDeepSeekAPI } from '@/services/deepseek';
import { mockGenerate } from '@/services/mockData';
import SunoCover from './index';

// Mock the services
jest.mock('@/services/deepseek');
jest.mock('@/services/mockData');

// Mock antd message
jest.mock('antd/es/message', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
  writable: true,
});

describe('SunoCover Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('should render correctly', () => {
    render(<SunoCover />);

    // Check if the component renders with the correct title
    expect(screen.getByText('翻唱设置')).toBeInTheDocument();
    expect(screen.getByText('生成提示词')).toBeInTheDocument();
    expect(screen.getByText('模拟提示词')).toBeInTheDocument();
    expect(
      screen.getByText('Styles（可直接复制投喂Suno）'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Lyrics（可直接复制投喂Suno）'),
    ).toBeInTheDocument();
  });

  it('should show loading state when generating', async () => {
    // Mock the API call to return after a delay
    (callDeepSeekAPI as jest.Mock).mockResolvedValue({
      styles: 'Test styles',
      lyrics: 'Test lyrics',
    });

    // Set API Key in localStorage
    localStorageMock.setItem('deepseekApiKey', 'test-api-key');

    render(<SunoCover />);

    // Fill in the required fields
    const targetArtistInput = screen.getByPlaceholderText(
      '例如：张惠妹、陈奕迅、周杰伦……',
    );
    fireEvent.change(targetArtistInput, { target: { value: 'Test Artist' } });

    const lyricsInput = screen.getByPlaceholderText(
      '请输入歌词，自行用任意标签划分段落，如：【主歌】、【副歌】、[Verse]、[Chorus] 等',
    );
    fireEvent.change(lyricsInput, { target: { value: '[Verse] Test lyrics' } });

    // Submit the form
    const generateButton = screen.getByText('生成提示词');
    fireEvent.click(generateButton);

    // Check if loading state is shown
    expect(screen.getByText('生成中，请耐心等待')).toBeInTheDocument();

    // Wait for the API call to complete
    await waitFor(() => {
      expect(callDeepSeekAPI).toHaveBeenCalled();
    });
  });

  it('should handle mock generation correctly', async () => {
    // Mock the mockGenerate function
    (mockGenerate as jest.Mock).mockResolvedValue({
      styles: 'Mock styles',
      lyrics: 'Mock lyrics',
    });

    render(<SunoCover />);

    // Click the mock generate button
    const mockButton = screen.getByText('模拟提示词');
    fireEvent.click(mockButton);

    // Wait for the mock generation to complete
    await waitFor(() => {
      expect(mockGenerate).toHaveBeenCalled();
    });

    // Check if the results are displayed
    await waitFor(() => {
      expect(screen.getByDisplayValue('Mock styles')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Mock lyrics')).toBeInTheDocument();
    });
  });

  it('should copy text to clipboard', async () => {
    render(<SunoCover />);

    // Set some mock results
    const stylesTextArea = screen.getAllByRole(
      'textbox',
    )[3] as HTMLTextAreaElement;
    fireEvent.change(stylesTextArea, {
      target: { value: 'Test styles to copy' },
    });

    // Click the copy button
    const copyButton = screen.getAllByText('复制')[0];
    fireEvent.click(copyButton);

    // Check if clipboard.writeText was called
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'Test styles to copy',
      );
    });
  });

  it('should add and remove reference songs', () => {
    render(<SunoCover />);

    // Check initial state - 1 reference song field
    const songTitleInputs = screen.getAllByPlaceholderText('歌曲名');
    expect(songTitleInputs).toHaveLength(1);

    // Add a reference song
    const addButton = screen.getByText('添加参考歌曲');
    fireEvent.click(addButton);

    // Check if a new field was added
    const songTitleInputsAfterAdd = screen.getAllByPlaceholderText('歌曲名');
    expect(songTitleInputsAfterAdd).toHaveLength(2);

    // Remove the added song
    const removeButtons = screen.getAllByText('删除');
    fireEvent.click(removeButtons[1]);

    // Check if the field was removed
    const songTitleInputsAfterRemove = screen.getAllByPlaceholderText('歌曲名');
    expect(songTitleInputsAfterRemove).toHaveLength(1);
  });
});
