| **Property** | **Description**          | **Type**                                                 | **Default**                                              |
| ------------ | ------------------------ | -------------------------------------------------------- | -------------------------------------------------------- |
| type         | type of sparkline        | <code>line &#124; bar </code>                            | `default`                                                |
| width        | width                    | <code>number</code>                                      | `200`                                                    |
| height       | height                   | <code>number</code>                                       | `20`                                                     |
| data         | data of sparkline        | <code>number[] &#124; number[][]</code>                   | `[]`                                                     |
| isStack      | whether to stack         | <code>boolean</code>                                      | `false`                                                  |
| color        | color of visual elements | <code>color &#124; color[] &#124; (index) => color</code> | `'#83daad', '#edbf45', '#d2cef9', '#e290b3', '#6f63f4']` |
| smooth       | use smooth curves        | <code>boolean</code>                                      | `true`                                                   |
| lineStyle    | custom line styles       | <code>ShapeAttr</code>                                    | `[]`                                                     |
| areaStyle    | custom area styles       | <code>ShapeAttr</code>                                    | `[]`                                                     |
| isGroup      | whether to group series  | <code>boolean</code>                                      | `false`                                                  |
| columnStyle  | custom column styles     | ShapeAttrs                                               | `[]`                                                     |
