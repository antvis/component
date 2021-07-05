---
title: Sparkline
order: 6
---

# 迷你图

> 迷你图是非常小的折线图/柱状图，通常绘制时没有轴或坐标。它以一种简单且高度精简的方式表示某些度量中变化的一般形状。

## 引入

```ts
import { Sparkline } from '@antv/gui';
```

## 配置项

| **属性**    | **描述**           | **类型**                                                 | **默认值**                                               |
| ----------- | ------------------ | -------------------------------------------------------- | -------------------------------------------------------- |
| type        | sparkline 类型         | <code>line &#124; bar </code>                            | `default`                                                |
| width       | 宽度               | <code>number</code>                                      | `200`                                                    |
| height      | 高度               | <code>number<code>                                       | `20`                                                     |
| data        | 数据               | <code>number[] &#124; number[][]<code>                   | `[]`                                                     |
| isStack     | 是否堆积           | <code>boolean<code>                                      | `false`                                                  |
| color       | 颜色               | <code>color &#124; color[] &#124; (index) => color<code> | `'#83daad', '#edbf45', '#d2cef9', '#e290b3', '#6f63f4']` |
| smooth      | 平滑曲线           | <code>boolean<code>                                      | `true`                                                   |
| lineStyle   | 自定义线条样式     | <code>StyleAttr<code>                                    | `[]`                                                     |
| areaStyle   | 自定义线条填充样式 | <code>StyleAttr<code>                                    | `[]`                                                     |
| isGroup     | 是否分组           | <code>boolean<code>                                      | `false`                                                  |
| columnStyle | 柱体样式           | ShapeAttrs                                               | `[]`                                                     |
