# MCP Server 配置指南

## 概述

本项目的 MCP Server 提供了文章 CRUD 操作，可以通过 Model Context Protocol 进行访问。

## Server 信息

- **URL**: `https://blog.wenjiaqi.top/api/mcp`
- **认证方式**: Bearer Token
- **API Key**: `YOUR_MCP_API_KEY`

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
3. 检查 `/api/env-debug` 端点确认环境变量正常

## 安全建议

⚠️ **重要**：
- 这个 API key 已经提交到文档中，建议在生产环境中使用新的 key
- 定期 rotate API keys
- 使用强随机 key 生成器

生成新 key：
```bash
node -e "console.log('ckb_' + require('crypto').randomBytes(32).toString('hex'))"
```

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
