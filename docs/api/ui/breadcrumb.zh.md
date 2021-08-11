---
title: BreadCrumb
order: 7
---

# 面包屑

> 显示当前页面在系统层级结构中的位置，并能向上返回。

## 引入

```ts
import { BreadCrumb } from '@antv/gui';
```

## 配置项

| **属性**  | **描述**        | **类型**                                        | **默认值**     |
| --------- | --------------- | ----------------------------------------------- | -------------- |
| x         | 起点 x 坐标位置 | <code>number</code>                             | `-`            |
| y         | 起点 y 坐标位置 | <code>number</code>                             | `-`            |
| width     | 容器宽度        | <code>number<code>                              | `-`            |
| height    | 容器高度        | <code>number<code>                              | `-`            |
| padding   | 容器内边距      | <code>number \| number[]<code>                  | `[8, 8, 8, 8]` |
| items     | 面包屑 items    | <code>[BreadCrumnItems](#breadcrumnitems)<code> | `-`            |
| separator | 面包屑分隔符    | <code>[separator](#separator)<code>             | `-`            |
| textStyle | 自定义文本样式  | <code>StyleAttr<code>                           | `-`            |
| onClick   | 点击事件        | <code>(event) => void<code>                     | `-`            |

### BreadCrumnItems

| **属性** | **描述**   | **类型**            | **默认值** |
| -------- | ---------- | ------------------- | ---------- |
| name     | 展示的文案 | <code>string</code> | `-`        |
| id       | id         | <code>string</code> | `-`        |

### separator

| **属性** | **描述**       | **类型**                     | **默认值** |
| -------- | -------------- | ---------------------------- | ---------- |
| text     | 分隔符内容     | <code>string \| Group</code> | `/`        |
| style    | 分隔符样式     | <code>TextProps</code>       | `-`        |
| spacing  | 分隔符两边间距 | <code>number</code>          | `-`        |
