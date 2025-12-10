import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// 导入合并后的全局样式文件
import './index.css';

// Umi项目不需要手动导入App组件，Umi会自动处理应用入口

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Umi会自动渲染应用内容 */}
    <div id="root-content"></div>
  </StrictMode>,
);
