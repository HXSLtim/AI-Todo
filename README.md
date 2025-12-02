# AI Todo 应用

一个现代化的、支持AI的待办事项管理应用，使用React、TypeScript、Vite和PWA技术构建。

## 功能特性

- ✅ **AI智能建议**：利用AI生成任务建议和自动分类
- 📱 **PWA支持**：可安装为桌面/移动应用，离线可用
- 🌐 **多语言支持**：内置国际化（i18n）
- 🎨 **现代化UI**：响应式设计，美观的界面
- 🔊 **声音反馈**：任务完成时有声音提示
- 📦 **本地存储**：数据保存在浏览器本地存储
- ⚡ **快速启动**：基于Vite的极速开发体验

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: CSS Modules / Tailwind（根据项目实际）
- **状态管理**: React Hooks
- **PWA**: Workbox + Service Worker
- **国际化**: i18next
- **代码质量**: ESLint + Prettier + TypeScript严格模式

## 快速开始

### 环境要求

- Node.js 18+ 或更高版本
- npm 或 yarn 或 pnpm

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/HXSLtim/AI-Todo.git
   cd AI-Todo
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或使用 yarn
   yarn
   # 或使用 pnpm
   pnpm install
   ```

3. **配置环境变量**
   - 复制 `.env.example` 为 `.env`（如果存在）
   - 如果没有，创建 `.env` 文件并添加必要的API密钥
   - **注意**: `.env` 文件已加入.gitignore，不会提交到版本控制

4. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   ```

5. **打开浏览器**
   - 访问 `http://localhost:5173`（默认端口）

## 构建与部署

### 开发构建
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

### 部署到腾讯 EdgeOne

腾讯 EdgeOne 是一个边缘计算平台，支持静态网站托管和边缘函数。以下是部署步骤：

#### 1. 构建项目
```bash
npm run build
```
构建后的文件位于 `dist/` 目录。

#### 2. 配置 EdgeOne 环境变量
EdgeOne 支持在部署设置中注入环境变量。为了确保应用能正确读取，请配置以下变量：

- `OPENAI_API_KEY`: 你的 OpenAI API 密钥（或其他兼容的 API 密钥）
- `OPENAI_BASE_URL`: API 基础地址（默认为 `https://api.openai.com/v1`）
- `OPENAI_MODEL_NAME`: 模型名称（默认为 `gpt-4o-mini`）

**重要**：如果环境变量在构建后不可用，应用还支持通过全局变量 `window.ENV` 注入。你可以在 EdgeOne 的 HTML 注入功能中添加以下脚本：

```html
<script>
  window.ENV = {
    OPENAI_API_KEY: '你的密钥',
    OPENAI_BASE_URL: 'https://api.openai.com/v1',
    OPENAI_MODEL_NAME: 'gpt-4o-mini'
  };
</script>
```

#### 3. 上传到 EdgeOne
- 登录 [腾讯云 EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
- 创建一个静态网站托管服务
- 将 `dist/` 目录下的所有文件上传到根目录
- 配置自定义域名（可选）
- 启用 HTTPS

#### 4. 解决跨域问题（CORS）
如果 AI 功能因跨域问题无法正常工作（浏览器控制台显示 CORS 错误），请按以下步骤解决：

- **方案一：使用代理**
  将 `OPENAI_BASE_URL` 设置为相对路径 `/api/proxy`，并在 EdgeOne 上配置一个边缘函数作为代理。
  应用已内置代理支持：如果 `OPENAI_BASE_URL` 以 `/` 开头，会自动补全为当前域名下的绝对路径。

- **方案二：配置边缘函数**
  在 EdgeOne 控制台中创建一个边缘函数，将 `/api/proxy` 路径的请求转发到 `https://api.openai.com/v1`（或你使用的其他 API 服务）。
  示例边缘函数代码（JavaScript）：
  ```javascript
  async function handleRequest(request) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/proxy')) {
      const targetUrl = 'https://api.openai.com/v1' + url.pathname.replace('/api/proxy', '');
      const modifiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
      // 添加必要的 API 密钥头
      modifiedRequest.headers.set('Authorization', 'Bearer ' + env.OPENAI_API_KEY);
      return fetch(modifiedRequest);
    }
    return fetch(request);
  }
  ```

- **方案三：启用 API 服务的 CORS**
  如果你使用的是支持 CORS 的 API 服务（如某些兼容 OpenAI 的代理），请确保其响应头包含 `Access-Control-Allow-Origin: *`。

#### 5. 验证部署
访问你的 EdgeOne 域名，确保应用正常运行。如果 AI 功能无法使用，请检查浏览器控制台是否有关于 API 密钥的错误。

### 部署到 GitHub Pages（备用）
```bash
npm run deploy
```

## 项目结构

```
AI-Todo/
├── public/              # 静态资源
├── src/
│   ├── components/      # React组件
│   │   ├── InputSection.tsx   # 输入区域
│   │   ├── TaskList.tsx       # 任务列表
│   │   └── LayoutWrapper.tsx  # 布局包装器
│   ├── services/        # 服务层
│   │   └── aiService.ts # AI服务
│   ├── utils/          # 工具函数
│   │   └── sound.ts    # 声音工具
│   ├── App.tsx         # 主应用组件
│   ├── index.tsx       # 应用入口
│   └── i18n.ts         # 国际化配置
├── .env                # 环境变量（本地）
├── .gitignore          # Git忽略文件
├── index.html          # HTML入口
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript配置
├── vite.config.ts      # Vite配置
├── metadata.json       # PWA元数据
└── README.md           # 项目说明
```

## 开发指南

### 添加新功能
1. 创建功能分支：`git checkout -b feature/your-feature`
2. 开发并测试
3. 提交更改：`git commit -m "feat: 描述你的功能"`
4. 推送到远程：`git push origin feature/your-feature`
5. 创建Pull Request

### 代码规范
- 使用TypeScript严格模式
- 遵循ESLint规则
- 使用Prettier格式化代码
- 组件使用PascalCase命名
- 函数使用camelCase命名

### 测试
```bash
# 运行测试
npm test

# 运行测试并监听变化
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage
```

## 贡献指南

1. Fork本仓库
2. 创建你的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'feat: 添加某个功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个Pull Request

## 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目仓库：[https://github.com/HXSLtim/AI-Todo](https://github.com/HXSLtim/AI-Todo)
- 问题反馈：[GitHub Issues](https://github.com/HXSLtim/AI-Todo/issues)

## 更新日志

### v1.0.0 (初始版本)
- 初始项目结构
- 基础待办事项功能
- AI集成支持
- PWA配置
- 多语言支持
- 声音反馈系统