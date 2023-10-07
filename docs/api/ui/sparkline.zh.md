---
title: Sparkline · 迷你图
order: 6
---

> 迷你图是非常小的折线图/柱状图，通常绘制时没有轴或坐标。它以一种简单且高度精简的方式表示某些度量中变化的一般形状。

## 引入

```ts
import { Sparkline } from '@antv/gui';
```

## 配置项

| **属性**        | **类型**                                           | **描述**       | **默认值**   |
| --------------- | -------------------------------------------------- | -------------- | ------------ |
| type            | `line` &#124; `bar`                                    | sparkline 类型 | `default`    |
| width           | `number`                                           | 宽度           | `200`        |
| height          | `number`                                           | 高度           | `20`         |
| data            | `number[]` &#124; `number[][]`                         | 数据           | `[]`         |
| range           | `[number, number]`                                 | 值范围         | `[min, max]` |
| isStack         | `boolean`                                          | 是否堆积       | `false`      |
| color           | `color` &#124; `color[]` &#124; `(index: number) => color` | 颜色           | `-`          |
| smooth          | `boolean`                                          | 平滑曲线       | `true`       |
| `line{Style}`   | `LineProps`                                        | 线条样式       | `[]`         |
| `area{Style}`   | `PathProps`                                        | 线条填充样式   | `[]`         |
| isGroup         | `boolean`                                          | 是否分组       | `false`      |
| spacing         | `number`                                           | 分组柱子的间距 | `0`          |
| `column{Style}` | `RectProps`                                        | 柱体样式       | `[]`         |
