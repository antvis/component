---
title: Scroll
order: 4
---

# 滚动条

> 滚动条用来控制滚动区域的可见区域。

## 引入

```ts
import { Scrollbar } from '@antv/gui';
```

## 配置项

| **属性**   | **描述**             | **类型**                                              | **默认值** |
| ---------- | -------------------- | ----------------------------------------------------- | ---------- |
| orient     | 方向                 | <code>horizontal &#124; vertical </code>              | `vertical` |
| width      | 宽度                 | <code>number</code>                                   | `[]`       |
| disabled   | 高度                 | <code>number<code>                                    | `[]`       |
| value      | 值                   | <code>number<code> ∈ [0, 1]                           | `0`        |
| min        | 可滚动范围的值的下限 | <code>number<code> ∈ [0, 1)                           | `0`        |
| max        | 可滚动范围的值的上限 | <code>number<code> ∈ (min, 1]                         | `1`        |
| trackStyle | 滑轨样式             | <code>{default: ShapeAttrs, active: ShapeAttrs}<code> | `[]`       |
| isRound    | 滑块是否圆角         | <code>boolean</code>                                  | `true`     |
| thumbLen   | 滑块长度             | <code>boolean</code>                                  | `[]`       |
| thumbStyle | 滑块样式             | <code>{default: ShapeAttrs, active: ShapeAttrs}<code> | `[]`       |

## 事件

| **事件**    | **触发条件**                                       | **参数**                                           |
| ----------- | -------------------------------------------------- | -------------------------------------------------- |
| scroll      | 当鼠标或键盘操作移动了滚动条时触发                 | <code>value: `number`</code>                       |
| valuechange | 在通过 scroll 事件或通过 API 更改 value 属性时发生 | <code>{oldValue: `number`, value: `number`}</code> |
