---
title: Switch
order: 8
---

# Switch

> Switch selector for when switching between two states, such as on and off, is required.

## Usage

```ts
import { Switch } from '@antv/gui';
```

## SwitchOptions

| **Property**      | **Description**                            | **Type**                                        | **Default** |
| ----------------- | ------------------------------------------ | ----------------------------------------------- | ----------- |
| x                 | The x coordinate of the starting point     | <code>number</code>                             | `-`         |
| y                 | The y coordinate of the starting point     | <code>number</code>                             | `-`         |
| size              | Switch the size                            | <code>number</code>                             | `22`        |
| spacing           | Switch background spacing                  | <code>number</code>                             | `2`         |
| textSpacing       | Left-right spacing of text background      | <code>number</code>                             | `8`         |
| style             | Custom button styles                       | <code>StyleAttr<code>                           | `-`         |
| disabled          | Do not choose                              | <code>boolean</code>                            | `false`     |
| checked           | Specifies whether it is currently selected | <code>boolean<code>                             | `-`         |
| defaultChecked    | Initial check or not                       | <code>boolean<code>                             | `true`      |
| checkedChildren   | The content when selected                  | <code>TagCfg<code>                              | `-`         |
| unCheckedChildren | The content when not selected              | <code>TagCfg<code>                              | `-`         |
| onChange          | Callback function when change              | <code>function(checked: boolean)<code>          | `-`         |
| onClick           | Callback function when clicked             | <code>function(e:Event, checked: boolean)<code> | `-`         |