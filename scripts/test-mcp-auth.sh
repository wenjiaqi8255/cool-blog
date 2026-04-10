#!/bin/bash

# MCP API 认证测试脚本
# 用于测试本地和远程的 MCP endpoint

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 从 .dev.vars 读取 API key
if [ -f .dev.vars ]; then
  API_KEY=$(grep MCP_API_KEY .dev.vars | cut -d'=' -f2)
else
  echo -e "${RED}错误: .dev.vars 文件不存在${NC}"
  exit 1
fi

if [ -z "$API_KEY" ]; then
  echo -e "${RED}错误: MCP_API_KEY 未设置${NC}"
  exit 1
fi

echo -e "${GREEN}✓ MCP_API_KEY 已读取 (长度: ${#API_KEY})${NC}"
echo -e "${YELLOW}前缀: ${API_KEY:0:10}...${NC}\n"

# 测试本地 endpoint
echo "=== 测试本地 endpoint ==="
LOCAL_URL="http://localhost:4321/api/mcp?_debug"

echo "访问: $LOCAL_URL"
if curl -s "$LOCAL_URL" > /dev/null 2>&1; then
  echo -e "${GREEN}✓ 本地服务器正在运行${NC}"

  echo -e "\nDebug endpoint 响应:"
  curl -s "$LOCAL_URL" | jq '.'

  echo -e "\n测试认证..."
  AUTH_RESPONSE=$(curl -s -H "Authorization: Bearer $API_KEY" \
    "http://localhost:4321/api/mcp?method=tools/list")

  if echo "$AUTH_RESPONSE" | jq -e '.error' > /dev/null; then
    echo -e "${RED}✗ 认证失败${NC}"
    echo "$AUTH_RESPONSE" | jq '.'
  else
    echo -e "${GREEN}✓ 认证成功${NC}"
    echo "$AUTH_RESPONSE" | jq '.result.tools[].name' | head -5
  fi
else
  echo -e "${RED}✗ 本地服务器未运行${NC}"
  echo -e "${YELLOW}请先运行: npm run dev:local${NC}"
fi

# 测试远程 endpoint
echo -e "\n=== 测试远程 endpoint ==="
if [ -n "$1" ]; then
  REMOTE_URL="$1/api/mcp?_debug"
  echo "访问: $REMOTE_URL"

  echo -e "\nDebug endpoint 响应:"
  curl -s "$REMOTE_URL" | jq '.'

  echo -e "\n测试认证..."
  AUTH_RESPONSE=$(curl -s -H "Authorization: Bearer $API_KEY" \
    "$1/api/mcp?method=tools/list")

  if echo "$AUTH_RESPONSE" | jq -e '.error' > /dev/null; then
    echo -e "${RED}✗ 认证失败${NC}"
    echo "$AUTH_RESPONSE" | jq '.'
  else
    echo -e "${GREEN}✓ 认证成功${NC}"
    echo "$AUTH_RESPONSE" | jq '.result.tools[].name' | head -5
  fi
else
  echo -e "${YELLOW}用法: $0 <zeabur-url>${NC}"
  echo -e "${YELLOW}示例: $0 https://your-app.zeabur.app${NC}"
fi
