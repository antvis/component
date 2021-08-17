---
title: Slider
order: 5
---

# 缩略轴

> 缩略轴

## 引入

```ts
import { Slider } from '@antv/gui';
```

## 配置项

| **属性**        | **描述**       | **类型**                                                    | **默认值**   |
| --------------- | -------------- | ----------------------------------------------------------- | ------------ |
| orient          | Slider 朝向    | <code>horizontal &#124; vertical </code>                    | `horizontal` |
| width           | 宽度           | <code>number</code>                                         | `200`        |
| height          | 高度           | <code>number<code>                                          | `20`         |
| values          | 缩略轴范围     | <code>[number, number]<code>                                | `[0, 1]`     |
| names           | 手柄文本       | <code>[string, string]<code>                                | `['', '']`   |
| min             | 最小可滚动范围 | <code>number<code>                                          | `0`          |
| max             | 最大可滚动范围 | <code>number<code>                                          | `1`          |
| sparkline       | 缩略图配置     | <code>SparklineOptions<code>                                | `[]`         |
| backgroundStyle | 自定义背景样式 | <code>MixAttrs\<RectProps\><code>                           | `[]`         |
| selectionStyle  | 自定义选区样式 | <code>MixAttrs\<RectProps\><code>                           | `[]`         |
| handle          | 手柄配置       | <code>handleCfg \| {start: handleCfg; end: handleCfg}<code> | `[]`         |

## SparklineOptions

`markdown:docs/common/sparkline-options.zh.md`

## handleCfg

| **属性**    | **类型**                                         | **描述**                                                                         | **默认值** |
| ----------- | ------------------------------------------------ | -------------------------------------------------------------------------------- | ---------- |
| show        | <code>boolean</code>                             | 是否显示手柄                                                                     | `true`     |
| size        | <code>number</code>                              | 手柄图标大小                                                                     | `10`       |
| formatter   | <code>(name, value)=>string</code>               | 文本格式化                                                                       | `[]`       |
| textStyle   | <code>TextProps</code>                           | 文字样式                                                                         | `[]`       |
| spacing     | <code>number</code>                              | 文字与手柄的间隔                                                                 | `10`       |
| handleIcon  | <code>(x,y,r)=>PathCommand \| string</code>      | 手柄图标，支持**image URL**、**data URL**、**Symbol Name**、 **Symbol Function** | `[]`       |
| handleStyle | <code>MixAttrs\<ImageProps \| PathProps\></code> | 手柄图标样式                                                                     | `[]`       |

## ShapeAttrs

`markdown:docs/common/shape-attrs.zh.md`
