---
title: Legend
order: 5
---

# 图例

> 图例（legend）是图表的辅助元素，使用颜色、大小、形状区分不同的数据类型，用于图表中数据的筛选

## 引入

```ts
import { Category, Continuous } from '@antv/gui';
```

### 基本配置

| **属性名**      | **类型**                                | **描述**       | **默认值**     |
| --------------- | --------------------------------------- | -------------- | -------------- |
| padding         | <code>number \| number []</code>        | 内边距         | `10`           |
| orient          | <code>'horizontal' \| 'vertical'</code> | 横向、纵向模式 | `'horizontal'` |
| backgroundStyle | <code>MixAttrs</code>                   | 图例背景样式   | `[]`           |
| title           | <code>TitleCfg</code>                   | 图例标题配置   | `[]`           |
| type            | <code>'category' \| 'continuous'</code> | 高度           | `[]`           |

### 连续图例配置

| **属性名** | **类型**                           | **描述**   | **默认值**     |
| ---------- | ---------------------------------- | ---------- | -------------- |
| min        | <code>number</code>                | 最小值     | `[]`           |
| max        | <code>number</code>                | 最大值     | `[]`           |
| start      | <code>number</code>                | 开始区间   | `min`          |
| end        | <code>number</code>                | 结束区间   | `max`          |
| color      | <code>string \| string[]</code>    | 颜色       | `[]`           |
| label      | <code>false \| LabelCfg</code>     | 标签       | `[]`           |
| rail       | <code>RailCfg</code>               | 色板       | `[]`           |
| slidable   | <code>boolean</code>               | 是否可滑动 | `true`         |
| step       | <code>number</code>                | 步长       | `(max-min)*1%` |
| handle     | <code>false \| HandleCfg</code>    | 手柄配置   | `[]`           |
| indicator  | <code>false \| indicatorCfg</code> | 指示器配置 | `[]`           |

### TitleCfg

| **属性名** | **类型**                                   | **描述**           | **默认值** |
| ---------- | ------------------------------------------ | ------------------ | ---------- |
| content    | <code>string</code>                        | 标题               |            |
| spacing    | <code>number</code>                        | 标题与图例元素间距 |            |
| align      | <code>'left' \| 'center' \| 'right'</code> | 标题对齐方式       |            |
| style      | <code>ShapeAttrs</code>                    | 标题样式           |            |
| formatter  | <code>(text:string)=>string</code>         | 标题格式化         |            |

### LabelCfg

| **属性名** | **类型**                                          | **描述**       | **默认值** |
| ---------- | ------------------------------------------------- | -------------- | ---------- |
| style      | <code>ShapeAttrs</code>                           | 标签样式       | `[]`       |
| spacing    | <code>number</code>                               | 标签与图例间距 | `10`       |
| formatter  | <code>(value: number, idx: number)=>string</code> | 标签文本格式化 | `[]`       |
| align      | <code>'rail' \| 'inside' \| 'outside'</code>      | 标签对齐方式   | `rail`     |

### RailCfg

| **属性名**      | **类型**                       | **描述**                     | **默认值** |
| --------------- | ------------------------------ | ---------------------------- | ---------- |
| width           | <code>number</code>            | 色板宽度                     | `[]`       |
| height          | <code>number</code>            | 色板高度                     | `[]`       |
| type            | <code>'color' \| 'size'</code> | 色板类型                     | `color`    |
| chunked         | <code>boolean</code>           | 是否分块                     | `false`    |
| ticks           | <code>number[]</code>          | 分块分割点（label 显示的值） | `[]`       |
| isGradient      | <code>boolean \| 'auto'</code> | 是否使用渐变色               | `auto`     |
| backgroundColor | <code>string</code>            | 色板背景色                   | `[]`       |

### HandleCfg

| **属性名** | **类型**            | **描述**                 | **默认值**                                                                                        |
| ---------- | ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------- |
| size       | <code>number</code> | 手柄大小                 | `4`                                                                                               |
| text       | <code>Object</code> | 手柄文本                 | `{formatter: (value:number)=>string, style: ShapeAttrs, align: 'rail' \| 'inside' \| 'outside' }` |
| icon       | <code>Object</code> | 手柄图标                 | `{marker: MarkerCfg}`                                                                             |
| spacing    | <code>number</code> | 手柄文本到手柄图标的间距 | `10`                                                                                              |

### IndicatorCfg

| **属性名**      | **类型**                        | **描述**             | **默认值**                                               |
| --------------- | ------------------------------- | -------------------- | -------------------------------------------------------- |
| size            | <code>number</code>             | 指示器大小           | `8`                                                      |
| spacing         | <code>number</code>             | 指示器文本到色板间距 | `5`                                                      |
| padding         | <code>number \| number[]</code> | 指示器文本内边距     | `5`                                                      |
| backgroundStyle | <code>ShapeAttrs</code>         | 指示器背景样式       | `[]`                                                     |
| text            | <code>Object</code>             | 指示器文本样式       | `{style: ShapeAttrs, formatter:(value: number)=>string}` |
