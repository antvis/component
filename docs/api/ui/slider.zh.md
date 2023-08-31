缩略轴

## 引入

```ts
import { Slider } from '@antv/gui';
```

## 配置项

| **属性**           | **类型**                             | **描述**                                             | **默认值**   |
| ------------------ | ------------------------------------ | ---------------------------------------------------- | ------------ |
| type               | `range` &#124; `value`               | Slider 类型，范围选择/值选择                         | `'range'`    |
| orientation        | `horizontal` &#124; `vertical`       | 朝向                                                 | `horizontal` |
| trackLength        | `number`                             | 轨道长度                                             | `-`          |
| trackSize          | `number`                             | 轨道宽度                                             | `-`          |
| values             | `[number, number]`                   | 值                                                   | `[0,1]`      |
| brushable          | `boolean`                            | 是否支持刷选                                         | `true`       |
| slidable           | `boolean`                            | 是否支持拖动                                         | `true`       |
| scrollable         | `boolean`                            | 是否支持滚动                                         | `true`       |
| padding            | `number` &#124; `number[]`           | 内边距                                               | `0`          |
| `selection{Style}` | `StyleProps`                         | 选区样式                                             | `-`          |
| selectionType    | `select` &#124; `invert`             | 选区类型，中间选取/两端反选                          |              |
| `track{Style}`     | `StyleProps`                         | 轨道样式                                             | `-`          |
| handleFormatter    | `(value: number)=>string`            | 滑动手柄文本格式化                                   | `-`          |
| `handle{Style}`    | `StyleProps`                         | 滑动手柄样式                                         | `-`          |
| `sparkline{Style}` | `SparklineStyleProps`                | 迷你图属性，见 [SparklineStyleProps](./slider.zh.md) | `-`          |
| onChange           | `(values: number \| number[])=>void` | 值变化回调                                           | `-`          |
