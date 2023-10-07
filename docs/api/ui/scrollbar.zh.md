滚动条用来控制滚动区域的可见区域。

## 引入

```ts
import { Scrollbar } from '@antv/gui';
```

## 配置项

| **属性**       | **类型**                  | **描述**       | **默认值** |
| -------------- | ------------------------- | -------------- | ---------- |
| orientation    | `horizontal &#124; vertical ` | 滚动方向       | `vertical` |
| trackLength    | `number`                  | 轨道长度       | `[]`       |
| trackSize      | `number`                  | 轨道宽度       | `[]`       |
| value          | `number` ∈ [0, 1]         | 值             | `0`        |
| isRound        | `boolean`                 | 滑块是否圆角   | `true`     |
| contentLength  | `number`                  | 滚动区域的长度 | `[]`       |
| viewportLength | `number`                  | 可视区域的长度 | `[]`       |
| padding        | `number` &#124; `numbe[]`     | 滚动条内边距   | `0`        |
| slidable       | 是否可滑动                | `boolean`      | `true`     |
| scrollable     | 是否启用滚轮滚动          | `boolean`      | `true`     |
| `track{Style}` | `StyleProps`              | 轨道样式       | `-`        |
| `thumb{Style}` | `StyleProps`              | 滑块样式       | `-`        |

## 事件

| **事件**    | **触发条件**                                       | **参数**                                |
| ----------- | -------------------------------------------------- | --------------------------------------- |
| scroll      | 当鼠标或键盘操作移动了滚动条时触发                 | `value: `number`                       |
| valuechange | 在通过 scroll 事件或通过 API 更改 value 属性时发生 | `{oldValue: number, value: number}` |
