#!/usr/bin/env node
/**
 * 把 essentia.js 的 WASM 资源从 node_modules 复制到 public 目录
 * dev 服务器和 prod 都会从 public serve 静态资源。
 *
 * 复制内容：
 *   - essentia-wasm.web.js (WASM 加载器，UMD 版本，可在 Worker 中 importScripts)
 *   - essentia-wasm.web.wasm (WASM 二进制)
 *   - essentia.js-core.umd.js (Core API，UMD 版本)
 *   - essentia.js-core.umd.min.js (Core API，UMD 压缩版)
 */
const fs = require('node:fs');
const path = require('node:path');

const SRC = path.join(__dirname, '..', 'node_modules', 'essentia.js', 'dist');
const DEST = path.join(__dirname, '..', 'public', 'essentia-wasm');

const FILES_TO_COPY = [
  { src: 'essentia-wasm.web.js', dest: 'essentia-wasm.web.js' },
  { src: 'essentia-wasm.web.wasm', dest: 'essentia-wasm.web.wasm' },
  { src: 'essentia-wasm.web.wasm', dest: 'essentia-wasm.wasm' },
  { src: 'essentia-wasm.web.wasm', dest: 'essentia-wasm.es.wasm' },
  { src: 'essentia-wasm.umd.js', dest: 'essentia-wasm.umd.js' },
  { src: 'essentia.js-core.es.js', dest: 'essentia.js-core.es.js' },
  { src: 'essentia.js-core.umd.js', dest: 'essentia.js-core.umd.js' },
  { src: 'essentia.js-core.umd.min.js', dest: 'essentia.js-core.umd.min.js' },
  // ML 推理支持（使 Worker 中 importScripts 加载）
  { src: 'essentia.js-model.umd.js', dest: 'essentia.js-model.umd.js' },
  { src: 'essentia.js-model.umd.min.js', dest: 'essentia.js-model.umd.min.js' },
];

function copy() {
  // 检查源目录
  if (!fs.existsSync(SRC)) {
    console.warn('[essentia-copy] 源目录不存在:', SRC, '— 请先 pnpm install');
    return;
  }

  // 创建目标目录
  fs.mkdirSync(DEST, { recursive: true });

  let copied = 0;
  for (const { src, dest } of FILES_TO_COPY) {
    const srcPath = path.join(SRC, src);
    const destPath = path.join(DEST, dest);
    if (!fs.existsSync(srcPath)) {
      console.warn('[essentia-copy] 跳过（不存在）:', src);
      continue;
    }
    fs.copyFileSync(srcPath, destPath);
    copied++;
  }

  console.log(
    `[essentia-copy] 已复制 ${copied} 个 essentia.js 资源到 ${path.relative(process.cwd(), DEST)}/`,
  );
}

copy();
