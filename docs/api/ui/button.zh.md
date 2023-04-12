> 按钮用于开始一个即时操作。

## 引入

```js
import { Button } from '@antv/gui';
```

## 配置项

| **属性名**      | **类型**                        | **描述**                                                                                    | **默认值** |
| --------------- | ------------------------------- | ------------------------------------------------------------------------------------------- | ---------- |
| type            | 按钮类型                        | `primary`&#124; `dashed`&#124; `link`&#124; `text`&#124; `default`                                          | `default`  |
| size            | 按钮尺寸                        | `small`&#124; `medium`&#124; `large`                                                                | `middle`   |
| shape           | `circle`&#124;`round`               | 按钮形状                                                                                    | `round`    |
| state           | `disabled`&#124;`active`&#124;`default` | 按钮状态                                                                                    | `default`  |
| ellipsis        | `boolean`                       | 文本超长时是否缩略                                                                          | `false`    |
| padding         | `number`                        | 按钮内边距                                                                                  | `10`       |
| text            | `string`                        | 按钮文本                                                                                    | `-`        |
| markerSymbol    | `Symbol`                        | 按钮图标                                                                                    | `-`        |
| markerSize      | `number`                        | 图标大小                                                                                    | `10`       |
| markerSpacing   | `number`                        | 图标与文本间距                                                                              | `10`       |
| onClick         | `ClickEvent`                    | 点击事件                                                                                    | `-`        |
| `button{Style}` | `StyleProps`                    | 按钮样式,见 [DisplayObjectStyleProps](https://g.antv.antgroup.com/api/basic/display-object) | `-`        |
| `text{Style}`   | `TextStyle`                     | 文本样式，见 [TextStyleProps](https://g.antv.antgroup.com/api/basic/text)                   | `-`        |
