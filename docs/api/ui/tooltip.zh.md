提示框

>

## 引入

```ts
import { Tooltip } from '@antv/gui';
```

## 配置项

| **属性**        | **类型**                                               | **描述**                     | **默认值**     |
| --------------- | ------------------------------------------------------ | ---------------------------- | -------------- |
| data            | `TooltipItem[]`                                        | 数据                         | `[]`           |
| title           | `stirng`                                               | 标题                         | `-`            |
| position        | `Position`                                             | 位置                         | `bottom-right` |
| offset          | `[number, number]`                                     | 在位置方向上的偏移量         | `[0, 0]`       |
| enterable       | `boolean`                                              | 指针是否可进入               | `false`        |
| container       | `{x: number, y:number}`                                | 画布的左上角坐标             | `-`            |
| bounding        | `{x: number, y:number, width: number, height: number}`&#124;`null`&#124;`false` | | 画布的边界，可以关闭检测                   | `-`            |
| contentKey      | `string`                                               | 值不变时不会触发重新渲染内容 | `-`            |
| content         | `string`&#124;`HTMLElement`                                | 自定义内容                   | `-`            |
| style           | `Record<string, any>`                                  | 样式                         | `-`            |

```ts
type TooltipItem = {
  name?: string;
  value?: number | string;
  index?: number;
  color?: string;
  [key: string]: any;
};

type Position = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
```
