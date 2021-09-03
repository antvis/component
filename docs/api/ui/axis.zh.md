--
title: Axis
order: 6
--

# 坐标轴

> 坐标轴指二维空间中统计图表中的轴，它用来定义坐标系中数据在方向和值的映射关系的图表组件

## 引入

```
import { Linear, Arc, Helix } from '@antv/gui';
```

### 基本配置

| **属性名**     | **类型**                             | **描述**                                              | **默认值** |
| -------------- | ------------------------------------ | ----------------------------------------------------- | ---------- |
| title          | <code>false \| AxisTitleCfg</code>   | 标题                                                  | ``         |
| line           | <code>false \| AxisLineCfg</code>    | 轴线                                                  | ``         |
| ticks          | <code>TickDatum[]</code>             | 刻度数据                                              | ``         |
| ticksThreshold | <code>false \| number</code>         | 刻度数量阈值                                          | ``         |
| tickLine       | <code>false \| AxisTickCfg</code>    | 刻度线配置                                            | ``         |
| label          | <code>false \| AxisLabelCfg</code>   | 标签文本配置                                          | ``         |
| subTickLine    | <code>false \| AxisSubTickCfg</code> | 子刻度线配置                                          | ``         |
| verticalFactor | <code>-1 \| 1</code>                 | 刻度与标签在轴线向量的位置，-1: 向量右侧, 1: 向量左侧 | ``         |

### 直线坐标轴

| **属性名** | **类型**                      | **描述**     | **默认值** |
| ---------- | ----------------------------- | ------------ | ---------- |
| startPos   | <code>[number, number]</code> | 轴线起点坐标 | ``         |
| endPos     | <code>[number, number]</code> | 轴线终点坐标 | ``         |

### 圆弧坐标轴

| **属性名** | **类型**                      | **描述**               | **默认值** |
| ---------- | ----------------------------- | ---------------------- | ---------- |
| startAngle | <code>number</code>           | 起始角，弧度、角度均可 | ``         |
| endAngle   | <code>number</code>           | 结束角                 | ``         |
| radius     | <code>number</code>           | 半径                   | ``         |
| center     | <code>[number, number]</code> | 圆心位置               | ``         |

### 螺旋坐标轴

| **属性名** | **类型**            | **描述**               | **默认值** |
| ---------- | ------------------- | ---------------------- | ---------- |
| a          | <code>number</code> | 参数 a                 | ``         |
| b          | <code>number</code> | 参数 b                 | ``         |
| startAngle | <code>number</code> | 起始角                 | ``         |
| endAngle   | <code>number</code> | 结束角                 | ``         |
| precision  | <code>number</code> | 精度，影响螺旋线的绘制 | `0.1`      |

### 标题 AxisTitleCfg

| **属性名** | **类型**                                  | **描述** | **默认值** |
| ---------- | ----------------------------------------- | -------- | ---------- |
| content    | <code>string</code>                       | 内容     | ``         |
| style      | <code>TextProps</code>                    | 样式     | ``         |
| position   | <code>'start' \| 'center' \| 'end'</code> | 位置     | `'start'`  |
| offset     | <code>[number, number]</code>             | 偏移量   | `[0,0]`    |
| rotate     | <code>number</code>                       | 旋转角度 | `0`        |

### 轴线 AxisLineCfg

| **属性名** | **类型**                                        | **描述**     | **默认值** |
| ---------- | ----------------------------------------------- | ------------ | ---------- |
| style      | <code>LineProps</code>                          | 线条样式     | ``         |
| arrow      | <code>{start: MarkerCfg, end: MarkerCfg}</code> | 轴线两端箭头 | ``         |

### 刻度线 AxisTickLineCfg

| **属性名** | **类型**              | **描述**                                                | **默认值** |
| ---------- | --------------------- | ------------------------------------------------------- | ---------- |
| length     | <code>number</code>   | 长度                                                    | `5`        |
| style      | <code>MixAttrs</code> | 带状态的线条样式                                        | ``         |
| offset     | <code>number</code>   | 在轴线方向的偏移量                                      | `0`        |
| appendTick | <code>boolean</code>  | 末尾追加 tick，一般用于 label alignTick 为 false 的情况 | `false`    |

### 标签 AxisLabelCfg

| **属性名**       | **类型**                                                    | **描述**                                                           | **默认值**     |
| ---------------- | ----------------------------------------------------------- | ------------------------------------------------------------------ | -------------- |
| type             | <code>'text' \| 'number' \| 'time'</code>                   | 标签文本类型，会影响缩略策略                                       | `text`         |
| style            | <code>MixAttrs</code>                                       | 带状态的文本样式                                                   | ``             |
| alignTick        | <code>boolean</code>                                        | label 是否与 Tick 对齐                                             | ``             |
| align            | <code>'normal' \| 'tangential' \| 'radial'</code>           | 标签文本与轴线的对齐方式，normal-水平，tangential-切向 radial-径向 | `'normal'`     |
| formatter        | <code>(tick: TickDatum) => string</code>                    | 标签格式化                                                         | ``             |
| offset           | <code>[number, number]</code>                               | 偏移量                                                             | ``             |
| overlapOrder     | <code>'autoRotate' \| 'autoEllipsis' \| 'autoHide'[]</code> | 处理 label 重叠的优先级                                            | ``             |
| margin           | <code>[number, number, number, number] </code>              | 标签外边距，在进行自动避免重叠时的额外间隔                         | `[0, 0, 0, 0]` |
| autoRotate       | <code>boolean</code>                                        | 旋转度数，默认垂直或平行于刻度线                                   | `true`         |
| rotateRange      | <code>[number, number]</code>                               | 自动旋转的范围                                                     | `[0, 90]`      |
| rotate           | <code>number</code>                                         | 范围[-90, 90] 手动指定旋转角度，配置后自动旋转失效                 | ``             |
| autoHide         | <code>boolean</code>                                        | label 过多时隐藏部分                                               | `true`         |
| autoHideTickLine | <code>boolean</code>                                        | 隐藏 label 时，同时隐藏掉其对应的 tickLine                         | `true`         |
| minLabel         | <code>number</code>                                         | 最小 label 数量                                                    | ``             |
| autoEllipsis     | <code>boolean</code>                                        | label 过长时缩略                                                   | `true`         |
| ellipsisStep     | <code>number \| string</code>                               | 缩略步长，传入 string 时将计算其长度（下同）                       | ``             |
| minLength        | <code>number \| string</code>                               | label 的最小长度                                                   | ``             |
| maxLength        | <code>number \| string</code>                               | label 的最大长度，无穷大表示不限制长度                             | `Infinity`     |

### 子刻度线 AxisSubTickLineCfg

| **属性名** | **类型**              | **描述**               | **默认值** |
| ---------- | --------------------- | ---------------------- | ---------- |
| length     | <code>number</code>   | 长度                   | `2`        |
| count      | <code>number</code>   | 两个刻度之间的子刻度数 | `4`        |
| style      | <code>MixAttrs</code> | 带状态的线条样式       | ``         |
| offset     | <code>number</code>   | 在轴线方向的偏移量     | `0`        |

### 数据 TickDatum

| **属性名** | **类型**                         | **描述**                        | **默认值**  |
| ---------- | -------------------------------- | ------------------------------- | ----------- |
| value      | <code>number</code>              | 范围 [0, 1], 表示在轴线上的位置 | ``          |
| text       | <code>string</code>              | 显示的标签内容                  | `value`     |
| state      | <code>'default'\|'active'</code> | 状态                            | `'default'` |
| id         | <code>string</code>              | id                              | `index`     |
