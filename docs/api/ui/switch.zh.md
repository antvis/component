---
title: Switch
order: 8
---

# 开关选择器

> 开关选择器，适用于需要表示两种状态（如开启和关闭）之间的切换时。

## 引入

```ts
import { Switch } from '@antv/gui';
```

## 开关配置项

| **属性**          | **描述**         | **类型**                                        | **默认值** |
| ----------------- | ---------------- | ----------------------------------------------- | ---------- |
| x                 | 起点 x 坐标位置  | <code>number</code>                             | `-`        |
| y                 | 起点 y 坐标位置  | <code>number</code>                             | `-`        |
| size              | 开关大小         | <code>number</code>                             | `22`       |
| spacing           | 开关背景间距     | <code>number</code>                             | `2`        |
| textSpacing       | 文本背景左右间距 | <code>number</code>                             | `8`        |
| style             | 自定义按钮样式   | <code>StyleAttr<code>                           | `-`        |
| disabled          | 不可选           | <code>boolean</code>                            | `false`    |
| checked           | 指定当前是否选中 | <code>boolean<code>                             | `-`        |
| defaultChecked    | 初始是否选中     | <code>boolean<code>                             | `true`     |
| checkedChildren   | 选中时的内容     | <code>TagCfg<code>                              | `-`        |
| unCheckedChildren | 未选中时的内容   | <code>TagCfg<code>                              | `-`        |
| onChange          | 变化时回调函数   | <code>function(checked: boolean)<code>          | `-`        |
| onClick           | 点击时回调函数   | <code>function(e:Event, checked: boolean)<code> | `-`        |