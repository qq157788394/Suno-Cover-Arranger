import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { Typography } from 'antd';

const { Link } = Typography;

import React from 'react';
// 导入合并后的全局样式文件
import './index.css';

import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

// 移除了isDev变量，因为SettingDrawer现在在所有环境中都显示

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
}> {
  // 同步读取本地存储的主题配置，确保在应用程序启动时就被正确加载
  let savedSettings = null;
  try {
    savedSettings = localStorage.getItem('themeSettings');
  } catch (error) {
    console.error('Failed to read theme settings from localStorage:', error);
  }

  const themeSettings = savedSettings
    ? (JSON.parse(savedSettings) as Partial<LayoutSettings>)
    : (defaultSettings as Partial<LayoutSettings>);

  return {
    settings: themeSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    links: [
      <Link key="suno" target="_blank" href="https://suno.com/">
        Suno
      </Link>,
      <Link key="deepseek" target="_blank" href="https://chat.deepseek.com/">
        DeepSeek
      </Link>,
      <Link
        key="google-ai"
        target="_blank"
        href="https://aistudio.google.com/app/apikey"
      >
        Google AI Studio
      </Link>,
    ],
    actionsRender: () => {
      return [
        <Link
          key="bilibili"
          target="_blank"
          strong
          href="https://space.bilibili.com/421841720"
        >
          作者B站
        </Link>,
      ];
    },
    // 移除用户头像
    avatarProps: false,
    // 移除水印
    waterMarkProps: undefined,
    // 移除背景图片
    bgLayoutImgList: [],
    // 移除页脚
    footerRender: false,
    // 移除登录检查
    onPageChange: () => {},

    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              // 保存主题配置到本地存储
              try {
                localStorage.setItem('themeSettings', JSON.stringify(settings));
              } catch (error) {
                console.error(
                  'Failed to save theme settings to localStorage:',
                  error,
                );
              }

              // 更新initialState
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
            hideHintAlert={true}
            hideCopyButton={true}
            colorList={[
              { key: 'p站黄', color: '#ff9000', title: 'P站黄' },
              { key: 'techBlue', color: '#1677FF' },
              { key: 'daybreak', color: '#1890ff' },
              { key: 'dust', color: '#F5222D' },
              { key: 'volcano', color: '#FA541C' },
              { key: 'sunset', color: '#FAAD14' },
              { key: 'cyan', color: '#13C2C2' },
              { key: 'green', color: '#52C41A' },
              { key: 'geekblue', color: '#2F54EB' },
              { key: 'purple', color: '#722ED1' },
            ]}
          />
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  baseURL: 'https://proapi.azurewebsites.net',
  ...errorConfig,
};
