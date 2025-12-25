const fs = require('node:fs');
const path = require('node:path');

/**
 * 构建时预处理脚本：将README.md和changelog.md内容注入到生产版本中
 * 这个脚本会在构建完成后运行，将markdown内容注入到生成的HTML文件中
 */

function injectMarkdownContent() {
  const readmePath = path.join(process.cwd(), 'README.md');
  const changelogPath = path.join(
    process.cwd(),
    'src/pages/changelog/changelog.md',
  );
  const distPath = path.join(process.cwd(), 'dist');
  const indexPath = path.join(distPath, 'index.html');

  try {
    // 读取README.md内容
    const readmeContent = fs.readFileSync(readmePath, 'utf-8');

    // 读取changelog.md内容
    const changelogContent = fs.readFileSync(changelogPath, 'utf-8');

    // 读取生成的index.html
    let indexContent = fs.readFileSync(indexPath, 'utf-8');

    // 将README和changelog内容作为全局变量注入到HTML中
    const injectScript = `
      <script>
        // 构建时注入的README内容
        window.__README_CONTENT__ = ${JSON.stringify(readmeContent)};
        // 构建时注入的CHANGELOG内容
        window.__CHANGELOG_CONTENT__ = ${JSON.stringify(changelogContent)};
      </script>
    `;

    // 在</body>标签前注入脚本
    indexContent = indexContent.replace('</body>', `${injectScript}\n</body>`);

    // 写回文件
    fs.writeFileSync(indexPath, indexContent, 'utf-8');

    console.log('✅ README.md和changelog.md内容已成功注入到生产版本中');
  } catch (error) {
    console.error('❌ 注入markdown内容失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  injectMarkdownContent();
}

module.exports = injectMarkdownContent;
