/**
 * 环境变量诊断脚本
 * 用于检查 MCP_API_KEY 在各个层面的状态
 */

console.log('=== 环境变量诊断 ===\n');

// 1. 检查 process.env 中的 MCP_API_KEY
const mcpKey = process.env.MCP_API_KEY;

console.log('1. process.env.MCP_API_KEY 存在?', Boolean(mcpKey));
console.log('   值类型:', typeof mcpKey);
console.log('   值长度:', mcpKey?.length || 0);
console.log('   值前缀:', mcpKey?.substring(0, 10) || 'N/A');
console.log('   是否为空字符串:', mcpKey === '');

// 2. 检查所有包含 MCP 或 KEY 的环境变量
console.log('\n2. 所有相关的环境变量:');
const relevantKeys = Object.keys(process.env).filter(k =>
  k.includes('MCP') || k.includes('KEY') || k.includes('DATABASE')
);

relevantKeys.forEach(key => {
  const value = process.env[key];
  const isSecret = key.includes('KEY') || key.includes('SECRET') || key.includes('PASSWORD');
  console.log(`   ${key}:`, isSecret ? (value ? `SET (length=${value.length})` : 'UNSET/EMPTY') : value);
});

// 3. 检查 .env 文件
console.log('\n3. 检查本地 .env 文件:');
const fs = require('fs');
const path = require('path');

const envFiles = ['.env', '.env.local', '.env.production'];
envFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✓ ${file} 存在`);
    const content = fs.readFileSync(filePath, 'utf-8');
    const hasMcpKey = content.includes('MCP_API_KEY=');
    if (hasMcpKey) {
      const lines = content.split('\n').filter(l => l.includes('MCP_API_KEY'));
      lines.forEach(line => {
        const value = line.split('=')[1];
        console.log(`     MCP_API_KEY = ${value ? `SET (length=${value.length})` : 'EMPTY'}`);
      });
    } else {
      console.log(`     未包含 MCP_API_KEY`);
    }
  } else {
    console.log(`   ✗ ${file} 不存在`);
  }
});

console.log('\n=== 诊断完成 ===');
