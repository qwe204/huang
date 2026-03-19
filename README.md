# 面向银河麒麟环境的跨平台办公文档在线预览 Web 组件

基于 OnlyOffice 的办公文档在线预览 Web 组件，支持 Word/Excel/PPT/PDF/WPS 等常用格式，面向银河麒麟国产操作系统，提供文档预览、在线编辑涂画、缩略图、缩放控制等功能，可作为标准 Web Component 嵌入任意网页。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vue 3 + Element Plus + TypeScript + Vite |
| 后端 | Node.js + Express + SQLite |
| 文档引擎 | OnlyOffice Document Server |
| 容器化 | Docker + Docker Compose |
| 反向代理 | Nginx |

## 功能特性

- **多格式兼容**：Word (.docx/.doc) / Excel (.xlsx/.xls) / PPT (.pptx/.ppt) / PDF / WPS (.wps/.et/.dps)
- **文档预览**：高保真渲染，保持原始格式排版
- **在线编辑涂画**：编辑模式切换，文字修改、批注、涂画标注
- **文件上传**：拖拽或点击选择本地文件上传预览
- **文件下载**：下载原始文档或编辑后版本
- **缩略图**：侧边栏页面缩略图，点击跳转
- **缩放控制**：放大/缩小/适应宽度/适应页面，键盘快捷键
- **Web Component**：`<doc-preview>` 标签，可嵌入任意网页
- **Docker 部署**：一键部署，支持银河麒麟 V10 (x86_64/aarch64)

## 快速开始

### Docker 部署（推荐）

```bash
# 1. 配置环境变量
cp .env.example .env
# 修改 .env 中的 JWT_SECRET

# 2. 一键启动
docker-compose up -d

# 3. 访问系统
# 主页面: http://localhost
# 演示页面: http://localhost/demo/
```

### 本地开发

```bash
# 后端
cd server
npm install
npm run dev

# 前端
cd web-component
npm install
npm run dev
```

## Web Component 使用方式

```html
<!-- 引入组件 -->
<script src="http://your-server/assets/doc-preview.js"></script>

<!-- 上传模式 -->
<doc-preview mode="upload" height="600px"></doc-preview>

<!-- 预览模式 -->
<doc-preview src="/api/files/FILE_ID" mode="view"></doc-preview>

<!-- 编辑模式 -->
<doc-preview src="/api/files/FILE_ID" mode="edit"></doc-preview>
```

### 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | string | - | 文档 URL 或文件 ID |
| mode | string | upload | view / edit / upload |
| show-toolbar | boolean | true | 是否显示工具栏 |
| width | string | 100% | 组件宽度 |
| height | string | 600px | 组件高度 |

## 项目结构

```
├── docker-compose.yml        # Docker 编排
├── .env                      # 环境变量
├── nginx/                    # Nginx 配置
├── server/                   # Node.js 后端
│   └── src/
│       ├── app.js            # Express 入口
│       ├── routes/           # 路由（upload/files/editor/callback）
│       ├── services/         # 服务（database/fileService/onlyoffice）
│       └── middleware/       # 中间件（校验/错误处理）
├── web-component/            # Vue 3 前端
│   └── src/
│       ├── App.vue           # 主应用
│       ├── components/       # 组件（FileManager/DocViewer/DocPreviewElement）
│       ├── services/         # API 服务
│       └── styles/           # 样式
├── demo/                     # 演示页面
├── docs/                     # 项目文档
└── scripts/                  # 部署脚本
```

## 银河麒麟兼容性

- 支持银河麒麟 V10 Desktop / Server
- 支持 x86_64 和 aarch64 (飞腾/鲲鹏) 架构
- 适配奇安信浏览器（Chromium 内核）和 Firefox
- Docker 容器内预装中文字体
- 全链路 UTF-8 编码
