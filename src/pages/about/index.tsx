import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

const About: React.FC = () => {
  const [readmeContent, setReadmeContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadme = async () => {
      try {
        const response = await fetch('/README.md');
        const content = await response.text();
        setReadmeContent(content);
      } catch (error) {
        console.error('Failed to fetch README:', error);
        setReadmeContent('# 项目介绍\n\n未能加载项目介绍内容，请稍后重试。');
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, []);

  if (loading) {
    return (
      <PageContainer title="项目介绍">
        <Card loading />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="项目介绍">
      <Card>
        <Markdown>{readmeContent}</Markdown>
      </Card>
    </PageContainer>
  );
};

export default About;
