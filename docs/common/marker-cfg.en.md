### Position

#### x

<description>**optional** _number_</description>

Marker 标记，在 canvas 画布中 x 方向的的相对位置, 默认为 0.

#### y

<description>**optional** _number_</description>

Marker 标记，在 canvas 画布中 y 方向的的相对位置, 默认为 0.

### Attributes

#### size

<description>**optional** _number_</description>

Marker 标记的大小，默认为 16.

#### symbol

<description>**optional** _string | FunctionalSymbol_</description>

Marker 标记的类型，内置的 symbol 有: `circle`(圆形), `square`(正方形), `diamond`(菱形), `triangle`(三角形), `triangleDown`(下三角形), 折线相关的 `line`, `dash`, `dot`, `smooth`, `vh`, `hvh`, `vhv`.

```ts
type FunctionalSymbol = (x: number, y: number, r: number) => PathCommand;
```

Example:

```ts
/**
 * 实现一个圆形 symbol marker
 */
function circle(x: number, y: number, r: number) {
  return [
    ['M', x - r, y],
    ['A', r, r, 0, 1, 0, x + r, y],
    ['A', r, r, 0, 1, 0, x - r, y],
  ];
}

/**
 * 实现一个正方形 symbol marker
 */
function square(x: number, y: number, r: number) {
  return [['M', x - r, y - r], ['L', x + r, y - r], ['L', x + r, y + r], ['L', x - r, y + r], ['Z']];
}
```
