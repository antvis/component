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

| **属性** | **描述**        | **类型**             | **默认值** |
| -------- | --------------- | -------------------- | ---------- |
| x        | 起点 x 坐标位置 | <code>number</code>  | `-`        |
| y        | 起点 y 坐标位置 | <code>number</code>  | `-`        |
| title    | 标题            | <code>TextCfg</code> | `{}`       |
| value    | 内容            | <code>TextCfg</code> | `{}`       |
| spacing  | 上下间距        | <code>number<code>   | `5`        |

## TextCfg

| **属性** | **描述**        | **类型**                                             | **默认值** |
| -------- | --------------- | ---------------------------------------------------- | ---------- |
| x        | 起点 x 坐标位置 | <code>number</code>                                  | `-`        |
| y        | 起点 y 坐标位置 | <code>number</code>                                  | `-`        |
| text     | 文本            | <code>string &#124; number</code>                    | `''`       |
| style    | 文本样式        | <code>{default: RectProps, active: RectProps}</code> | `{}`       |
| marker   | 小图标          | <code>Marker</code>                                  | `null`     |
| spacing  | 图文间距        | <code>number<code>                                   | `4`        |

# 指标卡（定时器）

> 倒计时。

## 引入

```ts
import { Countdown } from '@antv/gui';
```

## 定时器配置项(配置继承于指标卡)

| **属性** | **描述**     | **类型**              | **默认值** |
| -------- | ------------ | --------------------- | ---------- |
| value    | 倒计时配置   | <code>TextCfg</code>  | `{}`       |
| onFinish | 倒计结束回调 | <code>callBack</code> | `() => {}` |

## TextCfg

| **属性**  | **描述**     | **类型**             | **默认值** |
| --------- | ------------ | -------------------- | ---------- |
| format    | 格式化时间   | <code> string <code> | `null`     |
| timestamp | 倒计时时间戳 | <code> number <code> | `30s`      |
