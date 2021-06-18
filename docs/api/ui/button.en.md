---

title: Button
order: 3

---

# Button

> 按钮用于开始一个即时操作。

## Usage

```ts
import { Button } from '@antv/gui';
```

## Options

| **Property** | **Description**                           | **Type**                                                                  | **Default** |
| ------------ | ----------------------------------------- | ------------------------------------------------------------------------- | ----------- |
| type         | Type of button                            | <code>primary &#124; dashed &#124; link &#124; text &#124; default</code> | `default`   |
| size         | Size of button                            | <code>small &#124; medium &#124; large</code>                             | `middle`    |
| disabled     | Disabled state of button                  | <code>boolean<code>                                                       | `false`     |
| ellipsis     | Omit excessively long text                | <code>boolean<code>                                                       | `false`     |
| padding      | The spacing between text and button edges | <code>number<code>                                                        | `10`        |
| text         | Content of button                         | <code>string<code>                                                        | `[]`        |
| onClick      | The handler to handle click event         | <code>(event) => void<code>                                               | `[]`        |
| textStyle    | custom text styles                        | <code>StyleAttr<code>                                                     | `[]`        |
| buttonStyle  | custom button styles                      | <code>StyleAttr<code>                                                     | `[]`        |
| hoverStyle   | custom hover styles                       | <code>{ textStyle: StyleAttr; buttonStyle: StyleAttr }<code>              | `[]`        |
