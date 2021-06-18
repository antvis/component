---
title: Button
order: 3
---

# 按钮

> 按钮用于开始一个即时操作。

## 引入

```ts
import { Button } from '@antv/gui';
```

## 配置项

| **属性**    | **描述**             | **类型**                                                                  | **默认值** |
| ----------- | -------------------- | ------------------------------------------------------------------------- | ---------- |
| type        | 按钮类型             | <code>primary &#124; dashed &#124; link &#124; text &#124; default</code> | `default`  |
| size        | 按钮大小             | <code>small &#124; medium &#124; large</code>                             | `middle`   |
| disabled    | 按钮失效             | <code>boolean<code>                                                       | `false`      |
| ellipsis    | 缩略超长文本         | <code>boolean<code>                                                       | `false`      |
| padding     | 文本与按钮边缘的间距 | <code>number<code>                                                        | `10`         |
| text        | 文本内容             | <code>string<code>                                                        | `[]`       |
| onClick     | 点击按钮的回调函数   | <code>(event) => void<code>                                               | `[]`          |
| textStyle   | 自定义文本样式       | <code>StyleAttr<code>                                                     | `[]`          |
| buttonStyle | 自定义按钮样式       | <code>StyleAttr<code>                                                     | `[]`          |
| hoverStyle  | 自定义 hover 样式    | <code>{ textStyle: StyleAttr; buttonStyle: StyleAttr }<code>            | `[]`          |
