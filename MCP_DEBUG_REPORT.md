# MCP API 认证问题诊断报告

## 问题症状
- Zeabur 部署后日志显示：`MCP_API_KEY is not configured`
- 即使在 Zeabur 中配置了环境变量，仍然显示未配置
- 之前 API key 泄露过，已经 rotate 过一次

## 根本原因分析

### 1. 环境变量文件混乱
发现多个环境变量文件，内容不一致：

**.dev.vars** (April 4, 2026 - rotated):
```
DATABASE_URL=postgresql://...[rotated-key]...
MCP_API_KEY=[generated-key]
```

**.env** (旧的):
```
DATABASE_URL=postgresql://...[old-key]...
MCP_API_KEY=[same-generated-key]
```

### 2. 可能的问题
1. **Zeabur 可能读取了旧的 .env 文件**（如果被提交到仓库）
2. **环境变量值为空字符串**（Zeabur 显示配置了，但实际值为空）
3. **环境变量名称不匹配**（大小写问题）

## 诊断步骤

### Step 1: 访问 Debug Endpoint
在你的 Zeabur 部署 URL 上访问：
```
https://your-zeabur-url.zeabur.app/api/mcp?_debug
```

这会返回：
```json
{
  "has_process_env": true/false,  // MCP_API_KEY 是否存在
  "process_env_prefix": "[key-prefix]...",  // 前10个字符
  "process_env_len": 64,  // 完整长度
  "all_env_keys": ["DATABASE_URL", "MCP_API_KEY", ...]  // 所有相关变量
}
```

### Step 2: 根据 Debug 输出诊断

**情况 A: `has_process_env: false` 或 `process_env_len: 0`**
- ✅ 环境变量存在，但值为空字符串
- 🔧 解决：在 Zeabur 中重新设置正确的值

**情况 B: `all_env_keys` 中没有 `MCP_API_KEY`**
- ✅ 环境变量根本没有传递到容器
- 🔧 解决：检查 Zeabur 变量名称是否为 `MCP_API_KEY`（注意大小写）

**情况 C: `process_env_len` 和前缀都正确**
- ✅ 环境变量已正确设置
- 🔧 问题可能在别处（需要进一步调查）

## 修复方案

### 方案 1: 在 Zeabur 中重新设置环境变量

1. **删除现有的 MCP_API_KEY**
   - 在 Zeabur Dashboard 中删除该变量

2. **添加新的 MCP_API_KEY**
   ```
   名称: MCP_API_KEY
   值: [从 .dev.vars 复制]
   ```

3. **重新部署**
   - Zeabur 会自动重新部署

### 方案 2: 生成全新的 API Key（推荐）

由于之前的 key 泄露过，建议生成全新的：

```bash
# 生成新的随机 key
node -e "console.log('ckb_' + require('crypto').randomBytes(32).toString('hex'))"
```

然后更新：
1. `.dev.vars` 中的 `MCP_API_KEY`
2. Zeabur 中的 `MCP_API_KEY`
3. 本地测试脚本

### 方案 3: 检查 .gitignore

确保 `.env` 和 `.dev.vars` 不会被提交：

```bash
grep -E "^\.env$|^\.dev\.vars$" /Users/wenjiaqi/Downloads/cool-blog/.gitignore
```

如果没有，添加到 `.gitignore`：
```
.env
.env.local
.env.*.local
.dev.vars
```

## 验证步骤

### 1. 本地测试
```bash
# 使用正确的环境变量文件
npm run dev:local

# 在另一个终端测试
curl -H "Authorization: Bearer [your-api-key]" \
     "http://localhost:4321/api/mcp?method=tools/list"
```

### 2. Zeabur 测试
```bash
# 访问 debug endpoint
curl "https://your-zeabur-url.zeabur.app/api/mcp?_debug"

# 测试认证
curl -H "Authorization: Bearer [your-api-key]" \
     "https://your-zeabur-url.zeabur.app/api/mcp?method=tools/list"
```

## 预期结果

### Debug Endpoint 成功响应：
```json
{
  "has_process_env": true,
  "process_env_prefix": "[key-prefix]",
  "process_env_len": 64,
  "all_env_keys": ["DATABASE_URL", "MCP_API_KEY"]
}
```

### MCP Endpoint 成功响应：
```json
{
  "jsonrpc": "2.0",
  "result": {
    "tools": [
      {
        "name": "create_article",
        "description": "..."
      }
    ]
  },
  "id": 1
}
```

## 安全建议

1. ✅ 使用 `.dev.vars` 而不是 `.env`（已在 .gitignore 中）
2. ✅ 定期 rotate API keys
3. ✅ 使用强随机 key 生成器
4. ✅ 不要在代码中硬编码任何密钥
5. ✅ 使用 Zeabur 的环境变量功能，不要在镜像中打包密钥
