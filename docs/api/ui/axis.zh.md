坐标轴指二维空间中统计图表中的轴，它用来定义坐标系中数据在方向和值的映射关系的图表组件

## 引入

```js
import { Axis } from '@antv/gui';
```

## 配置项

### 基本配置

| **属性名**    | **类型**          | **描述**                               | **默认值** |
| ------------- | ----------------- | -------------------------------------- | ---------- |
| data          | `AxisDatum[]`     | 数据                                   | `-`        |
| dataThreshold | `number`          | 数据上限，数据量超过该值时会进行下采样 | `100`      |
| showTitle     | `boolean`         | 是否显示标题                           | `true`     |
| showLine      | `boolean`         | 是否显示轴线                           | `true`     |
| showArrow     | `boolean`         | 是否显示箭头                           | `true`     |
| showTick      | `boolean`         | 是否显示刻度线                         | `true`     |
| showLabel     | `boolean`         | 是否显示刻度值                         | `true`     |
| showGrid      | `boolean`         | 是否显示网格线                         | `true`     |
| showTrunc     | `boolean`         | 是否显示截断                           | `false`    |
| animate       | `AnimationOption` | 动画配置                               | `-`        |

<!-- | crossSize     | `number`      | 坐标轴在副轴方向上的最大尺寸           | `-`        | -->

```ts
type AxisDatum = {
  id?: string;
  value: number;
  label?: string;
  [keys: string]: any;
};
```

### 直线坐标轴

| **属性名** | **类型**           | **描述**     | **默认值** |
| ---------- | ------------------ | ------------ | ---------- |
| type       | `linear`           | -            | `-`        |
| startPos   | `[number, number]` | 轴线起点坐标 | `-`        |
| endPos     | `[number, number]` | 轴线终点坐标 | `-`        |

### 圆弧坐标轴

| **属性名** | **类型**           | **描述**               | **默认值** |
| ---------- | ------------------ | ---------------------- | ---------- |
| type       | `arc`              | -                      | `-`        |
| startAngle | `number`           | 起始角，弧度、角度均可 | `-`        |
| endAngle   | `number`           | 结束角                 | `-`        |
| radius     | `number`           | 半径                   | `-`        |
| center     | `[number, number]` | 圆心位置               | `-`        |

<!-- ### 螺旋坐标轴

| **属性名** | **类型** | **描述**               | **默认值** |
| ---------- | -------- | ---------------------- | ---------- |
| a          | `number` | 参数 a                 | `-`        |
| b          | `number` | 参数 b                 | `-`        |
| startAngle | `number` | 起始角                 | `-`        |
| endAngle   | `number` | 结束角                 | `-`        |
| precision  | `number` | 精度，影响螺旋线的绘制 | `0.1`      | -->

### 标题 AxisTitleStyleProps

| **属性名**     | **类型**                                | **描述**                                                                                     | **默认值** |
| -------------- | --------------------------------------- | -------------------------------------------------------------------------------------------- | ---------- |
| position       | `Position`                              | 标题位置                                                                                     | `lb`       |
| titleText      | `string` &#124; `number` &#124; `DisplayObject` | 标题                                                                                         | `-`        |
| titleSpacing   | `number` &#124; `numbers[]`                 | 标题到轴的距离                                                                               | `0`        |
| titleInset     | `number` &#124; `numbers[]`                 | 标题内边距                                                                                   | `0`        |
| `title{Style}` | `StyleProps`                            | 标题样式，见 [DisplayObjectStyleProps](https://g.antv.antgroup.com/api/basic/display-object) | `-`        |

```ts
type Position =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'left-top'
  | 'top-left'
  | 'left-bottom'
  | 'bottom-left'
  | 'right-top'
  | 'top-right'
  | 'right-bottom'
  | 'bottom-right'
  | 'inner'
  | 't'
  | 'r'
  | 'l'
  | 'b'
  | 'lt'
  | 'tl'
  | 'rt'
  | 'tr'
  | 'lb'
  | 'bl'
  | 'rb'
  | 'br'
  | 'i';
```

### 轴线 AxisLineStyleProps

| **属性名**      | **类型**           | **描述**                                                                                     | **默认值** |
| --------------- | ------------------ | -------------------------------------------------------------------------------------------- | ---------- |
| lineExtension   | `[number, number]` | 轴线两端扩展长度                                                                             | `[0,0]`    |
| lineArrow       | `DisplayObject`    | 箭头图形                                                                                     | `-`        |
| lineArrowOffset | `number`           | 箭头偏移量                                                                                   | `15`       |
| lineArrowSize   | `number`           | 箭头尺寸                                                                                     | `10`       |
| `line{Style}`   | `StyleProps`       | 轴线样式，见 [DisplayObjectStyleProps](https://g.antv.antgroup.com/api/basic/display-object) | `-`        |
|                 | `-`                |                                                                                              | `-`        |

### 刻度线 AxisTickStyleProps

| **属性名**    | **类型**                                                                                    | **描述**                                                                                       | **默认值** |
| ------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------- |
| tickLength    | `number`                                                                                    | 长度                                                                                           | `5`        |
| tickFilter    | `(datum:AxisDatum, index:number, data:AxisDatum[])=>boolean`                                | 刻度线过滤                                                                                     | `-`        |
| tickFormatter | `(datum:AxisDatum, index:number, data:AxisDatum[], vector: [number,number])=>DisplayObject` | 刻度线格式化                                                                                   | `false`    |
| tickDirection | `position`&#124;`negative`                                                                      | 刻度线朝向                                                                                     | `positive` |
| `tick{Style}` | `StyleProps` &#124; `(datum:AxisDatum, index:number, data:AxisDatum[])=>StyleProps`             | 刻度线样式，见 [DisplayObjectStyleProps](https://g.antv.antgroup.com/api/basic/display-object) | `-`        |
|               | `-`                                                                                         |

### 刻度值 AxisLabelStyleProps

| **属性名**     | **类型**                                                                                    | **描述**                                                                    | **默认值** |
| -------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------- |
| labelFilter    | `(datum:AxisDatum, index:number, data:AxisDatum[])=>boolean`                                | 刻度值过滤                                                                  | `-`        |
| labelFormatter | `(datum:AxisDatum, index:number, data:AxisDatum[], vector: [number,number])=>DisplayObject` | 刻度值格式化                                                                | `-`        |
| labelDirection | `position`&#124;`negative`                                                                      | 刻度值朝向                                                                  | `positive` |
| labelAlign     | `horizontal`&#124;`parallel`&#124;`prependicular`                                                   | 刻度值方向（保持水平、保持垂直、垂直于轴线）                                | `parallel` |
| labelSpacing   | `number`                                                                                    | 刻度值到刻度的距离                                                          | `0`        |
| labelOverlap   | `LabelOverlapCfg[]`                                                                         | 重叠时采取的策略                                                            | `-`        |
| `label{Style}` | `StyleProps` &#124; `(datum:AxisDatum, index:number, data:AxisDatum[])=>StyleProps`             | 刻度值样式，见 [TextStyleProps](https://g.antv.antgroup.com/api/basic/text) | `-`        |

```ts
interface Overlap {
  /** 碰撞检测时添加额外的间距 */
  margin?: number[];
}
/** 重叠时对刻度值进行缩略 */
interface EllipsisOverlapCfg extends Overlap {
  type: 'ellipsis';
  /** 缩略符 */
  suffix?: string;
  /** 最小长度，刻度值小于该长度时，无论是否发生重叠均不再进行缩略处理 */
  minLength?: string | number;
  /** 最大长度，刻度值超过该长度时，无论是否发生重叠均会进行缩略处理 */
  maxLength?: string | number;
  /** 单次缩略步长，为文本时会测算其长度 */
  step?: string | number;
}
/** 重叠时对刻度值进行旋转 */
interface RotateOverlapCfg extends Overlap {
  type: 'rotate';
  /** 可选的旋转角度 */
  optionalAngles: number[];
  /** 若任何角度均无法避免重叠，则将其重置为初始角度 */
  recoverWhenFailed?: boolean;
}
/** 重叠时对刻度值进行隐藏 */
interface HideOverlapCfg extends Overlap {
  type: 'hide';
  /** 保证第一个刻度值不被隐藏 */
  keepHeader?: boolean;
  /** 保证最后一个刻度值不被隐藏 */
  keepTail?: boolean;
}

export type LabelOverlapCfg = EllipsisOverlapCfg | RotateOverlapCfg | HideOverlapCfg;
```

### 网格线 AxisGridStyleProps

| **属性名**        | **类型**                                                                        | **描述**                                                                                       | **默认值** |
| ----------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------- |
| gridFilter        | `(datum:AxisDatum, index:number, data:AxisDatum[])=>boolean`                    | 网格线过滤                                                                                     | `-`        |
| gridDirection     | `position`&#124;`negative`                                                          | 网格线朝向                                                                                     | -          |
| gridLength        | `number`                                                                        | 网格线长度                                                                                     | `0`        |
| gridType          | `segment`&#124;`surround`                                                           | 网格线类型，segment 适用于直角坐标系，surround 适用于极坐标系                                  | `segment`  |
| gridCenter        | `[number,number]`                                                               | 网格线中心点，仅在 gridType 为 surround 时生效                                                 | `[0,0]`    |
| gridControlAngles | `number[]`                                                                      | 网格线控制点角度，仅在 gridType 为 surround 时生效                                             | `[0,0]`    |
| gridClosed        | `boolean`                                                                       | 是否封闭相邻网格线区域                                                                         | `false`    |
| gridConnect       | `line`&#124;`arc`                                                                   | 网格线封闭类型，line 直线连接，arc 弧线连接                                                    | `line`     |
| gridAreaFill      | `string`&#124;`string[]`                                                            | 网格线区域填充                                                                                 | `-`        |
| `grid{Style}`     | `StyleProps` &#124; `(datum:AxisDatum, index:number, data:AxisDatum[])=>StyleProps` | 网格线样式，见 [DisplayObjectStyleProps](https://g.antv.antgroup.com/api/basic/display-object) | `-`        |
