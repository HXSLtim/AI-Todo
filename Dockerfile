# ============================================
# 多阶段构建 Dockerfile for AI Todo App
# ============================================

# ============================================
# 阶段 1: 构建阶段 (Build Stage)
# ============================================
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
# 使用 npm ci 代替 npm install 以获得更快、更可靠的构建
RUN npm ci

# 复制项目所有文件
COPY . .

# 构建应用
# 注意：.env 文件不应包含在镜像中（由 .dockerignore 排除）
RUN npm run build

# ============================================
# 阶段 2: 生产阶段 (Production Stage)
# ============================================
FROM nginx:alpine

# 维护者信息
LABEL maintainer="your-email@example.com"
LABEL description="AI Todo Application with PWA support"

# 从构建阶段复制构建产物到 nginx 的静态文件目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制启动脚本并设置执行权限
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 暴露端口
EXPOSE 80

# 使用自定义启动脚本
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
