import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { Button } from 'antd';
import React from 'react';

import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import '@ant-design/v5-patch-for-react-19';

// 移除了isDev变量，因为SettingDrawer现在在所有环境中都显示

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
}> {
  // 直接返回设置，不进行登录检查
  return {
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    actionsRender: () => [
      <Button
        key="suno"
        type="link"
        href="https://suno.com/invite/@ahuangzhuo"
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginRight: 16, padding: 0 }}
      >
        Suno
      </Button>,
      <Button
        key="deepseek"
        type="link"
        href="https://platform.deepseek.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ padding: 0 }}
      >
        DeepSeek开放平台
      </Button>,
    ],
    // 移除用户头像
    avatarProps: false,
    // 移除水印
    waterMarkProps: false,
    // 移除背景图片
    bgLayoutImgList: [],
    // 移除页脚
    footerRender: false,
    // 移除登录检查
    onPageChange: () => {},
    links: [],
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
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
            hideHintAlert={true}
            hideCopyButton={true}
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
