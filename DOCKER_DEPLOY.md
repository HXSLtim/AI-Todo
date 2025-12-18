# Docker 部署指南

本文档提供 AI Todo 应用的 Docker 部署详细说明。

## 📋 目录

- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [详细部署步骤](#详细部署步骤)
- [配置说明](#配置说明)
- [常见问题](#常见问题)
- [高级配置](#高级配置)

## 🔧 环境要求

在开始之前,请确保已安装以下软件:

- **Docker**: 20.10.0 或更高版本
- **Docker Compose**: 1.29.0 或更高版本 (可选,推荐使用)

### 安装 Docker

#### Windows 11
```powershell
# 下载并安装 Docker Desktop for Windows
# https://www.docker.com/products/docker-desktop/

# 验证安装
docker --version
docker-compose --version
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# CentOS/RHEL
sudo yum install docker docker-compose

# 验证安装
docker --version
docker-compose --version
```

#### macOS
```bash
# 下载并安装 Docker Desktop for Mac
# https://www.docker.com/products/docker-desktop/

# 验证安装
docker --version
docker-compose --version
```

## 🚀 快速开始

### 方式一: 使用 Docker Compose (推荐)

这是最简单的方式,只需一条命令即可完成构建和部署:

```powershell
# 1. 克隆或进入项目目录
cd c:\Users\a2778\Desktop\code\Todo

# 2. 构建并启动容器
docker-compose up -d --build

# 3. 访问应用
# 打开浏览器访问: http://localhost:8080
```

### 方式二: 使用 Docker 命令

如果不使用 Docker Compose,可以手动构建和运行:

```powershell
# 1. 构建镜像
docker build -t ai-todo:latest .

# 2. 运行容器
docker run -d `
  --name ai-todo-app `
  -p 8080:80 `
  --restart unless-stopped `
  ai-todo:latest

# 3. 访问应用
# 打开浏览器访问: http://localhost:8080
```

## 📝 详细部署步骤

### 步骤 1: 准备项目文件

确保项目目录包含以下 Docker 相关文件:

```
Todo/
├── Dockerfile              # Docker 镜像构建文件
├── docker-compose.yml      # Docker Compose 编排文件
├── .dockerignore           # Docker 忽略文件
├── nginx.conf              # Nginx 配置文件
└── package.json            # Node.js 项目配置
```

### 步骤 2: 配置环境变量 (可选)

如果需要使用 AI 功能,需要配置环境变量:

**方式一: 修改 docker-compose.yml**

编辑 [docker-compose.yml](docker-compose.yml) 文件,在 `environment` 部分添加:

```yaml
environment:
  - NODE_ENV=production
  - OPENAI_API_KEY=your-api-key-here
  - OPENAI_BASE_URL=https://api.openai.com/v1
  - OPENAI_MODEL_NAME=gpt-4o-mini
```

**方式二: 使用 .env 文件**

创建 `.env` 文件 (注意: 该文件不会被包含在镜像中):

```env
OPENAI_API_KEY=your-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL_NAME=gpt-4o-mini
```

然后在 docker-compose.yml 中引用:

```yaml
env_file:
  - .env
```

**方式三: 运行时注入 (推荐)**

在 HTML 中注入环境变量 (通过 nginx 或反向代理):

```html
<script>
  window.ENV = {
    OPENAI_API_KEY: 'your-api-key',
    OPENAI_BASE_URL: 'https://api.openai.com/v1',
    OPENAI_MODEL_NAME: 'gpt-4o-mini'
  };
</script>
```

### 步骤 3: 构建镜像

**使用 Docker Compose:**

```powershell
docker-compose build
```

**使用 Docker 命令:**

```powershell
docker build -t ai-todo:latest .
```

构建过程说明:
1. 使用 Node.js 18 Alpine 镜像作为构建环境
2. 安装项目依赖 (`npm ci`)
3. 构建生产版本 (`npm run build`)
4. 使用 Nginx Alpine 镜像作为运行环境
5. 复制构建产物到 Nginx 静态文件目录

### 步骤 4: 启动容器

**使用 Docker Compose:**

```powershell
# 后台运行
docker-compose up -d

# 前台运行 (查看日志)
docker-compose up
```

**使用 Docker 命令:**

```powershell
docker run -d `
  --name ai-todo-app `
  -p 8080:80 `
  --restart unless-stopped `
  ai-todo:latest
```

### 步骤 5: 验证部署

**1. 检查容器状态:**

```powershell
# Docker Compose
docker-compose ps

# Docker 命令
docker ps | Select-String "ai-todo"
```

**2. 查看容器日志:**

```powershell
# Docker Compose
docker-compose logs -f

# Docker 命令
docker logs -f ai-todo-app
```

**3. 访问应用:**

打开浏览器访问: `http://localhost:8080`

**4. 健康检查:**

```powershell
# 查看健康状态
docker inspect --format='{{.State.Health.Status}}' ai-todo-app
```

## ⚙️ 配置说明

### 端口配置

默认端口映射: `8080:80` (主机端口:容器端口)

修改端口映射:

**Docker Compose:**

编辑 [docker-compose.yml](docker-compose.yml):

```yaml
ports:
  - "3000:80"  # 修改为 3000 端口
```

**Docker 命令:**

```powershell
docker run -d -p 3000:80 ai-todo:latest
```

### Nginx 配置

[nginx.conf](nginx.conf) 文件包含以下配置:

- **Gzip 压缩**: 启用文本资源压缩
- **缓存策略**:
  - 静态资源 (JS/CSS/图片): 1年缓存
  - HTML/Service Worker: 不缓存
- **SPA 路由**: 支持前端路由
- **安全头**: 添加安全相关的 HTTP 头

如需修改配置,编辑 [nginx.conf](nginx.conf) 后重新构建镜像。

### API 代理配置 (可选)

如果需要在 Docker 容器中代理 API 请求,取消注释 [nginx.conf](nginx.conf) 中的代理配置:

```nginx
location /api/proxy {
    rewrite ^/api/proxy/(.*)$ /$1 break;
    proxy_pass https://api-inference.modelscope.cn/v1;

    # 设置代理头
    proxy_set_header Host api-inference.modelscope.cn;
    proxy_set_header Authorization "Bearer your-api-key";

    # CORS 头
    add_header 'Access-Control-Allow-Origin' '*' always;
}
```

## 🛠️ 常见问题

### 1. 构建失败: "npm ci: command not found"

**原因**: Docker 镜像未安装 Node.js

**解决方案**: 检查 Dockerfile 中的基础镜像是否为 `node:18-alpine`

### 2. 容器启动后无法访问

**检查步骤**:

1. 确认容器正在运行:
   ```powershell
   docker ps
   ```

2. 检查端口映射是否正确:
   ```powershell
   docker port ai-todo-app
   ```

3. 检查防火墙规则:
   ```powershell
   # Windows
   netsh advfirewall firewall add rule name="Docker AI Todo" dir=in action=allow protocol=TCP localport=8080
   ```

4. 查看容器日志:
   ```powershell
   docker logs ai-todo-app
   ```

### 3. AI 功能无法使用

**可能原因**:
- API 密钥未配置或无效
- API 基础 URL 配置错误
- CORS 跨域问题

**解决方案**:

1. 检查环境变量配置
2. 查看浏览器控制台错误信息
3. 使用 nginx 代理或 EdgeOne 转发规则解决 CORS 问题

### 4. 容器内存占用过高

**解决方案**: 限制容器资源使用

编辑 [docker-compose.yml](docker-compose.yml):

```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```

### 5. 构建时间过长

**优化建议**:

1. 使用 `.dockerignore` 排除不必要的文件
2. 使用多阶段构建 (已包含在 Dockerfile 中)
3. 使用 Docker 缓存:
   ```powershell
   docker-compose build --no-cache  # 清除缓存重建
   ```

## 🎯 高级配置

### 使用 HTTPS

**方式一: 反向代理 (推荐)**

使用 Nginx 或 Traefik 作为反向代理,处理 SSL 证书:

```yaml
# docker-compose.yml
services:
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
      - ./proxy.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - ai-todo
```

**方式二: 修改 Nginx 配置**

编辑 [nginx.conf](nginx.conf),添加 SSL 配置:

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # 其他配置...
}
```

### 多容器部署

如果需要部署多个实例 (负载均衡):

```yaml
# docker-compose.yml
services:
  ai-todo-1:
    build: .
    ports:
      - "8081:80"

  ai-todo-2:
    build: .
    ports:
      - "8082:80"

  nginx-lb:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./lb.conf:/etc/nginx/nginx.conf
    depends_on:
      - ai-todo-1
      - ai-todo-2
```

### 持久化存储 (可选)

如果需要持久化存储 (如用户数据):

```yaml
services:
  ai-todo:
    volumes:
      - ai-todo-data:/usr/share/nginx/html/data

volumes:
  ai-todo-data:
```

### CI/CD 集成

**GitHub Actions 示例:**

```yaml
# .github/workflows/docker-deploy.yml
name: Docker Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Build Docker image
        run: docker build -t ai-todo:latest .

      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push ai-todo:latest
```

## 📊 常用命令速查

```powershell
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f

# 查看状态
docker-compose ps

# 进入容器
docker exec -it ai-todo-app sh

# 清理资源
docker system prune -a

# 查看镜像
docker images | Select-String "ai-todo"

# 删除镜像
docker rmi ai-todo:latest

# 导出镜像
docker save -o ai-todo.tar ai-todo:latest

# 导入镜像
docker load -i ai-todo.tar
```

## 🔐 安全建议

1. **不要在镜像中硬编码敏感信息**
   - 使用环境变量或运行时注入
   - 使用 Docker Secrets (Swarm 模式)

2. **定期更新基础镜像**
   ```powershell
   docker pull node:18-alpine
   docker pull nginx:alpine
   ```

3. **限制容器权限**
   ```yaml
   security_opt:
     - no-new-privileges:true
   ```

4. **使用非 root 用户运行** (可选)

   修改 Dockerfile:
   ```dockerfile
   RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
   USER nodejs
   ```

## 📚 相关文档

- [Dockerfile 参考](https://docs.docker.com/engine/reference/builder/)
- [Docker Compose 参考](https://docs.docker.com/compose/compose-file/)
- [Nginx 配置参考](https://nginx.org/en/docs/)
- [Docker 最佳实践](https://docs.docker.com/develop/dev-best-practices/)

## 💡 提示

- 生产环境建议使用 Docker Swarm 或 Kubernetes 进行容器编排
- 定期备份数据和配置文件
- 监控容器资源使用情况
- 配置日志收集和分析系统

## 🆘 获取帮助

如有问题,请:
1. 查看容器日志: `docker-compose logs -f`
2. 检查 [常见问题](#常见问题) 部分
3. 在项目 Issues 中提问
4. 参考 Docker 官方文档

---

**祝部署顺利! 🎉**
