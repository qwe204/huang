 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index 874104bd565d53e3c10d4bfcf0f82861ec9dfd99..7807267b66750f38c2e5b3e0edde7f9ba1a699ce 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,51 @@
-# huang
\ No newline at end of file
+# Galaxy Kylin Office Web Component
+
+一个面向银河麒麟（及其他 Linux / Windows / macOS）浏览器环境的跨平台办公文档在线预览组件。设计参考 `pdf.js` 的浏览器端渲染思想，以及 `ranuts/document` 的多格式前端处理思路。
+
+## 核心能力
+
+- **无需服务器端转换**：解析、预览、编辑、导出都在浏览器完成。
+- **无需安装后端服务**：静态页面直接可运行。
+- **可嵌入现有网页**：通过 Web Component（Shadow DOM）避免样式冲突。
+- **即开即用**：页面打开即可导入并编辑本地文档。
+- **双语界面**：中文 / English 可切换。
+- **本地隐私安全**：文件不上传服务器。
+
+## 支持格式
+
+- PDF：预览（只读）
+- DOCX：转换为 HTML 后编辑，导出 HTML
+- XLSX：表格编辑，导出 XLSX
+- TXT / MD / CSV：文本编辑，导出文本
+
+## 代码架构
+
+```txt
+src/
+├─ core/
+│  └─ file-handlers.js     # 文档加载/导出与格式适配
+├─ ui/
+│  └─ template.js          # 组件模板与样式
+├─ i18n.js                 # 中英文本地化文案
+├─ galaxy-doc-viewer.js    # Web Component 主逻辑
+└─ main.js                 # 入口
+```
+
+## 快速运行
+
+```bash
+python3 -m http.server 4173
+```
+
+然后打开 `http://localhost:4173`。
+
+## 嵌入方式
+
+```html
+<galaxy-doc-viewer style="height: 100vh"></galaxy-doc-viewer>
+<script type="module" src="/src/main.js"></script>
+```
+
+## 隐私说明
+
+所有文档处理在浏览器本地进行；仅在首次解析不同格式时，从 CDN 加载对应解析库（pdf.js/mammoth/xlsx）。
 
EOF
)
