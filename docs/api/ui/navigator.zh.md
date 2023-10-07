分页器

## 引入

```ts
import { Navigator } from '@antv/gui';
```

## 配置项

| **属性**          | **类型**                                | **描述**         | **默认值**   |
| ----------------- | --------------------------------------- | ---------------- | ------------ |
| pageWidth         | `number`                                | 页宽             | `-`          |
| pageHeight        | `number`                                | 页高             | `-`          |
| controllerPadding | `number`&#124;`number[]`                    | 按钮与页码的间隔 | `5`          |
| controllerSpacing | `number`&#124;`number[]`                    | 按钮与页的间隔   | `5`          |
| formatter         | `(curr: number, total: number)=>string` | 页码格式化       | `-`          |
| defaultPage       | `number`                                | 默认页码         | `1`          |
| loop              | `number`                                | 是否可以循环翻页 | `false`      |
| orientation       | `horizontal`&#124;`vertical`                | 翻页方向         | `horizontal` |
| `pageNum{Style}`  | `TextStyleProps`                        | 页码样式         | `-`          |
| `button{Style}`   | `ButtonStyleProps`                      | 按钮样式         | `-`          |

## API

| **方法**         | **说明**     | **参数**     |
| ---------------- | ------------ | ------------ |
| goTo(to: number) | 跳转到目标页 | `to: 目标页` |
| prev()           | 向前翻页     | `-`          |
| next()           | 向后翻页     | `-`          |
