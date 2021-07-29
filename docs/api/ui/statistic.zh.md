---
title: Statistic
order: 4
---

# 指标卡

> 指标卡展示统计数据。

## 引入

```ts
import { Statistic } from '@antv/gui';
```

## 指标卡配置项

| **属性** | **描述** | **类型**                | **默认值** |
| -------- | -------- | ----------------------- | ---------- |
| title    | 标题     | <code>TextOption</code> | `{}`       |
| value    | 内容     | <code>TextOption</code> | `{}`       |
| spacing  | 上下间距 | <code>number<code>      | `5`        |

## TextOption

| **属性**      | **描述** | **类型**                              | **默认值** |
| ------------- | -------- | ------------------------------------- | ---------- |
| text          | 文本     | <code>string  &#124; number</code>    | `''`       |
| style         | 文本样式 | <code>ShapeAttrs</code>               | `{}`       |
| formatter     | 文本回调 | <code>(text: string) => string <code> | `null`     |
| prefix/suffix | 前后缀   | <code>string &#124; gui <code>        | `null`     |

# 指标卡（定时器）

> 倒计时 或 当前时间。

## 引入

```ts
import { Countdown } from '@antv/gui';
```

## TextOption

| **属性**    | **描述**   | **类型**                              | **默认值** |
| ----------- | ---------- | ------------------------------------- | ---------- |
| text        | 文本       | <code>string &#124; number</code>     | `''`       |
| style       | 文本样式   | <code>ShapeAttrs</code>               | `{}`       |
| format      | 格式化时间 | <code> string <code>                  | `null`     |
| prefix/suffix | 前后缀   | <code>string &#124; gui <code>        | `null`     |
| formatter   | 文本回调   | <code>(text: string) => string <code> | `null`     |
| dynamicTime | 动态时间   | <code>boolean<code>                   | `false`    |


