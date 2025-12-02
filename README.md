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

### 部署到GitHub Pages
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