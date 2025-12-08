# Suno Cover Arranger - Suno封面编曲器

一个基于React和Ant Design Pro开发的Suno封面编曲器应用，提供三栏独立滚动布局，用于生成和管理Suno音乐封面和歌词。

## 功能特点

### 🔹 三栏独立滚动布局
- **左侧栏**：样式选择和配置
- **中间栏**：歌词编辑和管理
- **右侧栏**：生成结果预览
- 每个区域独立滚动，互不影响

### 🔹 自定义Header设计
- 集成Suno官方邀请链接
- 集成DeepSeek开放平台链接
- 简洁现代的导航设计

### 🔹 完整的封面生成流程
- 多种音乐风格选择
- 歌词编辑和格式化
- 实时预览生成结果
- 一键生成功能

### 🔹 技术特性
- 基于Ant Design Pro脚手架
- 使用React 18和TypeScript
- 响应式设计，适配不同屏幕尺寸
- 无页面级滚动，仅区域内局部滚动
- 清理了无用的脚手架文件

## 快速开始

### 环境准备

安装依赖：

```bash
npm install
```

### 启动项目

```bash
npm start
```

项目将在 http://localhost:8000 启动

### 构建项目

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

自动修复lint错误：

```bash
npm run lint:fix
```

## 项目结构

```
src/
├── pages/
│   └── suno-cover/          # 主页面组件
├── components/              # 公共组件
├── App.tsx                  # 应用入口
└── global.tsx              # 全局样式
```

## 核心功能说明

### 1. 样式选择
- 提供多种预设音乐风格
- 可自定义封面参数
- 实时预览样式效果

### 2. 歌词编辑
- 支持段落式歌词编辑
- 自动格式化歌词结构
- 实时预览歌词效果

### 3. 结果生成
- 一键生成完整封面
- 支持结果预览和复制
- 提供生成历史记录

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

项目地址：https://github.com/qq157788394/Suno-Cover-Arranger.git
