---
status: resolved
trigger: "首页 Header 的品牌文字（KERNEL_PANIC / ARCHITECTURE & SYSTEMS）不是从配置项读取的，无法通过 src/config/content.ts 配置"
created: 2026-04-03T00:00:00Z
updated: 2026-04-03T00:00:00Z
---

## Current Focus
hypothesis: 修复完成 - Header 现在从 config/content.ts 读取 brandTitle 和 brandSubtitle
test: curl 验证页面输出
expecting: 首页 Header 显示 "温佳琪 / ARCHITECTURE & SYSTEMS"
next_action: 等待用户确认

## Symptoms
expected: |
  1. 标签页名称：通过 pages.home.title 配置（已工作，显示"温佳琪 | ARCHITECTURE & SYSTEMS"）
  2. 首页 Header 品牌文字：从 config/content.ts 的配置读取

actual: 修复前显示硬编码的 "KERNEL_PANIC / ARCHITECTURE & SYSTEMS"

## Resolution
root_cause: |
  Header.astro 组件直接硬编码了品牌文字，没有从配置文件中读取。

fix: |
  1. 在 src/config/content.ts 的 PageConfig 接口中添加 brandTitle 和 brandSubtitle 字段
  2. 在 pages.home 中添加 brandTitle: '温佳琪', brandSubtitle: 'ARCHITECTURE & SYSTEMS'
  3. 修改 Header.astro 接收这两个 props，并使用默认值 'KERNEL_PANIC' 和 'ARCHITECTURE & SYSTEMS'
  4. 修改 src/pages/index.astro 将配置传给 Header

verification: |
  - curl 验证：<span class="brand-text">温佳琪</span>
  - curl 验证：<span class="brand-subtitle">ARCHITECTURE & SYSTEMS</span>

files_changed: [
  "src/config/content.ts",
  "src/components/layout/Header.astro",
  "src/pages/index.astro"
]