import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';
import Markdown from 'react-markdown';

// 直接导入README.md文件内容
import readmeContent from '../../../README.md';

const About: React.FC = () => {
  return (
    <PageContainer title="项目介绍">
      <Card>
        <Markdown>{readmeContent}</Markdown>
      </Card>
    </PageContainer>
  );
};

export default About;
