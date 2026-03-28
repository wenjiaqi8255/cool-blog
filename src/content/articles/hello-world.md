---
title: "理解 Transformer 注意力机制"
date: 2026-03-28
tags: ["ML", "Tutorial"]
excerpt: "深入理解 Transformer 模型中的注意力机制，这是现代大语言模型的核心组件。"
draft: false
---

# 理解 Transformer 注意力机制

注意力机制是 Transformer 模型的核心创新。它允许模型在处理序列时关注相关的部分。

## 基本概念

注意力函数可以描述为将一个查询和一组键值对映射到一个输出。

```python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    attention = F.softmax(scores, dim=-1)
    return torch.matmul(attention, V)
```

## 为什么需要缩放

缩放因子 √d_k 用于防止点积结果过大，导致 softmax 函数进入梯度极小的区域。