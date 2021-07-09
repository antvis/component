### 基本属性

| **属性名**    | **类型**            | **描述**                                 |
| ------------- | ------------------- | ---------------------------------------- |
| x             | <code>number</code> | x 坐标                                   |
| y             | <code>number</code> | y 坐标                                   |
| r             | <code>number</code> | 半径                                     |
| width         | <code>number</code> | 宽度                                     |
| height        | <code>number</code> | 高度                                     |
| stroke        | <code>color</code>  | 描边颜色，可以是 rgba 值、颜色名（下同） |
| strokeOpacity | <code>number</code> | 描边透明度                               |
| fill          | <code>color</code>  | 填充颜色                                 |
| fillOpacity   | <code>number</code> | 填充透明度                               |
| Opacity       | <code>number</code> | 整体透明度                               |
| shadowBlur    | <code>number</code> | 模糊效果程度                             |
| shadowColor   | <code>color</code>  | 阴影颜色                                 |
| shadowOffsetX | <code>number</code> | 阴影水平偏移距离                         |
| shadowOffsetY | <code>number</code> | 阴影垂直偏移距离                         |

### 线条属性

| **属性名** | **类型**                                   | **描述**                                                                                                                                |
| ---------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| lineWidth  | <code>number</code>                        | 线条或图形边框宽度                                                                                                                      |
| lineCap    | <code>'butt' \| 'round' \| 'square'</code> | 线段末端样式                                                                                                                            |
| lineJoin   | <code>'bevel' \| 'round' \| 'miter'</code> | 设置 2 个长度不为 0 的相连部分（线段，圆弧，曲线）如何连接在一起的属性（长度为 0 的变形部分，其指定的末端和控制点在同一位置，会被忽略） |
| lineDash   | <code>number[] \| null</code>              | 线条或图形边框的虚线样式                                                                                                                |

### 文本属性

| **属性名**   | **类型**                                                                                 | **描述**                            |
| ------------ | ---------------------------------------------------------------------------------------- | ----------------------------------- |
| textAlign    | <code>'start' \| 'center' \| 'end' \| 'left' \| 'right'</code>                           | 设置文本内容的当前对齐方式          |
| textBaseline | <code>'top' \| 'hanging' \| 'middle' \| 'alphabetic' \| 'ideographic' \| 'bottom'</code> | 设置在绘制文本时使用的当前文本基线, |
| fontStyle    | <code>'normal' \| 'italic' \| 'oblique'</code>                                           | 设置字体样式                        |
| fontSize     | <code>number</code>                                                                      | 设置字号                            |
| fontFamily   | <code>string</code>                                                                      | 设置字体系列                        |
| fontWeight   | <code>'normal' \| 'bold' \| 'bolder' \| 'lighter' \| number</code>                       | 设置字体的粗细                      |
| fontVariant  | <code>'normal' \| 'small-caps' \| string</code>                                          | 设置字体变体                        |
| lineHeight   | <code>number</code>                                                                      | 设置行高                            |
