# MCP Server 配置指南

## 概述

本项目的 MCP Server 提供了文章 CRUD 操作，可以通过 Model Context Protocol 进行访问。

## Server 信息

- **URL**: `https://blog.wenjiaqi.top/api/mcp`
- **认证方式**: Bearer Token
- **API Key**: 通过环境变量 `MCP_API_KEY` 配置（见下方生成方法）

## 可用工具

1. **create_article** - 创建新文章
2. **list_articles** - 列出文章（支持过滤、分页、排序）
3. **get_article** - 获取单篇文章
4. **update_article** - 更新文章
5. **delete_article** - 删除文章（软删除）

## Claude Desktop 配置

### macOS 配置文件位置

`~/Library/Application Support/Claude/claude_desktop_config.json`

### 配置内容

```json
{
  "mcpServers": {
    "cool-blog": {
      "transport": {
        "type": "http",
        "url": "https://blog.wenjiaqi.top/api/mcp",
        "headers": {
          "Authorization": "Bearer YOUR_MCP_API_KEY"
        }
      }
    }
  }
}
```

### Claude Code 配置

Claude Code 会自动读取 Claude Desktop 的配置，所以配置上面即可。

如果需要独立配置，编辑：
`~/.claude/settings.json`

```json
{
  "mcpServers": {
    "cool-blog": {
      "transport": {
        "type": "http",
        "url": "https://blog.wenjiaqi.top/api/mcp",
        "headers": {
          "Authorization": "Bearer YOUR_MCP_API_KEY"
        }
      }
    }
  }
}
```

## 生成 API Key

在部署前，生成一个新的 API key：

```bash
node -e "console.log('ckb_' + require('crypto').randomBytes(32).toString('hex'))"
```

将生成的 key 设置为环境变量 `MCP_API_KEY`（在 Cloudflare Dashboard 或 `.env` 文件中）。

## 验证步骤

### 1. 重启 Claude Desktop

完全退出 Claude Desktop 并重新启动。

### 2. 检查 MCP 连接

在 Claude Desktop 中，你应该能看到 "cool-blog" MCP server 已连接。

### 3. 测试工具

在 Claude Desktop 或 Claude Code 中尝试：

```
请列出所有已发布的文章
```

或者：

```
请创建一篇新文章，标题是 "MCP 测试"，内容是 "这是通过 MCP API 创建的文章"
```

## 故障排查

### 连接失败

1. 检查网络连接
2. 验证 API key 是否正确（无前导空格）
3. 查看 MCP 日志

### 认证失败

确保 `Authorization` header 格式正确：
```
Bearer YOUR_MCP_API_KEY
```

### 工具不可用

1. 确认 MCP server 已连接
2. 查看 Claude 的 MCP server 状态
3. 检查环境变量 `MCP_API_KEY` 和 `DATABASE_URL` 是否已正确配置

## 安全建议

- **永远不要**将 API key 提交到代码仓库
- 定期 rotate API keys
- 使用强随机 key 生成器
- 在 `.env` 文件中管理 key，确保 `.env` 已在 `.gitignore` 中

## API 测试命令

### 手动测试 MCP endpoint

```bash
# 列出工具
curl -H "Authorization: Bearer YOUR_MCP_API_KEY" \
  "https://blog.wenjiaqi.top/api/mcp?method=tools/list" | jq '.'

# 列出文章
curl -X POST \
  -H "Authorization: Bearer YOUR_MCP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "list_articles",
      "arguments": {
        "status": "published",
        "limit": 5
      }
    },
    "id": 1
  }' \
  "https://blog.wenjiaqi.top/api/mcp" | jq '.'
```

## 相关文档

- [MCP_DEBUG_REPORT.md](./MCP_DEBUG_REPORT.md) - 详细的调试报告
- [.planning/phases/06-mcp-server/](./.planning/phases/06-mcp-server/) - MCP server 实现文档
