import { PageContainer } from '@ant-design/pro-components';
import { Card, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

const About: React.FC = () => {
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 使用fetch请求README.md内容
    const fetchReadme = async () => {
      try {
        const response = await fetch('/README.md');
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
