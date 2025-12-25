import { PageContainer } from '@ant-design/pro-components';
import { XMarkdown } from '@ant-design/x-markdown';
import { useModel } from '@umijs/max';
import { Card, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

// 构建时注入的CHANGELOG内容（通过构建脚本处理）
declare global {
  const __CHANGELOG_CONTENT__: string;
}

const ChangelogPage: React.FC = () => {
  const [changelogContent, setChangelogContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  // 获取全局初始状态，包含主题设置
  const { initialState } = useModel('@@initialState');
  // 根据主题设置确定XMarkdown的主题类
  const isDarkTheme = initialState?.settings?.navTheme === 'realDark';
  const markdownThemeClass = isDarkTheme
    ? 'x-markdown-dark'
    : 'x-markdown-light';

  useEffect(() => {
    // 开发环境：使用mock API获取内容
    // 生产环境：使用构建时注入的内容
    if (process.env.NODE_ENV === 'production') {
      // 生产环境：使用构建时注入的内容
      if (typeof __CHANGELOG_CONTENT__ !== 'undefined') {
        setChangelogContent(__CHANGELOG_CONTENT__);
        setLoading(false);
      } else {
        // 如果构建时注入失败，尝试从dist目录读取
        fetch('./changelog.md')
          .then((response) => response.text())
          .then((content) => {
            setChangelogContent(content);
            setLoading(false);
          })
          .catch(() => {
            setChangelogContent('# 更新记录\n\n暂无更新记录，请稍后查看。');
            setLoading(false);
          });
      }
    } else {
      // 开发环境：使用mock API
      const fetchChangelog = async () => {
        try {
          const response = await fetch('/api/changelog');
          if (response.ok) {
            const content = await response.text();
            setChangelogContent(content);
          } else {
            console.error('Failed to fetch changelog.md');
            setChangelogContent('# 更新记录\n\n暂无更新记录，请稍后查看。');
          }
        } catch (error) {
          console.error('Error fetching changelog.md:', error);
          setChangelogContent('# 更新记录\n\n暂无更新记录，请稍后查看。');
        } finally {
          setLoading(false);
        }
      };

      fetchChangelog();
    }
  }, []);

  return (
    <PageContainer title="更新记录">
      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <XMarkdown className={markdownThemeClass}>
            {changelogContent}
          </XMarkdown>
        )}
      </Card>
    </PageContainer>
  );
};

export default ChangelogPage;
