#!/bin/sh
# ============================================
# Docker 容器启动脚本
# 功能：将环境变量注入为 JavaScript 文件
# ============================================

set -e

echo "🚀 Starting AI Todo application..."

# 定义文件路径
ENV_FILE="/usr/share/nginx/html/env-config.js"

echo "📝 Creating environment configuration file..."

# 创建环境变量 JavaScript 文件
cat > "$ENV_FILE" << EOF
// Environment configuration injected by Docker
window.ENV = {
  OPENAI_API_KEY: '${OPENAI_API_KEY:-MISSING}',
  OPENAI_BASE_URL: '${OPENAI_BASE_URL:-https://api.openai.com/v1}',
  OPENAI_MODEL_NAME: '${OPENAI_MODEL_NAME:-gpt-4o-mini}'
};
console.log('[Docker] Environment variables loaded from env-config.js:', window.ENV);
EOF

echo "✅ Environment configuration created successfully:"
echo "   - File: $ENV_FILE"
echo "   - OPENAI_API_KEY: ${OPENAI_API_KEY:0:20}..."
echo "   - OPENAI_BASE_URL: ${OPENAI_BASE_URL}"
echo "   - OPENAI_MODEL_NAME: ${OPENAI_MODEL_NAME}"

# 在 index.html 中添加对 env-config.js 的引用（如果还没有）
HTML_FILE="/usr/share/nginx/html/index.html"
if [ -f "$HTML_FILE" ]; then
  # 检查是否已经包含 env-config.js
  if ! grep -q "env-config.js" "$HTML_FILE"; then
    echo "📝 Adding env-config.js reference to index.html..."
    sed -i 's|<head>|<head>\n    <script src="/env-config.js"></script>|' "$HTML_FILE"
    echo "✅ Reference added to index.html"
  else
    echo "ℹ️  env-config.js already referenced in index.html"
  fi
fi

echo "🌐 Starting nginx..."

# 执行原始的 nginx 启动脚本
exec /docker-entrypoint.sh "$@"
