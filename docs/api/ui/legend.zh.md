---
title: Legend
order: 5
---

<iframe width="100%" height="500" frameborder="0" allowfullscreen style="border:1px solid #d9d9d9;" src="https://www.yuque.com/docs/share/186dbb14-fdd1-4827-b16f-befa42f08aac?view=doc_embed">

<!-- 
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
| rail       | <code>RibbonCfg</code>               | 色板       | `[]`           |
| slidable   | <code>boolean</code>               | 是否可滑动 | `true`         |
| step       | <code>number</code>                | 步长       | `(max-min)*1%` |
| handle     | <code>false \| HandleCfg</code>    | 手柄配置   | `[]`           |
| indicator  | <code>false \| indicatorCfg</code> | 指示器配置 | `[]`           |

### 分类图例配置

| **属性名**          | **类型**                                                          | **描述**             | **默认值** |
| ------------------- | ----------------------------------------------------------------- | -------------------- | ---------- |
| items               | <code>CategoryItem[]</code>                                       | 图例项               | `[]`       |
| maxWidth            | <code>number</code>                                               | 最大宽度             | `[]`       |
| maxHeight           | <code>number</code>                                               | 最大高度             | `[]`       |
| maxCols             | <code>number</code>                                               | 最大行数             | `[]`       |
| maxRows             | <code>number</code>                                               | 最大列数             | `[]`       |
| itemWidth           | <code>number</code>                                               | 图例项宽度           | `[]`       |
| maxItemWidth        | <code>number</code>                                               | 最大图例项宽度       | `[]`       |
| spacing             | <code>[number,number]</code>                                      | 图例项横向、纵向间隔 | `[]`       |
| itemMarker          | <code>ItemMarkerCfg \| (item, index, items)=>ItemMarkerCfg</code> | 图例项图标           | `[]`       |
| itemName            | <code>ItemNameCfg \| (item, index, items)=>ItemNameCfg</code>     | 图例项名             | `[]`       |
| itemValue           | <code>ItemValueCfg \| (item, index, items)=>ItemValueCfg</code>   | 图例项值             | `[]`       |
| itemBackground.style | <code>MixAttrs \| (item, index, items)=>MixAttrs</code>           | 图例项背景           | `[]`       |
| autoWrap            | <code>boolean</code>                                              | 自动换行、列         | `[]`       |
| reverse             | <code>boolean</code>                                              | 图例项倒序           | `[]`       |
| pageNavigator       | <code>false \| PageNavigatorCfg</code>                            | 分页器               | `[]`       |

### TitleCfg

| **属性名** | **类型**                                   | **描述**           | **默认值** |
| ---------- | ------------------------------------------ | ------------------ | ---------- |
| content    | <code>string</code>                        | 标题               |            |
| spacing    | <code>number</code>                        | 标题与图例元素间距 |            |
| align      | <code>'left' \| 'center' \| 'right'</code> | 标题对齐方式       |            |
| style      | <code>TextProps</code>                     | 标题样式           |            |
| formatter  | <code>(text:string)=>string</code>         | 标题格式化         |            |

### LabelCfg

| **属性名** | **类型**                                          | **描述**       | **默认值** |
| ---------- | ------------------------------------------------- | -------------- | ---------- |
| style      | <code>TextProps</code>                            | 标签样式       | `[]`       |
| spacing    | <code>number</code>                               | 标签与图例间距 | `10`       |
| formatter  | <code>(value: number, idx: number)=>string</code> | 标签文本格式化 | `[]`       |
| align      | <code>'rail' \| 'inside' \| 'outside'</code>      | 标签对齐方式   | `rail`     |

### RibbonCfg

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

| **属性名** | **类型**            | **描述**                 | **默认值**                                                                                       |
| ---------- | ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------ |
| size       | <code>number</code> | 手柄大小                 | `4`                                                                                              |
| text       | <code>Object</code> | 手柄文本                 | `{formatter: (value:number)=>string, style: TextProps, align: 'rail' \| 'inside' \| 'outside' }` |
| icon       | <code>Object</code> | 手柄图标                 | `{marker: MarkerCfg}`                                                                            |
| spacing    | <code>number</code> | 手柄文本到手柄图标的间距 | `10`                                                                                             |

### IndicatorCfg

| **属性名**      | **类型**                        | **描述**             | **默认值**                                              |
| --------------- | ------------------------------- | -------------------- | ------------------------------------------------------- |
| size            | <code>number</code>             | 指示器大小           | `8`                                                     |
| spacing         | <code>number</code>             | 指示器文本到色板间距 | `5`                                                     |
| padding         | <code>number \| number[]</code> | 指示器文本内边距     | `5`                                                     |
| backgroundStyle | <code>RectProps</code>          | 指示器背景样式       | `[]`                                                    |
| text            | <code>Object</code>             | 指示器文本样式       | `{style: TextProps, formatter:(value: number)=>string}` |

### CategoryItem

| **属性名** | **类型**                                                       | **描述**   | **默认值**   |
| ---------- | -------------------------------------------------------------- | ---------- | ------------ |
| state      | <code>'default' \| 'active' \| 'selected' \| 'disabled'</code> | 图例项状态 | `default`    |
| name       | <code>string</code>                                            | 图例项名   | ``           |
| value      | <code>string</code>                                            | 图例项值   | ``           |
| id         | <code>string</code>                                            | 图例项 ID  | `name-index` |

### ItemMarkerCfg

| **属性名** | **类型**               | **描述** | **默认值** |
| ---------- | ---------------------- | -------- | ---------- |
| marker     | <code>MarkerCfg</code> | 图标     | `{}`       |
| size       | <code>number</code>    | 图标大小 | `8`        |
| style      | <code>MixAttrs</code>  | 图例样式 | `{}`       |

### ItemNameCfg

| **属性名** | **类型**                            | **描述**           | **默认值** |
| ---------- | ----------------------------------- | ------------------ | ---------- |
| spacing    | <code>number</code>                 | 图例名与图标的间距 | `10`       |
| style      | <code>MixAttrs</code>               | 图例名样式         | `{}`       |
| formatter  | <code>(text: string)=>string</code> | 图例名格式化       | ``         |

### ItemValueCfg

| **属性名** | **类型**                            | **描述**       | **默认值** |
| ---------- | ----------------------------------- | -------------- | ---------- |
| spacing    | <code>number</code>                 | 图例值与图例名 | `10`       |
| align      | <code>'left' \| 'right'</code>      | 图例值对齐方式 | `left`     |
| style      | <code>MixAttrs</code>               | 图例值样式     | `{}`       |
| formatter  | <code>(text: string)=>string</code> | 图例值格式化   | ``         |

### PageNavigatorCfg

| **属性名** | **类型**      | **描述** | **默认值** |
| ---------- | ------------- | -------- | ---------- |
|            | <code></code> |          | ``         | -->
