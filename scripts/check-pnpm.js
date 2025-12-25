#!/usr/bin/env node

// 检查是否使用pnpm作为包管理器
const fs = require('node:fs');
const path = require('node:path');

function checkPnpm() {
  // 检查是否存在pnpm-lock.yaml文件
  const pnpmLockPath = path.join(process.cwd(), 'pnpm-lock.yaml');

  if (!fs.existsSync(pnpmLockPath)) {
    console.error(
      '❌ 错误: 项目需要使用pnpm作为包管理器，请运行 "pnpm install" 来安装依赖。',
    );
    process.exit(1);
  }

  console.log('✅ 检查通过: 项目正在使用pnpm作为包管理器。');
}

checkPnpm();
