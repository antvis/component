下拉选择器

## 引入

```ts
import { Select } from '@antv/gui';
```

## 配置项

### 基本配置

| **属性**             | **类型**                                                              | **描述**                                                                   | **默认值** |
| -------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------- |
| x                    | number                                                                | x 轴坐标                                                                   | `0`        |
| y                    | number                                                                | y 轴坐标                                                                   | `0`        |
| width                | number                                                                | 宽度                                                                       | `140`      |
| height               | number                                                                | 高度                                                                       | `32`       |
| bordered             | boolean                                                               | 是否有边框                                                                 | `true`     |
| defaultValue         | string                                                                | 默认值                                                                     | `-`        |
| open                 | boolean                                                               | 是否展开下拉框                                                             | `false`    |
| options              | Option[]                                                              | 下拉选项                                                                   | `[]`       |
| onSelect             | (value: number\| string, option: Option, item: DisplayObject) => void | 选中选项时触发                                                             | `-`        |
| `select{Style}`      | `RectStyleProps`                                                      | 选框样式，见[RectStyleProps](https://g.antv.antgroup.com/api/basic/rect)   | `-`        |
| `placeholder{Style}` | `TextStyleProps`                                                      | 占位符样式，见[TextStyleProps](https://g.antv.antgroup.com/api/basic/text) | `-`        |
| `dropdown{Style}`    | `RectStyleProps`                                                      | 下拉框样式，见[RectStyleProps](https://g.antv.antgroup.com/api/basic/rect) | `-`        |
| `option{Style}`      | `OptionStyleProps`                                                    | 选项样式                                                                   | `-`        |

```ts
type Option = {
  value: string | number;
  label: string;
};
```

### 选项样式

| **属性**            | **类型**         | **描述**                                                                 | **默认值** |
| ------------------- | ---------------- | ------------------------------------------------------------------------ | ---------- |
| width               | number           | 宽度                                                                     | `-`        |
| height              | number           | 高度                                                                     | `-`        |
| padding             | number           | 内边距                                                                   | `[8, 12]`  |
| `background{Style}` | `RectStyleProps` | 背景样式，见[RectStyleProps](https://g.antv.antgroup.com/api/basic/rect) | `-`        |
| `label{Style}`      | `TextStyleProps` | 标签样式，见[TextStyleProps](https://g.antv.antgroup.com/api/basic/text) | `-`        |

## API

| **方法** | **说明**     | **参数** |
| -------- | ------------ | -------- |
| setValue | 设置选中的值 | `value`  |
| getValue | 获取选中的值 | `-`      |

## 事件

| **事件** | **触发条件**             | **参数**                |
| -------- | ------------------------ | ----------------------- |
| change   | 当选中的值发生变化时触发 | `value: string\|number` |
