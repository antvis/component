---
title: Scroll
order: 4
---

# Scrollbar

> The scroll bar is used to control the visible area of the scroll area.

## Usage

```ts
import { Scrollbar } from '@antv/gui';
```

## Options

| **属性**   | **描述**                                           | **类型**                                            | **默认值** |
| ---------- | -------------------------------------------------- | --------------------------------------------------- | ---------- |
| orientation     | The orientation of scrollbar                       | <code>horizontal &#124; vertical </code>            | `vertical` |
| width      | Width                                              | <code>number</code>                                 | `[]`       |
| height     | Height                                             | <code>number<code>                                  | `[]`       |
| value      | 值                                                 | <code>number<code> ∈ [0, 1]                         | `0`        |
| min        | The lower limit of values of the scrollable range. | <code>number<code> ∈ [0, 1)                         | `1`        |
| max        | The upper limit of values of the scrollable range. | <code>number<code> ∈ (min, 1]                       | `0`        |
| trackStyle | The style of scrollbar track                       | <code>{default: RectProps, active: RectProps}<code> | `[]`       |
| isRound    | Whether the scrollbar thumb has round edge         | <code>boolean</code>                                | `true`     |
| thumbLen   | The length of scrollbar thumb                      | <code>boolean</code>                                | `[]`       |
| thumbStyle | The style of scrollbar thumb                       | <code>{default: RectProps, active: RectProps}<code> | `[]`       |

## Events

| **事件**     | **触发条件**                                                                            | **参数**                                           |
| ------------ | --------------------------------------------------------------------------------------- | -------------------------------------------------- |
| scroll       | Occurs when the scroll box has been moved by either a mouse or keyboard action          | <code>value: `number`</code>                       |
| valuechange | Occurs when the Value property is changed, either by a Scroll event or programmatically | <code>{oldValue: `number`, value: `number`}</code> |
