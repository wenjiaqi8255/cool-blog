# Dark Card CSS Debugging

**Last updated**: 2026-04-04
**Status**: Investigating
**Problem**: Dark cards (variant="dark") display with white background (#F7F7F7) instead of black (#111111)

---

## Problem Description

- Dark cards should have: black background (#111), white text
- Actual: white background (#F7F7F7), black text (in default state)
- CSS compiled correctly shows `background-color: var(--color-ink-black)` for `.card.dark`
- But browser computed style shows `#F7F7F7`

---

## Hypothesis Log

### 假设 1: CSS variable not defined in component scope
**分析**: TextCard.astro 使用 scoped CSS，但 Tailwind 的 @theme 变量可能在 scoped 环境中无法访问
**尝试**: 检查编译后的 CSS 是否包含 color-ink-black 定义
**结果**: ❌
**原因**: 编译后的 CSS 确实有 `background-color:var(--color-ink-black)`，变量是存在的

### 假设 2: CSS specificity 问题
**分析**: `.card` 的通用样式覆盖了 `.card.dark` 的特定样式
**尝试**: 检查样式顺序
**结果**: ❌
**原因**: `.card.dark` 在 `.card` 之后定义，特权应该更高

### 假设 3: Tailwind CSS 覆盖
**分析**: Tailwind 的样式在 global.css 中，可能覆盖了 component 样式
**尝试**: 搜索 global.css 中可能的覆盖
**结果**: 需要验证
**原因**: global.css 使用 @import "tailwindcss"，可能有问题

### 假设 4: Astro scoped CSS 问题
**分析**: Astro 的 scoped CSS 使用 data-astro-cid 属性，可能与 Tailwind 变量冲突
**尝试**: 检查是否有全局样式覆盖 component 样式
**结果**: 需要验证
**原因**: 需要检查 Tailwind 是否能正确访问 component 定义的 CSS 变量

---

## Investigation Steps

### Step 1: 检查 global.css 中的 Tailwind 配置
```bash
grep -n "@theme\|@import" src/styles/global.css
```

### Step 2: 检查是否有全局样式覆盖 card
```bash
grep -n "card\|background" src/styles/global.css
```

### Step 3: 验证 CSS 变量是否在 Tailwind 中定义
```bash
grep -n "color-ink-black\|color-card" src/styles/global.css
```

### Step 4: 检查 Astro 编译输出的顺序
检查 `.card` 和 `.card.dark` 的定义顺序
