import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Mock API：获取changelog.md文件内容
 */
export default {
  'GET /api/changelog': (req: any, res: any) => {
    try {
      // 读取changelog目录下的changelog.md文件
      const changelogPath = join(
        process.cwd(),
        'src/pages/changelog/changelog.md',
      );
      const content = readFileSync(changelogPath, 'utf-8');

      // 设置响应头
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');

      // 返回changelog.md内容
      res.send(content);
    } catch (error) {
      console.error('Error reading changelog.md:', error);
      res.status(500).send('无法读取changelog.md文件');
    }
  },
};
