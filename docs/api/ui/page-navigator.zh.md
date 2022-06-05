---
title: Page Navigator · 分页器
order: 7
---

> 分页器用于将一页画布拆分成多页

## 引入

```ts
import { PageNavigator } from '@antv/gui';
```

## 配置项

| **属性**     | **描述**                                                                               | **类型**                                                                                                                                   | **默认值**   |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| view         | 待分页对象                                                                             | <code>DisplayObject</code>                                                                                                                 | ``           |
| width        | 画布宽度(若不指定，则自动进行测算)                                                     | <code>number</code>                                                                                                                        | ``           |
| height       | 画布宽度                                                                               | <code>number<code>                                                                                                                         | ``           |
| pageWidth    | 页宽                                                                                   | <code>number<code>                                                                                                                         | ``           |
| pageHeight   | 页高                                                                                   | <code>number<code>                                                                                                                         | ``           |
| effect       | 翻页动画效果                                                                           | <code>string<code>                                                                                                                         | ``           |
| duration     | 翻页耗时                                                                               | <code>'horizontal' \| 'vertical'<code>                                                                                                     | `horizontal` |
| orient       | 默认分页方向                                                                           | <code>number</code>                                                                                                                        | ``           |
| initPageNum  | 初始化页码                                                                             | <code>number</code>                                                                                                                        | ``           |
| pageLimit    | 总页数限制，默认可根据画布宽高、页宽高与分页方向推断。指定回调方法时，需要手动配置该项 | <code>number<code>                                                                                                                         | ``           |
| loop         | 循环翻页                                                                               | <code>boolean<code>                                                                                                                        | `false`      |
| pageCallback | 自定义页位置回调方法                                                                   | <code>(pageNum: number)=>{x: number, y: number}<code>                                                                                      | ``           |
| button       | 按钮                                                                                   | <code>{prev:ButtonCfg, next:ButtonCfg, spacing: number, position: 'top' \| 'bottom' \| 'left' \| 'right'\|'horizontal'\|'vertical'}</code> | ``           |
| pagination   | 页码                                                                                   | <code>false \| {type:'', style: MixAttrs, separator:string,spacing: number, position: 'top' \| 'bottom' \| 'left' \| 'right'}<code>        | ``           |

## API

| **方法**                       | **说明**           | **参数**                                              |
| ------------------------------ | ------------------ | ----------------------------------------------------- |
| goTo(to: number, from: number) | 从某页跳转到另一页 | <code>to: 目标页，from: 起始页（默认为当前页）</code> |
| prev()                         | 向前翻页           | <code></code>                                         |
| next()                         | 向后翻页           | <code></code>                                         |
