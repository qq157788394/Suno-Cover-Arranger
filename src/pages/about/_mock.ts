import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Mock API：获取README.md文件内容
 */
export default {
  'GET /api/readme': (req: any, res: any) => {
    try {
      // 读取项目根目录下的README.md文件
      const readmePath = join(process.cwd(), 'README.md');
      const content = readFileSync(readmePath, 'utf-8');

      // 设置响应头
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');

      // 返回README.md内容
      res.send(content);
    } catch (error) {
      console.error('Error reading README.md:', error);
      res.status(500).send('无法读取README.md文件');
    }
  },
};
