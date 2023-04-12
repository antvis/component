图例（legend）是图表的辅助元素，使用颜色、大小、形状区分不同的数据类型，用于图表中数据的筛选。 GUI 提供了分类图例和连续图例。

## 引入

```js
import { Category, Continuous } from '@antv/gui';
```

## 配置项

### 基本配置

| **属性名**     | **类型**                 | **描述**                                                                      | **默认值**   |
| -------------- | ------------------------ | ----------------------------------------------------------------------------- | ------------ |
| width          | `number`                 | 图例宽度                                                                      | `-`          |
| height         | `number`                 | 图例高度                                                                      | `-`          |
| orientaion     | `horizontal`&#124;`vertical` | 图例朝向，对于分类图例来说即滚动方向                                          | `horizontal` |
| padding        | `number`&#124;`number[]`     | 图例内边距                                                                    | `10`         |
| showTitle      | `boolean`                | 是否显示图例标题                                                              | `true`       |
| `title{Style}` | `TextStyleProps`         | 图例标题样式，见 [TextStyleProps](https://g.antv.antgroup.com/api/basic/text) | `-`          |

### 分类图例

| **属性名**   | **类型**               | **描述**                                                | **默认值**     |
| ------------ | ---------------------- | ------------------------------------------------------- | -------------- | ------ |
| data         | `CategoryItemsDatum[]` | 图例项数据                                              | `[]`           |
| layout       | `flex`                 | `grid`                                                  | 图例项布局方式 | `flex` |
| gridRow      | `number`               | 每行显示的图例项个数，默认即单行布局                    | `Infinity`     |
| gridCol      | `number`               | 每列显示的图例项个数                                    | `-`            |
| rowPadding   | `number`               | 图例项之间的行间距                                      | `0`            |
| colPadding   | `number`               | 图例项之间的列间距                                      | `0`            |
| click        | `ClickEvent`           | 点击事件                                                | `-`            |
| mouseenter   | `MouseEnterEvent`      | 鼠标移入事件                                            | `-`            |
| mouseleave   | `MouseLeaveEvent`      | 鼠标移出事件                                            | `-`            |
| `nav{Style}` | `NavigatorStyleProps`  | 分页器配置，见 [NavigatorStyleProps](./navigator.zh.md) | `-`            |

```ts
type CategoryItemsDatum = {
  [keys: string]: any;
};
```

### 连续图例

| **属性名**   | **类型**            | **描述**         | **默认值** |
| ------------ | ------------------- | ---------------- | ---------- |
| data         | `ContinuousDatum[]` | 数据             | `[]`       |
| defaultValue | `[number, number]`  | 默认选取范围     | `[0,1]`    |
| showHandle   | `boolean`           | 是否显示滑动手柄 | `true`     |
| showTick     | `boolean`           | 是否显示刻度     | `true`     |
| showLabel    | `boolean`           | 是否显示刻度值   | `true`     |
| slidable     | `boolean`           | 是否可滑动       | `true`     |
| step         | `number`            | 滑动步长         | `-`        |

```ts
type ContinuousDatum = {
  value: number;
  [keys: string]: any;
};
```

#### 滑动手柄

| **属性名**            | **类型**                           | **描述**                                                                                         | **默认值** |
| --------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------ | ---------- |
| showHandleLabel       | `boolean`                          | 是否显示滑动手柄文本                                                                             | `true`     |
| handleFormatter       | `(value: ContinuousDatum)=>string` | 滑动手柄文本格式化                                                                               | `-`        |
| handleSpacing         | `number`                           | 滑动手柄与手柄文本的间距                                                                         | `0`        |
| handleMarkerSize      | `number`                           | 滑动手柄的大小                                                                                   | `25`       |
| handleMarkerSymbol    | `Symbol`                           | 滑动手柄的图形                                                                                   | `-`        |
| `handleMarker{Style}` | `StyleProps`                       | 滑动手柄样式，见 [DisplayObjectStyleProps](https://g.antv.antgroup.com/api/basic/display-object) | `-`        |
| `handleLabel{Style}`  | `TextStyleProps`                   | 滑动手柄文本样式，见 [TextStyleProps](https://g.antv.antgroup.com/api/basic/text)                | `-`        |

#### 指示器

| **属性名**         | **类型**                                          | **描述**         | **默认值** |
| ------------------ | ------------------------------------------------- | ---------------- | ---------- |
| indicatorFormatter | `(value: ContinuousDatum)=>string&#124;DisplayObject` | 指示器文本格式化 | `-`        |
| indicatorIndicate  | `(value: ContinuousDatum)=>void`                  | 指示器触发事件   | `-`        |
| indicatorPadding   | `number`&#124;`number[]`                              | 指示器内边距     | `10`       |
| `indicator{Style}` | `StyleProps`                                      | 指示器样式       | `-`        |

#### 刻度

| **属性名**     | **类型**                                                                       | **描述**                 | **默认值** |
| -------------- | ------------------------------------------------------------------------------ | ------------------------ | ---------- |
| labelAlign     | `value`&#124;`range`                                                               | 刻度值对其位置(值、范围) | `value`    |
| labelDirection | `positive` &#124; `negative`                                                       | 刻度值的朝向             | `positive` |
| labelSpacing   | `number`                                                                       | 刻度值与图例的间距       | `0`        |
| labelFilter    | `(datum:ContinuousDatum, index:number, data:ContinuousDatum[])=>boolean`       | 刻度值过滤               | `-`        |
| labelFormatter | `(datum:ContinuousDatum, index:number, data:ContinuousDatum[])=>DisplayObject` | 刻度值格式化             | `-`        |

#### 色带

| **属性名**         | **类型**             | **描述**                                                                                         | **默认值** |
| ------------------ | -------------------- | ------------------------------------------------------------------------------------------------ | ---------- |
| ribbonType         | `size` &#124; `color`    | 色带类型                                                                                         | `color`    |
| ribbonBlock        | `boolean`            | 是否分块                                                                                         | `false`    |
| ribbonColor        | `string`&#124;`string[]` | 色带颜色                                                                                         | `[]`       |
| `selection{Style}` | `StyleProps`         | 选中区域样式，见 [DisplayObjectStyleProps](https://g.antv.antgroup.com/api/basic/display-object) | `-`        |
| `track{Style}`     | `StyleProps`         | 轨道样式，见 [DisplayObjectStyleProps](https://g.antv.antgroup.com/api/basic/display-object)     | `-`        |
