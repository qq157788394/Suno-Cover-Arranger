import { PageContainer } from '@ant-design/pro-components';
import { Card, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

// 构建时注入的README内容（通过构建脚本处理）
declare global {
  const __README_CONTENT__: string;
}

const About: React.FC = () => {
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 开发环境：使用mock API获取内容
    // 生产环境：使用构建时注入的内容
    if (process.env.NODE_ENV === 'production') {
      // 生产环境：使用构建时注入的内容
      if (typeof __README_CONTENT__ !== 'undefined') {
        setReadmeContent(__README_CONTENT__);
        setLoading(false);
      } else {
        // 如果构建时注入失败，尝试从dist目录读取
        fetch('./README.md')
          .then((response) => response.text())
          .then((content) => {
            setReadmeContent(content);
            setLoading(false);
          })
          .catch(() => {
            setReadmeContent('# 项目介绍\n\n无法加载README.md内容');
            setLoading(false);
          });
      }
    } else {
      // 开发环境：使用mock API
      const fetchReadme = async () => {
        try {
          const response = await fetch('/api/readme');
          if (response.ok) {
            const content = await response.text();
            setReadmeContent(content);
          } else {
            console.error('Failed to fetch README.md');
            setReadmeContent('# 项目介绍\n\n无法加载README.md内容');
          }
        } catch (error) {
          console.error('Error fetching README.md:', error);
          setReadmeContent('# 项目介绍\n\n无法加载README.md内容');
        } finally {
          setLoading(false);
        }
      };

      fetchReadme();
    }
  }, []);

  return (
    <PageContainer title="项目介绍">
      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Markdown>{readmeContent}</Markdown>
        )}
      </Card>
    </PageContainer>
  );
};

export default About;
